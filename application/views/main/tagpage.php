
    <section class="tag_header">
        <img src="/public/uploaded_information/<?=$posts[0]["id"]?>.jpg" class="tag_header_img">
        <div class="tag_header_info">
            <p class="tag_header_info_name">
                #<?=$tagName?>
            </p>
            <p class="tag_header_info_stat">
                Всего <span><?=$colOfPosts?></span> <?=$this->valuesFormatter($colOfPosts, 'постов', 'пост', 'поста')?>
            </p>
        </div>
    </section>
</header>
<script src="/public/scripts/index.js" defer></script>

    <div class="column main_content">
    <div class="first_section_title">
        <img src="/public/imgs/posts_blue.svg">
        <p>Все посты</p>
    </div>
    <section class="posts_block">
        <?php foreach ($posts as $post): ?>
            <article class="blog_recording" style="background-image: url('/public/uploaded_information/<?=$post["id"]?>.jpg')">
                <div class="bg_card_shadow"></div>
                <?php if(!empty($post['category']["name"])):?>
                    <a href="/categorypage/<?=$post['category']["id"]?>" class="category"><?=$post['category']["name"]?></a>
                <?php endif;?>
                <a href="<?='/post/'.$post['id']?>" class="blog_name">
                    <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                </a>
                <div class="last_block">
                    <div class="first_flex">
                        <div class="likes annotation_block" data-annotation-content = "понравилось">
                            <img src="/public/imgs/likeWhite.svg"/>
                            <p><?=$post['likes']?></p>
                        </div>
                        <div class="views annotation_block" data-annotation-content = "посмотрело">
                            <img src="/public/imgs/eyeWhite.svg"/>
                            <p><?=$post['views']?></p>
                        </div>
                        <div class="blog_date annotation_block" data-annotation-content = "последнее изменение">
                            <img src="/public/imgs/clockWhite.svg"/>
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
                    <div class="share">
                        <img src="/public/imgs/shareWhite.svg"/>
                        <p>Поделиться</p>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </section>
</div>

<script type="module">
    import Annotations from "/public/scripts/annotations.js";
    let annotations = new Annotations('.annotation_block');
    annotations.dispatch();
</script>
<script src="/public/scripts/tags_posts.js" type="module"></script>