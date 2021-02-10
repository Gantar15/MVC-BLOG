<?php

namespace application\core;

class View {

	public $path;
	public $route;
	public $layout = 'default';

	public function __construct($route) {
        $this->route = $route;
        $this->path = $route['controller'] . '/' . $route['action'];
	}

	public function render($title, $vars=[]){
	    extract($vars);
	    $path = './application/views/' . $this->path . '.php';
	    $layout = './application/views/layouts/' . $this->layout . '.php';
	    if(file_exists($path) && file_exists($layout)) {
            ob_start();
            require $path;
            $content = ob_get_clean();
            require $layout;
        } else{
	        self::errorCode(404);
        }
    }

    public static function errorCode($code){
        http_response_code($code);
        $path = './application/views/errors/' . $code . '.php';
        if(file_exists($path)){
            require $path;
        }
        die();
    }

    public function redirect($url)
    {
       header("Location: /$url");
       exit();
    }

    public function response($data){
	    exit(json_encode($data));
    }

    public function message($status, $message, $refresh = false, $type){
        exit(json_encode(['status' => $status, 'message' => $message, 'refresh' => $refresh, 'type' => $type]));
    }

    public function location($url){
        exit(json_encode(['url'=> '/'.$url]));
    }

    //Меняет форму слов в зависимости от переданной величины (напримет, 1 просмотр, 12 просмотров, 33 просмотра)
    public function valuesFormatter($value, $form1, $form2, $form3){
        $charsArr = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY);
        $valueLastNumber = array_pop($charsArr);

        if($valueLastNumber == 0 || $valueLastNumber >= 5 && $valueLastNumber <= 9 || $value >= 11 && $value <= 19){
            return $form1;
        }
        elseif($valueLastNumber == 1){
            return $form2;
        }
        elseif($valueLastNumber >= 2 && $valueLastNumber <= 4){
            return $form3;
        }
    }

}