<div class="posts">
    <div class="title">Список всех постов</div>
    <div class="posts_container">

        <?php if(empty($posts)): ?>
            <div class="title">Посты закончились, солнышко :3</div>
        <?php else: ?>
            <?php foreach($posts as $post): ?>
            <div class="post">
                <div class="post_content">
                    <div class="info_block">
                        <div class="id">id поста: <?=$post['id']?></div>
                        <div class="name">
                            <?=htmlspecialchars($post['name'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                        </div>
                        <div class="description">
                            <?=htmlspecialchars($post['description'], ENT_QUOTES|ENT_HTML5, 'UTF-8', true);?>
                        </div>
                    </div>
                </div>
                <div class="controllers_block">
                    <div class="controllers">
                        <button class="post_page"><a href="/post/<?=$post['id']?>">Перейти</a></button>
                        <button class="edit"><a href="/admin/edit/<?=$post['id']?>">Редактировать</a></button>
                        <button class="delete"><a href="/admin/delete/<?=$post['id']?>">Удалить</a></button>
                    </div>
                    <div class="opener">
                        <div>
                            <img src="/public/imgs/down-arrow_icon.png">
                            <img src="/public/imgs/down-arrow_icon.png">
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach?>
        <?php endif; ?>

    </div>
    <div class="buttons_block">
        <?=$pagination?>
    </div>
</div>
