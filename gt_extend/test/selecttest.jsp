<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>    
    <title></title> 
	<script language="javascript" type="text/javascript" src="<%=request. getContextPath()%>/swordweb/core/jsimport/Sword.js"></script>
    <style type="text/css">
    	 .btn {font-size:12px;color: #000000;padding-left:8px;height:23px;line-height:23px;background:url(../images/btn_left_bg.gif) left no-repeat;border:0px; display:block; float:left;margin-right:20px;}
		.btn span {height:23px;padding-right:8px;line-height:23px;background:url(../images/btn_right_bg.gif) right no-repeat;border:0px; display:block;}
    </style>
    <script type="text/javascript"> 
    	function checkCacheData(){
    	     /*
    		  var ZSXM = $w("saveStudent0").getValue("ZSXM").code;
    		  var ZSPM = $w("saveStudent0").getValue("ZSPM").code;
    		  alert(ZSXM + " == " + ZSPM);
    		  
    		  alert($w("testSelectform").getValue("HYDM"));
    		  
    		  */
    		  // pc.getWidget('saveStudent0').setValue("ZSPM","0200"); 
    		   
    		   var ZSPM = $w("saveStudent0").getValue("ZSPM").code;
    		    alert("ZSPM = "   + ZSPM);
    	}
    	 function before() {  
                   
         }  
  
            function dataInit() {  
                
            }  

          function after() {  
               
          }  
          function filter(dataObj,inputEl,obj){  
			          
    	 }  
    	 function $initView(){    	  
    	 	   /*$w("saveStudent0").disable(["ZSPM"]);
    	 	   //.getField("ZSPM").setProperty("disable","true");
	    	  
	    	 	$w("saveStudent0").getField("name2").addEvent("keyup",function(e){
	    	 		swordConfirm(e.code,{  
	    	 							 onOk: function(){  
	                                        alert('ok!');
	                                     },  
	                                    onCancel: function(){  
	                                        alert('cancel!');  
	                                    }
	    	     });
	    	 });
	    	 */
	    	 swordAlertWrong("错误信息错误信");   
    	 }
    	 
    	 function code2name(){
    	 
    	 	var code = $("code").get("value");    
    	 	var  p = {T:"T_DM_GY_ZSPM",MC:"ZSPMMC",DM: "ZSPM_DM",V:code,PDM:"SZ_DM",PV:"01"};
    	 	var mc = $cache.code2name(p);
    	 	alert(mc);
    	 	var  p = {T:"T_DM_GY_ZSPM",MC:"ZSPMMC",DM: "ZSPM_DM",V:code,PDM:"SZ_DM",PV:"01",func:function(v){
    	 		  alert(v);
    	 	}};
    	 	 $cache.code2name(p);
    	 }
   function filter(dataObj,inputEl,obj){  
        var newData = [];  
        dataObj.each(function(item,index){  
           if(item.code!="10")  
               		 newData[newData.length] = item;  
              });  
        return newData ;                
     } 
   
    </script>
  </head>  
  <body><!--
  		<div sword='SwordForm' name='saveStudent0' panel="true" caption='下拉' >  
  			<div   type="select" caption="征收项目" name="ZSXM" defvalue="03"  dataname="T_DM_GY_ZSXM"     popdisplay="{code}|{caption}"  ></div>
    		<div type="select" caption="征收品目" name="ZSPM"  dataname="T_DM_GY_ZSPM"     popDisplay="{code}|{caption}"  ></div>
    		<div type="select" caption="征收品目-2" name="ZSPM2"  dataname="T_DM_GY_ZSPM"     popDisplay="{code}|{caption}"  ></div>
    	    <div type="select" caption="征收项目-1" name="ZSXM"  dataname="T_DM_GY_ZSXM"      popDisplay="{code}|{caption}"  ></div>
  		
    		<div type="select" caption="AAA" name="ZSXM"      popdisplay="{code}|{caption}"  >
    			 <div code=1 caption="北京"></div>  
	            <div code=2 caption="山东"></div>  
	            <div code=3 caption="上海"></div>  >
    		</div>
    		<div type="select" caption="BBB" name="ZSXM"      popdisplay="{code}|{caption}"  >
    			 <div code=1 caption="北京1"></div>  
            <div code=2 caption="山东2"></div>  
            <div code=3 caption="上海3"></div>  >
    		</div>
    		<div type="select" caption="CCC" name="ZSXM"      popdisplay="{code}|{caption}"  >
    			 <div code=1 caption="北京rrrrrr"></div>  
            <div code=2 caption="山东rrrrrrrrrrrrrrrr"></div>  
            <div code=3 caption="上海tttttttt"></div>  
    		</div>
    			<div name="name" caption="text" css="width:800px"></div>  
    			<div name="name2" caption="text"></div>  
       	</div>
       
    	<div caption="下拉树" panel="true" sword="SwordForm" layout="layer0" name="testSelectform">       
		    	<div    caption="下拉树" type='pulltree'  lazyLayer="1"  lazyTime="200"  pulltreetype="HYDM"   name="HYDM"  selectRealKey="code"  inputWidth="300px"  width"300px"  height="200px" selectrule="leaf"  > </div>  
		 </div>
    	
    		-->
    		  <div sword='SwordForm' name='saveStudent01' panel="true" caption='下拉-1' >  
                 <div  dataFilter="filter()" name="T_DM_GY_ZZLX"caption="T_DM_GY_ZZLX" type="select" dataname="T_DM_GY_ZZLX"  popdisplay="{code}|{caption}"  ></div>  
             </div>  
              <div caption="下拉树" panel="true" sword="SwordForm" layout="layer0" name="testSelectform2">       
		    	<div    caption="下拉树" type='pulltree'  lazyLayer="1"  lazyTime="200"  pulltreetype="HYDM"   name="HYDM2"  selectRealKey="code"  inputWidth="300px"  width"300px"  height="200px" selectrule="leaf"  > </div>  
		 </div>
             <!--  
             {T:'T_DM_GY_ZSXM',DM:'ZSXM_DM',W:'T.ZSXM_DM!=01'},
             
             "SELECT a.ZSXM_DM AS code,a.MC AS caption FROM T_DM_GY_ZSXM AS a WHERE a.ZSXM_DM!='01'  |SELECT b.ZSPM_DM AS code,b.ZSXM_DM  AS pcode,b.MC AS caption FROM T_DM_GY_ZSPM AS b" 
             -->
    	 <button onclick="checkCacheData();">赋值</button>
    	<input type="text"  id ="code"  />
    	<button onclick="code2name();">代码转名称</button>
  		<div id="SwordPageData"   query="[{T:'T_DM_GY_ZZLX'}]"></div>
 		 
 		 <div sword='PageInit'  
              onBefore="before();"  
              onDataInit="dataInit();"  
              onAfter="after();"  
              data='{"data":[{"data":{"name":{"value":"张三"},"id":{"value":"1"}},"name":"student","sword":"SwordForm"}]}'></div>
  </body>
</html>
