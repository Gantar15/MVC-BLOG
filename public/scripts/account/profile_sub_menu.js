
const activitiesSlider = document.querySelector('.activities_slider');
const subMenuTriggers = activitiesSlider.querySelectorAll('.user_activities_menu .profile_submenu');
const userActivitiesMenu = document.querySelector('.user_activities_menu:nth-of-type(1)');
const nextUserActivitiesMenu = document.querySelector('.user_activities_menu:nth-of-type(2)');
nextUserActivitiesMenu.style.bottom = -nextUserActivitiesMenu.offsetHeight + "px";

subMenuTriggers.forEach( trigger => trigger.onclick = () => {
    activitiesSlider.classList.toggle('active');

    if(activitiesSlider.classList.contains('active')) {
        userActivitiesMenu.style.bottom = -userActivitiesMenu.offsetHeight + "px";
        setTimeout(() => nextUserActivitiesMenu.style.bottom = nextUserActivitiesMenu.offsetHeight+1+"px", 70);
    }
    else{
        nextUserActivitiesMenu.style.bottom = -nextUserActivitiesMenu.offsetHeight + "px";
        setTimeout(() => userActivitiesMenu.style.bottom = 1+"px", 70);
    }
} );