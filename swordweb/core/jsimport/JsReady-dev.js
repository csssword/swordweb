var jsR = new JsReady();
jsR.baseWidgets = ['SwordShielding','Base','i18n','WidgetFactory','Utils','Redirect','SwordClientCache','PageContainer','SwordPopUpBox','SwordMenu','SwordCss','SwordSubmit','SwordFileUpload2','Template','SwordEventDelegator'];
//jsR.addWidget({name:"Base",prefixPath:"swordweb/base",jsPath:['mootools-1.3.2-all.js','SwordImplement.js','adapter/adapter-1.3.2.js']});
jsR.addWidget({name:"Base",prefixPath:"swordweb/base",jsPath:['mootools-1.2.1-all.js','SwordImplement.js']});
jsR.addWidget({name:"i18n",prefixPath:"swordweb/core/i18n",jsPath:['zh-cn.js']});
jsR.addWidget({name:"Template",prefixPath:"swordweb/core/template",jsPath:['Template.js','FileTemplate.js','SwordGridFields.js','juicerTemplate.js',
'LabelTemplate.js','PasswordTemplate.js','RadioTemplate.js','SwordCalendarTemplate.js','SwordPulltreeTemplate.js','SwordSelectTemplate.js','TextareaTemplate.js','HiddenTemplate.js','TextTemplate.js','SwordFormTemplate.js','SwordGridTemplate.js']});
jsR.addWidget({name:"SwordEventDelegator",prefixPath:"swordweb/core/event",jsPath:['SwordEventDelegator.js']});
jsR.addWidget({name:"SwordShielding",prefixPath:"swordweb/widgets/SwordShielding",jsPath:['SwordShielding.js']});
jsR.addWidget({name:"Utils",prefixPath:"swordweb/core/utils",jsPath:['SwordUtils.js','SwordDataFormat.js','Xml.js','ConvertHtml.js']});
jsR.addWidget({name:"SwordCss",prefixPath:"swordweb/widgets/SwordCss",cssPath:['sword.css']});
jsR.addWidget({name:"LogonCss",prefixPath:"swordweb/widgets/LogonCss",cssPath:['login.css']});
jsR.addWidget({name:"FrameCss",prefixPath:"swordweb/widgets/FrameCss",cssPath:['frame1.css']});
jsR.addWidget({name:"SwordSecurityOperate",prefixPath:"swordweb/widgets/SwordSecurityOperate",jsPath:['SwordSecurityOperate.js']});
//jsR.addWidget({name:"SwordLogger",prefixPath:"swordweb/widgets/SwordLogger",jsPath:['SwordLogger.js'],cssPath:['logger.css']});
jsR.addWidget({name:"WidgetFactory",prefixPath:"swordweb/core/factory",jsPath:['WidgetFactory.js']});
jsR.addWidget({name:"PageContainer",prefixPath:"swordweb/core/container",jsPath:['PageContainer.js']});
jsR.addWidget({name:"Redirect",prefixPath:"swordweb/core/redirect",jsPath:['Redirect.js'],cssPath:['navigator.css']});
jsR.addWidget({name:"SwordForm",prefixPath:"swordweb/widgets/SwordForm",jsPath:['SwordForm.js','SwordFormExtra.js','FormLayer.js'],cssPath:['form.css']});
jsR.addWidget({name:"SwordSelect",prefixPath:"swordweb/widgets/SwordSelect",jsPath:['SwordSelect.js'],cssPath:['select.css']});
jsR.addWidget({name:"SwordGrid",prefixPath:"swordweb/widgets/SwordGrid",jsPath:['SwordTable.js','SwordTable.Tree.js','SwordTable.File2.js','SwordTable.EventDele.js'],cssPath:['SwordTable.css']});
jsR.addWidget({name:"SwordMove",prefixPath:"swordweb/widgets/SwordMove",jsPath:['SwordMoveBase.js','SwordMove.js'],cssPath:['SwordMove.css']});
//jsR.addWidget({name:"SwordMoveButton",prefixPath:"swordweb/widgets/SwordMove",jsPath:['SwordMoveBase.js','SwordMoveButton.js'],cssPath:['SwordMove.css']});
jsR.addWidget({name:"PageInit",prefixPath:"swordweb/core/initpage",jsPath:['PageInit.js']});
jsR.addWidget({name:"SwordToolTips",prefixPath:"swordweb/widgets/SwordToolTips",jsPath:['SwordToolTips.js'],cssPath:['tooltips.css']});
jsR.addWidget({name:"SwordValidator",prefixPath:"swordweb/widgets/SwordValidator",jsPath:['SwordValidator.js'],cssPath:['validator.css']});
jsR.addWidget({name:"SwordCalendar",prefixPath:"swordweb/widgets/SwordCalendar",jsPath:['SwordCalendar.js'],cssPath:['calendar.css']});
//jsR.addWidget({name:"SwordOdpsCalendar",prefixPath:"swordweb/widgets/SwordOdpsCalendar",jsPath:['calendar_sword.js','SwordOdpsCalendar.js'],cssPath:['jsaxis.css']});
jsR.addWidget({name:"SwordTab",prefixPath:"swordweb/widgets/SwordTab",jsPath:['SwordTab.js'],cssPath:['tab.css']});
jsR.addWidget({name:"SwordTree",prefixPath:"swordweb/widgets/SwordTree",jsPath:['SwordTree.js','SwordTree.Builder.js','SwordTree.DomFactory.js','SwordTree.Draw.js','SwordTree.Iterator.js','SwordTree.Drag.js','SwordTree.Select.js'],cssPath:['tree.css']});
jsR.addWidget({name:"SwordSubmit",prefixPath:"swordweb/widgets/SwordSubmit",jsPath:['SwordSubmit.js','SwordSubmit.Command.js'],cssPath:['submit.css']});
jsR.addWidget({name:"SwordValidateCode",prefixPath:"swordweb/widgets/SwordValidateCode",jsPath:['SwordValidateCode.js'],cssPath:['validatecode.css']});
jsR.addWidget({name:"SwordMask",prefixPath:"swordweb/widgets/SwordMask",jsPath:['SwordMask.js'],cssPath:['mask.css']});
jsR.addWidget({name:"SwordPopUpBox",prefixPath:"swordweb/widgets/SwordPopUpBox",jsPath:['SwordPopUpBox.js'],cssPath:['ymPrompt.css']});
jsR.addWidget({name:"SwordMenu",prefixPath:"swordweb/widgets/SwordMenu",jsPath:['SwordMenu.js'],cssPath:['menu.css']});
jsR.addWidget({name:"SwordFileUpload",prefixPath:"swordweb/widgets/SwordFile",jsPath:['SwordFileUpload.js']});
jsR.addWidget({name:"SwordFileUpload2",prefixPath:"swordweb/widgets/SwordFileUpload2",jsPath:['SwordFileUpload2.js'],cssPath:['file2.css']});
jsR.addWidget({name:"SwordFavorite",prefixPath:"swordweb/widgets/SwordFavorite",jsPath:['SwordFavorite.js'],cssPath:['favorite.css']});
jsR.addWidget({name:"SwordAccordion",prefixPath:"swordweb/widgets/SwordAccordion",jsPath:['SwordAccordion.js'],cssPath:['accordion.css']});
jsR.addWidget({name:"SwordFrameTab",prefixPath:"swordweb/widgets/SwordFrameTab",jsPath:['SwordFrameTab.js'],cssPath:['frametab.css']});
jsR.addWidget({name:"SwordFramePanel",prefixPath:"swordweb/widgets/SwordFramePanel",jsPath:['SwordFramePanel.js'],cssPath:['panel.css']});
jsR.addWidget({name:"SwordFrame",prefixPath:"swordweb/widgets/SwordFrame",jsPath:['FrameLayer.js','SwordFrame.js'],cssPath:['frame.css']});
jsR.addWidget({name:"SwordPrint",prefixPath:"swordweb/widgets/SwordPrint",jsPath:['SwordPrint.js']});
jsR.addWidget({name:"SwordToolBar",prefixPath:"swordweb/widgets/SwordToolBar",jsPath:['SwordToolBar.js'],cssPath:['default.css']});
//jsR.addWidget({name:"SwordChart",prefixPath:"swordweb/widgets/SwordChart",jsPath:['SwordChart.js','swfobject.js'],cssPath:['default.css']});
jsR.addWidget({name:"SwordSearch",prefixPath:"swordweb/widgets/SwordSearch",jsPath:['SwordSearch.js'],cssPath:['SwordSearch.css']});
jsR.addWidget({name:"Editor",prefixPath:"swordweb/core/edit",jsPath:['Editor.js'],cssPath:['edit.css']});
jsR.addWidget({name:"StudioComm",prefixPath:"swordweb/core/edit",jsPath:['StudioComm.js']});
//jsR.addWidget({name:"SwordHotKeys",prefixPath:"swordweb/widgets/SwordHotKeys",jsPath:['SwordHotKeys.js']});
/*去掉了,'swordcache-min.js'*/
jsR.addWidget({name:"SwordClientCache",prefixPath:"swordweb/widgets/SwordClientCache",jsPath:['swfobject.js','query.js','SwordCacheManager.js']});
jsR.addWidget({name:"SwordAnchorLayout",prefixPath:"swordweb/widgets/SwordLayout",jsPath:['SwordAnchorLayout.js']});
jsR.addWidget({name:"SwordDockLayout",prefixPath:"swordweb/widgets/SwordLayout",jsPath:['SwordDockLayout.js']});
jsR.addWidget({name:"SwordPageCache",prefixPath:"swordweb/widgets/SwordPageCache",jsPath:['SwordPageCache.js']});

jsR.initConfig = function(cfg) {
	jsR.config = cfg;
    jsR.CSSManager.init(jsR.config);
    jsR.initPlugins();
    jsR.initCompnents();
    if(cfg.SwordLocal != "zh-cn") {
        this.getWidget("i18n").jsPath = [cfg.SwordLocal + '.js'];
    }
//    jsR.shielding();
    jsR.process();
};
function JsReady() {
    this.isIE = $SwordLoader.isIE;
    this.rootPath = $SwordLoader.rootPath;
    if(this.rootPath==null)return;
    //todo
    this.bizjs = document.getElementsByTagName("script")[0].getAttribute('bizjs');
    if(this.bizjs) {
        this.bizjs = eval(this.bizjs);
    }
    this.compJs = null;
    this.compCss = null;
    this.initCompnents = function() {
        //构件的js和css
        var scripts = document.getElementsByTagName('compnent');
        this.isContains = function(item, arr) {
            var len = arr.length;
            for(var i = 0; i < len; i++) {
                if(arr[i] === item) return true;
            }
            return false;
        };
        var j,c;
        for(var i = 0; i < scripts.length; i++) {
            j = eval(scripts[i].getAttribute("bizJs"));
            c = eval(scripts[i].getAttribute("bizCss"));
            if(this.compJs == null) {
                this.compJs = j;
            } else {
                for(var n = 0; n < j.length; n++) {
                    if(!this.isContains(j[n], this.compJs))this.compJs.push(j[n]);
                }
            }
            if(this.compCss == null) {
                this.compCss = c;
            } else {
                for(var m = 0; m < c.length; m++) {
                    if(!this.isContains(c[m], this.compCss))this.compCss.push(c[m]);
                }
            }
        }
    };

    this.initPlugins = function() {
        var pluginCfg = this.config.plugin;
        if(!pluginCfg.load_plugin)
            return;
        var plugins = pluginCfg.plugins;
        for(var pluginName in plugins) {
            var widget = this.getWidget(pluginName);
            widget.pluginPath = plugins[pluginName];
        }

        var css = pluginCfg.css;
        for(var pluginName in css) {
            var widget = this.getWidget(pluginName);
            widget.pluginCss = css[pluginName];
        }
    };
    this.initCfg = new MiniMap();
    this.components = new MiniMap();
    this.imported = new MiniMap();
    this.importedWidget = new MiniMap();
    this.CSSManager = new CSSManager();
    this.writeJS = $SwordLoader.writeLocalJs;
    this.writeCSS =  $SwordLoader.writeCSS;
    this.server = function() {
      return $SwordLoader.server;
    };
    this.doIm = function (name, loadSwordCss,cssName) {
        /*if(name == 'SwordLogger') {
            if(!this.config.logger.load_logger) {
                return;
            }
        }*/
        var widget = this.components.get(name);
        if(widget == null) {
//            logger.error('您要引入的组件【' + name + '】，本系统中无法识别，请检查系统配置！！', 'JsReady', 'doIm');
            throw new Error('您要引入的组件【' + name + '】，本系统中无法识别，请检查系统配置！！');
        }
        if(this.isImportWidget(widget.name)) {
//            logger.info("组件【" + widget.name + "】已经加载，不执行加载动作.", 'JsReady', 'doIm');
            return;
        }
        if(loadSwordCss != 'false') {
            if(cssName)widget.cssPath=[(cssName+".css")];
            this.loadInstance.loadCSS(widget);
        }
        this.loadInstance.loadJS(widget);
        this.loadInstance.loadPlugins(widget);
    };
    this.process = function() {
    	//!this.server()展示修改成true ,非按需加载，方便模板渲染。
    	if(true) {
            this.baseWidgets = this.components.keyArray;
        }
        this.loadInstance = this.loadFileInstance(this.server(), this.rootPath, this.CSSManager);
//        if(this.runmode == "product") {
//            this.getWidget("SwordCss").cssPath = ["sword_min.css"];
//            this.doIm("SwordCss");
//            return;
//        }
//        logger.info("开始加载sword基础服务。。。。。。。。", 'JsReady', "process");
        for(var i = 0; i < this.baseWidgets.length; i++) {
//            logger.info("加载" + this.baseWidgets[i] + "包。", 'JsReady', "process");
            this.doIm(this.baseWidgets[i]);
        }
//        logger.info("加载sword基础服务【" + jsR.baseWidgets + "】成功!", 'JsReady', "process");
//        logger.info("开始加载bizjs。。。", 'JsReady', "process");
        if(this.bizjs) {
            for(var i = 0; i < this.bizjs.length; i++) {
//                logger.info("加载bizjs【" + this.bizjs[i] + "】!", 'JsReady', "process");
                $SwordLoader.importJs(jsR.rootPath + this.bizjs[i]);
            }
//            logger.info("加载bizjs成功!", 'JsReady', "process");
        } else {
//            logger.info("页面上没有定义bizjs，不执行加载!", 'JsReady', "process");
        }
        //开始加载构件js和css
        if(this.compJs) {
            for(var k = 0; k < this.compJs.length; k++) {
                $SwordLoader.importJs(this.compJs[k]);
            }
        }
        if(this.compCss) {
            for(var f = 0; f < this.compCss.length; f++) {
                this.writeCSS(this.compCss[f]);
            }
        }
        //加载构件js和css结束
       /* if(jsR.config.logger.load_logger) {
            loggerTimer = window.setInterval(initLogger, 20);
        }*/
    };
    this.addWidget = function(widget) {
    	this.components.put(widget.name, widget);
    };
    this.getWidget = function(name) {
        return this.components.get(name);
    };
    this.addImported = function(fileName, widgetName) {
        this.imported.put(this.getFilename(fileName), widgetName);
        this.importedWidget.put(widgetName, widgetName);
    };
    this.isImported = function(fileName) {
        return this.imported.get(this.getFilename(fileName)) != null;
    };
    this.isImportWidget = function(widgetName) {
        return this.importedWidget.get(widgetName) != null;
    };
    this.getFilename = function (name) {
        return name.replace(/[\.|\//|\:|\-|\s|%]/g, "");
    };
    this.loadFileInstance = function(isServer) {
        var instance;
        if(isServer) {
            instance = new ServerLoad(this);
        } else {
            instance = new LocalLoad(this);
        }
        return instance;
    };
   /* this.shielding = function() {
        if(this.isIE) {
            document.onkeydown = function() {
                return SwordShielding(event, event.srcElement);
            }
        } else {
            document.onkeypress = function(e) {
                return SwordShielding(e, e.target);
            }
        }
    }*/
}

function ServerLoad(sword) {
    this.sword = sword;
    this.dealJs = function(widget, path) {
        if(this.sword.isImported(path)) {
//            logger.info("文件【" + path + "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'ServerLoad', 'dealJs');
        } else {
            var xReq = null;
            if(window.XMLHttpRequest) {
                xReq = new XMLHttpRequest();
            } else if(window.ActiveXObject) {
                xReq = new ActiveXObject("MsXml2.XmlHttp");
            }
            xReq.open('get', path, false);
            xReq.setRequestHeader("Content-Type", "text/plain;charset=gb2312");
            xReq.send(null);
            if(xReq.readyState == 4) {
                if(xReq.status == 200) {
                    if(this.sword.isIE) {
                        if(xReq.responseText != "")execScript(xReq.responseText);
                    } else {
                        window.eval(xReq.responseText);
                    }
                    this.sword.addImported(path, widget.name);
                }
            }
        }
    };
    this.loadPlugins = function(widget) {
        var widgetJs = widget.pluginPath || [];
        for(var i = 0; i < widgetJs.length; i++) {
            var path = jsR.rootPath + widgetJs[i];
            this.dealJs(widget, path);
            this.sword.addImported(path, widget.name);
        }

        var css = widget.pluginCss || [];
        for(var i = 0; i < css.length; i++) {
            var path = jsR.rootPath + css[i];
            if (this.sword.isImported(path)) {
//                logger.info("文件【" + path+ "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'ServerLoad', 'loadCSS');
            } else {
                this.sword.writeCSS(path);
                this.sword.addImported(path, widget.name);
            }
        }
    };
    this.loadJS = function(widget) {
        var widgetJs = widget.jsPath || [];
        for(var i = 0; i < widgetJs.length; i++) {
            var path = this.sword.rootPath + widget.prefixPath + "/" + widgetJs[i];
            this.dealJs(widget, path);
        }
    };
    this.loadCSS = function(widget) {
        var widgetCss = this.sword.CSSManager.getPaths(this.sword.rootPath, widget);
        for(var i = 0; i < widgetCss.length; i++) {
            if(this.sword.isImported(widgetCss[i])) {
//                logger.info("文件【" + widgetCss[i] + "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'ServerLoad', 'loadCSS');
            } else {
                this.sword.writeCSS(widgetCss[i]);
                this.sword.addImported(widgetCss[i], widget.name);
            }
        }
    };
}
function LocalLoad(sword) {
    this.sword = sword;
    this.loadPlugins = function(widget) {
        var widgetJs = widget.pluginPath || [];
        for(var i = 0; i < widgetJs.length; i++) {
            var path = jsR.rootPath +  widgetJs[i];
            this.sword.writeJS("src", path);
            this.sword.addImported(path, widget.name);
        }

        var css = widget.pluginCss || [];
        for (var i = 0; i < css.length; i++) {
            var path = jsR.rootPath + css[i];
            if (this.sword.isImported(path)) {
//                logger.info("文件【" + path+ "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'ServerLoad', 'loadCSS');
            } else {
                this.sword.writeCSS(path);
                this.sword.addImported(path, widget.name);
            }
        }
    };
    this.loadJS = function(widget) {
        var widgetJs = widget.jsPath || [];
        for(var i = 0; i < widgetJs.length; i++) {
            var path = this.sword.rootPath + widget.prefixPath + "/" + widgetJs[i];
            if(this.sword.isImported(path)) {
//                logger.info("文件【" + path + "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'LocalLoad', 'loadJS');
            } else {
                this.sword.writeJS("src", path);
                this.sword.addImported(path, widget.name);
            }
        }
    };
    this.loadCSS = function(widget) {
        var widgetCss = this.sword.CSSManager.getPaths(this.sword.rootPath, widget);
        for(var i = 0; i < widgetCss.length; i++) {
            if(this.sword.isImported(widgetCss[i])) {
//                logger.info("文件【" + widgetCss[i] + "】已经被组件【" + widget.name + "】加载了，不执行加载动作.", 'LocalLoad', 'loadCSS')
            } else {
                this.sword.writeCSS(widgetCss[i]);
                this.sword.addImported(widgetCss[i], widget.name);
            }
        }
    };
}
function CSSManager() {
    this.styleRootPath = "swordweb/styles";
    this.cssPath = "";
    this.widgetStyle = {
        SwordDefault:{}
        ,blue:{

        }
    };
    this.init = function(jsConfig) {
        if(jsConfig.style.styleRootPath) {
            this.styleRootPath = jsConfig.cssManager.styleRootPath;
        }
        var path = "";
        if(!jsConfig.style.sysStyleDefaultPath) {
            path = jsConfig.style.sys_style;
        } else {
            path = jsConfig.style.sysStyleDefaultPath;
        }
        this.cssPath = this.styleRootPath + "/" + path;
        this.jsConfig = jsConfig;
    };
    this.getPaths = function (rootPath, widgetObj) {
        var widget = this.getState(widgetObj);
        var paths = [];
        for(var i = 0; i < (widget.cssPath || []).length; i++) {
            if(widget.state == 0) {
                paths.push(rootPath + this.cssPath + "/" + widget.name + "/" + widget.cssPath[i]);
            } else if(widget.state == 1) {
                if(widget.prefixPath) {
                    paths.push(rootPath + this.cssPath + "/" + widget.prefixPath + "/" + widget.cssPath[i]);
                } else {
                    paths.push(rootPath + this.cssPath + "/" + widget.name + "/" + widget.cssPath[i]);
                }
            } else if(widget.state == 2) {
                if(widget.prefixPath) {
                    paths.push(rootPath + widget.prefixPath + "/" + widget.cssPath[i]);
                } else {
                    paths.push(rootPath + this.cssPath + "/" + widget.name + "/" + widget.cssPath[i]);
                }
            }
        }
        return paths;
    };
    this.getState = function (widget) {
        var obj;
        var widgetName = widget.name;
        if(this.jsConfig.style.widget_style && this.jsConfig.style.widget_style[widgetName]) {
            obj = this.jsConfig.style.widget_style[widgetName];
            obj["state"] = 2;
        } else if(this.widgetStyle[this.jsConfig.style.sys_style] && this.widgetStyle[this.jsConfig.style.sys_style][widgetName]) {
            obj = this.widgetStyle[this.jsConfig.style.sys_style][widgetName];
            obj["state"] = 1;
        } else {
            obj = widget;
            obj["state"] = 0;
        }
        return obj;
    }
}
function MiniMap() {
    this.valueArray = [];
    this.keyArray = [];
    this.put = MiniMapMap$put;
    this.get = MiniMap$get;
    this.remove = MiniMap$remove;
    this.length = 0;
    this.size = MiniMap$size;
    this.getAllKey = MiniMap$getAllKey;
    this.getAllKeyArray = MiniMap$getAllKeyArray;
}
function MiniMap$size() {
    return this.length;
}
function MiniMap$remove(key) {
    var str = "this." + key + ";";
    var idx = window.eval(str);
    this.valueArray[idx] = null;
    this.keyArray[idx] = null;
    var str$ = "this." + key + "=undefined;";
    window.eval(str$);
    this.length--;
}
function MiniMapMap$put(key, value) {
    var len = this.valueArray.length;
    this.valueArray[len] = value;
    this.keyArray[len] = key;
    this[key] = len;
    this.length++;
}
function MiniMap$get(key) {
    var idx = this[key];
    return this.valueArray[idx];
}
function MiniMap$getAllKey() {
    var i = 0,re = "";
    var a = this.keyArray;
    var L = a.length;
    for(i = 0; i < L; i++) {
        if(a[i] != null) {
            re = re + a[i] + ";";
        }
    }
    return re;
}
function MiniMap$getAllKeyArray() {
    return  this.getAllKey().split(";");
}

