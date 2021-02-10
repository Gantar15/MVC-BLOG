<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>
    <link rel="icon" href="/public/imgs/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="<?= '/public/css/'.$this->route['controller'].$this->route['action'].'.css' ?>">
    <link rel="stylesheet" href="/public/css/modal.css">
    <script src="/public/scripts/modal.js"></script>
    <script src="/public/scripts/loadParser.js" type="module"></script>
    <script src="/public/scripts/form.js" type="module"></script>
    <script src="/public/scripts/mainburger.js" defer></script>
</head>
<body>
    <header class="header">
        <div class="header_line">
            <div class="column">
                <div class="header_line_flex">
                    <div class="user_actions">
                        <?php if ( empty($userData) ): ?>
                            <div class="login_box"><a class="login" href="/account/login">Вход</a></div>
                            <div class="register_box"><a class="register" href="/account/register">Регистрация</a></div>
                        <?php else: ?>
                            <div class="user_block">
                                <div class="user_block_head">
                                    <p><?=$userData['name']?></p>
                                    <img class="user_avatar" src="/public/users_icons/<?=$userData['id']?>.png">
                                    <div class="down_arrow"></div>
                                </div>
                                <div class="user_block_body">
                                    <div></div>
                                    <ul>
                                        <li class="user_block_profile">
                                            <a href="/account/profile">
                                                <div></div>
                                                <span>Профиль</span>
                                            </a>
                                        </li>
                                        <li class="user_block_posts">
                                            <a href="/account/posts">
                                                <div></div>
                                                <span>Посты</span>
                                            </a>
                                        </li>
                                        <li class="user_block_notifications">
                                            <a href="/account/notifications">
                                                <div></div>
                                                <span>Уведомления</span>
                                            </a>
                                        </li>
                                        <li class="user_block_settings">
                                            <a href="/account/settings">
                                                <div></div>
                                                <span>Настройки</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/account/logout">
                                                <span>Выйти из аккаунта</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                    <ul class="main_navigation">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/about">О нас</a></li>
                        <li><a href="/contact">Обратная связь</a></li>
                        <li><a href="/categories">Категории</a></li>
                    </ul>

                    <script>
                        mainNavigation = document.querySelector('.main_navigation');
                        if(mainNavigation && window.innerWidth <= 828){
                            mainNavigation.remove();
                        }
                    </script>

                    <div class="header_logo">
                        <a href="/">
                            <img src="/public/imgs/header_logo.png">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <?php echo $content; ?>
</body>
</html>