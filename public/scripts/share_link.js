
document.addEventListener('click', event => {
    if(!event.target.closest('.share')) return;

    navigator.clipboard.writeText('').then(() => {
        console.log('success');
    }).catch(err => {
        console.log('Something went wrong', err);
    });
});
