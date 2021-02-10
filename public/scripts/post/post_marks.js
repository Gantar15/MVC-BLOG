
const postMarks = document.querySelector('.post_marks');
const like = postMarks.querySelector('.likes'),
    dislike = postMarks.querySelector('.dislikes');
const colOfLikes = like.querySelector('p'),
    colOfDislikes = dislike.querySelector('p');


async function getPostMarks(){
    const formD = new FormData();
    formD.set('get_post_marks', '');

    const response = await fetch('', {
        method: 'post',
        body: formD
    });

    return await response.json();
}
let authorizeUserId;
//Получаем количество лайков и дизлайков с сервера и рендерим их, так же получаем айди залогинненого пользователя
getPostMarks().then(marksInfo => {
    if(+marksInfo.likes) {
        colOfLikes.innerText = marksInfo.likes;
    }
    if(+marksInfo.dislikes) {
        colOfDislikes.innerText = marksInfo.dislikes;
    }
    authorizeUserId = marksInfo['user_id'];


    //Оценки может ставить только авторизованный пользователь
    if(authorizeUserId) {
        async function getActiveMarkType() {
            const formD = new FormData();
            formD.set('get_active_mark_type', '');

            const response = await fetch('', {
                method: 'post',
                body: formD
            });

            return await response.json();
        }

        let activeMarkType;
        getActiveMarkType().then(res => {
            activeMarkType = res['mark_type'];
            if (activeMarkType) {
                switch (activeMarkType) {
                    case 'like':
                        like.classList.add('active');
                        break;
                    case 'dislike':
                        dislike.classList.add('active');
                        break;
                }
            }
        });


        postMarks.addEventListener('click', (event) => {

            const target = event.target;
            if (!target.closest('.likes, .dislikes')) return;

            function decrementLikes() {
                let likes = +colOfLikes.innerText - 1;
                likes = likes < 0 ? 0 : likes;
                if (likes === 0) {
                    colOfLikes.innerText = '';
                } else {
                    colOfLikes.innerText = likes;
                }
            }

            function decrementDislikes() {
                let dislikes = +colOfDislikes.innerText - 1;
                dislikes = dislikes < 0 ? 0 : dislikes;
                if (dislikes === 0) {
                    colOfDislikes.innerText = '';
                } else {
                    colOfDislikes.innerText = dislikes;
                }
            }

            function incrementLikes() {
                colOfLikes.innerText = +colOfLikes.innerText + 1;
            }

            function incrementDislikes() {
                colOfDislikes.innerText = +colOfDislikes.innerText + 1;
            }

            function marksRefresh(likes, dislikes) {
                let formData = new FormData();
                formData.set('post_likes', likes);
                formData.set('post_dislikes', dislikes);
                formData.set('type_of_mark', activeMarkType);

                fetch('', {
                    method: 'post',
                    body: formData
                });
            }

            //Ставим лайки
            if (like.contains(event.target)) {
                //Добавляем лайк и удаляем дизлайк
                if (activeMarkType !== 'like') {

                    if (activeMarkType === 'dislike') {
                        decrementDislikes();
                        dislike.classList.remove('active');
                    }
                    incrementLikes();
                    like.classList.add('active');
                    activeMarkType = 'like';

                    //Посылаем запрос на обновление лайков и дизлайков
                    marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText);
                }
                //Удаляем лайк
                else {
                    decrementLikes();
                    like.classList.remove('active');
                    activeMarkType = 'undefined';

                    //Посылаем запрос на обновление лайков и дизлайков
                    marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText);
                }
            }

            //Ставим дизлайки
            else if (dislike.contains(event.target)) {
                //Добавляем дизлайк и удаляем лайк
                if (activeMarkType !== 'dislike') {

                    if (activeMarkType === 'like') {
                        decrementLikes();
                        like.classList.remove('active');
                    }
                    incrementDislikes();
                    dislike.classList.add('active');
                    activeMarkType = 'dislike';

                    //Посылаем запрос на обновление лайков и дизлайков
                    marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText);
                }
                //Удаляем дизлайк
                else {
                    decrementDislikes();
                    dislike.classList.remove('active');
                    activeMarkType = 'undefined';

                    //Посылаем запрос на обновление лайков и дизлайков
                    marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText);
                }
            }
        });
    }
});


//При нажатии на кнопку подписаться или получать уведомления авторизованным пользователем, отправляем соответствующий запрос на сервер
const subscribe = document.querySelector('.subscribe');
const notifications = document.querySelector('.notifications');

//Если кнопки нажимает авторизированный пользователь, то продолжаем
if(authorizeUserId) {
    subscribe.addEventListener('click', () => {

    });

    notifications.addEventListener('click', () => {

    });
}