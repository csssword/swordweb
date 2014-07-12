//日期控件的模板引擎
var SwordPulltreeTemplate = {
	'tablePre' : '<table class="swordform_field_wrap swordtree_wrap" cellSpacing="0" cellPadding="0"><tbody><tr><td class="boxtd">',
	'inputPre':'<input class="swordform_item_oprate swordform_item_input" type="text" widget="pulltree"  swordType="tree" display="true" evnSign="true" widgetGetValue="true"',
	'attr':'style="float: left; cursor: text;{style}" name="{name}" rule="{rule}" msg="{msg}" id="{id}" realvalue="{realvalue}" value="{value}" code="{code}" ',
	'end' :'></td><td width="17" class="tree-select-selimg"><div style="width: 17px;"></div></td></tr></tbody></table>',
	'datedef' : {"sbmitcontent":"{code}", "selReadOnly":"false", "disable":"false"},
	render : function(item, formObj, fName, itemData) {// el, formObj,optName
		var tem = [this.tablePre];
		tem.push(this.inputPre);
		var name = item.get("name"),id = fName + "_" + name,readonly=item.get("readonly")||item.getAttribute("readonly");
		var pullV=itemData?itemData.value:"",code=pullV,value,realvalue,disable=item.get("disable");
		var d= pageContainer.getInitData(item.get("name")),rule=item.get('rule'),style=item.get("style");
		formObj.fieldElHash.set(id,$(id));
		if(pullV.contains("code")){
			value=pullV.caption;
			realvalue=pullV.code;
		}else{
			realvalue=pullV;
			var values=[];
			pullvs=pullV!=""?pullV.split(","):[],datas=d?d.data:[],datal=datas.length;
			pullvs.each(function(item){
				for(var i=0;i<datal;i++){
					if(datas[i].code==item){
						values.push(datas[i].caption);
						break;
					}
				}
			});
			value=values.join(",");
			realvalue=pullvs.join(",");
		}
		var t = this.attr.substitute({
			id : id,
			name : name,
			style:(rule&&rule.contains('must'))&&disable!="true"?style+";background-color:#b5e3df;":style,
			rule : rule,
			msg : item.get('msg'),
			value:value,
			code:code,
			realvalue:realvalue
		});
		tem.push(t);
		if (readonly == "true"){tem.push(" readonly='readonly' ");}
		tem.push(this.end);
		return tem.join("");
	},
	initData : function(em, elData) {
		var value = "";
		var temp = elData.value;
		if ($defined(temp)) {
			value = temp;
		} else
			value = elData;
		if ($defined(value)) {
			if (value.contains("code") && value.contains("caption")) {
				if (value.contains('checkPath') || value.contains(";")) {
					var varray = value.split(";");
					var codeArray;
					var capArray;
					var checkArray;
					varray
							.each(function(v, index) {
								var vs = v.split('|');
								if (index == 0) {
									codeArray = vs[1].split(':')[1] + ","
									capArray = vs[0].split(':')[1] + ",";
									checkArray = vs[2].split(':')[1] + "|";
								} else {
									codeArray = codeArray + vs[1].split(':')[1]
											+ ",";
									capArray = capArray + vs[0].split(':')[1]
											+ ",";
									checkArray = checkArray
											+ vs[2].split(':')[1] + "|";
								}
							});
					em.set('value', codeArray
							.substring(0, codeArray.length - 1));
					em.set('realvalue', capArray.substring(0,
							capArray.length - 1));
					em.set('checkPath', checkArray.substring(0,
							checkArray.length - 1));
				} else {
					var vs = value.split('|');
					if (value.contains('codePath')) {
						// 懒加载树的反显路径
						em.set('codePath', vs[2].substring('codePath,'.length));
					}
					em.set('value', vs[1].split(',')[1]);
					em.set('realvalue', vs[0].split(',')[1]);
				}
			} else {
				var vs = value.split(',');
				var Captionvalue = [];
				var initData = pc.getInitData(em.get('name'));
				if ($chk(initData)) {
					vs.each(function(v) {
						initData.data.each(function(el) {
							if ((el.code || el.CODE) == v) {
								Captionvalue
										.include((el.caption || el.CAPTION));
							}
						})
					});
				}
				value = vs.join(",");
				caption = Captionvalue.join(",");
				em.set("evnSign", "false");
				em.set('value', caption);
				em.set('realvalue', value);
				em.set("evnSign", "true");
			}
		}

	}
	/*
	 * 模板元素追加事件
	 */
	,
	addEvent : function(elParent, ite, formObj) {
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
		tree.initData(item, formObj);
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