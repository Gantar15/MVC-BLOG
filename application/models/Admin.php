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

            if(empty($post['category'])){
                $this->error[] = ['message' => 'Выберите категорию', 'field_name' => 'category'];
            }
            if(empty($post['post_name'])){
                $this->error[] = ['message' => 'Введите название поста', 'field_name' => 'post_name'];
            }
            else if (mb_strlen($post['post_name']) < 3 || mb_strlen($post['post_name']) > 140) {
                $this->error[] = ['message' => 'Длина названия поста должна быть 3-140 символов', 'field_name' => 'post_name'];
            }

            if(empty($post['description'])){
                $this->error[] = ['message' => 'Введите описание поста', 'field_name' => 'description'];
            }
            else if (mb_strlen($post['description']) < 20 || mb_strlen($post['description']) > 400) {
                $this->error[] = ['message' => 'Длина описания должна быть 20-400 символов', 'field_name' => 'description'];
            }

            if($type === 'add') {
                if (!file_exists($_FILES['post_icon']['tmp_name'])) {
                    $this->error[] = ['message' => 'Изображение не выбрано', 'field_name' => 'post_icon'];
                    return false;
                }
                else if ($_FILES['post_icon']['error'] > 2) {
                    $this->error[] = ['message' => 'Ошибка загрузки изображения', 'field_name' => 'post_icon'];
                    return false;
                }
                else if (!preg_match('#^image/#', $_FILES['post_icon']['type'])) {
                    $this->error[] = ['message' => 'Неподходящий формат изображения', 'field_name' => 'post_icon'];
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

    public function postAdd($post, $MAX_COL_OF_TAGS){
        $this->error = [];
        if(!$this->categoryExistCheck($post['category'])){
            $this->error[] = ['message' => 'Невалидная категория', 'field_name' => 'category'];
            return false;
        }
        $categoryId = $this->getCategoryByName($post['category'])['id'];

        $tagsArr = [];
        $tagsIds = '';
        if(!empty($post['tags'])){
            $tagsArr = explode(' ', $post['tags']);
        }

        if(count($tagsArr) > $MAX_COL_OF_TAGS){
            $this->error = 'Максимальое количество тегов - '.$MAX_COL_OF_TAGS;
            return false;
        }

        if(!empty($tagsArr)){
            for ($i = 0; $i < count($tagsArr); $i++){
                $tag = $tagsArr[$i];
                if(!$this->tagExistCheck($tag)){
                    if($this->tagValidate($tag)){
                        $this->addTag($tag);
                        if($i < count($tagsArr) - 1)
                            $tagsIds .= $this->db->lastInsertId() . ',';
                        else
                            $tagsIds .= $this->db->lastInsertId();
                    }
                    else{
                        $this->error = 'Указан некорректный тег';
                        return false;
                    }
                }
                else{
                    if($i < count($tagsArr) - 1)
                        $tagsIds .= $this->getTagByName($tag)['id'].',';
                    else
                        $tagsIds .= $this->getTagByName($tag)['id'];
                }
            }
        }

        $params = [
            'name' => $post['post_name'],
            'description' => $post['description'],
            'date_of_create' => date('y.m.d', time()),
            'category' => $categoryId,
            'tags' => $tagsIds,
            'author_id' => 0
        ];
        $response = $this->db->query('INSERT INTO posts (name, description, date_of_create, category, tags, author_id) VALUES (:name, :description, :date_of_create, :category, :tags, :author_id)', $params);
        if(!$response){
            $this->error = 'Не удалось добавить пост';
            return false;
        }
        return $this->db->lastInsertId();
    }

    public function postEdit($post, $id, $MAX_COL_OF_TAGS){
        $this->error = [];
        if(!$this->categoryExistCheck($post['category'])){
            $this->error[] = ['message' => 'Невалидная категория', 'field_name' => 'category'];
            return false;
        }
        $category = $this->getCategoryByName($post['category'])['id'];

        $tagsArr = [];
        $tagsIds = '';
        if(!empty($post['tags'])){
            $tagsArr = explode(' ', $post['tags']);
        }

        if(count($tagsArr) > $MAX_COL_OF_TAGS){
            $this->error = 'Максимальое количество тегов - '.$MAX_COL_OF_TAGS;
            return false;
        }

        if(!empty($tagsArr)){
            for ($i = 0; $i < count($tagsArr); $i++){
                $tag = $tagsArr[$i];
                if(!$this->tagExistCheck($tag)){
                    if($this->tagValidate($tag)){
                        $this->addTag($tag);
                        if($i < count($tagsArr) - 1)
                            $tagsIds .= $this->db->lastInsertId() . ',';
                        else
                            $tagsIds .= $this->db->lastInsertId();
                    }
                    else{
                        $this->error = 'Указан некорректный тег';
                        return false;
                    }
                }
                else{
                    if($i < count($tagsArr) - 1)
                        $tagsIds .= $this->getTagByName($tag)['id'].',';
                    else
                        $tagsIds .= $this->getTagByName($tag)['id'];
                }
            }
        }

        $params = [
            'name' => $post['post_name'],
            'description' => $post['description'],
            'date_of_last_edit' => date('y.m.d', time()),
            'tags' => $tagsIds,
            'category' => $category,
            'id' => $id
        ];
        $response = $this->db->query('UPDATE posts SET name=:name, description=:description, date_of_last_edit=:date_of_last_edit, tags = :tags, category = :category WHERE id = :id', $params);
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

    public function colOfSearchedPosts($title){
        $params =  [
            'name' => $title
        ];
        return $this->db->column("SELECT COUNT(id) FROM posts WHERE name REGEXP :name OR description REGEXP :name", $params);
    }

    public function searchPosts($title, $limit, $currentPage){
        $params =  [
            'name' => $title,
            'limit' => $limit,
            'offset' =>  ($currentPage - 1) * $limit
        ];
        return $this->db->row("SELECT * FROM posts WHERE name REGEXP :name OR description REGEXP :name LIMIT :limit OFFSET :offset", $params);
    }

//    public function searchPostsByAuthorName($postTitle){
//        return $this->db->row("SELECT * FROM posts WHERE (SELECT name FROM users WHERE id = author_id) REGEXP :description", ['description' => $postTitle]);
//    }


    //Categories---------------------------------------

    public function colOfPostsInCategory($id){
        return $this->db->column('SELECT COUNT(id) FROM posts WHERE category = :category_id', ['category_id' => $id]);
    }

    public function getCategoriesByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        $categories = $this->db->row('SELECT * FROM categories ORDER BY id DESC LIMIT :limit OFFSET :offset', $params);
        if(!empty($categories)) {
            for ($i = 0; $i < count($categories); $i++) {
                $colOfPosts = $this->colOfPostsInCategory($categories[$i]['id']);
                $categories[$i]['col_of_posts'] = $colOfPosts;
            }
        }
        return $categories;
    }

    public function getCategories(){
        $categories = $this->db->row('SELECT * FROM categories ORDER BY id DESC ');
        if(!empty($categories)) {
            for ($i = 0; $i < count($categories); $i++) {
                $colOfPosts = $this->colOfPostsInCategory($categories[$i]['id']);
                $categories[$i]['col_of_posts'] = $colOfPosts;
            }
        }
        return $categories;
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

    public function editCategory($id, $name, $description){
        $params = [
            'id' => $id,
            'name' => $name,
            'description' => $description
        ];
        $response = $this->db->query('UPDATE categories SET name = :name, description = :description WHERE id = :id', $params);
        if(!$response){
            $this->error = 'Не удалось изменить категорию';
            return false;
        }
        return true;
    }

    public function deleteCategory($id){
        $this->db->query('DELETE FROM categories WHERE id = :id', ['id' => $id]);
        $posts = $this->db->row('SELECT id, category FROM posts WHERE category = :id', ['id' => $id]);
        if(!empty($posts)) {
            foreach ($posts as $post) {
                $this->db->query("UPDATE posts SET category = '' WHERE id = :id", ['id' => $post['id']]);
            }
        }
        if(file_exists("public/categories_icons/$id.jpg")) {
            unlink("public/categories_icons/$id.jpg");
        }
    }

    public function categoryExistCheck($name)
    {
        if($this->db->column('SELECT id FROM categories WHERE name = :name', ['name' => $name])){
            return true;
        }
        return false;
    }

    public function getCategoryById($id){
        $categoryArr = $this->db->row('SELECT * FROM categories WHERE id = :id', ['id' => $id]);
        if(!empty($categoryArr))
            return $categoryArr[0];
        return '';
    }

    public function getCategoryByName($name){
        return $this->db->row('SELECT * FROM categories WHERE name = :name', ['name' => $name])[0];
    }

    public function categoryNameValidate($name){
        if(mb_strlen($name, 'utf-8') < 2) {
            $this->error = 'Длина названия не должна быть меньше 2 символов';
            return false;
        }
        elseif(mb_strlen($name, 'utf-8') > 25) {
            $this->error = 'Длина названия не должна быть больше 25 символов';
            return false;
        }
        return true;
    }

    public function categoryDescriptionValidate($description){
        if(mb_strlen($description, 'utf-8') < 15) {
            $this->error = 'Длина описания не должна быть меньше 15 символов';
            return false;
        }
        elseif(mb_strlen($description, 'utf-8') > 250) {
            $this->error = 'Длина описания не должна быть больше 250 символов';
            return false;
        }
        return true;
    }

    public function getCategoriesCount(){
        return $this->db->column('SELECT COUNT(id) FROM categories');
    }

    public function colOfSearchedCategories($searchText){
        $params =  [
            'text' => $searchText
        ];
        return $this->db->column("SELECT COUNT(id) FROM categories WHERE name REGEXP :text OR description REGEXP :text", $params);
    }

    public function searchCategories($searchText, $limit, $currentPage){
        $params =  [
            'text' => $searchText,
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        $categories = $this->db->row("SELECT * FROM categories WHERE name REGEXP :text OR description REGEXP :text LIMIT :limit OFFSET :offset", $params);
        if(!empty($categories)) {
            for ($i = 0; $i < count($categories); $i++) {
                $colOfPosts = $this->colOfPostsInCategory($categories[$i]['id']);
                $categories[$i]['col_of_posts'] = $colOfPosts;
            }
        }
        return $categories;
    }
    public function getCategoriesNames(){
        $categoriesNames = $this->db->row('SELECT name FROM categories');
        return array_map(function ($el){
            return $el['name'];
        }, $categoriesNames);
    }


    //Tags-------------------------------------------------

    public function getSimilarTags($tagName, $colOfMaxTags){
        return $this->db->row('SELECT name FROM tags WHERE name REGEXP :tag_name LIMIT :col_of_max_tags', ['tag_name' => $tagName, 'col_of_max_tags' => $colOfMaxTags]);
    }

    public function colOfPostsWithTag($tagId){
        return $this->db->column('SELECT COUNT(id) FROM posts WHERE tags REGEXP :tag_id', ['tag_id' => $tagId]);
    }

    public function tagExistCheck($tagName){
        return $this->db->column('SELECT id FROM tags WHERE name = :name', ['name' => $tagName]);
    }

    public function tagValidate($tagName){
        if(mb_strlen($tagName, 'utf-8') > 25) {
            $this->error = 'Длина тега не может быть беольше 25 символов';
            return false;
        }
        elseif(!preg_match("#^[\dа-яa-z_-]*$#iu", $tagName)){
            $this->error = 'Тег может содержать только буквы, цифры, символы _ и -';
            return false;
        }
        return true;
    }

    public function addTag($tagName){
        $this->db->query('INSERT INTO tags (name) VALUES (:name)', ['name' => $tagName]);
    }

    public function getTagsByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        $tags = $this->db->row('SELECT * FROM tags ORDER BY id DESC LIMIT :limit OFFSET :offset', $params);
        if(!empty($tags)) {
            for ($i = 0; $i < count($tags); $i++) {
                $tags[$i]['col_of_posts'] = $this->colOfPostsWithTag($tags[$i]['id']);
            }
        }
        return $tags;
    }

    public function getTagById($id){
        return $this->db->row('SELECT * FROM tags WHERE id = :id', ['id' => $id])[0];
    }

    public function getTagByName($name){
        return $this->db->row('SELECT * FROM tags WHERE name = :name', ['name' => $name])[0];
    }

    public function deleteTag($id)
    {
        $this->db->query('DELETE FROM tags WHERE id = :id', ['id' => $id]);
        $postsWithTags = $this->db->row('SELECT id, tags FROM posts WHERE tags REGEXP :tag_id', ['tag_id' => $id]);
        foreach ($postsWithTags as $post){
            $newTags = preg_replace("#$id,|,$id|$id#", '', $post['tags']);
            $params = [
              'tags' => $newTags,
              'post_id' => $post['id']
            ];
            $this->db->query('UPDATE posts SET tags = :tags WHERE id = :post_id', $params);
        }
    }

    public function getTagsCount(){
        return $this->db->column('SELECT COUNT(id) FROM tags');
    }

    public function colOfSearchedTags($tagTitle){
        $params =  [
            'name' => $tagTitle
        ];
        return $this->db->column("SELECT COUNT(id) FROM tags WHERE name REGEXP :name", $params);
    }

    public function searchTagsByName($tagTitle, $limit, $currentPage){
        $params =  [
            'name' => $tagTitle,
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        $tags = $this->db->row("SELECT * FROM tags WHERE name REGEXP :name ORDER BY id DESC LIMIT :limit OFFSET :offset", $params);
        if(!empty($tags)) {
            for ($i = 0; $i < count($tags); $i++) {
                $tags[$i]['col_of_posts'] = $this->colOfPostsWithTag($tags[$i]['id']);
            }
        }
        return $tags;
    }

}