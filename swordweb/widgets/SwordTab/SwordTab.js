var SwordTab = new Class({
    Implements : [Events,Options],
    $family: {name: 'SwordTab'},
    name:"SwordTab",
    options:{
        name:null,
        pNode:null,
        sword:null,
        tabType:null,//tab的类型,iframe和div这两种类型
        tabTitles:null,//tab的标题名称
        tabSelectedIndex:0,//tab的默认选中的序号,默认为0
        tabDivs:null,//tab的div类型的id数组
        tabIframes:null,//tab的iframe类型的id数组
        tabContentWidth: null,//宽度
        tabContentHeight: null,//高度
        tabDirection: "up",//tab的方向,一共分为四个方向,up,down,left,right
        onSelect: null,
        isRefresh:"false",//是否强制刷新
        onSelectedShowAfter:null,
        maxChars:10 //页签上显示的最大字符数,超过后显示省略号
        ,initLoad:"true"// 是否初始化加载第一序列页签
    },
    styles:{
        "tabsUL":"tabs_ul",
        "tabsLI":"tabs_li",
        "tabsLICommon":"tabs_li_common" ,    //li未被选中样式
        "tabsLISelect":"tabs_li_select",   //li被选中样式
        "outertabsDiv":"outer_tabs_div"
    },
    tabMaskDiv:null,
    tabDivs:[],//下面这两个tabDivs,tabIframes是数组的引用
    tabIframeDivs:[],
    tabIframes:[],
    tabSwordWiget:[],
    initialize:function(options) {
        this.setOptions(options);
    },
    setRefresh:function(bool) {
        if(bool == true)this.options.isRefresh = "true";
        if(bool == false)this.options.isRefresh = "false";
    },
    initParam: function(node) {
        this.htmlOptions(node);
        if(this.options.tabTitles != null) this.options.tabTitles = this.options.tabTitles.split(",");
        if(this.options.tabDivs != null) this.options.tabDivs = this.options.tabDivs.split(",");
        if(this.options.tabIframes != null) this.options.tabIframes = this.options.tabIframes.split(",");
        this.options.pNode = node;
        this.defineStyles();
        this.createTab();
    },
    initData: function() {

    },
    defineStyles: function() {
        if(this.options.tabDirection == "up" || this.options.tabDirection == "down") {
            this.styles.tabsUL = this.styles.tabsUL + "_horizontal";
            this.styles.tabsLI = this.styles.tabsLI + "_horizontal";
            this.styles.tabsLICommon = this.styles.tabsLICommon + "_horizontal";
            this.styles.tabsLISelect = this.styles.tabsLISelect + "_horizontal";
            this.styles.outertabsDiv = this.styles.outertabsDiv + "_horizontal";

        } else if(this.options.tabDirection == "left" || this.options.tabDirection == "right") {

            this.styles.tabsUL = this.styles.tabsUL + "_vertical";
            this.styles.tabsLI = this.styles.tabsLI + "_vertical";
            this.styles.tabsLICommon = this.styles.tabsLICommon + "_vertical";
            this.styles.tabsLISelect = this.styles.tabsLISelect + "_vertical";
            this.styles.outertabsDiv = this.styles.outertabsDiv + "_vertical";
        }

    },
	computeTitleSize: function(title){
		var actualLength = 0;
		var ml = this.options.maxChars;
		if(title.length > ml){
			for(var i = 0 ; i < title.length; i++){
				if(/^[\u4e00-\u9fa5]+$/i.test(title.charAt(i))){
					actualLength = actualLength + 2;//汉字加2
				}else{
					actualLength ++;
				}
			}
		}
		return actualLength > 0 ? (title.substring(0,ml) + "..") : title;
	},
    createTab: function() {
        var headerDiv = new Element('div', {'class': 'bbbbox_top_bg'}).inject(this.options.pNode);
        var headerLDiv = new Element('div', {'class': 'l'}).inject(headerDiv);
        var headerRDiv = new Element('div', {'class': 'r'}).inject(headerDiv);
        var tabDiv = new Element('div', {'class' : 'tabs'});
        tabDiv.inject(headerDiv);
        var ulTitle = new Element('ul', {'id'    : 'SwordTab_ul','class':  this.styles.tabsUL});
        this.options.tabTitles.each(function(item, index) {
            var li = new Element('li', {'id'    : 'SwordTab_li_' + index,'class': '' + this.styles.tabsLI + ' ' + this.styles.tabsLICommon}).inject(ulTitle);
            var tempDiv = new Element('div', {
                'id'    : 'SwordTab_div_' + index,
                'html': this.computeTitleSize(this.options.tabTitles[index]),
                'title': this.options.tabTitles[index]
            }).inject(li);
            li.addEvent('click', function(e) {
                //this.fireEvent('onSelect', this);
            	if(li.get("isDisable")=="true")return;
            	var tempIndex = this.options.tabSelectedIndex;
                this.options.tabSelectedIndex = new Event(e).target.get('id').split("_")[2];
                if(this.options.onSelect) {
                    if(this.getFunc(this.options.onSelect)[0](this, tempIndex, this.options.tabSelectedIndex) != false) {
                        this.options.tabSelectedIndex = tempIndex;
                        this.selectIndex(e);
                        if(this.options.onSelectedShowAfter)
                        	this.getFunc(this.options.onSelectedShowAfter)[0](this, tempIndex, this.options.tabSelectedIndex);
                    } else {
                        this.options.tabSelectedIndex = tempIndex;
                    }
                } else {
                    this.selectIndex(e);
                    if(this.options.onSelectedShowAfter)
                    	this.getFunc(this.options.onSelectedShowAfter)[0](this, tempIndex, this.options.tabSelectedIndex);
                }
                //是否蒙板
	            var selectDiv=this.tabDivs[this.options.tabSelectedIndex]||this.tabIframeDivs[this.options.tabSelectedIndex];
	            this.tabMaskDiv.setStyles({left:  selectDiv.offsetLeft,top: selectDiv.offsetTop-1,width: selectDiv.offsetWidth,height: selectDiv.offsetHeight+1});
	        	if(selectDiv.get("isMask")=="true")this.tabMaskDiv.setStyle("display","block");
	            else this.tabMaskDiv.setStyle("display","none");
            }.bind(this));
            li.addEvent('mouseover', function(e) {

            }.bind(this));
            li.addEvent('mouseout', function(e) {

            }.bind(this));
        }.bind(this));
        //ulTitle.inject(tabDiv);

        var tempTabDiv = new Element('div', {
            'id'    : 'SwordTab_div',
            'class':this.styles.outertabsDiv,
            'styles': {
                'width': this.options.tabContentWidth,
                'height': this.options.tabContentHeight
            }
        }).inject(tabDiv);

        if(this.options.tabType == 'div') {
            this.options.tabDivs.each(function(item, index) {
                $(item).setStyle("position", "relative");
                $(item).setStyle("z-index", -1);
                this.tabDivs[index] = $(item);
                tempTabDiv.adopt($(item));
            }.bind(this));
        } else {
            this.options.tabIframes.each(function(item, index) {
                var tempIframeDiv = new Element('div', {
                    'id'    : 'SwordTab_iframeDiv_' + index,
                    'class':this.styles.outertabsDiv,
                    'styles': {
                        'width': '100%',
                        'height': '100%'
                    }
                });
                var tempIframe = new Element('iframe', {
                    'id'    : 'SwordTab_iframe_' + index,
                    //'src'    : this.options.tabIframes[index],
                    'allowTransparency':'true',
                    'frameborder':0,
                    'styles': {
                        'border':'0px',
                        'width':'100%',
                        'height': '100%'
                    }
                });
                tempIframe.inject(tempIframeDiv);
                tempIframeDiv.inject(tempTabDiv);
                if(Browser.Engine.trident) {
                    //window.frames['SwordTab_iframe_' + index].document.write("<style type='text/css'>body{background-color:#ecf5f7;}</style>");
                }
                this.tabIframeDivs[index] = tempIframeDiv;
                this.tabIframes[index] = tempIframe;
                tempIframeDiv.setStyle("display", "none");
            }.bind(this));
        }
        if(this.options.tabDirection == "up" || this.options.tabDirection == "left") {
            if($defined(ulTitle))
                ulTitle.inject(tabDiv, 'top');

        } else if(this.options.tabDirection == "down" || this.options.tabDirection == "right") {

            if($defined(ulTitle))
                ulTitle.inject(tabDiv);
        }
        this.tabMaskDiv=new Element('div',{styles:{'z-index': '30000',
    		'visibility': 'visible',
    		'opacity': '0.1',
    		'position': 'absolute',
    		'display': 'none', 
    		'background': 'none repeat scroll 0% 0% gray'}}).inject(this.options.pNode,'before'); 
        if(this.options.initLoad=="true")this.selectIndex(this.options.tabSelectedIndex);
    },
    $:function (id) {
        return this.options.pNode.getElement('[id=' + id + ']');
    },
    selectIndex: function(index) {
        if(($type(index) == 'event')) {
            index = new Event(index).target.get('id').split("_")[2];
        }
        if(this.options.tabSelectedIndex != index) {
            this.options.tabSelectedIndex = index;
        }
        this.options.tabTitles.each(function(item, index1) {
            if(index != index1) {
                this.$('SwordTab_li_' + index1).removeClass(this.styles.tabsLISelect);
                this.$('SwordTab_li_' + index1).removeClass('tabs_li_over');
                this.$('SwordTab_li_' + index1).addClass(this.styles.tabsLICommon);
            } else {
                this.$('SwordTab_li_' + index1).removeClass(this.styles.tabsLICommon);
                this.$('SwordTab_li_' + index1).removeClass('tabs_li_over');
                this.$('SwordTab_li_' + index1).addClass(this.styles.tabsLISelect);
            }
        }.bind(this));
        if(this.options.tabType == 'div') {
            this.options.tabDivs.each(function(item, index1) {
                if(index != index1) {
                    $(item).setStyles({
                        'position':'absolute',
                        'left':-10000,
                        'top':-10000,
                        'z-index':-1,
                        'clear': 'both'
                    }).addClass("tabs_div");
                } else {
                    $(item).setStyles({
                        'position':'static',
                        'display':'',
                        'z-index':1,
                        'clear': 'both'
                       
                    }).addClass("tabs_div");
                    if($(item).getAttribute('isload') != 'true') {
                        /*var swordWidgets = $(item).getElements("div[sword][sword!='PageInit'][type!='pulltree'][isload!='true']");
                        swordWidgets.each(function(value) {
                            if(pc.isEdit()) {
                                pc.getEditor().addEl(value);
                            }
                            var swordWidget = pageContainer.widgetFactory.create(value.getAttribute('sword'));
                            value.pNode = value;
                            swordWidget.initParam(value);
                            pageContainer.widgets.set(value.get('name'), swordWidget);
                            swordWidget.initData(pc.getInitData(value.get('name')) || pageContainer.getResData(value.get('name'), pageContainer.pinitData));
                            if($type(this.tabSwordWiget[this.options.tabSelectedIndex]) != 'array') {
                                this.tabSwordWiget[this.options.tabSelectedIndex] = new Array();
                                this.tabSwordWiget[this.options.tabSelectedIndex][0] = value.get('name');
                            } else {
                            }
                        }, this);*/
                        $(item).set('isload', 'true');
                    }
                }
            }.bind(this));
        } else {
            this.options.tabIframes.each(function(item, index1) {
                if(index != index1) {
                    this.$('SwordTab_iframeDiv_' + index1).setStyles({
                        "display": "none",
                        'clear': 'both'
                    });
                } else {
                    var Ifr = this.tabIframes[index1];
                    if(this.options.isRefresh == "false") {
                        if($defined(Ifr.src) && $defined(pageContainer.AddBaseCode2URL(item))) {
                            if(Ifr.src != pageContainer.AddBaseCode2URL(item)) {
                                if(!$chk(Ifr.src)){
                                	 $try(function(){
                                	 	 var retFn = eval(pageContainer.AddBaseCode2URL(item));
                                	 	 if($define(retFn)){
                                	 	 	 Ifr.src = retFn;
                                	 	 }else{
                                	 	 	 Ifr.src = pageContainer.AddBaseCode2URL(item);
                                	 	 }
                                		 
                                	 },function(){
                                		 Ifr.src = pageContainer.AddBaseCode2URL(item);
                                	 });                                	                      
                                }
                            }
                        }
                    }else if(this.options.isRefresh=="true"){
                        Ifr.src = pageContainer.AddBaseCode2URL(item);
                    }else{
                        alert("SwordTab上定义了错误的isRefresh属性值！");
                    }
                    this.$('SwordTab_iframeDiv_' + index1).setStyles({
                        "display": "block",
                        'clear': 'both'
                    });
                }
            }.bind(this));
        }
        //if(this.options.tabType == 'iframe')this.tabIframeDivs[index].focus();

    },
    getSelectWigetNameArray: function(wigetName) {
        var nameArray = new Array();
        if(this.options.tabType == 'div') {
            this.tabDivs[this.options.tabSelectedIndex].getElements("div[sword][sword=" + wigetName + "]").each(function(item) {
                nameArray.include(item.getProperty('name'));
            });
        } else {
            alert("本方法只支持div");
        }
        return nameArray;
    },
    validateTab: function(index) {
        var flag = true;
        this.tabSwordWiget[index].each(function(item, index) {
            if(pageContainer.getWidget(item).validate() == false) {
                flag = false;
            }
        });
        return flag;
    },
    validateAllTab: function() {
        if(this.validateTab(this.options.tabSelectedIndex) == false) {
            return false;
        }
        for(var i = 0; i < this.options.tabTitles.length; i++) {
            if(i != this.options.tabSelectedIndex) {
                this.selectIndex(i);
                if(this.validateTab(i) == false) {
                    return false;
                }
            }
        }
    }

    //显示某个标签页
    ,show:function (index) {
        if(this.options.tabType != 'div')return;
        this.tabDivs[index].setStyle('display', '');
        this.options.pNode.getElementById('SwordTab_ul').getChildren()[index].setStyle('display', '');
    }

    //隐藏某个标签页
    ,hide:function(index) {
        if(this.options.tabType != 'div')return;
        this.tabDivs[index].setStyle('display', 'none');
        this.options.pNode.getElementById('SwordTab_ul').getChildren()[index].setStyle('display', 'none');
    }
    //提供接口修改tab页名称
    ,setTabTitle:function(index, title){
    	var tab = this.options.pNode.getElement("div[id=SwordTab_div_"+index+"]");
    	if(tab)tab.set('html',title);
    }
    //[不推荐使用，请使用disOrEnEdit]
    ,setTabdivDisOrEnEdit:function(index,state){
    	var mbDiv=this.tabDivs[index]||this.tabIframeDivs[index];
    	this.tabMaskDiv.setStyles({left:  mbDiv.offsetLeft,top: mbDiv.offsetTop-1,width: mbDiv.offsetWidth,height: mbDiv.offsetHeight+1});
	    mbDiv.set("isMask","true");
		if(index==this.options.tabSelectedIndex)
			this.tabMaskDiv.setStyle("display","block");
		if(state=="enable"){
	   		mbDiv.set("isMask","false");
	   		if(index==this.options.tabSelectedIndex)this.tabMaskDiv.setStyle("display","none");
	   	}
    },
     //提供接口将指定的tab页禁用或启用，
     disOrEnEdit:function(index,state){
          this.setTabdivDisOrEnEdit(index,state);
     }

    //[不推荐使用，请使用disOrEnClick]
    ,setTabdivDisOrEnClick:function(index,state){
    	var li=this.options.pNode.getElement("li#SwordTab_li_"+index);
    	li.set("isDisable","true");
    	li.removeClass("tabs_li_common_horizontal").addClass("tabs_li_readonly_horizontal");
    	if(state=="enable"){
    		li.set("isDisable","false");
    		li.removeClass("tabs_li_readonly_horizontal").addClass("tabs_li_common_horizontal");
    	}
    }
    //提供接口将指定tab页置灰,禁止点击。
    ,disOrEnClick:function(index,state){
         this.setTabdivDisOrEnClick(index,state);
     }

});

