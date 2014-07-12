/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordFileTemplate = {
    start:'<div class="swordform_field_wrap"><div name="{name}" class="uploadGroup formselect-list swordform_item_oprate" ' +
        ' widgetgetvalue="true" widget="file" keepfile="{keepfile}" isMulti={isMulti} style="float: left;" ',
    end: '><div class="formselect-list-inner">' +
        '<div class="formselect-list-item"><input type="file" name="{name}" value="选择"><span class="fileuploadloaded"></span><input type="button" value="增加"></div></div></div></div>',
    id:' id="{PName}_{name}" ',
    filedef:{
    	isMulti: 'true',
        maxSize:0 ,
        keepfile:'false'
    },
     render:function (item, parent, data) {
        var me = this, arr, html, node;
        var d = $merge(me.filedef, data);
        if (parent == "SwordForm") {
            arr = [me.start,me.id, me.end];
        } else {
            arr = [me.start, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        return d.PName+"_"+item.get("name");
    }
	,initData:function(el,elData){
		el.set("value",elData.value).set("realvalue",elData.value);
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(p,item,formObj){
    	var elName=item.get('name');
//    	var el=formObj.options.pNode.getElement("div[name="+elName+"]");
//    	var ta = new fileUpload(el);
//    	ta.options.pNode=el;
//    	formObj.setWidget(elName, ta);
    	var ta = formObj.getWidget(elName);
    	if(!ta){
    		ta = this.initWidget(elName,item,formObj);
    	}
    	ta.box=item;
    	ta.parent=formObj;
    	ta.wrap=p.getElement("div.uploadGroup");
    	ta.wrap.store("parent", formObj);
    	ta.innerWrap=p.getElement(".formselect-list-inner");
    	ta.initEvent();
    	item.addEvent('change', ta.fileValidator.bind(formObj));
    },
    initWidget:function(name, formObj){
//    	var elName=item.get('name');
    	var el=formObj.options.pNode.getElement("div[name="+name+"]");
    	var ta = new fileUpload(el);
    	ta.options.pNode=el;
//    	ta.box=item;
//    	ta.parent=formObj;
//    	ta.wrap=p.getElement("div.uploadGroup");
//    	ta.innerWrap=p.getElement(".formselect-list-inner");
    	formObj.setWidget(name, ta);
        return ta;
    }

};
