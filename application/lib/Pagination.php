<?php


namespace application\lib;


class Pagination
{

    private $route;
    public $totalCount;
    private $limit;
    public $totalPageCount;
    public $currentPage;
    private $pagesMaxInPagination;

    public function __construct($route, $totalCount, $limit = 9, $pagesMaxInPagination = 5)
    {
        $this->route = $route;
        $this->totalCount = $totalCount;
        $this->limit = $limit;
        $this->pagesMaxInPagination = $pagesMaxInPagination;
        $this->totalPageCount = $this->getPageCount();
    }

    public function getContent(){
        if($this->totalCount != 0) {
            $this->setCurrentPage();
            $paginationCode = '';
            $limits = $this->getLimits();
            for ($pageId = $limits[0]; $pageId <= $limits[1]; $pageId++) {
                if ($pageId == $this->currentPage) {
                    $paginationCode .= "<button class='active'><a href=\"/{$this->route['controller']}/{$this->route['action']}/$pageId\">$pageId</a></button>";
                } else {
                    $paginationCode .= "<button><a href=\"/{$this->route['controller']}/{$this->route['action']}/$pageId\">$pageId</a></button>";
                }
            }
            return $this->finalHtml($paginationCode);
        }
    }

    private function getLimits(){
        $limits = array();
        if($this->totalPageCount > $this->pagesMaxInPagination){
            $limits[0] = $this->currentPage - (round($this->pagesMaxInPagination / 2) - 1);
            $limits[1] = $this->currentPage + floor($this->pagesMaxInPagination / 2);

            if($limits[0] <= 0){
                $limits[0] = 1;
                $limits[1] += (round($this->pagesMaxInPagination / 2) - 1) - ($this->currentPage - 1);
            }
            else if($limits[1] > $this->totalPageCount){
                $limits[0] -= floor($this->pagesMaxInPagination / 2) - ($this->totalPageCount - $this->currentPage);
                $limits[1] = $this->totalPageCount;
            }
        }
        else{
            $limits[0] = 1;
            $limits[1] = $this->totalPageCount;
        }
        return $limits;
    }

    private function finalHtml($paginationCode){
        $prevDis = '';
        $nextDis = '';
        if($this->currentPage == 1){
            $prevDis = 'disabled';
        }
        if($this->currentPage == $this->totalPageCount){
            $nextDis = 'disabled';
        }

        $page = $this->currentPage - 1;
        $previous = "
            <div class='buttons_controllers'>
                <button $prevDis><a href=\"/{$this->route['controller']}/{$this->route['action']}/1\">&laquo;</a></button>
                <button $prevDis><a href=\"/{$this->route['controller']}/{$this->route['action']}/$page\">
                    <span>&lt;</span><span>Назад</span></a>
                </button>
            </div>
            ";
        $page = $this->currentPage + 1;
        $next = "
            <button class='next_page' $nextDis><a href=\"/{$this->route['controller']}/{$this->route['action']}/$page\">
                <span>Вперед</span><span>&gt;</span></a>
            </button>
            ";

        return $previous.'<div class="pages_controllers">'.$paginationCode.'</div>'.$next;
    }

    private function getPageCount(){
        return ceil($this->totalCount / $this->limit);
    }

    private function setCurrentPage(){
        if(isset($this->route['page'])){
            $pageId = $this->route['page'];

            if($pageId > 0 && $pageId <= $this->totalPageCount){
                $this->currentPage = $pageId;
            }
            else if($pageId > $this->totalPageCount){
                $this->currentPage = $this->totalPageCount;
            }
            else if($pageId == 0){
                $this->currentPage = 1;
            }
        } else{
            $this->currentPage = 1;
        }
    }

}