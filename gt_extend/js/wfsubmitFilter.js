/**
 * 工作流暂存数据,模板定义，页面中定义一个id为TempStorage的div,需要保存的组件和属性的定义在此div之下
 * widgetPath:描述组件所在的位置，路径有父子关系中间用.分割，
 * 父用parent表示，
 * 如果是iframe，用iframe的id表示
 * 如果是SwordTab,并且是iframe的形式，用索引表示,例如SwordTabName(组件的名字).index(索引,从0开始计数)
 * onGetdata 是预留的一个事件接口，方便在搜集数据的过程中，开发人员可以方便参与.
 **/
/**
 *如果iframe没有加载，放弃搜集
 */
_$regSFL$_(function(param) {
    var d = $("TempStorage");
    var chs = d.getChildren();
    var tar,widget;
    chs.each(function(el) {
        tar = _$getWidgetByPath$_(el.get("widgetPath"));
        if(tar != window) {
            if(tar.getSubmitData) {
                param.data.push(tar.getSubmitData());
            } else if(tar.getAllGridData) {
                param.data.push(tar.getAllGridData());
            } else {
                //todo 其他组件暂时不处理
            }
        }
    });
    return param;
}, function(param) {
    if(!$defined($("TempStorage")))return false;
    var d = param.data;
    for(var i = 0; i < d.length; i++) {
        if(d[i]['name'] == 'saveWorkFlowXML' && d[i]['value'] == "true") {
            d.erase(d[i]);
            return true;
        }
    }
    return false;
});
/**
 * 以下两种情况可以做补偿，但是只支持往下一级。如果是iframe多级嵌套，暂时不支持.
 * 如果SwordTab里的iframe还未加载，但是SwordTab对象已经加载，可以做补偿
 * 如果是当前页面的iframe里的数据未加载，可以做补偿
 */
_$regLDFL$_(function(param) {
    var d = $("TempStorage");
    var chs = d.getChildren();
    var tar,p,i,widget,paths;
    chs.each(function(el) {
        paths = el.get("widgetPath").split(".");
        tar = window;
        for(i = 0; i < paths.length; i++) {
            p = paths[i];
            if(p == "parent") {
                tar = parent;
            } else {
                if($type(tar) == "SwordTab") {
                    tar = tar.tabIframes[p];
                    if(!$chk(tar.get('src'))) {
                        pc.setTempData(tar.get('id'), pc.getResData(paths[i + 1], param['dataObj']));
                        break;
                    }
                    tar = tar.contentWindow;
                } else {
                    widget = tar.$w(p);
                    if(!$defined(widget)) {
                        tar = tar.$(p);
                        if(!$defined(tar)) {
                            break;
                        } else if(!$chk(tar.get('src'))) {
                            pc.setTempData(tar.get('id') || tar.get('name'), pc.getResData(paths[i + 1], param['dataObj']));
                            break;
                        }
                    }
                    if(widget != $w(p) && ['SwordForm','SwordTable'].contains($type(widget))) {
                        widget.initData(pc.getResData(widget.options.name, param['dataObj']));
                    } else {
                        tar = widget;
                    }
                }
            }
        }
    });
}, function(param) {
    return $defined($("TempStorage"));
});
function _$getWidgetByPath$_(path) {
    var paths = path.split(".");
    var tar = window;
    var p,i,widget;
    for(i = 0; i < paths.length; i++) {
        p = paths[i];
        if(p == "parent") {
            tar = parent;
        } else {
            if($type(tar) == "SwordTab") {
                tar = tar.tabIframes[p];
                if(!$chk(tar.get('src'))) {
                    tar = window;
                    break;
                }
                tar = tar.contentWindow;
            } else {
                widget = tar.$w(p);
                if(!$defined(widget)) {
                    tar = tar.$(p);
                    if(!$defined(tar) || !$chk(tar.get('src'))) {
                        tar = window;
                        break;
                    }
                    tar = tar.contentWindow;
                } else {
                    tar = widget;
                }
            }
        }
    }
    return tar;
}

/**
 * 页面定义示例
 <div id="TempStorage" onGetdata="">
 <!--当前页面name为student的组件-->
 <div widgetPath="student"></div>
 <!--当前页面id为test的iframe里的name为crfnsrGridID的组件-->
 <div widgetPath="test.crfnsrGridID"></div>
 <!--父页面name为SwordTabIframe的SwordTab组件的第一个页卡中name为crfnsrGridID的组件-->
 <div widgetPath="SwordTabIframe.0.crfnsrGridID"></div>
 </div>
 *
 * 另外，提交组件也需要做一下关联
 *
 <!--在提交组件里增加一个定义，表示当前提交需要保存工作流数据的xml-->
 <div attrName="saveWorkFlowXML" value="true"></div>
 <!--也可以用代码的方式取代上面的定义： SwordSubmitName为提交组件的名字，pushData的参数是固定的-->
 $w('SwordSubmitName').pushData("saveWorkFlowXML","true");
 **/