var SwordForm = new Class({
    Implements:[Events,Options],
    Extends:PageContainer,
    name:"SwordForm",
    $family: {name: 'SwordForm'},
    options:{
        sword : null,//组件类型标识
        name : null, //组件唯一标识名
        caption:null,//form的标题栏
        layout:null,//组件的布局配置
        pNode:null, //组件的父对象
        panel:'false',//组件的panel栏
        beanname:null,//form表单对应于后台的BO的类型
        userDefine:null,//定义SwordForm为自定义布局
        onFinish:$empty,//数据装载完之后触发的事件
        size:null,//定义form里面各个元素的尺寸
        css:null,//定义form里面各个元素的样式
        isValidate:'',//定义form是否需要增加校验
        vType:null,//定义form的校验提示类型
        topPanel:false,//是否创建顶层panel
        btmPanel:false,//是否创建底部的panel
        requiredSign:"caption",//必填的标志的位置。是跟随caption还是跟随field
        edit:null,//是否是只读form
        isShowTogdiv:false,
        valfocus:true,//表单焦点移动的时候如果校验不通过是否可以移动到下一元素 true可以移动 false不可以移动
        noNextEvent:null//表单焦点移动没有时调用方法
    },
    el:{
        name:null,//name属性
        caption:null,//标题
        rule:null,//form元素item校验规则
        des:null,//form元素item的描述信息
        desType:null,//描述信息类型。是否是按钮还是文本
        biztid:null,//如果该元素需要进行后台的业务校验，则需要定义此属性，和定义tid一样
        bizctrl:null,//如果该元素需要进行后台的业务校验，则需要定义此属性，和定义ctrl一样
        vType:null,//某一个元素上的校验提示类型，可能暂时不生效
        scope:null,//业务校验提交数据的范围
        css :null,//样式设置,暂只支持某些items元素
        defValue:null,//默认值
        onValidate:null,//在进行校验时需要触发的方法
        onCreate:null,//在创建元素时调用
        maxLength:10000,//默认的输入长度限制
        msg:null,//提示信息
        dataformat:null,//数据格式的切换
        submitformat:null,
        format:null
        ,show:true//是否显示
        ,tipTitle:null//输入的提示信息
        ,placeholder:null//文本框中的操作提示信息
    },
    dftcss:{
        caption:null,//控制标题框的样式
        text:null//控制输入框的样式
    },
    dftsize:{
        ButtonWidth:75,//按钮的宽度
        ButtonWidth:75,//按钮的宽度
        CaptionWidth:80,//标题栏的宽度
        TdWidth:250,//操作栏TD的宽度
        FiledWidth:145,//操作栏的宽度(包括input，lable，textarea等等)
        DesWidth:170,//描述栏的宽度
        VimgWidth:17,//校验图片的宽度
        VimgHeight:21,//校验图片的高度
        VFiledWidth:180//校验框的总宽度
    },
    getEl:function(node) {
        var _el = $unlink(this.el);
        for(var key in _el) {
            _el[key] = node.get(key) || _el[key];
            if(key == "opts") {
                _el[key] = node.getChildren('>div');
            }
            if($type(_el[key]) == 'function' && (/^on[A-Z]/).test(key)) {
                _el[key] = new Function('param', _el[key]);
            }
        }
        return _el;
    },
    userSize:null,
    idx:0,//焦点转移顺序
    Vobj:null,//校验对象
    items : null,//元素对象集合,所有元素的nodes集合
    itemsDiv: [],//对象元素被浏览器解析之前的div集合
    layer : null,//当前form的布局对象
    defAtts:['caption','name','des'],//元素的title,元素的描述框
    elmodel:['div','item','div'],//元素的title,元素�?元素的描述框
    blocks:[],//block块数组
    hiddens:[],//隐藏元素集合
    hasFile:false,//当前form中是否有文件上传的提交
    wrapDiv:null,//最外层的wrapDiv
    noblock:'noblcok',//判断当前是否有block元素
    lazyInitData:new Hash(),//确保ie6下的checkbox，radio能够初始化,
    panel:null,
    fieldElHash:null,//用于存储元素，便于查询，用于getFieldEl接口
    fieldElOrderHash:null,//用于存储元素，焦点转移的顺序
    isHasFile:function() {
        return this.hasFile;
    },
    initParam:function(htmlNode) {
    	if(this.tooltips == null) {
            this.tooltips = pageContainer.create('SwordToolTips');
        }
        this.fieldElHash = new Hash();
        this.fieldElOrderHash = new Hash();
        this.htmlOptions(htmlNode);
        this.userSize = JSON.decode(this.options.size);
        if($defined(this.userSize)) {
            this.dftsize = $extend(this.dftsize, this.userSize);
        }
        var userCss = JSON.decode(this.options.css);
        if($defined(userCss)) {
            this.dftcss = $extend(this.dftcss, userCss);
        }
        this.blocks = htmlNode.getChildren(">div[type='block']");
        this.items = htmlNode.getChildren(">div[console!='submit'][console!='reset'][console!='button']");
        if(htmlNode.getElements("div[type='file']").length > 0) {
            this.hasFile = true;
        }
        this.layer = SwordForm$Layout[this.options.layout]||SwordForm$Layout.deflayer;
        this.Vobj = pc.widgetFactory.create("SwordValidator");
        this.options.vType = this.options.vType || "intime";
        this.Vobj.initParam(this.options.vType);
        this.createForm();
    },
    createForm:function() {
        this.options.pNode.set({'class':'swordfrom_div','align':'center'});
        if(this.options.userDefine == "true") {
        	//SwordForm_Template.render(this.options.pNode,this); 此逻辑放到initData的时候处理.
        	this.setEventDelegator();//注册事件代理对象;
        	return;
        } else {
        	if(this.options.topPanel == "true") {
                var div = new Element("div", {'class':'swordform_panel_top'}).inject(this.wrapDiv);
                div.set("html", "<div class='l'></div><div class='r'></div>");
            }
        	this.wrapDiv = new Element("div", {'align':'center','class':'swordfrom_wrap_div'}).inject(this.options.pNode);
        	 if(this.options.panel == 'true') {
        		 this.panel = new SwordPanel({pNode:this.wrapDiv,caption:this.options.caption}).initParam();
                 if(this.options.isShowTogdiv == "true") {
                     new Element('div', {
                         'class':'x-tool',
                         'title':'收缩',
                         'events':{
                             'click':function(e) {
                                 var tar = new Event(e).target;
                                 this.toggleFormDisplay(tar);
                             }.bind(this)
                         }
                     }).inject(this.panel.tc, 'top');
                 }
             }
            if(this.blocks.length == 0)this.blocks = [this.noblock];
            this.blocks.each(function(block) {
                var items,fieldset,layer;
                if(block == this.noblock) {
                    layer = this.layer;
                    items = this.items;
                    this.items.each(function(item, index) {
                        this.itemsDiv[index] = item.clone();
                    }.bind(this));
                    fieldset = new FormBlockArea({pNode:this.wrapDiv,caption:"",isHide:"false",name:"",isShow:'true'}).initParam();
                } else {
                    items = block.getChildren(">div");
                    fieldset = new FormBlockArea({pNode:this.wrapDiv,caption:block.get("caption"),isHide:block.get("isHide"),name:block.get("name"),isShow:block.get("isShow")}).initParam();
                    layer = ($defined(block.get("layout"))) ? eval(block.get("layout")) : this.layer;
                }
                var itemDiv = new Element('div', {'class':'swordform_items_div','height':'auto'}).inject(fieldset);
                items = items.filter(function(its) {
                    if(its.get('type') == 'hidden') {
                        this.hiddens.include(its);
                    }
                    return its.get('type') != 'hidden';
                }, this);
                var ems = items.splitForm(layer.cols);
                ems.each(function(em, idx) {
                    var div = new Element("div", {'class':'swordform_row_div'}).inject(itemDiv);
                    div.addClass(((idx + 1) % 2 == 0) ? "swordform_row_shuang" : "swordform_row_dan");
                    em.each(function(e, index, em) {
                        if(!$chk(e.get('name')) && e.get('type') != "userdefine") {
                            return;
                        }
                        var isLast = (index + 1 == em.length);
                        this._parseRow(div, e, layer, isLast);
                    }.bind(this));
                    //初始化时，根据show来显示隐藏item
                    em.each(function(el) {
                        if(el.get("show") == 'false') {
                            this.unDisplayItem(el.get('name'));
                        }
                    }.bind(this));
                }.bind(this));
            }, this);
            var hiddenDiv = new Element("div", {'styles':{'display':'none'}}).inject(this.wrapDiv);
            this.hiddens.each(function(hids) {
                this._parseRow(hiddenDiv, hids, this.layer);
            }, this);
            if(this.options.btmPanel == "true") {
                var div = new Element("div", {'class':'swordform_panel_btm'}).inject(this.wrapDiv);
                div.set("html", "<div class='l'></div><div class='r'></div>");
            }
            var bts = this.options.pNode.getChildren(">div[console]");
            var tr;
            bts.each(function(buton, idx) {
                if(idx == 0)tr = this.createConsole(this.wrapDiv);
                this.createButton(tr, buton);
            }.bind(this));
            if(jsR.config.swordForm.align == "center") {
                this.refreshForm();
            }
            this.getFieldEls().filter(
                    function(el) {
                        return (el.get("tag").toLowerCase() != "textarea");
                    }).each(function(item){item.addEvent('keyup', this.nextFocus.bind(this));}.bind(this));
            this.lazyInitData.each(function(v, k) {
                this.getWidget(k).initData(v, "ie6");
            }.bind(this));
            if(this.options.edit == "false") {
                this.disable();
            }
        }
    },
    setEventDelegator : function() {
		this.eDelegator = new SwordEventDelegator({
			'container' : this.options.pNode
		});
		[".swordform_item_oprate",".dateBtn",".swordselect-selimg",".tree-select-selimg"].each(function(item){
			this.eDelegator.add('click', this.itemElClick.bind(this),item);
		}.bind(this));
		/* onFocusin和click有冲突,onfocusout事件模拟触发事件blur.*/
		if(Browser.Engine.trident){
			this.options.pNode.onfocusout = function(e) {
				e = new Event(e);
				var tEl=e.target;
				if (tEl.hasClass("swordform_item_oprate")||$chk(tEl.get("ruleType"))) {
					this.itemElBlur(e, e.target);
				}
			}.bind(this);
			this.options.pNode.onfocusin = function(e) {
				e = new Event(e);
				var tEl=e.target;
				if (tEl.hasClass("swordform_item_oprate")||$chk(tEl.get("ruleType"))) {
					this.itemElFocus(e, e.target);
				}
			}.bind(this);
		}
		this.eDelegator.add('dblclick', this.itemElDblClick.bind(this),
				'.swordform_item_oprate');
		this.eDelegator.add('keydown', this.itemElKeydown.bind(this),
				'.swordform_item_oprate');
		this.eDelegator.add('keyup', this.itemElKeyup.bind(this),
		'.swordform_item_oprate');
	},
	itemElFocus : function(e, el) {
		var typeStr=el.get("widget")||el.get("type");
		pc.formItems[typeStr].runEventFocus(e, el,this);
	},
	itemElClick : function(e, el) {
		var tEl=$(e.target);
		if(tEl.get("tag")=="td"){
			el=tEl.getPrevious().getElement("input");
		}
		var typeStr=el.get("widget")||el.get("type");
		if(typeStr)pc.formItems[typeStr].runEventClick(e, el,this);
	},
	itemElBlur : function(e, el) {
		var typeStr=el.get("widget")||el.get("type");
		if(typeStr)pc.formItems[typeStr].runEventBlur(e, el,this);
		/*this.getField(el.get("name")).maxLengthCount(e);*/
		/*$("diveventtest").set("text",$("diveventtest").get("text")+"blur");*/
		/*先执行校验，然后执行format，最后执行自定义事件.*/
	},
	itemElDblClick : function(e, el) {
		var typeStr=el.get("widget")||el.get("type");
		pc.formItems[typeStr].runEventDblClick(e, el,this);
		/*$("diveventtest").set("text",$("diveventtest").get("text")+"dbclick");*/
		/*执行定义的dbclick事件.*/
	},
	itemElKeydown : function(e, el) {
		var typeStr=el.get("widget")||el.get("type");
		pc.formItems[typeStr].runEventKeydown(e, el,this);
		/*this.getField(el.get("name")).maxLengthCount(e);*/
		/*$("diveventtest").set("text",$("diveventtest").get("text")+"keydown");*/
		/*除textarea外，执行定义的dbclick事件.*/
	},
	itemElKeyup : function(e, el) {
		var typeStr=el.get("widget")||el.get("type");
		pc.formItems[typeStr].runEventKeyup(e, el,this);
		this.nextFocus(e);
	},
    toggleFormDisplay:function(el,state){
    	var temp = this.options.pNode;
    	if(!el)el=temp.getElement("div.x-tool");
    	var div = $splat(temp.getElement("div.swordform_block") || temp.getChildren('table'));
        var tb = temp.getElement('div[sword=SwordToolBar]');
        if(tb)div.include(tb);
        if(el.hasClass('x-tool-s')&&!state) {
        	el.set('title', '收缩');
        	el.removeClass("x-tool-s");//zk,suo
            el.getParent("div.swordform-panel-box").setStyle('border-bottom', 'none');
            div.each(function(item, index) {
                if(item.hasClass('x-tool-dis') && item.getStyle("display") == "none") {
                    item.setStyle("display", "");
                    item.removeClass('x-tool-dis');
                }
            }.bind(this));
        } else {
        	el.set('title', '展开');
        	el.addClass("x-tool-s");//suo,zk
        	el.getParent("div.swordform-panel-box").setStyle('border-bottom', '1px #7F9DB9 solid');
            div.each(function(item, index) {
                if(item.getStyle("display") != "none") {
                    item.setStyle("display", "none");
                    item.addClass('x-tool-dis');
                }
            }.bind(this));
        }
    }
    ,refreshForm:function() {
        var ROW_WIDTH = 0;
        var rows = this.options.pNode.getElements("div.swordform_row_div");
        rows.each(function(el, idx) {
            this.reSizeRow(el);
            var rowWidth = 0;
            el.getElements(".swordform_item_div").each(function(tab, index) {
                var width;
                if(tab.getFirst() && tab.getFirst().get("tag") == "table") {
                    width = tab.getFirst().getWidth().toInt();
                } else {
                    width = tab.getWidth().toInt();
                }
                rowWidth += width;
            }.bind(this));
            if(rowWidth > ROW_WIDTH)ROW_WIDTH = rowWidth;
        }.bind(this));
        rows.setStyle('width', ROW_WIDTH);
    },
    _parseRow:function(p, element, layer, isLast) {
        var itemdiv = new Element("div", {'class':'swordform_item_div','idx':this.idx}).inject(p);
        this.idx = this.idx + 1;
        var table = new Element('table', {'class':'swordform_item_table','cellspacing':0,'cellpadding':0,'border':0}).inject(itemdiv);
        var tbody = new Element('tbody').inject(table);
        layer.item.trs.each(function(em) {
            var tr = new Element('tr', {'class':'swordform_item_tr'}).inject(tbody);
            em.each(function(e) {
                var td = new Element('td', {'class':'swordform_item_' + e.name + '_td',
                    'colspan':$defined(e['colspan']) ? e['colspan'] : 1,
                    'rowspan':$defined(e['rowspan']) ? e['rowspan'] : 1
                }).inject(tr);
                var tag = this.elmodel[this.defAtts.indexOf(e.name)];
                if(tag == "item") {
                    if($defined(element.get("cols"))) {
                        var cols = element.get("cols") / 1;
                        td.setStyle("width", (this.dftsize.TdWidth * cols + this.dftsize.CaptionWidth * (cols - 1)));
                    } else {
                        td.setStyle('width', this.dftsize.TdWidth);
                    }
                    if(isLast) {
                        td.setStyle("border-right", 0);
                    }
                    this._parseItem(td, element);
                } else {
                    if(e.name == "des" && element.get("desType") != null) {
                        var btn = $(element.get("desType"));
                        btn.clone().cloneEvents(btn).inject(td);
                    } else {
                        var node = new Element(tag, {'for':element.get("name"),'text':element.get(e.name),'class':'swordform_item_text_' + e.name}).inject(td);
                        if(e.name == "caption") {
                            var rule = element.get("rule");
                            if($chk(this.dftcss.caption) && $defined(this.dftcss.caption)) {
                                node.set("style", this.dftcss.caption);
                            }
                            node.setStyle('width', this.dftsize.CaptionWidth);
                            node.set('text', element.get(e.name));
                            if($defined("rule") && $chk(rule)) {
                                if(rule.indexOf("must") > -1 && this.options.requiredSign == "caption") {
                                    node.innerHTML += "<span style='color:red'>*</span>";
                                }
                            }
                        }
                    }
                }
            }.bind(this));
        }.bind(this));
    },
    _itemSwitch:function(name, type, options) {
    	var fName=this.options.name,idStr=fName+"_"+name,idEl=$(idStr),elType=idEl.get("type"),yRule=idEl.get("rule"),xRule,defineItemEl;
    	if(type=="hidden"||elType=="hidden"){alert("hidden类型不能进行类型转换！");return;}
    	else{
    		this.fieldElHash.erase(idStr);
    		idEl.getParent(".swordform_field_wrap").destroy();
    		defineItemEl=$$("div[name='"+name+"'][type]")[0];
    		if(!defineItemEl){return;}
    		defineItemEl.set("type",type);
    		if(options){
    			for(var key in options){
    				defineItemEl.set(key,options[key]);
    			}
    		}xRule=defineItemEl.get("rule");
    		var htmlStr=SwordForm_Template.getItemHtml(type, defineItemEl, "");
    		var tdfg=STemplateEngine.createFragment(htmlStr);
    		tdfg.childNodes[0].inject(defineItemEl,"before");
    		idEl=$(idStr);
    		var widget=idEl.get("widget");
    		this.fieldElHash.set(idStr,idEl);
    		if(widget){
    			var tInitW=pc.formItems[widget]?pc.formItems[widget].initWidget:null;
    			if(tInitW)tInitW(name,idEl,this);
    		}
    		//处理span.red
    		var preEl=defineItemEl.getParent("td").getPrevious();
    		if(preEl){
	    		if((yRule&&yRule.indexOf("must")!=-1)&&((!xRule)||xRule.indexOf("must")==-1)){
	    			var spEl=preEl.getElement(".red");
	    			if(spEl)spEl.destroy();
	    		}if(((!yRule||yRule.indexOf("must")==-1)||(!preEl.getElement(".red")))&&(xRule&&xRule.indexOf("must")!=-1)){
	    			preEl.innerHTML=preEl.innerHTML+"<span style='color:red'>*</span>";
	    		}
    		}
    	}
       /* var defineItem = this.options.pNode.getElement("div[name='" + name + "']");
        var selDivAttributes = this.itemsDiv.filter(function(item) {
            return item.get('name') == name;
        })[0].attributes;
        var defiOptions = {};
        var d={PName:this.options.pNode.get('name')};
        var elTemp=null;
        for(var i = selDivAttributes.length; i > 0;) {
            var key = selDivAttributes[--i].nodeName;
            if(/^on/.test(key))defiOptions[key] = selDivAttributes[i].nodeValue;
        }
        if($chk(options.type)){
        	type = options.type;
        }else{
        	defineItem.set('type', type);
        }
        defineItem.set(defiOptions);
        defineItem.set(options);
        var CloneDefine = defineItem.clone(true);
        if(this.options.requiredSign == "caption" && this.options.userDefine != 'true') {
            var rule = defineItem.get("rule");
            var hfor = this.wrapDiv.getElement("div[for='" + name + "']");
            if(hfor) {
                var mustSpan = hfor.getElement("span");
                if($defined(rule)) {
                    if(rule.indexOf("must") > -1) {
                        if(!mustSpan)hfor.innerHTML += "<span style='color:red'>*</span>";
                    } else {
                        if(mustSpan)mustSpan.destroy();
                    }
                } else {
                    if(mustSpan)mustSpan.destroy();
                }
            }
        }
        if(this.options.userDefine == 'true' && this.options.requiredSign == "caption" && $defined(options.rule)) {
            var rule = options.rule;
            var spanWrap = this.wrapDiv.getElement('*[span=' + name + ']');
            if(spanWrap && rule.indexOf("must") == -1) {
                var span = spanWrap.getElement('span.red');
                if(span)span.destroy();
            }
        }
        var obj = this.fieldElHash.get(name);
        if(obj.get('tag')=='td')obj=obj.getElement("input[name='" + name + "']"); //当为下拉树时获取的是td
        var ya = obj.retrieve('data');
        var value = obj.get('value') || obj.get('text');
        var isSel = false,allDb,rv;
        if(obj.get("widget") == "select") {
            isSel = true;
            allDb = obj.retrieve("allDb");
            rv = obj.get("realvalue");
        }
        
        if(Browser.Engine.trident4){ //解决IE6导致IE崩溃的问题下的问题
        	var p = ['select','calendar','tree'].contains(obj.get('widget')) ? obj.getParent('table.swordform_field_wrap').getParent("td") : (obj.get('tag')=='div'?obj.getParent("td").empty():obj.getParent("table.swordform_field_wrap").getParent("td").empty());
	        if(['select','calendar','tree'].contains(obj.get('widget'))){
	        	var table = obj.getParent('table.swordform_field_wrap');
	        	var div = obj.getParent('table.swordform_field_wrap').getNext('div')?obj.getParent('table.swordform_field_wrap').getNext('div'):obj.getParent('table.swordform_field_wrap').getPrevious('div')
	        	table.parentNode.removeChild(table);
	        	div.parentNode.removeChild(div);
	        }
	        
	        //this._parseItem(p, defineItem);
	        CloneDefine.inject(p);
	        this.fieldElHash.set(name,null);
	        var idStr=SwordForm_Template[type](CloneDefine,'SwordForm',d);
	        elTemp=$(idStr);
	        this.fieldElHash.set(name,elTemp);
//	        var tar = p.getElement("*[name='" + name + "']");
	        elTemp.set({'text':value,'value':value});
	        if(elTemp.get('tag') == 'input')elTemp.addEvent('keyup', this.nextFocus.bind(this));
	        if(isSel)elTemp.store("allDb", allDb).set("realvalue", rv).store('data', ya);
	        if(obj.get("type")=="text" && obj.get("format")){
	        	var realvalue = obj.get('realvalue') ;
	        	elTemp.set({'realvalue':realvalue});
	        }else if(obj.get("type")=="textarea"){
	        	SwordTextareaTemplate.initData(elTemp, value);
	        }
//	        if(this.options.userDefine == "true")CloneDefine.inject(p); else CloneDefine = null;
        
        }else{
	        var p = ['select','calendar','tree'].contains(obj.get('widget')) ? obj.getParent('table.swordform_field_wrap').getParent("td").empty() : obj.getParent("td").empty();
	        //this._parseItem(p, defineItem);
	        CloneDefine.inject(p);
	        this.fieldElHash.set(name,null);
	        var idStr=SwordForm_Template[type](CloneDefine,'SwordForm',d,this);
	        elTemp=$(idStr);
	        this.fieldElHash.set(name,elTemp);
//	        var tar = p.getElement("*[name='" + name + "']");
	        elTemp.set({'text':value,'value':value});
	        if(elTemp.get('tag') == 'input')elTemp.addEvent('keyup', this.nextFocus.bind(this));
	        if(isSel)elTemp.store("allDb", allDb).set("realvalue", rv).store('data', ya);
	        if(obj.get("type")=="text" && obj.get("format")){
	        	var realvalue = obj.get('realvalue') ;
	        	elTemp.set({'realvalue':realvalue});
	        }else if(obj.get("type")=="textarea"){
	        	SwordTextareaTemplate.initData(elTemp, value);
	        }
//	        if(this.options.userDefine == "true")CloneDefine.inject(p); else CloneDefine = null;
        }
        if($defined(elTemp.get("rule")) && elTemp.get("rule").contains('must')&&!(elTemp.disabled || elTemp.get('disable') == 'true'))elTemp.setStyle('background-color','#b5e3df');
//        this.addEventForAllEl(elTemp);
        if(elTemp.get("type") == "text"){
        	elTemp.addEvent('focus', function() {
        		elTemp.select();
	        	this.showTip(elTemp.get("name"), elTemp);
	        }.bind(this));
		}
        this.allElEvent(elTemp);
        this.addEventForElType(elTemp);*/
    },
    isVal:function() {
        return (this.options.isValidate == 'true') || (this.options.vType == "elafter");
    },
    //------------------------------------------------------------------------------------------------------------------
    select:function(p, item, name) {
        var sel = pageContainer.getSelect();
        sel.setValidate(this.Vobj);
        sel.initParam(item, this);
        this.setWidget(name, sel);
        return sel.box;
    },
    label:function(p, item, name) {
        this.setWidget(name, null);
        var div = new Element('div', {'class':'swordform_field_wrap'}).inject(p);
        var vobj = new Element("label", this.getEl(item)).set({'text':item.get("defValue"),'class':'swordform_item_oprate swordform_item_label'}).inject(div);
        /*if(item.get("css")) {
            vobj.set("style", item.get("css")).setStyles({"float":"left","overflow":"hidden"});
            if(vobj.getWidth() > this.dftsize.TdWidth)p.setStyle("width", "");
        }*/
        if(this.isVal() && $defined(item.get("rule"))) {
            Sword.utils.createElAfter(div);
        }
        var userW=Sword.utils.parseCss(item.get('css'),vobj);
//        Sword.utils.setWidth(userW,this.userSize,div,vobj,false);   //size将不生效
        Sword.utils.setWidth(userW,null,div,vobj,false);
        return vobj;
    },
    textarea:function(p, item, name) {
//        var div = new Element('div', {'class':'swordform_field_wrap'}).inject(p);
//        item.pNode = div;
        var tObj={};
        var div=this.divTable = Sword.utils.createTable(tObj,false,false);
        div.inject(p);
        item.pNode = tObj.boxtd;
        var ta = new Textarea(item);
        this.setWidget(name, ta);

        var r= ta.initParam(this,div);
        ta.initEvent();
        var userW = Sword.utils.parseCss(ta.options.css, ta.box);
        Sword.utils.setWidth(userW, this.userSize, div, ta.box, false);

        return r;

    }
    ,selectsolely:function(p, item) {
        return this.select(p, item);
    }
    ,checkbox:function(p, item, name) {
        var div = new Element('div', {'class':'swordform_field_wrap'}).inject(p);
        item.pNode = div;
        var group = new SwordGroupFields(item);
        group.initParam(item, this);
        this.setWidget(name, group);
        return  group.wrap;
    }
    ,radio:function(p, item, name) {
        return this.checkbox(p, item, name);
    }
    ,multiselect:function(p, item) {
        return this.checkbox(p, item);
    }
    ,file:function(p, item, name) {
        var div = new Element('div', {'class':'swordform_field_wrap'}).inject(p);
        item.pNode = div;
        var fileObj = new fileUpload(item).initParam(item, this);
        this.setWidget(name, fileObj);
        if(this.isVal() && $defined(item.get("rule"))) {
            Sword.utils.createElAfter(div);
        }
        return fileObj.wrap;
    }
    ,file2:function(p, item, name) {
        var div = new Element('div', {'class':'swordform_field_wrap'}).inject(p);
        var up = initIntimeUp(div, name, item);
        this.setWidget(name, up);
        var vobj = up.con;
        vobj.addClass('swordform_item_oprate');
        vobj.set('widgetGetValue', 'true');
        vobj.set('widget', 'true');
        if(this.isVal() && $defined(item.get("rule"))) {
            Sword.utils.createElAfter(div);
        }
        return vobj;
    }
    ,hidden:function(p, item, name) {
        return this.text(p, item,name);
    }
    ,password:function(p, item, name) {
        return this.text(p, item, name);
    }
    ,text:function(p, item, name) {
        this.setWidget(name, null);
        var tObj={};
        var div= Sword.utils.createTable(tObj,false,false).inject(p);
        var el = {type:item.get("type"),sf:item.get('submitformat'),d:item.get('defValue') || '',f:item.get('format') || '',r:item.get('rule') || '',n:name,m:item.get('msg'),t:item.get('tipTitle'),b:item.get("biztid"),bc:item.get('bizctrl'),ph:item.get("placeholder")};
        if(el.ph == "true"){
        	tObj.boxtd.innerHTML = ["<input type='",el.type,"' bizctrl='",el.bc,"' submitformat=\"",el.sf,"\" defValue='",el.d,"' tipTitle='",el.t,"' biztid='",el.b,"' msg='",el.m,"' format=\"",el.f,"\" value='",el.d,"' rule='",el.r,"' id='",(this.options.name + '_' + el.n),"' placeholder='",el.ph,"'  name='",el.n,"' class='swordform_item_oprate swordform_item_input swordform_item_input_placeholder' >"].join("");
        }else{
        	tObj.boxtd.innerHTML = ["<input type='",el.type,"' bizctrl='",el.bc,"' submitformat=\"",el.sf,"\" defValue='",el.d,"' tipTitle='",el.t,"' biztid='",el.b,"' msg='",el.m,"' format=\"",el.f,"\" value='",el.d,"' rule='",el.r,"' id='",(this.options.name + '_' + el.n),"' placeholder='",el.ph,"'  name='",el.n,"' class='swordform_item_oprate swordform_item_input' >"].join("");
        }
        var vobj =  tObj.boxtd.getChildren("input")[0];
        var objTop = vobj._getPosition().y;
        this.cellTip(vobj, name);
        vobj.addEvent('focus', function() {
            vobj.select();
        	this.showTip(name, vobj);
        }.bind(this));
        vobj.addEvent('blur', function() {
            if(vobj.get("placeholder") == "true"){
            	if(vobj.get("value") == ""){
            		vobj.set("value",vobj.get("defvalue"));
            		vobj.addClass("swordform_item_input_placeholder");
            		this.Vobj.validate(vobj);
            	}else if(vobj.get("value") != vobj.get("defvalue")){
            		this.Vobj.validate(vobj);
            	}
            }
        }.bind(this));
        vobj.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress', function(e){
        	if(vobj.get("placeholder") == "true" && vobj.get("value") == vobj.get("defvalue")){
        		vobj.set("value","");
        		vobj.removeClass("swordform_item_input_placeholder");
        	}
        }.bind(this));
        if((item.get("rule") || "").indexOf("must") > -1 && this.options.requiredSign == "field") {
            new Element("span", {'styles':{'color':'red','float':'right'},'html':"*"}).inject(tObj.boxtd);
        }
        if((item.get("rule") || "").indexOf("must") > -1 && this.options.requiredSign == "caption" && this.options.userDefine == 'true') {
            var spanWrap = this.wrapDiv.getElement('*[span=' + name + ']');
            if(spanWrap) {
                var span = spanWrap.getElement('span.red');
                if(!span)spanWrap.grab(new Element("span", {'class':'red','html':"*"}), 'top');
            }
        }
        if(this.isVal() && $defined(item.get("rule"))) {
            Sword.utils.createElAfter(div);
        }
        var userW=Sword.utils.parseCss(item.get('css'),vobj);
        Sword.utils.setWidth(userW,this.userSize,div,vobj,false);
        return vobj;
    }
    ,SwordSubmit:function(p, item, name) {
        var submit = pageContainer.create("SwordSubmit");
        submit.initParam(item);
    }
    ,date:function(p, item, name) {
        var cal = pageContainer.getCalendar();
        cal.setValidate(this.Vobj);
        var obj = cal.initParam(item, this);
        this.setWidget(name, cal);
        return cal.dateInput;
    }
    ,pulltree:function(p, ite, name) {
    	var name = ite.get('name');
    	var item = this.options.pNode.getElement("div[name="+name+"]");
    	item.pNode = item.getParent();
        var tree = pageContainer.create("SwordTree");
        this.setWidget(name, tree);
        pc.setWidget4loaddata(name, tree); //当pc.loaddata的时候会被调用
        tree.setValidate(this.Vobj);
        item.setProperty("select", "true");
        tree.initParam(item, this);
        tree.initData(item, this);
        tree.select.selBox.getParent('table').inject(p);
    }
    ,validatecode:function(p, item, name) {
        var vc = pageContainer.getValidateCode();
        vc.initParam(item);
    }
    ,userdefine:function(p, item, name) {
        if(p.getPrevious() && !$defined(item.get('caption')))p.getPrevious().destroy();
        p.setStyle("width", "");
        var div = new Element('div', {'class':'swordform_userdefine_wrap'}).inject(p);
        item.getChildren().each(function(el) {
                el.clone(true).inject(div);
                el.setStyle("display", "none");
        }.bind(this));
        div.getElements("div[type][name]").each(function(el) {
            this._parseItem(div, el);
            var newNode = div.getLast();
            el.getParent().insertBefore(newNode, el);
            el.destroy();
            newNode.setStyle("float", "left");
        }.bind(this));
        if(this.isVal() && $defined(item.get("rule"))) {
            Sword.utils.createElAfter(div);
        }
    }
    ,_parseItem:function(p, item) {
        var tag = item.get("type");
        var name = item.get("name");
        if(!$defined(tag))tag = "text";
        var vobj;
        p.store("space", this.wrapDiv);
        item.pNode = p;
        vobj = this[tag](p, item, name);
        var bizrule = ($defined(item.get("biztid"))||$defined(item.get("bizctrl")));
        if($defined(vobj)) {
        	 if(Browser.Engine.trident) {//ff\ie相反的？
        		 if(Browser.Engine.trident4){
                     sword_convertHTML(vobj, item);
                     this.addFormatEvent(vobj);
                     if(!bizrule&&$defined(item.get("rule")) && item.get("rule") != ""&&tag!='select'&&tag!='date')this.Vobj._add(vobj); //select不加blur时间
        		 }else{
        			 this.addFormatEvent(vobj);
                     sword_convertHTML(vobj, item);
                     if(!bizrule&&$defined(item.get("rule")) && item.get("rule") != ""&&tag!='select'&&tag!='date')this.Vobj._add(vobj); //select不加blur时间
        		 }
                 
             } else {
                 if(!bizrule&&$defined(item.get("rule")) && item.get("rule") != ""&&tag!='select'&&tag!='date')this.Vobj._add(vobj);
                 this.addFormatEvent(vobj);
                 sword_convertHTML(vobj, item);
             }
            if(bizrule)
                vobj.addEvent('blur', function(e) {
                    var tar = new Event(e).target;
                    this.validate($(tar).get('name'));
                }.bind(this));
            if(item.get('nfidx'))this.fieldElOrderHash.set(item.get('nfidx') / 1, vobj);//自定义表单焦点转移的定义
            if(vobj.hasClass('swordform_item_oprate'))this.fieldElHash.set(item.get('name'), vobj);
            //must 输入框颜色为#b5e3df
            if(!bizrule&&$defined(item.get("rule")) && item.get("rule").contains('must')&&!(vobj.disabled || item.get('disable') == 'true'))this.getFieldEl(name).setStyle('background-color','#b5e3df');
            if(['text','textarea'].contains(tag) && (vobj.disabled || item.get('disable') == 'true')) this.disable(name);
            if(item.get("show")=="false")vobj.setStyle("display","none");
        }
    },
    bizValidate:function(tar) {
        var rule = tar.get("rule");
        if(rule) {
            if(!this.Vobj.validate(tar))return;
        }
        if(!$defined(tar.get('value')))return;
        var req = this.getReq({
            'tid':tar.get('biztid'),
            'ctrl':tar.get('bizctrl'),
            'widgets':[this.getSubmitData()]
        });
        var valRes;
        pc.postReq({
            'async':false,
            'req':req
            ,'onSuccess':function(res) {
                if(res.success) {
                    valRes = true;
                    tar.removeClass("invalid");
                    this.Vobj.intimeValidate_Biz(tar, res.valiMsg || "校验成功!", true);
                } else {
                    valRes = false;
                    tar.addClass("invalid");
                    this.Vobj.intimeValidate_Biz(tar, res.valiMsg || "校验失败!", false);
                }
            }.bind(this)
            ,'onError':function() {
                valRes = false;
                if(this.options.vType == "elafter") {
                } else {
                }
            }
        });
        return valRes;
    },
    getExtraAtt:function() {
        return this.item.trs.flatten().filter(function(item) {
            return (!this.defAtts.contains(item.name));
        }, this);
    },
    createConsole:function(p) {
        var ct = new Element('div', {'class':'swordform_btns_ct'}).inject(p, 'bottom');
        var btns = new Element('div', {'class':'swordform_panel_btns swordform_panel_btns_center'}).inject(ct);
        var table = new Element('table', {'cellspacing':'0'}).inject(btns);
        var tbody = new Element('tbody').inject(table);
        return  new Element('tr').inject(tbody);
    },
    createButton:function(p, item) {
        var td = new Element('td', {'class':'swordform_panel_btn_td'}).inject(p);
        var table = new Element('table', {'class':'swordform_btn_wrap swordform_btn','styles':{'width':'75px'},'cellspacing':'0','cellpadding':'0','border':'0'}).inject(td);
        var tbody = new Element('tbody').inject(table);
        var tr = new Element('tr').inject(tbody);
        var tdL = new Element('td', {'class':'swordform_btn_left','html':'<i>&nbsp;</i>'}).inject(tr);
        var tdC = new Element('td', {'class':'swordform_btn_center'}).inject(tr);
        var em = new Element('em').inject(tdC);
        var button = new Element('button', {'class':'swordform_btn_text',
            'tid':item.get('tid'),
            'ctrl':item.get('ctrl'),
            'click':item.get('onClick'),
            'onClickBefore':item.get('onClickBefore'),
            'onClickAfter':item.get('onClickAfter'),
            'console':item.get('console'),
            'isRedirect':item.get('isRedirect'),
            'notClearProperties':item.get('notClearProperties')
        }).inject(em).appendText(item.getAttribute('caption'));
        button.set({
            'events':{
                'mouseover':function(e) {
                    var table = new Event(e).target.getParent(".swordform_btn_wrap");
                    table.addClass('swordform_btn_over');
                },
                'mouseout':function(e) {
                    var table = new Event(e).target.getParent(".swordform_btn_wrap");
                    table.removeClass('swordform_btn_over');
                }
            }
        });
        button.addEvent('click', function(e) {
            var b = new Event(e).target;
            var before = b.get('onClickBefore');
            var click = b.get('click');
            var after = b.get('onclickAfter');
            if($defined(before))
                this.getFunc(before)[0]();
            if($defined(click) && $chk(click) && b.get('console') != 'reset') {
                if($defined(click))this.getFunc(click)[0]();
                if($defined(after))this.getFunc(after)[0]();
            } else {
                if(b.get('console') == 'submit') {
                    if(!this.validate())return;
                    var req = this.getReq({'tid':b.get('tid'),'ctrl':b.get('ctrl'),'widgets':[this.getSubmitData()]});
                    if(this.hasFile && b.get('isRedirect') != "false") {
                        var cmit = this.getUploadCommit().initParam({'postData':req});
                        cmit.commit();
                    } else {
                        pc.postReq({
                            'req':req
                            ,'onSuccess': function(res) {
                                if(after) {
                                    this.getFunc(after)[0](req, res);
                                }
                            }.bind(this)
                            ,'onError':function(res) {
                                if(after) {
                                    this.getFunc(after)[0](req, res);
                                }
                            }.bind(this)
                        });
                    }
                } else if(b.get('console') == 'reset') {
                    var ncps = b.get("notClearProperties");
                    this.reset(ncps);
                    if($defined(after))this.getFunc(after)[0]();

                } else {
                    if($defined(click))this.getFunc(click)[0]();
                    if($defined(after))this.getFunc(after)[0]();
                }
            }
        }.bind(this));
        new Element('td', {'class':'swordform_btn_right','html':'<i>&nbsp;</i>'}).inject(tr);
    }
    ,renderForm:function(el,data){
    	SwordForm_Template.realRender(el||this.options.pNode,this,(data||{"data":{}}).data);//html渲染和数据处理一起处理
    	//todo 临时注册在这里
    	this.initEventForPanel();
    	this.fieldElHash.getKeys().each(function(item){
    		var idEl=$(item),name=idEl.get("name"),widget=idEl.get("widget");
    		this.fieldElHash.set(item,idEl);
    		if(widget){
    			var tInitW=pc.formItems[widget]?pc.formItems[widget].initWidget:null;
    			if(tInitW)tInitW(name,idEl,this);
    		}
    	}.bind(this));
    	this.fireEvent("onFinish", data);
    }
    ,initData:function(d) {
    	if(!$chk(d)||!d.data) {
            return;
        }
    	this.fieldElHash.getKeys().each(function(item){
    		var idEl=$(item),name=idEl.get("name"),elData=d.data[name];
    		if(elData){
    			this.setValue(name, elData.value);
    		}
    	}.bind(this));
    },
    getSubmitData:function() {
        var re = {
            'beanname':this.options.beanname,
            'sword':this.options.sword,
            'name' :this.options.name,
            'data' :{}
        };
        var itms = this.getFieldEls();
        itms.each(function(item) {
            if(item.get('widgetGetValue') == 'true') {
                re['data'][item.get('name')] = {'value':this.getWidget(item.get('name')).getValue(item) || ""};
            } else if(item.get("widget") == "select") {
                re['data'][item.get('name')] = {'value':item.get("realvalue") || ""};
            } else {
                re['data'][item.get('name')] = {'value':item.get('realvalue') || item.get('value')};
            }
        }, this);
        return re;
    },
    getGridData:function(gridname) {
        var re = {
            'beanname':this.options.beanname,
            'sword':'SwordGrid',
            'name' :gridname || '',
            'trs' :[
                {
                    'tds':this.getSubmitData().data
                }
            ]
        };

        return re;
    },
    getFormData:function() {
        var data = this.getSubmitData().data;
        var hash = new Hash();
        for(var d in data) {
            hash.include(d, data[d].value);
        }
        return hash;
    },
    validate:function(name) {
        var oprates = $chk(name) ? [this.getFieldEl(name)] : this.getFieldEls();
        var res = true,ol=oprates.length;
        for(var i = 0; i < ol; i++) {
            if($defined(oprates[i].get('rule'))) {
                if(!this.Vobj.validate(oprates[i])) {
                    res=false;
                }
                /*if($defined(oprates[i].get('biztid')) || $defined(oprates[i].get('bizctrl'))) {
                    if(res&&!this.bizValidate(oprates[i])) {
                        res = false;
                    }
                }*/
            } /*else if($defined(oprates[i].get('biztid')) || $defined(oprates[i].get('bizctrl'))) {
                if(!this.bizValidate(oprates[i])) {
                    res = false;
                }
            }*/
            if(!res){
                try {
                    if(!$chk(name))oprates[i].focus();
                    if((oprates[i].get('readonly')||item.getAttribute("readonly")) && (Browser.Engine.trident4 || Browser.Engine.trident5)) {
                        $(document.body).scrollTo(0, oprates[i]._getPosition().y - 20);
                    }
                } catch(e) {
                }
                break;
            }
        }
        return res;
    },
    getField:function(name) {
            return this.getWidget(name)||this.getFieldEl(name);
    },
    getFieldEl:function(name) {//增加需要调用set
    	var id=this.options.name+"_"+name;
        return this.fieldElHash.get(id)||this.fieldElHash.getValues().filter(function(item){ return item.get("name")==name;})[0];
    },
    destroyFieldEl:function(name) {//从form中删掉某个元素，必须调用此接口
        if(!$defined(name))this.fieldElHash.empty();
        name = $splat(name);
        name.each(function(n) {
            this.fieldElHash.erase(n);
        }.bind(this));
    },
    getFieldEls:function() {
        return this.fieldElHash.getValues();//this.options.pNode.getElements(".swordform_item_oprate");
    },
    getFieldElNames:function() {
        return this.fieldElHash.getKeys();//this.options.pNode.getElements(".swordform_item_oprate").get('name');
    },
    nextFocus:function(e) {
        e = Event(e);var tType=$(e.target).type;
        if((e.key == 'enter'&& tType!= 'textarea') || (e.key == "esc" && tType == 'textarea')) {
        	var name = e.target.get("name");
            if(this.options.valfocus=="false"){
        		var rule = e.target.get("rule");
	    		if($chk(rule)){
                	var tag = this.validate(name);
                	if(!tag){
                		(function(){e.target.focus();}).delay(1);
                   	 	return;
                	}
        		}
    		}
            var tar = null;
            if(this.options.userDefine != "true") {
                var idx = e.target.getParent(".swordform_item_div").getAttribute("idx").toInt() + 1;
                var div = null;
                while(tar == null) {
                    try {
                        div = this.options.pNode.getElements(".swordform_item_div[idx='" + (idx) + "']")[0];
                        if(!div)return;
                        tar = div.getElement(".swordform_item_oprate");
                        if(!this.focusable(tar))tar = null;
                        idx++;
                    } catch(e) {
                        break;
                    }
                }
            } else {
               /* var nfidx = this.fieldElOrderHash.keyOf(this.getFieldEl(name)) / 1;//自定义表单焦点转移的定义
                var size = this.fieldElOrderHash.getKeys().length;
                if(nfidx && nfidx != size) {
                    while(nfidx != null && tar == null) {
                        tar = this.fieldElOrderHash.get(nfidx + 1);
                        if(!this.focusable(tar))tar = null;
                        if(nfidx == size - 1)nfidx = null; else nfidx++;
                    }
                } else {*/
            		var id=this.options.name+"_"+name;
                    var ops = this.getFieldEls(),opsl=ops.length;
                    var idx = this.getFieldElNames().indexOf(id) + 1;
                    while(idx != opsl&& idx != null && tar == null) {
                        tar = ops[idx];
                        if(['radio','checkbox'].contains(tar.get("type")))
                        	tar = tar.getElements("input")[0];
                        if(!this.focusable(tar))tar = null;
                        if(idx == ops.length - 1)idx = null; else idx++;
                    }
               /* }*/
            }
            if($defined(tar)) {
            	(function(){tar.focus();tar.focus();}).delay(1);
            } else {
            	if($chk(this.options.noNextEvent)){
	            	this.getFunc(this.options.noNextEvent)[0]();
	            }else{
	            	$(e.target.get("id")).blur();
	            }
            }
        }
        if(e.key == 'left' || e.key == 'right'){
        	var el=$(e.target);
    		var divEl=el.getParent(),pEl=divEl.getParent(),cssKey="input";
    		if(el.get("type") == "checkbox"){
        		if(e.key == 'left'){
        			var t=divEl.getPrevious()?divEl.getPrevious().getElement(cssKey):null;
        			if(t){t.focus();}
        			else{
        				t=pEl.getLast().getElement(cssKey);
        				if(t)t.focus();
        			}
        		}
        		if(e.key == 'right'){
        			var t=divEl.getNext()?divEl.getNext().getElement(cssKey):null;
        			if(t){t.focus();}
        			else{
        				t=pEl.getFirst().getElement(cssKey);
        				if(t)t.focus();
        			}
        		}
    		}
    	}
    },
    isHide:function(el) {
        return el.getHeight() == 0 && el.getWidth() == 0;
    },
    focusable:function(tar) {
        return !(this.isHide(tar) || tar.get('disabled') || tar.get('readonly') || tar.get('_show') == 'false' || ['file','hidden'].contains(tar.get('type')) || !['input','textarea','file'].contains(tar.get('tag')));
    },
    toggleBlock:function(name) {
        var block = this.options.pNode.getElements(".swordform_block[name='" + name + "']")[0];
        if($defined(block)) {
            if(block.getStyle("display") == "none")block.setStyle("display", "");
            else block.setStyle("display", "none");
        }
    },
    hideBlock:function(name) {
        var block = this.options.pNode.getElements(".swordform_block[name='" + name + "']")[0];
        if($defined(block))block.setStyle("display", "none");
    },
    showBlock:function(name) {
        var block = this.options.pNode.getElements(".swordform_block[name='" + name + "']")[0];
        if($defined(block))block.setStyle("display", "");
    },
    unDisplayItem:function(names) {
        if($type(names) == 'string')names = [names];
        names = names || [];
        names.each(function(name, index) {
            var field = this.getFieldEl(name);
            if($defined(field) && (field.get('_show') == 'true' || !field.get('_show'))) {
                field.set('_show', 'false');
                var div = field.getParent("div.swordform_item_div");
                if(div) {
                    if(div.getParent().getChildren().length == 1) {
                        div.getParent().setStyle('display', 'none');
                    }
                    div.setStyle('display', 'none');
                    this.reSizeRow(div.getParent());
                }
                //userdefine="true",只是将input隐藏
                else {
                    if(field.getParent("table.swordform_field_wrap"))
                        field.getParent("table.swordform_field_wrap").setStyle('display', 'none');
                }
            }
        }.bind(this));
    },
    displayItem:function(names) {
        if($type(names) == 'string')names = [names];
        names = names || [];
        names.each(function(name, index) {
            var field = this.getFieldEl(name);
            if($defined(field) && (field.get('_show') == 'false' || !field.get('_show'))) {
                field.set('_show', 'true');
                field.setStyle('display', '');
                var div = field.getParent("div.swordform_item_div");
                if(div) {
                    if(div.getParent().getChildren().length == 1) {
                        div.getParent().setStyle('display', '');
                    }
                    div.setStyle('display', '');
                    this.reSizeRow(div.getParent());
                }
                //userdefine="true",只是将input隐藏
                else {
                    if(field.getParent("table.swordform_field_wrap"))
                        field.getParent("table.swordform_field_wrap").setStyle('display', '');
                }
            }
        }.bind(this));
    }
    ,setValue:function(itemName, value) {
    	var idEl=$(this.options.name + '_' + itemName),widgetType=idEl.get("widget")||idEl.get("type");
    	var nfs=["label","text","date","select","pulltree","radio","checkbox"];
    	var realvalue=value,showvalue=value;
    	if(nfs.contains(widgetType)){
    		var t={radio:null,checkbox:null,pulltree:null,text:"format",label:"format",select:"sbmitcontent",date:"submitDateformat"};
    		var fKeyS=t[widgetType],fvStr=idEl.get(fKeyS);
    		if(fKeyS===null){
    			var values=value?value.split(","):[];
    			if(widgetType=="pulltree"){
    				var checkPath="",codePath="",code="";
    				if(value){
    					if (value.contains("code") && value.contains("caption")) {
    						if (value.contains('checkPath') || value.contains(";")) {
    							var varray = value.split(";");
    							var codeArray="",capArray="",checkArray="";
    							varray.each(function(v, index) {
    									var vs = v.split('|');
    									if (index != 0) {
    										codeArray = codeArray + vs[1].split(':')[1]+ ",";
    										capArray = capArray + vs[0].split(':')[1]+ ",";
    										checkArray = checkArray+ vs[2].split(':')[1] + "|";
    									} else {
    										codeArray = vs[1].split(':')[1] + ",";
    										capArray = vs[0].split(':')[1] + ",";
    										checkArray = vs[2].split(':')[1] + "|";
    									}
    							});
    							showvalue= codeArray.substring(0, codeArray.length - 1);
    							realvalue= capArray.substring(0,capArray.length - 1);
    							checkPath= checkArray.substring(0,checkArray.length - 1);
    						} else {
    							var vs = value.split('|');
    							if (value.contains('codePath')) {
    								codePath=vs[2].substring('codePath,'.length);
    							}
    							showvalue= vs[1].split(',')[1];
    							realvalue= vs[0].split(',')[1];
    						}
    					} else {
    						var vs = value.split(',');
    						var Captionvalue = [];
    						var initData =pageContainer.getInitData(itemName);
    						if ($chk(initData)) {
    							vs.each(function(v) {
    								initData.data.each(function(el) {
    									if ((el.code || el.CODE) == v) {
    										Captionvalue.include((el.caption || el.CAPTION));
    									}
    								});
    							});
    						}
    						realvalue = vs.join(",");
    						showvalue = Captionvalue.join(",");
    					}
    					code=realvalue;
    					idEl.set({"code":code,"checkPath":checkPath,"codePath":codePath});
    				}
    			}else{//radio,checkbox
    				var els=idEl.getElements(".formselect-list-item");
    				els.each(function(itemEl){
    					var inputEl=itemEl.removeClass("formselect-selected").getElement("input");
    					inputEl.set("checked",false);
    					var curCode=itemEl.get("code");
    					if(values.contains(curCode)){inputEl.set("checked",true);}
    				});
    				return;
    			}
    		}else if(fKeyS=="format"){//text,label
    			if(fvStr)showvalue=sword_fmt.formatText(idEl, value, '', fvStr).value;
    			if(widgetType=="label"){idEl.set("text",realvalue);}
    		}else if(fKeyS=="submitDateformat"){//date
    			if(fvStr)realvalue=SwordDataFormat.formatStringToString(value, idEl.get("dataformat")||"yyyy-MM-dd", fvStr);
    		}else{//select
    			var dataname=idEl.get("dataname"),codeSign=idEl.get("codeSign")||'code',captionSign=idEl.get("captionSign")||'caption',
    			dataObj= pc.getInitDataByDataName(dataname),datasA,sDObj;
	       		 if(dataObj&&dataObj.data){
	       			 datasA=dataObj.data;
	       			 sDObj=datasA.filter(function(item){return item[codeSign]==value;})[0];
	       		 }else{
	       			 datasA=$$("div[name='"+idEl.get("name")+"'][type]")[0].getChildren(">div");
	       			 sDObj=datasA.filter(function(item){return item.get(codeSign)==value;})[0];
	       			 if(sDObj){sDObj={};sDObj[codeSign]=sDObj.get(codeSign);sDObj[captionSign]=sDObj.get(captionSign);}
	       		 }
	       		 if(sDObj){
	       			 showvalue=sDObj.caption,code=realvalue=sDObj.code;
	       			 idEl.set("code",code);
	       			 var inputd=idEl.get("inputdisplay");
	       			 if(fvStr){
	           			 realvalue=fvStr.substitute(sDObj);
	           		 }
	           		 if(inputd){
	           			 showvalue=inputd.substitute(sDObj);
	           		 }
	       		 }
    		}
    		idEl.set({"realvalue":realvalue,"value":showvalue});
    	}else{
    		idEl.set({"realvalue":value,"value":value});//file2 todo
    	}
        /*var em = this.getFieldEl(itemName);
        if(!$defined(em))return;
        if(['true','select','tree','radio','checkbox','calendar','textarea'].contains(em.get('widget'))) {
            if(em.get('widget') == 'tree') {
                if(value.contains("code") && value.contains("caption")) {
                	if(value.contains(";") || value.contains("checkPath")){
                		var varray = value.split(";");
                		var codeArray;
                		var capArray;
                		var checkArray;
                		varray.each(function(v,index){
                			var vs = v.split('|');
                			if(index == 0){
                				codeArray = vs[1].split(':')[1] + ","
                				capArray = vs[0].split(':')[1] + ",";
                				checkArray = vs[2].split(':')[1] + "|";
                			}else{
                				codeArray = codeArray + vs[1].split(':')[1] + ",";
                				capArray = capArray + vs[0].split(':')[1] + ",";
                				checkArray = checkArray + vs[2].split(':')[1] + "|";
                			}
                			
                		});
                		 em.set('value', codeArray.substring(0,codeArray.length-1));
                         em.set('realvalue', capArray.substring(0,capArray.length-1));
                         em.set('checkPath',checkArray.substring(0,checkArray.length-1));
                	}else{
                		  var vs = value.split('|');
                          if(value.contains('codePath')) {
                              //懒加载树的反显路径
                              em.set('codePath', vs[2].substring('codePath,'.length));
                          }
                          em.set('value', vs[1].split(',')[1]);
                          em.set('realvalue', vs[0].split(',')[1]);
                	}
//                    var vs = value.split('|');
//                    if(value.contains('codePath')) {
//                        //懒加载树的反显路径
//                        em.set('codePath', vs[2].substring('codePath,'.length));
//                    }
//                    em.set('value', vs[1].split(',')[1]);
//                    em.set('realvalue', vs[0].split(',')[1]);
                } else {
                    var tr = this.getWidget(em.get('name'));
                    var vs = value.split(',');
                    tr.select.show();
                    tr.select.hide();
                    var node = [];
                    vs.each(function(v) {
                        var query = new Hash();
                        query.set(tr.options.cascadeSign.id, v);
                        var findNode = tr.getTreeNode(query);
                        if($chk(findNode)){
                        	node.include(findNode);
                        }
                    });
                    if(node) {
                        tr.setSelectedNode(node);
                    } else {
                        tr.setSelectValue(d.data[em.get('name')].value);
                    }
                }
            } else {
            	this.templateObj[em.get('widget')].initData(em, value, this);
            }
        } else {
        	if(em.get("placeholder") == "true"){
        		if($chk(value) && value != em.get("defvalue")){
        			if(em.get('tag') == "label"){
        				em.set({'text':value,'value':value});
        			} else {
        				em.set('value', value);
        			}
        			em.removeClass("swordform_item_input_placeholder");
        		}else{
        			em.set("value",em.get("defvalue"));
        		}
        	}else{
        		if(em.get('tag') == "label"){
    				em.set({'text':value,'value':value,'realvalue':value});
    			} else {
    				em.set('value', value).set("realvalue",value);
    			}
        	}
        }
        //em.set('oValue', value);
        this.initFormatVal(em);*/
    }
    ,getValue:function(name) {
        /*var Field = this.getField(name);
        if(!Field) return "";//为模板模式加的语句
        if($type(Field) != 'element') {
            return Field.getValue(this.getFieldEl(name));
        }
        if(Field.get('tag').toLowerCase() == 'label')return Field.get('realvalue') || Field.get('text');
        return Field.retrieve("allDb") || Field.get('realvalue') || Field.get('value');*/
    	//@20140710
    	var idEl=$(this.options.name + '_' + name),widget=idEl.get("widget");
    	if(widget!="file2"){
    		if(widget=="radio"||widget=="checkbox"){
    			var v=[];
    			idEl.getElements(".formselect-selected").each(function(item){v.push(item.get("code"));});
    			return v.join(",");
    		}
    		return idEl.get("realvalue")||idEl.get("code")||idEl.get("value");
    	}else{
    		return "";//todo file2
    	}
    },
    getTextValue:function(name) {
        return $(this.options.name + '_' + name).value;
    },
    setTextValue:function(name, value) {
        $(this.options.name + '_' + name).value = value;
    },
    reSizeRow:function(row) {
        if(!$defined(row))return;
        var oh = row.getHeight();
        var h = 0;
        row.getElements(".swordform_item_table").each(function(el) {
            var teph = el.getSize().y;
            if(h == 0)
                h = teph;
            else
                h = (h < teph) ? teph : h;
        });
        if(h > oh)row.setStyle('height', h);
    },
    clearField:function(name) {
        var item = this.getFieldEl(name);
        if(!$defined(item))return;
        if(item.get('widget') == "true" || item.get('widget') == "calendar") {
            var obj = this.getWidget(name);
            if($defined(obj) && $defined(obj.reset)) {
                obj.reset();
            } else {
                item.set('value', '');
                if(item.getAttribute('realvalue')) {
                    item.set("code", "");
                    item.set('realvalue', '');
                    item.set('oValue', '');
                }
                if(item.get('oValue'))item.set('oValue', '')
                this.Vobj.clearElTip(item);
            }
        } else {
            if(item.retrieve('allDb'))item.store('allDb', null);
            item.set('value', '');
            if(item.getAttribute('realvalue')) {
                item.set("code", "");
                item.set('realvalue', '');
                item.set('oValue', '');
            }
            this.Vobj.clearElTip(item);
        }
    },
    reset : function(ncps, nohidden) {
    	ncps = ncps || [],isNH=nohidden===true;
    	var els=this.getFieldEls();
    	els.each(function(item){
    		var type=item.get("type"),name=item.get("name");
    		if(isNH&&type=="hidden"){
    			return;
    		}else{
    			if(ncps.indexOf(name)==-1){//如果没有找到定义,完全清空.
    				item.set('value', '');
                    item.set('realvalue', '');
                    if(item.get('oValue')){item.set('oValue', '');}
                    if(item.get('code'))item.set("code", "");
                    if(type=="label"||type=="textarea"){
                    	item.set("text","");
                    }else if(type=="radio"||type=="checkbox"){
                    	var els=item.getElements(".formselect-list-item");
        				els.each(function(itemEl){
        					itemEl.removeClass("formselect-selected").getElement("input").set("checked",false);
        				});
                    }
                    this.Vobj.clearElTip(item);
    			}else{//找到的项按照defValue重置value
    				 var defValue = item.get("defValue");
    	             if(defValue != null){
	                	this.setValue(name, defValue);
    	             }
    	             this.Vobj.clearElTip(item);
    			}
    		}
    	}.bind(this));
        /*ncps = ncps || [];
        var match = (nohidden) ? ".swordform_item_oprate[type!='hidden']" : ".swordform_item_oprate";
        var itms = this.options.pNode.getElements(match);
        itms.each(function(item) {
            if(ncps.indexOf(item.get("name")) == -1) {
                if(item.get('widget') == "true" || item.get('widget') == 'calendar') {
                    var obj = this.getWidget(item.get("name"));
                    if($defined(obj) && $defined(obj.reset)) {
                        obj.reset();
                    } else {
                        item.set('value', '');
                        if(item.getAttribute('realvalue')) {
                            item.set("code", "");
                            item.set('realvalue', '');
                            item.set('oValue', '');
                        }
                        if(item.get('oValue'))item.set('oValue', '');
                        this.Vobj.clearElTip(item);
                    }
                } else {
                    if(item.retrieve('allDb'))item.store('allDb', null);
                    item.set('value', '');
                    if(item.getAttribute('realvalue')) {
                        item.set("code", "");
                        item.set('realvalue', '');
                        item.set('oValue', '');
                    }
                    this.Vobj.clearElTip(item);
                }
            } else {
                var defValue = item.get("defValue");
                if(defValue != null){
                	if(item.get("placeholder") == "true"){
                		item.addClass("swordform_item_input_placeholder");
                    }
                	this.setValue(item.get("name"), defValue);
                }
                this.Vobj.clearElTip(item);
            }
        }.bind(this));*/
    }
    ,resetAll : function(ncps, nohidden) {
    	ncps = ncps || [],isNH=nohidden===true;
    	var els=this.getFieldEls();
    	els.each(function(item){
    		var type=item.get("type"),name=item.get("name");
    		if(isNH&&type=="hidden"){
    			return;
    		}else{
    			if(ncps.indexOf(name)==-1){//如果没有找到定义清空,保留defvalue
    				item.set('value', '');
                    item.set('realvalue', '');
                    if(item.get('oValue')){item.set('oValue', '');}
                    if(item.get('code'))item.set("code", "");
                    if(type=="label"||type=="textarea"){
                    	item.set("text","");
                    }else if(type=="radio"||type=="checkbox"){
                    	var els=item.getElements(".formselect-list-item");
        				els.each(function(itemEl){
        					itemEl.removeClass("formselect-selected").getElement("input").set("checked",false);
        				});
                    }
                    this.Vobj.clearElTip(item);
                    var defValue = item.get("defValue");
   	             	if(defValue != null){
	                	this.setValue(name, defValue);
   	             	}
   	             	this.Vobj.clearElTip(item);
    			}
    		}
    	}.bind(this));
       /* ncps = ncps || [];
        var match = (nohidden) ? ".swordform_item_oprate[type!='hidden']" : ".swordform_item_oprate";
        var itms = this.options.pNode.getElements(match);
        itms.each(function(item) {
            if(ncps.indexOf(item.get("name")) == -1) {
                if(item.get('widget') == "true" || item.get('widget') == "calendar") {
                    var obj = this.getWidget(item.get("name"));
                    if($defined(obj) && $defined(obj.reset)) {
                        if(item.getElement("div[defvalue]"))return;//radio.checbox有defvalue时不执行清空操作。
                        obj.reset();
                    } else {
                        item.set('value', '');
                        item.set('text', '');
                        if(item.getAttribute('realvalue')) {
                            item.set("code", "");
                            item.set('realvalue', '');
                        }
                        if(item.get('oValue'))item.set('oValue', '');
                    }
                } else {
                    if(item.retrieve('allDb'))item.store('allDb', null);
                    item.set('value', '');
                    item.set('text', '');
                    item.set('oValue', '');
                    if(item.getAttribute('realvalue')) {
                        item.set("code", "");
                        item.set('realvalue', '');
                    }
                }
                var defValue = item.get("defValue");
                if(defValue != null){
                	if(item.get("placeholder") == "true"){
                		item.addClass("swordform_item_input_placeholder");
                    }
                	 this.setValue(item.get("name"), defValue);
                }
            }
        }.bind(this));*/
    }
    ,getSubmitData4Grid:function() {
        var re = {
            'beanname':this.options.beanname,
            'sword':this.options.sword,
            'name' :this.options.name,
            'data' :{}
        };
        var itms = this.getFieldEls();
        itms.each(function(item) {
            if(item.get('widgetGetValue') == 'true') {
                re['data'][item.get('name')] = {'value':this.getWidget(item.get('name')).getValue(item)};
            } else {
                re['data'][item.get('name')] = {'value': item.get('value')};
            }
        }, this);
        return re;
    },
    //给对象增加format的处理
    //oValue:用户输入的最原始的值
    //realvalue:用户所需要提交的值的格式
    //value:用户需要显示出来的格式的值
    //showformat:用户定义显示的format
    //submitformat:用户定义需要提交的format
    //format:如果只定义了format属性，则表示提交的值默认是用户输入的值
    addFormatEvent:function(el) {
        if(!$defined(el))return;
        //目前暂时只支持以下二种类型
        if(el.get('tag') == "label" || (el.get('tag') == 'input' && el.get('type') == 'text')) {
        } else {
            return;
        }
        if(!el.get('format') && !el.get('submitformat') && !el.get('tipTitle'))return;
//        this.initFormatVal(el);
        if(el.get('tag') == 'label')return;
        el.addEvents({
            'focus':function() {
                if(el.get('tag') == 'label')
                    el.set('text', el.get('oValue'));
                else 
                	 el.set('value', el.get('oValue'));
            }.bind(this),
            'blur':function() {
                if(el.get('tipTitle'))this.tooltips.hide(el.get('name'));
                var oval = (el.get('tag') == 'label') ? el.get('text') : el.get('value');
                el.set('oValue', oval);
                el.set('realvalue', oval);
//                this.initFormatVal(el);
                var tag = this.validate(el.get('name'));
                if(tag == true){
               	 this.initFormatVal(el);
               }
            }.bind(this)
        });
    },
    //初始化format的值
    initFormatVal:function(el) {
        if(!el.get('format') && !el.get('submitformat')) {
            return;
        } else {
        	el.set('oValue', (el.get('tag') == 'label') ? el.get('text') : el.get('value'));
            el.set('realvalue', this.getFormatVal(el, "submitformat"));
            el.set(((el.get("tag") == "label") ? "text" : "value"), this.getFormatVal(el));
        }
    },
    //获取fomat之后的值
    getFormatVal:function(el, bz) {
        var format = el.get(bz);
        if(!$defined(bz))format = el.get("format");
        if(!$defined(format))return el.get("oValue");
        return sword_fmt.formatText(el, (el.get('tag') == 'label') ? el.get('text') : el.get('value'), '', format).value;
    },
    //暂时取消验证
    cancelVal:function() {
        this.Vobj.cancelV();
    },
    //激活验证
    activeVal:function() {
        this.Vobj.activeV();
    },
    /**
     * 删除指定标识的select的选项数据
     * @name select的标识name的值
     */
    deleteSelectOptions:function(name) {
        var selInput = this.getFieldEl(name);
        if($chk(selInput.get('dataname')))
            pc.deleteDataByDataName(selInput.get('dataname'));
        if($chk(selInput.get('name')))
            pc.deleteDataByWidgetName(selInput.get('name'));
        var ca = this.getWidget(name).CacheData;
        if(ca && ca.has(name))ca.erase(name);
    },
    disable:function(names) {
        if($type(names) == 'string')names = [names];
        names = names || [];
        //没有参数，默认全部
        if(names.length == 0) {
            names = this.getFieldElNames();
        }else{
        	var fName=this.options.name;
        	names=names.map(function(item){return fName+"_"+item;});
        }
        names.each(function(name, index) {
        	var el=$(name),nameStr=el.get("name"),widgetType=el.get("widget")||el.get("type"),tsType=["pulltree","file2","radio","checkbox"];
        	if(tsType.contains(widgetType)){
        		if(widgetType=="radio"||widgetType=="checkbox"){
        			el.set("disabled","true").getElements("input").each(function(item){item.set("disabled","true");});
        		}else if(widgetType=="pulltree"){
        			var cObj=this.getField(nameStr);
        			if(cObj.select)cObj.select.disable(el);
        		}else{
        			
        		}
        	}else{
            	el.set("disabled","true").addClass('swordform_item_input_disable').setStyle('background-color','')
        	}    
        }.bind(this));
    },
    
    enable:function(names) {
        if($type(names) == 'string')names = [names];
        names = names || [];
        //没有参数，默认全部
        if(names.length == 0) {
            names = this.getFieldElNames();
        }else{
        	var fName=this.options.name;
        	names=names.map(function(item){return fName+"_"+item;});
        }
        names.each(function(name, index) {
        	var el=$(name),nameStr=el.get("name"),rule=el.get("rule"),widgetType=el.get("widget")||el.get("type"),tsType=["pulltree","file2","radio","checkbox"];
        	if(tsType.contains(widgetType)){
        		if(widgetType=="radio"||widgetType=="checkbox"){
        			el.erase("disabled").getElements("input").each(function(item){item.erase("disabled","true");});
        		}else if(widgetType=="pulltree"){
        			var cObj=this.getField(nameStr);
        			if(cObj.select)cObj.select.enable(el);
        		}else{
        			
        		}
        	}else{
            	el.erase("disabled").removeClass('swordform_item_input_disable');
            	if(rule&&rule.contains('must')){
            		el.setStyle('background-color','#b5e3df');
            	}
        	}
           /* var w = this.getWidget(name);
            if($defined(w)) {
                if($defined(w.enable))w.enable(this.getFieldEl(name));
                if($type(w) == 'SwordTree' && $defined(w.select.enable))w.select.enable(this.getFieldEl(name));
                if($chk(w.box) && w.box.type == 'textarea'){
                	w.box.erase('disabled').removeClass('swordform_item_input_disable');
                		if($defined(w.box.get("rule")) && w.box.get("rule").contains('must'))w.box.setStyle('background-color','#b5e3df');
                	}
            } else {
            	var field = this.getFieldEl(name)
                field.erase('disabled').removeClass('swordform_item_input_disable');
                if(!field.get('bizrule')&&$defined(field.get("rule")) && field.get("rule").contains('must'))field.setStyle('background-color','#b5e3df');
            }*/
        }.bind(this));
    }
    ,cellTip:function(input, name) {
//        if($chk(input.get('tipTitle'))) {
//            if(!this.tooltips.get(name)) {
//                this.tooltips.createTip({
//                    divId : name,
//                    message : input.get('tipTitle'),
//                    width:'200px',
//                    'z-index':200
//                });
//                this.tooltips.getCont(name).addEvent("click", function(e) {
//                    this.tooltips.hide(name);
//                }.bind(this));
//            }
//        }
    }
    ,showTip:function(name, input) {
        if($chk(input.get('tipTitle')))
            this.tooltips.show(name, input, {'flag':'top','className':'warning','autoHidden':false});
    }
    ,initEventForPanel:function(){
    	if(this.options.panel == 'true') {
   		 var tog = this.options.pNode.getElement("div.x-tool");
   		 tog.addEvent('click', function(e){
   			 var tar = new Event(e).target;
                this.toggleFormDisplay(tar);
	            }.bind(this));
        }
    }
    /*
     *此注册事件专供pageContainer组件调用
     *给模板引擎渲染的元素添加事件 
     */
    ,initEventForTemplate:function(){
    	/*
    	 *第一步，给所有元素注册基本事件  focus,blur,validate(rule),format(format,submitformat),
    	 *第二步，根据元素特定类型注册独有事件textarea,file,radio,checkbox,date,select,pulltree 
    	 */
    	this.initEventForPanel(); 
    	this.addEventForElType();
    	this.addEventForAllEl();
    }
    ,addEventForAllEl:function(inputEl){
    	if(!$chk(inputEl)){
	    	this.getFieldEls().filter(
	                function(el) {
	                    return (el.get("tag").toLowerCase() != "textarea");
	                }).addEvent('keyup', this.nextFocus.bind(this));
	    	this.getFieldEls().each(function(el) {   
	    		if(el.get("type") == "text"){
	    			el.addEvent('focus', function() {
	    				el.select();
	    	        	this.showTip(el.get("name"), el);
	    	        }.bind(this));
	    		}
	    		this.allElEvent(el);
	    	}.bind(this)); 
    	}else{
    		if(inputEl.get("tag").toLowerCase() != "textarea")inputEl.addEvent('keyup', this.nextFocus.bind(this));
    		this.allElEvent(inputEl);
    	}
    }
    ,allElEvent:function(el){
    	var tag = el.get("tag");
		var input=tag=="input"||el.get("tag")=="textarea"?el:el.getElement("input");
		if(input&&tag!='select'&&tag!='date'&&$chk(el.get("rule")))this.Vobj._add(el);
		var bizrule = ($defined(el.get("biztid"))||$defined(el.get("bizctrl")));
		if(bizrule)el.addEvent('blur', function(e) {
            var tar = new Event(e).target;
            this.validate($(tar).get('name'));
        }.bind(this));
		this.addFormatEvent(el);
	}
    ,addEventForElType:function(inputEl){
    	if(!$chk(inputEl)){
	    	var opras = this.getFieldEls();
	    	opras.each(function(el){
	    		this.addTypeEventEl(el);
	    	}.bind(this));
    	}else{
    		this.addTypeEventEl(inputEl);
    	}
    }
    ,addTypeEventEl:function(el){
    	var widgetStr=el.get("widget")||el.get("type");
    	if(widgetStr!="hidden")
		this.templateObj[widgetStr].addEvent(el.getParent(),el,this);
    }
    ,addInitWidget:function(name){
    	var el = this.getFieldEl(name);
    	var widgetStr=el.get("widget")||el.get("type");
    	if(this.templateObj[widgetStr]){
    		return this.templateObj[widgetStr].initWidget(name,this,el);
    	}
    }
    ,setSRang4El:function(el){
    	var range = el.createTextRange(),vl=el.get("value").length;  
        range.collapse(true); 
        range.moveEnd('character', vl); 
        range.moveStart('character', 0); 
        range.select();
    }
});
