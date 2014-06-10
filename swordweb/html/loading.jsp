<%@ page language="java"  pageEncoding="UTF-8" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
</head>
<body>

<style type="text/css">
    html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
 .div_Mask{
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(swordweb/styles/SwordDefault7/SwordCss/images/loadingbar.gif) white no-repeat scroll center center;
}
</style>
<div id="div_Mask" class="div_Mask"></div>
<script type="text/javascript">
    window.location.href='sword?FromSwordLoading=true&<%=request.getQueryString()%>';
</script>
</body>
</html>