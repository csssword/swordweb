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

    /**
     * 构造器
     */
    ,builder:$empty
    ,Implements: [Events, Options]
    ,options: {
        pNode:null
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
         *  前台缓存懒加载标示
         *  @property {private string} cacheLazy
         */
        ,cacheLazy:""
        /**
         *  延迟加载前端服务标识
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
        ,treeType:'0'
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
        ,lazyLayer:0
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
        ,lazyTime:0
        /**
         * 树的起始装载层次
         * @property {private string} startLayer
         */
        ,startLayer:1
        /**
         * 定义树初始展开的层次
         * @property {private string} extendLayer
         */
        ,extendLayer:2
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
        ,stylePath:""
        /**
         * 过滤类型
         * code---按照代码过滤
         * caption---按照名称过滤
         * all---按照代码或名称过滤
         * 其它任意值---按照任意属性过滤   例如：后台返回bz属性，filterSign="bz" 即按照bz的值==输入框中的值来过滤
         * @property {private string} filterSign
         */
        ,filterSign:"code"
        /**
         * 根据此属性取值，用于显示节点内容
         * @property {private string} displayTag
         */
        ,displayTag:"caption"
        /**
         * 是否移动高亮
         * @property {private string} isHighlight
         */
        ,isHighlight:"true"
        /**
         * 是否自动收缩已展开节点
         * @property {private string} autoShrink
         */
        ,autoShrink:"false"
        /******************  end 构造树  *******************/

        /***************** 定义下拉树 ******************/
        /**
         *  在下拉树状态下，文本框长度
         *  @property {private string} inputWidth
         */
        ,inputWidth:null  //0511
        /**
         * 设置下拉选中后 的实际值  （分为显示值，实际值）
         * @property {private string} selectRealKey
         */
        ,selectRealKey:"code"
        ,sbmitcontent:"{code}"
        ,popdisplay:null//弹出层的显示格式定义，与sbmitcontent的定义相似
        /**
         *  下拉树状态下，文本框是否为只读状态
         *  @property {private string} selReadOnly
         */
        ,selReadOnly:"false"
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

        ,isShow:"true"
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
        /** 当懒加载的节点追加父节点时触发**/
        ,onLazyNodesAppend:$empty
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
        ,onIconClick:$empty
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
        ,onNodeContextMenu:$empty
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
        /**
         * 多选的下拉列表是否显示'确定'和'关闭'，false为显示、true为隐藏
         */
        ,isHideBtn:"false"

        /*********** end 定义下拉树事件 **********/

        /******************* end 定义事件 ******************/
    },


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
        if(initPara.get('selReadOnly')=='true')initPara.set('disabled',true); //防止被sword_convertHTML冲掉

        this.options.treeContainerName =  initPara.get("name");
        if ($chk(this.options.nodeEvents) && $type(this.options.nodeEvents) == 'string') {
            this.options.nodeEvents = JSON.decode(this.options.nodeEvents);
        }
        if ($type(this.options.cascadeSign) == 'string') {
            this.options.cascadeSign = JSON.decode(this.options.cascadeSign);
        }
        if(initPara.get('cascadeSign')&&!initPara.get('selectRealKey')){
              this.options. selectRealKey=this.options.cascadeSign.id;
        }

        this.container = this.options.pNode;
        if (($chk(this.options.tid) || $chk(this.options.ctrl))|| ((!$chk(this.options.tid) && !$chk(this.options.ctrl) )&& $chk(this.options.dataStr))) {
            this.build({}, parent);
            if(this.select){
                 sword_convertHTML(this.select.selBox,initPara);
                 // 这个地方被冲掉了
                 if(initPara.get('disable')=='false')
                	 this.select.selBox.erase('disabled');
            }
        }
    }
    ,initData:function(data, parent) {
        if(this.inGrid==true&&this.initDataFlag==true)return;
        if (!$chk(this.options.tid) && !$chk(this.options.ctrl)) {
            //logger.debug("装载树的数据："+JSON.encode(data),"PageInit");
            if(JSON.encode(data)){
            	this.options.dataStr = data;
            }else{
            	this.options.dataStr = pc.getInitData(data.get("name"));
            }
//            logger.debug("装载树的数据："+JSON.encode(this.options.dataStr),"PageInit");
            //this.options.dataStr = data;
            this.build({}, parent);
            //if(this.select){
                //sword_convertHTML(this.select.selBox,this.options.pNode);
            //}
            this.initDataFlag=true;
        }

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
                    this.select.build(this.container,parent);
                }else{
                    this.select.isBuild=false;
//                    setTimeout(this.select.buildTree.bind(this,[this,this.container]));
                    
                  this.select.buildTree(this.container);
                }
                Sword.utils.setWidth(this.options.inputWidth,((parent)?parent.userSize:null),this.select.divTable,this.select.selBox,true);//0511
            } else {
                this.builder = new SwordTree.Builder(this.container, this.options, this.$events);
                this.builder.build();
            }
        }

        this.fireEvent("onFinish");
    }

    /**
     * 获取当前选中的节点
     * @function {public htmlObj} getSelectedNode
     * @returns  htmlObj or null
     */
    ,getSelectedNode:function() {
        if(!this.builder.draw)return null;
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
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @param {String} sign        连接标识符，默认 [#]
     * @returns  string
     */
    ,getAllChecked:function(key, isLeaf, sign,where) {
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getAllChecked(key, isLeaf, sign,where);
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
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getAllCheckedList(isLeaf);
    }
    ,getAllUnCheckedList:function(isLeaf,where) {
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getAllUnCheckedList(isLeaf);
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
     * 设置选中或半选中的节点
     * @function {public null} setHalfOrCheckedList
     * @param array
     */
    ,setHalfOrCheckedList:function(array,isHalfChecked) {
        this.builder.draw.setHalfOrCheckedList(array,isHalfChecked);
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
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getTreeNode(hash);
    }
    ,getTreeNodes:function(hash) {
    	if(this.builder&&this.builder.draw)
         return this.builder.draw.getTreeNodes(hash);
    }
    /**
     * 模糊查询树节点
     * @function {public htmlObj} getLikeTreeNode
     * @param {Hash} hash
     * @returns  {htmlObj} 查到的节点
     */
    ,getLikeTreeNode:function(hash) {
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getLikeTreeNode(hash);
    }
    ,getLikeTreeNodeNew:function(hash) {
    	if(this.builder&&this.builder.draw)
        return this.builder.draw.getLikeTreeNodeNew(hash);
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
    ,close:function() {
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

    ,setSelectValue:function(value){
        if(this.select)this.select.setValue(value);
    }
     ,setSelectRealValue:function(value){
        this.select.setRealValue(value);
    }

    ,setDisplayTagWithBuild:function(value){
    	this.builder.options.displayTag = value;
    }
    ,getValue:function(item){
    	return this.select.getValue(item);
    }
    ,getCaption:function(item){
        return this.select.getCaption(item);
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
    ,reloadTree:function(data){
    	 this.options.dataStr = data;
    	 this.build();
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
    }

});
