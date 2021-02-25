import imageUploader from "../image_uploader.js";

imageUploader('.second_half .add_image > input', `
                        <div class="add_image_trigger">
                            <p>загрузите изображение</p>
                            <img src="/public/imgs/add_image.svg">
                        </div>
                    `);
