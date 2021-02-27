
if(document.querySelector('.delete_post')) {
//Модальное окно для подтверждения удаления
    const okObj = {};
    const modal = $m.modal(`
                            <div class="modal-header">
                                <span>Подтверждение</span>
                            </div>
                            <div class="modal-body">
                                <p>  
                                Вы уверены, что хотите удалить данный пост ?
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button data-closer-ok>OK</button>
                                <button data-closer>ОТМЕНА</button>
                            </div>
                        `, {
        width: 300,
        onOkObj: okObj
    });

//Удаление поста
    document.addEventListener('click', event => {
        const postDelete = event.target.closest('.actions .delete_post');
        if (!postDelete) return;
        event.preventDefault();

        okObj.onOk = () => {
            window.location.href = postDelete.href;
        };
        modal.open();
    });
}


//Доп инфа о посте в админке
document.addEventListener('click', event => {
    const moreInf = event.target.closest('.post_more_inf .trigger');
    if(!moreInf) return;

    event.target.closest('.post_more_inf').classList.toggle('active');
});
