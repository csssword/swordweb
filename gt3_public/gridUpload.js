var GridUpload = new Class( {
	Implements : [ Events, Options ],
	options : {
		name : null,
		cellName : null,
		flzldm:null
	},
	initialize : function(gName, cName,flzl) {
		this.options.name = gName
		this.options.cellName = cName;
		this.options.flzldm = flzl;
	},
	newElInject : function(type, options, el, where) {
		var newEl = new Element(type, options);
		newEl.inject(el, where);
		return newEl;
	},
	createImgEl : function(el, imgName) {
		var newdiv2 = this.newElInject("div", {
			'class' : 'main'
		}, el, "bottom");
		var newspan1 = this.newElInject("div", {
			'class' : 'textnew',
			'text' : imgName,
			'title' : imgName
		//					'imgId' : imgId,
				//					'status' : status,
				//					'events' : {
				//						'click' : this.fileDownLoad.bind(this)
				//					}
				}, newdiv2, "top");
		return newdiv2;
},
/**
 * grid中打开上传文件的窗口
 * @return
 */
gridUpLoadFile : function(e) {
	var flzl = new Event(e).target.get("rowid");
	var opensub = new SwordSubmit();
	opensub.pushData("tag", "gridNew");
	opensub.pushData("flzldm", flzl);
	opensub.setCtrl("UploadCtrl_openUploadPage");
	swordAlertIframe("", {
		titleName : '上传文件',
		width : 700,
		height : 500,
		param : this,
		isMax : 'false',
		submit : opensub
	});
},
/**
 * 删除单元格中某个图片
 * @param event
 * @return
 */
deleteImg : function(e) {
	var target = new Event(e).target;
	var grid = $w(this.options.name);
	var rowEl = target.getParent("div.sGrid_data_row_div");
	var imgCell = rowEl.getCell(this.options.cellName);
	var value = imgCell.get("text");
	var req = {
		"ctrl" : "UploadCtrl_deleteFiles",
		"onSuccess" : function(res) {
			grid.updateCell(imgCell, "");
			var els = target.getParent("div.content").getElements("div.main");
			els.each(function(el){
				el.destroy();
			});
			target.set("text","导入");
//			var myBoundFunction = this.gridUploadFile.bind(this)); 
//			target.addEvent('click', this.gridUpLoadFile.bind(this));
		}
	};
	req.req = pc.getReq( {
		'ctrl' : req.ctrl,
		'widgets' : [ {
			'sword' : 'attr',
			'name' : 'fjid',
			'value' : value
		} ]
	});
	pc.postReq(req);
},
//delSuccess:function(res){
//	var grid = $w(this.options.name);
//	var rowEl = grid.getCheckedRow()[0];
//	var imgCell = rowEl.getCell(this.options.cellName);
//	grid.updateCell(imgCell, "");
//	
//}
/**
 * 获取grid中图片构造的外层div
 * @return
 */
getGridCheckedEle : function(value) {
	var grid = $w(this.options.name);
	var checkedRow = grid.getCheckedRow();
	var imgCell = checkedRow.getCell(this.options.cellName);
	grid.updateCell(imgCell, value);
	var newdiv1 = checkedRow.getElement("div.comparelist");
	return newdiv1;
},

/**
 * grid上传成功之后，创建元素的div
 * @param resData 上传成功之后返回的数据（文件名，文件地址，文件的唯一标识）
 * @return
 */
gridUploadAfter : function(resData) {
	var fjmc = resData.getAttr("fjmc");
	var value = resData.getAttr("fjid");
	var newdiv = this.getGridCheckedEle(value);
	 var fjmcs = fjmc.split(',');
	 var div = "";
	 fjmcs.each(function(mc){
		 div = this.createImgEl(newdiv, mc);
	 }.bind(this));
	div.getParent("div.content").getElement("div.add").set("text","清空");

},
addclick:function(e){
	var target = new Event(e).target;
	if(target.get("text") == "导入"){
		this.gridUpLoadFile(e);
	}else{
		this.deleteImg(e);
	}
},
/**
 * grid中创建图片
 * @param rowEl 当前的行元素
 * @param rowData 当前行的数据
 * @param rowData grid的名字
 * @param cellName 存放图片的单元格的名字
 * @param deleteTag 是否创建"删除"按钮,true为创建，false为不创建
 * @return
 */

gridInsertImgCell : function(rowData, rowEl) {
	//    	gridName = name;
	//    	cellName = cName;
	//    	ywzb = ywzb;
	//    	sfzj = zj;
	//    	sjgsdq = gsdq;
	//    	if($chk(createTag) && createTag == "img"){
	//    		sytag = "img";
	//    	}else{
	//    		sytag = "file";
	//    	}
	var cellEl = rowEl.getElement("div[type='userdefine']");
	var newEl = this.newElInject("div", {
		'class' : 'content'
	}, cellEl, "top");
	var newdiv1 = this.newElInject("div", {
		'class' : 'comparelist'
	}, newEl, "top");
	var rowTds = rowData.tds;
	var imgArr = rowTds[cellEl.get("name")];
	if ($chk(imgArr)) {
		var arrValue = imgArr.value;
		var jsonArr = JSON.decode(arrValue);
		jsonArr.each(function(imgMsg) {
			var name = imgMsg.fjmcxx;
			this.createImgEl(newdiv1, name);
			}.bind(this));
	}
	var tvalue="";
	var rowid = rowTds[this.options.flzldm]["value"];
	if ($chk(rowData.getValue(this.options.cellName))) {
		tvalue="清空";
	} else {
		tvalue="导入";
	}
	this.newElInject("div", {
		'class' : 'add',
		'align' : 'center',
		'rowid' : rowid,
		'text' : tvalue,
		'events' : {
			'click' : this.addclick.bind(this)
		}
	}, newdiv1, "after");
}
});

//function create(gname,cname){
//	var gridUpload = new GridUpload(gname,cname);
//	return gridUpload;
//}
