/**
 * Created by IntelliJ IDEA.
 * User: gmq
 * Date: 12-10-22
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
var SwordRadioCheckboxTemplate = {
    start:'<div class="swordform_field_wrap"><div id="{id}" class="formselect-list swordform_item_oprate" style="{style}" widgetGetValue="true" name="{name}" '
    	+'widget="{type}" type="{type}" onClickAfter="{onClickAfter}" onClickBefore="{onClickBefore}" defValue="{defValue}" msg="{msg}" '
    	+'ruletype="{type}Group" rule="{rule}" "{disable}">',
    inner_before:'<div class="formselect-list-inner">',
    inner_h:'<div class="formselect-list-item" code="{code}" caption="{caption}" style="{colWidth}"><input type="{type}" ruletype="{type}Group" name="{name}" '
    	+' style="cursor: pointer;" value="{code}" ',
    inner_e:' /><span title="{caption}"> {caption}</span></div>',
    end:'</div>',
    render:function (item, formObj, fName, itemData) {
    	var tem = [this.start];
        var name = item.get("name"),id = fName + "_"+name,type = item.get("type"),rule=item.get("rule"),defV=item.get('defValue'),msg=item.get("msg");
        var readonly = item.get("readonly")||item.getAttribute("readonly"),disable = item.get("disable"),colWidth=item.get("colWidth"),colwStr=colWidth?"width:"+colWidth:"";
        tem[0]=tem[0].substitute({
             id : id,
             name : name,
             style: item.get("style"),
             rule: rule,
             msg: msg,
             type: type,
             defValue : defV,
             onClickAfter : item.get("onClickAfter"),
             onClickBefore : item.get("onClickBefore"),
             disable:disable=="true"?"disabled":""
         });
        formObj.fieldElHash.set(id,$(id));
		var value=itemData?itemData.value:(defV||"");
		if(value){value=value.split(",");}
        tem.push(this.inner_before);
        var dataA=pc.getInitData( item.get('name'));
        var childEls = (dataA?dataA.data:item.getChildren('div'))||item.getChildren('div');
        childEls.forEach(function(o,i){
        	var tcode=o.code||o.get("code"),tcaption= o.caption||o.get("caption");
        	var tHtml=SwordRadioCheckboxTemplate.inner_h.substitute({
                code : tcode,
                caption :tcaption,
                type : type,
                name : name,
                colWidth:colwStr
            });
        	if(value.contains(tcode)){
        		tem.push(tHtml.replace("formselect-list-item", "formselect-list-item formselect-selected"));
    			tem.push(" checked='true' ");
    		}else{
    			tem.push(tHtml);
    		}
        	if (disable == "true") {
    			tem.push(" disabled ");
    		}
    		if (readonly == "true") {
    			tem.push(" readonly='readonly' ");
    		}
    		tem.push(SwordRadioCheckboxTemplate.inner_e.substitute({
                caption :tcaption
            }));
        });
        tem.push(this.end);//inner结束
        tem.push(this.end);
        tem.push(this.end);
        return tem.join("");
    },
    initData:function (el, d,formObj,item) {
    	var innerWrap;
    	if($defined(item)){
    		innerWrap=item;
    	}else{
            innerWrap=formObj.getWidget(el.get("name")).innerWrap;
        }
    	var dv = innerWrap.get("defValue");
    	if(d == "" && $defined(dv)){
    		d=dv;
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
                        inp.set("checked", "true");
                        inp.getParent().addClass('formselect-selected');
                    }
                }
            }, this);
        }
    }
    ,initWidget:function(name, item, formObj){
    	var el=$$("div[name="+name+"]")[0];
    	var ta = new SwordGroupFields(el);
    	ta.innerWrap=item;
    	ta.wrap=item;
    	ta.options.validate = formObj.Vobj;
    	formObj.setWidget(name, ta);
        return ta;
    }
    ,runEventFocus:function(e,el,formObj){
    	return;//不处理
    }
    ,runEventClick:function(e,el,formObj){
    	var name=el.get("name"),rule=el.get("rule"),cObj=formObj.getField(name);
    	var tEl=$(e.target),liEl=tEl.hasClass("formselect-list-item")?tEl:tEl.getParent(".formselect-list-item"),input=liEl.getElement("input");
    	var code=liEl.get("code"),caption=liEl.get("caption"),onBefore=el.get("onClickBefore"),onAfter=el.get("onClickAfter");
    	if(rule){
    		cObj.options.validate.tooltips.hide(name);
    		cObj.options.validate.intimeValidate(el);
        }
    	if($defined(onBefore))
        	cObj.getFunc(onBefore)[0](code, caption, liEl,formObj);
        if(input.get('type') == 'checkbox') {
            if(input.get("checked")) {
                if(tEl != input) {
                    if(!$chk(input.get('disabled')))input.set("checked", false);
                    liEl.removeClass('formselect-selected');
                }
                else  liEl.addClass('formselect-selected');
            }
            else {
                if(tEl != input) {
                    if(!$chk(input.get('disabled')))input.set("checked", true);
                    liEl.addClass('formselect-selected');
                }
                else  liEl.removeClass('formselect-selected');
            }
        } else {
            if(!$chk(input.get('disabled'))) {
            	cObj.reset();
            	liEl.addClass('formselect-selected');
                input.set("checked", true);
            }
        }
        if($defined(onAfter))
        	cObj.getFunc(onAfter)[0](code, caption, liEl,formObj);
	}
    ,runEventBlur:function(e,el,formObj){
    	return;//不处理
    }
    ,runEventDblClick:function(e,el,formObj){
    	return;//不处理
    }
    ,runEventKeydown:function(e,el,formObj){
    	return;//不处理
    }
    ,runEventKeyup:function(e,el,formObj){
    	return;//不处理
    }
};
