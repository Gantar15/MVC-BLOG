
const header = document.querySelector('.header');

header.style.backgroundPosition = 'center 0px';

const headerHeadside = header.querySelector('.header_headside');

let filler = document.createElement('div');
filler.style.width = '100%';
filler.style.height = headerLine.offsetHeight + 'px';
headerLineBottomPos = headerLine.offsetTop + headerLine.offsetHeight;

headerLine.style.top = -headerLine.offsetHeight + 'px';
window.addEventListener('scroll', ()=>{

    //При определенной прокрутке меняем стили верхней полосы навигации
    if(window.pageYOffset > header.offsetTop + header.offsetHeight){
        headerLine.style.top = -headerHeadside.offsetHeight - 1 + 'px';
        if(!headerLine.classList.contains('active')) {
            //Вставляем заполнитель вместо верхней полоски, чтобы страница не прыгала хы
            headerLine.before(filler);

            headerLine.style.position = 'fixed';
            headerLine.classList.add('active');
        }
    } else{
        if(headerLine.classList.contains('active')) {
            headerLine.style.top = -headerLine.offsetHeight + 'px';

            if(window.pageYOffset < headerLineBottomPos) {
                filler.remove();
                headerLine.style.position = '';
                headerLine.classList.remove('active');
            }
        }

        //Закрываем окошко пользователя при скроле
        if(userBlock) {
            userBlock.classList.remove('active');
            setTimeout(() => {
                userBlockBody.style.display = 'none';
            }, 200);
        }
    }
});
window.dispatchEvent(new Event('scroll'));


