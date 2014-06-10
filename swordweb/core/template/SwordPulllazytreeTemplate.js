//日期控件的模板引擎
var SwordPulllazytreeTemplate = {
    'tablePre':'<table class="swordform_field_wrap swordtree_wrap" cellSpacing="0" cellPadding="0"><tbody><tr><td class="boxtd">',
    'inputPre':'<input style="float: left; cursor: text;" class="swordform_item_oprate swordform_item_input"  type="text"  widget="tree" realvalue="" swordType="tree" display="true" evnSign="true" widgetGetValue="true"' ,
    //'attr':'name="{name}" rule="{rule}" msg="{msg}" ',
    'id':' id="{PName}_{name}" ',
    'end':'></td><td width="17" class="tree-select-selimg"><div style="width: 17px; visibility: hidden;"></div></td></tr></tbody></table>',
    'datedef':{ }
};
$extend(SwordPulllazytreeTemplate, {
    /**
     * @param container 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item ,parent ,data, formObj) {
    	this.initWidget(item.get('name'), formObj);
    },
	initData:function(el,value, formObj){
		var temp = value.value;
		if($defined(temp)){
			value = temp;
		}
		if(value){
    		var tr = formObj.getWidget(el.get('name'));
            if(value.contains("code") && value.contains("caption")) {
                var vs = value.split('|');
                if(value.contains('codePath')) {
                    //懒加载树的反显路径
                    tr.select.selBox.set('codePath', vs[2].substring('codePath,'.length));
                }
                tr.setCaption(vs[1].split(',')[1]);
                tr.setRealValue(vs[0].split(',')[1]);
            } else {
            	var vs = value.split(',');
                var caption = [];
                var tObj=tr.getDataObj();
                if(!$chk(tObj)){
                	tObj=pc.getInitData(tr.options.dataName);
                }
                if($chk(tObj)){
                	vs.each(function(v){
                    	tObj.data.each(function(item,index){
                    		if(item.code==v)caption.push(item.caption);
        	            });
                    });
                    if(caption.length>0){
                    	 tr.setCaption(caption.split(","));
                    	 tr.setRealValue(vs);
                     }
                	}
                else{
	                tr.setCaption(vs);
	                tr.setRealValue(vs);
                }
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
        var tree = pageContainer.create("SwordLazyTree");
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


