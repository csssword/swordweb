<%@ page language="java" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>    
    <title>客户端缓存初始化</title>    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
  </head>  
  <body>  	
    <object id="initcc" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=10,1,1,0" width="360" height="212">    	 
    		<param name="movie" value="../../widgets/SwordClientCache/swordcache.swf" />    		
     		<param name="quality" value="high" />
    		<param name="flashvars" value="autostart=true" />
    		<embed src="../../widgets/SwordClientCache/swordcache.swf" quality="high"  type="application/x-shockwave-flash" width="366" height="212"></embed>
    </object>
    <br />
    <span>为了更好的用户体验，请将缓存设置为无限制！</span>
    <table align="center">
		<tr>
			<td><input type='button' name='b' value='刷新' onclick='rl()'/></td>
		</tr>
	</table>
    
  </body>
</html>
<script language="JavaScript" type="text/javascript">
window.onunload=function(){
	window.returnValue='_$ConfigSwordCache$_';
};
function rl(){
	if(confirm('确认已将本地存储容量设置为为限制？')){
		window.close();
	}
}
</script>