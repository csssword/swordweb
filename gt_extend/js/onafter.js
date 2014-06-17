function pageAfter() {
    var initFunc = window.initView || $empty;
    if(window.$init_gs_caculate)$init_gs_caculate();
    initFunc.run();
}