
const inputPassword = document.querySelectorAll('.password'),
    viewPassword = document.querySelector('.view_password');

viewPassword.onclick = () => {
    inputPassword && inputPassword.forEach(el => {
        el.classList.toggle('visible');

        if (el.classList.contains('visible')) {
            el.type = 'text';
        } else {
            el.type = 'password';
        }
    });
};