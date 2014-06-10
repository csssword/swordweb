//日期控件的模板引擎
var SwordCalendarTemplate = {
    //日期的HTML结构
    'pre':'<table cellspacing="0" cellpadding="0" class="swordform_field_wrap"><tbody><tr><td class="boxtd">',
    'date':'<input type="text" widget="calendar" widgetgetvalue="true" dataformat="{dataformat}" <tpl if="values.get(\'isReadonly\')==\'true\'||values.get(\'edit\')==\'false\'">readonly="true"</tpl><tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')">disabled="true" class="swordform_item_oprate swordform_item_input calendar_input_disable" style="float:left;cursor:default;"</tpl><tpl if="values.get(\'disable\')!=\'true\' && !values.getAttribute(\'disabled\')">style="{style}" class="{class}"</tpl>',
    'end':' ></td><td width="17px" class="dateBtn <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')">dateBtn_disable</tpl>"><div style="width:17px;visibility:hidden;"></div></td></tr></tbody></table>',
    //日期属性
    'attr':' name="{name}" rule="{rule}" showOptions="{showOptions}" disable="{disable}" msg="{msg}" showCurDate="{showCurDate}" defaultValue="{defValue}" handInput="{handInput}" returnRealValue="{returnRealValue}" _onChange="{onChange}" dateControl="{dateControl}" onHide="{onHide}" dataformat="{dataformat}" isshowclosebtn="{isShowCloseBtn}" isshowerasebtn="{isShowEraseBtn}" isshowtodaybtn="{isShowTodayBtn}" isshow="{isShow}" tozero="{toZero}" autoctrl="{autoCtrl}"',
    //是否有id，如果在form里就有id,如果在表格里,不生成id
    'id':' id="{PName}_{name}" ',
    'datedef':{
        //格式化
        'dataformat':'yyyy-MM-dd',
        'returnRealValue':'false',
        //弹出的日期选择框的格式
        'showOptions':'true,true,true,false,false,false',
        'submitDateformat':"yyyy-MM-dd HH:mm:ss", //后台的事件格式
        'isShowCloseBtn':'false',
        'isShowEraseBtn':'false',
        'isShowTodayBtn':'false',
        'showCurDate':false,
        'isReadonly':'false',
        'toZero':false,
        'isShow':'true',
        'autoCtrl':'true',
        'style':"float: left;",
        'disable':'false',
        'class':'swordform_item_oprate swordform_item_input'
    }
};
$extend(SwordCalendarTemplate, {
    //创建Calendar日期组件的dom
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 日期框的数据
     */
    render:function (item, parent, def) {
        var me = this, arr, html, node;
        var d = $merge(me.datedef, def);
        if (parent == "SwordForm") {
            arr = [me.pre, me.date, me.attr, me.id, me.end];
        } else {
            arr = [me.pre, me.date, me.attr, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        var id = d.PName+"_"+item.get("name");
        var el = $(id);
        if (item.get("showCurDate") == "true") {
            var oldDate = new Date();
            var value = SwordDataFormat.formatDateToString(oldDate, el.get('dataformat'));
            el.set("value", value);
            el.set("realvalue", value);
            el.set('oValue', value);
        }
        if ($chk(item.get("defValue"))) {
            //if (SwordDataFormat.isDate(this.options.defaultValue, this.options.dataformat))
        	el.value = item.get("defValue");
        	el.set("realvalue", item.value);
        	el.set('oValue', item.value);
        }
        return id;
    },
    initData:function (el, elData) {
    	if (!$defined(elData) && !$defined(el))return;
    		var temp = elData.value;
    		if($defined(temp)){
    			elData = temp;
    		}
    		 var fomat = el.get('dataformat');
    	        el.set("realvalue", elData);
    	        if ($defined(fomat)) {
    	            if (elData.split(".").length == 2) {
    	            	elData = elData.split(".")[0];
    	                el.set("realvalue", elData);
    	                elData = SwordDataFormat.formatStringToString(elData, this.datedef.submitDateformat, fomat);
    	            } else {
    	            	elData = SwordDataFormat.formatStringToString(elData, this.datedef.submitDateformat, fomat);
    	            }
    	        }
    	        el.set("value", elData);
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(elParent,item,formObj){
    	var elName = item.get('name');
    	var dateObj = formObj.getWidget(elName);
    	if(!dateObj){
    		 dateObj = this.initWidget(elName, formObj);
    	}
        var elDiv=item.getParent("tr").getElement(".dateBtn");
        dateObj.setValidate(formObj.Vobj);
        dateObj.dateInput=item;
        dateObj.dateBtn=elDiv;
        dateObj.addEventToEl("input");
        dateObj.addEventToEl("div");
    },
    initWidget:function(name, formObj){
    	var dateObj=pc.getCalendar();
        formObj.setWidget(name, dateObj);
        return dateObj;
    }
});


