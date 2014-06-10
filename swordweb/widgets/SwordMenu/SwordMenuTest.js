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
		itemWidth: null,
		itemHeight: null,
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
          * menu的是否显示选中的函数(options)
          * @property {private function} onSelect
         */
		onSelect: null//这个是问题??不可以写成$empty的形式

    },
	menuInput: null,
	menuZeroLevelDiv: null,
	menuZeroLevelUL: null,
	data: null,
	currentSelectItem: null,
    foldFlag:true,//菜单折叠的标记  true:折叠 false:不折叠
    tempTable:null,
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
		this.build();
    },
	initData: function(data) {
		if($defined(this.options.data)){
			this.data = data;
		}
    },
	build: function(){
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
				if(this.options.ctrl != ""){
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
		}
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
			  // this.fold.delay(500,this);
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

	buildZeroLevelMenuLI: function(){
		var childIndex = 0;
		if($defined(this.data)){
			this.data.each(function(item, index){
				if(item.pcode == null){
					var zeroLi = new Element('li', {
						'name': "swordMenuLi_null_" + childIndex,
						'text': item.caption,
						'styles':{
							'width': this.options.itemWidth,
							'height': this.options.itemHeight
						}
					}).inject(this.menuZeroLevelUL);
                    this.addStyle(zeroLi) ;
					childIndex++;
					zeroLi.setProperty('pCode',"null");
					zeroLi.setProperty('code',item.code);
					zeroLi.setProperty('caption',item.caption);

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
                                    'text': "   >>"
                                }).inject(zeroLi);
                           }
                    }
	               if(item.enabled =="true"){
	                   zeroLi.addClass("enabledStyle");
	                   return;
	               }
					zeroLi.addEvent('mouseover', function() {
						//this.foldFlag = false;
						if($defined(this.currentSelectItem)){
							if(this.currentSelectItem.getProperty("name") == "swordMenuLi_null_null"){
								this.currentSelectItem.setProperty("name","swordMenuLi_null_0");
							}
						}
						zeroLi.parentNode.getChildren("li").each(function(item1, index1){
							this.closeChildMenu(item1.getProperty("code"));
						}.bind(this));
						this.currentSelectItem = zeroLi;
						if(this.options.type == "horizontal"){
							zeroLi.removeClass("sty_2");
							zeroLi.addClass('sty_2_a');
						}else if(this.options.type == "vertical"){
							zeroLi.removeClass("sty_1");
							zeroLi.addClass('sty_1_a');
						}

                        this.openChildMenu(this.menuZeroLevelDiv,zeroLi,item.code,"zero");
			        }.bind(this));
					zeroLi.addEvent('mouseout', function(e) {
                        //this.foldFlag = true;
					    if(this.options.type == "horizontal"){
							zeroLi.removeClass("sty_2_a");
							zeroLi.addClass('sty_2');
						}else if(this.options.type == "vertical"){
							zeroLi.removeClass("sty_1_a");
							zeroLi.addClass('sty_1');
						}
                       // this.fold.delay(500,this);
			        }.bind(this));
					zeroLi.addEvent('click', function(e) {
						this.selectItem();
			        }.bind(this))
	              }
			}.bind(this));
		}
	},
    fold:function(){
        if(this.foldFlag){
           this.refresh();
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
		//debugger;
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
                       tempMenuLevelDiv.setStyles({'left':zeroLi.getPosition().x55}) ;
				}

			}else{
				tempMenuLevelDiv.setStyles({
					'position': 'absolute',
					'z-index': this.options.zIndex,
					'left': zeroLi.getSize().x+16,
					'top': zeroLi.getSize().y * zeroLi.getProperty("name").split("_")[2]
				});
			}

		}else if(this.options.type == "vertical"){
			if($defined(zeroFlag) && zeroFlag == "zero"){
				if(levelDiv.getStyle("position") == "absolute"){
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition(levelDiv).x + zeroLi.getSize().x+11,
						'top': zeroLi.getPosition(levelDiv).y
					});
				}else{
					tempMenuLevelDiv.setStyles({
						'position': 'absolute',
						'z-index': this.options.zIndex,
						'left': zeroLi.getPosition().x + zeroLi.getSize().x+11,
						'top': zeroLi.getPosition().y
					});
				}

			}else{
				tempMenuLevelDiv.setStyles({
					'position': 'absolute',
					'z-index': this.options.zIndex,
					'left': zeroLi.getSize().x+16,
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
					'name': "swordMenuLi_" + item.pcode + "_" + childIndex,
                    'text': item.caption,
					'styles':{
						'width': this.options.itemWidth,
						'height': this.options.itemHeight
					}
				}).inject(tempMenuLevelUL);
                tempLi.addClass("sty_1");
				childIndex++;
				tempLi.setProperty('pCode',item.pcode);
				tempLi.setProperty('code',item.code);
				tempLi.setProperty('caption',item.caption);

                new Hash(item).each(function(value,key){
                    if(['pCode','code','caption'].contains(key)){
                       return;
                    }
                    tempLi.setProperty(key,value);
                });


				var childFlag = this.isHasChild(item.code);
				if(childFlag == true){

					var markSpan = new Element('span', {
						'text': "   >>",
						'class': 'mark'
					}).inject(tempLi);
				}
               if(item.enabled =="true"){
                   tempLi.addClass("enabledStyle");
                  /* tempLi.addEvent('mouseover', function() {
                        this.foldFlag = false;
                   }.bind(this));
                    tempLi.addEvent('mouseout', function() {
                        this.foldFlag = true;
                        this.fold.delay(500,this);
                   }.bind(this));   */
                   return;
               }
				tempLi.addEvent('mouseover', function() {
					//this.foldFlag = false;
					tempLi.parentNode.getChildren("li").each(function(item1, index1){
						this.closeChildMenu(item1.getProperty("code"));
					}.bind(this));
					this.currentSelectItem = tempLi;
					this.closeChildMenu(item.code);
					tempLi.removeClass('sty_1');
                    tempLi.addClass('sty_1_a');
					this.openChildMenu(tempMenuLevelDiv,tempLi,item.code);
		        }.bind(this));
				tempLi.addEvent('mouseout', function(e) {
                   // this.foldFlag = true;
					tempLi.removeClass('sty_1_a');
                    tempLi.addClass('sty_1');
                   // this.fold.delay(500,this);
		        }.bind(this));
				tempLi.addEvent('click', function(e) {
					this.selectItem();
		        }.bind(this));
              }
		}.bind(this));
	},
	/**
      * 关闭menu
      * @function {public} closeChildMenu
      * @param {int} pCode - 父Code
      * @returns null
     */
	closeChildMenu: function(pCode){
		var closeDivArray = this.menuZeroLevelDiv.getElements("div[pCode=" + pCode + "]");
        closeDivArray.each(function(item, index){
			item.destroy();
		}.bind(this));
	},
	selectItem: function(){
		 this.refresh();
		 this.fireEvent('onSelect', this.currentSelectItem);
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
    setMenuStatus:function(code,status){
       if($defined(this.menuZeroLevelDiv)){
            var tempLi = this.menuZeroLevelDiv.getElement("li[code=" + code + "]");
            if($chk(tempLi)){
                if(status=="true"){
                    //tempLi.removeEvents();
                    tempLi.addClass("enabledStyle") ;
                    this.data.each(function(item, index){
                       if(item.code == code){
                            item['enabled'] = 'false';
                       }
                    });
                }else {
                    tempLi.removeClass("enabledStyle");
                     this.data.each(function(item, index){
                       if(item.code == code){
                            item['enabled'] = 'true';
                       }
                    });
                }
               this.refresh();
          }else{
              if(status=="true"){
                   this.data.each(function(item, index){
                       if(item.code == code){
                            item['enabled'] = 'false';
                       }
                    });
                }else {
                    this.data.each(function(item, index){
                       if(item.code == code){
                            item['enabled'] = 'true';
                       }
                    });
                }
          }
       // this.refresh();
       }
    },
	refresh:function(){

       //  var tempDiv = document.body.getElementById(this.options.name);
            if($defined(this.menuZeroLevelDiv)){
                this.menuZeroLevelDiv.destroy();
                if(this.options.isShow=="true")
                   this.buildMenuDiv();
            }

    }
});















