
function getTemplate(placeholder = "Select :3", data = []){

    let selectItems = data.reduce((items, el) => {
        return items + `<li class="select__item" data-type="item" data-id="${el.id}">${el.value}</li>`;
    }, "");

    return `
        <div class="background__element"></div>
        <div class="select__input" data-type="input">
            <span data-type="value">${placeholder}</span>
            <i data-type="arrow"></i>
        </div>
        <div class="select__dropdown">
            <ul class="select__list">
                ${selectItems}
            </ul>
        </div>
    `;
}


export default class Select{

    constructor(selector, options, callback = ()=>{}){
        this.$element = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId;
        this.callback = callback;

        this.render();
        this.setup();

        this.selectedId ? this.select(this.selectedId) : null;
    }

    render(){
        const {placeholder} = this.options,
        {data} = this.options;

        this.$element.classList.add("select");
        this.$element.innerHTML = getTemplate(placeholder, data);
    }

    setup(){
        this.clickHandler = this.clickHandler.bind(this);

        this.$element.addEventListener("click", this.clickHandler);

        this.$arrow = this.$element.querySelector("[data-type=arrow]");
        this.$value = this.$element.querySelector("[data-type=value]");

        this.$selectDropdown = this.$element.querySelector(".select__dropdown"),
        this.$selectInput = this.$element.querySelector(".select__input");
        this.$selectDropdown.style.top = this.$selectInput.offsetHeight + "px";
    }

    clickHandler(event){
        if(event.target.closest("[data-type=input]")){
            this.isOpen ? this.close() : this.open();
        } else if(event.target.closest("[data-type=item]")){
            this.select(event.target.dataset.id);
        } else if(event.target.matches(".background__element")){
            this.close();
        }
    }

    get selectedItem(){
        return this.options.data.find((el => el.id == this.selectedId));
    }

    select(id){
        this.selectedId = id;
        this.$value.innerHTML = this.selectedItem.value;

        const $selected = this.$element.querySelector(".selected");
        if($selected) $selected.classList.remove("selected");
        this.$element.querySelector(`[data-id="${id}"]`).classList.add("selected");

        this.callback ? this.callback(this.selectedItem) : null;

        this.$selectDropdown.style.top = this.$selectInput.offsetHeight + "px";

        this.close();
    }

    get isOpen(){
        return this.$element.classList.contains("open");
    }

    open(){
        this.$element.classList.add("open");
        this.$arrow.classList.add("icon-up");
    }

    close(){
        this.$element.classList.remove("open");
        this.$arrow.classList.remove("icon-up");
    }

    destroy(){
        this.$element.removeEventListener("click", this.clickHandler);
        this.$element.innerHTML = "";
    }
}