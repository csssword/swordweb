var SwordHiddenTemplate = {
    render:function (item,formObj,fName,itemData)  {
    	var name = item.get("name"),id=fName + "_"+name;
        item.set("id",id).set("realvalue",itemData?itemData.value:(item.get("defValue")||""));
        formObj.fieldElHash.set(id,$(id));
        return item.outerHTML;
    }
};