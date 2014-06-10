var sword = window.sword || {};
sword.ajax  = function(options) {
	   var defaultoptions = {
			url : null,  //请求URL
			method:"post", //提交方式
			async:false,
			data:'', //发送的数据
			onSuccess : $empty, //成功请求后的处理函数
			onFailure : $empty  //请求失败后的处理函数
	  };
	  var newoptions = $extend(defaultoptions,options); 
	  new Request(newoptions).send(newoptions.data);
};
var $cache=sword.CacheManager = {
	 tableVersion : "", //当前请求表的服务器端版本信息
	 swfpath : jsR.rootPath+"swordweb/widgets/SwordClientCache", //swf路径
	 currentCacheObj:null,//当前缓存对象
	 callback_func:function(){}, //回调默认函数
	 tableName:"", //当前查询的缓存表名称
	 querySql:"", //查询语句
	 isReady:false, //swf是否完全加载完毕
	 QueueList:$H(),//所有本次页面缓存过的数据集合（根据表名来划分）
	 swordcacheInstance:null,
	 cacheHash : $H(),
	 cacheSqlHash : $H(),
	 cacheFunc: $H(),
	 /*新增批量比较版本、加载数据到缓存的方法*/
	 /*参数 ： paramlist 为存放类SQL数组 ； fn为回调方法  */
	 batchget:function(paramlist,fn){	
		 var reg = /FROM (\w+)\s*(WHERE)?/ig;
		 //定义数组，存放由SQL中截取出来的缓存表名称
		 var param = [];		 
		 paramlist.each(function(sql){
			 var result =  sql.match(reg);
			 var tablename = RegExp.$1;
			 
			 param.include(tablename);
			 $cache.cacheSqlHash.set(tablename,sql);	
			 $cache.cacheFunc.set(tablename,fn);		 		
		 });
		 //定义Hash , 存放批量返回的缓存表版本、缓存表名称		 
//		 var versionhash = $H(); 
//		 if (param.length >0){
//				 sword.ajax({
//			 			url : "ajax.sword?FromSwordLoading=true&ctrl=CacheCtrl_batchGetCacheTableVersion",          
//			          	data: "tableNameList="+param.join("#"),          	
//			          	onSuccess : function(res){
//			          		var returnData = JSON.decode(res).data;
//			          		returnData.each(function(d){
//			          			versionhash.set(d.name,d.value);
//			          		});
//			          	},
//			          	onFailure :  function(e){
//			          		//alert("error:" + e);
//			          	}
//				    });
//		    }
		 	//定义数组 ，存放所有需要后台请求缓存表数据的缓存表名称（可能本地版本低或者没有被缓存过等等）
		 	var  requestarr = [];
		 	//返回回调函数的HASH ，KEY为缓存表名称，VALUE为已经处理的缓存表数据
		 	var returnhash = $H();		 	
			param.each(function(item){
				$cache.initCacheContainer(item);
				if($cache.currentCacheObj){
				$cache.currentCacheObj.get(item+"_version",function(ok,version,key){
					if (ok){//get version success
						if($chk(version)){
							var v = $cache.currentCacheObj.getServerCache(item);
							if($chk(v)){
								  if(parseInt(version) != parseInt(v)){/*版本过低*/
									     requestarr.push(key);
										 //sword.CacheManager.requestCacheData(key);
								   }else{/*版本一致 ，从缓存中加载数据*/
									   var cacheObj =  $cache.cacheHash.get(key);
									   cacheObj.get(key,function(ok,val){		
											  var func = $cache.cacheFunc.get(key);
												if(ok){ 
													var sql = $cache.cacheSqlHash.get(key);
													var val = $cache.query(val,sql,key);										 
													returnhash.set(key,val);
												}else{													
													requestarr.push(key);
												}
											});
								   }
							}else{					
								 requestarr.push(key);
							}
						}
					}else{
						requestarr.push(key);
						// sword.CacheManager.requestCacheData(key);
					}
				});
			}				 
			});			 
			
			/*如果requestarr数组中有数据，则代表需要请求后台缓存表*/
			if (requestarr.length !=0){
				var url = "ajax.sword?FromSwordLoading=true&ctrl=CacheCtrl_batchGetCacheData&sName=CacheCtrl_batchGetCacheData&rUUID="+pc.getRandomUUID();
		        if(jsR.config.SwordClientTiming){
		        		url = url + "&sDate=" + new Date().getTime();
		        }
					sword.ajax({
			 			url : url,             
		              	data:"tableNameList="+requestarr.join("#"),                  
		              	onSuccess : function(res){
						var resJson = JSON.decode(res);
						if(!$defined(resJson.getAttr)) {
							resJson["getAttr"] = pc.getAttrFunc;
				          }
						_pcSwordClientAJAXTiming("31",url,resJson.getAttr("sessionID"),"","CacheCtrl_batchGetCacheData");
						if (resJson['exception']) {
						 if(resJson['ajaxErrorPage']) {
			                    if(!resJson['exceptionMes'])resJson['exceptionMes']='';
			                    var popupParam = JSON.decode(resJson['ajaxErrorPopupParam'].replace(/&apos;/g, "'")) || {titleName:'出错了！',width: 412,height:450};
			                    var doctemp=window.document;
			                    var scrollTop=0;
			                    if (doctemp.body && doctemp.body.scrollTop)
			                    {
			                    	scrollTop=doctemp.body.scrollTop;
			                    }else if (doctemp.documentElement && doctemp.documentElement.scrollTop)
			                    {
			                    	scrollTop=doctemp.documentElement.scrollTop;
			                    }
			                    popupParam['top'] = popupParam.top + scrollTop;
			                    popupParam['param'] = {'win':window,'data':resJson};
			                    swordAlertIframe(jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + resJson['ajaxErrorPage'], popupParam,null);
			                }  else {
			                    this.alertError('<b><font color="red">出错了！</font></b>' +
			                            '<br><font color="blue" >错误名称</font> : ' + resJson['exceptionName']
			                            + '  <br><font color="blue" >错误信息</font> : ' + resJson['exceptionMes']
			                            + '<br><font color="blue" >调试信息</font> : ' + resJson['debugMes']);
			                    }
						}else{
							 resJson.data.each(function(item){
			              			/**/
			              			var temp = item.name.split("^");
			              			var tableName = temp[0];
			              			if(tableName=="sessionID")return;
			              			var version = temp[1];		              		 
			              			var sql = sword.CacheManager.cacheSqlHash.get(tableName);			              		
			              			var cacheData =  item.value;  
			              			var result = $cache.currentCacheObj.uncompress(cacheData);	
			              			if(result!=null){
			              				var tempobj =$cache.cacheHash.get(tableName);
				              			if (tempobj){
				              				tempobj.set(tableName,result);
				              			}		              		 
				              			returnhash.set(tableName,$cache.query(result,sql,tableName));	
				              			
				              			var tempVersionobj = $cache.cacheHash.get(tableName+"_version");
				              			if (tempVersionobj){
				              				tempVersionobj.set(tableName+"_version",version);
				              				$cache.currentCacheObj.setServerCache(tableName,version);
				              			}
			              			}
			              		});
						}
						_pcSwordClientAJAXTiming("32",url,resJson.getAttr("sessionID"),"","CacheCtrl_batchGetCacheData");
		              	},
		              	onFailure : function(e){
		              	//alert("error:" + e);
		              	}
				   });
			}		
			//回调函数
			fn.call(this,returnhash);
	 },
	/**
		获取本地缓存中的表数据
	*/
	get:function(sql,fn){
				var reg = /FROM (\w+)\s*(WHERE)?/ig;
		 		if (sql.indexOf("FROM")==-1){
		 			sql = "SELECT * FROM " + sql;
		 		}
		 		var result =  sql.match(reg);
		 		this.tableName =  RegExp.$1;		 		 
		 		this.callback_func =  fn;
		 		this.querySql =  sql;
		 		this.cacheSqlHash.set(this.tableName,sql);
		 		this.cacheFunc.set(this.tableName,fn);		 		
			    this.initCacheContainer(this.tableName);			   
			    var obj = this.cacheHash.get(this.tableName+"_version");
			    if(obj){
				    obj.get(this.tableName+"_version",function(ok,version,key){
						if(ok){
							if($chk(version)){
//								sword.CacheManager.requestCacheTableVersion(key);
								var v = obj.getServerCache(key);
								 if($chk(v)){
								   if(parseInt(version) != v){
										 sword.CacheManager.requestCacheData(key);
								   }else{
									  var cacheObj =  sword.CacheManager.cacheHash.get(key);
									  cacheObj.get(key,function(ok,val){
										  var func = sword.CacheManager.cacheFunc.get(key);
											if(ok){//获取成功
												val =  sword.CacheManager.query(val,sql,key);
												func(val,key);
											}else{											 
												//func(null);
												sword.CacheManager.requestCacheData(key);
											}
										});
							  	  }
								}else{
									sword.CacheManager.requestCacheData(key);
								}
							}
						}else{//还未缓存过
							  sword.CacheManager.requestCacheData(key);
						}
					});
				}
	},
	/**
		获取服务器端表版本信息
	*/
	requestCacheTableVersion:function(tableName){
		var param =  "tableName="+tableName;
		sword.ajax({
 			url : "ajax.sword?FromSwordLoading=true&ctrl=CacheCtrl_getCacheTableVersion",          
          	data:param,          	
          	onSuccess : this.getVersionSuccess,
          	onFailure : this.getVersionFail
	    });
	},
	getVersionSuccess:function(res){
		sword.CacheManager.tableVersion = JSON.decode(res).data[0].value;
	},
	getVersionFail:function(e1){
		alert("获取服务端缓存表版本信息失败!具体原因:"+e1);
	},
	/**
		请求服务器端表数据
	*/
	requestCacheData:function(tableName){
		var url = "ajax.sword?FromSwordLoading=true&ctrl=CacheCtrl_getCacheData&sName=CacheCtrl_getCacheData&rUUID="+pc.getRandomUUID();
        if(jsR.config.SwordClientTiming){
        		url = url + "&sDate=" + new Date().getTime();
        }
		var param =  "tableName="+tableName;
			sword.ajax({
	 			url : url,             
              	data:param,                  
            	onSuccess : function(res){
				var resJson = JSON.decode(res);
				if(!$defined(resJson.getAttr)) {
					resJson["getAttr"] = pc.getAttrFunc;
		          }
				_pcSwordClientAJAXTiming("31",url,resJson.getAttr("sessionID"),"","CacheCtrl_getCacheData");
				if (resJson['exception']) {
				 if(resJson['ajaxErrorPage']) {
	                    if(!resJson['exceptionMes'])resJson['exceptionMes']='';
	                    var popupParam = JSON.decode(resJson['ajaxErrorPopupParam'].replace(/&apos;/g, "'")) || {titleName:'出错了！',width: 412,height:450};
	                    var doctemp=window.document;
	                    var scrollTop=0;
	                    if (doctemp.body && doctemp.body.scrollTop)
	                    {
	                    	scrollTop=doctemp.body.scrollTop;
	                    }else if (doctemp.documentElement && doctemp.documentElement.scrollTop)
	                    {
	                    	scrollTop=doctemp.documentElement.scrollTop;
	                    }
	                    popupParam['top'] = popupParam.top + scrollTop;
	                    popupParam['param'] = {'win':window,'data':resJson};
	                    swordAlertIframe(jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + resJson['ajaxErrorPage'], popupParam,null);
	                }  else {
	                    this.alertError('<b><font color="red">出错了！</font></b>' +
	                            '<br><font color="blue" >错误名称</font> : ' + resJson['exceptionName']
	                            + '  <br><font color="blue" >错误信息</font> : ' + resJson['exceptionMes']
	                            + '<br><font color="blue" >调试信息</font> : ' + resJson['debugMes']);
	                    }
				}else{
					var tableName = resJson.data[0].name;
					var sql = sword.CacheManager.cacheSqlHash.get(tableName);
					var func = sword.CacheManager.cacheFunc.get(tableName);
					func(sword.CacheManager.query(sword.CacheManager.init(res),sql,tableName),tableName);
				}
				_pcSwordClientAJAXTiming("32",url,resJson.getAttr("sessionID"),"","CacheCtrl_getCacheData");
			},
              	onFailure : this.fail
		});
	},
	success:function(res){
		var tableName = JSON.decode(res).data[0].name;
		var sql = sword.CacheManager.cacheSqlHash.get(tableName);
		var func = sword.CacheManager.cacheFunc.get(tableName);
		func(sword.CacheManager.query(sword.CacheManager.init(res),sql,tableName),tableName);
	},
	fail:function(e){
		alert("请求缓存表出现错误,具体原因:"+e);
	},
	/**
		 缓存对象赋值
	*/
	init:function(resData,tableName){
		var jsonRes =  JSON.decode(resData);
		var cacheData =  jsonRes.data[0].value; //缓存数据
		var result = this.uncompress(cacheData);
		if(result!=null){
			var tableName =  jsonRes.data[0].name;  //缓存表名称
			var version =   jsonRes.data[1].value;  //  缓存表版本号
			var tempVersionobj = sword.CacheManager.cacheHash.get(tableName+"_version");
			if (tempVersionobj){
				tempVersionobj.set(tableName+"_version",version);
				$cache.currentCacheObj.setServerCache(tableName,version);
			}
			var tempobj = sword.CacheManager.cacheHash.get(tableName);
			if (tempobj && result!=null){
				tempobj.set(tableName,result,function(a,b,c){
					/*if(!$defined(c)){
						var rv = window.showModalDialog('swordweb/html/cache/initscc.jsp','','dialogWidth:400px;dialogHeight:300px');
						if(rv == '_$ConfigSwordCache$_'){
							window.location.reload();
						}
					}*/
				});
			}		 
		}
		return result;
	},
	
	/**
		初始化缓存容器
	*/
	initCacheContainer:function(tableName){
		/*
		var obj = new Persist.Store(tableName,{
				swf_path: this.swfpath+'/swordcache.swf'
		});
		var versioncacheobj  =  new Persist.Store(tableName+"_version",{
			swf_path: this.swfpath+'/swordcache.swf'
		});*/
		/*从顶层获取缓存对象*/
		if (this.currentCacheObj == null){			 
			var obj = top.$swfcacheobject;
			this.currentCacheObj =  obj;		
		}
		this.cacheHash.set(tableName,this.currentCacheObj);
		this.cacheHash.set(tableName+"_version",this.currentCacheObj);	 
	},
	//解压缩数据
	uncompress:function(data){
		return this.currentCacheObj.uncompress(data);
	},
	//根据sql查询缓存数据
	query:function(cacheData,sql,tableName){ 
		if(cacheData != null){
			var schema = $H();
			 var schemaVal = $H();
			 var  filterData  = $H();
		     var dataJsonObj = JSON.decode(cacheData);
		     /*
		     if(dataJsonObj.length > 0 ){
		    	 var tempHash = $H(dataJsonObj[0]);
		    	 var keys = tempHash.getKeys();
		     }	
		     keys.each(function(item,index){
		    	 schemaVal.set(item,{type:"String"});
		     });
		     */
		     if(dataJsonObj.length > 0 ){
			     for (var item in dataJsonObj[0]) {
			    	 schemaVal.set(item,{type:"String"});
			     }
		     }	  
		     schema.set(tableName,schemaVal);
		     filterData.set(tableName,dataJsonObj);
		     sword.CacheManager.QueueList.erase(tableName);
		     sword.CacheManager.QueueList.erase(tableName+"_schema");
			 sword.CacheManager.QueueList.set(tableName,filterData);
			 sword.CacheManager.QueueList.set(tableName+"_schema",schema);
			 var q =  TrimPath.makeQueryLang(schema).parseSQL(sql);	
			 var results =q.filter(filterData);			
		
			 try{
			 	 return results;
			 }catch(e){
				 return e;
			 }		
		}else return null;
    },	
    code2name:function(op){
    	var sql = "";
    	if (op.PDM){
    		sql  = "SELECT T.{MC}  FROM {T} AS T WHERE T.{DM} == '{V}' AND T.{PDM}=='{PV}'" .substitute(op);  
    	}else{
    		 sql = "SELECT T.{MC}  FROM {T} AS T WHERE T.{DM} == '{V}'" .substitute(op);  
    	}
    	if ($chk(op.func)){
	    	return this.get(sql,function(v){
	    		//TODO
	    		v = JSON.decode(v)
	    		if ($chk(v) && v.length>0){
	    			v = v[0][op.MC];
	    		}else{
	    			v= "";
	    		}
	    		op.func.call($cache,v);
	    	});
    	}else{
    		return this.getResultBySql(sql,true,op.MC);
    	}
    },  
	//不刷新页面的情况下查询所有该页面中使用 到的缓存数据，并通过SQL语句进行筛选  (注:isDMB 为判断是否为代码表转名称,如果是则只返回该代码表对应的名称)
	getResultBySql:function(sql,isDMB,mc){
		var reg = /FROM (\w+)\s*(WHERE)?/ig;
		var reg1 =/SELECT (.*) FROM/ig;
		var result =  sql.match(reg);
		var tableName =  RegExp.$1;
		var result1 =  sql.match(reg1);
		var selector = RegExp.$1;
		if($chk(sword.CacheManager.QueueList.get(tableName))){
			  var schema =   sword.CacheManager.QueueList.get(tableName+"_schema")
			  var ttablename = sword.CacheManager.QueueList.get(tableName);
			  if($defined(isDMB)){
				  var o = TrimPath.makeQueryLang(schema).parseSQL(sql).filter(ttablename);
				  if ($chk(o) && o.length>0){
					  return o[0][mc];
				  }else{
					  return "";
				  }
			  }else{
			  	  return TrimPath.makeQueryLang(schema).parseSQL(sql).filter(ttablename);
			  }
		}else{
			return [];
		}
	},	 
	//自定义缓存调用接口
	getswordcacheInstance:function(){
    	if(this.swordcacheInstance==null){
	    	this.swordcacheInstance = new Persist.Store("SWORDCACHE",{
				swf_path: this.swfpath+'/swordcache.swf'
	    	});
    	}
    	return this.swordcacheInstance;
    },
    put:function(key,value){
    	 var is = this.getswordcacheInstance();
    	 var i = 1;
    	  (function(){
    		    i++;
    	  		try{          	  			
		 			if(is.el.ready()){
		 				 is.el.set(is.name, 'PS' + key.replace(/_/g, '__').replace(/ /g, '_s'), value);
		 			     return;
		 			}else{
		 				if(i>5)return; 		
		 			    setTimeout(arguments.callee,20);
		 			}
	 			}catch(e){
	 				if(i>5) return; 
	 				setTimeout(arguments.callee,20);
	 			}  		 			
	     })();    
    },
    load:function(key,fn){
    	 var is = this.getswordcacheInstance();
    	 var i = 1;
    	  (function(){
    		    i++;
    	  		try{          	  			
		 			if(is.el.ready()){
		 				 val = is.el.get(is.name,'PS' + key.replace(/_/g, '__').replace(/ /g, '_s'));
		 				 if (fn)
	            				fn.call(is, val !== null, val);
		 			     return;
		 			}else{
		 				if(i>5) return; 		
		 			    setTimeout(arguments.callee,20);
		 			}
	 			}catch(e){
	 				if(i>5) return; 
	 				setTimeout(arguments.callee,20);
	 			}  		 			
	     })(); 
    },
    remove:function(key,fn){
    	 var is = this.getswordcacheInstance();
    	 var i = 1;
    	  (function(){
    		    i++;
    	  		try{          	  			
		 			if(is.el.ready()){
		 				 val = is.el.remove(is.name,'PS' + key.replace(/_/g, '__').replace(/ /g, '_s'));
		 				 if (fn)
		 					fn.call(this, true, val);
		 			     return;
		 			}else{
		 				if(i>5) return; 		
		 			    setTimeout(arguments.callee,20);
		 			}
	 			}catch(e){
                      alert(e);
	 				if(i>5) return; 
	 				setTimeout(arguments.callee,20);
	 			}  		 			
	     })(); 
    },
    /*通过缓存表名*/
    getRDataForTName:function(tableName,Type,code){
    	var ct = $('SwordCacheData');
    	var zdm="";
    	if (ct) {
        	var querystr = null;
    		Type=="tree"?querystr = ct.get('queryTree'):querystr = ct.get('query');
    		var queryObj = JSON.decode(querystr); 
    		queryObj.each(function(item,index){
    			if(item.T==tableName&&item.DM)zdm=item.DM;
    		});
    		if(zdm=="")zdm=tableName.substring(tableName.lastIndexOf('_') + 1)+"_DM";
    	}
    	var onRowObj=null;
    	this.get(tableName,function(result,table){
    		if(result){
    			var res = eval(result);
    			res.each(function(item,index){
    				if(item[zdm]==code)onRowObj=item;
    			});
    		}
    	});
    	return onRowObj;
    }
};