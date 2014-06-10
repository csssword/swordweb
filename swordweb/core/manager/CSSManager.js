
/**
 定义多套css风格
 **/
 
function CSSManager() {
    this.styleRootPath = "swordweb/styles";
    this.cssPath = "";
    /*
     定义样式风格
     */
    this.widgetStyle = {
        SwordDefault:{

        }
        ,blue:{
//            SwordTree:{name:"SwordTree",prefixPath:"SwordTree2",cssPath:["tree2.css"]}
        }
    }

    this.init = function(jsConfig) {

        if (jsConfig.cssManager.styleRootPath) {
            this.styleRootPath = jsConfig.cssManager.styleRootPath;
        }
        var path = "";
        if (!jsConfig.cssManager.sysStyleDefaultPath) {
            path = jsConfig.cssManager.sysStyle;
        } else {
            path = jsConfig.cssManager.sysStyleDefaultPath;
        }
        this.cssPath = this.styleRootPath + "/" + path;
        this.jsConfig = jsConfig;
    }

    this.getPaths = function (rootPath, widgetObj) {
        var widget = this.getState(widgetObj);
        var paths = [];
        for (var i = 0; i < (widget.cssPath || []).length; i++) {
            if (widget.state == 0) {
                paths.push(rootPath + this.cssPath + "/" + widget.name + "/" + widget.cssPath[i]);
            } else if (widget.state == 1) {

                if (widget.prefixPath) {
                    paths.push(rootPath + this.cssPath + "/" + widget.prefixPath + "/" + widget.cssPath[i]);
                } else {
                    paths.push(rootPath + this.cssPath + "/" + widget.name + "/" + widget.cssPath[i]);
                }
            } else if (widget.state == 2) {
                if (widget.prefixPath) {
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
        if (this.jsConfig.cssManager.widgetStyle && this.jsConfig.cssManager.widgetStyle[widgetName]) {
            obj = this.jsConfig.cssManager.widgetStyle[widgetName];
            obj["state"] = 2;
        } else if (this.widgetStyle[this.jsConfig.cssManager.sysStyle] && this.widgetStyle[this.jsConfig.cssManager.sysStyle][widgetName]) {
            obj = this.widgetStyle[this.jsConfig.cssManager.sysStyle][widgetName];
            obj["state"] = 1;
        } else {
            obj = widget;
            obj["state"] = 0;
        }
        return obj;
    }
}