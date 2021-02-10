<?php

namespace application\core;

use application\core\View;

abstract class Controller {

	public $route;
	public $view;
    public $model;
	public $acl;

	public function __construct($route) {
        $this->route = $route;
        if($this->checkAcl()) {
            $this->view = new View($route);
            $this->model = $this->loadModel($route['controller']);
        } else{
            View::errorCode(403);
        }
	}

	public function loadModel($name){
	    $path = 'application\models\\'.ucfirst($name);
	    if(class_exists($path)){
	        return new $path();
        }
    }

    public function checkAcl(){
	    $filename = 'application/acl/'.$this->route['controller'].'.php';
	    if(file_exists($filename)){
            $this->acl = require $filename;
            if($this->isAcl('all')){
                return true;
            }
            else if( (isset($_SESSION['authorize']) || isset($_COOKIE['authorize'])) && $this->isAcl('authorize')){
                return true;
            }
            else if( (!isset($_SESSION['authorize']) && !isset($_COOKIE['authorize'])) && $this->isAcl('guest')){
                return true;
            }
            else if(( isset($_SESSION['admin']) || isset($_COOKIE['admin']) ) && $this->isAcl('admin')){
                return true;
            }
            return false;
        } else{
	        View::errorCode(404);
        }
    }

    public function isAcl($key){
        return in_array($this->route['action'], $this->acl[$key]);
    }
}