var PageInit = new Class({
    Implements:[Events,Options]
    ,name:"PageInit"
    ,options:{
        pNode:null
        ,onBefore:$empty//在页面dom加载完毕，sword基础包加载完(PageContainer已经加载实例化完成)，容器初始化页面组件之前触发
        ,onDataInit:$empty//容器初始化初始化页面组件之后，容器为页面组件初始化数据之前触发
        ,onAfter:$empty//容器初始化页面组件的数据之后触发，容器初始化完成的最后一步。注意，这时候，如果数据时通过pageInit的异步提交 初始化的，有可能数据没有装载完，如果需要初始化数据，请使用onFinish事件。
        ,onSuccess:$empty//当容器成功初始化数据【后台没有抛出异常】的时候触发，传入了 本次初始化的数据对象
        ,onError:$empty//当容器初始化数据失败【后台抛出了异常】的时候触发，传入了 本次返回的数据对象
        ,onFinish:$empty//当容器初始化数据无论是成功还是失败都触发，传入了 本次初始化的数据对象
        ,onAfterLoadData:$empty
    }
    ,initialize: function() {
    }
    ,initParam:function(PINode) {
        PINode.pNode = PINode;        
        this.htmlOptions(PINode);
    }
    ,initStaticData:function(){
        if (!$defined(this.options.pNode)||!$chk(this.options.pNode.get('data')))return;
        pc.initData = JSON.decode(this.options.pNode.get('data'));
    }
    ,getInitData:function(param) {
        if(!$defined(this.options.pNode))return;
        if ($chk(this.options.pNode.get('data'))) {
             param.dataObj = pc.initData;
             pc.loadData(param);
        } else if ($chk(this.options.pNode.get('tid')) || $chk(this.options.pNode.get('ctrl'))) {
            var req = {
                'ctrl':this.options.pNode.get('ctrl') || ''
                ,'tid':this.options.pNode.get('tid') || ''
                ,'data':[]
            };
            var myRequest = new Request({
                method: 'post',
                async : true,
                url: 'ajax.sword?a=' + Math.random()
            });
            myRequest.onSuccess = function(responseText) {
               pc.initData = param.dataObj =  JSON.decode(responseText);
               pc.loadData(param);
            };
            var s = JSON.encode(req);
            myRequest.send('postData=' + s);
        }
    }
});


