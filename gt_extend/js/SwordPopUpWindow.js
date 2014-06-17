/*
 * SwordPopUpWindow弹出框组件。参照SwordPopUpBox组件设计的。
 * 作者：殷文旭
 * 时间：2011-10-11
 */

var SwordPopUpWindow = new Class({
	Implements: [Events, Options] // 通过Event, Options 增强SwordParel控件
	// 构造函数
	,
	name: 'SwordPopUpWindow'
	,
	options: {
		name : null,
		pNode : null,
		top: null,
		left: null,
		width: 500,
		height: 400,
		zIndex: 10001,
		position: 'absolute',//absolute是默认的提示框的位置,放在中间显示,fixed是可以自由定制
		title: i18n.titleName,
		isGridEdit : true,				//是否是Grad编辑窗口
		isMin:"true",
		isNormal:'true',
		isMax:'true',
		isClose:'true',
		isShowMask: true,
		initState : 'normal',  //包括三种值 min,normal,max
		mask: {
			background:'gray',
			opacity: 0.5,
			zIndex: 30000,
			position: 'absolute',
			left: null,
			top: null,
			width: null,
			height: null
		},

		popUpTweenTime: 200//这个是msn的popup跳转的时间
		,
		popUpTween:[]		//特效数组
		,
		dragObj:null		//拖拽的对象
		,
		maskObj:null		//遮罩的对象
		,
		onBeforeOpen: $empty      // 当面板打开之前触发
		,
		
		onOpen : $empty			  //打开后触发
		,
		onBeforeClose: $empty     // 当面板关闭之前触发
		,
		onClose: $empty			  //关闭时触发
		,
		onBeforeDestroy : $empty //销毁之后触发
		,
		onMaxBefore : $empty	//最大化之前
		,
		onMaximize : $empty		//最大化时触发
		,
		onMinBefore : $empty    //最小化之前
		,
		onMinimize : $empty		//当窗口最小化的时候被触发
		,
		onNormalBefore : $empty //窗口恢复默认设置前触发
		,
		onNormal : $empty  		//窗口恢复默认设置时触发
	}
	,
	maskObj: null,
	mask: null,
	popUpDiv: null,		//最外层容器
	titleDiv: null,
	titleNameDiv: null,
	titleMinDiv: null,
	titleNormalDiv: null,
	titleMaxDiv: null,
	titleCloseDiv: null,
	contentDiv: null,
	popUpState:"normal",//normal,min,max三个状态
	bodySize: {
		width: 0,
		height: 0
	},

	initialize: function(options) {
	}
	// 默认
	,
	initData : function() {
	}
	// 默认初始化方法。
	,
	initParam : function(node) {
		this.htmlOptions(node);
		this.createAllDiv(this.options.maskObj);
		this.createTitle();
		this.createContent( true );
		//创建弹出窗底边
		this.createTail();
		this.addPopUpTween();
		this.doInitState();
	}
	,
	doInitState : function() {
		switch(this.options.initState) {
			case 'min' :
				this.min();
				break;
			case 'normal' :
				this.normal();
				break;
			case 'max' :
				this.max();
		}

		if(this.options.isClose == "true" || this.options.isClose == true)
			this.close();
		else
			this.open();
	}
	,
	/**
	 * 创建窗口内容容器。将<div sword="SwordPopUpWindow"></div>作为最内层容器，在其外层又包装了两层DIV
	 *
	 */
	createContent : function() {
		var div = this.contentDiv = this.options.pNode; //页面声明的<div sword="SwordPopUpWindow"
		var tempDiv0 = new Element('div', {
			'id': 'ym-ml',
			'class': 'ym-ml'
		}).inject(this.popUpDiv);

		var tempDiv1 = new Element('div', {
			'class': 'ym-mr'
		}).inject(tempDiv0);
		var tempDiv2 = new Element('div', {
			'class': 'ym-mc'
		}).inject(tempDiv1);

		div.setStyles({
			'position': 'relative',
			'width': '100%',
			'height': this.options.height
		}).inject(tempDiv2);
		div.addClass('ym-body');
		div.set("id", this.options.name);
		div.focus();
	},
	/**
	 *创建弹出窗顶层容器。同时设置遮罩。
	 *@param maskObj boolean
	 */
	createAllDiv: function(maskObj) {
		this.popUpDiv = new Element('div', {
			'id': 'ym-window',
			'styles': {
				'z-index': this.options.zIndex,
				'position': "absolute",
				'left': this.options.left,
				'top':-1000,        //这个默认值-1000是为了在创建popup div 的时候，不占页面的高度
				'width': this.options.width,
				'height': this.options.height
			}
		}).inject(document.body);

		if (this.options.popUpTween.length != 0) {
			this.popUpDiv.setStyle('display', 'none');//如果需要特效的话,那么首先置为灰
		}

		this.bodySize.width = $(document.body).getSize().x;
		this.bodySize.height = $(document.body).getSize().y;
		//判断条件---1. body/非body , 2. 显示蒙版/非显示蒙版
		if (!$defined(maskObj) || ($defined(maskObj) && this.isBody(maskObj))) {
			this.maskObj = document.body;
			if (this.options.isShowMask == true || this.options.isShowMask == 'true') {
				if (jsR.config.swordPopUpBox.flag) {
					this.options.mask.zIndex = this.options.mask.zIndex + jsR.config.swordPopUpBox.number;
					jsR.config.swordPopUpBox.number++;
				}
				this.mask = new SwordMask(this.options.mask);
				this.mask.mask(this.maskObj, this.popUpDiv);
				if (this.options.top == null)
					this.options.top = this.mask.getElPosition().top;
				else
					this.popUpDiv.setStyle('top',this.options.top);
				if (this.options.left == null)
					this.options.left = this.mask.getElPosition().left;
			} else {
				if (this.options.left == null)
					this.options.left = ($(this.maskObj).getSize().x - this.options.width) / 2 + $(document.body).getScroll().x;
				if (this.options.top == null)
					this.options.top = ($(this.maskObj).getSize().y - this.options.height) / 2 + $(document.body).getScroll().y;
				this.popUpDiv.setStyles({
					'z-index': this.options.zIndex,
					'position': "absolute",
					'left': this.options.left,
					'top': this.options.top,
					'width': this.options.width,
					'height': this.options.height
				});
			}
		} else {
			this.maskObj = maskObj;
			if (this.options.isShowMask == true || this.options.isShowMask == 'true') {
				if (jsR.config.swordPopUpBox.flag) {
					this.options.mask.zIndex = this.options.mask.zIndex + jsR.config.swordPopUpBox.number;
					jsR.config.swordPopUpBox.number++;
				}
				this.mask = new SwordMask(this.options.mask);
				this.mask.mask(this.maskObj, this.popUpDiv);
				if (this.options.top == null)
					this.options.top = this.mask.getElPosition().top;
				if (this.options.left == null)
					this.options.left = this.mask.getElPosition().left;
			} else {
				//to do 当没有蒙版的maskObj时候的popupbox的还没有
				if (this.options.left == null)
					this.options.left = this.maskObj.getPosition().x + (this.maskObj.getSize().x - this.options.width) / 2 + this.maskObj.getScroll().x;
				if (this.options.top == null)
					this.options.top = this.maskObj.getPosition().y + (this.maskObj.getSize().y - this.options.height) / 2 + this.maskObj.getScroll().y;
				this.popUpDiv.setStyles({
					'z-index': this.options.zIndex,
					'position': "absolute",
					'left': this.options.left,
					'top': this.options.top,
					'width': this.options.width,
					'height': this.options.height
				});
			}
		}

		if (this.options.position == "fixed") {
			this.popUpDiv.setStyles({
				'z-index': this.options.zIndex,
				'position': "absolute",
				'left': this.options.left,
				'top': this.options.top,
				'width': this.options.width,
				'height': this.options.height
			});
		}

		this.popUpDiv.setStyle('height','auto');  //自适应的高度
	},
	/**
	 * 封转标题栏
	 */
	createTitle: function() {
		//标题栏容器。
		var tempDiv0 = new Element('div', {
			'id': 'ym-tl',
			'class': 'ym-tl'
		}).inject(this.popUpDiv);
		//去掉左右边框的标题二层容器。
		var tempDiv1 = new Element('div', {
			'class': 'ym-tr'
		}).inject(tempDiv0);
		//标题三层容器
		this.titleDiv = new Element('div', {
			'class': 'ym-tc',
			'styles': {
				'cursor': 'move'
			}
		}).inject(tempDiv1);
		//标题内容
		this.titleNameDiv = new Element('div', {
			'class' : 'ym-header-text',
			'title' : this.options.title,
			'text'  : this.options.title
		}).inject(this.titleDiv);
		//标题栏控制按钮容器。
		var tempDiv3 = new Element('div', {
			'class': 'ym-header-tools'
		}).inject(this.titleDiv);
		//标题最小化按钮
		if (this.options.isMin == "true") {
			this.titleMinDiv = new Element('div', {
				'class': 'ymPrompt_min',
				'title': i18n.boxMin,
				'styles': {
					'visibility': 'inherit'
				}
			}).inject(tempDiv3);
			this.titleMinDiv.addEvent('click', this.min.bind(this));
		}
		//标题恢复默认大小按钮
		if (this.options.isNormal == "true") {
			this.titleNormalDiv = new Element('div', {
				'class': 'ymPrompt_normal',
				'title': i18n.boxNatural,
				'styles': {
					'visibility': 'inherit'
				}
			}).inject(tempDiv3);
			this.titleNormalDiv.addEvent('click', this.normal.bind(this));
		}
		//标题最大化按钮
		if (this.options.isMax == "true") {
			this.titleMaxDiv = new Element('div', {
				'class': 'ymPrompt_max',
				'title': i18n.boxMax,
				'styles': {
					'visibility': 'inherit'
				}
			}).inject(tempDiv3);
			this.titleMaxDiv.addEvent('click', this.max.bind(this));
		}
		//标题关闭按钮
		if (this.options.isClose == "true") {
			this.titleCloseDiv = new Element('div', {
				'class': 'ymPrompt_close',
				'title': i18n.boxClose
			}).inject(tempDiv3);
			this.titleCloseDiv.addEvent('click', function(e) {
				this.closePopUpBox();
			}.bind(this));
		}
		//为窗口增加拖拽能力。
		this.dragObj = new Drag(this.popUpDiv, {
			snap :5,
			limit: {
				x:[0,$(document.body).getWidth()-this.popUpDiv.getWidth()],
				y:[0,$(document.body).getHeight()-this.options.height-20]
			},
			handle: this.titleDiv,
			onComplete: function(el) {
				el.getElements('#' + this.options.name).setStyle('display', '');
			}.bind(this)
			,
			onStart: function(el) {
				if(this.popUpState == "min")
					this.dragObj.limit.y = [0,$(document.body).getHeight() - 48];//最小化时，重新计算
				el.getElements('#' + this.options.name).setStyle('display', 'none');
			}.bind(this)
		});

	},
	/**
	 * 设置弹出窗底边。
	 */
	createTail: function() {
		var tempDiv0 = new Element('div', {
			'id': 'ym-bl',
			'class': 'ym-bl'
		}).inject(this.popUpDiv);
		var tempDiv1 = new Element('div', {
			'class': 'ym-br'
		}).inject(tempDiv0);
		var tempDiv2 = new Element('div', {
			'class': 'ym-bc'
		}).inject(tempDiv1);
	},
	/**
	 * 为弹出窗增加特效。
	 */
	addPopUpTween: function() {
		for (var i = 0; i < this.options.popUpTween.length; i++) {
			new Fx.Tween(this.popUpDiv, {
				duration:this.options.popUpTween[i]["popUpTweenTime"],
				transition: this.options.popUpTween[i]["popUpTweenTransitionType"]
			}).start(this.options.popUpTween[i]["popUpTweenStyle"], this.options.popUpTween[i]["popUpTweenStyleFrom"], this.options.popUpTween[i]["popUpTweenStyleTo"]);
		}
		if (this.options.popUpTween.length != 0) {
			this.popUpDiv.setStyle('display', 'block');//如果需要特效的话,那么首先置为灰
		}
	},
	/**
	 * 关闭窗口
	 */
	closePopUpBox: function(options) {
		if (document.body) {
			try {
				document.body.focus()
			} catch(e) {
			};
		}

		this.fireEvent('onBeforeClose', [this]);
		this.popUpDiv.setStyle("display","none");
		if (this.options.isShowMask == true) {
			this.mask.unmask();
		}
		this.fireEvent('onClose', [this]);
	},
	/**
	 * 元素是否是body
	 * @param el {Element} 元素
	 */
	isBody: function(el) {
		return (/^(?:body|html)$/i).test((el.get('tag') || el.tagName));
	}
	,

	/**
	 * 最大化窗口
	 */
	max: function() {
		this.fireEvent('onMaxBefore', [this]);
		this.popUpState = "max"; //记录窗口状态
		var tempHeight = 28;
		var maskLeft = 0;
		var maskTop = 0;
		var maskWidth = 0;
		var maskHeight = 0;
		if (this.isBody(this.maskObj)) {
			if (this.options.isShowMask == true) {
				maskLeft = 0 + document.body.getScroll().x;
				maskTop = 0 + document.body.getScroll().y;
				maskWidth = document.body.getSize().x;
				maskHeight = document.body.getSize().y;
			} else {
				maskLeft = 0 + document.body.getScroll().x;
				maskTop = 0 + document.body.getScroll().y;
				maskWidth = document.body.getSize().x;
				maskHeight = document.body.getSize().y;
			}
		} else {
			if (this.options.isShowMask == true) {
				maskLeft = this.mask.options.left;
				maskTop = this.mask.options.top;
				maskWidth = this.mask.options.width;
				maskHeight = this.mask.options.height;
			} else {
				maskLeft = this.maskObj.getPosition().x + this.maskObj.getScroll().x;
				maskTop = this.maskObj.getPosition().y + this.maskObj.getScroll().y;
				maskWidth = this.maskObj.getSize().x;
				maskHeight = this.maskObj.getSize().y;
			}
		}

		this.popUpDiv.setStyles({
			'height': maskHeight,
			'left': maskLeft,
			'top': maskTop,
			'width': maskWidth
		});

		this.contentDiv.setStyles({
			'height': maskHeight - tempHeight
		});

		this.fireEvent('onMaximize', [this]);
	}
	,
	/**
	 * 最小化参数
	 */
	min: function() {
		this.fireEvent('onMinBefore', [this]);
		if (this.popUpState != "min") {
			if ($defined(this.operateDiv))
				this.operateDivHeight = this.operateDiv.getSize().y;//这个变量是解决display为none的时候,this.operateDiv.getSize().y没有值的问题
		}
		this.popUpState = "min";
		var tempHeight = 28;

		this.popUpDiv.setStyles({
			'height': tempHeight,
			'left': 0,//this.options.left,
			'top': $(document.body).getHeight() - 48,//this.options.top,
			'width': this.options.width
		});
		this.contentDiv.setStyles({
			height: 0
		});

		this.popUpDiv.setStyle('height','auto');  //自适应的高度
		this.fireEvent('onMinimize', [this]);
	}
	,
	/**
	 * 恢复到默认窗口大小
	 */
	normal: function() {
		this.fireEvent('onNormalBefore', [this]);
		this.popUpState = "normal";
		var tempHeight = 28;
		this.popUpDiv.setStyles({
			'height': this.options.height,
			'left': this.options.left,
			'top': this.options.top,
			'width': this.options.width
		});

		var h = (this.options.height.toInt() - tempHeight);
		this.contentDiv.setStyles({
			'height':h
		});

		this.popUpDiv.setStyle('height','auto');  //自适应的高度
		this.fireEvent('onNormal', [this]);
	}
	,

	/**
	 * 对外接口方法，关闭窗口
	 */
	close: function() {
		this.closePopUpBox();

	}
	,
	/**
	 * 摧毁窗口
	 */
	destroy: function () {
		if (document.body)
			try {
				document.body.focus()
			} catch(e) {
			};
		this.fireEvent('onBeforeDestroy', [this]);
		if (this.options.isShowMask == true) {
			this.mask.unmask();
			if (jsR.config.swordPopUpBox.flag) {
				jsR.config.swordPopUpBox.number--;
			}
		}

		this.popUpDiv.destroy();
		for(key in this) {
			this[key]=undefined;
		}

	}
	,
	//返回设置的属性值
	getOptions: function () {
		return this.options;
	}
	,
	//返回面板对象
	getPanel: function () {
		return this.popUpDiv;
	}
	,
	//返回面板头部对象
	getHeader: function () {
		return this.popUpDiv.getElement("div.ym-tl");
	}
	,
	//返回面板主体对象
	getBody: function () {
		return this.contentDiv;
	}
	,
	//设置title
	setTitle: function (title) {
		this.titleNameDiv.set('title',title);
		this.titleNameDiv.set('text',title);
	}
	,
	// 当forceOpen设置为true，面板被打开的时候忽略onBeforeOpen回调函数
	open: function () {
		this.fireEvent("onBeforeOpen",[this]);
		this.popUpDiv.setStyle("display","");
		if(this.options.isShowMask == "true" || this.options.isShowMask == true)
			this.mask.mask(this.maskObj, this.popUpDiv);
		this.fireEvent("onOpen",[this]);
	}
});

/**
 * 扩展，值针对于Grid关联更新的情况。
 */
SwordPopUpWindow.implement({
	// 接口方法，专门针对Grad 更新使用。
	addGradButton : function(panelOKbuttonEvent) {
		var body = this.contentDiv;
		if(this.options.isGridEdit != false && this.options.isGridEdit != "false" ) {
			this.options.isGridEdit = true;
			var conainer = new Element("div");
			conainer.setStyles({
				"width" : "98%",
				"height":"50px",
				"line-height":"100px",
				"text-align" : "center",
				"position": "absolute",
				"bottom":"40px"
			});
			this.gradEditPanelOK = new Element("input", {
				'name':'gradEditPanelOK',
				'type':'button',
				'value':'确定'
			}).addEvent('click',panelOKbuttonEvent.bind(this)).inject(conainer,"bottom");
			new Element("span").set("html","&nbsp;&nbsp;").inject(conainer);
			this.gradEditPanelCanel = new Element("input", {
				'name':'gradEditPanelCanel',
				'type':'button',
				'value':'取消'
			}).addEvent('click', function(e) {
				this.close();
			}.bind(this)).inject(conainer,"bottom");
			this.gradEditPanelOK.addClass("inputbtn");
			this.gradEditPanelCanel.addClass("inputbtn");
			conainer.inject(body);
		}
	}
});