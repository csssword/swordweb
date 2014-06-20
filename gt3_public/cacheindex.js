/*
document.addEvent('domready',function(){
	  				var cachewarp = new Element("div").inject(document.body);
	  				cachewarp.id = "_persist_flash_wrap";
	  				 var o = new SWFObject( jsR.rootPath+"swordweb/widgets/SwordClientCache/swordcache.swf", "_persist_flash",1, 1, '8'); 
	  				 o.addVariable("autostart", true);
	  				 o.write(cachewarp);
});	 		
*/
/*覆盖flash的__flash__removeCallback的方法 ，解决的Flash ExternalInterface在IE下的BUG*/
/*
var setRemoveCallback =function() {
       __flash__removeCallback =function(instance, name) {
	      if(instance) {
	          instance[name] =null;

	        }
      };
      window.setTimeout(setRemoveCallback, 10);
 };
setRemoveCallback();
*/

var $swfcacheobject = (function () {
	var isCache = false;
	var servercache = $H();
//	var localcache = $H();	 
	function getswfcacheobjct() {
		var  o ;
		if (Browser.Engine.trident){
			o = $("_persist_flash");
		}else{
			o = $("ex_persist_flash");
		}		 
		return o;
	}
	function esc(str) {
		 return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');  
	} 
	function initServerCache() {// 加载服务器版本信息
		var options = {
				url : "ajax.sword?ctrl=CacheCtrl_getAllVersion",  
//				async:false,
				method:"post", //提交方式
				data:'', //发送的数据
	          	onSuccess : function(res) {
	          		JSON.decode(res).data.each(function(el){
						servercache.set(el.name,el.value);
					});
					isCache = true;
				},
	          	onFailure : function() {
					alert('获取服务器缓存代码表信息出错！')
				}
		  };
		  new Request(options).send(options.data);
	}
	initServerCache();
	return {
	 	get : function(key, fn, scope){
	 		   var val;
	 		   //if (key.indexOf('_version')==-1){
//	 			   val = localcache.get(esc(key));
	 		  // }
	 		   //if (!val){ 
//	 				if(window.localStorage){
//	 					val = window.localStorage.getItem(key);
//	 				}else{ 
			 			var o = getswfcacheobjct();
			 			//alert("Flash组件加载是否成功 :" + o.ready());
			 			val=unescape(o.get(key, esc(key)));
	 			  //  }
//		 			localcache.set(esc(key),val);
//	 			}
 				var tname =key.substring(0,key.indexOf('_version')); 
 				 if (fn){
    					fn.call(scope || o , val !="null" && val !=null, val,tname);
 				 }	 		 
 				 return val;
	 	},
	 	
	 	set: function(key, val, fn, scope) {
	 			var getcd ; 
//	 			if(window.localStorage){
//	 				try{
//	 					window.localStorage.setItem(key,val);
//	 				}catch(e){
//	 				//	if (e ==  QUOTA_EXCEEDED_ERR) {
//	 						//存储空间不足 超过5M
//	 						window.localStorage.clear();
////	 						window.localStorage.setItem(key,val);
//	 				//	}
//	 				}
//					getcd = window.localStorage.getItem(key);
//				}else{
	 			var t = $("_persist_flash_text");
					var o = getswfcacheobjct();
		 		     var old_val = o.set(key, esc(key), val);  // set value
		 		     if(old_val == "pending"){
		 		    	 var h=document.body.clientHeight;
		 		    	 var w=window.screen.width;
		 		    	 $("_persist_flash_wrap").setStyles({"width":w,"height":h,"background":"#B3B3B3","z-index":"99999"});
		 		    	 if(t)t.setStyle("display","");
		 		    	o.width = w;
		 		    	o.height = "350";
		 		     }else{
		 		    	o.width = "1";
		 		    	o.height = "1";
		 		    	$("_persist_flash_wrap").setStyles({"width":1,"height":1});
		 		    	if(t)t.setStyle("display","none");
		 		     }
		 		     getcd =o.get(key, esc(key));
//				}	 			
				   if (fn) {
	            	  fn.call(scope || this, true, val,getcd);
	              }
	 	},
	 	 remove: function(key, fn, scope) {          
		           var o = getswfcacheobjct();
		          var val = o.remove(key, esc(key));    
		          if (fn) 
		           		 fn.call(scope || this, true, val);
		},
		 uncompress: function(data) {
			var d=null;
			try{
				d = unescape(getswfcacheobjct().uncompress(data));
			}catch(e){
				d=null;
			}
        	 return d; 
         }
		,
	    getServerCache: function(key){
	    	return  servercache.get(key);
	    }
		,
		setServerCache: function(key,val){
	    	servercache.set(key,val);
	    }
		,
		isCache: function(){
	    	return  isCache;
	    },
	    flushstatus: function(status,key,val){
	    	var o = getswfcacheobjct();
	    	var t = $("_persist_flash_text");
			if(status=="SharedObject.Flush.Success"){
				$("_persist_flash_wrap").setStyles({"width":1,"height":1});
 		    	o.width = "1";
 		    	o.height = "1";
 		    	if(t)t.setStyle("display","none");
	 		}else if(status=="SharedObject.Flush.Failed"){ 
	 			var old_val = o.set(key, esc(key), val);  // set value
	 		     if(old_val == "pending"){
	 		    	var h=document.body.clientHeight;
	 		    	 var w=window.screen.width;
	 		    	 $("_persist_flash_wrap").setStyles({"width":w,"height":h});
	 		    	if(t)t.setStyle("display","");
	 		    	o.width = w;
	 		    	o.height = "350";
	 		     }else{
	 		    	o.width = "1";
	 		    	o.height = "1";
	 		    	$("_persist_flash_wrap").setStyles({"width":1,"height":1});
	 		    	if(t)t.setStyle("display","none");
	 		     }
	 		}
	    }
	}
}());