/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordPasswordTemplate = {
    start:'<div class="swordform_field_wrap"><input type="password" style="float:left" placeholder="{placeholder}" class="swordform_item_oprate swordform_item_input"',
    end: '></div>',
    id:' id="{PName}_{name}" ',
    passworddef:{

    }
};
$extend(SwordPasswordTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 数据
     */
    render:function (item, parent, data) {
        //debugger;
        var me = this, arr, html, node;
        if (parent == "SwordForm") {
            arr = [me.start, SwordForm_Template.PUBATTR,me.id, me.end];
        } else {
            arr = [me.start, SwordForm_Template.PUBATTR, me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, data);
        node = STemplateEngine.createFragment(html);
        item.parentNode.insertBefore(node, item);
        return data.PName+"_"+item.get("name");
    }
	,initData:function(el,elData,fmtObj){
		el.set("value",elData.value).set("realvalue",elData.value);
    }
    /*
     * 模板元素追加事件
     */
    ,addEvent:function(elParent,vobj,formObj){
    	var objTop = vobj._getPosition().y;
        vobj.addEvent('focus', function() {
            vobj.select();
        	this.showTip(name, vobj);
        }.bind(formObj));
        vobj.addEvent('blur', function() {
            if(vobj.get("placeholder") == "true"){
            	if(vobj.get("value") == ""){
            		vobj.set("value",vobj.get("defvalue"));
            		vobj.addClass("swordform_item_input_placeholder");
            		this.Vobj.validate(vobj);
            	}else if(vobj.get("value") != vobj.get("defvalue")){
            		this.Vobj.validate(vobj);
            	}
            }
        }.bind(formObj));
        vobj.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress', function(e){
        	if(vobj.get("placeholder") == "true" && vobj.get("value") == vobj.get("defvalue")){
        		vobj.set("value","");
        		vobj.removeClass("swordform_item_input_placeholder");
        	}
        });
    }
    ,
    initWidget:function(){
        return null;
    }
});
