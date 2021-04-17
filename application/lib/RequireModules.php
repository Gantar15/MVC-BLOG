<?php


namespace application\lib;

class RequireModules
{
    private $basePath;

    public function __construct($modulesDirPath)
    {
        $this->basePath = $modulesDirPath;
    }

    public function requireModule($name, $variables){
        extract($variables);
        $modulePath = $this->basePath . $name . 'module.php';
        $content = "";
        if(file_exists($modulePath)) {
            ob_start();
            require $modulePath;
            $content = ob_get_clean();
            return $content;
        }
        else{
            throw new \Error('Указанный модуль не существует');
        }
    }
}