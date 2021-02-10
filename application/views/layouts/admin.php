<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>
    <?php if ($this->route['action'] != 'login'): ?>
        <link rel="stylesheet" href="/public/css/adminpanel.css">
        <script src="/public/scripts/adminpanel.js" defer></script>
    <? endif; ?>
    <link rel="icon" href="/public/imgs/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?= '/public/css/'.$this->route['controller'].$this->route['action'].'.css' ?>">
    <link rel="stylesheet" href="/public/css/modal.css">
    <script src="/public/scripts/modal.js"></script>
    <script src="/public/scripts/loadParser.js" type="module"></script>
    <script src="/public/scripts/form.js" type="module"></script>
</head>
<body>
    <?php if ($this->route['action'] != 'login'): ?>
        <div class="navbar-brand">
            <a href="/admin/posts/1">Панель Администратора</a>
            <div class="navbar-brand-burger">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="main_flex">
            <div class="main_content_box">
                <div class="sub_flex">
                    <?php echo $content; ?>
                </div>
                <aside class="navbar">
                    <div class="navbar-list">
                        <ul>
                            <li class="nav-item">
                                <a class="nav-link" href="/admin/add">
                                    <div class="nav-item-icon"></div>
                                    <span class="nav-link-text">Добавить пост</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/admin/posts/1">
                                    <div class="nav-item-icon"></div>
                                    <span class="nav-link-text">Посты</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/admin/logout">
                                    <div class="nav-item-icon"></div>
                                    <span class="nav-link-text">Выход</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            <footer>
                <article class="copyright">&copy;Егор Павловскииийи. 2020 БГТУ - шарага. А ето php приколюха</article>
            </footer>
        </div>
    <?php endif; ?>
    <?php if($this->route['action'] == 'login'): ?>
        <?php echo $content; ?>
    <?php endif; ?>
</body>
</html>