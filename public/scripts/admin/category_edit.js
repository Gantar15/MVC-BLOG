import imageUploader from "../image_uploader.js";


const add_image = document.querySelector('.add_image'),
    uploadedImageReset = add_image.querySelector('.uploaded_image_reset');

//Подгружаем с начала уже существующее изображение категории и подключаем возможность изменить изображение
uploadedImageReset.onclick = () => {
    add_image.innerHTML = `
        <div class="add_image">
           <input name="icon" type="file">
        </div>
    `;

    imageUploader('.second_half .add_image > input', `
                        <div class="add_image_trigger">
                            <p>загрузите изображение</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `,
        (errorMessage) => {
            const generalFormMessage = document.querySelector('.general_form_message');
            generalFormMessage.querySelector('p').textContent = errorMessage;
            generalFormMessage.classList.add('active');
        }, 5,
        (input) => {
            //Удаляем общее сообщение о ошибке при выборе изображения
            input.closest('.add_category')?.querySelector('.general_form_message.active')?.classList.remove('active');
        });
};