//日期控件的模板引擎
var SwordPulltreeTemplate = {
	'tablePre' : '<table class="swordform_field_wrap swordtree_wrap" cellSpacing="0" cellPadding="0"><tbody><tr><td class="boxtd">',
	'inputPre':'<input class="swordform_item_oprate swordform_item_input" type="text" widget="pulltree"  swordType="tree" display="true" evnSign="true" widgetGetValue="true"',
	'attr':'style="float: left; cursor: text;{style}" name="{name}" rule="{rule}" msg="{msg}" id="{id}" checkPath="{checkPath}" codePath="{codePath}" realvalue="{realvalue}" value="{value}" code="{code}" ',
	'end' :'></td><td width="17" class="tree-select-selimg"><div style="width: 17px;"></div></td></tr></tbody></table>',
	'datedef' : {"sbmitcontent":"{code}", "selReadOnly":"false", "disable":"false"},
	render : function(item, formObj, fName, itemData) {// el, formObj,optName
		var tem = [this.tablePre];
		tem.push(this.inputPre);
		var name = item.get("name"),id = fName + "_" + name,readonly=item.get("readonly")||item.getAttribute("readonly");
		var pullV=itemData?itemData.value:"",checkPath="",codePath="",showvalue="",realvalue="",code="",disable=item.get("disable");
		var d= pageContainer.getInitData(item.get("name")),rule=item.get('rule'),style=item.get("style");
		formObj.fieldElHash.set(id,$(id));
		if(pullV){
			if (pullV.contains("code") && pullV.contains("caption")) {
				if (pullV.contains('checkPath') || pullV.contains(";")) {
					var varray = pullV.split(";");
					var codeArray="",capArray="",checkArray="";
					varray.each(function(v, index) {
							var vs = v.split('|');
							if (index != 0) {
								codeArray = codeArray + vs[1].split(':')[1]+ ",";
								capArray = capArray + vs[0].split(':')[1]+ ",";
								checkArray = checkArray+ vs[2].split(':')[1] + "|";
							} else {
								codeArray = vs[1].split(':')[1] + ",";
								capArray = vs[0].split(':')[1] + ",";
								checkArray = vs[2].split(':')[1] + "|";
							}
					});
					showvalue= codeArray.substring(0, codeArray.length - 1);
					realvalue= capArray.substring(0,capArray.length - 1);
					checkPath= checkArray.substring(0,checkArray.length - 1);
				} else {
					var vs = pullV.split('|');
					if (pullV.contains('codePath')) {
						codePath=vs[2].substring('codePath,'.length);
					}
					showvalue= vs[1].split(',')[1];
					realvalue= vs[0].split(',')[1];
				}
			} else {
				var vs = pullV.split(',');
				var Captionvalue = [];
				var initData = d;
				if ($chk(initData)) {
					vs.each(function(v) {
						initData.data.each(function(el) {
							if ((el.code || el.CODE) == v) {
								Captionvalue.include((el.caption || el.CAPTION));
							}
						});
					});
				}
				realvalue = vs.join(",");
				showvalue = Captionvalue.join(",");
			}
			code=realvalue;
		}
		var t = this.attr.substitute({
			id : id,
			name : name,
			style:(rule&&rule.contains('must'))&&disable!="true"?style+";background-color:#b5e3df;":style,
			rule : rule,
			msg : item.get('msg'),
			value:showvalue,
			code:code,
			realvalue:realvalue,
			checkPath:checkPath,
			codePath:codePath
		});
		tem.push(t);
		if (readonly == "true"){tem.push(" readonly='readonly' ");}
		tem.push(this.end);
		return tem.join("");
	}
	/*
	 * 模板元素追加事件
	 */
	,addEvent : function(elParent, ite, formObj) {
		var name = ite.get('name');
		var tree = formObj.getWidget(name);
		if (!tree) {
			tree = this.initWidget(name, formObj)
		}
	},
	initWidget : function(name,idEl,formObj) {
		var item = formObj.options.pNode.getElement("div[name=" + name + "]");
		item.pNode = item.getParent();
		var tree = pageContainer.create("SwordTree");
		formObj.setWidget(name, tree);
		pc.setWidget4loaddata(name, tree); // 当pc.loaddata的时候会被调用get(elName,
											// ta);
		item.setProperty("select", "true");
		tree.initParam(item, formObj);
		tree.setValidate(formObj.Vobj);
		return tree;
	}
	,runEventFocus:function(){
    	//触发原始focus事件,然后调用show逻辑
		return;//暂不处理
    }
    ,runEventClick:function(){
		//触发原始click之后调用focus逻辑.
    	return;//暂不处理
	}
    ,runEventBlur:function(){
    	//触发原始blur之后调用hide逻辑.rule。
    	return;//暂不处理
    }
    ,runEventDblClick:function(){
    	return;//暂不处理
    }
    ,runEventKeydown:function(){
    	//下拉列表数据过滤
    	return;
    }
    ,runEventKeyup:function(e,el,formObj){
    	return;
    }
};