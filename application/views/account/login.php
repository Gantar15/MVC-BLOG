
<div class="card_flex">
    <div class="card">
        <div class="card-header">
            <h2>Вход в аккаунт</h2>
            <h3>У вас еще нет аккаунта? <a href="/account/register">Зарегестрироваться</a></h3>
        </div>
        <div class="card-body">
            <form action="/account/login" data-non-autosubmit method="post">
                <div class="form-group">
                    <input autofocus required type="text" name="login" id="inputF3">
                    <label for="inputF3">Логин</label>
                </div>
                <div class="form-group">
                    <input class="password" required type="password" name="password" id="inputF4">
                    <div class="view_password"></div>
                    <label for="inputF4">Пороль</label>
                </div>
                <div class="submit_block">
                    <div class="remember_block">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Запомнить</label>
                    </div>
                    <button type="submit">Вход</button>
                </div>
            </form>
        </div>
        <div class="general_form_message">
            <div>
                <p></p>
            </div>
        </div>
    </div>
    <p class="footer_inf">
        Входя в аккаунт, вы подтверждаете, что ознакомились с
        <a href="/privacy">политикой конфиденциальности</a>,
        и подписываетесь на рассылку новостей.
    </p>
</div>

<script src="/public/scripts/accountlogin.js"></script>