
<section class="posts_block">
    <?php if (empty($posts)): ?>
        <div class="empty_posts_box">
            <p>У вас нет постов</p>
        </div>
    <?php else: ?>
        <?php foreach ($posts as $post): ?>
            <article class="blog_recording">
                <a href="<?='/post/'.$post['id']?>" class="blog_img">
                    <img src="/public/uploaded_information/<?=$post["id"]?>.jpg">
                </a>
                <div class="main_post_content">
                    <div class="record_container">
                        <div class="blog_recording_block">
                            <div class="name_block">
                                <a href="<?='/post/'.$post['id']?>" class="blog_name">
                                    <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                </a>
                                <div class="blog_description">
                                    <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="last_block">
                        <div class="last_block_info">
                            <div class="likes">
                                <img src="/public/imgs/like.svg"/>
                                <p><?=$post['likes'] . ' ' . $this->valuesFormatter($post['likes'], 'лайков', 'лайк', 'лайка')?></p>
                            </div>
                            <div class="views">
                                <img src="/public/imgs/eye.svg"/>
                                <p><?=$post['views'] . ' ' . $this->valuesFormatter($post['views'], 'просмотров', 'просмотр', 'просмотра')?></p>
                            </div>
                            <div class="share annotation_block" data-annotation-content = "поделиться">
                                <img src="/public/imgs/share.svg"/>
                            </div>
                        </div>
                        <div class="blog_date annotation_block" data-annotation-content = "последнее изменение">
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
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    <?php endif; ?>

    <?php if(!empty($pagination)):?>
        <div class="buttons_block">
            <?=$pagination?>
        </div>
    <?php endif;?>
</section>