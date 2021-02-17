<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Страница постов</p>
            <p>здесь представлены все посты</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Home</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/posts">
                <span>Posts</span>
            </a>
        </div>
    </div>
    <section class="posts_container">
        <div class="posts_container_header">
            <span>Посты</span>
            <a href="/admin/add" class="add_post">
                <span>новый пост</span>
                <img src="/public/imgs/add.png">
            </a>
        </div>
        <div class="posts_block">
            <?php foreach($posts as $post):?>
                <div class="post">
                    <img class="post_image_preview" src="/public/uploaded_information/<?=$post['id']?>.jpg">
                    <div class="post_main_flex">
                        <div>
                            <p class="post_name">
                                <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                            </p>
    <!--                        <div class="post_author">-->
    <!--                            --><?//=$post['author_id']?>
    <!--                        </div>-->
                            <p class="date_of_post">
                                <?php
                                $postDateStr = $post['date_of_create'];
                                $postDate = strtotime($postDateStr);

                                $arr = [
                                    'января',
                                    'февраля',
                                    'марта',
                                    'апреля',
                                    'мая',
                                    'июня',
                                    'июля',
                                    'августа',
                                    'сентября',
                                    'октября',
                                    'ноября',
                                    'декабря'
                                ];

                                $month = $arr[date('n', $postDate)-1];
                                echo date('j ', $postDate) . $month . date(' Y', $postDate);
                                ?>
                            </p>
                            <p class="post_description">
                                <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                            </p>
                        </div>
                        <div class="actions">
                            <a href="/admin/edit/<?=$post['id']?>" class="edit">
                                <img src="/public/imgs/edit-post.png">
                                <p>Изменить</p>
                            </a>
                            <a href="/admin/delete/<?=$post['id']?>" class="delete">
                                <img src="/public/imgs/delete-post.png">
                                <p>Удалить</p>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach;?>
        </div>
        <div class="buttons_block">
            <?=$pagination?>
        </div>
    </section>
</div>

