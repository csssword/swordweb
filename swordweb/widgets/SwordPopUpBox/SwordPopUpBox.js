var SwordPopUpBox = new Class({
    Implements: [Events,Options],
    name: 'SwordPopUpBox',
    options:{
        type: null,
        top: null,
        left: null,
        width: 300,
        height: 185,
        zIndex: 10001,
        position: 'absolute',//absolute是默认的提示框的位置,放在中间显示,fixed是可以自由定制
        titleName: i18n.titleName,
        okBtnName: i18n.okBtnName,
        cancelBtnName: i18n.cancelBtnName,
        defineBtnName:i18n.defineBtnName,
        isShowDefineBtnName:"false",
        message: null,
        promptValue: "",
        isMin:"true",
        isNormal:'true',
        isMax:'true',
        isClose:'true',
        isShowMask: true,
        mask:{
            background:'gray',
            opacity: 0.5,
            zIndex: 30000,
            position: 'absolute',
            left: null,
            top: null,
            width: null,
            height: null
        }
        ,onOk:$empty
        ,onDefine:$empty
        ,onCancel:$empty
        ,onClose:$empty
        ,onShow:$empty
        ,onHide:$empty
        ,onMin:$empty
        ,onMax:$empty
        ,onNormal:$empty
        ,popUpTweenTime: 200//这个是msn的popup跳转的时间
        ,popUpTween:[]
        ,isAutoDisAppear: "false"//是否需要自动消失
        ,autoDisAppearTime: 5000//自动关闭需要的时间
        ,param:null //传递的参数
        ,max:false//初始化是否最大化，默认false
        ,dragObj:null
    },
    maskObj: null,
    mask: null,
    popUpDiv: null,
    titleDiv: null,
    titleNameDiv: null,
    titleMinDiv: null,
    titleNormalDiv: null,
    titleMaxDiv: null,
    titleCloseDiv: null,
    contentDiv: null,
    contentIframe:null,
    contentMessageDiv: null,
    contentPromptInput: null,
    operateDiv: null,
    operateOkBtn: null,
    operateCancelBtn: null,
    operateDefineBtn:null,
    returnValue: null,
    popUpState:"normal",//normal,min,max三个状态
    bodySize:{
        width: 0,
        height: 0
    },
    isMsnFlag:false,
    initialize: function(options) {
//        this.removeEvents();
//        $extend(this.options,{width:300,height:185});
        this.setOptions(options);
    },
    initParam: function(node) {

    },
    initData: function() {

    },
    createAllDiv: function(maskObj) {
    	var docm = window.document;
    	if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)docm=parent.window.document;
        this.popUpDiv = new Element('div', {
            'id': 'ym-window',
            'styles': {
                'z-index': this.options.zIndex,
                'position': "absolute",
                'left': this.options.left,
                'top':-1000,        //这个默认值-1000是为了在创建popup div 的时候，不占页面的高度
                'width': this.options.width,
                'height': this.options.height
            }
        }).inject(docm.body);

        if (this.options.popUpTween.length != 0) {
            this.popUpDiv.setStyle('display', 'none');//如果需要特效的话,那么首先置为灰
        }

        this.bodySize.width = $(docm.body).getSize().x;
        this.bodySize.height = $(docm.body).getSize().y;
        //判断条件---1. body/非body , 2. 显示蒙版/非显示蒙版
        if (!$defined(maskObj) || ($defined(maskObj) && this.isBody(maskObj))) {
            this.maskObj = docm.body;
            if (this.options.isShowMask == true) {
                if (jsR.config.swordPopUpBox.flag) {
                    this.options.mask.zIndex = this.options.mask.zIndex + jsR.config.swordPopUpBox.number;
                    jsR.config.swordPopUpBox.number++;
                }
                this.mask = new SwordMask(this.options.mask);
                this.mask.mask(this.maskObj, this.popUpDiv);
                pc.maskState = true;
                if($chk(this.mask.maskDiv))this.mask.maskDiv.setStyle('width','100%');  //自适应宽度
                if($chk(this.mask.maskIframe))this.mask.maskIframe.setStyle('width','100%');
                if (this.options.top == null)this.options.top = this.mask.getElPosition().top;
                else this.setTop(this.popUpDiv,this.options.top);
                if (this.options.left == null)this.options.left = this.mask.getElPosition().left;
                else this.popUpDiv.setStyle("left",this.options.left);
            } else {
                if (this.options.left == null)this.options.left = ($(this.maskObj).getSize().x - this.options.width) / 2 + $(docm.body).getScroll().x;
                if (this.options.top == null)this.options.top = ($(this.maskObj).getSize().y - this.options.height) / 2 + $(docm.body).getScroll().y;
                this.popUpDiv.setStyles({
                    'z-index': this.options.zIndex,
                    'position': "absolute",
                    'left': this.options.left,
//                    'top': this.options.top,
                    'width': this.options.width,
                    'height': this.options.height
                });
                this.setTop(this.popUpDiv,this.options.top);
            }
        } else {
            this.maskObj = maskObj;
            if (this.options.isShowMask == true) {
                if (jsR.config.swordPopUpBox.flag) {
                    this.options.mask.zIndex = this.options.mask.zIndex + jsR.config.swordPopUpBox.number;
                    jsR.config.swordPopUpBox.number++;
                }
                this.mask = new SwordMask(this.options.mask);
                this.mask.mask(this.maskObj, this.popUpDiv);
                if (this.options.top == null)this.options.top = this.mask.getElPosition().top;
                if (this.options.left == null)this.options.left = this.mask.getElPosition().left;
            } else {
                //to do 当没有蒙版的maskObj时候的popupbox的还没有
                if (this.options.left == null)this.options.left = this.maskObj.getPosition().x + (this.maskObj.getSize().x - this.options.width) / 2 + this.maskObj.getScroll().x;
                if (this.options.top == null)this.options.top = this.maskObj.getPosition().y + (this.maskObj.getSize().y - this.options.height) / 2 + this.maskObj.getScroll().y;
                this.popUpDiv.setStyles({
                    'z-index': this.options.zIndex,
                    'position': "absolute",
                    'left': this.options.left,
//                    'top': this.options.top,
                    'width': this.options.width,
                    'height': this.options.height
                });
                this.setTop(this.popUpDiv,this.options.top);
            }
        }

        if (this.options.position == "fixed") {
            this.popUpDiv.setStyles({
                'position': "absolute",
                'left': this.options.left,
//                'top': this.options.top,
                'width': this.options.width,
                'height': this.options.height
            });
            this.setTop(this.popUpDiv,this.options.top);
        }

        this.popUpDiv.setStyle('height','auto');  //自适应的高度
    },

    createTitle: function() {
    	var docm = window.document;
    	if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)docm=parent.window.document;
        var tempDiv0 = new Element('div', {
            'id': 'ym-tl',
            'class': 'ym-tl'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-tr'
        }).inject(tempDiv0);
        this.titleDiv = new Element('div', {
            'class': 'ym-tc',
            'styles': {
                'cursor': 'move'
            }
        }).inject(tempDiv1);
        this.titleNameDiv = new Element('div', {
            'class': 'ym-header-text'
        }).inject(this.titleDiv);
        this.titleNameDiv.appendText(this.options.titleName);
        var tempDiv3 = new Element('div', {
            'class': 'ym-header-tools'
        }).inject(this.titleDiv);

        if (this.options.type == "ymPrompt_iframe" || this.options.type == "ymPrompt_msn") {
            if (this.options.isMin == "true") {
                this.titleMinDiv = new Element('div', {
                    'class': 'ymPrompt_min',
                    'title': i18n.boxMin,
                    'styles': {
                        'visibility': 'inherit'
                    }
                }).inject(tempDiv3);
                this.titleMinDiv.addEvent('click', this.min.bind(this));
            }

            if (this.options.isNormal == "true") {
                this.titleNormalDiv = new Element('div', {
                    'class': 'ymPrompt_normal',
                    'title': i18n.boxNatural,
                    'styles': {
                        'visibility': 'inherit'
                    }
                }).inject(tempDiv3);
                this.titleNormalDiv.addEvent('click', this.normal.bind(this));
            }

            if (this.options.isMax == "true") {
                this.titleMaxDiv = new Element('div', {
                    'class': 'ymPrompt_max',
                    'title': i18n.boxMax,
                    'styles': {
                        'visibility': 'inherit'
                    }
                }).inject(tempDiv3);
                this.titleMaxDiv.addEvent('click', this.max.bind(this));
            }
        }

        if (this.options.isClose == "true") {
            this.titleCloseDiv = new Element('div', {
                'class': 'ymPrompt_close',
                'title': i18n.boxClose
            }).inject(tempDiv3);
            this.titleCloseDiv.addEvent('click', function(e) {
                this.closePopUpBox();
            }.bind(this));
        }
        this.dragObj = new Drag(this.popUpDiv, {
            snap :5,
            limit:{x:[0,$(docm.body).getWidth()-this.popUpDiv.getWidth()],y:[0,$(docm.body).getHeight()-this.options.height-20]},
            handle: this.titleDiv,
            onBeforeStart :function(){
                var h=$(docm.body).getHeight()-this.options.height-20;
                if(h<0)h=0;
                this.dragObj.options.limit={x:[0,$(docm.body).getWidth()-this.popUpDiv.getWidth()],y:[0,h]};
            }.bind(this),
            onComplete: function(el) {
                el.getElements('iframe').setStyle('display', '');
            }.bind(this)
            ,onStart:function(el) {
                if(this.popUpState == "min")this.dragObj.limit.y = [0,$(docm.body).getHeight() - 48];//最小化时，重新计算
                el.getElements('iframe').setStyle('display', 'none');
            }.bind(this)
        });

    },
    createContent: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-ml',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        var tempDiv2 = new Element('div', {
            'class': 'ym-mc'
        }).inject(tempDiv1);
        this.contentDiv = new Element('div', {
            'class': 'ym-body ' + this.options.type,
            'styles': {
                'position': 'relative',
                'width': this.options.width - 100
                //,'height': this.options.height - 69    //高度应该是根据文本自动适应的
            }
        }).inject(tempDiv2);
        this.contentMessageDiv = new Element('div', {
            'class': 'ym-content'
        }).inject(this.contentDiv);
        this.contentMessageDiv.set('html', this.options.message);

    },
    createContent4Div: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-ml',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        var tempDiv2 = new Element('div', {
            'class': 'ym-mc'
        }).inject(tempDiv1);
        this.contentDiv = new Element('div', {
            'class': 'ym-body ' + this.options.type,
            'styles': {
                'position': 'relative',
                'width': this.options.width - 10,
                'height': this.options.height - 69
            }
        }).inject(tempDiv2);
        this.contentMessageDiv = new Element('div', {
            'class': 'ym-content'
        }).inject(this.contentDiv);
        this.contentMessageDiv.set('html', this.options.message);

    },
    createIframeContent: function(isHeight,name) {
        var tempDiv0 = new Element('div', {
            'id': 'ym-ml',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        var tempDiv2 = new Element('div', {
            'class': 'ym-mc'
        }).inject(tempDiv1);
        this.contentDiv = new Element('div', {
            'class': 'ym-body',
            'styles': {
                'position': 'relative',
                'width': '100%',
                'height': (isHeight)?this.options.height:this.options.height-28
            }
        }).inject(tempDiv2);

        var frameName = name||"IFrame" + $time();
        this.contentIframe = new Element("iframe");
        var url = $chk(this.options.message) ? pageContainer.AddBaseCode2URL(this.options.message) : this.options.message;
        this.contentIframe.setProperties({"name":frameName,"id":frameName,"src": url,"frameBorder":"0"});
        this.contentIframe.setStyles({'left': 0,
            'top': 0,
            'width': '100%',
            'border':'0px',
            'height': (isHeight)?this.options.height:this.options.height-28});
        this.contentIframe.inject(this.contentDiv);
        var win = window;
        if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)win=parent.window;
        var f1 = win.frames[frameName];
        f1.name = frameName;//必需加上这句，否则ie6、7的name赋值不上
        this.addEvent("onOk", this.closePopUpBox);
        this.addEvent("onCancel", this.closePopUpBox);
        return f1;
    },
    createPromptContent: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-ml',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        var tempDiv2 = new Element('div', {
            'class': 'ym-mc'
        }).inject(tempDiv1);
        this.contentDiv = new Element('div', {
            'class': 'ym-body ' + this.options.type,
            'styles': {
                'position': 'relative',
                'width': this.options.width - 100,
                'height': this.options.height - 69
            }
        }).inject(tempDiv2);
        this.contentMessageDiv = new Element('div', {
            'class': 'ym-content'
        }).inject(this.contentDiv);
        this.contentMessageDiv.appendText(this.options.message);
        var tempBr = new Element('br').inject(this.contentDiv);
        this.contentPromptInput = new Element('input', {
            'type': 'text'
        }).inject(this.contentDiv);
        this.contentPromptInput.addEvent('click', function(e) {
            this.contentPromptInput.focus();
        }.bind(this));
        this.contentPromptInput.value = this.options.promptValue;
    },
    createAlertOperate: function() {

        var tempDiv0 = new Element('div', {
            'id': 'ym-btnl',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        this.operateDiv = new Element('div', {
            'class': 'ym-btn'
        }).inject(tempDiv1);
        this.operateOkBtn = new Element('input', {
            'id': 'ymPrompt_btn_0',
            'class': 'btnStyle handler',
            'type': 'button',
            'value': this.options.okBtnName,
            'styles': {
                'cursor': 'pointer'
            }
        }).inject(this.operateDiv);
        this.operateOkBtn.addEvent('click', function(e) {
            this.fireEvent("onOk");
            this.closePopUpBox();

        }.bind(this));
        this.operateOkBtn.focus();
    },
    createConfirmOperate: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-btnl',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        this.operateDiv = new Element('div', {
            'class': 'ym-btn'
        }).inject(tempDiv1);
        this.operateOkBtn = new Element('input', {
            'id': 'ymPrompt_btn_0',
            'class': 'btnStyle handler',
            'type': 'button',
            'value': this.options.okBtnName,
            'styles': {
                'cursor': 'pointer'
            }
        }).inject(this.operateDiv);
        if(this.options.isShowDefineBtnName=="true"){
            this.operateDefineBtn = new Element('input', {
                'id': 'ymPrompt_btn_2',
                'class': 'btnStyle handler',
                'type': 'button',
                'value': this.options.defineBtnName,
                'styles': {
                    'cursor': 'pointer'
                }
            }).inject(this.operateDiv);
            this.operateDefineBtn.addEvent('click', function(e) {
                this.fireEvent("onDefine");
                this.closePopUpBox();
            }.bind(this));
        }
        this.operateCancelBtn = new Element('input', {
            'id': 'ymPrompt_btn_1',
            'class': 'btnStyle handler',
            'type': 'button',
            'value': this.options.cancelBtnName,
            'styles': {
                'cursor': 'pointer'
            }
        }).inject(this.operateDiv);
        this.operateOkBtn.addEvent('click', function(e) {
            this.fireEvent("onOk");
            this.closePopUpBox();

        }.bind(this));
        this.operateCancelBtn.addEvent('click', function(e) {
            this.fireEvent("onCancel");
            this.closePopUpBox();
        }.bind(this));
    },
    createPromptOperate: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-btnl',
            'class': 'ym-ml'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-mr'
        }).inject(tempDiv0);
        this.operateDiv = new Element('div', {
            'class': 'ym-btn'
        }).inject(tempDiv1);
        this.operateOkBtn = new Element('input', {
            'id': 'ymPrompt_btn_0',
            'class': 'btnStyle handler',
            'type': 'button',
            'value': this.options.okBtnName,
            'styles': {
                'cursor': 'pointer'
            }
        }).inject(this.operateDiv);
        if(this.options.isShowDefineBtnName=="true"){
            this.operateDefineBtn = new Element('input', {
                'id': 'ymPrompt_btn_2',
                'class': 'btnStyle handler',
                'type': 'button',
                'value': this.options.defineBtnName,
                'styles': {
                    'cursor': 'pointer'
                }
            }).inject(this.operateDiv);
            this.operateDefineBtn.addEvent('click', function(e) {
                this.fireEvent("onDefine");
                this.closePopUpBox();
            }.bind(this));
        }
        this.operateCancelBtn = new Element('input', {
            'id': 'ymPrompt_btn_1',
            'class': 'btnStyle handler',
            'type': 'button',
            'value': this.options.cancelBtnName,
            'styles': {
                'cursor': 'pointer'
            }
        }).inject(this.operateDiv);
        this.operateOkBtn.addEvent('click', function(e) {
            this.fireEvent("onOk", this.contentPromptInput.value);
            this.closePopUpBox();
        }.bind(this));
        this.operateCancelBtn.addEvent('click', function(e) {
            this.fireEvent("onCancel");
            this.closePopUpBox();
        }.bind(this));
    },
    createTail: function() {
        var tempDiv0 = new Element('div', {
            'id': 'ym-bl',
            'class': 'ym-bl'
        }).inject(this.popUpDiv);
        var tempDiv1 = new Element('div', {
            'class': 'ym-br'
        }).inject(tempDiv0);
        var tempDiv2 = new Element('div', {
            'class': 'ym-bc'
        }).inject(tempDiv1);
    },
    addPopUpTween: function() {
        for (var i = 0; i < this.options.popUpTween.length; i++) {
            new Fx.Tween(this.popUpDiv, {duration:this.options.popUpTween[i]["popUpTweenTime"], transition: this.options.popUpTween[i]["popUpTweenTransitionType"]}).start(this.options.popUpTween[i]["popUpTweenStyle"], this.options.popUpTween[i]["popUpTweenStyleFrom"], this.options.popUpTween[i]["popUpTweenStyleTo"]);
        }
        if (this.options.popUpTween.length != 0) {
            this.popUpDiv.setStyle('display', 'block');//如果需要特效的话,那么首先置为灰
        }
    },
    alert: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_alert";
        this.createAllDiv(maskObj);
        this.createTitle();
        this.createContent();
        this.createAlertOperate();
        this.createTail();
        this.addPopUpTween();
        //this.operateOkBtn.focus();
    },
    alertRight: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_succeed";
        this.createAllDiv(maskObj);
        this.createTitle();
        this.createContent();
        this.createAlertOperate();
        this.createTail();
        this.addPopUpTween();
        this.operateOkBtn.focus();
    },
    /**
     创建alert错误信息类型的提示框
     @function {public null} createAlertWrong
     @param {object} options - 提示框的选项
     @param {element} maskObj - 蒙版蒙住的元素
     @returns null
     */
    alertWrong: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_error";
        //this.options.width = "500px";

        this.createAllDiv(maskObj);
        this.createTitle();
        this.createContent();
        this.createAlertOperate();
        this.createTail();
        this.addPopUpTween();
        this.operateOkBtn.focus();
    },
    /**
     创建confirm信息类型的提示框
     @function {public null} createConfirm
     @param {object} options - 提示框的选项
     @param {element} maskObj - 蒙版蒙住的元素
     @returns null
     */
    confirm: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_confirm";
        this.createAllDiv(maskObj);
        this.createTitle();
        this.createContent();
        this.createConfirmOperate();
        this.createTail();
        this.addPopUpTween();
        this.operateOkBtn.focus();
    },
    /**
     创建prompt信息类型的提示框
     @function {public null} createPrompt
     @param {object} options - 提示框的选项
     @param {element} maskObj - 蒙版蒙住的元素
     @returns null
     */
    prompt: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_confirm";
        this.createAllDiv(maskObj);
        this.createTitle();
        this.createPromptContent();
        this.createPromptOperate();
        this.createTail();
        this.addPopUpTween();
        this.operateOkBtn.focus();
    },
    alertDiv: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_win";
        this.createAllDiv(maskObj);
        this.createTitle();
        this.createContent4Div();
        this.createTail();
    },
    alertIframe: function(options, maskObj) {
        var _continue = true;
        if(!$chk(options.message) && options.submit){
            var _s = options.submit;
            _s.isContinue = true;
            _s.initSubmitWidget(_s.container);
            _s.doBeforeEvents();
            _continue = _s.isContinue;
        }
        if(_continue){
            this.initialize(options);
            this.options.type = "ymPrompt_iframe";
            this.createAllDiv(maskObj);
            this.createTitle();
            var fn = "IFrame" + $time();
            var f = this.createIframeContent(null,fn);
            f.focus();
            var callBack =function(){
                try{
                    f.box = this;
                    f.frameElement.parentNode.ownerDocument.window[fn]=this;
                }catch(e){}
            }.bind(this);
            if(Browser.Engine.trident){
                this.contentIframe.onreadystatechange=callBack;
            }else if(Browser.Engine.webkit){
            	this.contentIframe.addEvent('domready',callBack);
            }else {
            	this.contentIframe.addEvent('load',callBack);
            }
            this.createTail();
            this.addPopUpTween();
            if(this.options.max)this.max();
            if(!$chk(options.message) && options.submit){
                var _s = options.submit;
                _s.options.postType = 'form_' + fn;
                _s.frameWin = f;
                _s.submit();
            }
            return f;
        }
    },
    alertIframeNoPanel: function(options, maskObj) {
        this.initialize(options);
        this.options.type = "ymPrompt_iframe";
        this.createAllDiv(maskObj);
        var f = this.createIframeContent(true);
        f.focus();
        this.popUpDiv.getElements("div.ym-ml").removeClass("ym-ml");
        this.popUpDiv.getElements("div.ym-mr").removeClass("ym-mr");
        //this.createTail();
        this.addPopUpTween();
//        this.popUpDiv.setStyle('top',this.options.top);
        this.setTop(this.popUpDiv,this.options.top);
        return f;
    },
    //创建MSN类型的元素
    alertMSN: function(options, maskObj) {
        options.position = "absolute";
        options.isShowMask = false;
        this.initialize(options);
        this.isMsnFlag = true;
        this.options.type = "ymPrompt_msn";
        this.createAllDiv(maskObj);
        this.createTitle();
        var f = this.createIframeContent();
        this.createTail();
        var popupSize = this.popUpDiv.getSize();
        var bodySize = $(document.body).getSize();
        var tempX = (bodySize.x - popupSize.x);
        var scroll = $(document.body).getScroll().y;

        var popUpDivTop = bodySize.y + scroll;
        if (Browser.Engine.trident) {
            popUpDivTop = popUpDivTop - 5;
        }

        this.popUpDiv.setStyles({
            'position':'absolute',
            'left': tempX,
//            'top': popUpDivTop,
            'height': 0
        });
        this.setTop(this.popUpDiv,popUpDivTop);

        new Fx.Tween(this.popUpDiv, {duration:this.options.popUpTweenTime, transition: Fx.Transitions.linear}).start('top', popUpDivTop, popUpDivTop - popupSize.y);//5px是border像素的偏移
        new Fx.Tween(this.popUpDiv, {duration:(this.options.popUpTweenTime + 100), transition: Fx.Transitions.linear}).start('height', 0, popupSize.y);//由于速率太小，速率不一致就有了滚动条
        if (this.options.isAutoDisAppear == "true") {
            this.closePopUpBox(this.options.autoDisAppearTime);
        }
        return f;
    },
    closePopUpBox: function(delay) {
        if(!delay)delay = 1;
        this._closePopUpBox.delay(delay, this);
    },
    _closePopUpBox: function(){
        //if (document.body)try{document.body.focus()}catch(e){}; 先去掉，未知问题？
        this.fireEvent('onClose', [this]);
        if(this.contentIframe){
         	 try{//由于跨域的问题,这里增加了try..catch
	              var tempClearIframe=function(ifEls){
							ifEls.each(function(el){
								try{//由于跨域的问题,这里增加了try..catch
									if(el){
									    if(el.contentWindow&&el.contentWindow.$$){
		                                  var b=el.contentWindow.$$("iframe");
									        if(b.lenght>0){tempClearIframe(b);}
					                     }
									    if(Browser.Engine.trident){
									    	el.set('src','');
											el.src='';
											el.destroy();
										}else if (Browser.Engine.webkit) {
										    el.set('src','about:blank');
										    el.src='about:blank';
											top.injectIfame(el);
								        }
									}
								}catch(e){
									if(Browser.Engine.trident){
										el.set('src','');
										el.src='';
									}else if (Browser.Engine.webkit) {
										el.set('src','about:blank');
										el.src='about:blank';
										top.injectIfame(el);
							        }
				                 }
								}.bind(this));
					};
					if(this.contentIframe.contentWindow.$$){
						var ifs = this.contentIframe.contentWindow.$$("iframe");
						tempClearIframe(ifs);
					}
					tempClearIframe=null;
					if(Browser.Engine.trident){
						this.contentIframe.set('src','');
			        	this.contentIframe.src='';
						this.contentIframe.destroy();
					}else if (Browser.Engine.webkit) {
			        	this.contentIframe.set('src','about:blank');
			        	this.contentIframe.src='about:blank';
						top.injectIfame(this.contentIframe);
			        }
         	 	}catch(e){
                }
	 }
        	
        if (this.options.isShowMask == true) {
            this.mask.unmask();
            if (jsR.config.swordPopUpBox.flag) {
                jsR.config.swordPopUpBox.number--;
            }
        }
        this.popUpDiv.destroy();

        //delay执行是为了解决ie7下会出现崩溃的问题
        (function(){for(var key in this){
            this[key]=undefined;
        }}).delay(1,this);
        pc.maskState = false;
    },
    isBody:function(el) {
        return (/^(?:body|html)$/i).test((el.get('tag') || el.tagName));
    }

    ,max:function() {
        this.popUpState = "max";
        var tempHeight = 0;
        if (this.options.type != "ymPrompt_win" && this.options.type != "ymPrompt_iframe" && this.options.type != "ymPrompt_msn") {
            tempHeight = 69;
            this.operateDiv.setStyles({
                'display': ''
            });
        } else {
            tempHeight = 28;
        }

        var maskLeft = 0;
        var maskTop = 0;
        var maskWidth = 0;
        var maskHeight = 0;
        if (this.isBody(this.maskObj)) {
            if (this.options.isShowMask == true) {
                maskLeft = 0 + document.body.getScroll().x;
                maskTop = 0 + document.body.getScroll().y;
                maskWidth = document.body.getSize().x;
                maskHeight = document.body.getSize().y;
            } else {
                maskLeft = 0 + document.body.getScroll().x;
                maskTop = 0 + document.body.getScroll().y;
                maskWidth = document.body.getSize().x;
                maskHeight = document.body.getSize().y;
            }
        } else {
            if (this.options.isShowMask == true) {
                maskLeft = this.mask.options.left;
                maskTop = this.mask.options.top;
                maskWidth = this.mask.options.width;
                maskHeight = this.mask.options.height;
            } else {
                maskLeft = this.maskObj.getPosition().x + this.maskObj.getScroll().x;
                maskTop = this.maskObj.getPosition().y + this.maskObj.getScroll().y;
                maskWidth = this.maskObj.getSize().x;
                maskHeight = this.maskObj.getSize().y;
            }
        }

        this.popUpDiv.setStyles({
            'height': maskHeight,
            'left': maskLeft,
//            'top': maskTop,
            'width': maskWidth
        });
        this.setTop(this.popUpDiv,maskTop);

        this.contentDiv.setStyles({
            'height': maskHeight - tempHeight
        });

        if (this.options.type == "ymPrompt_iframe" || this.options.type == "ymPrompt_msn") {
            this.contentIframe.setStyles({
                'height': maskHeight - tempHeight
            });
        }

        this.fireEvent('onMax', [this]);
    }
    ,min:function() {
        if (this.popUpState != "min") {
            if ($defined(this.operateDiv))this.operateDivHeight = this.operateDiv.getSize().y;//这个变量是解决display为none的时候,this.operateDiv.getSize().y没有值的问题
        }
        this.popUpState = "min";
        var tempHeight = 0;
        if (this.options.type != "ymPrompt_win" && this.options.type != "ymPrompt_iframe" && this.options.type != "ymPrompt_msn") {
            tempHeight = 69 - this.operateDivHeight;
            this.operateDiv.setStyles({
                'display': 'none'
            });
        } else {
            tempHeight = 28;
        }

        this.popUpDiv.setStyles({
            'height': tempHeight,
            'left': 0,//this.options.left,
//            'top': $(document.body).getHeight() - 48,//this.options.top,
            'width': this.options.width
        });
        this.setTop(this.popUpDiv,$(document.body).getHeight() - 48);
        this.contentDiv.setStyles({
            height: 0
        });

        this.popUpDiv.setStyle('height','auto');  //自适应的高度
        this.fireEvent('onMin');
    }
    ,normal:function() {
        this.popUpState = "normal";
        var tempHeight = 0;
        if (this.options.type != "ymPrompt_win" && this.options.type != "ymPrompt_iframe" && this.options.type != "ymPrompt_msn") {
            tempHeight = 69;
            this.operateDiv.setStyles({
                'display': ''
            });
        } else {
            tempHeight = 28;
        }

        this.popUpDiv.setStyles({
            'height': this.options.height,
            'left': this.options.left,
//            'top': this.options.top,
            'width': this.options.width
        });
        this.setTop(this.popUpDiv,this.options.top);

        var h = (this.options.height.toInt() - tempHeight);
        this.contentDiv.setStyles({
            'height':h
        });

        if (this.options.type == "ymPrompt_iframe" || this.options.type == "ymPrompt_msn") {
            this.contentIframe.setStyles({
                'height': h
            });
        }

        this.popUpDiv.setStyle('height','auto');  //自适应的高度
        this.fireEvent('onNormal', [this]);
    }
    ,close:function(delay) {
        this.closePopUpBox(delay);
    }
    ,hide:function(zindex) {
        zindex = zindex || -1;
        this.popUpDiv.setStyle('z-index', zindex);
        this.fireEvent('onHide', [this]);
    }
    ,show:function(zindex) {
        zindex = zindex || this.zIndex;
        this.popUpDiv.setStyle('z-index', zindex);
        this.fireEvent('onShow', [this]);
    }

    ,setTop:function(el,v){
        if(v/1<0||(v+'').indexOf('-')>=0)v=0;
        el.setStyle('top',v);
    }
});