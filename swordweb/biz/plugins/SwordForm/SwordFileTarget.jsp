<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<html>
<%
    String title = (String) request.getAttribute("fileName");
    String filename = (String) request.getAttribute("uuidName");
    String domain = (String) request.getAttribute("domain");
    String size = (String) request.getAttribute("size");
    String errorMessage = (String) request.getAttribute("errorMessage");
    String path = (String) request.getAttribute("path");
%>
<head>
    <script type="text/javascript">
        var SwordUploadReturnXML = {tds:{title:{
            value:"<%=title%>"},filename:{value:"<%=filename%>"},path:{value:"<%=path%>"},domain:{value:"<%=domain%>"},size:{value:SwordUploadGetSize("<%=size%>")},errorMessage:{value:"<%=errorMessage%>"}}};
        function getReturnValue() {
            return SwordUploadReturnXML;
        }
      function SwordUploadGetSize(size) {
        var sizename = new Array("B", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB");
        var times = 0;
        while(size >= 1024){
    		size = size / 1024;
    		times++;
    	};
    	if(times > 0){
    		return size.toFixed(2) + sizename[times];
        }else{
        	return size + sizename[times];
        }
     }
    </script>
</head>
<body>
提交之后的页面！
</body>
</html>