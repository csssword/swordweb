/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordTextTemplate = {
    start: '<div class="swordform_field_wrap"><input type="text" style="float:left;',
    inp: ' defValue="{defValue}" maxlength="{maxlength}" msg="{msg}" value="{value}" name="{name}" id="{id}" rule="{rule}" format="{format}" onchange="{onchange}"' +
        ' oValue="{realvalue}" realvalue="{realvalue}" class="swordform_item_oprate swordform_item_input" _onclick="{onclick}" _ondblclick="{ondblclick}" _onfocus="{onfocus}"  _onkeydown="{onkeydown}" _onkeyup="{onkeyup}" _onblur="{onblur}" ' ,
    end: '></div>',
    render: function (item,formObj,fName,itemData) {
        var tem = [this.start];
        var style = item.get("style"),tipTitle=item.get("tipTitle"),rule=item.get('rule'),readonly=item.get("readonly")||item.getAttribute("readonly");
        var name = item.get("name"),id = fName + "_" + name,dv = item.get("defValue"),formatV=item.get("format"),disable=item.get("disable");
        if ($defined(style)) {
            tem.push(style);
        }
        if ((rule&&rule.contains('must'))&&disable!="true") {
            tem.push(";background-color:#b5e3df;");
        }
        tem.push("\"");
        var textValue=itemData?itemData.value:(dv||""),realvalue=textValue;
		if(formatV&&textValue){
			textValue=sword_fmt.formatText(item, textValue, '', formatV).value;
		}
        var t = [this.inp.substitute({
            id: id,
            name: name,
            rule: rule,
            realvalue:realvalue,
            value:textValue,
            defValue: dv,
            format:formatV,
            tipTitle:tipTitle,
            maxLength: item.get("maxlength"),
            msg: item.get('msg')
            ,onchange:item.get("onchange")
            ,onkeydown : item.get("onkeydown")
            ,onkeyup : item.get("onkeyup")
            ,onfocus : item.get("onfocus")
            ,onblur : item.get("onblur")
            ,onclick:item.get("onclick")
			,ondblclick:item.get("ondblclick")
        }), " format=\"", item.get('format'), "\" "];
        if (disable == 'true') {
            t[0] = t[0].replace("swordform_item_oprate swordform_item_input", "swordform_item_oprate swordform_item_input swordform_item_input_disable");
            t.push(' disabled ');
        }
        if (readonly == "true"){t.push(" readonly='readonly' ");}
        tem.push(t.join(""));
        tem.push(this.end);
        formObj.fieldElHash.set(id,$(id));
        return tem.join("");
    },
    initData: function (el, elData, formObj) {
        if (!$defined(elData))elData = "";
        var temp = elData.value;
        if ($defined(temp)) {
            elData = temp;
        }
        el.set('value', elData);
    }
    ,runEventFocus:function(e,el,formObj){
    	var blur = el.get('_onfocus');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
        var real=el.get("realvalue");
        if(el.get("format")&&real){
        	el.set("value",real);
        }
        formObj.setSRang4El(el);
    }
    ,runEventClick:function(e,el,formObj){
		//触发原始click之后调用focus逻辑.
    	var blur = el.get('_onclick');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
        this.runEventFocus(e, el, formObj);
	}
    ,runEventBlur:function(e,el,formObj){
    	var blur = el.get('_onblur');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
        if(el.get("rule")){formObj.Vobj.validate(el);}
        if(el.get("format")){
        	formObj.initFormatVal(el);
        }else{
        	el.set("realvalue",el.get("value"));
        }
    }
    ,runEventDblClick:function(e,el,formObj){
    	var blur = el.get('_ondblclick');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
    }
    ,runEventKeydown:function(e,el,formObj){
    	var blur = el.get('_onkeydown');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
    }
    ,runEventKeyup:function(e,el,formObj){
    	var blur = el.get('_onkeyup');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
    }
};
