/**   
   * Menu组件类
  * @class swordweb.widgets.SwordMenu.SwordMenu
  * @implements Events
  * @implements Options
 */
var SwordMenu = new Class({
    Implements : [Events,Options],
	name: "SwordMenu",
    options:{
        /**
         组件类别声明
         @property {private string} sword
         */
        sword : null,
        /**
         组件唯一标识
         @property {private string} name
         */
		name: "menu",
        /**
         *指定数据集名称，如果不指定该名称,以name代替
         * @property {private string} dataname
         */
        dataName:null,
		pNode: null,
        /**
         *绝对/相对定位
         *@property {private string} pos
         */
		pos: "false",//当pos为absolute时候,下面的四个属性才有用
		left: 100,
		top: 100,
		width: 200,
		height: 30,
		zIndex: 100000,
		itemWidth:'150px',
		itemHeight: null,
        startLayer:1,
        /**
         *  数据字符串
         *  @property {private string} dataStr
         */
		dataStr: null,
        /**
         *  前端服务标识1
         *  @property {private string} ctrl
         */
        ctrl:"",
        /**
         *  前端服务标识2
         *  @property {private string} tid
         */
        tid:"",
		/**
          * menu的数据类型(options),可选json/xml
          * @property {private string} dataType
         */
		dataType: "json",//json,xml
		/**
          * menu的横向/纵向(options),可选horizontal,vertical
          * @property {private string} type
         */
		type: "vertical",//horizontal,vertical
          /**
          * 第一层菜单是否显示，默认显示
          * @property {private function} isShow
         */
        isShow:"true",
          /**
          * 是否高亮显示点击过的菜单项，默认：否
          * @property {private function} isHighlight
         */
        isHighlight:"false",
        /**
         * 根据此属性取值，用于显示节点内容
         * @property {private string} displayTag
         */
        displayTag:"caption",
		/**
          * menu的是否显示选中的函数(options)
          * @property {private function} onSelect
         */
		onSelect: null//这个是问题??不可以写成$empty的形式
        ,onLoadDataFinish:null

    },
	menuInput: null,
	menuZeroLevelDiv: null,
	menuZeroLevelUL: null,
	data: null,
	currentSelectItem: null,  //鼠标所指向的菜单项
    clickedItem:null ,//鼠标最后一次点击过的菜单项
    foldFlag:true,//菜单折叠的标记  true:折叠 false:不折叠
    tempTable:null,
    root:[],
     /**
     * 根下的孩子  {根节点codeKey:隶属于此根节点下的孩子结点的数组}
     * @property {private string} childs
     */
    childs:new Hash(),
    initialize:function(options) {
       this.setOptions(options);
    },
	/**
      * 构造函数
      * @constructor {protected htmlnode} initParam
     */
    initParam:function(node) {
		this.htmlOptions(node);
		this.options.pNode = node;
        if (($chk(this.options.tid) || $chk(this.options.ctrl))|| ((!$chk(this.options.tid) && !$chk(this.options.ctrl) )&& $chk(this.options.dataStr))) {
        	this.buildData();
        }
        if($chk(this.data)&&!$chk(this.menuZeroLevelDiv))this.buildMenuDiv();
    },
	initData: function(data) {
		if($defined(data)){
			this.data = data;
		}
		this.build();
    },
	build: function(){
    	//清空已有的菜单元素
    	if($chk(this.menuZeroLevelDiv))
    		this.menuZeroLevelDiv.destroy();
    	this.root.empty();
		this.buildData();
		this.buildMenuDiv();
	},

    display:function(options) {
        this.setOptions(options);
        this.menuZeroLevelDiv.setStyles({
            left:options.left
            ,top:options.top
        });
        this.menuZeroLevelDiv.setStyle('display', '');
    },

    hide:function() {
        this.menuZeroLevelDiv.setStyle('display', 'none');
    },

    //获取数据  优先级：dataStr>ctrl>SwordPageData
	buildData: function(){
		if(!$defined(this.data)){
			if(!$chk(this.options.dataStr) ){
				if(this.options.ctrl != ""||this.options.tid!=""){
					this.getDataByCtrl();
				}else if($defined($('SwordPageData'))){
                    if($chk(this.options.dataName))
                       this.data = pageContainer.getInitDataByDataName(this.options.dataName).data;
                    else
                       this.data =  pageContainer.getInitData(this.options.name).data;
                }
			}else{
				this.data = JSON.decode(this.options.dataStr).data;//dataStr的字符串
			}

		}else{
			this.data = this.data.data;
		}
		this.parseData();
	},
	getDataByCtrl: function(){
		var data = new Hash();
        data.set("sword", "SwordTree");//这里暂时将组建的名称为SwordTree,以后让王景龙加针对于menu的接口
        data.set("name", this.options.name);
        data.set("data", [this.data]);
        var attr = new Hash();
        attr.set("sword", "attr");
        attr.set("name", "treeName");
        attr.set("value",this.options.name);

        var req = pageContainer.getReq({
            'tid':this.options.tid
            ,'ctrl':this.options.ctrl
            ,'widgets':[data,attr]
        });
        pageContainer.postReq({'req':req,'async':false
            ,'onSuccess':function(resData) {
                var data = pageContainer.getResData(this.options.name, resData);
                this.data = data.data;
                this.fireEvent('onLoadDataFinish', resData);
            }.bind(this)
            , 'onError'  :function (res) {

            }.bind(this)
        });
	},
	buildMenuDiv: function(){
			this.menuZeroLevelDiv = new Element('div', {
				'name': "swordMenuDiv_null",
				'pCode': "null",
                'id': this.options.name
			}).inject(this.options.pNode);
			if(this.options.pos == "false"){
				this.menuZeroLevelDiv.inject(this.options.pNode);
			}else{
				this.menuZeroLevelDiv.setStyles({
					'position': 'absolute',
					'z-index': this.options.zIndex,
					'left': this.options.left,
					'top': this.options.top,
					'width': this.options.width,
					'height': this.options.height
				});
			}
            var tempTd = this.buildTable(this.menuZeroLevelDiv);
			this.menuZeroLevelUL = new Element('ul', {

		     }).inject(tempTd);
			this.buildZeroLevelMenuLI();

	},
	/*buildFirstCurrentSelectItem: function(){
		var firstLi = this.menuZeroLevelDiv.getElement("li[name=swordMenuLi_null_0]");
		if($defined(firstLi)){
			this.currentSelectItem = firstLi;
			this.currentSelectItem.setProperty("name","swordMenuLi_null_null");
		}
	},     */
    buildTable:function(ele){
       tempTable  = new Element('table', {
          'class':'nav_box'
		}).inject(ele);
		var tbody = new Element('tbody').inject(tempTable);
        var tempTr = new   Element('tr').inject(tbody);
        new Element('td',{ 'class':'cl' }).inject(tempTr);
        var tempTd = new Element('td',{ 'class':'cont' }).inject(tempTr);
        new Element('td',{ 'class':'cr' }).inject(tempTr);
        tempTable.addEvent('mouseout', function(e) {
               this.foldFlag = true;
			   this.fold.delay(500,this);
	    }.bind(this));
        tempTable.addEvent('mouseover', function(e) {
               this.foldFlag = false;
	    }.bind(this));
        return tempTd;
    },


    addStyle:function(ele){
        if(this.options.type == "horizontal"){
			ele.addClass("sty_2");
		}else if(this.options.type == "vertical"){
			ele.addClass("sty_1");
		}
    },

     parseData:function(){
         if($chk(this.data)){
             //获取根节点
             this.getRoot();

         }
    },

    getRoot:function(){

          // var tempData = this.data;
           for(var i=0 ; i < this.data.length ; i++){
               var pcode = this.data[i]["pcode"];
               var flag = true;
               for(var j = 0 ; j < this.data.length ; j++){
                   var code =  this.data[j]["code"];
                   if(code==pcode){
                      flag = false;
                      break;
                   }
               }
               if(flag){
                   var layer = 1;
                   if(this.options.startLayer.toInt()>1)
                       this.getRootByStartLayer(this.data[i],  layer);
                   else
                       this.root[this.root.length] = this.data[i];
               }
           }
       },

       getRootByStartLayer:function(root,layer){

           var tempLayer = layer+1;
           var code = root["code"];
           for (var jj = 0; jj < this.data.length; jj++) {
               var pcode = this.data[jj]["pcode"];
               if (code == pcode ) {
                   if(tempLayer==this.options.startLayer){
                      this.root[this.root.length] = this.data[jj];
                   }else{
                       if(this.isHasChild(this.data[jj]["code"]))
                           this.getRootByStartLayer(this.data[jj],tempLayer);
                   }
               }
           }
       },




	buildZeroLevelMenuLI: function(){
		var childIndex = 0;

         // var flag = true;
	     this.root.each(function(item, index){

					var zeroLi = new Element('li', {
						'name': "swordMenuLi_null_" + childIndex,

						'styles':{
							'width': this.options.itemWidth,
							'height': this.options.itemHeight
						}
					}).inject(this.menuZeroLevelUL);
                     var classSpan1 = new Element('span', {
                            'name': "swordMenuSpan_null_" + childIndex

                        }).inject(zeroLi);
                     if($chk(item.mClass) )
                       classSpan1.addClass(item.mClass) ;
                    else
                       classSpan1.addClass("ico1")

                    this.addImg(item,classSpan1);

                       var classSpan2 = new Element('span', {
                            'text': item[this.options.displayTag]
                           ,'class':'menu_caption'
                        }).inject(zeroLi);

                    this.addStyle(zeroLi) ;
					childIndex++;
					zeroLi.setProperty('pCode',"null");
					zeroLi.setProperty('code',item.code);
					zeroLi.setProperty('caption',item[this.options.displayTag]);

	                new Hash(item).each(function(value, key) {
	                    if (['pCode','code','caption'].contains(key)) {
	                        return;
	                    }
	                    zeroLi.setProperty(key, value);
	                });
                    if(this.options.type=="vertical")  {
                    var childFlag = this.isHasChild(item.code);
                           if(childFlag == true){

                                var markSpan = new Element('span', {
//                                    'text': "   >>" ,
                                     'class':'mark'
                                }).inject(zeroLi);
                           }
                    }

					zeroLi.addEvent('mouseover', function() {

                        this.hiddenChildMenu(this.currentSelectItem,zeroLi);
                        this.currentSelectItem = zeroLi;
						if(this.options.type == "horizontal"){
							zeroLi.removeClass("sty_2");
							zeroLi.addClass('sty_2_a');
						}else if(this.options.type == "vertical"){
							zeroLi.removeClass("sty_1");
							zeroLi.addClass('sty_1_a');
						}
                        this.showChildMenu(this.menuZeroLevelDiv,zeroLi,item.code,"zero");

			        }.bind(this));
					zeroLi.addEvent('mouseout', function(e) {
                        if(this.options.type == "horizontal"){
							zeroLi.removeClass("sty_2_a");
							zeroLi.addClass('sty_2');
						}else if(this.options.type == "vertical"){
							zeroLi.removeClass("sty_1_a");
							zeroLi.addClass('sty_1');
						}

			        }.bind(this));
					zeroLi.addEvent('click', function(e) {
						this.selectItem();
			        }.bind(this));

                   if(item["enabled"] =="false"){
	                   this.setMenuStatus(item.code,"false");
                   }

			}.bind(this));

	},
    fold:function(){
        if(this.foldFlag){
            this.hiddenAllMenu();
        }
    },

	isHasChild: function(code){
		for(var i = 0 ; i < this.data.length ; i++){
			if(this.data[i].pcode == code){
				return true;
			}
		}
		return false;
	},
	/**
      * 打开菜单
      * @function {public} openChildMenu
      * @param {htmlnode} zeroLi - 创建的父元素
      * @param {int} pCode - 父code
      * @param {blooean} zeroFlag - 是否是0级别的节点
      * @returns null
     */
	openChildMenu: function(levelDiv,zeroLi,pCode,zeroFlag){

		var tempMenuLevelDiv = new Element('div', {
			'name': "swordMenuDiv_" + pCode,
			'pCode': pCode
		}).inject(levelDiv);
        var childFlag = this.isHasChild(pCode);
        if(childFlag==false){
            return null;
        }
        var tempTd1 = this.buildTable(tempMenuLevelDiv);
		if(this.options.type == "horizontal"){
			if($defined(zeroFlag) && zeroFlag == "zero"){
				if (levelDiv.getStyle("position") == "absolute") {
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition(levelDiv).x,
						'top': zeroLi.getPosition(levelDiv).y + zeroLi.getSize().y
					});
                    if(!$chk(zeroLi.previousSibling))
                     tempMenuLevelDiv.setStyles({'left':zeroLi.getPosition(levelDiv).x-5}) ;
				}else{
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition().x,
						'top': zeroLi.getPosition().y + zeroLi.getSize().y
					});
                    if(!$chk(zeroLi.previousSibling))
                       tempMenuLevelDiv.setStyles({'left':zeroLi.getPosition().x-5}) ;
				}

			}else{
				tempMenuLevelDiv.setStyles({
					'position': 'absolute',
					'z-index': this.options.zIndex,
					'left': zeroLi.getSize().x,
					'top': zeroLi.getSize().y * zeroLi.getProperty("name").split("_")[2]
				});
			}

		}else if(this.options.type == "vertical"){
			if($defined(zeroFlag) && zeroFlag == "zero"){
				if(levelDiv.getStyle("position") == "absolute"){
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition(levelDiv).x + zeroLi.getSize().x,
						'top': zeroLi.getPosition(levelDiv).y
					});
                }else{
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition().x + zeroLi.getSize().x,
						'top': zeroLi.getPosition().y
					});
				}

			}else{
				tempMenuLevelDiv.setStyles({
					'position': 'absolute',
					'z-index': this.options.zIndex,
					'left': zeroLi.getSize().x,
					'top': zeroLi.getSize().y * zeroLi.getProperty("name").split("_")[2]
				});
			}
		}
		var tempMenuLevelUL = new Element('ul', {

		}).inject(tempTd1);

		var childIndex = 0;
		this.data.each(function(item, index){
			if(item.pcode == pCode){

				var tempLi = new Element('li', {
					'name': ((item.pcode+"").contains("_"))?"swordMenuLi_" + item.pcode.replace(/_/g,"") + "_" + childIndex:"swordMenuLi_"  + item.pcode + "_"  + childIndex,

					'styles':{
						'width': this.options.itemWidth,
						'height': this.options.itemHeight
					}
				}).inject(tempMenuLevelUL);
                tempLi.addClass("sty_1");
                 var classSpan1 = new Element('span', {
                     'name': "swordMenuSpan_null_" + childIndex
                }).inject(tempLi);
                if($chk(item.mClass) )
                    classSpan1.addClass(item.mClass) ;
                else
                    classSpan1.addClass("ico1") ;

                this.addImg(item,classSpan1);

                var classSpan2 = new Element('span', {
                       'text': item[this.options.displayTag]
                        ,'class':'menu_caption'
                }).inject(tempLi);

				childIndex++;
				tempLi.setProperty('pCode',item.pcode);
				tempLi.setProperty('code',item.code);
				tempLi.setProperty('caption',item[this.options.displayTag]);

                new Hash(item).each(function(value,key){
                    if(['pCode','code','caption'].contains(key)){
                       return;
                    }
                    tempLi.setProperty(key,value);
                });


				var childFlag = this.isHasChild(item.code);
				if(childFlag == true){

					var markSpan = new Element('span', {
//						'text': "   >>" ,
                        'class':'mark'
					}).inject(tempLi);
				}

				tempLi.addEvent('mouseover', function() {

                    /*隐藏上一个菜单项的孩子
                      如果当前菜单项与上一个菜单项属于平级关系，则调用this.closeChildMenu方法；
                      如果当前菜单项与上一个菜单项属于上下级关系，则跳过
                     */
                    this.hiddenChildMenu(this.currentSelectItem,tempLi);
					this.currentSelectItem = tempLi;
					tempLi.removeClass('sty_1');
                    tempLi.addClass('sty_1_a');
                    this.showChildMenu(tempMenuLevelDiv,tempLi,item.code);

		        }.bind(this));
				tempLi.addEvent('mouseout', function(e) {
                    tempLi.removeClass('sty_1_a');
                    tempLi.addClass('sty_1');
                }.bind(this));
				tempLi.addEvent('click', function(e) {
					this.selectItem();
		        }.bind(this));
                if(item["enabled"] =="false"){
                    this.setMenuStatus(item.code,"false");
               }

            }
		}.bind(this));
	},

    /*显示孩子菜单
      * 如果之前已经创建过则显示；
      * 如果之前没有创建过则重新创建
     */

    showChildMenu: function(tempMenuLevelDiv,tempLi,code,level){
        var pcode = tempLi.getProperty("code");
        var childMenu = tempLi.getParent("div").getElement("div[pcode=" + pcode + "]");
        if($chk(childMenu))
           childMenu.setStyle("display","");
        else
           this.openChildMenu(tempMenuLevelDiv,tempLi,code,level);

	},
    /*
      * 隐藏所有菜单项
     */

    hiddenAllMenu: function(){
          if($defined(this.menuZeroLevelDiv)){
                var childsMenu = this.menuZeroLevelDiv.getElements("div");
                childsMenu.each(function(item,key){
                    item.setStyle("display","none");
                }.bind(this));
                if(this.options.isShow!="true")
                     this.menuZeroLevelDiv.setStyle("display","none");
          }


	},
     /*隐藏前一个菜单项的孩子
      * 如果当前菜单项与前一个菜单项属于平级关系，则隐藏前一个菜单的子菜单；
      * 如果当前菜单项与上一个菜单项属于上下级关系，则隐藏当前菜单的子菜单
     */

    hiddenChildMenu: function(previousSelectItem,currentSelectItem){

        if($chk(previousSelectItem)) {
             var preParent = previousSelectItem.getParent("div");
             var curParent = currentSelectItem.getParent("div");

             //当前菜单项与上一个菜单项属于平级关系
             if(preParent && preParent.getProperty("name")==curParent.getProperty("name")){
                 var pcode = previousSelectItem.getProperty("code");
                 this.closeChildMenu(pcode);
             }else{
                  var allchilds  = currentSelectItem.getParent("div").getElements("div");
                  allchilds.each(function(item,index){
                      item.setStyle("display","none");
                  }.bind(this));

             }

        }

	},
/**
      * 关闭menu
      * @function {public} closeChildMenu
      * @param {int} pCode - 父Code
      * @param flag 是否遍历所有孩子菜单
      * @returns null
     */
	closeChildMenu: function(pCode,flag){

        var childMenu = this.menuZeroLevelDiv.getElement("div[pCode=" + pCode + "]");
        if($chk(childMenu)){
            childMenu.setStyle("display","none");
            if(flag){
                var childChildMenu = childMenu.getElements("div");
                childChildMenu.each(function(item,index){
                    item.setStyle("display","none");
                 }.bind(this));
            }
        }

	},
	selectItem: function(){

         this.setHighlight(this.currentSelectItem,this.clickedItem);
         this.clickedItem = this.currentSelectItem;
		 this.hiddenAllMenu();
		 this.fireEvent('onSelect', this.currentSelectItem);
	},
    setHighlight:function(currentItem,previousItem){
          if($chk(previousItem))
             previousItem.removeClass("highlight");
		  currentItem.addClass("highlight");
    },
	change_item_on_keyup: function(e){
        if (e.key == 'esc') {
			this.menuZeroLevelDiv.setStyles({
				'display': 'none'
			});
        }
		if (e.key == 'enter') {
			this.selectItem();
        }
        if (e.key == 'up') {
			var previousLi = this.currentSelectItem.getPrevious("li");
			var thisLi = this.currentSelectItem;
            if($defined(previousLi)){
				thisLi.fireEvent('mouseout');
				previousLi.fireEvent('mouseover');
			}
        }
		if (e.key == 'down') {
			if(this.currentSelectItem.getProperty("name") == "swordMenuLi_null_null"){
				this.currentSelectItem.fireEvent('mouseover');
			}else{
				var nextLi = this.currentSelectItem.getNext("li");
				var thisLi = this.currentSelectItem;
	            if($defined(nextLi)){
					thisLi.fireEvent('mouseout');
					nextLi.fireEvent('mouseover');
				}
			}
        }
		if (e.key == 'left') {
            var leftLi = this.menuZeroLevelDiv.getElement("li[code=" + this.currentSelectItem.getProperty('pCode') + "]");
			var thisLi = this.currentSelectItem;
            if($defined(leftLi)){
				thisLi.fireEvent('mouseout');
				leftLi.fireEvent('mouseover');
			}
        }
		if (e.key == 'right') {
            var rightLi = this.menuZeroLevelDiv.getElement("li[name=swordMenuLi_" + this.currentSelectItem.getProperty('code') + "_0]");
			var thisLi = this.currentSelectItem;
            if($defined(rightLi)){
				thisLi.fireEvent('mouseout');
				rightLi.fireEvent('mouseover');
			}
        }
	},
	setItemFocus:function(index){
		if($defined(this.menuZeroLevelDiv)){
            var tempLi = this.menuZeroLevelDiv.getElement("li[code=" + index + "]");
            if($chk(tempLi)){
            	this.setHighlight(tempLi,this.clickedItem);
            	this.clickedItem = tempLi;
            }
        }
	}
	,
    setMenuStatus:function(code,status){
        if($defined(this.menuZeroLevelDiv)){
            var tempLi = this.menuZeroLevelDiv.getElement("li[code=" + code + "]");
            if($chk(tempLi)){
                if(status=="true" && tempLi.get('cloneFlag')){
                	var tempNext = tempLi.getNext();
                	tempNext.setStyle("display",""); //将原来菜单项显示
                	if(tempLi.hasClass('highlight')){
                		tempNext.addClass('highlight');
                		this.clickedItem = tempNext;
                	}
                    tempLi.destroy();//将不可用菜单项删除
                }else if(status=="false" && !tempLi.get('cloneFlag')){
                    var cloneLi = tempLi.clone(true);//克隆对象
                    cloneLi.addClass("enabledStyle") ;//加入不可用样式
                    tempLi.setStyle("display","none");//将原来菜单项隐藏
                    cloneLi.inject(tempLi,"before");// 将不可用的菜单项放在原来菜单项的前面
                    cloneLi.set('cloneFlag',true);
                }

          }else{

              if(status=="true"){
                   this.data.each(function(item, index){
                       if(item.code == code){
                            item["enabled"] = "true" ;
                       }
                    });
                }else {
                    this.data.each(function(item, index){
                       if(item.code == code){
                             item["enabled"] = "false" ;
                       }
                    });
                }
          }

       }
    },
	refresh:function(){

         var tempDiv = $(this.options.name);
            if($defined(this.menuZeroLevelDiv)){
                this.menuZeroLevelDiv.destroy();
                this.root.empty();
                this.parseData();
                if(this.options.isShow=="true")
                   this.buildMenuDiv();
            }

    }


    //在图片区域放置图片
    ,addImg :function(item, imgSpan) {
       if(item.imgName){
           var imgUrl=jsR.rootPath+'swordweb/styles/'+jsR.config.style.sys_style+'/SwordMenu/images/'+item.imgName;
           imgSpan.setStyle("background","url("+imgUrl+") no-repeat center");
       }else if(item.imgUrl){
           imgSpan.setStyle("background","url("+item.imgUrl+") no-repeat center");
       }
    }
    ,setDisplayTagWithBuild:function(value){
    	this.options.displayTag = value;
    },
    setMenuHide:function(status){
        if(status=="true")this.menuZeroLevelDiv.setStyle("display","");
        else this.menuZeroLevelDiv.setStyle("display","none");
    }
});