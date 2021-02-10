
const viewStart = Date.now();
let firstKey = false;

window.addEventListener('load', () => {
    const allPostTextHeight = document.querySelector('.post_activities').getBoundingClientRect().top + window.pageYOffset;

    const firstKeyHandler = () => {
        const userPointViewHeight = window.pageYOffset + document.documentElement.clientHeight;
        if(userPointViewHeight / allPostTextHeight * 100 >= 50){
            firstKey = true;
            window.removeEventListener('scroll', firstKeyHandler);
        }
    };
    window.addEventListener('scroll', firstKeyHandler);


    //Если пользовател просмотрел больше половины статьи и пробыл на странице поста больше 53.5 секунд, защитываем просмотр статьи
    window.addEventListener('unload', () => {
        const viewEnd = Date.now();

        if(viewEnd - viewStart > 53500 && firstKey){
            const formD = new FormData();
            formD.set('increment_views', true);

            navigator.sendBeacon('', formD);
        }
    });
    setInterval(() => {
    }, 1000);

});