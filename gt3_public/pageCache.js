var $p = $pageCache = new Class({
	options:{
		pw : window.parent || window
		,tabName:null
	}
	,initialize : function(obj,tabName){
		if($chk(obj))
			this.options.pw = obj;
		var tempOnSelect = this.options.pw.$w(tabName).options.onSelect;
	
		if(! /_onSelect/.test(tempOnSelect))
			this.options.pw.tempOnSelect = this.options.pw[tempOnSelect.substring(0,tempOnSelect.indexOf('('))];
		
		this.options.pw.$w(tabName).options.onSelect = "_onSelect();";
		this.options.pw._onSelect = function(tabObj, oldIndex, newIndex){

			if($defined(this["tempOnSelect"]) && (this["tempOnSelect"])(tabObj, oldIndex, newIndex) == false){
				return false;
			}
			var oldWin = this.$("SwordTab_iframe_" + oldIndex );
			if($defined(oldWin.contentWindow.onTabBlur) && oldWin.contentWindow.onTabBlur(tabObj, oldIndex, newIndex) == false){
				return false
			}
			var newWin = this.$("SwordTab_iframe_" + newIndex );
			if($defined(newWin.contentWindow.onTabFocus) && newWin.contentWindow.onTabFocus(tabObj, oldIndex, newIndex) == false){
				return false
			}
			return true;
		}
		this.options.pw._onSelect.bind(this.options.pw);
	}
		,get:function(key){
			if(!$chk(key)) return;
			if(!$defined(this.options.pw._pageCache)) this.options.pw._pageCache = {};
			return this.options.pw._pageCache[key];
		}
		,getAll : function (){
			if(!$defined(this.options.pw._pageCache)) this.options.pw._pageCache = {};
			return this.options.pw._pageCache;
		}
		,put:function(key, value){
			if(!$defined(this.options.pw._pageCache)) this.options.pw._pageCache = {};
			if(!$chk(key)) return false;
			this.options.pw._pageCache[key] = value;
			return true;
		}
		,remove:function(key){
			if(!$chk(key)) return false;
			if(!$defined(this.options._pageCache)) this.options._pageCache = {};
			var _newPageCache = {};
			for(e in this.options.pw._pageCache){
				if(key != e)
				_newPageCache[e] = this.options.pw._pageCache[e];
			}
			this.options.pw._pageCache = _newPageCache;
			return true;
		}
		,removeAll : function(){
			if(!$defined(this.options.pw._pageCache)) this.options._pageCache = {};
			this.options.pw._pageCache = {};
			return true;
		}	
});