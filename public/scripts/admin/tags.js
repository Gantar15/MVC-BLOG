

if(document.querySelector('.delete_tag'))
{
//Модальное окно для подтверждения удаления
    const okObj = {};
    const modal = $m.modal(`
                            <div class="modal-header">
                                <span>Подтверждение</span>
                            </div>
                            <div class="modal-body">
                                <p>  
                                Вы уверены, что хотите удалить данный тег ?
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
        const postDelete = event.target.closest('.delete_tag');
        if (!postDelete) return;
        event.preventDefault();

        okObj.onOk = () => {
            window.location.href = postDelete.href;
        };
        modal.open();
    });
}