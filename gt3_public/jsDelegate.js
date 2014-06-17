/*
 * tid: 必填, 需要单独提交的数据 data:必填，本次提交的数据
 * 
 * onSuccess ：选填， 后台成功，没有异常的回调 
 * onError ： 选填，后台发生了异常 async：选填，true false 默认为true
 * 异步 loaddata:选填，是否为组件装载数据，
 * widget container 默认为container
 * onFinish:选填，不管出错还是成功执行，都会执行此方法。
 * errMes : 选填，当后台出现异常的时候，是否alert错误信息， 默认为 true，关闭为 false 
 * redirect：选填，是否根据返回数据的page属性自动跳转页面 
 * postType(type) :选填，ajax form (form_target,支持target) download 提交类型 ， 默认为ajax提交 ,当download的时候其余的参数将失效
 * isAutoFill 是否需要自动回填数据  'false'为不需要 默认为需要
 * 
 * 
 */
function jsDelegate(req) {

    var d = JSON.encode(req.data);
    if (d == '"{}"')
        d = '';
    var r = pc.getReq({
    	'tid' : $defined(req.tid) ? req.tid:'',
    	'ctrl': $defined(req.ctrl) ? req.ctrl:'',
        'widgets':[
            {
                'sword':'attr',
                'name':'jsdelegate',
                'value':d
            }
        ]
    });
    if (req.widgetDatas) {
        for (var i = 0; i < req.widgetDatas.length; i++) {
            var n = req.widgetDatas[i].name;
            if (n && $defined($w(n).validate)) {
                if (!$w(n).validate()) {
                    return;
                }
            }
        }
        r.data.extend(req.widgetDatas);
    }
    if (req.isAutoFill == 'false') {
        req, loaddata = 'widget';
        r.data.push({
            'sword':'attr',
            'name':'s5_widgetloaddata',
            'value':'true'
        });
        var ons = req['onSuccess'];
        if (ons) {
            req.onSuccess = function (res) {
                var dddd = JSON.decode(res.getAttr('s5_datamap'));
                ons(dddd);
            };
        }
    }
    req.req = r;
    pc.postReq(req);
}
/** *********存一些特殊的值,每次提交都带上********** */
/* 从功能url的 qurey字符串中可以取得功能代码（gndm），职能代码（zndm），岗位序号（gwxh），角色代码（gnjdm） */
function AddBizCode2URL(url, pc) {
    if (!$chk(url) || !$defined(url))
        return "";
    url = pageContainer.AddBaseCode2URL(url);
    var bizcode = _getBizCode_(pc);
    for (var bz in bizcode) {
        var v = bizcode[bz];
        if ($chk(v))
            url = (url + ((url.indexOf("?") == -1) ? "?" : "&") + bz + "=" + v);
    }
    return url;
}
function _getBizCode_(p) {
    var gwxh = _GetParameter_("gwxh",p);
    var gndm = _GetParameter_("gndm",p);
    var zndm = _GetParameter_("zndm",p);
    var gnjdm = _GetParameter_("gnjdm",p);
    var jsdm = _GetParameter_("jsdm",p);
    var gwssswjg = _GetParameter_("gwssswjg",p);
    return {
        gwxh:gwxh,
        gndm:gndm,
        zndm:zndm,
        gnjdm:gnjdm,
        jsdm:jsdm,
        gwssswjg:gwssswjg
    };
}
function _GetParameter_from_Res(param, p) {
    return ($defined(p) ? p : pc).getInitData().getAttr(param) || "";
}
function _GetParameter_(param, p) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1) {
        return _GetParameter_from_Res(param, p);
    }
    // 取得开始搜索的位置。
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    // 如果只有一个参数传进来
    if (iEnd == -1) {
        return query.substring(iStart);
    }
    else {
        return query.substring(iStart, iEnd);
    }
}
var _PR_, _FUC_, _POPALI_, _WF_, _STS_;
function _OverWritePostReq() {
    _PR_ = PageContainer.prototype.postReq;
    PageContainer.implement({
        postReq:function (param) {
            var _ = {
                ctrl:AddBizCode2URL(param.req.ctrl),
                tid:AddBizCode2URL(param.req.tid),
                bindParam:true
            };
            $extend(param.req, _);
            _PR_.bind(this)(param);
        },
        getUploadCommit:function () {
            if (!$defined(this.uploadCommit)) {
                this.uploadCommit = this.widgetFactory
                    .create("SwordFileUpload");
                _OverWriteUploadCommit();
            }
            return this.uploadCommit;
        }
    });
    _POPALI_ = SwordPopUpBox.prototype.alertIframe;
    SwordPopUpBox.implement({
        alertIframe:function (options, maskObj, pc) {
            var _ = {
                message:AddBizCode2URL(options.message, pc)
            };
            _POPALI_.bind(this)($extend(options, _), maskObj);
        }
    });
    _WF_ = WidgetFactory.prototype.create;
    WidgetFactory
        .implement({
        create:function (param) {
            var widget = _WF_.bind(this)(param);
            if ($type(param) != "string"
                && param.get('sword') == "SwordTab"
                && !$defined(_STS_)) {
                _STS_ = SwordTab.prototype.selectIndex;
                SwordTab
                    .implement({
                    selectIndex:function (index) {
                        if (this.options.tabType != "div") {
                            this.options.tabIframes
                                .each(function (item, idx) {
                                this.options.tabIframes[idx] = AddBizCode2URL(item);
                            }.bind(this));
                        }
                        _STS_.bind(this)(index);
                    }
                });
            }
            return widget;
        }
    });
    pageContainer.widgetFactory = new WidgetFactory();
}
function _OverWriteUploadCommit() {
    _FUC_ = SwordFileUpload.prototype.commit;
    SwordFileUpload
        .implement({
        commit:function (isJump, postType) {
            this.options.postData.ctrl = AddBizCode2URL(this.options.postData.ctrl);
            _FUC_.bind(this)(isJump, postType);
        }
    });
}

/** ********************************* */
/**
 * 将数据set到缓存里
 *
 * @param name
 * @param value
 */
function setCacheData(name, value) {
    if ($cache) {
        $cache.initCacheContainer(name);
        var to = $cache.cacheHash.get(name);
        to.set(name, value);
    }
}
/**
 * 取缓存数据
 *
 * @param name
 * @param widgetname
 * @param type
 * @returns {String}
 */
function getCacheData(name, widgetname, type) {
    if (!type)
        type = 'select';
    if (!$cache.cacheHash.get(name))
        $cache.initCacheContainer(name);
    var cd = $H({
        "data":[]
    });
    $cache.cacheHash.get(name).get(name, function (ok, val) {
        if (ok) {
            var res = JSON.decode(val);
            if (type == 'select') {
                cd.data[0] = {
                    "data":res,
                    "dataName":widgetname,
                    "sword":"SwordSelect"
                };
                pc.reloadSel(widgetname, cd);
            } else if (type == 'tree') {
                cd.data[0] = {
                    "data":res,
                    "name":widgetname,
                    "sword":"SwordTree"
                };
            } else if (type == 'form') {
                cd.data[0] = {
                    "data":res,
                    "name":widgetname,
                    "sword":"SwordForm"
                };
            }
        }
    });
    return cd.data[0];
}
