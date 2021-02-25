<?php

namespace application\controllers;

use application\core\Controller;
use application\core\View;
use application\lib\Pagination;

class AdminController extends Controller {

    public function __construct($route)
    {
        parent::__construct($route);
        $this->view->layout = 'admin';
    }

    //Вход
    public function loginAction(){
        if(isset($_SESSION['admin']) || isset($_COOKIE['admin'])){
            $this->view->redirect('admin/posts/1');
        }

        if(!empty($_POST)) {
            $this->model->error = [];

            $loginKey = false;
            if (empty($_POST['login'])) {
                $this->model->error[] = ['message' => 'Введите логин', 'field_name' => 'login'];
            }
            if (empty($_POST['password'])) {
                $this->model->error[] = ['message' => 'Введите пороль', 'field_name' => 'password'];
            }

            if(!empty($this->model->error)){
                $this->view->message('Ошибка', $this->model->error, '', 'validation');
            }
            else {
                $loginKey = $this->model->loginValidate($_POST);
                if ($loginKey) {
                    $this->model->passwordValidate($_POST);
                }

                if(!empty($this->model->error)) {
                    $this->view->message('Ошибка', $this->model->error, '', 'general');
                }
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то логинимся
            if(isset($_POST['login_trusted'])) {
                if(isset($_POST['remember'])) {
                    setcookie('admin', true, time() + 86400 * 30 * 12, '/');
                    $this->view->location('admin/posts/1');
                }
                else {
                    $_SESSION['admin'] = true;
                    $this->view->location('admin/posts/1');
                }
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что уже все правильно
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }
        $this->view->render('Вход в админку');
    }

    //Выход
    public function logoutAction(){
        if(isset($_SESSION['admin'])){
            unset($_SESSION['admin']);
        } else if(isset($_COOKIE['admin'])){
            setcookie('admin', '', time() - 3600, '/');
        }
        $this->view->redirect('admin/login');
    }


    //Посты-----------------------------------------------

    //Изменение поста
    public function posteditAction(){
        if(!$this->model->postExistCheck($this->route['id'])) {
            View::errorCode(404);
        }
        if(!empty($_POST)){
            if($this->model->postValidate($_POST)) {
                    if($this->model->postEdit($_POST, $this->route['id'])) {

                        if($_FILES['image']['tmp_name']) {
                            if (!$this->model->uploadImage($this->route['id'], $_FILES['image']['tmp_name'], 'public/uploaded_information')) {
                                $this->view->message('Ошибка', $this->model->error, '', 'popup');
                            }
                        }

                    } else{
                        $this->view->message('Ошибка связи с бд', $this->model->error, '', 'popup');
                    }
            } else{
                $this->view->message('Ошибка изменения поста', $this->model->error, '', 'popup');
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то логинимся
            if(isset($_POST['login_trusted'])) {
                $this->view->message('Успех', 'Пост изменен', true, 'popup');
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что все поля валидны
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }

        $inf = $this->model->db->row('SELECT * FROM posts WHERE id = :id', ['id' => $this->route['id']])[0];
        $this->view->render("Изменение поста {$this->route['id']}", $inf);
    }

    //Добавление поста
    public function postaddAction(){
        if(!empty($_POST)){
            if($this->model->postValidate($_POST, 'add')) {
                $id = $this->model->postAdd($_POST);
                if($id) {
                    if(!$this->model->uploadImage($id, $_FILES['image']['tmp_name'])){
                        $this->model->postDelete($id);
                        $this->view->message('Ошибка', $this->model->error, '', 'popup');
                    }
                } else{
                    $this->view->message('Ошибка связи с бд', $this->model->error, '', 'popup');
                }
            } else{
                $this->view->message('Ошибка добавления поста', $this->model->error, '', 'popup');
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то логинимся
            if(isset($_POST['login_trusted'])) {
                $this->view->message('Успех', 'Пост добавлен', true, 'popup');
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что все поля валидны
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }
        $this->view->render('Добавление поста');
    }

    //Удаление поста
    public function postdeleteAction(){
        if($this->model->postExistCheck($this->route['id'])) {
            $this->model->postDelete($this->route['id']);
            $this->view->redirect('admin/posts/1');
        } else{
            View::errorCode(404);
        }
    }

    //Отображение постов
    public function postsAction(){
        $limit = 5;
        $pagination = new Pagination($this->route, $this->model->getPostsCount(), $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/posts/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $posts = $this->model->getPostsByLimit($limit, $pagination->currentPage);
        $this->view->render('Список постов', [
            'posts' => $posts,
            'pagination' => $pagination
        ]);
    }

    //Поиск постов
    public function postsearchAction(){
        //Если у нас нет текста запроса, выдаем ошибку
        if(!isset($_SESSION['postsearch_text']) && $this->route['page'] > 1){
            $this->view->errorCode(404);
        }
        //Сохраняем текст поиска для погинации по результатам поиска
        if($this->route['page'] == 1 && isset($_POST['search_text'])){
            $_SESSION['postsearch_text'] = $_POST['search_text'];
        }
        //Если мы переключились на другую страницу поиска, подгружаем текст запроса
        if(!isset($_POST['search_text'])) {
            $_POST['search_text'] = $_SESSION['postsearch_text'];
        }

        $limit = 2;
        $colOfPosts = $this->model->colOfSearchedPosts($_POST['search_text']);
        $pagination = new Pagination($this->route, $colOfPosts, $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/postsearch/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $posts = $this->model->searchPosts($_POST['search_text'], $limit, $pagination->currentPage);
//      $posts = array_merge($posts, $this->model->searchPostsByAuthorName($_POST['search_text']));
        $posts = array_reduce($posts, function($uniquePosts, $post){
            foreach ($uniquePosts as $p){
                if($p['id'] === $post['id'])
                    return $uniquePosts;
            }
            $uniquePosts[] = $post;
            return $uniquePosts;
        }, array());

        $this->view->render('Поиск постов', [
            'posts' => $posts,
            'colOfPosts' => $colOfPosts,
            'searchTitle' => $_POST['search_text'],
            'pagination' => $pagination
        ]);
    }


    //Категории-----------------------------------------------

    //Категории
    public function categoriesAction(){
        $limit = 6;
        $pagination = new Pagination($this->route, $this->model->getCategoriesCount(), $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/categories/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $categories = $this->model->getCategoriesByLimit($limit, $pagination->currentPage);

        //Валидация для добавления категории
        if(!empty($_POST)) {
            $this->model->error = [];

            if (empty($_POST['name'])) {
                $this->model->error[] = ['message' => 'Введите название', 'field_name' => 'name'];
            }
            if (empty($_POST['description'])) {
                $this->model->error[] = ['message' => 'Введите описание', 'field_name' => 'description'];
            }

            if(!empty($this->model->error)){
                $this->view->message('Ошибка', $this->model->error, '', 'validation');
            }
            else {
                $key = false;
                $key = $this->model->categoryNameValidate($_POST['name']);
                if ($key) {
                    $this->model->categoryDescriptionValidate($_POST['description']);
                }

                if(!empty($this->model->error)) {
                    $this->view->message('Ошибка', $this->model->error, '', 'general');
                }
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то продолжаем
            if(isset($_POST['login_trusted'])) {
                if(!file_exists($_FILES['icon']['tmp_name'])){
                    $this->view->message('Ошибка', 'Выберите изображение', '', 'general');
                }

                $id = $this->model->addCategory($_POST);

                if($id && !$this->model->uploadImage($id, $_FILES['icon']['tmp_name'], 'public/categories_icons')){
                    $this->view->message('Ошибка', $this->model->error, '', 'general');
                }
                $this->view->location('admin/categories/'.$this->route['page']);
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что уже все правильно
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }

        $this->view->render('Список категорий', [
            'categories' => $categories,
            'pagination' => $pagination
        ]);
    }

    //Поиск категорий
    public function categorysearchAction(){
        //Если у нас нет текста запроса, выдаем ошибку
        if(!isset($_SESSION['categorysearch_text']) && $this->route['page'] > 1){
            $this->view->errorCode(404);
        }
        //Сохраняем текст поиска для погинации по результатам поиска
        if($this->route['page'] == 1 && isset($_POST['search_text'])){
            $_SESSION['categorysearch_text'] = $_POST['search_text'];
        }
        //Если мы переключились на другую страницу поиска, подгружаем текст запроса
        if(!isset($_POST['search_text'])) {
            $_POST['search_text'] = $_SESSION['categorysearch_text'];
        }

        $limit = 6;
        $colOfCategories = $this->model->colOfSearchedCategories();
        $pagination = new Pagination($this->route, $colOfCategories, $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/categorysearch/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $categories = $this->model->searchCategoriesByName($_POST['search_text'], $limit, $pagination->currentPage);

        $this->view->render('Поиск категорий', [
            'categories' => $categories,
            'colOfCategories' => $colOfCategories,
            'searchTitle' => $_POST['search_text'],
            'pagination' => $pagination
        ]);
    }


    //Теги-----------------------------------------------

    //Теги
    public function tagsAction(){
        $limit = 15;
        $pagination = new Pagination($this->route, $this->model->getTagsCount(), $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/tags/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $tags = $this->model->getTagsByLimit($limit, $pagination->currentPage);

        //Валидация для добавления тега
        if(!empty($_POST)) {
            if (empty($_POST['name'])) {
                $this->model->error[] = ['message' => 'Введите название', 'field_name' => 'name'];
                $this->view->message('Ошибка', $this->model->error, '', 'validation');
            }
            else{
                $this->model->tagValidate($_POST['name']);
                if(!empty($this->model->error)) {
                    $this->view->message('Ошибка', $this->model->error, '', 'general');
                }
            }

            //Если запрос прислал пользователь, а не js для проверки полей, то продолжаем
            if(isset($_POST['login_trusted'])) {
                $this->model->addTag($_POST['name']);
                $this->view->location('admin/tags/'.$this->route['page']);
            }
            //Если данные верны, но все еще приходят проверки на валидность полей от js, то говорим, что уже все правильно
            else{
                exit(json_encode(['finally_valid' => true]));
            }
        }

        $this->view->render('Список тегов', [
            'tags' => $tags,
            'pagination' => $pagination
        ]);
    }

    public function tagdeleteAction(){
        $tagId = $this->route['id'];
        if($this->model->tagExistsCheck($tagId)) {
            $this->model->deleteTag($tagId);
        }
        $this->view->redirect('admin/tags/1');
    }

    //Поиск тегов
    public function tagsearchAction(){
        //Если у нас нет текста запроса, выдаем ошибку
        if(!isset($_SESSION['tagsearch_text']) && $this->route['page'] > 1){
            $this->view->errorCode(404);
        }
        //Сохраняем текст поиска для погинации по результатам поиска
        if($this->route['page'] == 1 && isset($_POST['search_text'])){
            $_SESSION['tagsearch_text'] = $_POST['search_text'];
        }
        //Если мы переключились на другую страницу поиска, подгружаем текст запроса
        if(!isset($_POST['search_text'])) {
            $_POST['search_text'] = $_SESSION['tagsearch_text'];
        }

        $limit = 15;
        $colOfTags = $this->model->colOfSearchedTags($_POST['search_text']);
        $pagination = new Pagination($this->route, $colOfTags, $limit);
        if(!isset($this->route['page'])){
            $this->route['page'] = 1;
        }
        if($this->route['page'] > $pagination->totalPageCount){
            $this->view->redirect('admin/tagsearch/'.$pagination->totalPageCount);
        }
        $pagination->getContent();
        $tags = $this->model->searchTagsByName($_POST['search_text'], $limit, $pagination->currentPage);

        $this->view->render('Поиск тегов', [
            'tags' => $tags,
            'colOfTags' => $colOfTags,
            'searchTitle' => $_POST['search_text'],
            'pagination' => $pagination
        ]);
    }


    //Пользователи-----------------------------------------------

    //Пользователи
    public function usersAction(){
        $this->view->render('Список тегов', [
            'users' => ''
        ]);
    }

}