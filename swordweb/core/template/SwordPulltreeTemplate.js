//日期控件的模板引擎
var SwordPulltreeTemplate = {
    'tablePre':'<table class="swordform_field_wrap swordtree_wrap" cellSpacing="0" cellPadding="0"><tbody><tr><td class="boxtd">',
    'inputPre':'<input style="float: left; cursor: text;" class="swordform_item_oprate swordform_item_input"  type="text"  widget="tree" realvalue="" swordType="tree" display="true" evnSign="true" widgetGetValue="true"' ,
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
    render:function (item ,parent ,data) {
         var me = this, arr, html, node;
        var d = $merge(me.datedef, data);
        if ($defined(parent)&&parent== "SwordForm") {
            arr = [me.tablePre,me.table, me.inputPre, SwordForm_Template.PUBATTR, me.id,me.imgtd, me.end];
        } else {
            arr = [me.tablePre,me.table, me.inputPre, SwordForm_Template.PUBATTR,me.imgtd, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        if($defined(parent)&&parent== "SwordForm"){
        	item.setStyle("display","none");
        	item.parentNode.insertBefore(node, item);
        	 return d.PName+"_"+item.get("name");
        }else{
        	item.appendChild(node);
        	return $(item).getElement('table');
        }
    },
	initData:function(em,elData){
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
								 var initData = pc.getInitData(em.get('name'));
								 if($chk(initData)){
								 	vs.each(function(v) {
									 	initData.data.each(function(el){
									 		if((el.code||el.CODE) == v){
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
    		tree = this.initWidget(name, formObj)
    	}
    },
    initWidget:function(name, formObj){
    	var item = formObj.options.pNode.getElement("div[name="+name+"]");
    	item.pNode = item.getParent();
        var tree = pageContainer.create("SwordTree");
        formObj.setWidget(name, tree);
        pc.setWidget4loaddata(name, tree); //当pc.loaddata的时候会被调用get(elName, ta);
        item.setProperty("select", "true");
        tree.initParam(item, formObj);
        tree.setValidate(formObj.Vobj);
//        tree.initData(item, formObj);
        return tree;
    }
});


