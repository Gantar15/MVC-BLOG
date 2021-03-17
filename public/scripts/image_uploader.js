
import LoadParser from "./loadParser.js";

export default function imageUploader(inputSelector, buttonHtml, errorCallback = ()=>{}, maxSize = 5, afterRenderCallback = () => {}){

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
            errorCallback('Неподходящий формат файла');
            _inputReset();
            _setup();
            return;
        }
        if((image.size/1048576).toFixed(2) > maxSize){
            errorCallback(`Размер изображение не должен превышать ${maxSize}Мб`);
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
        _button.outerHTML = `<div style="display:none" class="uploaded_image_block">
                                <img id="uploaded_image" src="${objectImageURL}">
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

        afterRenderCallback(_input);

        //Добавляем загрузку при выборе изображения
        _uploadedImageBlock = _input.parentElement.querySelector('.uploaded_image_block');
        const uploadedImage = _uploadedImageBlock.querySelector('#uploaded_image');
        _uploadedImageBlock.parentNode.style.cssText = 'border: 2px solid #969696; border-radius: 3px';

        const imageLoad = new LoadParser(_uploadedImageBlock, 0, '/public/imgs/loading.gif');
        imageLoad.start();
        setTimeout(() => _uploadedImageBlock.style.display = '', 20);

        const startT = Date.now();
        uploadedImage.onload = () => {
            const intrvId = setInterval(() => {
                const endT = Date.now();
                if(endT - startT >= 500){
                    imageLoad.stop();
                    _uploadedImageBlock.parentNode.style = '';
                    uploadedImage.onload = null;
                    clearInterval(intrvId);

                    addReset();
                }
            }, 20);
        }

        function addReset(){
            const resetInput = _uploadedImageBlock.querySelector('.uploaded_image_reset > div');
            resetInput.addEventListener('click', _resetImage);
        }
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
        newInput.id = _input.id;
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
        _input.form?.addEventListener('reset', _resetImage);
    }

}
