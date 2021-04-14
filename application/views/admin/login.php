    <div class="login_container">
        <div>
            <div class="title">
                <a href="/"><img src="/public/imgs/header_logo_footer.png"></a>
                <h1 onclick="window.admin_login.login.focus();">admin panel</h1>
            </div>
            <div class="card">
                <div class="card-body">
                    <form name="admin_login" data-non-autosubmit action="/admin/login" method="post">
                        <div class="form-group">
                            <input autofocus required type="text" name="login" id="inputF1">
                            <label for="inputF1">Логин</label>
                        </div>
                        <div class="form-group">
                            <input required class="password" type="password" name="password" id="inputF2">
                            <div class="view_password"></div>
                            <label for="inputF2">Пароль</label>
                        </div>
                        <div class="submit_block">
                            <div class="remember_block">
                                <input type="checkbox" id="remember" name="remember">
                                <label for="remember">Запомнить</label>
                            </div>
                            <button type="submit">Вход</button>
                        </div>
                    </form>
                    <div class="general_form_message">
                        <div>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="under_login">
                <a href="/">На главную</a>
            </div>
        </div>
    </div>

    <script src="/public/scripts/accountlogin.js"></script>