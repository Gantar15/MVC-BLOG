<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Страница категорий</p>
            <p>здесь представлены все категории</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Home</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/categories">
                <span>Categories</span>
            </a>
        </div>
    </div>
    <section class="posts_container">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Категории</span>
                <div class="col_of_pages">
                    <p>всего <?=$pagination->totalCount . ' ' . $this->valuesFormatter($pagination->totalCount, 'категорий', 'категория', 'категории')?></p>
                    <img src="/public/imgs/sticky-notes.png">
                </div>
            </div>
            <form method="post" action="/admin/postsearch" data-non-validate="true" class="search_block">
                <input name="search_text" type="text" placeholder="Введите запрос">
                <div class="search_trigger" onclick="((ev)=>ev.target.closest('form').submit())(event)">
                    <img src="/public/imgs/search.png">
                </div>
            </form>
        </div>
        <div class="posts_block">
            <?php foreach($categories as $category):?>

            <?php endforeach;?>
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

