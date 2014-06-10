var SwordPrint = new Class({
    Implements: [Events,Options],
    name: 'SwordPrint',
    options:{
		//word对象
        wordObj: null,
		//
		wordPath: null,
        
		/**
         传入的数据
         @property {private object} wordObj
        */
		jsonData: null
    },
    initialize: function(options) {
        this.setOptions(options);
    },
    initParam: function(node) {
		this.htmlOptions(node);
    },
    initData: function(jsonData) {
		this.options.jsonData = jsonData;
    },
	getWordObject: function(){
		var wordObj = new ActiveXObject("Word.Application");
		if(!$defined(wordObj)){
			alert( "不能创建Word对象！");
		}
		wordObj.visible=false;
		return wordObj;
	},
	getRootPath: function(){
		var location=document.location;

		if ("file:" == location.protocol){
			var str = location.toString();
			return str.replace(str.split("/").reverse()[0], "");
		}

		var pathName=location.pathname;
		if(pathName.substring(0,1)!="/")pathName = "/" + pathName;
		pathName = pathName.split("/");

		return location.protocol+"//"+location.host+"/"+pathName[1]+"/";
	},
	prepareWordObject: function(){
		if (null == this.WordObj)
		{
			this.WordObj = this.getWordObject();
			this.WordObj.Documents.Open(this.getRootPath() + this.options.wordPath);
		}
	},
	openWordPrint: function(){
		this.prepareWordObject();
		this.replaceAllBookmark(this.options.jsonData);
		this.WordObj.visible=true;
	},
	directPrint: function(){
		this.prepareWordObject();
		try{
			this.replaceAllBookmark(this.options.jsonData);
			this.WordObj.ActiveDocument.printOut();
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			this.WordObj.ActiveDocument.SaveAs(fso.getspecialfolder(2) + "//" + fso.gettempname() + ".doc", 8);	
			var word = this;
			setTimeout(function(){word.close();},5000);
		}catch(e){
			var fso=new ActiveXObject("Scripting.FileSystemObject");
			this.WordObj.ActiveDocument.SaveAs(fso.getspecialfolder(2) + "//" + fso.gettempname() + ".doc", 8);	
			this.close();
			alert("对不起，打印出现了异常\n\n如果打印机没有打印出结果，请点击导出按钮，然后使用word的打印功能。");
		}
		
	},
	replaceAllBookmark: function(jsonData){
		for(var key in jsonData){
			if (this.WordObj.ActiveDocument.BookMarks.Exists(key)){
				this.WordObj.ActiveDocument.BookMarks(key).Range.Select();
				this.WordObj.Application.selection.Text = jsonData[key];
			}
		}
	},
	close: function(){
		if (this.WordObj !=null) this.WordObj.Quit();
	}
});






