/**
* widgets 模块
 * @module widgets
 * @requires base ,core
 */
/**
 左右选择框组件
 @class swordweb.widgets.SwordMove.SwordMove
 * @implements Events
 * @implements Options
 * @extends SwordMoveBase
 **/
/*
/*
*
* 数据行状态说明：
* 移入：insert
* 移出:delete
* */
var SwordMove = new Class({

    Implements:[Events,Options]
    ,Extends : SwordMoveBase
    //继承容器
    //继承容器的属性 widgets(type Hash)
    
   /**
 * 此类的类名称 值使用 SwordMove
 * @property {private final string} name
 */
    ,name:"SwordMove"

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
        /**
         * 组件的标题栏；在组件的根标签上可以声明此属性 ，如果没有声明，将没有标题行
         * @property {public string} caption
         */
        ,caption : null
        /**
         * 数据区域的高度 ;和autoHeight=true配合
         * 在组件的根标签上可以声明此属性,声明后，当数据行超出设定的高度，高度不会改变，将会出现滚动条;
         * @property {public int} dataY
         */
         ,dataY:-1
         /**
         * 显示格式定义，支持如"{code}|{caption}"
         * @property {public string} name
         */
        ,showName:null
        /**
         * 目标移动框,名称以,相隔 如target='a,b'
         * @property {public string} name
         */
        ,target : null

        /**
         * 数据宽度 ;默认值为-1表示为 宽度近似为元素宽度
         * 在组件的根标签上可以声明此属性;
         * @property {public int} dataX
         */
        ,dataX:-1
        /**
         * 数据区高度设定模式，默认true，为固定高，反之（按照数据的实际高为准，这时dataY不起作用）
         * @property {public int} itemY
         */
        ,autoHeight:'true'
        /**
         * 绑定的javabean对象类名称，在提交到后台的时候，后台通过这个属性解析为JavaBean，
         * 如果从后台初始化数据使用的就是此JavaBean，就不用声明了；
         * 在组件的根标签上可以声明此属性；
         * @property {private string} beanname
         */
        ,beanname:null
        ,pNode : null // 此组件的tag对象
        
        //以下为事件。。。
         /**
         * 在创建完数据区之后触发 ；在组件的根标签上可以声明此属性
         * @event onAfterCreate
         * @param {object} 
         */
        ,onAfterCreate:$empty
        /**
         * 在创建完一个li元素之后触发 ；在组件的根标签上可以声明此属性
         * @event onAfterCreateItem
         * @param {object} itemData，装载行的行数据，通过itemData.getValue(name)可以获得具体的值
         * @param {html element} liEl ，装载li的html元素，是一个li元素
         */
        ,onAfterCreateItem:$empty

        /**
         * 初始化数据区数据后触发；
         * 在组件的根标签上可以声明此属性
         * @event onAfterInitData
         */
        ,onAfterInitData:$empty
        /**
         * 在移动完一个li元素之后触发 ；在组件的根标签上可以声明此属性
         * @event onAfterMove
         */
        ,onAfterMove:$empty
        /**
         * 单击一行的item时候触发；在组件的根标签上可以声明此属性
         * @event onItemClick
         * @param {object} itemData，被点击item的数据，通过data.getValue(name)可以获得具体的值
         * @param {html element} liEl ，被点击item的html元素，是一个li元素
         * @param {event} e ，事件对象
         */
        ,onItemClick:$empty

         /**
         * 双击一行的item时候触发；在组件的根标签上可以声明此属性
         * @event onItemDbClick
         * @param {object} itemData，被双击item的数据，itemData.getValue(name)可以获得具体的值
         * @param {html element} liEl ，被点击item的html元素，是一个li元素
         * @param {event} e ，事件对象
         */
        ,onItemDbClick:$empty
         /**
         * 右击一行的item时候触发；在组件的根标签上可以声明此属性
         * @event onItemClick
        * @param {event} e ，事件对象
         */
        ,onItemRightClick:$empty
         /**
         * 元素移出前触发；在组件的根标签上可以声明此属性，用于可移出元素的校验
         * @event onBeforeOut
        * @param {数组} items ，元素的数组
        * 返回合法的元素数组，为null则全部不能移出
        */
        ,onBeforeOut:$empty
         /**
         * 元素移入前触发；在组件的根标签上可以声明此属性，用于可移入元素的校验
         * @event onBeforeIn
        * @param {数组} items ，元素的数组
        * 返回合法的元素数组，为null则全部不能移入
        */
        ,onBeforeIn:$empty
    }
     //以下为私有属性。。。。。。
     ,sm_div:null //显示内容容器对象
     ,data:null    //业务数据      
     //私有属性结束。。。。。。
/**
     * 初始化方法
     * @function {public null} init
     * @param {InitPara}  initPara 使用这个dto对象来描述组件的初始化所需要的参数信息，通常包含一个root节点
     */
        ,initParam: function(initPara) {

            this.htmlOptions(initPara);
            //创建显示容器
            var sm_div = new Element('div',{'class':'sm_div'}).inject(this.options.pNode);
			
            this.sm_div=sm_div;  

            //创建caption
            if(this.options.caption){
                this.createPanel(sm_div,this.options.caption);
            }

            //创建数据行的容器div，并放在显示容器内部
             var sm_data_div = new Element('div', {
                'class': 'sm_data_div'
            }).inject(this.sm_div);
        
            this.sm_data_div=sm_data_div;

            var sm_data_ul=new Element('ul',{ 'class': 'sm_data_ul'}).inject(sm_data_div);
            this.bindUlEvents(sm_data_ul);//ul注册事件
           
            this.sm_data_ul = sm_data_ul;
            this.buildXY();//设定整体的宽度和数据高度
            
        this.fireEvent('onAfterCreate');//数据区组件创建完成后的事件
    }
    ,bindUlEvents:function(ul){
        //元素单击事件
        ul.addEvent('click', function(e) {
            var target=e.target;
            var tag=target.get('tag');

           if(tag!=='li') return;
           var lis = ul.getChildren();
           var checkedLis= this.getCheckedLis();
           var nowIndex=(target.get('rowNum')-1)/1;
           var lastIndex=this.lastIndex/1;

          if (e.shift) {
              checkedLis.removeClass('li_gridview');
             if (nowIndex > lastIndex) {
                var i = (lastIndex) / 1;
                for (i; i <= nowIndex; i++) {
                    lis[i].addClass('li_gridview');
                }
            }
            else {
                var j = (lastIndex) / 1;
                for (j; j >= nowIndex; j--) {
                    lis[j].addClass('li_gridview');
                }
            }
        } else if (e.control) {
            target.toggleClass('li_gridview');
            lastIndex = nowIndex;
        } else {
            checkedLis.removeClass('li_gridview');
            target.addClass('li_gridview');
            this.lastIndex = nowIndex;

            var dataObj=target.retrieve('liData');
           this.fireEvent("onItemClick",[dataObj,target,e]);      //触发自定义的元素单击事件
        }

        }.bind(this));
        //元素双击事件
        ul.addEvent('dblclick', function(e) {
            var target=e.target;
            var tag=target.get('tag');

           if(tag!=='li') return;
           var targetWidget= this.getTargetWidgets();
           this.readyMove([this],targetWidget,'checked');

           var dataObj=target.retrieve('liData');
          
           this.fireEvent("onItemDbClick",[dataObj,target,e]);      //触发自定义的元素双击事件
        }.bind(this));
       //元素右键事件
        ul.addEvent('contextmenu',function(e){
            var target=e.target;
            var tag=target.get('tag');
            if(tag!=='li') return;
            var dataObj=target.retrieve('liData');
            this.fireEvent('onItemRightClick',[dataObj,e]);
        }.bind(this));
    }
  
      //创建caption
     ,createPanel:function(p, t) {
        var panel = new Element('div',
        {
            'class':'sm_panel_header'
        }).inject(p);

        new Element('div',
        {
            'class':'sm_panel_header_caption'
        }).appendText(t).inject(panel);

    }
    //调整宽与高
    ,buildXY:function(){
        this.buildX();
        this.buildY();
      }
       
    //设定整体宽度
       ,buildX:function(){

           var dataX= ''+this.options.dataX;
           if(this.options.dataX!=-1){//代码设置了宽度
               if(dataX.contains('px')){
                   var dataX=parseInt(dataX);
                   if(this.sm_div.getWidth()<dataX){
                     this.sm_div.setStyle('width', dataX+'px');
                   }

               } 
           }
       }

       //重建数据区高度
       ,buildY:function(totalRows){
           var dataY = '' + this.options.dataY;
           var dataHeight=null;
           if (this.options.autoHeight=='true') {  //固定高
               
               if(dataY.contains('px')){
                dataY=parseInt(dataY);
               }
               if(dataY>this.dataDiv().getHeight()){
                    dataHeight=dataY;
               }

           } else if($chk(totalRows)&&totalRows>0){
               dataHeight=this.itemY() * ((totalRows/1)+2);
           }
          if($chk(dataHeight)){
            this.dataDiv().setStyle("height",dataHeight+'px');
          }

       }
    
     //此方法一般用在完全重新初始化数据的时候
     ,initData:function(data) {
          //清理数据项
          this.clearData();
          //data 的类型为数组[{tds:{}},obj,obj]
          if (!$chk(data)) {
              return;
          }

          this.setInitData(data);

          if (!$chk(this.data)) {
              return;
          }
          var totalItems= data.trs.length;
          this.buildY(totalItems);
          this.loadData(this.data);
          this.options.totalItems =totalItems;
      }
      //载入数据
      ,loadData:function(data){
        this.doMask();
        this.readyLoadData(data); 
        this.doUnmask();
    }

    ,doMask:function(){
        pc.getMask().mask(this.sm_div);
    }
   ,doUnmask:function(){
          pc.getMask().unmask();
    }

    //开始装载数据区数据
   ,readyLoadData:function(data){
          //清除元素的选中状态
        if (!$chk(data)) {
//            logger.debug('没有获得有效数据，不进行数据装载操作！') ;
            this.doUnmask();
            return;
        }
//        logger.debug('开始装载移动框数据');

        data.each(function(dataObj, index) { //遍历trs节点
            var li = this.createItem(index + 1, dataObj);
            li.inject(this.dataUl());
        }, this);
        this.fireEvent("onAfterInitData",[data]);      //数据
    }
    
   //插入item
    ,insertItem:function(dataObj,where){
		   if(!$chk(dataObj)){
			   return;
		   }
    		var itemNum=this.options.totalItems+1;
    	
    		var newItem=this.createItem(itemNum, dataObj);
    		newItem.set('status','insert');
    		newItem.set('origin', ' ');
    		newItem.set('outer', true);
    		
    		if(!$defined(where)){
    			newItem.inject(this.dataUl(),'bottom');
    			this.options.totalItems+=1;
    			//this.adjustItem();
    		}
    		
    		else if('before'==where||'after'==where){
    			var cLis=this.getCheckedLis();
    			if(cLis.length>=1){
    				newItem.inject(cLis[cLis.length-1],where);
    				this.options.totalItems+=1;
    				this.adjustItem(false);
    			}
    			else{
    				alert('请先选择参照项');
    			}
    		}
    	
    }
    //创建li元素
    ,createItem:function(itemNum,dataObj){
       if(dataObj.getValue==undefined){
    		dataObj.getValue=function(name){
    			var tmp = this.tds[name];
                if (!$defined(tmp)) {
                    return null;
                }
                return tmp['value'];
    		}
    	}
         this.fireEvent("onBeforeCreateItem",[dataObj]);   //创建item前触发
        // create li
        var item_li=new Element('li',{
            'text':this.genarateContent(dataObj.tds),
            'origin':this.options.name,
            'rowNum':itemNum,
            'title':this.genarateContent(dataObj.tds),
            'class':'sm_data_li',
            'events':{
                        'mouseover':function(e) {
                            Event(e).target.addClass('li-selected');
                        },
                        'mouseout':function(e) {
                            Event(e).target.removeClass('li-selected');
                        }
                    }
        });
    	item_li.store('liData',dataObj);//注册数据

       //添加奇偶行样式
        if (itemNum % 2 == 0) { //偶数行
            item_li.addClass('sm_data_li_shuang');
        } else {//奇数行
            item_li.addClass('sm_data_li_dan');
        }

       this.fireEvent("onAfterCreateItem",[dataObj,item_li]);      //触发创建完item的事件

       return item_li;

    }
    //取得文本值
    ,genarateContent:function(obj) {
        var content = this.options.showName;
        if (!$defined(content)){
            content = "{caption}";
        }
       var value=this.substitute(obj,content);
       
       if(value==''){
            content="{code}";
            value=this.substitute(obj,content);
       }
       if(value==''){
            content="";//?
            value=this.substitute(obj,content);
       }
         return value;
    }

   , substitute: function(object,content){
		return content.replace((/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name].value : '';
		});
	}
  //得到目标框的组件库
    ,getTargetWidgets:function(){
         var  targetWidgets=new Array();
         var target=this.options.target;
         if($chk(target)){
                   target.split(',').each(function(name,index){
                       targetWidgets.push(this.loadWidget(name));
                   },this);
           }
         return targetWidgets;
   }
  
    //得到数据区打打勾标记的li元素
    ,getCheckedLis:function(){
        var checkedLis= this.dataUl().getElements('li[.li_gridview]');
        return checkedLis;
     }
      //得到数据区打insert标记的li元素
    ,getLisByInsert:function(){
        var insertLis= this.dataUl().getElements('li[status=insert]');
        return insertLis;
     }
      //得到数据区外部数据源标记的li元素
      ,getLisByOuter:function(){
          var outerLis= this.dataUl().getElements('li[outer=true]');
          return outerLis;
       }
     //得到数据区所有的li元素
    ,getAllLis:function(){
        var allLis=this.dataUl().getElements('li');
        return allLis;
    }

     //得到当前已移入的li元素
    //未指定参数为取得移入本身的数据，反之为取得指定来源的数据
    ,getInLis:function(org) {
        var rule = "li[origin="+org+"]";
        if(!$chk(org)){
            org=this.options.name;
             rule = "li[status=insert]";
        }
        var inLis=this.dataUl().getChildren(rule);
       
        return inLis;
    }

    //得到现已移出的脏li元素
    ,getOutLis:function(targetWighets) {
       var outLis=new Array();
        
       if(!$chk(targetWighets)){
             targetWighets=this.getTargetWidgets();
        }
         targetWighets.each(function(widget,index){
             var in_lis=widget.getInLis(this.options.name);
             if(in_lis.length>0){
              outLis.combine(in_lis);   
             }

           },this) ;

            return outLis;
        }
    //有状态的li集合(移入和移出的)
    ,getStatusLis:function(){
        var in_lis=this.getInLis();
        var out_lis=this.getOutLis();
        if(in_lis.length>0&&out_lis.length>0){
         return in_lis.combine(out_lis);
        }
        else if(in_lis.length>0){
             return in_lis;
        }
        else {
             return out_lis;
        }
     }
    /**
        * /获得数据区有标记的li数据；可以进行提交操作；
        * @function {public obj } getCheckedData
        * @see  getCheckedData
        * @returns obj
        */
       ,getCheckedData:function(){
           var lis = this.getCheckedLis();
           var data= this.getLisData(lis);
           return data;
       }
     /**
     * 获得当前数据区的数据, 标准数据,可以进行提交
     * @function {public obj} 
     * @returns obj
     */
    ,getCurrentData:function(){
       var curLis= this.dataUl().getChildren()
        return this.getLisData(curLis);
    }
   ,getLisData:function(lis) { //传入lis 元素数组 ，返回li的数据，此数据是移动框的标准数据格式
         var datas=new Array();
         lis.each(function(li){
             datas.push(this.getOneLiData(li));
         },this);

        return {
            'sword':'SwordGrid',
            'name' :this.options.name,
            'beannames':this.options.beanname,
            'trs' :datas
        };
    }
     /**
     * 获得数据区内的脏数据包括移入和移出 ，此数据是标准数据，可以进行提交
     * @function {public obj} getStatusGirdData
     * @returns obj
     */
    ,getStatusData:function(){
        var statusLis= this.getStatusLis();
        return this.getLisData(statusLis);
    }
     //传入li 元素
   ,getOneLiData:function(li){
        if(!$defined(li)){
            return null;
        }
         var data=li.retrieve('liData');
         if(li.get('status')=='insert'){
            var submit_data=JSON.decode(JSON.encode(data));
             if(li.get('origin')==this.options.name){
                submit_data.status = 'delete';
             }
             else {
                 submit_data.status = 'insert'; 
             }
             return submit_data;
         }
        else {
            return data; 
         }

    }
    //所有移动的最终实现
    ,doMove:function(targetWidget,validItems){
        var tul=targetWidget.dataUl();
        validItems.each(function(li){
            if(li.get('origin')!=targetWidget.options.name){
                li.set('status','insert');
            }
            else if(!$defined(li.get('outer'))){
            	li.set('status',null);
            }

            li.removeClass("li_gridview").inject(tul);
        });
        this.adjustItem();
        targetWidget.adjustItem();
    }


    //在移入和移出之后重新调整rowuNum和样式
    ,adjustItem:function(check){
      var lis = this.dataUl().getChildren();
      lis.each(function(li, index) { //遍历li节点
          li.removeClass('sm_data_li_shuang');
          li.removeClass('sm_data_li_dan');
            //添加奇偶行样式
        if (index % 2 == 0) { //偶数行
            li.addClass('sm_data_li_shuang');
        } else {//奇数行
            li.addClass('sm_data_li_dan');
        }
        if(!$defined(check)){
        	 li.removeClass("li_gridview");
        }
       
        li.set('rowNum',index+1);
       }, this);
    }
 
     ,setInitData:function(data) {

        this.data = data['trs'];   //业务数据  trs
        this.data.each(function(tr) {
            tr.getValue = function(name) {   //注册取值方法
                var tmp = this.tds[name];
                if (!$defined(tmp)) {
                    return null;
                }
                return tmp['value'];
            }
        })

    }
     
  
    //清除数据区域的数据
     ,clearData : function(){
           this.dataUl().getChildren().each(function(item) {
               item.destroy();
           });
     }
        //返回数据区的div el
    ,dataDiv:function() {
        return this.sm_data_div;
    }
      //返回数据区的ul el
    ,dataUl:function() {
        return this.sm_data_ul;
    }

    ,dataY:function() {
            return this.options.dataY / 1;
        }
  
  //每个li元素的默认宽度
    ,itemY:function(){
         return 22//每个元素的默认高度(只读);
    }
  
});
