
var gridName; //grid的名字
var deleteTag; //是否创建"删除"的div,true为创建，false为不创建
var dataCell;
var ywzb;
var sytag;
var sjgsdq;
function  newElInject(type,options,el,where){
    var newEl=new Element(type,options);
    newEl.inject(el,where);
    return newEl;
}

/**
 * grid打开上传文件的窗口
 * @return
 */
function gridUpLoadFile(e){
	var ywid = new Event(e).target.get("ywid");
	var uploadSubmit = new SwordSubmit();
	uploadSubmit.pushData("tag","grid");
	uploadSubmit.pushData("ywzb",ywzb);
	uploadSubmit.pushData("ywid",ywid);
	uploadSubmit.pushData("sytag",sytag);
	uploadSubmit.pushData("sjgsdq",sjgsdq);
	uploadSubmit.setCtrl("UploadCtrl_openUploadPage");
	swordAlertIframe("",{
		titleName : '上传文件',
		width : 700,
		param:window,
  		height : 200,
  		isMax:'false',
  		submit:uploadSubmit
	});
}

/**
 * 获取grid中图片构造的外层div
 * @return
 */
function getGridCheckedEle(imgName,imgId,ywid){
	var grid = this.parent.$w(this.parent.gridName);
	var checkedRow = grid.getCheckedRow();
	var imgCell = checkedRow.getCell(dataCell);   
	var imgText = imgCell.get("text");
	var imgJsonArray = JSON.decode(imgText);
	var insertJson = {'fjmcxx':imgName,'fjid':imgId,'ywid':ywid,'status':'insert'};
	if($chk(imgJsonArray)){
		imgJsonArray.include(insertJson);
	}else{
		imgJsonArray = $splat(insertJson);
	}
	grid.updateCell(imgCell,JSON.encode(imgJsonArray)); 
	var newdiv1 = checkedRow.getElement("div.comparelist");
	return newdiv1;
}

/**
 * grid上传成功之后，创建元素的div
 * @param resData 上传成功之后返回的数据（文件名，文件地址，文件的唯一标识）
 * @return
 */
function gridUploadAfter(resData){
	var imgName = resData.getAttr("fileName");
	var imgId = resData.getAttr("fjid");
	var ywid = resData.getAttr("ywid");
	if(sytag == "img"){
		var width = resData.getAttr("width");
    	var height = resData.getAttr("height");
		this.parent.createImgEl(getGridCheckedEle(imgName,imgId,ywid), imgName, "", imgId,ywid, ywzb, width,height, this.parent.deleteTag);
	}else{
		this.parent.createfileEl(getGridCheckedEle(imgName,imgId,ywid), imgName, "", imgId,ywid, ywzb, this.parent.deleteTag);
	}
	
}

/**
 * 关闭"预览"窗口
 * @return
 */
function closeView(){
	var yulan = $("yulan");
	yulan.setStyle("display","none");
}

/**
 * 关闭"对比"窗口
 * @return
 */
function closeCompare(){
	var compare = $("compare");
	compare.getElements("div.comProimage").each(function(el){
		el.destroy();
	});
	compare.setStyle("display","none");
}

/**
 * 移除"对比"窗口中的某个图片
 * @return
 */
function removeImg(){
	var compare = $("compare");
	this.getParent("div.comProimage").destroy();
	var compareChildren = compare.getElement("div.comPro").hasChildNodes();
	if(!compareChildren){
		compare.setStyle("display","none");
	}
}

/**
 * 删除单元格中某个图片，并删除"对比"窗口中该图片
 * @param event
 * @return
 */
function gridDeleteImg(e){
	 var target = new Event(e).target;
	 var id = target.get("imgId");
	 var grid = $w(gridName);
	 var rowEl = this.getParent("div.sGrid_data_row_div");
	 var imgCell = rowEl.getCell('img');   
	 var imgData = JSON.decode(imgCell.get("text"));
	 var compare = $("compare");
	 compare.setStyle("display","none");
	 imgData.each(function(imgMsg) {
			var imgId = imgMsg.fjid;
			var stauts = imgMsg.status;
			if(id == imgId){
				if(stauts == "insert"){
						var req = {
							"ctrl" : "UploadCtrl_deleteTempAppendixByFjId",
							"onSuccess" : function(res) {
							imgData.erase(imgMsg);
							$("yulan").setStyle("display","none");
							var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
							if($chk(imgEl)){
								imgEl.destroy();
							}
							target.getParent("div.main").destroy();
							if(imgData.length == 0){
								 grid.updateCell(imgCell,"");   
							 }else{
								 grid.updateCell(imgCell,JSON.encode(imgData));   
							 }
							}
						};
						req.req = pc.getReq( {
							'ctrl' : req.ctrl,
							'widgets' : [ {
								'sword' : 'attr',
								'name' : 'fjid',
								'value' : imgId
							}]
						});
						pc.postReq(req);
				}else{
					imgMsg.status="delete";
					$("yulan").setStyle("display","none");
					var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
					if($chk(imgEl)){
						imgEl.destroy();
					}
					target.getParent("div.main").destroy();
					if(imgData.length == 0){
						 grid.updateCell(imgCell,"");   
					 }else{
						 grid.updateCell(imgCell,JSON.encode(imgData));   
					 }
				}
			}
		});
	 
//	var compare = $("compare");
//	compare.setStyle("display","none");
//	$("yulan").setStyle("display","none");
//	var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
//	if($chk(imgEl)){
//		imgEl.destroy();
//	}
//	this.getParent("div.main").destroy();
}

/**
 * 点击"对比"图标
 * @param event
 * @return
 */
function imgCompare(e){
	var compare = $("compare");
	compare.setStyle('display','none');
	var clickTarget = new Event(e).target;
	var width = clickTarget.get("width");
	var height = clickTarget.get("height");
	var yulan = $("yulan");
	yulan.setStyle('display','none');
	var comProEl = compare.getElement("div.comPro");
	var imgValue = clickTarget.get("value");
	var jyid = clickTarget.get("ywid");
	var imgId = clickTarget.get("imgId");
	var insertImgTag = true;
	if(comProEl.hasChildNodes()){
		var imgEls = comProEl.getElements("img[width]");
		for(var imgNum=0; imgNum<imgEls.length; imgNum++){
			var el = imgEls[imgNum];
			var imgElId = el.get("imgId");
			if(imgId == imgElId){
				insertImgTag = false;
				break;
			} 
		}
	}
	if(insertImgTag){
		var randomnumber=Math.floor(Math.random()*100000); 
		var newEl=newElInject("div",{'class':'comProimage','value':imgValue,'imgId':imgId},comProEl,"top");
		var newImgEl = new Element("img",{'value':imgValue,'alt':imgValue,'src':"download.sword?ctrl=UploadCtrl_getFile&ywzb="+ywzb+"&jyid="+jyid+"&fjid="
			+imgId+"&isFromZj='false'&randomnumber="+randomnumber,'imgId':imgId});
		var newImgEl = newImgEl.inject(newEl,"top");
		if(deleteTag == "true"){
			newElInject("div",{'class':'comProtext', 'text':'删除', 'events':{'click':removeImg}},newImgEl,"after");
		}
		if(Browser.Engine.trident) {
			var _width;
			var _height;
			newImgEl.onreadystatechange = function (){
				if (width >= height) {
	                _width = (width < (600).toInt()) ? width : (600).toInt();
	                _height = _width * height / width;
	            } else {
	                _height = (height < (450).toInt()) ? height : (450).toInt();
	                _width = _height * width / height;
	            }
				newImgEl.set({'width':_width,'height':_height});
        		compare.setStyles({top:e.client.y+10, left:50, position:'absolute', display:''});
    		}
		}else{
			var _width;
			var _height;
			newImgEl.onload = function (){
				if (width >= height) {
	                _width = (width < (600).toInt()) ? width : (600).toInt();
	                _height = _width * height / width;
	            } else {
	                _height = (height < (450).toInt()) ? height : (450).toInt();
	                _width = _height * width / height;
	            }
				newImgEl.set({'width':_width,'height':_height});
        		compare.setStyles({top:e.client.y+50, left:50, position:'absolute', display:''});
    		}
		}
	}
}

/**
 * 点击"预览"图标
 * @param event
 * @return
 */
function imgView(e){
	var yulan = $("yulan");
	yulan.setStyle('display','none');
	var target = new Event(e).target;
	var compare = $("compare");
	compare.setStyle('display','none');
	var ywid = target.get("ywid");
	var fjid = target.get("imgId");
	var width = target.get("width");
	var height = target.get("height");
	var imgEle = yulan.getElement("img[width]");
	if($chk(imgEle)){
		imgEle.destroy();
	}
	var comProimageEle = yulan.getElement("div.comProimage");
	var randomnumber=Math.floor(Math.random()*100000);
	var imgEl = new Element("img",{'alt':target.get("value"),'src':"download.sword?ctrl=UploadCtrl_getFile&ywzb="+ywzb+
			"&jyid="+ywid+"&fjid="+fjid+"&isFromZj='false'&randomnumber="+randomnumber});
	if(Browser.Engine.trident) {
		var _width;
		var _height;
		imgEl.onreadystatechange = function (){
			 if (width >= height) {
	                _width = (width < (600).toInt()) ? width : (600).toInt();
	                _height = _width * height / width;
	            } else {
	                _height = (height < (450).toInt()) ? height : (450).toInt();
	                _width = _height * width / height;
	            }
			imgEl.set({'width':_width,'height':_height});
			imgEl.inject(comProimageEle,"top");
			yulan.setStyles({top:e.client.y+10, left:50, position:'absolute', display:''}); // top、left属性。
		}
	}else{
		var _width;
		var _height;
		imgEl.onload = function (){
			 if (width >= height) {
	                _width = (width < (800).toInt()) ? width : (800).toInt();
	                _height = _width * height / width;
	            } else {
	                _height = (height < (600).toInt()) ? height : (600).toInt();
	                _width = _height * width / height;
	            }
			imgEl.set({'width':_width,'height':_height});
			imgEl.inject(comProimageEle,"top");
			yulan.setStyles({top:e.client.y+10, left:50, position:'absolute', display:''}); // top、left属性。
		}
	}
}




/**
 * 文件下载
 * @param event
 * @return
 */
function fileDownLoad(e){
	var fileDownSubmit = new SwordSubmit();
	fileDownSubmit.options.postType="download";
	var target = new Event(e).target;
	fileDownSubmit.pushData("ywzb",ywzb);
	fileDownSubmit.pushData("ywid",target.get("ywid"));
	fileDownSubmit.pushData("fjid",target.get("imgId"));
	fileDownSubmit.pushData("isFromZj","false");
	fileDownSubmit.submit({"ctrl":"UploadCtrl_download"});
}


function createImgEl(el, imgName,imgSrc,imgId,ywid, ywzb,width,height,deleteTag){
    var newdiv2=newElInject("div",{'class':'main'},el,"bottom");
    var newspan1=newElInject("div",{'class':'text','text':imgName,'title':imgName, 'imgId':imgId, 'ywid':ywid,'events':{'click':fileDownLoad}},newdiv2,"top");
    var newspan2=newElInject("div",{'class':'review','title':'预览', 'value':imgName,'imgId':imgId,'ywid':ywid,'width':width,'height':height,'src':
 	   imgSrc, 
 	   'events':{'click':imgView}},newspan1,"after");
    var newspan3=newElInject("div",{'class':'compare', 'title':'对比','value':imgName,'imgId':imgId,'ywid':ywid,'width':width,'height':height,'src':
 	   imgSrc,
 	   'events':{'click':imgCompare}},newspan2,"after");
    if(deleteTag == "true"){
    	newElInject("div",{'class':'delete', 'value':imgName, 'title':'删除','imgId':imgId,'ywid':ywid,'events':{'click':gridDeleteImg}},newspan3,"after");
    }
}
function createfileEl(el, imgName,imgSrc,imgId,ywid, ywzb,deleteTag){
    var newdiv2=this.newElInject("div",{'class':'main'},el,"bottom");
    var newspan1=this.newElInject("div",{'class':'text','text':imgName, 'title':imgName,'imgId':imgId,'events':{'click':fileDownLoad}},newdiv2,"top");
    var newspan3;
    newspan3=this.newElInject("div",{'class':'download','title':'下载', 'value':imgName,'imgId':imgId,'src':
 	 	   imgSrc, 
 	 	   'events':{'click':fileDownLoad}},newspan1,"after");
    if(deleteTag == "true"){
    		this.newElInject("div",{'class':'delete', 'value':imgName, 'title':'删除','imgId':imgId,'events':{'click':gridDeleteImg}},newspan3,"after");
    }
}

/**
 * 改变grid单元格的状态，当为insert状态的行时，直接调用删除的接口
 * @param grid
 * @param rowEl
 * @return
 */
function changeImgCellStatus(grid,rowEl){
	var rowStatus = rowEl.get("status");
	var imgCell = rowEl.getCell('img');   
	var imgData = JSON.decode(imgCell.get("text"));
	$("yulan").setStyle("display","none");
	var compare = $("compare");
	compare.setStyle("display","none");
	if(rowStatus == "insert"){
		var fjidData = {
				'sword' : 'SwordGrid',
				'name' : 'fjidList',
				'trs' : imgData
			}
		var req = {
				"ctrl" : "UploadCtrl_deleteTempAppendixByFjId",
				"data" : fjidData,
				"onSuccess" : function(res) {
				imgData.erase(imgMsg);
				$("yulan").setStyle("display","none");
				var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
				if($chk(imgEl)){
					imgEl.destroy();
				}
				this.getParent("div.main").destroy();
				if(imgData.length == 0){
					 grid.updateCell(imgCell,"");   
				 }else{
					 grid.updateCell(imgCell,JSON.encode(imgData));   
				 }
				}
			};
			jsDelegate(req);
	}else{
		imgData.each(function(imgMsg) {
				var imgId = imgMsg.fjid;
				var stauts = imgMsg.status;
					if(stauts == "insert"){
							var req = {
								"ctrl" : "UploadCtrl_deleteTempAppendixByFjId",
								"onSuccess" : function(res) {
								imgData.erase(imgMsg);
								$("yulan").setStyle("display","none");
								var imgEl = compare.getElement('div.comProimage[imgId=' + imgId + ']');
								if($chk(imgEl)){
									imgEl.destroy();
								}
//								this.getParent("div.main").destroy();
								if(imgData.length == 0){
									 grid.updateCell(imgCell,"");   
								 }else{
									 grid.updateCell(imgCell,JSON.encode(imgData));   
								 }
								}
							};
							req.req = pc.getReq( {
    							'ctrl' : req.ctrl,
    							'widgets' : [ {
    								'sword' : 'attr',
    								'name' : 'fjid',
    								'value' : imgId
    							}]
    						});
    						pc.postReq(req);
					}else{
						imgMsg.status="delete";
						var imgEl = compare.getElement('div.comProimage[imgId=' + imgId + ']');
						if($chk(imgEl)){
							imgEl.destroy();
						}
						if(imgData.length == 0){
							 grid.updateCell(imgCell,"");   
						 }else{
							 grid.updateCell(imgCell,JSON.encode(imgData));   
						 }
					}
			});
	}
}

/**
 * grid中创建图片
 * @param rowEl 当前的行元素
 * @param rowData 当前行的数据
 * @param rowData grid的名字
 * @param cellName 存放图片的单元格的名字
 * @param deleteTag 是否创建"删除"按钮,true为创建，false为不创建
 * @return
 */

function gridInsertImgCell(rowData,rowEl,name,cellName,ywzb,tag,zj,gsdq, createTag){
	gridName = name;
	deleteTag = tag;
	dataCell = cellName;
	ywzb = ywzb;
//	sfzj = zj;
	sjgsdq = gsdq;
	if($chk(createTag) && createTag == "img"){
		sytag = "img";
	}else{
		sytag = "file";
	}
	var cellEl = rowEl.getElement("div[type='userdefine']");
	var newEl = newElInject("div", {
		'class' : 'content'
	}, cellEl, "top");
	var newdiv1 = newElInject("div", {
		'class' : 'comparelist'
	}, newEl, "top");
	var rowTds = rowData.tds;
	var imgArrayCell = rowTds['img'];
	var ywid;
	if($chk(imgArrayCell)){
		var imgArrayValue = imgArrayCell.value;
		var imgJsonArray = JSON.decode(imgArrayValue);
		// 根据imgArray，创建图片的div
		imgJsonArray.each(function(imgMsg) {
			var imgName = imgMsg.fjmcxx;
			var imgId = imgMsg.fjid;
			ywid = imgMsg.ywid;
			if(sytag == "img"){
				var width = imgMsg.width;
				var height = imgMsg.height;
				createImgEl(newdiv1, imgName, "", imgId, ywid,ywzb,width,height, tag);
			}else{
				createfileEl(newdiv1, imgName, "", imgId, ywid,ywzb, tag);
			}
		});
	}
	if(zj == "true"){
		newElInject("div", {
			'class' : 'add',
			'align' : 'center',
			'text' : '增加',
			'ywid' : ywid,
			'events' : {
				'click' : gridUpLoadFile
			}
		}, newdiv1, "after");
	}
}