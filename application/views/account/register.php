
    <div>
        <div class="card">
            <div class="card-header">
                <h2>Создать новый аккаунт</h2>
                <h3>У вас уже есть аккаунт? <a href="/account/login">Войти</a></h3>
            </div>
            <div class="card-body">
                <form action="/account/register" method="post">
                    <div class="form-group">
                        <input autofocus required type="text" name="name" id="inputF1">
                        <label for="inputF1">Имя пользователя</label>
                    </div>
                    <div class="form-group">
                        <input required type="text" name="email" id="inputF2">
                        <label for="inputF2">Почта</label>
                    </div>
                    <div class="form-group">
                        <input required type="text" name="login" id="inputF3">
                        <label for="inputF3">Логин</label>
                    </div>
                    <div class="form-group">
                        <input class="password" required type="password" name="password" id="inputF4">
                        <label for="inputF4">Пороль</label>
                    </div>
                    <div class="form-group">
                        <input class="password" required type="password" name="password_repeat" id="inputF5">
                        <label for="inputF5">Повторите пороль</label>
                    </div>
                    <div class="submit_block">
                        <div>
                            <div class="view_password"></div>
                            <p class="view_password_label">Показать пороль</p>
                        </div>
                        <button type="submit">Отправить</button>
                    </div>
                </form>
            </div>
        </div>
        <p class="footer_inf">
            Создавая аккаунт, вы подтверждаете, что ознакомились с
            <a href="/privacy">политикой конфиденциальности</a>,
            и подписываетесь на рассылку новостей.
        </p>
    </div>
</div>


<script>
    const inputsPassword = document.querySelectorAll('.password'),
        viewPassword = document.querySelector('.view_password'),
        viewPasswordLabel = document.querySelector('.view_password_label');

    viewPassword.onclick = viewPasswordLabel.onclick = function(){
        viewPassword.classList.toggle('visible');
        viewPasswordLabel.classList.toggle('visible');

        inputsPassword && inputsPassword.forEach(el => {
            if (viewPassword.classList.contains('visible')) {
                el.type = 'text';
            } else {
                el.type = 'password';
            }
        }, );
    };
</script>