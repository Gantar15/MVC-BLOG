const burger = document.querySelector('.navbar-brand-burger');
const navbar = document.querySelector('.navbar');

document.addEventListener('click', (event)=>{
    if(burger.contains(event.target)) {
        burger.classList.toggle('active');
        navbar.classList.toggle('active');
    }
    else if(!navbar.contains(event.target)){
        burger.classList.remove('active');
        navbar.classList.remove('active');
    }

    function navbarHandler(event){
            if(event.code == 'Escape'){
                burger.classList.remove('active');
                navbar.classList.remove('active');
            }
        document.removeEventListener('keydown', navbarHandler);
    }
    if(navbar.classList.contains('active')){
        document.addEventListener('keydown', navbarHandler);
    }


    const opener = event.target.closest('.opener');
    if(opener){
        opener.closest('.controllers_block').classList.toggle('active');
        const postContent = opener.closest('.post').querySelector('.post_content');
        if(postContent.style.boxShadow) {
            postContent.style.boxShadow = '';
        } else{
            postContent.style.boxShadow = '0 3px 3px 0 #f8f8f8'
        }
    }
});
