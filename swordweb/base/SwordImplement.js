Array.implement({
    shuffle:function () {
        for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    },
    split:function (s) {
        var r = [], t = [];
        this.clean().each(function (em, i, a) {
            if ((i + 1) % s != 0) {
                t.include(em);
                if (i + 1 == a.length) {
                    r.include(t);
                    t = null;
                }
            } else {
                t.include(em);
                r.include(t);
                t = (i + 1 == a.length) ? null : [];
            }
        });
        return r;
    },
    splitForm:function (s) {
        var r = [], t = [], tL = 0;
        this.clean().each(function (em, i, a) {
            var row = (em.get("cols") || 1) / 1;
            if (tL == 0 || tL + row <= s) {
                t.include(em);
                tL += row;
            } else {
                r.include(t);
                t = [];
                t.include(em);
                tL = row;
            }
            if (i + 1 == a.length) {
                r.include(t);
                t = null;
                tL = null;
            }
        });
        return r;
    }, eachFromLast:function (fn, bind) {
        for (var i = this.length - 1, l = 0; i >= l; i--) fn.call(bind, this[i], i, this);
    }, sum:function () {
        var t = 0;
        for (var i = 0; i < this.length; i++) {
            if ($chk(this[i])) {
                t += this[i] / 1;
            }
        }
        return t;
    }

});

Element.implement({
    'hover':function (fn1, fn2) {
        this.addEvents({
            'mouseenter':function (e) {
                fn1.attempt(e, this);
            },
            'mouseleave':function (e) {
                fn2.attempt(e, this);
            }
        })
    },
    isDisplayed:function () {
        var screenLocation = window.getScroll();
        var screenSize = window.getSize();
        screenLocation.x2 = screenLocation.x + screenSize.x;
        screenLocation.y2 = screenLocation.y + screenSize.y;
        var coordinates = this.getCoordinates();
        return (
            (coordinates.left >= screenLocation.x &&
                coordinates.left <= screenLocation.x2) ||
                (coordinates.right >= screenLocation.x &&
                    coordinates.right <= screenLocation.x2) ||
                (coordinates.left <= screenLocation.x &&
                    coordinates.right >= screenLocation.x2)
            ) && (
            (coordinates.top >= screenLocation.y &&
                coordinates.top <= screenLocation.y2) ||
                (coordinates.bottom >= screenLocation.y &&
                    coordinates.bottom <= screenLocation.y2) ||
                (coordinates.top <= screenLocation.y &&
                    coordinates.bottom >= screenLocation.y2)
            );
    },
    getPos:function (p) {
        var r = this.getStyle(p);
        return (r.indexOf('px') == -1) ? r.toInt() : (r.split('px')[0]).toInt();
    }, 'hoverClass':function (classname) {
        this.hover(function () {
            this.addClass(classname);
        }, function () {
            this.removeClass(classname);
        });
        return this;
    }


});


(function () {


    Element.implement({

        _getPosition:function () {
            if (!Browser.Engine.trident)return this.getPosition();
            if (isBody(this)) return {x:0, y:0};
            return  this._getOffsets();
        },
        _getOffsets:function () {
            if (Browser.Engine.trident) {
                var scroll = this.getDocument().getScroll();
                try {
                    var bound = this.getBoundingClientRect();
                    return {
                        x:bound.left + scroll.x,
                        y:bound.top + scroll.y
                    };
                } catch (e) {
                    return {
                        x:-1000,
                        y:-1000
                    }
                }
            }
        },
        getHTML:function () {
            var attr;
            var attrs = this.attributes;
            var str = "<" + this.tagName;
            for (var i = 0; i < attrs.length; i++) {
                attr = attrs[i];
                if (attr.specified)
                    str += " " + attr.name + "='" + attr.value + "'";
            }
            if (!this.canHaveChildren)
                return str + ">";
            return str + ">" + this.innerHTML + "</" + this.tagName + ">";
        }

    });
    function isBody(element) {
        return (/^(?:body|html)$/i).test(element.tagName);
    }
})();

Native.implement([Element, Window, Document], {
    cloneAllEvents:function (from, type) {
        from = $(from);
        from.getElements("*").each(function (item) {
            var fevents = item.retrieve('events');
            if (!fevents) return this;
            if (!type) {
                for (var evType in fevents) this.cloneEvents(item, evType);
            } else if (fevents[type]) {
                fevents[type].keys.each(function (fn) {
                    item.addEvent(type, fn);
                }, this);
            }
        }, this);
        return this;
    }
});

var DragTable = new Class({
    Extends:Sortables, insert:function (dragging, element) {
        if (!element)return;
        var where = 'inside';
        if (this.lists.contains(element)) {
            this.list = element;
            this.drag.droppables = this.getDroppables();
        } else {
            where = this.element.getAllPrevious().contains(element) ? 'before' : 'after';
        }
        this.element.inject(element, where);
        this.fireEvent('sort', [this.element, this.clone, element, where]);
    },
    start:function (event, element) {
        if (!this.idle) return;
        this.idle = false;
        this.element = element;
        this.opacity = element.get('opacity');
        this.list = element.getParent();
        this.clone = this.getClone(event, element);
        this.drag = new Drag.Move(this.clone, {
            snap:this.options.snap,
            container:this.options.constrain && this.element.getParent(),
            droppables:this.getDroppables(),
            onSnap:function () {
                this.clone.setStyle('visibility', 'visible');
                this.clone.setStyle('opacity', 0.5);
                this.element.set('opacity', this.options.opacity || 0);
                this.fireEvent('start', [this.element, this.clone]);
            }.bind(this),
            onDrop:this.insert.bind(this),
            onCancel:this.reset.bind(this),
            onComplete:this.end.bind(this), onEnter:this.doEnter.bind(this), onLeave:this.doLeave.bind(this)
        });
        this.clone.inject(this.element, 'before');
        this.drag.start(event);
    }, doEnter:function (el, dl) {
        this.fireEvent('enter', [el, dl]);
    }, doLeave:function (el, dl) {
        this.fireEvent('leave', [el, dl]);
    }
});
String.implement({
    'bLength':function () {
        if (this == null) {
            return 0;
        } else {
            return (this.length + this.replace(/[\u0000-\u00ff]/g, "").length);
        }
    }, 'bSubString':function (start, size) {
        var x = 0;
        var str = this.replace(/[\s\S]/g, function (d, i, s) {
            if (d.charCodeAt(0) > 127) x++;
            if (x + i >= size) return "";
            return d;
        });
        return str;
    }, 'toHash':function () {
        if (!this.contains('|') && !this.contains(',') && !this.contains('code') && !this.contains('caption'))return this;
        var r = new Hash();
        var a = this.split('|');
        a.each(function (item) {
            if (item.contains(',')) {
                var s = item.split(',')[0];
                r.set(s, item.replace((s + ','), ''));
            } else {
                r.set(item, null);
            }
        });
        return r;
    }, startWith:function (str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length)
            return false;
        if (this.substr(0, str.length) == str)
            return true;
        else
            return false;
        return true;
    }, endWith:function (str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length)
            return false;
        if (this.substring(this.length - str.length) == str)
            return true;
        else
            return false;
        return true;
    }
});
Options.implement({
    htmlOptions:function (htmlNode) {
        for (var key in (this.options || {})) {
            var v = htmlNode.get(key);
            this.options[key] = ($chk(v) && $defined(v)) ? v : this.options[key];
            if (key == 'pNode') {
                this.options[key] = htmlNode.pNode;
                continue;
            }
            if ($type(this.options[key]) != 'function' && (/^on[A-Z]/).test(key)) {
                var methods = this.getFunc(this.options[key]);
                for (var i = 0; i < methods.length; i++) {
                    this.addEvent(key, methods[i]);
                }
            }
        }
        return this.setOptions();
    }, getFunc:function (str) {
        return sword_getFunc(str);
    }
});
function sword_getFunc(str) {
    if (!str) {
        str = '';
    }
    if (typeof str == "function") {
        str = str.toString();
        var id1 = str.indexOf("{") + 1;
        if (id1 > 0) {
            var id2 = str.lastIndexOf("}");
            str = str.substring(id1, id2);
        }
    }
    var array = str.split(/\s*;\s*/);
    var res = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].trim() != "") {
            var method = array[i].substring(0, array[i].indexOf("(")) || undefined;
            var arg = array[i].substring(array[i].indexOf("(") + 1, array[i].indexOf(")")) || undefined;
            if ((arg && arg.trim() == "") || arg == undefined) {
                arg = "";
            } else {
                arg = "," + arg;
            }

            res.push(new Function("return sword_excutefunc(" + method.trim() + ",arguments" + arg + ")"));
        }
    }
    return res;
}
function sword_excutefunc(method, args) {
    var array = new Array();
    for (var i = 2; i < arguments.length; i++) {
        array.push(arguments[i]);
    }
    if (typeof(method) == "object") {
        var m = new function (args) {
            method(array);
        };
        return;
    }
    if (args) {
        var tps = Array().slice.call(args);
        array = array.concat(tps);
    }
    return method.apply(this, array);
}
Fx.ProgressBar = new Class({

    Extends:Fx,

    options:{
        text:null,
        url:null,
        transition:Fx.Transitions.Circ.easeOut,
        fit:true,
        link:'cancel'
    },

    initialize:function (element, options) {
        this.element = $(element);
        this.parent(options);

        var url = this.options.url;
        if (url) {
            this.element.setStyles({
                'background-image':'url(' + url + ')',
                'background-repeat':'no-repeat'
            });
        }

        if (this.options.fit) {
            url = url || this.element.getStyle('background-image').replace(/^url\(["']?|["']?\)$/g, '');
            if (url) {
                var fill = new Image();
                fill.onload = function () {
                    this.fill = fill.width;
                    fill = fill.onload = null;
                    this.set(this.now || 0);
                }.bind(this);
                fill.src = url;
                if (!this.fill && fill.width) fill.onload();
            }
        } else {
            this.set(0);
        }
    },

    start:function (to, total) {
        return this.parent(this.now, (arguments.length == 1) ? to.limit(0, 100) : to / total * 100);
    },

    set:function (to) {
        this.now = to;
        var css = (this.fill)
            ? (((this.fill / -2) + (to / 100) * (this.element.width || 1) || 0).round() + 'px')
            : ((100 - to) + '%');

        this.element.setStyle('backgroundPosition', css + ' 0px').title = Math.round(to) + '%';

        var text = $(this.options.text);
        if (text) text.set('text', Math.round(to) + '%');

        return this;
    }

});

