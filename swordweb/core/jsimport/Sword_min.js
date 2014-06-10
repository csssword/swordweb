
function maskDialog() {
    this.hide = function() {
        var el = $("div_Mask");
        if(el) {
            this.delayHide(el);
        }
    };
    this.delayHide = function(el) {
        el.setStyle('display', 'none');
    };
    this.show = function() {
        document.writeln('<div id="div_Mask" style=" width:100%;position:absolute; z-index:99999; top:0; left:0; background:white; height:'+document.documentElement.clientHeight+'px;"><div style="z-index:99999;font-size:12px;color:#FFFFFF;background:#FF0000;position:absolute;top:0px;right:0px;padding:2px 10px 2px 10px;">' +
                '加载中，请稍候..........</div></div>');
        document.close();
        return this;
    };
}
var MaskDialog = new maskDialog().show();

window.onerror=function(sMsg,sUrl,sLine){
//	if(pc&&pc.getMask()){
//        pc.getMask().unmask();
//   }
//   MaskDialog.hide();
//   
   var ErrorDiv = new Element("div") ;
   ErrorDiv.id = 'SwordErrorDiv';
   ErrorDiv.innerHTML="<b>An error was thrown and caught.</b><p>";
   ErrorDiv.innerHTML+="Error: " + sMsg + "<br>";
   ErrorDiv.innerHTML+="Line: " + sLine + "<br>";
   ErrorDiv.innerHTML+="URL: " + sUrl + "<br>";
//   swordAlertDiv(ErrorDiv.innerHTML,{titleName:'JS错误提示',width: 600,height: 200}); 
   ErrorDiv.setStyle('display', 'none');
   $(document.body).grab(ErrorDiv);
return false;
};
var importCss="";
$SwordLoader=(function(){
    function isServer(){
        if(document.getElementsByTagName("script")[0]['edit'] == 'true') {
            return false;
        } else {
            return !document.domain == "";
        }
    }

    function isIE(){
          return (navigator.userAgent.toLowerCase().indexOf('msie') != -1);
    }

    function writeLocalJs(type, source) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.language = "javascript";
        oScript.type = "text/javascript";
        oScript.defer = true;
        oScript[type] = source;
        oHead.appendChild(oScript);
        return oScript;
    }

    function importJs(path){
        if (this.server) {
            this.writeServerJs(path);
        } else {
            this.writeLocalJs("src", path);
        }
    }

    function writeServerJs(path) {
        var xReq = null;
        if (window.XMLHttpRequest) {
            xReq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xReq = new ActiveXObject("MsXml2.XmlHttp");
        }
        xReq.open('get', path, false);
        xReq.setRequestHeader("Content-Type", "text/plain;charset=gb2312");
        xReq.send(null);
        if (xReq.readyState == 4) {
            if (xReq.status == 200) {
                if (this.isIE) {
                    execScript(xReq.responseText);
                } else {
                    window.eval(xReq.responseText);
                }
            }
        }
    }

    function ChargeAndGetRootPath() {
        var Srcs = document.getElementsByTagName("script");
        var idx = 0;
        //国际化的配置必须放置在Sword.js之上
        if (Srcs[0].id == "SwordLocalization") {
            idx = 1;
        }
        var imObj=document.getElementsByTagName("script")[idx];
        var imObjSrc = imObj.src;
        if (imObjSrc.lastIndexOf("Sword.js") < 0 || imObjSrc.lastIndexOf("swordweb/core/jsimport/Sword.js") < 0) {
            if (imObjSrc.lastIndexOf("Sword_opt.js") < 0 || imObjSrc.lastIndexOf("swordweb/core/jsimport/Sword_opt.js") < 0) {
                alert("Error,启动SwordWeb框架失败,Sword.js的script节点必须放在页面引用的第一个script节点上!");
                return null;
            } else {
            	 if(imObj.outerHTML.indexOf("importCss")>0){importCss=false}else{importCss=true}
                return imObjSrc.replace("swordweb/core/jsimport/Sword_opt.js", "");
            }
        } else {
        	 if(imObj.outerHTML.indexOf("importCss")>0){importCss=false}else{importCss=true}
            return imObjSrc.replace("swordweb/core/jsimport/Sword.js", "");
        }
    }

    function writeCSS(path){
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var link = document.createElement("link");
        link.href = path;
        link.type = "text/css";
        link.rel = "stylesheet";
        oHead.appendChild(link);
    }

    return{
        server: isServer()
        ,writeLocalJs: writeLocalJs
        ,writeServerJs:writeServerJs
        ,importJs:  importJs
        ,writeCSS:writeCSS
        ,isIE:isIE()
        ,rootPath:ChargeAndGetRootPath()
    };

})();




if(typeof(swordCfg)!="object"){ //开发模式
   $SwordLoader.importJs($SwordLoader.rootPath + "swordweb/core/jsimport/JsReady-dev.js");
   $SwordLoader.importJs($SwordLoader.rootPath + "swordweb/config.js");
} else if(importCss!=false){ //生产模式
    $SwordLoader.writeCSS($SwordLoader.rootPath +"swordweb/styles/"+swordCfg.style.sys_style +"/SwordCss/sword_min.css");
}

