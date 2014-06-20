/**
 * 锚定式布局管理器
 * 锚定布局的基本思路就是设定控件的边界与容器或其它控件之间的距离，最终得出希望得到的局部效果。
 * 锚定式布局类似于绝对定位的布局，但其功能比绝对定位布局要丰富的多。
 * 锚定式布局不仅支持对left和top边的定位，还支持对right和bottom边的定位
 * 不仅可以将容器的边界作为锚定目标进行定位，还支持将其他控件的边界作为锚定目标进行定位
 * 允许将任意控件设为锚定目标
 * 依托于原生态的html特点，避免过多的干预dom渲染
 *
 *  <li>left - {String|int} 左边界距离。</li>
 *  <li>anchorTop - {String} 参考anchorLeft。</li>
 *  <li>top - {String|int} 参考left。</li>
 *  <li>anchorRight - {String} 参考anchorLeft。</li>
 *  <li>right - {String|int} 参考left。</li>
 *  <li>anchorBottom - {String} 参考anchorLeft。</li>
 *  <li>bottom - {String|int} 参考left。</li>
 *  @type {Class}
 */
var SwordAnchorLayout = new Class({
    name: 'SwordAnchorLayout'
    ,Implements: [Events, Options]
    ,container : null
    ,isRefreshDom: null
    ,isRefreshWidget : null
    /**
     * 缓存组件名称，避免每次dom查找
     */
    ,widgetCache: null

    ,anchorMap:{
        anchorTop:function(node){
            var v = node.getCoordinates();
            return v['top'];
        }
        ,anchorBottom:function(node){
            var v = node.getCoordinates();
            return window.getSize().y - v['bottom'];
        }
        ,anchorLeft:function(node){
            var v = node.getCoordinates();
            return v['left'];
        }
        ,anchorRight:function(node){
            var v = node.getCoordinates();
            return window.getSize().x - v['right'] ;
        }
    }

    ,options:{
        name: null
        ,pNode: null
        ,left: null
        ,right: null
        ,top:null
        ,bottom:null
        /*  anchorXX   为其它已存在的容器名称 */
        ,anchorLeft: null
        ,anchorRight: null
        ,anchorBottom: null
        ,anchorTop: null

    }
    ,initialize:function() {


    }
    ,initParam: function(initPara) {
        this.htmlOptions(initPara);
        this.container = initPara;

        this.init();
        this.doOnRefresh();
        this.registerResize();
    }
    ,initData:function(data) {

    }
    ,init:function(){
        if($chk(this.options.anchorLeft) || $chk(this.options.anchorRight || $chk(this.options.anchorBottom) || $chk(this.options.anchorTop))){
            this.isRefreshDom = true ;
        }
        this.container.setStyle("position","absolute");
        this.container.setStyle("overflow","auto");
    }

    ,getContainer:function(){
        return this.container;
    }

    ,registerResize:function(){
        if(this.isRefreshDom === true){
            window.addEvent("resize",function(){
                this.doOnRefresh();
            }.bind(this)) ;
        }

    }
    ,setAnchorMap:function(anchorMap){
        if(anchorMap){
            $extend(this.anchorMap, anchorMap);
        }
    }

    ,doOnRefresh:function(){
        this.refreshDom();
        this.refreshWidget();
    }

    /**
     * 刷新dom
     */
    ,refreshDom:function(){
        var left  ,right ,top ,bottom ;

        if($chk(this.options.anchorLeft)){

            var widget = $w(this.options.anchorLeft);
            if(widget){
                var node = widget.options.pNode;
                if(node){
                    left = this.anchorMap.anchorLeft(node) ;
                }
            }

        }
        if($chk(this.options.anchorRight)){
            var widget = $w(this.options.anchorRight);
            if(widget){
                var node = widget.options.pNode;
                if(node){
                    right = this.anchorMap.anchorRight(node) ;
                }
            }
        }

        if($chk(this.options.anchorTop)){
            var widget = $w(this.options.anchorTop);
            if(widget){
                var node = widget.options.pNode;
                if(node){
                    top = this.anchorMap.anchorTop(node) ;
                }
            }
        }
        if($chk(this.options.anchorBottom)){
            var widget = $w(this.options.anchorBottom);
            if(widget){
                var node = widget.options.pNode;
                if(node){
                    bottom = this.anchorMap.anchorBottom(node) ;
                }
            }
        }
        var l=false, r=false, t=false,b=false;
        if($chk(this.options.left) && !this.options.left.endWith("%") ){
            l = true;
            left =  parseInt(this.options.left||0) + parseInt(left||0);
        }
        if($chk(left)){
            this.container.setStyle("left",l?(left+"px"):left);
        }
        if($chk(this.options.right) && !this.options.right.endWith("%")){
            r = true;
            right =  parseInt(this.options.right)+parseInt(right||0);
        }

        if($chk(right)){
            this.container.setStyle("right",r?(right+"px"):right);
        }

        if($chk(this.options.top) && !this.options.top.endWith("%")){
            t = true;
            top =  parseInt(this.options.top)+parseInt(top||0);
        }

        if($chk(top)){
            this.container.setStyle("top",t?(top+"px"):top);
        }
        if($chk(this.options.bottom) && !this.options.bottom.endWith("%")){
            b = true;
            bottom =  parseInt(this.options.bottom)+parseInt(bottom||0);
        }

        if($chk(bottom)){
            this.container.setStyle("bottom",b?(bottom+"px"):bottom);
        }

    }
    /**
     * 刷新sword组件
     */
    ,refreshWidget:function(){

        if(this.isRefreshWidget===null){
            var swordWidgetElements = $(this.container).getElements("div[sword][sword!='PageInit'][sword!='SwordCacheData']");
            if(swordWidgetElements.length>0){
                swordWidgetElements.each(function(item, index) {
                    if(item.getAttribute('lazy') != 'true') {
                        var widgetName = item.getAttribute("name");
                        if($chk(widgetName)){
                            this.widgetCache = new Array();
                            this.widgetCache.push(widgetName);

                        }
                    }
                },this);
                this.isRefreshWidget = true;
            }else{
                this.isRefreshWidget = false;
            }
        }
        if(this.isRefreshWidget===true){
            if(this.widgetCache.length>0){
                this.widgetCache.each(function(widgetName, index) {
                    var widget = $w(widgetName);
                    if(widget && typeof widget.onResize=="function"){
                        widget.onResize();
                    }
                },this);

            }
        }

    }

    /**
     * 定位计算，需调整算法，暂不使用
     */

//    ,getDomPosition:function (element,relative) {
//        if (element.isBody()) return {x:0, y:0};
//        var offset = this.getDomOffsets(element), scroll = element.getScrolls();
//        var position = {x:offset.x - scroll.x, y:offset.y - scroll.y};
//        var relativePosition = (relative && (relative = $(relative))) ? relative.getPosition() : {x:0, y:0};
//        return {x:position.x - relativePosition.x, y:position.y - relativePosition.y};
//    }
//    ,getDomCoordinates:function (element) {
//        if (element.isBody()) return this.getWindow().getCoordinates();
//        var position = this.getDomPosition(element), size = element.getSize();
//        var obj = {left:position.x, top:position.y, width:size.x, height:size.y};
//        obj.right = obj.left + obj.width;
//        obj.bottom = obj.top + obj.height;
//        return obj;
//    }
//    ,getDomOffsets:function (dom) {
//        if (Browser.Engine.trident) {
//            var bound = this.getBoundingClientRect(), html = dom.getDocument().documentElement;
//            return {
//                x:bound.left + html.scrollLeft - html.clientLeft,
//                y:bound.top + html.scrollTop - html.clientTop
//            };
//        }
//
//        var element = this, position = {x:0, y:0};
//
//        if (dom.isBody()) return position;
//
//        while (element && !dom.isBody()) {
//            position.x += element.offsetLeft;
//            position.y += element.offsetTop;
//
//            if (Browser.Engine.gecko) {
//                if (!dom.borderBox()) {
//                    position.x += dom.leftBorder();
//                    position.y += dom.topBorder();
//                }
//                var parent = element.parentNode;
//                if (parent && dom.styleString(parent, 'overflow') != 'visible') {
//                    position.x += dom.leftBorder(parent);
//                    position.y += topBorder(parent);
//                }
//            } else if (element != this && Browser.Engine.webkit) {
//                position.x += leftBorder(element);
//                position.y += topBorder(element);
//            }
//
//            element = element.offsetParent;
//        }
//        if (Browser.Engine.gecko && !dom.borderBox()) {
//            position.x -= dom.leftBorder();
//            position.y -= dom.topBorder();
//        }
//        return position;
//    }

    ,clear: function(){
        this.isRefreshDom = null;
        this.isRefreshWidget = null;
        delete this.widgetCache ;
    }

    ,destroy: function(){
        this.clear();
    }

});