//日期控件的模板引擎
var SwordCalendarTemplate = {
	start : "<table class='swordform_field_wrap' cellspacing='0' cellpadding='0'><tbody><tr><td><input class='swordform_item_oprate swordform_item_input'"
			+ " style='float: left; width: 100%;{style}' id='{id}' name='{name}' autoctrl='{autoCtrl}'"
			+ "type='text' rule='{rule}' msg='{msg}' widget='calendar' dataformat='{dataformat}' widgetgetvalue='true' realvalue='{realvalue}' "
			+ "isshow='{isShow}' handInput='{handInput}' ovalue='{realvalue}' defaultValue='{defValue}' value='{value}' maxlength='{maxlength}' "
			+ "showOptions='{showOptions}' isShowCloseBtn='{isShowCloseBtn}' isShowEraseBtn='{isShowEraseBtn}' isShowTodayBtn='{isShowTodayBtn}' "
			+ "_onchange='{onchange}' onHide='{onHide}' submitDateformat='{submitDateformat}' returnRealValue='{returnRealValue}' toZero='{toZero}' ",

	end : "></td><td class='{dateBtn}' width='17px'><div style='width:17px'></div></td></tr></tbody></table>",
	datedef : {
		'dataformat' : 'yyyy-MM-dd',
		'returnRealValue' : 'false',
		'showOptions' : 'true,true,true,false,false,false',
		'submitDateformat' : "yyyy-MM-dd HH:mm:ss",
		'isShowCloseBtn' : 'false',
		'isShowEraseBtn' : 'false',
		'isShowTodayBtn' : 'false',
		'handInput' : 'true',
		/* 'showCurDate' : false, */// 不用了,
		'isReadonly' : 'false',
		'toZero' : false,
		'isShow' : 'true',
		'autoCtrl' : 'true',
		'disable' : 'false'
	},
	render : function(item, formObj, fName, itemData) {
		var tem = [ this.start ];
		var name = item.get("name"), id = fName + "_" + name, rule=item.get("rule"),style=item.get("style");
		var readonly = item.get("readonly")||item.getAttribute("readonly"), disable = item.get("disable");
		formObj.fieldElHash.set(id,$(id));
		if (disable == "true") {
			tem[0].replace("swordform_item_oprate swordform_item_input",
							"swordform_item_oprate swordform_item_input swordform_item_input_disable");
			tem.push(" disabled ");
		}
		if (readonly == "true") {
			tem.push(" readonly='readonly' ");
		}
		var defO = this.datedef,textValue=itemData?(itemData.value||""):(item.get("defValue")||""),realvalue=textValue;
		var formatV=item.get("dataformat") || defO.dataformat,sbformat=item.get("submitDateformat")||defO.submitDateformat;
		if(formatV&&textValue){
			//取出dataformat显示值和 submitDateFormat的真实值.
			textValue=SwordDataFormat.formatStringToString(textValue, formatV, formatV);
			realvalue=SwordDataFormat.formatStringToString(textValue, formatV, sbformat);
		}
		tem[0]=tem[0].substitute({
					id : id,
					name : name,
					style : (rule&&rule.contains('must'))&&disable!="true"?style+";background-color:#b5e3df;":style,
					rule : rule,
					msg : item.get("msg"),
					dataformat : formatV,
					isShow : item.get("isShow") || defO.isShow,
					handInput : item.get("handInput") || defO.handInput,
					isShowCloseBtn : item.get("isShowCloseBtn")
							|| defO.isshowclosebtn,
					isShowEraseBtn : item.get("isShowEraseBtn")
							|| defO.isshowerasebtn,
					isShowTodayBtn : item.get("isShowTodayBtn")
							|| defO.isshowtodaybtn,
					returnRealValue : item.get("returnRealValue")
							|| defO.returnRealValue,
					submitDateformat: sbformat,
					toZero : item.get("toZero") || defO.tozero,
					autoCtrl : item.get("autoCtrl") || defO.autoCtrl,
					maxlength : item.get("maxlength")||item.getAttribute("maxlength") || 10000,
					showOptions : item.get('showOptions') || defO.showOptions,
					onchange : item.get('onchange'),
					onHide : item.get('onHide'),
					
					realvalue : realvalue,
					defValue : item.get("defValue"),
					value : textValue, 
					ovalue : realvalue
				});
		tem.push(this.end.substitute({dateBtn : disable == "true" ? 'dateBtn dateBtn_disable': 'dateBtn'}));
		return tem.join("");
	},
	initData : function(el, elData) {
		if (!$defined(elData) && !$defined(el))
			return;
		var temp = elData.value;
		if ($defined(temp)) {
			elData = temp;
		}
		var fomat = el.get('dataformat');
		el.set("realvalue", elData);
		if ($defined(fomat)) {
			if (elData.split(".").length == 2) {
				elData = elData.split(".")[0];
				el.set("realvalue", elData);
				elData = SwordDataFormat.formatStringToString(elData,
						this.datedef.submitDateformat, fomat);
			} else {
				elData = SwordDataFormat.formatStringToString(elData,
						this.datedef.submitDateformat, fomat);
			}
		}
		el.set("value", elData);
		el.set("oValue", elData);
	}
	,initWidget : function(name,idEl,formObj) {
		var dateObj = pc.getCalendar();
		var elDiv = idEl.getParent("tr").getElement(".dateBtn");
		dateObj.setValidate(formObj.Vobj);
		dateObj.dateInput = idEl;
		dateObj.dateBtn = elDiv;
		formObj.setWidget(name, dateObj);
		return dateObj;
	}
	,runEventFocus:function(e,el,formObj){
		var blur = el.get('_onfocus');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e);
        }
        formObj.setSRang4El(el);
    }
    ,runEventClick:function(e,el,formObj){
		//触发原始click之后调用show逻辑.
    	var blur = el.get('_onclick');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e);
        }
        this.runEventFocus(e,el,formObj);
        var elDiv = el.getParent("tr").getElement(".dateBtn");
        var dateObj=formObj.getField(el.get("name"));
        dateObj.dateBtn = elDiv;
        dateObj.show(el);
	}
    ,runEventBlur:function(e,el,formObj){
    	//触发原始blur之后调用hide逻辑.
    	/*var blur = el.get('_onblur');
        if ($chk(blur)) {
        	formObj.getFunc(blur)[0](e);
        }
        var cObj=formObj.getField(el.get("name"));
        cObj.hide(150,cObj);
        if(el.get("rule")){formObj.Vobj.validate(el);}*/
    }
    ,runEventDblClick:function(e,el,formObj){
    	return;//不处理
    }
    ,runEventKeydown:function(e,el,formObj){
    	var cObj=formObj.getField(el.get("name"));
    	cObj.keyEvents(e);
    }
    ,runEventKeyup:function(e,el,formObj){
    	if(el.get("handInput")=="true"){
    		var cObj=formObj.getField(el.get("name"));
    		if(el.get("autoCtrl")=="true"){cObj.hand_Input(e);}
    		else{cObj.hand_Input_nctrl(e);}
    	}
    }
};
