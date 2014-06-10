<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="/WEB-INF/taglib/c.tld" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <script language="javascript" type="text/javascript" src="<%=request.getContextPath()%>/swordweb/core/jsimport/Sword.js"></script>
    <title>访问系统出现异常</title>
    <script language="javascript" type="text/javascript">
    	var ip='<c:out value="${ip}"/>';//根据ip获取用户名
        function __openErrorFrame() {
        	 var czybm = Cookie.read("suidcookie:" + ip);
        	 
            var msg =  "您已长时间未操作，请按“确定”后重新登录!";
            var win = getTop();
            submit = $w("submit");
            submit.pushData("czybm",czybm);
           submit.onSubmit();
            if(win.confirm(msg)) {
                
                win.location.href = "sword?ctrl=LoginCtrl_init";
            } else {
                win.close();
            }
        }
        
    </script>
</head>
<body>
<div sword="SwordSubmit" ctrl="LoginCtrl_logout" name="submit"
	isShow="false"></div>
<div sword="PageInit" name="adf" onAfter="__openErrorFrame()"></div>
</body>

</html>