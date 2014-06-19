SwordGrid.implement({
	
	initEvents:function(){
    	this.eDelegator=new SwordEventDelegator({'container':this.options.sGrid_div});
    	this.eDelegator.add('click',this.cellClickDele.bind(this),'div.sGrid_data_row_item_div'); //cell click,所有类型都会触发
    	this.eDelegator.add('click',this.textClickDele.bind(this),'div[eventDele=text]'); //cell text click
    	this.eDelegator.add('click',this.dateClickDele.bind(this),'div[eventDele=date]'); //cell date click
    	this.eDelegator.add('click',this.selectClickDele.bind(this),'div[eventDele=select]'); //cell select click
    	this.eDelegator.add('click',this.actClickDele.bind(this),'div[eventDele=act]'); //cell act click
    	this.eDelegator.add('click',this.pulltreeeClickDele.bind(this),'div[eventDele=pulltree]'); //cell pulltree click
    	this.eDelegator.add('click',this.checkboxClickDele.bind(this),'input[eventDele=checkbox]'); //cell checkbox click
    	if(this.options.type=='tree')
    	this.eDelegator.add('click',this.gridtreeClickDele.bind(this),'div[eventDele=gridtree]'); //cell gridtree click
    	this.eDelegator.add('mouseenter',this.file2EnterDele.bind(this),'div[eventDele=file2]');//file2 cell enter

    	
    	
    	this.eDelegator.add('mouseenter',function(e,defEl){defEl.addClass('sGrid_data_row_div_hover')},'div.sGrid_data_row_div');//row hover
    	this.eDelegator.add('mouseleave',function(e,defEl){defEl.removeClass('sGrid_data_row_div_hover')},'div.sGrid_data_row_div'); //row hover
    	this.eDelegator.add('click',this.rowClickDele.bind(this),'div.sGrid_data_row_div'); //row click
    	
    	this.eDelegator.add('dblclick',this.rowDblclickDele.bind(this),'div.sGrid_data_row_div'); //row dblclick
    	this.eDelegator.add('contextmenu',this.rowContextmenuDele.bind(this),'div.sGrid_data_row_div'); //row contextmenu
         
    }

	,file2EnterDele:function(e,defEl){
		if(defEl.get('first'))return;
		defEl.set('first','true');
		
		var el=defEl, 
		type=defEl.get('type'), 
		elName=defEl.get('name'), 
		itemEl=this.getItemElByName(elName)[0],
		rowNum=this.getRowNum(defEl);
		
		var sGrid_data_row_div=this.getRow(el);
        var dataObj=this.getOneRowData(sGrid_data_row_div);
        var html = dataObj.tds[elName];
        if(html)html = html['value'];	
        
		el.getElement('div[name=tmp]').destroy();
		this.lazyInitFile2(itemEl,el,html,dataObj);
		
	}

	,gridtreeClickDele:function(e,defEl){	
		var cell=defEl.getParent();
		this.treeClick(cell, e);
        this.scrollHeader();
	}

	,checkboxClickDele:function(e,defEl){
		var el=defEl, 
		elName=defEl.get('name'), 
		itemEl=this.getItemElByName(elName)[0];
		
		if(itemEl.get('data') == 'true') {//当checkbox是一个数据的时候才注册更新数据的操作
			if(type=='radio'){
            	this.radioSetChecked(el.getParent());
        	}else{
        		this.updateCell(el.getParent(), el.get('checked') ? '1' : '0');
        	}
        }
				
		this.rowCheckValidator(defEl);
		
	}
	
	,rowCheckValidator:function(el){
		if(this.options.rowCheckValidator != false && this.options.rowCheckValidator != "false") {
            var element =el;
            //如果是取消checkbox选中，则不做处理。
            if("checkbox" == element.get("type") && !element.get("checked")) {
                return;
            }

            var checkedRows = this.getCheckedRow(element.get("name"));
            if(checkedRows == null)
                return;//没选中,则不校验
            if($type(checkedRows) != 'array') checkedRows = [checkedRows];
            this.validate(false,checkedRows);
    }
	}


	,cellClickDele:function(e,defEl){
		var el=defEl, 
		elName=defEl.get('name'), 
		itemEl=this.getItemElByName(elName)[0];
		if(el.get('disable') == 'true' || el.get('disabled')==true)return;
		if(!itemEl.get('_onClick'))return;
        if(itemEl.get("type")!='text')this.getFunc(itemEl.get('_onClick'))[0](this.getOneRowData(el), this.getRow(el), el);
		
	}
	
    ,pulltreeeClickDele:function(e,defEl){
    	var el=defEl, 
    	type=defEl.get('type'), 
    	elName=defEl.get('name'), 
    	itemEl=this.getItemElByName(elName)[0],
    	rowNum=this.getRowNum(defEl);
    	
    	var treename = itemEl.get('treename');
        var treeObj = $w(treename);
        
        
        
        if(treeObj.gridAddEvent != true) { //注册事件
            var eventTarget = treeObj.select ? treeObj.select : treeObj;
            eventTarget.addEvent('onSelectHide', function(input) {
                var cell = input.getParent('.sGrid_data_row_item_pulltree');
                treeObj.select.selBox.store('lastCell', cell);
                treeObj.options.pNode.inject(document.body);
                treeObj.options.pNode.setStyle('display', 'none');

                if(!cell)return;
                cell.set('html', '');
                var realvalue = input.get('realvalue');
                var caption = input.get('value');
                cell.set('realvalue', realvalue);

                this.updateCell(cell, realvalue, caption, true);

                input.set('value', '');
                input.set('realvalue', '');

                if(cell.get('rule')) {//执行校验
                    if(!this.vObj.doValidate(cell).state) {//校验没有通过
                        this.addError(this.getRow(cell).get('rowNum'), cell.get('name'));
                    } else {
                        this.removeError(this.getRow(cell).get('rowNum'), cell.get('name'));
                    }
                }

            }.bind(this))

            treeObj.gridAddEvent = true;
        }
        

               
        if(el.get('disable') == 'true'||el.get('disabled')==true)return;
        treeObj.select.hide();
        el.set('html', '');
        var input = treeObj.options.pNode.getElement('input');
        treeObj.options.pNode.inject(el);
        treeObj.options.pNode.setStyle('display', '');
        //页面上有其他节点focus()时，会有问题，先去掉
        //input.focus();
        input.set('value', el.get('title'));
        input.set('realvalue', el.get('realvalue'));
        treeObj.select.showByJs = true;

        treeObj.select.selBox.set('codePath', el.get('codePath'));
        treeObj.select.selBox.focus();
        var rule = el.get('rule');
        if($defined(rule) && rule.contains('must'))treeObj.select.selBox.setStyle('background-color','#b5e3df');
//        treeObj.select.selBox.focus();
        this.addNextFocusEvent(treeObj.select.selBox);
//        //在此触发下拉树的onClickBefore事件
//        if(treeObj.options.onClickBefore)this.getFunc(treeObj.options.onClickBefore)[0](dataObj, el);
        //treeObj.select.show();
        if($chk(el.get('realvalue'))) {
            if($chk(el.get('codePath'))) {
                treeObj.select.clickBefore(el.get('codePath'));
            }
            else {
                
                if(treeObj.options.treeType==1){//checkbox
                	var rv=el.get('realvalue');
                	var cl = treeObj.select.getNodeByRealvalue(rv,true);
		        	treeObj.setNodeChecked(cl);
		        	
                }else{
                	var query = new Hash();
                	query.set(treeObj.options.cascadeSign.id, treeObj.select.selBox.get('realvalue'));
                	treeObj.findTreeNode(query);
                }
            }
        }
        
        
    }
    
    
    
    ,actClickDele:function(e,defEl){
    	var el=defEl, 
    	type=defEl.get('type'), 
    	elName=defEl.get('name'), 
    	itemEl=this.getItemElByName(elName)[0],
    	rowNum=this.getRowNum(defEl);
    	
        var act = itemEl.get('act');
        var tid = itemEl.get('tid');
        var ctrl = itemEl.get('ctrl');
        var page = itemEl.get('page');
        var elName = itemEl.get('name');
        var showRow = itemEl.get('showRow');
        var msg = itemEl.get('msg');
        
    	
    	if(act == 'delete') {//注册删除的单击事件
            //代码执行到这里el肯定不为null
            var popMes = itemEl.get('popMes') != 'false';//是否自动弹出提示信息，默认为自动弹出
            var delConfirm = itemEl.get('delConfirm') || ('' + i18n.gridDelConfirm);


                if(el.get('disable') == 'true')return;
                if(popMes) {
                    if(!confirm(delConfirm))return;
                }

                var deletingRow = this.deleting(el);//标记删除
                if(deletingRow == null)return; //是增行直接删除

                //发送请求数据
                var req = this.getReq({
                    'tid':tid
                    ,'ctrl':ctrl
                    ,'widgets':[this.getOneRowGirdData(deletingRow)]
                });

                pc.postReq({
                    'req':req
                    ,'postType':itemEl.get('postType')
                    ,'onSuccess':function(res) {
                        this.deleteRow(deletingRow);

                        if(itemEl.get('onSuccess')) {
                            this.getFunc(itemEl.get('onSuccess'))[0](req, res);
                        }
                    }.bind(this)
                    ,'onError':function (res) {
                        deletingRow.removeClass('sGrid_data_row_delete_div');

                        if(itemEl.get('onError')) {
                            this.getFunc(itemEl.get('onError'))[0](req, res);
                        }
                    }.bind(this)
                });

                //发送请求数据 end

        } else if(act == 'deleting') {
            

            	if(!el.get('deleteCaption')){
		            var deleteCaption = el.get('text');
		            var cancel = itemEl.get('cancel') || '' + i18n.cancel;

		            el.set('deleteCaption', deleteCaption);
		            el.set('cancelCaption', cancel);
            	}
            	

                if(el.get('disable') == 'true')return;

                var row = this.getRow(el);
                //                                   row.toggleClass('sGrid_data_row_delete_div');

                //取消的操作
                if(row.get('status') == 'delete') {
                    el.set('text', el.get('deleteCaption'));
                    row.set('status', '');
                    row.removeClass('sGrid_data_row_delete_div');
                    return;
                }

                //以下为标记删除操作-----
                if(row.get('status') != 'insert') {
                    el.set('text', el.get('cancelCaption'));
                } else {//是新增的行的时候直接执行删除操作
                    if(!confirm('' + i18n.gridInsertRowDel)) {
                        //                                          row.removeClass('sGrid_data_row_delete_div');
                        return;
                    }
                }
                this.deleting(el);


        } else if(tid || ctrl) { //访问后台
            //代码执行到这里el肯定不为null

                if(el.get('disable') == 'true')return;

                var row = el.getParent('.sGrid_data_row_div');
                if(row.get('status') == 'insert') {//是新增的行的时候 不能执行此操作
                    alert('' + i18n.gridSaveAlert);
                    return;
                }

                var req = this.getReq({
                    'tid':tid
                    ,'ctrl':ctrl
                    ,'widgets':[this.getOneRowGirdData(el)]
                });

                pc.postReq({
                    'req':req
                    ,'postType':itemEl.get('postType')
                    ,'onSuccess':function(res) {
                        if(itemEl.get('onSuccess')) {
                            this.getFunc(itemEl.get('onSuccess'))[0](req, res);
                        }
                    }.bind(this)
                    ,'onError': function(res) {
                        if(itemEl.get('onError')) {
                            this.getFunc(itemEl.get('onError'))[0](req, res);
                        }
                    }.bind(this)
                });


        } else if(page) { //直接页面间跳转        //todo 当前只支持 tid  和 page 属性 互斥的情况

                if(el.get('disable') == 'true')return;

                var row = el.getParent('.sGrid_data_row_div');
                if(row.get('status') == 'insert') {//是新增的行的时候 不能执行此操作
                    alert('' + i18n.gridSaveAlert);
                    return;
                }

                if(!showRow) {
                    throw new Error('gird[' + this.options.name + ']:使用表格一行数组直接页面间跳转到form页面展现时候，必须设置有效的showRow属性，具体请参阅用户手册！');
                }

                var formData = this.getOneRowFormData(el, showRow);
                pc.redirect.setData(formData);
                pc.redirect.go(page);

        }
    	
    }	
    
    ,selectClickDele:function(e,defEl){
    	var el=defEl, 
    	type=defEl.get('type'), 
    	elName=defEl.get('name'), 
    	itemEl=this.getItemElByName(elName)[0],
    	rowNum=this.getRowNum(defEl);
    	
        if(el.get('disable') == 'true' || el.get('disabled')==true)return;
        
        if(!el.retrieve('space')){
        	el.store("space", el.getParent('.sGrid_data_row_div'));
        }
//        if(el.get('allDb')){
//        	el.store("allDb",JSON.decode(el.get('allDb')));
//        	el.erase('allDb');
//        }

        if(itemEl.get('onBeforeClick'))this.getFunc(itemEl.get('onBeforeClick'))[0](this.getOneRowData(el), this.getRow(el), itemEl);

        var text = el.get('text');

        if(el.get('createSelect') == 'true') {
            return;
        }
        itemEl.pNode = el;  //el 正确的  itemEL是错误的

        el.set('text', '');  //清除原来的html值

        var sel = pc.getSelect();


        if(sel.box && sel.box.getParent('.sGrid_data_row_item_div')) {//上一次是在表格中被展现出来的
            var oldEl = sel.box.getParent('.sGrid_data_row_item_div');
            if(!sel.box.get('code')) {//没有值被选中，更新状态
                oldEl.set('caption', '');
                oldEl.set('code', '');
                oldEl.set('realvalue', '');
            }


            var value = oldEl.get('text');
            var realValue = oldEl.get('realvalue') || '';
            var code = oldEl.get('code');

            oldEl.set('code', code);       //为cell赋code值,用来标示唯一性
            oldEl.set('realvalue', realValue);
            //update更新数据，数据源更新成要提交的值
            $w(oldEl.getParent('div[sword=SwordGrid]').get('name')).updateCell(oldEl, realValue, oldEl.get('caption') || '', true);
            oldEl.set('createSelect', 'false');

        }
        sel.setValidate(this.vObj);
        var dd = itemEl.get('disable');
        itemEl.set('disable', '');
        sel.initParam(itemEl, this);
        itemEl.set('disable', dd);

        sel.grid_onFinished = function(selectValue, code, realValue, allDb) {
            el.set('caption', selectValue);
            el.set('code', code);
            el.set('realvalue', realValue);
//            el.store('allDb', allDb);
            el.set('createSelect', 'false');

            //                            el.set('text', selectValue);
            this.updateCell(el, realValue, el.get('caption') || '', true);

            if(el.get('rule')) {//执行校验
                if(!this.vObj.doValidate(el).state) {//校验没有通过
                	  var elRow = this.getRow(el);
                  	if(elRow){
                  		 this.addError(elRow.get('rowNum'), el.get('name'));
                  	}
                } else {
                    this.removeError(rowNum, elName);
                }
            }

        }.bind(this);

        sel.box.set('value', text);
        sel.box.set('code', el.get('code'));   //在box上赋值，好让onfinish能取到
        sel.box.set('realvalue', el.get('realvalue'));

        el.set('createSelect', 'true');

        //添加焦点转移事件
//                    this.addNextFocusEvent(sel.box);

        sel.box.focus();
        sel.box.focus(); //todo 为什么要2次才能获得焦点？？？
        if(Browser.Engine.webkit){
        	event.cancelBubble = true;
        }else{
        	sel.show.delay(1, sel); //延迟执行是为了。。略过全局的click事件,不被hide掉
        }
    }
    
    ,dateClickDele:function(e,defEl){
    	var el=defEl, 
    	type=defEl.get('type'), 
    	elName=defEl.get('name'), 
    	itemEl=this.getItemElByName(elName)[0],
    	rowNum=this.getRowNum(defEl);
    	
    	if(el.get('disable') == 'true' || el.get('disabled')==true)return;
        if(itemEl.get('onBeforeClick'))this.getFunc(itemEl.get('onBeforeClick'))[0](this.getOneRowData(el), this.getRow(el), itemEl);
        var text = el.get('text');

        if(el.get('createCalendar') == 'true') {
            return;
        }
        itemEl.pNode = el;  //el 正确的  itemEL是错误的
        el.set('html', '');  //清除原来的html值
        var cal = pc.getCalendar();
        if(cal.dateInput && cal.dateInput.getParent('.sGrid_data_row_item_div')) {
            var date = cal.dateInput.get('value');
            var realvalue = this.getCalendar().getRealValue(this.getItemElByName(cal.dateInput.getParent('.sGrid_data_row_item_div').get('name')), date);

            cal.dateInput.getParent('.sGrid_data_row_item_div').set('showvalue', date);
            cal.dateInput.getParent('.sGrid_data_row_item_div').set('createCalendar', 'false');
            //todo 以下代码可能会出问题，需要精确取到当前对象上下文
            this.updateCell(cal.dateInput.getParent('.sGrid_data_row_item_div'), realvalue, date);//update更新数据
            cal.clear();

            cal.jsShow = false;

        }


        cal.setValidate(this.vObj);
        cal.initParam(itemEl);
        cal.dateInput.set('onHide', itemEl.get('onHide'));
//        cal.dateInput.set('onChange', itemEl.get('onChange'));
        cal.dateInput.set('value', el.get('showvalue'));
        cal.dateInput.set('oValue', el.get('realvalue'));

        cal.grid_onFinished = function(date) {
            var realvalue = this.getCalendar().getRealValue(itemEl, date);
            //                         el.set('text', date);
//            this.removeError(rowNum, elName); //如果是通过日期控件输入日期的话，一定没有错误。
            el.set('showvalue', date);
            el.set('realvalue', realvalue);
            this.updateCell(el, realvalue, date);//update更新数据，传入真实值
            //                         cal.clear();
            el.set('createCalendar', 'false');

            cal.jsShow = false;
            cal.onFinished = null;
            //alert('finish off ');
        }.bind(this);

        cal.jsShow = true;
        //                    cal.show(cal.dateInput);
        cal.show.delay(1, cal, cal.dateInput);

        el.set('createCalendar', 'true');

        //添加焦点转移事件
        this.addNextFocusEvent(cal.dateInput, cal);

        if (Browser.Engine.trident) {//解决火狐下不兼容
                    cal.dateInput.focus();
                    try{
                        cal.dateInput.focus();//todo 为什么要2次才能获得焦点？？？
                    }catch(e){
                    }
                	
                }

    	
    }
    
    ,rowDblclickDele:function(e,defEl){
    	var obj = $(e.target);
    	var sGrid_data_row_div=this.getRow(obj);
        var dataObj=this.getOneRowData(sGrid_data_row_div);
    	this.fireEvent('onRowDbClick', [dataObj,sGrid_data_row_div,e]);
    }
    
	,rowContextmenuDele:function(e,defEl){
		var obj = $(e.target);
		var sGrid_data_row_div=this.getRow(obj);
        var dataObj=this.getOneRowData(sGrid_data_row_div);
		this.fireEvent('onRowRightClick', [dataObj,sGrid_data_row_div,e]);	
	}
    
    ,rowClickDele:function(e,defEl){
    	var obj = $(e.target);
        var type = obj.get('type');
        var tag = obj.get('tag');
        
        var sGrid_data_row_div=this.getRow(obj);
        var dataObj=this.getOneRowData(sGrid_data_row_div);
        
        if(this.options.checkMoudle == 'true') {
            if(!(type == 'checkbox' && tag == 'input')) {
                this.dataDiv().getElements('input:not([disabled])[type=checkbox][checked]').set('checked', false);
                sGrid_data_row_div.getElements('input:not([disabled])[type=checkbox]').set('checked', true);
                //新增，监听check被选中事触发 change事件。
                if(this.options.rowCheckValidator != false && this.options.rowCheckValidator != "false") {
                    var __clickRow = sGrid_data_row_div.getElements('input[type=checkbox]:checked:not([disabled])');
                    __clickRow.fireEvent("change", [__clickRow]);
                }
            }
            sGrid_data_row_div.getElements('input:not([disabled])[type=radio]').set('checked', true);

            var noneChecked = this.dataDiv().getElements('input[type=checkbox]:not([checked])').length;
            if(noneChecked == 0) {
                this.getHeaderCheckboxs_noneChecked().set('checked', true);
            } else {
                this.getHeaderCheckboxs_checked().set('checked', false);
            }
        } else {
            if(type == 'checkbox' && tag == 'input') {
                var noneChecked = this.dataDiv().getElements('input[type=checkbox][name=' + obj.get('name') + ']:not([checked])').length;
                var headerCheckbox = this.getHeaderCheckboxByName(obj.get('name'));
                if(headerCheckbox == null)return;
                if(noneChecked == 0) {
                    headerCheckbox.set('checked', true);
                    if(this.isCP()) {
                        var itemEl = this.getItemElByName(obj.get('name'));//有这种需求。。。
                        itemEl.set('userClicked', 'true');//客户点击过
                        itemEl.set('checkAllFlag', 'true');//客户点击全选按钮的最后状态
                    }
                } else {
                    headerCheckbox.set('checked', false);
                }
            }
        }


        this.dataDiv().getChildren('.sGrid_data_row_click_div').each(function(el) {
            el.removeClass('sGrid_data_row_click_div');
        });
        sGrid_data_row_div.addClass('sGrid_data_row_click_div');

        this.fireEvent('onRowClick', [dataObj,sGrid_data_row_div,e]);
    	
    }
    
    ,textClickDele:function(e,defEl){
    	var el=defEl, 
    	type=defEl.get('type'), 
    	elName=defEl.get('name'), 
    	itemEl=this.getItemElByName(elName)[0],
    	rowNum=this.getRowNum(defEl);
    	this.textClick(el, itemEl, type, elName, rowNum);
    }
        });
