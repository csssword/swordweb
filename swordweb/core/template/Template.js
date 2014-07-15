/**
 * Sword平台模板实现
 */
var STemplateEngine = (function () {
    var SwordTemplate = new Class({
        isTemplate:true,
        disableFormats:false,
        re:/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
        compileARe:/\\/g,
        compileBRe:/(\r\n|\n)/g,
        compileCRe:/'/g,
        initialize:function (html) {
            var me = this,
                args = html,
                buffer = [],
                i = 0,
                length = args.length,
                value;
            me.initialConfig = {};
            if (length > 1) {
                for (; i < length; i++) {
                    value = args[i];
                    if (typeof value == 'object') {
                        $extend(me.initialConfig, value);
                        $extend(me, value);
                    } else {
                        buffer.push(value);
                    }
                }
                html = buffer.join('');
            } else {
                if ($type(html) == 'array') {
                    buffer.push(html.join(''));
                } else if ($type(html) == 'arguments') {
                    buffer.push(html[0]);
                } else {
                    buffer.push(html);
                }
            }
            me.html = buffer.join('');
            if (me.compiled) {
                me.compile();
            }
        },
        //把模板中插值用传入Values中的值来取代
        applyTemplate:function (values) {
            var me = this,
                useFormat = me.disableFormats !== true,
                fm = SwordTemplateFormat,
                tpl = me;
            if (me.compiled) {
                return me.compiled(values);
            }
            function fn(m, name, format, args) {
                if (format && useFormat) {
                    if (args) {
                        args = [values[name]].concat(new Function('return [' + args + '];')());
                    } else {
                        args = [values[name]];
                    }
                    if (format.substr(0, 5) == "this.") {
                        return tpl[format.substr(5)].apply(tpl, args);
                    }
                    else {
                        return fm[format].apply(fm, args);
                    }
                }
                else {
                    return values[name] !== undefined ? values[name] : "";
                }
            }

            return me.html.replace(me.re, fn);
        },

        set:function (html, compile) {
            var me = this;
            me.html = html;
            me.compiled = null;
            return compile ? me.compile() : me;
        },

        compile:function () {
            var me = this,
                fm = SwordTemplateFormat,
                useFormat = me.disableFormats !== true,
                body, bodyReturn;

            function fn(m, name, format, args) {
                if (format && useFormat) {
                    args = args ? ',' + args : "";
                    if (format.substr(0, 5) != "this.") {
                        format = "fm." + format + '(';
                    }
                    else {
                        format = 'this.' + format.substr(5) + '(';
                    }
                }
                else {
                    args = '';
                    format = "(values['" + name + "'] == undefined ? '' : ";
                }
                return "'," + format + "values['" + name + "']" + args + ") ,'";
            }

            bodyReturn = me.html.replace(me.compileARe, '\\\\').replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn);
            body = "this.compiled = function(values){ return ['" + bodyReturn + "'].join('');};";
            eval(body);
            return me;
        },
//    insertFirst:function (el, values, returnElement) {
//        return this.doInsert('afterBegin', el, values, returnElement);
//    },
//    insertBefore:function (el, values, returnElement) {
//        return this.doInsert('beforeBegin', el, values, returnElement);
//    },
//    insertAfter:function (el, values, returnElement) {
//        return this.doInsert('afterEnd', el, values, returnElement);
//    },
//    append:function (el, values, returnElement) {
//        return this.doInsert('beforeEnd', el, values, returnElement);
//    },
//    doInsert:function (where, el, values, returnEl) {
//        el = $$(el);
//        var newNode = Ext.DomHelper.insertHtml(where, el, this.apply(values));
//        return returnEl ? Ext.get(newNode, true) : newNode;
//    },
        overwrite:function (el, values, returnElement) {
            el = $(el);
            el.innerHTML = this.applyTemplate(values);
            return returnElement ? el.getFirst() : null;
        },
        createFragment:function (html) {
            var div = document.createElement("div");/*,
                fragment = document.createDocumentFragment(),
                i = 0,
                length, childNodes;*/
            div.innerHTML = html;
            /*childNodes = div.childNodes;
            length = childNodes.length;
            for (; i < length; i++) {
                fragment.appendChild(childNodes[i]);
            }*/
            return div;
        },
        createFragmentForGrid:function(html,datas){
        	var div = document.createElement("div"),i = 0;/*,
	            fragment = document.createDocumentFragment(),
	            i = 0,
	            length, childNodes;*/
	        div.innerHTML = html;
	        childNodes = div.childNodes;
	        length = childNodes.length;
	        for (; i < length; i++) {
	           /* fragment.appendChild(childNodes[i]);
	            var row = $$(fragment.childNodes)[i];*/
	        	$(childNodes[i]).store("rowData",datas[i]);
	        }
	        return div;
        },
        formatResolve:function(el,yEl){
        	yEl.get("format")?el.set("format",yEl.get("format")):null;
        	yEl.get("submitformat")?el.set("submitformat",yEl.get("submitformat")):null;
//        	yEl.get("css")?el.set("style", yEl.get("css")):null;
        	var css = yEl.get("css");
        	if(css){
        		if(Browser.Engine.trident4&&css.indexOf('text-align:right')!=-1&&css.indexOf('padding-right')==-1)css = css+" ;padding-right:2px;";  //IE6下数字居右光标出不来
            	el.set("style", css);
        	}
        }
    });

    var SwordXTemplate = new Class({
        Extends:SwordTemplate,
        argsRe:/<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
        nameRe:/^<tpl\b[^>]*?for="(.*?)"/,
        ifRe:/^<tpl\b[^>]*?if="(.*?)"/,
        execRe:/^<tpl\b[^>]*?exec="(.*?)"/,
        codeRe:/\{\[((?:\\\]|.|\n)*?)\]\}/g,
        re:/\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?\}/g,
        render:function (html, node, data) {
            this.initialize(html);
            return this.applyTemplate(node, data);
        },
        initialize:function () {
            if (arguments.length < 1)return this;
            this.parent(arguments);
            var me = this,
                html = me.html,
                argsRe = me.argsRe,
                nameRe = me.nameRe,
                ifRe = me.ifRe,
                execRe = me.execRe,
                id = 0,
                tpls = [],
                VALUES = 'values',
                DATA = 'data',
                PARENT = 'parent',
                XINDEX = 'xindex',
                XCOUNT = 'xcount',
                RETURN = 'return ',
                WITHVALUES = 'with(values){ ',
                m, matchName, matchIf, matchExec, exp, fn, exec, name, i;
            html = ['<tpl>', html, '</tpl>'].join('');
            while ((m = html.match(argsRe))) {
                exp = null;
                fn = null;
                exec = null;
                matchName = m[0].match(nameRe);
                matchIf = m[0].match(ifRe);
                matchExec = m[0].match(execRe);
                exp = matchIf ? matchIf[1] : null;
                if (exp) {
                    //todo if表达式
                    fn = me.functionFactory(VALUES,DATA,PARENT, XINDEX, XCOUNT, 'try{' + RETURN + me.htmlDecode(exp) + ';}catch(e){return;}');
                }
                exp = matchExec ? matchExec[1] : null;
                if (exp) {
                    //todo exec表达式 执行一段代码
                    exec = me.functionFactory(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + me.htmlDecode(exp) + ';}');
                }
                name = matchName ? matchName[1] : null;
                if (name) {
                    //todo for循环,指定要循环的target,也就是for='name'中的name指向哪个数据块
                    if (name === '.') {
                        name = VALUES;
                    } else if (name === '..') {
                        name = PARENT;
                    }
                    name = me.functionFactory(VALUES, DATA, PARENT, 'try{with(' + DATA + '){' + RETURN + name + ';}}catch(e){return;}');
                }
                tpls.push({id:id, target:name, exec:exec, test:fn, body:m[1] || ''});
                html = html.replace(m[0], '{xtpl' + id + '}');
                id = id + 1;
            }
            for (i = tpls.length - 1; i >= 0; --i) {
                me.compileTpl(tpls[i]);
            }
            me.master = tpls[tpls.length - 1];
            me.tpls = tpls;
        },
        // @private
        applySubTemplate:function (id, values, data, parent, xindex, xcount) {
            var me = this, t = me.tpls[id];
            return t.compiled.call(me, values, data, parent, xindex, xcount);
        },


        compileTpl:function (tpl) {
            var fm = SwordTemplateFormat,
                me = this,
                useFormat = me.disableFormats !== true,
                body, bodyReturn, evaluatedFn;

            function fn(me, name, format, args, math) {
                var v;
                // name is what is inside the {}
                // Name begins with xtpl, use a Sub Template
                if (name.substr(0, 4) == 'xtpl') {
                    return "',this.applySubTemplate(" + name.substr(4) + ", values,data,parent,xindex, xcount),'";
                }
                // name = "." - Just use the values object.
                if (name == '.') {
                    // filter to not include arrays/objects/nulls
                    v = '["string", "number", "boolean"].indexOf($type(values)) > -1 || me.isDate(values) ? values : ""';
                }
                // name = "#" - Use the xindex
                else if (name == '#') {
                    //todo 如果是{#}号，则自动填充索引号
                    v = 'xindex';
                }
                else if (name.substr(0, 7) == "parent.") {
                    //todo 如果是parent. 则从el的parentNode取值,如果values是Object？
                    //v = name;
                    v = "$type(values)=='element'?$(values.parentNode).getAttribute('" + name.substr(7) + "'):$(parent).get('"+name.substr(7)+"')";
                }
                // name has a . in it - Use object literal notation, starting from values
                else if (name.indexOf('.') != -1) {
                    //todo 如果name里包含'.'，但不是parent.,则从data里取值
                    //v = "values." + name;
                    v = "data." + name;
                } else {
                    //name is a property of values
                    //v = "values['" + name + "']";
                    //todo 此处改成values是el对象，data是JSON对象
                    //todo 如果el.get(name)取不到值，就去data的根上去取值
                    //v = "$type(values)=='element'?values.get('" + name + "'):values['" + name + "']";
                	if(name!="html"){v = "(($type(values)=='element'?values.getAttribute('"+name+"'):values['" + name + "'])||data['" + name + "'])";}
                	else{ v = "(($type(values)=='element'?values.get('"+name+"'):values['" + name + "'])||data['" + name + "'])";}
                }
                if (math) {
                    v = '(' + v + math + ')';
                }
                if (format && useFormat) {
                    args = args ? ',' + args : "";
                    if (format.substr(0, 5) != "this.") {
                        format = "fm." + format + '(';
                    }
                    else {
                        format = 'this.' + format.substr(5) + '(';
                    }
                } else {
                    args = '';
                    format = "(" + v + " === undefined ? '' : ";
                }
                return "'," + format + v + args + "),'";
            }

            function codeFn(me, code) {
                // Single quotes get escaped when the template is compiled, however we want to undo this when running code.
                return "',(" + code.replace(me.compileARe, "'") + "),'";
            }

            bodyReturn = tpl.body.replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn).replace(me.codeRe, codeFn);
            body = "evaluatedFn = function(values,data,parent, xindex, xcount){return ['" + bodyReturn + "'].join('');};";
            eval(body);
            //todo 增加了一个参数data
            tpl.compiled = function (values, data, parent, xindex, xcount) {
                var vs, length, buffer, i;
                if (tpl.test && !tpl.test.call(me, values,data,parent, xindex, xcount)) {
                    return '';
                }
                //todo 取到for循环的name指向的数据块(数据块可能是element数组,也可能是JOSN数据数组)
                vs = tpl.target ? tpl.target.call(me, values, data, parent) : (values||{});
                if (!vs) {
                    return '';
                }
                parent = tpl.target ? values : parent;
                if (tpl.target && $type(vs) == 'array') {
                    buffer = [];
                    length = vs.length;
                    if (tpl.exec) {
                        for (i = 0; i < length; i++) {
                            buffer[buffer.length] = evaluatedFn.call(me, vs[i], data, parent, i + 1, length);
                            tpl.exec.call(me, vs[i], parent, i + 1, length);
                        }
                    } else {
                        for (i = 0; i < length; i++) {
                            buffer[buffer.length] = evaluatedFn.call(me, vs[i], data, parent, i + 1, length);
                        }
                    }
                    return buffer.join('');
                }
                if (tpl.exec) {
                    tpl.exec.call(me, vs, parent, xindex, xcount);
                }
                return evaluatedFn.call(me, vs, data, parent, xindex, xcount);
            };
            return this;
        },
        //todo 第一个参数是数据(可能是element),第二个参数是data(由各组件自行构造的JSON数据)
        applyTemplate:function (values, data) {
            return this.master.compiled.call(this, values, data, {}, 1, 1);
        },
        compile:function () {
            return this;
        },
        htmlDecode:(function () {
            var entities = {
                '&amp;':'&',
                '&gt;':'>',
                '&lt;':'<',
                '&quot;':'"'
            }, keys = [], p, regex;
            for (p in entities) {
                keys.push(p);
            }
            regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
            return function (value) {
                return (!value) ? value : String(value).replace(regex, function (match, capture) {
                    if (capture in entities) {
                        return entities[capture];
                    } else {
                        return String.fromCharCode(parseInt(capture.substr(2), 10));
                    }
                });
            };
        })(),
        functionFactory:function () {
            var args = Array.prototype.slice.call(arguments);
            return Function.prototype.constructor.apply(Function.prototype, args);
        },
        isDate:function (value) {
            return Object.prototype.toString.call(value) === '[object Date]';
        }
    });
    var SwordTemplateFormat = {
        stripTagsRE:/<\/?[^>]+>/gi,
        stripTags:function (v) {
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        }
    };
    return new SwordXTemplate('');
})();

