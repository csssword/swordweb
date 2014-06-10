﻿try{
	document.write('<script type="text/javascript" src="../../swordweb/domain.js"></script>'); 
	document.close();
}catch(e){}
var $SwordWebRunmode = (function(){
     return {
        runmode:typeof(jsR)=="object"?'dev':'pro'
        ,isDev:function(){return this.runmode=='dev'}
         ,isPro:function(){return this.runmode=='pro'}
     };
})();
//此行为金税三期所用的插件
if ($SwordWebRunmode.isDev()) {//暂时修改为true.方便框架测试
    jsR.addWidget({name:"SwordFrameTabLayout1",prefixPath:"gt_extend/js/",jsPath:['SwordFrameTabLayout1.js']});
    jsR.addWidget({name:"SwordPopUpWindow",prefixPath:"gt_extend/js/",jsPath:['SwordPopUpWindow.js']});
    jsR.addWidget({name:"SwordWorkflow",prefixPath:"workflow/component/",jsPath:['SwordWorkflow.js']});
};

var swordCfg={
   /* logger:{
        load_logger : false
        ,logger_level : {}
    },*/
    plugin:{
        load_plugin : true
//        ,plugins:{"SwordForm":["fileUpload4Odps.js"],"SwordToolBar":["adapter.js"]}
//        ,plugins:{"SwordToolBar":["swordweb/biz/plugins/SwordToolBar/adapter.js"]}     // 此行为原有的。。

        ,plugins:{//此行为金税三期所用的插件
              "SwordGrid":["gt_extend/js/SwordGrid_extend.js"]
             , "SwordForm":["gt_extend/js/SwordForm_extend.js"]
             , "SwordTree":["gt_extend/js/SwordTree_extend.js"]
    		 , "SwordSelect":["gt_extend/js/SwordSelect_extend.js"]
             , "SwordToolBar":["swordweb/biz/plugins/SwordToolBar/adapter.js","gt_extend/js/SwordToolbar_extend.js"]
             , "Base":["gt_extend/js/onafter.js","gt3_public/jsDelegate.js","swordweb/kz.js"]
             , "SwordClientCache":["gt_extend/js/cacheTree.js","gt_extend/js/cacheSelect.js"]
             , "SwordValidator":["swordweb/biz/plugins/SwordValidator/SwordValidator.js"]
        }
        ,css:{//影响样式，先去掉
            //"SwordPopUpWindow":["swordweb/styles/gt3/SwordPopUpBox/ymPrompt.css"],
            //"SwordFrameTabLayout1":["gt_extend/css/SwordFrameTabLayout1/frametabLayout1.css"]
        }
    },
    style:{
//        sys_style:'SwordTwms'
//        sys_style:'SwordDefault6'
        sys_style:'gt3new'
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
        headerHeight:25
    },
    swordCalendar:{
    	handInput: 'true',  //浙江项目默认为true,金三修改成false
    	beginYear: new Date().getFullYear()-10,//日历的范围从**年开始
    	endYear: new Date().getFullYear()+10//到**年结束
    },
    swordPopUpBox:{
        flag:true
        ,number:0
        ,topMask:false //是否使用top上面的popupbox对象来执行弹出操作
    }
    ,SwordLocal:(typeof(SwordLocalization)=="string")?SwordLocalization:undefined||"zh-cn"
    ,shields:{
       'backspace':true
      ,'f5':false
      ,'contextMenu':false
    }
    ,SwordClientCache:true
    
    ,SwordClientTiming:false

    ,onBefore:["pullTreeBefore()","selectBefore()","_OverWritePostReq()","addKzSubmitDiv()"]

    ,onAfter:["pageAfter()"]

};

if($SwordWebRunmode.isDev())jsR.initConfig(swordCfg);
