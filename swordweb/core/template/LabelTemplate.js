/**
 * Created by IntelliJ IDEA. User: gmq Date: 12-10-22 Time: 下午1:53 To change
 * this template use File | Settings | File Templates.
 */
var SwordLabelTemplate = {
	start : '<div class="swordform_field_wrap"><label type="label" class="swordform_item_oprate swordform_item_label" style="',
	inp : ' id="{id}" name="{name}" defValue="{defValue}" format="{format}" realvalue="{realvalue}" showvalue="{showvalue}" _onclick="{onclick}" ',
	v : '>',
	end : '</label></div>',
	render : function(item,formObj,fName,itemData) {
		var tem = [this.start];
		if (item.get("show") == "false") {
			tem.push("display:none;");
		}
		tem.push("\"");
		var name = item.get("name"),id = fName + "_" + name,dv = item.get("defValue"),disable=item.get("disable");
		if(disable=="true"){tem.push("disabled");}
		var labelValue=itemData?itemData.value:(dv||""),realvalue=labelValue;
		var formatV=item.get("format");
		if(formatV&&labelValue){
			labelValue=sword_fmt.formatText(item, labelValue, '', formatV).value;
		}
		var t = this.inp.substitute({
			id : id
			,name : name
			,defValue : dv
			,realvalue : realvalue
			,format:formatV
			,showvalue:labelValue
			,onclick:item.get("onclick")
		});
		tem.push(t);
		tem.push(this.v);
		tem.push(labelValue);
		tem.push(this.end);
		formObj.fieldElHash.set(id,$(id));
		return tem.join("");
	},
	initData : function(el, elData, formObj) {
		if ($defined(elData)) {
			var temp = elData.value;
			if ($defined(temp)) {
				elData = temp;
			}
			el.set({
				'text' : elData,
				'value' : elData
			});
		}
	}
	,runEventClick:function(e,el,formObj){
		//触发原始click之后调用focus逻辑.
		var blur = el.get('_onclick');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e,formObj);
        }
	}
};
