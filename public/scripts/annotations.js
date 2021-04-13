
//Чтобы прикрепить блок с уведомлением к элементам с определенным селектором, нужно передать этот селекторв конструктор
//Так же блок, для которого будет отображаться уведомление должен иметь аттрибут data-annotation-content с текстом сообщения
//Так же аттрибутом data-annotation-top можно изменить положение блока с уведомлением по умолчанию, так чтобы он распологался над родительским блоком

export default class Annotations{
    annotationBlock;
    parentNodes;
    parentNodeSelector;

    constructor(parentNodeSelector) {
        this.annotationBlock = document.createElement('div');
        this.parentNodeSelector = parentNodeSelector;
        this.parentNodes = [...document.querySelectorAll(parentNodeSelector)].filter(el => el.dataset.annotationContent);

        this.addStyles();
    }
    addStyles(){
        this.annotationBlock.style.cssText = `
            background-color: rgba(72, 72, 75, 0.76);
            border-radius: 3px;
            font: normal 13px Open Sans;
            padding: 7px 8px;
            color: white;
            white-space: pre;
        `;
    }

    showAnnotationsHandler = event => {
        this.annotationBlock.style.display = "";

        const parentNode = event.target.closest(this.parentNodeSelector);
        parentNode.style.position = "relative";
        this.annotationBlock.style.position = 'absolute';
        this.annotationBlock.innerText = parentNode.dataset.annotationContent;
        parentNode.append(this.annotationBlock);

        //Если отображаем блок выше родительского блока
        let boundingRect;
        if(parentNode.hasAttribute('data-annotation-top')){
            this.annotationBlock.style.top = -this.annotationBlock.offsetHeight - 10 + 'px';
            boundingRect = this.annotationBlock.getBoundingClientRect();
            if (boundingRect.top < 0) {                     //Если блок выше видимой области
                this.annotationBlock.style.top = "";
                this.annotationBlock.style.bottom = -this.annotationBlock.offsetHeight - 10 + 'px';
            }
        }
        //Если отображаем блок ниже родительского блока
        else {
            this.annotationBlock.style.bottom = -this.annotationBlock.offsetHeight - 10 + 'px';
            boundingRect = this.annotationBlock.getBoundingClientRect();
            if (boundingRect.bottom > document.documentElement.clientHeight) {      //Если блок ниже видимой области
                this.annotationBlock.style.bottom = "";
                this.annotationBlock.style.top = -this.annotationBlock.offsetHeight - 10 + 'px';
            }
        }

        //Центрируем блок относительно родительского блока
        const marg = ~~((parentNode.offsetWidth - this.annotationBlock.offsetWidth) / 2);
        this.annotationBlock.style.left = marg + "px";

        boundingRect = this.annotationBlock.getBoundingClientRect();
        //Если блок левее видимой облости
        if(boundingRect.left < 0) {
            this.annotationBlock.style.left = -boundingRect.left - Math.abs(marg) + 10 + "px";
        }
        //Если блок правее видимой облости
        else if(boundingRect.right > document.documentElement.scrollWidth) {
            let diff = boundingRect.right - document.documentElement.clientWidth;
            this.annotationBlock.style.left = "";
            this.annotationBlock.style.right = diff - Math.abs(marg) + 10 + "px";
        }
    }
    hideAnnotationsHandler = () => {
        this.annotationBlock.style.display = "none";
        this.annotationBlock.style.bottom = "";
        this.annotationBlock.style.top = "";
        this.annotationBlock.style.left = "";
        this.annotationBlock.style.right = "";
    }
    dispatch(){
        this.parentNodes.forEach(el => {
            if(!el.annotationChecked) {
                el.addEventListener('mouseenter', this.showAnnotationsHandler);
                el.addEventListener('mouseleave', this.hideAnnotationsHandler);
                el.annotationChecked = true;
            }
        });
    }
    turnOff(){
        parentNodes.forEach(el => {
            el.removeEventListener('mouseenter', this.showAnnotationsHandler);
            el.removeEventListener('mouseleave', this.hideAnnotationsHandler);
        });
    }
}