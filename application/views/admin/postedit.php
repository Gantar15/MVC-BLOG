<div class="card">
    <div class="card-header"><?= $title ?></div>
    <div class="card-body">
        <form enctype="multipart/form-data" action="/admin/post/edit/<?= $id ?>" method="post">
            <div class="form-group">
                <input required id="fge1" type="text" name="name" value="<?php
                    echo htmlspecialchars($name, ENT_QUOTES|ENT_HTML5, 'UTF-8', true);
                ?>">
                <label for="fge1">Название</label>
            </div>
            <div class="form-group">
                <input required id="fge2" type="text" name="description" value="<?php
                    echo htmlspecialchars($description, ENT_QUOTES|ENT_HTML5, 'UTF-8', true);
                ?>">
                <label for="fge2">Описание</label>
            </div>
            <div class="form-group">
                <textarea required id="fge3" rows="1" name="text"><?php
                    echo htmlspecialchars(str_replace('<br />', '', $text), ENT_QUOTES|ENT_HTML5, 'UTF-8', true);
                ?></textarea>
                <label for="fge3">Текст</label>
            </div>
            <div class="form-group">
                <input required id="fge4" type="file" name="image">
            </div>
            <div class="submit">
                <button type="submit">Внести изменения</button>
            </div>
        </form>
    </div>
</div>
