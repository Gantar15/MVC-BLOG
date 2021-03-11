

//Показываем/скрываем группы в меню админки по нажатию на блок-заголовок группы
const burger = document.querySelector('.aside_burger');
const navbar = document.querySelector('.aside_menu');

document.addEventListener('click', event => {
    const target = event.target.closest('.category_name');
    if(!target) return;

    target.closest('.aside_category').classList.toggle('active');
});

burger.addEventListener('click', () => {
    navbar.classList.toggle('active');
});



//Добавляем выделение окна контента по клику
const groupBoxes = document.querySelectorAll('.group_box');
groupBoxes.length && groupBoxes.forEach(groupBox => {

    function setSelect(box){
        groupBoxes.forEach(el => {
            if(el != box) el.classList.remove('active_box');
        });
        box.classList.add('active_box');
    }

    groupBox.addEventListener('click', (event) => {
        const box = event.target.closest('.group_box');
        box && setSelect(box);
    });

});



//добавляем сворачивание и закрытие окна контента
document.addEventListener('click', event => {
   const target = event.target;
   if(!target.closest('.controllers')) return;

   //Если пользователь нажал на свернуть окно
   if(target.closest('.trey')){

        const parentGroupBox = target.closest('.group_box');
        if(!parentGroupBox.classList.contains('small')){

            parentGroupBox.classList.add('small');
            parentGroupBox.style.height = parentGroupBox.scrollHeight + 'px';
            const groupBoxHeader = parentGroupBox.querySelector('.group_box_header');
            parentGroupBox.style.height = groupBoxHeader.offsetHeight + 'px';
        }
        else {
            parentGroupBox.style.height = parentGroupBox.scrollHeight + 'px';
            setTimeout(()=> {
                parentGroupBox.style.height = '';
                parentGroupBox.classList.remove('small');
            },200);
        }
   }
   //Если пользователь нажал на закрыть окно
   else if(target.closest('.close')){
       const parentGroupBox = target.closest('.group_box');
       parentGroupBox.remove();
   }
});