<?php

namespace application\lib;

use PDO;

class Db
{
   protected $db;

   public function __construct()
   {
       $config =  require 'application/config/db.php';
       $this->db = new PDO("mysql:host={$config['host']};dbname={$config['name']};charset={$config['charset']}", $config['user'], $config['password']);
   }

    public function query($request, $params = [])
    {
        $query = $this->db->prepare($request);
        if (!empty($params)) {
            foreach ($params as $key => $param) {
                if (is_int($param)) {
                    $query->bindValue(':' . $key, $param, PDO::PARAM_INT);
                } else {
                    $query->bindValue(':' . $key, $param, PDO::PARAM_STR);
                }
            }
        }

        if(!$query->execute()){
            return false;
        }
        return $query;
    }

    public function row($request, $params = []){
        $query = $this->query($request, $params);
        if(!$query){
            return false;
        }
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function column($request, $params = []){
        $query = $this->query($request, $params);
        if(!$query){
            return false;
        }
        return $query->fetchColumn();
    }

    public function lastInsertId(){
       return $this->db->lastInsertId();
    }
}