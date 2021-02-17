const burger = document.querySelector('.aside_burger');
const navbar = document.querySelector('.aside_menu');

document.addEventListener('click', event => {
    const target = event.target.closest('.aside_category');
    if(!target) return;

    target.classList.toggle('active');
});


burger.addEventListener('click', () => {
    navbar.classList.toggle('active');
});