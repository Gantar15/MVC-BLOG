//Если у формы указан специальный атрибут data-non-autosubmit, то не выполняем валидацию при потере фокуса на поле
//Если у формы указан специальный атрибут data-non-validate, то не делаем валидацию этой формы
//У кнопки вне формы может быть указан атрибут data-parent-form-name с именем формы, которую мы хотим отправлять по нажатию на данную кнопку
//У самописных элементов формы может быть атрибут data-input-value, в котором должно храниться значение нашего рукописного инпута(анологично value у встроенных элементов формы).А так же должен быть атрибут name с именем инпута


import LoadParser from "./loadParser.js";
import inputExplore from "./input_explorer.js";

    let closeObj = {}, openObj = {};
    closeObj.onClose = ()=>{};
    openObj.onOpen = () => {};
    let modal = $m.modal(`
                            <div class="modal-header">
                                <span>Example window</span>
                                <span class="modal-close" data-closer>&times;</span>
                            </div> 
                            <div class="modal-body">
                                <p>  
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button data-closer>OK</button>
                            </div>
                        `, {
        width: 350,
        onCloseObj: closeObj,
        onOpenObj: openObj
    });

    const buttons = document.querySelectorAll('button[data-parent-form-name], input[data-parent-form-name]');
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {

        //Если у формы указан специальный атрибут data-non-validate, то не делаем валидацию этой формы
        if(form.hasAttribute('data-non-validate')) return;

        const inputs = form.querySelectorAll('input, textarea, [data-input-value]');


        //Отправка запросов и обработка ответов от сервера
        async function formWorker(isUserSubmit = false, input = false, submitButton){
            if(!form.isLoading) {
                submitButton.style.pointerEvents = 'none';

                const loader = new LoadParser(submitButton, 200, '/public/imgs/loading.gif');
                loader.start();
                form.isLoading = true;

                const formD = new FormData(form);               //Добавляем значения полей ввода для отправки на сервер
                inputs.forEach(el => {
                    if(el.dataset.inputValue && !formD.has(el.dataset.inputValue))
                        formD.set(el.getAttribute('name'), el.dataset.inputValue);
                });
                let url = form.action;
                let method = form.method;
                let formData = formD;
                if(isUserSubmit){                       //Если форму отправляет пользователь, а не скрипт для проверки полей, то отправляем ключ, чтоб php обработал форму
                    formData.set('login_trusted', true);
                }
                let response = await fetch(url, {
                    method: method,
                    body: formData
                });

                if(response.ok){
                    loader.stop();
                    form.isLoading = false;

                    const json = await response.json();

                    if (json.url) {
                        window.location.href = json.url;
                    }

                    //открытие всплывающего окна
                    if(json.type === 'popup' && isUserSubmit) {
                        if (json.refresh) {
                            closeObj.onClose = () => {
                                window.location.href = window.location.pathname;
                            };
                        }
                        submitButton.style.pointerEvents = '';

                        document.querySelector('.modal-header span').innerHTML = json.status;
                        document.querySelector('.modal-body p').innerHTML = json.message;
                        modal.open();
                    }

                    //Добавление полей с сообщениями о ошибке валидации под определенными инпутами
                    else if(json.type === 'validation') {

                        function renderInvalidTemplate(errorArray) {
                            const NameOfInvalidField = errorArray.field_name;
                            const invalidField = form.querySelector(`[name=${NameOfInvalidField}]`);
                            invalidField.classList.add('invalid');

                            const tmplNode = invalidField.parentNode.querySelector('.field_error_inf');
                            if (tmplNode) {
                                tmplNode.querySelector('p').innerText === errorArray.message;
                                return;
                            }

                            const fieldErrorNode = document.createElement('div');
                            fieldErrorNode.className = 'field_error_inf';
                            const wrongFieldIcon = document.createElement('div');
                            wrongFieldIcon.className = 'wrong_field_icon';
                            fieldErrorNode.prepend(wrongFieldIcon);

                            fieldErrorNode.insertAdjacentHTML('beforeend', `
                                <p>${errorArray.message}</p>
                            `);

                            if (tmplNode) {
                                tmplNode.replaceWith(fieldErrorNode);
                            } else {
                                invalidField.after(fieldErrorNode);
                            }
                        }

                        if (input === false) {           //Если не передано конкретное поле, делаем валидацию всех полей
                            for (const errorArray of json.message) {
                                renderInvalidTemplate(errorArray);
                            }
                        } else {
                            const errorArray = json.message.find(el => el.field_name === input.getAttribute('name'));
                            if (errorArray) {            //Если в указаном поле нет ошибки, ничего не делаем
                                renderInvalidTemplate(errorArray);
                            }
                        }
                    }

                    //Отображение окошка с общей ошибкой
                    else if(json.type === 'general' && isUserSubmit){
                        const generalFormMessage = document.querySelector('.general_form_message');
                        generalFormMessage.querySelector('p').textContent = json.message;
                        generalFormMessage.classList.add('active');
                    }
                }
            }
        }


        let submitButton = [...buttons].find(button => button.dataset.parentFormName == form.getAttribute('name'));         //Кнопка для отправления формы может иметь атрибут data-parent-form-name с именем соотв. формы или просто находиться в самой форме
        if(!submitButton){
            submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        }

        form.isLoading = false;     //Ключ для того, чтобы пользователь не мог отправить форму еще раз во врпемя загрузки этой формы
        form.onsubmit = submitButton.onclick = function(event) {
            event.preventDefault();
            const isUserSubmit = true;              //Ключ для того, чтоб php понял, что форму отправляет пользователь, а не скрипт для валидации полей и залогинил его
            formWorker(isUserSubmit, false, submitButton);
        };



        form.addEventListener('reset', ()=>{
            inputExplore();
            inputs.forEach(input => {
                if(!input.value)
                    input.classList.remove('invalid');
                    const fieldErrorInf = input.parentNode?.querySelector('.field_error_inf');
                    fieldErrorInf?.remove();
            });
        });

        inputs.forEach(input => {

            input.addEventListener('invalid', function(ev){    //Удаляем стандартное окно незаполненного поля
                ev.preventDefault();
            });

            input.addEventListener('focus', function(event) {
                const tmplNode = input.parentNode.querySelector('.field_error_inf');
                const generalFormMessage = document.querySelector('.general_form_message');
                if(tmplNode){
                    tmplNode.remove();
                    input.classList.remove('invalid');
                    const wrongFieldIcon = input.parentNode.querySelector('.wrong_field_icon');
                    wrongFieldIcon && wrongFieldIcon.remove();
                }
                if(generalFormMessage){
                    generalFormMessage.classList.remove('active');
                    generalFormMessage.querySelector('p').innerText = '';
                }
            });

            //Если у формы указан специальный атрибут data-non-autosubmit, то не выполняем валидацию при потере фокуса на поле
            if(!form.hasAttribute('data-non-autosubmit'))
            input.addEventListener('blur', function (event) {
                if (this.value) {
                    formWorker(undefined, input, submitButton);
                }
            });

        });
    });

window.addEventListener('load', () => inputExplore());