var SwordHiddenTemplate = {
    start:'<table class="swordform_field_wrap" cellspacing="0" cellpadding="0" style="display:none;"><tbody><tr><td class="boxtd">',
    input:'<input class="swordform_item_oprate swordform_item_input" type="hidden"  defvalue="{defValue}" <tpl if="values.get(\'defValue\')">value="{defValue}"</tpl> value="{value}" rule="{rule}" name="{name}"',
    end:'></td></tr></tbody></table>',
    id:' id="{PName}_{name}" ',
    textdef:{

    }

};
$extend(SwordHiddenTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 日期框的数据
     */
    render:function (item, parent, data) {
        var me = this, arr, html, node;
//        if (parent == "SwordForm") {
            arr = [me.start,me.input,me.id, me.end];
//        } else {
//            arr = [me.start, SwordForm_Template.PUBATTR,me.end];
//        }
        html = STemplateEngine.render(arr.join(''), item, data);
        node = STemplateEngine.createFragment(html);
//        STemplateEngine.formatResolve(node.firstChild.firstChild, item);
        item.parentNode.insertBefore(node, item);
        return data.PName+"_"+item.get("name");
    }
});
