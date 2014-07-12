/**
 * Created by IntelliJ IDEA. User: gmq Date: 12-10-22 Time: 下午1:53 To change
 * this template use File | Settings | File Templates.
 */
var SwordTextareaTemplate = {
	start : '<table class="swordform_field_wrap" cellspacing="0" cellpadding="0" style="width: 100%;"><tbody><tr><td class="boxtd">'+
		'<textarea widget="textarea" type="textarea" class="swordform_item_oprate swordform_item_textarea" ',
	inp : 'style="{style}" maxlength="{maxlength}" defValue="{defValue}" name="{name}" id="{id}" rule="{rule}" msg="{msg}" ',
	inpend : '>{text}</textarea>',
	end1 : '<div style="color: rgb(51, 51, 51);" class="textarea_maxLength_wrap">您还可以输入<span class="textarea_maxLength_count">',
	end2 : '</span>字</div>',
	end : '</td></tr></tbody></table>',
	render : function(item, formObj, fName, itemData) {// el, formObj, optName
		var tem = [this.start];
		var name = item.get("name"),id = fName + "_" + name,disable=item.get("disable"),readonly=item.get("readonly")||item.getAttribute("readonly"),
		maxlength=item.get("maxlength")||item.getAttribute("maxlength"),defValue=item.get("defValue"),style=item.get("style"),rule=item.get("rule");
		if (disable == 'true') { 
			tem.push(' disabled ');
		}if(readonly=="true") {
			tem.push(" readonly='readonly' ");
		}
		formObj.fieldElHash.set(id,$(id));
		var textavalue=itemData?itemData.value:(defValue||"");
		var maxl=maxlength?maxlength-this.getStringUTFLength(textavalue):0;
		tem.push(this.inp.substitute({
			id : id,
			style:(rule&&rule.contains('must'))&&disable!="true"?style+";background-color:#b5e3df;":style,
			name : name,
			rule : rule,
			defValue : defValue,
			maxlength : maxlength||30000,
			msg : item.get('msg')
		}));
		tem.push(this.inpend.substitute({
			text:textavalue
		}));
		if (maxl!=0) {
			tem.push(this.end1);
			tem.push(maxl>0?maxl:0);
			tem.push(this.end2);
		}
		tem.push(this.end);
		return tem.join("");
	},
	initData : function(el, elData, fmtObj) {
		if (!$defined(elData))
			elData = "";
		var temp = elData.value;
		if ($defined(temp)) {
			elData = temp;
		}
		elData = elData.replace(/&apos;/g, "'");
		el.set("value", elData).set("realvalue", elData);
		if ($defined(el.get("maxLength")))
			this.maxLengthCount(el);
	}
	,getStringUTFLength : function(str) {
		var v = str.replace(/[\u4e00-\u9fa5]/g, "  "); // 在swordform_extend.js中修改为一个汉字占三个字符。
		return v.length;
	}
	,initWidget : function(name, idEl,formObj) {
		var el = $$("div[name=" + name + "]")[0];
		var ta = new Textarea(el);
		ta.box = idEl;
		ta.parent=formObj;
		ta.countSpan = idEl.getNext()?idEl.getNext().getElement('span.textarea_maxLength_count'):null;
		formObj.setWidget(name, ta);
		return ta;
	}
	,runEventFocus:function(e,el,formObj){
		var tObj=formObj.getField(el.get("name"));
		if(tObj.countSpan)tObj.maxLengthCount(e);
    }
    ,runEventClick:function(e,el,formObj){
		//触发原始click之后调用focus逻辑.
    	this.runEventFocus(e,el,formObj);
	}
    ,runEventBlur:function(e,el,formObj){
    	if(el.get("rule")){
    		formObj.Vobj.validate(el);
    	}
    	this.runEventFocus(e,el,formObj);
    }
    ,runEventDblClick:function(){
    	return;
    }
    ,runEventKeydown:function(e,el,formObj){
    	return;
    }
    ,runEventKeyup:function(e,el,formObj){
    	this.runEventFocus(e,el,formObj);
    }
};
