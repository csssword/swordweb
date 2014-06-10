<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="/WEB-INF/taglib/c.tld" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <script language="javascript" type="text/javascript" src="swordweb/core/jsimport/Sword.js"></script>
    <title>访问系统出现异常</title>
    <script language="javascript" type="text/javascript">

        function __openErrorFrame() {
            var errorPage = "swordweb/html/error/error_ajax.jsp";
            var popupParam = {titleName:'系统提示',width: 590,height:195,top:50,isMin:"false",isNormal:'false',isMax:'false'};
            var _dataObj_ = {'exceptionName':$('exceptionName').get('value'),'exceptionMes':$('exceptionMes').get('value'),'debugMes':$('debugMes').get('value')};
            popupParam['param'] = {'win':window,'data':_dataObj_};
            swordAlertIframe(jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + errorPage, popupParam, null);
            MaskDialog.hide();
        }
    </script>
</head>
<body>
<div sword="PageInit" name="adf" onAfter="__openErrorFrame()"></div>
<input type="hidden" id="debugMes" value="<c:out value="${exceptionDataMap.debugMes}"/>" >
<input type="hidden" id="exceptionName" value="<c:out value="${exceptionName}"/>" >
<input type="hidden" id="exceptionMes" value="<c:out value="${exceptionMes}"/>" >
</body>

</html>