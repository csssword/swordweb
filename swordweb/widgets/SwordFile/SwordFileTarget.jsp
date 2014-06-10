<html>
<head>

<script language="javascript" type="text/javascript" src="<%=request.getContextPath()%>/swordweb/core/jsimport/Sword.js">
</script>

    <script type="text/javascript">
        function init() {
         var resData = document.getElementById("SwordPageData").getAttribute("data");
         if($defined(resData)){
          resData = JSON.decode(resData);
         }
         if(resData['exception']) {
                 if(resData['ajaxErrorPage']) {
                     if(!resData['exceptionMes'])resData['exceptionMes']='';
                     var popupParam = JSON.decode(resData['ajaxErrorPopupParam'].replace(/&apos;/g, "'")) || {titleName:'wrong!',width: 412,height:450};
                     var win = window;
                     if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)win=parent.window;
                     var doctemp=win.document;
                     var scrollTop=0;
                     if (doctemp.body && doctemp.body.scrollTop)
                     {
                     	scrollTop=doctemp.body.scrollTop;
                     }else if (doctemp.documentElement && doctemp.documentElement.scrollTop)
                     {
                     	scrollTop=doctemp.documentElement.scrollTop;
                     }
                     popupParam['top'] = popupParam.top + scrollTop;
                     popupParam['param'] = {'win':win,'data':resData};
                     swordAlertIframe(jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + resData['ajaxErrorPage'], popupParam,null);
                 } 
         }else{
         if ($defined(resData)&&parent.onFileCommitAfter) {
                resData["getAttr"] = function(key) {
                    for (var i = 0; i < (resData.data || []).length; i++) {
                        var d = resData.data[i];
                        if (d["name"] == key) {
                            return d["value"];
                        }
                    }
                }.bind(this);
            }
            if(parent.onFileCommitAfter)parent.onFileCommitAfter(resData);
         }
        }
    </script>
</head>
<body onload="init()">
</body>
</html>