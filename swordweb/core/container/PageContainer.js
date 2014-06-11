
/**  
 * 按键对象，封装按键和组合的功能键  
 *   
 * @param keyCode  
 *            按键值  
 * @param isCtrl  
 *            是否按下Ctrl键  
 * @param isAlt  
 *            是否按下Alt键  
 * @param isShift  
 *            是否按下Shift键  
 */  
//var SwordHotKeyObject = function(keyCode, isCtrl, isAlt, isShift,isUserDefined) {  
//    this.keyCode = keyCode;  
//    this.isCtrl = isCtrl ? true : false;  
//    this.isAlt = isAlt ? true : false;  
//    this.isShift = isShift ? true : false;  
//    this.isUserDefined = isUserDefined ? true : false; 
//};

var PageContainer = new Class({
    Implements:[Events,Options]
    ,name:"PageContainer"
    ,widgetFactory: new WidgetFactory()
    ,redirect:null
    ,mask:null
    ,initData:null
    ,calendar:null
    ,select:null
    ,uploadCommit:null
    ,edit:false
    ,editor :null
    ,pinitData:null
    ,widgets:new Hash()
    ,studioComm:null
    ,isEdit:function() {
        return this.edit;
    }
    ,initialize: function(edit) {
        this.edit = edit;
    }
    ,initSwordTag :function(node) {
        var swordWidgets = [];
        if($defined(node)) {
            swordWidgets = $(node).getElements("div[sword][sword!='PageInit']");
        } else {
            swordWidgets = $$("div[sword][sword!='PageInit'][type!='pulltree']");
        }
        var newSwordWidgets = [];
        swordWidgets.each(function(item, index) {
            if(item.getAttribute('lazy') != 'true') {
                newSwordWidgets.include(item);
                item.set('isload', 'true');
            }
        }.bind(this));
        swordWidgets = newSwordWidgets;
        if(this.isEdit()) {
            this.getEditor().start();
        }
        this.detailed = '';
        var start = new Date().getTime();
        swordWidgets.each(function(value) {
        	var begin = new Date().getTime();
            if(this.isEdit()) {
                this.getEditor().dealEl(value);
            }
            this.initWidgetParam(value);
            this.detailed = this.detailed + value.get('name')+ ":" + (new Date().getTime()-begin) + "----";
        }, this);
        this.detailed = this.detailed + "总时间："+ (new Date().getTime()-start);
    },
    initWidgetParam:function(value){
    	var swordWidget = this.widgetFactory.create(value);
        value.pNode = value;
        this.widgets.set(value.get('name'), swordWidget);
        this.setWidget(value.get('name'),swordWidget,value.get('dataName'));
        swordWidget.initParam(value);
    }
    ,initSwordPageData:function() {
        if($defined($('SwordPageData'))) {
            var d = $('SwordPageData').get('data');
            if($chk(d)) {
                pc.initData = JSON.decode(d.replace(/&apos;/g, "'"));
            }
        } else {
            var pi = this.getPageInit();
            if(pi) {
                pi.initStaticData();
            }
        }

        if( pc.initData ){//0507
           pc.initData["getAttr"] = pc.getAttrFunc;
        }
        _pcSwordClientPageJumpTiming("11");
    }
    ,getAttrFunc:function(key) {
        for(var i = 0; i < (this.data || []).length; i++) {
            var d = this.data[i];
            if(d["name"] == key) {
                return d["value"];
            }
        }
    }
    ,getDataFunc4Name:function(key) {
    	return this.data.filter(function(item){return item["name"]==key;})[0];
    }
    ,getDataFunc4DataName:function(key) {
    	return this.data.filter(function(item){return item["dataname"]==key||item["dataName"]==key;})[0];
    }
    ,initPageData:function() {
        var pi = this.getPageInit();
        if($defined($('SwordPageData'))) {
            if($chk(this.initData)) {
                var param = {'dataObj':this.initData };
                if(pi) {
                    $extend(param, {
                        'onSuccess':this.getFunc(pi.options.onSuccess)[0]
                        ,'onError':this.getFunc(pi.options.onError)[0]
                        ,'onFinish':this.getFunc(pi.options.onFinish)[0]
                        ,'onAfterLoadData':this.getFunc(pi.options.onAfterLoadData)[0]
                    });
                }
                param.initpage=true;
                pc.loadData(param);
            }
        } else {
            if(pi) {
                pi.getInitData({
                    'onSuccess':this.getFunc(pi.options.onSuccess)[0]
                    ,'onError':this.getFunc(pi.options.onError)[0]
                    ,'onFinish':this.getFunc(pi.options.onFinish)[0]
                    ,'onAfterLoadData':this.getFunc(pi.options.onAfterLoadData)[0]
                });
            }
        }
    }
    ,initPublicTag:function() {
        this.redirect = this.widgetFactory.create("Redirect");
    }
    ,initPageDataRedirectFormLast:function() {
        var param1 = {'dataObj':this.pinitData };
        var pi = this.getPageInit();
        $extend(param1, {
            'onSuccess':this.getFunc(pi.options.onSuccess)[0]
            ,'onError':this.getFunc(pi.options.onError)[0]
            ,'onFinish':this.getFunc(pi.options.onFinish)[0]
        });
        param.initpage=true;
        this.loadData(param1);
    }
    ,initCoutTag:function() {
        var couts = $$("*[tag='cout'][name]");
        couts.each(function(el) {
            var val = this.getInitData(el.get('name'));
            if(!$chk(val))return;
            val = val.value;
            el.set('text', val);
        }, this);
    }
    ,initPageDataRedirectFormLastBefore:function() {
        var pData,ppr = parent.pc.redirect;
        if(ppr.options.items.length == 2) {
            pData = ppr.getData();
        } else if(ppr.options.items.length > 2) {
            var length = ppr.options.items.length;
            var lastFramePage = ppr.options.items[length - 2].page;
            var lastFrame = $(parent.document.body).getElement('iframe[ifname=RedirectIframe_' + lastFramePage + ']').contentWindow;
            pData = lastFrame.pc.redirect.getData();
        }
        this.pinitData = pData;
        this.initData = pData;
    },
    swordCacheArray:[]//存储页面缓存的定义
    ,
    initSwordCacheData:function(){// 读取页面定义的缓存
        var ct = $('SwordCacheData');
        var querystr = null;
        if($defined(ct)){//由于历史原因，下拉树和下拉列表分开定义
            querystr = ct.get('queryTree');
            if(querystr){
                this.swordCacheArray.combine(JSON.decode(querystr));
            }
            querystr = ct.get('query');
            if(querystr){
                this.swordCacheArray.combine(JSON.decode(querystr));
            }
        }
    }
    ,process:function() {
        this.initPublicTag();
        this.initSwordPageData();
        if(jsR.config.SwordClientCache)this.initSwordCacheData();
        //todo 如果是不同的域,会报拒绝访问的错误，所以加上try{}catch(e){},应该会有更合理的判断方式
        try {
            if(parent && parent.jsR && window.frameElement && window.frameElement.name && window.frameElement.name.contains('RedirectIframe_')) {
                this.initPageDataRedirectFormLastBefore();
            }
        } catch(e) {
        }
        this.firePIOnBefore();
        _pcSwordClientPageJumpTiming("12");
        this.initSwordTag();
        _pcSwordClientPageJumpTiming("13");
        this.firePIOnDataInit();
        //todo 如果是不同的域,会报拒绝访问的错误，所以加上try{}catch(e){},应该会有更合理的判断方式
        var flag = false;
        try {
        	flag = (parent && parent.jsR && window.frameElement && window.frameElement.name && window.frameElement.name.contains('RedirectIframe_'));
        } catch(e) {
        }
        if(flag) {
            this.initPageDataRedirectFormLast();
        } else {
            this.initPageData();
        }
        //给自定义form子类型注册事件
        this.initEventForForm();
        this.firePIOnAfter();
        this.regHotKey();
    }
    ,initEventForForm:function(){
    	this.widgets.each(function(value){
    		if(value.options.sword=="SwordForm"&&value.options.userDefine=="true"){
    			value.initEventForTemplate();
    		}
    	});
    }
    ,firePIOnDataInit:function() {
        var pi = this.getPageInit();
        if(pi) {
            pi.fireEvent('onDataInit',pc.initData);
        }
    }
    ,firePIOnAfter:function() {
        var pi = this.getPageInit();
        if(pi) {
            pi.fireEvent('onAfter',pc.initData);
        }

        var afters = jsR.config.onAfter;
        if ($type(afters) == 'array') {
            afters.each(function(ev) {
                try {
                    eval(ev.replace('()', ''));
                } catch(e) {
                    //  alert('出错说明没有定义这个方法');
                    return;//出错说明没有定义这个方法。。。
                }
                var f = pi.getFunc(ev)[0];
                f();
            });
        }

    }
    ,firePIOnBefore:function() {
        var pi = this.getPageInit();
        if(pi) {

            var befores = jsR.config.onBefore;
            if($type(befores) == 'array') {
                befores.each(function(ev) {
                    try {
                        eval(ev.replace('()', ''));
                    } catch(e) {
                        //                        alert('出错说明没有定义这个方法');
                        return;//出错说明没有定义这个方法。。。
                    }
                    var f = pi.getFunc(ev)[0];
                    f();
                });
            }


            pi.fireEvent('onBefore',pc.initData);

        }
    }
    ,widgets_dataname:new Hash() //按dataname存放组件对象
    ,setWidget:function(key, widget, dataname) {
        this.widgets.set(key, widget);
        if(dataname){
        	if(!this.widgets_dataname.get(dataname)){
        		var a=[];
        		a.initData=function(d){
                    a.each(function(obj){
                       if(obj) obj.initData(d);
                    });
                } ;
                this.widgets_dataname.set(dataname,a);
            }
        	this.widgets_dataname.get(dataname).erase(widget);
            this.widgets_dataname.get(dataname).push(widget);
        }
    }
    ,getWidget:function(key) {
    	var widget = this.widgets.get(key);
    	if(!widget && this.name == 'SwordForm'){
    		return	this.addInitWidget(key);
    	}
        return this.widgets.get(key);
    }
    ,getWidgetsByType:function(type) {
        return this.widgets.filter(function(value, key) {
            return $chk(value.$family)?value.$family.name == type : value.name == type;
        }, this);
    }
    ,getWidgetsByDataname:function(dataname){
        return this.widgets_dataname.get(dataname);
    }
    ,getMask:function() {
        if(!$defined(this.mask))this.mask = this.widgetFactory.create("SwordMask");
        return this.mask;
    }
    ,getUploadCommit:function() {
        if(!$defined(this.uploadCommit))this.uploadCommit = this.widgetFactory.create("SwordFileUpload");
        return this.uploadCommit;
    }
    ,getCalendar:function() {
        if(!$defined(this.calendar))this.calendar = this.widgetFactory.create("SwordCalendar");
        return this.calendar;
    }
    ,getSelect:function() {
        if(!$defined(this.select))this.select = this.widgetFactory.create("SwordSelect");
        return this.select;
    }
    ,getValidate:function() {
        if(!$defined(this.validate))this.validate = this.widgetFactory.create("SwordValidator");
        return this.validate;
    }
    ,getEditor:function() {
        if(!$defined(this.editor))this.editor = this.widgetFactory.create("Editor");
        return this.editor;
    }
    ,getValidateCode:function() {
        if(!$defined(this.validateCode))this.validateCode = this.widgetFactory.create("SwordValidateCode");
        return this.validateCode;
    }
    ,getPageInit:function() {
        if(!$defined(this.pageInit)) {
            var pageInits = $$("div[sword='PageInit']");
            if(pageInits.length > 1) {
                throw new Error('一个页面只能设置一个初始数据操作！');
            } else if(pageInits.length == 1) {
                this.pageInit = this.widgetFactory.create("PageInit");
                this.pageInit.initParam(pageInits[0]);
            } else if(pageInits.length == 0) {
                this.pageInit = this.widgetFactory.create("PageInit");
            }
        }
        return this.pageInit;
    }
    ,getDownLoadForm:function() {
        if(!this.downLoadForm) {
            var iframeId = "swordDownLoadIframe";
            this.downLoadForm = new Element('form', {
                'name':"swordDownLoadForm",
                'method':'post',
                'target':iframeId,
                'action':'download.sword',
                styles:{'display':'none'}
            }).inject($(document.body));
            new Element('iframe', {
                id:iframeId,
                name:iframeId,
                styles:{'display':'none'}
            }).inject($(document.body));
            this.downLoadForm.postReqInput = new Element('input', {
                'name':"postData"
            }).inject(this.downLoadForm);
        }
        return this.downLoadForm;
    }
    ,submit:function() {
        if(arguments.length != 1)return;
        var name = arguments[0]['widgets'][0];
        var widget = this.getWidget(name);
        if(!widget.validate())return;
        var req = {
            'ctrl':arguments[0].ctrl || ''
            ,'tid':arguments[0].tid || ''
            ,'data':widget.getSubmitData()
        };
        var myRequest = new Request({
            method: 'post',
            async : true,
            url: 'ajax.sword'
        });
        myRequest.onSuccess = function(responseText) {
//            logger.debug('返回数据=' + responseText, 'pc');
            if(!$chk(responseText)) {
//                logger.debug('没有返回数据', 'pc');
                return;
            }
            var jsonObj = JSON.decode(responseText);
            this.loadData({'dataObj':jsonObj});
        }.bind(this);
        myRequest.onFailure = function() {
            this.alertError('提交数据出错了。。。pc.submit');
        }.bind(this);
        myRequest.send('postData=' + JSON.encode(req));
    },
    create:function(widget) {
        return this.widgetFactory.create(widget);
    },
    showEx:function(param,dataObj){
    	if (param['errMes']!=false) {

            if(dataObj['ajaxErrorPage']) {
                if(!dataObj['exceptionMes'])dataObj['exceptionMes']='';
                var popupParam = JSON.decode(dataObj['ajaxErrorPopupParam'].replace(/&apos;/g, "'")) || {titleName:'出错了！',width: 412,height:450};
                var doctemp=window.document;
                if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)doctemp=parent.window.document;
                var scrollTop=0;
                if (doctemp.body && doctemp.body.scrollTop)
                {
                	scrollTop=doctemp.body.scrollTop;
                }else if (doctemp.documentElement && doctemp.documentElement.scrollTop)
                {
                	scrollTop=doctemp.documentElement.scrollTop;
                }
                popupParam['top'] = popupParam.top + scrollTop;
                var win = window;
                if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)win=parent.window;
                popupParam['param'] = {'win':win,'data':dataObj};
                swordAlertIframe(jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + dataObj['ajaxErrorPage'], popupParam,null);
            }
            else {
                this.alertError('<b><font color="red">出错了！</font></b>' +
                    '<br><font color="blue" >错误名称</font> : ' + dataObj['exceptionName']
                    + '  <br><font color="blue" >错误信息</font> : ' + dataObj['exceptionMes']
                    + '<br><font color="blue" >调试信息</font> : ' + dataObj['debugMes']);
            }

        }
        pc.getMask().unmask();
    }
    ,loadData:function(param) {
        MaskDialog.hide();
        var dataObj = param['dataObj'];
        var onError = param['onError'];
        var onSuccess = param['onSuccess'];
        var loaddata = param['loaddata'];
        if(!$chk(dataObj)) {
            if($defined(param['onFinish'])) {
                param['onFinish'](dataObj);
            }
            return;
        }
//        logger.debug("装载数据开始。。。。。", 'PageContainer');
        if(!$defined(dataObj.getAttr)) {
            dataObj["getAttr"] = this.getAttrFunc;
        }
        if(!$defined(dataObj.getData)) {
            dataObj["getData"] = this.getDataFunc4Name;
        }
        if(!$defined(dataObj.getDataByDataName)) {
            dataObj["getDataByDataName"] = this.getDataFunc4DataName;
        }
        if(dataObj['exception']) {
            if($defined(onError)) {
                onError(dataObj);
            }
            this.showEx(param,dataObj);
            return;
        } else {
        
            var resMsg = dataObj['message'];
            if($defined(resMsg)) {
                if(resMsg == "SWORD_TIME_OUT") {
                    _TIMEOUT();
                } else {
                    //var len = resMsg.length;
                    //var height = Math.ceil(len / 14) * 16;
                    //h = height + 'px';
                    swordAlert(resMsg);
                }
            }
            if($defined(onSuccess)) {
                onSuccess(dataObj);
                if(!document.body) {
                    return;
                }
            }
        }
        if($defined(param['onFinish'])) {
            param['onFinish'](dataObj);
        }
        if($chk(param['url'])){
        	_pcSwordClientAJAXTiming("32",param['url'],param['dataObj'].getAttr("sessionID"),param['req'].tid,param['req'].ctrl);
        }else{
            _pcSwordClientPageJumpTiming("14");
        }
        if(!$defined(param['redirect']) || param['redirect'] != false) {
            if($chk(dataObj.page)) {
                var page = dataObj.page;
//                logger.debug('执行页面跳转开始，目标页：' + page);
                dataObj.page = null;
                this.redirect.setData(dataObj);
                if(page.lastIndexOf('?') != -1) {
                    page += "&";
                } else {
                    page += "?";
                }
                page += "r=" + Math.random();
                if(Browser.Engine.gecko) {
                    this.redirect.go.delay(1, this.redirect, [page]);
                } else {
                    this.redirect.go(page);
                }
                return;
            }
        }
        if(loaddata == 'widget') {
//            logger.debug("全局的loaddata == 'widget',容器将不负责数据初始化操作。", 'PageContainer', 'loadData');
            return;
        }
        var data = dataObj['data'];
        if($chk(!data)) {
//            logger.debug("返回的数据中没有res->data属性，不进行数据装载操作。。。", 'PageContainer');
            return;
        }
        data.each(function(widgetData) {
        	if(widgetData['type'] == ""){
        		return;
        	}
            if(widgetData['sword'] == 'SwordSelect' ) {
                if(param.initpage==true){ //页面初始化调用此处，不需要处理下拉的数据
//                    logger.debug("不处理 SwordSelect 的数据，略过此段数据。。。", 'PageContainer');
                }else if(widgetData['dataName']){
                	var selData = widgetData.data;
                	if(selData.length == 1 && !$chk(selData[0].code) && !$chk(selData[0].caption)){
                		var selectdata = {
                	            'sword':'SwordSelect',
                	            'name' :widgetData['dataName'],
                	            'data' :[]  
                	        };
                		this.reloadSel1(widgetData['dataName'], selectdata);
                	}else{
                		this.reloadSel(widgetData['dataName'],dataObj);
                	}
                }
                return;
            }
            if(widgetData['sword'] == "SwordTree"){
            	var dn=widgetData['name'];
        		if(param.initpage!=true){ //不是页面初始化操作，select自动重载数据
        			//装载下拉的数据，注意：这里没有区分是否是下拉类型，可能会有问题
            		this.reloadSel(dn,dataObj);
        		}
        		 
        		if(this.getWidgetsByDataname(dn)){
        			widgetData.initpage=param.initpage;//通知各个组件是否为第一次初始化数据
        			this.getWidgetsByDataname(dn).initData(widgetData);
        		}
        		return;
            }
            
            var widgetName = widgetData['name'];
            if($chk(!widgetName)) {
//                logger.debug("res->data->widget中没有name属性，略过此段数据。。。", 'PageContainer');
                return;
            }
//            logger.debug("为组件【" + widgetName + "】装载数据。", 'PageContainer');
            if(!widgetName.contains('.') && pageContainer.getWidget4loaddata(widgetName) == null) {
//                logger.debug("组件池中没有组件【" + widgetName + "】，不执行装载数据。", 'PageContainer');
                return;
            }
            if(widgetName.contains('.')) {
                var name = widgetName.split('.');
                if(pageContainer.getWidget4loaddata(name[0]) == null) {
//                    logger.debug("组件池中没有组件【" + name[0] + "】，不执行装载数据。", 'PageContainer');
                    return;
                }
            }
            if(widgetData['loaddata'] != 'widget') {
                if(widgetName.contains('.')) {
                    var name = widgetName.split('.');
                    pageContainer.getWidget4loaddata(name[0]).initData(widgetData);
                } else {
                    pageContainer.getWidget4loaddata(widgetName).initData(widgetData);
                }
            }
        }, this);
        this.initCoutTag();

        if($defined(param['onAfterLoadData'])) {
            param['onAfterLoadData'](dataObj);
        }
    }

    ,widgets_loaddataOnly:new Hash()     //保存对象，这些对象在loaddata的时候会被调用，在$w的时候获取不到，hash中value是数组。目前：pulltree
    ,setWidget4loaddata:function(key,obj){
        /*if(!this.widgets_loaddataOnly.get(key)){
            this.widgets_loaddataOnly.set(key,[]);
        }*/
        this.widgets_loaddataOnly.set(key, obj);
    }
    ,getWidget4loaddata:function(name){
         if(this.widgets_loaddataOnly.get(name)){
            /* var r=[];
             r.initData=function(d){
                 r.each(function(obj){
                    if(obj)obj.initData(d);
                 });
             } ;
             return r.include(this.getWidget(name)).extend(this.widgets_loaddataOnly.get(name));*/
        	 return this.widgets_loaddataOnly.get(name);
         }else{
             return this.getWidget(name);
         }
    }

    ,getResData:function(name, dataObj, flag) {
        if(!$chk(flag)) {
            flag = 'name';
        }
        if($chk(!dataObj)) {
//            logger.debug("没有获得有效数据res", 'PageContainer');
            return;
        }
        var data = dataObj['data'];
        if($chk(!data)) {
//            logger.debug("返回的数据中没有res->data属性", 'PageContainer');
            return;
        }
        var temp;
        data.each(function(widgetData) {
            var widgetName = widgetData[flag];
            if($chk(!widgetName)) {
//                logger.debug("res->data->widget中没有" + flag + "属性，略过此段数据。。。", 'PageContainer');
                return;
            }
            if(name == widgetName) {
                temp = widgetData;
                return;
            }
        }, this);
        return temp;
    }
    ,downLoad:function(req) {
    	var url = 'download.sword';
    	if(req.bindParam){
        	var _tid = req.tid;
        	var _ctrl = req.ctrl;
        	if($chk(_tid)){
        		if(_tid.indexOf("?") != -1){
        			url = url + _tid.substr(_tid.indexOf("?"),_tid.length - 1);
        		}
        	}else if($chk(_ctrl)){
        		if(_ctrl.indexOf("?") != -1){
        			url = url + _ctrl.substr(_ctrl.indexOf("?"),_ctrl.length - 1);
        		}
        	}
        }	
    	if(url.indexOf("rUUID") == -1)
    		url = url + ((url.indexOf("?") == -1) ? "?" : "&") + "rUUID="+this.getRandomUUID();
        var form = this.getDownLoadForm().set({'target':'swordDownLoadIframe','action':url});
        form.postReqInput.set('value', JSON.encode(req));
        form.submit();
    }
    //form的方式提交
    ,SwordformSubmit:function(req, target) {
    	var url = "";
    	if($chk(req.page)){
    		url = req.page;
    	}else{
            url = "form.sword";
            if(req.bindParam){
            	var _tid = req.tid;
            	var _ctrl = req.ctrl;
            	if($chk(_tid) && _tid.indexOf("?") != -1){
            		url = url + _tid.substr(_tid.indexOf("?"),_tid.length - 1);
            	}else if($chk(_ctrl) && _ctrl.indexOf("?") != -1){
            		url = url + _ctrl.substr(_ctrl.indexOf("?"),_ctrl.length - 1);
            	}
            }
        	if(url.indexOf("rUUID") == -1)
        		url = url + ((url.indexOf("?") == -1) ? "?" : "&") + "rUUID="+this.getRandomUUID();
    	}

        var form = this.getDownLoadForm().set({'target':target,action:url});
        form.postReqInput.set('value', JSON.encode(req));
        form.submit();
    }
    /**
     * 提供jsonp的提交方式
     */
    ,jsonpReq:function(param){
    	new Request.JSONP({
    		url: param['url'],
    		data: param.data,//提交的参数, 没有参数可以不写
    	        onComplete: function(dataObj) {
    		var onError = param['onError'];
    		var onSuccess = param['onSuccess'];
    		  if(!$defined(dataObj.getAttr)) {
    	            dataObj["getAttr"] = pc.getAttrFunc;
    		  }
    		    if(dataObj['exception']) {
    	            if($defined(onError)) {
    	                onError(dataObj);
    	            }
    	            pc.showEx(param,dataObj);
    	            return;
    		    }else{
    		    	if($defined(onSuccess)) {
    	                onSuccess(dataObj);
    	            }
    		    }
    			
    		}
    	}).send();
    }
    /*
     统一提交数据接口
     req: 必填, 需要单独提交的数据
     onSuccess ：选填， 后台成功，没有异常的回调
     onError ： 选填，后台发生了异常
     async：选填，true false 默认为true 异步
     loaddata:选填，是否为组件装载数据，widget container 默认为container
     onFinish:选填，不管出错还是成功执行，都会执行此方法。
     errMes : 选填，当后台出现异常的时候，是否alert错误信息， 默认为 true  ，关闭为 false
     redirect：选填，是否根据返回数据的page属性自动跳转页面
     postType(type) :选填， ajax form (form_target,支持target) download  提交类型 ， 默认为ajax提交   ,当download的时候其余的参数将失效
     */
    ,postReq:function(param) {
        if($defined(param['postType']) && param['postType'].contains("form")) {
            var target = "";
            if(param['postType'].contains("form_")) {
                var ta=param['postType'].split("_");
                ta.erase(ta[0]);
                target=(ta.length>1)?ta.join('_'):ta.join('');
            }
//            logger.debug('使用form方式提交...target方式为' + target, 'PageContainer', 'postReq');
            this.SwordformSubmit(param['req'], target);
            if($defined(param.onFinish)) {
                param.onFinish();
            }
            return;
        }
        if(param['postType'] == 'download') {
//            logger.debug('使用文件下载的方式提交数据。。。', 'PageContainer', 'postReq');
            this.downLoad(param['req']);
            if($defined(param.onFinish)) {
                param.onFinish();
            }
            return;
        }
        var async = true;
        var errMes = true;
        if($defined(param['async']) && param['async'] == false) {
            async = false;
        }
        if($defined(param['errMes']) && param['errMes'] == false) {
            errMes = false;
        }
        param['errMes'] = errMes;
        var req = param['req'];
        var onSuccess = param['onSuccess'];
        var onError = param['onError'];
        var loaddata = param['loaddata'];
        var url = 'ajax.sword?r=' + Math.random();
        if(req.bindParam){
        	var _tid = req.tid;
        	var _ctrl = req.ctrl;
        	if($chk(_tid) && _tid.indexOf("?") != -1){
        		url = url + "&"+ _tid.substr(_tid.indexOf("?")+1,_tid.length - 1);
        	}else if($chk(_ctrl) && _ctrl.indexOf("?") != -1){
        		url = url + "&"+ _ctrl.substr(_ctrl.indexOf("?")+1,_ctrl.length - 1);
        	}
        }
		if(url.indexOf("rUUID") == -1)
    		url = url + ((url.indexOf("?") == -1) ? "?" : "&") + "rUUID="+this.getRandomUUID();
        var myRequest = new Request({
            method: 'post',
            async : async,
            url: url
        });
        myRequest.onSuccess = function(responseText) {

//          logger.debug('获得返回数据=' + responseText, 'PageContainer', 'postReq');
          if(!$chk(responseText)) {
//              logger.debug('没有获得有效返回数据！', 'PageContainer', 'postReq');
              return;
          }
          var _dataObj = param['dataObj'] = JSON.decode(responseText);
          if(!$defined(_dataObj.getAttr)) {
        	  _dataObj["getAttr"] = this.getAttrFunc;
          }
          _pcSwordClientAJAXTiming("31",url,param['dataObj'].getAttr("sessionID"),req.tid,req.ctrl);
          param['url'] = url;
          this.loadData(param);
          _pcSwordClientAJAXTiming("33",url,param['dataObj'].getAttr("sessionID"),req.tid,req.ctrl);
        }.bind(this);
        myRequest.onFailure = function() {
            pc.getMask().unmask();
        	if(myRequest.status==0||myRequest.status==12029)return;
            swordAlertWrong("请求地址："+url+"请求失败，状态码："+myRequest.status, {'width':380,'height':200});

        }.bind(this);
        var postData = "";
        if(param['encodeData'] && param['encodeData'] == "true") {
            postData = encodeURI(JSON.encode(req));
        } else {
            postData = JSON.encode(req);
            postData = postData.replace(/&/g, "#*^@^*#");
            postData = postData.replace(/%/g, "%25");
            postData = postData.replace(/[+]+/g, '%2B');
        }

//        logger.debug('开始提交数据=' + postData, 'PageContainer', 'postReq');
        try {
            myRequest.send('postData=' + postData);
        } catch(e) {
            if(jsR.server())alert("与服务器连接断开，请尝试重新登录或与管理员联系!");
            pc.getMask().unmask();
            throw e;
        }
    }
    ,getReq:function(obj) {
        var result = {
            'tid':obj.tid
            ,'ctrl':obj.ctrl
            ,'page':obj.page
            ,'data':obj.widgets
        };
        var data = [];
        if($chk(obj.data)) {
            var params = obj.data.split('&');
            params.each(function(param) {
                var tmp = param.split('=');
                var attr = {
                    "sword": "attr",
                    "name": tmp[0],
                    "value": tmp[1]
                };
                data[data.length] = attr;
            });
        }
        if(!$chk(result.data)) {
            result.data = data;
        } else {
            result.data.extend(data);
        }
        return result;
    }
    ,getInitData:function(widgetName) {
        if($chk(widgetName)) {
            return this.getResData(widgetName, this.initData);
        } else {
            if(!$defined(this.initData))this.initData = [];
            if(!$defined(this.initData.getAttr)) {
                this.initData["getAttr"] = this.getAttrFunc;
            }
            return this.initData;
        }
    }
    ,getInitDataByDataName:function(dataName) {
        return this.getResData(dataName, this.initData, 'dataName');
    }
    ,
    /**
     * 根据组件标识删除数据
     * 成功，返回true
     * 失败，返回false
     */
    deleteDataByWidgetName:function(widgetName) {
        return this.deleteData(widgetName, this.initData);
    },
    /**
     * 根据组件的dataname删除数据
     * 成功，返回true
     * 失败，返回false
     */
    deleteDataByDataName:function(dataName) {
        return this.deleteData(dataName, this.initData, 'dataName');
    }
    ,deleteData:function(name, dataObj, flag) {
        if(!$chk(flag)) {
            flag = 'name';
        }
        if($chk(!dataObj)) {
//            logger.debug("没有获得有效数据res", 'PageContainer');
            return false;
        }
        var data = dataObj['data'];
        if($chk(!data)) {
//            logger.debug("返回的数据中没有res->data属性", 'PageContainer');
            return false;
        }
        data.each(function(widgetData, index) {
            var widgetName = widgetData[flag];
            if($chk(!widgetName)) {
//                logger.debug("res->data->widget中没有" + flag + "属性，略过此段数据。。。", 'PageContainer');
                return false;
            }
            if(name == widgetName) {
                data[index] = {};
                return true;
            }
        }, this);
    }
    ,alert:function(mes) {
        swordAlert(mes);
    }
    ,alertError:function(mes) {
        swordAlertWrong(mes, {'width':380,'height':200});
    }
    ,getStudioComm:function() {
        if(!$defined(this.studioComm))this.studioComm = this.widgetFactory.create("StudioComm");
        return this.studioComm;
    }

    //根据dataname 重新装载下拉列表数据
    ,reloadSel:function(dataname, resdata) {
        this.deleteDataByDataName(dataname);
        var data = this.getResData(dataname, resdata, 'dataName');
        if(!data)return;
        if(! pc.initData){
            pc.initData = {data:[]};
        }
        this.initData.data[this.initData.data.length] = data;
    },
    reloadSel1:function(dataname, seldata){
    	this.deleteDataByDataName(dataname);
    	this.initData.data[this.initData.data.length] = seldata;
    },
     SwordHotKeys:new Hash({
        'ctrlA': '导入',
        'ctrlS': '保存',
        'ctrlD': '下一户'
    }), 
    SwordHotKeyTitle:new Hash({
        '导入':'ctrl+A',
        '保存':'ctrl+S',
        '下一户':'ctrl+D'
    }), 
    SwordhotKeyCaptions:new Hash({
        '导入': null,
        '保存': null,
        '下一户': null
    }),
	// 过滤快捷键列表，如果需要过滤其它快捷键，请自行添加  
    SwordHotKeyFilter : [
              new SwordHotKeyObject(116), //F5刷新
              new SwordHotKeyObject(83, true), // Ctrl+S  
  			  new SwordHotKeyObject(68, true),// Ctrl+D
              new SwordHotKeyObject(65, true)// Ctrl+A
	],
	addHotKey : function(keyCode,hotKey,caption,isCtrl, isAlt, isShift) {
		 if(!isCtrl&&!isAlt&&!isShift)isCtrl = true;
		 this.SwordHotKeyFilter.include(new SwordHotKeyObject(keyCode,isCtrl,isAlt,isShift));
		 this.SwordHotKeys.set(hotKey,caption);
		 this.SwordhotKeyCaptions.set(caption,null);
	 },
	 regUserDefinedHotKey : function(keyCode,hotKey,fun,isCtrl, isAlt, isShift) {
		 if(!isCtrl&&!isAlt&&!isShift)isCtrl = true;
		 this.SwordHotKeyFilter.include(new SwordHotKeyObject(keyCode,isCtrl,isAlt,isShift,true));
		 this.SwordHotKeys.set(hotKey,fun);
	 },
    regHotKey : function() {
    	//屏蔽IE原生快捷键
    	window.document.addEvent('keydown', function(e) {  
    	var event = e.event;
        for (var i = 0, len = this.SwordHotKeyFilter.length; i < len; i++) {  
            var fk = this.SwordHotKeyFilter[i];  
            if (event.keyCode == fk.keyCode && event.ctrlKey == fk.isCtrl  
                    && event.altKey == fk.isAlt && event.shiftKey == fk.isShift) {
                // IE浏览器  
                if (navigator.userAgent.indexOf("MSIE") > 0) {  
                   return false;
                }  
                // Firefox等其他浏览  
                else {  
                    event.preventDefault();  
                    event.stopPropagation();  
                }  
                break;  
            }  
        }  
    }.bind(this));
    //注册指定快捷键（当页面不存在toolbar或其父页面页不存在时不注册）	
    	var bars = this.getWidgetsByType('SwordToolBar');
    	var bar = bars.getValues()[0];
    	var isPar = false;
    	if(!$chk(bar)){//本页没有toolbar时，查看父页面是否存在toolbar，若存在使用父页面注册快捷键
    		if(!$chk(parent.window.pc))return;
    		bar = parent.window.pc.getWidgetsByType('SwordToolBar').getValues()[0];
    		if(!$chk(bar))return;
    		isPar = true;
    	}
    	var child = bar.pNode().getChildren();
        if (child.length != 0) {
        	child.each(
                    function(item) {
                    	if(this.SwordhotKeyCaptions.has(item.get('caption'))){
                    		this.SwordhotKeyCaptions.set(item.get('caption'),item)
                    		var container = item.parentNode.getElements("div[name='container']");
                    		var parentDivs = container.getElements("div[name='" + item.get('name') + "']")[0];
                    		if($chk(parentDivs))parentDivs.set('title',this.SwordHotKeyTitle.get(item.get('caption')));
                    	}
                    }.bind(this));
        }
    	window.document.addEvent('keydown', function(e) {
    		var event = e.event;
    	    for (var i = 0, len =this.SwordHotKeyFilter.length; i < len; i++) {  
    	        var fk = this.SwordHotKeyFilter[i];  
    	        if (event.keyCode == fk.keyCode && event.ctrlKey == fk.isCtrl  
    	                && event.altKey == fk.isAlt && event.shiftKey == fk.isShift) {
    	        	if($defined(pc.maskState)&&pc.maskState)return;
    	            // IE浏览器  
    	            if (navigator.userAgent.indexOf("MSIE") > 0) {
    	            	var key = (e.key+"").toUpperCase();
    	            	if(fk.isShift)key = 'shift'+key;
    	            	if(fk.isAlt)key = 'alt'+key;
    	            	if(fk.isCtrl)key = 'ctrl'+key;
    	            	if(fk.isUserDefined){
    	            		var fun = this.SwordHotKeys.get(key);
    	            		if($chk(fun))this.getFunc(fun)[0]();
    	            		break;
    	            	}
    	            	var caption = this.SwordHotKeys.get(key);
    	            	if($chk(caption)){
        	            	var srcItem = this.SwordhotKeyCaptions.get(caption);
        	            	if($chk(srcItem)){
        	            		var container = bar.options.pNode.getElements("div[name='container']");
        	                    var parentDivs = container.getElements("div[name='" + srcItem.get('name') + "']")[0];
        	                    if(parentDivs.get('enabled')=='true'){
                	            	if($defined(srcItem.get('_onClick'))){
                	            		var eve =  srcItem.get('_onClick');
                	            		if(isPar)eve = "parent."+eve;
                	            		this.getFunc(eve)[0]();
                	            	}else if($defined(srcItem.get('onClick'))){
                	            		var eve =  srcItem.get('onClick');
                	            		if(isPar)eve = "parent."+eve;
                	            		this.getFunc(eve)[0]();
                	            	}
        	                    }else{
        	                    	break;
        	                    }
            	            	
        	            	}else{
        	            		break;
        	            	}
    	            	}else{
    	            		return false;
    	            	}
    	            }  
    	            // Firefox等其他浏览  
    	            else {  
    	                event.preventDefault();  
    	                event.stopPropagation();  
    	            }  
    	            break;  
    	        }  
    	    }  
    	}.bind(this));
    	
    } ,   	
	
	 getRandomUUID : function() {
		 return Sword.utils.uuid(32);
	 },   	
   	
	 getServerName : function(url) {
		 if(url.indexOf("http")!=-1&&url.indexOf("sword")==-1)return "do";
		 	var sName;
			var server;
		 	if(url.indexOf("tid")!=-1){
				var _tid = url.substr(url.indexOf("tid"))
				server = _tid.substr(_tid.indexOf("=")+1);
			}else if(url.indexOf("ctrl")!=-1){
				var _ctrl = url.substr(url.indexOf("ctrl"))
				server = _ctrl.substr(_ctrl.indexOf("=")+1);
			}else if(url.indexOf("sName")!=-1){
				var _sName = url.substr(url.indexOf("sName"))
				server = _sName.substr(_sName.indexOf("=")+1);
			}
			if($chk(server)){
				if(server.indexOf("&") != -1){
					sName = server.substr(0,server.indexOf("&"));
				}else{
					sName = server;
				}
			}else{
				sName = url;
			}
		  return  sName; 	
	 }  	
	 ,
	 AddBaseCode2URL : function(url){
		 	if(!$chk(url))return "";
			var sName = url;
			if(url.indexOf("?") != -1)sName = this.getServerName(url);
		    if(jsR.config.SwordClientTiming){
				if(url.indexOf("sDate") == -1)
		    		url = (url + ((url.indexOf("?") == -1) ? "?" : "&") + "sDate=" + new Date().getTime());
		    }
			if(url.indexOf("sName") == -1)
				url = url + ((url.indexOf("?") == -1) ? "?" : "&") + "sName="+sName;
			if(url.indexOf("rUUID") == -1)
				url = url + ((url.indexOf("?") == -1) ? "?" : "&") + "rUUID="+this.getRandomUUID();
			
			return url;
	 }	
    	
    	
});

var pageContainer,pc;
function swordGetEdit() {
    var location = "" + window.location;
    var edit = (location.indexOf("edit=true") != -1);
    if(edit) {
        return edit;
    }
    var imObj = document.getElementsByTagName("script")[0];
    if(imObj.src.lastIndexOf("Sword.js") < 0) {
//        logger.warn('没有找到sword.js节点，无法初始化编辑模式。。请保证sword.js是页面的第一个js结点');
        return false;
    } else {
        return imObj.getAttribute('edit') == 'true';
    }
}
function $init_Gt(){
	if(window.top.setClientMonitorValue&&window.top.SwordClientTiming)jsR.config.SwordClientTiming = true;
    var edit = swordGetEdit();
    if(Browser.Engine.webkit){
    	try{
    		window.box = this.parent[this.name];
    	}catch(e){
    		
    	}
    }
    pc = pageContainer = new PageContainer(edit);
    pc.getSelect(); //为了初始化全局click事件
    pc.getMask();
    pc.process();
    MaskDialog.hide();
    _pcSwordClientPageJumpTiming("15");
    document.body.focus();
}
function initSwordPage() {
	 $init_Gt();
}

function unloadSword() {
    $$('iframe').set('src', '');
}
if(Browser.Engine.trident) {
    window.attachEvent("onload", initSwordPage);
} else {
	window.addEvent('domready', initSwordPage);
}
function _TIMEOUT() {
    if(window.top._SOWRDTIMEOUT) {
        window.top._SOWRDTIMEOUT();
    }
}

//客户端计时，type  31 AJAX结束 32 自定义初始化方法执行完  33 加载完后台返回数据  
function _pcSwordClientAJAXTiming(type,url,sessionID,_tid,_ctrl){
	if(jsR.config.SwordClientTiming){
		if(!$chk(sessionID))return;
		var sDateIndex = url.indexOf("sDate");
		if(sDateIndex == -1)return;
		var eDate = new Date().getTime();
		var hs;
    	var sName ;
    	var gndm ; 
    	var rUUID;
    	if($chk(_tid)){
    		if(_tid.indexOf("?") != -1){
    			sName = _tid.substr(0,_tid.indexOf("?"));
    		}else{
    			sName = _tid;
    		}
    	}else if($chk(_ctrl)){
    		if(_ctrl.indexOf("?") != -1){
    			sName = _ctrl.substr(0,_ctrl.indexOf("?"));
    		}else{
    			sName = _ctrl;
    		}
    	}
    	if(!$chk(sName))return;
    	var hre = document.location.href;
    	if(hre.indexOf("gndm")!=-1){
    		gndm = hre.substr(hre.indexOf("gndm"));
    		gndm = gndm.substr(gndm.indexOf("=")+1);
    		if(gndm.indexOf("&")!=-1){
    			gndm = gndm.substr(0,gndm.indexOf("&"));
    		}
    	}
    	if(url.indexOf("rUUID")!=-1){
    		rUUID = url.substr(url.indexOf("rUUID"));
    		rUUID = rUUID.substr(rUUID.indexOf("=")+1);
    		if(rUUID.indexOf("&")!=-1){
    			rUUID = rUUID.substr(0,rUUID.indexOf("&"));
    		}
    	}
		var sUrl = url.substr(sDateIndex);
		sUrl = sUrl.substr(sUrl.indexOf("=")+1);
		var sDate;
		if(sUrl.indexOf("&")!=-1){
			sDate = sUrl.substr(0,sUrl.indexOf("&"));
		}else{
			sDate = sUrl
		}
		if(type=='31'){
			hs = eDate - sDate;
		}else{
			hs = eDate - pc.clientAJAXTiming;
		}
		pc.clientAJAXTiming = eDate;
		window.top.setClientMonitorValue(type,sDate,eDate,sName,sessionID,gndm,rUUID,hs);//11AJAX请求计时，该时间为从其他页面开始计时
		
}
}
//客户端计时，type  11请求到页面  12执行before事件（类似页面缓存代码表加载，表达打印添加） 13页面渲染完  14页面初始化方法  15加载页面数据完成
function  _pcSwordClientPageJumpTiming(type){
	if(jsR.config.SwordClientTiming){
		if(!$chk(pc.initData))return;
		var sessionID = pc.initData.getAttr("sessionID");
		if(!$chk(sessionID))return;
		var hre = document.location.href;
		var sDateIndex = hre.indexOf("sDate");
		if(sDateIndex == -1)return;
		var eDate = new Date().getTime();
		var hs;
    	var server;
    	var gndm ; 
    	var rUUID;
    	var sName = pc.getServerName(hre);
    	if(!$chk(sName))return;
    	if(hre.indexOf("gndm")!=-1){
    		gndm = hre.substr(hre.indexOf("gndm"));
    		gndm = gndm.substr(gndm.indexOf("=")+1);
    		if(gndm.indexOf("&")!=-1){
    			gndm = gndm.substr(0,gndm.indexOf("&"));
    		}
    	}
    	if(hre.indexOf("rUUID")!=-1){
    		rUUID = hre.substr(hre.indexOf("rUUID"));
    		rUUID = rUUID.substr(rUUID.indexOf("=")+1);
    		if(rUUID.indexOf("&")!=-1){
    			rUUID = rUUID.substr(0,rUUID.indexOf("&"));
    		}
    	}
		var sHre = hre.substr(sDateIndex);
		sHre = sHre.substr(sHre.indexOf("=")+1);
		var sDate;
		if(sHre.indexOf("&")!=-1){
			sDate = sHre.substr(0,sHre.indexOf("&"));
		}else{
			sDate = sHre
		}
		if(type=='11'){
			hs = eDate - sDate;
		}else{
			hs = eDate - pc.pageJumpTiming;
		}
		pc.pageJumpTiming = eDate;
		window.top.setClientMonitorValue(type,sDate,eDate,sName,sessionID,gndm,rUUID,hs);
		
}
}