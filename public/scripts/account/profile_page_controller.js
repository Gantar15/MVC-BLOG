
const modulesDirectory = "/public/scripts/account/profile_modules/";

//Получаем содержимое html модуля
async function getModuleContent(moduleName){
    const formD = new FormData();
    formD.set('module_name', moduleName);
    const response = await fetch('', {
        method: 'post',
        body: formD
    });

    let content;
    try {
        content = await response.json();
    }
    catch (err){
        console.warn(err.message);
        return;
    }

    return content;
}

const moduleButtons = document.querySelectorAll('[data-module-button]');
moduleButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const moduleName = button.dataset.moduleButton;
        let jsModuleObj;             //Объект с содержимым экспорта js модуля
        try {
            const modulePromise = import(modulesDirectory + moduleName + '_module.js');
            ({default: jsModuleObj} = await modulePromise);
        }
        catch (err){
            console.warn(err.message);
            return;
        }

        //Получаем содержимое html модуля
        const contentObj = await getModuleContent(moduleName);

        //Обрабатываем полученный html модуль
        jsModuleObj?.render(contentObj);
    });
});