
<div class="header_flex" style="background-image: url('/public/categories_icons/<?=$category['id']?>.jpg')">
    <div class="bg_shadow"></div>
    <div class="header_title">
        <h2><?=$category['name']?></h2>
        <nav>
            <a href="/">Главная</a>
            <span>/</span>
            <a href="/categories">Категории</a>
            <span>/</span>
            <a href=""><?=$category['name']?></a>
        </nav>
    </div>
</div>
</header>
<script src="/public/scripts/index.js" defer></script>

<div class="column main_content">
    <section class="categories_block">
        <?php if (empty($posts)): ?>
            <div class="empty_posts_box">
                <img src="/public/imgs/ufo.svg">
                <p>Здесь постов нет</p>
                <p>Попробуйте поискать посты в других категориях</p>
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

                                    <div class="info-block">
                                        <div class="author_name annotation_block" data-annotation-content = "автор">
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
</div>

<script type="module">
    import Annotations from "/public/scripts/annotations.js";
    let annotations = new Annotations('.annotation_block');
    annotations.dispatch();
</script>
<script type="module">
    import shareLink from "/public/scripts/share_link.js";
    shareLink('.blog_recording', '.share', '.blog_name');
</script>