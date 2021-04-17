
const headerLine = document.querySelector('.header_line');
const headerNav = document.querySelector('.header_nav');
const burger = document.querySelector('.burger');

const points = document.querySelector('.points');

let pointsInf;
if(points){
    pointsInf = points.querySelector('.points_inf');
}

const userBlockName = document.querySelector('.user_block_head > p:first-of-type'),
    userAvatar = document.querySelector('.user_avatar'),
    userBlock = document.querySelector('.user_block'),
    userBlockBody = document.querySelector('.user_block_body');

if (userBlockBody) {
    userBlockBody.style.display = 'none';
}
document.addEventListener('click', (event) => {
    if (burger && burger.contains(event.target)) {
        headerNav.classList.toggle('active');
        points && points.classList.toggle('active');
    }

    //Отображение меню пользователя
    if (userBlock) {
        if (userBlock.contains(event.target)) {
            if (userBlock && !userBlock.classList.contains('active')) {
                userBlockBody.style.display = '';
            } else {
                setTimeout(() => {
                    userBlockBody.style.display = 'none';
                }, 200);
            }
            setTimeout(() => {
                userBlock.classList.toggle('active');
            }, 0);
        } else if (userBlockBody && !userBlockBody.contains(event.target)) {
            userBlock.classList.remove('active');
            setTimeout(() => {
                userBlockBody.style.display = 'none';
            }, 200);
        }
    }
});


//Прячем верхнюю панель навигации в бургер меню при уменьшении размера страницы
const headerMainNavigation = document.querySelector('.header .main_navigation');
window.addEventListener('resize', () => {
    if(!headerMainNavigation) return;
    if(window.innerWidth <= 828){
        pointsInf && pointsInf.append(headerMainNavigation);
    }
    else{
        const userActions = document.querySelector('.user_actions');
        if(userActions){
            userActions.after(headerMainNavigation);
        }
    }
});
window.dispatchEvent(new Event('resize'));
