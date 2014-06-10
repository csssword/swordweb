/**
  * SwordFavorite�����    
  * @class swordweb.widgets.SwordTaskRemind.SwordFavorite
  * @implements Events
  * @implements Options
 */

var SwordFavorite = new Class({
    Implements : [Events,Options],
    name: "SwordFavorite",
    options:{
         /*
          *组件类别声明����������
          *@property {private string} sword
         */
        sword:null,
         /**
          *组件唯一标识
          *@property {private string} name
         */
		name: "swordFavorite",
        /**
         *  ����ַ�
         *  @property {private string} dataStr
         */
		dataStr: null,
        /**
         *  前端服务标识
         *  @property {private string} ctrl
         */
        ctrl:"",
         /**
         *  后台服务标识
         *  @property {private string} tid
         */
        tid:"" ,

        pNode: null,
         /**
         * 一行显示几列
         * @property {private string} cols
         */
        cols:2 ,
       
        /**
         * 根据此属性取值，用于显示节点内容
         * @property {private string} displayTag
         */
        displayTag:"caption",
        /**
          * 单击节点时触发
          * @property {private function} onNodeClick
         */
        onNodeClick:$empty ,
         /**
          * 单击右键时触发
          * @property {private function} onNodeClick
         */
        onNodeContextMenu:$empty

    },
    data: null,
    favoriteDiv: null,
    childIndex: 0,
    tbody:null,
    lastTR:null,
     /**
     *初始化参数
     * @function initParam
     * @param {HTMLElement} 
     */
    initParam:function(node) {
        this.htmlOptions(node);

        this.build(node);
    },
	initData: function(data) {
	
    },
	build: function(node){
        if($chk(node))
           this.options.pNode = node;
        else
           this.options.pNode = document.body;
		this.buildData();
		this.buildFavorites();
	},

     //获取数据  优先级：dataStr>ctrl>SwordPageData
	buildData: function(){

			if(!$chk(this.options.dataStr) ){
				if($chk(this.options.ctrl)||$chk(this.options.tid)){
					this.getDataFromServer();
				}else if($defined($('SwordPageData'))){
                    this.data =  pageContainer.getInitData(this.options.name).data;
                }
			}else{
				this.data = JSON.decode(this.options.dataStr).data;//dataStr���ַ�
			}

	},
    
	getDataFromServer: function(){
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

    buildFavorites: function(){

        this.favoriteDiv = new Element('div', {
            'name': this.options.name 

        }).inject(this.options.pNode);

        var table = new Element('table', {
          
        }).inject(this.favoriteDiv);
         this.tbody = new Element('tbody').inject(table);

        this.buildTRs();

	},

  
	buildTRs: function(){
        var dataLen = this.data.length;
        for(var ii = 0 ; ii < dataLen ; ii++){
            this.buildTR(this.data[ii],ii);
        }
        this.childIndex = dataLen;
    },

    buildTR:function(item,index){
        
           if (index % this.options.cols == 0) {
                this.lastTR = new Element('tr').inject(this.tbody);
            }

            var tempTd = new Element('td').inject(this.lastTR);
            tempTd.set(item);
            var tempDiv = new Element("div", {
                'class':'tb'
            }).inject(tempTd);
            var tempImg = new Element("div", {
                'class':'imgStyle'
            }).inject(tempDiv);
            new Element("div", {
                'class':'textStyle',
                'text':item[this.options.displayTag]
            }).inject(tempDiv);
           tempDiv.addEvent("click",function(){
               this.fireEvent("onNodeClick",tempTd);
           }.bind(this))
    },

    addData:function(sub,obj){
        var result = true; 
        if($chk(sub)&&($chk(sub.ctrl)||$chk(sub.tid))){
           result = addDataToServer(obj);
           if(result)
              addDataToPage(obj);
           else
              alert("添加收藏夹失败");
        }else{
            alert("未设置ctrl或者tid");
        }
   },

    //添加到服务器������
    addDataToServer:function(obj){
        var data = new Hash();
        data.set("sword", "SwordTree");
        data.set("name", this.options.name);
        data.set("data", [obj]);
         var req = pageContainer.getReq({
            'tid':this.options.tid
            ,'ctrl':this.options.ctrl
            ,'data':[data]
        });
        pageContainer.postReq({'req':req,'async':false
            ,'onSuccess':function(resData) {
                return true;
            }.bind(this)
            , 'onError'  :function (res) {
               return false
            }.bind(this)
        });
    },
    //添加到页面�obj:{"caption":"value","key":"value"}������
    addDataToPage:function(obj){
         this.buildTR(obj,this.childIndex) ;
         this.childIndex++;
    }

	
});















