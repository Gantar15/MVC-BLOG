
const filtersBlock = document.querySelector('.filters_block'),
    filtersOpenTrigger = document.querySelector('.filters_open_trigger'),
    filtersBlockFilters = document.querySelectorAll('.filters > li');

    if(filtersBlock) {

        document.addEventListener('click', (event) => {
            //Открытие и закрытие меню фильтров
            if (filtersOpenTrigger.contains(event.target)) {
                filtersBlock.classList.toggle('active');
                filtersOpenTrigger.lastElementChild.style.display = "none";
            }

            //Закрытие меню фильтров по клику вне его
            if (!filtersBlock.contains(event.target)) {
                filtersBlock.classList.remove('active');
            }

            //Выбор одного фильтра
            else {
                if (event.target.closest('.filters > li')) {
                    filtersBlockFilters.forEach((elem) => {
                        elem.classList.remove('selected');
                    });
                    event.target.classList.add('selected');
                    filtersBlock.classList.remove('active');
                }
            }
        });
    }
