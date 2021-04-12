        <div class="header_flex">
            <div class="header_title">
                <img src="/public/imgs/main_header_title_img.png">
                <h2>Мой личный блог</h2>
                <p>Чисто на php по-пацански. Можете здесь постить что угодно, комментировать эти посты, зарегистрировавшись и войдя в свой аккаунт.</p>
                <a href=""></a>
            </div>
        </div>
    </header>
    <script src="/public/scripts/index.js" defer></script>

    <div class="column pd_s">
        <div class="recordings_container">
            <div class="first_section_title">
                <img src="/public/imgs/posts_blue.svg">
                <p>Все посты</p>
            </div>
            <section class="blog_recordings">
                <?php if (empty($allPosts)): ?>
                    <p>Посты закончились</p>
                <?php else: ?>
                    <?php foreach ($allPosts as $post): ?>
                        <article class="blog_recording">
                            <div class="blog_img">
                                <img src="/public/uploaded_information/<?=$post["id"]?>.jpg">
                                <?php if(!empty($post['category']["name"])):?>
                                    <a href="/categorypage/<?=$post['category']["id"]?>" class="category"><?=$post['category']["name"]?></a>
                                <?php endif;?>
                            </div>
                            <div class="main_post_content">
                                <div class="record_container">
                                    <div class="blog_recording_block">
                                        <div class="name_block">
                                            <a href="<?='/post/'.$post['id']?>" class="blog_name">
                                                <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                            </a>

                                            <div class="info-block">
                                                <div class="blog_date">
                                                    <img src="/public/imgs/clock.svg"/>
                                                   <p>
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
                                                   </p>
                                                </div>
                                                <div class="author_name">
                                                    <a href="/account/userprofile/(userid)">
                                                        <img src="/public/imgs/pen.svg"/>
                                                        <span>Имя Автора</span>
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="blog_description">
                                                <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="last_block">
                                    <div class="continue_reading">
                                        <a href="<?='/post/'.$post['id']?>">
                                            <span>Читать далее</span>
                                            <img src="/public/imgs/right-arrow.svg"/>
                                        </a>
                                    </div>

                                    <div class="last_block_info">
                                        <div class="likes">
                                            <img src="/public/imgs/like.svg"/>
                                            <p><?=$post['likes'] . ' ' . $this->valuesFormatter($post['likes'], 'лайков', 'лайк', 'лайка')?></p>
                                        </div>
                                        <div class="views">
                                            <img src="/public/imgs/eye.svg"/>
                                            <p><?=$post['views'] . ' ' . $this->valuesFormatter($post['views'], 'просмотров', 'просмотр', 'просмотра')?></p>
                                        </div>
                                        <div class="share">
                                            <img src="/public/imgs/share.svg"/>
                                            <p>Поделиться</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    <?php endforeach; ?>
                <?php endif; ?>

                <div class="buttons_block">
                    <?=$pagination?>
                </div>
            </section>
        </div>
    </div>