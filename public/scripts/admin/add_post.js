import PostConstructor from "./post_constructor.js";
import imageUploader from "../image_uploader.js";
import LoadParser from "../loadParser.js";
import Select from "../select.js";



//Рендерим категории
const categoriesNamesBlock = document.querySelector('.post_filters .category .categories_list');
const categoriesNames = categoriesNamesBlock.querySelectorAll('p');
const namesData = [...categoriesNames].map((nameNode, i) => {
    return {id:i+1, value:nameNode.innerText};
});
categoriesNamesBlock.remove();
const categorySelect = document.querySelector('.post_filters #category_select'),
categorySelectBox = document.querySelector('.post_filters .category');
const select = new Select(".post_filters #category_select", {
    placeholder: "Выберите категорию",
    selectedId: "",
    data: namesData
},({value})=>{
    categorySelect.dataset.inputValue = value;
},()=>{
    closeFormMes();
    categorySelect.classList.remove('invalid');
});



//Загрузка изображения
imageUploader('#post_icon #fg4', `
                        <div class="add_image_trigger">
                            <p>загрузите обложку поста</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `,
    (errorMessage) => {
        const postIconInput = document.querySelector('#post_icon #fg4');
        let fieldErrorNode = postIconInput.parentNode.querySelector('.field_error_inf');
        postIconInput.classList.add('invalid');
        if(!fieldErrorNode) {
            fieldErrorNode = document.createElement('div');
            fieldErrorNode.className = 'field_error_inf';
            const wrongFieldIcon = document.createElement('div');
            wrongFieldIcon.className = 'wrong_field_icon';
            fieldErrorNode.prepend(wrongFieldIcon);

            fieldErrorNode.insertAdjacentHTML('beforeend', `
                                        <p>${errorMessage}</p>
                                    `);
            postIconInput.after(fieldErrorNode);
        }
        else {
            fieldErrorNode.textContent = errorMessage;
        }
    }, 5,
    (input) => {
        //Удаляем сообщение о ошибке при выборе изображения
        input.closest('#post_icon')?.querySelector('.field_error_inf')?.remove();
        input.classList.remove('invalid');
        closeFormMes();
    });



//Обработка тегов
const tagsInput = document.querySelector('.post_filters .tag_input input'),
    addTagButton = document.querySelector('.post_filters .tag_input .add_tag_button'),
    addedTagsBlock = document.querySelector('.post_filters .tags .added_tags'),
    existingTagsBlock = tagsInput.parentElement.querySelector('.existing_tags'),
    generalFormMessage = document.querySelector('.general_form_message');

    function closeFormMes(){
        generalFormMessage.classList.remove('active');
    }

    const tagsInputObj = {                  //Объект для взаимодействия с полем инпут тегов
        tagsInput: tagsInput,
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
        },
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

            this.tagsInput.addEventListener('focus', this.removeValidateError.bind(this));
            this.tagsInput.addEventListener('input', this.removeValidateError.bind(this));
        },
        removeValidateError(){
            const fieldErrorInf = this.tagsInput.parentElement.parentElement.querySelector('.field_error_inf');
            this.tagsInput.parentElement.classList.remove('invalid');
            fieldErrorInf?.remove();
            this.tagsInput.removeEventListener('focus', this.removeValidateError);
            this.tagsInput.removeEventListener('input', this.removeValidateError);
        }
    }


//Класс-предаставление меню с существующими тегами, которые похожи на вводимый тег
class existingTagsMenu{

    maxColOfTags;
    existingTagsBlock;
    tagsInput;

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

    menuCloseHandler(event){
        if(event.target.closest('.existing_tags')) return;
        this.close();
    }

    clear(){
        this.existingTagsBlock.innerHTML = '';
    }

    close(){
        this.clear();
        this.existingTagsBlock.classList.add('closed');
        document.removeEventListener('click', this.menuCloseHandler.bind(this));
    }

    open(){
        this.existingTagsBlock.classList.remove('closed');
        document.addEventListener('click', this.menuCloseHandler.bind(this));
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
//Добавление тега на страницу
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
    if(ev.key === 'Enter'){
        if(actualActiveTags.length < existingTags.maxColOfTags)
            addTagInList(tagsInputObj.tagsInput.value);
    }
};



//Конструктор постов
const postConstructor = new PostConstructor();



//Отправка поста на сервер
