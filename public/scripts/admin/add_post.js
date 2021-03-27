import PostConstructor from "./post_constructor.js";
import imageUploader from "../image_uploader.js";
import Select from "../select.js";



//Рендерим категории
const categoriesNamesBlock = document.querySelector('.post_filters .category .categories_list');
const categoriesNames = categoriesNamesBlock.querySelectorAll('p');
const namesData = [...categoriesNames].map((nameNode, i) => {
    return {id:i+1, value:nameNode.innerText};
});

//Получаем выбранную категорию, если такая есть
const selectedCategoryNameNode = document.getElementById('selected_category_name');
const selectedCategoryName = selectedCategoryNameNode?.innerText;
let selectedCategoryId = '';
if(selectedCategoryName)
    selectedCategoryId = namesData.findIndex(el => el.value === selectedCategoryName)+1;
selectedCategoryNameNode?.remove();

categoriesNamesBlock.remove();
const categorySelect = document.querySelector('.post_filters #category_select');
const select = new Select(".post_filters #category_select", {
    placeholder: "Выберите категорию",
    selectedId: selectedCategoryId,
    data: namesData
},({value})=>{
    categorySelect.dataset.inputValue = value;
    categorySelect.classList.add('selected');
},()=>{
    closeFormMes();
    categorySelect.classList.remove('invalid');
});


const add_image = document.querySelector('.add_image'),
    uploadedImageReset = add_image?.querySelector('.uploaded_image_reset');

function uploadIMG(inputSelector){
    //Загрузка изображения
    imageUploader(inputSelector, `
                        <div class="add_image_trigger">
                            <p>загрузите обложку поста</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `,
        (errorMessage) => {
            const postIconInput = document.querySelector('#post_icon #fg4');
            let fieldErrorNode = postIconInput.parentNode.querySelector('.field_error_inf');
            postIconInput.classList.add('invalid');
            if (!fieldErrorNode) {
                fieldErrorNode = document.createElement('div');
                fieldErrorNode.className = 'field_error_inf';
                const wrongFieldIcon = document.createElement('div');
                wrongFieldIcon.className = 'wrong_field_icon';
                fieldErrorNode.prepend(wrongFieldIcon);

                fieldErrorNode.insertAdjacentHTML('beforeend', `
                                        <p>${errorMessage}</p>
                                    `);
                postIconInput.after(fieldErrorNode);
            } else {
                fieldErrorNode.textContent = errorMessage;
            }
        }, 5,
        (input) => {
            //Удаляем сообщение о ошибке при выборе изображения
            input.closest('#post_icon')?.querySelector('.field_error_inf')?.remove();
            input.classList.remove('invalid');
            closeFormMes();
        });
}
if(add_image) {
//Подгружаем с начала уже существующее изображение и подключаем возможность изменить его
    uploadedImageReset.onclick = () => {
        add_image.innerHTML = `
        <div class="add_image">
           <input name="post_icon" type="file">
        </div>
        `;
        uploadIMG('.add_image > input');
    };
}
else{
    uploadIMG('#post_icon > input');
}



//Обработка тегов
const tagsInput = document.querySelector('.post_filters .tag_input input'),
    addTagButton = document.querySelector('.post_filters .tag_input .add_tag_button'),
    addedTagsBlock = document.querySelector('.post_filters .tags .added_tags'),
    existingTagsBlock = tagsInput.parentElement.querySelector('.existing_tags'),
    generalFormMessage = document.querySelector('.general_form_message');

    function closeFormMes(){
        generalFormMessage.classList.remove('active');
    }

    class TagsInputObj {                  //Класс для взаимодействия с полем инпут тегов
        tagsInput;

        constructor(tagsInput) {
            this.tagsInput = tagsInput;
        }

        _getErrorNode(text){
            const fieldErrorNode = document.createElement('div');
            fieldErrorNode.className = 'field_error_inf';
            const wrongFieldIcon = document.createElement('div');
            wrongFieldIcon.className = 'wrong_field_icon';
            fieldErrorNode.prepend(wrongFieldIcon);

            fieldErrorNode.insertAdjacentHTML('beforeend', `
                                        <p>${text}</p>
                                    `);
            return fieldErrorNode;
        }

        addValidateError(errorText) {
            const fieldErrorInf = this.tagsInput.parentElement.parentElement.querySelector('.field_error_inf');
            this.tagsInput.parentElement.classList.add('invalid');
            if(fieldErrorInf){
                fieldErrorInf.getElementsByTagName('p')[0].innerText = errorText;
            }
            else {
                const fieldErrorNode = this._getErrorNode(errorText);
                this.tagsInput.parentElement.after(fieldErrorNode);
            }

            this.tagsInput.addEventListener('focus', this.removeValidateError);
            this.tagsInput.addEventListener('input', this.removeValidateError);
        }

        removeValidateError = ()=>{
            const fieldErrorInf = this.tagsInput.parentElement.parentElement.querySelector('.field_error_inf');
            this.tagsInput.parentElement.classList.remove('invalid');
            fieldErrorInf?.remove();
            this.tagsInput.removeEventListener('focus', this.removeValidateError);
            this.tagsInput.removeEventListener('input', this.removeValidateError);
        }
    }
    const tagsInputObj = new TagsInputObj(tagsInput);


//Класс-предаставление меню с существующими тегами, которые похожи на вводимый тег
class existingTagsMenu{

    maxColOfTags;
    existingTagsBlock;
    tagsInput;
    _activeTagIndex = -1;
    existingTagsArr;
    isExistActiveTag = false;

    constructor(existingTagsBlock, tagsInput, maxColOfTags = 12) {
        this.existingTagsBlock = existingTagsBlock;
        this.tagsInput = tagsInput;
        this.maxColOfTags = maxColOfTags;
        this.#setupMenu();
    }

    #setupMenu(){
        this.existingTagsBlock.addEventListener('click', event => {
            const existTag = event.target.closest('.exist_tag');
            if(existTag){
                addTagInList(existTag.innerText);
                this.close();
            }
        });
    }

    setActiveTag(index){
        this.isExistActiveTag = true;
        const arrLength = this.existingTagsArr.length;
        this.existingTagsArr.forEach(el => el.classList.remove('active'));
        index = index < 0 ? arrLength-1 : index;
        index = index >= arrLength ? 0 : index;

        this._activeTagIndex = index;
        existingTagsBlock.scrollTop = this.getActiveTag.offsetTop - Math.round(existingTagsBlock.offsetHeight/2);   //Настраиваем скролл
        this.getActiveTag.classList.add('active');
    }

    get getActiveTag(){
        return this.existingTagsArr[this._activeTagIndex];
    }

    _menuCloseHandler = (event) => {
        if(event.target.closest('.existing_tags')) return;
        this.close();
    }

    _navigateMenuHandler = (event) => {
        if(event.key == 'ArrowDown' || event.key == 'ArrowRight') {
            this.setActiveTag(++this._activeTagIndex);
        }
        else if(event.key == 'ArrowUp' || event.key == 'ArrowLeft'){
            this.setActiveTag(--this._activeTagIndex);
        }

        if(event.key !== 'Enter' || this._activeTagIndex === -1) return;
            addTagInList(this.getActiveTag.textContent);
    }

    clear(){
        this.existingTagsBlock.innerHTML = '';
    }

    close(){
        this.clear();
        this.existingTagsBlock.classList.add('closed');
        document.removeEventListener('click', this._menuCloseHandler);
        document.removeEventListener('keydown', this._navigateMenuHandler);
    }

    open(){
        this.isExistActiveTag = false;
        this._activeTagIndex = -1;
        existingTagsBlock.scrollTop = 0;
        this.existingTagsArr = Array.from(this.existingTagsBlock.querySelectorAll('.exist_tag'));
        this.existingTagsBlock.classList.remove('closed');
        document.addEventListener('click', this._menuCloseHandler);
        document.addEventListener('keydown', this._navigateMenuHandler);
    }

    addTag(tagName){
        const tagNode = document.createElement('div');
        tagNode.className = 'exist_tag';
        tagNode.textContent = tagName;
        this.existingTagsBlock.append(tagNode);
    }

    renderExistingTags(){
        //Предлогать уже существующие теги
        this.tagsInput.addEventListener('input', async () => {
            let existingTagsArr;               //Массив с предположительными тегами
            if (this.tagsInput.value) {
                const response = await fetch('', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({tag_name: this.tagsInput.value, col_of_max_tags: this.maxColOfTags})
                });
                if (response.ok) {
                    try {
                        existingTagsArr = await response.json();
                        if (!Array.isArray(existingTagsArr)) throw null;
                    } catch (e) {
                        existingTagsArr = [];
                    }
                }

                this.clear();
                existingTagsArr.forEach(({name}) => {
                    this.addTag(name);
                });
                this.open();
            }
            if (!this.tagsInput.value || !existingTagsArr?.length) {
                this.close();
            }
        });
    }
}

const existingTags = new existingTagsMenu(existingTagsBlock, tagsInput, 13);
existingTags.renderExistingTags();

tagsInput.oninput = async () => {
    //Отображение кнопки добавления тега
    if(!tagsInput.value){
        addTagButton.classList.remove('active');
    }
    else {
        addTagButton.classList.add('active');
    }
};


let actualActiveTags = {        //Объект для работы с добавленными тегами
    addedTagsBlock: addedTagsBlock,

    _activeTags: new Set(),

    get activeTags(){},

    set activeTags(val){},

    addTag(tagName){
        this._activeTags.add(tagName);
        this.updateTagsNodeList();
    },
    deleteTag(tagName){
        this._activeTags.delete(tagName);
        this.updateTagsNodeList();
    },
    get length(){
        return this._activeTags.size;
    },
    hasTag(tagName){
        return this._activeTags.has(tagName);
    },
    updateTagsNodeList(){
        this.addedTagsBlock.dataset.inputValue = [...this._activeTags.values()].join(' ');
    }
};
//Добавление тега на страницу(главная функция для добавления тегов)
function addTagInList(tagsInputValue){
    if(tagsInputValue.length === 0) return;

    existingTags.close();                               //Закрываем меню с похожими существующими тегами

    if(actualActiveTags.hasTag(tagsInputValue)){
        tagsInputObj.addValidateError('Данный тег уже выбран');
        return;
    }

    //Валидация тега
    if(tagsInputValue.length > 25){
        tagsInputObj.addValidateError('Размер тега не может быть больше 25 символов');
        return;
    }
    if(!(/^[\dа-яa-z_-]*$/iu).test(tagsInputValue)){
        tagsInputObj.addValidateError(' Тег может содержать только буквы, цифры, символы _ и -');
        return;
    }

    addedTagsBlock.insertAdjacentHTML('beforeend', `
        <div class="tag_block">
            <p><span>#</span>${tagsInputValue}</p>
            <div>&times;</div>
        </div>
    `);

    addTagButton.classList.remove('active');    //Скрываем кнопку добавления тега
    tagsInputObj.tagsInput.value = '';
    actualActiveTags.addTag(tagsInputValue);                //Добавляем тег в массив с выбранными тегами

    const recentlyAddedTag = addedTagsBlock.lastElementChild;
    recentlyAddedTag.lastElementChild.onclick = () => {             //Удаление тега при нажатии на крестик
        recentlyAddedTag.remove();
        const oldData = recentlyAddedTag.querySelector('p').lastChild.data;
        actualActiveTags.deleteTag(oldData);
        tagsInputObj.removeValidateError();

        if(actualActiveTags.length < existingTags.maxColOfTags && prohibitTagsAdd.aldPlaceholder){             //Разрешаем добавлять теги, если их меньше максимального колличества, и добавление было запрещено
            allowTagsAdd();
        }
    };

    if(actualActiveTags.length >= existingTags.maxColOfTags){           //Запрещаем добавлять теги, если их больше максимального колличества
        prohibitTagsAdd();
    }
}

//Запретить добавление тегов
function prohibitTagsAdd(){
    addTagButton.style.display = 'none';
    tagsInputObj.tagsInput.disabled = true;
    prohibitTagsAdd.aldPlaceholder = tagsInputObj.tagsInput.placeholder;
    tagsInputObj.tagsInput.placeholder = existingTags.maxColOfTags + ' - максимальное количество тегов';
}
//Разрешить добавление тегов
function allowTagsAdd(){
    addTagButton.style.display = '';
    tagsInputObj.tagsInput.disabled = false;
    tagsInputObj.tagsInput.placeholder = prohibitTagsAdd.aldPlaceholder;
}

//Добавление тега при клике на кнопку или нажатии на Enter
addTagButton.onclick = () => {
    if(actualActiveTags.length < existingTags.maxColOfTags)
        addTagInList(tagsInputObj.tagsInput.value);
};
tagsInputObj.tagsInput.onkeydown = (ev) => {
    if(ev.key === 'Enter' && !existingTags.isExistActiveTag){
        if(actualActiveTags.length < existingTags.maxColOfTags)
            addTagInList(tagsInputObj.tagsInput.value);
    }
};


//Рендер выбранных для этого поста тегов
const selectedTagsNamesNode = document.getElementById('selected_tags_names');
let selectedTagsNames = [];
if(selectedTagsNamesNode?.innerText.trim())
    selectedTagsNames = JSON.parse(selectedTagsNamesNode.innerText);
selectedTagsNames.forEach(el => addTagInList(el));
selectedTagsNamesNode?.remove();



//Конструктор постов
const postConstructor = new PostConstructor();



//Отправка поста на сервер
