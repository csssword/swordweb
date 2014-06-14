/**
 * widgets 模块
 * @module widgets
 * @requires base ,core
 */
/**
  树 组件
  @class swordweb.widgets.SwordTree.SwordTree
  @implements Events
  @implements Options
 */
var SwordTree = new Class({

    $family: {name: 'SwordTree'}
    ,container:$empty

	,oldDataStr:null
	,findNodeSign:false
    /**
     * 构造器
     */
    ,builder:$empty
    ,Implements: [Events, Options]
    ,options: {
    	isCaptionChecked:'true',
    	search:"false",
    	dataName:null,
    	cacheName:null,
    	searchLength:"1",
    	searchTime:"0.5",
    	searchInputWidth:"160px",
    	isSearchByCode:"true",
    	maxHeight:"305px",
    	handInput:"false"
    	,pNode:null
        ,treeContainerName:""
        /******************   定义数据来源   *******************/
        /**
         * 后台服务标识
         * @property {private string} tid
         */
        ,tid:""
        /**
         *  前端服务标识
         *  @property {private string} ctrl
         */
        ,ctrl:""
        /**
         *  延迟加载后端服务标识
         *  @property {private string} ltid
         */
        ,ltid:""
        /**
         *  延迟加载前端服务标识
         *  @property {private string} lctrl
         */
        ,lctrl:""
        /**
         *  延迟加载后端服务标识,为延迟加载选择树的查询
         *  @property {private string} qtid
         */
        ,qtid:""
        /**
         *  延迟加载前端服务标识,为延迟加载选择树的查询
         *  @property {private string} qctrl
         */
        ,qctrl:""
        /**
         * 输入大于指定长度的字符串，才进行查询
         * 默认为 0，不限制
         */
        ,qlength:0

        ,isInitLoadData:"true"
        /**
         *  静态数据
         *  @property {private string} dataStr
         */
        ,dataStr:""
        /**
         * 请求数据
         * 一般与 @see build 接口一起使用；
         * @property {private string} postData
         */
        ,postData:null
        ,title:null
        /**
         * 页面数据的懒加载
         */
        ,pageDataLazy:null

        /******************  end 定义数据来源  *******************/


        /******************   构造树   *******************/
        /**
         * 创建的树类型  0： 普通树  1:选择树   2:全局 radio
         * @property {private string} treeType
         */
//        ,treeType:'0' sword5
          ,checkbox:false
        /**
         * 是否构建为下拉树
         * @property {private string} select
         */
        ,select:"false"
        /**
         * 设置树容器高度
         * @property {private string} height
         */
        ,height:""
        /**
         * 设置树容器宽度
         * @property {private string} width
         */
        ,width:""
        /*
         * 定义虚拟根节点
         * @property {private string} rootNode
         */
        ,rootNode:null
        /**
         * 初始化装载的层次
         * @property {private string} lazyLayer
         */
        ,lazyLayer:1
        ,nodeAutoPosition:"false"
        /**
         * 每次延迟加载层数
         * @description 默认为1，且<=底层数据的层次
         * @property {private string} lazyLoadLayer
         */
        ,lazyLoadLayer:1
        /**
         * 点击节点的延迟时间
         * @property {private string} lazyTime
         */
//        ,lazyTime:150
        /**
         * 树的起始装载层次
         * @property {private string} startLayer
         */
        ,startLayer:1
        /**
         * 定义树初始展开的层次
         * @property {private string} extendLayer
         */
        ,extendLayer:1
        /**
         * 定义树初始展开的层次
         * @property {private string} extendLayer
         */
        ,echoExtend:"false"
        /**
         * 智能构造树的级联标识，与 @see dataType 搭配使用  pid：父节点标识
         * @property {private string} cascadeSign
         */
        ,cascadeSign:{"id":"code","pid":"pcode"}

        /**
         * 构建树的数据格式  xml  json 默认为 json
         * @property {private string} dataType
         * @description   json 数据格式：{"sword": "SwordTree", "title": "SwordTreeJSON","data": [{"id": "1","title": "1111","pid": ""},{"id": "2","title": "2222","pid": "1"}] }
         */
        ,dataType:"jsonAptitude"
        /**
         * 用户自定义样式路径, 默认由容器自动加载,配置在 Sword.js --》 SwordTree 中
         * @property {private string} stylePath
         */
//        ,stylePath:"" 	sword5
        /**
         * 过滤类型
         * code---按照代码过滤
         * caption---按照名称过滤
         * all---按照代码或名称过滤
         * 其它任意值---按照任意属性过滤   例如：后台返回bz属性，filterSign="bz" 即按照bz的值==输入框中的值来过滤
         * @property {private string} filterSign
         */
        ,filterSign:"caption"
        /**
         * 根据此属性取值，用于显示节点内容
         * @property {private string} displayTag
         */
//     ,displayTag:"caption"  sword5
        /**
         * 是否移动高亮
         * @property {private string} isHighlight
         */
        ,isHighlight:"true"
        /**
         * 是否自动收缩已展开节点
         * @property {private string} autoCollapse
         */
        ,autoCollapse:"false"
        /******************  end 构造树  *******************/

        /***************** 定义下拉树 ******************/
        /**
         *  在下拉树状态下，文本框长度
         *  @property {private string} inputWidth
         */
        ,inputWidth:null
        /**
         * 设置下拉选中后 的实际值  （分为显示值，实际值）
         * @property {private string} submitFormat
         */
        ,submitFormat:"code" //sword5 selectRealKey
        ,sbmitcontent:"{code}"
        ,showFormat:null//弹出层的显示格式定义，与sbmitcontent的定义相似 	sword5
        /**
         *  下拉树状态下，文本框是否为只读状态
         *  @property {private string} readonly
         */
        ,readonly:"false"// sword5  selReadOnly改成readonly
        //是否可以选择
        ,disable:"false"

        ,lazySelect:"true"
        //懒加载下拉树中如果有initDataFlag = true 则表明初始化页面时即加载tid所指向的数据
        , initDataFlag:"false"
        /**
         *  下拉树状态下，所填内容的验证规则
         *  @property {private string} rule
         */
        ,rule:""

        ,validate:null
        /***************** end 定义下拉树 ******************/

        /******************* 定义拖拽 ******************/
        /**
         * 是否拖拽，默认为不拖拽  true --- 拖拽    false --- 不拖拽
         *  @property {private string} isDrag
         */
        ,isDrag:"false"
        ,isDragChildrenNode:"true"
        /**
         * 是否从树中剪切拖拽元素   true ---剪切   false ---不剪切
         *  @property {private string} isDragCut
         */
        ,isDragCut:"true"

        /**
         * 定义用于验证目标节点是否已经存在的标识  "id,title"
         *  @property {private string} existRules
         */
        ,existRules: ""
        /**
         * 下拉树选择的规则，默认为都可以进行选择，如果只选择子节点，则定义为"leaf"
         */
        ,selectrule:'all'
        /**
         * 参与拖拽的容器
         *  @property {private string} dragContainer
         */
        ,dragContainer:""
        /**
         * 拖拽响应距离
         *  @property {private string} snap
         */
        ,snap: 3
        /**
         * 打开叶节点的响应时间
         *  @property {private string} openTimer
         */
        ,openTimer: 6
        /**
         * 不可拖拽规则
         *  @property {private string} noDragRule
         */
        ,noDragRule:null
        /**
         * 禁止级联点击
         *  @property {private string} isCascadeCheckClick
         */
        ,isCascadeCheckedClick:'true'
        /**
         * 点击caption是否展开
         *  @property {private string} isCascadeCheckClick
         */
        ,autoExtendCaption:'false'
        /******************* end 拖拽 ******************/



        /******************* 定义事件 ******************/

		,onLoadDataFinish:$empty
        ,onAfterLoadData:$empty
        ,onCreateNode:$empty
        ,onDragBefore:$empty
        /** 节点的直接所有子节点创建完成触发**/
        ,onAfterCreateChildNodes:$empty
        /**
         * 单击树节点时触发
         * @event onNodeClick
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onNodeClick:$empty
        /**
         * 单击树节点之前触发，可以返回true or false,表示该树节点可不可以被选择
         */
        ,onNodeClickBefore:$empty
        //DATO
        ,onRightClick:$empty
        /**
         * 双击树节点时触发
         * @event onDblNodeClick
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onDblNodeClick:$empty
        /**
         * 单击节点前图片触发
         * @event onIconClick
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
//        ,onIconClick:$empty 	sword5
        /**
         * 双击节点前图片触发
         * @event onIconDblClick
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onIconDblClick:$empty
        /**
         * 选择框点击前事件
         * @event onCheckedBefore
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onCheckedBefore:$empty
        /**
         * 选择框点击后事件
         * @event onCheckedAfter
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onCheckedAfter:$empty
        /**
         * 节点折叠 展开
         * @event onExpand
         * @param {html element} node ，被点击节点的html元素，是一个div元素
         */
        ,onExpand:$empty
        /**
         * 拖拽后触发
         * @event onDragComplete
         */
        ,onDragComplete:$empty
        ,onDragSuccess:$empty
        ,onDragMove:$empty

        /*********** 定义下拉树事件 **********/

        /**
         * 下拉树状态下，选择中节点时触发
         * @event onSelectChange
         */
        ,onSelectChange : $empty

        //下拉树的输入框和输入框图标 点击之前触发
        ,onClickBefore : $empty
        /**
         * 下拉列表显示时触发
         * @event onSelectShow
         */
        ,onSelectShow   : $empty
        ,onSelectBtnOk :$empty
        ,onSelectBtnCancel:$empty
        /**
         * 下拉列表隐藏时触发
         * @event onSelectShow
         */
        ,onSelectHide   : $empty
//        ,onNodeContextMenu:$empty		sword5
        ,onFinish:$empty
        /**
         * 执行ltid之前触发，方便传参数，
         * @event onLtidBefore
         * @param {data json} nodeData ，被点击节点的node的JSON数据
         * 使用：nodeData.set('userParam','hi');后台可以获取到该值(和取code值一样)
         */
        ,onLtidBefore:$empty
        /**
         * 执行qtid之前触发，方便传参数，
         * @event onQtidBefore
         * @param {data json} params ，JSON数据
         * 使用：params.abc="abc";后台可以获取到该值
         */
        ,onQtidBefore:$empty
        /**
         * 执行extendNodeByIdPath后的回调函数
         */
        ,onAfterExtendByIdPath:$empty
        /**
         * 制定根节点的pcode的值
         */
        ,rootPcode:undefined
        

        /*********** end 定义下拉树事件 **********/

        /******************* end 定义事件 ******************/
       ,x:null
       ,snumber:1
    },displayTag:"caption" ,


    /**
     * 初始化树组件信息
     */
    initialize: function() {
        if (arguments.length == 2) {
            var params = Array.link(arguments, {'options': Object.type, 'element': $defined});
            this.container = $(params.element);
            this.setOptions(params.options);
            if ($type(this.options.cascadeSign) == 'string') {
               this.options.cascadeSign = JSON.decode(this.options.cascadeSign);
            }
            this.options.treeContainerName =  this.container.get("name");
        }

    }

    /**
     * 容器初始化
     * @param initPara
     */
    ,item:null
    ,initParam: function(initPara, parent) {
    	this.item = initPara;
        this.htmlOptions(initPara);
        if(initPara.getAttribute('readonly')=='true')this.options.readonly="true"; //防止被sword_convertHTML冲掉
        if(this.options.nodeAutoPosition=="true"){
        	this.options.lazyLayer=20;
        }
        this.options.treeContainerName =  initPara.get("name");
        if ($chk(this.options.nodeEvents) && $type(this.options.nodeEvents) == 'string') {
            this.options.nodeEvents = JSON.decode(this.options.nodeEvents);
        }
        if ($type(this.options.cascadeSign) == 'string') {
            this.options.cascadeSign = JSON.decode(this.options.cascadeSign);
        }
        if(initPara.get('cascadeSign')&&!initPara.get('submitFormat')){
              this.options.submitFormat=this.options.cascadeSign.id;
        }

        this.container = this.options.pNode;
        if(this.container.get('sword'))this.container.addClass('tree-container');
        if(!$defined(initPara.get("dataName"))){//增加树的前台缓存接口
        	var cn = initPara.get("cacheName");
        	if($defined(cn)){
    		this.options.dataStr = pc.getInitDataByDataName(cn,'cacheName');
        	}
        }
        if (($chk(this.options.tid) || $chk(this.options.ctrl))|| ((!$chk(this.options.tid) && !$chk(this.options.ctrl) )&& $chk(this.options.dataStr))) {
        	this.oldDataStr=this.options.dataStr;
        	this.createTDHashAArray();
        	this.build({}, parent);
            if(this.select){
                 sword_convertHTML(this.select.selBox,initPara);
                 // 这个地方被冲掉了
                 if(initPara.get('disable')=='false')
                	 this.select.selBox.erase('disabled');
            }
        }
        if(this.options.search=="true"&&this.options.select!="true"){
    		this.createSearchInput();
    	}
    }
    ,initData:function(data, parent) {
    	var dType=$type(data);
    	if(dType=="object"){data=JSON.encode(data);}
    	if(this.options.dataStr==data){//数据完全一样，不需要重载
    		this.oldDataStr = data;
    		return;
    	}
    	if(dType!="element"){//规避swordfrom的data错误赋值.
			if($chk(data)){
	        	this.options.dataStr = data;
	        	this.oldDataStr = data;
	        }else{
	        	var dn = data.get("dataName");
	        	if($chk(dn)){
	        		var dO=pc.getInitDataByDataName(dn);
	        		if($type(dO)!='string')dO=JSON.encode(dO);
	        		this.options.dataStr = dO;
	        		this.oldDataStr = dO;
	            }
	        }
			if($chk(this.searchInput)){//如果searchInput存在,则清空里面的数据.
				this.searchInput.set("value","");
			}
			this.treeDataHash=null;
			this.createTDHashAArray();
		}
    	this.isInitTree = false;
    	this.build({}, parent);
    	this.initDataFlag=true;
    }
    
    ,getDataStr:function(){
    	var temp=this.options.dataStr;
    	return $type(temp)=='string'?temp:JSON.encode(temp);
    }
    ,getDataObj:function(){
    	var temp=this.options.dataStr;
    	return $type(temp)=='string'?JSON.decode(temp):temp;
    }
    ,getOldDataObj:function(){
    	var temp=this.oldDataStr;
    	return $type(temp)=='string'?JSON.decode(temp):temp;
    }
    ,getOldDataStr:function(){
    	var temp=this.oldDataStr;
    	return $type(temp)=='string'?temp:JSON.encode(temp);
    }
    ,autoPositionNode:function(node){
    	if(this.options.nodeAutoPosition=="true"){
    		var nType=$type(node),tObj;
    		if(nType=="string"){
    			tObj=$H({"code":node});
    		}else if(nType=="object"){
    			tObj=$H(node);
    		}else if(nType=="element"){
    			tObj=$H({"code":node.get("code")});
    		}else{
    			tObj=node;
    		}
    		return this.findTreeNode(tObj);
    	}else{alert("此接口必须在树节点上定义nodeAutoPosition='true'之后才能使用.");}
    }
    ,getCurData:function(){
    	return (this.select.selBox.value=="")?null:((this.select&&this.select.selBox)?this.select.selBox.retrieve("treeData")[0]:{});
    }
    /**
     * 构造树
     * @function {public null} build
     * @param {options} 配置属性
     * @returns  null
     */
    ,build: function(options, parent) {
        $extend(this.options,options);
        if(this.options.isInitLoadData=="true"){
            this.container.set("name",this.options.treeContainerName);
            if (this.options.select == "true") {
                if(!this.select){
                    var select = new SwordTree.Select(this.options, this, parent);
                    this.select = select;
                    this.select.build(this.container);
                }else{
                    this.select.isBuild=false;
                    this.select.buildTree(this.container);
                }
                Sword.utils.setWidth(Sword.utils.valPx(this.options.x)||Sword.utils.valPx(this.options.inputWidth),((parent)?parent.userSize:null),this.select.divTable,this.select.selBox,true);//0511
            } else {
                this.builder = new SwordTree.Builder(this.container, this.options, this.$events);
                this.builder.build(this);
            }
        }
        //sword5
        if(!this.oel) this.oel = this.options.extendLayer ;
    	if(!this.oll) this.oll = this.options.lazyLayer ;
    	this.fireEvent("onFinish");
    	
    }
    /**sword5
     * 树是否有搜索框
     * @function {public htmlObj} createSearchInput
     * @returns  htmlObj or null
     */
    ,createSearchInput:function(){
    	var sdiv = new Element('div',{
            'class':'searchDiv'
           ,'id':this.options.treeContainerName+"_searchDiv"
        }).inject(this.container,'top');
    	var sl = new Element('div',{
            'class':'search_l'
             ,'id':this.options.treeContainerName+"_search_l"
        }).inject(sdiv);
    	var sc = new Element('div',{
            'class':'search_c'
            ,'id':this.options.treeContainerName+"_search_c"
        }).inject(sdiv);
    	var sr = new Element('div',{
            'class':'search_r'
            ,'id':this.options.treeContainerName+"_search_r"
        }).inject(sdiv);
    	
    	var siw = parseInt(this.options.searchInputWidth)-40;
    	var sidw = parseInt(this.options.searchInputWidth)+2;
    	 var sinput = new Element('input',{
             'type':'text'
         }).inject(sc);
    	 sinput.setStyle("width",siw+"px");
    	 sdiv.setStyle("width",sidw+"px");
    	 this.searchInput=sinput;
    	 this.initSearch(sinput);
    }

    /**
     * 获取当前选中的节点
     * @function {public htmlObj} getSelectedNode
     * @returns  htmlObj or null
     */
    ,getSelectedNode:function() {
        return this.builder.draw.getSelectedNode();
    }
    /**
     * 取消节点选中状态
     * @function {public htmlObj} unSelectNode
     */
    ,unSelectNode:function() {
        this.builder.draw.unSelectNode();
    }

    /**
     * 获取当前选中的所有节点
     * @function {public string} getAllChecked
     * @param {String} key     选取标识  如： caption
     * @param {String} sign        连接标识符，默认 [#]
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @returns  string
     */
    ,getAllChecked:function(key, sign, isLeaf, where) {
        return this.builder.draw.getAllChecked(key,sign,isLeaf, where);
    }
    ,getAllNode:function(key, isLeaf, sign,where) {
        return this.builder.draw.getAllNode(key, isLeaf, sign,where);
    }
    ,isLeaf:function(node){
    	return node.get('leaftype') == 1;
    }

     /**
     * 获取当前选中的所有节点数组
     * @function {public Array} getAllCheckedList
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @returns {Array}
     */
    ,getAllCheckedList:function(isLeaf,where) {
        return this.builder.draw.getAllCheckedList(isLeaf);
    }
    /**
     * 设置选中的节点
     * @function {public null} setCheckedList
     * @param array
     */
    ,setCheckedList:function(array) {
        this.builder.draw.setCheckedList(array);
    }
    /**
     * 添加树节点
     * @function {public null} addTreeNode
     * @param {Hash} hash
     */
    ,addTreeNode:function(hash) {
        this.builder.draw.addTreeNode(hash);
    }

    /**
     * 修改树节点
     * @function {public null} updateTreeNode
     * @param {Hash} hash
     */
    ,updateTreeNode:function(oldNode, newNode) {
        return this.builder.draw.updateTreeNode(oldNode, newNode);
    }
    /**
     * 删除树节点
     * @function {public null} deleteTreeNode
     * @param {Hash} hash
     */
    ,deleteTreeNode:function(hash) {
        this.builder.draw.deleteTreeNode(hash);
    }

    /**
     * 查询节点，并标记定位
     * @function {public htmlObj} findTreeNode
     * @param {Hash} hash
     * @returns  {htmlObj}   查到的节点
     */
    ,findTreeNode:function(hash) {
    	if(this.builder.draw==null)return null;
        return this.builder.draw.findTreeNode(hash);
    }
     /**
     * 过滤满足条件的树节点
     * @function {public htmlObj} filterTreeNodes
     * @param {array} nodes
     */
    ,filterTreeNodes:function(nodes) {
        this.builder.draw.filterTreeNodes(nodes);
    }
     /**
     * 恢复过滤
     * @function {public htmlObj} removeFilterClass
     */
    ,removeTreeFilterHiddenClass:function() {
        if(this.builder.draw)this.builder.draw.removeTreeFilterHiddenClass();
    }
     /**
      * 全路径(this.options.cascadeSign.id)查询节点，只为解决xml的延迟加载
      * @parameter hash,Hash类型的参数,例如：
      *  var query = new Hash();
      *  query.set('code','1,11,111,...');
      *  code为SwordTree默认的节点标识，如不同请另指定：cascadeSign='{"id":"id","pid":"fatherid"}'
      *  '1,11,111,...'为从树的根节点到要查询的节点的标志值,
      *  ps：不一定从树根开始,也可以只是要查询的节点，但一定要连续
      * @author lining
      */
    ,findNodeByPath:function(hash) {
        return this.builder.draw.findNodeByPath(hash);
    }


    /**
     * 是否包含节点
     * @function {public boolean} isContain
     * @param {Hash} hash
     * @returns  {boolean}   是否包含
     */
    ,isContain:function(hash) {
        var array = this.getTreeNode(hash);

        var res = false;
        if ($defined(array)) {
            res = true;
        }
        return res;
    }
    /**
     * 根据条件获取节点
     * @function {public htmlObj} getTreeNode
     * @param {Hash} hash
     * @returns  {htmlObj} 查到的节点
     */
    ,getTreeNode:function(hash) {
    	if(this.builder.draw==null)return null;
        return this.builder.draw.getTreeNode(hash);
    }
    ,getTreeNodes:function(hash) {
         return this.builder.draw.getTreeNodes(hash);
    }
    /**
     * 模糊查询树节点
     * @function {public htmlObj} getLikeTreeNode
     * @param {Hash} hash
     * @returns  {htmlObj} 查到的节点
     */
    ,getLikeTreeNode:function(hash) {
        return this.builder.draw.getLikeTreeNode(hash);
    }
    /**
     * 获取节点的父节点
     * @function {public htmlObj} getParent
     * @param {htmlObj} 节点
     * @returns  {htmlObj} 父节点
     */
    ,getParent:function(node){
        var pNode;
        if(node){
           pNode = node.getParent("div[leaftype='-1']").getParent("div[leaftype!='-1']");
        }
        return  pNode;
    }
    /**
     * 验证是否拥有子节点，使用普通与延迟状态
     * @function {public boolean} hasChildren
     * @param {Hash} hash
     * @returns  {boolean} boolean
     */
    ,hasChildren:function(hash){
        return this.builder.draw.hasChildren(hash);
    }
    /**
     * 闭合树所有节点
     * @function {public null} close
     */
//    ,close:function() {	sword5
//        this.builder.draw.close();
//    }
    ,collapse:function(){
    	 this.builder.draw.close();
    }
    /**
     * 设置验证控件
     * @function {public null} setValidate
     * @param {validate} validate
     */
    ,setValidate:function(validate) {
        this.validate = validate;
    }
    /**
     * 获取选中的radio项
     * @function {public htmlObj} getCheckedRadio
     * @returns  {htmlObj} 选中的项
     */
    ,getCheckedRadio:function(){
        return this.builder.draw.getCheckedRadio();
    }
    /**
     * 获取根节点
     * @function {public htmlObj} getRootNode
     * @returns  {rootNode} 根节点
     */
    ,getRootNode:function(){
        return this.builder.draw.getRootNode();
    }

    ,setSelectedNode:function(node){
        this.select.setSelectedNode(node);
    }

    ,setCaption:function(value){
        this.select.setValue(value);
    }
    ,getCaption:function(item){
        return this.select.getCaption(item);
    }
     ,setRealValue:function(value){
        this.select.setRealValue(value);
    }
    ,setDisplayTagWithBuild:function(value){
    	this.builder.draw.displayTag = value;
    }
    ,getRealValue:function(item){
    	return this.select.getValue(item);
    }
    ,getValue:function(item){//为了兼容form的getsubmitdata方法
    	return this.getRealValue(item);
    }
    
    /**
    * 配合swordform的清空操作，注：只是清空，不是还原
    **/
    ,reset:function(){
    	return this.select.setValue("");
    }
    ,clearCheckedStatus:function(){
    	if(this.builder.draw)this.builder.draw.clearCheckedStatus();
    }
    /**
     * 重载下拉树的数据
     */
    ,reloadSelectData:function(data){
    	 this.options.dataStr = data;
	     this.select.isBuild = false;
	     this.select.selBox.set('value', '');
	     this.select.selBox.set('realvalue', '');
    }
     /**
      * 重载树的数据
      */
    ,reloadTree:function(rdata,isRO){
    	 var dType=$type(rdata); 
    	 if($chk(rdata)){
    		 if(dType=="string"){
    			 rdata=JSON.decode(rdata);
    		 }
    		 var treeDObj=this.getOldDataObj();
    		 if(treeDObj){
	    		 if($chk(treeDObj.dataname)){
	    			 rdata.dataname=treeDObj.dataname;
	    		 }if($chk(treeDObj.dataName)){
	    			 rdata.dataName=treeDObj.dataName;
	    		 }
    		 }
    		 rdata=JSON.encode(rdata);
    		 this.options.dataStr=rdata;
    		 if(!$chk(isRO)){//如果没传值那么重置此参数
    			 this.oldDataStr=rdata;
    		 }
    		 this.treeDataHash=null;
    		 this.createTDHashAArray();
    		 this.build();
    	 }
    }
     /** setCheckedList接口满足不了需求，增加这个接口,不维护父节点和子节点的状态
      * @[array] array  节点数组
      */
    ,setNodeChecked:function(array){
    	this.builder.draw.setNodeChecked(array);
    }
    /** return (number) 0 : 选中、1 ：未选中、2 ：半选中
     * @(element) node  节点
     */
    ,getNodeCheckedStatus:function(node){
    	return this.builder.draw.getNodeCheckedStatus(node);
    }
    ,addTreeData:function(data){
    	this.builder.draw.dom.domainData = data;
    }
    ,extendNodeByIdPath:function(pathHash){
    	return this.builder.draw.extendNodeByIdPath(pathHash);
    },setCheckByCode:function(codes,checkState){
    	return this.builder.draw.setCheckByCode(codes,checkState);
    },setNodeCheckCascade:function(code,checkState){
    	return this.builder.draw.setNodeCheckCascade(code,checkState);
    },setNodeCheckNoCascade:function(code,checkState){
    	return this.builder.draw.setNodeCheckNoCascade(code,checkState);
    },oel:null,oll:null,qr:[],searchdata:null
    //sword5
    ,search:function (querystr){
    	if(this.options.echoExtend == "true"){
    		this.collapse();
		}
		if(this.options.checkbox =="true"){
			if(this.options.echoExtend == "true"){
				this.clearCheckedStatus();
			}else{
				this.clearCheckedStatus(true);
			}
		}
    	if(this.options.select=="true"){
    		this.select.setRealValue("");
    	}
    	if(querystr){
    		var oriquerystr = querystr;
    		if($type(oriquerystr)=='string') querystr=$H({'caption':oriquerystr});
	    	var obj  = this.realyFindData(querystr);
	    	if(!obj){
	    		if($type(oriquerystr)=='string'&&this.options.isSearchByCode=="true"){ 
	    			querystr=$H({'code':oriquerystr});
	    			obj  = this.realyFindData(querystr);
	    		}
	    	}
	    	var data=null,isToo=false;
	    	var codes=[];
	    	if(obj){
	    		this.options.lazyLayer=obj.level;
	    		data=obj.data;
	    		codes=obj.querArray;
	    		if(JSON.decode(data).data.length>1000){
	    			data=null;
	    			isToo=true;
	    		}
	    	}
    	}else{
    		data = "root";
    	}
    	if(!this.searchdata&&this.builder.draw){
    		this.searchdata = this.builder.draw.dom.domainData;
    	}else{
    		var oObj=this.getOldDataObj();
    		if(!$chk(oObj)){return;}
    		this.searchdata=oObj.data;
    	}
    	if($chk(this.select)){ 
			var st = this.select.treeDiv.getElement("span.tree-name");
			if(st&&st.hasClass("nothing")) st.destroy();
    	}
    	if(data=="root"){
    		this.options.extendLayer = this.oel;
        	this.options.lazyLayer = this.oll;
        	var treeObj = {
        			"data" : this.searchdata
        		};
        	this.reloadTree(JSON.encode(treeObj),true);
    	}else if(data==null){
    		this.options.extendLayer =this.oel;
        	this.options.lazyLayer=this.oll;
        	if(this.options.select=="true"){
        		if(isToo){
        			this.select.treeDiv.innerHTML="<span class='tree-name nothing' style='line-height:20px'>搜索结果太多,请继续录入</span>";
    			}
        		else{
        			this.select.treeDiv.innerHTML="<span class='tree-name nothing' style='line-height:20px'>没有要查找的节点</span>";
        			this.select.isBuild = false;
        		}
        	}
        	else{
        		var cr = this.container.getElement("div[leaftype='root']");
        		if(cr) {
        			if(isToo){
        				cr.innerHTML="<span class='tree-name nothing' style='line-height:20px'>搜索结果太多,请继续录入</span>";
        			}
        			else{	
            		cr.innerHTML="<span class='tree-name nothing' style='line-height:20px'>没有要查找的节点</span>";
        			}
            	}
        	}
    	}else{
    		if(this.options.echoExtend != "true"){
    			this.reloadTree(data,true);
        	}
    		if(this.options.checkbox =="true"&&$type(this.options.dataStr)=="string"){
        		this.options.dataStr=JSON.decode(this.options.dataStr);
        	}

        	var treeDataHs = null; 
        	var domNodeHs = null; 
        	var arrDataHs = null; 
    		if(this.options.checkbox =="true"){
        		var treeDataObj=this.getDataObj();
            	treeDataHs = new Hash(); 
            	domNodeHs = new Hash(); 
            	arrDataHs = new Hash(); 
            	treeDataObj.data.each(function(item){
            		treeDataHs.set(item.code,item);
            	});
            	this.builder.draw.dom.node.each(function(item){
         			domNodeHs.set(item.code,item);
            	});
            	this.treeArray.each(function(item){
            		arrDataHs.set(item.code,item);
            	});
    		}
    		codes=codes.reverse();
    		var i=0,l=codes.length,tObj=null;
    		
    		for(;i<l;i++){
				var node = this.container.getElements("div[leaftype!='-1'][code='" + codes[i]+ "']")[0];
    			if(this.options.echoExtend == "true"){
    				if(!$defined(node)){
    					var nodeData = this.treeDataHash.get(codes[i]);
		    	        if($chk(nodeData)){
		    	            var hash = new Hash();
		    	            var ccm = nodeData.ccm+","+nodeData.code;
		    	            hash.set(this.options.cascadeSign.id, ccm.split(','));
		    	            this.extendNodeByIdPath(hash);
	    					node = this.container.getElements("div[leaftype!='-1'][code='" + codes[i]+ "']")[0];
	    				}
    				}
    			}
    			 if ($defined(node)) {
    		            if ($defined(this.builder.draw.targetNode)) {
    		            	this.builder.draw.targetNode.removeClass(this.builder.draw.options.treeStyle.treeHighlighter);
    		            }
    		            node.setStyle("color","#C60A00");
    		            if(this.options.checkbox =="true"){
        		            this.builder.draw.checkedClick(node, "1", true, treeDataHs ,domNodeHs ,arrDataHs);
    		            }
    		            var pNode = node.getParent("div[leaftype='0']");
    		            for (var j = node.get("depth").toInt(); j >= 0; j--) {
    		                pNode = node.getParent("div[leaftype='0']");
    		                if ($defined(pNode)) {
    		                    var pGadGetSpan = this.builder.draw.getSpan(pNode).gadGetSpan;
    		                    if (pGadGetSpan.hasClass(this.builder.draw.options.treeStyle.treeGadGetPlus)) {
    		                    	this.builder.draw.extend(pNode);
    		                    }
    		                    node = pNode;
    		                } else {
    		                    break;
    		                }
    		            }
    		        }
    		}
    		if(this.options.checkbox =="true"&&$type(this.options.dataStr)!="string"){
    	    		this.options.dataStr=JSON.encode(this.options.dataStr);
    		}
    		if(l>0){
    			var node = this.container.getElements("div[leaftype!='-1'][code='" + codes[l-1]+ "']")[0];
    			 if ($defined(node)) {
 		             this.builder.draw.targetNode = this.builder.draw.getSpan(node).displaySpan;
 		             this.builder.draw.current = node;
 		             var myFx = new Fx.Scroll(this.container, {duration:10}).toElement(node);
    			 }
    		}
    	}
    }
    ,initSearch:function(el){
		var st="";
		el.addEvents({
			'keyup':function(event) {
		     	var target=event.target;
		     	var originValue = "";
		     	if($defined(target.get('originValue'))){
		     		originValue = target.get('originValue');
		     	}
		     	if ((this.options.searchLength<=el.value.length&&originValue != target.get('value'))||(el.value.length==0&&originValue != target.get('value'))){
			    	 clearTimeout(st);
			    	 var times = this.options.searchTime*1000;
			    	 var self = this;
			    	 st =  setTimeout(function(){
			    		self.keyDown(event);
				        self.search(target.value);
			    	  },times);
			    	 target.set("originValue",target.get('value')); 
		     	}
		    }.bind(this)
		});
    }
    ,keyDown:function(event) {
    	switch (event.code) {
        case 8:
        	this.options.extendLayer =this.oel;
        	this.options.lazyLayer=this.oll;
        	//event.target.value = '';
        	event.target.set("realvalue","");
            var dataO=this.oldDataStr;
     		this.reloadTree(dataO,true);
	        break;
        case 13:
        	if(event.target.value=="") this.unSelectNode();
        	var node = this.getSelectedNode();
            if ($defined(node)) {
               event.target.value=node.get("caption");
               event.target.set("realvalue",node.get("code"));
            }
            break;
    	}
    }
    ,findTreeData:function(nData,isLeaf){
    	if($type(nData)=="string"){
			nData=$H({'caption':nData});
    	}
    	var rObj=this.realyFindData(nData,isLeaf);
    	/*过滤节点*/
    	if($chk(rObj)){
    		var rArray=JSON.decode(rObj.data).data;
    		var rcodes=rObj.querArray;
    		return rArray.filter(function(item){
    			return rcodes.contains(item.code);
    		});;
    	}return []; 
    }
    /*,realyFindData:function(dHash,isLeaf){
    	if(this.builder&&this.builder.draw){
    		var sObj=this.builder.draw.dom.findNode(null,dHash,isLeaf);
    		return $chk(sObj)?sObj:null;
    	}else{return null;}
    }*/
    ,realyFindData:function(dHash,isLeaf){
    	var treeDataHash=this.treeDataHash,treeArray=this.treeArray,queryDatas=null;
    	if(!$chk(treeArray)){return;}
    	var self = this;
    	var func = function(value,itemVlue,key){
    		var isContain = false;
    		if(self.options.checkbox =="true"){
        		value.split(",").each(function(v){
        			if($chk(v)&&!isContain){
            			if(key=="caption"){
            				if(itemVlue.toLocaleUpperCase().indexOf(v.toLocaleUpperCase())!=-1||itemVlue.toLocaleLowerCase().indexOf(v.toLocaleLowerCase())!=-1)isContain = true;
            			}else if(key=="code"){
            				if(itemVlue.indexOf(value)!=-1){
            					isContain = true;
            				}
            			}else{
            				if(v==itemVlue)isContain = true;
            			}
        			}
        		});
    		}else{
    			if(key=="caption"){
    				if(itemVlue.toLocaleUpperCase().indexOf(value.toLocaleUpperCase())!=-1||itemVlue.toLocaleLowerCase().indexOf(value.toLocaleLowerCase())!=-1){isContain = true;}
    			}else if(key=="code"){
    				if(itemVlue.indexOf(value)!=-1){
    					isContain = true;
    				}
    			}else{
    				if(value==itemVlue)isContain = true;
    			}
    		}
    		return isContain;
    	};
    	queryDatas=treeArray.filter(function(item){
    		return dHash.every(function(value,key){
    			if(!$chk(item[key]))return false;
    			return func(value,item[key],key);
    		});
    	});
    	var level=0,qCodes=[],treeDataArray=[];
    	if(queryDatas.length==0){
    		return null;
    	}else{
    		queryDatas.each(function(qItem){
    			var nCode=qItem.code,qccm=qItem.ccm,qccmA=qccm.split(","),qccmL=qccmA.length+1;
    			qCodes.include(nCode);
    			treeDataArray.include(qItem);
    			qccmA.each(function (qcItemC){
    					var tData=treeDataHash.get(qcItemC);
    					if($chk(tData))treeDataArray.include(tData);
    			});
    			if(qccmL>level){level=qccmL;}
				if(qccmL>1){
    				var nCAs=this.getPosterityForSearch(qItem);
    				if(nCAs.length>0){treeDataArray.combine(nCAs);}
				}
    		}.bind(this));
    		if(isLeaf===true){
    			treeDataArray=treeDataArray.filter(function(item){
    				return !$chk(this.treePcodeDataHash.get(item.code));
    			}.bind(this));
    		}
    		var treeObj = {
    				"data" : JSON.encode({"data":treeDataArray}),
    				level:level,
    				"querArray":qCodes
    			};
    		return treeObj;
    	}
    }
    ,createTDHashAArray:function(){
    	if(!this.treeDataHash){
    		var treeArray=this.getTreeDataArray();
    		if($chk(treeArray)&&treeArray.length>0){
	    		this.treeDataHash=new Hash();
	    		this.treePcodeDataHash=new Hash();
	    		treeArray.each(function(item){
	    			this.treeDataHash.set(item.code,item);
	    			if($chk(item.pcode)){
	    				var pMap = this.treePcodeDataHash.get(item.pcode);
	    				if($chk(pMap)){
	    					pMap.push(item);
	    				}else{
	    					this.treePcodeDataHash.set(item.pcode,[]);
	    					this.treePcodeDataHash.get(item.pcode).push(item);
	    				}
	    			}
	        	}.bind(this));
	    		
	    		treeArray.each(function(item){
	    			if(!$chk(item.ccm)){
	        			this.setNodeDataCCM(item,"",item);
	        		}
	    			if(this.options.isCascadeCheckedClick == "true"){
	        			var items = this.treePcodeDataHash.get(item.code);
	        			if(!items){
	        					var time = 0;
	        					var pcode = item.pcode;
	        					while(time<10){
	        						var pItem = this.treeDataHash.get(pcode);
	        						if(pItem){
	        		    				if(item.ischecked == "true"){
	    	    					    	if(pItem.checkTimes){
	    	    					    		pItem.checkTimes++;
	    	    					    	}else{
	    	    					    		pItem.checkTimes = 1;
	    	    					    	}
	        		    				}
	        		    				if(pItem.Childs){
	        					    		pItem.Childs++;
	        					    	}else{
	        					    		pItem.Childs = 1;
	        					    	}
	        						}else{
	        							break;
	        							}
	        						pcode = pItem.pcode;
	        					}
	        			}
	    			}else{
	        			if(item.ischecked == "true"){
	        				var time = 0;
	        				var pcode = item.pcode;
	        				while(time<10){
	        					var pItem = this.treeDataHash.get(pcode);
	        					if(pItem){
	        		    			if(pItem.ischecked == "true"){
	        		    				pItem.state = 'checked';
	        		    			}else{
	        		    				pItem.state = "halfchecked";
	        		    			}
	        					}else{
	        						break;
	        						}
	        					pcode = pItem.pcode;
	        				}
	        			}
	    			}
	        	}.bind(this));
	    		this.treeArray=treeArray;
    		}else{
    			this.searchdata=[];
    		}
    	}
    }
    ,setNodeDataCCM:function(item,ccm,yItem){
    	var pNode=this.treeDataHash.get(item.pcode);
    	if($chk(pNode)){
    		if(pNode.ccm!==undefined&&pNode.ccm!=""){
    			if(ccm == ""){
    				yItem.ccm=pNode.ccm+","+pNode.code;
    			}else{
    				ccm=pNode.ccm+","+pNode.code+","+ccm;
    				yItem.ccm=ccm.substring(0,ccm.length-1);
    			}
    		}else{
    			ccm=pNode.code+","+ccm;
    	    	this.setNodeDataCCM(pNode,ccm,yItem);
    		}
	    }else{yItem.ccm=ccm.substring(0,ccm.length-1);}
    }
    ,getTreeDataArray:function(){
    	return this.getDataObj().data;
    }
    ,getPosterityForNodeData:function(node){
    	var nCccm=node.ccm;
    	return  this.treeArray.filter(function(c){
			return c.ccm.indexOf(nCccm)!=-1;
    	});
    }
    ,getPosterityForSearch:function(node){
    	var nCccm=node.ccm;
    	if(!$chk(nCccm)){
    		nCccm = node.code;
    	}else{
    		nCccm=nCccm+","+node.code;
    	}
    	return this.treeArray.filter(function(c){
			return c.ccm.indexOf(nCccm)!=-1;
    	});
    }
    ,getChildForNodeData:function(node){
    	return this.treePcodeDataHash.get(node.code);
    }
    /*取祖先*/
    ,getParentsData:function(code,level){
    	var node=this.treeDataHash.get(code);
    	var datas=[];
    	if(node&&node.ccm){
    		var b=node.ccm.split(",").reverse();
    		if($chk(level)){
    			var bl=b.length;
    			if(level>bl)level=bl;
    			b.each(function(tCode,index){
    				if(index<level){
    					datas.push(this.treeDataHash.get(tCode));
    				}
        		}.bind(this));
    		}else{
    			b.each(function(tCode){
        			datas.push(this.treeDataHash.get(tCode));
        		}.bind(this));
    		}
    	}
    	return datas;
    }
    /*取父节点*/
    ,getParentData:function(code){
    	return this.getParentsData(code,1)[0];
    }
    /*取兄弟*/
    ,getBrotherData:function(code){
    	return this.getChildData(this.getParentData(code).code).filter(function(item){return item.code!=code;});
    }
    /*取后代*/
    ,getAllChildData:function(code,level){
    	var nodeData=this.treeDataHash.get(code);
    	var datas=this.getPosterityForSearch(nodeData),nccm=nodeData.ccm?nodeData.ccm+","+nodeData.code:nodeData.code;
    	if($chk(level)){
    		//已自己为起始点(不含自己),找出最大的层级.
    		var mlevel=0;
    		datas.each(function(item){
    			var tccm=item.ccm;
    			var b=tccm.replace(new RegExp(nccm,"g"),"").split(",").length;
    			if(b>mlevel)mlevel=b;
    		});
    		if(level<mlevel){
    			return datas.filter(function(item){
    				var itccm=item.ccm;
        			var a=itccm.replace(new RegExp(nccm,"g"),"").split(",").length;
        			return a<mlevel;
        		});
    		}
    	}return datas;
    }
    /*取孩子*/
    ,getChildData:function(code){
    	return this.treePcodeDataHash.get(code)||[];
    }
});

/**
 * 生成器
 * @author Administrator
 */
SwordTree.Builder=new Class({
	
	$family: {name: 'SwordTree.Builder'}
	
	,Implements:[Options,Events]
    
	/**
	 * 树容器
	 */
	,container:$empty

 
	/**
	 * 绘画工厂
	 * @param {Object} container
	 * @param {Object} options
	 */
	,draw:null
	
	,initialize:function(container,options,events){
		this.container=container;
		this.setOptions(options);
        this.$events = $merge(this.$events,events);
	}
	
	/**
	 * 构建树
	 */
	,build:function(tree){
         
        var dom = this.domFactory({'treeContainerName':this.options.treeContainerName,
            'tid':this.options.tid,
            'ctrl':this.options.ctrl,
            'dataStr':this.options.dataStr,
            'type': this.options.dataType,
            'postData':this.options.postData
        },this.$events);
         
        var iterator = this.iterator(dom,this.options.dataType,this.options.cascadeSign,tree);
        if($defined(iterator)){
            this.draw = this.drawFactory(this.options, tree);
            this.draw.$events = $merge(this.draw.$events,this.$events);
            this.draw.build(this.container,iterator);
            if(this.options.isDrag=="true" ){
                 var drag = this.dragFactory(this.draw,this.options);
                 drag.$events = $merge(drag.$events,this.$events);
                 drag.startDrag();
            }
        }

	}
	/**
	 * 初始化数据加载工厂
	 */
	,domFactory:function(obj,event){
 
		var dom  = SwordTree.DomFactory.newInstance(obj,event);

		return dom;
	}
	
	/**
	 * 初始化数据迭代器
	 */
	,iterator:function(dom,dataType,cascadeSign,treeObj){

		var iterator = SwordTree.Iterator.newInstance(dom,dataType,cascadeSign,treeObj);
		return iterator;
	}
	/**
	 * 绘画工厂 
	 * @param {Object} dom
	 */
	,drawFactory:function(options, tree){
		var draw = new SwordTree.Draw(options, tree);
        return draw;
	}
    /**
     * 拖拽工厂
     * @param drawFacotory
     * @param options
     */
    ,dragFactory:function(drawFacotory,options){
         var drag = new SwordTree.Drag(drawFacotory,options);
         return drag;
    }
	
});


/**
 * 装载 json 或xml数据的工厂
 * @param {Object} url
 * @param {Object} urlStr
 * @param {Object} isCache
 */
SwordTree.DomFactory = new Class({

    $family: {name: 'SwordTree.DomFactory'}
    /**
     * 请求的路径
     */
    ,props:null
    ,events:null

    ,initialize:function(obj,events) {

        //        if ($chk(tid) && tid.trim() != "") {
        //            tid = tid.trim();
        //            tid += ((tid.indexOf("?") != -1) ? "&" : "?") + "r=" + (new Date()).valueOf();
        //        }
        this.props = obj;
		this.events = events;
    }

    ,createDom:$empty

});

SwordTree.DomFactory.newInstance = function(obj,events) {
    var instance = null ;
    if ($defined(obj.type) && ("json".test(obj.type.trim(), 'i') || "jsonAptitude".test(obj.type.trim(), 'i'))) {

        instance = new SwordTree.JSONDomFactory(obj,events);
    } else {
        instance = new SwordTree.XMLDomFactory(obj,events);
    }
    return instance.createDom();
};

/**
 * 装载xml数据工厂
 * @param {Object} url
 * @param {Object} dataStr
 * @param {Object} isCache
 */
SwordTree.XMLDomFactory = new Class({
    Extends : SwordTree.DomFactory

    ,createDom: function() {
        var oDom = null;
        if (Browser.Engine.trident) {
            oDom = new ActiveXObject("Msxml2.domdocument");
        }
        if ($defined(this.props)) {
            if ($chk(this.props.tid)) {
                if (!Browser.Engine.trident) {
                    oDom = document.implementation.createDocument("", "", null);
                }
                oDom.async = false;
                if($chk(document.getElementsByTagName("script")[0]['pageRealPath'])){
                     this.props.tid = document.getElementsByTagName("script")[0]['pageRealPath']+"\\"+this.props.tid;
                }
                oDom.load(this.props.tid);
            }
            else {
                if ($chk(this.props.dataStr)) {
                    if (!Browser.Engine.trident) {
                        var oDomP = new DOMParser();
                        oDom.async = false;
                        oDom = oDomP.parseFromString(this.props.dataStr, "text/xml");
                    }
                    else {
                        oDom.async = false;
                        oDom.loadXML(this.props.dataStr);
                    }
                }
            }
        }
        else {
            if (!Browser.Engine.trident)
                oDom = document.implementation.createDocument("", "", null);
            oDom.async = false;
        }
        return oDom.documentElement;
    }
});

/**
 * 装载json数据工厂
 * @param {Object} url
 * @param {Object} dataStr
 * @param {Object} isCache
 */
SwordTree.JSONDomFactory = new Class({
    Extends:SwordTree.DomFactory


    ,createDom:function() {
        var hash;

        if ($defined(this.props)) {
            if ($chk(this.props.tid) || $chk(this.props.ctrl)) {
                var data = new Hash();
                data.set("sword", "SwordTree");
                data.set("name", this.props.treeContainerName);
                var pd = this.props.postData;
                if ($type(pd) == "string") {
                	this.props.postData = pd = JSON.decode(pd);
                }
                $defined(pd)?data.set("data", [pd]):data.set('data',[]);
                var attr = new Hash();
                attr.set("sword", "attr");
                attr.set("name", "treeName");
                attr.set("value",this.props.treeContainerName);
                
                 
                var req = pageContainer.getReq({
                    'tid':this.props.tid
                    ,'ctrl':this.props.ctrl
                    ,'widgets':[data,attr]
                });
                pageContainer.postReq({'req':req,'async':false
                    ,'onSuccess':function(resData) {
                        var data = pageContainer.getResData(this.props.treeContainerName, resData);
                        //logger.debug("装载树的数据：" + JSON.encode(data), "SwordTree");
                        hash = data;
                        if(this.events["loadDataFinish"] && this.events["loadDataFinish"][0]){
                        	this.events["loadDataFinish"][0].run(resData);
                        }
                    }.bind(this)
                    , 'onError'  :function (res) {
                        hash = new Hash();
                    }.bind(this)
                });


            } else if ($chk(this.props.dataStr) && $type(this.props.dataStr) == "string") {

                hash = new Hash(JSON.decode(this.props.dataStr));

            } else if ($chk(this.props.dataStr) && $type(this.props.dataStr) == "object") {

                hash = this.props.dataStr;
            }
        } else {
            hash = new Hash();
        }
        return hash;
    }

});

/**
 * 构造、渲染 节点
 * @author Administrator
 */

SwordTree.Draw = new Class({
    $family: {name: 'SwordTree.Draw'}
    ,Implements:[Options,Events]
    ,space : Browser.Engine.trident ? '&shy;' : (Browser.Engine.webkit ? '&#8203' : '')
    //容器
    ,container:null
    /*
     * 祖容器名称
     */
    ,containerID:null
    /*
     * 当前选中的节点
     */
    ,targetNode:null
    /*
     * 当前选中节点的标记节点
     */
    ,current:null
    ,dom4nodeHash:new Hash()
    /*
     * 起始层次定义
     */
    ,depth:-1
    ,isInitLazy:false
    ,rootContainer:null
    ,options:{

        /**
         * 是否选中标识
         */
        checkSign:"ischecked"
        /**
         * 是否允许选中标识
         */
        ,noCheckSign:"nochecked"

        /*****移动高亮颜色****/
//        ,"highlightColor":"#cddee7"
        /**
         * 节点是否已加载标识
         */
        ,isLoadSign:"isLoadSign"

        /**
         * 树样式定义
         */
        ,treeStyle:{
            /*******定义 DIV ****/
            /******树容器****/
            //"treeContainerX":"tree-container-x"
           // ,"treeContainerY":"tree-container-y",
            /******树包装器****/
            "treeWrapper":"tree-wrapper"
            ,"treeTitle":"tree-title"
            /******树节点****/
            ,"treeNode":"tree-node"
            /******叶节点的最后一个子节点****/
            ,"treeNodeLast":"tree-node-last"
            /******包装下层节点****/
            ,"treeChildren":"tree-children"
            /******是否最后一个节点***/
            ,"treeNodeLast":"tree-node-last"

            /*******定义 SPAN ****/
            /******叶子节点容器 (根span) ****/
            ,"treeNodeWrapper":"tree-node-wrapper"
            /******叶子节点选中状态****/
            ,"treeNodeSelected":"tree-node-selected"

            /******叶子节点伸展图片,暂时不合并，方便更换****/
            ,"treeGadGet":"tree-gadjet"
            /******叶展开 (-)****/
            ,"treeGadGetMinus":"tree-gadjet-minus"
            /******无叶节点****/
            ,"treeGadGetNone":"tree-gadjet-none"
            /******叶收缩 (+)****/
            ,"treeGadGetPlus":"tree-gadjet-plus"
            /******加载中。。。样式图片***/
            ,"treeGadjetLoad":"tree-gadjet-load"
            /******节点文字前图片****/
            ,"treeIcon":"tree-icon"
            /***** 叶节点*******/
            ,"treeLeafIcon":"tree-leaf-icon"
            /******节点展开****/
            ,"treeOpenIcon":"tree-open-icon"
            /******节点关闭****/
            ,"treeCloseIcon":"tree-close-icon"
            /******节点文字样式****/
            ,"treeName":"tree-name"
            /******过滤树****/
            ,"treeFilterHidden":"tree-filter-hidden"
            ,"treeRadio":"tree-radio"
            /*******选择框样式 ********/
            ,"treeCheckbox":"tree-checkbox"
            ,"treeNodeChecked":"tree-node-checked"
            ,"treeNodeHalfChecked":"tree-node-half-checked"
            ,"treeNodeUnchecked":"tree-node-unchecked"
            ,"treeNodeNocheckedChecked":"tree-node-nochecked-checked"
            ,"treeNodeNocheckedNotChecked":"tree-node-nochecked-notchecked"

            /**** 选中*****/
            ,"treeHighlighter":"tree-highlighter"
        }


    }

    ,initialize:function(options, tree) {
        this.setOptions(options);
        this.swordTree = tree;
    }
    /**
     * 开始构建树
     * @param container
     * @param dom
     */
    ,build:function(container, dom) {
    	//container.empty();
    	var cr = container.getElement("div[leaftype='root']");
    	if(cr) {
    		cr.dispose();
    	}
        this.rootContainer = container;
        this.initElementEnum();

//        if ($chk(this.options.stylePath)) {	//sword5
//            this.loadCSS(container, this.options.stylePath);
//        }

        this.containerID = container.get("id") || container.get("name");
        var treeWrapper = this.nodeEnum("div");

        treeWrapper.setProperties({
            depth:this.depth + 1
            ,leaftype:"root"
        });

        treeWrapper.addClass('tree-root-node');

        container.grab(treeWrapper);
        this.initParam();
        treeWrapper.addClass(this.options.treeStyle.treeWrapper);
        var ctEle = treeWrapper;
//        if ($defined(this.options.title)) {
//            var titleEle = this.nodeEnum("div");
//            titleEle.innerHTML = this.options.title;
//            titleEle.addClass(this.options.treeStyle.treeTitle);
//            treeWrapper.grab(titleEle);
//        }
        if (this.options.startLayer == 0 || !dom.hasChildNodes()) {
            var childrenElement = this.nodeEnum("div");
            childrenElement.setProperty("leaftype", "-1");

            treeWrapper.grab(childrenElement);
            ctEle = childrenElement;
        }
        this.container = treeWrapper;

        this.dom = dom;
        SwordTree.Container.containerDraw.set(this.containerID, this);

        this.startDepth = this.depth + 1;
        this.createNode(ctEle, this.dom, this.depth);

        if ($defined(this.options.rootNode)) {
            this.appendRootNode(this.options.rootNode);
        }
        this.isInitLazy = true;
        this.initEvents();
        this.initCheckedTree();
        
        if ($chk(this.options.height)) {
        	var h = this.options.height;
        	if(!h.contains('px'))
        		h = h+"px";
            treeWrapper.setStyle("height", h);
            //treeWrapper.addClass(this.options.treeStyle.treeContainerY);
        }
//
//        if ($chk(this.options.height)) {
//            if(this.options.height != 'auto') {
//            treeWrapper.setStyle("height", this.options.height);
//            treeWrapper.addClass(this.options.treeStyle.treeContainerY);
//            } else {
//                treeWrapper.setStyle("height", container.getParent().getHeight() - 5);
//                treeWrapper.addClass(this.options.treeStyle.treeContainerY);
//            }
//        }else{
//	        	treeWrapper.setStyle("height", container.getParent().getHeight() - 5);
//                treeWrapper.addClass(this.options.treeStyle.treeContainerY);
//        	
//        }
        if ($chk(this.options.width)) {
            treeWrapper.setStyle("width", this.options.width);
            //treeWrapper.addClass(this.options.treeStyle.treeContainerX);
        }
        this.reset();
    }

    ,initParam:function() {
        this.options.startLayer = this.options.startLayer.toInt();
        this.options.extendLayer = this.options.extendLayer.toInt();
        this.options.lazyLayer = this.options.lazyLayer.toInt();
        this.options.startLayer = this.options.startLayer < 0 ? 0 : this.options.startLayer;
        this.options.lazyLayer = this.options.startLayer < this.options.lazyLayer ? this.options.lazyLayer: this.options.startLayer;
        this.options.lazyLayer = this.options.lazyLayer < this.options.extendLayer ? this.options.extendLayer: this.options.lazyLayer;
        this.options.lazyLayer = this.options.extendLayer < 0 ? 10000 : this.options.lazyLayer;
        this.options.extendLayer = this.options.extendLayer < 0 ? 10000 : this.options.extendLayer;
        this.options.extendLayer = this.options.extendLayer == 0 ? 1 : this.options.extendLayer;
        if (($chk(this.options.ltid) || $chk(this.options.lctrl)) && this.options.lazyLayer == 0) {
            this.options.lazyLayer = 1;
        }
        this.options.lazyLayer = this.options.lazyLayer < 0 ? 0 : this.options.lazyLayer;

        if ($defined(this.options.rootNode) && this.options.startLayer == 0 && this.options.dataType != "xml") {
            this.options.startLayer = 1;
        } 
    }

    ,reset:function() {
        this.startDepth = 0;
        this.options.startLayer = 0;
    }

    /**
     * @param {Object} item
     */
    ,initEvents:function() {

        this.container.addEvents({
            mousedown:this.toggleClick.bindWithEvent(this)
            ,mousemove:this.mousemove.bindWithEvent(this)
            ,mouseout:this.mouseout.bindWithEvent(this)
        });
    }

    ,initElementEnum:function() {
        SwordTree.Draw.Div = new Element("div");
        SwordTree.Draw.WrapperSpan = new Element("span", {type:"wrapperSpan"});
        SwordTree.Draw.GadGetSpan = new Element("span", {type:"gadGetSpan"});
        SwordTree.Draw.CheckSpan = new Element("span", {type:"checkSpan"});
        SwordTree.Draw.Radio = new Element("input", {type:"radio",id:"radio",name:"radio"});
        SwordTree.Draw.IconSpan = new Element("span", {type:"iconSpan"});
        SwordTree.Draw.DisplaySpan = new Element("span", {type:"displaySpan"});
    }
    ,nodeEnum:function(type) {
        switch (type) {
            case 'div':      return SwordTree.Draw.Div.clone(false);
            case 'wrapperSpan':     return SwordTree.Draw.WrapperSpan.clone(false);
            case 'gadGetSpan':  return SwordTree.Draw.GadGetSpan.clone(false);
            case 'checkSpan':  return SwordTree.Draw.CheckSpan.clone(false);
            case 'radio':  return SwordTree.Draw.Radio.clone(false);
            case 'iconSpan':   return SwordTree.Draw.IconSpan.clone(false);
            case 'displaySpan':  return SwordTree.Draw.DisplaySpan.clone(false);
        }
    }
    /**
     * 初始化 check
     */
    ,initCheckedTree:function() {
        if (this.options.checkbox=="true") {
            var checkedList = this.container.getElements("div[" + this.options.checkSign + "='true'],div[" + this.options.noCheckSign + "='true']");
            if(this.options.selectrule == "leaf"){
            	 this.setNodeChecked(checkedList);
            }else{
            	return ;
            	//20130717 gmq:下面的代码是在根据当前选中的节点修改下面的子节点.不能在初始化的时候调用,会使选中状态紊乱,应让dom树根据node的数据自己处理.
            	//checkedClick接口是提供给用户操作节点选中状态时调用的接口,不应在此处调用.
            	/*checkedList.each(function(item, index) {
                     var chkSpan = this.getSpan(item, "checkSpan");
                     var checkState = this.getCheckedState(chkSpan);
                     this.checkedClick(item, checkState, true);
                 }.bind(this));*/
                
            }
           
        }
    }


    /**
     * 是否懒树
     */
    ,isLazyTree:function() {
        return this.options.lazyLayer > 0||$chk(this.options.ltid) || $chk(this.options.lctrl);
    }
    ,displayTag:"caption"
    ,createWrapperSpan:function(dom) {
        var wrapperSpan = this.nodeEnum("wrapperSpan");
        wrapperSpan.addClass(this.options.treeStyle.treeNodeWrapper);

        var gadGetSpan = this.nodeEnum("gadGetSpan");
        gadGetSpan.addClass(this.options.treeStyle.treeGadGet);

        gadGetSpan.addEvent("click", function(event) {
            this.fireEvent("onExpand", event.target.getParent("div[leaftype!='-1']"));
        }.bind(this));

        gadGetSpan.innerHTML = this.space;

        var checkSpan;
        var radioSpan;
		if (this.options.checkbox=="true") {
	        	this.dom.setNodesCheckedState(dom);
        	    //根据dom节点的状态,修改节点的选中状态位
        	    if(dom.getAttribute("state")=="unchecked"&&$type(dom.node)!="array"){dom.node.ischecked="false";}
        	    if(dom.getAttribute("state")=="checked"&&$type(dom.node)!="array"){dom.node.ischecked="true";}
                checkSpan = this.nodeEnum("checkSpan");
                checkSpan.addClass(this.options.treeStyle.treeCheckbox);
                checkSpan.innerHTML = this.space;
                checkSpan.addClass(this.options.treeStyle.treeNodeUnchecked);

                var ischecked = ($defined(dom.getAttribute(this.options.checkSign)) && dom.getAttribute(this.options.checkSign) == "true");
                var isnochecked = ($defined(dom.getAttribute(this.options.noCheckSign)) && dom.getAttribute(this.options.noCheckSign) == "true");
                if (isnochecked) {
                    if (ischecked) {
                        checkSpan.removeClass(this.options.treeStyle.treeNodeChecked);
                        checkSpan.addClass(this.options.treeStyle.treeNodeNocheckedChecked);
                    } else {
                        checkSpan.removeClass(this.options.treeStyle.treeNodeUnchecked);
                        checkSpan.addClass(this.options.treeStyle.treeNodeNocheckedNotChecked);
                    }
                } else {
                    if (this.isLazyTree()) {
                        if (ischecked) {
                            checkSpan.removeClass(this.options.treeStyle.treeNodeUnchecked);
                            checkSpan.addClass(this.options.treeStyle.treeNodeChecked);
                        } else {
                        	checkSpan.removeClass(this.options.treeStyle.treeNodeChecked);
                        	checkSpan.removeClass(this.options.treeStyle.treeNodeUnchecked);
                    		checkSpan.removeClass(this.options.treeStyle.treeNodeHalfChecked);
                        	if(dom.getAttribute("state")=="halfchecked"){
                                checkSpan.addClass(this.options.treeStyle.treeNodeHalfChecked);
                        	}else if(dom.getAttribute("state")=="checked"){
                                checkSpan.addClass(this.options.treeStyle.treeNodeChecked);
                        	}else{
	                            checkSpan.addClass(this.options.treeStyle.treeNodeUnchecked);
                        	}
                        }
                    }

                }
//            case '2':
//                radioSpan = this.nodeEnum("radio");
//                radioSpan.addClass(this.options.treeStyle.treeRadio);
//                break;
        }

        var iconSpan = this.nodeEnum("iconSpan");
        iconSpan.addClass(this.options.treeStyle.treeIcon);
        iconSpan.innerHTML = this.space;

//        iconSpan.addEvents({ 	sword5
//            "click":function(event) {
//                this.fireEvent("onIconClick", event.target.getParent("div[leaftype!='-1']"));
//            }.bind(this)
//            ,"dblclick":function(event) {
//                this.fireEvent("onIconDblClick", event.target.getParent("div[leaftype!='-1']"));
//            }.bind(this)
//        });

        var displaySpan = this.nodeEnum("displaySpan");
        displaySpan.addClass(this.options.treeStyle.treeName);

        displaySpan.addEvents({
            "click":function(event) {
                this.fireEvent("onNodeClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
            ,"dblclick":function(event) {
                this.fireEvent("onDblNodeClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
//            ,"contextmenu":function(event) {
//                this.fireEvent("onNodeContextMenu", [event.target.getParent("div[leaftype!='-1']"),event]);
//                //return false;
//            }.bind(this)
            ,"mousedown":function(event){
            	if ( event.event.button == 2 ){
            		event.preventDefault();
            		this.fireEvent("onRightClick", [event.target.getParent("div[leaftype!='-1']"),event]);
            		document.oncontextmenu = function() {return false;};  //阻止右键默认响应
            	}
            }.bind(this)
        });
        $(document.body).addEvent('mousedown',function(){//修改树节点点击右键的时候屏蔽的浏览器右键的问题
        	document.oncontextmenu = function() {return true;}; 
        });
        //构造节点文本
        if ($defined(dom.getAttribute(this.displayTag))) {
            displaySpan.innerHTML = this.dealCaption(dom);//dom.getAttribute(this.displayTag);
        }
        wrapperSpan.adopt([gadGetSpan, checkSpan,radioSpan,iconSpan, displaySpan]);
        return {"wrapperSpan":wrapperSpan,"gadGetSpan":gadGetSpan,"iconSpan":iconSpan};
    }

    /**
     * 创建节点
     * @param container
     * @param dom
     * @param depth
     * @param isLoad   根叶节点是否加载
     */
    ,createNode:function(container, dom, depth, isLoad) {
    	var isDrawSpan = true; //节点是否已经装饰 伸缩 、展开图片等
        if ($defined(isLoad) && !isLoad) {
            depth--,depth--;
        }
        depth++;
        var element = this.nodeEnum("div");
        element.setProperties({
            "class":this.options.treeStyle.treeNode
            ,"leaftype":"0"
        });
        var isLast=dom.isLast();
        if (isLast) {
            element.addClass(this.options.treeStyle.treeNodeLast);
        }
        var attributes = dom.getAttributes();
        var hashData = new Hash();
        for (var k = 0; k < attributes.length; k++) {
            element.setProperty(attributes[k].nodeName, attributes[k].nodeValue);
            hashData.set(attributes[k].nodeName, attributes[k].nodeValue);
        }
        if(element.get("state")=="checked"){//如果是计算出来的选中状态,就在节点元素div上设置选中标示
        	element.set("ischecked",true);
        }
        if ($defined(dom.getAttribute(this.displayTag))) {
            element.setProperty("title", this.dealCaption(dom));//dom.getAttribute(this.displayTag));
        }
        var noHasChild=true;
        if(hashData.code){
        	if($chk(this.swordTree.treePcodeDataHash.get(hashData.code))){
        		noHasChild = false;
        	}
        }
        element.store("data", hashData);
        var array = this.createWrapperSpan(dom);
        var wrapperSpan = array["wrapperSpan"];
        var gadGetSpan = array["gadGetSpan"];
        var iconSpan = array["iconSpan"];

        element.grab(wrapperSpan);
        element.setProperty("depth", (depth - this.options.startLayer + 1));
        var hasChild = true;
        if (this.isLazyTree()) {
            if (this.isInitLazy) {
                this.options.lazyLayer = this.options.lazyLoadLayer;
            }
            hasChild = ((depth - this.startDepth) < this.options.lazyLayer) && dom.hasChildNodes();
            if ((depth - this.startDepth) == this.options.lazyLayer) {
            	if($chk(dom.node.leaftype) && dom.node.leaftype == '1'){
                    this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
                    isDrawSpan = false;
            	}else{
	                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
	                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
	                isDrawSpan = false;
            	}
            }
        } else {
            hasChild = dom.hasChildNodes();
            element.setProperty(this.options.isLoadSign, true);
        }
        var childrenElement = this.nodeEnum("div");
        //xml,初始加载 ,只加载到指定的层
        if ((this.options.dataType == 'xml' || this.options.pageDataLazy == 'true') && this.options.extendLayer <= depth) {
            this.dom4nodeHash.set(element.get(this.options.cascadeSign.id), dom);
            //有子节点
            if (hasChild) {
                element.setProperty(this.options.isLoadSign, true);
                element.setProperty("leaftype", "0");

                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                isDrawSpan = false;

                gadGetSpan.addEvents({
                    "click":function() {
                        if (!$type(element.getElement(".tree-children"))) {

                            childrenElement.setProperty("leaftype", "-1");

                            var nodes = dom.getChildNodes();
                            for (var i = 0; i < nodes.length; i++) {
                                childrenElement.grab(this.createNode(childrenElement, nodes[i], depth));
                            }

                            //父节点选中时，懒加载的子节点也选中
                            if(this.options.checkbox =="true" && this.options.isCascadeCheckedClick == "true" && this.getSpan(element,"checkSpan").hasClass(this.options.treeStyle.treeNodeChecked)) {
                                var childrenNodes = childrenElement.getElements('div.tree-node');
                                if(childrenNodes) {
                                	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
                                	childrenNodes.set(this.options.checkSign,'true');
                                }
                            }
                            if ((depth - this.options.startLayer) >= ( this.options.extendLayer - 1)) {
                                //展开
                                childrenElement.setStyle("display", "block");
                                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);
                            } else {
                                //收缩
                                childrenElement.setStyle("display", "none");
                                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                            }
                            if (depth >= this.options.startLayer) {
                                //子节点
                                childrenElement.addClass(this.options.treeStyle.treeChildren);
                                element.grab(childrenElement);
                            }
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                            childrenElement.setStyle("display", "none");
                        }
                        this.extend(element);
                    }.bind(this)
                });
                iconSpan.addEvents({
                    "click":function() {
                        if (!$type(element.getElement(".tree-children"))) {

                            element.setProperty(this.options.isLoadSign, true);
                            childrenElement.setProperty("leaftype", "-1");

                            var nodes = dom.getChildNodes();
                            for (var i = 0; i < nodes.length; i++) {
                                childrenElement.grab(this.createNode(childrenElement, nodes[i], depth));
                            }
                            //父节点选中时，懒加载的子节点也选中
                            if(this.options.checkbox =="true" && this.options.isCascadeCheckedClick == "true" && this.getSpan(element,"checkSpan").hasClass(this.options.treeStyle.treeNodeChecked)) {
                                var childrenNodes = childrenElement.getElements('div.tree-node');
                                if(childrenNodes) {
                                	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
                                	childrenNodes.set(this.options.checkSign,'true');
                                }
                            }

                            if ((depth - this.options.startLayer) >= ( this.options.extendLayer - 1)) {
                                //展开
                                childrenElement.setStyle("display", "block");
                                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);
                            } else {
                                //收缩
                                childrenElement.setStyle("display", "none");
                                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                            }
                            if (depth >= this.options.startLayer) {
                                //子节点
                                childrenElement.addClass(this.options.treeStyle.treeChildren);

                                element.grab(childrenElement);
                            }
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                            childrenElement.setStyle("display", "none");
                        }
                        this.extend(element);
                    }.bind(this)
                });
            }
            else {
                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
            }
            //不再往下加载
            hasChild = false;
        }
        if (hasChild) {
            element.setProperty(this.options.isLoadSign, true);
            element.setProperty("leaftype", "0");
            childrenElement.setProperty("leaftype", "-1");

            if ((depth - this.options.startLayer) >= ( this.options.extendLayer - 1)) {
                //收缩
                childrenElement.setStyle("display", "none");
                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
            } else { //展开
                childrenElement.setStyle("display", "block");
                this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);

            }
            if (depth >= this.options.startLayer) {
                //子节点
                childrenElement.addClass(this.options.treeStyle.treeChildren);
                element.grab(childrenElement);
            }
            //yt修改guoyan整合
            var nodes = dom.getChildNodes(this.options.rootPcode);
            var tempfra = document.createDocumentFragment();
            for (var i = 0; i < nodes.length; i++) {
            	tempfra.appendChild(this.createNode(childrenElement, nodes[i], depth));               
            } 
            childrenElement.appendChild(tempfra);
        } else if (isDrawSpan) {
            element.setProperty(this.options.isLoadSign, true);
            element.setProperty("leaftype", "1");
            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
        }
        
        
        if((this.options.ltid==""&&this.options.lctrl=="")&&noHasChild){
        	element.setProperty(this.options.isLoadSign, true);
            element.setProperty("leaftype", "1");
            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
        }
        
        
        if (depth > this.options.startLayer || this.options.startLayer == 0) {
            if (this.isLazyTree() && $defined(isLoad) && depth == this.startDepth) {
                container.adopt(childrenElement.getChildren("div"));
                
            } else {
                container.grab(element);
                this.fireEvent("onCreateNode",[element,iconSpan]);
                if(isLast)this.fireEvent("onAfterCreateChildNodes");
            }
        } else if (depth == this.options.startLayer) {
            this.container.grab(container);
            this.fireEvent("onCreateNode",[element,iconSpan]);
        } else{
        	if(childrenElement){
        		var eles = childrenElement.getChildren();
        		if(eles && eles.length>0){
                    eles.each(function(els,index){
                        this.fireEvent("onCreateNode", els);
                    });
        			if(isLast)this.fireEvent("onAfterCreateChildNodes");
        		}
        	}
        }
        return element;
    }

    /**
     * 展开收缩
     * @param {Object} item
     */
    ,extend:function(item) {
    	if (this.isLazyExtend(item) && item.get('leaftype')=='0') {
    		this.lazyExtend(item);
        } else {
            var childrenElement = item.getFirst("span[type='wrapperSpan']").getNext("div[leaftype='-1']");
            if ($defined(childrenElement)) {
                var children = item.getFirst("span[type='wrapperSpan']");
                var iconSpan = children.getFirst("span[type='iconSpan']");
                var gadGetSpan = children.getFirst("span[type='gadGetSpan']");

                if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                    if (this.options.autoCollapse == "true") {
                        if ($defined(this.shrinkNode)) {
                            var p = this.getNode(gadGetSpan).getParent("div[leaftype!='-1']");
                            if (p && p != this.shrinkNode) {
                                this.close();
                                this.findTreeNode(this.getNode(gadGetSpan));
                            }
                        }
                        this.shrinkNode = this.getNode(gadGetSpan);
                    }
                    this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                    this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);
                } else {
                    this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                    this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                }
                if (!gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                	childrenElement.setStyle("display", "block");
                } else {
                	childrenElement.setStyle("display", "none");
                }
                //下面的这两句是为了触发ie8元素的hasLayout
                if($chk( this.options.pNode)){
	                this.options.pNode.setStyle("zoom", 0);
	            	this.options.pNode.setStyle("zoom", 1);
                }
                if ($defined($("div[id='" + SwordTree.Container.id + "']"))) {
                    new Fx.Scroll($("div[id='" + SwordTree.Container.id + "']").getFirst("div"), {duration:50}).toElement(item);
                }
            }
        }
    }
    /**
     * 检验是否已经装载
     * @param target
     */
    ,isLazyExtend:function(node) {
        var isLoad = node.get(this.options.isLoadSign);
        return !isLoad && this.isLazyTree();
    }

    ,setSpanClass:function(item, spanType, spanClass) {
        if ($defined(item)) {
            var span;
            if (item.get("tag") == "div") {
                span = this.getSpan(item, spanType);
            } else {
                span = item;
            }
            if ($defined(span)) {
                var type = span.getProperty("type");
                if (type == "gadGetSpan") {
                    span.setProperty("class", this.options.treeStyle.treeGadGet);
                } else if (type == "iconSpan") {
                    span.setProperty("class", this.options.treeStyle.treeIcon);
                }
                span.addClass(spanClass);
            }
        }

    }

    /**
     * 延迟装载
     * @param item
     */
    ,lazyExtend:function(item, callBack, params, isDelay) {
        this.setSpanClass(item, "iconSpan", this.options.treeStyle.treeGadjetLoad);
        var node = item.retrieve("data");
        var iterator = new SwordTree.JSONAptitudeIterator(node, item.get("depth").toInt(),this.swordTree);
        var data = this.getData(node);
        iterator.domainData.extend(data);
        item.setProperty(this.options.isLoadSign, true);
        if(data.length==0)item.setProperty("leaftype",'1');
        this.startDepth = item.get("depth").toInt() - 1;
        var func = function(iterator, tp, item, callBack, params) {
        	this.addTreeNode(iterator, tp, item);
            if (callBack) {
                return callBack(params);
            }
        }.bind(this);
//        if (!$defined(isDelay)) {
//            func.delay(this.options.lazyTime, this, [iterator,false,item,callBack,params]);
//        } else {
            return func(iterator, false, item, callBack, params);
//        }

    }
    ,hasChildData:function(nodeData){
    	var j =0;
    	var resData = new Array();
    	var cp = this.options.cascadeSign.pid;
    	var ci = this.options.cascadeSign.id;
    	for(var i=0;i<this.dom.domainData.length;i++){
    		var nd = this.dom.domainData[i];
    		if((nd[cp]||nd[cp.toUpperCase()]) == (nodeData.get(ci)||nodeData.get(ci.toUpperCase()))){
    			 resData[j++] = nd;
    		}
    	}
    	return resData;
    }
    ,childrenIdArray:null //下级节点的id标志值数组, 全局变量，仅在extendNodeByIdPath中使用
    ,extendNodeByIdPath:function(hash){
    	if(hash){
    		this.childrenIdArray = hash.get(this.options.cascadeSign.id);
        }
    	var ph = new Hash();
    	if(this.childrenIdArray && this.childrenIdArray.length>0){
	    	var code = this.childrenIdArray[0];
	    	ph.set(this.options.cascadeSign.id,code);
	    	var node = this.getTreeNode(ph);
	    	if(node){
	    		this.childrenIdArray.erase(code);
	    		if (this.isLazyExtend(node) && node.get('leaftype')=='0') {
	    	        this.lazyExtend(node);
	    	    }else{
	    	    	this.extendNodeByIdPath();
	    	    }
	    	}
    	}
    	if(this.childrenIdArray != null && this.childrenIdArray.length == 0){
    		this.childrenIdArray = null;
    		this.fireEvent('onAfterExtendByIdPath');
    		this.extendByIdPathAfter();
    	}
    },extendByIdPathAfter: function(){
    	
    },setCheckByCode:function(codes,checkStats){
    	if($type(this.swordTree.options.dataStr)=="string"){
    		this.swordTree.options.dataStr=JSON.decode(this.swordTree.options.dataStr);
    	}
    	if(!$chk(codes))return;
    	if($type(codes)!="array")codes = codes.split(",");
    	if(checkStats){
    		checkStats = "1";
    	}else{
    		checkStats = "0";
    	}

    	var treeDataObj=this.swordTree.getDataObj();
    	var treeDataHs = new Hash(); 
    	var domNodeHs = new Hash(); 
    	var arrDataHs = new Hash(); 
    	treeDataObj.data.each(function(item){
    		treeDataHs.set(item.code,item);
    	});
 		this.dom.node.each(function(item){
 			domNodeHs.set(item.code,item);
    	});
    	this.swordTree.treeArray.each(function(item){
    		arrDataHs.set(item.code,item);
    	});
    	
        codes.each(function(item){
        	if(this.swordTree.options.selectrule=="leaf"&&$chk(this.swordTree.treePcodeDataHash.get(item)))return;
        	var nodeData = this.swordTree.treeDataHash.get(item);
        	if(this.swordTree.options.isCascadeCheckedClick == "true"){
            	var isContains = false;
            	nodeData.ccm.split(",").each(function(itemCode){
                	var PnodeData = this.swordTree.treeDataHash.get(itemCode);
                	if($chk(PnodeData)){
                		if(codes.contains(PnodeData.code)){
                			isContains = true;
                		}
                	}
            	}.bind(this));
            	if(isContains)return;
        	}
            if($chk(nodeData)){
                var node = this.swordTree.container.getElements("div[leaftype!='-1'][code='" + item+ "']")[0];
                if($defined(node)){
	                this.checkedClick(node, checkStats, true, treeDataHs ,domNodeHs ,arrDataHs);
	            }else{
	                this.checkNodeDataClick(nodeData, checkStats, true, treeDataHs ,domNodeHs ,arrDataHs);
	            }
            }
       }.bind(this));
    	if($type(this.swordTree.options.dataStr)!="string"){
    		this.swordTree.options.dataStr=JSON.encode(this.swordTree.options.dataStr);
    	}
    },setNodeCheckCascade:function(code,checkStats){
    	var oldCascade  = this.options.isCascadeCheckedClick;
    	this.options.isCascadeCheckedClick = "true";
    	this.setCheckByCode(code,checkStats);
    	this.options.isCascadeCheckedClick = oldCascade;
    },setNodeCheckNoCascade:function(code,checkStats){
    		var hs = new Hash();
    		hs.set(this.options.cascadeSign.id, code);
    	 	var node = this.findTreeNode(hs);
            var children = node.getElements("span[type='checkSpan']");
            children.each(function(nodeItem, index) {
	            nodeItem.removeClass(this.options.treeStyle.treeNodeHalfChecked);
	            if(checkStats){
	            	nodeItem.removeClass(this.options.treeStyle.treeNodeUnchecked);
		            nodeItem.addClass(this.options.treeStyle.treeNodeChecked);
	            }else{
	            	nodeItem.removeClass(this.options.treeStyle.treeNodeChecked);
		            nodeItem.addClass(this.options.treeStyle.treeNodeUnchecked);
	            }
            }.bind(this));
            var nodes = node.getElements("div[leaftype!='-1']").include(node);
            nodes.each(function(item, index) {
            	if(checkStats){
                	item.setProperty('ischecked', 'true');
            	}else{
                	item.setProperty('ischecked', 'false');
            	}
            }.bind(this));
            var nCccm=node.get("ccm");
        	if(!$chk(nCccm)){
        		nCccm = node.get("code");
        	}else{
        		nCccm=nCccm+","+node.get("code");
        	}
        	var treeDataObj=this.swordTree.getDataObj();
        	var treeDataHs = new Hash(); 
        	var domNodeHs = new Hash(); 
        	treeDataObj.data.each(function(item){
        		treeDataHs.set(item.code,item);
        	});
     		this.dom.node.each(function(item){
     			domNodeHs.set(item.code,item);
        	});
        	this.swordTree.treeArray.each(function(item){
    			if(item.ccm.contains(nCccm, ',')){
    				if(checkStats){
    					item.ischecked="true";item.state="checked";
        				this.setNodeDataCheckState(item.code,"ischecked",false,treeDataHs,domNodeHs) ;
    				}else{
    					delete item.ischecked;delete item.state;
    					this.setNodeDataCheckState(item.code,"unchecked",false,treeDataHs,domNodeHs) ;
    				}
    			}
        	}.bind(this));
        	this.swordTree.options.dataStr=JSON.encode(treeDataObj);
    },checkNodeDataClick:function(nodeData, state, sp, treeDataHs ,domNodeHs ,arrDataHs){
    	if ($defined(nodeData)) {
	    	if (this.options.isCascadeCheckedClick == "false"&&sp) {
	            sp = false;
	            if (state == 0) { //选中 --》 不选中
	                 var hasChecked = this.hasChildDataChecked(nodeData);
	                 if(hasChecked){
	                     this.setNodeDataCheckState(nodeData.code,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	                 }else{
	                     this.setNodeDataCheckState(nodeData.code,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	                 }
	            } else if (state == 1) {//不选中 --》选中
	                this.setNodeDataCheckState(nodeData.code,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	            }
	        }else if(this.options.isCascadeCheckedClick == "true"&&sp){
	        	if (state == 0) { //选中 --》 不选中
	                this.setNodeDataCheckState(nodeData.code,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	            } else if (state == 1) {//不选中 --》选中
	                this.setNodeDataCheckState(nodeData.code,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	            }
	        }  
                var fNodeData = this.swordTree.treeDataHash.get(nodeData.pcode);
                if (sp) {
                	if(!$chk(treeDataHs)){
                    	var treeDataObj=this.swordTree.getDataObj();
                    	treeDataHs = new Hash(); 
                    	treeDataObj.data.each(function(item){
                    		treeDataHs.set(item.code,item);
                    	});
                	}
                	if(!$chk(domNodeHs)){
                    	domNodeHs = new Hash(); 
                 		this.dom.node.each(function(item){
                 			domNodeHs.set(item.code,item);
                    	});
                	}
                    var nCccm=nodeData.ccm;
                	if(!$chk(nCccm)){
                		nCccm = nodeData.code;
                	}else{
                		nCccm=nCccm+","+nodeData.code;
                	}
                	this.swordTree.treeArray.each(function(item){
            			if(item.ccm.contains(nCccm, ',')){
            				if(state == "0"){
            					delete item.ischecked;delete item.state;
            					this.setNodeDataCheckState(item.code,"unchecked",false,treeDataHs,domNodeHs) ;
            				}else{
            					item.ischecked="true";item.state="checked";
                				this.setNodeDataCheckState(item.code,"ischecked",false,treeDataHs,domNodeHs) ;
            				}
            			}
                	}.bind(this));
                	if($type(this.swordTree.options.dataStr)=="string"){
                    	this.swordTree.options.dataStr=JSON.encode(treeDataObj);
                	}
                }
                if ($defined(fNodeData)) {
                	var node = this.container.getElements("div[leaftype!='-1'][code='" + fNodeData.code+ "']")[0];
                	if($defined(node)){
                		this.checkedPnodeClick(node, state, treeDataHs ,domNodeHs ,arrDataHs);
                	}else{
        	            if (state == 0) { //选中 --》 不选中
        	        			var hasChecked = this.hasChildDataChecked(fNodeData);
        	        			if(hasChecked){
        	        				if(this.options.isCascadeCheckedClick == "true"){
        	        					this.setNodeDataCheckState(fNodeData.code,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	        				}else{
        	        					if(fNodeData.ischecked !='true'){
        	        						this.setNodeDataCheckState(fNodeData.code,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	        					}
        	        				}
        	        			}else{
        	        				if(this.options.isCascadeCheckedClick == "true"){
        	        					this.setNodeDataCheckState(fNodeData.code,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	        				}else{
        	        					if(fNodeData.ischecked !='true'){
        	        						this.setNodeDataCheckState(fNodeData.code,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	        					}
        	        				}
        	        			}
        	            } else if (state == 1) {//不选中 --》选中
        	            	if(this.options.isCascadeCheckedClick == "true"){
        	            		var isAll = this.isAllChildDataChecked(fNodeData);
        	            		if(isAll){
    	        					this.setNodeDataCheckState(fNodeData.code,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	            		}else{
    	        					this.setNodeDataCheckState(fNodeData.code,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        	            		}
	        				}else{
	        					if(fNodeData.ischecked !='true'){
	        						this.setNodeDataCheckState(fNodeData.code,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
	        					}
	        				}
        	            }
        	            this.checkNodeDataClick(fNodeData, state,false, treeDataHs ,domNodeHs ,arrDataHs);
        	        }
                }
            }
    },hasChildDataChecked:function(nodeData) {
    	if(!$chk(nodeData)) return false;
    	 var hasChecked = false;
		 var nCccm=nodeData.ccm;
        	if(!$chk(nCccm)){
        		nCccm = nodeData.code;
        	}else{
        		nCccm=nCccm+","+nodeData.code;
        	}
		this.swordTree.treeArray.each(function(item){
			if(!hasChecked&&item.ccm.indexOf(nCccm)!=-1){
         		if(item.ischecked == "true"){
         			hasChecked = true;
         		}
              }
    	}.bind(this));
		return hasChecked;
    },isAllChildDataChecked:function(nodeData) {
	   	 var isAll = true;
		 var nCccm=nodeData.ccm;
	    	if(!$chk(nCccm)){
	    		nCccm = nodeData.code;
	    	}else{
	    		nCccm=nCccm+","+nodeData.code;
	    	}
	     this.swordTree.treeArray.each(function(item){
			if(isAll&&item.ccm.indexOf(nCccm)!=-1){
	     		if(item.ischecked != "true"){
	     			isAll = false;
	     		}
	          }
		}.bind(this));
		return isAll;
    },getData:function(node) {

        var resData = this.hasChildData(node);

        if (resData.length==0 && ($chk(this.options.ltid) || $chk(this.options.lctrl))) {
        	this.fireEvent("onLtidBefore", node);
            var data = new Hash();
            data.set("sword", "SwordTree");
            data.set("name", this.options.treeContainerName);
            data.set("loaddata", "widget");
            data.set("data", [node]);

            var attr = new Hash();
            attr.set("sword", "attr");
            attr.set("name", "treeName");
            attr.set("value", this.options.treeContainerName);

            var req = pageContainer.getReq({
                'tid':this.options.ltid
                ,'ctrl':this.options.lctrl
                ,'widgets':[data,attr]
            });

            pageContainer.postReq({'req':req,'async':false,'loaddata':'widget'
                ,'onSuccess':function(res) { 
                    var data = pageContainer.getResData(this.options.dataName, res,'dataName');
                    resData = $defined(data)?data.data:[];
                }.bind(this)
                , 'onError'  :function (res) {
                }.bind(this)
                ,'onFinish':function(res){
                    this.fireEvent("onAfterLoadData",[node,res]);
                }.bind(this)
            });
        }else{
        	this.fireEvent("onAfterLoadData",[node,resData]);
        }
        return resData;
    }


     ,dealCheck:function(target){
                var node = this.getNode(target);
                var treeObj=this.swordTree;
                if(treeObj.options.selectrule=="leaf"&&!treeObj.isLeaf(node))return;
                var func = this.options.onCheckedBefore;
                var changeable = true;
                if ($defined(func)) {
                	var returnValue = this.getFunc(func)[0](node);
                	if(returnValue == false)
                		changeable = false;
                }
                var isnochecked = node.get(this.options.noCheckSign) && node.get(this.options.noCheckSign) == "true";
                if (changeable && !isnochecked) {
                    var checkState = this.getCheckedState(target);
                    this.checkedClick(node, checkState, true);
                }
                if(node.get("isChecked")=="true"){
                	this.current = node;
                }else{
                	this.current = null;
                }
                this.fireEvent("onCheckedAfter", node);
    
    }


    /**
     * 点击触发事件
     * @param {Object} event
     */
    ,toggleClick:function(event) {
        var target = $type(event)=='element'?event:event.target;
        if (target.tagName.test("span", "i")) {
            var node = this.getNode(target);
            var type = target.get("type");
            if (type == "gadGetSpan" || type == "iconSpan") {
            	if(this.options.dataType!='xml')
            		this.extend(node);

            } else if (type == "checkSpan") {
                this.dealCheck(target);
            } else if (type == "displaySpan") {
                if (this.options.autoExtendCaption == "true") {
                	if(this.options.dataType!='xml')
                		this.extend(node);
                }
                this.selectNode(event);
                if(this.options.checkbox =="true"&&this.options.isCaptionChecked=="true")this.dealCheck(this.getSpan(node, 'checkSpan'));
            }
        }else if(target.hasClass('tree-radio')) {
            
               var node = this.getNode(target);
               
                var func = this.options.onCheckedAfter;
               
                if ($defined(func)) {
                	this.getFunc(func)[0](node);
					  
                	target.set('checked',true);
                }
               this.fireEvent("onCheckedAfter", node);
           
			}
        return false;
    }
    /**
     * 点击选中节点
     */
    ,selectNode:function() {
        var tg;
        if ($type(arguments[0]) == "element") {
            tg = arguments[0];
        } else {
            tg = arguments[0].target || event;
        }
        if ($defined(this.targetNode)) {
            this.targetNode.removeClass(this.options.treeStyle.treeHighlighter);
        }
        tg.addClass(this.options.treeStyle.treeHighlighter);
        this.targetNode = tg;
        this.current = this.getNode(tg);
    }
    ,unSelectNode:function() {
        if ($defined(this.targetNode)) {
            this.targetNode.removeClass(this.options.treeStyle.treeHighlighter);
        }
        this.targetNode = null;
        this.current = null;
    }


    /**
     * 获取当前选中的节点
     */
    ,getSelectedNode:function() {
        return this.current;
    }

    /**
     * 鼠标移动
     * @param {Object} event
     */
    ,mousemove:function(event) {
        var target = event.target;
        SwordTree.Container.id = this.containerID;
        SwordTree.Container.mouseNode = target;
        SwordTree.Container.containerDraw.include(this.containerID, this);
        if (this.options.isHighlight == "true") {
            if (target.tagName.test("span", "i") && target.get("type") == "displaySpan") {
//                SwordTree.Container.mouseNode.setStyle("background-color", this.options.highlightColor);
                SwordTree.Container.mouseNode.addClass("treenode_hover");
            }
        }
    }

    ,mouseout:function(event) {

        if (this.options.isHighlight == "true") {
            if ($defined(SwordTree.Container.mouseNode)) {
//                SwordTree.Container.mouseNode.setStyle("background-color", "");
                 SwordTree.Container.mouseNode.removeClass("treenode_hover");
            }
        }
        SwordTree.Container.id = null;
        SwordTree.Container.mouseNode = null;
        SwordTree.Container.containerDraw.empty();
    }

    /**
     * 获取点击区域的属性节点
     * @param {Object} item
     */
    ,getNode:function(item) {
        var res;
        if ($defined(item)) {
            var p1 = item.getParent("span[type='wrapperSpan']");
            if ($defined(p1)) {
                var p2 = p1.getParent("div[leaftype!='-1']");
                if ($defined(p2)) {
                    res = p2;
                } else {
                    res = p1;
                }
            } else {
                res = item;
            }
        }
        return res;
    }


    /**
     * 获取节点状态
     * @param {Object} target
     */
    ,getCheckedState:function(target) {
        var state;
        if (target.hasClass(this.options.treeStyle.treeNodeChecked)) {
            state = 0;
        } else if (target.hasClass(this.options.treeStyle.treeNodeUnchecked)) {
            state = 1;
        } else if (target.hasClass(this.options.treeStyle.treeNodeHalfChecked)) {
            state = 2;
        }
        return state;
    }



    /**
     * checkbox的串联
     * @param {Object} pNode
     * @param {Object} rp     当前操作类型
     * @param {Object} sp   是否处理子节点
     */
    ,checkedClick:function(pNode, state, sp, treeDataHs ,domNodeHs ,arrDataHs) {
    	if ($defined(pNode)) {
	    	if (this.options.isCascadeCheckedClick == "false"&&sp) {
	    		if(state == 1||state == 2){
	    			pNode.setProperty(this.options.checkSign, 'true');
	        	}else{
	        		pNode.setProperty(this.options.checkSign, 'false');
	        	}
	            this.changeCheckedState2(pNode.getElements("span[type='checkSpan']")[0], state, treeDataHs ,domNodeHs ,arrDataHs);
	            sp = false;
	        }  
                var fNode = pNode.getParent("div[leaftype='0']");
                if (sp) {
                	if(!$chk(treeDataHs)){
                    	var treeDataObj=this.swordTree.getDataObj();
                    	treeDataHs = new Hash(); 
                    	treeDataObj.data.each(function(item){
                    		treeDataHs.set(item.code,item);
                    	});
                	}
                	if(!$chk(domNodeHs)){
                    	domNodeHs = new Hash(); 
                 		this.dom.node.each(function(item){
                 			domNodeHs.set(item.code,item);
                    	});
                	}
                	if(!$chk(arrDataHs)){
                    	arrDataHs = new Hash(); 
                	}
                    
                    var nCccm=pNode.get("ccm");
                	if(!$chk(nCccm)){
                		nCccm = pNode.get("code");
                	}else{
                		nCccm=nCccm+","+pNode.get("code");
                	}
                	this.swordTree.treeArray.each(function(item){
                		if($chk(arrDataHs)){
                    		arrDataHs.set(item.code,item);
                    	}
            			if(item.ccm.contains(nCccm, ',')){
            				if(state == "0"){
            					delete item.ischecked;delete item.state;
            					this.setNodeDataCheckState(item.code,"unchecked",false,treeDataHs,domNodeHs) ;
            				}else{
            					item.ischecked="true";item.state="checked";
                				this.setNodeDataCheckState(item.code,"ischecked",false,treeDataHs,domNodeHs) ;
            				}
            			}
                	}.bind(this));
             		
                    var children = pNode.getElements("span[type='checkSpan']");
                    var tempS=state*2;
                    children.each(function(node, index) {
                    	this.changeCheckedState(node, tempS,treeDataHs,domNodeHs,arrDataHs);
                    }.bind(this));
                    var nodes = pNode.getElements("div[leaftype!='-1']").include(pNode);
                    nodes.each(function(item, index) {
                    	if(state == 1||state == 2){
                    		item.setProperty(this.options.checkSign, 'true');
                    	}else{
                    		item.setProperty(this.options.checkSign, 'false');
                    	}
                    }.bind(this));
                	if($type(this.swordTree.options.dataStr)=="string"){
                    	this.swordTree.options.dataStr=JSON.encode(treeDataObj);
                	}
                }
                if ($defined(fNode)) {
                	this.checkedPnodeClick(fNode, state, treeDataHs ,domNodeHs ,arrDataHs);
                }
            }
  }
    ,checkedPnodeClick:function(fNode, state, treeDataHs ,domNodeHs ,arrDataHs) {
    	
        var allNode = this.swordTree.treePcodeDataHash.get(fNode.get('code'));
        var chkNode = allNode.filter(function(item) {
            return item.state=="checked"||item.ischecked=="true";
        }.bind(this));
        var chkHalfNode = allNode.filter(function(item) {
        	 return item.state=="halfchecked";
        }.bind(this));
        //点击子节点 是否修改父节点半选中状态 或选中状态
        if(!((state == 1 || state == 2) && chkHalfNode.length > 0 && allNode.length == chkNode.length )||(state == 1&&allNode.length == chkNode.length)) {

            var allLength = allNode.length;
            var chkLength = chkNode.length;
            var chkHalLength =  chkHalfNode.length;
            var checkSpan = this.getSpan(fNode, 'checkSpan');
            
            if (state == 0 && (chkLength > 0||chkHalLength>0)) {    //chk -halfchk
            	if (this.options.isCascadeCheckedClick == "false"){
                	var isCheck = fNode.getProperty(this.options.checkSign);
                	if(isCheck != "true"){
                		fNode.setProperty(this.options.checkSign, "false");
                        this.changeCheckedState(checkSpan, 1, treeDataHs ,domNodeHs ,arrDataHs);
                	}
            	}else{
            		fNode.setProperty(this.options.checkSign, "false");
                    this.changeCheckedState(checkSpan, 1, treeDataHs ,domNodeHs ,arrDataHs);
            	}

            } else if (state == 0 && chkLength == 0) {   //chk -nochk
            	if (this.options.isCascadeCheckedClick == "false") {
            		var isCheck = fNode.getProperty(this.options.checkSign);
					if(isCheck != "true"){
						fNode.setProperty(this.options.checkSign, "false");
                        if(chkHalLength ==0){
                        	 this.changeCheckedState(checkSpan, 5, treeDataHs ,domNodeHs ,arrDataHs);
                        }
					}
            	}else{
            		fNode.setProperty(this.options.checkSign, "false");
                    if(chkHalLength ==0){
                    	 this.changeCheckedState(checkSpan, 5, treeDataHs ,domNodeHs ,arrDataHs);
                    }
            	}
               

            } else if (state == 1 && chkLength >= 0 && chkLength < allLength) {
            	
            	if (this.options.isCascadeCheckedClick == "false") {
					var isCheck = fNode.getProperty(this.options.checkSign);
					if(isCheck != "true"){
                		fNode.setProperty(this.options.checkSign, "false");
                        this.changeCheckedState(checkSpan, 3, treeDataHs ,domNodeHs ,arrDataHs);
					}
            	}else{
            		fNode.setProperty(this.options.checkSign, "false");
                    this.changeCheckedState(checkSpan, 3, treeDataHs ,domNodeHs ,arrDataHs);
            	}

            } else if (state == 1 && chkLength == allLength) {
            	if (this.options.isCascadeCheckedClick == "false") {
            		var isCheck = fNode.getProperty(this.options.checkSign);
            		if(isCheck != "true"){
            			this.changeCheckedState(checkSpan, 3, treeDataHs ,domNodeHs ,arrDataHs);
            		}
            	}else{
                    fNode.setProperty(this.options.checkSign, "true");
                    this.changeCheckedState(checkSpan, 4, treeDataHs ,domNodeHs ,arrDataHs);
            	}
            } else if (state == 2 && chkLength == allLength) {
            	if (this.options.isCascadeCheckedClick == "true") {
                	fNode.setProperty(this.options.checkSign, "true");
                    this.changeCheckedState(checkSpan, 4, treeDataHs ,domNodeHs ,arrDataHs);
            	}
            }
            this.checkedClick(fNode, state, false, treeDataHs ,domNodeHs ,arrDataHs);
        }
    
    }
    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,changeCheckedState2:function(target, sign, treeDataHs ,domNodeHs ,arrDataHs) {
    	
    	var targetNode=target.getParent("div.tree-node"),
    	tcode=targetNode?targetNode.retrieve("data").code||targetNode.get("code"):'';
        if (sign == 0) { //选中 --》 不选中
                var nodeData = this.swordTree.treeDataHash.get(targetNode.get("code"));
                var hasChecked = this.hasChildDataChecked(nodeData);
                if(this.options.isCascadeCheckedClick == "false"&&hasChecked){
                	 target.removeClass(this.options.treeStyle.treeNodeChecked);
                     target.removeClass(this.options.treeStyle.treeNodeUnchecked);
                     target.addClass(this.options.treeStyle.treeNodeHalfChecked);
                     this.setNodeDataCheckState(tcode,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
                 }else{
        			 target.removeClass(this.options.treeStyle.treeNodeChecked);
                     target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
                     target.addClass(this.options.treeStyle.treeNodeUnchecked);
                     this.setNodeDataCheckState(tcode,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
                 }
        } else if (sign == 1||(sign == 2&&this.options.isCascadeCheckedClick == "false")) {//不选中 --》选中//半选中 --》选中
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeChecked);
            this.setNodeDataCheckState(tcode,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        }
    }
    
    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,setNodeDataCheckState:function(tcode,state,eachArr,treeDataHs,domNodeHs,arrDataHs) {
    	if(!eachArr&&$chk(treeDataHs)&&$chk(treeDataHs)){
    		var treeDataItem = treeDataHs.get(tcode);
    		var domNodeItem = domNodeHs.get(tcode);
    		if(state == "unchecked"){
            	delete treeDataItem.ischecked;delete treeDataItem.state;
            	delete domNodeItem.ischecked;delete domNodeItem.state;
            }else if(state == "halfchecked"){
            	delete treeDataItem.ischecked;treeDataItem.state = 'halfchecked';
            	delete domNodeItem.ischecked;domNodeItem.state = 'halfchecked';
            }else if(state == "ischecked"){
            	treeDataItem.ischecked='true';treeDataItem.state = 'checked';
            	domNodeItem.ischecked='true';domNodeItem.state = 'checked';
            }
    	}else if(eachArr&&$chk(treeDataHs)&&$chk(treeDataHs)&&$chk(arrDataHs)){
    		var treeDataItem = treeDataHs.get(tcode);
    		var domNodeItem = domNodeHs.get(tcode);
    		var arrNodeItem = arrDataHs.get(tcode);
    		if(state == "unchecked"){
            	delete treeDataItem.ischecked;delete treeDataItem.state;
            	delete domNodeItem.ischecked;delete domNodeItem.state;
            	delete arrNodeItem.ischecked;delete arrNodeItem.state;
            }else if(state == "halfchecked"){
            	delete treeDataItem.ischecked;treeDataItem.state = 'halfchecked';
            	delete domNodeItem.ischecked;domNodeItem.state = 'halfchecked';
            	delete arrNodeItem.ischecked;arrNodeItem.state = 'halfchecked';
            }else if(state == "ischecked"){
            	treeDataItem.ischecked='true';treeDataItem.state = 'checked';
            	domNodeItem.ischecked='true';domNodeItem.state = 'checked';
            	arrNodeItem.ischecked='true';arrNodeItem.state = 'checked';
            }
    	}else{
            var treeDataObj=this.swordTree.getDataObj();
            var setFunc = null;
            if(state == "unchecked"){
            	setFunc = function(ite){if(ite.code==tcode){delete ite.ischecked;delete ite.state;}};//设置自身不选中
            }else if(state == "halfchecked"){
            	setFunc = function(ite){if(ite.code==tcode){delete ite.ischecked;ite.state = 'halfchecked';}};//设置自身不选中
            }else if(state == "ischecked"){
            	setFunc = function(ite){if(ite.code==tcode){ite.ischecked='true';ite.state = 'checked';}};//设置自身选中
            }
            if(setFunc){
                treeDataObj.data.each(setFunc);
        		this.dom.node.each(setFunc);
            	this.swordTree.treeArray.each(setFunc);
            }
            if($type(this.swordTree.options.dataStr)=="string"){
                this.swordTree.options.dataStr=JSON.encode(treeDataObj);
        	}
    	}
    }

    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,changeCheckedState:function(target, sign, treeDataHs ,domNodeHs ,arrDataHs) {
    	var targetNode=target.getParent("div.tree-node"),
    	styleObj=this.options.treeStyle,
    	tcode=targetNode?targetNode.retrieve("data").code||targetNode.get("code"):'';
    	if (sign == 0) { //选中 --》 不选中
            target.removeClass(styleObj.treeNodeChecked);
            target.removeClass(styleObj.treeNodeHalfChecked);
            target.addClass(styleObj.treeNodeUnchecked);
            this.setNodeDataCheckState(tcode,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        } else if (sign == 1) {//选中 --》半选中
             target.removeClass(styleObj.treeNodeChecked);
             target.removeClass(styleObj.treeNodeUnchecked);
             target.addClass(styleObj.treeNodeHalfChecked);
             this.setNodeDataCheckState(tcode,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        } else if (sign == 2) {//不选中 --》选中
            target.removeClass(styleObj.treeNodeUnchecked);
            target.removeClass(styleObj.treeNodeHalfChecked);
            target.addClass(styleObj.treeNodeChecked);
            this.setNodeDataCheckState(tcode,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        } else if (sign == 3) {//不选中 --》半选中
            target.removeClass(styleObj.treeNodeChecked);
            target.removeClass(styleObj.treeNodeUnchecked);
            target.addClass(styleObj.treeNodeHalfChecked);
            this.setNodeDataCheckState(tcode,"halfchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        } else if (sign == 4) {//半选中 --》选中
            target.removeClass(styleObj.treeNodeUnchecked);
            target.removeClass(styleObj.treeNodeHalfChecked);
            target.addClass(styleObj.treeNodeChecked);
            this.setNodeDataCheckState(tcode,"ischecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        }
        else if (sign == 5) {//半选中 --》不选中
            target.removeClass(styleObj.treeNodeChecked);
            target.removeClass(styleObj.treeNodeHalfChecked);
            target.addClass(styleObj.treeNodeUnchecked);
            this.setNodeDataCheckState(tcode,"unchecked",true, treeDataHs ,domNodeHs ,arrDataHs) ;
        }
    }
    ,getChildrenNode:function(code,isData){
    	if($type(this.swordTree.options.dataStr)=="string"){
    		this.swordTree.options.dataStr=JSON.decode(this.swordTree.options.dataStr);
    	}var b=function(ite){return ite.pcode==code;};
    	return isData?this.swordTree.options.dataStr.data.filter(b):this.dom.node.filter(b);
    }
    ,getChildrenNodeNew:function(nodeData){
    	return this.swordTree.getChildForNodeData(nodeData);
    }
    /**
     * 预备添加节点   处理末节点样式。
     * @param treeNode
     */
    ,beforeAddTreeNode:function(treeNode) {
        var childrenElement = treeNode.getFirst("div[leaftype='-1']");
        var wrapperSpan = treeNode.getFirst("span[type='wrapperSpan']");
        var gadGetSpan = wrapperSpan.getFirst("span[type='gadGetSpan']");

        if ($defined(childrenElement)) {
            var lastChild = childrenElement.getLast("div[leaftype!='-1']");
            if ($defined(lastChild)) {
                lastChild.removeClass(this.options.treeStyle.treeNodeLast);
            }
        } else {
            childrenElement = this.nodeEnum("div");
            childrenElement.setProperty("leaftype", "-1");
            childrenElement.addClass(this.options.treeStyle.treeChildren);
            gadGetSpan.addClass(this.options.treeStyle.treeGadGetPlus);
            treeNode.grab(childrenElement);
        }
        treeNode.setProperty("leaftype", "0");
        return {"childrenElement":childrenElement,"gadGetSpan":gadGetSpan};
    }

    /**
     * 添加节点
     * @param {Hash} hash
     */
    ,addTreeNode:function(hash, isLoad, item) {
        var dom;
        var tpNode;
        var node;
        if ($defined(item)) {
            tpNode = item;
        } else {
        	tpNode = this.getSelectedNode()||this.getRootNode();//todo,如果没有选择节点，默认在根节点下面添加
        	var span=tpNode.getElement("span.tree-gadjet-plus");
        	if(tpNode.getElements("div[leaftype!='0']").length==0 &&tpNode.get("leaftype")=="0"){ 
        		if($chk(span))this.toggleClick(span);
        		}
            if (this.isLazyTree() && !tpNode.get(this.options.isLoadSign)&&$chk(this.options.ltid)) {
                var func = function(hash) {
                    var node = this.getTreeNode(hash);
                    this.setSpanClass(node, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(node, "iconSpan", this.options.treeStyle.treeCloseIcon);
                }.bind(this);
                this.lazyExtend(tpNode, func, hash);
                return;
            }
        }
        if ($type(hash) == "SwordTree.Iterator") {
            dom = hash;
        } else {
            var treeObj=this.swordTree;
        	var ccm=hash.get("ccm");
        	var nodeData={'code':hash.get("code"),'caption':hash.get("caption"),pcode:tpNode.get("code"),ischecked:hash.get("ischecked")};
        	var dataObj=treeObj.getDataObj();
	        dataObj.data.include(nodeData);
        	this.dom.domainData=dataObj.data;
        	treeObj.oldDataStr=treeObj.options.dataStr=JSON.encode(dataObj);
        	if($chk(ccm)){nodeData.ccm=ccm;}
        	else {treeObj.setNodeDataCCM(nodeData,"",nodeData);}
        	treeObj.treeDataHash.set(nodeData.code,nodeData);
        	treeObj.treeArray.include(nodeData);
        	var pArr = treeObj.treePcodeDataHash.get(nodeData.pcode);
			if($chk(pArr)){
				pArr.push(item);
			}else{
				treeObj.treePcodeDataHash.set(nodeData.pcode,[]);
				treeObj.treePcodeDataHash.get(nodeData.pcode).push(item);
			}
            dom = new SwordTree.JSONIterator(hash);
            dom.setLastSign(true);
        }

        if ($defined(tpNode)) {
            tpNode.store("data", hash);
            if ($defined(isLoad)) {
                if (!dom.hasChildNodes()) {
                    this.setSpanClass(tpNode, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(tpNode, "iconSpan", this.options.treeStyle.treeCloseIcon);
                    return;
                }
            }
            var element = this.beforeAddTreeNode(tpNode);
            var childrenElement = element.childrenElement;
            node = this.createNode(childrenElement, dom, tpNode.get("depth").toInt(), isLoad);
            node.setProperty(this.options.isLoadSign, true);
            if ($chk(tpNode.get(this.options.cascadeSign.id))) {
                node.setProperty(this.options.cascadeSign.pid, tpNode.get(this.options.cascadeSign.id));
            }
            var gadGetSpan = element.gadGetSpan;
            if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                this.extend(tpNode);
            }
            if (this.options.checkbox =="true") {
                var span = tpNode.getFirst("span[type='wrapperSpan']");
                var checkSpan = span.getFirst("span[type='checkSpan']");
                if (checkSpan.hasClass(this.options.treeStyle.treeNodeChecked)) {
                    var checkState = this.getCheckedState(checkSpan);
                    this.checkedClick(node, checkState, false);
                    //父节点选中时，懒加载的子节点也选中
                    if(this.options.isCascadeCheckedClick == "true"){
                        var childrenNodes = childrenElement.getElements('div.tree-node');
                        if(childrenNodes) {
                        	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
                        	childrenNodes.set(this.options.checkSign,'true');
                        }
                    }
                }else if(node.getFirst("span[type='wrapperSpan']").getFirst("span[type='checkSpan']").hasClass(this.options.treeStyle.treeNodeChecked)){
                	 var checkState = this.getCheckedState(checkSpan);
                     this.checkedClick(node, checkState, false);
                }
            }
        } else if (this.container.getFirst("div").getChildren("div").length == 0) {
            node = this.createNode(this.container, dom, this.depth + 1);
            this.container.getFirst("div").grab(node);
        }
        //        this.findTreeNode(node);
        this.reset();
        this.extendNodeByIdPath();
    }


    /**
     * 修改树节点
     * @param {Hash} oldNode
     * @param {Hash} newNode
     */
    ,updateTreeNode:function(oldNode, newNode) {
    	var node = this.getTreeNode(oldNode);
        var oNData=node.retrieve("data");
        var newNodeData={};
        var upF=function(item){
    		if(item.code==oNData.code){
    			for(var b in newNode){
    				if($chk(item[b])){
    					item[b]=newNode[b];
    					newNodeData[b]=newNode[b];
    				}
    			}
    		}
    	};
        var res = false;
        if ($defined(node)) {
            newNode.getKeys().each(function(item) {
                if (item == this.displayTag) {
                    var displaySpan = node.getFirst("span[type='wrapperSpan']").getFirst("span[type='displaySpan']");
                    displaySpan.set("text", newNode.get(item));
                }
                node.setProperty(item, newNode.get(item));
            }.bind(this));
        	if(!$chk(newNode.get("code"))){
        		newNode.set("code",oNData.code);
        	}
        	var treeObj=this.swordTree;
            var dataObj=treeObj.getDataObj();
            dataObj.data.each(upF);
            this.dom.domainData=dataObj.data;
            treeObj.oldDataStr=treeObj.options.dataStr=JSON.encode(dataObj);
	        if(!$chk(newNodeData.ccm)){treeObj.setNodeDataCCM(newNodeData,"",newNodeData);}
	        treeObj.treeDataHash.set(oNData.code,newNodeData);
	        treeObj.treeArray.each(function(item,index){
	        	if(item.code==oNData.code){
	        		treeObj.treeArray[index]=newNodeData;
	        	}
	        });
            res = true;
        }
        return res;
    }

    /**
     * 根据条件获取节点
     * @method getTeeeNode
     * @param {Hash} array
     */
    ,getTreeNode:function(hash, ele) {
        var hs;
        if ($type(hash) != 'hash') {
            hs = new Hash(hash);
        } else {
            hs = hash;
        }

        //懒加载树的初始化（暂不支持业务数据）：格式：code,11111|caption,北京|biz1,333
        var vs=hs.getValues();
        if(vs.length==1){
            if(vs[0].contains('|')){
                 var h=vs[0].toHash();
                 return new Element('div',{
                     'code':h.get('code')
                     ,'caption':h.get('caption')
                 });
            }
        }

        var query = "";
        hs.getKeys().each(function(item) {
            query = query + "[" + item + "='" + hs.get(item) + "']";
        });
        
        var array;

        if ($chk(ele)) {
            array = ele.getElements("div[leaftype!='-1']" + query);
        } else {
            array = this.container.getElements("div[leaftype!='-1']" + query);
        }

        var node = null;
        if (array.length > 0) {
            node = array[0];
        }
        return node;
    }
    ,getTreeNodes:function(hash, ele){
        var hs;
        if ($type(hash) != 'hash') {
            hs = new Hash(hash);
        } else {
            hs = hash;
        }
        var query = "";
        hs.getKeys().each(function(item) {
            query = query + "[" + item + "='" + hs.get(item) + "']";
        });
        var array;
        if ($chk(ele)) {
            array = ele.getElements("div[leaftype!='-1']" + query);
        } else {
            array = this.container.getElements("div[leaftype!='-1']" + query);
        }
        return array;
    }
    ,
    foundNode:null
    ,extendTreeNodeUtilFindNode:function(hash, ele) {
        var array;
        if ($chk(ele)) {
            array = ele.getElements("div[leaftype!='-1']");
        } else {
            array = this.container.getElements("div[leaftype!='-1']");
        }
        var identity = this.options.cascadeSign.id;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            if (this.dom4nodeHash.has(item.get(identity))
                    && item.getElements("div[" + identity + "]").length == 0
                    && this.dom4nodeHash.get(item.get(identity)).hasChildNodes()) {

                var childrenElement = this.nodeEnum("div");
                childrenElement.setProperty("leaftype", "-1");
                childrenElement.setStyle("display", "none");

                childrenElement.addClass(this.options.treeStyle.treeChildren);
                item.grab(childrenElement);

                var nodes = this.dom4nodeHash.get(item.get(identity)).getChildNodes();
                for (var i = 0; i < nodes.length; i++) {
                    childrenElement.grab(this.createOneLeaveNode(childrenElement, nodes[i], item.get('depth').toInt()));
                }
                if (this.getTreeNode(hash, item) != null) {
                    this.foundNode = this.getTreeNode(hash, item);
                    break;
                } else if (this.getTreeNode(hash, item) == null) {
                    this.extendTreeNodeUtilFindNode(hash, item);
                }
            }
        }
        ;
    }
    ,
    dealCaption:function(dom){//处理树上的显示内容
    	var pd = this.options.showFormat;
    	if(!$defined(pd))pd = "{caption}";
    	var jo = dom.node; 
    	return pd.substitute(jo);
    }
    ,
    createOneLeaveNode:function(container, dom, depth) {
        var isDrawSpan = true; //节点是否已经装饰 伸缩 、展开图片等
        var element = this.nodeEnum("div");

        if (dom.isLast()) {
            element.addClass(this.options.treeStyle.treeNodeLast);
        }
        var attributes = dom.getAttributes();
        var hashData = new Hash();
        for (var k = 0; k < attributes.length; k++) {
            element.setProperty(attributes[k].nodeName, attributes[k].nodeValue);
            hashData.set(attributes[k].nodeName, attributes[k].nodeValue);
        }
        if ($defined(dom.getAttribute(this.displayTag))) {
        	element.setProperty("title", this.dealCaption(dom));
        }
        element.store("data", hashData);

        var array = this.createWrapperSpan(dom);
        var wrapperSpan = array["wrapperSpan"];
        var gadGetSpan = array["gadGetSpan"];
        var iconSpan = array["iconSpan"];

        element.grab(wrapperSpan);

        element.setProperty("depth", (depth + 1));
        var hasChild = true;

        hasChild = dom.hasChildNodes();
        element.setProperty(this.options.isLoadSign, true);

        var childrenElement = this.nodeEnum("div");
        //xml,初始加载 ,只加载到指定的层
        this.dom4nodeHash.include(element.get(this.options.cascadeSign.id), dom);
        //有子节点
        if (hasChild) {
            element.setProperties({
                "class":this.options.treeStyle.treeNode
                ,"leaftype":"0"
            });
            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
            isDrawSpan = false;

            gadGetSpan.addEvents({
                "click":function() {
                    if (!$type(element.getElement(".tree-children"))) {

                        element.setProperty(this.options.isLoadSign, true);
                        childrenElement.setProperty("leaftype", "-1");

                        var nodes = dom.getChildNodes();
                        for (var i = 0; i < nodes.length; i++) {
                            childrenElement.grab(this.createNode(childrenElement, nodes[i], depth));
                        }

                        if ((depth - this.options.startLayer) >= ( this.options.extendLayer - 1)) {
                            //展开
                            childrenElement.setStyle("display", "block");
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);
                        } else {
                            //收缩
                            childrenElement.setStyle("display", "none");
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                        }
                        if (depth >= this.options.startLayer) {
                            //子节点
                            childrenElement.addClass(this.options.treeStyle.treeChildren);

                            element.grab(childrenElement);
                        }

                    }
                }.bind(this)
            });
            iconSpan.addEvents({
                "click":function() {

                    if (!$type(element.getElement(".tree-children"))) {

                        element.setProperty(this.options.isLoadSign, true);
                        childrenElement.setProperty("leaftype", "-1");

                        var nodes = dom.getChildNodes();
                        for (var i = 0; i < nodes.length; i++) {
                            childrenElement.grab(this.createNode(childrenElement, nodes[i], depth));
                        }

                        if ((depth - this.options.startLayer) >= ( this.options.extendLayer - 1)) {
                            //展开
                            childrenElement.setStyle("display", "block");
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeOpenIcon);
                        } else {
                            //收缩
                            childrenElement.setStyle("display", "none");
                            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeLeafIcon);
                        }
                        if (depth >= this.options.startLayer) {
                            //子节点
                            childrenElement.addClass(this.options.treeStyle.treeChildren);

                            element.grab(childrenElement);
                        }
                    }
                }.bind(this)
            });
        }
        else {
            element.setProperties({
                "class":this.options.treeStyle.treeNode
                ,"leaftype":"1"
            });
            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
        }

        if (isDrawSpan) {
            element.setProperty(this.options.isLoadSign, true);
            this.setSpanClass(gadGetSpan, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
            this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon);
        }
        if (depth > this.options.startLayer || this.options.startLayer == 0) {
            if (this.isLazyTree() && depth == this.startDepth) {
                container.adopt(childrenElement.getChildren("div"));
            } else {
                container.grab(element);
            }
        } else if (depth == this.options.startLayer) {
            this.container.grab(container);
        }
        this.fireEvent("onCreateNode", [element,iconSpan]);//此行不知道哪用的
        return element;
    }
    ,hasChildren:function(hash) {
        var res = false;
        var tpNode = this.getSelectedNode();
        if (this.isLazyTree() && !tpNode.get(this.options.isLoadSign)) {
            var func = function(hash) {
                var res = false;
                var node = this.getTreeNode(hash);
                if (node) {
                    res = (node.getChildren("div[leaftype='-1']") || []).length > 0;
                }
                return res;
            }.bind(this);
            res = this.lazyExtend(tpNode, func, hash, false);
            this.extend(tpNode);
        } else {
            var node = this.getTreeNode(hash);
            if (node) {
                res = (node.getChildren("div[leaftype='-1']") || []).length > 0;
            }
        }

        return res;
    }

    /**
     * 模糊搜索
     * @param hash
     */
    ,getLikeTreeNode:function(hash) {
        var hs;
        if ($type(hash) != 'hash') {
            hs = new Hash(hash);
        } else {
            hs = hash;
        }
        var key = hs.getKeys()[0];
        var value = hs.get(key);
        var node = [];
        var elements = this.container.getElements("div[leaftype!='-1']");
        for (var i = 0; i < elements.length; i++) {
            if(this.options.filterSign == "all"){
                 if(elements[i].get(this.displayTag).contains(value) || elements[i].get(this.options.cascadeSign.id).contains(value))
                     node.push(this.getNode(elements[i]));
            }else if(elements[i].get(key).contains(value))
                node.push(this.getNode(elements[i]));
        }
        return node;
    }

    /**
     * 根据条件删除节点
     * @param {Object} ele
     */
    ,deleteTreeNode:function(ele) {
        var node,nodeValue;
        if ($type(ele) == 'hash') {
            node = this.getTreeNode(ele);
        } else {
            node = ele;
        }nodeValue=node.get("code");
        if ($defined(node)) {

            var pNode = node.getPrevious("div[leaftype!='-1']");
            var cNode = node.getNext("div[leaftype!='-1']");
            var fNode = node.getParent("div[leaftype='0']");

            //是否为末节点
            var tp = node.hasClass(this.options.treeStyle.treeNodeLast);
            if (this.current == node) {
                this.current = null;
                this.targetNode = null;
            }
            node.destroy();

            if (tp) {
                if ($defined(pNode)) {
                    pNode.addClass(this.options.treeStyle.treeNodeLast);

                }
                else {
                    if (!$defined(cNode)) {
                        if ($defined(fNode)) {
                            var span = fNode.getFirst("span[type='wrapperSpan']");
                            var gadGetSpan = span.getFirst("span[type='gadGetSpan']");
                            var iconSpan = span.getFirst("span[type='iconSpan']");

                            gadGetSpan.removeClass(this.options.treeStyle.treeGadGetMinus);
                            gadGetSpan.removeClass(this.options.treeStyle.treeGadGetPlus);
                            gadGetSpan.addClass(this.options.treeStyle.treeGadGetNone);

                            iconSpan.removeClass(this.options.treeStyle.treeLeafIcon);
                            iconSpan.removeClass(this.options.treeStyle.treeOpenIcon);
                            iconSpan.addClass(this.options.treeStyle.treeCloseIcon);

                            fNode.setProperty("leaftype", "1");
                            var tempDiv = fNode.getFirst("div");
                            tempDiv.destroy();

                        }
                    }
                }

            }

            if (this.options.checkbox =="true") {

                if ($defined(fNode)) {
                    var span = fNode.getFirst("span[type='wrapperSpan']");
                    var checkSpan = span.getFirst("span[type='checkSpan']");
                    if (checkSpan.hasClass(this.options.treeStyle.treeNodeHalfChecked)) {
                        var tp = fNode.getFirst("div[leaftype='-1']");
                        var res = false;
                        if ($defined(tp)) {
                            var childNodes = fNode.getFirst("div[leaftype='-1']").getChildren("div");
                            res = childNodes.some(function(item) {
                                return item.get(this.options.checkSign) != "true";
                            }, this);

                        }
                        if (!res) {
                            var checkState = this.getCheckedState(checkSpan);
                            this.checkedClick(fNode, checkState, true);
                        }
                    }
                }

            }

        }
        var treeObj=this.swordTree;
        var dataObj=treeObj.getDataObj();
        
        dataObj.data=dataObj.data.filter(function(item){
    		return item.code!=nodeValue;
    	});
    	this.dom.domainData=this.dom.domainData.filter(function(tempItem){
        	return tempItem.code!=nodeValue;
        });
    	treeObj.oldDataStr=treeObj.options.dataStr=JSON.encode(dataObj);
        var tObj=treeObj.treeDataHash.get(nodeValue);
        treeObj.treeDataHash.erase(nodeValue);
        treeObj.treeArray.erase(tObj);
        var tObjs = treeObj.treePcodeDataHash.get(tObj.pcode);
        if($chk(tObjs)){
        	tObjs.erase(tObj);
        }
        this.fireEvent("onFinish");
    }
    ,
    findNodeByPath:function(hash) {
        var node;
        this.foundNode = null;
        if ($type(hash) == "hash") {
            var pathStr = hash.get(this.options.cascadeSign.id);
            var paths = pathStr.split(",");
            // 只有一个节点
            if (paths.length == 0) {
                var query = new Hash();
                query.set(this.options.cascadeSign.id, paths[0]);
                node = this.getTreeNode(query);
                //不是根节点，要查找的节点,或者此节点不存在
                if (node == null) {
                    this.extendTreeNodeUtilFindNode(query);
                    node = this.foundNode;
                }
            }
            //连续的路径
            else if (paths.length > 0) {
                for (var index = 0; index < paths.length; index++) {
                    this.func4findNodeByPath(paths[index]);
                }

                node = this.foundNode;
            }
        }
        var resNode = node;
        if ($defined(node)) {
            var spans = this.getSpan(node);

            var displaySpan = spans.displaySpan;

            if ($defined(this.targetNode)) {
                this.targetNode.removeClass(this.options.treeStyle.treeHighlighter);
            }
            displaySpan.addClass(this.options.treeStyle.treeHighlighter);
            this.targetNode = displaySpan;
            this.current = node;

            var pNode = node.getParent("div[leaftype='0']");
            var fxNode = node;

            for (var i = node.get("depth").toInt(); i >= 0; i--) {

                pNode = node.getParent("div[leaftype='0']");
                if ($defined(pNode)) {
                    var pGadGetSpan = this.getSpan(pNode).gadGetSpan;
                    if (pGadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                        this.extend(pNode);
                    }
                    node = pNode;
                } else {
                    break;
                }
            }
            var myFx = new Fx.Scroll(this.container, {duration:10}).toElement(fxNode);

        }
        return resNode;

    }
    ,func4findNodeByPath:function(path) {
        var identity = this.options.cascadeSign.id;
        var hash = new Hash();
        hash.set(identity, path);
        if (this.getTreeNode(hash, this.foundNode) != null) {
            this.foundNode = this.getTreeNode(hash, this.foundNode);
        } else {
            if ($chk(this.foundNode)) {
                var item = this.foundNode;
                if (this.dom4nodeHash.has(item.get(identity))
                        && item.getElements("div[" + identity + "]").length == 0
                        && this.dom4nodeHash.get(item.get(identity)).hasChildNodes()) {

                    var childrenElement = this.nodeEnum("div");
                    childrenElement.setProperty("leaftype", "-1");
                    childrenElement.setStyle("display", "none");

                    childrenElement.addClass(this.options.treeStyle.treeChildren);
                    item.grab(childrenElement);

                    var nodes = this.dom4nodeHash.get(item.get(identity)).getChildNodes();
                    for (var i = 0; i < nodes.length; i++) {
                        childrenElement.grab(this.createOneLeaveNode(childrenElement, nodes[i], item.get('depth').toInt()));
                    }
                    if (this.getTreeNode(hash, item) != null) {
                        this.foundNode = this.getTreeNode(hash, item);
                    }
                }
            } else {
                this.extendTreeNodeUtilFindNode(hash);
            }
        }
    }
    /**
     * 查询节点
     */
    ,findTreeNode:function(ele) {
    	var node;
        if ($type(ele) == "hash") {
            node = this.getTreeNode(ele);
            //xml
            if (node == null && this.options.dataType == 'xml') {
                this.extendTreeNodeUtilFindNode(ele);
                node = this.foundNode;
            }
        } else {
            node = ele;
        }
        var resNode = node;
        if ($defined(node)) {
            var spans = this.getSpan(node);

            var displaySpan = spans.displaySpan;

            if ($defined(this.targetNode)) {
                this.targetNode.removeClass(this.options.treeStyle.treeHighlighter);
            }
            displaySpan.addClass(this.options.treeStyle.treeHighlighter);
            this.targetNode = displaySpan;
            this.current = node;

            var pNode = node.getParent("div[leaftype='0']");
            var fxNode = node;

            for (var i = node.get("depth").toInt(); i >= 0; i--) {

                pNode = node.getParent("div[leaftype='0']");
                if ($defined(pNode)) {
                    var pGadGetSpan = this.getSpan(pNode).gadGetSpan;
                    if (pGadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                        this.extend(pNode);
                    }
                    node = pNode;
                } else {
                    break;
                }
            }
            var myFx = new Fx.Scroll(this.container, {duration:10}).toElement(fxNode);

        }
        return resNode;

    }
     /**
     * 隐藏所有的树节点
     */
    ,hiddenAllTreeNodes:function(){
        var allNodes = this.container.getElements("div[leaftype!='-1']")||[] ;
        allNodes.each(function(node, index){
              node.addClass(this.options.treeStyle.treeFilterHidden);
        }.bind(this));
    }
     /**
     * 过滤树节点
     */
    ,filterTreeNodes:function(nodes) {
        //首先对所有节点添加隐藏样式
        this.hiddenAllTreeNodes();
        nodes.each(function(node, index){
             node.removeClass(this.options.treeStyle.treeFilterHidden);
             for (var i = node.get("depth").toInt(); i >= 0; i--) {

                var pNode = node.getParent("div[leaftype='0']");
                if ($defined(pNode)) {
                    pNode.removeClass(this.options.treeStyle.treeFilterHidden);
                    node = pNode;
                } else {
                    break;
                }
            }


        }.bind(this));



    }
     /**
     * 移除树隐藏样式
     */
    ,removeTreeFilterHiddenClass :function() {
        var allNodes = this.container.getElements("div[leaftype!='-1']")|| [] ;
        allNodes.each(function(node, index){
              node.removeClass(this.options.treeStyle.treeFilterHidden);
        }.bind(this));
    }
    /**
     * 辅助方法
     * @param {Object} node
     */
    ,getSpan:function(node, type) {
        if (node) {
            var wrapperSpan = node.getFirst("span[type='wrapperSpan']");
            var res;
            if ($defined(wrapperSpan)) {
                if ($defined(type)) {
                    res = wrapperSpan.getFirst("span[type='" + type + "']");
                    return res;
                }
                else {
                    var displaySpan = wrapperSpan.getFirst("span[type='displaySpan']");
                    var gadGetSpan = wrapperSpan.getFirst("span[type='gadGetSpan']");
                    var iconSpan = wrapperSpan.getFirst("span[type='iconSpan']");

                    var hash = {
                        "gadGetSpan": gadGetSpan,
                        "iconSpan": iconSpan,
                        "displaySpan": displaySpan
                    }
                    return hash;
                }
            } else {
                return null;
            }

        }
    }

    /**
     * 获取跟节点
     * @param node
     */
    ,getRoot:function(node) {
        var root = node.getParents("div[leaftype='root']");
        if ($chk(root)) {
            return root[0];
        } else {
            return null;
        }
    }
    /**
     * 根据条件获取某一叶节点下的节点
     * @param element
     * @param hash
     */
    ,getChildNode:function(element, hash) {
        var hs;
        if ($type(hash) != 'hash') {
            hs = new Hash(hash);
        } else {
            hs = hash;
        }
        var query = "";
        hs.getKeys().each(function(item) {
            query = "[" + item + "='" + hs.get(item) + "']";
        });
        var array = element.getElements("div[leaftype!='-1']" + query);
        var node = null;
        if (array.length > 0) {
            node = array[0];
        }
        return node;

    }
    /**
     * 加载自定义样式
     * @param element
     * @param source
     * @param properties
     */
    ,loadCSS:function(element, source, properties) {
        return new Element('link', $merge({
            'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
        }, properties)).inject(element);
    }

    /**
     * 获取当前选中的所有节点
     * @method getAllChecked
     * @param {String} key     选取标识  如： title
     * @param {String} sign        连接标识符，默认 [,]
     * @param {boolean} isLeaf    是否返回叶子节点,默认false
     * @return {String}
     */
    ,getAllChecked:function(key,sign,isLeaf) {
    	var query = new Hash(),s="";   
    	query.set("ischecked", "true");
    	if(!sign)sign=",";
    	if(!key)key="code";
    	var res=this.swordTree.findTreeData(query,isLeaf),l=res.length;
        for(var i=0;i<l;i++){
    		s+=(res[i][key]+sign);
    	}
        if (s.length > 0) {
            s = s.substring(0, s.length - sign.length);
        }
        return s;
    }
    
    ,getAllNode:function(key, isLeaf, sign, splits) {
        var test = "div[leaftype!='-1']";

        if ($chk(isLeaf)) {
            if (isLeaf == 1)    test = test + "[leaftype='1']";
            if (isLeaf == 0)    test = test + "[leaftype='0']";
        }

        var array = this.container.getElements(test);
        var str = "";

        if ($chk(key)) {
            if (!$defined(sign)) {
                sign = ",";
            }
            if (!$defined(splits)) {
                splits = "[@]";
            }
            var keys = [];
            if ($type(key) == 'array') {
                keys.combine(key);
            } else {
                keys.include(key);
            }
            array.each(function(item, index) {

                for (var i = 0; i < keys.length - 1; i++) {
                    str += item.get(keys[i]) + sign;
                }
                str += item.get(keys[i]);
                str += splits;
            }.bind(this));
            if (array.length > 0) {
                str = str.substring(0, str.length - splits.length);
            }
        } else {
            return array;
        }
        return str;
    }

    /**
     /**
     * 获取当前选中的所有节点数组
     * @method getAllCheckedList
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @return {Array}
     */
    ,getAllCheckedList:function(isLeaf, where) {
        var test = "div[ischecked='true']";
        if (where) {
            test += where;
        }
        if ($chk(isLeaf)) {
            if (isLeaf == 1)    test = test + "[leaftype='1']";
            if (isLeaf == 0)    test = test + "[leaftype='0']";
        }
        var array = this.container.getElements(test);
        return array;
    }
    /**
     * 判断是否父节点
     * @param child
     * @param parent
     */
    ,isParent:function(child, parent) {
        var res = false;
        var depth = child.get("depth").toInt() - 1;
        for (var k = depth; k > 0; k--) {
            if (parent == child.getParent("div[leaftype!='-1'][depth=" + k + "]")) {
                res = true;
                break;
            }
        }
        return res;
    }
    /**
     * 设置选中的节点
     * @param array
     */
    ,setCheckedList:function(array) {
        if ($defined(array) && $type(array) == "array") {
        		array.each(function(item) {
        			if ($defined(item)) {
        				item.setProperty("ischecked", "true");
        			}
                });
            this.initCheckedTree();
        }
    }

    ,close:function() {
        var elements = this.container.getElements("div[leaftype!='-1']") || [];
        elements.each(function(item, index) {

            var depth = item.get("depth");
            if ($chk(depth) && depth >= this.options.extendLayer) {
                var span = this.getSpan(item, "iconSpan");
                if ($defined(span) && span.hasClass(this.options.treeStyle.treeOpenIcon) && item.get("leaftype") == "0") {
                    this.setSpanClass(item, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                    this.setSpanClass(item, "iconSpan", this.options.treeStyle.treeLeafIcon);
                }
                var childDiv = item.getFirst("div[leaftype='-1']");
                if ($defined(childDiv)) {
                    childDiv.setStyle("display", "none");
                }
            }
            item.setStyle("color","#000000");//恢复因搜索添加的颜色

        }.bind(this));
        this.unSelectNode();
    }

    ,appendRootNode:function(hash) {
        var dom = new SwordTree.JSONIterator(JSON.decode(hash));
        var div = new Element("div");
        div.addClass(this.options.treeStyle.treeChildren);
        div.setStyle("display", "block");
        div.setProperty("leaftype", "-1");
        var node = this.createNode(div, dom, -1);
        if (this.container.getFirst("div[leaftype='-1']").getFirst("div")) {
            node.setProperty("leaftype", "0");
        }
        this.container.getFirst("div[leaftype='-1']").addClass(this.options.treeStyle.treeChildren);
        node.grab(this.container.getFirst("div[leaftype='-1']"));
        div.grab(node);
        this.setSpanClass(this.getSpan(node, "gadGetSpan"), "gadGetSpan", this.options.treeStyle.treeGadGetMinus);
        var gadGetSpan = this.getSpan(node, "gadGetSpan");
        if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
            this.setSpanClass(this.getSpan(node, "iconSpan"), "iconSpan", this.options.treeStyle.treeLeafIcon);
        } else {
            this.setSpanClass(this.getSpan(node, "iconSpan"), "iconSpan", this.options.treeStyle.treeOpenIcon);
        }

        this.container.grab(div);
    }

    ,getCheckedRadio:function() {
        var radio = this.container.getElement("input[type='radio'][name='radio'][checked]");
        var item;
        if (radio) {
            item = radio.getParent("span").getParent("div");
        }
        return item;
    }
    ,getRootNode:function() {
        var el = this.container.getElement("div[leaftype='-1']");
        if (el) {
            el = this.container.getElement("div[leaftype='-1']").getElement("div[leaftype!='-1']");
        } else {
            el = null;
        }
        return el;
    }
    //清空 选中状态
    ,clearCheckedStatus:function(justClearData){
    	//treeType=1
    	if(!justClearData){
        	if(this.options.checkbox =="true"){
       		 var allCheckedNodes = this.container.getElements("div[leaftype!='-1']")||[];
       		// allCheckedNodes.set('ischecked','false');
       		 allCheckedNodes.each(function(item){
       		 	item.set("ischecked","false");
       		 	item.setStyle("color","#000000");
       		 });
   	    	 var spans = this.container.getElements("[type='checkSpan']")||[] ;
   	    	 spans.removeClass(this.options.treeStyle.treeNodeChecked);
   	    	 spans.removeClass(this.options.treeStyle.treeNodeHalfChecked);
   	    	 spans.addClass(this.options.treeStyle.treeNodeUnchecked);
        	}
    	}
    	var treeObj=this.swordTree;
    	var treeDataObj=treeObj.getOldDataObj();
    	treeDataObj.data.each(function(item){
    		delete item.ischecked;delete item.state;
    	});
    	treeObj.treeArray.each(function(item){
    		delete item.ischecked;delete item.state;
    	});
    	this.dom.node.each(function(item){
    		delete item.ischecked;delete item.state;
    	});
    	treeObj.options.dataStr=JSON.encode(treeDataObj);
    }
    ,setNodeChecked:function(array){
        if (this.options.checkbox =="true" && $defined(array) && $type(array) == "array") {
            array.each(function(item) {
                item.setProperty("ischecked", "true");
                var chkSpan = this.getSpan(item, "checkSpan");
                chkSpan.removeClass(this.options.treeStyle.treeNodeUnchecked);
                chkSpan.removeClass(this.options.treeStyle.treeNodeHalfChecked);
                chkSpan.removeClass(this.options.treeStyle.treeNodeChecked);
                chkSpan.addClass(this.options.treeStyle.treeNodeChecked);
            }.bind(this));
        }
    }
    ,getNodeCheckedStatus:function(node){
    	if (this.options.checkbox =="true"){
    		var chkSpan = this.getSpan(node, "checkSpan");
    		return this.getCheckedState(chkSpan);
    	}
    }
});


/**
 * 黑板
 * 用于标识鼠标访问的容器
 */
SwordTree.Container = {
    /**
     * 当前指向的容器ID
     */
    id:null
    /**
     * 当前指向的节点
     */
    ,mouseNode:null
    /**
     * 缓存容器绘制器
     */
    ,containerDraw:new Hash()
};



/**
 * 数据迭代器
 *
 * @author Administrator
 */

SwordTree.Iterator = new Class({

    $family: {name: 'SwordTree.Iterator'}
    /**
     * 被迭代节点
     */
    ,node:$empty
    /**
     *
     */
    ,iterator:$empty
    /**
     * 是否末节点
     */
    ,lastSign:true
    /**
     * 数据深度
     */
    ,dataDepth:0
    ,domainData:[]
    
    ,parent:null

    ,initialize:function(node, depth,treeObj) {

        /**
         * Abstract 由子类实现
         */
        this.iterator(node,treeObj);
        if ($defined(depth)) {
            this.dataDepth = depth;
        }
    }

    /**
     * 是否有子节点
     */
    ,hasChildNodes:$lambda(false)

    /**
     * 是否父节点下的最后一个节点
     */
    ,isLast:$lambda(true)

    /**
     * 获取节点属性集
     */
    ,getAttributes:$empty
    /**
     * 获取节点某一属性
     */
    ,getAttribute:$empty

    /**
     * 获取子节点集
     */
    ,getChildNodes:$empty

    ,setParentSign:function(code, pcode) {
        SwordTree.Iterator.code = code;
        SwordTree.Iterator.pcode = pcode;

    }
    
    ,setParent:function(dataDom){
    	this.parent = dataDom;
    }

});


SwordTree.Iterator.newInstance = function(node, type, cascadeSign,tree) {
    var instance = null;
    SwordTree.Iterator.treeNodeNum = 0;
    if ($chk(type) && 'json'.test(type.trim(), 'i')) {
        instance = new SwordTree.JSONIterator(node || {}, 0);
    } else if ($chk(type) && 'jsonAptitude'.test(type.trim(), 'i')) {
        var data = [];
        if ($defined(node) && $defined(node.data)) {
            data = node.data;
        }
        else return null;//没有数据时

        instance = new SwordTree.JSONAptitudeIterator(data, 0,tree);
        instance.setDomainData(data);
        instance.setParentSign(cascadeSign.id, cascadeSign.pid, node);
    } else {
        instance = new SwordTree.XMLIterator(node, 0);
    }
    return instance;
};


/**
 * xml迭代器
 */
SwordTree.XMLIterator = new Class({
    Extends :SwordTree.Iterator

    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }

    ,iterator:function(node) {
        this.node = node;
    }

    ,hasChildNodes:function() {
        return this.node.hasChildNodes();
    }

    ,getChildNodes: function() {
        var nodes = new Array();
        this.dataDepth++;
        for (var k = 0; k < this.node.childNodes.length; k++) {
            if ((/[^\t\n\r ]/.test(this.node.childNodes[k].data))) {
                var it = new SwordTree.XMLIterator(this.node.childNodes[k], this.dataDepth);
                it.setLastSign(false);
                nodes.push(it);
            }
        }
        if (nodes.length > 0) {
            nodes[nodes.length - 1].setLastSign(true);
        }
        return nodes;
    }

    ,getAttributes:function() {

        return this.node.attributes;
    }

    ,getAttribute:function(key) {
        return this.node.getAttribute(key);
    }

    ,isLast:function() {
        if (this.node.parentNode == null || this.node.parentNode.nodeName == "#document" || this.lastSign) return true;
        return false;
    }
});

/**
 * JSON迭代器
 */
SwordTree.JSONIterator = new Class({
    Extends:SwordTree.Iterator

    /**
     * 用于缓存当前属性，避免每次都查询
     */
    ,attributes:[]

    ,iterator:function(node) {
        this.node = new Hash(node);
        this.nodeData=node;
    }
    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }
    ,hasChildNodes:function() {
        var res = false;
        res = this.node.some(function(value, key) {
            return $type(value) == 'array' || $type(value) == 'object';
        });
        return res;
    }

    ,getChildNodes:function() {
        var array = new Array();
        this.dataDepth++;
        this.node.getKeys().each(function (item, index) {
            if ($type(this.node.get(item)) == 'array') {
                this.node.get(item).each(function(value) {
                    var it = new SwordTree.JSONIterator(value, this.dataDepth);
                    it.setLastSign(false);
                    array.push(it);
                }.bind(this));
            } else if ($type(this.node.get(item)) == 'object') {
                var it = new SwordTree.JSONIterator(this.node.get(item), this.dataDepth);
                it.setLastSign(false);
                array.push(it);
            }
        }.bind(this));
        if (array.length > 0) {
            array[array.length - 1].setLastSign(true);
        }
        return array;
    }

    ,getAttributes:function() {

        if (this.attributes.length != 0) {
            return this.attributes;
        }

        var res = new Array();

        this.node.getKeys().each(function(item) {
            switch ($type(this.node.get(item))) {
                case 'string':
                case 'number':
                case 'boolean':
                    res.push({ nodeName:item,nodeValue:this.node.get(item)});
                case false:return null;
            }
        }.bind(this));
        this.attributes = res;
        return res;
    }
    ,getAttribute:function(key) {
        if ($defined(this.node)) {
            return this.node.get(key);
        } else {
            return null;
        }
    }

    ,isLast:function() {
        return this.lastSign;
    }
});


/**
 * 智能处理json数据，数据无需满足树的标准格式
 */
SwordTree.JSONAptitudeIterator = new Class({
    Extends:SwordTree.Iterator

    /**
     * 当前指向的元素
     * @param node
     */
    ,current:null
    
    
    ,iterator:function(node, treeObj) {
        this.node = node;
        this.treeObj=treeObj;
    }
    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }
    ,hasChildNodes:function() {
    	var sip = SwordTree.Iterator.pcode;
    	var sic = SwordTree.Iterator.code;
    	if (this.dataDepth == 0) {
    		return this.domainData.length > 0;
        } else {
        	var nCode = this.node[sic]||this.node[sic.toUpperCase()];
        	var hasC=this.domainData.some(function(item) {
            	return (item[sip]||item[sip.toUpperCase()]) == nCode && (item[sic]||item[sic.toUpperCase()]) != nCode;
            }, this);
        	if(!hasC&&!$chk(nCode)){
        		var a=this.domainData.slice().reverse();
        		for(var i=this.domainData.length-1;i>=0;i--){
        			var iPcode=this.domainData[i].pcode;
        			var c=this.domainData[i].code;
        			var d=a.every(function(ite){
            			return ite.code!=c?iPcode!=ite.pcode:true;
            		});
        			if(d){hasC=d;break;}
        		}
        	}
            return hasC;
        }
    }
    ,setDomainData:function(data) {
        this.domainData = data;
    }
    ,setNodesCheckedState:function(dom){
    	if(!$chk(dom.treeObj)||dom.treeObj.isInitTree)return;
    	dom.treeObj.treeArray.each(function(item){
			if($chk(item.Childs)){
				if(dom.treeObj.options.isCascadeCheckedClick == "false"){
					if(item.state == "halfchecked" || item.ischecked == "true")return;
				}
				if(!$chk(item.checkTimes)){
		    		item.state = 'unchecked';
		    	}else if(item.Childs==item.checkTimes){
		    		item.state = 'checked';
				} else{
		    		item.state = "halfchecked";
				}
			}
    	}.bind(this));
    	dom.treeObj.isInitTree = true;
    	
    }
    ,getChildNodes:function(rootPcode) {
    	var array = [];
        if (this.dataDepth == 0) {//root的时候
        	this.dataDepth++;
        	this.treeObj.treeArray.each(function(t){
        		if(t.ccm==""){
        			var it = new SwordTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
                    it.setLastSign(false);
                    array.push(it);
                    it.setParent(this);
                    it.setDomainData(this.domainData);
                }
        	}.bind(this));
        } else {
        	if($type(this.node)=='array'){
        		this.treeObj.treeArray.each(function(t){
            		if(t.ccm==""){
            			var it = new SwordTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
                        it.setLastSign(false);
                        array.push(it);
                        it.setParent(this);
                        it.setDomainData(this.domainData);
                    }
            	}.bind(this));
        	}else{
        		this.treeObj.getChildForNodeData(this.node).each(function(t){
	        		var it = new SwordTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
	                it.setLastSign(false);
	                array.push(it);
	                it.setParent(this);
	                it.setDomainData(this.domainData);
	           }.bind(this));
        	}
            this.dataDepth++;
        }
        if (array.length > 0) {
            array[array.length - 1].setLastSign(true);
        }

        return array;
    }

    ,getAttributes:function() {

        var res = new Array();
        var attrs = new Hash(this.node);
        attrs.getKeys().each(function(item) {
            switch ($type(attrs.get(item))) {
                case 'string':
                case 'number':
                case 'boolean':
                    res.push({ nodeName:item,nodeValue:attrs.get(item)});
                case false:return null;
            }
        });
        return res;
    }
    ,getAttribute:function(key) {
        if ($defined(this.node)) {
            return this.node[key]||this.node[key.toUpperCase()];
        } else {
            return null;
        }
    }

    ,isLast:function() {
        return this.lastSign;
    }
    ,queryArray:[]//符合条件的节点数组
    ,treeArray:[]//全部数据的数组
    
    //sword5
    /** 
     * findNode 查找符合条件的节点
     **/
    ,findNode:function (gcn,qObj,isLeaf){
    	var first;
		var childs;
		if (!gcn) {//第一次
			this.queryArray=[];
            this.treeArray=[];
            childs = this.getChildNodes();
			first = true;
		} else {
			childs = gcn.getChildNodes();
			first = false;
		}
		if (childs.length < 1){
			return;
		}
		for ( var i = 0; i < childs.length; i++) {
			var tNode=childs[i].node;
			var b=qObj.every(function(value,key){
				if(!tNode[key]) return;
				return tNode[key].toLocaleLowerCase().indexOf((value+"").toLocaleLowerCase())>=0;
			});
			if (b) {
				if(isLeaf===true){
					if(childs[i].getChildNodes().length==0){
						this.queryArray.push(childs[i]);
					}
				}else {this.queryArray.push(childs[i]);}
			}
			this.findNode(childs[i],qObj,isLeaf);
		}
		if (first){ 
			if(this.queryArray.length<1){
				return null;
			}
			return this.createQueryTree(isLeaf);
		}
    } 
    /** 
     * createQueryTree 根据符合条件的节点查找其父节点
     **/
    ,createQueryTree:function(isLeaf){
    	var par;
    	var codes=[];
    	for(var i=0; i<this.queryArray.length;i++){
			codes.push(this.queryArray[i].node.code);
		}
    	var level=0;
    	if(isLeaf!==true){
			for(var i=0; i<this.queryArray.length;i++){
				    this.treeArray.push(this.queryArray[i].node);
					var index=0;
					par = this.queryArray[i].parent;
					while (par != null&& $type(par)=='SwordTree.Iterator') {
						if(par.node.code){
							this.treeArray.include(par.node);
						}
						index++;
						par = par.parent;
					}
					if(index>level){
						level=index;
					}
			}
		}
    	this.queryTreeChildNodes(this.queryArray);
		var treeObj = {
			"data" : JSON.encode({"data":this.treeArray}),
			level:level,
			"querArray":codes
		};
		return treeObj;
    },
    /** 
     * queryTreeChildNodes 根据符合条件的节点查找其子节点
     **/
    queryTreeChildNodes:function(els){
    	for(var i=0; i<els.length;i++){
    		this.treeArray.include(els[i].node);
    		this.queryTreeChildNodes(els[i].getChildNodes());
    	}
    }
});



/**
 * 处理树拖拽
 */
SwordTree.Drag = new Class({

    $family: {name: 'SwordTree.Drag'}

    ,Implements: [Events, Options]

    ,Extends: Drag
    /**
     * 开始拖拽的目标
     */
    ,startTarget:null
    /**
     * 限制拖动范围的容器  默认：可全局拖动
     */
    ,dragContainer:[]
    ,tpDragNode:true
    ,options:{

        startPlace: ['displaySpan']

        /**
         * 拖拽样式定义
         */
        ,dragStyle:{
            treeGhost:"tree-ghost"
            ,treeDragCurrent:"tree-drag-current"
            ,treeGhostIcon:"tree-ghost-icon"
            ,treeGhostNotAllowed:"tree-ghost-notAllowed"
            ,treeGhostInside:"tree-ghost-inside"
        }

    }

    ,selection : (Browser.Engine.trident) ? 'selectstart' : 'mousedown'

    ,initialize: function(swordTreeDraw, options) {
        swordTreeDraw.drag = this;
        this.setOptions(options);

        $extend(this, {
            swordTreeDraw: swordTreeDraw,
            snap: this.options.snap
        });
        if ($chk(this.options.dragContainer)) {
            var containers = this.options.dragContainer.split(",");
            this.dragContainer.combine(containers);
        }

        this.current = SwordTree.Drag.current;
        this.document = swordTreeDraw.container.getDocument();
        this.bound = {
            start: this.start.bind(this),
            check: this.check.bind(this),
            drag: this.drag.bind(this),
            stop: this.stop.bind(this),
            cancel: this.cancel.bind(this),
            eventStop: $lambda(false),
            keydown: this.keydown.bind(this)
        };

    }

    ,rDestory:function(v){
        Element.empty(v);
		Element.dispose(v);
    }
    /**
     * 开启拖拽
     */
    ,startDrag:function() {
    	this.attach();
        this.addEvent('start', function(event) {
            if (SwordTree.Drag.current) {
                document.addEvent('keydown', this.bound.keydown);
                var dragSpan;
                try{	
                	dragSpan = this.swordTreeDraw.getSpan(SwordTree.Drag.current, "displaySpan").addClass(this.options.dragStyle.treeDragCurrent);
               
                }catch(e){
                
                	 dragSpan = this.swordTreeDraw.getSpan(SwordTree.Drag.current.parentNode, "displaySpan").addClass(this.options.dragStyle.treeDragCurrent);
                }
                var tp = true;
                this.fireEvent('onDragBefore',[this,dragSpan.getParent("div.tree-node")]);
                if ($chk(this.options.noDragRule)) {
                    var rules = JSON.decode("["+this.options.noDragRule+"]");
                    var dragNode = this.swordTreeDraw.getNode(dragSpan);
                    for(var i=0;i<rules.length;i++){
                        var rule = rules[i];
                        if(dragNode.get(rule.key)==rule.value){
                            tp=false;
                            break;
                        }
                    }
                }
                if(tp){
                	this.tpDragNode = true;//  解决：如果拖拽完"不能拖拽的节点"(即设置了noDragRule的节点)，再去拖拽其它节点，无法操作，出来一个小加号就没反应了 的问题
                    this.addGhost(event);
                }else{
                    this.tpDragNode = false;
                    event.stopPropagation();
                }
            }
        }, true);

        this.addEvent('complete', function() {
            if (SwordTree.Drag.current && this.tpDragNode) {
                document.removeEvent('keydown', this.bound.keydown);
                if ($defined(this.swordTreeDraw.getSpan(SwordTree.Drag.current, "displaySpan"))) {
                    this.swordTreeDraw.getSpan(SwordTree.Drag.current, "displaySpan").removeClass(this.options.dragStyle.treeDragCurrent);
                }
                var startZone = SwordTree.Drag.startZone;
                if (startZone) {
                    if (SwordTree.Drag.ghost) {
                        this.rDestory(SwordTree.Drag.ghost);
                        startZone.beforeDrop();
                    }
                    if ($defined(SwordTree.Container.mouseNode)) {
                        this.fireEvent("onDragComplete", this.swordTreeDraw.getNode(SwordTree.Container.mouseNode));

                    }
                }
            }
        });

    }
    ,getElement: function() {
        return this.swordTreeDraw.container;
    }

    ,attach: function() {
        var dv = this.swordTreeDraw.container.getFirst("div");
        if ($defined(dv)) {
            this.swordTreeDraw.container.getFirst("div").addEvent('mousedown', this.bound.start);
        }
        return this;
    }

    ,detach: function() {
        var dv = this.swordTreeDraw.container.getFirst("div");
        if ($defined(dv)) {
            this.swordTreeDraw.container.getFirst("div").removeEvent('mousedown', this.bound.start);
        }
        return this;
    }

    ,keydown: function(event) {
        if (event.key == 'esc') {
            var zone = SwordTree.Drag.startZone;
            if (zone) zone.where = 'notAllowed';
            this.stop(event);
        }
    }

    ,start: function(event) {//mousedown

        if ($defined(SwordTree.Drag.ghost)) {
            this.rDestory(SwordTree.Drag.ghost);
        }

        var target = event.target;
        
        if (target.tagName.test("span", "i")) {
            if (target.get("type") != "gadGetSpan" && target.get("type") != "iconSpan" && target.get("type") != "checkSpan") {
                this.swordTreeDraw.selectNode(target);
            }
            if (target.get("type") == "iconSpan") {
                target = target.getNext("span[type='displaySpan']");
            }
        }
        if (!target) return;

        this.mouse = {start:event.page};
        this.document.addEvents({mousemove: this.bound.check, mouseup: this.bound.cancel});
        this.document.addEvent(this.selection, this.bound.eventStop);
    }

    /**
     * 拖拽启动检测
     * @param event
     */
    ,check: function(event) {

        if (this.options.preventDefault) event.preventDefault();
        var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
        if (distance > this.options.snap) {
            this.cancel();
            this.document.addEvents({
                mousemove: this.bound.drag,
                mouseup: this.bound.stop
            });
            var target = event.target;

            if (target.tagName != 'SPAN' && !$defined(target.type)) {
                return;
            }
            this.current = $splat(this.options.startPlace).contains(target.get('type')) ? this.swordTreeDraw.getSelectedNode() : false;
            if(!this.current) return;
            this.startTarget = target;
            SwordTree.Drag.current = this.current;
            SwordTree.Drag.startZone = this;
            this.fireEvent('start', event).fireEvent('snap', this.element);
        }
    }


    ,drag: function(event) {
        if ($defined(SwordTree.Drag.ghost)) {
            SwordTree.Drag.ghost.position({x:event.page.x + 10,y:event.page.y + 10});
            var flag = true;
        	if(this.dragContainer.length > 0 ){
        		if(!this.dragContainer.contains(SwordTree.Container.id)){
        			flag = false;
        		}
        	}
        	if(flag && this.startTarget!=SwordTree.Container.mouseNode){
	            var dropZone = SwordTree.Drag.startZone;
	            if (!dropZone || !dropZone.ondrag) return;
	            SwordTree.Drag.startZone.ondrag(event);
            }else{
            	SwordTree.Drag.ghost.removeClass(this.options.dragStyle.treeGhostInside);
                SwordTree.Drag.ghost.addClass(this.options.dragStyle.treeGhostNotAllowed);
            }
        }
    }

    ,ondrag: function(event) {
        var target = SwordTree.Container.mouseNode;
        if (!$defined(target)) {
            if ($defined(event) && event.target.tagName == "DIV" && (event.target.get("leaftype") == "root" || event.target.get("sword") == "SwordTree" )) {
                if (event.target.get("leaftype") == "root") {
                    target = event.target;
                } else if (event.target.get("sword") == "SwordTree") {
                    target = event.target.getFirst("div[leaftype='root']");
                }
                SwordTree.Container.mouseNode = target;
            } else {
                this.dragState("false");
                return;
            }
        }
        var tp = true;
        if (this.dragContainer.length > 0) {
            if (!this.dragContainer.contains(SwordTree.Container.id)) {
                tp = false;
                
            }
        }
        if (tp && $defined(target)) {

            if (target.tagName.test("span", "i") && $defined(this.swordTreeDraw.targetNode)) {
                if (target.get("type") == "displaySpan" && target != this.swordTreeDraw.targetNode) {

                    if (this.swordTreeDraw.isParent(this.swordTreeDraw.getNode(target), this.swordTreeDraw.getNode(this.startTarget))) {
                        this.dragState("false");
                    } else {
                        this.dragState("true");
                    }

                } else if (target.get("type") == "iconSpan" || target.get("type") == "gadGetSpan") {
                    if (target.get("type") == "iconSpan" && target != this.swordTreeDraw.targetNode.getPrevious()) {
                        if (this.swordTreeDraw.isParent(this.swordTreeDraw.getNode(target), this.swordTreeDraw.getNode(this.startTarget))) {
                            this.dragState("false");
                        } else {
                            this.dragState("true");
                        }
                    }

                    if (this.tempTarget != target) {
                        this.tempTarget = target;
                        if (target.hasClass(this.swordTreeDraw.options.treeStyle.treeLeafIcon) ||
                            target.hasClass(this.swordTreeDraw.options.treeStyle.treeGadGetPlus)) {
                            var draw = SwordTree.Container.containerDraw.get(SwordTree.Container.id);
                            if ($defined(draw)) {
                                draw.extend.delay(this.options.openTimer, draw, this.swordTreeDraw.getNode(target));
                            }
                        }
                    }
                } else {
                    this.dragState("false");
                }
            } else {

                if (target.get("leaftype") == 'root') {
                    if (target.getFirst("div").getChildren("div").length == 0) {
                        this.dragState("true");
                    } else {
                        this.dragState("false");
                    }
                } else {
                    this.dragState("false");
                }
            }
        }
        this.fireEvent('drag');
        this.fireEvent('onDragMove',[this,target]);
    }
    /**
     * 更新克隆状态
     * @param state  "true"---允许  "false"---不允许
     */
    ,dragState:function(state) {
    	if(state == "false" || !state || state == null ){
            SwordTree.Drag.ghost.removeClass(this.options.dragStyle.treeGhostInside);
            SwordTree.Drag.ghost.addClass(this.options.dragStyle.treeGhostNotAllowed);
        } else if (state == "true" || state) {
            SwordTree.Drag.ghost.removeClass(this.options.dragStyle.treeGhostNotAllowed);
            SwordTree.Drag.ghost.addClass(this.options.dragStyle.treeGhostInside);
        }
    }
    /**
     */
    ,addGhost: function(event) {
        var ghost = new Element('span').addClass(this.options.dragStyle.treeGhost);
        var span,displaySpan,iconSpan;
         span = this.swordTreeDraw.getSpan(this.current);
         
        if(span==null) span = this.swordTreeDraw.getSpan(this.current.parentNode);
         displaySpan = span.displaySpan;
         iconSpan = span.iconSpan;
        var hash = new Hash();
        hash.set(this.swordTreeDraw.displayTag, this.current.get(this.swordTreeDraw.displayTag));

        var dom = new SwordTree.JSONIterator(hash);
        var node = this.swordTreeDraw.createNode(new Element("div"), dom, -1);

        var ele1 = new Element("span").set('html', this.swordTreeDraw.space);
        var ele2 = ele1.clone(true,true);

        ghost.grab(ele1);
        ghost.grab(node.getElements("span[type='wrapperSpan']")[0]);
        ghost.getElements("span[type='gadGetSpan']")[0].set("class","");
        ghost.getElements("span[type='gadGetSpan']")[0].innerHTML="";

        ghost.getFirst("span[type='wrapperSpan']").grab(ele2, "top");
        ghost.getFirst("span[type='wrapperSpan']").getFirst("span[type='iconSpan']").className = iconSpan.className;

        ghost.position({x:event.page.x + 10,y:event.page.y + 10});
        
        ghost.inject(document.body).addClass(this.options.dragStyle.treeGhostNotAllowed).setStyle('position', 'absolute');
        SwordTree.Drag.ghost = ghost;
    }

    ,beforeDrop: function() {
        var tp = true;

        if ($defined(SwordTree.Container.mouseNode) && $chk(this.options.existRules) && SwordTree.Drag.ghost.hasClass(this.options.dragStyle.treeGhostInside)
                && SwordTree.Container.mouseNode.get("leaftype") != 'root') {

            var root = this.swordTreeDraw.getRoot(SwordTree.Container.mouseNode);
            var draw = SwordTree.Container.containerDraw.get(SwordTree.Container.id);

            if ($defined(draw) && this.swordTreeDraw.containerID!=SwordTree.Container.containerDraw.getValues()[0].containerID &&
                $chk(draw.options.existRules)) {
                var srcArray = this.swordTreeDraw.options.existRules.split(",") || [];

                var toArray = draw.options.existRules.split(",") || [];
                var query = new Hash();
                var startNode = this.swordTreeDraw.getNode(this.startTarget);
                var elements = [startNode];
                elements.extend(startNode.getElements("div[leaftype!='-1']"));

                for (var i = 0; i < elements.length; i++) {
                    for (var k = 0; k < toArray.length; k++) {
                        if ($defined(srcArray[k])) {
                            query.set(toArray[k], elements[i].get(srcArray[k]));
                        }
                    }
                    if ($defined(this.swordTreeDraw.getChildNode(root, query))) {
                        alert("节点:[" + elements[i].get(this.swordTreeDraw.displayTag) + "]已经存在!");
                        return;
                    }
                }
            }
        }
        if (tp) {
            this.drop();
        }
    }

    ,drop: function() {
        if (SwordTree.Drag.ghost.hasClass(this.options.dragStyle.treeGhostInside)) {

            this.swordTreeDraw.unSelectNode();
            var newel=this.dragTreeNode(this.startTarget, SwordTree.Container.mouseNode);
            this.fireEvent('onDragSuccess',[newel,this.startTarget,SwordTree.Container.mouseNode]);
        }
    }
    ,dragTreeCloneEvents:function(current,from){
    	if(current.getFirst()){
	    	var currentNodes = current.getFirst().getChildren();
	    	from.getFirst().getChildren().each(function(item,index){
	    		var events = item.retrieve('events');
	    		if(events)for(var ev in events)currentNodes[index].cloneEvents(item, ev);
	    	});
    	}
    }
    /**
     * 追加节点
     * @param fromTarget     起始节点
     * @param toTarget       目标节点
     */
    ,dragTreeNode:function(fromTarget, toTarget) {

        var fromNode = this.swordTreeDraw.getNode(fromTarget);
        if ($defined(fromNode) && fromNode.tagName == "SPAN") {
            return;
        }
        var isDragCut = this.options.isDragCut;
        var draw = SwordTree.Container.containerDraw.get(SwordTree.Container.id);

        if (this.options.isDragCut == "undefined") {
            if (window.confirm("是否剪切拖拽节点？")) {
                isDragCut = "true";
            }
        }
       
        var srcCP = fromNode.clone(this.options.isDragChildrenNode!="false", true);
        if(srcCP.getChildren().length==0){//说明只需要移动本节点
        	var cloneSpan=fromNode.getElement("span").clone();
        	cloneSpan.getChildren().each(function(item,index){
        		if(item.hasClass("tree-gadjet-plus"))item.removeClass("tree-gadjet-plus").addClass("tree-gadjet-none");
        		if(item.hasClass("tree-gadjet-minus"))item.removeClass("tree-gadjet-minus").addClass("tree-gadjet-none");
        		if(item.hasClass("tree-leaf-icon"))item.removeClass("tree-leaf-icon").addClass("tree-close-icon");
        		if(item.hasClass("tree-open-icon"))item.removeClass("tree-open-icon").addClass("tree-close-icon");
        	});
        	cloneSpan.inject(srcCP);
        }
        srcCP.addClass(this.swordTreeDraw.options.treeStyle.treeNodeLast);
        var toNode = this.swordTreeDraw.getNode(toTarget);
        //srcCP.cloneAllEvents(toNode);
        this.dragTreeCloneEvents(srcCP, toNode);
        srcCP.store("data", fromNode.retrieve("data"));
        if (toNode.get("leaftype") == 'root') {
            this.changeDepth(srcCP, 0);
            toNode.getFirst("div[leaftype='-1']").grab(srcCP);
            if ($defined(srcCP.get(this.options.cascadeSign.pid))) {
                srcCP.setProperty(this.options.cascadeSign.pid, "");
            }
        } else {
            this.changeDepth(srcCP,toNode );
            var element = this.swordTreeDraw.beforeAddTreeNode(toNode);
            var childrenElement = element.childrenElement;
            if ($defined(srcCP.get(this.options.cascadeSign.id))) {
                srcCP.setProperty(this.options.cascadeSign.pid, toNode.get(this.options.cascadeSign.id));
            }

            var gadGetSpan = draw.getSpan(toNode, "gadGetSpan");
            if ($defined(draw) && gadGetSpan.hasClass(draw.options.treeStyle.treeGadGetPlus)) {
                draw.extend.delay(this.options.openTimer, draw, toNode);
            }
            childrenElement.grab(srcCP);
        }
        if (isDragCut == "true") {
            this.swordTreeDraw.deleteTreeNode(fromNode);
        }
        return srcCP;
    }
    /**
     * 对拖拽的节点重新定位深度
     * @param node
     * @param startDepth
     */
    ,changeDepth:function(srcNode,toNode) {
        var nodeList = srcNode.getElements("div[leaftype!='-1']").include(srcNode);
        var startDepth=0;
        if(toNode){
        	startDepth = toNode.get("depth").toInt();
        }
        srcNode.setProperty(this.options.cascadeSign.pid,toNode.get(this.options.cascadeSign.id));
        var nodeDepth = srcNode.get("depth").toInt();
        var tp = nodeDepth - (startDepth + 1);
        nodeList.each(function(item) {
            item.setProperty("depth", item.get("depth") - tp);
        });
    }
    ,setIsDragChildrenNode:function(bool){
    	this.options.isDragChildrenNode = bool +"";
    }
    ,setNodeDragLayers:function (nodeEl,num,depth){
    	var childrenNode=nodeEl.getElement("div.tree-children");
	   	if(childrenNode&&num>0){
	   		if(num==1){
	   			nodeEl.getElement("span").getChildren().each(function(ite,index){
	   	 			if(ite.hasClass("tree-gadjet-plus"))ite.removeClass("tree-gadjet-plus").addClass("tree-gadjet-none");
	   	 			if(ite.hasClass("tree-gadjet-minus"))ite.removeClass("tree-gadjet-minus").addClass("tree-gadjet-none");
	        		if(ite.hasClass("tree-leaf-icon"))ite.removeClass("tree-leaf-icon").addClass("tree-close-icon");
	        		if(ite.hasClass("tree-open-icon"))ite.removeClass("tree-open-icon").addClass("tree-close-icon");
   	        	});
	   			childrenNode.destroy();
	   		}
	   		else{
		   		if(depth<num-1){
		   	 		var ccc=childrenNode.getChildren("div");
		   	 		for(var i=ccc.length-1;i>0;i--){
		   	 			depth=childrenNode.getFirst("div.tree-node").get("depth")/1;
		   				this.setNodeDragLayers(ccc[i],num,depth);
		   		 	}
		   	 	}else {
		   	 		childrenNode.getChildren("div.tree-node").each(function(item,index){
		   	 			item.getElement("span").getChildren().each(function(ite,index){
			   	 			if(ite.hasClass("tree-gadjet-plus"))ite.removeClass("tree-gadjet-plus").addClass("tree-gadjet-none");
			        		if(ite.hasClass("tree-gadjet-minus"))ite.removeClass("tree-gadjet-minus").addClass("tree-gadjet-none");
			        		if(ite.hasClass("tree-leaf-icon"))ite.removeClass("tree-leaf-icon").addClass("tree-close-icon");
			        		if(ite.hasClass("tree-open-icon"))ite.removeClass("tree-open-icon").addClass("tree-close-icon");
		   	        	});
		           		if(item.getElement("div"))item.getElement("div").destroy();
		           	});
		   	 	}
	   		}
	   }
    }
});






/**
 * 下拉树
 */
SwordTree.Select = new Class({
    $family: {name: 'SwordTree.Select'}
    ,Implements:[Options,Events]

    //temp
    ,findNodes :[]
    ,showIndex:0
    ,isBuild:false
    ,leaveSign:null
    ,options:{
        treeStyle:{
            treeSelectWrap:"swordform_field_wrap swordtree_wrap"
            ,treeSelectSelimg:"tree-select-selimg"
            ,treeSelectSelimgOver:"tree-select-selimg-over"
            ,treeSelectSelimgClick :"tree-select-selimg-click"
            ,treeSelectList:"tree-select-list"
            ,treeSelectListInner:"tree-select-list-inner"
            ,treeSelectConsole:"tree-select-console"
        }
        //form的提交识别标识
        ,formSubSign:"swordform_item_oprate swordform_item_input"

    }
    ,initialize:function(options, tree, parent) {
    	
        this.setOptions(options);
        this.swordTree = tree;
        //无懒加载服务标识时,lazySelect=false
        if(!this.swordTree.options.ltid && !this.swordTree.options.lctrl)
        	this.options.lazySelect = 'false';
        this.$events = $merge(this.$events, this.swordTree.$events);
    }
    ,setValidate:function(validate) {
        this.validate = validate;
    }
    ,build:function(container) {
        var ct = this.drawSelDiv(container);
        this.initEvent();
        if (this.options.initDataFlag == "true") {
            this.buildTree();
        }
        return ct;
    },boxtd:null,imgtd:null,divTable:null
    ,drawSelDiv:function(container) {
        //var div = new Element('div', {'class':this.options.treeStyle.treeSelectWrap});
    	this.divTable = Sword.utils.createTable(this,true,true).addClass('swordtree_wrap');
        container.grab(this.divTable,"top");
        var treeDiv = new Element("div", {'class':this.options.treeStyle.treeSelectListInner});
        treeDiv.set("id", container.get("id"));
        this.listDiv = new Element("div", {'class':this.options.treeStyle.treeSelectList}).inject(document.body);
        var popDiv = new Element("div").inject(this.listDiv);
        if(this.swordTree.options.maxHeight){
        	var mh = this.swordTree.options.maxHeight;
        	mh = (mh).contains("px") ? mh : mh + "px";
        	popDiv.setStyle("overflow-y","auto");
        	popDiv.setStyle("max-height",mh);
        }
     
        popDiv.grab(treeDiv);
        if (this.options.checkbox =="true") {
            var console = new Element("div", {'class':this.options.treeStyle.treeSelectConsole});
            this.console = console;
            var btnOk = new Element("button");
            this.btnOk = btnOk;
            btnOk.set("html", "确定");
            var btnCancel = new Element("button");
            this.btnCancel = btnCancel;
            btnCancel.set("html", "关闭");
            console.grab(btnOk);
            console.grab(btnCancel);
            this.listDiv.grab(console);
            Sword.utils.btn.init(btnOk);
            Sword.utils.btn.init(btnCancel);
        }
        //var w = this.options.inputWidth;
        this.selBox = new Element('input', {
            'type' : 'text',
            'rule' :  this.options.rule,
            'name' : container.get("name"),
            'display':"true",
            'realvalue':"",
            'widget':"tree",
            'evnSign':"true",
            'widgetGetValue':'true',
            //            'readonly':this.options.readonly=="true",
            'disabled':(this.options.readonly == "true" || this.options.disable == "true"),
            'styles':{
                //'width':w
                'float':"left"
                ,'cursor':"text"
            }
            ,'class':this.options.formSubSign
        }).inject(this.boxtd);
        //先存下数据
        this.storeTid();
        this.selBox.store('widgetObj',this);//向input存入对象
        this.selDiv = new Element('div', {'class':this.options.treeStyle.treeSelectSelimg,
            'styles':{'float':'left'}
        }).inject(this.imgtd);

        if (this.options.readonly == "true" || this.options.disable == "true") {
            this.selBox.setStyle("cursor", "default");
        }
        if (this.options.disable == "true") {
            this.disable(this.selBox);
        }
        //this.divTable.setStyle('width',w.contains('%') ? w : this.options.inputWidth.toInt() + 17);
        //this.divTable.setStyle('width','auto');//0417
        //this.selBox.setStyle('width', div.getWidth() - 18);
        //if (this.options.disable != "true") {
        this.selDiv.set({
            'events':{
                'mouseover':function(e) {
                    Event(e).target.addClass(this.options.treeStyle.treeSelectSelimgOver);
                }.bind(this),
                'mouseout':function(e) {
                    Event(e).target.removeClass(this.options.treeStyle.treeSelectSelimgOver);
                }.bind(this)
            }})
        //}
        container.set({"id":"","name":""});
        //div.grab(this.selBox);
        //div.grab(this.selDiv);
        this.treeDiv = treeDiv;
        return treeDiv;
    }
    ,initEvent:function() {
        //if (this.options.disable != "true") {
        window.document.addEvent('click', function(e) {
            if (this.showByJs == true) {
                this.showByJs = false;
                return;
            }
            var obj = e.target;
            while (obj.parentNode && obj != this.selBox && obj != this.selDiv && obj != this.listDiv) obj = obj.parentNode;
            if (obj != this.selBox && obj != this.selDiv && obj != this.listDiv && this.selBox) {
                if (this.selBox.get("display") == "false") {
                    this.hide();
                }
            }
        }.bind(this));
        this.selBox.addEvents({"focus":function() {
            this.fireEvent("onClickBefore");
            this.clickBefore();
            this.selInput();
            if (Browser.Engine.trident) {
                ///将光标放置在文本最后
            	var obj = event.srcElement;
                if(obj.get("tag")=="input"){
                    var txt =obj.createTextRange();
                    txt.moveStart('character',obj.value.length);
                    txt.collapse(true);
                    txt.select();
                }
            } 
        }.bind(this)
        ,"keyup":function(e){
        	e=new Event(e);
        	if((e.code>=37&&e.code<=40)||e.code=="13"||e.code=="35"||e.code=="36"){
        		this.elKeyUpEvent(e);
        	}else if(e.code=="8"){/*判断当前的显示值是否与原来的值一样*/
                var oldValue = this.getCaption()!=null?this.getCaption():"";
                var newValue =  e.target.value;
                if(oldValue!=newValue){
                    this.fireEvent("onSelectChange",[newValue, oldValue]);
                }
                this.setRealValue('');
               // this.selBox.value = '';
                if(this.selBox.get('value')==""){
                    var dataO=this.swordTree.oldDataStr||this.swordTree.options.dataStr;
             		this.swordTree.reloadTree(dataO,true);
                }
        	}
        	
        }.bind(this)});
        this.selBox.addEvent("blur", this.selectBlur.bind(this));
        this.selDiv.addEvent("click", function() {
            this.fireEvent("onClickBefore");
            this.clickBefore();
            this.leaveSign = false;
            this.selInput("isSelDiv");
        }.bind(this));
        this.listDiv.addEvent("mouseenter", this.mouseenter.bind(this));
        this.listDiv.addEvent("mouseleave", this.mouseleave.bind(this));
        this.swordTree.addEvent("onNodeClick", this.getSelectedNode.bind(this));

        if (this.options.checkbox =="true") {
            this.btnOk.addEvent("click", function() {  
                if(this.swordTree.options.selectrule == "leaf"){
                    this.setValue(this.swordTree.getAllChecked(this.swordTree.displayTag,",",true));
                    //  submitFormat默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                    if(this.options.submitFormat=="code"){
                        this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id,",",true));
                    }else{
                        this.setRealValue(this.swordTree.getAllChecked(this.options.submitFormat,",",true));
                    }
                } else {
                    this.setValue( this.swordTree.getAllChecked(this.swordTree.displayTag));
                    //  submitFormat默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                    if(this.options.submitFormat=="code"){
                        this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id));
                    }else{
                        this.setRealValue(this.swordTree.getAllChecked(this.options.submitFormat));
                    }
                }

                this.tempCheckList = this.swordTree.getAllCheckedList();
                this.hide();
                this.fireEvent("onSelectBtnOk", this.selBox);
            }.bind(this));
            this.btnCancel.addEvent("click", function() {
            	this.hide();
                this.fireEvent("onSelectBtnCancel");
            }.bind(this));
            
             if(this.options.lazySelect !='false')this.swordTree.addEvent("onCreateNode",function(node){
	            	 var t = this.swordTree;
	              	 var sb = this.selBox;
	            	 
	            	 var cl = [];
	            	 var realvalue=sb.get('realvalue');
	            	 if(!realvalue)return;
	                 var rv = realvalue.split(',');
	                 if(rv.contains(node.get(this.swordTree.options.cascadeSign.id))){
                		 cl.include(node);
                	 }
	            	 
	     			t.setNodeChecked(cl);
            	
            }.bind(this));

        }
    	 this.swordTree.initSearch(this.selBox);
    }
    ,elKeyUpEvent:function(event){
    	var ekey=event.key;
    	var  drawObj=this.swordTree.builder.draw;
    	if(ekey=="left"||ekey=="right"){
    		this.spanClick();
    	}else if(ekey=="up"){
    		drawObj.selectNode(this.getPreviousSpanEl());
    	}else if(ekey=="down"){
    		drawObj.selectNode(this.getNextSpanEl());
    	}else if(ekey=="$"){
    		drawObj.selectNode(this.getFirstSpanEl());
    	}else if(ekey=="#"){
    		drawObj.selectNode(this.getLastSpanEl());
    	}else if(ekey=="enter"){
    		this.getSelectedNode();//todo 暂时先这么处理
    	}
    }
    ,getSpan4Node:function(node){
    	var  drawObj=this.swordTree.builder.draw;
    	return drawObj.getSpan(node);
    }
    ,isGadjetPlus:function(node){//返回是否是非展开状态
    	var spans = this.getSpan4Node(node);
    	return spans.gadGetSpan.hasClass("tree-gadjet-plus")||spans.gadGetSpan.hasClass("tree-gadjet-none");
    }
    ,spanClick:function(){
    	var node=this.swordTree.getSelectedNode();
    	if(node){this.swordTree.builder.draw.extend(node);}
    }
    ,getPreviousSpanEl:function(){
    	var node=this.swordTree.getSelectedNode();
    	if(!node){
    		return this.getLastSpanEl();
    	}else{
    		var fPre=function(el){
    			var nodeCss="div.tree-node";
    			var pel=el.getPrevious();
    			if(pel){
    				if(this.isGadjetPlus(pel)){
        				return pel;
        			}else{
        				var getPEL=function(nodeEl){
        					if(this.isGadjetPlus(nodeEl)){return nodeEl;}
            				var b=nodeEl.getElement(".tree-children");
        					var has=b.getLast(nodeCss);
            				if(this.isGadjetPlus(has)){
            					return has;
            				}else{
            					return getPEL(has);
            				}
    					}.bind(this);
    					var b=getPEL(pel);getPEL=null;
    					return b;
        			}
    			}else{
    				return el.getParent(nodeCss)?el.getParent(nodeCss):el;
    			}
    		}.bind(this);
    		var d=fPre(node);
    		fPre=null;
    		var spans = this.getSpan4Node(d);
    		return  spans.displaySpan;
    	}
    }
    ,getNextSpanEl:function(){
    	var node=this.swordTree.getSelectedNode();
    	if(!node){
    		return this.getFirstSpanEl();
    	}else{
    		var fPre=function(el){
    			var nodeCss="div.tree-node";
    			if(!this.isGadjetPlus(el)){//展开状态
    				var b=el.getElement(".tree-children");
    				var has=b?b.getFirst(nodeCss):false;
    				if(has&&$type(has)=="element"){
    					return has;
    				}
    			}else{
    				var nel=el.getNext();
	    			if($chk(nel)){
	        			return nel;
	        		}else{
	        			var pN=el.getParent(nodeCss);
	        			if(pN){
	        				var pNn=el.getParent(nodeCss).getNext();
	        				if(pNn){
	        					return pNn;
	        				}else{
	        					var getPEL=function(nodeEl){
		        					if(!nodeEl.getNext()){
		        						var nodeElt=nodeEl.getParent(nodeCss);
		        						if(nodeElt){
		        							return getPEL(nodeElt);
		        						}else{
		        							return el;
		        						}
		        					}else{
		        						return nodeEl;
		        					}
	        					};
	        					var rEl=getPEL(pN);
	        					getPEL=null;
	        					return rEl==el?el:rEl.getNext();
	        				}
	        			}else{
	        				return el;
	        			}
	        		}
    			}
    		}.bind(this);
    		var d=fPre(node);
    		fPre=null;
    		var spans = this.getSpan4Node(d);
    		return  spans.displaySpan;
    	}
    }
    ,getFirstSpanEl:function(){
    	var node=this.treeDiv.getElement("div.tree-node");
		var spans = this.getSpan4Node(node);
		return  spans.displaySpan;
    }
    ,getLastSpanEl:function(){
    	var fLast=function(el){
    		var nodeCss="div.tree-node";
			var node=el?el.getElement(nodeCss):this.treeDiv.getElement(nodeCss);
			if(el&&!node){return el;}
			var isOne=node.getParent().getLast()==node;
			if(!isOne){
				node=node.getParent().getLast();
			}
			if(this.isGadjetPlus(node)){
				return node;
			}else{
				var b=node.getElement(".tree-children");
				var has=b?b.getLast(nodeCss):false;
				if(has&&$type(has)=="element"){
					return fLast(has);
				}else{return node;}
			}
		}.bind(this);
		var d=fLast(),fLast=null;
		var spans = this.getSpan4Node(d);
		return  spans.displaySpan;
    }
    ,clickBefore: function(){
    	if(this.swordTree.options.echoExtend == "true"){
        	if(!this.isClick){
        		this.buildTree();
            	var realvalue = this.selBox.get('realvalue');
            	if($chk(realvalue)){
            		realvalue.split(',').each(function(value){
                    	var nodeData = this.swordTree.treeDataHash.get(value);
                    	if($chk(nodeData)){
                        	var hash = new Hash();
                        	var ccm = nodeData.ccm+","+nodeData.code;
                        	hash.set(this.options.cascadeSign.id, nodeData.ccm.split(','));
                        	this.swordTree.builder.draw.extendNodeByIdPath(hash);
                        	if(this.swordTree.options.checkbox !="true"){
                            	var hs = new Hash();
                            	hs.set(this.options.cascadeSign.id, value);
                            	this.swordTree.findTreeNode(hs);
                    		}
                    	}
            		}.bind(this));

            		if(this.swordTree.options.checkbox =="true"){
            			this.swordTree.setCheckByCode(realvalue.split(','),true);
            		}
            	}
            	this.isClick = true;
        	}else{
            	var realvalue =this.selBox.get("realvalue");
        		if(this.swordTree.options.checkbox =="true"){
                	if($chk(realvalue)){
                        this.swordTree.clearCheckedStatus();
                        this.swordTree.setCheckByCode(realvalue.split(","),true);
                	}else{
                		this.swordTree.clearCheckedStatus();
                	}
                }else{
                	if($chk(realvalue)){
                		var node = this.swordTree.container.getElements("div[leaftype!='-1'][code='" + realvalue+ "']")[0];
                    	if(!$defined(node)){
                    		var nodeData = this.swordTree.treeDataHash.get(realvalue);
                        	if($chk(nodeData)){
                            	var hash = new Hash();
                            	var ccm = nodeData.ccm+","+nodeData.code;
                            	hash.set(this.options.cascadeSign.id, nodeData.ccm.split(','));
                            	this.swordTree.builder.draw.extendNodeByIdPath(hash);
                        	}
                    	}
                    	var hash = new Hash();
                    	hash.set(this.options.cascadeSign.id, realvalue);
                    	this.swordTree.findTreeNode(hash);
                	}
                }
        	}
        	}
    }
    ,processValueChange:function(value){
        if(this.options.lazySelect=='true'&&($chk(this.options.qtid) || $chk(this.options.qctrl))){
        	this.hide();
        	this.emptyTid();
        	if(value==''){
        		this.retrieveTid();
        		this.swordTree.options.dataStr = "";
        	}else if(value.length >= this.swordTree.options.qlength){
            	var params = {'inputValue':value};
            	this.swordTree.options.dataStr = this.queryData(params);
       	 	}
        	this.isBuild = false;
        	this.show();
        	this.findTreeNode();
        }else{
        	this.findTreeNodes(this.swordTree.options.filterSign);
        }
        	
    }
    ,mouseenter:function() {
        this.leaveSign = true;
    }

    ,mouseleave:function() {
        this.leaveSign = false;
    }

    ,keyDown:function(event) {
    	switch (event.code) {
            case 13:
                this.getSelectedNode();
                break;
            case 40:
                if (this.findNodes.length > 0) {
                    if ((this.showIndex + 1) == this.findNodes.length) {
                        this.showIndex = 0;
                    } else {
                        ++this.showIndex;
                    }
                    this.swordTree.findTreeNode(this.findNodes[this.showIndex]);
                }
                break;
            case 38:
                if (this.findNodes.length > 0) {
                    if (this.showIndex == 0) {
                        this.showIndex = this.findNodes.length - 1;
                    } else {
                        --this.showIndex;
                    }
                    this.swordTree.findTreeNode(this.findNodes[this.showIndex]);
                }
                break;
            default :
            	if (event.target.get('originValue') == event.target.get('value')) return;    //判断是否用户改变了输入值
                this.fireEvent("onSelectChange",[event.target.get('value'), event.target.get('originValue')]);
            	event.target.set('originValue',event.target.get('value'));            //ff 必须set()?
            	break;
        }
    }
    /**
     * 回选
     */
    ,getSelectedNode:function() {
         if(this.swordTree.options.checkbox =="true"){
        	 if(this.swordTree.options.selectrule == "leaf"){
                 this.setValue(this.swordTree.getAllChecked(this.swordTree.displayTag,",",true));
                 //  submitFormat默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                 if(this.options.submitFormat=="code"){
                     this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id,",",true));
                 }else{
                     this.setRealValue(this.swordTree.getAllChecked(this.options.submitFormat,",",true));
                 }
             } else {
                 this.setValue( this.swordTree.getAllChecked(this.swordTree.displayTag));
                 //  submitFormat默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                 if(this.options.submitFormat=="code"){
                     this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id));
                 }else{
                     this.setRealValue(this.swordTree.getAllChecked(this.options.submitFormat));
                 }
             }

             this.hide();
         }else{
             var node = this.swordTree.getSelectedNode();
             if ($defined(node)) {
                 var executeSel = false;
                 var func = this.swordTree.options.onNodeClickBefore;
                 var inputValue = null;
                 if ($defined(func)) {
                 	var resNodeClickBefore = this.getFunc(func)[0](node,this.selBox);
                 	if(resNodeClickBefore == true){
                 		executeSel = true;
                 	}
                 	else if($type(resNodeClickBefore)=='string'){
                     	inputValue = resNodeClickBefore;
                     	executeSel = true;
                 	}
                 } else if (!$defined(func)&&!executeSel) {
                     if ((this.swordTree.options.selectrule == "leaf" && node.get("leaftype") == 1) || (this.swordTree.options.selectrule == "all"))
                         executeSel = true;
                 }
                 if (executeSel) {
                     this.setSelectedNode(node, inputValue);
                 }else{
                     //否则展开该节点
                     this.swordTree.builder.draw.extend(node);
                 }
             }
         }
    }

    ,setSelectedNode:function(node, inputValue) {
    	if ($defined(node)) {
        	node = $$(node);
            var value = node.get(this.swordTree.builder.draw.displayTag);
            //this.setRealValue(node.get(this.swordTree.options.submitFormat));
            //submitFormat默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
            if(this.swordTree.options.submitFormat=="code"){
                var oldValue = this.getValue();
                var newValue =  node.get(this.swordTree.options.submitFormat);
                if(oldValue!=newValue){
                    this.fireEvent("onSelectChange",[newValue, oldValue]);
                }
                 this.setRealValue(newValue);
                 if(node.length==0)this.swordTree.clearCheckedStatus();//去掉下拉树节点的选中状态
            }else{
                  var keys = [];
                  var key = this.swordTree.options.submitFormat;
                  if(key.contains("|"))
                    keys = key.split("|");
                 var len = keys.length;
                 var str = "";
                 if(len >0){
                     keys.each(function(item, index) {
                       str = str + node.get(item) + "|";
                     });
                     str = str.substring(0, str.length - 1);
                     var oldValue = this.getValue();
                     var newValue =  str;
                     if(oldValue!=newValue){
                         this.fireEvent("onSelectChange",[newValue, oldValue]);
                     }
                     this.setRealValue(str);
                 }else{
                     var oldValue = this.getValue();
                     var newValue =  node.get(key);
                     if(oldValue!=newValue){
                         this.fireEvent("onSelectChange",[newValue, oldValue]);
                     }
                    this.setRealValue(newValue);                 
                 }
            }
            this.setValue((inputValue == null) ? value : inputValue);
            this.selBox.store('treeData',node.retrieve('data'));
            this.hide();
            this.swordTree.unSelectNode();
        }
    }
    ,setSelBoxValue:function(){
        	var treeObj=this.swordTree,
        	isAsCode=treeObj.options.handInput,
        	realValueStr=this.selBox.get("realValue"),
        	valueStr=this.selBox.get("value");
        	var vHash=new Hash();
            vHash.set("code",realValueStr);
        	if(!$chk(realValueStr)){
        		if(isAsCode=="true"){
        			this.setRealValue(valueStr);
        		}else{
        			this.setValue("");
        		}
        	}else{
               if(this.swordTree.options.checkbox == "true"){
               }else{
            	   	var b=treeObj.findTreeData(vHash).length!=0?treeObj.findTreeData(vHash)[0]:null;
	           		if(b){
	           			if(b.caption!=valueStr){
	           				if(isAsCode=="true"){
	           	    			this.setRealValue(valueStr);
	           	    		}else{
	           	    			this.setValue("");
	           	    			this.setRealValue("");
	           	    		}
	           			}
	           		}else{
	           			this.setValue("");
	           			this.setRealValue("");
	           		}
               }
        	}
    }
    /**
     * 查找
     */
    ,findTreeNode:function(filterSign) {
    	//  不知道为啥加它，影响了下拉树的onSelectShow事件，
        /*if (this.selBox.get("display") == "true") {
            this.show();
        }*/
        var hash = new Hash();
        if ($defined(filterSign)) {
            if (filterSign == "caption")
                hash.set(this.swordTree.builder.draw.displayTag, this.selBox.value);
            else if (filterSign == "code")
                hash.set(this.swordTree.options.cascadeSign.id, this.selBox.get('realvalue'));
            else
                hash.set(filterSign, this.selBox.value);
        } else {
            hash.set(this.swordTree.builder.draw.displayTag, this.selBox.value);
        }
        var nodes = this.swordTree.getLikeTreeNode(hash);
        if (!$chk(this.selBox.get("realvalue")) && nodes.length == 0) {
            this.clear();

        } else if(nodes.length > 0){
            this.swordTree.findTreeNode(nodes[0]);
            this.findNodes = nodes;

        }
    }
    /**
     * 根据code或者caption查找满足条件的树节点（采用过滤的方式，而不是定位）
     */
    ,findTreeNodes:function(filterSign) {
        if (this.selBox.get("display") == "true") {
            this.show();
        }
        var hash = new Hash();
        if ($defined(filterSign)) {
            if (filterSign == "caption")
                hash.set(this.swordTree.builder.draw.displayTag, this.selBox.value);
            else if (filterSign == "code")
                hash.set(this.swordTree.options.cascadeSign.id, this.selBox.get('realvalue'));
            else
                hash.set(filterSign, this.selBox.value);
        } else {
            hash.set(this.swordTree.builder.draw.displayTag, this.selBox.value);
        }
        var nodes = this.swordTree.getLikeTreeNode(hash);
        if (!$chk(this.selBox.get("realvalue")) && nodes.length == 0) {
            this.clear();

        } else if(nodes.length > 0){
            this.swordTree.findTreeNode(nodes[0]);
            this.findNodes = nodes;
            this.swordTree.filterTreeNodes(nodes);
        }
    }

    ,selectBlur:function() {
    	if (!this.leaveSign) {
        	if (this.selBox.get("display") == "false"){ 
	        	this.hide();
	            this.setSelBoxValue();
        	}
        }

    }
    ,getNodeByRealvalue:function(realvalue,find){
    	var cl = [];
        var rv = $splat(realvalue.split(','));
        			
        rv.each(function(r){
        		var q = new Hash();
	            q.set(this.swordTree.options.cascadeSign.id, r);
        		var n=find==true?this.swordTree.findTreeNode(q):this.swordTree.getTreeNode(q);
        		if(n)cl.include(n);
        },this);

        return cl;
    }
    /**
     * 设置显隐
     */
    ,selInput:function(flag) {
    	var sb = this.selBox;
    	var t = this.swordTree;
        if (flag == "isSelDiv"&&sb.get("display") == "false") {
        	this.hide();
        } else {
        	if(t.options.echoExtend == "true"){
//        		t.search(sb.get("value"));
//        		if(!$chk(sb.get("value")))t.collapse();
	        	this.show();
        	}else{
        		var reValue = sb.get("realValue");
        		if(this.options.readonly!="true"){
    	        	if ($chk(sb.get("value"))) {
    	        			t.search(sb.get("value"));
    	        			this.show();
    	            }
    	        	else {t.search();this.show();}
        		} else {
        			this.show();
        		}
        		this.setRealValue(reValue);
        	}
        }

    }
     /**
      * 将所有服务标志设为空
      */
    ,emptyTid:function(){
        this.swordTree.options.tid ="";
        this.swordTree.options.ltid ="";
        this.swordTree.options.ctrl ="";
        this.swordTree.options.lctrl ="";
    }
    ,storeTid:function(){
        this.selBox.store('tid',this.swordTree.options.tid)
		this.selBox.store('ltid',this.swordTree.options.ltid)
		this.selBox.store('ctrl',this.swordTree.options.ctrl)
		this.selBox.store('lctrl',this.swordTree.options.lctrl)
    }
    ,retrieveTid:function(){
    	this.swordTree.options.tid = this.selBox.retrieve('tid');
    	this.swordTree.options.ltid = this.selBox.retrieve('ltid');
    	this.swordTree.options.ctrl = this.selBox.retrieve('ctrl');
    	this.swordTree.options.lctrl = this.selBox.retrieve('lctrl');
    }
    ,buildTree:function() {
        if (!this.isBuild) {
        	if(this.swordTree.exTreeDataFunc && !$chk(this.swordTree.options.dataStr)){//扩展的数据接口,应该放在domfactory里
        		this.swordTree.options.dataStr = this.swordTree.exTreeDataFunc();
        	}
            this.swordTree.container = this.treeDiv;
            this.swordTree.builder = new SwordTree.Builder(this.treeDiv, this.swordTree.options, this.swordTree.$events);
            this.swordTree.builder.build(this.swordTree);
            this.isBuild = true;
        }
    }

    ,show:function() {
        this.buildTree();
        if($chk(this.options.width)){
        	this.listDiv.setStyles({
                //'left':this.selBox._getPosition().x,
                //'width':$chk(this.options.width) ? this.options.width : this.selBox.getWidth() + 18
        		'width': this.options.width
            });
        }
       

        xyposition(this.selBox, this.listDiv);

        this.listDiv.setStyle("display", "block");
        this.listDiv.fade("in");
        this.selBox.set("display", "false");
        this.fireEvent("onSelectShow", [this.selBox]); //注册onSelectShow hetao
    }

    ,hide:function() {
    	this.listDiv.setStyles({'left':'-500px','top':'-500px'});
        this.listDiv.setStyle("display", "none");
        this.listDiv.fade("out");
        this.selBox.set("display", "true");
        this.validateBox(this.selBox);
        this.fireEvent("onSelectHide", [this.selBox]);
//        this.selBox.blur();//为了tipTitle 隐藏selBox的时候遗失焦点
        this.swordTree.removeTreeFilterHiddenClass();
    }

    ,clear:function() {
        this.selBox.realvalue = "";

        this.findNodes.empty();
        this.showIndex = 0;
        this.swordTree.close();
        this.swordTree.removeTreeFilterHiddenClass();
        if(this.swordTree.options.checkbox =="true"){
        	this.swordTree.clearCheckedStatus();
        }
    }
    ,validateBox:function(box) {
        if ($chk(box.get('rule'))) {
            this.swordTree.validate.validate(box);
        }
    }
    ,setRealValue:function(value) {
        this.selBox.set("evnSign", "false");
        this.selBox.set('realvalue', value);
        this.selBox.set("evnSign", "true");
    }
    ,setValue:function(value) {
        this.selBox.set("evnSign", "false");
        this.selBox.set('value', value);
        this.selBox.set("originValue",value); 
        this.selBox.set("evnSign", "true");
    }
    ,getValue:function(item) {
        return this.selBox.get("realvalue");
    }
    ,getCaption:function(item){
        return this.selBox.get("value");
    }
    /**
     * 执行qtid
     */
    ,queryData:function(params){
        var resData;
        if ($chk(this.options.qtid) || $chk(this.options.qctrl)) {
        	this.fireEvent("onQtidBefore",params);
            var data = new Hash();
            data.set("sword", "SwordTree");
            data.set("name", this.options.treeContainerName);
            data.set("loaddata", "widget");
            data.set("data", [params]);

            var attr = new Hash();
            attr.set("sword", "attr");
            attr.set("name", "treeName");
            attr.set("value", this.options.treeContainerName);

            var req = pageContainer.getReq({
                'tid':this.options.qtid
                ,'ctrl':this.options.qctrl
                ,'widgets':[data,attr]
            });

            pageContainer.postReq({'req':req,'async':false
                ,'onSuccess':function(res) {
            		resData = pc.getResData(this.options.treeContainerName, res);
                }.bind(this)
                , 'onError'  :function (res) {
                }.bind(this)
            });
        }
        return resData || {};
    },
    getBoxEl:function(imgdiv){//根据imgdiv找到input
    	return imgdiv.getParent().getPrevious().getElement('.swordform_item_oprate');
    },
    getImgEl:function(inputEl){//根据input找到imgdiv
    	return inputEl.getParent().getNext().getElement('.'+this.options.treeStyle.treeSelectSelimg);
    }
    ,
    disable:function(inputEl) {
        if($defined(inputEl)) {
             inputEl.set('disabled', 'true').addClass('tree_input_disable');
             var sel = this.getImgEl(inputEl);
             if(inputEl.cloneFlag) {
            	 sel.setStyle('display', '');
            	 sel.getNext().setStyle('display', 'none');
             } else {
            	 sel.clone().inject(sel, 'before').addClass('tree_selimg_disable');
            	 sel.setStyle('display', 'none');
                 inputEl.cloneFlag = true;
             }
        }
    }
    ,
    enable:function(inputEl) {
        if($defined(inputEl) && inputEl.cloneFlag) {
        	inputEl.erase('disabled').removeClass('tree_input_disable');
        	var sel = this.getImgEl(inputEl);
            if(inputEl.cloneFlag) {
            	sel.setStyle('display', 'none');
            	sel.getNext().setStyle('display', '');
            }
        }
    }
});