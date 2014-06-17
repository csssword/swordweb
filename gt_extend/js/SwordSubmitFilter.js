/**
 * 基于Sword平台web的提交拦截器
 * 拦截方法接受的参数为一个json对象,注意：对这个参数进行操作之后必须返回！
 * 如果不正常返回，那么拦截不成功!
 * 参数的格式为
 * {
 *  ctrl:'',
 *  tid:''
 *  data:[],
 *  page:''
 *  }
 *  拦截函数之前，还有一个条件函数，必须满足条件函数返回true,才执行拦截方法
 */
var _SFL_ = [];
var _SCL__ = [];
var _LDFL_ = [];
var _LDCL__ = [];
function _$regLDFL$_(filter, condition) {
    _LDFL_.include(filter);
    _LDCL__.include(condition);
}
function _$regSFL$_(filter, condition) {
    _SFL_.include(filter);
    _SCL__.include(condition);
}
function _$execSFL$(param) {
    var re;
    _SFL_.each(function(func, idx) {
        if(_SCL__[idx](param)) {
            re = func(param);
            if($defined(re))param = re;
        }
    });
    return param;
}
function _$execLDFL$(param) {
    _LDFL_.each(function(func, idx) {
        if(_LDCL__[idx](param)) {
            func(param);
        }
    })
}
var _PR_,_LOADDATA_,_FUC_,_POPALI_,_WF_,_STS_;
function _SwordSubmitFilter() {
    _PR_ = PageContainer.prototype.postReq;
    _LOADDATA_ = PageContainer.prototype.loadData;
    PageContainer.implement({
        postReq:function(param) {
            param.req = _$execSFL$(param.req);
            _PR_.bind(this)(param);
        },
        getUploadCommit:function() {
            if(!$defined(this.uploadCommit)) {
                this.uploadCommit = this.widgetFactory.create("SwordFileUpload");
                _OverWriteUploadCommit();
            }
            return this.uploadCommit;
        },
        loadData:function(param) {
            _$execLDFL$(param);
            _LOADDATA_.bind(this)(param);
        }
    });
    _POPALI_ = SwordPopUpBox.prototype.alertIframe;
    SwordPopUpBox.implement({
        alertIframe:function(options, maskObj) {
            _POPALI_.bind(this)(options, maskObj);
        }
    });
    _WF_ = WidgetFactory.prototype.create;
    WidgetFactory.implement({
        create:function(param) {
            var widget = _WF_.bind(this)(param);
            if($type(param) != "string" && param.get('sword') == "SwordTab") {
                _STS_ = SwordTab.prototype.selectIndex;
                SwordTab.implement({
                    selectIndex:function(index) {
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
    SwordFileUpload.implement({
        commit:function(isJump, postType) {
            this.options.postData = _$execSFL$(this.options.postData);
            _FUC_.bind(this)(isJump, postType);
        }
    });
}