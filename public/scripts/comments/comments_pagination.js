
export default class CommentsPagination{

    offset = 0;                     //Номер последнего вставленного на страницу коммента

    url;                            //URL страницы, на которую мы отправляем запрос на получение комментариев

    comments;                       //Партия комментов, которые пришли с сервера

    answers = {};                   //Партия ответов, которые пришли с сервера

    commentsWithAnswers = {};       //Информация о комментах, под которыми есть ответы

    comments_limit;                 //Количество комментов, которые загружаются под постом за раз

    answers_limit;                  //Количество ответов, которые загружаются под комментом за раз

    parentNode;                     //DOM узел, в который нужно вставлять комменты

    colOfAllComments;               //Количество всех комментариев под данным постом

    colOfPostedComments = 0;        //Количество уже вставленных комментов на страницу

    _readyState = 0;                //Защищенное свойство. 0 - значит комментарии еще не загружены с бд, 1 - значит загружены

    _readyAnswersState = 0;         //Защищенное свойство. 0 - значит ответы еще не загружены с бд, 1 - значит загружены

    commentsWithActiveMarksData;    //Информация о комментариях, под которыми поставлена оценка, авторизированного в данный момент пользователя

    answersWithActiveMarksData;     //Информация о ответах, под которыми поставлена оценка, авторизированного в данный момент пользователя

    authorizeUserId;                //ID юзера, который авторизирован в данный момент

    isCommentsReady = false;        //Публичное свойство, которое говорит о том готовы ли комментарии к вставке на страницу

    finallyCommentsCodes = [];      //Массив готовых html-фрагментов комментариев для вставки на страницу

    commentTimeout;                 //Время, через которое будет вставляться на страницу каждый новый коммент

    commentsHashIds = {};           //Объект с айдишниками комментариев (ключи захешированны)

    _filterMode;                    //Режим сортировки комментарие (защищенный метор)

    currentOffset;                  //Количество комментов, которые пришли с сервера с последним запросом (за вычетом комментариев авторизированного пользователя при сортировке по популярности)


    constructor(url, parentNode, colOfAllComments, nextCommentsTrigger, commentTimeout, filterMode, beforeRenderHandler = () => {}, afterRenderHandler = () => {}) {
        this.url = url;
        this.parentNode = parentNode;
        this.colOfAllComments = colOfAllComments;
        this.nextCommentsTrigger = nextCommentsTrigger;
        this.beforeRenderHandler = beforeRenderHandler;
        this.afterRenderHandler = afterRenderHandler;
        this.commentTimeout = commentTimeout;
        this._filterMode = filterMode;

        this._setup();
    }


    //В первый запрос принимаем комменты и устанавливаем лимиты комментов и ответов
    _setup(){
        let formData = new FormData();
        formData.set('first_comments', true);
        formData.set('offset', this.offset);
        formData.set('filter_mode', this._filterMode);
        this._getRequest(formData).then((comments) => {

            //Получаем комменты и информацию о оценках комментариев
            this.comments = comments['comments_info'];
            this.commentsWithActiveMarksData = comments['comments_with_active_marks_data'];
            this.currentOffset = comments['current_offset'];

            //Устанавливаем лимит, получаем айди авторизированного юзера и айди комментов с ответами
            let form2 = new FormData();
            form2.set('setup', true);
            this._getRequest(form2).then((response) => {
                if(this.colOfAllComments !== 0) {
                    this.comments_limit = response.comments_limit;
                    this.answers_limit = response.answers_limit;
                    const commentsColOfAnswers = response['comments_col_of_answers'];
                    //Устанавливаем номер последнего добавленного ответа для каждого коммента, имеющего ответ
                    response['comments_with_answers_ids'].forEach(id => {
                        this.commentsWithAnswers[id] = {
                            offset: 0,
                            colOfAnswers: +commentsColOfAnswers[id],
                            isAnswersCodesReady: false,
                            answersFinallyCodes: []
                        };
                    });
                }
                this.authorizeUserId = response['authorize_user_id'];
                this._readyState = 1;
            });

        });
    }


    //Получаем следующие комменты с сервера
    getNextComments(){
        let formData = new FormData();
        formData.set('filter_mode', this._filterMode);
        formData.set('offset', this.offset);

        this._getRequest(formData).then((comments) => {
            this.comments = comments['comments_info'];
            this.currentOffset = comments['current_offset'];

            this.commentsWithActiveMarksData = comments['comments_with_active_marks_data'];
            this._readyState = 1;
        });
    }


    //Получаем ответы для коммента с сервера
    getAnswers(commentId){
        let formData = new FormData();
        formData.set('answers_offset', this.commentsWithAnswers[commentId].offset);
        formData.set('parent_comment_id', commentId);
        formData.set('answers_limit', this.answers_limit);

        this._getRequest(formData).then((comments) => {
            this.answers[commentId] = comments['answers_info'];
            if(!this.answersWithActiveMarksData){
                this.answersWithActiveMarksData = comments['answers_with_active_marks_data'];
            }else{
                this.answersWithActiveMarksData = this.answersWithActiveMarksData.concat(comments['answers_with_active_marks_data']);
            }
            this._readyAnswersState = 1;
        });
    }


    get _nextOffset(){
        return this.offset + this.currentOffset;
    }

    get _isLastPage(){
        return this.colOfAllComments - this.colOfPostedComments === 0;
    }

    get readyAnswersState(){
        return this._readyAnswersState;
    }


    async _getRequest(formData){
        let response = await fetch(this.url, {
            method: 'post',
            body: formData
        });

        if(response.ok){
            return await response.json();
        }
    }


    //Форматирование даты комментов
    getFormattedDateStr(comment){
        let dateStr;
        const commentDate = new Date(Date.parse(comment.date_of_post)),
            currentDate = new Date();

        function dateFormatter(dateFragment, dateFragmentName){
            const dateFragmentLastNumber = +String(dateFragment).split('').pop();

            if (dateFragment === 1) {
                if(dateFragmentName == 'неделя')
                    dateStr = 'Неделю назад';
                else if(dateFragmentName == 'минута')
                    dateStr = 'Минуту назад';
                else if(dateFragmentName == 'секунда')
                    dateStr = 'Секунду назад';
                else
                    dateStr = dateFragmentName.split('')[0].toUpperCase() + dateFragmentName.split('').slice(1).join('') + ' назад';
            }
            else if(dateFragmentLastNumber >= 2 && dateFragmentLastNumber <= 4 && (dateFragment < 10 || dateFragment > 20)){
                if(dateFragmentName == 'неделя')
                    dateStr = dateFragment + ' недели назад';
                else if(dateFragmentName == 'минута' || dateFragmentName == 'секунда') {
                    const arr = dateFragmentName.split('');
                    dateStr = dateFragment + ' ' + arr.slice(0, arr.length - 1).join('') + 'ы назад';
                }
                else if(dateFragmentName == 'день'){
                    dateStr = dateFragment + ' дня назад';
                }
                else
                    dateStr = dateFragment + ' ' + dateFragmentName + 'а назад';
            }
            else if(dateFragmentLastNumber >= 5 && dateFragmentLastNumber <= 9 || dateFragment >= 10 && dateFragment <= 20){
                if(dateFragmentName == 'год')
                    dateStr = dateFragment + ' лет назад';
                else if(dateFragmentName == 'месяц')
                    dateStr = dateFragment + ' месяцев назад';
                else if(dateFragmentName == 'неделя')
                    dateStr = dateFragment + ' недель назад';
                else if(dateFragmentName == 'день')
                    dateStr = dateFragment + ' дней назад';
                else if(dateFragmentName == 'час')
                    dateStr = dateFragment + ' часов назад';
                else {
                    const arr = dateFragmentName.split('');
                    dateStr = dateFragment + ' ' + arr.slice(0, arr.length - 1).join('') + ' назад';
                }
            }
            else if(dateFragmentLastNumber === 1){
                if(dateFragmentName == 'неделя')
                    dateStr = dateFragment + ' неделю назад';
                else if(dateFragmentName == 'минута')
                    dateStr = dateFragment + ' минуту назад';
                else if(dateFragmentName == 'секунда')
                    dateStr = dateFragment + ' секунду назад';
                else
                    dateStr = dateFragment + ' ' + dateFragmentName + ' назад';
            }
        }
        const years = Math.floor(Math.floor((currentDate.getTime() - commentDate.getTime())/2592000000)/12),
            months = Math.floor((currentDate.getTime() - commentDate.getTime())/2592000000),
            weeks = Math.floor((currentDate.getTime() - commentDate.getTime())/604800000),
            days = Math.floor((currentDate.getTime() - commentDate.getTime())/86400000),
            hours = Math.floor((currentDate.getTime() - commentDate.getTime())/3600000),
            minutes = Math.floor((currentDate.getTime() - commentDate.getTime())/60000),
            seconds = Math.floor((currentDate.getTime() - commentDate.getTime())/1000);

        // console.log(comment.comment_id, comment, minutes)

        if(years > 0) {
            dateFormatter(years, 'год');
        }
        else if(months > 0){
            dateFormatter(months, 'месяц');
        }
        else if(weeks > 0){
            dateFormatter(weeks, 'неделя');
        }
        else if(days > 0){
            dateFormatter(days, 'день');
        }
        else if(hours > 0){
            dateFormatter(hours, 'час');
        }
        else if(minutes > 0){
            dateFormatter(minutes, 'минута');
        }
        else if(seconds > 0){
            dateFormatter(seconds, 'секунда');
        }

        return dateStr;
    }


    //Формирование html-кода ответов для вставки под определенный коммент
    prepareAnswers(commentId){
        const intervalId = setInterval(() => {
            if (this._readyAnswersState === 1) {
                for (let answer of this.answers[commentId]) {
                    //Получаем информацию о оценках итерируемого комментария
                    let answerMarksData = this.answersWithActiveMarksData.find((commentData) => {
                        return commentData['parent_comment_id'] === answer.comment_id;
                    });
                    let href = '';

                    let likeActive = '', dislikeActive = '';
                    if (answerMarksData) {
                        if (answerMarksData['mark_type'] == 'like') {
                            likeActive = 'active';
                        } else if (answerMarksData['mark_type'] == 'dislike') {
                            dislikeActive = 'active';
                        }
                    }

                    //Если мы не авторизированы, то блок лайков и дизлаков будет при клике перенаправлять пользователя на страницу входа
                    if (!this.authorizeUserId) {
                        href = 'href = /account/login';
                    }

                    const dateStr = this.getFormattedDateStr(answer);

                    //Добавляем айди комментариев под хэшированым ключом
                    const hashId = this.hashCode(answer.comment_id);
                    this.commentsHashIds[hashId] = +answer.comment_id;


                    //Если ответ был сделан на другой ответ, то добавляем в его начало инфу о пользователе, на чей коммент был сделан ответ
                    let commentFinallyText = this.getTextFromUnicodeStr(answer.comment);
                    if(answer['upper_comment_user_info']){
                        commentFinallyText = `
                            <a href="/account/userprofile/${answer['upper_comment_user_info'].id}" class="upper_comment_user_href">&#64;${answer['upper_comment_user_info'].name}</a>
                        ` + commentFinallyText;
                    }

                    let template = `
                                    <div class="answer">
                                        <div id = 'comment_id' style="display: none">${hashId}</div>
                                        <a href="/account/userprofile/${answer.author_id}" class="user_avatar">
                                            <img src="/public/users_icons/${answer.author_id}.png" alt="avatar">
                                        </a>
                                        <div class="inner_comment_box">
                                            <div class="user_information">
                                                <a href="/account/userprofile/${answer.author_id}" class="user_name">${answer.name}</a>
                                                <div class="post_date">${dateStr}</div>
                                            </div>
                                            <p class="comment_text">
                                                ${commentFinallyText}
                                            </p>
                                            <div class="end_comment_block">
                                                <div class="comment_activities">
                                                    <p class="answer_button">
                                                        Ответить
                                                    </p>
                                                    <div class="marks">
                                                        <a ${href} class="likes_block ${likeActive}">
                                                            <div class="like"></div>
                                                            <p>${answer.likes == 0 ? '' : answer.likes}</p>
                                                        </a>
                                                        <a ${href} class="dislikes_block ${dislikeActive}">
                                                            <div class="dislike"></div>
                                                            <p>${answer.dislikes == 0 ? '' : answer.dislikes}</p>
                                                        </a>
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

                    this.commentsWithAnswers[commentId].answersFinallyCodes.push(template);
                }

                this.answers = {};     //Освобождаем объект с информацией о ответах
                this.commentsWithAnswers[commentId].isAnswersCodesReady = true;
                this._readyAnswersState = 0;
                clearInterval(intervalId);
            }
        }, 50);
    }


    //Рендер ответов под определенным комментом
    async renderAnswers(parentNode, commentId){
        if (this.commentsWithAnswers[commentId].isAnswersCodesReady) {

            async function* getAnswersAsync(answers, timeout) {
                for (let answer of answers) {
                    await new Promise(resolve => setTimeout(resolve, timeout));
                    yield answer;
                }
            }

            //Вставляем ответы на страницу асинхронно(то есть один коммент за время timeout)
            let answersGenerator = getAnswersAsync(this.commentsWithAnswers[commentId].answersFinallyCodes, this.commentTimeout);

            for await (let answerCode of answersGenerator) {
                parentNode.insertAdjacentHTML('beforeend', answerCode);
                this.forbidEdit(parentNode.lastElementChild);   //Запрещаем изменение айди комментария
            }

            this.commentsWithAnswers[commentId].offset += this.commentsWithAnswers[commentId].answersFinallyCodes.length;
            this.commentsWithAnswers[commentId].answersFinallyCodes = [];     //Чистим буфер ответов для данного коммента
            this.commentsWithAnswers[commentId].isAnswersCodesReady = false;
            return 'success';
        }
        throw new Error('answers render error');
    }


    //Формирование html-кода комментов для вставки на страницу
    preRenderSetup(){
        const intervalId = setInterval(() => {
            if (this._readyState === 1) {
                for (let comment of this.comments) {
                    //Получаем информацию о оценках итерируемого комментария
                    let commentMarksData = this.commentsWithActiveMarksData.find((commentData) => {
                        return commentData['parent_comment_id'] === comment.comment_id;
                    });

                    let href = '';
                    let likeActive = '', dislikeActive = '';
                    let showMoreAnswersHtml = '';
                    if (commentMarksData) {
                        if (commentMarksData['mark_type'] == 'like') {
                            likeActive = 'active';
                        } else if (commentMarksData['mark_type'] == 'dislike') {
                            dislikeActive = 'active';
                        }
                    }

                    //Если мы не авторизированы, то блок лайков и дизлаков будет при клике перенаправлять пользователя на страницу входа
                    if (!this.authorizeUserId) {
                        href = 'href = /account/login';
                    }

                    //Если у данного коммента есть ответы, показываем кнопку загрузки след. ответов
                    if(this.commentsWithAnswers[comment.comment_id]){
                        const colOfAnswers = this.commentsWithAnswers[comment.comment_id].colOfAnswers;
                        const lastNumber = +String(colOfAnswers).split('').pop();

                        let ansW = 'ответ';
                        if(lastNumber === 0 || lastNumber >= 5 || colOfAnswers >= 11){
                            ansW += 'ов';
                        } else if(lastNumber >= 2 && lastNumber <= 4){
                            ansW += 'a';
                        }
                        showMoreAnswersHtml = `<div class="show_more_answers"><span class="show_more_answers_cntr">Показать</span> <span class="col_of_answers">${colOfAnswers}</span> ${ansW}</div>`;
                    }

                    const dateStr = this.getFormattedDateStr(comment);

                    //Добавляем айди комментариев под хэшированым ключом
                    const hashId = this.hashCode(comment.comment_id);
                    this.commentsHashIds[hashId] = +comment.comment_id;

                    let template = `
                                <div class="comment">
                                    <div id = 'comment_id' style="display: none">${hashId}</div>
                                    <a href="/account/userprofile/${comment.author_id}" class="user_avatar">
                                        <img src="/public/users_icons/${comment.author_id}.png" alt="avatar">
                                    </a>
                                    <div class="inner_comment_box">
                                        <div class="user_information">
                                            <a href="/account/userprofile/${comment.author_id}" class="user_name">${comment.name}</a>
                                            <div class="post_date">${dateStr}</div>
                                        </div>
                                        <p class="comment_text">
                                            ${this.getTextFromUnicodeStr(comment.comment)}
                                        </p>
                                        <div class="end_comment_block">
                                            <div class="comment_activities">
                                                <p class="answer_button">
                                                    Ответить
                                                </p>
                                                <div class="marks">
                                                    <a ${href} class="likes_block ${likeActive}">
                                                        <div class="like"></div>
                                                        <p>${comment.likes == 0 ? '' : comment.likes}</p>
                                                    </a>
                                                    <a ${href} class="dislikes_block ${dislikeActive}">
                                                        <div class="dislike"></div>
                                                        <p>${comment.dislikes == 0 ? '' : comment.dislikes}</p>
                                                    </a>
                                                 </div>
                                             </div>
                                        </div> 
                                        ${showMoreAnswersHtml}
                                    </div>
                                    <div class="comment_menu_trigger">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            `;

                    this.finallyCommentsCodes.push(template);
                }

                this.isCommentsReady = true;    //Это значит, что комментарии готовы для вставки на страницу
                this._readyState = 0;
                clearInterval(intervalId);
            }
        }, 50);
    }


    //Рендер комментов
    async render(){
            if (this.isCommentsReady) {

                async function* getCommentAsync(comments, timeout) {
                    for (let comm of comments) {
                        await new Promise(resolve => setTimeout(resolve, timeout));
                        yield comm;
                    }
                }

                this.beforeRenderHandler();

                //Вставляем комменты на страницу асинхронно(то есть один коммент за время timeout)
                let commentsGenerator = getCommentAsync(this.finallyCommentsCodes, this.commentTimeout);

                for await (let commentCode of commentsGenerator) {
                    this.parentNode.insertAdjacentHTML('beforeend', commentCode);
                    this.forbidEdit(this.parentNode.lastElementChild);   //Запрещаем изменение айди комментария
                }
                
                this.finallyCommentsCodes = [];   //Чистим буфер комментов
                this.colOfPostedComments += this.comments.length;

                if (this.colOfAllComments !== 0) {
                    if (this.nextCommentsTrigger) {
                        //Если мы не можем показать больше комментов, убираем кнопку показать еще
                        if (this._isLastPage) {
                            this.nextCommentsTrigger.style.display = 'none';

                            //Уменьшаем отступ от кнопки еще
                            const commentsBlockBody = document.querySelector('.comments_block_body');
                            commentsBlockBody.style.paddingBottom = '20px';
                        } else {
                            //Устанавливаем отступ от кнопки еще
                            const commentsBlockBody = document.querySelector('.comments_block_body');
                            commentsBlockBody.style.paddingBottom = '65px';
                            this.nextCommentsTrigger.style.display = '';
                        }
                        this.offset = this._nextOffset; // Меняем смещение для того, чтобы в следующий раз получать следующие комментарии
                    }
                }

                this.isCommentsReady = false;
                this.afterRenderHandler();
                return 'success';
            }
        throw new Error('comments render error');
    }


    //Метод для хэширования айди коммента
    hashCode (str){
        str = str.toString();
        var hash = 0;
        for (let i = 0; i < str.length; i++) {
            let character = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash; // Конвертируем в 32-битное целое
        }
        return hash;
    }


    //Запретить изменение айди комментария или ответа
    forbidEdit(commentNode) {
        let observer = new MutationObserver(mutationRecords => {
            for (const mutationRecord of mutationRecords) {
                if(mutationRecord.target.parentNode)
                mutationRecord.target.parentNode.innerText = mutationRecord.oldValue;
            }
        });
        observer.observe(commentNode.querySelector('#comment_id'), {
            subtree: true,
            characterDataOldValue: true
        });
    }


    //Переводим строку в строку, содержащюю коды символов коммента в юникоде
    getCommentUnicodeStr(str){
        const encoder = new TextEncoder('utf-8');
        return encoder.encode(str).join(',');
    }


    //Переводим строку с юникод символами в обычный читаемый текст
    getTextFromUnicodeStr(coddingStr){
        const decoder = new TextDecoder();
        const uint8 = new Uint8Array(coddingStr.split(','));
        return decoder.decode(uint8);
    }
}