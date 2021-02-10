<?php

namespace application\core;

use application\core\View;

error_reporting(-1);

class Router{

    protected $routes = [];
    protected $params = [];

    public function __construct()
    {
        $arr = require 'application/config/routes.php';
        foreach ($arr as $name => $val){
            $this->add($name, $val);
        }
    }

    public function add($route, $params){
        $route = preg_replace('/{([a-z]+):([^\}]+)}/', '(?P<\1>\2)', $route);
        $route = '#^'.$route.'$#';
        $this->routes[$route] = $params;
    }

    public function match(){
        $url = trim($_SERVER['REQUEST_URI'], '/');
        foreach ($this->routes as $route => $params){
            if(preg_match($route, $url, $matches)){
                $this->params = $params;
                foreach ($matches as $propName => $val) {
                    if(is_string($propName)) {
                        if(is_numeric($val)) {
                            $this->params[$propName] = (int)$val;
                        }
                        $this->params[$propName] = $val;
                    }
                }
                return true;
            }
        }
        return false;
    }

    public function run(){
        if($this->match()){
            $path = 'application\controllers\\' . ucfirst($this->params['controller']) . 'Controller';
            if(class_exists($path)) {
                $action = $this->params['action'] . 'Action';
                if(method_exists($path, $action)){
                    $controller = new $path($this->params);
                    $controller->$action();
                } else{
                    View::errorCode(404);
                }
            } else{
                View::errorCode(404);
            }
        } else{
            View::errorCode(404);
        }
    }

}