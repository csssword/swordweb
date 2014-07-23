/**
 * 处理树拖拽
 */
SwordBigTree.Drag = new Class({

    $family: {name: 'SwordBigTree.Drag'}

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

        this.current = SwordBigTree.Drag.current;
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
            if (SwordBigTree.Drag.current) {
                document.addEvent('keydown', this.bound.keydown);
                var dragSpan = this.swordTreeDraw.getSpan(SwordBigTree.Drag.current, "displaySpan").addClass(this.options.dragStyle.treeDragCurrent);
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
                    this.addGhost(event);
                }else{
                    this.tpDragNode = false;
                    event.stopPropagation();
                }
            }
        }, true);

        this.addEvent('complete', function() {
            if (SwordBigTree.Drag.current && this.tpDragNode) {
                document.removeEvent('keydown', this.bound.keydown);
                if ($defined(this.swordTreeDraw.getSpan(SwordBigTree.Drag.current, "displaySpan"))) {
                    this.swordTreeDraw.getSpan(SwordBigTree.Drag.current, "displaySpan").removeClass(this.options.dragStyle.treeDragCurrent);
                }
                var startZone = SwordBigTree.Drag.startZone;
                if (startZone) {
                    if (SwordBigTree.Drag.ghost) {
                        this.rDestory(SwordBigTree.Drag.ghost);
                        startZone.beforeDrop();
                    }
                    if ($defined(SwordBigTree.Container.mouseNode)) {
                        this.fireEvent("onDragComplete", this.swordTreeDraw.getNode(SwordBigTree.Container.mouseNode));

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
            var zone = SwordBigTree.Drag.startZone;
            if (zone) zone.where = 'notAllowed';
            this.stop(event);
        }
    }

    ,start: function(event) {//mousedown
		
        if ($defined(SwordBigTree.Drag.ghost)) {
            this.rDestory(SwordBigTree.Drag.ghost);
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
            this.startTarget = target;
            SwordBigTree.Drag.current = this.current;
            SwordBigTree.Drag.startZone = this;
            this.fireEvent('start', event).fireEvent('snap', this.element);
        }
    }


    ,drag: function(event) {
        if ($defined(SwordBigTree.Drag.ghost)) {
            SwordBigTree.Drag.ghost.position({x:event.page.x + 10,y:event.page.y + 10});
            var dropZone = SwordBigTree.Drag.startZone;
            if (!dropZone || !dropZone.ondrag) return;
            SwordBigTree.Drag.startZone.ondrag(event);
        }
    }

    ,ondrag: function(event) {
        var target = SwordBigTree.Container.mouseNode;
        if (!$defined(target)) {
            if ($defined(event) && event.target.tagName == "DIV" && (event.target.get("leaftype") == "root" || event.target.get("sword") == "SwordBigTree" )) {
                if (event.target.get("leaftype") == "root") {
                    target = event.target;
                } else if (event.target.get("sword") == "SwordBigTree") {
                    target = event.target.getFirst("div[leaftype='root']");
                }
                SwordBigTree.Container.mouseNode = target;
            } else {
                this.changeGhostState(1);
                return;
            }
        }
        var tp = true;
        if (this.dragContainer.length > 0) {
            if (!this.dragContainer.contains(SwordBigTree.Container.id)) {
                tp = false;
            }
        }
        if (tp && $defined(target)) {

            if (target.tagName.test("span", "i") && $defined(this.swordTreeDraw.targetNode)) {
                if (target.get("type") == "displaySpan" && target != this.swordTreeDraw.targetNode) {

                    if (this.swordTreeDraw.isParent(this.swordTreeDraw.getNode(target), this.swordTreeDraw.getNode(this.startTarget))) {
                        this.changeGhostState(1);
                    } else {
                        this.changeGhostState(0);
                    }

                } else if (target.get("type") == "iconSpan" || target.get("type") == "gadGetSpan") {
                    if (target.get("type") == "iconSpan" && target != this.swordTreeDraw.targetNode.getPrevious()) {
                        if (this.swordTreeDraw.isParent(this.swordTreeDraw.getNode(target), this.swordTreeDraw.getNode(this.startTarget))) {
                            this.changeGhostState(1);
                        } else {
                            this.changeGhostState(0);
                        }
                    }

                    if (this.tempTarget != target) {
                        this.tempTarget = target;
                        if (target.hasClass(this.swordTreeDraw.options.treeStyle.treeLeafIcon) ||
                            target.hasClass(this.swordTreeDraw.options.treeStyle.treeGadGetPlus)) {
                            var draw = SwordBigTree.Container.containerDraw.get(SwordBigTree.Container.id);
                            if ($defined(draw)) {
                                draw.extend.delay(this.options.openTimer, draw, this.swordTreeDraw.getNode(target));
                            }
                        }
                    }
                } else {
                    this.changeGhostState(1);
                }
            } else {

                if (target.get("leaftype") == 'root') {
                    if (target.getFirst("div").getChildren("div").length == 0) {
                        this.changeGhostState(0);
                    } else {
                        this.changeGhostState(1);
                    }
                } else {
                    this.changeGhostState(1);
                }
            }
        }
        this.fireEvent('drag');
        this.fireEvent('onDragMove',[this,target]);
    }
    /**
     * 更新克隆状态
     * @param state  0---允许  1---不允许
     */
    ,changeGhostState:function(state) {
        if (state == 0) {
            SwordBigTree.Drag.ghost.removeClass(this.options.dragStyle.treeGhostNotAllowed);
            SwordBigTree.Drag.ghost.addClass(this.options.dragStyle.treeGhostInside);
        } else {
            SwordBigTree.Drag.ghost.removeClass(this.options.dragStyle.treeGhostInside);
            SwordBigTree.Drag.ghost.addClass(this.options.dragStyle.treeGhostNotAllowed);
        }
    }
    /**
     */
    ,addGhost: function(event) {
        var ghost = new Element('span').addClass(this.options.dragStyle.treeGhost);

        var span = this.swordTreeDraw.getSpan(this.current);
        var displaySpan = span.displaySpan;
        var iconSpan = span.iconSpan;
        var hash = new Hash();
        hash.set(this.swordTreeDraw.options.displayTag, this.current.get(this.swordTreeDraw.options.displayTag));

        var dom = new SwordBigTree.JSONIterator(hash);
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
        SwordBigTree.Drag.ghost = ghost;
    }

    ,beforeDrop: function() {
        var tp = true;

        if ($defined(SwordBigTree.Container.mouseNode) && $chk(this.options.existRules) && SwordBigTree.Drag.ghost.hasClass(this.options.dragStyle.treeGhostInside)
                && SwordBigTree.Container.mouseNode.get("leaftype") != 'root') {

            var root = this.swordTreeDraw.getRoot(SwordBigTree.Container.mouseNode);
            var draw = SwordBigTree.Container.containerDraw.get(SwordBigTree.Container.id);

            if ($defined(draw) && this.swordTreeDraw.containerID!=SwordBigTree.Container.containerDraw.getValues()[0].containerID &&
                $chk(draw.options.existRules)) {
                var srcArray = this.swordTreeDraw.options.existRules.split(",") || [];

                var toArray = draw.options.existRules.split(",") || [];
                var query = new Hash();
                var startNode = this.swordTreeDraw.getNode(this.startTarget);
                var elements = [startNode];
                elements.extend(startNode.getElements("div[leaftype!='100']"));

                for (var i = 0; i < elements.length; i++) {
                    for (var k = 0; k < toArray.length; k++) {
                        if ($defined(srcArray[k])) {
                            query.set(toArray[k], elements[i].get(srcArray[k]));
                        }
                    }
                    if ($defined(this.swordTreeDraw.getChildNode(root, query))) {
                        alert("节点:[" + elements[i].get(this.swordTreeDraw.options.displayTag) + "]已经存在!");
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
        if (SwordBigTree.Drag.ghost.hasClass(this.options.dragStyle.treeGhostInside)) {

            this.swordTreeDraw.unSelectNode();
            var newel=this.dragTreeNode(this.startTarget, SwordBigTree.Container.mouseNode);
            this.fireEvent('onDragSuccess',[newel,this.startTarget,SwordBigTree.Container.mouseNode]);
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
        var draw = SwordBigTree.Container.containerDraw.get(SwordBigTree.Container.id);

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
            toNode.getFirst("div[leaftype='100']").grab(srcCP);
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






