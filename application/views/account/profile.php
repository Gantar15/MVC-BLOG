
<section class="user_main column">
    <section class="user_header">
        <div class="user_icon_block">
            <a class="user_header_icon annotation_block" href="/account/settings" data-annotation-content = "Изменить фото">
                <div>
                    <img src="/public/users_icons/<?=$userData['id']?>.png"/>
                    <div class="overflow_display">
                        <img src="/public/imgs/replace_user.svg">
                    </div>
                </div>
            </a>
            <div class="name_block">
                <div class="flex">
                    <p class="user_name"><?=$userData['name']?></p>
                    <a class="settings" href="/account/settings">
                        <p>настройки</p>
                        <img src="/public/imgs/user_block_settings.png">
                    </a>
                </div>
            </div>
        </div>
        <div class="hd_flex">
            <div class="name_block">
                <div class="flex">
                    <p class="user_name"><?=$userData['name']?></p>
                    <a class="settings" href="/account/settings">
                        <p>настройки</p>
                        <img src="/public/imgs/user_block_settings.png">
                    </a>
                </div>
            </div>
            <p class="user_description">Lorem ipsum ntur, corporis cum debitis deleniti dicta dolore enim ex explicabo facilis id imbcaecati perferendis quas qui quibusdam recusandae reiciendis rem repellat saepe tenetur totam voluptas voluptatum.</p>
            <div class="subscribers_block">
                <p class="subscribers_count">319 тыс. подписчиков</p>
            </div>
        </div>
    </section>
    <section class="activities_slider">
        <section class="user_activities_menu">
            <div class="item user_posts active">Публикации</div>
            <div class="item user_subscribes">Подписки</div>
            <div class="item about_author">О профиле</div>
            <nav class="item profile_submenu">
                <img src="/public/imgs/sub_menu.svg">
            </nav>
        </section>
        <section class="user_activities_menu">
            <nav class="item profile_submenu">
                <img src="/public/imgs/sub_menu.svg">
            </nav>
            <a href="/account/posts" class="item profile_posts">
                <p>Подписчики</p>
                <img src="/public/imgs/posts.svg">
            </a>
            <a href="/account/notifications" class="item profile_notifications">
                <p>Уведомления</p>
                <img src="/public/imgs/notification.svg">
            </a>
            <a href="/account/notifications" class="item profile_notifications">
                <p>Комментарии</p>
                <img src="/public/imgs/empty_pen.svg">
            </a>
        </section>
    </section>

    <!-- Вставляем содержимое модуля-->
    <?=$moduleContent?>
</section>

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

<script type="module">
    import Annotations from "/public/scripts/annotations.js";
    let annotations = new Annotations('.annotation_block');
    annotations.dispatch();
</script>
<script type="module">
    import shareLink from "/public/scripts/share_link.js";
    shareLink('.blog_recording', '.share', '.blog_name');
</script>

<!--profile sub menu-->
<script src="/public/scripts/account/profile_sub_menu.js"></script>
