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
                    `);
};