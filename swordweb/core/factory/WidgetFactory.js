var WidgetFactory = new Class({
            name:"WidgetFactory"
            ,initialize: function() {
            }
            ,create: function(param) {
                var swordWidget = null;
                var className = param;
                var loadSwordCss,loadCssName;
                    if ($type(param) != 'string') {
                        className = param.get('sword');
                        loadSwordCss = param.get('loadSwordCss');
                        loadCssName = param.get("loadStyle");
                    }
                if ($SwordWebRunmode.isDev()) {
                    if(className!="SwordForm_plex")jsR.doIm(className, loadSwordCss, loadCssName);
                    else jsR.doIm("SwordForm", loadSwordCss, loadCssName);
                }
                    swordWidget = eval("new " + className + "()");

                return swordWidget;
            }
        });

