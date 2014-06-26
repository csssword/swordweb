/**
 * SwordGrid列属性的模板描述
 * 
 */

var SwordGridFields = new Class({
	
	Implements:[Options]

	,name : "SwordGridFields"
		
	,options:{
		gridObj:null//容器
	}
	,Fields:{
		////各类型对外提供属性
		a:{
			name:""
			,caption:""
			,x:""
			,type:'a'
			,show:""
			,style:""
			,onClick:""
		},
		button:{
			name:""
			,caption:""
			,x:""
			,type:'button'
			,show:""
			,style:""
			,onClick:""
		}
		,label:{
			format:""
			,caption:""
			,show:""
			,rule:""
			,x:""
			,type:'label'
			,name:""
			,style:""
		}
		,text:{
			format:""
			,caption:""
			,show:""
			,disable:""
			,rule:""
			,x:""
			,type:'text'
			,name:""
			,style:""
			,msg:""
			,maxlength:""
			,onEnterPress:""
			,tipTitle:""
		}
		,password:{
			caption:""
			,show:""
			,disable:""
			,rule:""
			,x:""
			,type:'text'
			,name:""
			,style:""
			,msg:""
			,maxlength:""
			,onEnterPress:""
			,tipTitle:""
		}
		,rowNum:{
			caption:""
			,show:""
			,x:""
			,type:'rowNum'
			,name:""
			,style:""
		}
		,rowNumOnePage:{
			caption:""
			,show:""
			,x:""
			,type:'rowNumOnePage'
			,name:""
			,style:""
		}
		,checkbox:{
			caption:""
			,disable:""
			,x:""
			,type:'checkbox'
			,name:""
			,style:""
		}
		,date:{
			defValue:""
			,submitDateformat:""
			,dataformat:""
			,showCurDate:""
			,edit:""
			,caption:""
			,show:""
			,disable:""
			,rule:""
			,x:""
			,type:'date'
			,name:""
			,style:""
			,msg:""
		}
		,select:{
			 	name : "",//组件name
	            type : "",
	            lines :10,//显示的最大行数
	            height:21,//显示行的高度
	            rule : "",//校验规则
	            parent:"",//父选项名字
	            child: "",//子选项名字
	            dataName:"",//指定数据集名称
	            pcode:"",//制定根节点的父亲节点的值是多少
	            defValue:"",//默认选中值
	            defIndex:"",//默认选中索引
	            onChange : $empty,//当选择框发生改变
	            onSelect : $empty,//选择时
	            onShow   : $empty,//下拉列表显示时
	            onHide   : $empty,//下拉列表隐藏时
	            dataFilter:""
	            ,onSubmitBefore   : $empty,//点击才装载数据之前触发
	            disable:"",
	            sbmitcontent:""
	            ,displayCode:'false'//是否同时显示code和caption
	            ,inputdisplay:""
	            ,popdisplay:""
	            ,edit:'true'
	            ,handInput:'false'
	            ,addAllItem:'false'
	            ,allItemCode:''
	            ,allItemCap:''
	            ,show:""
	            ,x:""
	            ,caption:""
	            ,msg:""
	            ,style:""
		}
		,pulltree:{
		 	name : ""//组件name
		 	,show:""
		 	,disable:""
		 	,rule : ""//校验规则
		 	,treeName:""
		 	,x:""
		    ,caption:""
		    ,style:""
		    ,type:"pulltree"
		    ,checkbox:""
		    ,selectrule:""
		    ,selectRealKey:""
		    ,filterSign:""
		    ,ltid:""  //懒加载服务
		    ,lctrl:""//懒加载服务
		    ,qtid:""//查询服务
			,qctrl:""//查询载服务
			,height:""
			,selReadOnly:""
			,onClickBefore:$empty
			,onNodeClickBefore:$empty
			,onSelectChange:$empty
			,onSelectShow:$empty
			,onSelectHide:$empty
			,onFinish:$empty
			,onQtidBefore:$empty
			,search:"false"
	    	,cacheName:null
	    	,searchLength:"1"
	    	,searchTime:"0.5"
	    	,searchInputWidth:"160px"
	    	,isSearchByCode:"true"
	    	,maxHeight:"305px"
	    	,handInput:"false"
	    	,cascadeSign:""
	    	,echoExtend:""
		}
		,userdefine:{
			name:""
			,type:"userdefine"
			,show:""
			,disable:""
		}
	}
		
	,initialize : function(options) {
		this.setOptions(options);
		if(!this.options.gridObj)throw new Error("SwordGridRender 初始化必须要传入 gridObj");
		this.g=this.options.gridObj;
		this._showDataHandlers={//定义特殊数据处理器
			'a':this._aHtmlHandler.bind(this)
			,'label':this._labelHtmlHandler.bind(this)
			,'text':this._textHtmlHandler.bind(this)
			,'password':this._passwordHtmlHandler.bind(this)
			,'textarea':this._textHtmlHandler.bind(this)
			,'rowNum':this._rowNumHtmlHandler.bind(this)
			,'rowNumOnePage':this._rowNumOnePageHtmlHandler.bind(this)
			,'checkbox':this._checkboxHtmlHandler.bind(this)
			,'radio':this._checkboxHtmlHandler.bind(this)//
			,'date':this._dateHtmlHandler.bind(this)
			,'select':this._selectHtmlHandler.bind(this)
			,'pulltree':this._pulltreeHtmlHandler.bind(this)
			,'userdefine':this._userdefineHtmlHandler.bind(this)
		};
	
	}
	,render:function (items,formats) {
		var row=[];
		items.each(function(item){
			var type = item.get('type');
			if(item.getAttribute('show') == 'false') {//隐藏列
				item.setStyle('display', 'none');
	        }
			if(item.getAttribute('format')){
				formats.set(item.getAttribute('name'),item.getAttribute('format'));
			}
			row.push(this._findFieldHandler(type)(item,type));
		},this);
		return row.join("");
    }
	,_findFieldHandler:function(type){
		if(!$chk(type))type = 'label';
		var typeElStr=this._showDataHandlers[type];
		if(typeElStr){
			return typeElStr;
		}else{
			throw new Error("_findFieldHandler 未知的列类型定义");
		}
	}
	,_aHtmlHandler:function(item){
		var field = this.findFieldOptions('a');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
		
		//可在字符串添加内部属性 或全局属性
        return ' <div datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_a " '+attrs.join("")+'  $${_|dataHandler,"'+field.type+'","'+field.name+'"}';
	}
	,_labelHtmlHandler:function(item){
		var field = this.findFieldOptions('label');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
		
		//可在字符串添加内部属性 或全局属性
        return ' <div datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_label " '+attrs.join("")+'  $${_|dataHandler,"'+field.type+'","'+field.name+'"}';
	}
	,_textHtmlHandler:function(item){
		var field = this.findFieldOptions('text');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div eventdele="text" datael="true"  class="sGrid_data_row_item_div sGrid_data_row_item_text "  '+attrs.join("")+'  $${_|dataHandler,"'+field.type+'","'+field.name+'"}';
	}
	,_passwordHtmlHandler:function(item){
		var field = this.findFieldOptions('password');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div eventdele="text" datael="true"  class="sGrid_data_row_item_div sGrid_data_row_item_password "  '+attrs.join("")+'  $${_|dataHandler,"'+field.type+'","'+field.name+'"}';
	
	}
	,_rowNumHtmlHandler:function(item){
		var field = this.findFieldOptions('rowNum');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div  datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_rowNum "  "'+attrs.join("")+'  $${_|dataHandler,"'+field.type+'"}';
	}
	,_rowNumOnePageHtmlHandler:function(item){
		var field = this.findFieldOptions('rowNumOnePage');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div  datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_rowNumOnePage "  "'+attrs.join("")+'  $${_|dataHandler,"'+field.type+'"}';
	}
	,_checkboxHtmlHandler:function(item){
		var field = this.findFieldOptions('checkbox');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
		var disabled = "";
		if(field.disable == "true"){
			disabled = "disabled";
		}
		if(item.get('type') == 'radio'){
	        return '<div eventdele="checkbox" datael="true"  class="sGrid_data_row_item_div "'+attrs.join("")+ ' ><input type="'+field.type+'" name="'+field.name+'"  '+disabled+'   class="sGrid_data_row_item_checkbox"  $${_|dataHandler,"'+field.type+'","'+field.name+'","'+userClicked+'","'+checkAllFlag+'"}';
		}else{
			var userClicked = item.get('userClicked')||"";
	    	var checkAllFlag = item.get('checkAllFlag')||"";
	        return '<div eventdele="checkbox" datael="true"  class="sGrid_data_row_item_div "'+attrs.join("")+ ' ><input type="'+field.type+'" name="'+field.name+'"  '+disabled+'   class="sGrid_data_row_item_checkbox"  $${_|dataHandler,"'+field.type+'","'+field.name+'","'+userClicked+'","'+checkAllFlag+'"}';
		}
	}
	,_dateHtmlHandler:function(item){
		var field = this.findFieldOptions('date');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div datael="true"  eventdele="date" class="sGrid_data_row_item_div sGrid_data_row_item_date   "'+attrs.join("")+  '  $${_|dataHandler,"'+field.type+'","'+field.name+'","'+field.dataformat+'","'+field.defValue+'","'+field.showCurDate+'","'+field.submitDateformat+'"}';
	}
	,_selectHtmlHandler:function(item){
		var field = this.findFieldOptions('select');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div datael="true" eventdele="select" class="sGrid_data_row_item_div sGrid_data_row_item_select  "'+attrs.join("")+ '  $${_|dataHandler,"'+field.type+'","'+field.defValue+'","'+field.defIndex+'","'+field.parent+'","'+field.name+'","'+field.dataName+'"}';
	}
	,_pulltreeHtmlHandler:function(item){
		var field = this.findFieldOptions('pulltree');
		var attrs = this.copeHtmlOptions(field,item);
		var treename=field.treeName||field.treename;
		if(treename){
			if($w(treename).options.pNode.get("treeType")=="1"){
				field.checkbox="true";
			}
		}
		///可添加其他属性，可以是其他属性判断后添加的
        return '<div datael="true" eventdele="pulltree" select="true" class="sGrid_data_row_item_div sGrid_data_row_item_pulltree"  '+attrs.join("")+ '  $${_|dataHandler,"'+field.type+'","'+field.name+'","'+field.treeName+'","'+field.checkbox+'"}';
	}
	,_userdefineHtmlHandler:function(item){
		var field = this.findFieldOptions('userdefine');
		var attrs = this.copeHtmlOptions(field,item);
		///可添加其他属性，可以是其他属性判断后添加的
		if(item.get("disable")=="true"){item.getElements("input").each(function(item){item.set("disabled","true");});}
		var json = {value: item.innerHTML.replace(/[\n,\t]/g,"")};
		var escape_tpl='${value}';
		var htmlStr=juicer(escape_tpl, json); 
		if(item.get("show")=="false"){attrs.push("style=\"display:none\"");}
        return '<div datael="true" eventdele="userdefine" class="sGrid_data_row_item_div sGrid_data_row_item_userdefine"  '+attrs.join("")+ '  $${_|dataHandler,"'+field.type+'","'+field.name+'","'+htmlStr+'"}';
	}
	,findFieldOptions:function (type) {
		var field = this.Fields[type];
        return JSON.decode(JSON.encode(field));
    }
	,copeHtmlOptions:function (field,htmlNode) {
		 	var attrs = [];
	        for (var key in (field || {})) {
	            var v = htmlNode.get(key)||htmlNode.getAttribute(key);
	            field[key] = ($chk(v) && $defined(v)) ? v : field[key];
	            if($chk(field[key])){
	            	attrs.push(key+'="'+field[key]+'"  ');
	            }
	        }
	        return attrs;
	   }
});
