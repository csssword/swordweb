/**
 * 下拉列表的模板引擎
 */
var SwordSelectTemplate = {
    // 下拉的HTML结构
    'pre':'<table class="swordform_field_wrap" cellspacing="0" cellpadding="0"><tbody><tr><td><input type="text" widget="select"',
    'end1':' ></td><td ',
    'end2':	'width="17px" vtype="fldiv"><div style="width:17px;"></div></td></tr></tbody></table>',
    // 日期属性
    'attr':'id="{id}" name="{name}" rule="{rule}"  msg="{msg}" realvalue="{realvalue}" code="{code}" ' +
    		'sbmitcontent="{sbmitcontent}" codeSign="{codeSign}" captionSign="{captionSign}" pcodeSign="{pcodeSign}" _onChange="{onChange}"' +
    		' _onSelect="{onSelect}" onShow="{onShow}" onHide="{onHide}"' +
    		' onSubmitBefore="{onSubmitBefore}" value="{value}" parent="{parent}"' +
    		' lines="{lines}" lineheight="{height}" dataname="{dataname}"' +
    		' pcode="{pcode}" tid="{tid}" defValue="{defValue}" defIndex="{defIndex}" ' +
    		'dataFilter="{dataFilter}" style="float: left;" popWidth="{popWidth}"' +
    		' displayCode="{displayCode}" inputdisplay="{inputdisplay}" popdisplay="{popdisplay}" ' +
    		'handInput="{handInput}" addAllItem="{addAllItem}" allItemCode="{allItemCode}" allItemCap="{allItemCap}"',
    render:function (item, formObj, fName, itemData) {
    	var tem = [this.pre],sbmitcontent=item.get("sbmitcontent"),realvalue="",showvalue="",code="",inputdisplay=item.get("inputdisplay");
    	 var name = item.get("name"),id = fName + "_"+name,dataname=item.get("dataname")||item.get("dataName"),
    	 defv=item.get("defValue"),defi=item.get("defIndex"),readonly=item.get("readonly")||item.getAttribute("readonly"),
    	 disable = item.get("disable"),rule = item.get("rule"),codeSign=item.get("codeSign")||'code',
    	 captionSign=item.get("captionSign")||'caption',pcodeSign=item.get("pcodeSign")||'pcode';
    	 formObj.fieldElHash.set(id,$(id));
    	 if(readonly=="true"){
    	 	tem.push('readonly="true" ');
    	 }
    	 if(disable == "true"){
    	 	tem.push('disabled  class="swordform_item_oprate swordform_item_input select_input_disable" style="float:left;cursor:default;"');
    	 }else if((rule&&rule.contains('must'))&&disable!="true"){
    	 	tem.push('style="float:left;background-color:#b5e3df;" class="swordform_item_oprate swordform_item_input"');
    	 }else{
    	 	tem.push('style="float: left;" class="swordform_item_oprate swordform_item_input"');
    	 }
    	 /*
    	  * 数据处理
    	  */
    	 var sValue=itemData?(itemData.value||""):(defv||""),sDObj;
    	 if(sValue.contains("code")&&sValue.contains("caption")){
    		 sDObj=JSON.decode(sValue);
    		 showvalue=sDObj.caption;
			 code=realvalue=sDObj.code;
    		 if(sbmitcontent){
    			 realvalue=sbmitcontent.substitute(sDObj);
    		 }
    		 if(inputdisplay){
    			 showvalue=inputdisplay.substitute(sDObj);
    		 }
    	 }else {
    		 var d= pc.getInitDataByDataName(dataname)||pageContainer.getInitData(name),datasA;
    		 if(d&&d.data){
    			 datasA=d.data;
    			 sDObj=datasA.filter(function(item){return item.code==sValue;})[0];
    		 }else{
    			 datasA=item.getChildren(">div");
    			 sDObj=datasA.filter(function(item){return item.get("code")==sValue;})[0];
    			 if(sDObj){sDObj={"code":sDObj.get("code"),"caption":sDObj.get("caption")};}
    		 }
    		 if(sValue&&sDObj){
    			 showvalue=sDObj.caption;
    			 code=realvalue=sDObj.code;
    			 if(sbmitcontent){
        			 realvalue=sbmitcontent.substitute(sDObj);
        		 }
        		 if(inputdisplay){
        			 showvalue=inputdisplay.substitute(sDObj);
        		 }
    		 }/*else{
    			 var tData=datasA.filter(function(item,index){return index==defi;})[0];
    			 if(sDObj){sDObj={"code":sDObj.get("code"),"caption":sDObj.get("caption")};}
    		 }*/
    	 }
    	 var t = this.attr.substitute({
                id:id,
                name:name,
                rule:item.get('rule'),
                msg:item.get('msg'),
                prikey:item.get('prikey'),
                sbmitcontent:sbmitcontent,
                onChange:item.get("onChange"),
                onSelect:item.get("onSelect"),
                onShow:item.get("onShow"),
                onHide:item.get("onHide"),
                onSubmitBefore:item.get("onSubmitBefore"),
                value:showvalue,//todo
                realvalue:realvalue,
                code:code,
                codeSign:codeSign,
                captionSign:captionSign,
                pcodeSign:pcodeSign,
                parent:item.get("parent"),
                lines:item.get("lines")||10,
                height:item.get("height")||21,
                dataname:dataname,
                pcode:item.get("pcode"),
                tid:item.get("tid"),
                defValue:defv,
                defIndex:defi,
                dataFilter:item.get("dataFilter"),
                popWidth:item.get("popWidth"),
                displayCode:item.get("displayCode")||"false",
                inputdisplay:inputdisplay,
                popdisplay:item.get("popdisplay"),
                handInput:item.get('handInput')||"false",
                addAllItem:item.get('addAllItem')||"false",
                allItemCode:item.get("allItemCode"),
                allItemCap:item.get("allItemCap")
            });
            tem.push(t);
            tem.push(this.end1);
            tem.push(' class="swordselect-selimg');
            if(disable == "true"){
            tem.push(" swordselect-selimg-disable");
            }
            tem.push("\"");
            tem.push(this.end2);
            if($chk(item.innerHTML)){
                tem.push(item.outerHTML);
            }
        return tem.join("");
    }
    ,
    isMulti:function(item, data) {
       /* if(!$defined(data)) {
            return $defined(item.get('child')) || $defined(item.get('parent'));
        }*/
        return $defined(item.get('child')) || $defined(item.get('parent'));
    },
    
    genarateContent:function(el,obj, content) {
        if(!$defined(content))
            content = el.get('sbmitcontent');
        if(!$defined(content)) {
            content = "{"+el.get("codeSign")+"}";
        }
        if($type(obj) == "element") {
            obj = {'code':obj.get("code"),"caption":obj.get("caption")};
        }
        return content.substitute(obj);
    },genarateInputContent:function(el, obj) {
        var content = el.get('inputdisplay');
        if(!$defined(content)){
        	content = "{"+el.get("captionSign")+"}";
        return obj[el.get('captionSign')];
        }else{
        	return this.genarateContent(el,obj, content);
        }
    },
    initData:function (el, d, formObj) {
    	var idx="";
    	if(!$chk(d)){
            if($defined(item.get("defIndex")) || $defined(item.get("defValue"))) {
            	d = item.get("defValue");
                idx = item.get("defIndex");
            } else {
                item.set('value', "").set('realvalue', "").set("code", "").store("allDb", {'code':'','caption':''});
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
        var rv="";
        if($type(d) == "hash") {
            var obj = {};
            d.each(function(v, k) {
                obj[k] = v;
            }, this);
            rv = this.genarateContent(el, obj);
            item.set({'value':this.genarateInputContent(el, obj),'code':d.get('code'),'realvalue':this.genarateContent(el, obj)});
            item.store("allDb", obj);
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
                        item.set({'value':this.genarateInputContent(el, node),'code':node.code,'realvalue':this.genarateContent(el, node)});
                        item.store("allDb", node);
                    }
                }, this);
            } else if($defined(idx) || $chk(idx)) {
                var node = data[idx / 1];
                if($defined(node)) {
                    if($type(node) == 'element') {
                        node = {caption:node.get('caption'),code:node.get('code')};
                    }
                    rv = this.genarateContent(el, node);
                    item.set({'value':this.genarateInputContent(el, node),'code':node.code,'realvalue':this.genarateContent(el, node)});
                    item.store("allDb", node);
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
    ,initWidget:function(name,idEl, formObj){
        var selectObj=pc.getSelect();
        formObj.setWidget(name, selectObj);
        selectObj.setValidate(formObj.Vobj);
        selectObj.box=idEl;
        if(!selectObj.hasBoxDiv) {
                selectObj.createBoxDiv();
                selectObj.hasBoxDiv = true;
        }
        var elDiv=idEl.getParent("tr").getElement(".swordselect-selimg");
        selectObj.selDiv=elDiv;
        var space = formObj.options.pNode;
        var parent = idEl.get("parent");
        if($chk(parent)) {
            var pSel = space.getElements("*[name='" + parent + "']")[0];
            pSel.set('child', parent);
            if(!$chk(idEl.get("dataname"))) {
                var root = this.getRoot(parent,space);
                var dataname = ($chk(root.get("dataname"))) ? root.get("dataname") : root.get("name");
                item.set("dataname", dataname);
            }
        }
        var chds = space.getElements("*[parent]"),cl=chds.length;
        for(var i = 0; i < cl; i++) {
            var temc=chds[i],name = temc.get("parent");
            var oj = space.getElement("*[name='" + name + "']");
            if($defined(oj))oj.set("child", temc.get("name"));
        }
        return selectObj;
    }
    ,runEventFocus:function(e, el, formObj){
    	//触发原始focus事件,然后调用show逻辑
    	var name=el.get("name"),cObj=formObj.getField(name);
    	cObj.box=el;
    	cObj.selDiv=el.getParent("tr").getElement(".swordselect-selimg");
    	cObj.show();
    }
    ,runEventClick:function(e, el, formObj){
		//触发原始click之后调用focus逻辑.
    	this.runEventFocus(e, el, formObj);
	}
    ,runEventBlur:function(e, el, formObj){
    	//触发原始blur之后调用hide逻辑.rule。
    	/*var rule=el.get("rule");*/
    	/*var name=el.get("name"),cObj=formObj.getField(name);
    	cObj.hide.delay(120,cObj);*/
    }
    ,runEventDblClick:function(){
    	return;//不处理
    }
    ,runEventKeydown:function(){
    	//todo下拉列表数据过滤
    	return;
    }
    ,runEventKeyup:function(e, el, formObj){
    	var name=el.get("name"),cObj=formObj.getField(name);
    	cObj.change_item_on_keyup(e);
    }
};