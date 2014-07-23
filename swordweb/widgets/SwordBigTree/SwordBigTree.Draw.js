/**
 * 构造、渲染 节点
 * new tree
 * @author Administrator
 */

SwordBigTree.Draw = new Class({
    $family: {name: 'SwordBigTree.Draw'}
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
    
    /**
     * 临时存放，便于查找
     * key: path
     * value: iterator
     */
    ,iterPathHash:{}
    
    ,iterRootKey:"root"
    ,dataPathSign:"dataPath"
    
    ,leafTypeChildren: "100"
    
    ,checkPathArray:null
    
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
            "treeContainerX":"tree-container-x"
            ,"treeContainerY":"tree-container-y"
            /******树包装器****/
            ,"treeWrapper":"tree-wrapper"
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
    

    ,initParam:function() {
        this.options.startLayer = this.options.startLayer.toInt();
        this.options.extendLayer = this.options.extendLayer.toInt();
		 
        this.options.lazyLayer = this.options.lazyLayer.toInt();
        this.options.startLayer = this.options.startLayer < 0 ? 0 : this.options.startLayer;

        this.options.extendLayer = this.options.extendLayer < 0 ? 10000 : this.options.extendLayer;
       
       	if (($chk(this.options.ltid) || $chk(this.options.lctrl) ) && this.options.lazyLayer == 0) {
            this.options.lazyLayer = 1;
        }
        this.options.lazyLayer = this.options.lazyLayer < 0 ? 0 : this.options.lazyLayer;

        if ($defined(this.options.rootNode) && this.options.startLayer == 0 && this.options.dataType != "xml") {
            this.options.startLayer = 1;
        }
    }

    
    
    /**
     * @param {Object} item
     */
    ,initEvents:function() {

        this.container.addEvents({
            mousedown:this.mouseDownEvent.bindWithEvent(this)   // 原為 mousedown 需要測試
            ,mousemove:this.mousemoveEvent.bindWithEvent(this)
            ,mouseout:this.mouseoutEvent.bindWithEvent(this)
            ,dblclick:this.dblClickEvent.bindWithEvent(this)
            ,contextmenu:this.contextMenuEvent.bindWithEvent(this)
        });
    }

    ,initElementEnum:function() {
        SwordBigTree.Draw.Div = new Element("div");
        SwordBigTree.Draw.WrapperSpan = new Element("span", {type:"wrapperSpan"});
        SwordBigTree.Draw.GadGetSpan = new Element("span", {type:"gadGetSpan"});
        SwordBigTree.Draw.CheckSpan = new Element("span", {type:"checkSpan"});
        SwordBigTree.Draw.Radio = new Element("input", {type:"radio",id:"radio",name:"radio"});
        SwordBigTree.Draw.IconSpan = new Element("span", {type:"iconSpan"});
        SwordBigTree.Draw.DisplaySpan = new Element("span", {type:"displaySpan"});
    }
    ,nodeEnum:function(type) {
        switch (type) {
            case 'div':      return SwordBigTree.Draw.Div.clone(false);
            case 'wrapperSpan':     return SwordBigTree.Draw.WrapperSpan.clone(false);
            case 'gadGetSpan':  return SwordBigTree.Draw.GadGetSpan.clone(false);
            case 'checkSpan':  return SwordBigTree.Draw.CheckSpan.clone(false);
            case 'radio':  return SwordBigTree.Draw.Radio.clone(false);
            case 'iconSpan':   return SwordBigTree.Draw.IconSpan.clone(false);
            case 'displaySpan':  return SwordBigTree.Draw.DisplaySpan.clone(false);
        }
    }
    /**
     * 初始化 check
     */
    ,initCheckedTree:function() {
        if (this.options.treeType == "1") {
            var checkedList = this.container.getElements("div[" + this.options.checkSign + "='true'],div[" + this.options.noCheckSign + "='true']");
            if(this.options.selectrule == "leaf"){
            	 checkedList.each(function(item, index) {
                     var chkSpan = this.getSpan(item, "checkSpan");
                     var checkState = this.getCheckedState(chkSpan);
                     this.checkedClick(item, checkState, true);
                 }.bind(this));
            }else{
                this.setNodeChecked(checkedList);
            }
           
        }
    }
    
    

    /**
     * 是否懒树
     */
    ,isLazyTree:function() {
        return (this.options.lazyLayer > 0 && ("jsonAptitude" == this.options.dataType || "json" == this.options.dataType )) 
        || $chk(this.options.ltid) || $chk(this.options.lctrl) ||this.options.cacheLazy == 'true';
    }

    /**
     * 开始构建树
     * @param container
     * @param dom
     */
    ,build:function(container, dom) {
        container.empty();
        this.rootContainer = container;
        this.initElementEnum();

        if ($chk(this.options.stylePath)) {
            this.loadCSS(container, this.options.stylePath);
        }

        this.containerID = container.get("id") || container.get("name");
        var treeWrapper = this.nodeEnum("div");
        if (this.options.isShow == "false") {
            treeWrapper.setStyle("display", "none");
        }

        treeWrapper.setProperties({
            depth:this.depth + 1
            ,leaftype:"root"
        });

        treeWrapper.addClass('tree-root-node');

        container.grab(treeWrapper);
        this.initParam();
        treeWrapper.addClass(this.options.treeStyle.treeWrapper);
        var ctEle = treeWrapper;
        if ($defined(this.options.title)) {
            var titleEle = this.nodeEnum("div");
            titleEle.innerHTML = this.options.title;
            titleEle.addClass(this.options.treeStyle.treeTitle);
            treeWrapper.grab(titleEle);
        }
        var childrenElement = this.nodeEnum("div");
        childrenElement.setProperty("leaftype", this.leafTypeChildren);
//        treeWrapper.grab(childrenElement);
        ctEle = childrenElement;
        
        this.container = treeWrapper;

        this.dom = dom;
        
        this.iterPathHash[this.iterRootKey] = dom;
        
//        childrenElement.set(this.dataPathSign,"root");
        treeWrapper.set(this.dataPathSign,"root");
        
        SwordBigTree.Container.containerDraw.set(this.containerID, this);

        this.initEvents();
        
        if ($chk(this.options.height)) {
            if(this.options.height != 'auto') {
            treeWrapper.setStyle("height", this.options.height);
            treeWrapper.addClass(this.options.treeStyle.treeContainerY);
            } else {
                treeWrapper.setStyle("height", container.getParent().getHeight() - 5);
                treeWrapper.addClass(this.options.treeStyle.treeContainerY);
            }
        }
        if ($chk(this.options.width)) {
            treeWrapper.setStyle("width", this.options.width);
            treeWrapper.addClass(this.options.treeStyle.treeContainerX);
        }
        if(this.options.treeType=="1" && this.options.select === "true"){
        	
        	var box = this.swordTree.select.selBox;
        	if(box){
        		var checkPath = this.swordTree.select.selBox.get("checkPath");
        		if(checkPath && checkPath.length>0){
        			 var tpArray= checkPath.split("|");
        			 this.checkPathArray = [];
        			 for(var i=0;i<tpArray.length;i++){
        			 	this.checkPathArray.extend(tpArray[i].split(","));
        			 }
        		}
        	}
        }
//        this.buildTreeNodes.delay(1,this,childrenElement);
        this.buildTreeNodes.delay(1,this,treeWrapper);
        
    }
    
   
    
    ,buildTreeNodes:function(container){
    	 
    	
    	this.T1=0,this.T2=0,this.T3=0;
    	
    	var start = new Date();
        
        var tplInfo = this.createTmpArray();
        
        var s10 = new Date();
        
        var domId = container.getAttribute(this.dataPathSign);
        var iterator = this.iterPathHash[domId];
        var nodes = new Array();
        nodes.push(iterator);
        
        var childNodes = new Array();
        var resNodes = new Array();
        var layer = 0;
        
        if(this.options.startLayer>1){
	        for(var i=1;i<=this.options.startLayer;i++){
	        	
	        	if(i<this.options.startLayer){
	    			for(var k=0;k<nodes.length;k++){
	    				childNodes.extend(nodes[k].getChildNodes(this.options.rootPcode));
	    			}
	    			layer++;
	    		}else{
	    			for(var k=0;k<nodes.length;k++){
	    				resNodes.extend(nodes[k].getChildNodes(this.options.rootPcode));
	    			}
	    			
	    		}
	    		nodes = childNodes;
	        	childNodes = [];
	        }
        }else{
        	resNodes = iterator.getChildNodes(this.options.rootPcode);
        }
        
		var s11 = new Date();
        this.T1+= (s11-s10);
        
        this.createNode(container,tplInfo,resNodes, 0);
        
        
        if ($defined(this.options.rootNode)) {
            this.appendRootNode(this.options.rootNode);
        }
        
        
        
        this.isInitLazy = true;
        this.initCheckedTree();
        
        this.preparedDrag();
        
    }
    
    ,initDrag:$empty
    
    ,preparedDrag:function(){
    	if(this.options.isDrag=="true" ){
             this.initDrag();
        }
    	
    }
    
    /**
     * 创建节点
     * @param container
     * @param dom
     * @param depth
     * @param isLoad   根叶节点是否加载
     */
    ,createNode:function(container,tplInfo, nodes, depth, nodeIndex,startIndex,callBack,display) {
//    	this.setSpanClass(container, "iconSpan", this.options.treeStyle.treeGadjetLoad);
    	
        depth++;
        if(!nodeIndex){
        	nodeIndex = 0;	
        }
        var childrenEleTplData = {};
		childrenEleTplData['leaftype'] =  this.leafTypeChildren ;    	
		childrenEleTplData['display'] = display||"block";
        
		var i=0,l=nodes.length;
		
		if(startIndex){
			i = startIndex;
		}else{
			startIndex = 0;
		}
		var batchLen = 0;
		var isBatch = false;
		
		var s11 = new Date();
	    this.preparedTreeNode(nodeIndex,tplInfo,"childrenEleTpl",childrenEleTplData);
    		
       	for (; i < l; i++) {
            
	        var nodeIterator = nodes[i];
	        nodeIndex++;
	        
	        var eleHtml ;
	    	var wrapperSpanHtml;
	    	var childHtml;
	        
	    	var eleTplData = {};
	    	var wrapperSpanTplData = {};
	    	var caption = this.dealCaption(nodeIterator);
	    	
	    	eleTplData['eleClass'] = this.options.treeStyle.treeNode;
	    	eleTplData['attrs'] = nodeIterator.getAttributes();
	    	eleTplData['caption'] = caption;
	    	eleTplData["depth"] = depth ; //- this.options.startLayer +1;
	    	
	    	wrapperSpanTplData['caption'] = caption;
	    	wrapperSpanTplData['space'] = this.space;
	    	wrapperSpanTplData['treeType'] = this.options.treeType;
	    	
	    	if(this.options.treeType==="1"){
	    		var checkSpanCls = this.options.treeStyle.treeNodeNocheckedChecked;
	    		
		    	var ischecked = (nodeIterator.getAttribute(this.options.checkSign) == "true") ;
		    	if(this.checkPathArray){
		    		if(this.checkPathArray.indexOf(nodeIterator.getAttribute(this.options.cascadeSign.id))>-1){
		    			ischecked = true;
		    			nodeIterator.setAttribute(this.options.checkSign,"true");
		    		}
		    	}
		    	
		        var isnochecked = (nodeIterator.getAttribute(this.options.noCheckSign) == "true");
		        if (isnochecked) {
		            if (ischecked) {
		                checkSpanCls = this.options.treeStyle.treeNodeNocheckedChecked;
		            } else {
		                checkSpanCls = this.options.treeStyle.treeNodeNocheckedNotChecked;
		            }
		        } else {
		            if (this.isLazyTree()) {
		                if (ischecked) {
		                    checkSpanCls = this.options.treeStyle.treeNodeChecked;
		                } else {
		                    checkSpanCls = this.options.treeStyle.treeNodeUnchecked;
		                }
		            }
		        }
		        wrapperSpanTplData['checkSpanCls'] = checkSpanCls;
	    	}
	    	
	    	
	        var isLast=nodeIterator.isLast();
	        eleTplData['leaftype'] = isLast===true?"1":"0";
	        
	        if (isLast) {
	            eleTplData['eleClass'] = eleTplData['eleClass'] +" "+ this.options.treeStyle.treeNodeLast;
	        }
	       	
			this.iterPathHash[nodeIterator.getDataPath()] = nodeIterator;
			eleTplData["dataPathSign"] = this.dataPathSign;
			eleTplData[this.dataPathSign] = nodeIterator.getDataPath();
			
			
	        var hasChild = true;
	        
	        if(this.options.ltid!="" || this.options.lctrl!=""){
	        	hasChild = true;
	        }else{
	        	hasChild = nodeIterator.hasChildNodes();
//	        	eleTplData[this.options.isLoadSign] = true;
	        }
	        
			
	        //xml,初始加载 ,只加载到指定的层
//	        if ((this.options.dataType == 'xml' || this.options.pageDataLazy == 'true') && this.options.extendLayer <= depth) {
//	            this.dom4nodeHash.set(element.get(this.options.cascadeSign.id), nodeIterator);
//	            //有子节点
//	            if (hasChild) {
//	
//	                eleTplData[this.options.isLoadSign] = true;
//	                eleTplData['leaftype'] = "0";
//	                
//	                wrapperSpanTplData['gadGetSpan'] = this.options.treeStyle.treeGadGetPlus;
//		            wrapperSpanTplData['iconSpan'] = this.options.treeStyle.treeLeafIcon;
//	            }
//	            else {
//	                
//	                wrapperSpanTplData['gadGetSpan'] = this.options.treeStyle.treeGadGetMinus;
//		            wrapperSpanTplData['iconSpan'] = this.options.treeStyle.treeCloseIcon;
//	                
//	            }
//	            //不再往下加载
//	            hasChild = false;
//	        }
	        
	        if (hasChild) {
	        
	            wrapperSpanTplData['gadGetSpan'] = this.options.treeStyle.treeGadGetPlus;
	        	wrapperSpanTplData['iconSpan'] = this.options.treeStyle.treeCloseIcon;
	            	
	        }else{
	        	wrapperSpanTplData['gadGetSpan'] = this.options.treeStyle.treeGadGetNone;
		        wrapperSpanTplData['iconSpan'] = this.options.treeStyle.treeLeafIcon;
	        		
	        }
	       	
	        this.preparedTreeNode(nodeIndex,tplInfo,"eleTpl",eleTplData);
    		this.preparedTreeNode(nodeIndex,tplInfo,"wrapperSpanTpl",wrapperSpanTplData);
    		this.preparedTreeNodeAfter(tplInfo);
    		
       		batchLen++;
    		
    		if(batchLen==this.options.batchSize/1){
    			
    			startIndex = startIndex  + batchLen;
    			
    			isBatch = true;
    			break;
    		}
    		
    		
        }
        if(!isBatch){
        	this.preparedTreeNodeAfter(tplInfo);
        }
        
        var s21 = new Date();
        this.T2+= (s21-s11);
	    	
    	
        var tplEle = new Element("div");
        tplEle.innerHTML = this.genHtml(tplInfo);
        var children = tplEle.getChildren();
        container.adopt(children);
        
        if(children && children.length>0){
        	var s31 = new Date();
        	this.triggerEvents(container.getElements("div[leaftype!='100']"));
        	
        	var s32 = new Date();
        	this.T3+=(s32-s31);
        }
        
        if(isBatch===true){
			tplInfo = this.createTmpArray();
			
        	this.createNode.delay(this.options.openTimer,this,[container,tplInfo, nodes, depth, nodeIndex,startIndex,callBack,display]);
        }else{
        	if(callBack && $type(callBack) == "function"){
    			callBack.run();
    		}
        }
        
    }
    
    
    
    ,triggerEvents:function(children){
    	
    	var isCreateNode = (this.$events['createNode'] != undefined);
    	var isAfterCreateChildNodes = (this.$events['afterCreateChildNodes'] != undefined);
    	var len=children.length;
    	if((children && len>0) && (isCreateNode === true || isAfterCreateChildNodes === true || children[0].getAttribute("depth")/1 < (this.options.extendLayer-1) )){
    		var i=0;
    		var clsName = "class";
    		if(Browser.Engine.trident4 === true){ // ie6
    			clsName = "className";
    		}
	    	for(;i<len;i++){
	    		
	    		if(isCreateNode === true){
	    			this.fireEvent("onCreateNode",children[i]);
	    		}
	    		
	   			if(isAfterCreateChildNodes === true && children[i].getAttribute(clsName) && children[i].getAttribute(clsName).length>9){ //(this.options.treeStyle.treeNodeLast)){
	    			this.fireEvent("onAfterCreateChildNodes");
	    		}
	    		var depth = children[i].getAttribute("depth")/1;
	    		if(depth < (this.options.extendLayer - 1) || depth < (this.options.lazyLayer - 1)){
	    			var display = (this.options.extendLayer - depth -1)>0?"block":"none";
	    			this.extend($(children[i]),display);
	    		}
    		}
    	}
    	
    }

    
    ,createTmpArray:function(){
   		
   		var tplArray = [];
        var tplData = {};
        var tplHtml = [];
        tplData['eleTpl'] = SwordBigTree.Template.eleTpl;
        tplData['childrenEleTpl'] = SwordBigTree.Template.childrenEleTpl;
        tplData['wrapperSpanTpl'] = SwordBigTree.Template.wrapperSpanTpl;
        
        return {'tplArray':tplArray,'tplHtml':tplHtml,'tplData':tplData};
   	}
    
    ,genHtml:function(tplTmp){
    	var html ; 
    	if(Browser.Engine.trident4 == true){ // ie6
    		html = tplTmp.tplHtml.join(' ');
    	}else{
			var tpls = tplTmp.tplArray.join(' ');
			html =juicer2(tpls,tplTmp.tplData);
    		
    	}
    	
    	return html;
    }
    
    
    
    ,preparedTreeNode:function(tplIndex,tplInfo,tpl,data){
    	if(Browser.Engine.trident4 === true){ // ie6
    		tplInfo.tplHtml.push(juicer2(SwordBigTreeSwordBigTree.Template[tpl],data));
    		
    	}else{
    		tplInfo.tplArray.push("{@include "+tpl+" , "+tpl+"Data"+tplIndex+"}");
    		tplInfo.tplData[tpl+"Data"+tplIndex] = data;
    	}
    }
    
    ,preparedTreeNodeAfter:function(tplInfo){
    	if(Browser.Engine.trident4 === true){ // ie6
    		tplInfo.tplHtml.push(SwordBigTree.Template.divAfter);
    	}else{
    		tplInfo.tplArray.push(SwordBigTree.Template.divAfter);
    	}
    }
    
   
    

    /**
     * 展开收缩
     * @param {Object} item
     */
    ,extend:function(item,display) {
        if (this.isLazyExtend(item) ) {
			
            this.lazyExtend(item,null,null,display);
        } else {
        	
			if(!display || (display && display=="block")){
	        	var childrenElement = item.getFirst("span[type='wrapperSpan']").getNext("div[leaftype='"+this.leafTypeChildren+"']");
	            if ($defined(childrenElement)) {
	                var children = item.getFirst("span[type='wrapperSpan']");
	                var iconSpan = children.getFirst("span[type='iconSpan']");
	                var gadGetSpan = children.getFirst("span[type='gadGetSpan']");
	
	                if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
	                    if (this.options.autoShrink == "true") {
	                        if ($defined(this.shrinkNode)) {
	                            var p = this.getNode(gadGetSpan).getParent("div[leaftype!='"+this.leafTypeChildren+"']");
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
	                    this.setSpanClass(iconSpan, "iconSpan", this.options.treeStyle.treeCloseIcon); 
	                }
	                if (!gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
	                	childrenElement.setStyle("display", "block");
	                } else {
	                	childrenElement.setStyle("display", "none");
	                }
	                if ($defined($("div[id='" + SwordBigTree.Container.id + "']"))) {
	                    new Fx.Scroll($("div[id='" + SwordBigTree.Container.id + "']").getFirst("div"), {duration:50}).toElement(item);
	                }
	            }
			}
        }
    }
    
    /**
     * 添加节点
     * @param {Hash} hash
     */
    ,addTreeNode:function(hash, isLoad, item,callBackFunc,display) {
    	
    	var domArray = [];
        var dom;
        var tpNode;
        var node;
        if ($defined(item)) {
            tpNode = item;
        } else {
            tpNode = this.getSelectedNode() ;//||this.getRootNode();//todo,如果没有选择节点，默认在根节点下面添加
            if (this.isLazyTree() && tpNode && !tpNode.get(this.options.isLoadSign)) {
                var func = function(hash) {
                    var node = this.getTreeNode(hash);
                    this.setSpanClass(node, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(node, "iconSpan", this.options.treeStyle.treeCloseIcon);
                }.bind(this);
                this.lazyExtend(tpNode, func, hash);
                return;
            }
        }
        if ($type(hash) == "SwordBigTree.Iterator") {
            dom = hash;
            domArray.push(dom);	
            
        } else if($type(hash) == "array"){
            domArray = hash;
        }else{
        	dom = new SwordBigTree.JSONIterator(hash);
            dom.setLastSign(true);
            domArray.push(dom);	
        }
		
        var container;
        if ($defined(tpNode)) {

        	if ($defined(isLoad)) {
            	if(domArray.length==0){
                    this.setSpanClass(tpNode, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(tpNode, "iconSpan", this.options.treeStyle.treeLeafIcon);
                    if(callBackFunc){
                    	callBackFunc.run();
                    }
                    return;
            	}
            	
            }
            var element = this.beforeAddTreeNode(tpNode);
            var childrenElement = element.childrenElement;
            
            
            var tplTmp = this.createTmpArray();
            
            this.createNode(tpNode,tplTmp,domArray, tpNode.get("depth").toInt(),null,null,callBackFunc,display);
            
            tpNode.setProperty(this.options.isLoadSign, true);
            
            var gadGetSpan = element.gadGetSpan;
            if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                this.extend(tpNode,display);
            } 
            if (this.options.treeType == "1") {
                var span = tpNode.getFirst("span[type='wrapperSpan']");
                var checkSpan = span.getFirst("span[type='checkSpan']");
                if (checkSpan.hasClass(this.options.treeStyle.treeNodeChecked)) {
                    var checkState = this.getCheckedState(checkSpan);
                    this.checkedClick(node, checkState, false);
                    
                    //父节点选中时，懒加载的子节点也选中  // by zb : 金三的这个逻辑不对，暂注
//                    if(this.options.isCascadeCheckedClick == "true"){
//                        var childrenNodes = childrenElement.getElements('div.tree-node')
//                        if(childrenNodes) {
//                        	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
//                        	childrenNodes.set(this.options.checkSign,'true');
//                        }
//                    }
                }
            }
        } 
//        this.extendNodeByIdPath();
    }
    
    
    /**
     * 检验是否已经装载
     * @param target
     */
    ,isLazyExtend:function(node) {
        var isLoad = node.getAttribute(this.options.isLoadSign);
        return !isLoad && this.isLazyTree();
    }

    ,setSpanClass:function(item, spanType, spanClass) {
        if ($defined(item)) {
        	item = $(item);
            var span
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
    ,lazyExtend:function(item, callBack, params, display,isLazy) {
        
        var iterator = this.iterPathHash[item.getProperty(this.dataPathSign)];
        
        var data = this.getData(iterator);
        
        if(data.length == 0) item.setProperty("leaftype",'1');
        
        item.setProperty(this.options.isLoadSign, true);
        
        if(iterator.hasChildNodes())	item.setProperty("leaftype",'1');
        
        var func = function(iterator, tp, item, callBack, params,display) {
        	var callBackFunc = function(){
        		
	            if (callBack) {
	                return callBack(params);
	            }
        		
        	}.bind(this);
            this.addTreeNode(iterator.getChildNodes(), tp, item,callBackFunc,display);
            
            
        }.bind(this);
        if($defined(isLazy) && isLazy === false){
        	return func.run([iterator,false,item,callBack,params,display]);
        }else{
        	func.delay(this.options.openTimer, this, [iterator,false,item,callBack,params,display]);	
        }
        	

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
    	
    	if(this.options.isAutoExtendByIdPath ==="false"){
    	
	    	if(hash&&!$chk(this.childrenIdArray)){
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
    	}
    }
    ,extendByIdPathAfter: function(){
    	var t = this.swordTree;
    	var v = t.select.selBox.get('realvalue');
    	if(t&&v){
        	var hash = new Hash();
        	hash.set(this.options.cascadeSign.id, v);
        	t.findTreeNode(hash);
    	}
    }
    ,getData:function(iterator) {
    	var resData = iterator.getChildDatas();
        if(! resData ) return null;
        if (resData.length==0 && ($chk(this.options.ltid) || $chk(this.options.lctrl))) {
        	
        	var node = iterator.getAttributes();
        		
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
                    var data = pageContainer.getResData(this.options.treeContainerName, res);
                    resData = $defined(data)?data.data:[];
                    
			        iterator.add(resData);
			        	
                    if(resData.length==0){
                    	this.findTreeNode(node);
                    }
                }.bind(this)
                , 'onError'  :function (res) {
                }.bind(this)
                ,'onFinish':function(res){
                    this.fireEvent("onAfterLoadData",[node,res]);
                }.bind(this)
            });
        }else if(resData.length==0 && this.options.cacheLazy == 'true'){
        	if(this.swordTree.cacheTreeDataFunc && $chk(this.swordTree.options.cacheDataStr)){//扩展的数据接口,应该放在domfactory里
        		 var data = this.swordTree.cacheTreeDataFunc(this.swordTree.options.treeContainerName,this.swordTree.options.cacheDataStr,node.code);
                 resData = $defined(data)?data.data:[];
        	}
        }else{
        	this.fireEvent("onAfterLoadData",[node,resData]);
        }
        return resData;
    }
    
    ,dblClickEvent:function(event){
    	var target = event.target;	
    	if (target.tagName.test("span", "i")) {
    		var node = this.getNode(target);
            var type = target.get("type");
            if (type == "iconSpan"  ) {
            	this.fireEvent("onIconDblClick", event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"));	
            }else if (type == "displaySpan") {
            	this.fireEvent("onDblNodeClick", event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"));	
            }
    		
    	}
    }
    
    ,contextMenuEvent:function(event){
    	var target = event.target;	
    	if (target.tagName.test("span", "i")) {
    		var node = this.getNode(target);
            var type = target.get("type");
            if (type == "displaySpan"  ) {
            	this.fireEvent("onNodeContextMenu", [event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"),event]);
            }
    	}
    }

    /**
     * 点击触发事件
     * @param {Object} event
     */
    ,mouseDownEvent:function(event) {
        var target = event.target;
        if (target.tagName.test("span", "i")) {
            var node = this.getNode(target);
            var type = target.get("type");
            if (type == "gadGetSpan"  ) {
            	if(this.options.dataType!='xml'){
            		
            		this.extend(node);
            	}
            	this.fireEvent("onExpand", event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"));
            	
            }else if(type == "iconSpan"){
            	if(this.options.dataType!='xml'){
            		this.extend(node);
            	}
            	this.fireEvent("onIconClick", event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"));
            	
            }else if (type == "displaySpan") {
                if (this.options.autoExtendCaption == "true") {
                	if(this.options.dataType!='xml')
                		this.extend(node);
                }
                if ( event.event.button == 2 ){
		    		event.preventDefault();
		    		this.fireEvent("onRightClick", [event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"),event]);
		    		document.oncontextmenu = function() {return false;};  //阻止右键默认响应
		    	}
                
                this.selectNode(event);
                this.fireEvent("onNodeClick", event.target.getParent("div[leaftype!='"+this.leafTypeChildren+"']"));
                
            }else if(type == "checkSpan") {
                var node = this.getNode(target);
                //this.fireEvent("onCheckedBefore", node);
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
                this.fireEvent("onCheckedAfter", node);
                var tree = this.swordTree;
                
                if($chk(tree)){
                	var swordTreeSelect = tree.select;
                	if(swordTreeSelect){
	                	var isHideBtn = tree.options.isHideBtn;
	                	if(isHideBtn == "true"){
	                	   if(tree.options.selectrule == "leaf"){
	                       	
	                		   swordTreeSelect.selBox.set("value", this.swordTree.getAllChecked(this.options.displayTag,1));
	                           //  selectRealKey默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
	                           if(this.options.selectRealKey=="code"){
	                        	   swordTreeSelect.setRealValue(tree.getAllChecked(this.options.cascadeSign.id,1));
	                           }else{
	                        	   swordTreeSelect.setRealValue(tree.getAllChecked(this.options.selectRealKey,1));
	                           }
	                       } else {
	                       	
	                    	   swordTreeSelect.selBox.set("value", tree.getAllChecked(this.options.displayTag));
	                           //  selectRealKey默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
	                           if(this.options.selectRealKey=="code"){
	                        	   swordTreeSelect.setRealValue(tree.getAllChecked(this.options.cascadeSign.id));
	                           }else{
	                        	   swordTreeSelect.setRealValue(tree.getAllChecked(this.options.selectRealKey));
	                           }
	                       }
	                	   swordTreeSelect.tempCheckList = tree.getAllCheckedList();
	                	}
                	}
                }
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
    ,mousemoveEvent:function(event) {
        var target = event.target;
        SwordBigTree.Container.id = this.containerID;
        SwordBigTree.Container.mouseNode = target;
        SwordBigTree.Container.containerDraw.include(this.containerID, this);
        if (this.options.isHighlight == "true") {
            if (target.tagName.test("span", "i") && $(target).get("type") == "displaySpan") {
//                SwordTree.Container.mouseNode.setStyle("background-color", this.options.highlightColor);
                SwordBigTree.Container.mouseNode.addClass("treenode_hover");
            }
        }
    }

    ,mouseoutEvent:function(event) {

        if (this.options.isHighlight == "true") {
            if ($defined(SwordBigTree.Container.mouseNode)) {
//                SwordBigTree.Container.mouseNode.setStyle("background-color", "");
                 $(SwordBigTree.Container.mouseNode).removeClass("treenode_hover");
            }
        }
        SwordBigTree.Container.id = null;
        SwordBigTree.Container.mouseNode = null;
        SwordBigTree.Container.containerDraw.empty();
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
                var p2 = p1.getParent("div[leaftype!='"+this.leafTypeChildren+"']");
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
    ,checkedClick:function(pNode, state, sp, isHalfCheck,isRefreshChildren) {
        if (this.options.isCascadeCheckedClick == "false") {
            pNode.setProperty(this.options.checkSign, state == 1 ? 'true' : (state == 2 ? 'true' : 'false'));
            var node = pNode.getElements("span[type='checkSpan']")[0];
            if(!isHalfCheck){
            	this.changeCheckedState2(node, state);
            }
        } else {
            if ($defined(pNode)) {
                var fNode = pNode.getParent("div[leaftype='0']");

                if (sp) {
                    var children = pNode.getElements("span[type='checkSpan']");
                    children.each(function(node, index) {
                        if (state == 0) {
                            this.changeCheckedState(node, 0);
                        } else if (state == 1) {
                        	if(isHalfCheck){
                        		 this.changeCheckedState(node, 3,isRefreshChildren);
                        	}else{
                        		this.changeCheckedState(node, 2,isRefreshChildren);
                        	}
                        } else if (state == 2) {
                            this.changeCheckedState(node, 4);
                        }
                    }.bind(this));
                    var nodes = pNode.getElements("div[leaftype!='"+this.leafTypeChildren+"']").include(pNode);
                    nodes.each(function(item, index) {
                        item.setProperty(this.options.checkSign, state == 1 ? 'true' : (state == 2 ? 'true' : 'false'));
                    }.bind(this));
                }

                if ($defined(fNode)) {
                    var isChecked = false;  //兄弟节点无选中

                    var allNode = fNode.getFirst("div[leaftype='"+this.leafTypeChildren+"']").getChildren("div[leaftype!='"+this.leafTypeChildren+"'][" + this.options.noCheckSign + "!='true']") || [];
                    var chkNode = allNode.filter(function(item) {
                        return item.get(this.options.checkSign) == 'true';
                    }.bind(this));

                    var chkHalfNode = chkNode.filter(function(item) {
                        return item.get(this.options.checkSign) == 'true' && this.getSpan(item, 'checkSpan').hasClass(this.options.treeStyle.treeNodeHalfChecked);
                    }.bind(this));
                    //点击子节点 是否修改父节点半选中状态 或选中状态
                    if(!((state == 1 || state == 2) && chkHalfNode.length > 0 && allNode.length == chkNode.length )||(state == 1&&allNode.length == chkNode.length)) {

                        var allLength = allNode.length;
                        var chkLength = chkNode.length;

                        var checkSpan = this.getSpan(fNode, 'checkSpan');

                        if (state == 0 && chkLength > 0) {    //chk -halfchk
                            this.changeCheckedState(checkSpan, 1,false);

                        } else if (state == 0 && chkLength == 0) {   //chk -nochk
                            fNode.setProperty(this.options.checkSign, "false");
                            this.changeCheckedState(checkSpan, 5,false);

                        } else if (state == 1 && chkLength >= 0 && chkLength < allLength) {

                            fNode.setProperty(this.options.checkSign, "true");
                            this.changeCheckedState(checkSpan, 3,false);

                        } else if (state == 1 && chkLength == allLength) {
                            fNode.setProperty(this.options.checkSign, "true");
                            this.changeCheckedState(checkSpan, 4,false);

                        } else if (state == 2 && chkLength == allLength) {

                            this.changeCheckedState(checkSpan, 4,false);
                        }
                        this.checkedClick(fNode, state, false);
                    }
                }
            }
        }
    }
    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,changeCheckedState2:function(target, sign, isRefreshChildren) {
        if (sign == 0) { //选中 --》 不选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeUnchecked);

        } else if (sign == 1) {//不选中 --》选中
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeChecked);
        }
        var node ;
       	if($type(target)=="array"){
       		node = target;
       	}else{
       		node = [target];	
       	}
		node.each(function(item){
       		this.setNodeIteratorCheck(item.getParent().getParent(),sign==1,isRefreshChildren);
       	}.bind(this));
    }

    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,changeCheckedState:function(target, sign,isRefreshChildren) {
    	
        if (sign == 0) { //选中 --》 不选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeUnchecked);

        } else if (sign == 1) {//选中 --》半选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.addClass(this.options.treeStyle.treeNodeHalfChecked);

        } else if (sign == 2) {//不选中 --》选中
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeChecked);
        } else if (sign == 3) {//不选中 --》半选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.addClass(this.options.treeStyle.treeNodeHalfChecked);
        } else if (sign == 4) {//半选中 --》选中
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeChecked);
        }
        else if (sign == 5) {//半选中 --》不选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeUnchecked);
        }
      
        
       	if(sign!=1 ){
       		var node ;
	       	if($type(target)=="array"){
	       		node = target;
	       	}else{
	       		node = [target];	
	       	}
	       	
	       	node.each(function(item){
	       		this.setNodeIteratorCheck(item.getParent().getParent(),!(sign==0 || sign==5),isRefreshChildren);
	       	}.bind(this));
       	}
    }
    /**
     * 
     * @param {} node
     * @param {} ischeck
     * @param {} isRefreshChildren  是否递归设置子节点， 在默认数值回显时，不应递归，以数值为标准，在点击联动时应递归
     */
    ,setNodeIteratorCheck:function(node,ischeck,isRefreshChildren){
    	
    	var dataPath = node.getAttribute(this.dataPathSign);
		var nodeIterator = this.iterPathHash[dataPath];
		if(nodeIterator){
			
			var func = function(nodeIterator,ischeck){
				nodeIterator.setAttribute(this.options.checkSign , ischeck+"");
			}.bind(this);
			if(isRefreshChildren!==false ){
				this.recursionChildNodes(nodeIterator,func,[ischeck]);	
			}else{
				func.run([nodeIterator,ischeck]);	
			}
		}
    }
    
    
    /**
     * 预备添加节点   处理末节点样式。
     * @param treeNode
     */
    ,beforeAddTreeNode:function(treeNode) {
        var childrenElement = treeNode.getFirst("div[leaftype='"+this.leafTypeChildren+"']");
        var wrapperSpan = treeNode.getFirst("span[type='wrapperSpan']");
        var gadGetSpan = wrapperSpan.getFirst("span[type='gadGetSpan']");

        if ($defined(childrenElement)) {
            var lastChild = childrenElement.getLast("div[leaftype!='"+this.leafTypeChildren+"']");
            if ($defined(lastChild)) {
                lastChild.removeClass(this.options.treeStyle.treeNodeLast);
            }
        } 
//        else {
//            childrenElement = this.nodeEnum("div");
//            childrenElement.setProperty("leaftype",  this.leafTypeChildren );
//            childrenElement.addClass(this.options.treeStyle.treeChildren);
//            gadGetSpan.addClass(this.options.treeStyle.treeGadGetPlus);
//            treeNode.grab(childrenElement);
//        }
        treeNode.setProperty("leaftype", "0");
//        return {"childrenElement":childrenElement,"gadGetSpan":gadGetSpan};
        return {"gadGetSpan":gadGetSpan};
    }

    


    /**
     * 修改树节点
     * @param {Hash} oldNode
     * @param {Hash} newNode
     */
    ,updateTreeNode:function(oldNode, newNode) {
        var node = this.getTreeNode(oldNode);
        var res = false;
        if ($defined(node)) {
            newNode.getKeys().each(function(item) {
                if (item == this.options.displayTag) {
                    var displaySpan = node.getFirst("span[type='wrapperSpan']").getFirst("span[type='displaySpan']");
                    displaySpan.set("text", newNode.get(item));
                }
                node.setProperty(item, newNode.get(item));
            }.bind(this));
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
            array = ele.getElements("div[leaftype!='"+this.leafTypeChildren+"']" + query);
        } else {
            array = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']" + query);
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
            array = ele.getElements("div[leaftype!='"+this.leafTypeChildren+"']" + query);
        } else {
            array = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']" + query);
        }
        return array;
    }
    ,
    foundNode:null
    ,extendTreeNodeUtilFindNode:function(hash, ele) {
        var array;
        if ($chk(ele)) {
            array = ele.getElements("div[leaftype!='"+this.leafTypeChildren+"']");
        } else {
            array = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']");
        }
        var identity = this.options.cascadeSign.id;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            if (this.dom4nodeHash.has(item.get(identity))
                    && item.getElements("div[" + identity + "]").length == 0
                    && this.dom4nodeHash.get(item.get(identity)).hasChildNodes()) {

                var childrenElement = this.nodeEnum("div");
                childrenElement.setProperty("leaftype",  this.leafTypeChildren );
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
    	var pd = this.options.popdisplay;
    	if(!$defined(pd))pd = "{caption}";
    	var jo = {'code':dom.getAttribute(this.options.cascadeSign.id),'caption':dom.getAttribute(this.options.displayTag)};
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
        
        attributes.each(function(value,key){
        	element.setProperty(key, value);
            hashData.set(key, value);
        	
        }.bind(this));
        
        if ($defined(dom.getAttribute(this.options.displayTag))) {
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
                "click":function(){

			        if (!$type(element.getElement(".tree-children"))) {
			
			            element.setProperty(this.options.isLoadSign, true);
			            childrenElement.setProperty("leaftype", this.leafTypeChildren );
			
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
                        childrenElement.setProperty("leaftype",  this.leafTypeChildren );

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
        this.fireEvent("onCreateNode", element);
        return element;
    }
    ,hasChildren:function(hash) {
        var res = false;
        var tpNode = this.getSelectedNode();
        if (this.isLazyTree() && !tpNode.get(this.options.isLoadSign)) {
        	var res = false;
        	var array = [];
            var func = function(params) {
                var node = this.getTreeNode(params["hash"],params["node"]);
                if (node) {
//                    res = (node.getChildren("div[leaftype='"+this.leafTypeChildren+"']") || []).length > 0;
                    params["array"].push(node);
                }
            }.bind(this);
            this.lazyExtend(tpNode, func, {"hash":hash,"array":array,"node":tpNode},"none",false);
            res = array.length>0;
        } else {
            var node = this.getTreeNode(hash,tpNode);
            if (node) {
                res = (node.getChildren("div[leaftype='"+this.leafTypeChildren+"']") || []).length > 0;
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
         var elements = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']");
 		//TODO  2012/4/12
         /*搜索树节点时 ，如果是异步树则模拟展开根节点后再进行搜索（目前只是针对父子两层节点）*/
         for (var i = 0; i < elements.length; i++) {
         	var ele = elements[i].getElement("[type='gadGetSpan']");
         	if (ele.hasClass("tree-gadjet-plus")){
         		var domevent = window.event;
                var evobj;
         		if (!domevent){
                   if(document.createEvent){
                        domevent = document.createEvent("MouseEvents");
                        evobj  = new Event(domevent);
                    }else{
                        evobj={};
                    }
         		}else{
                     evobj={};
                 }
         		 evobj.target  = ele;
         		 this.clickEvent(evobj);
         	}
         }
         /*结束*/
         elements = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']");
         for (var i = 0; i < elements.length; i++) {         
             if(this.options.filterSign == "all"){
                  if(elements[i].get(this.options.displayTag).contains(value) || elements[i].get(this.options.cascadeSign.id).contains(value))
                      node.push(this.getNode(elements[i]));
             }else if(elements[i].get(key).contains(value))
                 node.push(this.getNode(elements[i]));
         }
         return node;
    }
    ,getLikeTreeNodeNew:function(hash) {
        var hs;
        if ($type(hash) != 'hash') {
            hs = new Hash(hash);
        } else {
            hs = hash;
        }
        var key = hs.getKeys()[0];
        var value = hs.get(key);
        var node = [];
        var elements = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']");
        for (var i = 0; i < elements.length; i++) {
            if(this.options.filterSign == "all"){
//                if(elements[i].get(this.options.displayTag).contains(value) || elements[i].get(this.options.cascadeSign.id).contains(value)){
            	
            	if(elements[i].get(this.options.displayTag).contains(value)){
                    node.push(this.getNode(elements[i]));
                }
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
        var node;
        if ($type(ele) == 'hash') {
            node = this.getTreeNode(ele);
        } else {
            node = ele;
        }

        if ($defined(node)) {

            var pNode = node.getPrevious("div[leaftype!='"+this.leafTypeChildren+"']");
            var cNode = node.getNext("div[leaftype!='"+this.leafTypeChildren+"']");
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

            if (this.options.treeType == "1") {

                if ($defined(fNode)) {
                    var span = fNode.getFirst("span[type='wrapperSpan']");
                    var checkSpan = span.getFirst("span[type='checkSpan']");
                    if (checkSpan.hasClass(this.options.treeStyle.treeNodeHalfChecked)) {
                        var tp = fNode.getFirst("div[leaftype='"+this.leafTypeChildren+"']");
                        var res = false;
                        if ($defined(tp)) {
                            var childNodes = fNode.getFirst("div[leaftype='"+this.leafTypeChildren+"']").getChildren("div");
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
                    childrenElement.setProperty("leaftype",  this.leafTypeChildren );
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
        if ($type(ele) == "object" ) {
        	ele = $H(ele);
        }
        if ($type(ele) == "hash" ) {
            node = this.getTreeNode(ele);
            //xml
            if (node == null && this.options.dataType == 'xml') {
                this.extendTreeNodeUtilFindNode(ele);
                node = this.foundNode;
            }
        } else {
            node = ele;
        }
        if($defined(node)){
        	
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
        
        return node;

    }
     /**
     * 隐藏所有的树节点
     */
    ,hiddenAllTreeNodes:function(){
        var allNodes = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']")||[] ;
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
        var allNodes = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']")|| [] ;
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
        var array = element.getElements("div[leaftype!='"+this.leafTypeChildren+"']" + query);
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
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @param {String} sign        连接标识符，默认 [#]
     * @return {String}
     */
    ,getAllChecked:function(key, isLeaf, sign, where) {
    	var str = "";
    	var array = [];
    	var rootIter = this.iterPathHash[this.iterRootKey];
    	if(!rootIter){
    		return str;
    	}
    	
    	this.getCheckOrUnCheck(rootIter,array,isLeaf,"checked");
    	
    	
    	if (!$defined(sign)) {
            sign = ",";
        }
        var res = [];
    	array.each(function(item){
    		res.push(item.getAttribute(key));
    	
    	});
    	
    	str = res.join(sign);
    	
        return str;
    }
    
    
    ,getCheckOrUnCheck:function(iterator,array,isLeaf,tag){
    	var func = function(nodeIterator,array,isLeaf,tag){
    		
    		var root = nodeIterator.isRoot;
    		if(root && root===true){
    			return;	
    		}
    		var check = nodeIterator.getAttribute(this.options.checkSign);
	    	var hasChild = nodeIterator.hasChildNodes();
			var res = false;
			if(isLeaf){
				
				if((isLeaf=="0" && hasChild===true) || (isLeaf=="1" && hasChild===false)){
					
					if(tag=="checked" && check=="true"){
						res = true;
					}else if(tag=="unchecked" && (check== undefined || check=="false")){
						res = true;
					}
				}
					
			}else{
				if(tag=="checked" && check=="true"){
					res = true;
				}else if(tag=="unchecked" && (check== undefined || check=="false")){
					res = true;
				}
			}
			if(res){
				array.push(nodeIterator);	
			}
			
    	}.bind(this);
    	
    	this.recursionChildNodes(iterator,func,[array,isLeaf,tag]);
    	
    }
    
    ,
    checkOrUnCheckList:function(isLeaf, where,tag){
    	
    	var eleArray = [];
    	var array = [];
    	var rootIter = this.iterPathHash[this.iterRootKey];
    	if(!rootIter){
    		return array;
    	}
    	this.getCheckOrUnCheck(rootIter,array,isLeaf,tag);
    	
    	for(var i=0;i<array.length;i++){
    		eleArray.push(new Element("div",array[i].getAttributes()));
    	}
        return eleArray;
        
    }

    /**
     * 获取当前选中的所有节点数组
     * @method getAllCheckedList
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @return {Array}
     */
    ,getAllCheckedList:function(isLeaf, where) {
        return this.checkOrUnCheckList(isLeaf, where,"checked");
    },
    getAllUnCheckedList:function(isLeaf, where){
    	return this.checkOrUnCheckList(isLeaf, where,"unchecked");
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
            if (parent == child.getParent("div[leaftype!='"+this.leafTypeChildren+"'][depth=" + k + "]")) {
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
    				item.setProperty(this.options.checkSign, "true");
    			}
            });
            this.initCheckedTree();
        }
    }
    
    /**
     * 设置半选中或选中的节点
     * @param array
     * @param isHalfCheck
     */
    ,setHalfOrCheckedList:function(array,isHalfCheck,isRefreshChildren){
    	  if ($defined(array) && $type(array) == "array") {
      		array.each(function(item) {
      			if ($defined(item)) {
      				item.setProperty(this.options.checkSign, "true");
      				var chkSpan = this.getSpan(item, "checkSpan");
                    var checkState = this.getCheckedState(chkSpan);
                    this.checkedClick(item, checkState, true, isHalfCheck,isRefreshChildren);
      			}
              }.bind(this));
//      		checkedList.each(function(item, index) {
//                var chkSpan = this.getSpan(item, "checkSpan");
//                var checkState = this.getCheckedState(chkSpan);
//                this.checkedClick(item, checkState, true, isHalfCheck);
//            }.bind(this));
      }
    }

    ,close:function() {
        var elements = this.container.getElements("div[leaftype!='"+this.leafTypeChildren+"']") || [];
        elements.each(function(item, index) {

            var depth = item.get("depth");
            if ($chk(depth) && depth >= this.options.extendLayer) {
                var span = this.getSpan(item, "iconSpan");
                if ($defined(span) && span.hasClass(this.options.treeStyle.treeOpenIcon) && item.get("leaftype") == "0") {
                    this.setSpanClass(item, "gadGetSpan", this.options.treeStyle.treeGadGetPlus);
                    this.setSpanClass(item, "iconSpan", this.options.treeStyle.treeLeafIcon);
                }
                var childDiv = item.getFirst("div[leaftype='"+this.leafTypeChildren+"']");
                if ($defined(childDiv)) {
                    childDiv.setStyle("display", "none");
                }
            }

        }.bind(this));
        this.unSelectNode();
    }

    ,appendRootNode:function(hash) {
        var dom = new SwordBigTree.JSONIterator(JSON.decode(hash));
        var div = new Element("div");
        div.addClass(this.options.treeStyle.treeChildren);
        div.setStyle("display", "block");
        div.setProperty("leaftype", this.leafTypeChildren );
        var node = this.createNode(div, dom, -1);
        if (this.container.getFirst("div[leaftype='"+this.leafTypeChildren+"']").getFirst("div")) {
            node.setProperty("leaftype", "0");
        }
        this.container.getFirst("div[leaftype='"+this.leafTypeChildren+"']").addClass(this.options.treeStyle.treeChildren);
        node.grab(this.container.getFirst("div[leaftype='"+this.leafTypeChildren+"']"));
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
            item = radio.getParent("span").getParent("div")
        }
        return item;
    }
    ,getRootNode:function() {
        var el = this.container.getElement("div[leaftype='"+this.leafTypeChildren+"']");
        if (el) {
            el = this.container.getElement("div[leaftype='"+this.leafTypeChildren+"']").getElement("div[leaftype!='"+this.leafTypeChildren+"']")
        } else {
            el = null;
        }
        return el;
    }
    //清空 选中状态
    ,clearCheckedStatus:function(){
    	//treeType=1
    	if(this.options.treeType==1){ 
			var allCheckedNodes = this.container.getElements("div[ischecked='true']")||[];
			allCheckedNodes.set('ischecked','false');
			var allCheckedSpans = this.container.getElements("span."+this.options.treeStyle.treeNodeChecked+"[type='checkSpan']")||[] ;
			allCheckedSpans.removeClass(this.options.treeStyle.treeNodeChecked);
			allCheckedSpans.addClass(this.options.treeStyle.treeNodeUnchecked);
			var allHalfCheckedSpans = this.container.getElements("span."+this.options.treeStyle.treeNodeHalfChecked+"[type='checkSpan']")||[] ;
			allHalfCheckedSpans.removeClass(this.options.treeStyle.treeNodeHalfChecked);
			allHalfCheckedSpans.addClass(this.options.treeStyle.treeNodeUnchecked);
			 
			var rootIter = this.iterPathHash[this.iterRootKey];
			if(rootIter){
				var func = function(iterator){
					iterator.setAttribute(this.options.checkSign,"false");
				}.bind(this);
		    	this.recursionChildNodes(rootIter,func);
			} 
	    }
    }
    ,setNodeChecked:function(array){
        if (this.options.treeType == "1" && $defined(array) && $type(array) == "array") {
            array.each(function(item) {
                item.setProperty("ischecked", "true");
                var chkSpan = this.getSpan(item, "checkSpan");
                chkSpan.removeClass(this.options.treeStyle.treeNodeUnchecked);
                chkSpan.removeClass(this.options.treeStyle.treeNodeHalfChecked);
                chkSpan.removeClass(this.options.treeStyle.treeNodeChecked);
                chkSpan.addClass(this.options.treeStyle.treeNodeChecked);
           		
                this.setNodeIteratorCheck(item,true,false);
        
            }.bind(this));
        }
    }
    ,getNodeCheckedStatus:function(node){
    	if (this.options.treeType == "1"){
    		var chkSpan = this.getSpan(node, "checkSpan");
    		return this.getCheckedState(chkSpan);
    	}
    }
    
    
    ,getAllNode:function(key, isLeaf, sign, splits) {
        var test = "div[leaftype!='"+this.leafTypeChildren+"']";

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
     * 递归对iterator进行操作
     */
    ,recursionChildNodes:function(iterator,func,args){
    	 
    	var nodes = iterator.getChildNodes();
    	var argArray = [iterator].extend(args||[]);
    	func.run(argArray);
    	
    	for(var i=0;i<nodes.length;i++){
    		
    		this.recursionChildNodes(nodes[i],func,args);
    	}
    }
    
    ,getParent:function(node){
        var pNode;
        if(node){
           pNode = node.getParent("div[leaftype='"+this.leafTypeChildren+"']").getParent("div[leaftype!='"+this.leafTypeChildren+"']");
        }
        return  pNode;
    }
    
    /**
     * 依据数组，装载树节点
     * @param {} nodes
     */
    ,loadTreeNodes:function(){
    	
    	
    	
    }
    
});


/**
 * 黑板
 * 用于标识鼠标访问的容器
 */
SwordBigTree.Container = {
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



