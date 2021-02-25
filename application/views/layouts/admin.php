<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>
    <?php if($this->route['action'] != 'login'): ?>
        <link rel="stylesheet" href="/public/css/adminpanel.css">
        <script src="/public/scripts/admin/adminpanel.js" type="module"></script>
    <? endif; ?>
    <?php if($this->route['action'] == 'categories'): ?>
        <script src="/public/scripts/image_uploader.js" type="module"></script>
        <script src="/public/scripts/admin/admin_category.js" type="module"></script>
    <?php endif;?>
    <link rel="icon" href="/public/imgs/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?= '/public/css/'.$this->route['controller'].$this->route['action'].'.css' ?>">
    <link rel="stylesheet" href="/public/css/modal.css">
    <script src="/public/scripts/modal.js"></script>
    <script src="/public/scripts/loadParser.js" type="module"></script>
    <script src="/public/scripts/form.js" type="module"></script>

    <script src="/public/scripts/admin/main_admin_posts.js" defer></script>
    <script src="/public/scripts/admin/admin_search.js" defer></script>
</head>
<body>
    <?php if ($this->route['action'] != 'login'): ?>
        <div class="main_box">
            <aside class="aside_menu active">
                <header>
                    <a href="/"><img src="/public/imgs/header_logo_footer.png"></a>
                </header>
                <section class="aside_menu_body">
                    <div class="aside_category users_category">
                        <div class="category_name active">
                            <span>Меню пользователей</span>
                            <div class="navigation_zip"></div>
                        </div>
                        <nav class="active">
                            <ul>
                                <li <?php if($this->route['action'] == 'users' || $this->route['action'] == 'usersearch'):?>
                                        class = 'active'
                                    <?php endif;?>>
                                    <a href="/admin/users/1">
                                        <div></div>
                                        <span>Пользователи</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div class="aside_category posts_category">
                        <div class="category_name active">
                            <span>Меню постов</span>
                            <div class="navigation_zip"></div>
                        </div>
                        <nav class="active">
                            <ul>
                                <li <?php if($this->route['action'] == 'posts' || $this->route['action'] == 'postsearch'):?>
                                        class = 'active'
                                    <?php endif;?>>
                                    <a href="/admin/posts/1">
                                        <div></div>
                                        <span>Посты</span>
                                    </a>
                                </li>
                                <li <?php if($this->route['action'] == 'categories' || $this->route['action'] == 'categorysearch'):?>
                                        class = 'active'
                                    <?php endif;?>>
                                    <a href="/admin/categories/1">
                                        <div></div>
                                        <span>Категории</span>
                                    </a>
                                </li>
                                <li <?php if($this->route['action'] == 'tags' || $this->route['action'] == 'tagsearch'):?>
                                        class = 'active'
                                    <?php endif;?>>
                                    <a href="/admin/tags/1">
                                        <div></div>
                                        <span>Теги</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>
            </aside>
            <section class="main_admin_block">
                <section>
                    <header>
                        <div class="aside_burger">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <a href="/admin/logout" class="go-out">
                            <p>Выход</p>
                            <div></div>
                        </a>
                    </header>
                    <main>
                        <?=$content?>
                    </main>
                </section>
                <footer>
                    <article class="copyright">&copy;Егор Павловскииийи. 2020 БГТУ - шарага.
                        <span><a href="/privacy">Политика конфиденциальности</a></span></article>
                </footer>
            </section>
        </div>
    <?php endif; ?>
    <?php if($this->route['action'] == 'login'): ?>
        <?php echo $content; ?>
    <?php endif; ?>
</body>
</html>