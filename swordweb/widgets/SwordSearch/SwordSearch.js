var SwordSearch = new Class({
     Implements:[Options,Events],
	 name: "SwordSearch",
     options:{
        name:"",
	 	pNode: null,
        tid:"",
        ctrl:"",
        tipTid:"",
        tipCtrl:"",
        onInputSubBef:null,//在输入框提交之前触发的事件
        onSearch: null//点击搜索按钮时触发的事件
	 },
	 data: null,
     inputDiv: null,
     inputSearch: null,
     inputBtn: null,
     popDiv:null,
     popUL:null,
     popDatas:[],//弹出框的数据[{keywords:'',path:'',code:''},{keywords:'',path:'',code:''}]
     popItemsLI:[],//弹出框生成的el数组
     curItemLI:null,//当前的选中的item
     index:-1,//计数器，上下移动时用来计数
     dataContainer:[],//装载提交数据的容器
	 initialize: function(options){
		this.setOptions(options);
     },
	 initParam: function(node) {
		this.htmlOptions(node);
        if(!$defined(this.options.pNode)){
            this.options.pNode = node.getParent();
        }
		this.createInput();
        this.createPop();
     },
     initData: function(data) {
         //this.parseData(data);
     },

     createInput: function(){
         this.inputDiv = new Element('div',{
             'class':'graybord'
         }).inject(this.options.pNode);
         this.inputSearch = new Element('input',{
             'type':'text',
             'value':'',
             'class':'whitetext',
             'name':this.options.name+'Input',
             'id':this.options.name+'Input'
         }).inject(this.inputDiv);
         this.inputBtn = new Element('input',{
             'type':'button',
             'value':'搜索',
             'class':'search',
             'name':this.options.name+'Button',
             'id':this.options.name+'Button'
         }).inject(this.inputDiv);


         window.document.addEvent('click', function(e) {
        	var event = new Event(e);
        	if(event.target.tagName == "BODY")
         	    this.popDiv.setStyle('display','none');
         }.bind(this));
         this.inputSearch.addEvent('keyup', function(e) {//文本框按键按下

             var event = new Event(e);

             switch(event.code) {
	           case 38: // up向上
	    	      event.preventDefault();
	    	      this.moveSelectItemLI("up");
	    	      break;
	    	   case 40: // down向下
	    	      event.preventDefault();
	    	      this.moveSelectItemLI("down");
	    	      break;
	    	   case 13://回车
	    	      event.preventDefault();
	    		  this.giveOutValue();
	    		  this.popDiv.setStyle('display','none');
	    		  this.index = -1;
	    		  break;

         	   default:
         		  this.fireEvent("onInputSubBef");
                  this.refresh();
                  break;
         	}


         }.bind(this));

         this.inputBtn.addEvent('click', function(e) {//点击搜索按钮
        	   this.fireEvent("onSearch",this.inputSearch);

         }.bind(this));

     },
     createPop: function(){
         if(!$defined(this.popDiv)){
        	 this.popDiv = new Element('div',{
                 'class':'searchPop',
                 'styles':{
                     'position':'absolute',
                     'left': this.inputDiv.getPosition().x,
                     'top': this.inputDiv.getPosition().y + this.inputDiv.getSize().y,
                     'width':this.inputDiv.getSize().x,
                     'display':'none'
                 }
             }).inject($(document.body));
             this.popUL = new Element('ul').inject(this.popDiv);
         }
     },
     parseData: function(data){
    	 if($chk(data)){
	    	 var tm = data.split(";");
	         var tmarray;
	         for(var i = 0 ; i < tm.length ; i++){
	             tmarray = tm[i].split(",");
	             var tmObj = {
	                 'keyword': tmarray[0],
	                 'path': tmarray[1],
	                 'code': tmarray[2]
	             };
	             this.popDatas.push(tmObj);
	             this.createItemLI(tmObj);
	         }
	         this.popDiv.setStyle('display','');
    	 }
     },
     createItemLI: function(item){
         var itemli = new Element('li',{
             'class':'',
             'code': item["code"],
             'path': item["path"],
             'keyword':item["keyword"],
             'index': this.popItemsLI.length
         }).inject(this.popUL);

         var codeP = new Element('p',{
             'text': item["keyword"]
         }).inject(itemli);
         var pathSpan = new Element('span',{
             'text': item["path"]
         }).inject(itemli);
         this.popItemsLI.push(itemli);

         itemli.addEvents({
        	 'mouseover' : function(e) {//焦点移上时
	        	 if($defined(this.curItemLI)){
	                 this.curItemLI.removeClass("searchPop_over");
	             }
	             itemli.addClass("searchPop_over");
	             this.curItemLI = itemli;
             }.bind(this),
             'click' :  function(e) {//点击时
	        	 this.giveOutValue();
			     this.popDiv.setStyle('display','none');
			     this.index = -1;
	         }.bind(this)
         });

     },
     refresh: function(){
    	 if(this.inputSearch.value != ""){
               this.clearAll();
               this.getDataFromServer();
               this.parseData(this.data);
//               var dataStr = "苑,架构部->框架组->苑桐,yuantong;刘,架构部->框架组->刘中元,liuzhy;曹,架构部->框架组->曹楠,caonan";
//               this.parseData(dataStr);
         }else{
         	this.popDiv.setStyle('display','none');
         	this.index = -1;
         }

     },
     clearAll: function(){
         this.popDatas = [];//数据重置
         this.popUL.empty();//el删除
         this.popItemsLI = [];//数组重置
         this.curItemLI = null;//当前元素置为空
         this.index = -1;//清空计数器，上下移动时用来计数
     },
     getDataFromServer: function(){

	    	this.pushData(this.inputSearch.name,this.inputSearch.value);

            var req = pageContainer.getReq({
                'tid':this.options.tipTid
                ,'ctrl':this.options.tipCtrl
                ,'widgets':this.dataContainer
            });

            pageContainer.postReq({'req':req,'async':false
                ,'onSuccess':function(resData) {
            	     this.data = resData.getAttr(this.options.name);
                }.bind(this)
                , 'onError'  :function (res) {

                }.bind(this)
            });

     },

     giveOutValue: function(){
        this.inputSearch.set('value',this.curItemLI.getProperty("keyword"));
        this.inputSearch.set('code',this.curItemLI.getProperty("code"));
        this.inputSearch.set('path',this.curItemLI.getProperty("path"));
        this.inputSearch.set('index',this.curItemLI.getProperty("index"));
     },
     moveSelectItemLI: function(flag){

	      if(this.popItemsLI.length > 0){
	         if(flag == "up"){
	             this.index = this.index - 1;
	             if(this.index < 0)
	            	 this.index = 0;
	             if($defined(this.curItemLI)){
	            	 this.curItemLI.removeClass('searchPop_over');
	             }
	             this.curItemLI = this.popItemsLI[this.index];
	             this.curItemLI.addClass('searchPop_over');

	         }else if(flag == "down"){
	             this.index = this.index + 1;
	             if(this.index >= this.popItemsLI.length)
	            	 this.index = this.popItemsLI.length -1;
	             if($defined(this.curItemLI)){
	            	 this.curItemLI.removeClass('searchPop_over');
	             }
	             this.curItemLI = this.popItemsLI[this.index];
	             this.curItemLI.addClass('searchPop_over');

	         }
	     }
     },
     /**
      * 提交前补充提交数据
      * @function {public null} pushData
      * @param {data} 提交数据
      */
     pushData:function(data, value) {
         var postData = [];
         if (arguments.length == 2) {
             var sd = {'name':data,'value':value||""};
             postData.push(sd);
         } else {
             if ($type(data) == "object") {
                 postData.push(data);
             } else if($type(data) == "array"){
                 postData = data;
             }
         }
         for (var i = 0; i < postData.length; i++) {
             if (!postData[i]["sword"]) {
                 postData[i]["sword"] = "attr";
             }
         }
         this.dataContainer.combine(postData);
     }

});