/**
  * 手风琴类
  * @class swordweb.widgets.SwordAccordion.SwordAccordion
  * @implements Events
  * @implements Options
 */
var SwordAccordion = new Class({
    Implements : [Events,Options],
	type: 'SwordAccordion',
    options:{
		pNode: null,
        /*
         *组件类别声明
         *@property {private string} sword
         */
        sword:null,
        /*
         *组件唯一标识
         *@property {private string} name
         */
		name: null,
         /*
         *相对|绝对定位 absolute:相对|relative:绝对，默认：relative
         *@property {private string} pos
         */
		pos: 'relative',//如果需要绝对定位,这里需要修改width,height,left,top

	 	divWidth: null,
		divHeight: null,
        /*
         *绝对定位时距左边的距离
         *@property {private string} divLeft
         */
		divLeft: null,
        /*
         *绝对定位时距上边的距离
         *@property {private string} divTop
         */
		divTop: null,
         /**
         * 级联标识
         * @property {private string} cascadeSign
         */
        cascadeSign:{"id":"code","pid":"pcode"},
        /**
         * 根据此属性取值，用于显示节点内容
         * @property {private string} displayTag
         */
        displayTag:"caption"  ,
          /**
         * 手风琴标题的起始装载层次
         * @property {private string} startLayer
         */
        startLayer:1,
		/**
         *默认选中的item的name值(options) ,默认打开第一项
         *@property {private string} defaultSelectName
         */
		defaultSelectName: null,
         /**
         *  前端服务标识1
         *  @property {private string} ctrl
         */
        ctrl:null,
        /**
         *  前端服务标识2
         *  @property {private string} tid
         */
        tid:null,
        /**
         *  数据字符串
         *  @property {private string} dataStr
         */
		dataStr: null


        //是否允许点击之后收缩
        ,collapse:'false'

        /**
         *  树配置
         *  @property {private object} tree
         */
        ,tree:{}
        /**
         * 双击手风琴节点时触发
         * @event onItemClick
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onItemClick:$empty
    },
    accordionDiv: null,
    /**
     *item对象，{"itemName":"SwordAccordionItem对象"}
     *@property {private string} items
     */
	accordionItems: new Hash(),
	/**
     *当前的选中的item节点    SwordAccordionItem
     * @property {private string} curAccordionItem
     */
	curAccordionItem: null,
    /**
     * 数据
     * @property {private string} data
     */
    data:null,
    /**
     * root
     * @property {private string} root
     */
    root:[],
    /**
     * 根下的孩子  {根节点codeKey:隶属于此根节点下的孩子结点的数组}
     * @property {private string} childs
     */
    childs:new Hash(),
	/**
      * 构造函数
      * @constructor {protected} initialize
     */
    initialize:function(options) {
        //this.setOptions(options);
    },
    initParam:function(node) {
        this.htmlOptions(node);
        if ($type(this.options.cascadeSign) == 'string') {
            this.options.cascadeSign = JSON.decode(this.options.cascadeSign);
        }
        this.parseDynamicData();//解析后台数据
        this.parseAccordionItems(node);  //解析页面数据
        this.create(node); //生成节点
    },
	initData: function() {

    },

    parseDynamicData:function(){
        this.buildData(); //后台获取数据
        this.parseData();//解析获取的数据
    },

    //获取数据
	buildData: function(){
		if($chk(this.options.dataStr) ){
            this.data = JSON.decode(this.options.dataStr).data;//dataStr的字符串
        }else if($chk(this.options.ctrl)||$chk(this.options.tid))
			this.getDataByCtrl();
    },
	getDataByCtrl: function(){
		var req = pageContainer.getReq({
            'tid':this.options.tid
            ,'ctrl':this.options.ctrl
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

    parseData:function(){
         if($chk(this.data)){
             //获取根节点
             this.getRoot();
             //获取每个根下的孩子结点
             this.getChildUnderRoot();
         }
    },

    getRoot:function(){

       // var tempData = this.data;
        for(var i=0 ; i < this.data.length ; i++){
            var pcode = this.data[i][this.options.cascadeSign.pid]||this.data[i][this.options.cascadeSign.pid.toUpperCase()];
            var flag = true;
            for(var j = 0 ; j < this.data.length ; j++){
                var code =  this.data[j][this.options.cascadeSign.id]||this.data[j][this.options.cascadeSign.id.toUpperCase()];
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
        var code = root[this.options.cascadeSign.id]||root[this.options.cascadeSign.id.toUpperCase()];
        for (var jj = 0; jj < this.data.length; jj++) {
            var pcode = this.data[jj][this.options.cascadeSign.pid]||this.data[jj][this.options.cascadeSign.pid.toUpperCase()];
            if (code == pcode ) {
                if(tempLayer==this.options.startLayer){
                   this.root[this.root.length] = this.data[jj];
                }else{
                    if(this.isHasChilds(this.data[jj]))
                        this.getRootByStartLayer(this.data[jj],tempLayer);
                }
            }
        }
    },

    getChildUnderRoot:function(){

        for(var ii=0 ; ii < this.root.length ; ii++){
             var childsArr = new Array();
             this.getChildNode(this.root[ii],childsArr) ;
             this.childs.set((this.root[ii][this.options.cascadeSign.id]||this.root[ii][this.options.cascadeSign.id.toUpperCase()]),childsArr);
        }

    },


    getChildNode:function(root,childsArr){
        var code = root[this.options.cascadeSign.id]||root[this.options.cascadeSign.id.toUpperCase()];
        for (var jj = 0; jj < this.data.length; jj++) {
            var pcode = this.data[jj][this.options.cascadeSign.pid]||this.data[jj][this.options.cascadeSign.pid.toUpperCase()];
            if (code == pcode) {
                childsArr[childsArr.length] = this.data[jj];
                if(this.isHasChilds(this.data[jj]))
                   this.getChildNode(this.data[jj],childsArr);
            }
        }
    },

    isHasChilds:function(root){
        var flag = false;
        var code = root[this.options.cascadeSign.id]||root[this.options.cascadeSign.id.toUpperCase()];
        for (var pp = 0; pp < this.data.length; pp++) {
            var pcode = this.data[pp][this.options.cascadeSign.pid]||this.data[pp][this.options.cascadeSign.pid.toUpperCase()];
            if (code == pcode) {
                flag = true;
                break;
            }
        }
        return flag;
    } ,

    parseAccordionItems: function(node){

        //解析页面上固定的item
		var items = node.getChildren("div[type=SwordAccordionItem]");
        if(items.length>0&&!$chk(this.options.defaultSelectName))
           this.options.defaultSelectName = items[0].getProperty("name");
        items.each(function(item, index){
            var itemObj = new SwordAccordionItem();
            itemObj.initParam(item);
            this.accordionItems.set(item.getProperty("name") ,itemObj);
		}.bind(this));

        //解析后台返回数据构成的item   todo
        if(!$chk(this.options.defaultSelectName)&&this.root.length>0)
            this.options.defaultSelectName = this.root[0][this.options.cascadeSign.id]||this.root[0][this.options.cascadeSign.id.toUpperCase()];
        this.root.each(function(item, inx){
            var obj = {};
            var isCaption=true;
            var keyName;
            new Hash(item).each(function(value,key){
            	
                obj[key] = value;
                $extend(obj,JSON.decode(this.options.tree));
                if(key==this.options.cascadeSign.id||key == this.options.cascadeSign.id.toUpperCase() ){
                    obj["name"] = value;
                    obj["dataStr"] = "{'data':"+this.childs[value].toJSON()+"}";
                }else if(key==this.options.displayTag||key==this.options.displayTag.toUpperCase()){
                	isCaption=false;
                	keyName = key;
                   obj[key] = value;
                }
            }.bind(this));
           var itemObj = new SwordAccordionItem(obj);
           if(!isCaption){
        	   itemObj.options.caption=obj[keyName];
           }
           this.accordionItems.set((item[this.options.cascadeSign.id]||item[this.options.cascadeSign.id.toUpperCase()]),itemObj);
        }.bind(this));


    },

	create: function(node){
		this.options.pNode = node
		this.options.pNode.setStyle('height',"99.5%");//这里针对于pNode的height/width的width和height进行固定,99.5是防止出现100%出现滚动条
		this.options.pNode.setStyle('width',"99.5%");
		this.buildAccordionDiv();
		this.buildAccordionItems();
        this.activeAccordionItem(this.options.defaultSelectName);
	},

	buildAccordionDiv: function(){
		this.accordionDiv = new Element('div',{
			'name': this.options.name,
			'class': 'x-according-body x-according-body-noheader'
		}).inject(this.options.pNode);
		if(this.options.pos == 'absolute'){
			this.accordionDiv.setStyles({
				'position': 'absolute',
				'left': this.options.divLeft,
				'top': this.options.divTop,
				'width': this.options.divWidth,
				'height': this.options.divHeight
			});
		}else{
			this.accordionDiv.setStyles({
				'width': this.options.divWidth,
				'height': this.options.divHeight
			});
		}
	},

	buildAccordionItems: function(){
        var i=0;
		this.accordionItems.each(function(item,name){
              item.refSwordAccordion = this;
		      item.addAccordionItem(++i); 
		}.bind(this));
	},

	/**
	 *  激活选项
	 *  @function {public id} activeAccordionItem
	 *  @returns null
     */
	activeAccordionItem: function(itemName){
	 	this.curAccordionItem = this.accordionItems.get(itemName);
        if($chk(this.curAccordionItem))
		    this.curAccordionItem.activeAccordionItem();
	},
	/**
	 *  不激活选项
	 *  @function {public id} unactiveAccordionItem
	 *  @returns null
     */
	unactiveAccordionItem: function(itemName){
	 	this.accordionItems.get(itemName).unActiveAccordionItem();
		this.curAccordionItem = null;
	}  ,


	calculateItemHeight: function(){
		return this.options.pNode.getSize().y - 23*this.accordionItems.getLength();
	}
});





/**
  * 手风琴类中的项
  * @class swordweb.widgets.SwordAccordion.SwordAccordionItem
  * @implements Events
  * @implements Options
 */


var SwordAccordionItem = new Class({
    Implements : [Events,Options],
	name: 'SwordAccordionItem',
    options:{
        /*
         *item标识
         *@property {private string} id
         */
		name:null,
		caption: '手风琴',
		src: null,
        pNode:null
		//accordionContentType: "innerHTML",//iframe,innerHTML
		//accordionItemContentDivHeight: null//content内容的高度
    },
	refSwordAccordion: null,
	accordionItemDiv: null,
	accordionItemTitleDiv: null,//accordionItemTitleDiv的line-height是23px--------------这个高度需要在css之后还要修改一下
	accordionItemTitleSpan: null,
	accordionItemContentDiv: null,
	accordionItemContent: null,
    initialize:function(options) {
         this.setOptions(options);

    },
    initParam:function(htmlNode) {
         this.htmlOptions(htmlNode);
         this.options.pNode = htmlNode;
    },
	initData: function() {

    },
	addAccordionItem: function(i){
		this.buildAccordionItemTitle(i);
		this.buildAccordionItemContent();
	},
	buildAccordionItemTitle: function(i){
		this.accordionItemDiv = new Element('div',{
			'name': "accordionItem_" + this.options.name,
			'class': 'x-according empty x-according-collapsed x-according-'+i
		}).inject(this.refSwordAccordion.accordionDiv);
        this.accordionItemTitleDiv = new Element('div',{
			'name': "accordionItemTitle_" + this.options.name,
			'class': 'x-according-header x-unselectable x-accordion-hd',
			'styles':{
				'cursor': 'pointer'
			}
		}).inject(this.accordionItemDiv);
		var btnDiv = new Element('div',{
			'class': 'x-tool x-according-tool x-tool-toggle'
		}).inject(this.accordionItemTitleDiv);
		this.accordionItemTitleDiv.addEvent(
            'click',function(){
                    if (this.refSwordAccordion.options.collapse == 'true') {
                        if (this.refSwordAccordion.curAccordionItem == this) {
                            if (this.accordionItemContentDiv.getStyle('display') == 'none') {
                                this.accordionItemDiv.removeClass("x-according-collapsed");
                                this.accordionItemContentDiv.setStyles({
                                            'display':'block'
                                            ,'height':this.refSwordAccordion.calculateItemHeight()});
                            } else {
                                this.accordionItemDiv.addClass("x-according-collapsed");
                                this.accordionItemContentDiv.setStyle('display', "none");
                            }
                        } else {
                            if ($chk(this.refSwordAccordion.curAccordionItem))
                                this.refSwordAccordion.unactiveAccordionItem(this.refSwordAccordion.curAccordionItem.options.name);
                            this.refSwordAccordion.activeAccordionItem(this.options.name);
                        }
                    }
                    if(this.refSwordAccordion.curAccordionItem != this){
                       if($chk(this.refSwordAccordion.curAccordionItem))
                            this.refSwordAccordion.unactiveAccordionItem(this.refSwordAccordion.curAccordionItem.options.name);
                        this.refSwordAccordion.activeAccordionItem(this.options.name);
                   }
                   if(this.refSwordAccordion.options.onItemClick)
                      this.refSwordAccordion.fireEvent("onItemClick",this.options);
           }.bind(this)
         );


		this.accordionItemTitleSpan = new Element('div',{
			'text': this.options.caption
        }).inject(this.accordionItemTitleDiv);
	},
	buildAccordionItemContent: function(){
		this.accordionItemContentDiv = new Element('div',{
			'name': "accordionItemContentDiv_" + this.options.name,
			'class': 'x-according-bwrap',
			'styles':{
				'display': 'none'
			}
		}).inject(this.accordionItemDiv);
		if($defined(this.options.src)){
			this.buildItemContent("iframe")
			this.accordionItemContent.setProperty('src', this.options.src);
		}else if($chk(this.options.pNode)){
			this.buildItemContent("div");
            this.accordionItemContent.adopt(this.options.pNode.getChildren());
        }else{
            this.buildItemContent("div");
            jsR.doIm("SwordTree");
            var tree = new SwordTree(this.options,this.accordionItemContent);
            tree.addEvent("onNodeClick",this.getFunc(tree.options.onNodeClick)[0]);
            var rFunc = this.getFunc(tree.options.onNodeContextMenu)[0];
            if($defined(rFunc)){
               tree.addEvent("onNodeContextMenu",rFunc);
            }
            tree.build();
            this.tree = tree;
        }
        if($defined(this.options.pNode))
            this.options.pNode.destroy();
	},

    buildItemContent:function(eleType){
          this.accordionItemContent = new Element(eleType, {
				'name': "accordionItemContent_" + this.options.name
			}).inject(this.accordionItemContentDiv);
			this.accordionItemContent.setStyles({
				'width': "100%",
				'height': "100%"
			});
    } ,

	activeAccordionItem: function(){
		this.accordionItemDiv.removeClass("x-according-collapsed");
        this.accordionItemTitleSpan.addClass("x-according-text");
		this.accordionItemContentDiv.setStyles({
              'display':'block'
             ,'height':this.refSwordAccordion.calculateItemHeight()});
	},
	unActiveAccordionItem: function(){
		this.accordionItemDiv.addClass("x-according-collapsed");
        this.accordionItemTitleSpan.removeClass("x-according-text");
		this.accordionItemContentDiv.setStyle('display','none');
	}
});


