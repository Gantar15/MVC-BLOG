<?php


namespace application\controllers;

use application\core\Controller;
use application\core\View;

class AccountController extends Controller
{

    public function __construct($route)
    {
        parent::__construct($route);
        $this->view->layout = 'account';
    }

    //Регистрация

    public function registerAction(){
        if($this->model->isAuthorizeCheck()){
            $this->view->redirect('');
        }
        if(!empty($_POST)) {
            $this->model->error = [];
            if(empty($_POST['login'])){
                $this->model->error[] = ['message' => 'Введите логин', 'field_name' => 'login'];
            }
            elseif($this->model->checkLoginExists($_POST['login'])){
                $this->model->error[] = ['message' => 'Этот логин уже используется другим пользователем', 'field_name' => 'login'];
            }
            else{
                $this->model->registerLoginValidate($_POST['login']);
            }

            if(empty($_POST['name'])){
                $this->model->error[] = ['message' => 'Введите имя пользователя', 'field_name' => 'name'];
            }
            elseif($this->model->checkNameExists($_POST['name'])){
                $this->model->error[] = ['message' => 'Данное имя занято другим пользователем, сори, бейби :3', 'field_name' => 'name'];
            }
            else{
                $this->model->registerNameValidate($_POST['name']);
            }

            if(empty($_POST['email'])){
                $this->model->error[] = ['message' => 'Введите адрес своей электронной почты', 'field_name' => 'email'];
            }
            elseif($this->model->checkEmailExists($_POST['email'])){
                $this->model->error[] = ['message' => 'Пользователь с такой почтой уже зарегестрирован', 'field_name' => 'email'];
            }
            else{
                $this->model->registerEmailValidate($_POST['email']);
            }

            if(empty($_POST['password'])){
                $this->model->error[] = ['message' => 'Введите пароль', 'field_name' => 'password'];
            }
            else{
                $this->model->passwordValidate($_POST['password']);
            }

            if(empty($_POST['password_repeat'])){
                $this->model->error[] = ['message' => 'Введите пароль еще раз', 'field_name' => 'password_repeat'];
            }
            elseif($_POST['password_repeat'] !== $_POST['password']){
                $this->model->error[] = ['message' => 'Введенные вами пороли не совпадают', 'field_name' => 'password_repeat'];
            }

            if(!empty($this->model->error)) {             //Если есть хоть одна ошибка, то отправляем ее
                $this->view->message('Ошибка', $this->model->error, '', 'validation');
            }


            //Если запрос прислал пользователь, а не js для проверки полей, то регестрируем пользователя
            if(isset($_POST['login_trusted'])) {
                $token = $this->model->register($_POST);
                $userId = $this->model->tokenExists($token);

                $this->model->uploadUserAvatar($_SERVER['DOCUMENT_ROOT'].'/public/imgs/user_base_avatar.jpg', $userId);
                $this->view->location('account/preconfirm/'.$userId);
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что уже все правильно
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }
        $this->view->render('Регистация');
    }

    //Вход

    public function loginAction(){
        if( $this->model->isAuthorizeCheck() ){
            $this->view->redirect('account/profile' );
        }

        if(!empty($_POST)) {
            $this->model->error = [];
            $userId = false;

            if(empty($_POST['login'])){
                $this->model->error[] = ['message' => 'Введите логин', 'field_name' => 'login'];
            }
            if(empty($_POST['password'])){
                $this->model->error[] = ['message' => 'Введите пароль', 'field_name' => 'password'];
            }

            if(!empty($this->model->error)){
                $this->view->message('Ошибка', $this->model->error, '', 'validation');
            }
            else{
                $userId = $this->model->loggingLoginValidate($_POST);

                if($userId) {
                    if(!$this->model->checkStatus($userId)){
                        $this->view->message('Ошибка', $this->model->error, '', 'general');
                    }

                    $this->model->loggingPasswordValidate($userId, $_POST);
                }

                if(!empty($this->model->error)){
                    $this->view->message('Ошибка', $this->model->error, '', 'general');
                }
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то логинимся
            if(isset($_POST['login_trusted'])) {
                if (isset($_POST['remember'])) {
                    setcookie('authorize', $userId, time() + 86400 * 30 * 12, '/');
                    $this->view->location('account/profile');
                } else {
                    $_SESSION['authorize'] = $userId;
                    $this->view->location('account/profile');
                }
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что все поля валидны
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }
        $this->view->render('Вход');
    }

    //Выход

    public function logoutAction(){
        if(isset($_SESSION['authorize'])){
            unset($_SESSION['authorize']);
        }
        else if(isset($_COOKIE['authorize'])){
            setcookie('authorize', '', time() - 3600, '/');
        }
        $this->view->redirect('');
    }

    //Подтверждение почты

    public function preconfirmAction(){
        $token = $this->model->getUserData($this->route['id'])['token'];
        if(!$this->model->tokenExists($token)){
            $this->view->redirect('account/login');
        }
        $this->view->render('Подтвердите почту');
    }

    public function confirmAction(){
        if(!$this->model->tokenExists($this->route['token'])){
            $this->view->redirect('account/login');
        }

        $userId = $this->model->tokenExists($this->route['token']);
        $userData = $this->model->getUserData($userId);

        $this->model->userActivate($this->route['token']);
        $this->view->render('Регистрация завершена', $userData);
    }

    //Профиль авторизованного ползователя

    public function profileAction(){
        //Получаем инфу о пользователе, если он залогинился
        $userData = $this->model->getAuthorizeData();

        $this->view->render('Ваш профиль', [
            'userData' => $userData
        ]);
    }

    //Профиль неавторизованного пользователя

    public function userprofileAction(){
        if($this->model->isAuthorizeCheck()) {
            if (isset($_COOKIE['authorize']) && $this->route['id'] == $_COOKIE['authorize']) {
                $this->view->redirect('account/profile');
            }
            if(isset($_SESSION['authorize']) && $this->route['id'] == $_SESSION['authorize']){
                $this->view->redirect('account/profile');
            }
        }

        $userId = $this->route['id'];
        $userPageData = $this->model->getUserData($userId);

        //Получаем инфу о пользователе, если он залогинился
        $userData = $this->model->getAuthorizeData();

        $this->view->render('Профиль ' . $userData['name'], [
            'userData' => $userData,
            'userPageData' => $userPageData
        ]);
    }
}