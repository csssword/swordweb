/**
 * 装载 json 或xml数据的工厂
 * @param {Object} url
 * @param {Object} urlStr
 * @param {Object} isCache
 */
SwordTree.DomFactory = new Class({

    $family: {name: 'SwordTree.DomFactory'}
    /**
     * 请求的路径
     */
    ,props:null
    ,events:null

    ,initialize:function(obj,events) {

        //        if ($chk(tid) && tid.trim() != "") {
        //            tid = tid.trim();
        //            tid += ((tid.indexOf("?") != -1) ? "&" : "?") + "r=" + (new Date()).valueOf();
        //        }
        this.props = obj;
		this.events = events;
    }

    ,createDom:$empty

});

SwordTree.DomFactory.newInstance = function(obj,events) {
    var instance = null ;
    if ($defined(obj.type) && ("json".test(obj.type.trim(), 'i') || "jsonAptitude".test(obj.type.trim(), 'i'))) {

        instance = new SwordTree.JSONDomFactory(obj,events);
    } else {
        instance = new SwordTree.XMLDomFactory(obj,events);
    }
    return instance.createDom();
};

/**
 * 装载xml数据工厂
 * @param {Object} url
 * @param {Object} dataStr
 * @param {Object} isCache
 */
SwordTree.XMLDomFactory = new Class({
    Extends : SwordTree.DomFactory

    ,createDom: function() {
        var oDom = null;
        if (Browser.Engine.trident) {
            oDom = new ActiveXObject("Msxml2.domdocument");
        }
        if ($defined(this.props)) {
            if ($chk(this.props.tid)) {
                if (!Browser.Engine.trident) {
                    oDom = document.implementation.createDocument("", "", null);
                }
                oDom.async = false;
                if($chk(document.getElementsByTagName("script")[0]['pageRealPath'])){
                     this.props.tid = document.getElementsByTagName("script")[0]['pageRealPath']+"\\"+this.props.tid;
                }
                if(Browser.Engine.webkit){
                	var xhr = new XMLHttpRequest(); 
                	xhr.open("GET", this.props.tid, false); 
                	xhr.send(null); 
                	return xhr.responseXML.documentElement;
                }else{
                	oDom.load(this.props.tid);
                }
            }
            else {
                if ($chk(this.props.dataStr)) {
                    if (!Browser.Engine.trident) {
                        var oDomP = new DOMParser();
                        oDom.async = false;
                        oDom = oDomP.parseFromString(this.props.dataStr, "text/xml");
                    }
                    else {
                        oDom.async = false;
                        oDom.loadXML(this.props.dataStr);
                    }
                }
            }
        }
        else {
            if (!Browser.Engine.trident)
                oDom = document.implementation.createDocument("", "", null);
            oDom.async = false;
        }
        return oDom.documentElement;
    }
});

/**
 * 装载json数据工厂
 * @param {Object} url
 * @param {Object} dataStr
 * @param {Object} isCache
 */
SwordTree.JSONDomFactory = new Class({
    Extends:SwordTree.DomFactory


    ,createDom:function() {
        var hash;

        if ($defined(this.props)) {
            if ($chk(this.props.tid) || $chk(this.props.ctrl)) {
                var data = new Hash();
                data.set("sword", "SwordTree");
                data.set("name", this.props.treeContainerName);
                var pd = this.props.postData;
                if ($type(pd) == "string") {
                	this.props.postData = pd = JSON.decode(pd);
                }
                $defined(pd)?data.set("data", [pd]):data.set('data',[]);
                var attr = new Hash();
                attr.set("sword", "attr");
                attr.set("name", "treeName");
                attr.set("value",this.props.treeContainerName);
                
                 
                var req = pageContainer.getReq({
                    'tid':this.props.tid
                    ,'ctrl':this.props.ctrl
                    ,'widgets':[data,attr]
                });
                pageContainer.postReq({'req':req,'async':false
                    ,'onSuccess':function(resData) {
                        var data = pageContainer.getResData(this.props.treeContainerName, resData);
                        //logger.debug("装载树的数据：" + JSON.encode(data), "SwordTree");
                        hash = data;
                        if(this.events["loadDataFinish"] && this.events["loadDataFinish"][0]){
                        	this.events["loadDataFinish"][0].run(resData);
                        }
                    }.bind(this)
                    , 'onError'  :function (res) {
                        hash = new Hash();
                    }.bind(this)
                });


            } else if ($chk(this.props.dataStr) && $type(this.props.dataStr) == "string") {

                hash = new Hash(JSON.decode(this.props.dataStr));

            } else if ($chk(this.props.dataStr) && $type(this.props.dataStr) == "object") {

                hash = this.props.dataStr;
            }
        } else {
            hash = new Hash();
        }
        return hash;
    }

});

