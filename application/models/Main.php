<?php

namespace application\models;

use application\core\Model;

class Main extends Model {

    public $error;

    public function contactValidate($post) {
        if(strlen($post['name']) < 2 || strlen($post['name']) > 45){
            if(empty($post['name'])){
                $this->error[] = ['message' => 'Данное поле должно быть заполнено', 'field_name' => 'name'];
            }
            else{
                $this->error[] = ['message' => 'Некорректное имя', 'field_name' => 'name'];
            }
        }

        if(!filter_var($post['mail'], FILTER_VALIDATE_EMAIL)){
            if(empty($post['mail'])){
                $this->error[] = ['message' => 'Данное поле должно быть заполнено', 'field_name' => 'mail'];
            }
            else {
                $this->error[] = ['message' => 'Некорректный email адресс', 'field_name' => 'mail'];
            }
        }

        if(strlen($post['message']) < 5 || strlen($post['message']) > 1300){
            if(empty($post['message'])){
                $this->error[] = ['message' => 'Данное поле должно быть заполнено', 'field_name' => 'message'];
            }
            else {
                $this->error[] = ['message' => 'Длина сообщения должна быть от 5 до 1300 символов', 'field_name' => 'message'];
            }
        }

        if(!empty($this->error)){
            return false;
        }

        return true;
	}

    public function sendMessage($message)
    {
        $message = wordwrap($message, 70, "\n", true);
        mail('timabam253@idcbill.com', "Сообщение из блога mvcBlog от {$_POST['name']}", $message);
    }

    //Посты

    public function getNewestPostsByLimit($limit, $currentPage){
        $params = [
            'limit' => $limit,
            'offset' => ($currentPage-1)*$limit
        ];
        return $this->db->row('SELECT * FROM posts WHERE TO_DAYS(NOW()) - TO_DAYS(date_of_create) <= 30 ORDER BY `date_of_create` DESC LIMIT :limit OFFSET :offset', $params);
    }

    public function getNewestPostsCount(){
        return $this->db->column('SELECT COUNT(id) FROM posts WHERE TO_DAYS(NOW()) - TO_DAYS(date_of_create) <= 30');
    }


    //Комментарии

    //Постим коммент или ответ
    public function commentPost($authorId, $comment, $postId, $recordType, $upperCommentId = 0){
        $params = [
            'author_id' => $authorId,
            'comment' => $comment,
            'post_id' => $postId,
            'date_of_post' => date('y.m.d H:i:s', time()),
            'record_type' => $recordType,
            'upper_comment_id' => $upperCommentId
        ];
        $this->db->query('INSERT INTO comments (author_id, post_id, comment, date_of_post, record_type, upper_comment_id) VALUES (:author_id, :post_id, :comment, :date_of_post, :record_type, :upper_comment_id)', $params);
        return $this->db->column('SELECT LAST_INSERT_ID() FROM comments');
    }

    //Устанавливаем айди родительского коммента
    public function setParentCommentId($commentId, $parentCommentId){
        $this->db->query('UPDATE comments SET parent_comment_id = :parent_comment_id WHERE id = :comment_id', [
            'parent_comment_id' => $parentCommentId,
            'comment_id' => $commentId
        ]);
    }

    //Обновляем кол-во лайков и дизлаков
    public function commentMarksUpdate($likes, $dislikes, $commentId){
        $params = [
            'id' => $commentId,
            'likes' => $likes,
            'dislikes' => $dislikes
        ];
        $this->db->query('UPDATE comments SET likes = :likes, dislikes = :dislikes WHERE id = :id', $params);
    }

    //Получаем информацию о оценках, которые поставил залогиненный пользователь под указаными($commentsIds) записями
    public function getRecordsWithActiveMarksData($userId, $commentsIds){
        $comments = [];
        foreach ($commentsIds as $commentId) {
            $params = [
                'user_id' => $userId,
                'parent_comment_id' => $commentId
            ];
            $comment = $this->db->row('SELECT * FROM comments_marks WHERE user_id = :user_id AND parent_comment_id = :parent_comment_id', $params);
            if(!empty($comment)) {
                $comments[] = $comment[0];
            }
        }
        return $comments;
    }

    //Добавляем информацию о том, кто оценил коммент, какой он оценил коммент и какую оценку поставил(лайк, дизлайк)
    public function setMarksData($userId, $parentCommentId, $markType, $postId){
        $params = [
            'parent_comment_id' => $parentCommentId,
            'user_id' => $userId,
            'mark_type' => $markType,
            'post_id' => $postId
        ];
        $this->db->query('INSERT INTO comments_marks (parent_comment_id, user_id, mark_type, post_id) VALUES (:parent_comment_id, :user_id, :mark_type, :post_id)', $params);
    }

    //Проверяем оценивал ли пользователь этот коммент ранее
    public function isMarksExists($commentId, $authorId){
        $params = [
            'parent_comment_id' => $commentId,
            'user_id' => $authorId
        ];
        return $this->db->column('SELECT id FROM comments_marks WHERE parent_comment_id = :parent_comment_id AND user_id = :user_id', $params);
    }

    //Обновляем информацию о том, какую оценку поставил юзер(лайк, дизлайк)
    public function updateMarksData($parentCommentId, $markType, $authorId){
        $params = [
            'parent_comment_id' => $parentCommentId,
            'mark_type' => $markType,
            'user_id' => $authorId
        ];
        $this->db->query('UPDATE comments_marks SET mark_type = :mark_type WHERE parent_comment_id = :parent_comment_id AND user_id = :user_id', $params);
    }

    //Удаляем информацию о оценке
    public function deleteMarksData($parentCommentId, $authorId){
        $params = [
            'parent_comment_id' => $parentCommentId,
            'user_id' => $authorId
        ];
        $this->db->query('DELETE FROM `comments_marks` WHERE parent_comment_id = :parent_comment_id AND user_id = :user_id', $params);
    }

    //Количество комментов под данным постом
    public function commentsCount($postId){
        $params = [
            'post_id' => $postId,
            'record_type' => 'comment'
        ];
        return $this->db->column('SELECT COUNT(author_id) FROM comments WHERE post_id = :post_id AND record_type = :record_type', $params);
    }

    //Количество ответов под комментом
    public function answersCount($parentCommentId){
        $params = [
            'parent_comment_id' => $parentCommentId,
            'record_type' => 'answer'
        ];
        return $this->db->column('SELECT COUNT(id) FROM comments WHERE parent_comment_id = :parent_comment_id AND record_type = :record_type', $params);
    }

    //Получаем определенное количество записей($limit) под данным постом
    public function getRecordsByLimit($limit, $offset, $postId, $recordType){
        $params = [
            'post_id' => $postId,
            'limit' => $limit,
            'offset' => $offset,
            'record_type' => $recordType
        ];
        return $this->db->row('SELECT * FROM comments WHERE post_id = :post_id AND record_type = :record_type ORDER BY `date_of_post` DESC LIMIT :limit OFFSET :offset', $params);
    }

    //Получаем определенное количество записей($limit) по указаному parent_id
    public function getRecordsByParentCommentIdWithLimit($limit, $offset, $parentCommentId, $recordType, $sortMethod){
        $params = [
            'limit' => $limit,
            'offset' => $offset,
            'parent_comment_id' => $parentCommentId,
            'record_type' => $recordType
        ];
        return $this->db->row('SELECT * FROM comments WHERE parent_comment_id = :parent_comment_id AND record_type = :record_type ORDER BY `date_of_post` '.$sortMethod.' LIMIT :limit OFFSET :offset', $params);
    }

    //Получаем айди комментов, у которых есть ответы
    public function getCommentsWithAnswersIds($postId){
        $params = [
            'post_id' => $postId,
            'record_type' => 'answer'
        ];
        $commentsWithAnswersIds = $this->db->row('SELECT DISTINCT parent_comment_id FROM comments WHERE record_type = :record_type AND post_id = :post_id', $params);
        return array_map(function($arr){
            return array_shift($arr);
        }, $commentsWithAnswersIds);
    }

    //Получаем количество ответов для каждого коммента, у которого есть ответы
    public function getCommentsColOfAnswers($commentsWithAnswersIds){
        $commentsColOfAnswers = [];
        foreach ($commentsWithAnswersIds as $commentId){
            $params = [
                'parent_comment_id' => $commentId,
                'record_type' => 'answer'
            ];
            $commentsColOfAnswers[$commentId] = $this->db->column('SELECT COUNT(id) FROM comments WHERE parent_comment_id = :parent_comment_id AND record_type = :record_type', $params);
        }
        return $commentsColOfAnswers;
    }

    //Удаление комментария или ответа и всех ответов на него
    public function removeCommentById($removeCommentId, $recordType){
        $params = [
            'id' => $removeCommentId
        ];

        if($recordType == 'comment'){
            $comments = $this->db->row('SELECT id FROM comments WHERE parent_comment_id = :id', $params);
            foreach ($comments as $comment){
                $this->db->query('DELETE FROM comments_marks WHERE parent_comment_id = :id', ['id' => $comment['id']]);
            }
            $this->db->query('DELETE FROM comments WHERE parent_comment_id = :id', $params);
        }
        elseif($recordType == 'answer'){
            $this->db->query('DELETE FROM comments WHERE id = :id', $params);
            $this->db->query('DELETE FROM comments_marks WHERE parent_comment_id = :id', $params);
        }
    }

    //Исправление ответа или комментария
    public function editCommentById($editCommentId, $editCommentText){
        $params = [
            'id' => $editCommentId,
            'comment' => $editCommentText
        ];
        $this->db->query('UPDATE comments SET comment = :comment WHERE id = :id', $params);
    }

    //Получаем информацию о комментах и их пользователях
    public function getCommentsInfo($limit, $offset, $postId){
        $account = new Account();
        $comments = $this->getRecordsByLimit($limit, $offset, $postId, 'comment');
        $commentsInfo = [];

        $authors_ids = [];
        foreach($comments as $index => $comment){
            $author_id = $comment['author_id'];
            //Если пользователя больше нет - не отображаем его комменты !!!!ВРЕМЕННО
            if($account->isUserExistsCheck($author_id)) {
                if (!in_array($comment['author_id'], array_keys($authors_ids))) {
                    $authors_ids[$author_id] = $account->getUserData($author_id);
                }
                $commentsInfo[] = array(
                    'name' => $authors_ids[$author_id]['name'],
                    'likes' => $comment['likes'],
                    'dislikes' => $comment['dislikes'],
                    'author_id' => $author_id,
                    'date_of_post' => $comment['date_of_post'],
                    'comment' => $comment['comment'],
                    'comment_id' => $comment['id']
                );
            }
        }
        return $commentsInfo;
    }

    public function getAnswersInfo($limit, $offset, $parentCommentId){
        $account = new Account();

        $authors_ids = [];
        $comments = $this->getRecordsByParentCommentIdWithLimit($limit, $offset, $parentCommentId, 'answer', 'ASC');
        $answersInfo = [];

            foreach ($comments as $index => $comment) {
                $author_id = $comment['author_id'];
                //Если пользователя больше нет - не отображаем его комменты !!!!ВРЕМЕННО
                if ($account->isUserExistsCheck($author_id)) {
                    if (!in_array($comment['author_id'], array_keys($authors_ids))) {
                        $authors_ids[$author_id] = $account->getUserData($author_id);
                    }
                    $answersInfo[] = array(
                        'name' => $authors_ids[$author_id]['name'],
                        'likes' => $comment['likes'],
                        'dislikes' => $comment['dislikes'],
                        'author_id' => $author_id,
                        'date_of_post' => $comment['date_of_post'],
                        'comment' => $comment['comment'],
                        'comment_id' => $comment['id'],
                        'parent_comment_id' => $comment['parent_comment_id']
                    );
                }
            }
        return $answersInfo;

    }

    public function getCommentAuthorId($commentId){
        $params = [
          'id' => $commentId
        ];
        return $this->db->column('SELECT author_id FROM comments WHERE id = :id', $params);
    }

    public function getUserInfoForAnswer($userId){
        $params = [
          'id' => $userId
        ];
        return $this->db->row('SELECT id, name FROM users WHERE id = :id', $params);
    }

    //Пост

    //Добавляем информацию о том, кто оценил коммент, какой он оценил коммент и какую оценку поставил(лайк, дизлайк)
    public function setPostMarksData($authorId, $postId, $markType){
        $params = [
            'user_id' => $authorId,
            'mark_type' => $markType,
            'post_id' => $postId
        ];
        $this->db->query('INSERT INTO posts_marks (user_id, mark_type, post_id) VALUES (:user_id, :mark_type, :post_id)', $params);
    }

    //Проверяем оценивал ли пользователь этот коммент ранее
    public function isPostMarksExists($postId, $authorId){
        $params = [
            'post_id' => $postId,
            'user_id' => $authorId
        ];
        return $this->db->column('SELECT id FROM posts_marks WHERE post_id = :post_id AND user_id = :user_id', $params);
    }

    //Обновляем информацию о том, какую оценку поставил юзер(лайк, дизлайк)
    public function updatePostMarksData($postId, $markType, $authorId){
        $params = [
            'post_id' => $postId,
            'mark_type' => $markType,
            'user_id' => $authorId
        ];
        $this->db->query('UPDATE posts_marks SET mark_type = :mark_type WHERE post_id = :post_id AND user_id = :user_id', $params);
    }

    //Обновляем кол-во лайков и дизлаков
    public function postMarksUpdate($likes, $dislikes, $postId){
        $params = [
            'id' => $postId,
            'likes' => $likes,
            'dislikes' => $dislikes
        ];
        $this->db->query('UPDATE posts SET likes = :likes, dislikes = :dislikes WHERE id = :id', $params);
    }

    //Удаляем информацию о оценке
    public function deletePostMarksData($postId, $authorId){
        $params = [
            'post_id' => $postId,
            'user_id' => $authorId
        ];
        $this->db->query('DELETE FROM posts_marks WHERE post_id = :post_id AND user_id = :user_id', $params);
    }

    //Получаем количество лайков и дизлайков для поста
    public function getPostMarks($postId){
        $params = [
            'id' => $postId
        ];
        return $this->db->row('SELECT likes, dislikes FROM posts WHERE id = :id', $params);
    }

    //Получаем нформацию о том, какую оценку залогиненный пользователь поставил под данным постом
    public function getActiveMarkType($postId, $userId){
        $params = [
            'post_id' => $postId,
            'user_id' => $userId
        ];
        return $this->db->column('SELECT mark_type FROM posts_marks WHERE post_id = :post_id AND user_id = :user_id', $params);
    }

    //Увеличиваем количество просмотров на один
    public function incrementPostViews($postId){
        $params = [
            'post_id' => $postId
        ];
        $this->db->query('UPDATE posts SET views = views + 1 WHERE id = :post_id', $params);
    }
}