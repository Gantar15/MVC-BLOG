<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Поиск категорий</p>
            <p>здесь представлены найденные категории</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Главная</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/categories/1">
                <span>Категории</span>
            </a>
        </div>
    </div>
    <section class="posts_container group_box active_box">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Категории</span>
                <div class="col_of_pages">
                    <p>найдено <?=$colOfCategories . ' ' . $this->valuesFormatter($colOfCategories, 'категорий', 'категория', 'категории')?></p>
                    <img src="/public/imgs/categories.png">
                </div>
            </div>
            <form method="post" action="/admin/categorysearch/1" data-non-validate="true" class="search_block">
                <input name="search_text" type="text" placeholder="Введите запрос">
                <div class="search_trigger">
                    <img src="/public/imgs/search.png">
                </div>
                <div class="remove_search_content">&times;</div>
            </form>
        </div>
        <div class="posts_block">
            <?php if ($colOfCategories == 0):?>
                <div class="empty_search_request">
                    <img src="/public/imgs/telescope.svg">
                    <p>Ничего не найдено</p>
                    <p>Попробуйте поискать категории по другим запросам</p>
                </div>
            <?php else:?>
                <?php foreach($categories as $category):?>
                    <div class="category">
                        <img src="/public/categories_icons/<?=$category['id']?>.jpg" class="category_img">
                        <div>
                            <div class="category_main">
                                <div class="name_block">
                                    <p class="name">
                                        <?=$category['name']?>
                                    </p>
                                </div>
                                <div class="col_of_posts">
                                    <p><?=$category['col_of_posts']?> <?=$this->valuesFormatter($category['col_of_posts'], 'постов', 'пост', 'поста')?></p>
                                    <img src="/public/imgs/posts.svg">
                                </div>
                                <p class="description">
                                    <?=$category['description']?>
                                </p>
                            </div>
                            <div class="controllers">
                                <a class="edit"><p>Изменить</p></a>
                                <a href="/admin/categorydelete/<?=$category['id']?>" class="delete_category"><p>Удалить</p></a>
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

