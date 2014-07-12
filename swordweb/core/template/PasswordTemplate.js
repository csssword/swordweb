/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordPasswordTemplate = {
    start:'<div class="swordform_field_wrap"><input type="password" id="{id}" name="{name}" style="float:left;{style}" rule="{rule}" msg="{msg}" value="{value}" realvalue="{value}" _onfocus="{onfocus}" defValue="{defValue}" _onclick="{onclick}"  _onblur="{onblur}" class="swordform_item_oprate swordform_item_input"',
    end:'></div>',

    render:function (item,formObj,fName,itemData) {
    	var name = item.get("name"),id=fName + "_"+name,rule=item.get("rule"),msg=item.get("msg"),style=item.get("style");
    	var defValue=item.get("defValue"),readonly=item.get("readonly")||item.getAttribute("readonly"),disable=item.get("disable");
    	var stylestr=style?style:"";
    	if((rule&&rule.contains('must'))&&disable!="true"){stylestr=stylestr+";background-color:#b5e3df;";}
    	var t=[this.start.substitute({
            id: id,
            style:stylestr,
            name: name,
            rule: rule,
            msg: msg,
            value:itemData?itemData.value:defValue
            ,onfocus : item.get("onfocus")
            ,onblur : item.get("onblur")
            ,onclick:item.get("onclick")
        })];
    	formObj.fieldElHash.set(id,$(id));
    	if ( disable == 'true') {
            t[0] = t[0].replace("swordform_item_oprate swordform_item_input", "swordform_item_oprate swordform_item_input swordform_item_input_disable");
            t.push(' disabled ');
        }
    	if (readonly == "true"){t.push(" readonly='readonly' ");}
    	t.push(this.end);
    	return t.join("");
    }
	,initData:function(el,elData,fmtObj){
		el.set("value",elData.value).set("realvalue",elData.value);
    }
   
    ,runEventFocus:function(e,el,formObj){
    	SwordTextTemplate.runEventFocus(e,el,formObj);
    }
    ,runEventClick:function(e,el,formObj){
		//触发原始click之后调用focus逻辑.
    	SwordTextTemplate.runEventClick(e,el,formObj);
	}
    ,runEventBlur:function(e,el,formObj){
    	SwordTextTemplate.runEventBlur(e,el,formObj);
    }
    ,runEventDblClick:function(){
    	return;//不处理
    }
    ,runEventKeydown:function(){
    	//不处理
    }
    ,runEventKeyup:function(){
    	//不处理
    }
};
