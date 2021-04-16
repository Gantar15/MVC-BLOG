
export default class pageNotification{

    messageBox;
    isBoxActive = false;    //Флаг говорито том, что уведомление еще не закрыто

    constructor() {
        this.messageBox = document.createElement('div');
        this.messageBox.style.cssText = `
            background-color: #202021e3;
            border-radius: 3px;
            font: normal 14px Open Sans;
            padding: 15px 13px;
            color: white;
            white-space: pre;
            transition: all 150ms ease-out;
            position: fixed;
            left: 13px;
            opacity: 0;
            z-index: 10;
        `;
        document.body.append(this.messageBox);
        this.messageBox.style.bottom = - this.messageBox.offsetHeight + "px";
    }

    displayBox(text){
        this.isBoxActive = true;
        this.messageBox.textContent = text;
        this.messageBox.style.opacity = 1;
        this.messageBox.style.bottom = "13px";

        setTimeout(() => {
            this.messageBox.style.bottom = -this.messageBox.offsetHeight + "px";
            this.messageBox.style.opacity = 0;
            setTimeout(() => {
                this.messageBox.style.display = 'none';
                this.isBoxActive = false;
            }, 150);
        }, 750);
    }

    render(text){
        const offHandl = () => {
            if(!this.isBoxActive){
                this.messageBox.style.display = '';
                setTimeout(() => this.displayBox(text));
                return;
            }
            else setTimeout(offHandl, 50);
        };
        offHandl();
    }

}