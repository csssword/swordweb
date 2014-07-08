/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordTextareaTemplate = {
    start:'<table class="swordform_field_wrap" cellspacing="0" cellpadding="0" style="width: 100%;"><tbody><tr><td class="boxtd"><textarea <tpl if="values.getAttribute(\'maxLength\')">maxLength="{maxLength}" </tpl> defValue="{defValue}"  <tpl if="values.get(\'css\')">style="{css}"</tpl>  <tpl if="values.get(\'style\')">style="{style}"</tpl> class="swordform_item_oprate swordform_item_textarea <tpl if="values.get(\'edit\')==\'false\' || values.getAttribute(\'disabled\')">swordform_item_input_disable</tpl>" name="{name}" <tpl if="values.get(\'edit\')==\'false\' || values.getAttribute(\'disabled\')">readonly</tpl> type="textarea" widget="textarea" ',
    end: '></textarea><tpl if="values.getAttribute(\'maxLength\')"><div style="position:relative;"><div style="color: rgb(51, 51, 51);position:absolute;bottom:2px;right:20px" >您还可以输入<span class="textarea_maxLength_count">{maxLength}</span>字</div></div></tpl></div></td></tr></tbody></table>',
    id:' id="{PName}_{name}" ',
    textareadef:{
    	scroll:false,
    	bizValidate:false
    }
};
$extend(SwordTextareaTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item, parent, data) {
        var me = this, arr, html, node;
        var d = $merge(me.textareadef, data);
        if (parent == "SwordForm") {
            arr = [me.start, SwordForm_Template.PUBATTR,me.id, me.end];
        } else {
            arr = [me.start, SwordForm_Template.PUBATTR, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, d);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        var id = d.PName+"_"+item.get("name");
        if($chk($(id).get("defValue")))$(id).set("value",$(id).get("defValue"));
        return id;
    },
	initData:function(el,elData,fmtObj){
    	if (!$defined(elData))elData = "";
    		var temp = elData.value;
    		if($defined(temp)){
    			elData = temp;
    		}
    		elData = elData.replace(/&apos;/g, "'");
    		el.set("value",elData).set("realvalue",elData);
        if($defined(el.get("maxLength")))this.maxLengthCount(el);
    },
    maxLengthCount:function(el) {
        if(this.getStringUTFLength(el.get("value")) > el.get("maxLength") / 1) {
            el.set("value", this.leftUTFString(el.get("value"), el.get("maxLength") / 1));
        }
        var len = el.get("maxLength") / 1 - this.getStringUTFLength(el.get("value"));
        var countSpan = el.getNext().getElement("span.textarea_maxLength_count");
        countSpan.set("text", (len >= 0) ? len : 0);
        if(len == 0)countSpan.getParent().setStyle('color', 'red');
        else countSpan.getParent().setStyle('color', '#333');
    },
    leftUTFString:function(str, len) {
        if(this.getStringUTFLength(str) <= len) {
            return str;
        }
        var value = str.substring(0, len);
        while(this.getStringUTFLength(value) > len) {
            value = value.substring(0, value.length - 1);
        }
        return value;
    },
    getStringUTFLength:function(str) {
    	var v = str.replace(/[\u4e00-\u9fa5]/g, "  ");  //在swordform_extend.js中修改为一个汉字占三个字符。
        return v.length;
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(elParent,item,formObj){
    	var elName=item.get('name');
    	var ta = formObj.getWidget(elName);
    	if(!ta){
    		ta = this.initWidget(elName, formObj,item)
    	}
    	ta.countSpan=item.getNext()?item.getNext().getElement('span.textarea_maxLength_count'):null;
    	ta.box = item;
    	ta.initEvent();
    },
    initWidget:function(name, formObj,item){
    	var el=formObj.options.pNode.getElement("div[name="+name+"]");
    	var ta = new Textarea(el);
    	ta.box=item;
    	formObj.setWidget(name, ta);
        return ta;
    }
});
