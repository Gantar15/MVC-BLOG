
import waveButtonDispatcher from "../wave_button.js";

const activitiesSlider = document.querySelector('.activities_slider');
const subMenuTriggers = activitiesSlider?.querySelectorAll('.user_activities_menu .profile_submenu');
const userActivitiesMenu = document.querySelector('.user_activities_menu:nth-of-type(1)');
const nextUserActivitiesMenu = document.querySelector('.user_activities_menu:nth-of-type(2)');
if(nextUserActivitiesMenu)
    nextUserActivitiesMenu.style.bottom = -nextUserActivitiesMenu.offsetHeight + "px";

//Слайдер для панели пользователя
if(subMenuTriggers?.length > 0){
    subMenuTriggers.forEach( trigger => trigger.onclick = () => {
        activitiesSlider.classList.toggle('active');

        if(activitiesSlider.classList.contains('active')) {
            userActivitiesMenu.style.bottom = -userActivitiesMenu.offsetHeight + "px";
            setTimeout(() => nextUserActivitiesMenu.style.bottom = nextUserActivitiesMenu.offsetHeight+"px", 70);
        }
        else{
            nextUserActivitiesMenu.style.bottom = -nextUserActivitiesMenu.offsetHeight + "px";
            setTimeout(() => userActivitiesMenu.style.bottom = 0+"px", 70);
        }
    } );
}


//Анимация при нажатии на пункт из панели пользователя
const menuButtons = document.querySelectorAll('.user_activities_menu .item:not(.profile_submenu)');
waveButtonDispatcher([...menuButtons]);


//Перемещение нижнего ползунка под активированый пункт слайдера
menuButtons.forEach(button => button.addEventListener('click', () => setMenuPointHandler(button)));
setMenuPointHandler(menuButtons[0]);

function setMenuPointHandler(button){
    let activeLineNode = button.closest('.user_activities_menu').querySelector('.bottom_line.visible');
    if(!activeLineNode){
        activeLineNode = userActivitiesMenu.querySelector('.bottom_line.visible');
        if(activeLineNode) {                                  //Если мы перемещаем активацию пункта из одного блока слайдера в другой
            activeLineNode.classList.remove('visible');
            activeLineNode = nextUserActivitiesMenu.querySelector('.bottom_line');

            activeLineNode.style.transition = 'left 0s';
            setLineCoord(activeLineNode, button);
            activeLineNode.style.transition = '';

            activeLineNode.classList.add('visible');
        }
        else {                                          //Если мы перемещаем активацию пункта из одного блока слайдера в другой
            activeLineNode = nextUserActivitiesMenu.querySelector('.bottom_line.visible');
            activeLineNode.classList.remove('visible');
            activeLineNode = userActivitiesMenu.querySelector('.bottom_line');

            activeLineNode.style.transition = 'left 0s';
            setLineCoord(activeLineNode, button);
            activeLineNode.style.transition = '';

            activeLineNode.classList.add('visible');
        }
    }
    removeActiveButtons(menuButtons);       //Удаляем выделение с активного пункта слайдера
    setActiveButton(button, activeLineNode);      //Добавляем выделение
}
function removeActiveButtons(menuButtons){
    [...menuButtons].find(btn => btn.classList.contains('active'))?.classList.remove('active');
}
function setActiveButton(button, lineNode){
    button.classList.add('active');
    lineNode.style.width = button.offsetWidth + 1 + "px";
    setLineCoord(lineNode, button);
}
function setLineCoord(lineNode, button){
    lineNode.style.left = button.offsetLeft + "px";
}