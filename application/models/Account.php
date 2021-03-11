<?php

namespace application\models;

use application\core\Model;

class Account extends Model {

    public $error;

    //Регистрация ************************

    public function checkLoginExists($login){
        $params = [
            'login' => $login
        ];
        if($this->db->column('SELECT id FROM users WHERE login = :login', $params)){
            return true;
        }
        return false;
    }
    public function registerLoginValidate($login){
        if(strlen($login) < 3 || strlen($login) > 20){
            $this->error[] = ['message' => 'Длина логина должна быть в пределах 3-20 символов', 'field_name' => 'login'];
        }
        else{
            $df = preg_quote('-');
            if(!preg_match("#^[a-z\d]*[$df/_]?[a-z\d]*$#i", $login)) {
                $this->error[] = ['message' => 'Логин может содердать только цифры(0-9) и латинские буквы(a-z, A-Z), а так же один из символов - или _', 'field_name' => 'login'];
            }
        }
    }

    public function checkNameExists($name){
        $params = [
            'name' => $name
        ];
        if($this->db->column('SELECT id FROM users WHERE name = :name', $params)){
            return true;
        }
        return false;
    }
    public function registerNameValidate($name){
        if(mb_strlen($name, 'utf-8') < 2 || mb_strlen($name, 'utf-8') > 23 ){
            $this->error[] = ['message' => 'Длина имени должна быть длинной от 2 до 23 символов', 'field_name' => 'name'];
        }
        elseif(!preg_match('/^[a-zа-я ]*$/iu', $name)){
            $this->error[] = ['message' => 'Имя должно состоять только из букв', 'field_name' => 'name'];
        }
        elseif(mb_strlen(str_replace(' ', '', $name), 'utf-8') < 2){
            $this->error[] = ['message' => 'Имя должно содержать хотя бы 2 буквы', 'field_name' => 'name'];
        }
    }

    public function checkEmailExists($email){
        $params = [
            'email' => $email
        ];
        if($this->db->column('SELECT id FROM users WHERE email = :email', $params)){
            return true;
        }
        return false;
    }
    public function registerEmailValidate($email){
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            $this->error[] = ['message' => 'Некорректный email адресс', 'field_name' => 'email'];
        }
    }

    public function passwordValidate($password){
        if(strlen($password) < 6 || strlen($password) > 20){
            $this->error[] = ['message' => 'Длина пороля должна быть в пределах 6-20 символов', 'field_name' => 'password'];
        }
        elseif(!preg_match('/^(?=.*[a-z])(?=.*\d)[a-z\d!@#$%^&*]*$/i', $password)){
            $this->error[] = ['message' => 'Пороль обязан содержать цифры(0-9) и латинские буквы(a-z, A-Z), а так же может содердать символы !@#$%^&*', 'field_name' => 'password'];
        }
    }

    //Создаем уникальный ключ для подтверждения почты
    public function createToken(){
        return substr(str_shuffle(str_repeat('abcdefghijklmnopqrstuvwxyz1234567890', 30)), 0, 30);
    }

    public function register($post){
        $token = $this->createToken();
        $params = [
            'name' => $post['name'],
            'login' => $post['login'],
            'email' => $post['email'],
            'password' => password_hash($post['password'], PASSWORD_BCRYPT),
            'date_of_registration' => date('y.m.d', time()),
            'token' => $token,
            'status' => 0
        ];
        $this->db->query('INSERT INTO users (name, login, email, password, date_of_registration, token, status) VALUES (:name, :login, :email, :password, :date_of_registration, :token, :status)', $params);
        mail($post['email'], 'Регистрация на MVC BLOG', 'Подтвердить регистрацию можно по ссылке: http://mvcblog/account/confirm/'.$token);
        return $token;
    }

    public function uploadUserAvatar($filePath, $userId){
        try {
            $img = new \Imagick($filePath);
            $img->cropThumbnailImage(300, 300);
            $img->setImageCompressionQuality(80);
            $img->setImageFormat ("png");
            $response = file_put_contents('public/users_icons/'.$userId.'.png', $img);
        } catch (\Exception $err){
            $this->error = 'Не удалось установить аватар. Попробуйте другое фото';
            return false;
        }
        return $response;
    }

    public function tokenExists($token){
        if(!$token){
            return false;
        }
        $params = [
            'token' => $token
        ];
        return $this->db->column('SELECT id FROM users WHERE token = :token', $params);
    }

    public function userActivate($token){
        $params1 = [
            'token' => $token,
            'status' => 1
        ];
        $params2 = [
            'token' => $token
        ];
        $this->db->query('UPDATE users SET status = :status WHERE token = :token', $params1);
        $this->db->query('UPDATE users SET token = \'\' WHERE token = :token', $params2);
    }

    //******************************


    //Вход ******************************

    public function loggingLoginValidate($post){
        $params = [
            'login' => $post['login']
        ];

        $userId = $this->db->column('SELECT id FROM users WHERE login = :login', $params);
        if(!$userId){
            $this->error = 'Неправильный логин или пороль';
            return false;
        }

        return $userId;
    }

    public function loggingPasswordValidate($userId, $post){
        $userData = $this->getUserData($userId);
        if(!password_verify($post['password'], $userData['password'])){
            $this->error = 'Неправильный логин или пороль';
            return false;
        }
    }

    public function checkStatus($id){
        $params = [
            'id' => $id
        ];

        if(!$this->db->column('SELECT status FROM users WHERE id = :id', $params)){
            $this->error = 'Данный аккаунт требует подтверждения почты';
            return false;
        }
        return true;
    }

    //******************************


    public function getUserData($id){
        $params = [
            'id' => $id
        ];
        return $this->db->row('SELECT * FROM users WHERE id = :id', $params)[0];
    }

    public function isUserExistsCheck($id){
        $params = [
            'id' => $id
        ];
        return $this->db->column('SELECT name FROM users WHERE id = :id', $params);
    }

    public function isAuthorizeCheck(){
        return (isset($_SESSION['authorize']) || isset($_COOKIE['authorize']));
    }

    public function getAuthorizeData(){
        if(isset($_SESSION['authorize'])){
            $userData = $this->getUserData($_SESSION['authorize']);
        }
        elseif(isset($_COOKIE['authorize'])){
            $userData = $this->getUserData($_COOKIE['authorize']);
        }
        else{
            $userData = [];
        }

        return $userData;
    }

}