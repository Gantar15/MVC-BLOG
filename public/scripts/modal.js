
const $m = {};
window.$m = $m;



$m.modal = function(modalHTML, options){

    function _createModal(modalHTML, options){
        const modal = document.createElement("div");
        modal.classList.add("emodal");
        modal.insertAdjacentHTML(`afterbegin`, 
        `
            <div class="modal-overlay">
                <div class="modal-window" style="width: ${options.width + "px"}">
                    ${modalHTML}
                </div>
            </div>
        `);

        return modal;
    }

    const modal = {
        open(){
            document.addEventListener('keydown', escModalCloseHandler);
            $modal.classList.add("open");
            options?.onOpenObj?.onOpen?.();
        },
        close(){
            $modal.classList.remove("open");
            options?.onCloseObj?.onClose?.();
        },
        destroy(){
            $modal.removeEventListener("click", modalCloseHandler);
            $modal.remove();
        }
    };
    
    const $modal = _createModal(modalHTML, options);
    document.body.prepend($modal);

    function modalCloseHandler(event){
        if(event.target.closest("[data-closer-ok]")){
            options.onOkObj.onOk();
            modal.close();
        }
        else if(event.target.closest("[data-closer]") || event.target.matches(".emodal.open .modal-overlay")){
            modal.close();
        }
    }
    function escModalCloseHandler(event){
        if (event.code == 'Escape') {
            modal.close();
        }
        document.removeEventListener('keydown', escModalCloseHandler);
    }
    $modal.addEventListener("click", modalCloseHandler);

    return modal;

};

