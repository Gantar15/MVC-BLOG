//Автоматическое изменение размеров текстового поля ввода формы
export default function inputExplore(){

    const forms = document.querySelectorAll('form');
    const textareas = Array.from(forms).reduce((arr, form) => {
        return arr.concat(...form.querySelectorAll('textarea'));
    }, []);

    if (textareas.length > 0) {
        textareas.forEach(textarea => {
            textarea.style.height = '';
            textarea.style.height = textarea.scrollHeight + 'px';

            textarea.oninput = e => {
                textarea.style.height = '';
                textarea.style.height = textarea.scrollHeight + 'px';
            }

            const parentForm = textarea.closest('form');
            parentForm.onreset = () => {
                textarea.style.height = '';
            }
        });
    }

}