
const nonAuthorizeBlocks = document.querySelectorAll('.non-authorize');

function renderNonAuthorizePopup(nonAuthorizeBlock, popupText){
    //Если у нас уже было активное модальное окно в этом элементе не создаем новое
    if(nonAuthorizeBlock.querySelector('.non-authorize-popup')) return;

    nonAuthorizeBlock.lastElementChild.style.display = "none";

    const popupTemplate = `
            <div class="non-authorize-popup">
                <div class="header">
                    <p>${popupText}</p>
                </div>
                <div class="description">
                    <p>Чтобы сделать это войдите в аккаунт или зарегестрируйтесь, если аккаунта еще нет</p>
                </div>
                <div class="footer">
                    <a href="/account/login">Войти</a>
                    <a href="/account/register">Зарегестрироваться</a>
                </div>
            </div>
        `;
    nonAuthorizeBlock.insertAdjacentHTML('beforeend', popupTemplate);
    const popup = nonAuthorizeBlock.lastElementChild;
    popup.style.bottom = -popup.offsetHeight - 10 + 'px';
    popup.style.left = '0px';

    //Меняем расположение модального окна, если оно выходит за границы
    const popupRect = popup.getBoundingClientRect();
    //Если модальное окно вылазит за нижнюю границу
    if (popupRect.top + popupRect.height + window.pageYOffset > window.pageYOffset + document.documentElement.clientHeight) {
        popup.style.bottom = nonAuthorizeBlock.offsetHeight + 10 + 'px';
    }
    //Если модальное окно вылазит за правую границу
    if(popupRect.right > window.pageXOffset + document.documentElement.offsetWidth){
        popup.style.right = 0 + 'px';
        popup.style.left = '';
    }
    //Если модальное окно вылазит за левую границу
    if(popupRect.left > window.pageXOffset + document.documentElement.offsetWidth){
        popup.style.left = 0 + 'px';
    }

    function deletePopupHandler(event) {
        if(event.target.closest('.non-authorize-popup')) return;

        popup.remove();
        document.removeEventListener('click', deletePopupHandler);
    }
    setTimeout(() => document.addEventListener('click', deletePopupHandler));
}

for (const nonAuthorizeBlock of nonAuthorizeBlocks) {
    if(nonAuthorizeBlock.classList.contains('likes')) {
        nonAuthorizeBlock.addEventListener('click', () => {renderNonAuthorizePopup(nonAuthorizeBlock, 'Хотите поставить лайк?')});
    }
    else if(nonAuthorizeBlock.classList.contains('dislikes')) {
        nonAuthorizeBlock.addEventListener('click', () => {renderNonAuthorizePopup(nonAuthorizeBlock, 'Хотите поставить дизлайк?')});
    }
    else if(nonAuthorizeBlock.classList.contains('subscribe')) {
        nonAuthorizeBlock.addEventListener('click', () => {renderNonAuthorizePopup(nonAuthorizeBlock, 'Хотите подписаться?')});
    }
    else if(nonAuthorizeBlock.classList.contains('notifications')) {
        nonAuthorizeBlock.addEventListener('click', () => {renderNonAuthorizePopup(nonAuthorizeBlock, 'Хотите получать уведрмления?')});
    }
}