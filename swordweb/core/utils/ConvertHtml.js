var _swordDefaultAttrs = {
    'value':'value'
    ,'dataformat':'dataformat'
    ,'readonly':'readonly'
    ,'disabled':'disabled'
    ,'maxlength':'maxlength'
    ,'onclick':'onclick'
    ,'ondblclick':'ondblclick'
    ,'onchange':'onchange'
    ,'onmouseover':'onmouseover'
    ,'onmouseout':'onmouseout'
    ,'onblur':'onblur'
    ,'onkeydown':'onkeydown'
    ,'onkeyup':'onkeyup'
    ,'onfocus':'onfocus'
};
var ConvertHtml = new Class({
    build:function(obj, item, options) {
        var attributes = this.init(obj, item, options);
        obj.set(attributes);
    }
    ,init:function(obj, item, options) {
        var ats = {};
        if (item) {
            if (Browser.Engine.trident) {
                ['onclick','ondblclick','onchange','onmouseover','onmouseout','onblur','onkeydown','onkeyup','onfocus'].each(function(em) {
                    if (item.get(em))this.convertEvent(obj, {name:em,value:item.get(em)}, options);
                }.bind(this));
                if(item.getAttribute('readonly')==undefined){
                    return {
                        'dataformat':obj.get('dataformat')||item.get('dataformat'),
                        'value': obj.get('value')||item.get('value'),
                        'disabled':obj.disabled||item.disabled,
                        'maxlength':item.get('maxLength')||1000000
                    }
                }else {
                    return {
                        'dataformat':obj.get('dataformat')||item.get('dataformat'),
                        'value': obj.get("value")||item.get('value'),
                        'readonly':true,
                        'disabled':obj.disabled||item.disabled,
                        'maxlength':item.get('maxLength')||1000000
                    }
                }

            } else {
                var attr = item.attributes;if(!attr)return ats;
                for (var i = 0; i < attr.length; i++) {
                    if (attr[i].specified) {
                        var res = this.convertAttr(obj, attr[i], options);
                        if (res['type'] == "1") {
                            this.convertEvent(obj, attr[i], options);
                        } else if (res['type'] == "0") {
                            var key = attr[i].name;
                            ats[key] = res['value'];
                        }
                    }
                }
            }
        }
        return ats;
    }
    ,convertAttr:function(obj, attr, options) {
        var res = {};
        var op = attr.name;
        var ats = _swordDefaultAttrs[op.toLowerCase()];
        if (ats) {
            if ((/^on[a-zA-Z]/).test(attr.name)) {
                res['type'] = "1";
            } else {
                res['type'] = "0";
                res['value'] = attr.value ? attr.value : true;
            }
        } else {
            res['type'] = "-1";
        }
        return res;
    }
    ,convertEvent:function(obj, attr, options) {
        var funcs = sword_getFunc(attr.value);
        for (var i = 0; i < funcs.length; i++) {
            if (options && options[attr.name]) {
                obj.addEvent(attr.name.toLowerCase().substring(2), funcs[i].pass(options[attr.name]));
            } else {
                obj.addEvent(attr.name.toLowerCase().substring(2), funcs[i]);
            }
        }
    }
});
var _convertHTML = new ConvertHtml();
function sword_convertHTML(obj, item, options) {
    _convertHTML.build(obj, item, options);
}