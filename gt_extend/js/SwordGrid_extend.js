SwordGrid.prototype.options.autoCreateEditWindow = true; //如果无人工设置的编辑窗口则框架自动创建一个简单的编辑窗口（仅适用与一般文本框形式）。
SwordGrid.prototype.options.onRegisterEvent=$empty;
SwordGrid.prototype.options.dblshoweditwin = false;
SwordGrid.prototype.options.issort = 'false';
SwordGrid.prototype.options.editRows = 'true';
SwordGrid.prototype.options.vType = 'fldiv';//校验提示
SwordGrid.prototype.options.onRowDbClick = function(dataObj, sGrid_data_row_div, e) {
    if (this.options.dblshoweditwin != false) {
        if (!$chk(dataObj) || !$chk(sGrid_data_row_div)) return;
        this.gridDataInitForm(this.getCheckedRowData("check")[0].tds, sGrid_data_row_div);
    }
};
SwordGrid.implement({
	deleteGridsRows:function(){
		this.getCheckedRow("check").each(function(row){
				this.deleting(row);
			}.bind(this)
		);

	}/*,
	editGridsOneRow:function(){
		var data = this.getCheckedRowData("check")[0].tds;
		var rowNum =  this.getCheckedRow("check")[0];
		if(!$chk(data) || !$chk(rowNum)) return;
		this.gridDataInitForm(data, rowNum);
	}
	,
	gridDataInitForm:function(data, rowNum){
		var panel = pc.getWidget(this.options.name + "Edit");
		var Form = pc.getWidget(this.options.name + "Form");

		if( (!$chk(panel) || !$chk(Form)) && this.options.autoCreateEditWindow!=false && this.options.autoCreateEditWindow!='false'){
			var obj = this.createPanelAndForm();
			panel = obj.panel;
			Form = obj.Form;
		}

		Form.items.each(function(item) {
	        var name = item.get('name');
	        var defValue = data[name].value;
	        Form.setValue(name,defValue);
		 });
		if(!$chk(panel.options.title)){
			panel.setTitle( "修改" );
		}
		panel.addGradButton(function(e){
    		var name = this.options.name;
    		if(name){
    			var baseName = name.replace(/(edit)|(Edit)|(EDIT)/,"");
    			var grad = pc.getWidget(baseName);
    			var Form = pc.getWidget(baseName + "Form");
    			if(Form.validate()){
    				grad.updateRow(rowNum, Form.getGridData('grid').trs[0]);
    				this.close();
    			}
    		}
    	});
		//TODO 调用外部接口
		this.fireEvent("onRegisterEvent",[this.options.name + "Form",this.options.name + "Edit"]);
    	panel.open();
	},
	createGridsNewRow:function( e ){
		var panel = pc.getWidget(this.options.name + "Edit");
		var Form = pc.getWidget(this.options.name + "Form");

		if( (!$chk(panel) || !$chk(Form)) && this.options.autoCreateEditWindow!=false && this.options.autoCreateEditWindow!='false'){
			var obj = this.createPanelAndForm();
			panel = obj.panel;
			Form = obj.Form;
		}

		Form.items.each(function(item) {
	        var name = item.get('name');
	        Form.setValue(name,"");
		 });

		if(!$chk(panel.options.title)){
			panel.setTitle( "新建" );
		}
		panel.addGradButton(function(e){
    		var name = this.options.name;
    		if(name){
    			var baseName = name.replace(/(edit)|(Edit)|(EDIT)/,"");
    			var grad = pc.getWidget(baseName);
    			var Form = pc.getWidget(baseName + "Form");
    			if(Form.validate()){
    				grad.insertRow(Form.getGridData('grid').trs[0]);
    				this.close();
    			}
    		}
    	});
    	panel.open();
	},
	createPanelAndForm:function(){
		var panelName = this.options.name + "Edit";
		var formName = this.options.name + "Form";
		var panel = new Element("div",{
			sword:"SwordPopUpWindow",
			name:this.options.name + "Edit"
		}).inject($$("body")[0],"bottom");
		var form = new Element("div",{
			sword:"SwordForm",
			name:this.options.name + "Form",
			layout:'layer0'
		}).inject(panel);
		this.items().each(function(item){
			if(item.get("type") != "checkbox"){
				new Element("div",{
					name:item.get("name"),
					caption:item.get("caption"),
					type:item.get("type"),
					rule:item.get("rule")
				}).inject(form,"bottom");
			}
		});
		var formWidget = pc.getWidget(formName) || pc.widgetFactory.create("SwordForm");
		form.pNode = form;
		formWidget.initParam(form);
        pc.widgets.set(formName, formWidget);

		var panelWidget = pc.getWidget(panelName) ||new  SwordPopUpWindow();
		panel.pNode = panel;
		panelWidget.initParam(panel);
        pc.widgets.set(panelName, panelWidget);
		return {panel:panelWidget, Form:formWidget};
	}      */
});

