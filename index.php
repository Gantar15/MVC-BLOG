<?php

use application\core\Router;
use application\lib\Db;

spl_autoload_register(function($class){
    $src = str_replace('\\', '/', $class) . '.php';
    if(file_exists($src)){
        include_once $src;
    }
});

session_start();

$s = new Router();

$s->run();