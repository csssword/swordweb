var $SwordShielding = (function() {
    function shielding() {
        if ($SwordLoader.isIE) {
            document.onkeydown = function() {
                return SwordShielding(event, $(event.srcElement));
            }
        } else {
            document.onkeypress = function(e) {
                return SwordShielding(e, $(e.target));
            }
        }
    }

    function SwordShielding(e, el) {
        var s = swordCfg.shields;
        var f5 = true;
        var bp = true;
        var cm = true;
        if (s["f5"])f5 = shieldingF5(e);
        if (s["backspace"])bp = shieldingBackSpace(e, el);
        if (s["contextMenu"])cm = shieldingRightClick(e);
        return f5 && bp && cm;
    }

    function shieldingF5(e) {
        with (e) {
            if (keyCode == 116 || (ctrlKey && keyCode == 82)) {
                e.keyCode = 0;
                e.cancelBubble = true;
                return false;
            }
        }
        return true;
    }

    function shieldingBackSpace(e, el) {
        var type = el.type;
        var code = e.keyCode;
        if (code != 8)return true;
        if (el.getAttribute("readonly"))return false;
        return (code != 8 || type == 'button' || (type == 'text'&&!['calendar','select'].contains(el.get('widget'))) || (type == "password") || (type == 'textarea') || (type == 'submit'))
    }

    function shieldingRightClick(e) {
        if (window.Event) {
            if (e.which == 2 || e.which == 3)
                return false;
        } else if (e.button == 2 || e.button == 3) {
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }
        return true;
    }


    return {
          shielding: shielding
    };
})();
$SwordShielding.shielding();