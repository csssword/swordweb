/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordTextTemplate = {
    start:'<table cellspacing="0" cellpadding="0" class="swordform_field_wrap"><tbody><tr><td class="boxtd">',
    inputPre:'<input type="text" style="float:left;<tpl if="values.get(\'show\')==\'false\'">display:none;</tpl>" realvalue="{realvalue}" defValue="{defValue}" maxlength="{maxlength}" <tpl if="values.get(\'defValue\')">value="{defValue}" oValue="{defValue}"</tpl> placeholder="{placeholder}"<tpl if="values.get(\'disabled\')">disabled</tpl> <tpl if="values.get(\'disable\')==\'true\'">disabled</tpl> class="swordform_item_oprate swordform_item_input <tpl if="values.get(\'disabled\')">swordform_item_input_disable</tpl> <tpl if="values.get(\'disable\')==\'true\'">swordform_item_input_disable</tpl>"',	
    id:' id="{PName}_{name}" ',
    end: '></td></tr></tbody></table>',
    textdef:{
    }

};

$extend(SwordTextTemplate, {
    /**
     * @param item 定义的div节点
     * @param parent 父亲对象是谁
     * @param data 日期框的数据
     */
    render:function (item, parent, data) {
        var me = this, arr, html, node;
        if (parent == "SwordForm") {
            arr = [me.start, me.inputPre, SwordForm_Template.PUBATTR,me.id, me.end];
        } else {
            arr = [me.start, SwordForm_Template.PUBATTR,me.end];
        }
        html = STemplateEngine.render(arr.join(''), item, data);
        node = STemplateEngine.createFragment(html);
        if(item.get("format")||item.get("submitformat")||item.get("css")){
        	STemplateEngine.formatResolve($(node.firstChild).getElement("input"), item);
        }
        item.parentNode.insertBefore(node, item);
        var id = data.PName+"_"+item.get("name");

    	var keyup = item.get('onkeyup');
    	if($chk(keyup)){
	        $(id).set('_onkeyup',this.eraseFunc(keyup));
    	}
    	var keydown = item.get('onkeydown');
    	if($chk(keydown)){
	        $(id).set('_onkeydown', this.eraseFunc(keydown));
    	}
    	var blur = item.get('onblur');
    	if($chk(blur)){
	        $(id).set('_onblur',this.eraseFunc(blur));
    	}
    	var click = item.get('onclick');
    	if($chk(click)){
	        $(id).set('_onclick',this.eraseFunc(click));
    	}
    	var change = item.get('onchange');
    	if($chk(change)){
	        $(id).set('_onchange',this.eraseFunc(change));
    	}
        var dblclick = item.get('ondblclick');
        if($chk(dblclick)){
            $(id).set('_ondblclick',this.eraseFunc(dblclick));
        }
        return id;
    },
	initData:function(el,elData,formObj){
    	if (!$defined(elData))elData = "";
    		var temp = elData.value;
    		if($defined(temp)){
    			elData = temp;
    		}
    		el.set('value', elData);
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
        var keyup = vobj.get('_onkeyup');
        if($chk(keyup)){
            vobj.addEvent('keyup', function(e){
                this.getFunc(keyup)[0](e);
            }.bind(formObj));
        }
        	var dblclick = vobj.get('_ondblclick');
        	if($chk(dblclick)){
	            vobj.addEvent('dblclick', function(e){
	            		this.getFunc(dblclick)[0](e);
	            }.bind(formObj));
        	}
        	var change = vobj.get('_onchange');
        	if($chk(change)){
	            vobj.addEvent('change', function(e){
	            		this.getFunc(change)[0](e);
	            }.bind(formObj));
        	}
        	var keydown = vobj.get('_onkeydown');
        	if($chk(keydown)){
	            vobj.addEvent('keydown', function(e){
	            		this.getFunc(keydown)[0](e);
	            }.bind(formObj));
        	}
        	var blur = vobj.get('_onblur');
        	if($chk(blur)){
	            vobj.addEvent('blur', function(e){
	            		this.getFunc(blur)[0](e);
	            }.bind(formObj));
        	}
        	var click = vobj.get('_onclick');
        	if($chk(click)){
	            vobj.addEvent('click', function(e){
	            		this.getFunc(click)[0](e);
	            }.bind(formObj));
        	}
        vobj.addEvent('blur', function(e) {debugger;
            var el = e.target;
            var val = el.get('value');
        	el.set('oValue', val);
            el.set('realvalue', val);
        }.bind(formObj));
    },
    initWidget:function(){
        return null;
    },
    eraseFunc:function(func){
    	func = func.toString();
		if(func.indexOf("{")!=-1){
			func = func.substr(func.indexOf("{")+1);
			func = func.substr(0,func.indexOf("}"));
		}
		return func;
    }
});
