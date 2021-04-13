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
    <script src="/public/scripts/input_explorer.js" type="module"></script>
    <?php if($this->route['action'] != 'post'): ?>
        <script src="/public/scripts/form.js" type="module"></script>
    <?php endif; ?>
    <script src="/public/scripts/mainburger.js" defer></script>
    <script src="/public/scripts/share_link.js" defer></script>
</head>
<body>
    <header class="header">
        <div class="header_line">
            <div class="column">
                <div class="header_headside">
                    <article class="social">
                        <a href="#"><img src="/public/imgs/twitter.svg" alt="twitter"></a>
                        <a href="#"><img src="/public/imgs/instagram.svg" alt="instagram"></a>
                        <a href="#"><img src="/public/imgs/youtube.svg" alt="youtube"></a>
                        <a href="#"><img src="/public/imgs/facebook.svg" alt="facebook"></a>
                    </article>
                    <div class="header_logo">
                        <a href="/">
                            <img src="/public/imgs/header_logo.png">
                        </a>
                    </div>
                    <nav class="header_nav">
                        <div class="burger">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </nav>
                </div>
                <div class="line"></div>
                <div class="header_line_flex">
                    <div class="user_actions">
                        <?php if ( empty($userData) ): ?>
                            <div class="login_box"><a class="login" href="/account/login">Вход</a></div>
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
                    <div class="search">
                        <img src="/public/imgs/search.png">
                        <p>Поиск</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="points">
            <div class="points_inf">
            </div>
        </div>
	<?php echo $content; ?> <!-- Тег <header> должен закрываться в подставляемом шаблоне -->
    <footer>
            <div class="footer_head">
                <div class="column">
                    <div class="header_logo">
                        <a href="/">
                            <img src="/public/imgs/header_logo_footer.png">
                        </a>
                    </div>
                    <ul class="main_navigation">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/about">О нас</a></li>
                        <li><a href="/contact">Обратная связь</a></li>
                        <li><a href="/categories">Категории</a></li>
                    </ul>
                    <div class="to_page_top" onclick="window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });"><span>&and;</span></div>
                </div>
            </div>
            <div class="footer_downtown">
                <div class="column pd_s">
                    <article class="copyright">&copy;Егор Павловскииийи. 2020 БГТУ - шарага.</article>
                    <article class="social">
                        <a href="#"><img src="/public/imgs/twitter.svg" alt="twitter"></a>
                        <a href="#"><img src="/public/imgs/instagram.svg" alt="instagram"></a>
                        <a href="#"><img src="/public/imgs/youtube.svg" alt="youtube"></a>
                        <a href="#"><img src="/public/imgs/facebook.svg" alt="facebook"></a>
                    </article>
                    <p>My mvc blog</p>
                </div>
            </div>
    </footer>
</body>
</html>