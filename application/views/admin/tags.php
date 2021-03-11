<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Страница тегов</p>
            <p>здесь представлены все теги</p>
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
    <section class="posts_add group_box active_box">
        <div class="posts_add_header group_box_header">
            <p>Добавить тег</p>
            <div class="controllers">
                <div class="trey">&ndash;</div>
                <div class="close">&times;</div>
            </div>
        </div>
        <div class="add_category">
            <div class="general_form_message">
                <p></p>
                <div onclick="document.querySelector('.general_form_message').classList.remove('active')">&times;</div>
            </div>
            <form method="post" action="">
                <div class="add_category_flex">
                    <div class="add_info">
                        <div>
                            <label for="name">
                                <div></div><p>Название тега</p>
                            </label>
                            <input type="text" id="name" name="name" placeholder="Введите название">
                        </div>
                    </div>
                </div>
                <div class="submit_items_block">
                    <input type="submit" value="Отправить &#10004;">
                </div>
            </form>
        </div>
    </section>

    <section class="posts_container group_box">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Теги</span>
                <div class="col_of_pages">
                    <p>всего <?=$pagination->totalCount . ' ' . $this->valuesFormatter($pagination->totalCount, 'тегов', 'тег', 'тега')?></p>
                    <img src="/public/imgs/tags.png">
                </div>
            </div>
            <form method="post" action="/admin/tagsearch/1" data-non-validate="true" class="search_block">
                <input name="search_text" type="text" placeholder="Введите запрос">
                <div class="search_trigger">
                    <img src="/public/imgs/search.png">
                </div>
                <div class="remove_search_content">&times;</div>
            </form>
        </div>
        <div class="posts_block">
            <?php if(empty($tags)):?>
                <div class="empty_posts_block">
                    <img src="/public/imgs/empty_box.png">
                    <p>Тегов нет</p>
                    <p>Но вы можете создать новый тег</p>
                </div>
            <?php else:?>
                <?php foreach($tags as $tag):?>
                    <div class="tag">
                        <div class="tag_body">
                            <p class="tag_name"><span>#</span><?=$tag['name']?></p>
                        </div>
                        <div class="tag_footer">
                            <p>
                                <img src="/public/imgs/posts.svg">
                                <?=$tag['col_of_posts']?> <?=$this->valuesFormatter($tag['col_of_posts'], 'постов', 'пост', 'поста')?>
                            </p>
                            <div class="controllers">
                                <a href="/admin/tagdelete/<?=$tag['id']?>" class="delete_tag">Удалить</a>
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

