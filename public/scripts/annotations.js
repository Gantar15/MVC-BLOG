
//Чтобы прикрепить блок с уведомлением к элементам с определенным селектором, нужно передать этот селекторв конструктор
//Так же блок, для которого будет отображаться уведомление должен иметь аттрибут data-annotation-content с текстом сообщения
//Так же аттрибутом data-annotation-top можно изменить положение блока с уведомлением по умолчанию, так чтобы он распологался над родительским блоком

export default class Annotations{
    parentNodeSelector;

    constructor(parentNodeSelector) {
        this.parentNodeSelector = parentNodeSelector;
    }

    addStyles(annotationBlock){
        annotationBlock.classList.add('annotation_message_box');
        annotationBlock.style.cssText = `
            background-color: #4a4a4deb;
            border-radius: 3px;
            font: normal 13px Open Sans;
            padding: 7px 8px;
            color: white;
            white-space: pre;
            transition: all 150ms;
        `;
    }

    //Появление аннотации
    fadeIn(annotationBlock, orientation){
        if(orientation == 'top') {
            annotationBlock.style.top = -annotationBlock.offsetHeight - 15 + 'px';
            annotationBlock.style.opacity = "1";
        }
        else{
            annotationBlock.style.bottom = -annotationBlock.offsetHeight - 15 + 'px';
            annotationBlock.style.opacity = "1";
        }
    }

    //Исчезновение аннотации
    fadeOut(annotationBlock, orientation){
        if(orientation == 'top'){
            annotationBlock.style.transform = "translateY(-5px)";
            annotationBlock.style.opacity = "0";
        }
        else{
            annotationBlock.style.transform = "translateY(5px)";
            annotationBlock.style.opacity = "0";
        }
    }

    showAnnotationsHandler = event => {
        const parentNode = event.target.closest(this.parentNodeSelector);
        if(!parentNode || !parentNode.dataset.annotationContent || parentNode.isSettled) return;

        let annotationBlock = document.createElement('div');
        this.addStyles(annotationBlock);
        parentNode.style.position = "relative";
        annotationBlock.style.position = 'absolute';
        annotationBlock.innerText = parentNode.dataset.annotationContent;
        annotationBlock.style.opacity = "0";
        parentNode.append(annotationBlock);
        annotationBlock.style.display = "";

        //Если отображаем блок выше родительского блока
        let boundingRect;
        if(parentNode.hasAttribute('data-annotation-top')){
            this.fadeIn(annotationBlock, 'top');    //Анимируем появление аннтоции
            annotationBlock.style.top = -annotationBlock.offsetHeight - 10 + 'px';
            boundingRect = annotationBlock.getBoundingClientRect();
            if (boundingRect.top < 0) {                     //Если блок выше видимой области
                annotationBlock.style.top = "";
                annotationBlock.style.bottom = -annotationBlock.offsetHeight - 10 + 'px';
            }
        }
        //Если отображаем блок ниже родительского блока
        else {
            this.fadeIn(annotationBlock, 'bottom');         //Анимируем появление аннтоции
            annotationBlock.style.bottom = -annotationBlock.offsetHeight - 10 + 'px';
            boundingRect = annotationBlock.getBoundingClientRect();
            if (boundingRect.bottom > document.documentElement.clientHeight) {      //Если блок ниже видимой области
                annotationBlock.style.bottom = "";
                annotationBlock.style.top = -annotationBlock.offsetHeight - 10 + 'px';
            }
        }

        //Центрируем блок относительно родительского блока
        const marg = ~~((parentNode.offsetWidth - annotationBlock.offsetWidth) / 2);
        annotationBlock.style.left = marg + "px";

        boundingRect = annotationBlock.getBoundingClientRect();
        //Если блок левее видимой облости
        if(boundingRect.left < 0) {
            annotationBlock.style.left = -boundingRect.left - Math.abs(marg) + 10 + "px";
        }
        //Если блок правее видимой облости
        else if(boundingRect.right > document.documentElement.scrollWidth) {
            let diff = boundingRect.right - document.documentElement.clientWidth;
            annotationBlock.style.left = "";
            annotationBlock.style.right = diff - Math.abs(marg) + 10 + "px";
        }

        parentNode.isSettled = true;            //Ключ для того, чтобы координаиты расситывались только один раз
        parentNode.onpointerleave = () => {
            parentNode.isSettled = false;
            this.hideAnnotationsHandler(annotationBlock, parentNode.hasAttribute('data-annotation-top') ? 'top' : 'bottom');
        }
    }

    hideAnnotationsHandler = (annotationBlock, orientation) => {
        this.fadeOut(annotationBlock, orientation);
        setTimeout(() => annotationBlock.remove(), 155)
    }

    dispatch(){
        document.addEventListener('pointerover', this.showAnnotationsHandler);
    }

    turnOff(){
        document.removeEventListener('pointerover', this.showAnnotationsHandler);
    }
}