
import LoadParser from "./loadParser.js";
import Annotations from "/public/scripts/annotations.js";

const postsBlock = document.querySelector('.posts_block');

//Если пользователь доскролил до конца блока с постами, подгружаем следующие комменты
let isLoading = false;    //Идет ли загрузка постов
let currentOffset = 0;    //Текущее количество отрендеренных постов
let postsLimit;           //Ограничение на количество отрендериваемых за раз постов
let colOfPosts;           //Колличество всех постов
(async()=>{
     let response = await fetch('', {
        method: "post",
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: 'get_info'
    });
    ({limit: postsLimit, count: colOfPosts} = JSON.parse(await response.json()));
    currentOffset += postsLimit;
})();

function getPostHTMLTemplate(post){
    let currentDateStr = post['date_of_create'];
    if(post['date_of_last_edit']) currentDateStr = post['date_of_last_edit'];
    let formatter = new Intl.DateTimeFormat("ru", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    let dateStr = formatter.format(Date.parse(currentDateStr));
    return `
        <article class="blog_recording" style="background-image: url('/public/uploaded_information/${post.id}.jpg')">
                <div class="bg_card_shadow"></div>
                <?php if(!empty($post['category']["name"])):?>
                    <a href="/categorypage/${post.id}" class="category">${post.category.name}</a>
                <?php endif;?>
                <a href="<?='/post/'.$post['id']?>" class="blog_name">
                    ${post.name}
                </a>
                <div class="last_block">
                    <div class="first_flex">
                        <div class="likes annotation_block" data-annotation-content = "понравилось">
                            <img src="/public/imgs/likeWhite.svg"/>
                            <p>${post.likes}</p>
                        </div>
                        <div class="views annotation_block" data-annotation-content = "посмотрело">
                            <img src="/public/imgs/eyeWhite.svg"/>
                            <p>${post.views}</p>
                        </div>
                        <div class="blog_date annotation_block" data-annotation-content = "дата изменения">
                            <img src="/public/imgs/clockWhite.svg"/>
                            <p>
                                ${dateStr}
                            </p>
                        </div>
                    </div>
                    <div class="share">
                        <img src="/public/imgs/shareWhite.svg"/>
                        <p>Поделиться</p>
                    </div>
                </div>
        </article>
    `;
}

async function renderPosts(){
    if(colOfPosts <= currentOffset){                                //Если все посты отрендеренны, удаляем обработчик
        window.removeEventListener('scroll', renderPosts);
    }
    if(window.pageYOffset+document.documentElement.clientHeight > postsBlock.offsetTop + postsBlock.clientHeight + 60){
        if(!isLoading && postsLimit && colOfPosts > currentOffset){
            isLoading = true;       //Запрещаем запрос следующих постов во время рендеринга и загрузки

            const formD = new FormData();
            formD.set('currentOffset', currentOffset);
            const respPromise = fetch('', {
                method: "post",
                body: formD
            });

            const loadBlock = document.createElement('div');
            loadBlock.className = 'loading_block';
            postsBlock.append(loadBlock);
            const loader = new LoadParser(loadBlock, 0, '/public/imgs/loading.gif');      //Загрузка
            loader.start();
            const startTime = Date.now();

            const resp = await respPromise;       //Запускаем промис

            //Рендер постов
            async function postsRender(){
                let posts = JSON.parse(await resp.json());

                await Promise.all(posts.map(async (post) => {
                    let elem = document.createElement('div');
                    elem.className = 'pre_render_post_template blog_recording';
                    postsBlock.append(elem);
                    postsBlock.insertAdjacentHTML('beforeend', getPostHTMLTemplate(post));
                    const recentlyAddedPost = postsBlock.lastElementChild;
                    recentlyAddedPost.classList.add('js_rendered');
                    recentlyAddedPost.style.display = 'none';
                    setTimeout(()=>{
                        recentlyAddedPost.style.display = '';
                        elem.remove();
                        recentlyAddedPost.classList.add('visible');
                    }, 200);
                    return true;
                }));
                currentOffset += posts.length;
            }
            const timerId = setInterval(async() => {
                let currentTime = Date.now();
                if(currentTime - startTime >= 600){
                    clearInterval(timerId);
                    loader.stop();
                    loadBlock.remove();

                    //Рендер постов
                    await postsRender();
                    isLoading = false;

                    //Рендерим аннотации для лайков, просмотров, даты и т.д.
                    let annotations = new Annotations('.annotation_block');
                    annotations.dispatch();
                }
            }, 50);
        }
    }
}
window.addEventListener('scroll', renderPosts);