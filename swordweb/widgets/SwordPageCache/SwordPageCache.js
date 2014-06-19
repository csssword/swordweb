
/**
 * 浏览器端本地缓存
 */
var SwordPageCache = new Class({
    $family: {name: 'SwordPageCache'}
    ,Implements: [Events, Options]
    
    ,name: "SwordPageCache"
    //文件总控制
    ,collectInfoKey:"sword_page_cache_collect_info"
    ,uuid : null
    ,cacheObj: null
    ,jsVariableScope: ["gt3"]
    ,uuidSign:["tid","ctrl"]
    
    ,constant:{
    	"cache":"cache"
    	,"sword":"sword"
    	,"js" :"js"
    }
    
    ,options:{
        /**
         * 超时时间，默认2天
         * @type String
         */
        timeOut: "2880"
        /**
         * 刷新时间，默认5秒
         * @type String
         */
        ,refreshTime: "5"
        
        /**
         * 数据恢复起始间隔
         * @type String
         */
        ,delayTime: "1000"
        /**
         * 是否自动恢复数据
         * @type String
         */
        ,isAutoRestore : "false"
        
        
        /**
         * 数据存储位置 
         * @type String
         */
        ,isStoreLocal: "true"  
        /**
         * 缓存最大容量，默认100M
         * @type String
         */
        ,maxCapacity: "100"
        
        ,uuid: ""
        
        
        ,onGenUUID: null
        
        /**
         * 组件初始化时，触发的事件
         * @type 
         */
        ,onInit: null
        
        ,onAfter: null
        
        /**
         * 存储数据 ，触发的事件
         * @type 
         */
        ,onStore: null

    }
    ,initialize:function() {
        if (arguments.length > 0) {
        	
        }
    }
    ,initParam: function(initPara) {
        this.htmlOptions(initPara);
        $extend(this.options,jsR.config.swordPageCache||{});
        this.build();
        
        this.initTimeOut();
    }
    ,initData:function(data) {
    }
    ,initTimeOut:function(){
    	if(this.options.isStoreLocal==="true"){
    		setTimeout(this.doStore.bind(this), (this.options.refreshTime/1) * 1000);
    	}
    }
    
    ,build:function(){
    	this.initCacheObj();
    	if(this.cacheObj){
    		this.doGenUUID();
    		if($chk(this.uuid)){
	    		$SwordPageCache = function(){
		    		return this;
		    	}.bind(this)();
	    		this.initCollectInfoCache();
		    	
		    	this.fireEvent("onInit");
		    
		    	pc.getPageInit().addEvent("onAfter",this.doPageInitAfter.delay(this.options.delayTime/1,this));
    		}
    	}
    }
    
	,getUUID: function(){
		return this.uuid;
	}
    ,doStore: function(){
    	try{
	    	var obj = this.getPageData();
	    	this.set(this.constant.cache,obj);
	    	
	    	this.fireEvent("onStore",obj);
    	}catch(e){}
    	this.initTimeOut();
    }
    
    ,doPageInitAfter:function(){
    	var cacheData = this.get(this.constant.cache);
    	
    	if(this.options.isAutoRestore==="true"){
	    	
	    	if(cacheData){
	    		this.loadCacheData(cacheData);
	    	}
    	}else{
    		this.fireEvent("onAfter",cacheData);
    	}
    }
    
    
     ,loadCacheData:function(cacheData){
    	if(cacheData){
    		var swordPageData = cacheData[this.constant.sword];
	    	if(swordPageData){
		    	var param = {'dataObj':swordPageData };
			    pc.loadData(param);
	    	}
	    	var jsVariable = cacheData[this.constant.js];
	    	
	    	if(jsVariable){
	    		var has = $H(jsVariable);
	    		has.each(function(value,key){
	    			window[key] = value;
	    		});
	    	}
    	}
    }
    
    /**
     * 获取缓存数据
     */
    ,getCacheData:function(){
    	return this.get(this.constant.cache);
    }
    /**
     * 获取页面数据
     * @return {}
     */
    ,getPageData:function(){
    	var swordPageData = this.getSwordPageData();
    	var jsVariable = this.getJsVariable();
    	var obj = {};
    	obj[this.constant.sword] = swordPageData;
    	obj[this.constant.js] =jsVariable;
    	return obj;
    }
    
    ,initCacheObj: function(){
    	
    	this.cacheObj = this.getTopWin().$swfcacheobject;
    	
    }
    ,initCollectInfoCache:function(){
    	var cacheInfo = this.cacheObj.get(this.collectInfoKey);
    	if(!cacheInfo){
    		this.cacheObj.set(this.collectInfoKey,"{}");
    	}
    	
    }
    /**
     * 获取js全局变量
     */
    ,getJsVariable: function(){
    	var jsVariable ={};
    	for(var i=0;i<this.jsVariableScope.length;i++){
    		var key = this.jsVariableScope[i];
    		var val = window[key];
    		if(val){
    			jsVariable[key] = val;
    		}
    	}
    	return jsVariable;
    }
	/**
	 * 获取sword组件数据
	 * @return {}
	 */
    ,getSwordPageData: function(){
    	var dataContainer = [];
    	var swordPageData = {};
		pc.widgets.each(function(item, index) {
    		var swordName = item['name'];
    		var data;
    		if($chk(swordName)){
    			var widgetName = item.options.name;
	            if( swordName=="SwordForm"){
	            	
	            	data = $w(widgetName).getSubmitData();
	            }else if(swordName=="SwordGrid"){
	            	
	            	data = $w(widgetName).getAllGridData();
	            }
	            dataContainer.push(data);
    		}
        });
        swordPageData = {"data" : dataContainer};
        return swordPageData;
    }

    ,set:function(key,value){
    	if(this.cacheObj){
			var dataStr = this.cacheObj.get(this.uuid);
			var obj;
			try{
				if(dataStr && dataStr!="null"){
					obj = JSON.decode(dataStr);
					
				}else{
					obj = {};
				}
				obj[key] = value;
				dataStr = JSON.encode(obj);
				var size = dataStr.length ;
				var cacheInfo = JSON.decode(this.cacheObj.get(this.collectInfoKey));
				if(!cacheInfo){
					cacheInfo = {};
				}
				cacheInfo[this.uuid] = {"size":size};
				this.cacheObj.set(this.collectInfoKey,JSON.encode(cacheInfo));
				
				this.cacheObj.set(this.uuid,dataStr);
				
			}catch(e){}
    	}
    }
    

    ,get:function(key){
    	var res;
    	if(this.cacheObj){
			var obj = this.cacheObj.get(this.uuid);
			
			if(obj && obj!="null"){
				res = JSON.decode(obj)[key];
			}
    	}
		return res;
    }
    
    ,remove:function(){
    	
    }
    
    ,doGenUUID:function(){
    	
		var url = window.location.href.replace(/:/g, "").replace(/\//g, "");
		var idx = url.indexOf("?");
		var res;
		var tpUUID = this.options.uuid.replace(/:/g, "").replace(/\//g, "");
		
		if(idx>0){
			res = url.substring(0,idx);
			var suf = url.substring(idx+1,url.length).split("&");
			var len = suf.length;
			if(len>0){
				for(var i=0;i<suf.length;i++){
					
					var pf = suf[i].split("=");
					if(pf.length>1 && this.uuidSign.indexOf(pf[0])>-1){
						res+= "_"+pf[0]+"_"+pf[1];
					}
				}
				
			}
			
		}else{
			res = url;
		}
		
		var og="";
		if($chk(this.options.onGenUUID)){
			og = this.$events["genUUID"][0].create({'bind': this})();
		}
		if(typeof this.genUUIDTemplate == "function"){
			og+= this.genUUIDTemplate();
		}
		this.uuid = res+"_"+tpUUID+og;
    }
    
    ,genUUIDTemplate:null

    ,clear:function(){
    	if(this.cacheObj){
			this.cacheObj.remove(this.uuid);
			var cacheInfo = JSON.decode(this.cacheObj.get(this.collectInfoKey));
			if(cacheInfo){
				delete cacheInfo[this.uuid];
			}
    	}
		
    }

    /**
     * 需要考虑window.open 的场景
     * @return {}
     */
    ,getTopWin:function(){
    	var win ;
	    win = window.top
	    return win;
    }
});


