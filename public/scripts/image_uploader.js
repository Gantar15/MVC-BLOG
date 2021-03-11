
export default function imageUploader(inputSelector, buttonHtml, maxSize = 5){

    let _input;
    let _button;
    let _buttonOldValue;
    let _uploadedImageBlock;

    _input = document.querySelector(inputSelector);
    _input.insertAdjacentHTML('afterend', buttonHtml);
    _button = _input.nextElementSibling;
    _setup();

    function _uploadImageHandler(){
        const image = _input.files[0];
        if(image.type.search(/image/)){
            return;
        }
        if((image.size/1048576).toFixed(2) > maxSize){
            const generalFormMessage = document.querySelector('.general_form_message');
            generalFormMessage.querySelector('p').textContent = `Размер изображение не должен превышать ${maxSize}Мб`;
            generalFormMessage.classList.add('active');
            _inputReset();
            _setup();
            return;
        }
        image && _setUploadedImage(image);
    }

    function _setUploadedImage(imageFile){
        const imageSize = _bitesToKbites(imageFile.size);
        let imageName = imageFile.name.match(/(^.+)\..+$/)[1];
        const objectImageURL = URL.createObjectURL(imageFile);

        _input.classList.add('uploaded');
        _buttonOldValue = _button.outerHTML;

        if(imageName.length > 25){
            imageName = imageName.substr(0, 25)+'...';
        }
        _button.outerHTML = `<div class="uploaded_image_block">
                                <img src="${objectImageURL}">
                                <div class="uploaded_image_reset">
                                    <div>
                                        <img src="/public/imgs/undo.svg">
                                        <p>Отмена</p>
                                    </div>
                                </div>
                                <div class="uploaded_image_info">
                                    <p>${imageName}</p>
                                    <p>${imageSize} KB</p>
                                </div>
                             </div>`;

        //Удаляем общее сообщение о ошибке при выборе изображения
        _input.closest('.add_category')?.querySelector('.general_form_message.active')?.classList.remove('active');

        _uploadedImageBlock = _input.nextElementSibling;
        const resetInput = _uploadedImageBlock.querySelector('.uploaded_image_reset > div');
        resetInput.addEventListener('click', _resetImage);
    }

    function _resetImage(){
        if(!_input.classList.contains('uploaded')) return;

        const img = _uploadedImageBlock.querySelector('img');
        URL.revokeObjectURL(img.url);
        _inputReset();
        _uploadedImageBlock.insertAdjacentHTML('beforebegin', _buttonOldValue);
        const oldVal = _uploadedImageBlock.previousElementSibling;
        _uploadedImageBlock.remove();
        _button = oldVal;
        _setup();
    }

    function _inputReset(){
        const newInput = document.createElement('input');
        newInput.className = _input.className;
        newInput.classList.remove('uploaded');
        newInput.name = _input.name;
        newInput.type = _input.type;
        _input.replaceWith(newInput);
        _input = newInput;
    }

    function _bitesToKbites(fileSize){
        return (fileSize / 1024).toFixed(2);
    }

    function _triggerInput(){
        _input.click()
    }

    function _setup(){
        _button.addEventListener('click', _triggerInput);
        _input.addEventListener('change' , _uploadImageHandler);
        _input.form.addEventListener('reset', _resetImage);
    }

}
