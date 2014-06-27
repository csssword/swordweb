//日期控件的模板引擎
var SwordPulltreeTemplate = {
    'tablePre':'<table class="swordform_field_wrap swordtree_wrap" cellSpacing="0" cellPadding="0"><tbody><tr><td class="boxtd">',
    'inputPre':'<input style="float: left; cursor: text;" class="swordform_item_oprate swordform_item_input"  type="text"  widget="lazytree" realvalue="" swordType="lazytree" display="true" evnSign="true" widgetGetValue="true"' ,
    //'attr':'name="{name}" rule="{rule}" msg="{msg}" ',
    'id':' id="{PName}_{name}" ',
    'end':'></td><td width="17" class="tree-select-selimg"><div style="width: 17px; visibility: hidden;"></div></td></tr></tbody></table>',
    'datedef':{ }
};
$extend(SwordPulltreeTemplate, {
    /**
     * @param container 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item ,parent ,data, formObj) {
    	var itemName=item.get('name'),fName=formObj.options.name;
    	this.initWidget(itemName, formObj);
    	return fName + "_" + itemName;
    },
	initData:function(em,elData,formObj,resData){
    	var value = "";
    	var temp = elData.value;
		if($defined(temp)){
			value = temp;
		}else value = elData;
        if($defined(value)){
        if(value.contains("code") && value.contains("caption")) {
        	if(value.contains('checkPath')||value.contains(";")){
            	var varray = value.split(";");
                var codeArray;
                var capArray;
                var checkArray;
                varray.each(function(v,index){
                	var vs = v.split('|');
                    if(index == 0){
                    	codeArray = vs[1].split(':')[1] + ","
                      	capArray = vs[0].split(':')[1] + ",";
                      	checkArray = vs[2].split(':')[1] + "|";
                    }else{
                       	codeArray = codeArray + vs[1].split(':')[1] + ",";
                        capArray = capArray + vs[0].split(':')[1] + ",";
                        checkArray = checkArray + vs[2].split(':')[1] + "|";
                        }
                     });
                     em.set('value', codeArray.substring(0,codeArray.length-1));
                     em.set('realvalue', capArray.substring(0,capArray.length-1));
                     em.set('checkPath',checkArray.substring(0,checkArray.length-1));
             }else{
               	var vs = value.split('|');
               	if(value.contains('codePath')) {
               //懒加载树的反显路径
              	em.set('codePath', vs[2].substring('codePath,'.length));
                }
                                      em.set('value', vs[1].split(',')[1]);
                                      em.set('realvalue', vs[0].split(',')[1]);
                            	}
                            } else {
								 var vs = value.split(',');
								 var Captionvalue = [];
								 var initData = (pc.getInitData(em.get('name')))||(resData.getData(em.get('name')));
								 if($chk(initData)){
								 	var initData = initData.data;
								 	var tag = "code";
								 	var icode = initData[0].code;
								 	if(!$chk(icode)){
								 		icode = initData[0].CODE;
								 		tag = "CODE";
								 	} 
								 	vs.each(function(v) {
								 		if($type(icode) != "string"){
								 		v = Number(v);
								 	     }
									 	initData.each(function(el){
									 		if((el[tag]) == v){
									 			Captionvalue.include((el.caption||el.CAPTION));
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
    ,addEvent:function(elParent,ite,formObj){
    	var name = ite.get('name');
    	var tree = formObj.getWidget(name);
    	if(!tree){
    		tree = this.initWidget(name, formObj);
    	}
    },
    initWidget:function(name, formObj){
    	var item = formObj.options.pNode.getElement("div[name="+name+"]");
    	item.pNode = item.getParent();
        var tree = pageContainer.create("SwordTree");
        formObj.setWidget(name, tree);
        var id = formObj.options.name + "_" + name,tabindex=item.get("tabindex");
        pc.setWidget(formObj.name+"."+name,tree,item.get('dataName'));
        pc.setWidget4loaddata(name, tree); //当pc.loaddata的时候会被调用get(elName, ta);
        item.setProperty("select", "true");
        tree.initParam(item, formObj);
        tree.treeInForm=true;
        tree.setValidate(formObj.Vobj);
        var data = item;
        if(item.get("dataStr")){
       	 	data= item.get("dataStr");
        }
        tree.initData(data, formObj);
        var vobj = tree.select.selBox.set("id",id);
        tree.select.selBox.set("msg",item.get("msg")).set("tabindex",tabindex=="-1"?0:tabindex);
        vobj.addClass(item.get("class"));
        if(item.get("style").lastIndexOf("display: none;")!=0){
       	 vobj.set("style",vobj.get("style")+item.get("style"));
        }
        formObj.fieldElHash.set(name, vobj);
        if("true"==item.get("disable"))tree.select.disable(vobj);
        if($defined(item.get('rule')))formObj.Vobj._add(vobj);
        return tree;
    }
});


