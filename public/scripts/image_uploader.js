
export default function imageUploader(inputSelector, buttonHtml){

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
        image && _setUploadedImage(image);
    }

    function _setUploadedImage(imageFile){
        if(imageFile.type.search(/image/)){
            return;
        }

        const imageSize = _bitesToKbites(imageFile.size);
        const imageName = imageFile.name.match(/(^.+)\..+$/)[1];
        const objectImageURL = URL.createObjectURL(imageFile);

        _input.classList.add('uploaded');
        _buttonOldValue = _button.outerHTML;
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
