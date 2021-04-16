
export default class pageNotification{

    messageBox;
    isBoxActive = false;    //Флаг говорит о том, что уведомление еще не закрыто

    constructor() {
        this.messageBox = document.createElement('div');
        this.messageBox.style.cssText = `
            background-color: #2b2b2df2;
            border-radius: 3px;
            font: normal 14px Open Sans;
            padding: 15px 13px;
            color: rgb(239, 239, 239);
            white-space: pre;
            transition: all 150ms ease-in;
            position: fixed;
            opacity: 0;
            left: 13px;
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
                setTimeout(() => this.isBoxActive = false, 100);
            }, 150);
        }, 1050);
    }

    render(text){
        const offHandl = () => {
            if(!this.isBoxActive){
                this.messageBox.style.display = '';
                setTimeout(() => this.displayBox(text));
                return;
            }
        };
        offHandl();
    }

}