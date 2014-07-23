/**
 * 数据迭代器
 * new tree
 * @author Administrator
 */

SwordBigTree.Iterator = new Class({

	$family : {
		name : 'SwordBigTree.Iterator'
	}
	/**
	 * 被迭代节点
	 */
	,
	node : $empty
	/**
	 *
	 */
	,
	iterator : $empty
	/**
	 * 是否末节点
	 */
	,
	lastSign : true
	/**
	 * 数据深度
	 */
	,
	dataDetph : 0
	,
	domainData : []
	,
	isRoot: false
	/**
	 * 父亲
	 * @type 
	 */
	,
	pIterator:null
	,
	initialize : function(node, depth) {

		/**
		 * Abstract 由子类实现
		 */
		if (node) {
			this.init(node);
		}
		if ($defined(depth)) {
			this.dataDepth = ++depth;
		}
	}

	/**
	 * 是否有子节点
	 */
	,
	hasChildNodes : $lambda(false)

	/**
	 * 是否父节点下的最后一个节点
	 */
	,
	isLast : $lambda(true)

	/**
	 * 获取节点属性集
	 */
	,
	getAttributes : $empty
	/**
	 * 获取节点某一属性
	 */
	,
	getAttribute : $empty

	/**
	 * 获取子节点迭代器
	 */
	,
	getChildNodes : $empty
	
	/**
	 * 获取子节点数据
	 * @type 
	 */
	,
	getChildDatas : $empty

	,
	getModelData: function(){
		return this.domainData
	}
	
	,
	setParentSign : function(code, pcode) {
		SwordBigTree.Iterator.code = code;
		SwordBigTree.Iterator.pcode = pcode;

	}
	
	,setRoot: function(isRoot){
		
		this.isRoot = isRoot
	}
	
	,setParent: function(pIterator){
		this.pIterator = pIterator;
		
	}
	
	,getParent:function(){
		var p = null;
		if(this.isRoot === false){
			p = this.pIterator;
		}
		return p;
	}
	

});

SwordBigTree.Iterator.newInstance = function(node, type, cascadeSign) {
	var instance = null;
	if ($chk(type) && 'json'.test(type.trim(), 'i')) {
		var data = [];
		if ($defined(node) && $defined(node.data)) {
			data = node.data;

			instance = new SwordBigTree.JSONIterator(node || {}, 0);
			
			instance.setDomainData(node);
		}

	} else if ($chk(type) && 'jsonAptitude'.test(type.trim(), 'i')) {
		var data = [];
		if ($defined(node) && $defined(node.data)) {
			data = node.data;
		} else
			return null;//没有数据时

		instance = new SwordBigTree.JSONAptitudeIterator(data, 0);
		instance.setDomainData(data);
		instance.setParentSign(cascadeSign.id, cascadeSign.pid, node);
	} else {
		instance = new SwordBigTree.XMLIterator(node, 0);
	}
	instance.setRoot(true);
	return instance;
};

/**
 * xml迭代器
 */
SwordBigTree.XMLIterator = new Class({
	Extends : SwordBigTree.Iterator

	,
	setLastSign : function(sign) {
		this.lastSign = sign;
	}

	,
	init : function(node) {
		this.node = node;
	}

	,
	hasChildNodes : function() {
		return this.node.hasChildNodes();
	}

	,
	getChildNodes : function() {
		var nodes = new Array();
		this.dataDepth++;
		for (var k = 0; k < this.node.childNodes.length; k++) {
			if ((/[^\t\n\r ]/.test(this.node.childNodes[k].data))) {
				var it = new SwordBigTree.XMLIterator(
						this.node.childNodes[k], this.dataDepth);
				it.setLastSign(false);
				nodes.push(it);
			}
		}
		if (nodes.length > 0) {
			nodes[nodes.length - 1].setLastSign(true);
		}
		return nodes;
	}

	,
	getAttributes : function() {

		return this.node.attributes;
	}

	,
	getAttribute : function(key) {
		return this.node.getAttribute(key);
	}

	,
	isLast : function() {
		if (this.node.parentNode == null
				|| this.node.parentNode.nodeName == "#document"
				|| this.lastSign)
			return true;
		return false;
	}
});

/**
 * JSON迭代器
 */
SwordBigTree.JSONIterator = new Class({
	Extends : SwordBigTree.Iterator
	/**
	 * 数据容器中的唯一标识
	 * @type 
	 */
	,
	dataModelKey : null

	/**
	 * 用于缓存当前属性，避免每次都查询
	 */
	,
	attributes : null

	/**
	 * 数据访问路径
	 * @type 
	 */
	,
	dataPath : null
	
	,isChildNodes: null
	
	,childNodes:[]

	,
	constant : {
		Status : "_status",
		DataPath : "dataPath",
		LastSign : "lastSign"
	}
	
	
	/**
	 * 设置数据容器标识，从哪里取
	 * @param {} dataModelKey
	 */
	,
	setDataModelKey : function(dataModelKey) {
		this.dataModelKey = dataModelKey;
	}

	/**
	 * 设置数据 gps 定位
	 * @param {} dataPath
	 */
	,
	setDataPath : function(dataPath) {
		this.dataPath = dataPath;
	}
	
	,getDataPath:function(){
		return this.dataPath;
	}

	/**
	 * 对数据进行处理
	 */
	,
	setDomainData : function(data) {
		
		this.domainData = data;
	}

	,
	init : function(node) {
		if (node) {
			var dataModel = new Sword.data.SwordDataModel({
						'key' : node.name,
						'reader' : new SwordBigTree.TreeDataReader()
					});
			dataModel.setData(node);

			this.setDataModelKey(dataModel.getKey());
		}

	}

	,
	getModelData : function() {
//		var data;
//		var dataModel = Sword.data.container.getModel(this.dataModelKey);
//		if (dataModel) {
//			data = dataModel.getReader().findByPath(this.dataPath);
//		}
//		return data;
		return this.domainData;
	}

	,
	hasChildNodes : function() {
		
		if(this.isChildNodes===null){
			var data = this.getModelData();
			var res = false;
			if (data) {
				for (var key in data) {
					if ($type(data[key]) == 'array') {
						res = true;
						break;
					}
				}
			}
			this.isChildNodes = res;
		}

		return this.isChildNodes;
	}
	
	,add:function(data){
		if(data && data.length>0){
			var itData = this.getModelData();
			var childrenArray = itData['children'];
			if(childrenArray){
				childrenArray.extend(data);
			}else{
				itData['children'] = data;
			}
			
//			var status = data[this.constant.Status];
//			if (!status) {
//				data[this.constant.Status] = {};
//				status = data[this.constant.Status];
//			}
//			var curDataPath = status[this.constant.DataPath] || "";
//			curDataPath = (this.dataPath || "") + "['" + key + "']";
//			
//			var s = {};
//			s[this.constant.DataPath] = curDataPath + "[" + i + "]";
//			s[this.constant.LastSign] = (value.length == i + 1);
//			data[this.constant.Status] = s;
//			
//			var it = new SwordBigTree.JSONIterator();
//			it.setDataModelKey(this.dataModelKey);
//			it.setDataPath(s[this.constant.DataPath]);
//			
//			it.setDomainData(value[i]);
//			
//			this.childNodes.push(it);
			
			this.isChildNodes = true;
		}
		
	}
	,getChildDatas:function(){
		return [];
	}
	
	,
	getChildNodes : function() {
		
		if(this.childNodes.length==0){
			var data = this.getModelData();
	
			if (data) {
				for (var key in data) {
					var value = data[key];
	
					if ($type(value) == "array") {
	
//						var status = data[this.constant.Status];
//						if (!status) {
//							data[this.constant.Status] = {};
//							status = data[this.constant.Status];
//						}
//						var curDataPath = status[this.constant.DataPath] || "";
//						curDataPath = (this.dataPath || "") + "['" + key + "']";
//						status[this.constant.DataPath] = curDataPath;
						
						for (var i = 0; i < value.length; i++) {
							
							var it = new SwordBigTree.JSONIterator(null,this.dataDepth+1);
							it.setDataModelKey(this.dataModelKey);
							it.setDataPath(this.dataDepth+"-"+i); 
							it.setDomainData(value[i]);
							it.setLastSign((value.length == i + 1));
							it.setParent(this);
							
							this.childNodes.push(it);
							
						}
					}
				}
			}
		}
		return this.childNodes;
	}
	,setAttribute:function(key,value){
		if(this.attributes == null){
			this.getAttributes();
		}	
		this.attributes[key] = value;
		var data = this.getModelData();
		data[key] = value;
	}
	,
	getAttributes : function() {
		if (!this.attributes) {
			
			var data = this.getModelData();
			if (data) {

				this.attributes = {};
				for (var key in data) {
					var value = data[key];
					switch ($type(value)) {
						case 'string' :
						case 'number' :
						case 'boolean' :
							this.attributes[key] = value;
					}
				}
			}
		}
		return this.attributes;
	}
	,
	getAttribute : function(key) {
		var res;
		if (!this.attributes) {
			this.getAttributes();
		}
		if (this.attributes) {
			res = this.attributes[key];
		}
		return res;
	}
	,setLastSign : function(lastSign){
		this.lastSign = lastSign;
	}
	,
	isLast : function() {
		return this.lastSign;
	}
	
	
});

/**
 * 智能处理json数据，数据无需满足树的标准格式
 */
SwordBigTree.JSONAptitudeIterator = new Class({
	Extends : SwordBigTree.Iterator

	/**
	 * 当前指向的元素
	 * @param node
	 */
	,
	current : null
	/**
	 * 数据访问路径
	 * @type 
	 */
	,
	dataPath : null
	,
	init : function(node) {
		this.node = node;

	}
	
	/**
	 * 设置数据 gps 定位
	 * @param {} dataPath
	 */
	,setDataPath : function(dataPath) {
		this.dataPath = dataPath + $random(10000000, 99999999);
	}
	
	,getDataPath:function(){
		return this.dataPath;
	}
	
	
	,setLastSign : function(sign) {
		this.lastSign = sign;
	}
	
	,hasChildNodes : function() {
		var sip = SwordBigTree.Iterator.pcode;
		var sic = SwordBigTree.Iterator.code;
		if (this.dataDepth == 0) {
			return this.domainData.length > 0;
		} else {
			var nCode = this.node[sic] || this.node[sic.toUpperCase()];
			return this.domainData.some(function(item) {
						return (item[sip] || item[sip.toUpperCase()]) == nCode
								&& (item[sic] || item[sic.toUpperCase()]) != nCode;
					}, this);
		}
	},
	setDomainData : function(data) {
		this.domainData = data;
	}
	
	,add:function(data){
		if(data){
			this.domainData.extend(data);
		}
	}
	
	/**
	 * 获取子节点数据
	 * @return []
	 */
	,getChildDatas: function(){
		
		var j =0;
    	var resData = new Array();
    	var cp = SwordBigTree.Iterator.pcode;
		var ci = SwordBigTree.Iterator.code;
		var attrs = this.getAttributes();
    	for(var i=0;i<this.domainData.length;i++){
    		var nd = this.domainData[i];
    		if((nd[cp]||nd[cp.toUpperCase()]) == (attrs[ci]||attrs[ci.toUpperCase()])){
    			 resData[j++] = nd;
    		}
    	}
    	return resData;
		
	}
	,
	getChildNodes : function(rootPcode) {
		var sip = SwordBigTree.Iterator.pcode;
		var sic = SwordBigTree.Iterator.code;
		var array = new Array();
		if (this.dataDepth == 0) {
			this.dataDepth++;
			if ($defined(this.domainData) && this.domainData.length > 0) {
				for (var i = 0; i < this.domainData.length; i++) {
					var tp = true;
					if (rootPcode != null) {
						var p = this.domainData[i][sip]
								|| this.domainData[i][sip.toUpperCase()];
						if (rootPcode == "null") {
							tp = p == 'null' || p == null;
						} else {
							tp = p == rootPcode;
						}
					} else {
						for (var j = 0; j < this.domainData.length; j++) {
							if ((this.domainData[i][sip] || this.domainData[i][sip
									.toUpperCase()]) == (this.domainData[j][sic] || this.domainData[j][sic
									.toUpperCase()])
									&& i != j) {
								tp = false;
								break;
							}
						}
					}
					if (tp) {
						var it = new SwordBigTree.JSONAptitudeIterator(
								this.domainData[i], this.dataDepth);
						it.setLastSign(false);
						
						it.setDataPath(this.domainData[i][sic]);
						
						array.push(it);
						it.setDomainData(this.domainData);
					}
				}
			}
		} else {

			if ($defined(this.domainData) && this.domainData.length > 0) {
				for (var i = 0; i < this.domainData.length; i++) {
					var ddPcode = (this.domainData[i][sip] || this.domainData[i][sip
							.toUpperCase()]);
					var ddCode = (this.domainData[i][sic] || this.domainData[i][sic
							.toUpperCase()]);
					var nCode = (this.node[sic] || this.node[sic.toUpperCase()]);
					if (ddPcode == nCode && ddCode != nCode) {//code相同认为是一个节点
						var it = new SwordBigTree.JSONAptitudeIterator(
								this.domainData[i], this.dataDepth);
						it.setLastSign(false);
						
						it.setDataPath(ddCode);
						
						array.push(it);
						this.domainData.splice(i, 1);
						it.setDomainData(this.domainData);
						i--;
					}
				}
			}
			this.dataDepth++;
		}
		if (array.length > 0) {
			array[array.length - 1].setLastSign(true);
		}

		return array;
	}
	,setAttribute:function(key,value){
		if(this.attributes == null){
			this.getAttributes();
		}
		this.attributes[key] = value;
		var data = this.getModelData();
		data[key] = value;
	}
	,
	getAttributes : function() {

		if (!this.attributes) {
			
			if (this.node) {

				this.attributes = {};
				for (var key in this.node) {
					var value = this.node[key];
					switch ($type(value)) {
						case 'string' :
						case 'number' :
						case 'boolean' :
							this.attributes[key] = value;
					}
				}
			}
		}
		return this.attributes;
	},
	getAttribute : function(key) {
		if ($defined(this.node)) {
			return this.node[key] || this.node[key.toUpperCase()];
		} else {
			return null;
		}
	}

	,
	isLast : function() {

		return this.lastSign;
	}

});

