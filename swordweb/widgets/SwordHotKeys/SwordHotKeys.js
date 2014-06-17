var SwordHotKeys = new Class({
    Implements:[Events,Options],
    name:"SwordHotKeys",
    $family: {name: 'SwordHotKeys'},
    options:{
        sword : null,//组件类型标识
        name : null, //组件唯一标识名
        isInit:"true",//控制是否要解析本页面的快捷键参数
        toolbarHashKey:"des",//toolbar默认的快捷键映射key
        submitHashKey:"des"//提交组件默认的快捷键映射key
    },  
    hotKeyObj:{"toolbar":[{
		"key":"alt+n",
		"des":"新建",
		"name":"new"
	},{
		"key":"alt+r",
		"des":"刷新",
		"name":"refresh"
	},{
		"key":"alt+f",
		"des":"查找",
		"name":"find"
	},{
		"key":"alt+s",
		"des":"保存",
		"name":"save"
	},{
		"key":"alt+b",
		"des":"返回",
		"name":"back"
	},{
		"key":"alt+c",
		"des":"关闭",
		"name":"close"
	},{
		"key":"alt+p",
		"des":"打印",
		"name":"print"
	},{
		"key":"alt+o",
		"des":"打开",
		"name":"open"
	},{
		"key":"alt+e",
		"des":"编辑",
		"name":"edit"
	},{
		"key":"alt+d",
		"des":"删除",
		"name":"delete"
	}]
    ,"submit":[{
		"key":"alt+s",
		"des":"保存",
		"name":"save"
	},
	{
		"key":"alt+r",
		"des":"取消",
		"name":"cancel"
	},
	{
		"key":"alt+b",
		"des":"返回",
		"name":"black"
	},
	{
		"key":"alt+c",
		"des":"关闭",
		"name":"close"
	}]},
	hotKeyEls:[],
	eventContainer:$((self||window).document.body),
	initParam:function(htmlNode){alert(2);
		this.htmlOptions(htmlNode);
		var sKey=this.options.submitHashKey,tKey=this.options.toolbarHashKey,isInit=this.options.isInit;
		if(isInit!="true")return;
		pc.getWidgetsByType("SwordTab").getValues().each(function(item,index){
			var qStr=item.options.quickKey;
			if(qStr){
				var subtempObj={quickKey:qStr,eventEl:item};
				if(!this.hasItem(subtempObj)){
					this.hotKeyEls.include(subtempObj);
				}
			}
		}.bind(this));
		pc.getWidgetsByType("SwordToolBar").getValues().each(function(item,index){
			var itemEls=item.containerBuffer.getElements("div[type]");
			itemEls.each(function(itemEl){
				if(itemEl.getStyle("display")!="none"){//过滤隐藏的按钮项
					var quickKey=itemEl.get("quickKey"),itemName=itemEl.get("name");
					var valueO={"des":item.options.pNode.getElement("[name='"+itemName+"']").get("caption"),"name":itemName};
					var subtempObj={eventEl:itemEl};
					if(quickKey){
						subtempObj.quickKey=quickKey;
						if(!this.hasItem(subtempObj)){
							this.hotKeyEls.include(subtempObj);
						}
					}else{
						var tHotKey=this.getDefHotKey(tKey,valueO,this.hotKeyObj.toolbar);
						if(tHotKey){
							subtempObj.quickKey=tHotKey.key;
							if(!this.hasItem(subtempObj)){
								this.hotKeyEls.include(subtempObj);
							}
						}
					}
				}
			}.bind(this));
		}.bind(this));
		pc.getWidgetsByType("SwordSubmit").getValues().each(function(item,index){
			if(item.container.get("show")!="false"){//过滤隐藏的提交组件
				var quickKey=item.container.get("quickKey");
				var valueO={"des":item.options.value,"name":item.options.name};
				var subtempObj={eventEl:item.container};
				if(quickKey){
					subtempObj.quickKey=quickKey;
					if(!this.hasItem(subtempObj)){
						this.hotKeyEls.include(subtempObj);
					}
				}else{
					var sHotKey=this.getDefHotKey(sKey,valueO,this.hotKeyObj.submit);
					if(sHotKey){
						subtempObj.quickKey=sHotKey.key;
						if(!this.hasItem(subtempObj)){
							this.hotKeyEls.include(subtempObj);
						}
					}
				}
			}
		}.bind(this));
		//todo，注册事件，处理快捷键
		
		
		this.eventContainer.addEvent("keydown",function(e){
			
			e=new Event(e);
			var keyStr=e.key,hItems=null;
			if(keyStr!=""&&keyStr!=""){//"" alt的key
				debugger;
				hItems=this.hotKeyEls.filter(function(item){
					var b=item.quickKey.split("+"); 
					return e[b[0]]&&e.key==b[1];
				})[0];
				if(hItems){
					e.stop();
					var evEl=hItems.eventEl,typeStr=$type(evEl);
					if(typeStr=="element"){
						evEl.fireEvent("click");
					}else if(typeStr=="SwordTab"){
						var i=evEl.options.tabSelectedIndex/1+1;
						if(i==evEl.options.tabTitles.length){i=0;}
						if(evEl.options.pNode.getElement(".tabs_ul_horizontal").getChildren()[i].get("isDisable")=="true"){
							i=i+1;
						}evEl.selectIndex(i);
					}
				}
			}
		}.bind(this));
	}
	,hasItem:function(item){
		return this.hotKeyEls.filter(function(t){return t.quickKey==item.quickKey;}).length>0;
	}
	,getDefHotKey:function(key,valueO,defKeys){
		var hotKey=defKeys.filter(function(item){return item[key]==valueO[key];});
		return hotKey.length>0?hotKey[0]:null;
	}
	,addHotKey:function(hotKey,obj) {
		if($chk(hotKey)&&$type(obj)=="element"){
			var cEvent=obj.get("onClick");
			obj.set("_onClick",cEvent).erase("onClick");
			obj.onclick = $empty;
			if($chk(cEvent)){
				obj.addEvent("click",function(e){
					if(!$chk(obj.get("disabled")))this.getFunc(cEvent)[0](e,obj);
				}.bind(this));
			}
			var realO={quickKey:hotKey,eventEl:obj};
			if(!this.hasItem(realO)){this.hotKeyEls.include(realO);}
		}
	},
	removeHotKey:function(obj) {
		var otype=$type(obj);
		var t={};
		if(otype=="string"){
			t.quickKey=obj;
		}else if(otype=="element"){
			t.quickKey=obj.get("quickKey");
		}else if(otype=="object"){
			t.quickKey=obj.quickKey;
		}
		var eItem=this.hotKeyEls.filter(function(item){return item.quickKey==t.quickKey;});
		if(eItem.length>0){
			this.hotKeyEls.erase(eItem[0]);
		}
	}
});
/*
 * 对外开放的两个接口,一个是给
 */
var SwordHotKeyObject = {
	addHotKey:function(hotKey,obj){
		var hWidgets=pc.getWidgetsByType("SwordHotKeys").getValues();
		if(hWidgets.length>0){
			hWidgets[0].addHotKey(hotKey,obj);
		}
	},
	removeHotKey:function(obj){
		var hWidgets=pc.getWidgetsByType("SwordHotKeys").getValues();
		if(hWidgets.length>0){
			hWidgets[0].removeHotKey(obj);
		}
	}
};