//SwordForm表单的模板描述
var SwordForm_Template = {
    //共有属性
    'PUBATTR':' style="{css}" rule="{rule}" bizctrl="{bizctrl}" biztid="{biztid}" name="{name}" msg="{msg}" '
};
$extend(SwordForm_Template, {
    //panel框
    'panel':'<div align="center" class="swordfrom_wrap_div"><div class="swordform-panel-box"><div class="swordform-panel-tl"></div><div class="swordform-panel-tr"></div><div class="swordform-panel-title" id="{name}_panelTitle" ><div id="{name}_panelTog" class="x-tool" title="收缩"></div>{caption}</div></div></div>',
    //文本框
    'text':function(){return SwordTextTemplate.render.apply(SwordTextTemplate,Array.prototype.slice.call(arguments))},
    //label框
    'label': function(){return SwordLabelTemplate.render.apply(SwordLabelTemplate,Array.prototype.slice.call(arguments))},
    //下拉选择框
    'select':function(){return SwordSelectTemplate.render.apply(SwordSelectTemplate,Array.prototype.slice.call(arguments))},
    //下拉树
    'pulltree':function(){return SwordPulltreeTemplate.render.apply(SwordPulltreeTemplate,Array.prototype.slice.call(arguments))},
    //日期
    'date':function(){return SwordCalendarTemplate.render.apply(SwordCalendarTemplate,Array.prototype.slice.call(arguments));},
    //单选框
    'radio':function(){return SwordRadioCheckboxTemplate.render.apply(SwordRadioCheckboxTemplate,Array.prototype.slice.call(arguments));},
    //复选框
    'checkbox':function(){return SwordRadioCheckboxTemplate.render.apply(SwordRadioCheckboxTemplate,Array.prototype.slice.call(arguments));},
    //普通文件上传
    'file':function(){return SwordFileTemplate.render.apply(SwordFileTemplate,Array.prototype.slice.call(arguments));},
    //大文本框
    'textarea':function(){return SwordTextareaTemplate.render.apply(SwordTextareaTemplate,Array.prototype.slice.call(arguments));},
    //隐藏框
//    'hidden':function(){return SwordHiddenTemplate.render.apply(SwordHiddenTemplate,Array.prototype.slice.call(arguments));},
    //密码框
    'password':function(){return SwordPasswordTemplate.render.apply(SwordPasswordTemplate,Array.prototype.slice.call(arguments));}
});
//模板的扩展方法
$extend(SwordForm_Template, {
    /**
     * 创建FORM结构
     * @param pNode 代表sword="SwordForm"的整个DIV节点(包括子节点)的element对象
     * @param data  FORM的初始化数据//原为初始化数据对象,现修改为formObj
     */
    render:function (pNode, formObj) {
        var me = this, len, type, d={}, NAME = pNode.get('name');
        //获取FORM中所有的item定义
        formObj.items = pNode.getElements('div[name][type]');
        len = formObj.items.length;
        d.PName=NAME;
        //创建panel
        if (pNode.get('panel') == "true") {
            pNode.insertBefore(STemplateEngine.createFragment(STemplateEngine.render(me['panel'], pNode,{'caption':''})), pNode.firstChild);
        }
        //循环创建item
        for (var i=0; i < len; i++) {
        	var el=formObj.items[i];
        	formObj.itemsDiv.include(el.clone());
            type = el.get('type') || 'text';
            var elName=el.get("name");
            var id=NAME+"_"+elName;
            if ($type(me[type]) == 'function') {
                me[type](el,'SwordForm',d, formObj);
            }else{
            	el.set("id",id);
            }
            formObj.fieldElHash.set(elName,$(id));
            if($defined(el.get("rule")) && el.get("rule").contains('must')&&!($(id).disabled || el.get('disable') == 'true'))$(id).setStyle('background-color','#b5e3df');
         }
        var hidItems = pNode.getElements('input[name][type="hidden"]');
        var hidlen = hidItems.length;
        for (var j =0; j < hidlen; j++) {
        	var el=hidItems[j];
        	formObj.itemsDiv.include(el.clone());
            var elName=el.get("name");
            var id=NAME+"_"+elName;
            	el.set("id",id);
            formObj.fieldElHash.set(elName,$(id));
         }
    }
});






