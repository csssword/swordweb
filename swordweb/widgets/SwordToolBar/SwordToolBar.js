var SwordToolBar = new Class({
    Implements : [ Events, Options ],
    $family: {name: 'SwordToolBar'},
    options : {
        name : "",
        type : "",
        pNode : null,
        isExtend : "true",
        showType : "normal",  //显示类型：mini / normal,默认normal
        bindTo : null ,//将mini的toolbar嵌入到form或grid中
        isFixed :'true'
    },
    associate : null,
    containerBuffer : null,
    enabledStatus : null,
    onAfterInit : $empty,
    itemEvents:[],
    initParam : function(initPara) {
        this.htmlOptions(initPara);
        this.initToolBar();
        this.onAfterInit();
    },
    initToolBar : function() {
        var child = this.pNode().getChildren();
        if($type(this.pNode().get('showType')) && this.pNode().get('showType') == 'mini'){
        	this.options.showType = 'mini';
        }else{
        	this.options.showType = 'normal';
        }
        var container = this.createContainer();
        var backBox = this.createBackBox(container);
        container.adopt(backBox);
        var associateDiv = this.pNode().getElement("div[name='associate']");
        pc.getPageInit().addEvent('onDataInit', function() {
            this.getAssociate(associateDiv);
        }.bind(this));
        if (child.length != 0) {
            child.each(function(item) {
                var name = item.get('name');
                var type = item.get('type');
				var quickKey = item.get("quickKey");
				var btnDiv;
                var itemO = this.items[name]||this.items[type];
                if (itemO != null) {
                	btnDiv = this.creatDefualtButton(
                            item, name, type,
                            itemO['pclass'],
                            itemO['caption'],
                            itemO['enabled'])
                    backBox.adopt(btnDiv);
                } else {
                    var checkPro = this.checkPro(item);
                    if (checkPro) {
                        var newObj = this.create(item);
                        btnDiv = newObj;
                        backBox.adopt(newObj);
                    } else {
                        if (name != 'associate') {
                            if (item.get('type') == 'custom') {
                            	btnDiv = this.creatBlankButtonDiv(item);
                                backBox.adopt(btnDiv);
                            } else {
                                if (this.alarm) {
                                    alert('缺少必要属性：name,caption或者type!该标签将不被创建！' + item.getHTML());
                                }
                            }
                        }
                    }
                }
                var show = item.get("isShow");
                if(show && show == "false"){
                	if(btnDiv){
                	  btnDiv.setStyle('display', 'none');
                	}
           		}
            }.bind(this))
        }
        var wn = this.options.bindTo,w;
    	if(wn)w = $w(wn);//toolbar必须定义在绑定组件的下面
    	if(wn && this.options.showType=='mini' && w){
    		if('SwordForm'==w.name)this.pNode().inject(w.wrapDiv.getElement('div.swordform-panel-box'),'after');
            else if('SwordGrid'==w.name){
            	this.pNode().inject(w.scrollDiv,'before');
            	//container.setStyles({'border':'none','border-bottom':'1px solid #7F9DB9'});
            }
    	}
    	if(this.options.isFixed=='true'&&!this.options.bindTo){
	    	this.pNode().adopt(new Element('div', {
	    		'styles': {
	    			'height':this.options.showType=='mini'?'24px':'69px'
	            	}
	        }));
    	}
    	this.pNode().adopt(container);
        this.containerBuffer = container;
        this.setEnabledStatus(container);
    },
    setEnabledStatus : function(container) {
        this.enabledStatus = new Object();
        if (container.getElement("div[name='box']").getChildren().length != 0) {
            container.getElement("div[name='box']").getChildren().each(
                    function(item) {
                        this.enabledStatus[item.get('name')] = item
                                .get('enabled');
                    }.bind(this));
        }
    },
    initStatus : function(obj) {
        if ($chk(obj.containerBuffer)) {
            obj.containerBuffer.getElement("div[name='box']").getChildren().each(function(item) {
                obj.enabledStatus[item.get('name')] == 'true' ? obj.setEnabled(item.get('name')) : obj.setDisabled(item.get('name'));
            }.bind(obj));
        }
    },
    pNode : function() {
        return this.options.pNode;
    },
    checkPro : function(obj) {
        return $chk(obj.get('name')) && $chk(obj.get('caption'));
    },
    checkButton : function(buttonName) {
        return $chk(this.containerBuffer.getElement("div[name='box']").getElement("div[name='" + buttonName + "']"));
    },
    isDefault : function(obj) {
        return $chk(obj.get('defualt')) && obj.get('defualt') == 'true';
    },
    getAssociate : function(assDiv) {
        if ($chk(assDiv)) {
            this.associate = new Object();
            var widgets = assDiv.getElements("div[name='associateWighet']").length != 0 ? assDiv.getElements("div[name='associateWighet']") : assDiv.getElements("div[name='associateWidget']");
            widgets.each(function(widget, index) {
                var widgetName = widget.get("widgetName");
                var widgetObj = this.loadWidget(widgetName);
                var widgetType = widgetObj.name;
                var acccociateType = this.associate[widgetType];
                if (!$chk(acccociateType)) {
                    acccociateType = (this.associate[widgetType] = {});
                }
                this.build(widget, widgetType, widgetName);
                this.regAssociateEvent(widgetType, widgetName);
            }.bind(this));
        } else {
            if (this.alarm) {
                alert('请设置ToolBar关联的组件！');
            }
        }
    },
    regAssociateEvent : function(widgetType, widgetName) {
        var widget = $w(widgetName);
        if (this.associate != null) {
            var acc = this.associate[widgetType][widgetName];
            if ($chk(acc)) {
                for (var key in acc.events) {
                    if (key) {
                        var funcArray = this.getFunc(acc.events[key]);
                        for (var i = 0; i < funcArray.length; i++) {
                            var func = funcArray[i];
                            widget.addEvent(key, func.bind(this, [widgetName]));
                        }
                    }
                }
                if (widgetType == "SwordGrid") {
                    if ($chk(acc.muiltCheckFunction)) {
                        widget.addEvent('onAfterCreateHeader', function() {
                            var allCheck = widget.header().getElement('div[_for=' + acc.muiltCheckName + ']').getElement('input');
                            if ($chk(allCheck)) {
                                allCheck.addEvent('click', acc.muiltCheckFunction.bind(this, [allCheck]));
                            }
                        }.bind(this));
                    }
                }
            }
        }
    },
    getSwordGridAllCheckBox : function(widgetName, checkName) {
        return ($w(widgetName).header().getElement(
                'div[_for=' + checkName + ']').getElement('input'));
    },
    loadWidget : function(wighetName) {
        var widgetObject = pc.getWidget(wighetName);
        if ($chk(widgetObject)) {
            return widgetObject;
        } else {
            if (this.alarm) {
                alert('ToolBar组件无法获取关联组件' + wighetName);
            }
        }
    },
    buttonEvents : {
        "onClick" : {
            "SwordGrid" : {
                "firstPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(1);
                    this.initStatus(this);
                },
                "endPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.totalPage());
                    this.initStatus(this);
                },
                "nextPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.pageNum() + 1);
                    this.initStatus(this);
                },
                "previousPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.pageNum() - 1);
                    this.initStatus(this);
                }
            }
        }
    },
    wighetAssociates : {
        "SwordGrid" : {
            event : {
                "onRowClick" : function() {
                    this.rowClick(this);
                },
                "onAfterInitData" : function() {
                    this.initStatus(this);
                },
                onAllCheckClick:function(){
                	this.allCheckClick(this);
                }
            }
        },
        "SwordForm" : null
    }
});
SwordToolBar.implement({
    events : {
        "SwordGrid" : {
            "onRowClick" : "onRowClick",
            "onAfterInitData" : "onAfterInitData"
            ,onAllCheckClick:"onAllCheckClick"
        }
    }
});
SwordToolBar.implement({
    items : {
        "edit" : {
            "caption" : i18n.toolEdit,
            "type" : "edit",
            "pclass" : "edit",
            "enabled" : "false"
        },
        "new" : {
            "caption" : i18n.toolNew,
            "type" : "new",
            "pclass" : "new",
            "enabled" : "true"
        },
        "delete" : {
            "caption" : i18n.toolDel,
            "type" : "delete",
            "pclass" : "delete",
            "enabled" : "false"
        },
        "refresh" : {
            "caption" : i18n.toolFresh,
            "type" : "refresh",
            "pclass" : "refresh",
            "enabled" : "true"
        },
        "open" : {
            "caption" : i18n.toolOpen,
            "type" : "open",
            "pclass" : "open",
            "enabled" : "false"
        },
        "find" : {
            "caption" : i18n.toolFind,
            "type" : "find",
            "pclass" : "find",
            "enabled" : "true"
        },
        "firstPage" : {
            "caption" : i18n.firstPage,
            "type" : "firstPage",
            "pclass" : "firstPage",
            "enable" : "true"
        },
        "endPage" : {
            "caption" : i18n.endPage,
            "type" : "endPage",
            "pclass" : "endPage",
            "enable" : "true"
        },
        "nextPage" : {
            "caption" : i18n.nextPage,
            "type" : "nextPage",
            "pclass" : "nextPage",
            "enable" : "true"
        },
        "previousPage" : {
            "caption" : i18n.previousPage,
            "type" : "previousPage",
            "pclass" : "previousPage",
            "enable" : "true"
        }
        ,
        "save" : {
            "caption" : i18n.toolSave,
            "type" : "save",
            "pclass" : "save",
            "enabled" : "true"
        },
        "back" : {
            "caption" : i18n.toolBack,
            "type" : "back",
            "pclass" : "back",
            "enable" : "true"
        },
        "export" : {
            "caption" : i18n.toolExport,
            "type" : "export",
            "pclass" : "export",
            "enable" : "true"
        },
        "addtime" : {
            "caption" : i18n.toolAddtime,
            "type" : "addtime",
            "pclass" : "addtime",
            "enable" : "true"
        },
        "reducetime" : {
            "caption" : i18n.toolReducetime,
            "type" : "reducetime",
            "pclass" : "reducetime",
            "enable" : "true"
        }
        ,
        "addright" : {
            "caption" : i18n.toolAddright,
            "type" : "addright",
            "pclass" : "addright",
            "enable" : "true"
        },
        "reduceright" : {
            "caption" : i18n.toolReduceright,
            "type" : "reduceright",
            "pclass" : "reduceright",
            "enable" : "true"
        },
        "close" : {
            "caption" : '关闭',
            "type" : 'close',
            "pclass" : "close",
            "enable" : "true"
        },
        "print" : {
            "caption" : '打印',
            "type" : "print",
            "pclass" : "print",
            "enable" : "true"
        },
        "revoke" : {
            "caption" : '废弃',
            "type" : "revoke",
            "pclass" : "revoke",
            "enable" : "true"
        },
        "viewResult" : {
            "caption" : '查看结果',
            "type" : "viewResult",
            "pclass" : "viewResult",
            "enable" : "true"
        },
        "consult" : {
            "caption" : '磋商',
            "type" : "consult",
            "pclass" : "consult",
            "enable" : "true"
        },
        "revoke" : {
            "caption" : '废弃',
            "type" : "revoke",
            "pclass" : "revoke",
            "enable" : "true"
        },
        "import" : {
            "caption" : '导入',
            "type" : "import",
            "pclass" : "import",
            "enable" : "true"
        },
        "lssue" : {
            "caption" : '发出',
            "type" : "lssue",
            "pclass" : "lssue",
            "enable" : "true"
        },
        "investigation" : {
            "caption" : '发函协查',
            "type" : "investigation",
            "pclass" : "investigation",
            "enable" : "true"
        },
        "ticket" : {
            "caption" : '开票',
            "type" : "ticket",
            "pclass" : "ticket",
            "enable" : "true"
        },
        "debit" : {
            "caption" : '扣款',
            "type" : "debit",
            "pclass" : "debit",
            "enable" : "true"
        },
        "inspect" : {
            "caption" : '启动',
            "type" : "inspect",
            "pclass" : "inspect",
            "enable" : "true"
        },
        "sign" : {
            "caption" : '签到',
            "type" : "sign",
            "pclass" : "sign",
            "enable" : "true"
        },
        "receive" : {
            "caption" : '接收',
            "type" : "receive",
            "pclass" : "receive",
            "enable" : "true"
        },
        "violation" : {
            "caption" : '违法登记',
            "type" : "violation",
            "pclass" : "violation",
            "enable" : "true"
        },
        "preview" : {
            "caption" : '预览',
            "type" : "preview",
            "pclass" : "preview",
            "enable" : "true"
        },
        "push" : {
            "caption" : '推送',
            "type" : "push",
            "pclass" : "push",
            "enable" : "true"
        },
        "accept" : {
        	"caption" : '确定',
            "type" : "accept",
            "pclass" : "accept",
            "enable" : "true"
        },
        "registration" : {
        	"caption" : '登记',
            "type" : "registration",
            "pclass" : "registration",
            "enable" : "true"
        }
    }
});
SwordToolBar.implement({
    create : function(obj) {
        if (!$chk(obj.get('name')))return null;
        var type = obj.get('type');
        if (!$chk(type)) {
            type = obj.get('name');
        }
        var pclass = obj.get('pclass');
        var newDoc = new Element('div', {
            'name' : obj.get('name'),
            'type' : type,
            'class' : this.options.showType!='mini'?this.globe.button.backGround:this.mini_globe.button.backGround,
            'enabled' : obj.get('enabled') == null ? 'true' : obj
                    .get('enabled')
        });
        var newDocPic = new Element('div', {
            'class' : pclass == null ? ""
                    : (obj.get('enabled') == 'true'
                    || obj.get('enabled') == null ? obj
                    .get('pclass') + '_enabled' : obj
                    .get('pclass') + '_disabled'),
            'name' : 'image'
       }); 
        var altMes = "";
        var newDesCap = "";
        if(this.options.showType != 'mini' && $chk(obj.get("caption")) && obj.get("caption").length > 4){
        	altMes = obj.get("caption");
        	newDesCap = obj.get("caption").substring(0,3) + "...";
        }else{
        	altMes = obj.get("altMes");
        	newDesCap = obj.get("caption");
        }
        if($chk(altMes))
        	newDoc.set("title",altMes);
        var newDes = new Element('div', {
            'class' : this.options.showType!='mini'?(obj.get('enabled') == 'true'
                    || obj.get('enabled') == null ? this.globe.text.enabled
                    : this.globe.text.disabled):(obj.get('enabled') == 'true'
                        || obj.get('enabled') == null ? this.mini_globe.text.enabled
                                : this.mini_globe.text.disabled),
            'name' : 'caption',
            'html' : obj.get('caption') == null ? caption : newDesCap
        });
        newDoc.adopt(newDocPic, newDes);
        if($chk(obj.get('x'))){
        	newDoc.set({
                'styles': {
                'width': obj.get('x')
            	}
            });
        }

        var itemEvent = new ItemEvent();
        itemEvent.initParam(obj);
        itemEvent.pNode = this.options.pNode;
        this.itemEvents.include(itemEvent);
        newDoc.addEvent('click', function() {
            if (newDoc.get('enabled') == 'true') {
                itemEvent.regOnClick();
            }
        });
        newDoc.addEvent('mouseover', function(e) {
            if (newDoc.get('enabled') == 'true') {
                itemEvent.regOnMouseOver(e);
            }
        });

        newDoc.addEvent('mouseout', function(e) {
            if (newDoc.get('enabled') == 'true') {
                itemEvent.regOnMouseout(e);
            }
        });
        newDoc.addEvent('mousedown', function(e) {
            if (newDoc.get('enabled') == 'true') {
                itemEvent.regOnMouseDown(e);
            }
        });
        newDoc.addEvent('mouseup', function(e) {
            if (newDoc.get('enabled') == 'true') {
                itemEvent.regOnMouseUp(e);
            }
        });
        return newDoc;
    },
    creatDefualtButton : function(obj, name, type, pclass, caption, enabled, addEvent) {
        if (!$chk(type)) {
            type = name;
        }
        var newDiv = new Element('div', {
            'name' : name,
            'type' : type,
            'class' : this.options.showType!='mini'?this.globe.button.backGround:this.mini_globe.button.backGround,
            'enabled' : !$chk(obj.get('enabled')) ? ($chk(enabled) ? enabled
                    : "true")
                    : obj.get('enabled')
        });
        	var quickKey = obj.get("quickKey");
        	if($chk(quickKey)){
        		newDiv.set("quickKey",quickKey);
        	}
        var newPic = new Element('div', {
            'class' : $chk(obj.get('enabled')) ? (obj
                    .get('enabled') == 'true' ? pclass + '_enabled'
                    : pclass + '_disabled')
                    : ($chk(enabled) ? (enabled == "true" ? pclass + '_enabled'
                    : pclass + '_disabled')
                    : pclass + '_enabled'),
            'name' : 'image'
        });
        var altMes = "";
        var newDesCap = "";
        if(this.options.showType != 'mini' && $chk(obj.get("caption")) && obj.get("caption").length > 4){
        	altMes = obj.get("caption");
        	newDesCap = obj.get("caption").substring(0,3) + "...";
        }else{
        	altMes = obj.get("altMes");
        	newDesCap = obj.get("caption");
        }
        if($chk(altMes))
        	newDiv.set("title",altMes);
        var newDes = new Element('div', {
            'class' : this.options.showType!='mini'?($chk(obj.get('enabled')) ? (obj
                    .get('enabled') == 'true' ? this.globe.text.enabled
                    : this.globe.text.disabled)
                    : ($chk(enabled) ? (enabled == "true" ? this.globe.text.enabled
                    : this.globe.text.disabled)
                    : this.globe.text.enabled)):($chk(obj.get('enabled')) ? (obj
                            .get('enabled') == 'true' ? this.mini_globe.text.enabled
                                    : this.mini_globe.text.disabled)
                                    : ($chk(enabled) ? (enabled == "true" ? this.mini_globe.text.enabled
                                    : this.mini_globe.text.disabled)
                                    : this.mini_globe.text.enabled)),
            'name' : 'caption',
            'html' : obj.get('caption') == null ? caption : newDesCap
        });
        newDiv.adopt(newPic, newDes);
        if($chk(obj.get('x'))){
            newDiv.set({
                'styles': {
                'width': obj.get('x')
            	}
            });
        }

        var itemEvent = new ItemEvent();
        itemEvent.initParam(obj);
        if($chk(addEvent)){
        	itemEvent.initEvents();
        }
        itemEvent.buttonEvents = this.buttonEvents;
        itemEvent.pNode = this.options.pNode;
        itemEvent.initStatus = this.initStatus.bind(this);
        this.itemEvents.include(itemEvent);
        newDiv.addEvent('click', function() {
            if (newDiv.get('enabled') == 'true') {
                itemEvent.regOnClick();
            }
        });
        newDiv.addEvent('mouseover', function(e) {
            if (newDiv.get('enabled') == 'true') {
                itemEvent.regOnMouseOver(e);
            }
        });
        newDiv.addEvent('mouseout', function(e) {
            if (newDiv.get('enabled') == 'true') {
                itemEvent.regOnMouseout(e);
            }
        });
        newDiv.addEvent('mousedown', function(e) {
            if (newDiv.get('enabled') == 'true') {
                itemEvent.regOnMouseDown(e);
            }
        });
        newDiv.addEvent('mouseup', function(e) {
            if (newDiv.get('enabled') == 'true') {
                itemEvent.regOnMouseUp(e);
            }
        });
        return newDiv;
    },
    creatBlankButtonDiv : function(el) {
        var newDiv = new Element('div', {
            'name' : name,
            'class' : this.globe.blankButtonDiv
        });
        newDiv.adopt(el);
        return newDiv;
    },
    setDisabled : function(strType) {
        var container = this.options.pNode.getElement("div[name='container']");
        var parentDivs = container.getElements("div[name='" + strType + "']");
        if (parentDivs.length == 0)return null;
//        var i=0;
//        for(i=0;i<parentDivs.length;i++){
           var  parentDiv=parentDivs[0];
           if(this.options.pNode.get('showType')=='mini'&&parentDiv.hasClass("tb_mini_hover"))parentDiv.removeClass('tb_mini_hover').removeClass('tb_mini_texthover');
            parentDiv.set('enabled', 'false');
            var imageDiv = parentDiv.getElements("div[name='image']")[0];
            var imageClass = (imageDiv.get('class')).replace('_enabled', '_disabled');
            var imagePath = null;
            if ($chk(imagePath)) {
                var pathSuffix = imagePath.substring(imagePath.lastIndexOf('.') + 1);
                var pathStr = imagePath.substring(0, imagePath.lastIndexOf('.'));
                var newPath = pathStr.replace('_disabled', '') + '_disabled.' + pathSuffix;
                imageDiv.setStyles({'background-image' : 'url("' + newPath + '")'});
            } else {
                imageDiv.set('class', imageClass);
            }
            var captionSpan = parentDiv.getElements("div[name='caption']")[0];
            captionSpan.set('class', this.options.showType != 'mini' ? this.globe.text.disabled : this.mini_globe.text.disabled);
//        }

    },
    setEnabled : function(strName) {
        var container = this.options.pNode.getElement("div[name='container']");
        var parentDivs = container.getElements("div[name='" + strName + "']");
        if (parentDivs.length == 0)return null;

//        var i=0;
//        for(i=0;i<parentDivs.length;i++){
            var parentDiv=parentDivs[0];
            parentDiv.set('enabled', 'true');
            var imageDiv = parentDiv.getElements("div[name='image']")[0];
            var imageClass = (imageDiv.get('class')).replace('_disabled', '_enabled');
            var imagePath = null;
            if ($chk(imagePath)) {
                var pathSuffix = imagePath.substring(imagePath.lastIndexOf('.') + 1);
                var pathStr = imagePath.substring(0, imagePath.lastIndexOf('.'));
                var newPath = pathStr.replace('_disabled', '') + '.' + pathSuffix;
                imageDiv.setStyles({'background-image' : 'url("' + newPath + '")'});
            } else {
                imageDiv.set('class', imageClass);
            }
            var captionSpan = parentDiv.getElements("div[name='caption']")[0];
            captionSpan.set('class', this.options.showType != 'mini' ? this.globe.text.enabled : this.mini_globe.text.enabled);
//        }


    },
    setDisplay : function(strName) {
        var container = this.options.pNode.getElements("div[name='container']");
        var parentDiv = container.getElements("div[type='" + strName + "']");
        if (parentDiv.length == 0) {
            return null;
        }
        var buttonDiv = parentDiv[0];
        buttonDiv.setStyle('display', '');
    },
    setHide : function(strName) {
        var container = this.options.pNode.getElements("div[name='container']");
        var parentDiv = container.getElements("div[type='" + strName + "']");
        if (parentDiv.length == 0)return null;
        var buttonDiv = parentDiv[0];
        buttonDiv.setStyle('display', 'none');
    },
    buildDisablePic : function(picPath) {
        var suffixIndex = picPath.lastIndexOf('.');
        var suffix = picPath.substring(suffixIndex + 1)
        var picPathStr = picPath.substring(0, suffixIndex);
        var disabledPathStr = picPathStr.replace('_disabled', '') + '_disabled';
        return disabledPathStr + '.' + suffix;
    },
    createContainer : function() {
        var container = new Element('div', {
            'name' : 'container',
            'class' : this.options.showType!='mini'?this.globe.box.backGround:this.mini_globe.box.backGround
        });
        var containerTop;
        var containerBottom;
        var containerLeft = new Element('div', {
            'class' : this.options.showType!='mini'?this.globe.box.left:this.mini_globe.box.left
        });
        var containerRight = new Element('div', {
            'class' : this.options.showType!='mini'?this.globe.box.right:this.mini_globe.box.right
        });
        container.adopt(containerLeft, containerRight);
        if(this.options.isFixed=='true'&&!this.options.bindTo){
        	container.addClass('toolbar_fixed');
        }
        return container;
    },
    createBackBox : function(container) {
        return new Element('div', {
            'class' : this.options.showType!='mini'?this.globe.box.back:this.mini_globe.box.back,
            'name' : 'box'
        });
    }
});
SwordToolBar.implement( {
	globe : {
		box : {
			backGround : "tb_box",
			top : "",
			bottom : "",
			left : "l",
			right : "r",
			back : "c"
		},
		button : {
			backGround : "tb",
			top : "",
			bottom : "",
			left : "",
			right : ""
		},
		text : {
			enabled : "text_enabled",
			disabled : "text_disabled"
		},
		blankButtonDiv : "tb_blank"
	},
	mini_globe :{
		box : {
			backGround : "tb_mini_box",
			top : "",
			bottom : "",
			left : "l",
			right : "r",
			back : "c"
		},
		button : {
			backGround : "mini_tb",
			top : "",
			bottom : "",
			left : "",
			right : ""
		},
		text : {
			enabled : "text_enabled",
			disabled : "text_disabled"
		}
	}
	,
	defaultCss : {
		"new" : "new",
		"open" : "open",
		"find" : "find",
		"delete" : "delete",
		"refresh" : "refresh"
	}
});
SwordToolBar.implement({
    build : function(wighetDiv, wighetType, wighetName) {
        if (wighetType == 'SwordGrid') {
            var swordGridEvents = this.events['SwordGrid'];
            var accWighet = this.associate[wighetType][wighetName];
            if (!$chk(accWighet)) {
                accWighet = (this.associate[wighetType][wighetName] = {});
            }
            this.associate[wighetType][wighetName].muiltCheckName = wighetDiv.getElement("div[name='muiltCheck']").get('checkName');
            var accEvents = accWighet.events;
            if (!$chk(accEvents)) {
                accEvents = (accWighet.events = {});
            }
            if (this.options.isExtend == 'true') {
                this.pluginBuild(wighetType, wighetName);
            }
            for (var key in swordGridEvents) {
                var tempEvent = wighetDiv.get(key);
                if ($chk(tempEvent)) {
                    if ($chk(this.events[wighetType][key])) {
                        this.associate[wighetType][wighetName].events[this.events[wighetType][key]] = tempEvent;
                    }
                }
            }
        }
    },
    pluginBuild : function(wighetType, wighetName) {
        var wighetDefaultEvent = this.wighetAssociates[wighetType].event;
        for (var key in wighetDefaultEvent) {
            this.associate[wighetType][wighetName].events[this.events[wighetType][key]] = wighetDefaultEvent[key];
        }
        var wighetMuiltCheck = this.gridMuiltCheck;
        if ($chk(wighetMuiltCheck)) {
            this.associate[wighetType][wighetName].muiltCheckFunction = wighetMuiltCheck;
        }
    }
});
SwordToolBar.implement( {
	associate : {
		"SwordGrid" : {},
		"SwordForm" : {},
		"SwordSubmit" : {}
	}
});
var ItemEvent = new Class({
    Implements : [ Events, Options ],
    options : {
        '_onClick' : null,
        'onClick' : null,
        'onBlur' : null,
        'onMouseover' : null,
        'onMouseout' : null,
        'onMousedown' : null,
        'onMouseup' : null,
        'name' : "",
        'type' : "",
        'gridName' : ""
    },
    buttonEvents : null,
    pNode : null,
    initStatus : $empty,
    earseEvent:function(el, events) {
        events.each(function(e) {
            var f = el.get(e);
            if(f) {
                if(Browser.Engine.trident4 || Browser.Engine.trident5) {
                        f += '';
                    if(f.indexOf('{')!=-1){
                        f = f.substring(f.indexOf('{') + 1, f.lastIndexOf('}'));
                	}
                }
                el.set('_' + e, f);
                el.erase(e);
            }
        });
    },
    initEvents:function(){
        if ($chk(this.options.gridName)) {
            if (!$chk(this.options.onClick)) {
                if ($chk(this.buttonEvents)) {
                    for (var key in this.buttonEvents) {
                        var wName = this.buttonEvents[key];
                        var events = wName[$w(this.options.gridName).name];
                        var event = events[this.options.type];
                        if ($chk(event)) {
                            this.addEvent(key, event.bind(this, [ this.options.gridName ]));
                        }
                    }
                }
            }
        }
        if (!$chk(this.options.onMouseover)) {
            this.addEvent('onMouseover', function(e) {
                var div = e.target.getParent("div[name='"+ this.options.name + "']") ;
                if(!div)return;
                var docClass = div.get('class')[0];
                var newDocClass;
                if(this.pNode.get('showType')!='mini'){
                    div.removeClass('tb_hover');
                    div.removeClass('tb_hover');
                    div.addClass('tb_hover');
                }else{
                	div.removeClass('tb_mini_hover');
                    div.removeClass('tb_mini_hover');
                    div.addClass('tb_mini_hover');
                	var textdiv = div.getElements("div[name='caption']")[0];
                    textdiv.removeClass('tb_mini_texthover');
                	textdiv.removeClass('tb_mini_texthover');
                	textdiv.addClass('tb_mini_texthover');
                }
            }.bind(this));
        }
        if (!$chk(this.options.onMouseout)) {
            this.addEvent('onMouseout', function(e) {
                var div = e.target.getParent("div[name='"+ this.options.name + "']") ;
                if(!div)return;
                var docClass = div.get('class')[0];
                var newDocClass;
                if(this.pNode.get('showType')!='mini'){
                	div.removeClass('tb_hover');
                    div.removeClass('tb_hover');
                }else{
                	div.removeClass('tb_mini_hover');
                    div.removeClass('tb_mini_hover');
                	var textdiv = div.getElements("div[name='caption']")[0];
                	textdiv.removeClass('tb_mini_texthover');
                	textdiv.removeClass('tb_mini_texthover');
                }
            }.bind(this));
        }
        if (!$chk(this.options.onMousedown)) {
            this.addEvent('onMousedown', function(e) {
                var div = e.target.getParent("div[name='"+ this.options.name + "']") ;
                if(!div)return;
                var docClass = div.get('class')[0];
                var newDocClass;
                if(this.pNode.get('showType')!='mini'){
                	div.removeClass('tb_click');
                    div.removeClass('tb_click');
                    div.addClass('tb_click');
                }else{
                	div.removeClass('tb_mini_click');
                    div.removeClass('tb_mini_click');
                    div.addClass('tb_mini_click');
                	var textdiv = div.getElements("div[name='caption']")[0];
                    textdiv.removeClass('tb_mini_textclick');
                	textdiv.removeClass('tb_mini_textclick');
                	textdiv.addClass('tb_mini_textclick');
                }
            }.bind(this));
        }
        if (!$chk(this.options.onMouseup)) {
            this.addEvent('onMouseup', function(e) {
                var div = e.target.getParent("div[name='"+ this.options.name + "']") ;
                if(!div)return;
                var docClass = div.get('class')[0];
                var newDocClass;
                if(this.pNode.get('showType')!='mini'){
                    div.removeClass('tb_click');
                    div.removeClass('tb_click');
                    div.removeClass('tb_hover');
                    div.removeClass('tb_hover');
                }else{
                	div.removeClass('tb_mini_click');
                    div.removeClass('tb_mini_click');
                	div.removeClass('tb_mini_hover');
                    div.removeClass('tb_mini_hover');
                	var textdiv = div.getElements("div[name='caption']")[0];
                	textdiv.removeClass('tb_mini_textclick');
                	textdiv.removeClass('tb_mini_textclick');
                    textdiv.removeClass('tb_mini_texthover');
                	textdiv.removeClass('tb_mini_texthover');
                }
            }.bind(this));
        }
    
    },
    initParam : function(initPara) {
    	this.earseEvent(initPara,['onclick']);
        this.htmlOptions(initPara);
        if (!$chk(this.options.type)) {
            this.options.type = this.options.name;
        }
        pc.getPageInit().addEvent('onDataInit', this.initEvents.bind(this));
    },
    regOnClick : function() {
    	if($defined(this.options._onClick))
            this.getFunc(this.options._onClick)[0]();
    	else if($defined(this.options.onClick)){
    		this.getFunc(this.options.onClick)[0]();
    	} else{
            this.fireEvent('onClick');
        }
    },
    regOnMouseOver : function(e) {
        this.fireEvent('onMouseover',e);
    },
    regOnMouseDown : function(e) {
        this.fireEvent('onMousedown',e);
    },
    regOnMouseUp : function(e) {
        this.fireEvent('onMouseup',e);
    },
    regOnMouseout : function(e) {
        this.fireEvent('onMouseout',e);
    }
});
