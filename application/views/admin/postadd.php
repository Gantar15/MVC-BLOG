        <div class="card">
            <div class="card-header"><?= $title ?></div>
            <div class="card-body">
                <form enctype="multipart/form-data" action="/admin/post/add" method="post">
                    <div class="form-group">
                        <input required type="text" name="name" id="fg1">
                        <label for="fg1">Название</label>
                    </div>
                    <div class="form-group">
                        <input required type="text" name="description" id="fg2">
                        <label for="fg2">Описание</label>
                    </div>
                    <div class="form-group">
                        <textarea required rows="1" name="text" id="fg3"></textarea>
                        <label for="fg3">Текст</label>
                    </div>
                    <div class="form-group">
                        <input required type="file" name="image" id="fg4">
                    </div>
                    <div class="submit">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
