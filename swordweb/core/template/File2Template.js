var SwordFile2Template = {
    render:function (item, formObj, fName, itemData) {
    	var dataValue=itemData?itemData.value||"":"";
    	var name=item.get("name"),id=fName+"_"+name;
    	var htmlStr='<div class="swordform_field_wrap"><div class="swordform_item_oprate sword_file_upload2" style="background-color:;" widgetGetValue="true" id="'+id+'"  name="'+name+'" widget="file2"><ul class="up-list" name="up-list">',htmlStrR='';
		var addc=item.get("addCaption")||'添加文件';
		formObj.fieldElHash.set(id,$(id));
		if(dataValue){
			var dName="";
			try{var dObj=JSON.decode(dataValue);dName=dObj.name;
			}catch(e){}	
			dName=dName||dataValue;
			//todo 若以后扩展支持多文件的话，在此迭代li字符串即可.
			htmlStrR=htmlStr+'<li id="file-id" class="file"><span class="file-title">'+dName+'</span><span class="file-delete" style="visibility: hidden;"></span></li>'+
	   		'</ul><a name="up-attach" style="color: blue;cursor: pointer; text-decoration: underline; display: none;">'+addc+'</a></div></div>';
	   	}else{
	   		 htmlStrR=htmlStr+'</ul><a name="up-attach" style="color: blue;cursor: pointer; text-decoration: underline; ">'+addc+'</a></div></div></div>';
	    }
		return htmlStrR;
    }
	
	,initWidget:function(name, idEl,formObj){
		var item = $$("div[name=" + name + "]")[0];
		var fileObj=initUp4Template(idEl.getParent(".swordform_field_wrap"),item,idEl,this);
    	pc.setWidget(formObj.options.name+"."+name, fileObj,item.get('dataName'));
    	formObj.setWidget(name, fileObj);
    	formObj.fieldElHash.set(idEl.get("id"), idEl);
       if($defined(item.get("rule"))) {
    	   formObj.Vobj._add(idEl);
        }
        return idEl;
	}
	,runEventFocus:function(){
    	//触发原始focus事件,然后调用show逻辑
    }
    ,runEventClick:function(){
		//触发原始click之后调用focus逻辑.
	}
    ,runEventBlur:function(){
    	//todo
    }
    ,runEventDblClick:function(){
    	return;//双击下载？
    }
    ,runEventKeydown:function(){
    	//下拉列表数据过滤
    	return;
    }
};