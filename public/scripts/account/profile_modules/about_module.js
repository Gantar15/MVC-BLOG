
export default {
    render(htmlModule){
        const mainContentBlock = document.querySelector('.posts_block');
        mainContentBlock.insertAdjacentHTML('beforeend', htmlModule.content);
    }
}