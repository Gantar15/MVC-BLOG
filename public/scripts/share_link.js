
//parentNodeSelector - селектор блока, который содержит ссылку(<a>)
//triggerNodeSelector - селектор блока, при нажатии на который копируется ссылка
//linkNodeSelector - селектор тега-ссылки(<a>), который содержит копируемый адресс

import pageNotification from "./page_notification.js";

export default function shareLink(parentNodeSelector, triggerNodeSelector, linkNodeSelector) {
    let notificationSubject = new pageNotification();

    document.addEventListener('click', event => {
        const triggerNode = event.target.closest(triggerNodeSelector);
        if (!triggerNode) return;

        const urlText = event.target.closest(parentNodeSelector).querySelector(linkNodeSelector).href;
        navigator.clipboard?.writeText(urlText).then(() => {
            notificationSubject.render('Ссылка скопирована в буфер обмена');
        }).catch(() => {
            notificationSubject.render('Ошибка копирования в буфер обмена');
        });
    });
}
