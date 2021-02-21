<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Пользователи</p>
            <p>здесь представлены все пользователи</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Главная</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/categories">
                <span>Пользователи</span>
            </a>
        </div>
    </div>
    <section class="posts_container">
        <div class="posts_container_header">
            <div class="post_head_title">
                <span>Пользователи</span>
                <div class="col_of_pages">
                    <p>всего <?=$pagination->totalCount . ' ' . $this->valuesFormatter($pagination->totalCount, 'пользователей', 'пользователь', 'пользователя')?></p>
                    <img src="/public/imgs/tags.png">
                </div>
            </div>
            <form method="post" action="/admin/postsearch" data-non-validate="true" class="search_block">
                <input name="search_text" type="text" placeholder="Введите запрос">
                <div class="search_trigger">
                    <img src="/public/imgs/search.png">
                </div>
                <div class="remove_search_content">&times;</div>
            </form>
        </div>
        <div class="posts_block">
            <?php foreach($users as $user):?>

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

