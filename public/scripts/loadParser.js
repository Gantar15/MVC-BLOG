
export default class LoadParser{

    constructor(parentNode, startLoadDuration, loadGifSrc) {
        this.parentNode = parentNode;
        this.startLoadDuration = startLoadDuration;
        this.loadGifSrc = loadGifSrc;
        this.parentNodeContent = this.parentNode.innerHTML;
    }

    start(){
        const startTime = Date.now();
        this.parentNode.style.pointerEvents = 'none';

        this.intervalId = setInterval(() => {
            const endTime = Date.now();
            //Если время от начала отправки формы до появления модального окна меньше startLoadDuration, не показывать загрузку
            if(endTime - startTime > this.startLoadDuration) {
                const loadGif = document.createElement('img');
                this.parentNode.innerHTML = '';
                loadGif.src = this.loadGifSrc;
                loadGif.classList = 'comments_container_load_box';      //Этит класс отвечает за гифку
                this.parentNode.append(loadGif);
                clearInterval(this.intervalId);
            }
        }, 10);
    }

    stop(){
        clearInterval(this.intervalId);
        this.parentNode.style.pointerEvents = '';
        this.parentNode.innerHTML = this.parentNodeContent;
    }

}