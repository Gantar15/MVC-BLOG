import imageUploader from "../image_uploader.js";

imageUploader('.second_half .add_image > input', `
                        <div class="add_image_trigger">
                            <p>загрузите изображение</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `);


if(document.querySelector('.delete_category'))
{
//Модальное окно для подтверждения удаления
    const okObj = {};
    const modal = $m.modal(`
                            <div class="modal-header">
                                <span>Подтверждение</span>
                            </div>
                            <div class="modal-body">
                                <p>  
                                Вы уверены, что хотите удалить данную категорию ?
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
        const postDelete = event.target.closest('.delete_category');
        if (!postDelete) return;
        event.preventDefault();

        okObj.onOk = () => {
            window.location.href = postDelete.href;
        };
        modal.open();
    });
}
