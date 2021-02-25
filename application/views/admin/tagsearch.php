<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Поиск тегов</p>
            <p>здесь представлены найденные теги</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Главная</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/tags/1">
                <span>Теги</span>
            </a>
        </div>
    </div>
    <section class="posts_container group_box active_box">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Теги</span>
                <div class="col_of_pages">
                    <p>найдено <?=$colOfTags . ' ' . $this->valuesFormatter($colOfTags, 'тегов', 'тег', 'тега')?></p>
                    <img src="/public/imgs/tags.png">
                </div>
            </div>
            <form method="post" action="/admin/tagsearch/1" data-non-validate="true" class="search_block">
                <input name="search_text" value="<?=$searchTitle?>" type="text" placeholder="Введите запрос">
                <div class="search_trigger">
                    <img src="/public/imgs/search.png">
                </div>
                <div class="remove_search_content">&times;</div>
            </form>
        </div>
        <div class="posts_block">
            <?php if ($colOfTags === 0):?>
                <div class="empty_search_request">
                    <img src="/public/imgs/telescope.svg">
                    <p>Ничего не найдено</p>
                    <p>Попробуйте поискать теги по другим запросам</p>
                </div>
            <?php else:?>
                <?php foreach($tags as $tag):?>
                    <div class="tag">
                        <p class="tag_name"><span>#</span><?=$tag['name']?></p>
                        <div class="controllers">
                            <a href="/admin/tagdelete/<?=$tag['id']?>" class="delete">&times;</a>
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

