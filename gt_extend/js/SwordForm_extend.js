SwordForm.prototype.options.vType = 'fldiv';
SwordForm.prototype.options.requiredSign = 'caption';
SwordForm.prototype.options.isShowTogdiv = 'true';
SwordForm.prototype.dftsize.FiledWidth = "";
Textarea.prototype.defWidth = '100%';
Textarea.prototype.defHeight = '';
Textarea.implement({
    getStringUTFLength:function(str) {
        var v = str.replace(/[\u4e00-\u9fa5]/g, "   ");  //修改为一个汉字占三个字符。
        return v.length;
    }
});
i18n.nullStr='(汉字占3个字符)';


//申报表大表单用例专用Form组件
var SwordForm_plex = new Class({
    Implements:[Events, Options],
    Extends:PageContainer,
    name:'SwordForm',
    $family:{name:'SwordForm'},
    options:{
        sword:null,
        name:null,
        caption:null,
        layout:null,
        pNode:null,
        userDefine:true,
        onFinish:$empty
    },
    fieldElHash:[],
    blurEHash:new Hash(),
    tempArr:[],
    s:"<tr>",
    e:"</tr>",
    panel:"<div align='center' class='swordfrom_wrap_div'><div class='swordform-panel-box'><div class='swordform-panel-tl'></div><div class='swordform-panel-tr'></div><div class='swordform-panel-title'><div class='x-tool' title='收缩' id='{panelID}'></div>{caption}</div></div></div>",
    inp:"<td colspan='{colspan}' style='{style}'><div class='swordform_field_wrap'><input type='text' defValue='{defValue}' rule='{rule}' value='{defValue}' msg='{msg}' style='float:left;{css}' id='{id}' name='{name}' class='swordform_item_oprate swordform_item_input' ",
    inpe:"></div></td>",
    initParam:function (htmlNode) {
        var me = this;
        me.htmlOptions(htmlNode);
        me.Vobj = pc.widgetFactory.create('SwordValidator');
        me.Vobj.initParam('intime');
        me.buildHTML();
        me.bindEvents.delay(50, me);
    },
    buildHTML:function () {
        var tem = this.tempArr, me = this;
        tem.push(me.panel.substitute({caption:me.options.caption, panelID:"SwordFromPanel_" + me.options.name}));
        var tb = me.options.pNode.getChildren();
        var hidden=[];
        tb.each(function(item, index) {
        	if(item.get("tag")=="div"){
        		if($chk(item.get('type')) && item.get('type')=='hidden'){
        			 hidden.include(item);
        		}else{
        			tem.push(item.outerHTML);
        		}
        	}else{
        		this.buidTable(item);
        	}
        }.bind(this));
        if(hidden.length > 0){
        	tem.push("<div style='display: none;'>");
        	 for(var i=0;i<hidden.length;i++){
        		 tem.push(hidden[i].outerHTML);
        		 tem.push("<table class='swordform_field_wrap' cellspacing='0' cellpadding='0'><tbody><tr><td class='boxtd'>");
        		 me.createEl['hidden'].run(hidden[i], me);
        		 tem.push("</td></tr></tbody></table>");
             }
        	 tem.push("</div>");
        }
        me.render();
    },
    buidTable:function(tb){
    	var tem = this.tempArr, me = this;
    	 tem.push("<table class='tab_form' width='{w}' id='{id}' border='0' cellpadding='0' cellspacing='0' style='{style}'>".substitute({w:tb.get('width'), id:tb.get('id'), style:tb.get("style")}));
         var cg = tb.getFirst();
         if (cg.tagName.toLowerCase() == 'colgroup') {
             tem.push('<colgroup>');
             tem.push(cg.innerHTML);
             tem.push('<colgroup>');
         }
         var trs = tb.getFirst('tbody').getChildren('tr');
         tem.push('<tbody>');
         var tr = trs[0], tds, i, tag, d, type;
         while (tr) {
             var subid = tr.get('id');
             if($chk(subid)){
                 tem.push("<tr style='{style}' id='{id}'>".substitute({style:tr.get('style'), id: subid}));
             }else{
                 tem.push("<tr style='{style}'>".substitute({style:tr.get('style')}));
             }
             tds = tr.getChildren();
             for (i = 0; i < tds.length; i++) {
                 tag = tds[i].tagName.toLowerCase();
                 if (tag == 'th') {
                     tem.push(("<th style='{style}' colspan='{c}' rowspan='{r}' >" + tds[i].innerHTML + "</th>").substitute({c:tds[i].get('colspan'), r:tds[i].get('rowspan'), style:tds[i].get('style')}));
                 } else {
                     d = tds[i].getFirst();
                     if (d != null) {
                    	 type = d.get('type');
                    	 if(type != null && type !="hidden"){
                    		 me.createEl[type].run(d, me);
                    	 }else{
                    		 var id = me.options.name + '_' + d.get('name');
                    		 d.setAttribute("id", id);
                    		 tem.push(d.outerHTML);
                    	 }
                     } else {
                         me.createEl['def'].run(tds[i], me);
                     }
                 }
             }
             tem.push('</tr>');
             tr = tr.getNext('tr');
         }
         tem.push('</tbody></table>');
    },
    dealEvts:function (el,id) {
        var re = [], es;
        var my=this;
        ['onblur'].each(function (e) {
            es = el.get(e);
            if (es)my.blurEHash.set(id,es);
        });
    },
    createEl:{
        text:function (el) {
            var me = this;
            var id = me.options.name + '_' + el.get('name');
            me.fieldElHash.push(id);
            var t = [me.inp.substitute({
                colspan:el.getParent("td").get("colspan"),
                style:el.getParent("td").get("style"),
                id:id,
                name:el.get('name'),
                rule:el.get('rule'),
                biztid:el.get('biztid'),
                bizctrl:el.get('bizctrl'),
                css:el.get('css'),
                defValue:el.get('defValue'),
                maxLength:10000,
                msg:el.get('msg')
            }), " submitformat=\"", el.get('submitformat'), "\" dataformat=\"", el.get('dataformat'), "\" format=\"", el.get('format'), "\" "];
            me.dealEvts(el,id);
            if ((el.get('disabled') == true)){
                t[0]=t[0].replace("swordform_item_oprate swordform_item_input","swordform_item_oprate swordform_item_input swordform_item_input_disable");
                t.push(' disabled ');
            }
            if(el.readonly=="readonly")t.push(" readonly='readonly' ");
            t.push(me.inpe);
            me.tempArr.push(t.join(""));
        },
        def:function (el) {
            this.tempArr.push("<td>" + el.innerHTML + "</td>");
        },
        date:function(el){
            var me = this;
            var id = me.options.name + '_' + el.get('name');
            me.fieldElHash.push(id);
            var tempDateStr="<td colspan='{colspan}' style='{style}'><table class='swordform_field_wrap' cellspacing='0' cellpadding='0'><tbody><tr><td><input class='swordform_item_oprate swordform_item_input' id='{id}'  type='text' rule='{rule}' widget='calendar' name='{name}' dataformat='{dataformat}' widgetgetvalue='true' returnrealvalue='false' showoptions='{showOptions}' isshowclosebtn='false' isshowerasebtn='false' isshowtodaybtn='false' isshow='true' _onchange='{onchange}' tozero='false' autoctrl='true' style='float: left; width: 100%;{css}' ovalue='{defValue}' value='{defValue}' ></td><td class='dateBtn' width='17px'><div style='width:17px'></div></td></tr></tbody></table></td>";
            var tempccc=tempDateStr.substitute({    //替换固定元素字符串的相关属性
                id:id,
                colspan:el.getParent("td").get("colspan"),
                onchange:el.get('onchange'),
                style:el.getParent("td").get("style"),
                name:el.get('name'),
                rule:el.get('rule'),
                css:el.get('css'),
                defValue:el.get('defValue'),
                value:el.get("realvalue")||el.get("defValue"),
                ovalue:el.get("defValue")||' ',
                dataformat:el.get("dataformat")||"yyyy-MM-dd",
                maxLength:10000,
                showOptions:el.get('showOptions')||'true,true,true,false,false,false'
            });
            me.tempArr.push(tempccc);
        },
        select:function(el){
            var me = this;
            var id = me.options.name + '_' + el.get('name');
            me.fieldElHash.push(id);
            me.tempArr.push("<td colspan='{colspan}' style='{style}'>".substitute({colspan:el.getParent("td").get("colspan"),style:el.getParent("td").get("style")}));
            var tempSelectStr="<table class='swordform_field_wrap' cellspacing='0' cellpadding='0'><tbody><tr><td><input class='swordform_item_oprate swordform_item_input' captionSign='{captionSign}' codesign='{codesign}' pcodeSign='{pcodeSign}' id='{id}' type='text' widget='select' name='{name}' lines='10' lineheight='21' dataname='{dataname}' rule='{rule}'  defValue='{defValue}'  value='{value}' inputdisplay='{inputdisplay}' popdisplay='{popdisplay}' realvalue='{realvalue}' ovalue='{ovalue}' _onchange='{onchange}' cacheSelected='{cacheSelected}' dataFilter='{dataFilter}'  vtype='fldiv' style='width: 100%; float: left;' displaycode='{displaycode}' handinput='{handinput}' addallitem='{addallitem}'  allitemcode='{allitemcode}'></td><td class='swordselect-selimg' vtype='fldiv' width='17px'><div style='width:17px' ></div></td></tr></tbody></table>"
            var tempccc=tempSelectStr.substitute({    //替换固定元素字符串的相关属性
                id:id,               
               name:el.get('name'),
                dataFilter:el.get('dataFilter'),
                onchange:el.get('onchange'),
                rule:el.get('rule'),
                defValue:el.get('defValue'),
                value:el.get("realvalue")||el.get("defValue"),
                realvalue:el.get("realvalue")||el.get('value'),
                ovalue:el.get("defValue")||' ',
                maxLength:10000,
                dataname:el.get('dataname'),
                displayCode:el.get('displayCode'),
                handinput:el.get('handinput'),
                addAllItem:el.get('addAllItem'),
                allItemCode:el.get('allItemCode'),
		        popdisplay:el.get('popdisplay'),
		        inputdisplay:el.get('inputdisplay'),
		        codesign:el.get('codeSign')||'code',
		        captionSign:el.get('captionSign')||'caption',
		        pcodeSign:el.get('pcodeSign')||'pcode',
		        cacheSelected:el.get('cacheSelected')
            });
            me.tempArr.push(tempccc);
            if($chk(el.innerHTML)){
            	me.tempArr.push(el.outerHTML);
            }
            me.tempArr.push("</td>");
        },
        hidden:function(el){
        	var me = this;
        	 var id = me.options.name + '_' + el.get('name');
        	 me.fieldElHash.push(id);
        	var tempStr="<input id='{id}' class='swordform_item_oprate swordform_item_input' type='hidden' name='{name}' value='{value}' defvalue='{defValue}' ovalue='{ovalue}'>";
        	var tempccc=tempStr.substitute({    //替换固定元素字符串的相关属性
                 id:id,
                 name:el.get('name'),
                 defValue:el.get('defValue'),
                 value:el.get("realvalue")||el.get("defValue"),
                 ovalue:el.get("defValue")||' '
             });
             me.tempArr.push(tempccc);
        }
    },
    render:function () {
        this.options.pNode.innerHTML = this.tempArr.join('');
    },
    bindEvents:function () {
        var me = this, el;
        me.addPanelEvt();
        for (var i = 0; i < me.fieldElHash.length; i++) {
            el = $(me.fieldElHash[i]);
            if (!el.disabled) {
                el.addEvent('keyup', me.focus.bind(me));
                var type=el.get("widget")?el.get("widget").toLowerCase():"text";
                me.addElEvent(el,type);
                me.addElEventFType[type].run(el,me);
            }
        }
    },
    addPanelEvt:function () {
        var me = this;
        $("SwordFromPanel_" + me.options.name).addEvent('click', function (e) {
            var tar = new Event(e).target;
            var div = this.options.pNode.getChildren('table');
            if (tar.hasClass('x-tool-s')) {
                tar.set('title', '收缩');
                tar.removeClass("x-tool-s");
                this.options.pNode.getElement("div.swordform-panel-box").setStyle('border-bottom', 'none');
                div.each(function (item) {
                    if (item.hasClass('x-tool-dis') && item.getStyle("display") == "none") {
                        item.setStyle("display", "");
                        item.removeClass('x-tool-dis');
                    }
                }.bind(this));
            } else {
                tar.set('title', '展开');
                tar.addClass("x-tool-s");
                this.options.pNode.getElement("div.swordform-panel-box").setStyle('border-bottom', '1px #7F9DB9 solid');
                div.each(function (item) {
                    if (item.getStyle("display") != "none") {
                        item.setStyle("display", "none");
                        item.addClass('x-tool-dis');
                    }
                }.bind(this));
            }
        }.bind(this));
    },
    addElEvent:function (el,type) {
        var me = this;
        var r = el.get('rule');
        r = $defined(r) && r != '';
        if(type=="text")me.format(el);
        if (r)this.Vobj._add(el);
    },
    addElEventFType:{           //根据类型给元素添加事件
        text:function(el){

        },
        calendar:function(el){
            var elDiv=el.getParent("tr").getElement(".dateBtn");
            var dateObj=pc.getCalendar();
            dateObj.setValidate(this.Vobj);
            dateObj.dateInput=el;
            dateObj.dateBtn=elDiv;
            if($chk(el.get("_onchange"))){
            	dateObj.dateInput.store('onChange', el.get("_onchange"));
            }
            dateObj.addEventToEl("input");
            dateObj.addEventToEl("div");
        },
        select:function(el){
            var elDiv=el.getParent("tr").getElement(".swordselect-selimg");
            var selectObj=pc.getSelect();
            selectObj.setValidate(this.Vobj);
            selectObj.box=el;
            var nEl = el.getParent("table").getNext();
            if(nEl){
            	selectObj.box.store('data', nEl.getChildren("div"));
            }
            if($chk(el.get("_onchange"))){
            	selectObj.box.store('onChange', el.get("_onchange"));
            }
            if(!selectObj.hasBoxDiv) {
                selectObj.createBoxDiv();
                selectObj.hasBoxDiv = true;
            }
            selectObj.selDiv=elDiv;
            selectObj.addEventToEl("input");
            selectObj.addEventToEl("div");
        }
    },
    initData:function (d) {
        if (!$chk(d))return;
        var me = this, n;
        d = d.data;
        me.fieldElHash.each(function (id) {
            n = $(id).get('name');
            if (d[n]) {
                me.setValue(n, d[n].value);
            }
        }.bind(me));
    },
    focus:function (e) {
        var me = this.fieldElHash;
        e = new Event(e);
        if (e.key == 'enter') {
            var idx = me.indexOf(e.target.get('id'));
            if (idx == me.length - 1)return;
            var tar = null;
            while (idx < me.length && tar == null) {
                idx++;
                var temp = $(me[idx]);
                if ($chk(temp)&&this.focusable(temp))tar = temp;
                else tar = null;
            }
            if (tar) {
                tar.focus();
                tar.click();
            } else {
                e.target.blur();
            }
        }
    },
    isHide:function(el) {
        return el.getHeight() == 0 && el.getWidth() == 0;
    },
    focusable:function(tar) {
        return !(this.isHide(tar) || tar.get('disabled') || tar.get('readonly') || tar.get('_show') == 'false' || ['file','hidden'].contains(tar.get('type')) || !['input','textarea','file'].contains(tar.get('tag')));
    },
    format:function (el) {
        var me = this;
        el.addEvents({
            'focus':function () {
				if(el.get("format")){el.set('value', el.get('oValue') || el.get('defValue'));}
				el.select();
            }.bind(me),
            'blur':function () {
                me.initFormatVal(el);
                var userBlurE=this.blurEHash.get(el.get("id"));
                if(userBlurE)sword_getFunc(userBlurE)[0](el);
            }.bind(me)
        });
    },
    initFormatVal:function (el) {
        var me = this;
        if (!(!el.get('format') && !el.get('submitformat'))) {
            el.set({'oValue':el.get('value'), 'value':me.getFormatVal(el)});
            el.set('realvalue', me.getFormatVal(el, "submitformat"));
        }
    },
    getFormatVal:function (el, bz) {
        var format = el.get(bz);
        if (!$defined(bz))format = el.get("format");
        if (!$defined(format))return el.get("oValue");
        return sword_fmt.formatText(el, (el.get('tag') == 'label') ? el.get('text') : el.get('value'), '', format).value;
    },
    resetAll:function (ncps) {
        ncps = ncps || [];
        var me = this, el;
        me.fieldElHash.each(function (id) {
            if (ncps.indexOf(id) == -1) {
                el = $(id);
                el.set({'value':'', 'text':'', 'oValue':''});
                if (el.get('realvalue')) {
                    el.set({"code":"", 'realvalue':''});
                }
                var dv = el.get("defValue");
                if (dv != null)
                    me.setValue(el.get("name"), dv);
            }
        }.bind(me));
    },
    setValue:function (k, v) {
        var me = this;
        var el = me.getField(k);
        if (!el)return;
        el.set('value', v);
        var type=this.getElType(el);
        if(type=="select"){
        	var sel=pc.getSelect();
        	 sel.box=el;
        	 var nEl = el.getParent("table").getNext();
        	 if(nEl){
        		 sel.box.store('data', nEl.getChildren("div"));
        	 }
        	 sel.initData(v,el);
        }else if(type=="calendar"){
        	pc.getCalendar().initData(v,el);
        }
        me.initFormatVal(el);
    },
    getField:function (k) {
        return $(this.options.name + '_' + k);
    },
    getSubmitData:function () {
        var me = this;
        var re = {'beanname':me.options.beanname, 'sword':'SwordForm', 'name':me.options.name, 'data':{}};
        var el;
        me.fieldElHash.each(function (id) {
            el = $(id);
            re.data[el.get('name')] = {'value':el.get('realvalue') || el.get('value')}
        }.bind(me));
        return re;
    },
    validate:function (k) {
        var me = this, el, re = true;
        var t = ($chk(k)) ? [me.options.name + '_' + k] : me.fieldElHash;
        t.each(function (id) {
            el = $(id);
            if ($chk(el.get('rule'))) {
                if (!me.Vobj.validate(el))re = false;
            }
        });
        return re;
    },
    isHasFile:function () {
        return false;
    },
    getValue:function (k) {
        var el = this.getField(k);
        return (el) ? (el.get("realvalue") || el.get("value")) : null;
    },
    disable:function(names){
        if($type(names) == 'string')names = [names];
        names = names || this.fieldElHash;
       names.each(function(idStr) {
            var el = $(this.options.name + '_' + idStr)||$(idStr);
            var type=this.getElType(el);
            if(type=="select"||type=="calendar") {
                if(type=="calendar"){
                    el.set('disabled', true).addClass("calendar_input_disable");
                    var dateBtn=el.getParent().getNext();
                    if (el.cloneFlag) {
                        dateBtn.setStyle('display', '');
                        dateBtn.getNext().setStyle('display', 'none');
                    } else {
                        dateBtn.clone().addClass('dateBtn_disable').inject(dateBtn, 'before');
                        dateBtn.setStyle('display', 'none');
                        el.cloneFlag = true;
                    }
                }else{
                    el.set('disabled', 'true').addClass('select_input_disable');
                    var sel = el.getParent().getNext();
                    if(el.cloneFlag) {
                        sel.setStyle('display', '');
                        sel.getNext().setStyle('display', 'none');
                    } else {
                        sel.clone().addClass('swordselect-selimg-disable').inject(sel, 'before');
                        sel.setStyle('display', 'none');
                        el.cloneFlag = true;
                    }
                }
            } else {
                el.set('disabled', 'true').addClass('swordform_item_input_disable');
            }
        }.bind(this));
    },
    enable:function(names){
        if($type(names) == 'string')names = [names];
        names = names ||this.fieldElHash;
        names.each(function(idStr) {
            var el = $(this.options.name + '_' + idStr)||$(idStr);
            var type=this.getElType(el);
            if(type=="select"||type=="calendar") {
                if(type=="calendar"){
                    el.erase('disabled').removeClass('calendar_input_disable');
                    var dateBtn=el.getParent().getNext();
                    dateBtn.setStyle('display', 'none');
                    dateBtn.getNext().setStyle('display', '');
                }else{
                    var sel = el.getParent().getNext();
                    el.erase('disabled').removeClass('select_input_disable');
                    sel.setStyle('display', 'none');
                    sel.getNext().setStyle('display', '');
                }
            } else {
                el.erase('disabled').removeClass('swordform_item_input_disable');
            }
        }.bind(this));
    },
    getElType:function (el){
        return  el.get("widget")?el.get("widget").toLowerCase():"text";
    }
});