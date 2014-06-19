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
        this.reset();
    }

    ,initParam:function() {
        this.options.startLayer = this.options.startLayer.toInt();
        this.options.extendLayer = this.options.extendLayer.toInt();

        this.options.lazyLayer = this.options.lazyLayer.toInt();
        this.options.startLayer = this.options.startLayer < 0 ? 0 : this.options.startLayer;

        this.options.extendLayer = this.options.extendLayer < 0 ? 10000 : this.options.extendLayer;
        if ($chk(this.options.ltid) && this.options.lazyLayer == 0) {
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
        return (this.options.lazyLayer > 0 && "jsonAptitude".test(this.options.dataType, 'i') ) || $chk(this.options.ltid)||this.options.cacheLazy == 'true';
    }

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
        switch (this.options.treeType) {
            case '1':
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
                            checkSpan.addClass(this.options.treeStyle.treeNodeUnchecked);
                        }
                    }

                }
                break;
            case '2':
                radioSpan = this.nodeEnum("radio");
                radioSpan.addClass(this.options.treeStyle.treeRadio);
                break;
        }

        var iconSpan = this.nodeEnum("iconSpan");
        iconSpan.addClass(this.options.treeStyle.treeIcon);
        iconSpan.innerHTML = this.space;

        iconSpan.addEvents({
            "click":function(event) {
                this.fireEvent("onIconClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
            ,"dblclick":function(event) {
                this.fireEvent("onIconDblClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
        });

        var displaySpan = this.nodeEnum("displaySpan");
        displaySpan.addClass(this.options.treeStyle.treeName);

        displaySpan.addEvents({
            "click":function(event) {
                this.fireEvent("onNodeClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
            ,"dblclick":function(event) {
                this.fireEvent("onDblNodeClick", event.target.getParent("div[leaftype!='-1']"));
            }.bind(this)
            ,"contextmenu":function(event) {
                this.fireEvent("onNodeContextMenu", [event.target.getParent("div[leaftype!='-1']"),event]);
                //return false;
            }.bind(this)
            ,"mousedown":function(event){
            	if ( event.event.button == 2 ){
            		event.preventDefault();
            		this.fireEvent("onRightClick", [event.target.getParent("div[leaftype!='-1']"),event]);
            		document.oncontextmenu = function() {return false;};  //阻止右键默认响应
            	}
            }.bind(this)
        });

        //构造节点文本
        if ($defined(dom.getAttribute(this.options.displayTag))) {
            displaySpan.innerHTML = this.dealCaption(dom);//dom.getAttribute(this.options.displayTag);
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
        if ($defined(dom.getAttribute(this.options.displayTag))) {
            element.setProperty("title", this.dealCaption(dom));//dom.getAttribute(this.options.displayTag));
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
                            if(this.options.treeType == "1" && this.options.isCascadeCheckedClick == "true" && this.getSpan(element,"checkSpan").hasClass(this.options.treeStyle.treeNodeChecked)) {
                                var childrenNodes = childrenElement.getElements('div.tree-node')
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
                            if(this.options.treeType == "1" && this.options.isCascadeCheckedClick == "true" && this.getSpan(element,"checkSpan").hasClass(this.options.treeStyle.treeNodeChecked)) {
                                var childrenNodes = childrenElement.getElements('div.tree-node')
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
        if (depth > this.options.startLayer || this.options.startLayer == 0) {
            if (this.isLazyTree() && $defined(isLoad) && depth == this.startDepth) {
                container.adopt(childrenElement.getChildren("div"));
                this.fireEvent("onLazyNodesAppend",[this,container]);
            } else {
                container.grab(element);
                this.fireEvent("onCreateNode",element);
                if(isLast)this.fireEvent("onAfterCreateChildNodes");
            }
        } else if (depth == this.options.startLayer) {
            this.container.grab(container);
            this.fireEvent("onCreateNode",element);
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
                    if (this.options.autoShrink == "true") {
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
    ,lazyExtend:function(item, callBack, params, isDelay) {
        this.setSpanClass(item, "iconSpan", this.options.treeStyle.treeGadjetLoad);
        var node = item.retrieve("data");
        var iterator = new SwordTree.JSONAptitudeIterator(node, item.get("depth").toInt());
        var data = this.getData(node);
        iterator.domainData.extend(data);
        item.setProperty(this.options.isLoadSign, true);
        if(data.length==0)item.setProperty("leaftype",'1');
        this.startDepth = item.get("depth").toInt() - 1;
        var func = function(iterator, tp, item, callBack, params) {
            this.addTreeNode(iterator, tp, item);
            var stree = this.swordTree; 
            if($chk(stree)){
            	var seltree = stree.select;
            	if($chk(seltree)){
            		var sb = seltree.selBox;
                	if ($chk(sb.get("value"))) {
                		if(stree.options.treeType==1){
//                			var rv = $splat(sb.get('realvalue').split(','));
//                			rv.each(function(r){
//                				var q = new Hash();
//        	                    q.set(stree.options.cascadeSign.id, r);
//        	                    checkl.include(stree.getTreeNode(q));
//                			});
                			var sbPath = sb.get("checkPath");
                			if($chk(sbPath)){
                				var checkl = [];
                    			var halfCheck = [];
                				var checkArr = sbPath.split("|");
                    			checkArr.each(function(check,index){
                    					var checkSp = check.split(",");
                    					var pIndex = checkSp.indexOf(iterator.node.code) + 1;
                    					if(pIndex != 0){
                    						var q = new Hash();
                    						if(pIndex < checkSp.length){
                    							q.set(stree.options.cascadeSign.id, checkSp[pIndex]);
                            					if(checkSp.length == pIndex + 1){
                            						checkl.include(stree.getTreeNode(q));
                            					}else{
                            						halfCheck.include(stree.getTreeNode(q));
                            					}
                    						}
                    					}
//                        				if(rv.contains(check)){
//                        					 checkl.include(stree.getTreeNode(q));
//                        				}else{
//                        					halfCheck.include(stree.getTreeNode(q));
//                        				}
                    			});
//                    			stree.clearCheckedStatus();
                    			if(checkl.length != 0){
                                	stree.setHalfOrCheckedList(checkl);
                                } 
                                if(halfCheck.length != 0){
                                	stree.setHalfOrCheckedList(halfCheck, true);
                                }
                			}
//                			stree.setCheckedList(checkl);
                	     }
                	}
            	}
            }
            if (callBack) {
                return callBack(params);
            }
        }.bind(this);
        if (!$defined(isDelay)) {
            func.delay(this.options.lazyTime, this, [iterator,false,item,callBack,params]);
        } else {
            return func(iterator, false, item, callBack, params);
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
    ,extendByIdPathAfter: function(){
    	var t = this.swordTree;
    	var v = t.select.selBox.get('realvalue');
    	if(t&&v){
        	var hash = new Hash();
        	hash.set(this.options.cascadeSign.id, v);
        	t.findTreeNode(hash);
    	}
    }
    ,getData:function(node) {
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
                    var data = pageContainer.getResData(this.options.treeContainerName, res);
                    resData = $defined(data)?data.data:[];
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

    /**
     * 点击触发事件
     * @param {Object} event
     */
    ,toggleClick:function(event) {
        var target = event.target;
        if (target.tagName.test("span", "i")) {
            var node = this.getNode(target);
            var type = target.get("type");
            if (type == "gadGetSpan" || type == "iconSpan") {
            	if(this.options.dataType!='xml'){
            		this.extend(node);
            	}
            } else if (type == "checkSpan") {
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
            } else if (type == "displaySpan") {
                if (this.options.autoExtendCaption == "true") {
                	if(this.options.dataType!='xml')
                		this.extend(node);
                }
                this.selectNode(event);
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
    ,checkedClick:function(pNode, state, sp, isHalfCheck) {
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
                        		 this.changeCheckedState(node, 3);
                        	}else{
                        		this.changeCheckedState(node, 2);
                        	}
                        } else if (state == 2) {
                            this.changeCheckedState(node, 4);
                        }
                    }.bind(this));
                    var nodes = pNode.getElements("div[leaftype!='-1']").include(pNode);
                    nodes.each(function(item, index) {
                        item.setProperty(this.options.checkSign, state == 1 ? 'true' : (state == 2 ? 'true' : 'false'));
                    }.bind(this));
                }

                if ($defined(fNode)) {
                    var isChecked = false;  //兄弟节点无选中

                    var allNode = fNode.getFirst("div[leaftype='-1']").getChildren("div[leaftype!='-1'][" + this.options.noCheckSign + "!='true']") || [];
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
                            this.changeCheckedState(checkSpan, 1);

                        } else if (state == 0 && chkLength == 0) {   //chk -nochk
                            fNode.setProperty(this.options.checkSign, "false");
                            this.changeCheckedState(checkSpan, 5);

                        } else if (state == 1 && chkLength >= 0 && chkLength < allLength) {

                            fNode.setProperty(this.options.checkSign, "true");
                            this.changeCheckedState(checkSpan, 3);

                        } else if (state == 1 && chkLength == allLength) {
                            fNode.setProperty(this.options.checkSign, "true");
                            this.changeCheckedState(checkSpan, 4);

                        } else if (state == 2 && chkLength == allLength) {

                            this.changeCheckedState(checkSpan, 4);
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
    ,changeCheckedState2:function(target, sign) {

        if (sign == 0) { //选中 --》 不选中
            target.removeClass(this.options.treeStyle.treeNodeChecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeUnchecked);

        } else if (sign == 1) {//不选中 --》选中
            target.removeClass(this.options.treeStyle.treeNodeUnchecked);
            target.removeClass(this.options.treeStyle.treeNodeHalfChecked);
            target.addClass(this.options.treeStyle.treeNodeChecked);
        }
    }

    /**
     * @param {Object} target
     * @param {Object} sign
     */
    ,changeCheckedState:function(target, sign) {

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
            if (this.isLazyTree() && !tpNode.get(this.options.isLoadSign)) {
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
            if (this.options.treeType == "1") {
                var span = tpNode.getFirst("span[type='wrapperSpan']");
                var checkSpan = span.getFirst("span[type='checkSpan']");
                if (checkSpan.hasClass(this.options.treeStyle.treeNodeChecked)) {
                    var checkState = this.getCheckedState(checkSpan);
                    this.checkedClick(node, checkState, false);
                    //父节点选中时，懒加载的子节点也选中
                    if(this.options.isCascadeCheckedClick == "true"){
                        var childrenNodes = childrenElement.getElements('div.tree-node')
                        if(childrenNodes) {
                        	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
                        	childrenNodes.set(this.options.checkSign,'true');
                        }
                    }
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
        for (var k = 0; k < attributes.length; k++) {
            element.setProperty(attributes[k].nodeName, attributes[k].nodeValue);
            hashData.set(attributes[k].nodeName, attributes[k].nodeValue);
        }
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
        this.fireEvent("onCreateNode", element);
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
         		 this.toggleClick(evobj);
         	}
         }
         /*结束*/
         elements = this.container.getElements("div[leaftype!='-1']");
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
        var elements = this.container.getElements("div[leaftype!='-1']");
        for (var i = 0; i < elements.length; i++) {
            if(this.options.filterSign == "all"){
                if(elements[i].get(this.options.displayTag).contains(value) || elements[i].get(this.options.cascadeSign.id).contains(value))
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
        var node;
        if ($type(ele) == 'hash') {
            node = this.getTreeNode(ele);
        } else {
            node = ele;
        }

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

            if (this.options.treeType == "1") {

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
     * @param {String} isLeaf  取叶节点还是叶子节点   isLeaf: 0 叶节点   1 叶子节点
     * @param {String} sign        连接标识符，默认 [#]
     * @return {String}
     */
    ,getAllChecked:function(key, isLeaf, sign, where) {
        var test = "div[ischecked='true']";
        if (where) {
            test += where;
        }
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
            var keys = []
            if(key.contains("|"))
                keys = key.split("|");
            var len = keys.length;
            array.each(function(item, index) {
                if(len >0){
                   keys.each(function(item1, index) {
                       str = str + item.get(item1) + "|";
                   });
                   str = str.substring(0, str.length -1);
                   str = str + sign;
                }else
                    str = str + item.get(key) + sign;
            }.bind(this));
            if (array.length > 0) {
                str = str.substring(0, str.length - sign.length);
            }
        }
        return str;
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
    
    /**
     * 设置半选中或选中的节点
     * @param array
     * @param isHalfCheck
     */
    ,setHalfOrCheckedList:function(array,isHalfCheck){
    	  if ($defined(array) && $type(array) == "array") {
      		array.each(function(item) {
      			if ($defined(item)) {
      				item.setProperty("ischecked", "true");
      				var chkSpan = this.getSpan(item, "checkSpan");
                    var checkState = this.getCheckedState(chkSpan);
                    this.checkedClick(item, checkState, true, isHalfCheck);
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
            item = radio.getParent("span").getParent("div")
        }
        return item;
    }
    ,getRootNode:function() {
        var el = this.container.getElement("div[leaftype='-1']");
        if (el) {
            el = this.container.getElement("div[leaftype='-1']").getElement("div[leaftype!='-1']")
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
            }.bind(this));
        }
    }
    ,getNodeCheckedStatus:function(node){
    	if (this.options.treeType == "1"){
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



