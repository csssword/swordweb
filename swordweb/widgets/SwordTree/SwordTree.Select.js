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
    	/*if(parent && parent.name == 'SwordForm'){
    		var iw = tree.item.get("inputWidth");
            if($defined(iw)) {
                options.inputWidth = iw.contains('%')? iw : iw.toInt() + "px";
            } else if(parent.userSize&&parent.userSize.FiledWidth){
            	var w = parent.userSize.FiledWidth;
            	options.inputWidth = w.contains('%')? w :(w.toInt() - 17) + "px";
            } else{//默认宽度改为100%
            	options.inputWidth = '100%';
            }
    	}*/  //0511
        this.setOptions(options);
        this.swordTree = tree;
        //无懒加载服务标识时,lazySelect=false
        if(!this.swordTree.options.ltid && !this.swordTree.options.lctrl&&this.swordTree.options.cacheLazy!="true")
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
    	var gel=container.getElement("table.swordtree_wrap"),isG=!!gel;
    	if(isG){
    		this.divTable = container.getElement("table.swordtree_wrap");
    	}else{
    		this.divTable = Sword.utils.createTable(this,true,true).addClass('swordtree_wrap');
    		container.grab(this.divTable);
        }
        var treeDiv = new Element("div", {'class':this.options.treeStyle.treeSelectListInner});
        treeDiv.set("id", container.get("id"));
        this.listDiv = new Element("div", {'class':this.options.treeStyle.treeSelectList}).inject(document.body);
        this.listDiv.grab(treeDiv);
        if (this.options.treeType == "1") {
            var console = new Element("div", {'class':this.options.treeStyle.treeSelectConsole});
            this.console = console;
            if(this.swordTree.options.isHideBtn == "true"){
                this.console.setStyle('display','none'); 
            }
            var btnOk = new Element("button");
            this.btnOk = btnOk;
            btnOk.set("html", "确定");
            Sword.utils.btn.init(btnOk);
            var btnCancel = new Element("button");
            this.btnCancel = btnCancel;
            btnCancel.set("html", "关闭");
            Sword.utils.btn.init(btnCancel);
            console.grab(btnOk);
            console.grab(btnCancel);
            this.listDiv.grab(console);
        }
//        var w = this.options.inputWidth;  //0511
        if(isG){
        	this.selBox = container.getElement("input[id]");
        }else{
        	this.selBox =	new Element('input', {
	            'type' : 'text',
	            'swordType' :'tree',
	            'rule' : this.options.rule,
	            'name' : container.get("name"),
	            'display':"true",
	            'realvalue':"",
	            'widget':"tree",
	            'evnSign':"true",
	            'widgetGetValue':'true',
	            //            'readonly':this.options.selReadOnly=="true",
	            'disabled':(this.options.selReadOnly == "true" || this.options.disable == "true"),
	            'styles':{
	//                'width':w    //0511
	                'cursor':"text"
	            }
	            ,'class':this.options.formSubSign
	        	}).inject(this.boxtd);
        }
        //先存下数据
        this.storeTid();
        this.selBox.store('widgetObj',this);//向input存入对象
        if(isG){
        	this.selDiv=container.getElement("td.tree-select-selimg");
        }else{
        	this.selDiv=this.imgtd;
        	this.selDiv.addClass(this.options.treeStyle.treeSelectSelimg);
            /*this.selDiv = new Element('div', {'class':this.options.treeStyle.treeSelectSelimg,
                'styles':{'float':'left'}
            }).inject(this.imgtd);*/
        }
        if (this.options.selReadOnly == "true" || this.options.disable == "true") {
            this.selBox.setStyle("cursor", "default");
        }
        if (this.options.disable == "true") {
            this.disable(this.selBox);
        }
//        this.divTable.setStyle('width',w.contains('%') ? w : 'auto'); //0511
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
    },
    gridShow:function(){
    	var cellEl=this.selBox.getParent("div.sGrid_data_row_item_div");
        this.fireEvent("onClickBefore",[{},cellEl]);
        this.clickBefore();
        this.selInput();
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
        this.selBox.addEvent("focus", function(arg1,modelTag) {
        	  if(this.swordTree.inGrid==true){
        		  var cellEl;
        		  if($chk(modelTag)){
        			  cellEl = arg1.target;
        		  }else{
        			  cellEl = arg1.target.getParent("div.sGrid_data_row_item_div");
        		  }
                  this.fireEvent("onClickBefore",[{},cellEl]);
             }else{    this.fireEvent("onClickBefore");      }
              //this.fireEvent("onClickBefore");
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
        }.bind(this));
        this.selBox.addEvent("blur", this.selectBlur.bind(this));
        this.selDiv.addEvent("click", function() {
            this.fireEvent("onClickBefore");
            this.clickBefore();
            this.leaveSign = false;
            this.selInput();
        }.bind(this));
        this.listDiv.addEvent("mouseenter", this.mouseenter.bind(this));
        this.listDiv.addEvent("mouseleave", this.mouseleave.bind(this));
        this.swordTree.addEvent("onNodeClick", this.getSelectedNode.bind(this));

        if (this.options.treeType == "1") {
            this.btnOk.addEvent("click", function() {  
            	//TODO sbmitcontent 没有处理
                if(this.swordTree.options.selectrule == "leaf"){
                    this.selBox.set("value", this.swordTree.getAllChecked(this.options.displayTag,1));
                    //  selectRealKey默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                    if(this.options.selectRealKey=="code"){
                        this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id,1));
                    }else{
                        this.setRealValue(this.swordTree.getAllChecked(this.options.selectRealKey,1));
                    }
                } else {
                    this.selBox.set("value", this.swordTree.getAllChecked(this.options.displayTag));
                    //  selectRealKey默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                    if(this.options.selectRealKey=="code"){
                        this.setRealValue(this.swordTree.getAllChecked(this.options.cascadeSign.id));
                    }else{
                        this.setRealValue(this.swordTree.getAllChecked(this.options.selectRealKey));
                    }
                }

                this.tempCheckList = this.swordTree.getAllCheckedList();
                this.selInput();
                this.fireEvent("onSelectBtnOk", this.selBox);
            }.bind(this));
            this.btnCancel.addEvent("click", function() {
                this.selInput();
                this.fireEvent("onSelectBtnCancel");
            }.bind(this));

        }
        /**
        if (Browser.Engine.trident) {
            this.selBox.attachEvent('onpropertychange', function(event) {
                if (this.selBox.get("evnSign") == "true") {
                    if (this.selBox != document.activeElement) {
                        return;
                    }
                    if (event.propertyName != 'value') return;
                    if (event.srcElement.originValue == event.srcElement.value) return;    //判断是否用户改变了输入值
                    event.srcElement.originValue = event.srcElement.value;               //更新原始值的副本
                    //this.findTreeNode(this.filterSign);
                    this.processValueChange(event.srcElement.value);
                }
            }.bind(this));

        } else {//ff
            this.selBox.addEventListener('input', function(event) {
                //this.findTreeNode(this.filterSign);
                if (event.target.originValue == event.target.value) return;    //判断是否用户改变了输入值
                event.target.originValue = event.target.value;               //更新原始值的副本

                this.processValueChange(event.target.value);

            }.bind(this), false);
        }
        */
        this.selBox.addEvent('keyup', function(event) {
        	this.keyDown(event);
        }.bind(this));
        //}
    }
    ,clickBefore: function(gridcp){
    	var cp = gridcp||this.selBox.get('codePath');
    	if(cp){
    		if(!$chk(gridcp)){//表格里不要做这个操作
    			this.show();
    			this.hide();
	    	}
	    	var hash = new Hash();
	    	cp = gridcp||this.selBox.get('codePath'); ///不要删除，因为其他地方可能修改了codePath
	    	hash.set(this.options.cascadeSign.id, cp.split(','));
	    	this.swordTree.builder.draw.extendNodeByIdPath(hash);
	    	this.selBox.set('codePath', '');//定位后清空
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
        	var filterSign = this.swordTree.options.filterSign;
        	this.swordTree.options.filterSign ='all';
        	this.swordTree.builder.draw.options.filterSign ='all';
        	this.findTreeNodes(this.swordTree.options.filterSign);
        	this.swordTree.options.filterSign = filterSign;
        	this.swordTree.builder.draw.options.filterSign = filterSign;
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
            case 8:
                var oldValue = this.getValue()==null?"":this.getValue();
                var newValue =  event.target.value;
                if(oldValue!=newValue){
                    this.fireEvent("onSelectChange",[newValue, oldValue]);
                }
                this.setRealValue('');
                this.selBox.value = '';
                if (this.options.treeType == "1") {
                	var t = this.swordTree;
                	t.clearCheckedStatus();
                }
                this.processValueChange(event.target.value);
                //this.findTreeNodes(this.filterSign);
                break;
            case 13:
            	 var node = this.swordTree.getSelectedNode();
                 if ($defined(node)) {
                	 this.fireEvent("onNodeClick",node);
                 }
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
            	if (event.target.originValue == event.target.value) return;    //判断是否用户改变了输入值
                //this.fireEvent("onSelectChange",[event.target.value, event.target.originValue]);
            	event.target.set('originValue',event.target.value);            //ff 必须set()?
            	this.processValueChange(event.target.value);
                break;
        }
    }
    /**
     * 回选
     */
    ,getSelectedNode:function() {
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
            	if(this.swordTree.options.treeType==1)return;
                this.setSelectedNode(node, inputValue);
            }else{
                //否则展开该节点
                this.swordTree.builder.draw.extend(node);
            }
        }
    }

    ,setSelectedNode:function(node, inputValue) {
        if ($defined(node)) {
            if($type(node)=="array"&&node.length>=1){
                   var codetemp=[],captiontemp=[];
                   node.each(function(item){
                       codetemp.include(item.get(this.swordTree.options.selectRealKey)||"");
                       captiontemp.include(item.get(this.swordTree.options.displayTag)||"");
                   }.bind(this));
                   this.setValue(captiontemp.join(","));
                   this.setRealValue(codetemp.join(","));
                   this.tempCheckList = node;
                   this.selInput();
                   this.selInput();
            }else{
                node = $$(node);
                var value = node.get(this.swordTree.options.displayTag);
                //this.setRealValue(node.get(this.swordTree.options.selectRealKey));
                //selectRealKey默认值为code，如果用户没有重新定义此值就按照this.options.cascadeSign.id获取回传的数据
                if(this.swordTree.options.selectRealKey=="code"){
                    var oldValue = this.getValue();
                    var newValue =  node.get(this.swordTree.options.selectRealKey);
                    if(oldValue!=newValue){
                        this.fireEvent("onSelectChange",[newValue, oldValue]);
                    }
                     this.setRealValue(newValue);
                     if(node.length==0)this.swordTree.clearCheckedStatus();//去掉下拉树节点的选中状态
                }else{
                      var keys = [];
                      var key = this.swordTree.options.selectRealKey;
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
                this.tempCheckList = node;
                this.selBox.value = value;
                this.selBox.value = (inputValue == null) ? value : inputValue;
                this.selBox.store('treeData',node.retrieve('data'));
                this.hide();
                this.swordTree.unSelectNode();
            }
        }
    }

    /**
     * 查找
     */
    ,findTreeNode:function(filterSign) {
        if (this.selBox.get("display") == "true") {
            this.show();
        }
        var hash = new Hash();
        if ($defined(filterSign)) {
            if (filterSign == "caption")
                hash.set(this.swordTree.options.displayTag, this.selBox.value);
            else if (filterSign == "code")
                hash.set(this.swordTree.options.cascadeSign.id, this.selBox.get('realvalue'));
            else
                hash.set(filterSign, this.selBox.value);
        } else {
            hash.set(this.swordTree.options.displayTag, this.selBox.value);
        }
        var nodes = this.swordTree.getLikeTreeNodeNew(hash);
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
                hash.set(this.swordTree.options.displayTag, this.selBox.value);
            else if (filterSign == "code")
                hash.set(this.swordTree.options.cascadeSign.id, this.selBox.get('realvalue'));
            else
                hash.set(filterSign, this.selBox.value);
        } else {
            hash.set(this.swordTree.options.displayTag, this.selBox.value);
        }
        var nodes = this.swordTree.getLikeTreeNodeNew(hash);
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
        	if (this.selBox.get("display") == "false") this.hide();
        }

    }
    /**
     * 设置显隐
     */
    ,selInput:function() {
    	var sb = this.selBox;
    	var t = this.swordTree;
        if (sb.get("display") == "false") {
            this.hide();
        } else {
            this.show();
            //懒加载下拉树赋值
        	if ($chk(sb.get("value"))) {
        		if(t.options.treeType==1){
        			var checkl = [];
        			var halfCheck = [];
        			var rv = $splat(sb.get('realvalue').split(','));
        			rv.each(function(r){
        				var q = new Hash();
                        q.set(t.options.cascadeSign.id, r);
                        var findNode = t.getTreeNode(q);
                        if($chk(findNode)){
                        	checkl.include(findNode);
                        }else{
                        	var checkp = sb.get("checkPath");
                        	if($chk(checkp)){
                        		var pcode = checkp.split("|");
                            	pcode.each(function(p){
                            		var codeArr = p.split(",");
                            		var pHash = new Hash();
                            		pHash.set(t.options.cascadeSign.id, codeArr[0]);
                            		 var halfNode = t.getTreeNode(pHash);
                            		 halfCheck.include(halfNode);
                            	});
                        	}
                        }
                        t.clearCheckedStatus();
                        if(checkl.length != 0){
                        	t.setHalfOrCheckedList(checkl);
                        }
                        if(halfCheck.length != 0){
                        	t.setHalfOrCheckedList(halfCheck, true);
                        }
//        				cl.include(t.getTreeNode(q));
        			});
        		}else{
            		if(this.options.lazySelect=='true' && !sb.get("originValue") && ($chk(this.options.qtid) || $chk(this.options.qctrl))){
    	            	this.hide();
    	            	this.emptyTid();
    	                var params = {'inputValue':sb.get("value")};
    	                t.options.dataStr = this.queryData(params);
    	            	this.isBuild = false;
                	}
                	this.findTreeNode(t.options.filterSign);
        		}
            }
            this.fireEvent("onSelectShow");
            //this.selBox.focus();
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
		this.selBox.store('cacheLazy',this.swordTree.options.cacheLazy)
		this.selBox.store('ctrl',this.swordTree.options.ctrl)
		this.selBox.store('lctrl',this.swordTree.options.lctrl)
    }
    ,retrieveTid:function(){
    	this.swordTree.options.tid = this.selBox.retrieve('tid');
    	this.swordTree.options.ltid = this.selBox.retrieve('ltid');
    	this.swordTree.options.cacheLazy = this.selBox.retrieve('cacheLazy');
    	this.swordTree.options.ctrl = this.selBox.retrieve('ctrl');
    	this.swordTree.options.lctrl = this.selBox.retrieve('lctrl');
    }
    ,buildTree:function() {
        if (!this.isBuild) {
        	if(this.swordTree.exTreeDataFunc && !$chk(this.swordTree.options.dataStr)&&!$chk(this.swordTree.options.tid)&&!$chk(this.swordTree.options.ctrl)){//扩展的数据接口,应该放在domfactory里
        		if(this.swordTree.options.cacheLazy=="true"){
        			this.swordTree.options.cacheDataStr = this.swordTree.exTreeDataFunc();
        			var realValue = this.selBox.get("realvalue");
        			if($chk(realValue))this.swordTree.cacheTreeCodePath(realValue,this.swordTree.options.cacheDataStr,this.selBox);
        			this.swordTree.options.dataStr = this.swordTree.cacheTreeDataFunc(this.swordTree.options.treeContainerName,this.swordTree.options.cacheDataStr);
        		}else{
            		this.swordTree.options.dataStr = this.swordTree.exTreeDataFunc();
        		}
        	}
            this.swordTree.container = this.treeDiv;
            this.swordTree.builder = new SwordTree.Builder(this.treeDiv, this.swordTree.options, this.swordTree.$events);
            this.swordTree.builder.build(this.swordTree);
            this.isBuild = true;
        }
    }

    ,show:function() {
        this.buildTree();
        if(this.selBox.getWidth()==0){
        	return;
        }
        this.listDiv.setStyles({
            //'left':this.selBox._getPosition().x,
            'width':$chk(this.options.width) ? this.options.width : this.selBox.getWidth() + 15
        });

        xyposition(this.selBox, this.listDiv);

        this.listDiv.setStyle("display", "block");
        this.listDiv.fade("in");
        this.selBox.set("display", "false");
    }

    ,hide:function() {
        this.listDiv.setStyles({'left':'-500px','top':'-500px'});
        this.listDiv.setStyle("display", "none");
        this.listDiv.fade("out");
        this.selBox.set("display", "true");
        var node = this.swordTree.getSelectedNode();
        this.tempCheckList = this.swordTree.getAllCheckedList();
        if($chk(this.getCaption())&&$defined(node)&&((this.swordTree.options.selectrule == "leaf" && node.get("leaftype") == 1) || (this.swordTree.options.selectrule == "all"))){
        	var caption = node.get('caption');
        	if(caption.contains(this.getCaption())){
        		if(this.options.selectRealKey=="code"){
        			this.setRealValue(node.get('code'));
        		}else{ 
        			 var keys = [];
                     var key = this.options.selectRealKey;
                     if(key.contains("|")){
                    	 keys = key.split("|");
                    	 var str = "";
                    	 keys.each(function(item, index) {
                             str = str + node.get(item) + "|";
                           });
                    	 str = str.substring(0, str.length - 1);
                    	 this.setRealValue(str);
                     }else this.setRealValue(node.get(key))};
        		this.setValue(caption);
        	}
        }else if((!$defined(node) && (this.swordTree.options.treeType=="1" && (!this.tempCheckList ||(this.tempCheckList && this.tempCheckList.length==0))))||( $defined(node)&&!$chk(this.getCaption()))){//没选中节点  清空  
        	this.setRealValue("");
    		this.setValue("");
    		this.swordTree.clearCheckedStatus();
        }
        this.validateBox(this.selBox);
        this.fireEvent("onSelectHide", [this.selBox]);

        this.swordTree.removeTreeFilterHiddenClass();

    }

    ,clear:function() {
        this.selBox.realvalue = "";

        this.findNodes.empty();
        this.showIndex = 0;
        this.swordTree.close();
        this.swordTree.removeTreeFilterHiddenClass();
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
    	return imgdiv.getPrevious().getElement('.swordform_item_oprate');
    },
    getImgEl:function(inputEl){//根据input找到imgdiv
    	return inputEl.getParent().getNext();
    }
    ,
    disable:function(inputEl) {
        if($defined(inputEl)) {
             inputEl.set('disabled', 'true').addClass('tree_input_disable').setStyle('background-color','');
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
            var rule = inputEl.get('rule');
            if($defined(rule) && rule.contains('must'))inputEl.setStyle('background-color','#b5e3df');
        }
    }
});