        <div class="filler"></div>
        <div class="header_flex">
            <div class="header_title">
                <h2>Вы можете связаться с нами</h2>
                <p>если у вас возниела проблема или предложение</p>
            </div>
        </div>
    </header>
    <script src="/public/scripts/about.js" defer></script>

        <div></div>
    <div class="column_title" onclick="forms.Sform.name.focus();">
        <p>Внесите свои данные</p>
    </div>
    <div class="column">
       <form name="Sform" action="/contact" method="POST">
           <div class="input_block">
                <input required type="text" name="name" id = 'form_name'>
                <label for="form_name">Ваше имя</label>
           </div>

           <div class="input_block">
                <input required type="text" name="mail" id = 'form_mail'>
                <label for="form_mail">Ваша почта</label>
           </div>

           <div class="input_block">
                <textarea required name="message" id = 'mes'></textarea>
                <label for="mes">Сообщение</label>
           </div>

            <button type="submit">Отправить</button>
       </form>
    </div>
