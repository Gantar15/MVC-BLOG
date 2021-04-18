
//Как buttonsSubject может быть передан селектор кнопок или массив дом узлов

export default function waveButtonDispatcher(buttonsSubject, waveColor = "#83838321", animationTime = 500) {

    if(!buttonsSubject) throw new Error("Первый параметр не передан");

    if(typeof buttonsSubject === "string"){
        const buttonSelector = buttonsSubject;
        document.addEventListener('click', event => {
            if(!event.target.closest(buttonSelector)) return;

            clickHandler(event);
        });
    }
    else if(Array.isArray(buttonsSubject)){
        buttonsSubject.forEach( node => {
            if(!(node instanceof HTMLElement)) return;

            node.addEventListener('click', clickHandler);
        });
    }
    else
        throw new Error("Некорректный тип первого параметра");


    function clickHandler(event) {
        const clickCoords = {               //Координаты клика
            x: event.clientX,
            y: event.clientY
        };

        const rect = this.getBoundingClientRect();
        const waveElem = document.createElement('div');
        addStyles(waveElem);
        waveElem.className = 'wave_elem';

        const waveStartCoords = {               //Начальные координаты распространяющегося блока
            x: clickCoords.x - rect.left,
            y: clickCoords.y - rect.top
        }
        this.append(waveElem);

        waveElem.style.top = waveStartCoords.y + "px";
        waveElem.style.left = waveStartCoords.x + "px";

        const scaleRatio = Math.ceil(this.offsetWidth * 2 / waveElem.offsetWidth);     //Коэфициент увеличения
        setTimeout(() => {
            scaleWave(waveElem, scaleRatio);
        });

        removeWave(waveElem);
    }

    function addStyles(waveElem){
        waveElem.style.cssText = `
            z-index: 0;
            background-color: ${waveColor};
            border-radius: 50%;
            position: absolute;
            width: 5px;
            height: 5px;
            transition: transform ${animationTime}ms ease-in-out, opacity ${animationTime-200}ms;
        `;
    }

    function removeWave(waveElem){
        setTimeout(() => waveElem.style.opacity = 0.2, animationTime-200);
        setTimeout(() => waveElem.remove(), animationTime+10);
    }

    function scaleWave(waveElem, scaleRatio){
        waveElem.style.transform = `scale(${scaleRatio})`;
    }
}