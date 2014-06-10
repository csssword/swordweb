var SwordValidateCode = new Class({
    $family: {name: 'SwordValidateCode'}
    ,Implements: [Events, Options]
    ,container:null
    ,containerName:""
    ,code:""
    ,img:new Element("div")
    ,msg:new Element("div")
    ,span :new Element("span", {"class":"spanText"})
    ,codetext:new Element("input", {"type":"text","class":"inputText"})
    ,vobj:null
    ,options:{
        pNode:null
        ,tid:""
        ,msgId:""
        ,codeId:""
        ,imgId:""
        ,width:13     //一个验证码占的宽度
        ,height:20
        ,ctrl:"ValidateCodeCtrl_genValidateCode"
        ,subCtrl:"ValidateCodeCtrl_validateCode"
        ,tipMsg:"看不清?换一张"
        ,runat:"server"
        ,codeLength:"4"
        ,codes:['1','2','3','4','5','6','7','8','9','0',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        ,widgetStyles:{
            codeBackground:"validateCode-codeBackground"
            ,spanText:"validateCode-spanText"
            ,tipMsgStyle:"validateCode-tipMsg"
        }
    }
    ,initialize:function() {
        if (arguments.length == 2) {
            var params = Array.link(arguments, {'options': Object.type, 'element': $defined});
            this.setOptions(params.options);
            this.container = $(params.element);
            this.build(this.container);
        }
    }
    ,initParam: function(initPara) {
        this.htmlOptions(initPara);
        this.container = initPara;
        this.pc = pageContainer;
        this.build(this.options.pNode);
    }
    ,initData:function(data) {
    }
    ,build:function(container) {
        this.options.codeLength = this.options.codeLength.toInt();
        if (this.options.codeLength >= 60 || this.options.codeLength <= 0) {
            this.options.codeLength = 4;
        }
        this.containerName = container.get("name");
        this.init(container);
        this.initRunat();
        this.genCode();
        this.initEvents();
    }
    ,init:function(container) {
        if ($chk(this.options.msgId)) {
            var ele = container.getElement("*[id=" + this.options.msgId + "]");
            if (ele) {
                this.msg = ele;
            }
        } else {
            this.msg.set("text", this.options.tipMsg);
            this.msg.addClass(this.options.widgetStyles.tipMsgStyle);

            container.grab(this.msg);
        }
        if ($chk(this.options.codeId)) {
            var ele = container.getElement("input[id=" + this.options.codeId + "]");
            if (ele) {
                this.codetext = ele;
            }
        } else {
            this.codetext.set("maxlength", this.options.codeLength);
            this.codetext.set("size", this.options.codeLength);
            container.grab(this.codetext);
        }
        if ($chk(this.options.imgId)) {
            var ele = container.getElement("*[id=" + this.options.imgId + "]");
            if (ele) {
                this.img = ele;
            }
        }else{
             if (this.options.runat == "server") {
                this.img = new Element("img");
            } else {
				var imgWidth = this.options.codeLength * 15;
				this.img.addClass(this.options.widgetStyles.codeBackground);
				this.img.set('style', 'width:' + imgWidth + 'px');
			}

        }
        container.grab(this.img);
    }
    ,initRunat:function() {
        this.container.setProperty("runat", this.options.runat);
    }
    ,genCode:function() {
        this.code = "";
        if (this.options.runat == "server") {    
            //this.serverCode(codeLength);
            var path =   jsR.rootPath+"download.sword?ctrl="+this.options.ctrl
                         +"&codeLength="+this.options.codeLength
                         +"&validateCodeName="+this.containerName
                         +"&width="+this.options.width
                         +"&height="+this.options.height +"&random="+Math.random();
            this.img.set("src",path);
        } else if (this.options.runat == "local") {
            var array = this.localCode(this.options.codeLength)|| [];
            this.img.empty();
            for (var i = 0; i < array.length; i++) {
                var span = this.span.clone(true, true);
                span.set("text", array[i]);
                this.code = this.code + array[i];
                this.img.grab(span);
            }
        }

    }

    ,doAction:function() {
        var res = this.codetext.get("value") == this.getCode();
        this.vobj.fldiv(this.codetext, res, "验证码输入错误或超时，请重新输入！");
        if (res) {
            var req = this.pc.getReq({
                'tid':this.options.tid
                ,'ctrl':this.options.subCtrl
                ,'page':this.options.page
                ,'widgets':[{
                        "sword":"attr",
                        "name":this.containerName,
                        "value":this.getCode()
                    }]
            });
            try {
                pc.postReq({
                    'req':req
                    ,'onSuccess':function(res) {
                        var tp = this.pc.getResData(this.containerName, res).value;
                        if (tp == "false") {
                            this.vobj.fldiv(this.codetext, false, "验证码输入错误或超时，请重新输入！");
                        }
                        this.genCode();
                    }.bind(this)
                    ,'onError':function() {
                        this.genCode();
                    }.bind(this)
                })
            } catch(e) {
                if (this.pc) {
                    this.pc.getMask().unmask();
                }
                throw new Error(e.message);
            }
        }
    }
    ,serverCode:function(codeLength) {
        var data = [];
        var req = this.pc.getReq({
            'tid':this.options.tid
            ,'ctrl':this.options.ctrl
            ,'page':this.options.page
            ,'widgets':[{
                    "sword":"attr",
                    "name":this.containerName,
                    "value":this.options.codeLength + ""
                }]
        });
        try {
            pc.postReq({
                'req':req
                ,'onSuccess':function(res) {
                    data = eval((this.pc.getResData(this.containerName, res)).value) || [];
                }.bind(this)
            })
        } catch(e) {
            if (this.pc) {
                this.pc.getMask().unmask();
            }
            throw new Error(e.message);
        }
        return data;
    }
    ,localCode:function(codeLength) {
        var data = [];
        for (var i = 0; i < codeLength; i++) {
            data.push(this.options.codes[Math.floor(Math.random() * this.options.codes.length)]);
        }
        return data;
    }
    ,initEvents:function() {
        this.vobj = this.pc.getValidate();
        this.vobj.initParam(this.container.get("vType"));
        this.msg.addEvent("click", this.genCode.bind(this));
        this.img.addEvent("click", this.genCode.bind(this));//hetao  验证码点击图片换图
    }
    ,getCode:function() {
        return this.code;
    }
});