/**
 左右选择框组件移动控制台
 @class swordweb.widgets.SwordMove.SwordMoveButton
 * @implements Events
 * @implements Options
 * @extends SwordMoveBase
 **/

var SwordMoveButton = new Class({

    Implements:[Events,Options]
    //继承容器
    //继承容器的属性 widgets(type Hash)
    ,Extends : SwordMoveBase

/**
 * 此类的类名称 值使用 SwordMoveButton
 * @property {private final string} name
 */
    ,name:"SwordMoveButton"

    ,options:{
        /**
         * 组件类别声明 ,应该为 SwordMove ;在组件的根标签上必须声明此属性
         * @property {public string} sword
         */
        sword : null
        /**
         * 组件对象唯一标识，读取页面标签上的name属性；在表格组件的根标签上必须声明此属性，且要求声明的值唯一
         * @property {public string} name
         */
        ,name : null
        ,pNode : null         //顶级节点
    }

     ,leftWidgets:new Hash()//注册的左移动组件库
     ,rightWidgets:new Hash()//注册的右移动组件库
    
    ,initParam : function(initPara) {
        this.htmlOptions(initPara);
        this.initMoveZone();
    }
     ,pNode : function() {
        return this.options.pNode;
    }
   
    ,initMoveZone :function(){
       var container= this.createContainer().inject(this.pNode());
       this.container=container;
       var associateDiv = this.pNode().getElement("div[name='associate']");
       pc.getPageInit().addEvent('onDataInit', function() {
            this.getAssociate(associateDiv);
        }.bind(this));

        this.createButton();
    }
   
    ,getAssociate:function(assDiv){
         if ($chk(assDiv)) {
            var elements = assDiv.getElements("div[location =='left'||'right']");
            elements.each(function(widget, index) {
                var widgetName = widget.get("widgetName");
                var widgetObj = this.loadWidget(widgetName);
                var location = widget.get("location");
                var widgetType = widgetObj.name;
                if(widgetType!='SwordMove'){
                     return;
                }
              if(location=='left'){
                  this.leftWidgets.include(widgetName,widgetObj);
              }
                else if(location=='right'){
                 this.rightWidgets.include(widgetName,widgetObj);
              }

            }.bind(this));
        } else {
                alert('请设置关联的组件！');
        }
    }
   
    //create outer container
   , createContainer:function(){
        var height=200;

        var container = new Element('div', {
            'name' : 'console',
            'class':'moveContainer'
        });
        var ch=this.pNode().getChildren('div[name!=associate]');
        if(ch.length>0){
            var height=ch.length*35;
            container.setStyle('height', height+'px');
        }
        return container;
    }
    ,createButton:function(){
      var child = this.pNode().getElements("div[name!='associate']");
       child.each(function(item) {
                var name = item.get('name');
                var type = item.get('type');
                var itemO = this.items[name];
                if (itemO != null) {
                    this.container.adopt(this.createDefaultHref(
                            item, name, type,
                            itemO['title'],
                            itemO['class'],
                            itemO['enabled']));
                } else {

                }
            }.bind(this))
    }
  ,createDefaultHref:function(obj,n, type,title, cls, enabled){
        var name=n;
        if(!$chk(type)){
            name=type;
        }
        var newA = new Element('a', {
            'name' : name,
            'type' : type,
            'class' : cls,
            'title' :title,
            'enabled' : !$chk(obj.get('enabled')) ? ($chk(enabled) ? enabled
                    : "true")
                    : obj.get('enabled')
        });

        if($chk(obj.get('x'))){
            newA.setStyle('width', obj.get('x'));
        }
        newA.addEvent('click', function() {
            if (newA.get('enabled') == 'true') {
             switch(type){
              case 'right': this.moveTo('right'); break;
              case 'left':this.moveTo('left');break;
              case 'allRight':this.moveAllTo('right');break;
              case 'allLeft':this.moveAllTo('left');break;
              case 'rollback':this.rollback(); break;
              default:break
             }

            }
        }.bind(this));
        
        return newA;
    }
    
        //左移,右移动
   ,moveLR:function(way,type){
        var srcWidgets=null
        var targetWidgets=null;
        if(way=='right'){
          srcWidgets=this.leftWidgets;
          targetWidgets=this.rightWidgets;
        }
        else{
          srcWidgets=this.rightWidgets;
          targetWidgets=this.leftWidgets;
         }
        this.readyMove(srcWidgets,targetWidgets,type);

    }
    //选中移动
   ,moveTo:function(way){
       if(way=='left'||way=='right'){
            this.moveLR(way,'checked');
       }
    }
    //整体移动
   ,moveAllTo:function(way){
         this.moveLR(way,'all');
    }
    //回退
    ,rollback:function(){
    	var tempWidgets =this.leftWidgets.map(function(item, index){
    	    return item ;
    	}); 
       var widgets=tempWidgets.combine(this.rightWidgets);
         
        widgets.each(function(widget) {
         var outerLis= widget.getLisByOuter();
         outerLis.each(function(li){
        	 li.dispose();
         });
         var inLis= widget.getLisByInsert();
         for(var i=0;i<inLis.length;i++){
            	 var org=inLis[i].get('origin');
                 var src= widgets.get(org);
                  if($defined(src)){
                     src.doMove(src,widget.getInLis(org));
                      inLis= widget.getLisByInsert();
                      i=0;
                  }
         }
             widget.adjustItem();
        });
    }
    //指定名称的href是不可用
     ,setDisabled : function(name) {
        var hrefs = this.container.getElements("a[name='" + name + "']");
        if (hrefs.length != 1){
            alert('元素不存在或指定名称的必须唯一！');
            return;
        }
       else{
            var hre=hrefs[0];
            this.setHrefStatus(hre,false);
           }
    }
    //指定名称的href是可用
      ,setEnable : function(name) {
        var hrefs = this.container.getElements("a[name='" + name + "']");
        if (hrefs.length != 1){
            alert('元素不存在或指定名称的必须唯一！');
            return;
        }
       else{
            var hre=hrefs[0];
            this.setHrefStatus(hre,true);
           }
    }
    ,setHrefStatus:function(hre,status){
        if(hre.get('tag')=='a'){
               var oldClass= hre.get('class');
                var oldStatus= hre.get('enabled');
                if(status==false&&oldStatus=='true'){
                    hre.set('class', oldClass+'_g');
                    hre.set('enabled', status);
                }
                else if(status==true&&oldStatus=='false'){
                    hre.set('class', oldClass.replace('_g',''));
                    hre.set('enabled',status);
                }

            }
    }
    });

SwordMoveButton.implement({
    items : {
        "left" : {
            "name" : "left",
            "type" : "left",
            "class" : "a_r_d",
            "enabled" : "true",
            "title"  :  "选中左移"
        },
        "allLeft" : {
            "name" : "allLeft",
            "type" : "allLeft",
            "class" : "a_r_s",
            "enabled" : "true",
            "title"  :  "全部左移"
        },
        "right" : {
            "name" : "right",
            "type" : "right",
            "class" : "a_l_d",
            "enabled" : "true",
             "title"  :  "选中右移"
        },
        "allRight" : {
            "name" : "allRight",
            "type" : "allRight",
            "class" : "a_l_s",
            "enabled" : "true",
            "title"  :  "全部右移"
        },
        "rollback" : {
            "name" : "rollback",
            "type" : "rollback",
            "class" : "a_l_rollback",
            "enabled" : "true",
            "title"  :  "重置"
        }
    }
});




