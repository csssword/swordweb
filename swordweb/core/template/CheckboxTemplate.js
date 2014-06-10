/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordCheckboxTemplate = {
    start:'<div class="swordform_field_wrap">' +
        '<div name="{name}" class="formselect-list swordform_item_oprate" widget="checkbox" defValue="{defValue}" widgetgetvalue="true" ruletype="checkboxGroup" type="{type}" disable="{disable}"',
    end:'><div class="formselect-list-inner">' +
        '<tpl for="eldata"><div class="formselect-list-item" code="{code}" caption="{caption}">' +
        '<input type="checkbox" ruletype="checkboxGroup" name="{parent.name}" rule="{parent.rule}" style="cursor: pointer;" value="{code}"><span title="{caption}">{caption}</span>' +
        '</div></tpl></div></div></div>',
    attr:' colWidth="{colWidth}" onClickAfter="{onClickAfter}" onClickBefore="{onClickBefore}" ',
    id:' id="{PName}_{name}" ' ,
    checkboxdef:{
	disable:'false'
    }
};
$extend(SwordCheckboxTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item, parent, data) {
        var me = this, arr, html, node;
        var d = $merge(me.checkboxdef, data);
        if (parent == "SwordForm") {
            arr = [me.start, SwordForm_Template.PUBATTR,me.attr,me.id, me.end];
        } else {
            arr = [me.start, SwordForm_Template.PUBATTR,me.attr, me.end];
        }
        var childs = item.getChildren(), cd = pc.getInitData(item.get('dataname') || item.get('name'));
        d['eldata'] = cd ? cd.data : ((childs.length > 0) ? childs : null);
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        if($chk(item.get("disable")) && item.get("disable")=="true"){
        	var innerWrap = $(item.parentNode).getElement(".formselect-list-inner");
        	this.disable(innerWrap, item.get("name"), item.get("type"));
        }
        var id = d.PName+"_"+item.get("name");
        if($(id).get('defValue')){
        	this.initData($(id),{value:$(id).get('defValue')})
        }
        return id;
    },
    initData:function (el, d) {
    	if(!$chk(d)){
    		return;
    	}else{
    		var temp = d.value;
    		if($defined(temp)){
    			d = temp;
    		}
    	}
        if(d.indexOf(",")==-1)d = d + ",1";
        d = d.toHash();
        if($type(d) == "hash") {
            this.reset(el);
            d.each(function(v, k) {
                if(v / 1 == 1) {
                    var inp = el.getElement("input[value='" + k + "']");
                    if(inp) {
                        inp.set("checked", true);
                        inp.getParent().addClass('formselect-selected');
                    }
                }
            }, this);
        }
    }
    ,
//	getChildrenEl : function(name,type) {
//		return ;
//	},
	disable : function(innerWrap, name, type) {
    	innerWrap.getElements('input[name=' + name
				+ '][type=' + type + ']').set('disabled', true);
	}
    ,reset:function(el) {
        el.getElements("div.formselect-list-item").each(function(row) {
            if(row.getElement("input"))row.getElement("input").set("checked", false);
            row.removeClass("formselect-selected");
        });
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(elParent,item,formObj){
    	var elName=item.get('name');
//    	var el=formObj.options.pNode.getElement("div[name="+elName+"]");
//    	var ta = new SwordGroupFields(el);
    	var ta = formObj.getWidget(elName);
    	if(!ta){
    		ta = this.initWidget(elName, formObj, item)
    	}
    	ta.wrap=item;
    	ta.options.validate = formObj.Vobj;
    	ta.initEvent();
    },
    initWidget:function(name, formObj, item){
    	var el=formObj.options.pNode.getElement("div[name="+name+"]");
    	var ta = new SwordGroupFields(el);
    	ta.innerWrap=item;
    	formObj.setWidget(name, ta);
        return ta;
    }
});
