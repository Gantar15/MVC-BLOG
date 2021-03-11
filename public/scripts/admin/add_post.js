import PostConstructor from "./post_constructor.js";
import imageUploader from "../image_uploader.js";
import inputExplore from "../input_explorer.js";
import Select from "../select.js";

inputExplore();
const categoriesNamesBlock = document.querySelector('.post_filters .category .categories_list');
const categoriesNames = categoriesNamesBlock.querySelectorAll('p');
const namesData = [...categoriesNames].map((nameNode, i) => {
    return {id:i+1, value:nameNode.innerText};
});
categoriesNamesBlock.remove();
const select = new Select(".post_filters #category_select", {
    placeholder: "Выберите категорию",
    selectedId: "",
    data: namesData
},()=>console.log(select.selectedItem));

imageUploader('#post_icon #fg4', `
                        <div class="add_image_trigger">
                            <p>загрузите обложку поста</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `);





const postConstructor = new PostConstructor();