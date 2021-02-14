
import CommentsPagination from "./comments_pagination.js";
import LoadParser from "../loadParser.js";
import inputExplore from "../input_explorer.js";

const form = document.querySelector(".comments_send_block > form"),
    commentsBlockBody = document.querySelector('.comments_block_body'),
    commentsBlockHead = document.querySelector('.comments_block_body'),
    colOfComments = document.querySelector('.col_of_comments span'),
    emptyCommentsBlockMessage = document.querySelector('.empty_comments_block_message'),
    nextCommentsTrigger = commentsBlockBody.querySelector('.load_more_comments_button');

    let formInput;
    if(form){
       formInput = form.querySelector('textarea');
    }

inputExplore();     //Делаем динамическим размер поля инпута

const loadBlock = document.createElement('div');  //Блок загрузки комментов
loadBlock.className = 'load_block';

//Пагинация комметов
let pagination;

//Режим сортировки комментов по популярности - popular(по умолчанию), по дате - newest
let filterMode = 'popular';
//Загрузка комментов
let loaded = false;



function getCommentTemplate(comment, commentDataJson, type, addClass = ''){
    const userDataJson = commentDataJson['user_data'],
        recentlyAddedCommentId = +commentDataJson['recently_added_comment_id'];

    const hash = pagination.hashCode(recentlyAddedCommentId);
    pagination.commentsHashIds[hash] = recentlyAddedCommentId;

    return `
                    <div class="${type} ${addClass}">
                        <div id = 'comment_id' style="display: none">${hash}</div>
                        <a href="/account/userprofile/${userDataJson.id}" class="user_avatar">
                            <img src="/public/users_icons/${userDataJson.id}.png" alt="avatar">
                        </a>
                        <div class="inner_comment_box">
                            <div class="user_information">
                                <a href="/account/userprofile/${userDataJson.id}" class="user_name">${userDataJson.name}</a>
                                <div class="post_date">только что</div>
                            </div>
                            <p class="comment_text">
                                ${comment}
                            </p>
                            <div class="end_comment_block">
                                <div class="comment_activities">
                                    <p class="answer_button">
                                        Ответить
                                    </p>
                                    <div class="marks">
                                        <div class="likes_block">
                                            <div class="like"></div>
                                            <p></p>
                                        </div>
                                        <div class="dislikes_block">
                                            <div class="dislike"></div>
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment_menu_trigger">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
    `;
}


//Делает теги безопасными
function stripTags(str){
    str = str.replaceAll('<', '&lt;');
    str = str.replaceAll('>', '&gt;');
    return str;
}


//Скрываем кнопку (еще) до того момента, пока не загрузятся комменты
if(nextCommentsTrigger) {
    nextCommentsTrigger.style.display = 'none';
}


window.addEventListener('scroll', ()=>{
    //Подключает загрузку комментов, когда юзер до них доскролит
    if(window.pageYOffset + document.documentElement.clientHeight < commentsBlockHead.offsetTop + commentsBlockHead.offsetHeight - 25) return;

    if(!loaded) {
        //Подключаем пагинацию комментов
        pagination = new CommentsPagination('', commentsBlockBody, +colOfComments.innerText, nextCommentsTrigger, 0, filterMode,() => {
            if(nextCommentsTrigger) {
                loadBlock.style.display = 'none';
            }
            if(nextCommentsLoader) {
                nextCommentsLoader.stop();
            }
            loader.stop();
            nextCommentsTrigger.style.display = 'none';
        });
        pagination.preRenderSetup();

        let loader, nextCommentsLoader;
        //Подключает загрузку комментов, когда юзер до них доскролит, если комментариев > 0
        if(pagination.colOfAllComments > 0) {
            commentsBlockBody.prepend(loadBlock);

            loader = new LoadParser(loadBlock, 0, '/public/imgs/comment_loading.gif');
            loader.start();

            let loadTime;
            if(pagination.colOfAllComments <= 3){
                loadTime = 300;
            } else if(pagination.colOfAllComments <= 7){
                loadTime = 400;
            } else{
                loadTime = 500;
            }
            let Id = setInterval(async () => {
                if (pagination.isCommentsReady) {
                    await pagination.render();
                    commentsMenusRender(document.querySelector('.comments_block_body'));
                    clearInterval(Id);
                }
            }, loadTime);
        }


        //Подключаем загрузку комментов при нажатии на (еще)
        if(nextCommentsTrigger) {
            nextCommentsTrigger.onclick = () => {
                nextCommentsLoader = new LoadParser(nextCommentsTrigger, 0, '/public/imgs/comment_loading.gif');
                pagination.getNextComments();
                pagination.preRenderSetup();
                nextCommentsLoader.start();

                //Рендерим комменты и убираем загрузку со страницы, когда у нас уже есть готовый html-код комментариев
                let itrvId = setInterval(async () => {
                    if (pagination.isCommentsReady) {
                        await pagination.render();
                        commentsMenusRender(document.querySelector('.comments_block_body'));
                        clearInterval(itrvId);
                    }
                }, 500);
            };
        }

        loaded = true;
    }
});

window.dispatchEvent(new Event('scroll'));




//Добавление комментариев
if(form) {
    form.addEventListener('submit', async function (event) {

        event.preventDefault();
        //Загрузка при отправке комментария
        commentsBlockBody.prepend(loadBlock);
        loadBlock.style.display = '';
        let loader = new LoadParser(loadBlock, 0, '/public/imgs/comment_loading.gif');
        loader.start();

        let url = form.action;
        let method = form.method;

        //Объявляем тип отсылаемой записи (комментарий) и отправляем ее на сервер
        const fData = new FormData(form);
        let commentWithLines = fData.get('comment');
        commentWithLines = stripTags(commentWithLines);         //Заменяем теги на их безопасные версии
        commentWithLines = commentWithLines.replaceAll('\n', '<br/>');
        commentWithLines = pagination.getCommentUnicodeStr(commentWithLines);
        fData.set('comment', commentWithLines);
        fData.set('record_type', 'comment');
        let response = await fetch(url, {
            method: method,
            body: fData
        });

        if (response.ok) {
            //Если у нас не было комментов до добавление этого комментария, то удаляем надпись о отсутствии комментов
            //И уменьшаем отступ от кнопки еще
            if (emptyCommentsBlockMessage) {
                emptyCommentsBlockMessage.style.display = 'none';
                const commentsBlockBody = document.querySelector('.comments_block_body');
                commentsBlockBody.style.paddingBottom = '20px';
            }

            let comment = stripTags(form.comment.value);
            comment = comment.replaceAll('\n', '<br/>');
            let commentDataJson = await response.json();

            form.reset();
            formInput.blur();

            //Рендерим коммент и останавливаем загрузку
            setTimeout(()=>{
                loader.stop();
                colOfComments.innerText = +colOfComments.innerText + 1;
                commentsBlockBody.insertAdjacentHTML('afterbegin', getCommentTemplate(comment, commentDataJson, 'comment'));
                loadBlock.remove();
                const recentlyAddedComment = commentsBlockBody.querySelector('.comment');
                commentsMenusRender(recentlyAddedComment);          //Рендерим меню для комментария
                pagination.forbidEdit(recentlyAddedComment);   //Запрещаем изменение айди комментария
            }, 500);
        }

    });
}




//Лайки и дизлайки
commentsBlockBody.addEventListener('click', (event)=>{
    let comment = event.target.closest('.answer');
    if(!comment) {
        comment = event.target.closest('.comment');
    }
    if(comment && pagination.authorizeUserId) {
        const like = comment.querySelector('.likes_block'),
            dislike = comment.querySelector('.dislikes_block');

        if(!like.contains(event.target) && !dislike.contains(event.target)) return; //Если мы кликнули не по лаку и не по дизлайку, то ничего не делаем

        const colOfLikes = like.querySelector('p'),
            colOfDislikes = dislike.querySelector('p');

        const hashCommentId = +comment.querySelector('#comment_id').innerText;
        const commentId = pagination.commentsHashIds[hashCommentId];

        //Определяем тип активной отметки на данном комменте
        let marksSearchArr;
        if(comment.classList.contains('answer')){
            marksSearchArr = pagination.answersWithActiveMarksData;
        }else{
            marksSearchArr = pagination.commentsWithActiveMarksData;
        }
        let answerMarksData = marksSearchArr && marksSearchArr.find((commentData) => {
            return +commentData['parent_comment_id'] === commentId;
        });
        let activeMarkType = 'undefined';
        if(answerMarksData) {
            if (answerMarksData['mark_type'] == 'like') {
                activeMarkType = 'like';
            } else if (answerMarksData['mark_type'] == 'dislike') {
                activeMarkType = 'dislike';
            }
        }

        function editAllCommentMarks(){
            const commentBl = comment.closest('.comment');
            const answersBlock = commentBl.querySelector('.answers_block'),
                afterLoadedAnswersBlock = commentBl.querySelector('.after_loaded_answers_block');

            if(afterLoadedAnswersBlock && answersBlock) {
                let answrs;
                //Если мы поставили оценку ответу в блоке под ответами, то этому же ответу в блоке ответов ставим такую же оценку
                if (afterLoadedAnswersBlock.contains(event.target)) {
                    answrs = Array.from(answersBlock.querySelectorAll('.answer'));
                }
                //Если мы поставили оценку ответу в блоке ответов, то этому же ответу в блоке под ответами ставим такую же оценку
                else if (answersBlock.contains(event.target)) {
                    answrs = Array.from(afterLoadedAnswersBlock.querySelectorAll('.answer'));
                }

                if(answrs) {
                    const answer = answrs.filter(el => {
                        const hashCommentId = +el.querySelector('#comment_id').innerText;
                        return pagination.commentsHashIds[hashCommentId] === commentId;
                    })[0];
                    if (answer) {
                        const likesBlc = answer.querySelector('.likes_block'),
                            dislikesBlc = answer.querySelector('.dislikes_block');

                        activeMarkType === 'like' ? likesBlc.classList.add('active') : likesBlc.classList.remove('active');
                        activeMarkType === 'dislike' ? dislikesBlc.classList.add('active') : dislikesBlc.classList.remove('active');
                        likesBlc.querySelector('p').innerText = colOfLikes.innerText;
                        dislikesBlc.querySelector('p').innerText = colOfDislikes.innerText;
                    }
                }
            }
        }

        function decrementLikes() {
            let likes = +colOfLikes.innerText - 1;
            likes = likes < 0 ? 0 : likes;
            if(likes === 0) {
                colOfLikes.innerText = '';
            } else{
                colOfLikes.innerText = likes;
            }
        }
        function decrementDislikes() {
            let dislikes = +colOfDislikes.innerText - 1;
            dislikes = dislikes < 0 ? 0 : dislikes;
            if(dislikes === 0) {
                colOfDislikes.innerText = '';
            } else{
                colOfDislikes.innerText = dislikes;
            }
        }
        function incrementLikes() {
            colOfLikes.innerText = +colOfLikes.innerText + 1;
        }
        function incrementDislikes() {
            colOfDislikes.innerText = +colOfDislikes.innerText + 1;
        }
       function marksRefresh(likes, dislikes, commentId) {
           if(answerMarksData)
               answerMarksData['mark_type'] = activeMarkType;
           else
               marksSearchArr.push({'parent_comment_id': commentId,
                   'mark_type': activeMarkType});

            let formData = new FormData();
            formData.set('likes', likes);
            formData.set('dislikes', dislikes);
            formData.set('comment_id', commentId);
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

                if(activeMarkType === 'dislike')
                {
                    decrementDislikes();
                    dislike.classList.remove('active');
                }
                incrementLikes();
                like.classList.add('active');
                activeMarkType = 'like';

                //Посылаем запрос на обновление лайков и дизлайков
                marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText, commentId);
            }
            //Удаляем лайк
            else {
                decrementLikes();
                like.classList.remove('active');
                activeMarkType = 'undefined';

                //Посылаем запрос на обновление лайков и дизлайков
                marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText, commentId);
            }
        }

        //Ставим дизлайки
        else if (dislike.contains(event.target)) {
            //Добавляем дизлайк и удаляем лайк
            if (activeMarkType !== 'dislike') {

                if(activeMarkType === 'like') {
                    decrementLikes();
                    like.classList.remove('active');
                }
                incrementDislikes();
                dislike.classList.add('active');
                activeMarkType = 'dislike';

                //Посылаем запрос на обновление лайков и дизлайков
                marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText, commentId);
            }
            //Удаляем дизлайк
            else {
                decrementDislikes();
                dislike.classList.remove('active');
                activeMarkType = 'undefined';

                //Посылаем запрос на обновление лайков и дизлайков
                marksRefresh(+colOfLikes.innerText, +colOfDislikes.innerText, commentId);
            }
        }

        editAllCommentMarks();          //Вносим такие же изменения отметок для ответа, который повторяется в блоке ответов или в блоке под блоком ответов(блоки блоки блоки ыыы)
    }
});




//Добавленияе ответов на комментарии
commentsBlockBody.addEventListener('click', (event) => {
    const target = event.target;

    //Если пользователь авторизирован и мы нажали на кнопку ответа, проходим далее
    if(target.closest('.answer_button')) {
        if (!pagination.authorizeUserId) {
            window.location.href = '/account/login';
        }
        if (pagination.authorizeUserId) {
            const endAnswerNode = target.closest('.end_comment_block');
            const upperComment = target.closest('.answer, .comment');
            const upperCommentHash = upperComment.querySelector('#comment_id').innerText;
            const upperCommentId = pagination.commentsHashIds[upperCommentHash];    //Айди комментария или ответа, для которого пользователь оставляет ответ

            //Если под данным комментом уже есть поле ввода ответа, то просто фокусимся на нем, иначе добавляем поле ответа
            if (endAnswerNode.querySelector('.comments_send_block')) {
                const answerInput = endAnswerNode.querySelector('.send_comment_input_block > textarea');
                answerInput.focus();
            } else {
                const answerSendTemplate = `
                    <div class="comments_send_block">
                        <img class="user_avatar" src="/public/users_icons/${pagination.authorizeUserId}.png" alt="user avatar">
                        <form action="" method="post">
                            <div class="send_comment_input_block">
                                <textarea required name="answer" placeholder="Оставьте свой ответ"></textarea>
                            </div>
                            <div class="buttons_block">
                                <button type="reset">Отмена</button>
                                <button disabled type="submit">Оветить</button>
                            </div>
                        </form>
                    </div>
                `;

                endAnswerNode.insertAdjacentHTML('beforeend', answerSendTemplate);
                inputExplore();     //Делаем динамическим размер поля инпута
                const answerSendBlock = endAnswerNode.querySelector('.comments_send_block');

                const answerInput = answerSendBlock.querySelector('.send_comment_input_block > textarea');
                const resetButton = answerSendBlock.querySelector('button[type=reset]');
                const submitButton = answerSendBlock.querySelector('button[type=submit]');
                const answerForm = answerSendBlock.querySelector('form');

                answerInput.focus();
                //Отключаем или включаем кнопку отправления при изменении контента инпута
                answerInput.addEventListener('input', () => {
                    if (answerInput.value) {
                        submitButton.disabled = false;
                    } else {
                        submitButton.disabled = true;
                    }
                });

                //Удаляем блок ответа и ивентлисенер при нажатии на отмена
                resetButton.onclick = () => {
                    resetButton.onclick = null;
                    answerSendBlock.remove();
                };


                //Отправка ответа на комментарий на сервер и его рендер
                const sendAnswer = async () => {
                    const parentComment = target.closest('.comment');
                    const innerCommentBox = parentComment.querySelector('.inner_comment_box');

                    const hashCommentId = +parentComment.querySelector('#comment_id').innerText;
                    const parentCommentId = pagination.commentsHashIds[hashCommentId];   //Айди родительского коммента


                    //Находим ДОМ-узел, под которым нужно рендерить загрузку (это коммент, на кнопку ответить которого пользователь нажал)
                    let parentRenderRecord = target.closest('.answer');
                    if(!parentRenderRecord){
                        parentRenderRecord = parentComment;
                    }

                    const answerLoaderBlock = document.createElement('div'); //Блок для загрузки
                    //Вставка блока для отображения загрузки перед вставкой ответа
                    answerLoaderBlock.className = 'answer_loader_block';
                    if(parentRenderRecord.classList.contains('comment')){
                        parentRenderRecord.querySelector('.end_comment_block').after(answerLoaderBlock);
                    } else{
                        parentRenderRecord.after(answerLoaderBlock);
                    }
                    let answerLoader = new LoadParser(answerLoaderBlock, 0, '/public/imgs/comment_loading.gif');
                    answerLoader.start();

                    function getUpperCommentAuthorId(upperComment){
                        return upperComment.querySelector('.user_avatar').href.match(/^.+\/(\d+)$/)[1];
                    }

                    //Объявляем тип отсылаемой записи (ответ на комментарий) и отправляем ее на сервер
                    const formDATA = new FormData(answerForm);
                    let finallyComment = formDATA.get('answer');
                    finallyComment = stripTags(finallyComment);         //Заменяем теги на их безопасные версии
                    finallyComment = finallyComment.replaceAll('\n', '<br/>');
                    finallyComment = pagination.getCommentUnicodeStr(finallyComment);        //Переводим обычный текст в юникод строку
                    if(upperCommentId != parentCommentId && getUpperCommentAuthorId(upperComment) != pagination.authorizeUserId){           //Если мы оставляем ответ под ответом, то добавляем в начало коммента имя пользователя, на чей коммент отвечаем
                        formDATA.set('upper_comment_id', upperCommentId);
                    }
                    formDATA.set('answer', finallyComment);
                    formDATA.set('parent_comment_id', parentCommentId);
                    formDATA.set('record_type', 'answer');
                    const response = await fetch('', {
                        method: 'post',
                        body: formDATA
                    });

                    //Рендерим ответ
                    if (response.ok) {
                        const commentDataJson = await response.json();
                        let answer = stripTags(answerInput.value);
                        answer = answer.replaceAll('\n', '<br/>');

                        //Добавляем информацию о пользователе, на чей ответ мы ответили, в начало коммента
                        const upperCommentUserInfo = commentDataJson['upper_comment_user_info'];
                        if(upperCommentUserInfo) {
                            answer = `
                                <a href="/account/userprofile/${upperCommentUserInfo.id}" class="upper_comment_user_href">&#64;${upperCommentUserInfo.name}</a>
                            ` + answer;
                        }

                        //Если у коммента, под которым мы рендерим ответ, есть меню коммента, то убираем его
                        const commentMenu = parentComment.querySelector('.comment_menu');
                        commentMenu && commentMenu.remove();

                        let answersBlock; //Блок для ответов
                        //Если у нас уже есть блок для ответов под данным комментом, вставляем ответы туда, иначе создаем новый
                        let answers_block_check = innerCommentBox.querySelector('.answers_block');
                        if (answers_block_check) {
                            answersBlock = answers_block_check;
                        } else{
                            answersBlock = document.createElement('div');
                            answersBlock.className = 'answers_block';
                            innerCommentBox.append(answersBlock);
                        }

                        setTimeout(() => {
                            answerLoader.stop();
                            answerLoaderBlock.remove();

                            //Если у данного коммента есть скрытые ответы, то вставляем данный ответ после них
                            const showMoreAnswers = innerCommentBox.querySelector('.show_more_answers');
                            if(showMoreAnswers && !showMoreAnswers.classList.contains('active')){

                                //Блок для ответов, который идет после спрятоного блока с загружаемыми ответами
                                let afterLoadedAnswersBlock = innerCommentBox.querySelector('.answers_block + .after_loaded_answers_block');
                                if(!afterLoadedAnswersBlock) {
                                    afterLoadedAnswersBlock = document.createElement('div');
                                    afterLoadedAnswersBlock.className = 'after_loaded_answers_block';
                                    innerCommentBox.append(afterLoadedAnswersBlock);
                                }
                                let answerOutBox = document.createElement('div');
                                answerOutBox.className = 'answer_out_box';
                                afterLoadedAnswersBlock.append(answerOutBox);
                                answerOutBox.insertAdjacentHTML('beforeend', getCommentTemplate(answer, commentDataJson, 'answer', 'from_outer_input'));
                                const recentlyAddedAnswer = answerOutBox.querySelector('.answer');
                                commentsMenusRender(recentlyAddedAnswer);           //Рендерим меню для комментария
                                pagination.forbidEdit(recentlyAddedAnswer);   //Запрещаем изменение айди комментария

                            } else {
                                if(answersBlock && !showMoreAnswers){            //Если мы добавляем первые ответы под коммент, то сразу же показываем блок с комментами
                                    answersBlock.classList.add('active');
                                }
                                const showNextAnswers = innerCommentBox.querySelector('.show_next_answers');
                                let answerInnerBox = document.createElement('div');
                                answerInnerBox.className = 'answer_inner_box';
                                if(showNextAnswers){
                                    showNextAnswers.before(answerInnerBox);
                                } else {
                                    answersBlock.append(answerInnerBox);
                                }
                                answerInnerBox.insertAdjacentHTML('beforeend', getCommentTemplate(answer, commentDataJson, 'answer', 'from_inner_input'));
                                const recentlyAddedAnswer = answerInnerBox.querySelector('.answer');
                                commentsMenusRender(recentlyAddedAnswer);              //Рендерим меню для комментария
                                pagination.forbidEdit(recentlyAddedAnswer);   //Запрещаем изменение айди комментария
                            }

                        }, 500);
                    }

                    answerForm.removeEventListener('submit', sendAnswer);
                };

                //Удаляем блок ответа и ивентлисенер при нажатии на (ответить)
                const removeAnswers = (event) => {
                    event.preventDefault();
                    answerForm.removeEventListener('submit', removeAnswers);
                    answerSendBlock.remove();
                };

                answerForm.addEventListener('submit', sendAnswer);
                answerForm.addEventListener('submit', removeAnswers);

            }
        }
    }
});




//Загрузка ответов
commentsBlockBody.addEventListener('click', event => {
    window.pagination = pagination;
    const target = event.target;

    let answer = target.closest('.answer');
    if(!answer){
        answer = target.closest('.comment');
    }

    let commentId;
    if(answer) {
        const hashCommentId = answer.querySelector('#comment_id').innerText | 0;
        commentId = pagination.commentsHashIds[hashCommentId];   //Айди коммента, под которым будем вставлять ответы
    }

    const showMoreAnswers = target.closest('.show_more_answers');
    const showNextAnswers = target.closest('.show_next_answers');
    if(showMoreAnswers || showNextAnswers) {

        function renderAnswersF(loader, answersBlock, loadAnswersBlock = null, showNextAnswers = null){
            const colOfAnswers = pagination.commentsWithAnswers[commentId].colOfAnswers,
                offset = pagination.commentsWithAnswers[commentId].offset;
            //Если осталось ответов меньше чем удвоенный предел, то отображаем все отсавшиеся(с помощью изменения лимита ответов)
            const oldAnswersLimitVal = pagination.answers_limit;
            if (colOfAnswers - offset < pagination.answers_limit * 2) {
                pagination.answers_limit = colOfAnswers - offset;
            }

            pagination.getAnswers(commentId);       //Запрашиваем ответы для данного коммента с сервера
            //Получаем кол-во ответов, которые будут сейчас рендериться, и получаем время загрузки
            let colOfActualAnswers;
            let loadTime;
            let inttId = setInterval(() => {
                if(pagination.readyAnswersState === 1){
                    colOfActualAnswers = pagination.answers[commentId].length;
                    if(colOfActualAnswers <= 3){
                        loadTime = 300;
                    } else if(colOfActualAnswers <= 7){
                        loadTime = 400;
                    } else{
                        loadTime = 500;
                    }
                    clearInterval(inttId);
                    //Скрываем ответы, которые расположены под блоком ответов
                    let afterLoadedAnswersBlock = answer.querySelector('.answers_block + .after_loaded_answers_block');
                    afterLoadedAnswersBlock && afterLoadedAnswersBlock.classList.add('hidden');

                    pagination.prepareAnswers(commentId);   //Получаем html-код ответов
                    loader.start();
                    pagination.answers_limit = oldAnswersLimitVal;    //Возвращаем старое значение предела ответов

                    const intrvlId = setInterval(async () => {
                        if (pagination.commentsWithAnswers[commentId].isAnswersCodesReady) {
                            loader.stop();
                            loadAnswersBlock && loadAnswersBlock.classList.remove('active');
                            showNextAnswers && showNextAnswers.remove();
                            await pagination.renderAnswers(answersBlock, commentId);          //Рендерим ответы для данного коммента

                            //Выполняем это после рендера ответов
                            commentsMenusRender(document.querySelector('.comments_block_body'));

                            //Если не были отренедерены все ответы за раз, то добавляем кнопку получения следующих ответов
                            let showAnswers = undefined;
                            const colOfAnswers = pagination.commentsWithAnswers[commentId].colOfAnswers,
                                offset = pagination.commentsWithAnswers[commentId].offset;
                            if (offset < colOfAnswers) {
                                showAnswers = document.createElement('div');     //Кнопка получения следующих ответов
                                showAnswers.className = 'show_next_answers';
                                showAnswers.innerHTML = `<div>
                                                                <div></div>
                                                                <p>еще</p>
                                                             </div>`;
                                answersBlock.append(showAnswers);
                            }

                            //Срабатывает, когда показываем скрытые ответы
                            if (answersBlock.classList.contains('active') && afterLoadedAnswersBlock) {
                                const answersOutBox = afterLoadedAnswersBlock.querySelectorAll('.answer_out_box');

                                if(answersOutBox.length > 0) {
                                    answersOutBox.forEach(block => {
                                        const answer = block.firstElementChild;

                                        const cloneN = answer.cloneNode(true);
                                        block.after(cloneN);
                                        commentsMenusRender(cloneN);
                                        pagination.forbidEdit(cloneN);   //Запрещаем изменение айди комментария

                                        if (showAnswers) showAnswers.before(answer);
                                        else answersBlock.append(answer);
                                        pagination.forbidEdit(answer);   //Запрещаем изменение айди комментария

                                        block.remove();
                                    });
                                }
                            }
                            clearInterval(intrvlId);
                        }
                    }, loadTime);

                }
            }, 10);
        };


        //Если у нас есть кнопка показать ответы (то есть ответов > 0), проходим дальше
        if (showMoreAnswers) {
            let loadAnswersBlock = answer.querySelector('.load_answers_block');
            const innerCommentBox = answer.querySelector('.inner_comment_box');

            //Если мы еще не вставляли блок загрузки ответов, то рендерим загрузку
            if (!loadAnswersBlock) {

                let answersBlock; //Блок для ответов
                //Если у нас уже есть блок для ответов под данным комментом, вставляем ответы туда, иначе создаем новый
                let answers_block_check = innerCommentBox.querySelector('.answers_block');
                if (answers_block_check) {
                    answersBlock = answers_block_check;
                } else {
                    answersBlock = document.createElement('div');
                    answersBlock.className = 'answers_block';
                }

                let afterLoadedAnswersBlock = innerCommentBox.querySelector('.answers_block + .after_loaded_answers_block');
                if(afterLoadedAnswersBlock){
                    afterLoadedAnswersBlock.before(answersBlock);
                } else{
                    innerCommentBox.append(answersBlock);
                }

                loadAnswersBlock = document.createElement('div');                  //Блок загрузки
                loadAnswersBlock.className = 'load_answers_block';
                showMoreAnswers.after(loadAnswersBlock);

                showMoreAnswers.classList.add('active');
                showMoreAnswers.querySelector('.show_more_answers_cntr').innerText = 'Скрыть';
                answersBlock.classList.add('active');
                loadAnswersBlock.classList.add('active');

                const loader = new LoadParser(loadAnswersBlock, 0, '/public/imgs/comment_loading.gif');
                renderAnswersF(loader, answersBlock, loadAnswersBlock, undefined);
            }
            else {
                let answersBlock = innerCommentBox.querySelector('.answers_block');
                answersBlock.classList.toggle('active');
                showMoreAnswers.classList.toggle('active');
                const showMoreAnswersCntr = showMoreAnswers.querySelector('.show_more_answers_cntr');
                if(showMoreAnswersCntr.innerText == 'Скрыть'){
                    showMoreAnswersCntr.innerText = 'Показать';
                } else {
                    showMoreAnswersCntr.innerText = 'Скрыть'
                }
                const showNextAnswers = answer.querySelector('.show_next_answers');

                let afterLoadedAnswersBlock = innerCommentBox.querySelector('.answers_block + .after_loaded_answers_block');
                const answersBlockAnswers = answersBlock.querySelectorAll('.answer.from_outer_input, .answer.from_inner_input');
                if (answersBlockAnswers.length > 0 && !afterLoadedAnswersBlock) {
                    afterLoadedAnswersBlock = document.createElement('div');
                    afterLoadedAnswersBlock.className = 'after_loaded_answers_block';
                    answersBlock.after(afterLoadedAnswersBlock);
                }

                //Срабатывает, когда показываем скрытые ответы
                if (answersBlock.classList.contains('active')) {
                    afterLoadedAnswersBlock && afterLoadedAnswersBlock.classList.add('hidden');
                    const answersOutBox = afterLoadedAnswersBlock && afterLoadedAnswersBlock.querySelectorAll('.answer_out_box');
                    if(answersOutBox && answersOutBox.length > 0) {
                        if (!showNextAnswers) {
                            answersOutBox.forEach(block => {
                                const answer = block.firstElementChild;

                                const cloneN = answer.cloneNode(true);
                                block.after(cloneN);
                                commentsMenusRender(cloneN);
                                pagination.forbidEdit(cloneN);   //Запрещаем изменение айди комментария

                                answersBlock.append(answer);
                                pagination.forbidEdit(answer);   //Запрещаем изменение айди комментария
                                block.remove();
                            });
                        } else {
                            answersOutBox.forEach(block => {
                                const answer = block.firstElementChild;

                                const cloneN = answer.cloneNode(true);
                                block.after(cloneN);
                                commentsMenusRender(cloneN);
                                pagination.forbidEdit(cloneN);   //Запрещаем изменение айди комментария

                                showNextAnswers.before(answer);
                                pagination.forbidEdit(answer);   //Запрещаем изменение айди комментария
                                block.remove();
                            });
                        }
                    }
                }
                //Срабатывает, когда прячем ответы, которые показали до этого
                else {
                    const answersInnerBoxes = answersBlock.querySelectorAll('.answer_inner_box');
                    if(answersInnerBoxes.length > 0) {
                        answersInnerBoxes.forEach(block => {
                            const answer = block.firstElementChild;

                            const cloneN = answer.cloneNode(true);
                            block.after(cloneN);
                            commentsMenusRender(cloneN);
                            pagination.forbidEdit(cloneN);   //Запрещаем изменение айди комментария

                            afterLoadedAnswersBlock.append(answer);
                            pagination.forbidEdit(answer);   //Запрещаем изменение айди комментария
                            block.remove();
                        });
                    }
                    afterLoadedAnswersBlock && afterLoadedAnswersBlock.classList.remove('hidden');
                }

            }

        }

        //Если юзер нажал на загрузить больше ответов
        if (showNextAnswers) {
            const answersBlock = answer.querySelector('.answers_block');
            const loader = new LoadParser(showNextAnswers, 0, '/public/imgs/comment_loading.gif');

            renderAnswersF(loader, answersBlock, undefined, showNextAnswers);
        }
    }

});




//Меню управления для комментариев

//Модальное окно для подтверждения удаления комментария
const okObj = {};
const closeObj = {}
const modal = $m.modal(`
                            <div class="modal-header">
                                <span>Подтверждение</span>
                            </div>
                            <div class="modal-body">
                                <p>  
                                Вы уверены, что хотите удалить данный комментарий ?
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button data-closer-ok>OK</button>
                                <button data-closer>ОТМЕНА</button>
                            </div>
                        `, {
    width: 300,
    onOkObj: okObj,
    onCloseObj: closeObj
});

function commentsMenusRender(parentBlock) {

    let comments = parentBlock.querySelectorAll('.answer, .comment');
    if(comments.length === 0){
        comments = [parentBlock.closest('.answer, .comment')];
    }
    for(const comment of comments) {

        const ua = comment.querySelector('.user_avatar');
        const userId = ua.href.match(/.+\/(\d+)/)[1] | 0;

        //Показываем меню только для комментариев и ответов, которые написал залогиненный пользователь
        if (userId !== (pagination.authorizeUserId | 0)) continue;

        const commentMenuTrigger = comment.querySelector('.comment_menu_trigger');
        commentMenuTrigger.classList.add('displayed');

        let yCoord;
        const pageScrollHandler = () => window.scrollTo(0, yCoord);
        //Запретить прокрутку страницы
        function prohibitPageScroll() {
            yCoord = window.pageYOffset;
            window.addEventListener('scroll', pageScrollHandler);
        }
        //Разрешить прокрутку страницы
        function allowPageScroll() {
            window.removeEventListener('scroll', pageScrollHandler);
        }

        //Анимация для commentMenuTrigger
        commentMenuTrigger.onmousedown = () => {
            commentMenuTrigger.classList.add('active');
            commentMenuTrigger.classList.add('clicked');
            setTimeout(() => {
                commentMenuTrigger.classList.remove('active');
            }, 200);
        }
        let commentMenu;
        commentMenuTrigger.onclick = () => {
            //Если у нас уже есть активное меню, удаляем его
            const clckMenu = comment.querySelector('.answer > .comment_menu');
            const menu = comment.querySelector('.comment > .comment_menu');
            if (clckMenu && comment.closest('.answer')) {
                allowPageScroll();
                clckMenu.remove();
                commentMenuTrigger.classList.remove('clicked');
                return;
            } else if (menu && comment.closest('.comment') && !comment.closest('.answer')) {
                allowPageScroll();
                menu.remove();
                commentMenuTrigger.classList.remove('clicked');
                return;
            }

            prohibitPageScroll();
            commentMenu = document.createElement('div');
            commentMenu.className = 'comment_menu';
            commentMenu.insertAdjacentHTML('beforeend', `
                    <div class="edit_comment">
                        <img src="/public/imgs/comment-edit.svg">
                        <span>Редактировать</span>
                    </div>
                    <div class="remove_comment">
                        <img src="/public/imgs/comment-remove.svg">
                        <span>Удалить</span>
                    </div>
                `);
            commentMenuTrigger.after(commentMenu);

            //Размещаем меню коммента сверху, если оно прячется за границей сайта снизу
            const commentMenuRect = commentMenu.getBoundingClientRect();
            if (commentMenuRect.top + commentMenuRect.height + window.pageYOffset > window.pageYOffset + document.documentElement.clientHeight) {
                commentMenu.style.top = '-80px';
            }

            //Удаляем меню при клике вне самого меню или вне commentMenuTrigger
            let fnct = (event) => {
                if (commentMenu.contains(event.target) || commentMenuTrigger.contains(event.target)) return;

                allowPageScroll();
                commentMenu.remove();
                commentMenuTrigger.classList.remove('clicked');

                if (!comment.contains(event.target) || comment.contains(event.target.closest('.answers_block, .after_loaded_answers_block'))) {
                    document.removeEventListener('click', fnct);
                }
            };
            document.addEventListener('click', fnct);


            //Обработка нажатия на удаление или редактирование комментария или ответа
            commentMenu.addEventListener('click', (event) => {
                //Обработка нажатий на удаление комментария или ответа
                if (event.target.closest('.remove_comment')) {
                    commentMenu.remove();

                    //Данный метод срабатывает, если пользователь нажал OK
                    okObj.onOk = () => {
                        allowPageScroll();
                        modal.close();
                        const deleteLoader = new LoadParser(comment, 0, '/public/imgs/comment_loading.gif');
                        deleteLoader.start();

                        const hashCommentId = comment.querySelector('#comment_id').innerText;
                        const commentId = pagination.commentsHashIds[hashCommentId];
                        let formD = new FormData();
                        formD.set('remove_comment_id', commentId);
                        if (comment.classList.contains('comment')) {
                            formD.set('type_of_comment', 'comment');
                        } else if (comment.classList.contains('answer')) {
                            formD.set('type_of_comment', 'answer');
                        }
                        fetch('', {
                            method: 'post',
                            body: formD
                        });

                        setTimeout(() => {
                            deleteLoader.stop();

                            //Если мы удаляем коммент
                            if (comment.classList.contains('comment')) {
                                comment.remove();
                                if(colOfComments.innerText > 0)
                                    colOfComments.innerText = +colOfComments.innerText - 1;
                                if(colOfComments.innerText === '0')
                                    emptyCommentsBlockMessage.style.display = '';
                            }
                            //Если удаляем ответ в блоке сейчас добавленных ответов
                            else if (comment.closest('.after_loaded_answers_block')) {
                                const parentComment = comment.closest('.comment');
                                const answersBlock = comment.closest('.comment').querySelector('.answers_block');
                                const afterLoadedAnswersBlock = parentComment.querySelector('.after_loaded_answers_block');

                                if (answersBlock) {
                                    const answers = Array.from(answersBlock.querySelectorAll('.answer'));
                                    if (answers.length > 0) {
                                        const hashCommentId = +comment.querySelector('#comment_id').innerText;
                                        const commentId = pagination.commentsHashIds[hashCommentId];

                                        const commentToDelete = answers.find((answer) => {
                                            const hashCommentId = answer.querySelector('#comment_id').innerText;
                                            if (pagination.commentsHashIds[hashCommentId] == commentId) return true;
                                        });

                                        //Удаляем ответ из блока ранее добавленных ответов
                                        if (commentToDelete) {
                                            commentToDelete.remove();
                                        }
                                    }
                                }

                                if (afterLoadedAnswersBlock.querySelectorAll('.answer').length - 1 === 0) {
                                    afterLoadedAnswersBlock.remove();
                                } else {
                                    const answerOutBox = comment.closest('.answer_out_box');
                                    if (answerOutBox) answerOutBox.remove();
                                    else comment.remove();
                                }
                            }
                            //Если удаляем ответ в блоке ранее добавленных ответов
                            else if (comment.closest('.answers_block')) {
                                //Уменьшаем счетчик количества ответов
                                const parentComment = comment.closest('.comment');

                                const afterLoadedAnswersBlock = parentComment.querySelector('.after_loaded_answers_block');
                                if (afterLoadedAnswersBlock) {
                                    const answers = Array.from(afterLoadedAnswersBlock.querySelectorAll('.answer'));
                                    if (answers.length > 0) {
                                        const hashCommentId = comment.querySelector('#comment_id').innerText;
                                        const commentId = pagination.commentsHashIds[hashCommentId];

                                        const commentToDelete = answers.find((answer) => {
                                            const hashCommentId = answer.querySelector('#comment_id').innerText;
                                            if (pagination.commentsHashIds[hashCommentId] == commentId) return true;
                                        });

                                        //Удаляем ответ из блока только добавленных ответов, или весь блок, если в нем не осталось ответов
                                        if (commentToDelete) {
                                            if (afterLoadedAnswersBlock.querySelectorAll('.answer').length - 1 === 0) {
                                                afterLoadedAnswersBlock.remove();
                                            } else {
                                                commentToDelete.remove();
                                            }
                                        }
                                    }
                                }

                                if (!comment.classList.contains('from_outer_input') && !comment.classList.contains('from_inner_input')) {
                                    const colOfAnswersElement = parentComment.querySelector('.show_more_answers .col_of_answers');
                                    colOfAnswersElement.innerText = colOfAnswersElement.innerText - 1;
                                }

                                //Если при удалении у нас не остается ответов(без класса from_outer_input и from_inner_input) в блоке answers_block, то делаем этот блок единственным блоком с ответами и скрываем кнопку показать/скрыть ответы
                                const answersBlock = comment.closest('.answers_block');
                                if (answersBlock.querySelectorAll('.answer:not(.from_outer_input):not(.from_inner_input)').length - 1 === 0 && !comment.classList.contains('from_inner_input') && !comment.classList.contains('from_outer_input')) {
                                    const afterLoadedAnswersBlock = parentComment.querySelector('.after_loaded_answers_block');
                                    afterLoadedAnswersBlock && afterLoadedAnswersBlock.remove();
                                    parentComment.querySelector('.show_more_answers').remove();
                                }
                                //Если в блоке не осталось ни одного ответа, удаляем его
                                if (answersBlock.querySelectorAll('.answer').length - 1 === 0) {
                                    answersBlock.remove();
                                }

                                const answerInnerBox = comment.closest('.answer_inner_box');
                                if (answerInnerBox) answerInnerBox.remove();
                                else comment.remove();
                            }
                        }, 400);
                    };
                    closeObj.onClose = () => {
                        allowPageScroll();
                    }

                    modal.open();
                }

                //Обработка нажатий на редактирование комментария или ответа
                else if (event.target.closest('.edit_comment')) {
                    commentMenu.remove();
                    commentMenuTrigger.classList.remove('displayed');
                    allowPageScroll();

                    const beforeElementsArr = {
                        userInformation: comment.querySelector('.user_information'),
                        commentText: comment.querySelector('.comment_text'),
                        endCommentBlock: comment.querySelector('.end_comment_block'),
                        hideElements: function () {
                            for (let prop in this) {
                                if (typeof this[prop] !== 'function' && this.hasOwnProperty(prop))
                                    this[prop].style.display = 'none';
                            }
                        },
                        showElements: function () {
                            for (let prop in this) {
                                if (typeof this[prop] !== 'function' && this.hasOwnProperty(prop))
                                    this[prop].style.display = '';
                            }
                        }
                    };
                    const oldInputValue = beforeElementsArr.commentText.innerText;

                    const answerSendTemplate = `
                            <div class="comments_send_block editor">
                                <form action="" method="post">
                                    <div class="send_comment_input_block">
                                        <textarea required name="answer" placeholder="Оставьте комментарий">${oldInputValue}</textarea>
                                    </div>
                                    <div class="buttons_block">
                                        <button type="reset">Отмена</button>
                                        <button disabled type="submit">Изменить</button>
                                    </div>
                                </form>
                            </div>
                        `;

                    //Скрываем элементы коммента и вместо них вставляем форму для редактирования коммента
                    beforeElementsArr.hideElements();

                    beforeElementsArr.userInformation.insertAdjacentHTML('beforebegin', answerSendTemplate);
                    inputExplore();     //Делаем динамическим размер поля инпута
                    const answerSendBlock = comment.querySelector('.comments_send_block');

                    const answerInput = answerSendBlock.querySelector('.send_comment_input_block > textarea');
                    const resetButton = answerSendBlock.querySelector('button[type=reset]');
                    const submitButton = answerSendBlock.querySelector('button[type=submit]');
                    const answerForm = answerSendBlock.querySelector('form');

                    answerInput.focus();
                    //Отключаем или включаем кнопку отправления при изменении контента инпута
                    answerInput.addEventListener('input', () => {
                        if (answerInput.value != oldInputValue) {
                            submitButton.disabled = false;
                        } else {
                            submitButton.disabled = true;
                        }
                    });

                    //При подтверждении изменения комментария отправляем новый текст коммента на сервер и изменяем текст самого коммента
                    answerForm.onsubmit = (event) => {
                        event.preventDefault();

                        const commentText = answerForm.querySelector('.send_comment_input_block textarea').value;
                        const hashCommentId = comment.querySelector('#comment_id').innerText;
                        const editCommentId = pagination.commentsHashIds[hashCommentId];

                        //Отображаем загрузку
                        const editAnswerLoader = new LoadParser(answerSendBlock, 0, '/public/imgs/comment_loading.gif');
                        beforeElementsArr.commentText.innerText = commentText;
                        beforeElementsArr.userAvatar = comment.querySelector('.user_avatar');
                        beforeElementsArr.hideElements();
                        editAnswerLoader.start();

                        //Отправляем новый текст коммента на сервер
                        const formD = new FormData();
                        let commentFinallyText = stripTags(commentText);
                        commentFinallyText = commentFinallyText.replaceAll('\n', '<br/>');
                        commentFinallyText = pagination.getCommentUnicodeStr(commentFinallyText);
                        formD.set('changed_comment_text', commentFinallyText);
                        formD.set('edit_comment_id', editCommentId);
                        fetch('', {
                            method: 'post',
                            body: formD
                        });

                        setTimeout(() => {
                            editAnswerLoader.stop();
                            resetButton.dispatchEvent(new Event('click'));
                        }, 400);

                        answerForm.onsubmit = null;

                        //Если изменяем ответ на коммент, то изменяем его во всех блоках коммента
                        if(comment.classList.contains('answer') && !comment.classList.contains('comment')) {
                            //Если редактируем ответ в блоке сейчас добавленных ответов
                            if (comment.closest('.after_loaded_answers_block')) {
                                const parentComment = comment.closest('.comment');
                                const answersBlock = parentComment.querySelector('.answers_block');

                                if (answersBlock) {
                                    const answers = Array.from(answersBlock.querySelectorAll('.answer'));
                                    if (answers.length > 0) {
                                        const hashCommentId = comment.querySelector('#comment_id').innerText;
                                        const commentId = pagination.commentsHashIds[hashCommentId];

                                        const commentToDelete = answers.find((answer) => {
                                            const hashCommentId = answer.querySelector('#comment_id').innerText;
                                            if (pagination.commentsHashIds[hashCommentId] == commentId) return true;
                                        });

                                        //Удаляем ответ из блока ранее добавленных ответов
                                        if (commentToDelete) {
                                            commentToDelete.querySelector('.comment_text').innerText = commentText;
                                        }
                                    }
                                }
                            }
                            //Если удаляем ответ в блоке ранее добавленных ответов
                            else if (comment.closest('.answers_block')) {
                                //Уменьшаем счетчик количества ответов
                                const parentComment = comment.closest('.comment');

                                const afterLoadedAnswersBlock = parentComment.querySelector('.after_loaded_answers_block');
                                if (afterLoadedAnswersBlock) {
                                    const answers = Array.from(afterLoadedAnswersBlock.querySelectorAll('.answer'));
                                    if (answers.length > 0) {
                                        const hashCommentId = comment.querySelector('#comment_id').innerText;
                                        const commentId = pagination.commentsHashIds[hashCommentId];

                                        const commentToDelete = answers.find((answer) => {
                                            const hashCommentId = answer.querySelector('#comment_id').innerText;
                                            if (+pagination.commentsHashIds[hashCommentId] == commentId) return true;
                                        });

                                        //Удаляем ответ из блока только добавленных ответов, или весь блок, если в нем не осталось ответов
                                        if (commentToDelete) {
                                            commentToDelete.querySelector('.comment_text').innerText = commentText;
                                        }
                                    }
                                }
                            }
                        }
                    };

                    //Удаляем блок редактирования ответа и ивентлисенер при нажатии на отмена
                    resetButton.onclick = () => {
                        resetButton.onclick = null;
                        answerSendBlock.remove();
                        commentMenuTrigger.classList.add('displayed');

                        //Показываем элементы коммента, которые были спрятаны
                        beforeElementsArr.showElements();
                    };
                }
            });
        };
    }
}




//Сортировка комментариев
const filtersMenu = document.querySelector('.filters');

filtersMenu.addEventListener('click', (event) => {

    if(colOfComments.textContent != 0) {
        const prepareCommentBlock = () => {
            commentsBlockBody.style.paddingBottom = '0px';
            nextCommentsTrigger.style.display = 'none';
            loadBlock.style.display = '';
            commentsBlockBody.querySelectorAll('.comment').forEach(comment => comment.remove());
            loaded = false;
            window.dispatchEvent(new Event('scroll'));
        };

        //Если пользователь выбрал сортировку по популярности
        if (event.target.closest('.filters li:first-child')) {
            filterMode = 'popular';
            prepareCommentBlock();
        }
        //Если пользователь выбрал сортировку по дате
        else if (event.target.closest('.filters li:nth-child(2)')) {
            filterMode = 'newest';
            prepareCommentBlock();
        }
    }
});