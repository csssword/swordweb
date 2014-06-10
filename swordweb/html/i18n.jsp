<%@ page import="java.util.Locale" %>
<%@ page import="com.css.sword.platform.web.comm.CommParas" %><%
    //todo javascript 端测试用
    //java.util.Locale lo = new Locale("en","us");

    //todo 此处Locale对象应该从Session里面取
    //java.util.Locale lo = request.getLocale();
    Locale lo = (Locale)request.getSession().getAttribute(CommParas.CUSTOMER_LOCALE);
    if(lo==null){
        lo = request.getLocale();
    }
    String country = lo.getCountry();
    String language = lo.getLanguage();
%>
<%@ taglib prefix="sword"  uri="/WEB-INF/sword.tld"%>
<!--javascript端的国际化的标志-->
<script type="text/javascript" id="SwordLocalization">
    var SwordLocalization = ("<%=language%>-<%=country%>").toLowerCase();
</script>