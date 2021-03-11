<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Добавление поста</p>
            <p>создайте свой пост</p>
        </div>
        <div class="pages_way">
            <a href="/admin/main">
                <img src="/public/imgs/home.png"/>
                <span>Главная</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/posts/1">
                <span>Посты</span>
            </a>
            <div class="arrow-right">&gt;</div>
            <a href="/admin/postadd">
                <span>Добавление</span>
            </a>
        </div>
    </div>

    <section class="card posts_container group_box active_box">
        <div class="posts_add_header group_box_header">
            <p>Создание поста</p>
            <div class="buttons_block">
                <div class="save">
                    <button>Сохранить шаблон</button>
                </div>
                <div class="submit" onclick="document.forms.post_add_form.submit()">
                    <button data-parent-form-name="post_add_form" type="submit">Добавить</button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form enctype="multipart/form-data" action="/admin/postadd" method="post" name="post_add_form">
                <div class="post_filters">
                    <div class="tags form-group">
                        <p>Теги</p>
                        <input type="text" placeholder="Введите тег">
                    </div>
                    <div class="category form-group">
                        <p>Категория</p>
                        <div class="categories_list" style="display: none">
                            <?php
                                for ($ind = 1; $ind < count($categoriesNames); $ind++){
                                    echo "<p>{$categoriesNames[$ind]}</p>";
                                }
                            ?>
                        </div>
                        <div id="category_select"></div>
                    </div>
                </div>
                <div class="form-group post_title">
                    <input required type="text" placeholder="Заголовок" name="name" >
                </div>
                <div class="form-group post_description">
                    <textarea required name="description" placeholder="Краткое содержание"></textarea>
                </div>
                <div class="form-group" id="post_icon">
                    <input required type="file" name="image" id="fg4">
                </div>
            </form>
        </div>
    </section>
