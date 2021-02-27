<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Страница категорий</p>
            <p>здесь представлены все категории</p>
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
    <section class="posts_add group_box active_box">
        <div class="posts_add_header group_box_header">
            <p>Добавить категорию</p>
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
                                <div></div><p>Название категории</p>
                            </label>
                            <input type="text" id="name" name="name" placeholder="Введите название">
                        </div>
                        <div>
                            <label for="description">
                                <div></div><p>Описание категории</p>
                            </label>
                            <textarea type="text" id="description" name="description" placeholder="Опишите категорию"></textarea>
                        </div>
                    </div>
                    <div class="second_half">
                        <div class="add_image">
                            <input name="icon" type="file">
                        </div>
                    </div>
                </div>
                <div class="submit_items_block">
                    <input type="submit" value="Отправить &#10004;">
                    <input type="reset" value="Сбросить &#10006;">
                </div>
            </form>
        </div>
    </section>

    <section class="posts_container group_box">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Категории</span>
                <div class="col_of_pages">
                    <p>всего <?=$pagination->totalCount . ' ' . $this->valuesFormatter($pagination->totalCount, 'категорий', 'категория', 'категории')?></p>
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
            <?php if(empty($categories)):?>
                <div class="empty_posts_block">
                    <img src="/public/imgs/empty_box.png">
                    <p>Категорий нет</p>
                    <p>Но вы можете создать новую категорию</p>
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

