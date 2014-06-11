if(!Sword) {
    var Sword = {};
}
Sword.utils = {

    setWidth:function(userW,parentUserSize,tableEl,inputEl,hasImg){  //tableEL 是容器元素，不一定是table；inputEl是输入元素，不一定是input
    	if (hasImg===true)inputEl.addClass('swordform_item_input_plusImg');
        var w;
        if ($defined(userW)) {
             w=userW;
        }else if(parentUserSize&&parentUserSize.FiledWidth){
             w=parentUserSize.FiledWidth;
        }else {  //没定义
            return;
        }

        if ((''+w).contains('%')) {
            tableEl.setStyle('width', w);
            inputEl.setStyle('width', '100%');
        } else {   //px
            tableEl.setStyle('width', 'auto');
            if (hasImg===true)w = (''+w).toInt() - 17 + 'px';
            inputEl.setStyle('width', w);
        }
    },

    parseCss:function(css,vobj){
        var userW;
        if(css) {
            if(vobj){
            	if(Browser.Engine.trident4&&css.indexOf('text-align:right')!=-1&&css.indexOf('padding-right')==-1)css = css+" ;padding-right:2px;";  //IE6下数字居右光标出不来
            	vobj.set("style", css);}
            if(css.indexOf('width')!=-1)userW =new Element('div').set('html',"<div style='"+css+"'></div>").getFirst().getStyle('width'); //todo
        }
        return userW;
    },

    createTable: function(obj,hasImg,inject){
        var table = $(document.createElement("table"));
        table.set('cellpadding', 0);
        table.set('cellspacing', 0);
        table.addClass('swordform_field_wrap');
        var tb = document.createElement("tbody");
        var tr = document.createElement("tr");
        obj.boxtd = $(document.createElement("td"));
        obj.boxtd.name = 'boxtd';
        obj.boxtd.addClass('boxtd');
        tr.appendChild(obj.boxtd);
        if (hasImg === true) {
            obj.imgtd = $(document.createElement("td"));
            obj.imgtd.name = 'imgtd';
            obj.imgtd.width = '17px';
            if(Browser.Engine.version <= 5){
            	obj.imgtd.set('html','<div style="width:17px;display:none;"></div>');
            }else{
            	 obj.imgtd.set('html','<div style="width:17px;visibility:hidden;"></div>');    //为了在页面变小的时候，有个元素，会撑住td，否则，td会被盖住
            }
            tr.appendChild(obj.imgtd);
        }
        tb.appendChild(tr);
        table.appendChild(tb);
        if(inject===true)table.inject(obj.options.pNode);
        return table;
    }
    ,createElAfter:function(root,input){
        var wrapDiv = new Element(root.get('tag')=='tr'?'td':'div', {'class':'swordform_field_valiwrap','styles':{'display':'none'}})
                .inject(root);
        if(input)input.valWrapDiv = wrapDiv;
        new Element('div', {'class':'swordform_fieldimg_nomal','styles':{'float':'left'}}).inject(wrapDiv);
        new Element('div', {'name':'msgText','styles':{'margin':'0 2px 0 17px','text-align':'left'}}).inject(wrapDiv);
        return wrapDiv;
    }
    ,getRootPath: function(){
    	var location=document.location;

    	if ("file:" == location.protocol){
    		var str = location.toString();
    		return str.replace(str.split("/").reverse()[0], "");
    	}

    	var pathName=location.pathname;
    	if(pathName.substring(0,1)!="/")pathName = "/" + pathName;
    	pathName = pathName.split("/");

    	return location.protocol+"//"+location.host+"/"+pathName[1]+"/";
    }
    /*
     * len  uuid的长度
     * radix  取字符串的多少位用于产生随机码，最大为62
    */
    ,uuid: function(len, radix){
    	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    	var  uuid = [], i;
		radix = radix || chars.length;

		if (len) {
		      // Compact form
		   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		} else {
			// rfc4122, version 4 form
		    var r;

		      // rfc4122 requires these characters
		    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		    uuid[14] = '4';

		      // Fill in random data.  At i==19 set the high bits of clock sequence as
		      // per rfc4122, sec. 4.1.5
		    for (i = 0; i < 36; i++) {
		       if (!uuid[i]) {
		        r = 0 | Math.random()*16;
		          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		        }
		      }
		    }

		return uuid.join('');
    },
	valPx : function(str) {
		str = ("" + str).replace(/\s+/g, "");
		if ((str).contains('%') || str == "" || str == null || !str.toInt()) {
			str = null;
		} else {
			str = (str).contains("px") ? str : str + "px";
		}
		return str;
	}
};
Sword.utils.btn = {
    style:{
        'submitBtn':'submit_btn'
        ,'disabledBtn':'disabled_btn'
        ,'mouseMoveBtn':'mousemove_btn'
    }
    ,init:function(ele, options) {
        if(ele.disabled) {
            ele.addClass(Sword.utils.btn.style.disabledBtn);
        } else {
            ele.addClass(Sword.utils.btn.style.submitBtn);
            Sword.utils.btn.addBtnEvents(ele, options);
        }
        return ele;
    }
    ,disabled:function(ele) {
        ele.removeClass(Sword.utils.btn.style.submitBtn);
        ele.addClass(Sword.utils.btn.style.disabledBtn);
        return ele;
    }

    ,enabled:function(ele) {
        ele.removeClass(Sword.utils.btn.style.disabledBtn);
        ele.addClass(Sword.utils.btn.style.submitBtn);
        return ele;
    }

    ,addBtnEvents:function(ele, options) {
        ele.addEvent("mouseover", Sword.utils.btn.mousemove.bindWithEvent());
        ele.addEvent("mouseout", Sword.utils.btn.mouseout.bindWithEvent());
    }
    ,mousemove:function(event) {
        var target = event.target;
        if(target) {
            target.removeClass(Sword.utils.btn.style.submitBtn);
            target.addClass(Sword.utils.btn.style.mouseMoveBtn);
        }
    }
    ,mouseout:function(event) {
        var target = event.target;
        if(target) {
            target.removeClass(Sword.utils.btn.style.mouseMoveBtn);
            target.addClass(Sword.utils.btn.style.submitBtn);
        }
    }
};


/**
 * 数据迭代器
 *
 * @author Administrator
 */

Sword.utils.Iterator = new Class({

    $family: {name: 'Sword.utils.Iterator'}
    /**
     * 被迭代节点
     */
    ,node:$empty
    /**
     *
     */
    ,iterator:$empty
    /**
     * 是否末节点
     */
    ,lastSign:true
    /**
     * 数据深度
     */
    ,dataDetph:0
    ,domainData:[]

    ,initialize:function(node, depth) {

        /**
         * Abstract 由子类实现
         */
        this.iterator(node);
        if($defined(depth)) {
            this.dataDepth = depth;
        }
    }

    /**
     * 是否有子节点
     */
    ,hasChildNodes:$lambda(false)

    /**
     * 是否父节点下的最后一个节点
     */
    ,isLast:$lambda(true)

    /**
     * 获取节点属性集
     */
    ,getAttributes:$empty
    /**
     * 获取节点某一属性
     */
    ,getAttribute:$empty

    /**
     * 获取子节点集
     */
    ,getChildNodes:$empty

    ,setParentSign:function(code, pcode) {
        Sword.utils.Iterator.code = code;
        Sword.utils.Iterator.pcode = pcode;

    }
    ,getAllChildNodes:$empty
    ,getNodes:$empty

});


Sword.utils.JSONIterator = new Class({
    Extends:Sword.utils.Iterator

    /**
     * 当前指向的元素
     * @param node
     */
    ,current:null

    ,iterator:function(node) {
        this.node = node;

    }
    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }
    ,hasChildNodes:function() {

        if(this.dataDepth == 0) {
            return    this.domainData.length > 0;
        } else {
            return this.domainData.some(function(item) {
                return item[Sword.utils.Iterator.pcode] == this.node[Sword.utils.Iterator.code];
            }, this);
        }
    }
    ,setDomainData:function(data) {
        this.domainData = data;
    }

    ,getChildNodes:function() {
        var array = new Array();
        if(this.dataDepth == 0) {
            this.dataDepth++;
            if($defined(this.domainData) && this.domainData.length > 0) {
                for(var i = 0; i < this.domainData.length; i++) {
                    var tp = true;
                    for(var j = 0; j < this.domainData.length; j++) {
                        if(this.domainData[i][Sword.utils.Iterator.pcode] == this.domainData[j][Sword.utils.Iterator.code]) {
                            tp = false;
                            break;
                        }
                    }
                    if(tp) {
                        var it = new Sword.utils.JSONIterator(this.domainData[i], this.dataDepth);
                        it.setLastSign(false);
                        array.push(it);
                        it.setDomainData(this.domainData);
                    }
                }
            }
        } else {

            if($defined(this.domainData) && this.domainData.length > 0) {
                for(var i = 0; i < this.domainData.length; i++) {
                    if(this.domainData[i][Sword.utils.Iterator.pcode] == this.node[Sword.utils.Iterator.code]) {
                        var it = new Sword.utils.JSONIterator(this.domainData[i], this.dataDepth);
                        it.setLastSign(false);
                        array.push(it);

                        it.setDomainData(this.domainData);

                    }
                }
            }
            this.dataDepth++;
        }
        if(array.length > 0) {
            array[array.length - 1].setLastSign(true);
        }

        return array;
    }

    ,getAttributes:function() {

        var res = new Array();
        var attrs = new Hash(this.node);
        attrs.getKeys().each(function(item) {
            switch($type(attrs.get(item))) {
                case 'string':
                case 'number':
                case 'boolean':
                    res.push({ nodeName:item,nodeValue:attrs.get(item)});
                case false:return null;
            }
        });
        return res;
    }
    ,getAttribute:function(key) {
        if($defined(this.node)) {
            return this.node[key];
        } else {
            return null;
        }
    }

    ,isLast:function() {
        return this.lastSign;
    }

    ,getAllChildNodes:function() {
        return this.getNodes(this);
    }
    ,getNodes:function(_node) {
        var trees = [];
        if(_node) {
            var _nodes = _node.getChildNodes() || [];
            for(var k = 0; k < _nodes.length; k++) {
                trees.push(_nodes[k].node);
                trees.extend(this.getNodes(_nodes[k]));
            }
        }
        return trees;
    }
});


Sword.utils.Iterator.newInstance = function(node, type, cascadeSign) {
    var instance = null;
    Sword.utils.Iterator.treeNodeNum = 0;

    var data = [];
    if($defined(node) && $defined(node.data)) {
        data = node.data;
    }
    if($chk(type) && 'json'.test(type.trim(), 'i')) {
        instance = new Sword.utils.JSONIterator(data, 0);
        instance.setDomainData(data);
        instance.setParentSign(cascadeSign.id, cascadeSign.pid, node);
    }
    return instance;
};


function _getTopSwordPopUpBox() {
    if(!pc)return;
	if(jsR.config.swordPopUpBox.topMask==false)return pc.create("SwordPopUpBox");
    var dom = window;
    try{
	    if(dom.top.pageContainer) {
//	        logger.debug("顶层引入 Sword.js,直接在顶层触发", "SwordTools");
	        dom = dom.top.window;
	    } else {
//	        logger.debug("顶层页面没有引入 Sword.js,使用向上递归的方式触发", "SwordTools");
	        while(dom.parent && dom.parent.pageContainer) {
	            if(dom.parent == dom) {
	                break;
	            }
	            dom = dom.parent;
	        }
	    }
    }catch(ex){
    	return pc.create("SwordPopUpBox");
    }
    if(dom.pageContainer) {
        //if(dom.pageContainer.swordPopUpBox)return dom.pageContainer.swordPopUpBox;
        dom.pageContainer.swordPopUpBox = dom.pageContainer.create("SwordPopUpBox");
    }
    return dom.pageContainer.swordPopUpBox;
}

function getTopDom() {
    var dom = window;
    if(dom.top.pc) {
        dom = dom.top.window;
    } else {
        while(dom.parent && dom.parent.pageContainer) {
            if(dom.parent == dom) {
                break;
            }
            dom = dom.parent;
        }
    }
    if(dom.pageContainer) {
        return dom;
    }
    return dom;
}
/**
 * 提示框类
 * @class swordweb.core.more.SwordTools
 */
/**
 * 创建alert类型的提示框
 * @function {public null} swordAlert
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordAlert(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.alert($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}
/**
 * 创建alert错误信息类型的提示框
 * @function {public null} swordAlertWrong
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordAlertWrong(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.alertWrong($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}
/**
 * 创建alert正确信息类型的提示框
 * @function {public null} swordAlertRight
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordAlertRight(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.alertRight($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}
/**
 * 创建confirm信息类型的提示框
 * @function {public null} swordPrompt
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordPrompt(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.prompt($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}
/**
 * 创建confirm信息类型的提示框
 * @function {public null} swordConfirm
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordConfirm(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.confirm($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}
/**
 * 创建自定义iframe信息类型的提示框
 * @function {public null} swordAlertIframe
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordAlertIframe(msg, options, maskObj, hasborder) {
	if(Browser.Engine.webkit||Browser.Engine.trident4){
        if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0){
              return parent.swordAlertIframe(msg, options, maskObj, hasborder);
        }       
    }
    msg = encodeURI(msg);
    var swordPopUpBox = _getTopSwordPopUpBox();
    if(hasborder == false) {
        swordPopUpBox.alertIframeNoPanel($extend({message:msg}, options), maskObj, pc);
        return swordPopUpBox;
    }
    if(!$chk(swordPopUpBox))return;
    swordPopUpBox.alertIframe($extend({message:msg}, options), maskObj, pc);
    return swordPopUpBox;
}


function openWindowSub(postData){
	postData = unescape(postData);
	var data = JSON.decode(postData);
	var sub = pc.create('SwordSubmit');
	sub.options.tid = data.tid;
	sub.options.ctrl = data.ctrl;
	sub.options.page = data.page;
	sub.dataContainer = data.data;
	sub.options.postType = data.postType;
    swordOpenWin('',sub); 
}

function openWindowHash(postData){
	postData = unescape(postData);
	var data = JSON.decode(postData);
	var hash = $H;
	var sUrl = "";
	for(j in data){
		if(j!='sUrl'){
			hash.set(j, data[j]['value']); 
		}else{
			sUrl = data[j]['value'];
		}
	}
    swordOpenWin(sUrl,hash); 
}


function swordOpenWin(sUrl,options){
	var winheight = screen.availHeight;
	var winwidth = screen.availWidth - 10;
	var sUserAgent = navigator.userAgent;
	var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
	if (isWin2003) winheight = winheight - 40
	var strEditDlgFeather = 'top=0,left=0,toolbar=no,menubar=no,scrollbars=no,width=' + winwidth + ',height=' + winheight + ',resizable=no,location=no, status=no';
	if($chk(options)&&$type(options)=='hash'){
		if(Browser.Engine.trident){
			var tempForm = document.createElement("form");  
			tempForm.id="openPrintWindowForm";  
			tempForm.method="post";  
			tempForm.action=AddBizCode2URL(sUrl);  
			var ranNum = Math.random()+"";
			if(ranNum.indexOf('.')!=-1)ranNum = ranNum.substr(ranNum.indexOf('.')+1,ranNum.length);
			var openPrintWindowName = "openPrintWindowName"+ranNum;
			tempForm.target=openPrintWindowName; 
			
			options.each(function(value, key){
				var hideInput = document.createElement("input");  
				hideInput.type="hidden";  
				hideInput.name= key
				hideInput.value= value;
				tempForm.appendChild(hideInput);   
			}); 
			var openWin = window.open('about:blank',"",strEditDlgFeather);
			openWin.name = openPrintWindowName;
			document.body.appendChild(tempForm);
			tempForm.submit();
			document.body.removeChild(tempForm);
		}else if(Browser.Engine.webkit){
			var json = {};
			for(o in options){
				json[o] = {'value':options[o]};
			}
			json['sUrl'] = {'value':AddBizCode2URL(sUrl)};
			var postData = JSON.encode(json);
			if(top.postMsg){
				 postData = escape(postData);
				 top.postMsg("openWindowHash('"+postData+"')");
			 }
		}
	}else if($chk(options)&&$type(options)=='SwordSubmit'){
		if(Browser.Engine.trident){
			var ranNum = Math.random()+"";
			if(ranNum.indexOf('.')!=-1)ranNum = ranNum.substr(ranNum.indexOf('.')+1,ranNum.length);
			var openPrintWindowName = "openPrintWindowName"+ranNum;
			var openWin = top.window.open('about:blank',"",strEditDlgFeather);
			openWin.name = openPrintWindowName;
			options.options.postType = "form_"+openPrintWindowName;
			options.submit();
		}else if(Browser.Engine.webkit){
			 var reqData = options.pc.getReq({
	             'tid':AddBizCode2URL(options.options.tid)
	             ,'ctrl':AddBizCode2URL(options.options.ctrl)
	             ,'page':options.options.page
	             ,'widgets':options.dataContainer
	             ,'postType':options.options.postType
	         });
			 var postData = JSON.encode(reqData);
			 if(top.postMsg){
				 postData = escape(postData);
				 top.postMsg("openWindowSub('"+postData+"')");
			 }
		}
	}else{
		if(Browser.Engine.trident){
			window.open (AddBizCode2URL(sUrl),'',strEditDlgFeather);
		}else if(Browser.Engine.webkit){
			top.postMsg("swordOpenWin('"+AddBizCode2URL(sUrl)+"')");
		}
	}
}
function openWindowParent(){
	return window.opener;
}
/**
 * 创建自定义div信息类型的提示框
 * @function {public null} swordAlertDiv
 * @param {string} msg - 提示框的传入的参数
 * @param {object} options - 提示框的选项
 * @param {element} maskObj - 蒙版蒙住的元素
 * @returns null
 */
function swordAlertDiv(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.alertDiv($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}


function swordAlertMsn(msg, options, maskObj) {
    var swordPopUpBox = _getTopSwordPopUpBox();
    swordPopUpBox.alertMSN($extend({message:msg}, options), maskObj);
    return swordPopUpBox;
}

function getHtmlAttrs(el) {
    var s = {};
    if(el) {
        var attr = el.attributes;
        for(var i = 0; i < attr.length; i++) {
            if(attr[i].specified) {
                var ats = _swordDefaultAttrs[attr[i].name.toLowerCase()];
                if(ats) {
                    s[ats] = attr[i].value ? attr[i].value : true;
                }
            }
        }
    }
    return s;
}


/**
 * 文本格式转换
 */
var sword_fmt = {
    /**
     * CNY 人民币
     * USD 美元
     * @param item
     * @param options
     * @param style
     */
    defFmt:{
        'float':"{'type':'number','format':'0.00','style':''}"
        ,'RMB':"{'type':'number','format':'0.00 RMB','style':''}"
        ,'USD':"{'type':'number','format':'$ 0.00','style':''}"
    }

    /**
     * {'type':'date','format':'yyyy-mm-dd hh:mm:ss','style':'','func':''}
     */
    ,convertText:function(item, options, style) {
        var opts = {};
        var format = "";
        if(!$defined(options)) options = '';
        if(typeof(item) == "object") {

            opts['value'] = options;
            opts['realvalue'] = options;
            opts['style'] = style || '';
            format = item.get("format");
            if(!$chk(format) || !$defined(format))return opts;
            if(options == '') {
                var df = JSON.decode(format)["default"];
                //return  $defined(df) ? {value:df} : opts;
                if($defined(df)) {
                    opts['value'] = df;
                    opts['realvalue'] = df;
                } else {
                    return opts;
                }
            }
        } else if(typeof(item) == "string") {
            opts['value'] = item;
            opts['realvalue'] = item;
            format = options;
        }
        if(sword_fmt.defFmt[format]) {
            format = sword_fmt.defFmt[format];
        }
        try {
            $extend(opts, JSON.decode(format));
        } catch(e) {
        }
        return this.builderText(opts);
    }
    ,formatText:function(item, options, style, format) {
        var opts = {};
        if(typeof(item) == "object") {
            opts['value'] = options;
            opts['realvalue'] = options;
            opts['style'] = style || '';
            if(options == '') {
                var df = JSON.decode(format)["default"];
                return  $defined(df) ? {value:df} : opts;
            }
        } else if(typeof(item) == "string") {
            opts['value'] = item;
            opts['realvalue'] = item;
            format = options;
        }
        if(sword_fmt.defFmt[format]) {
            format = sword_fmt.defFmt[format];
        }
        try {
            $extend(opts, JSON.decode(format));
        } catch(e) {
        }
        return this.builderText(opts);
    }
    /**
     *
     * @param item   div元素
     * @param data   数据
     * @param style  样式
     * @return       包装后元素
     */
    ,builderItem:function(options) {

    }

    ,aptitude:function(options) {

    }

    ,builderText:function(options) {
        if(options) {
            if(options['func']) {
                var func = sword_getFunc(options['func'])[0];
                options['func'] = func;
            }
            if(this[options['type']]) {
                $extend(options, this[options['type']].run(options));
                if(options['func']) {
                    options['func'].run(options);
                }
            }
            return options;
        } else {
            return {'value':'','style':''};
        }

    }



    /**
     * 常规
     */
    ,routine:function(options) {

    }

    ,datePatterns:[
        'Y-m-d H:i:s.u','Y-m-d H:i:s','Y-m-d','y-m-d','m/d/y','Y/m/d','y/m/d','Ymd','ymd'
    ]

    /**
     * 日期
     * 中文小写日期 一九九七 YYYY
     */
    ,date:function(options) {
        var value = "";
        var tp;
        if(!$chk(options['format'])) {
            options['format'] = Date.patterns.ISO8601Long;
        } else {
            if(options['value'] == "now") {
                tp = new Date();
                value = tp.dateFormat(options['format']);
            } else {

                if(!$chk(options['analysisFormat'])) {
                    for(var i = 0; i < sword_fmt.datePatterns.length; i++) {
                        tp = Date.parseDate(options['value'], sword_fmt.datePatterns[i]);
                        if(tp) {
                            break;
                        }
                    }

                } else {
                    tp = Date.parseDate(options['value'], options['analysisFormat']);
                }
                if($chk(tp)) {
                    value = tp.dateFormat(options['format']);
                } else {
                    value = options['value'];
                }
            }
        }
        $extend(options, {'value':value,'obj':tp});
        return   options;
    }

    /**
     * 货币、数字、百分比
     */

    ,
    number:function(options) {
    	var befValue = options['value'];
    	if(!$chk(befValue))befValue = 0;
    	var value = new Number(options['value']).numberFormat(options['format']);
    	value == Number.prototype.NaNstring?options['value'] = new Number(0).numberFormat(options['format']):
        options['value'] = new Number(options['value']).numberFormat(options['format']);
        return   options;
    }
    /**
     * 货币
     */
    ,
    money:function(options) {
        alert(JSON.encode(options));
    }
    /**
     * 百分比
     */
    ,
    percent:function(options) {
        var v = options['value'] + "";
        var a = v.split(".");
        if(a.length > 1) {
            v = "";
            if(a[0].substring(0, 1) != '0') {
                v += a[0];
            }
            if(a[1].length > 2) {
                v += a[1].substring(0, 2);
                v = v.toInt() + "." + a[1].substring(2);
            } else if(a[1].length == 2) {
                v = (v + a[1].substring(0, 2)).toInt();
            } else {
                v = (v + (a[1] + "0")).toInt();
            }
        } else {
            v += (v.toInt() == 0) ? "" : "00";
        }
        options['value'] = v + '%';
        return   options;
    }
    /**
     * 特殊
     * 中文小写数字
     * 中文大写数字
     *
     */
    ,
    exceptive:function(options) {

    }
    /**
     * 自定义
     */
    ,
    customer:function(options) {

    }
    /*人民币大写中文金额*/
    ,money_chi:function(opt) {
        var v = opt['value'];
        if(v) {
            opt['value'] = sword_fmt_convertCurrency(v);
        }
        return opt;
    }
}

/*人民币大写中文金额*/
function sword_fmt_convertCurrency(currencyDigits) {
// Constants:
    currencyDigits = ($type(currencyDigits)=="string")?currencyDigits/1:currencyDigits;
    var MAXIMUM_NUMBER = 99999999999.99;
// Predefine the radix characters and currency symbols for output:
    var CN_ZERO = "零";
    var CN_ONE = "壹";
    var CN_TWO = "贰";
    var CN_THREE = "叁";
    var CN_FOUR = "肆";
    var CN_FIVE = "伍";
    var CN_SIX = "陆";
    var CN_SEVEN = "柒";
    var CN_EIGHT = "捌";
    var CN_NINE = "玖";
    var CN_TEN = "拾";
    var CN_HUNDRED = "佰";
    var CN_THOUSAND = "仟";
    var CN_TEN_THOUSAND = "万";
    var CN_HUNDRED_MILLION = "亿";
    var CN_SYMBOL = "";
    var CN_DOLLAR = "圆";
    var CN_TEN_CENT = "角";
    var CN_CENT = "分";
    var CN_INTEGER = "整";

// Variables:
    var integral; // Represent integral part of digit number.
    var decimal; // Represent decimal part of digit number.
    var outputCharacters; // The output result.
    var parts;
    var digits, radices, bigRadices, decimals;
    var zeroCount;
    var i, p, d;
    var quotient, modulus;

// Validate input string:
    currencyDigits = currencyDigits.toString();
    if(currencyDigits == "") {
//  alert("输入为空");
        return currencyDigits;
    }
    if(currencyDigits.match(/[^,.\d]/) != null) {
        alert("输入字符中有不合法字符，请输入数字。");
        return currencyDigits;
    }
    if((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
        alert("输入的格式不合法。");
        return currencyDigits;
    }

// Normalize the format of input digits:
    currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
    currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
// Assert the number is not greater than the maximum number.
    if(Number(currencyDigits) > MAXIMUM_NUMBER) {
        alert("您输入的超过了最大值：" + MAXIMUM_NUMBER);
        return currencyDigits;
    }

// Process the coversion from currency digits to characters:
// Separate integral and decimal parts before processing coversion:
    parts = currencyDigits.split(".");
    if(parts.length > 1) {
        integral = parts[0];
        decimal = parts[1];
        // Cut down redundant decimal digits that are after the second.
        decimal = decimal.substr(0, 2);
    }
    else {
        integral = parts[0];
        decimal = "";
    }
// Prepare the characters corresponding to the digits:
    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
// Start processing:
    outputCharacters = "";
// Process integral part if it is larger than 0:
    if(Number(integral) > 0) {
        zeroCount = 0;
        for(i = 0; i < integral.length; i++) {
            p = integral.length - i - 1;
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if(d == "0") {
                zeroCount++;
            }
            else {
                if(zeroCount > 0) {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            }
            if(modulus == 0 && zeroCount < 4) {
                outputCharacters += bigRadices[quotient];
            }
        }
        outputCharacters += CN_DOLLAR;
    }
// Process decimal part if there is:
    if(decimal != "" && decimal != "00") {
        for(i = 0; i < decimal.length; i++) {
            d = decimal.substr(i, 1);
            if(d != "0") {
                outputCharacters += digits[Number(d)] + decimals[i];
            } else {
                outputCharacters += digits[Number(d)];
            }
        }
    }else{
       decimal = "";
    }
// Confirm and return the final output string:
    if(outputCharacters == "") {
        outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if(decimal == "") {
        outputCharacters += CN_INTEGER;
    }
    outputCharacters = CN_SYMBOL + outputCharacters;
    return outputCharacters;
}


//加法函数，用来得到精确的加法结果 
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。 
//调用：accAdd(arg1,arg2) 
//返回值：arg1加上arg2的精确结果 
function accAdd(arg1,arg2){ 
	var r1,r2,m; 
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
	m=Math.pow(10,Math.max(r1,r2)) 
	return (arg1.multiple(m)+arg2.multiple(m))/m 
} 
//给Number类型增加一个add方法，调用起来更加方便。 
Number.prototype.accAdd = function (arg){ 
	return parseFloat(accAdd(arg,this)); 
}
String.prototype.accAdd = function (arg){ 
	return accAdd(arg,this); 
}

//减法函数，用来得到精确的减法结果 
//说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。 
//调用：accSubtr(arg1,arg2) 
//返回值：arg1减去arg2的精确结果 
function accSubtr(arg1,arg2){
	var r1,r2,m,n;
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
	m=Math.pow(10,Math.max(r1,r2));
	//动态控制精度长度
	n=(r1>=r2)?r1:r2;
	return ((arg1.multiple(m)-arg2.multiple(m))/m).round(n);
} 
//给Number类型增加一个subtr 方法，调用起来更加方便。 
Number.prototype.subtract = function (arg){ 
	return parseFloat(accSubtr(this,arg)); 
}
String.prototype.subtract = function (arg){ 
	return accSubtr(this,arg); 
}

//乘法函数，用来得到精确的乘法结果 
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。 
//调用：accMul(arg1,arg2) 
//返回值：arg1乘以arg2的精确结果 
function accMul(arg1,arg2) 
{ 
	var m=0,s1=arg1.toString(),s2=arg2.toString(); 
	try{m+=s1.split(".")[1].length}catch(e){} 
	try{m+=s2.split(".")[1].length}catch(e){} 
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
} 
//给Number类型增加一个mul方法，调用起来更加方便。 
Number.prototype.multiple = function (arg){ 
	return parseFloat(accMul(arg, this)); 
}
String.prototype.multiple = function (arg){ 
	return accMul(arg, this); 
}

//除法函数，用来得到精确的除法结果 
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。 
//调用：accDiv(arg1,arg2) 
//返回值：arg1除以arg2的精确结果

function accDiv(arg1,arg2){ 
	var t1=0,t2=0,r1,r2; 
	try{t1=arg1.toString().split(".")[1].length}catch(e){} 
	try{t2=arg2.toString().split(".")[1].length}catch(e){} 
	with(Math){ 
	r1=Number(arg1.toString().replace(".","")) 
	r2=Number(arg2.toString().replace(".","")) 
	return (r1/r2)*pow(10,t2-t1); 
} 
} 
//给Number类型增加一个div方法，调用起来更加方便。 
Number.prototype.divide = function (arg){ 
	return parseFloat(accDiv(this, arg)); 
}
String.prototype.divide = function (arg){ 
	return accDiv(this, arg); 
}

//v表示要转换的值
//e表示要保留的位数
function round(v,e){
	var t=1;
	for(;e>0;t*=10,e--);
	for(;e<0;t/=10,e++);
	return Math.round(v.multiple(t))/t;
}

//给Number类型增加一个round方法，调用起来更加方便。 
Number.prototype.round  = function (arg){ 
	return parseFloat(round(this, arg)); 
}
//给Number类型增加一个round方法，调用起来更加方便。 
String.prototype.round  = function (arg){ 
	return round(this, arg); 
}

Number.formatFunctions = {count:0};
String.formatFunctions = {count:0};

Number.prototype.NaNstring = 'NaN';
Number.prototype.posInfinity = 'Infinity';
Number.prototype.negInfinity = '-Infinity';

Number.prototype.numberFormat = function(format, context) {
    if(isNaN(this)) {
        return Number.prototype.NaNstring;
    }
    else if(this == +Infinity) {
        return Number.prototype.posInfinity;
    }
    else if(this == -Infinity) {
        return Number.prototype.negInfinity;
    }
    else if(Number.formatFunctions[format] == null) {
        Number.createNewFormat(format);
    }
    return this[Number.formatFunctions[format]](context);
}

Number.createNewFormat = function(format) {
    var funcName = "format" + Number.formatFunctions.count++;
    Number.formatFunctions[format] = funcName;
    var code = "Number.prototype." + funcName + " = function(context){\n";

    var formats = format.split(";");
    switch(formats.length) {
        case 1:
            code += Number.createTerminalFormat(format);
            break;
        case 2:
            code += "return (this < 0) ? this.numberFormat(\""
                    + _escape(formats[1])
                    + "\", 1) : this.numberFormat(\""
                    + _escape(formats[0])
                    + "\", 2);";
            break;
        case 3:
            code += "return (this < 0) ? this.numberFormat(\""
                    + _escape(formats[1])
                    + "\", 1) : ((this == 0) ? this.numberFormat(\""
                    + _escape(formats[2])
                    + "\", 2) : this.numberFormat(\""
                    + _escape(formats[0])
                    + "\", 3));";
            break;
        default:
            code += "throw 'Too many semicolons in format string';";
            break;
    }
    eval(code + "}");
}


Number.createTerminalFormat = function(format) {
    if(format.length > 0 && format.search(/[0#?]/) == -1) {
        return "return '" + _escape(format) + "';\n";
    }
    var code = "var val = (context == null) ? new Number(this) : Math.abs(this);\n";
    var thousands = false;
    var lodp = format;
    var rodp = "";
    var ldigits = 0;
    var rdigits = 0;
    var scidigits = 0;
    var scishowsign = false;
    var sciletter = "";
    m = format.match(/\..*(e)([+-]?)(0+)/i);
    if(m) {
        sciletter = m[1];
        scishowsign = (m[2] == "+");
        scidigits = m[3].length;
        format = format.replace(/(e)([+-]?)(0+)/i, "");
    }
    var m = format.match(/^([^.]*)\.(.*)$/);
    if(m) {
        lodp = m[1].replace(/\./g, "");
        rodp = m[2].replace(/\./g, "");
    }
    if(format.indexOf('%') >= 0) {
        code += "val *= 100;\n";
    }
    m = lodp.match(/(,+)(?:$|[^0#?,])/);
    if(m) {
        code += "val /= " + Math.pow(1000, m[1].length) + "\n;";
    }
    if(lodp.search(/[0#?],[0#?]/) >= 0) {
        thousands = true;
    }
    if((m) || thousands) {
        lodp = lodp.replace(/,/g, "");
    }
    m = lodp.match(/0[0#?]*/);
    if(m) {
        ldigits = m[0].length;
    }
    m = rodp.match(/[0#?]*/);
    if(m) {
        rdigits = m[0].length;
    }
    if(scidigits > 0) {
        code += "var sci = Number.toScientific(val,"
                + ldigits + ", " + rdigits + ", " + scidigits + ", " + scishowsign + ");\n"
                + "var arr = [sci.l, sci.r];\n";
    }
    else {
        if(format.indexOf('.') < 0) {
             code += "val = (val > 0&&val.toString().indexOf('.')!=-1&&val.toString().split('.')[1][0]<=4) ? Math.floor(val) : Math.ceil(val);\n";
        }
        code += "var arr = val.round(" + rdigits + ").toFixed(" + rdigits + ").split('.');\n";
        code += "arr[0] = (val < 0 ? '-' : '') + _leftPad((val < 0 ? arr[0].substring(1) : arr[0]), "
                + ldigits + ", '0');\n";
    }
    if(thousands) {
        code += "arr[0] = Number.addSeparators(arr[0]);\n";
    }
    code += "arr[0] = Number.injectIntoFormat(arr[0].reverse(), '"
            + _escape(lodp.reverse()) + "', true).reverse();\n";
    if(rdigits > 0) {
        code += "arr[1] = Number.injectIntoFormat(arr[1], '" + _escape(rodp) + "', false);\n";
    }
    if(scidigits > 0) {
        code += "arr[1] = arr[1].replace(/(\\d{" + rdigits + "})/, '$1" + sciletter + "' + sci.s);\n";
    }
    return code + "return arr.join('.');\n";
}

Number.toScientific = function(val, ldigits, rdigits, scidigits, showsign) {
    var result = {l:"", r:"", s:""};
    var ex = "";
    var before = Math.abs(val).toFixed(ldigits + rdigits + 1).trim('0');
    var after = Math.round(new Number(before.replace(".", "").replace(
            new RegExp("(\\d{" + (ldigits + rdigits) + "})(.*)"), "$1.$2"))).toFixed(0);
    if(after.length >= ldigits) {
        after = after.substring(0, ldigits) + "." + after.substring(ldigits);
    }
    else {
        after += '.';
    }
    result.s = (before.indexOf(".") - before.search(/[1-9]/)) - after.indexOf(".");
    if(result.s < 0) {
        result.s++;
    }
    result.l = (val < 0 ? '-' : '') + _leftPad(after.substring(0, after.indexOf(".")), ldigits, "0");
    result.r = after.substring(after.indexOf(".") + 1);
    if(result.s < 0) {
        ex = "-";
    }
    else if(showsign) {
        ex = "+";
    }
    result.s = ex + _leftPad(Math.abs(result.s).toFixed(0), scidigits, "0");
    return result;
}


//Number.prototype.round = function(decimals) {
//    if(decimals > 0) {
//        var m = this.toFixed(decimals + 1).match(
//                new RegExp("(-?\\d*)\.(\\d{" + decimals + "})(\\d)\\d*$"));
//        if(m && m.length) {
//            return new Number(m[1] + "." + _leftPad(Math.round(m[2] + "." + m[3]), decimals, "0"));
//        }
//    }
//    return this;
//}

Number.injectIntoFormat = function(val, format, stuffExtras) {
    var i = 0;
    var j = 0;
    var result = "";
    var revneg = val.charAt(val.length - 1) == '-';
    if(revneg) {
        val = val.substring(0, val.length - 1);
    }
    while(i < format.length && j < val.length && format.substring(i).search(/[0#?]/) >= 0) {
        if(format.charAt(i).match(/[0#?]/)) {
            if(val.charAt(j) != '-') {
                result += val.charAt(j);
            }
            else {
                result += "0";
            }
            j++;
        }
        else {
            result += format.charAt(i);
        }
        ++i;
    }
    if(revneg && j == val.length) {
        result += '-';
    }
    if(j < val.length) {
        if(stuffExtras) {
            result += val.substring(j);
        }
        if(revneg) {
            result += '-';
        }
    }
    if(i < format.length) {
        result += format.substring(i);
    }
    return result.replace(/#/g, "").replace(/\?/g, " ");
}

Number.addSeparators = function(val) {
    return val.reverse().replace(/(\d{3})/g, "$1,").reverse().replace(/^(-)?,/, "$1");
}

/**
 *
 *<pre>
 样本数据：
 'Wed Jan 10 2007 15:05:01 GMT-0600 （中区标准时间）'

 格式符    输出         说明
 ------  ----------  --------------------------------------------------------------
 d      10         月份中的天数，两位数字，不足位补“0”
 D      Wed        当前星期的缩写，三个字母
 j      10         月份中的天数，不补“0”
 l      Wednesday  当前星期的完整拼写
 S      th         英语中月份天数的序数词的后缀，2个字符（与格式符“j”连用）
 w      3          一周之中的天数（1～7）
 z      9          一年之中的天数（0～365）
 W      01         一年之中的周数，两位数字（00～52）
 F      January    当前月份的完整拼写
 m      01         当前的月份，两位数字，不足位补“0”
 M      Jan        当前月份的完整拼写，三个字母
 n      1          当前的月份，不补“0”
 t      31         当前月份的总天数
 L      0          是否闰年（“1”为闰年，“0”为平年）
 Y      2007       4位数字表示的当前年数
 y      07         2位数字表示的当前年数
 a      pm         小写的“am”和“pm”
 A      PM         大写的“am”和“pm”
 g      3          12小时制表示的当前小时数，不补“0”
 G      15         24小时制表示的当前小时数，不补“0”
 h      03         12小时制表示的当前小时数，不足位补“0”
 H      15         24小时制表示的当前小时数，不足位补“0”
 i      05         不足位补“0”的分钟数
 s      01         不足位补“0”的秒数
 u      001- 999    不足位补“0”的毫秒数
 O      -0600      用小时数表示的与 GMT 差异数
 T      CST        当前系统设定的时区
 Z      -21600     用秒数表示的时区偏移量（西方为负数，东方为正数）
 </pre>
 *
 * 用法举例：（注意你必须在字母前使用转意字符“\\”才能将其作为字母本身而不是格式符输出）：
 * <pre><code>
 var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
 document.write(dt.format('Y-m-d'));                         //2007-01-10
 document.write(dt.format('F j, Y, g:i a'));                 //January 10, 2007, 3:05 pm
 document.write(dt.format('l, \\t\\he dS of F Y h:i:s A'));  //Wednesday, the 10th of January 2007 03:05:01 PM
 </code></pre>
 */

Date.parseFunctions = {count:0};
Date.parseRegexes = [];
Date.formatFunctions = {count:0};
Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
Date.prototype.dateFormat = function(format) {
    if(Date.formatFunctions[format] == null) {
        Date.createNewFormat(format);
    }
    var func = Date.formatFunctions[format];
    return this[func]();
};


Date.prototype.format = Date.prototype.dateFormat;

Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = '';
    for(var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if(!special && ch == "\\") {
            special = true;
        }
        else if(special) {
            special = false;
            code += "'" + _escape(ch) + "' + ";
        }
        else {
            code += Date.getFormatCode(ch);
        }
    }
    eval(code.substring(0, code.length - 3) + ";}");
};

Date.getFormatCode = function(character) {
    switch(character) {
        case "d":
            return "_leftPad(this.getDate(), 2, '0') + ";
        case "D":
            return "Date.dayNames[this.getDay()].substring(0, 3) + ";
        case "j":
            return "this.getDate() + ";
        case "l":
            return "Date.dayNames[this.getDay()] + ";
        case "S":
            return "this.getSuffix() + ";
        case "w":
            return "this.getDay() + ";
        case "z":
            return "this.getDayOfYear() + ";
        case "W":
            return "this.getWeekOfYear() + ";
        case "F":
            return "Date.monthNames[this.getMonth()] + ";
        case "m":
            return "_leftPad(this.getMonth() + 1, 2, '0') + ";
        case "M":
            return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
        case "n":
            return "(this.getMonth() + 1) + ";
        case "t":
            return "this.getDaysInMonth() + ";
        case "L":
            return "(this.isLeapYear() ? 1 : 0) + ";
        case "Y":
            return "this.getFullYear() + ";
        case "y":
            return "('' + this.getFullYear()).substring(2, 4) + ";
        case "a":
            return "(this.getHours() < 12 ? 'am' : 'pm') + ";
        case "A":
            return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
        case "g":
            return "((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";
        case "G":
            return "this.getHours() + ";
        case "h":
            return "_leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";
        case "H":
            return "_leftPad(this.getHours(), 2, '0') + ";
        case "i":
            return "_leftPad(this.getMinutes(), 2, '0') + ";
        case "s":
            return "_leftPad(this.getSeconds(), 2, '0') + ";
        case "u":
            return "_leftPad(this.getMilliseconds(), 4, '0') + ";
        case "O":
            return "this.getGMTOffset() + ";
        case "T":
            return "this.getTimezone() + ";
        case "Z":
            return "(this.getTimezoneOffset() * -60) + ";
        default:
            return "'" + _escape(character) + "' + ";
    }
};


Date.parseDate = function(input, format) {
    if(Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
};

Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
            + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, o, z, v;\n"
            + "var d = new Date();\n"
            + "y = d.getFullYear();\n"
            + "m = d.getMonth();\n"
            + "d = d.getDate();\n"
            + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
            + "if (results && results.length > 0) {";
    var regex = "";

    var special = false;
    var ch = '';
    for(var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if(!special && ch == "\\") {
            special = true;
        }
        else if(special) {
            special = false;
            regex += _escape(ch);
        }
        else {
            var obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if(obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
            + "{v = new Date(y, m, d, h, i, s);}\n"
            + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
            + "{v = new Date(y, m, d, h, i);}\n"
            + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n"
            + "{v = new Date(y, m, d, h);}\n"
            + "else if (y >= 0 && m >= 0 && d > 0)\n"
            + "{v = new Date(y, m, d);}\n"
            + "else if (y >= 0 && m >= 0)\n"
            + "{v = new Date(y, m);}\n"
            + "else if (y >= 0)\n"
            + "{v = new Date(y);}\n"
            + "}return (v && (z || o))?\n" // favour UTC offset over GMT offset
            + "    ((z)? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n" // reset to UTC, then add offset
            + "        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n" // reset to GMT, then add offset
            + ";}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
    eval(code);
};
Date.formatCodeToRegex = function(character, currentGroup) {
    switch(character) {
        case "D":
            return {g:0,
                c:null,
                s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
        case "j":
            return {g:1,
                c:"d = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{1,2})"}; // day of month without leading zeroes
        case "d":
            return {g:1,
                c:"d = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{2})"}; // day of month with leading zeroes
        case "l":
            return {g:0,
                c:null,
                s:"(?:" + Date.dayNames.join("|") + ")"};
        case "S":
            return {g:0,
                c:null,
                s:"(?:st|nd|rd|th)"};
        case "w":
            return {g:0,
                c:null,
                s:"\\d"};
        case "z":
            return {g:0,
                c:null,
                s:"(?:\\d{1,3})"};
        case "W":
            return {g:0,
                c:null,
                s:"(?:\\d{2})"};
        case "F":
            return {g:1,
                c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 1).toUpperCase() + results[" + currentGroup + "].substring(1, 3).toLowerCase()], 10);\n",
                s:"(" + Date.monthNames.join("|") + ")"};
        case "M":
            return {g:1,
                c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 1).toUpperCase() + results[" + currentGroup + "].substring(1, 3).toLowerCase()], 10);\n",
                s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
        case "n":
            return {g:1,
                c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
                s:"(\\d{1,2})"}; // Numeric representation of a month, without leading zeros
        case "m":
            return {g:1,
                c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
                s:"(\\d{2})"}; // Numeric representation of a month, with leading zeros
        case "t":
            return {g:0,
                c:null,
                s:"\\d{1,2}"};
        case "L":
            return {g:0,
                c:null,
                s:"(?:1|0)"};
        case "Y":
            return {g:1,
                c:"y = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{4})"};
        case "y":
            return {g:1,
                c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
                        + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
                s:"(\\d{1,2})"};
        case "a":
            return {g:1,
                c:"if (results[" + currentGroup + "] == 'am') {\n"
                        + "if (h == 12) { h = 0; }\n"
                        + "} else { if (h < 12) { h += 12; }}",
                s:"(am|pm)"};
        case "A":
            return {g:1,
                c:"if (results[" + currentGroup + "] == 'AM') {\n"
                        + "if (h == 12) { h = 0; }\n"
                        + "} else { if (h < 12) { h += 12; }}",
                s:"(AM|PM)"};
        case "g":
        case "G":
            return {g:1,
                c:"h = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{1,2})"}; // 12/24-hr format  format of an hour without leading zeroes
        case "h":
        case "H":
            return {g:1,
                c:"h = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{2})"}; //  12/24-hr format  format of an hour with leading zeroes
        case "i":
            return {g:1,
                c:"i = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{2})"};
        case "s":
            return {g:1,
                c:"s = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{2})"};
        case "u":
            return {g:1,
                c:"u = parseInt(results[" + currentGroup + "], 10);\n",
                s:"(\\d{4})"};
        case "O":
            return {g:1,
                c:[
                    "o = results[", currentGroup, "];\n",
                    "var sn = o.substring(0,1);\n", // get + / - sign
                    "var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n", // get hours (performs minutes-to-hour conversion also)
                    "var mn = o.substring(3,5) % 60;\n", // get minutes
                    "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n", // -12hrs <= GMT offset <= 14hrs
                    "    (sn + _leftPad(hr, 2, 0) + _leftPad(mn, 2, 0)) : null;\n"
                ].join(""),
                s:"([+\-]\\d{4})"};
        case "T":
            return {g:0,
                c:null,
                s:"[A-Z]{1,4}"}; // timezone abbrev. may be between 1 - 4 chars
        case "Z":
            return {g:1,
                c:"z = results[" + currentGroup + "];\n" // -43200 <= UTC offset <= 50400
                        + "z = (-43200 <= z*1 && z*1 <= 50400)? z : null;\n",
                s:"([+\-]?\\d{1,5})"}; // leading '+' sign is optional for UTC offset
        default:
            return {g:0,
                c:null,
                s:_escape(character)};
    }
};

Date.prototype.getTimezone = function() {
    return this.toString().replace(/^.*? ([A-Z]{1,4})[\-+][0-9]{4} .*$/, "$1");
};

Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
            + _leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0")
            + _leftPad(this.getTimezoneOffset() % 60, 2, "0");
};

Date.prototype.getDayOfYear = function() {
    var num = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for(var i = 0; i < this.getMonth(); ++i) {
        num += Date.daysInMonth[i];
    }
    return num + this.getDate() - 1;
};

Date.prototype.getWeekOfYear = function() {
    var now = this.getDayOfYear() + (4 - this.getDay());
    // Find the first Thursday of the year
    var jan1 = new Date(this.getFullYear(), 0, 1);
    var then = (7 - jan1.getDay() + 4);
    return _leftPad(((now - then) / 7) + 1, 2, "0");
};

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
};


Date.prototype.getFirstDayOfMonth = function() {
    var day = (this.getDay() - (this.getDate() - 1)) % 7;
    return (day < 0) ? (day + 7) : day;
};


Date.prototype.getLastDayOfMonth = function() {
    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (day < 0) ? (day + 7) : day;
};


Date.prototype.getFirstDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), 1);
};


Date.prototype.getLastDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
};

Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
};


Date.prototype.getSuffix = function() {
    switch(this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th";
    }
};

Date.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

Date.monthNames =
        ["January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"];


Date.dayNames =
        ["Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"];

Date.y2kYear = 50;
Date.monthNumbers = {
    Jan:0,
    Feb:1,
    Mar:2,
    Apr:3,
    May:4,
    Jun:5,
    Jul:6,
    Aug:7,
    Sep:8,
    Oct:9,
    Nov:10,
    Dec:11};

Date.prototype.clone = function() {
    return new Date(this.getTime());
};

Date.prototype.clearTime = function(clone) {
    if(clone) {
        return this.clone().clearTime();
    }
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};


Date.MILLI = "ms";
Date.SECOND = "s";
Date.MINUTE = "mi";
Date.HOUR = "h";
Date.DAY = "d";
Date.MONTH = "mo";
Date.YEAR = "y";

/**
 * Provides a convenient method of performing basic date arithmetic.  This method
 * does not modify the Date instance being called - it creates and returns
 * a new Date instance containing the resulting date value.
 *
 * Examples:
 * <pre><code>
 //Basic usage:
 var dt = new Date('10/29/2006').add(Date.DAY, 5);
 document.write(dt); //returns 'Fri Oct 06 2006 00:00:00'

 //Negative values will subtract correctly:
 var dt2 = new Date('10/1/2006').add(Date.DAY, -5);
 document.write(dt2); //returns 'Tue Sep 26 2006 00:00:00'

 //You can even chain several calls together in one line!
 var dt3 = new Date('10/1/2006').add(Date.DAY, 5).add(Date.HOUR, 8).add(Date.MINUTE, -30);
 document.write(dt3); //returns 'Fri Oct 06 2006 07:30:00'
 </code></pre>
 *
 * @param {String} interval   A valid date interval enum value
 * @param {Number} value      The amount to add to the current date
 * @return {Date} The new Date instance
 */
Date.prototype.add = function(interval, value) {
    var d = this.clone();
    if(!interval || value === 0) return d;
    switch(interval.toLowerCase()) {
        case Date.MILLI:
            d.setMilliseconds(this.getMilliseconds() + value);
            break;
        case Date.SECOND:
            d.setSeconds(this.getSeconds() + value);
            break;
        case Date.MINUTE:
            d.setMinutes(this.getMinutes() + value);
            break;
        case Date.HOUR:
            d.setHours(this.getHours() + value);
            break;
        case Date.DAY:
            d.setDate(this.getDate() + value);
            break;
        case Date.MONTH:
            var day = this.getDate();
            if(day > 28) {
                day = Math.min(day, this.getFirstDateOfMonth().add('mo', value).getLastDateOfMonth().getDate());
            }
            d.setDate(day);
            d.setMonth(this.getMonth() + value);
            break;
        case Date.YEAR:
            d.setFullYear(this.getFullYear() + value);
            break;
    }
    return d;
};

Date.prototype.between = function(start, end) {
    var t = this.getTime();
    return t >= start.getTime() && t <= end.getTime();
}


_leftPad = function (val, size, ch) {
    var result = new String(val);
    if(ch == null) {
        ch = " ";
    }
    while(result.length < size) {
        result = ch + result;
    }
    return result;
}

_escape = function(string) {
    return string.replace(/('|\\)/g, "\\$1");
}


String.prototype.reverse = function() {
    var res = "";
    for(var i = this.length; i > 0; --i) {
        res += this.charAt(i - 1);
    }
    return res;
};
xyposition = function(o, t,flag) {
    xposition(o, t,flag);
    yposition(o, t);
};
xposition = function(o, t, flag) {
    var p0;
    if(!$defined(flag)) p0 = o._getPosition().y - $(document.body).getScroll().y + o.getHeight() + t.getHeight() + 20;
    else p0 = o._getPosition().y - $(document.body).getScroll().y - t.getHeight() - 5;
    var scanY = $(document.body).getHeight();
    if((!$defined(flag) && p0 > scanY) || ($defined(flag) && p0 >= 0)) {
    	var p1 = o._getPosition().y - t.getHeight();
    	if(p1 < 0){
    		 t.setStyle('top', (o._getPosition().y + o.getHeight()));
    	}else{
    		t.setStyle('top', p1);
    	}
    } else {
        t.setStyle('top', (o._getPosition().y + o.getHeight()));
    }
};
yposition = function(o, t) {
    var p0 = o._getPosition().x - $(document.body).getScrollWidth() + t.getWidth();
    var scanX = $(document.body).getWidth();
    if(p0 > 0) {
        t.setStyle('left', (scanX - t.getWidth()));
    } else {
        t.setStyle('left', o._getPosition().x);
    }
};
$dateFmt = function(v, obj, fmt) {
	//增加判断v不等于null
	if(!$defined(v))return;
    if(!$defined(v) && !$defined(obj))return;
    var vA = v.split(".");
    if(vA.length <= 2) {
        if(!_SwordDF.isDate(vA[0], "yyyy-MM-dd HH:mm:ss"))return false;
    } else {
        return false;
    }
    if(!$defined(fmt))fmt = obj.get('dataformat');
    if(!$defined(fmt))fmt = "yyyy-MM-dd HH:mm:ss";
    var _v;
    if(_SwordDF.isDate(v, fmt)) {
        _v = v;
    } else {
        _v = _SwordDF.formatStringToString(v, "yyyy-MM-dd HH:mm:ss", fmt);
    }
    obj.set("realvalue", v);
    obj.set("value", _v);
    obj.set('text', _v);
    return true;
};
$w = function(widgetName) {
    return pageContainer.getWidget(widgetName);
};
$print = function(obj) {
    return JSON.encode(obj);
};
/*
name:提交组件的名字
widgetNames:需要提交的组件数据  例如：[{"widgetName":"formName"},{"widgetName":"tableName","console":"submitChecked","check":"check"}]
options:提交组件的参数 例如：{"tid":"DAOBLH_newSubmit1","onSubmitBefore":"before()","onSubmitAfter":"after()"}
 */
$submit = function(name,widgetNames,options) { 
    var submit = null;
    if($chk(options)){
        $extend(options, {"newFlag":"true"});
        submit = new SwordSubmit(options);
      
    }else
       submit = new SwordSubmit({"newFlag":"true"});
    if($chk(name))
        pageContainer.widgets.set(name, submit);   
    widgetNames =  widgetNames||[] ;
    widgetNames.each(function(item, index) {
        var widgetName = ($type(item) == "object"?item["widgetName"]:item);
        var obj = pageContainer.getWidget(widgetName);
        if (obj) {
             var widget = obj.name; 
             if ($defined(obj)) {
                   if (widget == "SwordForm") {
                        if (obj.isHasFile()) {
                             submit.hasFile = true;
                        }
                    }
                    var console = submit.initConsoleAttr(widget, item);
                    var instance = SwordSubmit.Command.newInstance(widget, widgetName, console, obj);
                    if ($defined(instance)) {
                        submit.widgetObjs.set(widgetName, instance);
                    }

             }

        }
   });
   return submit;
};

/**
 * 主要用于menu与tree的集成
 * 场景：每次点击menu时获取其对应的树的数据
 * 用法：
 *      //先获取当前点击的menu所对应的属性值
 *      <div sword = "SwordMenu" onSelect=  "select()"></div>
 *      //对应的select函数如下：
 *
 *      function select(item){
 *           var code = item.get("code");
		 	 var params = new Hash();
		 	 params.set("code",code);
		 	 var data = Sword.utils.getDataByMenu("code","MenuBLH_getTree",params);
		 	 var tree= $w("SwordTree");
		 	 tree.initData(data);
 *      }
 *
 *
 * @param property   作为hash的key
 * @param tid        请求服务标识
 * @param params     向后台传递的参数
 * @param isCache    每次获取的数据是否缓存
 *
 */
Sword.utils.getDataByMenu  = function(property,tid,params,isCache){
   var data = null;

   if($chk(property) && $chk(tid) && $chk(params)){
       if(!$chk(params.has(property))){
           alert("传递的参数中没有其对应的属性，请检查");
           return data;
       }
       if($defined(Sword.utils._containerData)){

           data = Sword.utils._containerData.get(params.get(property));
           if(data){
                return data;
           }

       }

       var submit = new SwordSubmit();
       submit.options.mask  = "false";
       submit.setTid(tid);
       var obj = {};
       
       if($chk(params) && $type(params) == "hash"){
          params.each(function(value,key){
              obj['name'] = key;
              obj['value'] = value;
          });
          submit.pushData(obj);
          data = submit.submit();

          if(data && isCache!==false){
              if(!$defined(Sword.utils._containerData)){
                   Sword.utils._containerData = new Hash();
              }
              if(data.data && data.data.length>0){
            	  
            	  Sword.utils._containerData.set(params.get(property),data.data[0]);
            	  data = data.data[0];
              }
              
          }
          return data;
       }

   }else{
       return data;
   }

} ;

