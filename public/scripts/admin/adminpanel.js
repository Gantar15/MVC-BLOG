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