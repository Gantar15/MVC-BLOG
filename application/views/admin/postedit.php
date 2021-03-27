<div class="posts">
    <div class="main_header_block">
        <div class="title">
            <p>Редактирование поста</p>
            <p>измените свой пост</p>
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
            <a href="/admin/postedit/<?=$postInformation['id']?>">
                <span>Изменение</span>
            </a>
        </div>
    </div>

    <section class="card posts_container group_box active_box">
        <div class="posts_add_header group_box_header">
            <p>Изменение поста</p>
            <div class="buttons_block">
                <div class="reset" onclick="location.href = ''">
                    <button>Отменить изменения</button>
                </div>
                <div class="submit" onclick="/*document.forms.post_add_form.submit();*/">
                    <button data-parent-form-name="post_add_form" type="submit">Изменить</button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form enctype="multipart/form-data" data-non-autosubmit action="/admin/postedit/<?=$postInformation['id']?>" method="post" name="post_add_form">
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
                        <div id="selected_tags_names" style="display: none">
                            <?php if(!empty($postInformation['tags'])):?>
                                <?=json_encode($postInformation['tags'])?>
                            <?php endif; ?>
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
                        <div id="selected_category_name" style="display: none"><?=$postInformation['category']?></div>
                        <div id="category_select" name="category" data-input-value></div>
                    </div>
                </div>
                <div class="form-group post_title">
                    <input required type="text" placeholder="Заголовок" name="post_name" value="<?=$postInformation['name']?>">
                </div>
                <div class="form-group post_description">
                    <textarea required name="description" placeholder="Краткое содержание"><?=$postInformation['description']?>"</textarea>
                </div>
                <div class="add_image form-group" id="post_icon">
                    <input type="text" name="primary_image" value="true" style="display: none" id="fg4">
                    <input class="uploaded" name="post_icon" type="file">
                    <div class="uploaded_image_block">
                        <img src="/public/uploaded_information/<?=$postInformation['id']?>.jpg">
                        <div class="uploaded_image_reset">
                            <div>
                                <img src="/public/imgs/undo.svg">
                                <p>Отмена</p>
                            </div>
                        </div>
                        <div class="uploaded_image_info">
                            <p><?=$postInformation['id']?>.jpg</p>
                            <p><?=round(stat($_SERVER['DOCUMENT_ROOT']."\public\uploaded_information\\{$postInformation['id']}.jpg")['size']/1024, 2)?>КБ</p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </section>
