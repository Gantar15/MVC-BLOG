    <div class="header_flex">
        <div class="header_title">
            <h2>Категории</h2>
            <nav>
                <a href="/">Главная</a>
                <span>/</span>
                <a href="">Категории</a>
            </nav>
        </div>
    </div>
</header>

<div class="column">
    <section class="category_block">
        <?php foreach ($categories as $category):?>
            <div class="category" style="background-image: url('/public/categories_icons/<?=$category['id']?>.jpg')">
                <a href="/categorypage/<?=$category['id']?>" class="info_block">
                    <p class="name">
                        <?=$category['name']?>
                    </p>
                    <div class="col_of_posts">
                        <?=$category['col_of_posts'] . ' ' . $this->valuesFormatter($category['col_of_posts'], 'постов', 'пост', 'поста');?>
                    </div>
                    <div class="backgr"></div>
                </a>
            </div>
        <?php endforeach;?>
    </section>
</div>