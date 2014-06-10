SwordSubmit.Command = new Class({
    $family: {name: 'SwordSubmit.Command'}
    ,name:null//组件名称
    ,command:null//指令
    ,widgetObj:null//组件对象
    ,doAction:$empty//处理数据
    ,doBeforeEvent:$empty//处理提交前组件事件
    ,doAfterEvent:$empty//处理提交后组件事件
    ,doError:$empty//处理提交出错
    ,initialize:function(name, console, widgetObj) {
        this.name = name;
        this.console = console;
        this.widgetObj = widgetObj;
    }
});
SwordSubmit.Command.newInstance = function(widget, name, console, widgetObj) {
    var instance;
    if (widget == "SwordForm") {
        instance = new SwordSubmit.SwordFormCommand(name, console, widgetObj);
    } else if (widget == "SwordGrid") {
        instance = new SwordSubmit.SwordGridCommand(name, console, widgetObj);
    }else if (widget == "SwordMove") {
        instance = new SwordSubmit.SwordMoveCommand(name, console, widgetObj);
    }
    else if (widget == "SwordTab") {
        instance = new SwordSubmit.SwordTabCommand(name, console, widgetObj);
    }
    return instance;
};
SwordSubmit.SwordFormCommand = new Class({
    Extends:SwordSubmit.Command
    ,doAction:function(dataObj) {
        dataObj["data"].push(this.widgetObj.getSubmitData());
    }
    ,doBeforeEvent:function() {
        var res = true;
        if (this.console.isVal != "false") {
            if (!this.widgetObj.validate()) {
                res = false;
            }
        }
        return res;
    }
    ,doAfterEvent:function() {

    }
});
SwordSubmit.SwordGridCommand = new Class({
    Extends:SwordSubmit.Command
    ,doAction:function(dataObj) {
        if (this.console['console'] == 'submitChecked') {
            dataObj["data"].push(this.widgetObj.getCheckedData(this.console.check));
        } else if (this.console['console'] == 'curPageData') {
            dataObj["data"].push(this.widgetObj.getCurPageGirdData());
        } else if (this.console['console'] == 'allData') {
            dataObj["data"].push(this.widgetObj.getAllGridData());
        }else if (this.console['console'] == 'allNoDeleteData') {
            dataObj["data"].push(this.widgetObj.getAllNoDeleteGridData());
        }else if (this.console['console'] == 'excel') {
            dataObj["data"].combine(this.widgetObj.getGridExcelInfo(this.console.check));
        }else {
            dataObj["data"].push(this.widgetObj.getStatusGirdData());
        }
    }
    ,doBeforeEvent:function() {
        var res = true;
        //只校验选中的行
        if (this.console['console'] == 'submitChecked') {
            if(!this.widgetObj.validateCheckedRow(this.console.check)){
            	res = false;
            }
        }else{
            if (!this.widgetObj.validate()) {
                res = false;
            }
        }
        return res;
    }
    ,doAfterEvent:function() {
        if(this.console.commit!='false')this.widgetObj.commit();
    }
    ,doError:function() {
        //todo this.widgetObj.rollback();
    }
});

SwordSubmit.SwordMoveCommand = new Class({
    Extends:SwordSubmit.Command
    ,doAction:function(dataObj) {
        if (this.console['console'] == 'curPageData') {
            dataObj["data"].push(this.widgetObj.getCurrentData());
        } else {
            dataObj["data"].push(this.widgetObj.getStatusData());
        }
    }
    ,doBeforeEvent:function() {
        var res = true;

        return res;
    }
    ,doAfterEvent:function() {

    }
    ,doError:function() {
        //todo this.widgetObj.rollback();
    }
});

SwordSubmit.SwordTabCommand = new Class({
    Extends:SwordSubmit.Command
    ,doBeforeEvent:function() {
        return this.widgetObj.validateAllTab();
    }
    ,doAction:function(dataObj) {

    }
    ,doAfterEvent:function() {

    }
});