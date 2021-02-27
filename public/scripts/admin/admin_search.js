
//Кнопка для удаления всего текста из поля поиска
const searchBlock = document.querySelector('.search_block');
if(searchBlock) {

    const searchTextNode = searchBlock.getElementsByTagName('input')[0],
        removeSearchContent = searchBlock.querySelector('.remove_search_content');

    searchTextNode.addEventListener('input', () => {
        if (searchTextNode.value) {
            removeSearchContent.classList.remove('hidden');

            removeSearchContent.onclick = () => {
                searchTextNode.value = '';
                removeSearchContent.classList.add('hidden');
            };
        } else {
            removeSearchContent.classList.add('hidden');
        }
    });
    searchTextNode.dispatchEvent(new Event('input'));


//Запрещаем отправлять запрос с пустой строкой
    const searchTrigger = searchBlock.querySelector('.search_trigger'),
        searchBlockInput = searchBlock.getElementsByTagName('input')[0];

    searchBlock.onsubmit = searchTrigger.onclick = function (event) {
        if (!searchBlockInput.value) {
            event.preventDefault();
            return;
        }
        searchBlock.submit();
    };
}