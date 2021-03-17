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
                <div class="submit" onclick="/*document.forms.post_add_form.submit();*/">
                    <button data-parent-form-name="post_add_form" type="submit">Добавить</button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form enctype="multipart/form-data" data-non-autosubmit action="/admin/postadd" method="post" name="post_add_form">
                <div class="general_form_message">
                    <p></p>
                    <div onclick="document.querySelector('.card-body .general_form_message').classList.remove('active')">&times;</div>
                </div>
                <div class="post_filters">
                    <div class="tags form-group">
                        <p>Теги</p>
                        <div class="tag_input">
                            <input name="tags" type="text" placeholder="Введите тег">
                            <div class="add_tag_button">
                                <div>+</div>
                            </div>
                            <div class="existing_tags closed"></div>
                        </div>
                        <div class="added_tags" name="tags" data-input-value></div>
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
                        <div id="category_select" name="category" data-input-value></div>
                    </div>
                </div>
                <div class="form-group post_title">
                    <input required type="text" placeholder="Заголовок" name="post_name">
                </div>
                <div class="form-group post_description">
                    <textarea required name="description" placeholder="Краткое содержание"></textarea>
                </div>
                <div class="form-group" id="post_icon">
                    <input required type="file" name="post_icon" id="fg4">
                </div>
            </form>
        </div>
    </section>
