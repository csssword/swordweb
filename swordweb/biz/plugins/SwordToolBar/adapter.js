/******************************
 * SwordToolBar用户配置
 * 此类用于用户自定义配置默认按钮，按纽事件
 * 组件关联，组件关联响应事件。
 * 
 * @author wjl
 * 
 *****************************/

SwordToolBar.implement( {
	
	/**
	 * 用户开发提示开关
	 */
	alarm : false,
	
	/**
	 * 用户创建默认按钮对象
	 * 按照如下方式进行填写。
	 * 
	 * buttonName : {
	 * 		"captioin" : "按钮显示文字",
	 * 		"pclass" : "按钮class样式，命名解析规则为：按钮名称+状态，比如
	 * 					名为new的按钮，那么它的实际样式为new_enabled或者new_disabled
	 * 					此样式定义在default.css里面。",
	 * 		"enable" : "默认状态，当为true的时候，状态为可用，false的时候为置灰，将不
	 * 					注册按钮事件。"
	 * }
	 * 
	 */
	items : {
	// "firstPage" : {
	// "caption" : "首页",
	// "pclass" : "firstPage",
	// "enable" : "true"
	// }
	},

	/**
	 * 用户创建按钮与组件关联事件
	 * 填写方式：
	 * 
	 * "事件名称" : {
	 * 		"组件类型" : {
	 * 				"按钮名称" : 事件function
	 * 		}
	 * }
	 */
	buttonEvents : {
	// "onClick" : {
	// "SwordGrid" : {
	// "firstPage" : function(wighetName) {
	// var w = $w(wighetName);
	// w.loadPage(1);
	// this.initStatus(this);
	// }
	},

	/**
	 * 此接口用于当SwordToolBar初始化完成以后执行的事件。
	 * 根据需求进行配置，可以在用例页面直接重写此方法。
	 * $w('test').onAfterInit = function(){
	 * 		alert();
	 * }
	 * 此接口可以使用初始化组件代替。
	 */
//	 onAfterInit : function() {
//		this.setHide('new');
//	},

	/**
	 * SwordGrid组件多选框点击事件配置
	 * SwordToolbar会对所有组件注册checkBox的点击事件。
	 * 以下对象仅仅为事例，具体实现根据业务需求操作。
	 * 高级操作可以在业务页面直接重写此对象。
	 */
	gridMuiltCheck : function(allCheckBox) {
		this.muiltCheckClick(this,allCheckBox);
	},

	/**
	 * 表格行点击响应事件
	 * 参数说明：
	 * obj：SwordToolBar对象
	 * wn: SwordToolBar关联表格名称
	 * data: 单击表格行数据
	 * row: 点击表格行
	 * e: 点击表格行事件
	 */
	rowClick : function(obj, wn, data, row, e) {
		obj.defaultGridCheckAction(wn,obj);
	},
	
	allCheckClick:function(obj,wn,check,el){
		if(!$chk(el))el = $w(wn).getHeaderCheckboxByName(obj.associate['SwordGrid'][wn].muiltCheckName);
		if(el.checked){
			obj.setEnabled('delete');
		}else{
			obj.setDisabled('delete');
		}
		obj.setDisabled('edit');
		obj.setDisabled('open');
	},
	
	muiltCheckClick : function(obj,allCheckBox) {
		if (allCheckBox.checked) {
			this.defaultGridMuiltCheckAction(obj);
		} else if(!allCheckBox.checked){
			obj.setDisabled('delete');
		}
	},
	
	defaultGridMuiltCheckAction:function(obj){
		obj.setDisabled('open');
		obj.setDisabled('edit');
		obj.setEnabled('delete');
	},
	
	defaultGridCheckAction : function(wn,obj) {
		var checkName = obj.associate['SwordGrid'][wn].muiltCheckName;
		var w = $w(wn);
		if ($chk(w)) {
			var checkRow = w.getCheckedRowData(checkName);
			if (checkRow.length < 1) {
				obj.setDisabled('open');
				obj.setDisabled('edit');
				obj.setDisabled('delete');
			} else if (checkRow.length == 1) {
				obj.setEnabled('open');
				obj.setEnabled('delete');
				obj.setEnabled('edit');
			} else if (checkRow.length > 1) {
				obj.setDisabled('open');
				obj.setDisabled('edit');
				obj.setEnabled('delete');
			}
		}
	}
});