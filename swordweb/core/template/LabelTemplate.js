/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordLabelTemplate = {
    start:'<div class="swordform_field_wrap" style="line-height: 20px;"><label name="{name}" type="label" defValue="{defValue}" class="swordform_item_oprate swordform_item_label" style="float:left; overflow: hidden;" ',
    end: '></label></div>',
    id:' id="{PName}_{name}" ',
    labeldef:{

    }

};
$extend(SwordLabelTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item, parent, data) {
        var me = this, arr, html, node;
        if (parent == "SwordForm") {
            arr = [me.start, SwordForm_Template.PUBATTR,me.id, me.end];
        } else {
            arr = [me.start, SwordForm_Template.PUBATTR, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, data);
        node = STemplateEngine.createFragment(html);
        if(item.get("format")||item.get("submitformat")||item.get("css")){
        	STemplateEngine.formatResolve($(node.firstChild).getElement("label"), item);
        }
        item.parentNode.insertBefore(node, item);
        var id = data.PName+"_"+item.get("name");
        if($chk($(id).get("defValue"))){
        	$(id).set("value",$(id).get("defValue"));
        	$(id).set("text",$(id).get("defValue"));
        }
        return id;
    }
	,initData:function(el,elData,formObj){
    	if($defined(elData)){
    		var temp = elData.value;
    		if($defined(temp)){
    			elData = temp;
    		}
        	el.set({'text':elData,'value':elData});
    	}
    }
    /*
     * 模板元素追加事件
     * label类型暂不处理
     */
    ,addEvent:function(elParent,el){
    	
    }
    ,
    initWidget:function(){
        return null;
    }
});
