<style>
    @font-face{
        font-family: Open Sans;
        src: url(/public/fonts/OpenSans-Regular.ttf);
        font-weight: normal;
        font-style: normal;
    }
    @font-face{
        font-family: Open Sans;
        src: url(/public/fonts/OpenSans-SemiBold.ttf);
        font-weight: 500;
        font-style: normal;
    }

    *{
        margin: 0;
        padding: 0;
    }

    .error_block > div{
        display: flex;
        align-content: center;
        justify-content: center;
        margin-top: 20vh;
    }
    .error_inf{
        display: flex;
        flex-direction: column;
        align-content: flex-start;
    }
    .error_inf img{
        width: 120px;
        height: 30px;
        object-fit: cover;
        margin-left: -10px;
    }
    .error_block .error_inf h3 {
        margin-top: 30px;
        color: #323232;
        text-align: start;
        font-family: "Open Sans";
        font-size: 16px;
        font-weight: bold;
    }
    .error_block .error_inf h3 span{
        font-size: 13px;
        color: #5b5b5b;
        font-weight: normal;
    }
    .error_block .error_inf p {
        max-width: 290px;
        overflow-wrap: break-word;
        margin-top: 10px;
        text-align: start;
        font-family: "Open Sans";
        font-size: 14px;
        color: #3b3b3b;
    }
    .error_block .error_inf p>span{
        font-size: 14.8px;
        color: #1f1f1f;
    }
    .error_inf + img{
        width: 170px;
        height: 170px;
        object-fit: cover;
        margin-left: 20px;
        margin-top: -15px;
    }
</style>
<div class="error_block">
    <div>
        <div class="error_inf">
            <a href="/"><img src="/public/imgs/header_logo.png"></a>
            <h3>403. <span>Ошибка</span></h3>
            <p>Отказано доступе при загрузке <span><?php
                    $url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                    $url = explode('?', $url);
                    $url = $url[0];

                    echo $url;
                    ?></span></p>
        </div>
        <img src="/public/imgs/puzzle.svg">
    </div>
</div>
