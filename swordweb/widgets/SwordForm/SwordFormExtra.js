var fileUpload = new Class(
		{
			Implements : [ Events, Options ],
			name : 'fileUpload',
			options : {
				pNode : null,
				name : null,
				rule : null,
				css : null,
				isMulti : 'true',
				maxSize : 0,// 默认不限制上传个数
				size : null, // input file 的size属性
				keepfile : 'false',// 选择完后是否保留原状态
				vType : null
			// 定义文件的校验提示类型
			},
			initialize : function(options) {
				this.htmlOptions(options);
			},
			uploadButton : null,
			uploadContent : null,
			uploadTempContent : null,
			uploadLoading : null,
			selectFile : null,
			uploadForm : null,
			iframeKey : 'FileUploadCommitIframe',
			wrap : null,
			innerWrap : null,
			parent : null,
			box : null,
			initParam : function(item, parent) {
				this.parent = parent;
				this.wrap = new Element(
						'div',
						{
							'name' : this.options.name,
							'class' : 'uploadGroup formselect-list swordform_item_oprate',
							'widgetGetValue' : 'true',
							'rule' : this.options.rule,
							'widget' : true,
							'keepfile' : this.options.keepfile,
							'styles' : {
								'float' : 'left'
							}
						}).inject(this.options.pNode);
				this.wrap.store("parent", parent);
				this.innerWrap = new Element('div', {
					'class' : 'formselect-list-inner'
				}).inject(this.wrap);
				this.parseFileRow("init");
				sword_convertHTML(this.box, item);
				if (item.get("size")) {
					this.options.size = item.get("size");
					this.box.set("size", this.options.size);
				}
				this.options.vType = this.options.vType || "intime";
				return this;
			},
			reset : function() {
				this.innerWrap.getElements("input[type='file']").each(
						function(el) {
							el.set("value", "");
						});
			},
			disable : function(wrapEl) {
				wrapEl.getElements("input").set('disabled', true);
			},
			enable : function(wrapEl) {
				wrapEl.getElements("input").set('disabled', false);
			},
			resetElStatus : function(el) {
				this.wrap = el.store("parent", this.parent);
				this.innerWrap = this.wrap.getFirst();
				this.innerWrap
						.getElements("input[type='button']")
						.each(
								function(el) {
									if (el.get('value') == "增加") {
										this.box = el
												.addEvent(
														'click',
														function() {
															this
																	.parseFileRow("add");
															this.parent
																	.reSizeRow(this.options.pNode
																			.getParents("div.swordform_row_div")[0]);
														}.bind(this));
									} else if (el.get('value') == "取消") {
										el
												.addEvent(
														"click",
														function(e) {
															new Event(e).target
																	.getParent(
																			"div")
																	.destroy();
															this.parent
																	.reSizeRow(this.options.pNode
																			.getParents("div.swordform_row_div")[0]);
														}.bind(this));
									}
								}.bind(this));
			},
			getValue : function() {
				var re = "";
				this.wrap.getElements("input[type='file']").each(function(el) {
					re = ((re == "") ? re : (re + ",")) + el.get("value");
				});
				return re;
			},
			// 生成文件上传或者展现的一行
			parseFileRow : function(bz) {
				var row = new Element('div', {
					'class' : 'formselect-list-item'
				}).inject(this.innerWrap);
				var input = new Element('input', {
					'type' : 'file',
					'name' : this.options.name,
					'rule' : this.options.rule
				}).inject(row);
				this.box = input;
				if (this.options.size != null)
					this.box.set("size", this.options.size);
				// this.box.addEvent('blur', this.fileValidator.bind(this));
				this.box.addEvent('change', this.fileValidator.bind(this));
				var loadedDiv = new Element("span", {
					'class' : 'fileuploadloaded'
				}).inject(row);
				if (bz == "init" && this.options.isMulti == "true") {
					// todo 第一个文件上传的地方没办法取消 暂时注释 等合适的时候再开放
					// new Element('input',
					// {'type':'button','value':'取消','events':{
					// 'click':function(e) {
					// var input = new Event(e).target.getPrevious("input");
					// var el = input.clone(true);
					// input.getParent().insertBefore(el, input);
					// input.destroy();
					// }.bind(this)
					// }}).inject(row);
					var btn = new Element(
							'input',
							{
								'type' : 'button',
								'value' : '增加',
								'events' : {
									'click' : function() {
										if (this.options.maxSize > 0
												&& this.innerWrap.getChildren().length >= this.options.maxSize) {
											alert("您最多只能上传"
													+ this.options.maxSize
													+ "个文件。");
											return;
										}
										this.parseFileRow("add");
										this.parent
												.reSizeRow(this.options.pNode
														.getParents("div.swordform_row_div")[0]);
									}.bind(this)
								}
							}).inject(row);
				} else if (bz == "add") {
					var btn = new Element(
							'input',
							{
								'type' : 'button',
								'value' : '取消',
								'events' : {
									'click' : function(e) {
										new Event(e).target.getParent("div")
												.destroy();
										this.parent
												.reSizeRow(this.options.pNode
														.getParents("div.swordform_row_div")[0]);
									}.bind(this)
								}
							}).inject(row);
				}

			},
			initEvent:function(){
				var addEl=this.box.getParent().getElement('input[type="button"]');
				addEl.addEvent('click',function(e){
					if (this.options.maxSize > 0
							&& this.innerWrap.getChildren().length >= this.options.maxSize) {
						alert("您最多只能上传"+ this.options.maxSize+ "个文件。");
						return;
					}
					this.parseFileRow("add");
					this.parent
					.reSizeRow(this.options.pNode
							.getParents("div.swordform_row_div")[0]);
				}.bind(this));
			},
			fileValidator : function(e) {
				var target = new Event(e).target;
				if ($defined(target.get("rule"))) {
					var value = target.get("value");
					var Vobj = pc.widgetFactory.create("SwordValidator");
					Vobj.initParam(this.options.vType);
					if ($chk(value)) {
						var validator = Vobj.doValidate(target);
						if (validator.state == true) {
							Vobj.clearElTip(target);
						} else {
							Vobj.tooltips.createTip(target, validator.msg);
						}
					} else {
						Vobj.clearElTip(target);
					}
				}
			},
			// 初始化文件列表
			initData : function() {
				// 如果列表展现不是由程序员来定义,组件负责初始化数据，否则由页面容器来初始化数据
			},
			loading : function() {
				var p = this.selectFile.getPosition();
				if (this.uploadContent.getStyle('display') == 'none') {
					this.uploadContent.setStyles({
						'display' : '',
						'height' : '35px'
					});
					this.uploadLoading.setStyles({
						'display' : '',
						'left' : p.x + 10,
						'top' : p.y + this.selectFile.getHeight(),
						'width' : '300px',
						'height' : '35px'
					});
				} else {
					var p1 = this.uploadContent.getPosition();
					var w = this.uploadContent.getWidth();
					var h = this.uploadContent.getHeight();
					this.uploadLoading.setStyles({
						'display' : '',
						'left' : p1.x,
						'top' : p1.y,
						'width' : w + 5,
						'height' : h + 35
					});
				}
			},
			endLoding : function() {
				this.uploadLoading.setStyle('display', 'none');
			},
			// 转换单位
			setupSize : function(size) {
				var sizename = new Array("B", " KB", " MB", " GB", " TB",
						" PB", " EB", " ZB", " YB");
				var times = 0;
				while (size >= 1024) {
					size = size / 1024;
					times++;
				}
				if (times > 0) {
					return size.toFixed(2) + sizename[times];
				} else {
					return size + sizename[times];
				}
			}
		});
var FormBlockArea = new Class({
	Implements : [ Events, Options ],
	name : 'formblock',
	options : {
		pNode : null,
		caption : null,
		isHide : null,
		name : null,
		isShow : null
	},
	initialize : function(options) {
		this.setOptions(options);
	},
	legendFx : null,// 隐藏的特效
	fieldset : null,
	legend : null,
	initParam : function() {
		var fb = new Element("div", {
			'class' : 'swordform_block',
			'name' : this.options.name
		}).inject(this.options.pNode);
		var fbt = new Element("div", {
			'class' : 'swordform_block_top'
		}).inject(fb);
		fbt.set('html', "<div class='l'></div><div class='r'></div>");
		var fbc = new Element("div", {
			'class' : 'swordform_block_center'
		}).inject(fb);
		var fbc_l = new Element("div", {
			'class' : 'll'
		}).inject(fbc);
		var fbc_r = new Element("div", {
			'class' : 'rr'
		}).inject(fbc_l);
		var fbb = new Element("div", {
			'class' : 'swordform_block_bottom'
		}).inject(fb);
		fbb.set('html', "<div class='l'></div><div class='r'></div>");
		if (this.options.isShow == "false") {
			fb.setStyle("display", "none");
		}
		return fbc_r;
	}
});

var SwordPanel = new Class({
	Implements : [ Events, Options ],
	name : 'SwordPanel',
	options : {
		pNode : null,
		caption : null
	},
	tc : null,
	initialize : function(options) {
		this.setOptions(options);
	},
	initParam : function() {
		var panel = new Element('div', {
			'class' : 'swordform-panel-box'
		}).inject(this.options.pNode);
		var tl = new Element('div', {
			'class' : 'swordform-panel-tl'
		}).inject(panel);
		var tr = new Element('div', {
			'class' : 'swordform-panel-tr'
		}).inject(panel);
		this.tc = new Element('div', {
			'class' : 'swordform-panel-title'
		}).appendText(this.options.caption || '').inject(panel);
		return this;
	},
	updateTitle : function(t) {
		this.tc.set('text', t);
	}
});
var Textarea = new Class(
		{
			Implements : [ Events, Options ],
			name : "textarea",
			options : {
				css : null,
				scroll : false,
				pNode : null,
				name : null,
				rule : null,
				bizValidate : 'false',
				biztid : null,
				bizctrl : null,
				msg : null,
				defValue : null,
				edit : null,
				maxLength : null
			},
			defWidth : 500,// 默认宽度
			defHeight : 120,// 默认高度
			box : null,
			countSpan : null,
			parent : null,
			initialize : function(options) {
				this.htmlOptions(options);
			},
			initParam : function(parent) {
				this.parent = parent;
				this.box = new Element('textarea', {
					'class' : 'swordform_item_oprate swordform_item_textarea',
					'name' : this.options.name,
					'rule' : this.options.rule,
					'bizValidate' : this.options.bizValidate,
					'biztid' : this.options.biztid,
					'bizctrl' : this.options.bizctrl,
					'msg' : this.options.msg,
					'widget' : "true"
				}).inject(this.options.pNode);
				if ((this.options.rule || "").indexOf("must") > -1
						&& parent.options.requiredSign == "field") {
					new Element("span", {
						'styles' : {
							'color' : 'red',
							'float' : 'left'
						},
						'html' : "*"
					}).inject(this.options.pNode);
				}
				/*
				 * if($chk(this.options.css)) { this.box.set('style',
				 * this.options.css); } else {
				 * this.box.setStyles({'width':this.defWidth,'height':this.defHeight}); }
				 * if(this.box.getWidth().toInt() > parent.dftsize.TdWidth) {
				 * this.options.pNode.getParent().setStyle("width", "");
				 * this.box.setStyle('float', 'left'); }
				 */

				if (this.options.edit == "false") {
					this.box.set('disabled', true);
				}
				if (parent.isVal() && $defined(this.options.rule)) {
					Sword.utils.createElAfter(this.options.pNode);
				}
				if ($defined(this.options.maxLength)) {
					var div = new Element(
							"div",
							{
								'html' : "您还可以输入<span class='textarea_maxLength_count'>"
										+ this.options.maxLength + "</span>字",
								'class' : 'textarea_maxLength_wrap'
							}).inject(this.options.pNode);
					this.countSpan = div
							.getElement('span.textarea_maxLength_count');
				}
				if ($defined(this.options.defValue)) {
					this.initData(this.options.defValue);
				}
				return this.box;
			},
			maxLengthCount : function(e) {
				if (this.getStringUTFLength(this.getValue()) > this.options.maxLength / 1) {
					if (e) {
						try {
							with (window.event || e) {
								cancelBubble = true;
								keyCode = 0;
								returnValue = false;
							}
						} catch (ex) {
						}
					}
					this.box.set("value", this.leftUTFString(this.getValue(),
							this.options.maxLength / 1));
				}
				var len = this.options.maxLength / 1
						- this.getStringUTFLength(this.getValue());
				this.countSpan.set("text", (len >= 0) ? len : 0);
				if (len == 0)
					this.countSpan.getParent().setStyle('color', 'red');
				else
					this.countSpan.getParent().setStyle('color', '#333');
			},
			leftUTFString : function(str, len) {
				if (this.getStringUTFLength(str) <= len) {
					return str;
				}
				var value = str.substring(0, len);
				while (this.getStringUTFLength(value) > len) {
					value = value.substring(0, value.length - 1);
				}
				return value;
			},
			getStringUTFLength : function(str) {
				var v = str.replace(/[\u4e00-\u9fa5]/g, "  "); // 在swordform_extend.js中修改为一个汉字占三个字符。
				return v.length;
			},
			initData : function(value) {
				if (!$defined(value))
					value = "";
				value = value.replace(/&apos;/g, "'");
				this.box.set('value', value);
				if ($defined(this.options.maxLength))
					this.maxLengthCount();
				return this.box;
			},
			getValue : function() {
				return this.box.get("value");
			},
			reset : function() {
				this.initData("");
				this.parent.Vobj.clearElTip(this.box);
			},
			focus : function() {
				this.box.focus();
			},

			initEvent : function() {
			if ($defined(this.options.maxLength)) {
				this.box.addEvent('blur', this.maxLengthCount.bind(this));
				this.box.addEvent('change', this.maxLengthCount.bind(this));
				this.box.addEvent("keyup", this.maxLengthCount.bind(this));
			}
		}

		});
var SwordGroupFields = new Class({
	Implements : [ Events, Options ],
	name : 'groupfields',
	options : {
		tag : null,
		pNode : null,
		data : null,
		dataname : null,
		validate : null,
		name : null,
		rule : null,
		type : null,
		colWidth : null,
		col : 1,
		onClickBefore : null,
		onClickAfter : null,
		sbmitcontent : null,
		msg : null,
		defValue : null,
		disable : 'false'
	},
	initialize : function(options) {
		this.htmlOptions(options);
	},
	wrap : null,
	innerWrap : null,
	parent : null,
	initParam : function(itemD, parent) {
		this.parent = parent;
		this.options.validate = parent.Vobj;
		this.options.tag = itemD.get("type");
		this.options.opts = itemD.getChildren(">div");
		this.wrap = new Element('div', {
			'name' : this.options.name,
			'class' : 'formselect-list swordform_item_oprate',
			'rule' : this.options.rule,
			'widget' : 'true',
			'msg' : this.options.msg,
			'widgetGetValue' : 'true',
			'ruleType' : this.options.type + 'Group'
		/*
		 * 'styles':{ 'width':parent.dftsize.FiledWidth.toInt() + 5 }
		 */}).inject(this.options.pNode);
		this.innerWrap = new Element('div', {
			'defValue' : this.options.defValue,
			'class' : 'formselect-list-inner'/*
												 * , 'styles':{
												 * 'width':parent.dftsize.FiledWidth.toInt() +
												 * 5 }
												 */
		}).inject(this.wrap);
		if ((this.options.rule || "").indexOf("must") > -1
				&& parent.options.requiredSign == "field") {
			new Element("span", {
				'styles' : {
					'color' : 'red',
					'float' : 'left'
				},
				'html' : "*"
			}).inject(this.options.pNode);
		}
		/*
		 * 只有在formde userDefine!="true"的情况下
		 * 调用initOptionsData;
		 */
		if (this.options.opts.length > 0&&this.parent.options.userDefine!="true")
			this.initOptionsData(this.options.opts);
		if (parent.isVal() && $defined(this.options.rule)) {
			Sword.utils.createElAfter(this.options.pNode);
		}
		if (this.options.disable == 'true')
			this.disable();
		return this;
	},
	initalizeData : null,
	initalized : false,
	initData : function(d) {
		if ((Browser.Engine.trident4 || Browser.Engine.trident5)
				&& arguments.length == 1) {
			this.parent.lazyInitData.set(this.options.name, d);
			return;
		}
		var dv = this.innerWrap.get("defValue");
		if (d == "" && $defined(dv))
			d = dv;
		if (d.indexOf(",") == -1)
			d = d + ",1";
		d = d.toHash();
		if ($type(d) == "hash") {
			this.initalizeData = d;
			this.reset();
			d.each(function(v, k) {
				if (v / 1 == 1) {
					var inp = this.innerWrap.getElement("input[value='" + k
							+ "']");
					if (inp) {
						inp.set("checked", true);
						inp.getParent().addClass('formselect-selected');
					}
				}
			}, this);
		}
		this.parent.lazyInitData.erase(this.options.name);
		this.initalizeData = null;
	},
	initOptionsData : function(data) {
		/*
		 * if(this.options.col == -1) { var wdh = 150 * data.length + 50;
		 * if($defined(this.options.colWidth)) { wdh =
		 * this.options.colWidth.toInt() * data.length + 5; }
		 * this.wrap.setStyle('width', wdh); this.innerWrap.setStyle('width',
		 * wdh); }
		 */
		this.clearOptions();
		data.each(function(item, idx) {
            var row = new Element('div', {'class':'formselect-list-item'}).inject(this.innerWrap);
            if($defined(this.options.colWidth)) row.setStyles({/*'float':'left',*/'width':this.options.colWidth});
            var code,caption;
            if($type(item) == 'element') {
                code = item.get('code');
                caption = item.get('caption');
            } else {
                code = item['code'];
                caption = item['caption'];
            }
            row.set({'code':code,'caption':caption});
            if(this.options.tag != 'multiselect') {
                var input = new Element('input', {'type':this.options.type,'rule':this.options.rule,'ruleType':this.options.type + 'Group','name':this.options.name}).inject(row);
                input.setStyle('cursor','pointer');
                row.addEvent('click', function(e) {
                    if(this.options.disable == "true")return;
                    var tar = new Event(e).target;
                    if(this.options.rule){
                    	this.options.validate.tooltips.hide(this.options.name)
                    	this.options.validate.intimeValidate(tar);
                    }
                    if(['div','span'].contains(tar.get("tag")))return;
                    if($defined(this.options.onClickBefore))
                        this.getFunc(this.options.onClickBefore)[0](code, caption, tar);
                    if(input.get('type') == 'checkbox') {
                        if(input.get("checked")) {
                            if(tar != input) {
                                if(!$chk(input.get('disabled')))input.set("checked", false);
                                input.getParent().removeClass('formselect-selected');
                            }
                            else  input.getParent().addClass('formselect-selected');
                        }
                        else {
                            if(tar != input) {
                                if(!$chk(input.get('disabled')))input.set("checked", true);
                                input.getParent().addClass('formselect-selected');
                            }
                            else  input.getParent().removeClass('formselect-selected');
                        }
                    } else {
                        if(!$chk(input.get('disabled'))) {
                            this.reset();
                            input.getParent().addClass('formselect-selected');
                            input.set("checked", true);
                        }
                    }
                    if($defined(this.options.onClickAfter))
                        this.getFunc(this.options.onClickAfter)[0](code, caption, tar);
                }.bind(this));
                if(this.options.rule)this.options.validate._add(input);
                input.set('value', code);
            } else {
                row.addEvent('click', function() {
                    if(this.options.disable == "true")return;
                    if($defined(this.options.onClickBefore))
                        this.getFunc(this.options.onClickBefore)[0](code, caption);
                    row.getParent().getElements("div").each(function(itemDivItem) {
                        itemDivItem.removeClass('formselect-selected');
                    }, this);
                    row.addClass('formselect-selected');
                    if($defined(this.options.onClickAfter))
                        this.getFunc(this.options.onClickAfter)[0](code, caption);
                }.bind(this));

            }
            new Element("span", {'text':caption, 'title':caption}).inject(row);
            this.parent.reSizeRow(this.options.pNode.getParents("div.swordform_row_div")[0]);
        }, this);
		if (this.initalizeData != null) {
			this.initData(this.initalizeData, "ie6");
		}
		if (this.options.defValue != null) {
			this.initData(this.options.defValue);
		}
		return this;
	},
	initEvent : function() {
		var rows = this.innerWrap.getElements("div.formselect-list-item");
		rows.each(function(row, idx) {
			if ($defined(this.options.colWidth))
				row.setStyles({/* 'float':'left', */
					'width' : this.options.colWidth
				});
			row.addEvent('click', function(e) {
				var code = row.get("code");
				var caption = row.get("caption");
				if(this.options.disable == "true")return;
                var tar = $(new Event(e).target);
                if(this.options.rule){
                	this.options.validate.tooltips.hide(this.options.name)
                	this.options.validate.intimeValidate(tar);
                }
                if(['div','span'].contains(tar.get("tag")))return;
                if($defined(this.options.onClickBefore))
                    this.getFunc(this.options.onClickBefore)[0](code, caption, tar);
                if(tar.get('type') == 'checkbox') {
                    if(tar.get("checked")) {
//                        if(tar != input) {
//                            if(!$chk(input.get('disabled')))input.set("checked", false);
//                            tar.getParent().removeClass('formselect-selected');
//                        } else  
                        	tar.getParent().addClass('formselect-selected');
                    }
                    else {
//                        if(tar != input) {
//                            if(!$chk(input.get('disabled')))input.set("checked", true);
//                            tar.getParent().addClass('formselect-selected');
//                        } else  
                        	tar.getParent().removeClass('formselect-selected');
                    }
                } else {
                    if(!$chk(tar.get('disabled'))) {
                        this.reset();
                        tar.getParent().addClass('formselect-selected');
                        tar.set("checked", true);
                    }
                }
                if($defined(this.options.onClickAfter))
                    this.getFunc(this.options.onClickAfter)[0](code, caption, tar);
			}.bind(this));
		}, this);
	},
	validate : function() {

	},
	getValue : function(isChecked) {
		var re = "", inp;
		this.wrap.getElements("div.formselect-list-item").filter(
				function(row) {
					inp = row.getElements('input')[0];
					if (isChecked == false)
						return ($defined(inp)) ? inp.get('checked') != true
								: !row.hasClass("formselect-selected");
					return ($defined(inp)) ? inp.get('checked') == true : row
							.hasClass("formselect-selected");
				}).each(function(row) {
			if (re == "")
				re += this.genarateContent({
					'code' : row.get('code'),
					'caption' : row.get('caption')
				});
			else
				re += "," + this.genarateContent({
					'code' : row.get('code'),
					'caption' : row.get('caption')
				});
		}.bind(this));
		return re;
	},
	getAllValue : function(isChecked) {
		var re = [], inp;
		this.wrap.getElements("div.formselect-list-item").filter(
				function(row) {
					inp = row.getElements('input')[0];
					if (isChecked == false)
						return ($defined(inp)) ? inp.get('checked') != true
								: !row.hasClass("formselect-selected");
					return ($defined(inp)) ? inp.get('checked') == true : row
							.hasClass("formselect-selected");
				}).each(function(row) {
			re.include({
				'code' : row.get('code'),
				'caption' : row.get('caption')
			});
		}.bind(this));
		return re;
	},
	genarateContent : function(obj) {
		var content = this.options.sbmitcontent;
		if (!$defined(content))
			content = "{code}";
		return content.substitute(obj);
	},
	reset : function() {
		this.wrap.getElements("div.formselect-list-item").each(function(row) {
			if (row.getElement("input"))
				row.getElement("input").set("checked", false);
			row.removeClass("formselect-selected");
		});
	},
	getChildrenEl : function() {
		var name = this.options.name || this.innerWrap.get("name");
		var type = this.options.type || this.innerWrap.get("type");
		return this.innerWrap.getElements('input[name=' + name
				+ '][type=' + type + ']');
	},
	disable : function() {
		this.options.disable = "true";
		this.getChildrenEl().set('disabled', true);
	},
	enable : function() {
		this.options.disable = "false";
		this.getChildrenEl().set('disabled', false);
	},
	clearOptions : function() {
		this.innerWrap.getElements("*").each(function(el) {
			el.destroy();
		});
	}
});
