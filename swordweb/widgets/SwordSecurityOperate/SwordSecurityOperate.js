var SwordSecurityOperate = new Class( {
	$family : {name : 'SwordSecurityOperate'},
	Implements : [ Events, Options ],
	container : null,
	sign : {operateSign : "operateId"},
	options : {
		name : null,
		ctrl : "SecurityOperateCtrl_execute",
		resultData : "",
		enable : "true",
		onSubmitBefore : $empty,
		onSubmitAfter : $empty,
		onSuccess : $empty,
		onError : $empty,
		postType : "ajax",
		initEleHash : new Hash()
	},
	initialize : function() {
	},
	initParam : function(initPara) {
		this.htmlOptions(initPara);
		this.container = initPara;
		if(this.container.style.display=="none"){
			this.container.style.display="block";
		}
		if(this.options.enable=="true"){
			this.initSubmitWidget(this.container);
		}
		var str = this.hiddenAllEle();
		if ($defined(pageContainer)) {
			try {
				var postData = [ {
					'name' : 'operateIdStr',
					'value' : str,
					"sword" : "attr"
				} ];
				var req = pageContainer.getReq( {
					'tid' : "",
					'ctrl' : this.options.ctrl,
					'page' : "",
					'widgets' : postData
				});
				this.fireEvent("onSubmitBefore", [this,req]);
				if(!$chk(this.options.resultData)){
					pageContainer.postReq( {
						'req' : req,
						'async':false,
						'postType' : this.options.postType,
						'onSuccess' : function(res) {
							this.fireEvent("onSuccess", [req,res]);
						}.bind(this),
						'onError' : function(res) {
							this.fireEvent("onError", [req,res]);
						}.bind(this),
						'onFinish' : function(res) {
							this.rebulid(res);
							this.fireEvent("onSubmitAfter", [req,res]);
						}.bind(this)
					});
				}else{
//					logger.debug("获得的静态数据【"+this.options.resultData+"】",'SwordSecurityOperate');
					this.rebulidByStatic(this.options.resultData);
				}
			} catch (e) {
				if (pageContainer) {
					pageContainer.getMask().unmask();
				}
				throw new Error(e.message);
			}
		} else {
			throw new Error("数据提交失败!pageContainer为空");
		}
	},
	initData : function(data) {
	},
	initSubmitWidget : function(container) {
		var eles = $$("*[" + this.sign.operateSign + "]");
		var debugStr = "";
		eles.each( function(item, index) {
			var opId = item.get(this.sign.operateSign);
			this.options.initEleHash.set(opId, item);
			debugStr +="【operateId="+opId+":elementName="+item.get("name")+"】";
		}.bind(this));
//		logger.debug("初始化页面获得的标签数据"+debugStr,'SwordSecurityOperate');
	}
	,hiddenAllEle:function(){
		var str="";
		this.options.initEleHash.each(function(value, key) {
			value.style.display = "none";
			str += "," + key;
		}.bind(this));
		return str;
	}
	,rebulid:function(res){
		var resStr = res.data[0].value;
//		logger.debug("获得的动态数据【"+resStr+"】",'SwordSecurityOperate');
		this.rebulidByStatic(resStr);
	}
    ,rebulidByStatic:function(resStr){
		var str = resStr.split(',');
		this.options.initEleHash.each(function(value, key) {
			str.each(function(item, index){
				if(key==item){
					value.style.display = "block";
				};
			}.bind(this));
		}.bind(this));
	}
});