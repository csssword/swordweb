var StudioComm = new Class({
    name:"StudioComm",
    initialize:function() {
    },
    /*
     *修改一个组件，执行重新加载动作
     *@param widgetName:组件的name属性
     *@param widgetType:组件的sword属性
     *@param widgetHtml:更新之后的组件的完全HTML串
     *@param originalName:组件原来的名字, todo 与widgetName可能相同，也有可能不同，需要逻辑上进行判断 
     */
    reloadWidget:function(widgetName, widgetType, widgetHtml,originalName) {
        var target = $(document.body).getElement("div[sword='" + widgetType + "'][name='" + widgetName + "']");
        if (!$defined(target)) {
            target = $(document.body).getElement("div[sword='" + widgetType + "'][name='" + originalName + "']");
            if(!$defined(target)){
                alert("Error,要重新装载的组件【"+widgetName+"】不存在！");
                return;
            }
        }
        if (!$defined(widgetHtml) || !$chk(widgetHtml)) {
            alert("Error,要更新的HTML串为空！");
            return;
        }
        var temp = new Element('div', {'styles':{'display':'none'}}).inject(document.body);
        try {
            temp.innerHTML = widgetHtml;
            var newNode = temp.getFirst();
            target.setStyle('display', 'none');
            target.getParent().insertBefore(newNode, target);
            var swordWidget = pc.getWidget(widgetName) || pc.widgetFactory.create(widgetType);
            newNode.pNode = newNode;
            swordWidget.initParam(newNode);
            pc.widgets.set(widgetName, swordWidget);
            swordWidget.initData(pc.getInitData(widgetName) || pc.getResData(widgetName, pc.pinitData));
            pc.getEditor().addEl(newNode);
            target.destroy();
            temp.destroy();
        } catch(e) {
            alert("Error,重新加载组件的过程中出错！"+e);
            if (target)target.setStyle('display', '');
            if (temp)temp.destroy();
        }
    },
    /*
    * 删除一个组件
    *@param wigetType 组件的类型
    *@param wigetName 组件的Name属性  
    */
    deleteWidget:function(widgetName){
        if(!$chk(widgetName)){
            alert("Error,传入的参数有误！widgetName=["+widgetName+"]");
            return;
        }
        var target = $(document.body).getElement("div[name='" + widgetName + "']");
        if(!$defined(target)){
            alert("Error,您要删除的组件在页面不存在！请检查参数widgetName=["+widgetName+"]");
            return;
        }
        try{
           target.setStyle('display','none');
           target.destroy(); 
        }catch(e){
           alert("Exception,删除组件时发生了异常！异常是"+e);
           if(target)target.setStyle('display','');
        }
    },
    /*
     *新增加一个组件，执行新增一个组件的动作
     *@param widgetType:新组件的sword属性
     *@param referName:参照物的name属性
     *@param where:位置属性，表示放置在参照物之前(before)还是之后(after),类型为字符串
     *@param widgetHtml:更新之后的组件的完全HTML串
     */
    addWidget:function(widgetType, referName, where, widgetHtml) {
        var refer = $(document.body).getElement("div[name='" + referName + "']");
        if (!$defined(refer)) {
            alert("Error，Name为[" + referName + "]的参照位置组件不存在！");
            return;
        }
        if (!$defined(widgetHtml)) {
            alert("Error,新增的组件HTML串为空！");
            return;
        }
        if (!$defined(where) || !['before','after'].contains(where)) {
            alert("Error,位置属性定义不正确，应该为['before':在参照组件之前]或者['after':在参照组件之后]");
            return;
        }
        var temp = new Element("div", {"styles":{"display":"none"}}).inject(document.body);
        temp.innerHTML = widgetHtml;
        var newNode = temp.getFirst();
        if($(document.body).getElements("div[sword='" + widgetType + "'][name='" + newNode.get('name') + "']").length>1){
            alert("Message,类型为["+widgetType+"],Name为["+newNode.get('name')+"]的组件已经存在！请您重新定义！");
            temp.destroy();
            return;
        }
        if (where == "after") {
            if (refer.nextSibling) {
                refer = refer.nextSibling;
            } else {
                refer.getParent().inject(newNode);
                refer = null;
            }
        }
        try{
            if (refer != null)refer.parentNode.insertBefore(newNode, refer);
            var swordWidget = pc.widgetFactory.create(widgetType);
            var widgetName = newNode.get("name");
            newNode.pNode = newNode;
            swordWidget.initParam(newNode);
            pc.widgets.set(widgetName, swordWidget);
            swordWidget.initData(pc.getInitData(widgetName) || pc.getResData(widgetName, pc.pinitData));
            pc.getEditor().addEl(newNode);
        }catch(e){
            alert("Exception,新增组件时发生了异常！异常是"+e);
            newNode.destroy();
            temp.destroy();
        }
        temp.destroy();
    }
});