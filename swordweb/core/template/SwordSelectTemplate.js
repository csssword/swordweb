/**
 * 下拉列表的模板引擎
 */
var SwordSelectTemplate = {
    // 下拉的HTML结构
    'pre':'<table class="swordform_field_wrap" cellspacing="0" cellpadding="0"><tbody><tr><td class="boxtd">',
    'select':'<input type="text" widget="select" <tpl if="values.get(\'edit\')==\'false\'">readonly="true"</tpl><tpl if="values.get(\'type\')==\'selectsolely\'">mode=2</tpl><tpl if="values.get(\'disable\')==\'true\'">disabled="true" class="swordform_item_oprate swordform_item_input select_input_disable" style="float:left;cursor:default;"</tpl><tpl if="values.get(\'rule\')==\'must\' && values.get(\'disable\')!=\'true\'">style="float:left;background-color:#b5e3df;" class="{class}"</tpl><tpl if="values.get(\'disable\')!=\'true\'&& values.get(\'rule\')!=\'must\'">style="{style}" class="{class}"</tpl>',
    'end':' ></td><td class="swordselect-selimg <tpl if="values.get(\'disable\')==\'true\'">swordselect-selimg-disable</tpl>" width="17px" vtype="fldiv"><div style="width:17px;visibility:hidden;"></div></td></tr></tbody></table>',
    // 日期属性
    'attr':'name="{name}" cacheSelected="{cacheSelected}" rule="{rule}" prikey="{prikey}" msg="{msg}" sbmitcontent="{sbmitcontent}" _onChange="{onChange}" _onSelect="{onSelect}" onShow="{onShow}" onHide="{onHide}" onSubmitBefore="{onSubmitBefore}" value="{value}" parent="{parent}" lines="{lines}" lineheight="{height}" dataname="{dataname}" pcode="{pcode}" tid="{tid}" defValue="{defValue}" defIndex="{defIndex}" dataFilter="{dataFilter}" style="float: left;" popWidth="{popWidth}" displayCode="{displayCode}" inputdisplay="{inputdisplay}" popdisplay="{popdisplay}" handInput="{handInput}" addAllItem="{addAllItem}" allItemCode="{allItemCode}" allItemCap="{allItemCap}"',
    // 是否有id，如果在form里就有id,如果在表格里,不生成id
    'id':' id="{PName}_{name}" ',
    'seldef':{
        // 格式化
        'value':'',
        'lines':10,
        'height':21,
        // 弹出的日期选择框的格式
        'edit':'true',
        'handInput':'false',
        'addAllItem':'false',
        'allItemCode':'',
        'displayCode':'false',
        'onChange' : '',//当选择框发生改变时的回调函数(el:选中的行对象，String:code值)
        'onSelect' : '',//选择时的回调函数 (string:code)
        'onShow'   : '',//下拉列表显示时的回调函数
        'onHide'   : ''//下拉列表隐藏时的回调函数
        ,'style':'float: left;'
        ,'onSubmitBefore'   : ''//点击才装载数据之前触发
        ,'class':'swordform_item_oprate swordform_item_input'
    }
};

$extend(SwordSelectTemplate, {
    // 创建Select下拉组件的dom
    /**
	 * @param item
	 *            定义的div节点
	 * @param parent
	 *            父亲对象是谁
	 * @param data
	 *            日期框的数据
	 */
    render:function (item, parent, data, formObj) {
        var me = this, arr, html, node;
        var d = $merge(me.seldef, data);
        if (parent == "SwordForm") {
            arr = [me.pre, me.select, me.attr, me.id, me.end];
        } else {
            arr = [me.pre, me.select, me.attr, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        var id = d.PName+"_"+item.get("name");
        if(item.get('defValue')){
        	this.initData($(id),{value:item.get('defValue')}, formObj)
        }
        return id;
    },
    getOptionsData:function(el,formObj) {
        var loadData = null;
        var data = el.getParent("table").getNext().getChildren(">div");
        if((!$defined(data)) || data.length == 0) {
            var dataname = el.get("dataname");
            var d = ($defined(dataname)) ? pageContainer.getInitDataByDataName(dataname) : pageContainer.getInitData(el.get("name"));
            if(!$defined(d)) {
                return;
            }
            loadData = data = d.data;
        }
        if(data.length > 0) {
            loadData = this.dataFilter(el, data);
        }
        var bizdatafilter = el.get("dataFilter");
        if($defined(bizdatafilter)) {
            try {
                loadData = formObj.getFunc(bizdatafilter)[0](loadData, el, this);
            } catch(e) {
                alert("执行下拉列表的数据过滤方法出错！请检查页面自定义函数" + bizdatafilter);
            }
        }
        var defaultCap = el.get('addAllItem');
        if($chk(defaultCap) && defaultCap != "false")loadData = [
            {caption:el.get("allItemCap"),code:el.get("allItemCode") || "all"}
        ].extend(loadData);
        return loadData;
    },
    dataFilter:function(el, loadData) {
        var topCode = el.get("pcode");
        if(this.isMulti(el, loadData) && $defined(el.get("parent"))) {
            var pcode = this.getParentValue(el);
            if($chk(pcode)) {
                loadData = loadData.filter(function(item) {
                    return ($type(item) == 'element') ? (item.get('pcode') == pcode) : (item.pcode == pcode);
                }, this);
            } else {
                loadData = [];
            }
        } else if(this.isMulti(el, loadData)) {
            var b = $defined(topCode) ? [topCode,null,'',undefined] : [null,'',undefined];
            loadData = loadData.filter(function(item) {
                return ($type(item) == 'element') ? b.contains(item.get('pcode')) : b.contains(item.pcode);
            }, this);
        }
        return loadData;
    },
    isMulti:function(el, data) {
        if(!$defined(data)) {
            return $defined(el.get('child')) || $defined(el.get('parent'));
        }
        return $defined(el.get('child')) || $defined(el.get('parent')) || (($type(data[0]) == 'element') ? data[0].get('pcode') : $H(data[0]).has('pcode'));
    },
    getParentValue:function(el) {
        var pBox = el.getParent("div").getElements("*[name='" + el.get("parent") + "']")[0];
        return ($chk(pBox.get('code'))) ? pBox.get('code') : pBox.get('value');
    },
    getBoxParent: function(el) {
        return el.getParent().getParent().getParent().getParent().getParent();
    },
    genarateContent:function(el,obj, content) {
        if(!$defined(content))
            content = el.get('sbmitcontent');
        if(!$defined(content)) {
            content = "{code}";
        }
        if($type(obj) == "element") {
            obj = {'code':obj.get("code"),"caption":obj.get("caption")};
        }
        return content.substitute(obj);
    },genarateInputContent:function(el, obj) {
        var content = el.get('inputdisplay');
        if(!$defined(content))content = "{caption}";
        return this.genarateContent(el,obj, content);
    },
    initData:function (el, d, formObj) {
    	var idx;
    	if(!$chk(d)){
            if($defined(el.get("defIndex")) || $defined(el.get("defValue"))) {
            	d = el.get("defValue");
                idx = el.get("defIndex");
            } else {
                el.set('value', "").set('realvalue', "").set("code", "").store("allDb", {'code':'','caption':''});
                return;
            }
        }else{
        	var temp = d.value;
    		if($defined(temp)){
    			d = temp;
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
            rv = this.genarateContent(el, obj);
            el.set({'value':this.genarateInputContent(el, obj),'code':d.get('code'),'realvalue':this.genarateContent(el, obj)});
            el.store("allDb", obj);
        } else {
            var data = this.getOptionsData(el,formObj);
            if(!$defined(data))return;
            if($defined(d) || $chk(d)) {
                data.each(function(node) {
                    if($type(node) == 'element') {
                        node = {caption:node.get('caption'),code:node.get('code')};
                    }
                    if(node.code == d) {
                        rv = this.genarateContent(el, node);
                        el.set({'value':this.genarateInputContent(el, node),'code':node.code,'realvalue':this.genarateContent(el, node)});
                        el.store("allDb", node);
                    }
                }, this);
            } else if($defined(idx) || $chk(idx)) {
                var node = data[idx / 1];
                if($defined(node)) {
                    if($type(node) == 'element') {
                        node = {caption:node.get('caption'),code:node.get('code')};
                    }
                    rv = this.genarateContent(el, node);
                    el.set({'value':this.genarateInputContent(el, node),'code':node.code,'realvalue':this.genarateContent(el, node)});
                    el.store("allDb", node);
                }
            }
        }
        return rv;
    },
    getRoot:function(parent,space) {
        while($defined(parent)) {
            var p = space.getElements("*[name='" + parent + "']")[0].get("parent");
            if($defined(p))parent = p; else break;
        }
        return space.getElements("*[name='" + parent + "']")[0];
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(elParent,item,formObj){
    	var elName = item.get('name');
//        var selectObj=pc.getSelect();
//        formObj.setWidget(elName, selectObj);
    	var selectObj = formObj.getWidget(elName);
    	if(!selectObj){
    		selectObj = this.initWidget(elName, formObj)
    	}
        selectObj.setValidate(formObj.Vobj);
        selectObj.box=item;
        if(!selectObj.hasBoxDiv) {
                selectObj.createBoxDiv();
                selectObj.hasBoxDiv = true;
        }
        var elDiv=item.getParent("tr").getElement(".swordselect-selimg");
        selectObj.selDiv=elDiv;
        selectObj.addEventToEl("input");
        selectObj.addEventToEl("div");
        var space = formObj.options.pNode;
        var parent = item.get("parent");
        if($chk(parent)) {
            var pSel = space.getElements("*[name='" + parent + "']")[0];
            pSel.set('child', parent);
            if(!$chk(item.get("dataname"))) {
                var root = this.getRoot(parent,space);
                var dataname = ($chk(root.get("dataname"))) ? root.get("dataname") : root.get("name");
                item.set("dataname", dataname);
            }
        }
        var chds = space.getElements("*[parent]");
        for(var i = 0; i < chds.length; i++) {
            var name = chds[i].get("parent");
            var oj = space.getElement("*[name='" + name + "']");
            if($defined(oj))oj.set("child", chds[i].get("name"));
        }
    },
    initWidget:function(name, formObj){
        var selectObj=pc.getSelect();
        formObj.setWidget(name, selectObj);
        return selectObj;
    }
});
