/**
 * widgets 模块
 * @module widgets
 * @requires base ,core
 */
/**
 图表组件
 @class swordweb.widgets.SwordChart.SwordChart
 * @implements Events
 * @implements Options
 * @extends PageContainer
 */

var SwordChart = new Class({

    Implements:[Events,Options]
    //继承容器
    //继承容器的属性 widgets(type Hash)
    ,Extends : PageContainer

    /**
     * 此类的类名称 值使用 SwordChart
     * @property {private final string} name
     */
    ,name:"SwordChart"

    ,options:{
        /**
         * 组件类别声明 ,应该为 SwordChart ；在图表组件的根标签上必须声明此属性
         * @property {public string} sword
         */
        sword : null
        /**
         * 组件对象唯一标识，读取页面标签上的name属性；在图表组件的根标签上必须声明此属性，且要求声明的值唯一
         * @property {public string} name
         */
        ,name : null
        /**
         * 图表的标题栏；在图表组件的根标签上可以声明此属性 ，如果没有声明，图表将没有标题行
         * @property {public string} caption
         */
        ,caption : null
        /**
         * swf宽度;在图表组件的根标签上可以声明此属性;默认值为640
         * @property {public int} width
         */
        ,width:"640"
        /**
         * swf高度;在图表组件的根标签上可以声明此属性;默认值为480
         * @property {public int} height
         */
        ,height:"480"
        /**
         * 图表数据;在初始化组件或blh中可以声明此属性
         * @property {public object} data
         */
        ,data:null

        //以下为事件。。。

        /**
         * 图表初始化数据之前触发，当图表没有被数据装载，即后台没有调用addchart接口，将不会被触发；
         * 在图表组件的根标签上可以声明此属性
         * @event onAfterInitData
         */
        ,onBeforeInitData:$empty
        /**
         * 图表初始化数据结束之后触发，当图表没有被数据装载，即后台没有调用addchart接口，将不会被触发；
         * 在图表组件的根标签上可以声明此属性
         * @event onAfterInitData
         */
        ,onAfterInitData:$empty
    }
    ,swfUrl:jsR.rootPath + "swordweb/widgets/SwordChart/swordChartFlash.swf"
    ,swfVersion:"9.0.0"
    ,expressInstallSwfurl:jsR.rootPath + "swordweb/widgets/SwordChart/expressinstall.swf"
    ,chartTimer:null
    /**
     * 图表初始化参数;
     * get-data 回调的获取data方法
     * data-file data文件路径 jsR.rootPath + "/uitest/bar-21.txt"
     * @property {public object} para
     */
    ,para:{
        'get-data':"swordChartGetData"
//        'data-file':'178787.txt'
        ,'loading':'正在下载...'
//        ,'allowScriptAccess' :'always'
    }
    ,
    /**
     * 初始化方法
     * @function {public null} init
     * @param {InitPara}  initPara 使用这个dto对象来描述组件的初始化所需要的参数信息，通常包含一个root节点
     */
    initParam : function(initPara) {
        this.htmlOptions(initPara);
        initPara.set('id', this.options.name);
        this.para["id"] = this.options.name;

    },
    //此方法用在初始化一个图表的数据
    initData : function(data) {
        var charts=data['charts'];
        if($type(charts)=='string'){
             charts=JSON.decode(charts);
        }
        this.options.data = JSON.encode(charts);

        this.fireEvent('onBeforeInitData');
        this.initChart();
        this.fireEvent('onAfterInitData');
    },
    initChart : function() {
        swordSwf.embedSWF(
                this.swfUrl+'?r='+Math.random(), this.options.name, this.options.width, this.options.height,
                this.swfVersion, this.expressInstallSwfurl,
                this.para ,{'allowScriptAccess':'always'}
                );
    },
    findSWF: function() {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            var obj = window[this.options.name];
            if(obj.get('tag')=='object')return obj;
        } else {
            return document[this.options.name];
        }
    },
    reload : function(data) {
        var swf = this.findSWF();
        if($defined(swf)){
         var charts=data['charts'];
         if($type(charts)=='string'){
             charts=JSON.decode(charts);
         }
         this.findSWF().load( JSON.encode(charts));
        }else{
           this.initData(data);
        }
    },
    chartStop : function () {
        $clear(this.chartTimer);
        this.chartTimer = undefined;
    },
    chartStart : function () {
        if ($defined(this.chartTimer))return;
        this.chartTimer = next.periodical(3500);

    },
    chartffff : function () {
        alert(111221);
    }
})


function swordChartGetData(name) {
    if($type(name)=="array")name=name[0];
    return    $w(name).options.data;
}
function swordChartGetData2(name) {
    return    $w(name).options.data_demo;
}






