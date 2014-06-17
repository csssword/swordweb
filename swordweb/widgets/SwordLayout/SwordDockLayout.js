/**
 * 停靠式布局管理器
 * 依托锚定式布局
 * @type {Class}
 */
var SwordDockLayout = new Class({
    name: 'SwordDockLayout'
    ,Implements: [Events, Options]
    ,container : null
    ,layoutWidget: null
    ,anchorMap:{

        anchorTop:function(node){
            var v = node.getCoordinates();
            return v['bottom'];
        }
        ,anchorBottom:function(node){
            var v = node.getCoordinates();
            return window.getSize().y - v['top'];
        }
        ,anchorLeft:function(node){
            var v = node.getCoordinates();
            return v['right'];
        }
        ,anchorRight:function(node){
            var v = node.getCoordinates();
            return window.getSize().x - v['left'] ;
        }
    }
    ,options:{
        name: null
        ,pNode:null
    }
    ,initialize:function() {


    }
    ,initParam: function(initPara) {
        this.htmlOptions(initPara);
        this.container = initPara;
        this.build();

    }

    ,initData:function(data) {

    }

    ,build:function(){
        this.layoutWidget = new SwordAnchorLayout();
        this.layoutWidget.setAnchorMap(this.anchorMap);
        this.layoutWidget.initParam(this.container);

    }
    ,getLayoutWidget: function(){
        return this.layoutWidget;
    }

});