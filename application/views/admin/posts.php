<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Страница постов</p>
            <p>здесь представлены все посты</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Главная</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/posts/1">
                <span>Посты</span>
            </a>
        </div>
    </div>
    <section class="posts_container group_box active_box">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Посты</span>
                <div class="col_of_pages">
                    <p>всего <?=$pagination->totalCount . ' ' . $this->valuesFormatter($pagination->totalCount, 'постов', 'пост', 'поста')?></p>
                    <img src="/public/imgs/sticky-notes.png">
                </div>
            </div>
            <form method="post" action="/admin/postsearch/1" data-non-validate="true" class="search_block">
                <input name="search_text" type="text" placeholder="Введите запрос">
                <div class="search_trigger">
                    <img src="/public/imgs/search.png">
                </div>
                <div class="remove_search_content">&times;</div>
            </form>
        </div>
        <div class="posts_block">
            <?php if(empty($posts)):?>
                <div class="empty_posts_block">
                    <img src="/public/imgs/empty_box.png">
                    <p>Постов нет</p>
                    <p>Но вы можете создать новый пост</p>
                </div>
            <?php else:?>
                <div class="false_post">
                    <a href="/admin/postadd" class="add_post">
                        <span>новый пост</span>
                        <img src="/public/imgs/add.png">
                    </a>
                </div>
                <?php foreach($posts as $post):?>
                    <div class="post">
                        <div class="post_image_preview" style='background-image: url("/public/uploaded_information/<?=$post['id']?>.jpg")'>
                            <div class="post_more_inf">
                                <div class="inf">
                                    <div class="dislikes">
                                        <img src="/public/imgs/dislike.png">
                                        <span><?=$post['dislikes']?></span>
                                    </div>
                                    <div class="likes">
                                        <img src="/public/imgs/like.svg">
                                        <span><?=$post['likes']?></span>
                                    </div>
                                    <div class="views">
                                        <img src="/public/imgs/eye.svg">
                                        <span><?=$post['views']?></span>
                                    </div>
                                </div>
                                <div class="trigger">
                                    <img src="/public/imgs/arrow-down-sign-to-navigate.png">
                                </div>
                            </div>
                        </div>
                        <div class="post_main_flex">
                            <div>
                                <p class="post_name">
                                    <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                </p>
        <!--                        <div class="post_author">-->
        <!--                            --><?//=$post['author_id']?>
        <!--                        </div>-->
                                <div class="post_inf_block">
                                    <div class="date_of_post">
                                        <img src="/public/imgs/clock.svg">
                                        <span>
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
                                        </span>
                                    </div>
                                    <a class="author">
                                        <img src="/public/imgs/comment-edit.svg">
                                        <span>Imya Avtora Blin</span>
                                    </a>
                                </div>
                                <p class="post_description">
                                    <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                </p>
                            </div>
                            <div class="post_footer">
                                <a href="/post/<?=$post['id']?>" class="to_post">
                                    <p>К посту</p>
                                    <img src="/public/imgs/right-arrow-grey.png">
                                </a>
                                <div class="actions">
                                    <a href="/admin/postedit/<?=$post['id']?>" class="edit">
                                        <img src="/public/imgs/edit-post.png">
                                        <p>Изменить</p>
                                    </a>
                                    <a href="/admin/postdelete/<?=$post['id']?>" class="delete_post">
                                        <img src="/public/imgs/delete-post.png">
                                        <p>Удалить</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach;?>
            <?php endif;?>
        </div>
        <div class="posts_footer">
            <div class="buttons_block">
                <div>
                    <?=$pagination->getContent()?>
                </div>
            </div>
        </div>
    </section>
</div>

