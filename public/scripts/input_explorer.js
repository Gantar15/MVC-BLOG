//Автоматическое изменение размеров текстового поля ввода формы
export default function inputExplore(){

        const textareas = document.querySelectorAll('textarea');

        if (textareas.length > 0) {
            textareas.forEach(textarea => {
                textarea.oninput = e => {
                    textarea.style.height = '';
                    textarea.style.height = textarea.scrollHeight + 'px';
                }
                textarea.dispatchEvent(new Event('input'));

                const parentForm = textarea.closest('form');
                parentForm.onreset = () => {
                    setTimeout(()=>textarea.dispatchEvent(new Event('input')));
                }
            });
        }

}