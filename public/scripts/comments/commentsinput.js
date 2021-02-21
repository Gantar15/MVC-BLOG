const sendCommentInputBlock = document.querySelector('.send_comment_input_block'),
    buttonsBlock = document.querySelector('.comments_send_block .buttons_block'),
    commentForm = document.querySelector('.comments_send_block > form');


//Показываем кнопки отправления комментария, только если пользователь авторизирован
if(!buttonsBlock?.classList.contains('non-authorize')) {
    //Показываем кнопки отправки и отмены коммента при фокусе на поле
    const resetButton = buttonsBlock.querySelector('button[type=reset]');
    const submitButton = buttonsBlock.querySelector('button[type=submit]');
    const commentInput = sendCommentInputBlock.querySelector('textarea');

    commentInput.onfocus = () => {
        buttonsBlock.classList.add('active');
    };
    //Скрываем кнопки при нажатии на отмена и чистит поле коммента
    resetButton.onclick = () => {
        buttonsBlock.classList.remove('active');
        submitButton.disabled = true;
    };
    //Отключаем или включаем кнопку отправления при изменении контента инпута
    commentInput.addEventListener('input', () => {
        if(commentInput.value) {
            submitButton.disabled = false;
        } else{
            submitButton.disabled = true;
        }
    });
    commentForm.addEventListener('submit', () => {
        buttonsBlock.classList.remove('active');
        submitButton.disabled = true;
    });
}