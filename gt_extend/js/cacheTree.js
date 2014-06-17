function pullTreeBefore() {
	var ct = $('SwordCacheData');
	if (ct && ct.get('queryTree')) {
		pullTreeBefore_new(ct.get('queryTree'));
	}
	// 以下是原有的方式，之前的代码可以继续使用
	var swordTrees = [];
	swordTrees = $(document.body).getElements("div[pulltreetype]");
	swordTrees.each(function(item, index) {
				var sql = '';
				item.setProperty("rootPcode", "null");
				var type = item.getProperty("pulltreetype").toUpperCase();
				if ([ 'XZQH', 'HYDM' ].contains(type))
					item.setProperty("onCreateNode", "createLeafNode(this,'"
							+ type + "')");
				if (type == "XZQH") {
					sql = "SELECT  a.XZQHSZ_DM AS code,a.XZQHMC AS caption,a.SJXZQHSZ_DM AS pcode FROM DM_GY_XZQH AS a ORDER BY  code";
				} else if (type == "HYDM") {
					sql = "SELECT a.HY_DM AS code,a.HYMC AS caption,a.SJHY_DM AS pcode FROM DM_GY_HY AS a ORDER BY  code";
				}
				cacheResult(sql, item.get('name'));
			});
}
function cacheResult(sql, widgetName, form, cbfunc) {// 没考虑本下级
	var data = null;
	$cache.get(sql, function(result, tableName) {
		if(cbfunc){
			var temp = result, temp2 = [];//eval(result)
			for(var i = 0 ; temp &&  i < temp.length; i++){
				var t = temp[i];
				if((cbfunc)(t))temp2.include(t);
			}
		}else{
			temp2 = result ;//eval(result);
		}
		data = {
			data : temp2,
			name : widgetName,
			"sword" : "SwordTree"
		};
		if (pc.initData == null) {
			pc.initData = {};
		}
		if (pc.initData.data == null) {
			pc.initData.data = [];
		}
		pc.initData.data.include(data);
		if (form) {
			if(form=='false'){
				$w(widgetName).reloadSelectData(data);
			}else
				
				$w(form).getWidget(widgetName).reloadSelectData(data);
		}
	});
	return data;
}
function _$tree_buildSql$_(q, isall){
	var sql = "";
	var bm = null;
	if (!q.MC) {
		if(!bm)bm = q.T.substring(q.T.lastIndexOf('_') + 1);
		q.MC = bm + "MC";
	}
	if (!q.DM) {
		if(!bm)bm = q.T.substring(q.T.lastIndexOf('_') + 1);
		q.DM = bm + "_DM";
	}
	if(!$defined(q.PDM)){
		if(!bm)bm = q.T.substring(q.T.lastIndexOf('_') + 1);
		q.PDM = "SJ"+bm + "_DM";
	}
	sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T";
	if (q.PDM == '')
		sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T";
	sql = sql.substitute(q);
	if (q.W && !isall) {
		sql += " WHERE " + q.W;
	}
	sql +=" ORDER BY  code";
	return sql;
}
function pullTreeBefore_new(querystr) {
	if ($chk(querystr)) {
		var queryObj = JSON.decode(querystr);
		//循环页面定义标签 ，如果不需要延迟加载（即：load != 'lazy'）则批量进行版本比较、加载缓存数据
		queryObj.each(function(q, index) {//load  lazy:懒加载/init：初始化加载	 
			if(q.load != 'lazy'){
				cacheResult(_$tree_buildSql$_(q,false), q.WN);				
			}
		});
	}
}

function cacheTreeNode(tree, element) {// 主要判断是否还有下级节点
	if (!element)
		return;
	extendLeafNode(tree, element);
}
/*
var d = {};
var queryLang;
*/
/*生成query.js所需的结构，初始化SQL*/
/*
function getqueryLang(){
	if (!queryLang){
		 var schema = $H();
		 var schemaVal = $H();	
		 schemaVal.set("code",{type:"String"});
		 schemaVal.set("pcode",{type:"String"});		 
		 schema.set("treedata",schemaVal);
		  queryLang = TrimPath.makeQueryLang(schema);
	}
	 return queryLang;
}*/
function extendLeafNode(tree, element) {// 应该从页面数据上找
	var pcode = element.get('code');
	if ($defined(pcode)) {		
		if(tree.options.cacheLazy=="true"){
			var datas = tree.options.cacheDataStr.data
			for ( var i = 0; i < datas.length; i++) {
				var ddPcode = datas[i].pcode;
				if (ddPcode == pcode) {
					hasc = true;
					break;
				}
			}
		}else{
			var datas = tree.dom.domainData;
			var sip = tree.options.cascadeSign.pid;
			var hasc = false;
			if ($defined(datas) && datas.length > 0) {
				for ( var i = 0; i < datas.length; i++) {
					var ddPcode = (datas[i][sip] || datas[i][sip.toUpperCase()]);
					if (ddPcode == pcode) {
						hasc = true;
						break;
					}
				}
			}		
		}
		element.setProperty("leaftype", hasc ? "0" : "1");
		if (!hasc) {// 没有子节点
			var warpSpan = element.getFirst("span[type='wrapperSpan']");
			var plusSpan = warpSpan.getFirst("span[type='gadGetSpan']");
			plusSpan.removeClass(tree.options.treeStyle.treeGadGetPlus);
			plusSpan.addClass(tree.options.treeStyle.treeGadGetNone);
			var iconSpan = warpSpan.getFirst("span[type='iconSpan']");
			iconSpan.removeClass(tree.options.treeStyle.treeLeafIcon);
			iconSpan.addClass(tree.options.treeStyle.treeCloseIcon);
		}
	}
}
// 给创建的节点加一个事件,用来展开最下级节点
function createLeafNode(tree, treeType, element) {
	var type = treeType.toUpperCase();
	if ([ 'XZQH', 'HYDM' ].contains(type)) {
		extendLeafNode(tree, element);
	}
}

/** *以下是过滤接口** */

function filterBxjTree(treeName,codes,treeType,formName,isExclude,dataTable){
	var dycs = $splat(codes);//定义的code数组
	var dealcs = [];//处理后的code数组
	var qj = null;
	if(treeType=='xzqh'){
		dycs.each(function(code){
			if(code.endWith('0000')){
				dealcs.include(code.substring(0,2));
			}else if(code.endWith('00')){
				dealcs.include(code.substring(0,4));
			}
		});
		qj = {'T':dataTable||'T_DM_GY_XZQH','PDM':'SJXZQHSZ_DM','DM':'XZQHSZ_DM','MC':'XZQHMC','WN':treeName};
	}	
	else if(treeType=='hy'){
		dycs.each(function(code){
			if(code.endWith('    ')){
				dealcs.include(code.substring(0,2));
			}else if(code.endWith('00')){
				dealcs.include(code.substring(0,4));
			}
		});
		qj = {'T':dataTable||'T_DM_GY_HY','PDM':'SJHY_DM','DM':'HY_DM','MC':'HYMC','WN':treeName};
	}
	else if(treeType=='djzclx'){
		dycs.each(function(code){
			if(code.endWith('00')){
				dealcs.include(code.substring(0,1));
			}else if(code.endWith('0')){
				dealcs.include(code.substring(0,2));
			}
		});
		qj = {'T':dataTable||'T_DM_DJ_DJZCLX','PDM':'SJDJZCLX_DM','DM':'DJZCLX_DM','MC':'DJZCLXMC','WN':treeName};
	}
	if(qj){
		var data = queryTreeCallback(qj, function(d){
			var c = d.code+'';
			if(_$dealCondition$_(c,dealcs,isExclude))return true;
		});
		var treeObj = null;
		if($chk(formName))
			treeObj = $w(formName).getWidget(treeName);
		else{
			treeObj = $w(treeName);
		}
		if(treeObj)treeObj.reloadSelectData(data);
		else{
			alert("请检查设置的formName或者treeName是否正确");
		}
	}
	else alert('树的类型定义错误，请检查是否为以下三种[xzqh,hy,djzclx]');
}

function _$dealCondition$_(code,codes,isExclude){
	var con = true;
	if(isExclude)
		codes.each(function(c){
			con = con && !code.startWith(c);
		});
	else{
		con = false;
		codes.each(function(c){
			con = con || code.startWith(c);
		});
	}
	return con;
}

/**
 * 根据回调函数过滤数据
 * 
 * @param qjson
 * @param cbfunc
 */
function queryTreeCallback(qjson, cbfunc, form, rootPcode) {
	if ($chk(qjson)) {
		var sql = _$tree_buildSql$_(qjson);
		if (form) {// 不是表单
			if(form=='false'){
				$w(qjson.WN).options.rootPcode = $chk(rootPcode) ? rootPcode
						: undefined;
			}else
				$w(form).getWidget(qjson.WN).options.rootPcode = $chk(rootPcode) ? rootPcode
					: undefined;
		}
		return cacheResult(sql, qjson.WN, form, cbfunc);
	}
}
/*
 * 过滤查询接口 qjson : json对象，用来匹配sql ;form: 下拉树需要提供form的name来刷新数据; rootPcode
 * 可以不赋值;但是如果过滤后的数据仍然量大，层级多，最好设置rootPcode，也就是根节点的code值 ;benxiaji
 * 根据benxiaji的code值，接口自动加入本下级所有节点
 */
function queryTreeData(qjson, form, rootPcode, benxiaji) {
	if ($chk(qjson)) {
		var sql = "";
		var sqlw = '';
		if (!qjson.MC) {
			var bm = qjson.T.substring(qjson.T.lastIndexOf('_') + 1);
			qjson.MC = bm + "MC";
		}
		if (!qjson.DM) {
			var bm = qjson.T.substring(qjson.T.lastIndexOf('_') + 1);
			qjson.DM = bm + "_DM";
		}
		if (qjson.PDM) {
			sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T"
					.substitute(qjson);
		} else {
			sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T"
					.substitute(qjson);
		}
		sqlw = sql;
		if (qjson.W) {
			sqlw += " WHERE " + qjson.W;
		}
		if (form) {// 不是表单
			if(form=='false'){
				$w(qjson.WN).options.rootPcode = $chk(rootPcode) ? rootPcode
						: undefined;
			}else
				$w(form).getWidget(qjson.WN).options.rootPcode = $chk(rootPcode) ? rootPcode
					: undefined;
		} 
		if (!$chk(benxiaji))
			cacheResult(sqlw, qjson.WN, form);
		else {
			cacheBxjResult(sql, qjson.WN, form, benxiaji);
		}
	}
}

function cacheBxjResult(sql, widgetName, form, benxiaji) {// 本下级的过滤
	$cache.get(sql, function(result, tableName) {
	// var tempArr = JSON.decode(result);
	var tempArr = result;
	var res = [];
	var childOne = new Array();
	var childTow = new Array();
	for ( var i = 0; i < tempArr.length; i++) {
		var ta = tempArr[i];
		if (benxiaji == ta.code) {
			res.include(ta);
			childOne.include(ta.code);
		}
	}
	var i=0;
	while(i<6){
		i++;
		if(childOne.length==0&&childTow.length==0)break;
		if(childOne.length!=0){
			childOne.each(function(el){
				tempArr.each(function(item){
					if (item.pcode == el) {
						res.include(item);
						childTow.include(item.code);
					}
				})
			})
			childOne.empty();
		 
		}else{
			childTow.each(function(el){
				tempArr.each(function(item){
					if (item.pcode == el) {
						res.include(item);
						childOne.include(item.code);
					}
				})
			})
			childTow.empty();
		}
	}
	data = {
	data : res,
	name : widgetName,
	"sword" : "SwordTree"
	};
	if (pc.initData == null) {
		pc.initData = {};
	}
	if (pc.initData.data == null) {
		pc.initData.data = [];
	}
	pc.initData.data.include(data);
	if (form) {
		if(form=='false'){
			$w(widgetName).reloadSelectData(data);
		}else
			$w(form).getWidget(widgetName).reloadSelectData(data);
	}
	});
	}
