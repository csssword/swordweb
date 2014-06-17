function selectBefore(){
	var ct = $('SwordCacheData')||$('SwordPageData');
	if(!ct)return;
	var qs = ct.get('query');
    if(qs){
		var qo = JSON.decode(qs);		
		var paramarr = [];
		//循环页面定义标签 ，如果不需要延迟加载（即：load != 'lazy'）则批量进行版本比较、加载缓存数据
		qo.each(function(q,index){
			if(q.load != 'lazy'){
				var sql = "";
				if (!q.MC){
					var bm = q.T.substring(q.T.lastIndexOf('_')+1);
					q.MC    = bm+"MC";
				}
				if (!q.DM){
					var bm = q.T.substring( q.T.lastIndexOf('_')+1);
					q.DM    = bm+"_DM";
				}
				if (q.PDM){
					sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T".substitute(q);
				}else{
					sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T".substitute(q);
				}
				if(q.W){
					sql += " WHERE "+q.W;
				}
				paramarr.push(sql);
			}
		});
		
		$cache.batchget(paramarr,function(result){
			 result.forEach(function(v,k){
				 var tempdata = $H({"data":[{"data":v,dataName:k,"sword":"SwordSelect"}]});
			    	if(!$chk(pc.initData)){
			    		pc.initData = tempdata;
			    	}else{
			    		pc.initData.data.extend(tempdata.data);
			    	}
			 });			
		});

		/* 原实现方式 开始
		qo.each(function(q,index){
			if(q.load != 'lazy'){//load  lazy:懒加载/init：初始化加载
				var sql = "";
				if (!q.MC){
					var bm = q.T.substring(q.T.lastIndexOf('_')+1);
					q.MC    = bm+"MC";
				}
				if (!q.DM){
					var bm = q.T.substring( q.T.lastIndexOf('_')+1);
					q.DM    = bm+"_DM";
				}
				if (q.PDM){
					sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T".substitute(q);
				}else{
					sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T".substitute(q);
				}
				if(q.W){
					sql += " WHERE "+q.W;
				}				 
	    		$cache.get(sql,function(result,tableName){
    		    	var tempdata = $H({"data":[{"data":eval(result),dataName:tableName,"sword":"SwordSelect"}]});
    		    	if(!$chk(pc.initData)){
    		    		pc.initData = tempdata;
    		    	}else{
    		    		pc.initData.data.extend(tempdata.data);
    		    	}
				});
			}
		});
		原实现方式 结束*/
    }
    // changeSelectData();// 静态数据的级联下拉有问题
}
// 这个方法在initSwordPageData后面加入,其目的是为级联下拉单独定义dataName的属性,yt
function changeSelectData(){
	var tempxiajidataArray = [];
	var tempshangjiName = [];
	var i = 0;
	if(pc.initData == null){
		pc.initData = {};
	}
	if(pc.initData.type=='static')return;// 静态数据的级联下拉有问题,先这么解决
	if(pc.initData.data == null){
		pc.initData.data = [];
	}
	pc.initData.data.each(function(item, index) {// 第一遍遍历将关系遍历出来
        if(item["sword"] == "SwordSelect"){
        	var xiaji = item["dataName"];
        	var shangjiArray = [];
        	findParentSelectName(xiaji,shangjiArray);// 递归找当前页面的shangji节点
        	if(shangjiArray.length != 0){
        		tempshangjiName[i] = shangjiArray;
        		tempxiajidataArray[i] = item["data"];
        		i++;
        	}
        }
    }.bind(this));
	for(i = 0 ; i < tempxiajidataArray.length ; i++){
    	pc.initData.data.each(function(item, index) {// 第二遍进行遍历合并
    		var dataNames = $$("div[name='"+ tempshangjiName[i] + "']");
    		if( dataNames && dataNames.length > 0)
    			var dataName = dataNames[0].get("dataName");
            if(item["sword"] == "SwordSelect" && dataName.contains(item["dataName"])){
            	if(item["collapseNewStatus"] != "true"){
                	item["data"].each(function(item1, index1) {// 将最顶层父亲的pcode置为null
                		item1["pcode"] = null;
                    }.bind(this));
            	}
            	item["data"].extend(tempxiajidataArray[i]);
            	item["collapseNewStatus"] = "true";
            }
        }.bind(this));
	}

}


function findParentSelectName(dataName,shangjiArray){// 返回select的名字数组
	var selectArray = $$("div[dataName='" + dataName + "'][type='select'][parent]");
	if(selectArray.length == 0){
		return null;
	}else{
    	for(var i = 0 ; i < selectArray.length ; i++){
    		var parentName = selectArray[i].getProperty("parent");
    		var returnArray = findParentSelectName(parentName,shangjiArray);// 递归不断向上遍历
    		if(returnArray == null){// 直到找不到
    			shangjiArray.include(parentName);
    			return "";
    		}
    	}
	}
}



function selectDataFalter(sqlObj, backFunc) {
	if($chk(sqlObj)) {
		var sql = "";
		if (!sqlObj.MC) {
			var bm = sqlObj.T.substring(sqlObj.T.lastIndexOf('_')+1);
			sqlObj.MC    = bm+"MC";
		}
		if (!sqlObj.DM) {
			var bm = sqlObj.T.substring( sqlObj.T.lastIndexOf('_')+1);
			sqlObj.DM    = bm+"_DM";
		}
		if (sqlObj.PDM) {
			sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T".substitute(sqlObj);
		} else {
			sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T".substitute(sqlObj);
		}
		if(sqlObj.W) {
			sql += " WHERE "+sqlObj.W;
		}
		$cache.get(sql, function(result,tableName) {
			if(backFunc){
				var temp = result, temp2 = [];
				for(var i = 0 ; temp &&  i < temp.length; i++){
					if((backFunc)(temp[i])){
						temp2[temp2.length] = temp[i];
					}
				}
			}else{
				temp2 = result;
			}
			var tempdata = $H({
				"data":[{
					"data":temp2,
					dataName:tableName,
					"sword":"SwordSelect"
				}]
			});
			
	    	if(!$chk(pc.initData)){
	    		pc.initData = tempdata;
	    	}else{
	    		pc.initData.data.extend(tempdata.data);
	    	}
		});
    	// changeSelectData();
	}
}