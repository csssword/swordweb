/**
  懒加载树 组件
  @class swordweb.widgets.SwordTree.SwordTree
  @implements Events
  @implements Options
 */
var SwordLazyTree = new Class({
	Implements:[Events,Options],
    Extends:SwordTree,
    name:"SwordLazyTree",
    $family: {name: 'SwordLazyTree'}
    ,options: {
    	name:"",
    	dataName:null,
        startLayer:"1",
        search:"false",
    	searchLength:"1",
    	searchTime:"0.5",
    	ltid:"",
        lctrl:"",
        stid:"",
        sctrl:"",
        onCreateNode:$empty,
        onNodeClick:$empty,
        onSubmitBefore:$empty,
        onSubmitAfter:$empty,
        onSearch:$empty
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
                    var select = new SwordLazyTree.Select(this.options, this, parent);
                    this.select = select;
                    this.select.build(this.container);
                }else{
                    this.select.isBuild=false;
                    this.select.buildTree(this.container);
                }
                Sword.utils.setWidth(Sword.utils.valPx(this.options.x)||Sword.utils.valPx(this.options.inputWidth),((parent)?parent.userSize:null),this.select.divTable,this.select.selBox,true);//0511
            } else {
                this.builder = new SwordLazyTree.Builder(this.container, this.options, this.$events);
                this.builder.build(this);
            }
        }
        //sword5
        if(!this.oel) this.oel = this.options.extendLayer ;
    	if(!this.oll) this.oll = this.options.lazyLayer ;
    	this.fireEvent("onFinish");
    }
    ,search:function(querystr){
    	var isToo=false;
    	if(this.options.checkbox =="true"){
			if(this.options.echoExtend == "true"){
				this.clearCheckedStatus();
			}else{
				this.clearCheckedStatus(true);
			}
		}
    	if(!this.searchdata&&this.builder.draw){
    		this.searchdata = this.builder.draw.dom.domainData;
    	}else{
    		var oObj=this.getOldDataObj();
    		if(!$chk(oObj)){return;}
    		this.searchdata=oObj.data;
    	}
    	if(this.options.select=="true"){
    		this.select.setRealValue("");
    		var st = this.select.treeDiv.getElement("span.tree-name");
    		if(st&&st.hasClass("nothing")) st.destroy();
        }
    	var submitObj = pageContainer.create("SwordSubmit");
    	var data=null;
    	if(querystr){
    		submitObj.pushData("queryText",querystr);
			var opts={mask:'false',async:"false",loaddata:"widget"};
    		if($chk(this.options.onSearch)){
    			var tempSubmitObj=this.getFunc(this.options.onSearch)[0](querystr);
				if($type(tempSubmitObj)=="SwordSubmit"){
					submitObj=tempSubmitObj;
					if(!$chk(submitObj.options.tid)){opts.tid=this.options.stid;}
					if(!$chk(submitObj.options.ctrl)){opts.ctrl=this.options.sctrl;}
					var resData=submitObj.submit(opts);
					data=resData.getData(this.options.dataName);
				}else{
					opts.tid=this.options.stid;
					opts.ctrl=this.options.sctrl;
					if($chk(opts.tid)||$chk(opts.ctrl)){
						var resData=submitObj.submit(opts);
						data=resData.getData(this.options.dataName);
					}
				}
    		}else{
				opts.tid=this.options.stid;
				opts.ctrl=this.options.sctrl;
				if($chk(opts.tid)||$chk(opts.ctrl)){
					var resData=submitObj.submit(opts);
					data=resData.getData(this.options.dataName);
				}
			}
			if($chk(data)){
				var dl=data.data.length;
				if(dl==0)data=null;
				if(dl>1000){
	    			isToo=true;
	    			data=null;
	    		}
			}
		 }else{
			 data = "root";
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
    			var sp=".", b=0;
    			if(data.data[0].ccm===undefined){
    				sp=",";
    				data.data.each(function(item){
    					if(!$chk(this.treeDataHash.get(item.code))){this.treeDataHash.set(item.code, item);}
    	    		}.bind(this));
    				data.data.each(function(item){
    					this.setNodeDataCCM(item,"",item);
    	    		}.bind(this));
    			}
    			data.data.each(function(item){
    				var cl=item.ccm.split(sp).length;
    				if(cl>b){
    					b=cl;
    				}
    			});
    			if(sp==",")b++;
    			this.options.lazyLayer=b;
    			this.options.extendLayer=b;
    			this.reloadTree(data,true);
     			this.container.getElements("div.tree-node").filter(function(item){
     				if(item.get("caption").contains(querystr)){
     					item.setStyle("color","#C60A00");
     				}
     			});
     		}
    	}
 		if(this.options.checkbox =="true"&&$type(this.options.dataStr)=="string"){
     		this.options.dataStr=JSON.decode(this.options.dataStr);
     	}
 	
    }
    ,addDataToTreeHash:function(treeArray){
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
		this.treeArray.combine(treeArray);
	}
});

SwordLazyTree.Builder=new Class({
	Extends:SwordTree.Builder,
	$family: {name: 'SwordLazyTree.Builder'}
	,Implements:[Options,Events]
    /**
	 * 绘画工厂  重构绘画工厂
	 * @param {Object} dom
	 */
	,drawFactory:function(options, tree){
		var draw = new SwordLazyTree.Draw(options, tree);
        return draw;
    }
});
SwordLazyTree.Draw = new Class({
	Extends:SwordTree.Draw,
    $family: {name: 'SwordLazyTree.Draw'},
	Implements:[Events,Options]
    ,getData:function(node){
    	var resData=null;
    	if ($chk(this.options.ltid) || $chk(this.options.lctrl)) {
        	 var submitObj = pageContainer.create("SwordSubmit");
        	 var nodeData=node.getClean();
        	 var temp={};
        	 for(var key in nodeData){
        		 temp[key]={value:nodeData[key]};
        	 }
        	 var data = {"sword":"SwordForm",
 					"name":this.options.treeContainerName,
 					"data":temp
 					};
        	 submitObj.pushData(data);
        	 var opts={mask:'false',async:"false",loaddata:"widget"};
    		 if($chk(this.options.onSubmitBefore)){
    			var tempSubmitObj=this.getFunc(this.options.onSubmitBefore)[0](node);
    			if($type(tempSubmitObj)=="SwordSubmit"){
    				submitObj=tempSubmitObj;
					if(!$chk(submitObj.options.tid)){opts.tid=this.options.ltid;}
					if(!$chk(submitObj.options.ctrl)){opts.ctrl=this.options.lctrl;}
					 resData=submitObj.submit(opts);
				}else{
					if($chk(this.options.ltid)||$chk(this.options.lctrl)){
        				opts.tid=this.options.ltid;
     					opts.ctrl=this.options.lctrl;
     					resData=submitObj.submit(opts);
        			}else{
    					swordAlert("没有设置有效的懒加载数据参数.");
    					return;
    				}
    			}
    		 }else{
    			 if($chk(this.options.ltid)||$chk(this.options.lctrl)){
    				opts.tid=this.options.ltid;
 					opts.ctrl=this.options.lctrl;
 					resData=submitObj.submit(opts);
    			 }else{
 					swordAlert("没有设置有效的懒加载数据参数.");
 					return;
 				}
    		 }
    		 
    		 if($chk(this.options.onSubmitAfter)){
    			 var tResData=this.getFunc(this.options.onSubmitAfter)[0](node,resData);
    			 if($chk(tResData)){
    				 resData=tResData;
     			 }
    		 }
    		 resData=resData.getData(this.options.dataName);
    		 if($chk(resData)){
	    		 resData=resData.data;
	    		 this.swordTree.addDataToTreeHash(resData);
    		 }else{
    			 resData=[]; 
    		 }
    	}
    	return resData;
    }
    ,lazyExtend:function(item, callBack, params, isDelay) {
        this.setSpanClass(item, "iconSpan", this.options.treeStyle.treeGadjetLoad);
        var node = item.retrieve("data");
        var iterator = new SwordLazyTree.JSONAptitudeIterator(node, item.get("depth").toInt(),this.swordTree);
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

    },
    setNodeDataCheckState:function(tcode,state,eachArr,treeDataHs,domNodeHs,arrDataHs) {
    	var treeDataItem = treeDataHs.get(tcode)||{};
		var domNodeItem = domNodeHs.get(tcode)||{};
		var arrNodeItem = arrDataHs?arrDataHs.get(tcode)||{}:null;
    	if(!eachArr&&$chk(treeDataHs)&&$chk(treeDataHs)){
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
});
SwordLazyTree.Select=new Class({
	Extends:SwordTree.Select,
    $family: {name: 'SwordLazyTree.Select'},
	Implements:[Events,Options]
    ,buildTree:function() {
        if (!this.isBuild) {
        	if(this.swordTree.exTreeDataFunc && !$chk(this.swordTree.options.dataStr)){//扩展的数据接口,应该放在domfactory里
        		this.swordTree.options.dataStr = this.swordTree.exTreeDataFunc();
        	}
            this.swordTree.container = this.treeDiv;
            this.swordTree.builder = new SwordLazyTree.Builder(this.treeDiv, this.swordTree.options, this.swordTree.$events);
            this.swordTree.builder.build(this.swordTree);
            this.isBuild = true;
        }
    }
});
SwordLazyTree.JSONAptitudeIterator=new Class({
	Extends:SwordTree.JSONAptitudeIterator,
    $family: {name: 'SwordTree.Iterator'},//todo:这里不取名为'SwordLazyTree.JSONAptitudeIterator'的原因是为了不重写addTreeNode接口:
	Implements:[Events,Options]
    ,getChildNodes:function(rootPcode) {
    	var array = [];
        if (this.dataDepth == 0) {//root的时候
        	this.dataDepth++;
        	this.treeObj.treeArray.each(function(t){
        		if(t.ccm==""){
        			var it = new SwordLazyTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
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
            			var it = new SwordLazyTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
                        it.setLastSign(false);
                        array.push(it);
                        it.setParent(this);
                        it.setDomainData(this.domainData);
                    }
            	}.bind(this));
        	}else{
        		var tempCArray=this.treeObj.getChildForNodeData(this.node)||this.domainData;
        		tempCArray.each(function(t){
	        		var it = new SwordLazyTree.JSONAptitudeIterator(t, this.dataDepth,this.treeObj);
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
});
/*重写此函数创建对应的迭代器*/
SwordTree.Iterator.newInstance = function(node, type, cascadeSign,tree) {
	var instance = null;
	SwordTree.Iterator.treeNodeNum = 0;
	if ($chk(type) && 'json'.test(type.trim(), 'i')) {
		instance = new SwordTree.JSONIterator(node || {}, 0);
	} else if ($chk(type) && 'jsonAptitude'.test(type.trim(), 'i')) {
		var data = [];
		if ($defined(node) && $defined(node.data)) {
			data = node.data;
		}else{ 
			return null;//没有数据时
		}
		if($type(tree)=="SwordLazyTree"){
			instance = new SwordLazyTree.JSONAptitudeIterator(data, 0,tree);		
		}else{
					
			instance = new SwordTree.JSONAptitudeIterator(data, 0,tree);
		}
		instance.setDomainData(data);
		instance.setParentSign(cascadeSign.id, cascadeSign.pid, node);
	} else {
		instance = new SwordTree.XMLIterator(node, 0);
	}
	return instance;
}; 