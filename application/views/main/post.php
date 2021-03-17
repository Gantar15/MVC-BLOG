    </header>

    <script src="/public/scripts/post/post_views.js"></script>

    <article class="post">
        <div class="column">
            <div class="post_sub_block">
                <div class="header_post_inf">
                    <div class="author">
                        <a href="/account/userprofile/<?=$post['author_id']?>">
                            <img src="/public/users_icons/<?=$post['author_id']?>.png">
                            <span><?=$author['name']?></span>
                        </a>
                    </div>
                    <p>&bull;</p>
                    <div class="date">
                        <span>
                            <?php
                                $postDateStr = $post['date_of_create'];
                                if($post['date_of_last_edit']) {
                                    $postDateStr = $post['date_of_last_edit'];
                                }
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
                </div>

                <div class="post_information">
                    <div class="post_name"><?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?></div>
                    <div class="inf">
                        <div class="views">
                            <img src="/public/imgs/eye.svg">
                            <span>
                                <?=$post['views'] . ' ' . $this->valuesFormatter($post['views'], 'просмотров', 'просмотр', 'просмотра')?>
                            </span>
                        </div>
                    </div>
                </div>

                <img class="post_img" src="/public/uploaded_information/<?=$post['id']?>.jpg">
                <div class="post_description">
                    <p> <span>Описание</span><br>
                        <p class="descrpton">
                            <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                        </p>
                    </p>
                </div>
                <div class="post_text">
                    <p><span>Главная часть</span><br>
                        <p class="text">
                            <?=htmlspecialchars($post['text'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                        </p>
                    </p>
                </div>
            </div>

            <div class="post_activities">
                <div class="post_marks_block">
                    <div class="post_marks">
                        <div class="likes <?php if(empty($userData)) echo 'non-authorize';?>">
                            <div class="img"></div>
                            <p></p>
                        </div>
                        <div class="dislikes <?php if(empty($userData)) echo 'non-authorize';?>">
                            <div class="img"></div>
                            <p></p>
                        </div>
                    </div>
                    <div class="views">
                        <img src="/public/imgs/eye.svg">
                        <p>
                            <?=$post['views'] . ' ' . $this->valuesFormatter($post['views'], 'просмотров', 'просмотр', 'просмотра')?>
                        </p>
                    </div>
                    <div class="share">
                        <img src="/public/imgs/share.svg"/>
                        <p>Поделиться</p>
                    </div>
                </div>
                <div class="post_author_information">
                    <div class="author_block">
                        <a class="author_icon_block" href="/account/userprofile/64">
                            <img src="/public/users_icons/64.png">
                        </a>
                        <div class="name_block">
                            <a class="name" href="/account/userprofile/64">
                                <p><?=$author['name']?></p>
                            </a>
                            <p class="subscribers">234 подписчика</p>
                        </div>
                    </div>
                    <div class="subscribe_block">
                        <div class="subscribe <?php if(empty($userData)) echo 'non-authorize';?>">
                            <p>
                                Подписаться
                            </p>
                        </div>
                        <div class="notifications <?php if(empty($userData)) echo 'non-authorize';?>">
                            <img src="/public/imgs/notification.svg"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comments_block">
                <div class="column">
                    <div class="comments_block_head">
                        <div class="comments_info">
                            <p class="col_of_comments">
                                Всего
                                <span>
                                    <?=$colOfComments?>
                                </span>
                                <?=$this->valuesFormatter($colOfComments, 'комментариев', 'комментарий', 'комментария')?>
                            </p>
                            <div class="filters_block">
                                <div class="filters_open_trigger">
                                    <img src="/public/imgs/burger_comments.png" alt="filter picture">
                                    <p>Сортировать</p>
                                </div>
                                <ul class="filters">
                                    <li class="selected">Сначала популярные</li>
                                    <li>Сначала новые</li>
                                </ul>
                            </div>
                        </div>
                        <div class="comments_send_block">
                            <?php if( !isset($_SESSION['authorize']) AND !isset($_COOKIE['authorize']) ): ?>
                                <img class="user_avatar" src="/public/imgs/user_base_avatar.jpg" alt="user avatar">
                            <?php else: ?>
                                <img class="user_avatar" src="/public/users_icons/<?=$userData['id']?>.png" alt="user avatar">
                            <?php endif;?>
                            <form action="" method="post">
                                <div class="send_comment_input_block">
                                    <textarea <?if(!isset($_SESSION['authorize']) AND !isset($_COOKIE['authorize']) ):?>disabled<?php endif;?> required name="comment" placeholder="Оставьте комментарий"></textarea>
                                </div>
                                <div class="buttons_block <?if(!isset($_SESSION['authorize']) AND !isset($_COOKIE['authorize']) ):?>non-authorize<?php endif;?>">
                                    <button type="reset">Отмена</button>
                                    <button disabled type="submit">Оставить комментарий</button>
                                </div>
                            </form>
                        </div>
                        <?php if( !isset($_SESSION['authorize']) AND !isset($_COOKIE['authorize']) ): ?>
                            <script>
                                const commentsSendBlock = document.querySelector('.comments_send_block');
                                commentsSendBlock.addEventListener('click', () => window.location = '/account/login');
                                commentsSendBlock.addEventListener('submit', (event) => event.preventDefault());
                            </script>
                        <?php endif;?>
                    </div>
                    <div class="comments_block_body">
                        <?php if( $colOfComments == 0 ): ?>
                            <div class="empty_comments_block_message">
                                <img src="/public/imgs/header_logo_short.png">
                                <p>Здесь пока нет комментариев, но вы можете быть первым...</p>
                            </div>
                        <?php else: ?>
                            <div class="load_more_comments_button">
                                <p>Ещеееее</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </article>

    <script>
        //Скрываем верхнее меню-бургер при скроле страницы
        window.addEventListener('scroll', () => {
            const pointsActive = document.querySelector('.points.active');
            if(pointsActive) {
                headerNav.classList.remove('active');
                points && points.classList.remove('active');
            }
        });
    </script>
    <script src="/public/scripts/post/non-authorize-popup.js"></script>
    <script src="/public/scripts/post/post_marks.js" type="module"></script>
    <script src="/public/scripts/comments/commentsinput.js"></script>
    <script src="/public/scripts/comments/commentsburger.js" ></script>
    <script src="/public/scripts/comments/comments_pagination.js" type="module"></script>
    <script src="/public/scripts/comments/comment.js" type="module"></script>