<?php

namespace application\models;

use application\core\Model;
use Imagick;

class Admin extends Model
{
    public $error;

    public function loginValidate($post)
    {
        $config = require 'application/config/admin.php';
        if($config['login'] !== $post['login']) {
            $this->error = 'Неправильный логин или пороль';
            return false;
        }
        return true;
    }

    public function passwordValidate($post)
    {
        $config = require 'application/config/admin.php';
        if($config['password'] !== $post['password']) {
            $this->error = 'Неправильный логин или пороль';
            return false;
        }
        return true;
    }

    public function postValidate($post, $type = ''){

            if (strlen($post['name']) < 3 || strlen($post['name']) > 145) {
                $this->error = 'Длина имени должна быть 5-145 символов';
                return false;
            } else if (strlen($post['description']) < 20 || strlen($post['description']) > 400) {
                $this->error = 'Длина описания должна быть 20-400 символов';
                return false;
            } else if (strlen($post['text']) < 30 || strlen($post['text']) > 45300) {
                $this->error = 'Длина текста должна быть от 30 до 45300 символов';
                return false;
            }

            if($type === 'add') {
                if (empty($_FILES['image']['tmp_name'])) {
                    $this->error = 'Изображение не выбрано';
                    return false;
                } else if ($_FILES['image']['error'] == 1 || $_FILES['image']['error'] == 2) {
                    $this->error = 'Превышен максимальный размер файла';
                    return false;
                } else if ($_FILES['image']['error'] > 2) {
                    $this->error = 'Ошибка загрузки файла';
                    return false;
                } else if (!preg_match('#^image/#', $_FILES['image']['type'])) {
                    $this->error = 'Неподходящий формат изображения';
                    return false;
                }
            }

            return true;
    }

    public function postExistCheck($id)
    {
        if($this->db->column('SELECT id FROM posts WHERE id = :id', ['id' => $id])){
            if(file_exists('public/uploaded_information/'.$id.'.jpg')){
                return true;
            }
        }
        return false;
    }

    public function getPostById($id){
        $params = [
            'id' => $id
        ];
        return $this->db->row('SELECT * FROM posts WHERE id = :id', $params)[0];
    }

    public function postDelete($id){
        $this->db->query('DELETE FROM posts WHERE id = :id', ['id' => $id]);
        if(file_exists("public/uploaded_information/$id.jpg")) {
            unlink("public/uploaded_information/$id.jpg");
        }
    }

    public function postAdd($post){
        $params = [
            'name' => $post['name'],
            'description' => $post['description'],
            'text' => nl2br($post['text']),
            'date_of_create' => date('y.m.d', time())
        ];
        $response = $this->db->query('INSERT INTO posts (name, description, text, date_of_create) VALUES (:name, :description, :text, :date_of_create)', $params);
        if(!$response){
            $this->error = 'Не удалось добавить пост';
            return false;
        }
        return $this->db->lastInsertId();
    }

    public function postEdit($post, $id){
        $params = [
            'name' => $post['name'],
            'description' => $post['description'],
            'text' => $post['text'],
            'date_of_last_edit' => date('y.m.d', time()),
            'id' => $id
        ];
        $response = $this->db->query('UPDATE posts SET name=:name, description=:description, text=:text, date_of_last_edit=:date_of_last_edit WHERE id = :id', $params);
        if(!$response){
            $this->error = 'Не удалось обновить пост';
            return false;
        }
        return $response;
    }

    public function uploadImage($id, $filePath, $directory){
        try {
            $img = new Imagick($filePath);
            $img->cropThumbnailImage(1080, 600);
            $img->setImageCompressionQuality(80);
            $img->setImageFormat ("jpeg");
            $response = file_put_contents($directory.'/'.$id.'.jpg', $img);
        } catch (\Exception $err){
            $this->error = 'Не удалось загрузить изображение. Попробуйте другое';
            return false;
        }
        return $response;
    }

    public function getPostsByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        return $this->db->row('SELECT * FROM posts ORDER BY `date_of_create` DESC LIMIT :limit OFFSET :offset', $params);
    }

    public function getPostsCount(){
        return $this->db->column('SELECT COUNT(id) FROM posts');
    }

    public function searchPostsByName($postTitle){
        return $this->db->row("SELECT * FROM posts WHERE name REGEXP :name", ['name' => $postTitle]);
    }

    public function searchPostsByDescription($postTitle){
        return $this->db->row("SELECT * FROM posts WHERE description REGEXP :description", ['description' => $postTitle]);
    }

//    public function searchPostsByAuthorName($postTitle){
//        return $this->db->row("SELECT * FROM posts WHERE (SELECT name FROM users WHERE id = author_id) REGEXP :description", ['description' => $postTitle]);
//    }


    //Categories---------------------------------------

    public function getCategoriesByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        return $this->db->row('SELECT * FROM categories LIMIT :limit OFFSET :offset', $params);
    }

    public function addCategory($post){
        $params = [
            'name' => $post['name'],
            'description' => $post['description']
        ];
        $response = $this->db->query('INSERT INTO categories (name, description) VALUES (:name, :description)', $params);
        if(!$response){
            $this->error = 'Не удалось добавить категорию';
            return false;
        }
        return $this->db->lastInsertId();
    }

    public function categoryExistCheck($name)
    {
        if($this->db->column('SELECT id FROM categories WHERE name = :name', ['name' => $name])){
            return true;
        }
        return false;
    }

    public function categoryNameValidate($name){
        if(mb_strlen($name, 'utf-8') < 2) {
            $this->error = 'Длина названия не должна быть меньше 2 символов';
            return false;
        }
        elseif(mb_strlen($name, 'utf-8') > 20) {
            $this->error = 'Длина названия не должна быть больше 20 символов';
            return false;
        }
        elseif($this->categoryExistCheck($name)){
            $this->error = 'Категория с указанным названием уже существует';
            return false;
        }
        return true;
    }

    public function categoryDescriptionValidate($description){
        if(mb_strlen($description, 'utf-8') < 15) {
            $this->error = 'Длина описания не должна быть меньше 15 символов';
            return false;
        }
        elseif(mb_strlen($description, 'utf-8') > 150) {
            $this->error = 'Длина описания не должна быть больше 150 символов';
            return false;
        }
        return true;
    }

    public function getCategoriesCount(){
        return $this->db->column('SELECT COUNT(id) FROM categories');
    }


    //Tags-------------------------------------------------

    public function tagExistCheck($tagName){
        return $this->db->column('SELECT id FROM tags WHERE name = :name', ['name' => $tagName]);
    }

    public function tagValidate($tagName){
        if($this->tagExistCheck($_POST['name'])){
            $this->error = 'Данный тег уже существует. Придумайте другой :3';
        }
        elseif(mb_strlen($tagName, 'utf-8') < 2) {
            $this->error = 'Длина тега не может быть меньше 2 символов';
        }
        elseif(mb_strlen($tagName, 'utf-8') > 25) {
            $this->error = 'Длина тега не может быть беольше 25 символов';
        }
        elseif(preg_match("# #", $tagName)){
            $this->error = 'Тег не может содержать пробелы';
        }
    }

    public function addTag($tagName){
        $this->db->query('INSERT INTO tags (name) VALUES (:name)', ['name' => $tagName]);
    }

    public function getTagsByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        return $this->db->row('SELECT * FROM tags LIMIT :limit OFFSET :offset', $params);
    }

    public function getTagsCount(){
        return $this->db->column('SELECT COUNT(id) FROM tags');
    }

}