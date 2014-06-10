/**
* widgets 模块
 * @module widgets
 * @requires base ,core
 */
/**
 左右选择框组件的父类
 @class swordweb.widgets.SwordMove.SwordMoveBase
 * @implements Events
 * @implements Options
 * @extends PageContainer
 **/
/*
/*
*
* 提供一些公用的方法：
*
*
* */
var SwordMoveBase = new Class({

/**
 * 此类的类名称 值使用 SwordMoveBase
 * @property {private final string} name
 */
    name:"SwordMoveBase"
   
   ,readyMove:function(srcWidgets,targetWidgets,type){
        srcWidgets.each(function(src) {
            var operItems=null;
            if(type=='checked'){
                       operItems=src.getCheckedLis();
                  }
            else if(type=='all'){
               operItems=src.getAllLis();
           }
           targetWidgets.each(function(target) {
               var validItems=null;
             if($defined(src.options.onBeforeOut)&&$chk(src.options.onBeforeOut)){
                  validItems = src.getFunc(src.options.onBeforeOut)[0](operItems,target);
                 if(typeof(validItems)=='undefined'){
                    validItems=operItems;
                 }
                else if(validItems==null||validItems.length==0){
                    return;
                 }
              }
               else {
                  validItems=operItems;
             }
                var tempItems=validItems;
              if($defined(target.options.onBeforeIn)&&$chk(target.options.onBeforeIn)){
                  tempItems = target.getFunc(target.options.onBeforeIn)[0](validItems,src);
                    if(typeof(tempItems)=='undefined'){
                    tempItems=validItems;
                 }
                else if(tempItems==null||tempItems.length==0){
                    return;
                 }
              }

              if(tempItems==null||tempItems.length==0){
                    return;
               }
             src.doMove(target,tempItems);
              tempItems=null;
             validItems=null;
            }.bind(this));
        }.bind(this));

    }

   ,loadWidget : function(widgetName) {
        var widgetObject = pc.getWidget(widgetName);
        if ($chk(widgetObject)) {
            return widgetObject;
        } else {
            if (this.alarm) {
                alert('无法获取关联组件' + widgetName);
            }
        }
    }
    
});
