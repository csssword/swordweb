var SwordSubmit = new Class({
    $family: {name: 'SwordSubmit'}
    ,Implements: [Events, Options]
    ,container:null//容器
    ,sign:{
        widgetSign:"widget"//容器标识
        ,widgetNameSign:"widgetName"//容器名称标识
        ,attrNameSign:"attrName"//属性标识
        ,customerSign:"parent"
        ,commConsoleAttr:['console']
        ,'SwordForm':['isVal']
        ,'SwordGrid':['check','commit']
    }
    ,widgets:[]//声明提交数据的容器
    ,widgetObjs:new Hash()//组件对象
    ,dataContainer:[]//装载提交数据的容器
    ,button:null//提交按钮
    ,isContinue:true//是否后续操作
    ,hasFile:false
    ,isCustomer:false
    ,options:{
        mask:true,  //是否使用遮盖
        pNode:null
        ,name:null
        ,newFlag:"false"//是否自己创建提交组件，适用于：页面上不再显性定义，而是直接调用$submit定义提交组件
        ,tid:""//后台服务标识
        ,ctrl:""//前端服务标识
        ,page:""//转向路径
        ,value:"提交"
        ,btnName:null//提交按钮的显示名称
        ,enabled:"true"//按钮是否可用
        ,css:""//按钮样式
        ,isSubmit:"true"
        ,isRedirect:null//false不跳转
        ,forceAjax:null
        ,reqData:null
        ,resData:null
        ,isShow:"true"//是否显示按钮组件
        ,postType:'ajax'//提交方式  ajax 、 download
        ,title:''
        ,'async':"false" //默认为同步提交
        ,encodeData:"false"
        ,'img':null
        ,onValidatorBefore:$empty //在验证数据之前触发。
        ,onSubmitBefore:$empty//提交前触发{reqData} 提交的数据
        ,onSubmitAfter:$empty//提交之后触发,{reqData,resData}
        ,onSuccess:$empty//提交成功触发,{reqData,resData}
        ,onError:$empty//提交失败触发,{reqData,resData}
        ,onAfterLoadData:$empty
        ,maskOpacity:1//蒙版的透明度
        ,submitConfirm:'false'//提交前是否询问
        ,submitConfirmMsg:null//提交前询问信息，默认为 是否+btnName
        ,isOneClick:'false'//是否 只允许点击一次，默认为否
    }
    ,initialize:function() {
        if (arguments.length > 0) {
            var params = Array.link(arguments, {'options': Object.type, 'element': $defined});
            for (var key in (params.options || {})) {
                if ($type(params.options[key]) != 'function' && (/^on[A-Z]/).test(key)) {
                    var methods = this.getFunc(params.options[key]);  
                    for (var i = 0; i < methods.length; i++) {
                        this.addEvent(key, methods[i]);
                    }
                }
            }
            this.setOptions(params.options);
            if(this.options.newFlag=="false")
                this.build();
            
        }
        this.pc = pageContainer;
    }
    ,initParam: function(initPara) {
        this.htmlOptions(initPara);
        this.options.value = this.options.btnName || initPara.getAttribute('value') || this.options.value;
        this.build();
        this.pc = pageContainer;
    }
    ,initData:function(data) {
    }
    ,initConsoleAttr:function(widget, item) {
        var console = {};
        var attrs = (this.sign[widget] || []).combine(this.sign.commConsoleAttr || []);
        for (var i = 0; i < attrs.length; i++) {
            if(this.options.newFlag == "false")
                console[attrs[i]] = item.get(attrs[i]);
            else
                console[attrs[i]] = item[attrs[i]];
        }
        return console;
    }
    ,disabled:function() {
        if (!this.isCustomer) {
            this.button.disabled = true;
            Sword.utils.btn.disabled(this.button);
        }
    }
    ,enabled:function() {
        if (!this.isCustomer) {
            Sword.utils.btn.enabled(this.button);
            this.button.disabled = false;
        }
    }
    ,show:function() {
        this.button.getParent().setStyle("display", "inline");
        this.options.isShow = "true";
    }
    ,hide:function() {
        this.button.getParent().setStyle("display", "none");
        this.options.isShow = "false";
    }
    ,build:function() {
        this.container = this.options.pNode;
        this.initContainer(this.container);
        if (this.options.isShow == "false") {
            this.hide();
        }
        this.initEvents();
    }
    ,initContainer:function(container) {
        var btn = container.getElements("*[" + this.sign.customerSign + "=" + this.options.name + "]");
        container.setStyle("display", "inline");
        if(this.options.img)container.addClass("submitCon");
        if (btn.length > 0) {
            this.button = btn[0];
            this.isCustomer = true;
        } else {
            container.grab(this.button = new Element("div"));
            this.button.set("text", this.options.value);
            if (!$chk(this.options.title)) {
                this.button.set("title", this.options.value);
            } else {
                this.button.set("title", this.options.title);
            }
        }
        if ($chk(this.options.css)) {
            this.button.set('style', this.options.css);
        }
        if (this.options.enabled == "false") {
             Sword.utils.btn.init(this.button);
            this.disabled();
        } else {
            if (!this.isCustomer) {
                Sword.utils.btn.init(this.button);
            }
        }
    }
    ,initEvents:function() {
        if ($defined(this.button)) {
            this.button.addEvent("click", function() {
                if(!this.button.disabled)this.submit();
            }.bind(this));
        }
    }
    ,pushData:function(data, value) {
        var postData = [];
        if (arguments.length == 2) {
            if(value==null||value==undefined)value=''; //解决 如果数字时候后台会报错的问题
            var sd = {'name':data,'value':value +''};
            postData.push(sd);
        } else {
            if ($type(data) == "object") {
                postData.push(data);
            } else if ($type(data) == "array") {
                postData = data;
            }
        }
        for (var i = 0; i < postData.length; i++) {
            if (!postData[i]["sword"]) {
                postData[i]["sword"] = "attr";
            }
        }
        this.dataContainer.combine(postData);
    }
    ,submit:function(options) {
        if(this.options.submitConfirm== "true"){
            var msg = this.options.submitConfirmMsg;
            if(!$defined(msg))msg = "是否要"+this.options.btnName+"？";
            swordConfirm(msg,{
                onOk:function(){
                    return this.onSubmit(options);
                }.bind(this),
                onCancel: function(){}
            });
        } else{
            return this.onSubmit(options);
        }
    }
    ,onSubmit:function(options) {
        this.isContinue = true;
        if (this.isContinue) {
            $extend(this.options, options);
            this.initSubmitWidget(this.container);
            this.fireEvent("onValidatorBefore",this);
            this.doBeforeEvents();
            //修改onSubmitBefore触发位置，在校验成功之后
            if(this.isContinue) this.fireEvent("onSubmitBefore",this);
            if(this.options.isOneClick == "true"){
            	this.disabled();
            }
            if (this.isContinue) {
                if (this.options.mask != 'false'){
                	var mask = this.pc.getMask();
					mask.options.opacity = this.options.maskOpacity;
                	mask.mask(document.body);
                }
                this.reqData = this.pc.getReq({
                    'tid':this.options.tid
                    ,'ctrl':this.options.ctrl
                    ,'page':this.options.page
                    ,'widgets':this.dataContainer
                    ,'postType':this.options.postType
                });
                if (this.isContinue) {
                    this.doAction();
                    if (this.isContinue) {
//                        logger.info("提交的数据为：【" + JSON.encode(this.reqData) + "】", 'SwordSubmit');
                        if (this.isHasFile()&&this.isForce()!="true") {
                            this.postFile();
                        } else {
                            this.postData(options);
                        }
                        if (this.options.postType != 'ajax') {
                            this.unMask();
                        }

                    }else{
                         this.unMask();
                    }

                }
                return this.resData;
            }
        } else {
            this.unMask();
        }
    }
    ,postFile:function() {
        var cmit = this.pc.getUploadCommit().initParam({'postData':this.reqData});
        cmit.commit(this.options.isRedirect,this.options.postType);
        this.unMask();
    }
    ,postData:function(opts) {
        if ($defined(this.pc)) {
            try {
                if ($chk(this.options.ctrl) || $chk(this.options.tid)||$chk(this.options.page)||$chk(this.reqData.ctrl)) {
                    if (this.options.isSubmit == "true") {
                        pageContainer.postReq({'loaddata':(opts||{}).loaddata,'req':this.reqData,'async':this.options.async=="true",'encodeData':this.options.encodeData,'postType':this.options.postType,'tid':this.options.tid
                            ,'onSuccess':function(res) {
                                this.unMask();
                                this.resData = res;
                                this.fireEvent("onSuccess", [this.reqData,res]);
                            }.bind(this)
                            , 'onError'  :function(res) {
                            	if(this.options.isOneClick == "true"){
                                 	this.enabled();
                                 }
                                this.resData = res;
                                this.doErrorEvents();
                                this.unMask();
                                this.fireEvent("onError", [this.reqData,res]);

                            }.bind(this)
                            ,'onFinish':function(res) {
                                this.doAfterEvents();
                                this.unMask();
                                this.fireEvent("onSubmitAfter", [this.reqData,this.resData]);
                                if(this.options.postType.startWith("form_")){
                                    this.clear();
                                }

                            }.bind(this)
                            ,'onAfterLoadData':function(res){
                                this.fireEvent("onAfterLoadData", [this.reqData,this.resData]);
                                this.clear();
                             }.bind(this)
                        });
                    } else {
                        this.unMask();
                    }
                } else {
                    this.unMask();
                    this.fireEvent("onSubmitAfter", [this.reqData,this.resData]);
                    this.clear();
                }
                this.clear();
            } catch(e) {
                this.unMask();
                this.clear();
                throw new Error(e.message);
            }
        } else {
            throw new Error("数据提交失败!pageContainer为空");
        }

    }
    ,unMask:function() {
        if ((this.options.isRedirect == "false" || this.options.isRedirect == null ) && this.pc) {
            if (this.options.mask != 'false') this.pc.getMask().unmask();//todo 这里yt将unmask置为0，delay不好用,以后再研究
        }
    }
    ,initSubmitWidget:function(container) {
        if (container && !$defined(this.load)) {
            var widgets = container.getElements("div");
            widgets.each(function(item, index) {
                var widgetName = item.get(this.sign.widgetNameSign);
                var attrName = item.get(this.sign.attrNameSign);
                var obj = this.pc.getWidget(widgetName);
                if (obj) {
                    var widget = obj.name;
                    if ($defined(obj)) {
                        if (widget == "SwordForm") {
                            if (obj.isHasFile()) {
                                this.hasFile = true;
                            }
                        }
                        var console = this.initConsoleAttr(widget, item);
                        var instance = SwordSubmit.Command.newInstance(widget, widgetName, console, obj);
                        if ($defined(instance)) {
                            this.widgetObjs.set(widgetName, instance);
                        }
                    }
                }else if($chk(attrName)){
                    this.pushData(attrName,item.get('value'));
                }
            }.bind(this));
            this.load = "load";
        }
    }
    ,isHasFile:function() {
        return this.hasFile;
    }
    ,isForce:function(){
        return this.options.forceAjax;
    }
    ,doAction:function() {
        this.widgetObjs.each(function(value, key) {
            this.widgetObjs[key].doAction({'data':this.dataContainer});
        }.bind(this));
    }
    ,doBeforeEvents:function() {
        this.widgetObjs.each(function(value, key) {
        	if(!this.isContinue)return;
            var ev = this.widgetObjs[key].doBeforeEvent();
            if ($defined(ev) && !ev) {
                this.isContinue = false;
                return;
            }
        }.bind(this));

    }
    ,doAfterEvents:function() {
        this.widgetObjs.each(function(value, key) {
            this.widgetObjs[key].doAfterEvent();
        }.bind(this));
    }
    ,doErrorEvents:function() {
        this.widgetObjs.each(function(value, key) {
            this.widgetObjs[key].doError();
        }.bind(this));
    }
    ,clear:function() {
        this.dataContainer.empty();
        this.isContinue = true;
        delete this.reqData;
    }
    ,stop:function() {
        this.isContinue = false;
    }
    ,setTid:function(tid) {
        this.options.tid = tid;
    }
    ,setCtrl:function(ctrl) {
        this.options.ctrl = ctrl;
    }
    ,setCaption:function(caption){//动态改变按钮显示名称
    	this.button.set('text', caption);
    	if (!$chk(this.options.title)) this.button.set('title', caption);
    }
    ,setFunction:function(funType,funName,isAdd){
    	funName=funName+"()";
    	if(isAdd==false){
	    	this.options[funType]=$empty;
	    	delete this.$events[funType.replace("on","").toLowerCase()];
	    }else{
	    	var method=this.getFunc(funName);
	        if(method.length>0){
	    		this.options[funType]=funName;
	    		delete this.$events[funType.replace("on","").toLowerCase()];
	    		this.addEvent(funType, method[0]);
    		}
    	}
    }
});

