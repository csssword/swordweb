var ImageUpload = new Class({
	Implements:[Events, Options],
	options:{
	deleteTag:null, //是否显示"删除"，true为显示，false为不显示
	imgGridData:null,
	gridDataName:null,
	td:null, 
	sjgsdq:null,
	ywid:null, //业务id
	ywzb:null, //业务组别
	sytag:null, //是否为图片的上传和下载，ture为是图片
	sfzj:null,  //是否显示"增加"，true为显示，false为不显示
	comTag:null
    },
    initialize: function(td, imgGridData, deleteTag, ywzb, ywid, gsdq, sfzj, sytag, comTag){
    	this.options.td = td;
    	this.options.gridDataName = imgGridData.name;
    	this.options.imgGridData = imgGridData;
    	this.options.sjgsdq = gsdq;
        this.options.deleteTag = deleteTag;
        this.options.ywzb = ywzb;
        this.options.ywid = ywid;
        this.options.sytag = sytag;
        this.options.sfzj = sfzj;
        this.options.comTag = comTag;
        this.formInsertImg();
    },
    newElInject:function(type,options,el,where){
        var newEl=new Element(type,options);
        newEl.inject(el,where);
        return newEl;
    },
    /**
     * 移除"对比"窗口中的某个图片
     * @return
     */
    removeImg:function (e){
    	var compare = $("compare");
    	new Event(e).target.getParent("div.comProimage").destroy();
    	var compareChildren = compare.getElement("div.comPro").hasChildNodes();
    	if(!compareChildren){
    		compare.setStyle("display","none");
    	}
    },
    setImgDisplay: function(tag, imgEl,width,height,comProimageEle,yulan){
    	var _width;
    	var _height;
    	if (width >= height) {
            _width = (width < (600).toInt()) ? width : (600).toInt();
            _height = _width * height / width;
        } else {
            _height = (height < (450).toInt()) ? height : (450).toInt();
            _width = _height * width / height;
        }
	    imgEl.set({'width':_width,'height':_height});
	    if(tag == "view"){
	    	imgEl.inject(comProimageEle,"top");
	    	var win = window;
            if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)win=parent.window;
			var doctemp=win.document;
			var scrollTop = 0;
			var scrollLeft = 0;
	        if (doctemp.body && doctemp.body.scrollTop)
	        {
	        	scrollTop = doctemp.body.scrollTop;
	        	scrollLeft = doctemp.body.scrollLeft;
	        }else if (doctemp.documentElement && doctemp.documentElement.scrollTop)
	        {
	        	scrollTop=doctemp.documentElement.scrollTop;
	        	scrollLeft = doctemp.documentElement.scrollLeft;
	        }
			var _left = scrollLeft + ($(window.document.body).getWidth() - _width)/2;    
			var _top = scrollTop + ($(window.document.body).getHeight() - _height)/2; 
			if(_top < 10){
				_top = 20;
			}
			yulan.setStyles({top:_top, left:_left, position:'absolute', display:''}); // top、left属性。
	    }
    },
    /**
     * 点击"对比"图标
     * @param event
     * @return
     */
    imgCompare:function (e){
    	var compare = $("compare");
    	compare.setStyle('display','none');
    	var clickTarget = new Event(e).target;
    	var width = clickTarget.get("width");
    	var height = clickTarget.get("height");
    	var yulan = $("yulan");
    	yulan.setStyle('display','none');
    	var comProEl = compare.getElement("div.comPro");
    	var imgValue = clickTarget.get("value");
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
    		var newEl=this.newElInject("div",{'class':'comProimage','value':imgValue,'imgId':imgId},comProEl,"top");
    		var imgEl = new Element("img",{'value':imgValue,'alt':imgValue,'src':"download.sword?ctrl=UploadCtrl_getFile&ywzb="+this.options.ywzb+"&jyid="
    			+this.options.ywid+"&fjid="+imgId+"&isFromZj='false'&randomnumber="+randomnumber,'imgId':imgId});
    		var newImgEl = imgEl.inject(newEl,"top");
    		if(this.options.deleteTag == "true"){
    			this.newElInject("div",{'class':'comProtext', 'text':'删除', 'events':{'click':this.removeImg.bind(this)}},newImgEl,"after");
    		}
    		
    		if(Browser.Engine.trident) {
    			imgEl.onreadystatechange = function (){
    				imgEl = this.setImgDisplay("compare",imgEl, width, height);
            		compare.setStyles({top:e.client.y+10, left:50, position:'absolute', display:''});
        		}.bind(this);
    		}else{
    			imgEl.onload = function (){
    				imgEl = this.setImgDisplay("compare",imgEl, width, height);
            		compare.setStyles({top:e.client.y+50, left:50, position:'absolute', display:''});
        		}.bind(this);
    		}
    	}
    },
    
    /**
     * 响应鼠标的滑轮事件，将图片放大和缩小
     */
    mousewheelFunc:function (e){
    	var event = new Event(e);
    	var target = event.target;
    	var width = Number(target.get("width"));
    	var height = Number(target.get("height"));
    	if (event.wheel > 0){
    		width = width + 10;
    		height = height + 10;
    	} else if (event.wheel < 0){
    		width = width - 10;
    		height = height - 10;
    	}
    	target.set({'width':width,'height':height});
    },

    /**
     * 点击"预览"图标
     * @param event
     * @return
     */
    imgView:function (e){
    	var target = new Event(e).target;
    	var yulan = $("yulan");
    	yulan.setStyle('display','none');
    	var ywid = this.options.ywid;
    	var ywzb = this.options.ywzb;
    	var compare = $("compare");
    	if($chk(compare)){
    		compare.setStyle('display','none');
    	}
    	var fjid = target.get("imgId");
    	var imgEle = yulan.getElement("img[width]");
    	var width = target.get("width");
    	var height = target.get("height");
    	if($chk(imgEle)){
    		imgEle.destroy();
    	}
    		var comProimageEle = yulan.getElement("div.comProimage");
    		var randomnumber=Math.floor(Math.random()*100000); 
    		var imgEl = new Element("img",{'alt':e.target.get("value"),'src':"download.sword?ctrl=UploadCtrl_getFile&ywzb="+ywzb+
    			"&jyid="+ywid+"&fjid="+fjid+"&isFromZj='false'&randomnumber="+randomnumber});
    		if(Browser.Engine.trident) {
    			imgEl.onreadystatechange = function (){
    				this.setImgDisplay("view", imgEl, width, height, comProimageEle, yulan);
        		}.bind(this);
    		}else{
    			imgEl.onload = function (){
    				this.setImgDisplay("view", imgEl, width, height, comProimageEle, yulan);
        		}.bind(this);
    		}
    },
    /**
     * 文件下载
     * @param event
     * @return
     */
    fileDownLoad:function (e){
    	var fileDownSubmit = new SwordSubmit();
    	fileDownSubmit.options.postType="download";
    	var fjid = e.target.get("imgId");
    	fileDownSubmit.pushData("ywzb",this.options.ywzb);
    	fileDownSubmit.pushData("ywid",this.options.ywid);
    	fileDownSubmit.pushData("fjid",fjid);
    	fileDownSubmit.pushData("isFromZj","false");
    	fileDownSubmit.submit({"ctrl":"UploadCtrl_download"});
    },
    createImgEl: function(el, imgName, imgSrc, imgId, status, width,
					height) {
				var newdiv2 = this.newElInject("div", {
					'class' : 'main'
				}, el, "bottom");
				var newspan1 = this.newElInject("div", {
					'class' : 'text',
					'text' : imgName,
					'title' : imgName,
					'imgId' : imgId,
					'status' : status,
					'events' : {
						'click' : this.fileDownLoad.bind(this)
					}
				}, newdiv2, "top");
				var newspan;
				if (this.options.sytag == "file") {
					newspan = this.newElInject("div", {
						'class' : 'download',
						'title' : '下载',
						'value' : imgName,
						'imgId' : imgId,
						'src' : imgSrc,
						'events' : {
							'click' : this.fileDownLoad.bind(this)
						}
					}, newspan1, "after");
				} else {
					newspan = this.newElInject("div", {
						'class' : 'review',
						'title' : '预览',
						'value' : imgName,
						'imgId' : imgId,
						'width' : width,
						'height' : height,
						'src' : imgSrc,
						'events' : {
							'click' : this.imgView.bind(this)
						}
					}, newspan1, "after");
					if (this.options.comTag == "true") {
						newspan = this.newElInject("div", {
							'class' : 'compare',
							'title' : '对比',
							'value' : imgName,
							'imgId' : imgId,
							'width' : width,
							'height' : height,
							'src' : imgSrc,
							'events' : {
								'click' : this.imgCompare.bind(this)
							}
						}, newspan, "after");
					}
				}
				if (this.options.deleteTag == "true") {
					this.newElInject("div", {
						'class' : 'delete',
						'value' : imgName,
						'title' : '删除',
						'imgId' : imgId,
						'events' : {
							'click' : this.formDeleteImg.bind(this)
						}
					}, newspan, "after");
				}
			},
//    createfileEl:function (el, imgName,imgSrc,imgId,status){
//        var newdiv2=this.newElInject("div",{'class':'main'},el,"bottom");
//        var newspan1=this.newElInject("div",{'class':'text','text':imgName,'title':imgName, 'imgId':imgId,'status':status,
//        	'events':{'click':this.fileDownLoad.bind(this)}},newdiv2,"top");
//        newspan = this.newElInject("div",{'class':'download','title':'下载', 'value':imgName,'imgId':imgId,'src':
//     	 	   imgSrc,'events':{'click':this.fileDownLoad.bind(this)}},newspan1,"after");
//        if(this.options.deleteTag == "true"){
//        		this.newElInject("div",{'class':'delete', 'value':imgName, 'title':'删除','imgId':imgId,'events':{'click':this.formDeleteImg.bind(this)}},newspan,"after");
//        }
//    },
    /**
     * form中打开上传文件的窗口
     * @return
     */
    formUpLoadFile:function (e){
    	var uploadSubmit = new SwordSubmit();
    	uploadSubmit.pushData("tag","form");
    	uploadSubmit.pushData("ywzb",this.options.ywzb);
    	uploadSubmit.pushData("sjgsdq",this.options.sjgsdq);
    	uploadSubmit.pushData("sytag",this.options.sytag);
    	uploadSubmit.pushData("ywid",this.options.ywid);
    	uploadSubmit.setCtrl("UploadCtrl_openUploadPage");
    	swordAlertIframe("",{
    		titleName : '上传文件',
    		width : 700,
      		height : 500,
      		param:this,
      		isMax:'false',
      		submit:uploadSubmit
    	});
    },
    /**
     * form中删除单元格中某个图片，并删除"对比"窗口中该图片
     * @param event
     * @return
     */
    formDeleteImg:function (e){
    	var target = new Event(e).target;
    	 var id = target.get("imgId");
    	 var imgGridData = this.getAllData();
    	 var dataArray = imgGridData.trs;
    	 var compare = $("compare");
    	 if($chk(compare)){
    		 compare.setStyle("display","none");
    	 }
    	 var hashKey = this.options.td;
    	 dataArray.each(function(imgMsg) {
    		 var rowTds = imgMsg.tds;
    			var imgId = rowTds.fjid.value;
    			var stauts = imgMsg.status;
    			if(id == imgId){
    				if(stauts == "insert"){
    						var req = {
    							"ctrl" : "UploadCtrl_deleteTempAppendixByFjId",
    							"onSuccess" : function(res) {
    							if($chk(compare)){
    								$("yulan").setStyle("display","none");
    								var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
        							if($chk(imgEl)){
        								imgEl.destroy();
        							}
    							}
    							target.getParent("div.main").destroy();
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
    					if($chk(compare)){
    						$("yulan").setStyle("display","none");
        					var imgEl = compare.getElement('div.comProimage[imgId=' + id + ']');
        					if($chk(imgEl)){
        						imgEl.destroy();
        					}
    					}
    					var textEle = target.getPrevious("div.text");
    					textEle.set("status","delete");
    					target.getParent("div.main").setStyle("display","none");
    				}
    			}
    		}.bind(this));
    },
    /**
     * form中上传成功之后，创建元素的div
     * @param resData 上传成功之后返回的数据（文件名，文件的唯一标识）
     * @return
     */
    formUploadAfter:function(resData){
        	 var imgName = resData.getAttr("fileName");
         	var imgId = resData.getAttr("fjid");
         	var newdiv1 = $(this.options.td).getElement("div.comparelist");
         	var width;
         	var height;
         	if(this.options.sytag == "img"){
         		width = resData.getAttr("width");
             	height = resData.getAttr("height");
         	}
         	this.createImgEl(newdiv1, imgName, "", imgId,"insert", width,height);
    	 },
    getAllData: function(){
    	var tdEl = $(this.options.td);
    	var divEls = tdEl.getElements("div.main");
    	var trs = new Array();
    	divEls.each(function(el) {
    		var textEl = el.getElement("div.text");
    		var tds = {
					tds : {						
						'fjmcxx' : {
							'value' : textEl.get("title")
						},'fjid' : {
							'value' : textEl.get("imgId")
						}
					},
					"status" : textEl.get("status")
				}
             trs.push(tds);
         }, this);
    	return {
            'sword':'SwordGrid',
            'name' :this.options.gridDataName,
            'trs' :trs   //数组从0开始
        };
    },
    commitAllData: function(){
    	var data = this.getAllData();
    	data.trs.each(function(tr){
    		tr.status = "";
    	}.bind(data));
    	return data;
    },
    /**
     * form中创建图片
     * @param tdId td的id
     * @param imgGrid 用于创建图片div的数据
     * @param tag 是否创建"删除"按钮,true为创建，false为不创建
     * @return
     */
    formInsertImg:function (){
    	var tdEl = $(this.options.td);
    	var divEl = tdEl.getElement("div.swordform_userdefine_wrap");
    	var newEl = this.newElInject("div", {
    		'class' : 'content'
    	}, divEl, "top");
    	var newdiv1 = this.newElInject("div", {
    		'class' : 'comparelist'
    	}, newEl, "top");
    	var rowDatas = this.options.imgGridData.trs;
    	if(rowDatas.length > 0){
    		rowDatas.each(function(rowData) {
    			var rowTds = rowData.tds;
    			var imgName = rowTds.fjmcxx.value;
    			var imgId = rowTds.fjid.value;
    			var status = rowData.status;
    			var createTag = this.options.sytag;
    			var width;
    			var height;
    			if(createTag == "img"){
    				width = rowTds.width.value;
        			height = rowTds.height.value;
//        			this.createImgEl(newdiv1, imgName, "", imgId,width,height,status);
    			}
    			this.createImgEl(newdiv1, imgName, "", imgId, status, width,height);
//    			else{
//    				this.createfileEl(newdiv1, imgName, "", imgId,status);
//    			}
    			
    		}.bind(this));
    	}
    	if(this.options.sfzj == "true"){
    		this.newElInject("div", {
        		'class' : 'add',
        		'align' : 'center',
        		'text' : '增加',
        		'events' : {
        			'click' : this.formUpLoadFile.bind(this)
        		}
        	}, newdiv1, "after");
    	}
    }
});

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

function create(td, imgGridData, deleteTag, ywzb, ywid,gsdq, sfzj, sytag, comTag){
	if(!$chk(sytag)){
		sytag = "file";
	}
	if(!$chk(comTag)){
		comTag = "true";
	}
	var imgUpload = new ImageUpload(td, imgGridData, deleteTag, ywzb, ywid, gsdq, sfzj, sytag, comTag);
	return imgUpload;
}
