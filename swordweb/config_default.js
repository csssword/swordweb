var $SwordWebRunmode = (function(){
     return {
        runmode:typeof(jsR)=="object"?'dev':'pro'
        ,isDev:function(){return this.runmode=='dev'}
         ,isPro:function(){return this.runmode=='pro'}
     };
})();


var swordCfg={
    logger:{
        load_logger : false
        ,logger_level : {}
    },
    plugin:{
        load_plugin : true
//        ,plugins:{"SwordForm":["fileUpload4Odps.js"],"SwordToolBar":["adapter.js"]}

        ,plugins:{"SwordToolBar":["swordweb/biz/plugins/SwordToolBar/adapter.js"]}
    },
    style:{
//        sys_style:'SwordTwms'
        sys_style:'SwordDefault7'
        ,widget_style:{}
    },
    frametab:{
        maxTabNum:10
    },
    swordForm:{
        align: "left"
    },
    swordGrid:{
        dragWidth: true,
        headerHeight:25,
        toolConsole:false
    },
    swordCalendar:{
    	handInput: true,
    	beginYear: new Date().getFullYear()-10,//日历的范围从**年开始
    	endYear: new Date().getFullYear()+10//到**年结束
    },
    swordPopUpBox:{
        flag:true
        ,number:0
        ,topMask:true //是否使用top上面的popupbox对象来执行弹出操作
    }
    ,SwordLocal:(typeof(SwordLocalization)=="string")?SwordLocalization:undefined||"zh-cn"
    ,shields:{
       'backspace':true
      ,'f5':false
      ,'contextMenu':false
    }
    ,SwordClientCache:false

//    ,onBefore:["pullTreeBefore()","selectBefore()"]
//
//    ,onAfter:["pageAfter()"]
};

if($SwordWebRunmode.isDev())jsR.initConfig(swordCfg);
