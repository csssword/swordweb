var SwordSelect = new Class({
    Implements : [Events, Options],
    name:'SwordSelect',
    $family:{name:'SwordSelect'},
    options : {
        name : null,//组件name
        type : null,//组件类别，默认是单选框
        prikey : null,//下拉框prikey,相当于code
        lines :10,//显示的最大行数
        height:21,//显示行的高度
        data : null,//数据
        pNode : null,//父节点
        edit:'true',//是否可编辑
        disable:null,//是否可以编辑和可以弹出框
        rule : null,//校验规则
        msg:null,//校验提示信息
        parent:null,//如果是级联下拉,值为父选项的name
        child: null,//如果是级联下拉,值为子选项的name
        dataname:null,//指定数据集名称，如果不指定该名称,以name代替
        sbmitcontent:null,//需要提交的内容，默认是提交代码，可以为任意组合"{code{|{mc}"或者 "{mc}"或者"{dm}"
        onChange : null,//当选择框发生改变时的回调函数(el:选中的行对象，String:code值)
        onSelect : null,//选择时的回调函数 (string:code)
        onShow   : null,//下拉列表显示时的回调函数
        onHide   : null//下拉列表隐藏时的回调函数
        ,dataFilter:null//自定义的下拉列表的数据过滤，适用的场景是要根据业务上的字段进行过滤
        ,onSubmitBefore   : null//点击才装载数据之前触发
        ,popWidth : null//弹出层的宽度
        ,displayCode:'false'//是否同时显示code和caption
        ,popdisplay:null//弹出层的显示格式定义，与sbmitcontent的定义相似
        ,inputdisplay:null//输入框的显示格式定义，与sbmitcontent的定义相似
        ,handInput:'false'//是否支持自定义手动输入
        ,addAllItem:'false'//是否增加"全部“的选项
        ,allItemCode:''//定义全部选项的code值
        ,allItemCap:''//定义全部选项的caption值
    },
    box            : null, //选项的Input
    selectbox      : null, //选项框div层对象
    selectedIndex  : null, //当前选中文本的索引
    currentElement : null, //当前选中文本的HTMLElement
    currentText    : null, //当前选中的文本
    validate       : null, //校验对象
    selFx : null,
    rebuild:null,
    hasBoxDiv:false,
    cachearray :[],
    CacheData:null,//数据缓存,管理懒加载过来的数据
    updateCache:function(name, data) {
        if(this.CacheData == null) {
            this.CacheData = new Hash();
            this.CacheData.set(name, data);
        } else {
            var cache = this.CacheData.get(name);
            if($defined(cache)) {
                cache.combine(data);
            } else {
                this.CacheData.set(name, data);
            }
        }
    },
    getDataInCache:function(tid, name, pcode) {
        var reqServer = false,data;
        if($defined(this.box.get("parent"))) {
            if(!$defined(pcode) || !$chk(pcode)) {
                this.build_options([]);
                return;
            }
        }
        if(this.CacheData != null && $defined(this.CacheData.get(name))) {
            data = this.dataFilter(this.CacheData.get(name));
            if(data.length == 0)reqServer = true;
        } else {
            reqServer = true;
        }
        if(reqServer) {
            var sb = null;
            this.options.onSubmitBefore = this.box.get("onSubmitBefore")||this.box.retrieve("onSubmitBefore");
            if($defined(this.options.onSubmitBefore) && $chk(this.options.onSubmitBefore)) {
                sb = this.getFunc(this.options.onSubmitBefore)[0](this);
            }
            this.selectLoading();
            if($type(sb) == 'SwordSubmit') {//onSubmitBefore 返回了提交组件
                if(this.box.get('initOnSubmitBefore') != 'true') {
                    sb.addEvent('onSuccess', function(req, res) {
                        this.unselectLoding();
                        var data;
                        var selObj=this;
                        res.data.each(function(item, index) {
                        	if(item.dataName==selObj.box.get("dataname")||item.name==selObj.box.get("name")){
                        		name=item.dataName||item.name;
                        		data=item.data;
                        		return;
                        	}
                        });
                        this.updateCache(name, data);
                        this.build_options(data);
                        xyposition(this.box, this.box_div);
                    }.bind(this));
                    sb.addEvent('onError', function() {
                        alert("使用onSubmitBefore返回的提交组件：从后台返回数据出错了。");
                    });
                    this.box.set('initOnSubmitBefore', 'true');
                }
                sb.options.mask = 'false';
                sb.submit();
            } else {
                if(tid){
                    var req = pc.getReq({'tid':tid,'widgets':[
                        {
                            'sword':"SwordForm",
                            'name' :name,
                            'data' :{'pcode':{value:pcode}}
                        }
                    ]});
                    pc.postReq({
                        req:req,
                        loaddata:"widget",
                        onSuccess:function(res) {
                            this.unselectLoding();
                            var sd = $defined(res.data[0]) ? res.data[0].data : null;
                            this.updateCache(name, sd);
                            this.build_options(sd);
                            xyposition(this.box, this.box_div);
                            this.def_select(this.box.get('code'));
                        }.bind(this),
                        onError:function() {
                            alert("从服务器端获取数据出错了,请求的tid为【" + tid + "】");
                        }.bind(this)
                    });
                }
            }
        } else {
            this.build_options(data);
        }
    },
    selectLoading:function() {
        if(this.box_div.get("state") != "loading") {
            var li = new Element('div', {'class':'swordselect-list-item','name':'loading'}).inject(this.selectbox);
            var ld = new Element('div').inject(li);
            new Element("div", {'class':'selectLoding'}).inject(ld);
            new Element("div", {'class':'selectLoding_text'}).appendText(i18n.selectLoading).inject(ld);
        }
        this.box_div.set("state", "loading");
        this.selectbox.setStyle("height", "");
        this.box_div.setStyles({'display':'block',
            'left':this.box._getPosition().x,
            'top' :this.box._getPosition().y + this.box.getHeight()});
        //this.box_div.fade('in');
    },
    unselectLoding:function() {
        this.box_div.set("state", "");
        this.selectbox.getElements('div').each(function(li) {
            li.destroy();
        }.bind(this));
    },
    genarateInputContent:function(obj) {
//        var content = this.box.get('inputdisplay');
//        if(!$defined(content))content = "{caption}";
//        return this.genarateContent(obj, content);
    	return SwordSelectTemplate.genarateInputContent(this.box,obj);
    },
    genaratePopContent:function(obj) {
        var content = this.box.get('popdisplay');
        if(!$defined(content))content = "{caption}";
        return this.genarateContent(obj, content);
    },
    genarateContent:function(obj, content) {
//        if(!$defined(content))
//            content = this.box.get('sbmitcontent');
//        if(!$defined(content)) {
//            content = "{code}";
//        }
//        if($type(obj) == "element") {
//            obj = {'code':obj.get("code"),"caption":obj.get("caption")};
//        }
//        return content.substitute(obj);
    	return SwordSelectTemplate.genarateContent(this.box,obj,content); 
    },
    initialize: function(options) {
        if(pc.SwordSelectWindowClick) return;
        pc.SwordSelectWindowClick = true;
        window.document.addEvent('click', function(e) {
            var obj = e.target;
            while(obj.parentNode && obj != this.box && obj != this.selDiv) obj = obj.parentNode;
            if(obj != this.box && obj != this.selDiv && this.box) {
                if(this.box.get("display") == 'true') {
                    if($defined(this.box.onSelectBlur)) {
                        this.box.onSelectBlur(this.box.get('value'));
                    }
                }
                if(this.box.get('handInput') == "true" && !$chk(this.box.get('realvalue')) && $chk(this.box.get("value"))) {
                    this.box.set({'code':this.box.get("value"),'realvalue':this.box.get("value")});
                }
                var isgo=this.hide();
	            if(isgo===false){return;}
                if(!$(e.target).hasClass('sGrid_data_row_item_select')) {
                    this.execGridOnFinished();
                }
            }
        }.bind(this));
    },
    execGridOnFinished:function() {
        if($defined(this.grid_onFinished)) {
            this.grid_onFinished(this.box.get('value'), this.box.get('code'), this.box.get('realvalue'), this.box.get("allDb"));
            this.grid_onFinished = null;
        }
    },
    setValidate:function(validate) {
        this.validate = validate;
    },
    initParam:function(node, parent) {
        if(parent && parent.name == 'SwordGrid') {
            this.grid = parent;
        } else {
            this.grid = null;
        }
        $extend(this.options, {
            name : null,//组件name
            type : null,//组件类别，默认是单选框
            prikey : null,//下拉框prikey,相当于code
            lines :10,//显示的最大行数
            width :null,//选择框的宽度
            height:21,//显示行的高度
            data : null,//数据
            pNode : null,//父节点
            rule : null,//校验规则
            parent:null,//父选项名字
            child: null,//子选项名字
            dataname:null,//指定数据集名称
            pcode:null,//制定根节点的父亲节点的值是多少
            defValue:null,//默认选中值
            defIndex:null,//默认选中索引
            tid:null,
            onChange : $empty,//当选择框发生改变
            onSelect : $empty,//选择时
            onShow   : $empty,//下拉列表显示时
            onHide   : $empty,//下拉列表隐藏时
            dataFilter:null
            ,onSubmitBefore   : $empty,//点击才装载数据之前触发
            disable:null,
            sbmitcontent:null
            ,popWidth : null //弹出层的宽度
            ,displayCode:'false'//是否同时显示code和caption
            ,inputdisplay:null
            ,popdisplay:null
            ,edit:'true'
            ,handInput:'false'
            ,addAllItem:'false'
            ,allItemCode:''
            ,allItemCap:''
        });
        this.htmlOptions(node);
        if(parent && parent.name != "SwordGrid")node.set({'onChange':'','onchange':''});
        var space = this.options.pNode.retrieve("space");
        if($defined(this.options.parent)) {
            var pSel = space.getElements("*[name='" + this.options.parent + "']")[0];
            pSel.set('child', this.options.name);
            if(!$chk(this.options.dataname)) {
                var root = this.getRoot();
                this.options.dataname = ($chk(root.get("dataname"))) ? root.get("dataname") : root.get("name");
            }
        }
        var chds = space.getElements("*[parent]");
        for(var i = 0; i < chds.length; i++) {
            var name = chds[i].get("parent");
            var oj = space.getElement("*[name='" + name + "']");
            if($defined(oj))oj.set("child", chds[i].get("name"));
        }
        this.options.data = node.getChildren(">div");
        this.build_selectbox(parent);
        if(this.box.get("mode") != 2) {
            this.addEventToEl("input",parent);
            this.addEventToEl("div");
        } else {
            this.box.addEvent("click", function(e) {
                if($defined(e)) {
                    if(this.box == $(new Event(e).target)) {
                        this.rebuild = false;
                    } else {
                        if(this.box.get("display") == 'true') {
                            this.hide();
                        }
                        this.box = $(new Event(e).target);
                        this.selDiv = this.getImgEl(this.box);
                        this.rebuild = true;
                    }
                }
                if(this.box.get('display') == 'true') {
                    this.hide();
                } else {
                    this.change_element_by_char();
                    this.box.focus();
                }
            }.bind(this));
            
            this.selDiv.addEvent("click", function(e) {
                if(this.selDiv == $(new Event(e).target)) {
                    this.rebuild = false;
                } else {
                    if(this.box.get("display") == 'true') {
                        this.hide();
                    }
                    this.selDiv = $(new Event(e).target);
                    this.box = this.getBoxEl(this.selDiv);
                    this.rebuild = true;
                }
                if(this.box.get('display') == 'true') {
                    this.hide();
                } else {
                    this.change_element_by_char();
                    this.box.focus();
                }
            }.bind(this));
            this.box.addEvent("keyup", this.change_item_on_keyup.bind(this));
        }
        if($defined(this.options.defValue) || $defined(this.options.defIndex)) {
            this.initData(this.options.defValue, this.box, this.options.defIndex);
        }
    },
    getBoxEl:function(imgdiv) {//根据下拉div找到input
        return imgdiv.getParent('table').getElement('input.swordform_item_oprate');
    },
    getImgEl:function(inputEl) {//根据input找到下拉div
    	var p = inputEl.getParent();
    	if($chk(p)){
            return p.getNext();
    	}
    	return null;
    },
    boxtd: null,imgtd: null,
    getRoot:function() {
    	var parent = this.options.parent;
        var space = this.options.pNode.retrieve("space");
    	return SwordSelectTemplate.getRoot(parent, space);
//        while($defined(parent)) {
//            var p = space.getElements("*[name='" + parent + "']")[0].get("parent");
//            if($defined(p))parent = p; else break;
//        }
//        return space.getElements("*[name='" + parent + "']")[0];
    },
    isMulti:function(data) {
//        if(!$defined(data)) {
//            return $defined(this.box.get('child')) || $defined(this.box.get('parent'));
//        }
//        return $defined(this.box.get('child')) || $defined(this.box.get('parent')) || (($type(data[0]) == 'element') ? data[0].get('pcode') : $H(data[0]).has('pcode'));
    	return SwordSelectTemplate.isMulti(this.box, data);
    },
    initData:function(d, box, idx) {
    	this.hide();
        this.box = $(box);
        this.selDiv = this.getImgEl(this.box);
        if(d == "") {
            if($defined(this.box.get("defValue")) || $defined(this.box.get("defIndex"))) {
                d = this.box.get("defValue");
                idx = this.box.get("defIndex");
            } else {
                this.box.set('value', "").set('realvalue', "").set("code", "").store("allDb", {'code':'','caption':''});
                return;
            }
        }
        if((!$defined(d) || !$chk(d)) && (!$defined(idx) || !$chk(idx)))return;
        if($type(d) == "string")d = d.toHash();
        if($type(d) == "object")d = new Hash(d);
        var rv;
        if($type(d) == "hash") {
            var obj = {};
            d.each(function(v, k) {
                obj[k] = v;
            }, this);
            rv = this.genarateContent(obj);
            this.box.set({'value':this.genarateInputContent(obj),'code':d.get('code'),'realvalue':this.genarateContent(obj)});
            this.box.store("allDb", obj);
        } else {
            var data = this.getOptionsData();
            if(!$defined(data))return;
            if($defined(d) || $chk(d)) {
                data.each(function(node) {
                    if($type(node) == 'element') {
                        node = {caption:node.get('caption'),code:node.get('code')};
                    }
                    if(node[this.box.get("codeSign")] == d) {
                        rv = this.genarateContent(node);
                        this.box.set({'value':this.genarateInputContent(node),'code':node[this.box.get("codeSign")],'realvalue':this.genarateContent(node)});
                        this.box.store("allDb", node);
                    }
                }, this);
            } else if($defined(idx) || $chk(idx)) {
                var node = data[idx / 1];
                if($defined(node)) {
                    if($type(node) == 'element') {
                        node = {caption:node.get('caption'),code:node.get('code')};
                    }
                    rv = this.genarateContent(node);
                    this.box.set({'value':this.genarateInputContent(node),'code':node[this.box.get("codeSign")],'realvalue':this.genarateContent(node)});
                    this.box.store("allDb", node);
                }
            }
        }
        return rv;
    },
    divTable:null,
    build_selectbox: function(parent) {
       /* var width = 144;
        var v_width = 180;
        var v_imgWidth = 17;
        if($defined(parent) && parent.name == 'SwordForm') {
            //width = parent.dftsize.FiledWidth.toInt() - 16;
            v_width = parent.dftsize.VFiledWidth;
            v_imgWidth = parent.dftsize.VimgWidth;
        }
        if($defined(this.options.width)) {
            width = this.options.width;
        } else if(parent.userSize && parent.userSize.FiledWidth) {
            width = parent.userSize.FiledWidth.toInt() - 17 + 'px';
        } else
            width = '100%';*/ //0511
        var mode = 0;
        //var div = new Element('div', {'class':'swordform_field_wrap'}).inject(this.options.pNode);
        this.divTable = Sword.utils.createTable(this,true,true);
        if(this.options.pNode.hasClass("swordform_field_wrap")) {
            mode = 1;
            this.divTable.setStyle('float', 'left');
        }
        this.box = new Element('input', {
            'type' : 'text',
            'rule' : this.options.rule,
            'msg':this.options.msg,
            'class'  : 'swordform_item_oprate swordform_item_input',
            'widget':'select',
            'name' : this.options.name,
            'sbmitcontent':this.options.sbmitcontent,
            'prikey':this.options.prikey,
            'child':this.options.child,
            'parent':this.options.parent,
            'lines':this.options.lines,
            'lineheight':this.options.height,
            'dataname':this.options.dataname,
            'pcode':this.options.pcode,
            'tid':this.options.tid,
            'defValue':this.options.defValue,
            'value': '',
            'defIndex':this.options.defIndex,
            'dataFilter':this.options.dataFilter,
            'vType':this.validate.options.vType,
            'styles':{
//                'width':width, //0511
                'float':'left'
            },
            'popWidth':this.options.popWidth,
            'displayCode':this.options.displayCode,
            'inputdisplay':this.options.inputdisplay,
            'popdisplay':this.options.popdisplay,
            'handInput':this.options.handInput
            ,'addAllItem':this.options.addAllItem
            ,'allItemCode':this.options.allItemCode
            ,'allItemCap':this.options.allItemCap
        }).inject(this.boxtd);
        this.box.store('widgetObj', this);//向input存入对象
        if(this.options.edit == "false") {
            this.box.set('readonly', true);
        }
        if(this.options.disable == 'true') {
            this.box.set('disabled', true);
            this.box.setStyle('cursor', "default");
        }
        if(this.options.type == "selectsolely") {
            this.box.set("mode", 2);
        }
        this.box.store('data', this.options.data).store('onChange', this.options.onChange).store('onSelect',
                this.options.onSelect).store('onShow', this.options.onShow).store('onHide', this.options.onHide)
                .store('onSubmitBefore', this.options.onSubmitBefore);
        this.selDiv=this.imgtd;
        this.selDiv.addClass('swordselect-selimg'). set('vType',this.validate.options.vType).addEvents({
                'mouseover':function(e) {
                    var Input = this.getBoxEl($(new Event(e).target));
                    if(Input.get('display') == 'false')
                        Event(e).target.addClass('swordselect-selimg-over');
                }.bind(this),
                'mouseout':function(e) {
                    var Input = this.getBoxEl($(new Event(e).target));
                    if(Input.get('display') == 'false')
                        Event(e).target.removeClass('swordselect-selimg-over');
                }.bind(this)
            });
        /*this.selDiv = new Element('div', {'class':'swordselect-selimg',
            'styles':{'float':'left'},
            'vType':this.validate.options.vType,
            'events':{
                'mouseover':function(e) {
                    var Input = this.getBoxEl($(new Event(e).target));
                    if(Input.get('display') == 'false')
                        Event(e).target.addClass('swordselect-selimg-over');
                }.bind(this),
                'mouseout':function(e) {
                    var Input = this.getBoxEl($(new Event(e).target));
                    if(Input.get('display') == 'false')
                        Event(e).target.removeClass('swordselect-selimg-over');
                }.bind(this)
            }}).inject(this.imgtd);*/
        if((this.options.rule || "").indexOf("must") > -1 && parent.options.requiredSign == "field") {
            new Element("span", {'styles':{'color':'red','float':'left'},'html':"*"}).inject(this.divTable);
        }
        if(this.options.disable == 'true') {
            this.disable(this.box);
        }
        var wrapDiv;
        if(mode == 0) {
            if(parent.name == "SwordForm" && parent.isVal() && $defined(this.options.rule)) {
                wrapDiv = Sword.utils.createElAfter(this.divTable.getChildren()[0].getChildren()[0], this.box);
            }
            /*if(width != '100%'){
                this.box.setStyle('width',width);
                this.divTable.setStyle('width','auto');
            }*/
            Sword.utils.setWidth(this.options.width,parent?parent.userSize:null,this.divTable,this.box,true);//0511
        }
        if(!this.hasBoxDiv) {
            this.createBoxDiv();
            this.hasBoxDiv = true;
        }
    },
    createBoxDiv:function() {
        this.box_div = new Element('div', {'class':'swordselect-list'}).inject(document.body);
        this.selectbox = new Element('div', {'class' : 'swordselect-list-inner'}).inject(this.box_div);
        this.sConsole = new Element('div', {'class' : 'swordselect-list-inner'}).setStyle('display', 'none').inject(this.box_div);
        new Element("div", {'class':'swordselect_csl_pre','events':{
            'click':this.getNextPageData.bind(this, [-1])
        }}).inject(this.sConsole);
        new Element("div", {'class':'swordselect_csl_next','events':{
            'click':this.getNextPageData.bind(this, [1])
        }}).inject(this.sConsole);
        //this.selFx = new Fx.Scroll(this.selectbox, {duration:10});
    },
    getValue:function() {
        return ($chk(this.box.get('code'))) ? this.box.get('code') : this.box.get('value');
    },
    getParentValue:function() {
    	var parentEl = this.getBoxParent().retrieve("space")? this.getBoxParent().retrieve("space") : this.box.getParent("div");
        var pBox = parentEl.getElements("*[name='" + this.box.get("parent") + "']")[0];
        return ($chk(pBox.get('code'))) ? pBox.get('code') : pBox.get('value');
    },
    getBoxParent: function() {
        return this.grid ? this.box.getParent('div.sGrid_data_row_item_div') : this.box.getParent().getParent().getParent().getParent().getParent();
    },
    getOptionsData:function(bz,gridbz) {
        var loadData = null;
//        this.options.data = loadData = this.box.retrieve("data")?this.box.retrieve("data"):this.box.getParent("table").getNext().getChildren(">div");
        if($chk(gridbz) || this.grid){
        	this.options.data = loadData = this.box.retrieve("data");
        }else if(this.box.getParent("table").getNext()){
        	this.options.data = loadData = this.box.getParent("table").getNext().getChildren(">div");
        }
        if((!$defined(this.options.data)) || this.options.data.length == 0) {
            var dataname = this.box.get("dataname");
            var d = ($defined(dataname)) ? pageContainer.getInitDataByDataName(dataname) : pageContainer.getInitData(this.box.get("name"));
            if(!$defined(d)) {
                return;
            }
            loadData = this.options.data = d.data;
        }
        if(!$defined(bz) && this.options.data.length > 0) {
            loadData = this.dataFilter(this.options.data);
        }
        var bizdatafilter = this.box.get("dataFilter");
        if($defined(bizdatafilter)) {
            try {
                loadData = this.getFunc(bizdatafilter)[0](loadData, this.box, this);
            } catch(e) {
                alert("执行下拉列表的数据过滤方法出错！请检查页面自定义函数" + bizdatafilter);
            }
        }
        var defaultCap = this.box.get('addAllItem');
        if($chk(defaultCap) && defaultCap != "false")loadData = [
            {caption:this.box.get("allItemCap"),code:this.box.get("allItemCode") || "all"}
        ].extend(loadData);
        return loadData;
    },
    dataFilter:function(loadData) {
        var topCode = this.box.get("pcode");
        var psign = this.box.get("pcodeSign");
        if(this.isMulti(loadData) && $defined(this.box.get("parent"))) {
            var pcode = this.getParentValue();
            if($chk(pcode)) {
                loadData = loadData.filter(function(item) {
                    return ($type(item) == 'element') ? (item.get(psign) == pcode) : (item[psign] == pcode);
                }, this);
            } else {
                loadData = [];
            }
        } else if(this.isMulti(loadData)) {
            var b = $defined(topCode) ? [topCode,null,'',undefined,'null'] : [null,'',undefined,'null'];
            loadData = loadData.filter(function(item) {
                return ($type(item) == 'element') ? b.contains(item.get(psign)) : b.contains(item[psign]);
            }, this);
        }
        return loadData;
    },
    setCacheArray : function(code){
    	if (code instanceof Array){
            this.cachearray = [];
    		for (var i=0;i< code.length;i++){
    			var index = this.cachearray.indexOf(code[i]);
    	    	if (index == -1){
    	    		this.cachearray.push(code[i]);
    	    	}
    		}
    	}else{
	    	var index = this.cachearray.indexOf(code);
	    	if (index != -1){
	    		if (index ==0) return;
	    		var c = this.cachearray[index];
	    		var b = this.cachearray[0];
	    		this.cachearray[index] = b;
	    		this.cachearray[0] = c;
	    	}else{
	    		if (this.cachearray.length >= 5){
	    			this.cachearray.pop();
	    		}
	    		//this.cachearray.push(code);
	    		if (this.cachearray.length != 0){
		    		var f = this.cachearray[0];
		    		this.cachearray[0] = code;
		    		this.cachearray.push(f);
	    		}else{
	    			this.cachearray.push(code);
	    		}
	    	}
	    	if(top.$swfcacheobject) top.$swfcacheobject.set(this.box.get("dataname")+"_"+this.box.id,this.cachearray.join(","));
    	}
    },
    build_options: function(loadData) {
        var height = this.options.height * 2;
        if($defined(loadData)) {
//        	var defaultCap = this.box.get('addAllItem');
//            if($chk(defaultCap) && defaultCap != "false")loadData = [
//                {caption:this.box.get("allItemCap"),code:this.box.get("allItemCode") || "all"}
//            ].extend(loadData);
            height = (loadData.length < this.box.get('lines')) ? this.options.height * loadData.length : this.options.height * this.box.get('lines');//this.options.lines;
            var tempFrac  = document.createDocumentFragment();//yt修改guoyan,createDocumentFragment高效一些
            /* 置顶功能 */
            var cacheFrac = document.createDocumentFragment();
            var tempCacheArr = [];
            var templilist = [];
            var key = this.box.get("dataname")+"_"+this.box.id;
            if (this.box.get("cacheSelected") == "true" ){
                if(top.$swfcacheobject) {
                    top.$swfcacheobject.get(key,function(isOK,value){
                        if (isOK){
                            tempCacheArr = value.split(",");
                        }
                    });
                }
                this.setCacheArray(tempCacheArr);
            }
            var codesign=this.box.get('codeSign');
            var captionsign = this.box.get('captionSign');
            /* 置顶功能 */
            loadData.each(function(node, index) {
                if($type(node) == 'element') {
                    node = {caption:node.get('caption'),code:node.get('code')}
                }
                var content = this.box.get('popdisplay');
                var title = "";
                if(!$defined(content)){
                title = node[captionsign];
                }else{
                	title = content.substitute(node);
                }
                var li = new Element('div', {
                    'title':title,
                    'text':title,
                    'value':node[codesign],
                    'caption':node[captionsign],
                    'index':index,
                    'class':'swordselect-list-item',
                    'events':{
                        'mouseover':function(e) {
                            Event(e).target.addClass('swordselect-selected');
                        },
                        'mouseout':function(e) {
                            Event(e).target.removeClass('swordselect-selected');
                        }
                    }
                });//.inject(this.selectbox);
                li.store("allDb", node);
                li.addEvent('click', function(e) {
                    /* 置顶功能 */
                    if (this.box.get("cacheSelected") == "true" ){
                        this.setCacheArray(li.get("value"));
                    }
                    this.change_item(li);
                    if(this.box.get("mode") == 2) {
                        this.getNextPageData();
                    } else {
                        this.hide();
                    }
                    this.execGridOnFinished();
                }.bind(this));
                var temp_index = tempCacheArr.indexOf(li.get("value"));
                if (temp_index != -1 ){
                	templilist[temp_index] = li;                	
                }else{
                	tempFrac.appendChild(li);
                }
            }.bind(this)); 
            templilist.each(function(li){
                if ($chk(li)) cacheFrac.appendChild(li);
            });
            this.selectbox.appendChild(cacheFrac);
            if (tempCacheArr.length >0){
                /*增加分割线*/
                //this.selectbox.appendChild(new Element('div').setStyles({"height":"1px","background":"#00CCFF","overflow":"hidden"}));
                this.selectbox.appendChild(new Element('hr').setStyles({"size":"1","border-style":"outset","color":"gray"}));
            }
            this.selectbox.appendChild(tempFrac);
            this.calculateConsole();
            //用户设置弹出层的宽度
            this.options.popWidth = this.box.get("popWidth");
            this.selectbox.setStyles({
                'width'      : $chk(this.options.popWidth) ? this.options.popWidth : this.box.getWidth() + 14,
                'height'     : (height+5) + 'px',
                'overflow-y' : 'auto'
            });

            this.box_div.setStyle('width', $chk(this.options.popWidth) ? this.options.popWidth : this.box.getWidth() + 14);
            this.toggle_selection();
            this.box.set('isbulid', 'true');
            this.currentElement = null;
        }
    },
    hide: function() {
        if($chk(this.box)&&this.box.get('display') == 'true') {
            var fli = this.selectbox.getFirst(':not(.swordselect-selected-none)');
            var v = this.box.get('value');
            var rv = this.box.get('realvalue');
            var c = this.box.get('code');
            if($chk(v) && fli && this.currentElement == null) {
                if(this.box.get("handInput") == 'true') {
                    var n = this.selectbox.getFirst("div[value='" + rv + "']");
                    if(!$defined(n) || (n && n.get('caption') != v))this.box.set({'realvalue':v,'code':v});
                } else {
                    this.change_item(fli, true);
                }
            } else if(!$chk(v) || !$chk(c) || !$chk(rv)) {
                if(this.box.get("handInput") == "true") {
                    this.box.set({'realvalue':v,'code':v});
                } else {
                    this.box.set('value', "");
                    this.box.set('code', "");
                    this.box.set('realvalue', "");
                }
//                var child = this.options.child;
//                while($defined(child)) {
//                    var childSel = this.swordParent.getWidget(child).clearOptions();
//                    child = childSel.options.child;
//                }
            } else if(this.box.get("handInput") == "true" && this.currentElement == null) {
                var n = this.selectbox.getFirst("div[value='" + rv + "']");
                if(!$defined(n) || (n && n.get('caption') != v))
                    this.box.set({'realvalue':v,'code':v});
            }
            this.box_div.setStyles({'left':'-500px','top':'-500px'});
            //this.box_div.fade('out');
            this.box_div.set("state", "");
            this.selDiv.removeClass('swordselect-selimg-over');
            this.box.set('display', 'false');
            this.selectbox.getElements('div').each(function(li) {
                if(li.getProperty('index') == this.selectedIndex) {
                    this.unselect_lis();
                    this.currentElement = li.addClass('swordselect-selected');
                }
            }.bind(this));
            this.options.onHide = this.box.get("onHide")||this.box.retrieve("onHide");
            if($defined(this.options.onHide) && $chk(this.options.onHide)) {
                this.execGridOnFinished();//onchange时，更新表格数据
                this.getFunc(this.options.onHide)[0](this.currentElement, this);
            }
            if(this.box.get('rule')) {
                var state=this.validate.validate(this.box);
                if(!state){return state;}//阻断元素的移除操作
            }
        }
    },
    show: function() {
        if(!$defined(this.box.get('display')) || this.box.get('display') == 'false') {
        	this.reBuild();
            this.options.onShow = this.box.get("onShow")||this.box.retrieve("onShow");
            if($defined(this.options.onShow) && $chk(this.options.onShow)) {
                this.getFunc(this.options.onShow)[0](this.currentElement,this);
            }
            this.selDiv.addClass('swordselect-selimg-over');
            if(this.selectbox.getElements('div').length > 0) {
                xyposition(this.box, this.box_div);
                if(this.selectbox.scrollWidth>this.selectbox.clientWidth){ //下拉弹出框自适应
                	this.box_div.setStyle('width', $chk(this.options.popWidth) ? this.options.popWidth : this.selectbox.scrollWidth+18);
                	this.selectbox.setStyle('width', $chk(this.options.popWidth) ? this.options.popWidth : this.selectbox.scrollWidth+18);
                }
                //this.box_div.fade('in');
                this.def_select(this.box.get('code'));
                this.box_div.setStyles({'display':'block'
                    //,'left':this.box._getPosition().x
                });
            }
            this.box.set('display', 'true');
            //设置输入框must背景色
            var rule = this.box.get('rule');
            if($defined(rule) && rule.contains('must'))this.box.setStyle('background-color','#b5e3df');
        }
    },
    reBuild: function() {
        this.selectbox.getElements('div').each(function(li) {
            li.dispose();
        });
        //置顶功能，删除hr分割线
        this.selectbox.getElements('hr').each(function(li) {
            li.dispose();
        });
        var loadData = this.getOptionsData();
        if(!$defined(loadData)) {
            var pcode,tid = this.box.get("tid");
            if(!$defined(tid) && !$chk(tid) && !$chk(this.box.get("onSubmitBefore")||this.box.retrieve("onSubmitBefore"))) {
                if(this.exSelectDataFunc) {
                    this.exSelectDataFunc();
                    this.build_options(this.getOptionsData());
                }
            } else {
                if(this.isMulti() && $defined(this.box.get("parent"))) {
                    pcode = this.getParentValue();
                }
                this.getDataInCache(tid, this.box.get("dataname") || this.box.get("name"), pcode);
            }
        } else {
            this.build_options(loadData);
        }
    },
    clearOptions:function(box, bz) {
        box.set('text', '');
        box.set({'value':'','code':'','realvalue':''});
        if(bz != false) {
            this.selectbox.getElements('div').each(function(li) {
                li.dispose();
            });
            box.set("isBuild", "false");
        }
        if(this.grid) {
            box.set({'caption':''});
            this.grid.updateCell(box, '');
        }
        return this;
    },
    toggle_selection: function() {
    },
    unselect_lis: function() {
        this.selectbox.getChildren().removeClass('swordselect-selected');
    }

    ,getDataDivFxScroll:function() {
        if(this.dataDivFxScroll == null) {
            this.dataDivFxScroll = new Fx.Scroll(this.selectbox, {duration:10});
        }
        return this.dataDivFxScroll;
    },
    def_select:function(id) {
        var nodes = this.selectbox.getChildren("div"); //置顶功能 ，分割线不增加样式
        var i;
        for(i = 0; i < nodes.length; i++) {
            nodes[i].removeClass('swordselect-selected-fix');
            if(id == nodes[i].get('value')) {
                this.currentElement = nodes[i].addClass('swordselect-selected-fix');
                this.getDataDivFxScroll().toElement(nodes[i]);
                this.selectedIndex = this.currentElement.getProperty('index');
            }
        }
    },
    change_item:function(li, notHide) {
        if(li) {
        	if(li.get('name')=="loading")return;
            this.unselect_lis(this.selectbox);
            this.selectedIndex = li.getProperty('index');
            this.currentElement = li;
            this.currentElement.addClass('swordselect-selected');
        }
        if(!this.currentElement && !notHide) {
            this.hide();
            return;
        }
        var oCode = this.box.get('code');
        var excuteChange = true;
        var alldb = this.currentElement.retrieve("allDb");
        this.box.set('value', this.genarateInputContent(alldb));
        var nowCode = this.currentElement.get('value');
        this.box.set('code', nowCode);
        if(oCode == nowCode)excuteChange = false;
        this.box.store('allDb', alldb);
//        var curdb = this.currentElement.retrieve("allDb");
        var genCon = alldb[this.box.get('codeSign')];
        this.box.set('realvalue', genCon);
        if($chk(this.getBoxParent())){
            this.getBoxParent().set({'code':this.currentElement.get('value'),'realvalue':genCon});
            if(excuteChange) {
                var child = this.getBoxParent().get("child") || this.box.get("child");
                var space = this.getBoxParent().retrieve("space") || this.getBoxParent().getParent("div.swordfrom_div");
                while($defined(child)) {
                    var cSel = space.getElements("*[name='" + child + "']")[0];
                    if($defined(cSel)) {
                        this.clearOptions(cSel);
                        child = cSel.get("child");
                    } else
                        break;
                }
            }
        	
        }
    	this.options.onChange = this.box.get("onChange")||this.box.get("_onChange")||this.box.retrieve('onChange');
        if(!notHide)this.hide();
        if($defined(this.options.onChange) && $chk(this.options.onChange) && excuteChange) {
            var opData = this.getOptionsData();//必须在更新表格数据前执行，否则报错
            this.execGridOnFinished();//onchange时，更新表格数据
            if($chk(opData)) {
                this.getFunc(this.options.onChange)[0](this.currentElement, opData[this.selectedIndex], this,oCode);
            } else {
                //延迟加载数据
                this.getFunc(this.options.onChange)[0](this.currentElement, alldb, this,oCode);
            }
        }
        this.options.onSelect = this.box.get("_onSelect")||this.options.onSelect;
        if($defined(this.options.onSelect) && $chk(this.options.onSelect)) {
            this.getFunc(this.options.onSelect)[0](li);
        }
    }
    ,
    change_item_on_keyup: function(e) {
        if(e.key == 'tab') return true;
        if(e.key == 'esc') {
            this.hide();
        	this.execGridOnFinished();
            if(this.grid && this.grid.options.noNextEvent){
            	this.getFunc(this.grid.options.noNextEvent)[0]();
            }
            return true;
        }
        if(e.key == 'enter') {
            if(this.grid)var cell = this.box.getParent('div.sGrid_data_row_item_div');
            this.change_item();
            this.execGridOnFinished();
            if(this.grid)this.grid.nextCell(cell,e);
        }
        if(e.key == 'backspace' || e.key == 'delete') {
            if(this.box.get("readonly")) {
            	try{
                    e.stop();
                }catch(e){}
                return;
            }
            if(this.box.get("mode") == 2) {
                this.box.set("code", "");
            } else {
                var ov = this.box.get("value");
                this.box.set("value", "");
                this.box.set("realvalue", "");
                this.box.set("code", "");
                this.box.store("allDb", null);
                try {
                    var child = this.getBoxParent().get("child") || this.box.get("child");
                    while($defined(child)) {
                    	 var space = this.getBoxParent().retrieve("space") || this.getBoxParent().getParent("div.swordfrom_div");
                        var cSel = space.getElements("*[name='" + child + "']")[0];
                        if($defined(cSel)) {
                            this.clearOptions(cSel, false);
                            child = cSel.get("child");
                        } else
                            break;
                    }
                    this.options.onChange = this.box.get("onChange")||this.box.get("_onChange")||this.box.retrieve("onChange");
                    if($defined(this.options.onChange) && $chk(this.options.onChange) && ov != "") {
                        this.execGridOnFinished();
                        this.getFunc(this.options.onChange)[0](null, null, this);
                    }
                } catch(e) {
                }

            }
            this.selectbox.getChildren(".swordselect-selected-fix").removeClass("swordselect-selected-fix");
            this.selectbox.getChildren(".swordselect-selected").removeClass("swordselect-selected");
            this.currentElement = null;
            try{
                e.stop();
            }catch(e){}
        }
        if((e.key == 'up' || e.key == 'down') && e.alt) {
            (this.box.get('display') == 'true') ? this.hide() : this.show();
            return true;
        }
        var li = null;
        if(e.key == 'up' || e.key == 'left') {
            li = this.change_element_by_method('getPrevious');
        } else if(e.key == 'down' || e.key == 'right') {
            li = this.change_element_by_method('getNext');
        } else if(e.code == 36 || e.code == 33) {
            li = this.change_element_by_method('getFirst', true);
        } else if(e.code == 35 || e.code == 34) {
            li = this.change_element_by_method('getLast', true);
        } else {
            li = this.change_element_by_char(e.key);
        }
        if(li != null) {
            this.unselect_lis(this.selectbox);
            this.selectedIndex = li.getProperty('index');
            this.currentElement = li;
            this.currentElement.addClass('swordselect-selected');
            this.getDataDivFxScroll().toElement(li);
            this.options.onSelect = this.box.get("_onSelect")||this.options.onSelect;
            if($defined(this.options.onSelect) && $chk(this.options.onSelect)) {
                this.getFunc(this.options.onSelect)[0](li);
            }
        }
    }
    ,
    change_element_by_method: function(method, from_child) {
        if(!this.currentElement)return this.currentElement = this.selectbox.getFirst("div:not(.swordselect-selected-none)");
        return from_child ? this.currentElement.getParent()[method]("div:not(.swordselect-selected-none)") : this.currentElement[method]("div:not(.swordselect-selected-none)");
    },
    change_element_by_char: function(key) {
        var nv = this.box.get("value");
        var vName = this.box.get("name");
        if(this.box.get("mode") == 2) {
            this.selectLoading();
            var tid = this.box.get("tid");
            this.getNextPageData.bind(this)();
        } else {
            this.filterSelectBox(nv);
        }
    }
    ,
    filterSelectBox:function(v) {
        this.selectbox.getChildren().each(function(li) {
            if((li.get('value') + "").search(v) == -1 && (li.get('text') + "").search(v) == -1)
                li.addClass("swordselect-selected-none");
            else
                li.removeClass("swordselect-selected-none");
        });
        this.currentElement = null;
    }
    ,
    getNextPageData:function(bz) {
        var vName = this.box.get("name");
        this.selectLoading();
        if($defined(bz)) {
            this.getSelectSoleData(this.sConsole.retrieve("curPage").toInt() + bz);
        } else {
            this.calculateConsole("clear");
            this.getSelectSoleData(1);
        }
    }
    ,
    getSelectSoleData:function(curPage) {
        var nv = this.box.get("value");
        var code = this.box.get("code");
        var tid = this.box.get("tid");
        var vName = this.box.get("name");
        if(!$chk(nv) || !$defined(nv)) {
            code = "";
        }
        try {
            var req = pc.getReq({'tid':tid,'widgets':[
                {
                    'sword':"SwordForm",
                    'name' :this.box.get("name"),
                    'data' :{
                        'caption':{value:nv},
                        'pcode':{value:code},
                        'targetPage':{'value':curPage},
                        'rowsOfPage':{'value':10}
                    }
                }
            ]});
            pc.postReq({
                'req':req,
                'loaddata':"widget",
                'onSuccess':function(res) {
                    this.unselectLoding();
                    if(this.box.get("name") != vName) {
//                        logger.debug("当前操作的select已经转移，不创select选择框！");
                    } else {
                        this.calculateConsole("init", null, res.getAttr("totalRows"));
                        this.build_options(res.data[0].data);
                    }
                }.bind(this),
                onError:function() {
                    alert("从服务器端获取数据出错了,请求的tid为【" + tid + "】");
                }.bind(this)
            }).delay(1000, this);
        } catch(e) {
            return;
        }
    }
    ,
    calculateConsole:function(cP, bz, rows) {
        if(cP == "init") {
            this.sConsole.store("rows", rows);
            this.sConsole.store("pages", ((rows % 10) == 0) ? rows / 10 : (rows / 10 + 1));
            var curPage = this.sConsole.retrieve("curPage");
            if(!$defined(curPage))this.sConsole.store("curPage", 1);
        } else if(cP == "clear") {
            this.sConsole.store("rows", null);
            this.sConsole.store("curPage", null);
            this.sConsole.store("rows", null);
            this.sConsole.getElements("div").removeClass("swordselect_csl_hidden");
            this.sConsole.setStyle('display', 'none');
        } else {
            var rows = this.sConsole.retrieve("rows");
            if(rows / 1 < 10) {
                this.sConsole.setStyle('display', 'none');
            }
            var cp = this.sConsole.retrieve("curPage") / 1 + bz;
            var pages = this.sConsole.retrieve("pages") / 1;
            if(cp == 1) {
                this.sConsole.getElement("div.swordselect_csl_pre").addClass("swordselect_csl_hidden");
            } else if(cp == pages) {
                this.sConsole.getElement("div.swordselect_csl_next").addClass("swordselect_csl_hidden");
            }
            if(pages > 1) {
                this.sConsole.setStyle("display", '');
            }
        }
    }	
    ,
    clear:function() {
        this.hide();
        this.box.destroy();
        this.selDiv.destroy();
    }
    ,
    dm2mc:function(node, dm, pcode,selectData) {
        if(dm == '' || dm == null || dm == undefined) {
            //dm为空值并且定义defIndex/defValue时
            if(node.get('defIndex') || node.get('defValue')) {
            	this.box = $(node);
                this.box.store("data", this.box.getChildren(">div"));
                var rv = this.initData(node.get('defValue'), node, node.get('defIndex'));
                return {"code":node.get("code"),"caption":node.get("value"),"realvalue":rv};
            }
            return '';
        }
        if(dm.indexOf("|") > -1 && dm.indexOf("code") > -1 && dm.indexOf("caption") > -1) {
            //var rv = this.initData(dm, node);
            this.box = $(node);
            var h = dm.toHash();
            var obj = {};
            h.each(function(v, k) {
                obj[k] = v;
            }, this);
            var rv = this.genarateContent(obj);
            dm = {"code":h.get("code"),"caption":h.get("caption"),"realvalue":rv};
        } else {
            this.box = $(node);
            this.box.store("data", this.box.getChildren(">div"));
            var rNode,realvalue;
//            if($chk(node.get('parent')) && $chk(space)) {
//            	var parentEl;
//            	if($type(space) == "array" && space.length > 0){
//            		for(var index=0; index<space.length;index++){
//            			if(space[index].get('name')==node.get('parent')&&space[index].get('code')){
//            				parentEl=space[index];
//            				break;
//            				}
//            		}
//            	}else{parentEl = space.getElement('[name=' + node.get('parent') + '][code]');}
//                if(parentEl)pcode = parentEl.get('code');
//            }
            var datas = $chk(selectData)?selectData : this.getOptionsData("noFilter","grid");
            if(!datas)return '';
            var data;
            for(var i = 0; i < datas.length; i++) {
                data = datas[i];
                if($type(data) == 'element') {
                    data = {caption:data.get('caption'),code:data.get('code'),pcode:data.get('pcode')};
                }
                if($chk(pcode)) {//级联下拉校验 pcode
                    if(data.pcode == pcode && data.code == dm) {
                        realvalue = this.genarateContent(data);
                        rNode = this.genarateInputContent(data);
                        break;
                    }
                } else {//单下拉
                    if(data.code == dm) {
                        realvalue = this.genarateContent(data);
                        rNode = this.genarateInputContent(data);
                        break;
                    }
                }
            }
            if(rNode && realvalue)dm = {"code":dm,"caption":rNode,"realvalue":realvalue,"allDb":data};
        }
        return dm;
    }
    ,
    disable:function(inputEl) {
        if($defined(inputEl)) {
            inputEl.set('disabled', 'true').addClass('select_input_disable').setStyle('background-color','');
            var sel = this.getImgEl(inputEl);
            sel.addClass('swordselect-selimg-disable');
//            if(inputEl.cloneFlag) {
//                sel.setStyle('display', '');
//                sel.getNext().setStyle('display', 'none');
//            } else {
//                sel.clone().addClass('swordselect-selimg-disable').inject(sel, 'before');
//                sel.setStyle('display', 'none');
//                inputEl.cloneFlag = true;
//            }
        }
    }
    ,
    enable:function(inputEl) {
        if($defined(inputEl)) {
            var sel = this.getImgEl(inputEl);
            inputEl.erase('disabled').removeClass('select_input_disable');
            sel.removeClass('swordselect-selimg-disable');
//            sel.setStyle('display', 'none');
//            sel.getNext().setStyle('display', '');
            var rule = inputEl.get('rule');
            if($defined(rule) && rule.contains('must'))inputEl.setStyle('background-color','#b5e3df');
        }
    } ,
    addEventToEl:function(typeStr,parent){
        if(typeStr=="input"){
            this.box.addEvent('focus', function(e) {
                if(parent && parent.name == 'SwordGrid') {
                    this.grid = parent;
                } else {
                    this.grid = null;
                }
                if($defined(e)) {
                    if(this.box == $(new Event(e).target)) {
                        this.rebuild = false;
                    } else {
                        if(this.box.get("display") == 'true') {
                            this.hide();
                            if(!$(e.target).hasClass('sGrid_data_row_item_select')) {
                                this.execGridOnFinished();
                            }
                            this.box.set('display', 'false');
                        }
                        this.box = $(new Event(e).target);
                        this.selDiv = this.getImgEl(this.box);
                        this.rebuild = true;
                    }
                }
                if(this.box.get('display') == 'true') {
                    //this.hide();
                } else {
                    this.show();
                }
            }.bind(this));
         
            this.box.addEvent("keyup", this.change_item_on_keyup.bind(this));
        }else{
            this.selDiv.addEvent('click', function(e) {
            	var tar = $(new Event(e).target);
            	if(tar.hasClass('swordselect-selimg-disable')){
            		return;
            	}
                if(parent && parent.name == 'SwordGrid') {
                    this.grid = parent;
                } else {
                    this.grid = null;
                }
                if(this.selDiv == tar) {
                    this.box = this.getBoxEl(this.selDiv);
                    this.rebuild = false;
                } else {
                    if(this.box.get("display") == 'true') {
                        this.hide();
                        if(!$(e.target).hasClass('sGrid_data_row_item_select')) {
                            this.execGridOnFinished();
                        }
                        this.box.set('display', 'false');
                    }
                    this.selDiv = $(new Event(e).target);
                    this.box = this.getBoxEl(this.selDiv);
                    this.rebuild = true;
                }
                if(this.box.get('display') == 'true') {
                    //this.hide();
                } else {
                    this.show();
                    this.box.focus();
                }
            }.bind(this));
        }
    }
});