/**
 * SwordGrid的模板描述
 */

var SwordGrid_Template = {
		
	'div_end' : '</div>',
	'row_dan' : '<div status="{status}" class="sGrid_data_row_div sGrid_data_row_div_dan  <tpl if="values.get(\'status\')==\'delete\'">sGrid_data_row_delete_div</tpl> " row="true" rowNum="{rowNum}" pagenum="{pagenum}">',
	'row_shuang' : '<div status="{status}" class="sGrid_data_row_div sGrid_data_row_div_shuang <tpl if="values.get(\'status\')==\'delete\'">sGrid_data_row_delete_div</tpl>" row="true"  rowNum="{rowNum}" pagenum="{pagenum}">',
	'row_tree' : '<div status="{status}" class="sGrid_data_row_div <tpl if="values.get(\'status\')==\'delete\'">sGrid_data_row_delete_div</tpl>" row="true" rowNum="{rowNum}"  pagenum="{pagenum}">',
	'act' : '<div format="{format}" rule="{rule}" x="{x}" act="{act}" caption="{caption}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> name="{name}" buttonel="true" class="sGrid_data_row_item_div sGrid_data_row_itemdiv_button <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')">sGrid_data_row_itemdiv_button_disabled</tpl>" style="width: {x};" eventdele="act">{caption}</div>',
	'act_a' : '<div format="{format}"   rule="{rule}" type="a" x="{x}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> act="{act}" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_a" style="width: {x}; " eventdele="act">{value}</div>',

	'label' : '<div format="{format}" <tpl if="values.get(\'isshow\')==\'false\'"> show="false" </tpl> <tpl if="!values.get(\'isshow\') || values.get(\'isshow\')!=\'false\'"> show="{show}" </tpl> disable="{disable}" rule="{rule}" class="sGrid_data_row_item_div sGrid_data_row_item_label <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')">sGrid_data_row_itemdiv_button_disabled</tpl>" type="label" datael="true" x="{x}"  caption="{caption}"  name="{name}"   style="{TemplateStyle}" realvalue="{realvalue}" title="{title}"  code="{code}">{value}</div>',
	'a' : '<div format="{format}" show="{show}"  <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}" title="{title}" realvalue="{title}" style="{TemplateStyle}" class="sGrid_data_row_item_div <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_item_label sGrid_data_row_itemdiv_disabled</tpl><tpl if="values.get(\'disable\')!=\'true\' && !values.get(\'disabled\')"> sGrid_data_row_item_a </tpl>" datael="true" name="{name}" caption="{caption}" type="a" x="{x}">{value}</div>',
	'button' : '<div format="{format}" show="{show}"   <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}" x="{x}" type="button" caption="{caption}" name="{name}" buttonel="true" class="sGrid_data_row_item_div sGrid_data_row_itemdiv_button <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')">sGrid_data_row_itemdiv_button_disabled</tpl>" style="{TemplateStyle}">{caption}</div>',
	'checkbox' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}" x="{x}" type="checkbox" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" userclicked="{userClicked}" checkallflag="{checkallflag}"><input type="checkbox" name="{name}" value="{value}" <tpl if="values.get(\'disable\')==\'true\' || values.get(\'disabled\')==\'true\'"> disabled=true </tpl> class="sGrid_data_row_item_checkbox" eventdele="checkbox" <tpl if="values.get(\'checked\')==true"> checked </tpl> ></div>',
	'date' : '<div format="{format}" edit="{edit}" show="{show}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl>  rule="{rule}" x="{x}" type="date" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_date  <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl> " style="{TemplateStyle}" eventdele="date" realvalue="{realvalue}" title="{title}" showvalue="{showvalue}" msg="{msg}">{value}</div>',
	'file2' : '<div format="{format}" show="{show}"  <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}" x="{x}" type="file2" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_div_file2 <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="file2"><div name="tmp" class="sword_file_upload2"> <ul name="up-list" class="up-list"><li id="file-id" class="file"><span class="file-title">{filename}</span></li></ul></div></div>',
	'password' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}"  x="{x}" type="password" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_password <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="text" title="{title}" realvalue="{realvalue}" showvalue="{showvalue}">{value}</div>',
	'pulltree' : '<div format="{format}" show="{show}"  <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}" treename="{treename}" x="{x}" type="pulltree" caption="{caption}" dataname="{dataname}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_pulltree <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="pulltree" title="{title}" realvalue="{realvalue}" msg="{msg}">{value}</div>',	
	'radio' : '<div format="{format}" show="{show}"  <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl>   rule="{rule}" x="{x}" type="radio" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}"><input type="radio" name="{name}" value="{value}" <tpl if="values.get(\'disable\')==\'true\' || values.get(\'disabled\')==\'true\'"> disabled=true </tpl> class="sGrid_data_row_item_checkbox" eventdele="checkbox" <tpl if="values.get(\'checked\')==true"> checked </tpl>></div>',
	'rowNum' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl> rule="{rule}"  x="{x}" type="rowNum" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_rowNum <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" ></div>',
	'rowNumOnePage' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> disable="true" </tpl>  rule="{rule}"  x="{x}" type="rowNumOnePage" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_rowNumOnePage <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}"></div>',
	'select' : '<div format="{format}" edit="{edit}" show="{show}" <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl>  rule="{rule}"  x="{x}" type="select" caption="{caption}" dataname="{dataname}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_select <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="select" title="{title}" code="{code}" realvalue="{realvalue}" parent="{parent}" msg="{msg}">{value}</div>',
	'text' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl>    rule="{rule}" x="{x}" type="text" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_text <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="text" title="{title}" realvalue="{realvalue}" showvalue="{showvalue}" ondblclick="{ondblclick}" onmousedown="{onmousedown}" msg="{msg}">{value}</div>',
	'textarea' : '<div format="{format}"  show="{show}" <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl>  rule="{rule}" x="{x}" type="textarea" caption="{caption}" name="{name}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_textarea <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>" style="{TemplateStyle}" eventdele="text" title="{title}" realvalue="{realvalue}" showvalue="{showvalue}">{value}</div>',
	'userdefine' : '<div format="{format}" show="{show}" <tpl if="values.get(\'disable\')==\'true\'|| values.getAttribute(\'disabled\')"> disable="true" </tpl>   rule="{rule}" x="{x}" type="userdefine" caption="{caption}" name="{name}" style="{TemplateStyle}" datael="true" class="sGrid_data_row_item_div sGrid_data_row_item_userdefine <tpl if="values.get(\'disable\')==\'true\' || values.getAttribute(\'disabled\')"> sGrid_data_row_itemdiv_disabled </tpl>">{html}</div>',
	'hidden':'<div class="sGrid_data_row_item_div sGrid_data_row_item_hidden" show="false" type="hidden" caption="{caption}" name="{name}" datael="true" style="width: {x}; display: none;" title="{title}" realvalue="{realvalue}" showvalue="{showvalue}">{value}</div>'
};



var SwordGridRender = new Class({
	
	Implements:[Options]

	,name : "SwordGridRender"
		
	,options:{
		gridObj:null//容器
	}
	
		
	,initialize : function(options) {
		this.setOptions(options);
		if(!this.options.gridObj)throw new Error("SwordGridRender 初始化必须要传入 gridObj");
		this.g=this.options.gridObj;
	}
	
	,render:function (datas,items) {
    	if(!items)items=this.options.items;
    	
    	var h=[];
    	datas.each(function(rowData,i){
    		
    		h.extend(this._createRow( rowData, items,i+1));
    		
    	},this);
    	var rowsFragment= this._toFragment(h.join(""));
    	this._renderAfter($$(rowsFragment.childNodes), datas,items);
    	return rowsFragment;
    }
	
	,renderRow:function(rowData, items,rowNum, status){
		var h=this._createRow(rowData, items,rowNum,status);
		var row= new Element('div',{
			'html':h
		}).getFirst();
				
		this._renderAfter([row], [rowData],items);

		return row;
	}
	
	
	//私有开始。。。。。。。。
	
	,_toFragment:function(html){
		var div = new Element('div',{'html':html}),
        fragment = document.createDocumentFragment();
        //todo 11.28 eachFromLast--->each
	    div.getChildren().each(function(row){
	    	fragment.appendChild(row);
	    });

	    
	    return fragment;
	}
	
	,_createRow:function( rowData, items,rowNum, status){
		this.g.addGV(rowData);
		this.g.fireEvent('onBeforeCreateRow', [rowData,items]);
		var h=[];
		h.push(this._createRowDiv(rowNum,rowData,status));
		h.push(this._createOneRowCells(items,rowData));
		h.push(this._getTemplate('div_end'));
		return h;
	}
	
	,_createOneRowCells:function(items,rowData){
		
		var row=[];
		items.each(function(item){
			
			row.push(this._createCell(this._dealItem(item),rowData));
			
		},this);
		return row.join("");
	}
	
	,_dealItem:function(item){
		if(item.get('_renderDeal')!='true'){
			item.set('_renderDeal','true');
			
			var x=item.get('x');
			if(x){
				if(!x.contains('px')&&!x.contains('%')){
					x+='px';
					item.set('x',x);
				}
			}
		}
		
		return item;
	}
	
	,_createCell:function(item,rowData){
		var d=this._dealCellData(item,this._getCellData(item,rowData),rowData);
		return STemplateEngine.render(this._findTemplate(item),item,d);
	}
	,_findTemplate:function(item){
		var n=item.get('type');
		if(item.get('act')){
			if(n=="a"){
				n='act_a';
			}else{
				n='act';
			}
		}
		return this._getTemplate(n);
	}
	,_getTemplate:function(name){
		if(!name||name=='lable')name='label';
		return SwordGrid_Template[name];
	}
	,_getCellData:function(item,rowData){
		return rowData.tds[item.get('name')];
	}
	,_createRowDiv:function(rowNum,rowData,status){
		if(!$chk(status)) {//标记这行的状态
			status = rowData['status'];
        } 
		var g=this.g;
		var  n;
		if(g.options.type != 'tree') {//树形表格将不使用此逻辑
            if(rowNum % 2 == 0) { //偶数行
                n='row_shuang';
            } else {//奇数行 singular
            	n='row_dan';
            }
        } else { //tree
        	n='row_tree';
        }
		var row=this._getTemplate(n);
		//todo
		return STemplateEngine.render(row,null,{'rowNum':rowNum, 'pagenum':g.pageNum(),'status':status});
	}
		
	,_dealCellData:function(item,cellData,rowData){
		var r=this._findDataHandler(item)(item,cellData,rowData);
		return r?r:this._getRes();
	}
	
	
	
	,_renderAfter:function(rows,datas,items){
    	var deletedRows=0;
    	rows.each(function(row,i){
    		
    		if(!row.retrieve('rowData')){
    			this._renderRowAfter(row,datas[i]);
    			this._renderCellAfter(datas[i],row,i+1,deletedRows,items);
    			if(row.get('status')=='delete')deletedRows++;
    		}
    		this.g.fireEvent("onAfterCreateRow", [datas[i],row,items,this.g]);
            
    	},this);
    }
    
    ,_renderRowAfter:function(row,rowData){
			row.store('rowData', rowData);//注册行数据
			this.g.addRowApi(row); //添加行接口
    }
    
        
    ,_renderCellAfter:function(dataObj, row,rowIndex,deletedRows,items){
     	row.getChildren().each(function(cell,i){
     		if(cell.get('show') == 'false'||cell.get('x') == '0px') {//隐藏列
            if(Browser.Engine.trident4) {   //ie6
                cell.setStyle('width', 0).setStyle('border', '0px').setStyle('height', 0);
            } else {
                cell.setStyle('display', 'none');
            }
        	}
     		this.g.addCellApi(cell);
     		this.g._addRowNum(cell,rowIndex,deletedRows);
     		this.g.fireEvent("onAfterCreateCell", [dataObj,this._getCellData(cell,dataObj),cell,items[i]]);  
     	},this);
     	
     }

	
	
	,_dataHandlers:null
	,_findDataHandler:function(item){
		var type=item.get('type');
		if(!this._dataHandlers){
			this._dataHandlers={//定义特殊数据处理器
				'button':this._emptyDataHandler.bind(this)
				,'checkbox':this._checkbox_radioDataHandler.bind(this)
				,'radio':this._checkbox_radioDataHandler.bind(this)
				,'date':this._dateDataHandler.bind(this)
				,'file2':this._file2DataHandler.bind(this)
				,'text':this._textDataHandler.bind(this)
				,'hidden':this._textDataHandler.bind(this)
				,'password':this._textDataHandler.bind(this)
				,'textarea':this._textDataHandler.bind(this)
				,'pulltree':this._pulltreeDataHandler.bind(this)
				,'rowNum':this._emptyDataHandler.bind(this)
				,'rowNumOnePage':this._emptyDataHandler.bind(this)
				,'select':this._selectDataHandler.bind(this)
				,'userdefine':this._emptyDataHandler.bind(this)
			};
		}
		
		if(this._dataHandlers[type])return this._dataHandlers[type];
		return this._defalutDataHandler.bind(this);
	}
	
	,_getRes:function(o){//cell默认值定义在此
		var x= this.g.options.itemX;
		if(!(""+x).contains("px")||x.contains('%')){
			x = x+"px";
		}
		var r={'x':x};
		r.extend = function(o){$extend(r,o);};
		if(o)r.extend(o);
		return r;
	}
	
	,_defalutDataHandler:function(item,cellData){
		if(!$chk(cellData))return;
		var r;
		var html=cellData.value;
		if(html)html=(html+"").replace(/&/g, "&amp;");
        var showvalue = html || '';
        if(item.get('format')) {
            showvalue = sword_fmt.convertText(item, showvalue).value;
        }
        
        r=this._getRes({'value':showvalue,'realvalue':html || "",'title':showvalue});

//        if(cellData['code']) {
//        	cellData.code=d['code'];
//        }
        return r;
	}
	
	,_emptyDataHandler:function(){}
	
	,_checkbox_radioDataHandler:function(item,cellData){
		var html="";
		if($chk(cellData)){
			html=cellData.value;
		}
		var itemEl=item;
		var g=this.g;
		
		var check;
        if(g.isCP() && itemEl.get('userClicked') == 'true') {//cache+前台分页+用户点击过表头checkbox
            itemEl.get('checkAllFlag') == 'true' ? check = true : check = false;
        } else if(html == 'true' || html == '1') {
            check = true;
        } else {
            check = false;
        }
        item.set("checked",check);
        var r=this._getRes({'value':html});
        return r;
		
	}
	
	,_dateDataHandler:function(item,cellData){
		if(!($chk(cellData)||$chk(item.get('defValue'))||$chk(item.get('showCurDate'))))return;
		var html=undefined;
		if($chk(cellData))html = cellData.value;	
		var itemEl=item;
		var g=this.g;
		var r;
		
        var sv = g.getCalendar().getShowValue(itemEl, html);
        var _sv = sword_fmt.convertText(itemEl, sv).value;
        r=this._getRes({'realvalue':html,'title':_sv,'showvalue':_sv,'value':_sv});
        if($chk(cellData))cellData.originValue = _sv;
        return r;		

	}
	
	,_file2DataHandler:function(item,cellData){
		if(!$chk(cellData))return;
		var html=cellData.value;	
		var itemEl=item;
		var r;                
	   	var d=this.g.file2_Data(html);
	   	if(d){
//	       	 s='<li class="file" id="file-id"><span class="file-title">'+d.name+'</span></li></ul></div>';
	       	 r=this._getRes({'filename':d.name});
	   	}else{
	   		 var addCaption=itemEl.get('addCaption')||'添加文件';
//	       	 s='</ul><a name="up-attach" style="color: blue; text-decoration: underline; ">'+addCaption+'</a></div>';
	       	 r=this._getRes({'addCaption':addCaption});
	   	}
//	   	 var s1='<div class="sword_file_upload2" name="tmp"> <ul class="up-list" name="up-list">';
	   	 
	   	return r;
	}
	
	,_textDataHandler:function(item,cellData){
		if(!$chk(cellData))return;
		var html=cellData.value;
		var itemEl=item;
		var g=this.g;
		var r;
		
        var convertRes = sword_fmt.convertText(itemEl, html);
        var showvalue = convertRes.value+"";
        if($defined(showvalue) && $type(showvalue) == "string" && (showvalue.indexOf(">") != -1 || showvalue.indexOf("<")) != -1)showvalue = (showvalue.replace(/</g, "&lt;")).replace(/>/g, "&gt;");
        showvalue=showvalue.replace(/&/g, "&amp;");
        
        
        if(itemEl.get('type') == 'password') {
            var pw = g.dealPassword(showvalue);
            r=this._getRes({'value':pw,'title':pw,'pw':pw,'showvalue':pw});
            //todo 
//            el.store('realvalue', convertRes.realvalue);
            r.realvalue=convertRes.realvalue;
        }else{
            r=this._getRes({'value':showvalue,'title':showvalue,'realvalue':convertRes.realvalue,'showvalue':showvalue});
        }
        
        return r;
	}
	
	,_pulltreeDataHandler:function(item,cellData){
		var html;
		if($chk(cellData.code) && $chk(cellData.value)){
			html = "code,"+cellData.code+"|caption,"+cellData.value;
		}else if($chk(cellData.code)){
			html = cellData.code;
		}else{
			html = cellData.value;
		}
		var itemEl=item;
		var g=this.g;
		var r=this._getRes();
		
       
        var treename = itemEl.get('treename');
        var treeObj = $w(treename);
        var dataName=itemEl.get('dataName');

        if(treeObj.inGrid != true) {
            treeObj.inGrid = true;
        }
        if(treeObj.initDataFlag != true) {
            treeObj.initData(pc.getInitDataByDataName(dataName));
            treeObj.initDataFlag = true;
        }


        if($chk(html)) {
            //传入的值为【code,999|caption,自然人】时，不用代码转名称，
            //这样就不用在页面初始化时加载树，减少页面加载压力,在点击时再去加载树的数据,
            //表格下拉树的懒加载方案
            if(html.contains("code") && html.contains("caption")) {
                var vs = html.split('|');
                if(html.contains('codePath')) {
                    //懒加载树的反显路径
                    r.codePath=vs[2].substring('codePath,'.length);
                }
                var text = vs[1].split(',')[1];
                var code = vs[0].split(',')[1];
                
                r.value=text;
                r.title=text;
                r.realvalue=code;
                cellData.value=code;
            } else {
                //只有code值时，需要代码转名称，不推荐这么用
                if(treeObj.gridShow != true) {
                    treeObj.select.show();
                    treeObj.options.pNode.setStyle('display', 'none');
                    treeObj.select.hide();
                    treeObj.gridShow = true;

                    g.addNextFocusEvent(treeObj.select.selBox);
                }

                var caption = '';
                var realvalue = html;
                if(treeObj.options.treeType==1){//checkbox树
                    var cl = treeObj.select.getNodeByRealvalue(realvalue);
                    var l=cl.length;
                    cl.each(function(n,i){
                    	caption=caption+n.get('caption');
                    	if(i<l-1)caption=caption+',';
                    });
                    if(caption=='')caption=realvalue;
                }else{
                    var query = new Hash();
                    query.set(treeObj.options.cascadeSign.id, html);//数据应为code值
                    var node = treeObj.getTreeNode(query);
                    
                    if(node) {
                        caption = node.get('caption');
                        realvalue = node.get(treeObj.options.cascadeSign.id);
                    } else {
                    	node = treeObj.findTreeData(query);
                    	if(node){
                    		caption = node[0]['caption'];
                    		realvalue = node[0][treeObj.options.cascadeSign.id];
                    	}else{
                    		caption = html;
                    	}
                    }
                 
                }

                r.value=caption;
                r.title=caption;
                r.realvalue=realvalue;
            }
        }
		
        
        return r;
	}
	
	
	,_getPcode:function(item,rowData){
		var p=item.get('parent');
		if(p){
			if(rowData.tds[p]){
				return rowData.tds[p].value;
			}
		}
	}	
	,_selectDataHandler:function(item,cellData,rowData){
		if(!($chk(cellData)||$chk(item.get('defValue'))||$chk(item.get('defIndex'))))return;
		var html=undefined;
		if($chk(cellData))html = cellData.value;

		var itemEl=item;
		var sel=this.g.getSelect();
		sel.grid=true;
		var r=this._getRes();
		

        var d = html;
        if(cellData && cellData.lazydata)d = cellData.lazydata;
        var pcode=this._getPcode(item,rowData);
        var tmp = sel.dm2mc(itemEl, d, pcode);
        var code;
        if($type(tmp) == 'object') {  //找到数据了
        	code = tmp['code'];
        	
            r.title=tmp['caption'];
            r.code=tmp['code'];
            r.realvalue=tmp["realvalue"];
            r.value=tmp['caption'];
            
//            r.allDb=JSON.encode(tmp["allDb"]);
            
        } else { //没有数据
            code = html;
            
            r.title=html;
            r.code=html;
            r.realvalue=html;
            r.value=html;
        }

        //使用code作为原始值。。 ,使用realvalue作为value,提交用
        if(cellData){
        	  cellData.originValue = code;
              cellData.value = tmp["realvalue"] || cellData.value;
              if(html && html.contains('|')) {
              	cellData.lazydata = html;
              }
        }
        
        return r;
	}

	
	
});
