var SwordLogger = new Class({
    Implements: [Events,Options],
    name: 'SwordLogger',
    options:{
        isShow: true,
        position: 'absolute',
        left: 80,
        top: 210,
        width: 1000,
        height: 300,
        maxLine: 100
    },
    initialize: function(options) {
        this.setOptions(options);
        this.buildLogger();
		
        window.document.addEvent('keydown', function(e) {
            if (e.key == "f2") {
                if (logger.loggerDiv.getStyle('display') == 'block')
                    logger.loggerDiv.setStyle('display', 'none');
                else
                    logger.loggerDiv.setStyle('display', 'block');
            }
        });
    },
    searchFlag: {
        debug: true,
        info: true,
        warn: true,
        error: true,
        fatal: true,
        profile: true
    },
    profiler: {},
    displayFlag: 'normal',
    selector: 'div[name=logger_Content]',
    loggerDiv: null,
    loggerCaptionDiv: null,
    loggerCaptionNameDiv: null,
    loggerCaptionToolsDiv: null,
    loggerCaptionToolsMinDiv: null,
    loggerCaptionToolsMaxDiv: null,
    loggerCaptionToolsNormalDiv: null,
    loggerCaptionToolsCloseDiv: null,
    loggerTitleDiv: null,
    loggerTitleDebugCHK: null,
    loggerTitleInfoCHK: null,
    loggerTitleWarnCHK: null,
    loggerTitleErrorCHK: null,
    loggerTitleFatalCHK: null,
    loggerTitleProfileCHK: null,
    loggerTitleModuleSelect: null,
    loggerTitleFuncSelect: null,
    loggerTitleMsgText: null,
    loggerTitleMsgBtn: null,
    loggerTitleMinBtn: null,
    loggerTitleMaxBtn: null,
    loggerTitleCloseBtn: null,
    loggerAreaDiv: null,
	loggerAreaModelLineDiv: null,
    loggerTailDiv: null,
    loggerTailLoadDiv: null,
    loggerTailLoadCHK: null,
    loggerTailPositionDiv: null,
    loggerTailPositionCHK: null,
    loggerTailClearDiv: null,
    loggerTailClearBtn: null,
    loggerTailVersionDiv: null,
    loggerTailResizeDiv: null,
    buildLogger: function() {
        this.loggerDiv = new Element('div', {
            'class': 'logger',
            'styles':{
                'display':'block'
            }
        }).inject(document.body);
        this.loggerDiv.setStyles({
            position: this.options.position,
            width: this.options.width,
            height: this.options.height,
            top: this.options.top,
            left: this.options.left
        });
        this.buildCaption();
        this.buildTitle();
        this.buildContent();
        this.buildTail();
        this.buildCookie();
        this.buildDrag();
    },
    buildCaption: function() {
        this.loggerCaptionDiv = new Element('div', {
            'class': 'caption'
        }).inject(this.loggerDiv);

        this.loggerCaptionNameDiv = new Element('div', {
            'class': 'captionNameDiv'
        }).inject(this.loggerCaptionDiv);
        this.loggerCaptionNameDiv.appendText("SWORD V4.0日志面板");

        this.loggerCaptionToolsDiv = new Element('div', {
            'class': 'captionTools'
        }).inject(this.loggerCaptionDiv);

        this.loggerCaptionToolsCloseDiv = new Element('div', {
            'class': 'tools_closeBtn',
            'title': '关闭'
        }).inject(this.loggerCaptionToolsDiv);
        this.loggerCaptionToolsCloseDiv.addEvent('click', function(e) {
            this.loggerDiv.setStyles({
                display: 'none'
            });

            this.displayFlag = 'close';
        }.bind(this));

        this.loggerCaptionToolsMaxDiv = new Element('div', {
            'class': 'tools_maxBtn',
            'title': '最大化',
            'styles': {
                'visibility': 'inherit',
                'display': 'block'
            }
        }).inject(this.loggerCaptionToolsDiv);

        this.loggerCaptionToolsMaxDiv.addEvent('click', function(e) {
            var bodySizeX = $(document.body).getSize().x;
            var bodySizeY =  $(document.body).getSize().y;

            this.loggerAreaDiv.setStyles({
                'display': 'block'
            });
            this.loggerTailDiv.setStyles({
                'display': 'block'
            });
            this.loggerTitleDiv.setStyles({
                'display': 'block'
            });

            this.loggerAreaDiv.setStyles({
                'height': bodySizeY - this.loggerCaptionDiv.getSize().y - this.loggerTitleDiv.getSize().y - this.loggerTailDiv.getSize().y,
                'left': 0,
                'top': 0,
                'width': bodySizeX
            });

            this.loggerDiv.setStyles({
                'height': bodySizeY,
                'left': 0,
                'top': 0,
                'width': bodySizeX
            });

            this.loggerCaptionToolsMaxDiv.setStyles({
                'display': 'none'
            });
            this.loggerCaptionToolsNormalDiv.setStyles({
                'display': 'block'
            });
            this.loggerCaptionToolsMinDiv.setStyles({
                'display': 'block'
            });

            this.displayFlag = 'max';
        }.bind(this));
		
		this.loggerCaptionToolsNormalDiv = new Element('div', {
            'class': 'tools_normalBtn',
            'title': '正常化',
            'styles': {
                'visibility': 'inherit',
                'display': 'none'
            }
        }).inject(this.loggerCaptionToolsDiv);
        this.loggerCaptionToolsNormalDiv.addEvent('click', function(e) {
            this.loggerAreaDiv.setStyles({
                'display': 'block'
            });
            this.loggerTailDiv.setStyles({
                'display': 'block'
            });
            this.loggerTitleDiv.setStyles({
                'display': 'block'
            });

            this.loggerAreaDiv.setStyles({
                'height': this.options.height - this.loggerCaptionDiv.getSize().y - this.loggerTitleDiv.getSize().y - this.loggerTailDiv.getSize().y,
                'left': this.options.left,
                'top': this.options.top,
                'width': this.options.width
            });

            this.loggerDiv.setStyles({
                'height': this.options.height,
                'left': this.options.left,
                'top': this.options.top,
                'width': this.options.width
            });

            this.loggerCaptionToolsMaxDiv.setStyles({
                'display': 'block'
            });
            this.loggerCaptionToolsNormalDiv.setStyles({
                'display': 'none'
            });
            this.loggerCaptionToolsMinDiv.setStyles({
                'display': 'block'
            });

            this.displayFlag = 'normal';
        }.bind(this));

        this.loggerCaptionToolsMinDiv = new Element('div', {
            'class': 'tools_minBtn',
            'title': '最小化',
            'styles': {
                'visibility': 'inherit'
            }
        }).inject(this.loggerCaptionToolsDiv);

        this.loggerCaptionToolsMinDiv.addEvent('click', function(e) {
            var bodySizeX = $(document.body).getSize().x;
            var bodySizeY = $(document.body).getSize().y;

            this.loggerAreaDiv.setStyles({
                'display': 'none'
            });
            this.loggerTailDiv.setStyles({
                'display': 'none'
            });
            this.loggerTitleDiv.setStyles({
                'display': 'none'
            });

            this.loggerDiv.setStyles({
                'height': bodySizeY,
                'left': 0,
                'top': bodySizeY-this.loggerCaptionDiv.getSize().y,
                'width': this.options.width
            });

            this.loggerCaptionToolsMaxDiv.setStyles({
                'display': 'block'
            });
            this.loggerCaptionToolsNormalDiv.setStyles({
                'display': 'block'
            });
            this.loggerCaptionToolsMinDiv.setStyles({
                'display': 'none'
            });

            this.displayFlag = 'min';
        }.bind(this));
    },
    buildTitle: function() {
        this.loggerTitleDiv = new Element('div', {
            'class': 'title'
        }).inject(this.loggerDiv);

        this.loggerTitleDiv.appendText(" debug");
        this.loggerTitleDebugCHK = new Element('input', {
            'id': 'logger_level_debug',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleDebugCHK.addEvent('click', function(e) {
            if (this.loggerTitleDebugCHK.checked == true) {
                this.searchFlag.debug = true;
            } else {
                this.searchFlag.debug = false;
            }
            this.searchMessage();
        }.bind(this));

        this.loggerTitleDiv.appendText(" info");
        this.loggerTitleInfoCHK = new Element('input', {
            'id': 'logger_level_info',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleInfoCHK.addEvent('click', function(e) {
            if (this.loggerTitleInfoCHK.checked == true) {
                this.searchFlag.info = true;
            } else {
                this.searchFlag.info = false;
            }
            this.searchMessage();
        }.bind(this));


        this.loggerTitleDiv.appendText(" warn");
        this.loggerTitleWarnCHK = new Element('input', {
            'id': 'logger_level_warn',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleWarnCHK.addEvent('click', function(e) {
            if (this.loggerTitleWarnCHK.checked == true) {
                this.searchFlag.warn = true;
            } else {
                this.searchFlag.warn = false;
            }
            this.searchMessage();
        }.bind(this));

        this.loggerTitleDiv.appendText(" error");
        this.loggerTitleErrorCHK = new Element('input', {
            'id': 'logger_level_error',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleErrorCHK.addEvent('click', function(e) {
            if (this.loggerTitleErrorCHK.checked == true) {
                this.searchFlag.error = true;
            } else {
                this.searchFlag.error = false;
            }
            this.searchMessage();
        }.bind(this));

        this.loggerTitleDiv.appendText(" fatal");
        this.loggerTitleFatalCHK = new Element('input', {
            'id': 'logger_level_fatal',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleFatalCHK.addEvent('click', function(e) {
            if (this.loggerTitleFatalCHK.checked == true) {
                this.searchFlag.fatal = true;
            } else {
                this.searchFlag.fatal = false;
            }
            this.searchMessage();
        }.bind(this));

        this.loggerTitleDiv.appendText(" profile");
        this.loggerTitleProfileCHK = new Element('input', {
            'id': 'logger_level_profile',
            'type': 'checkbox',
            'name': 'logger_level',
            'checked': 'checked'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleProfileCHK.addEvent('click', function(e) {
            if (this.loggerTitleProfileCHK.checked == true) {
                this.searchFlag.profile = true;
            } else {
                this.searchFlag.profile = false;
            }
            this.searchMessage();
        }.bind(this));

        this.loggerTitleDiv.appendText(" 模块名称");
        this.loggerTitleModuleSelect = new Element('select', {

        }).inject(this.loggerTitleDiv);
        this.loggerTitleModuleSelect.addEvent('change', function(e) {
            this.searchMessage();
        }.bind(this));

        var tempAllOption = new Element('option', {
            'value': 'all',
            'text': '所有'
        }).inject(this.loggerTitleModuleSelect);

        this.loggerTitleDiv.appendText(" 函数名称");
        this.loggerTitleFuncSelect = new Element('select', {

        }).inject(this.loggerTitleDiv);
        this.loggerTitleFuncSelect.addEvent('change', function(e) {
            this.searchMessage();
        }.bind(this));

        var tempAllOption1 = new Element('option', {
            'value': 'all',
            'text': '所有'
        }).inject(this.loggerTitleFuncSelect);

        this.loggerTitleMsgText = new Element('input', {
            'type': 'text',
            'size': 3
        }).inject(this.loggerTitleDiv);
        this.loggerTitleMsgBtn = new Element('input', {
            'type': 'button',
            'size': 3,
            'value': '*查日志'
        }).inject(this.loggerTitleDiv);
        this.loggerTitleMsgBtn.addEvent('click', function(e) {
            this.searchMessage();
        }.bind(this));
    },
    buildContent: function() {
        this.loggerAreaDiv = new Element('div', {
            'class': 'area'
        }).inject(this.loggerDiv);

        var lineDiv = new Element('div', {
            'class': 'contentDiv',
            'name': 'logger_Area_title'
        }).inject(this.loggerAreaDiv);

        var loggerAreaLevelDiv = new Element('div', {
            'class': 'areaLevel'
        }).inject(lineDiv);

        loggerAreaLevelDiv.appendText("日志级别");

        var loggerAreaTimeDiv = new Element('div', {
            'class': 'areaTime'
        }).inject(lineDiv);

        loggerAreaTimeDiv.appendText("日志时间");

        var loggerAreaModuleDiv = new Element('div', {
            'class': 'areaModule'
        }).inject(lineDiv);

        loggerAreaModuleDiv.appendText("日志调用模块");

        var loggerAreaFuncDiv = new Element('div', {
            'class': 'areaFunc'
        }).inject(lineDiv);

        loggerAreaFuncDiv.appendText("日志调用函数");

        var loggerAreaMsgDiv = new Element('div', {
            'class': 'areaMsg'
        }).inject(lineDiv);

        loggerAreaMsgDiv.appendText("日志信息");
		
		this.loggerAreaModelLineDiv = lineDiv.clone();
		this.averageDivArray([loggerAreaLevelDiv,loggerAreaTimeDiv,loggerAreaModuleDiv,loggerAreaFuncDiv,loggerAreaMsgDiv]);
    },
    buildTail: function() {
        this.loggerTailDiv = new Element('div', {
            'class': 'tail'
        }).inject(this.loggerDiv);

        this.loggerTailLoadDiv = new Element('div', {
            'class': 'load'
        }).inject(this.loggerTailDiv);
        this.loggerTailLoadCHK = new Element('input', {
            'class': 'chk',
            'type': 'checkbox'
        }).inject(this.loggerTailLoadDiv);

        this.loggerTailLoadCHK.addEvent('click', function(e) {
            if (this.loggerTailLoadCHK.checked == true) {
                var loggerIsShowCookie = new Hash.Cookie('loggerIsShowCookie', {duration: 3600});
                loggerIsShowCookie.set('isShow', 'true');
                loggerIsShowCookie.save();
            } else {
                var loggerIsShowCookie = new Hash.Cookie('loggerIsShowCookie', {duration: 3600});
                loggerIsShowCookie.set('isShow', null);
                loggerIsShowCookie.save();
            }
        }.bind(this));
        this.loggerTailLoadDiv.appendText("页面加载显示     ");

        this.loggerTailPositionDiv = new Element('div', {
            'class': 'position'
        }).inject(this.loggerTailDiv);
        this.loggerTailPositionCHK = new Element('input', {
            'class': 'positionchk',
            'type': 'checkbox'
        }).inject(this.loggerTailPositionDiv);
        this.loggerTailPositionCHK.addEvent('click', function(e) {
            if (this.loggerTailPositionCHK.checked == true) {
                var loggerPositionCookie = new Hash.Cookie('loggerPositionCookie', {duration: 3600});
                loggerPositionCookie.set('position', this.options.position);
                loggerPositionCookie.set('left', this.options.left);
                loggerPositionCookie.set('top', this.options.top);
                loggerPositionCookie.set('width', this.options.width);
                loggerPositionCookie.set('height', this.options.height);
                loggerPositionCookie.save();
            } else {
                var loggerPositionCookie = new Hash.Cookie('loggerPositionCookie', {duration: 3600});
                loggerPositionCookie.set('position', null);
                loggerPositionCookie.set('left', null);
                loggerPositionCookie.set('top', null);
                loggerPositionCookie.set('width', null);
                loggerPositionCookie.set('height', null);
                loggerPositionCookie.save();
            }
        }.bind(this));

        this.loggerTailPositionDiv.appendText("记住位置     ");

        this.loggerTailClearDiv = new Element('div', {
            'class': 'clear'
        }).inject(this.loggerTailDiv);

        this.loggerTailClearBtn = new Element('input', {
            'class': 'btn',
            'type': 'button',
            'value': 'clear'
        }).inject(this.loggerTailClearDiv);

        this.loggerTailClearBtn.addEvent('click', function(e) {
            this.clearMessage();
        }.bind(this));

        this.loggerTailResizeDiv = new Element('div', {
            'class': 'resize',
			'text': ' '
        }).inject(this.loggerTailDiv);
        this.loggerTailResizeDiv.addEvent('mousedown', function(e) {
			var tempResizeDiv = new Element('div',{
				'styles':{
					'position': 'absolute',
					'z-index': 999999,
					'left': this.loggerDiv.getPosition().x,
					'top': this.loggerDiv.getPosition().y,
					'width': this.loggerDiv.getSize().x,
					'height': this.loggerDiv.getSize().y,
					'border': '1px solid red'
				}
			}).inject(document.body);
            var tempX = e.client.x;
            var tempY = e.client.y;
			var tempWidth = this.loggerDiv.getSize().x;
			var tempHeight = this.loggerDiv.getSize().y;
			var resetSizeFun = function(e) {
	            var tempAfterX = e.client.x;
	            var tempAfterY = e.client.y;
	            tempResizeDiv.setStyle('width',tempWidth + tempAfterX - tempX);
	            tempResizeDiv.setStyle('height',tempHeight + tempAfterY - tempY);
	        };
			var resetSizeFun1 = resetSizeFun.bind(this);//这里增加一个变量的目的是resetSizeFun.bind(this)和resetSizeFun是不一样的
            document.addEvent('mousemove', resetSizeFun1);
			var resizeUpFun = function(e) {
				this.loggerDiv.setStyles({
	                width: tempResizeDiv.getStyle('width').toInt(),
	                height: tempResizeDiv.getStyle('height').toInt()
	            });
	            this.loggerAreaDiv.setStyles({
	                width: tempResizeDiv.getStyle('width').toInt(),
	                height: (tempResizeDiv.getStyle('height').toInt() - 16 - 20 - 16) + "px"
	            });
				tempResizeDiv.destroy();
                document.removeEvent('mousemove', resetSizeFun1);
				document.removeEvent('mouseup', resizeUpFun2);
            };
			var resizeUpFun2 = resizeUpFun.bind(this);
            document.addEvent('mouseup', resizeUpFun2);
        }.bind(this));
        this.loggerTailVersionDiv = new Element('div', {
            'class': 'version'
        }).inject(this.loggerTailDiv);
        this.loggerTailVersionDiv.appendText("SWORD V4.0");
    },
    buildCookie: function() {
        var loggerIsShowCookie = new Hash.Cookie('loggerIsShowCookie', {duration: 3600});
        loggerIsShowCookie.load();
        if (loggerIsShowCookie.get('isShow') == 'true') {
            this.loggerDiv.setStyles({
                'display': 'block'
            });
            this.loggerTailLoadCHK.checked = true;
        } else {
            this.loggerDiv.setStyles({
                'display': 'none'
            });
            this.loggerTailLoadCHK.checked = false;
        }

        var loggerPositionCookie = new Hash.Cookie('loggerPositionCookie', {duration: 3600});
        loggerPositionCookie.load();

        if ($defined(loggerPositionCookie.get('position'))) {
            this.options.position = loggerPositionCookie.get('position');
            this.options.height = loggerPositionCookie.get('height');
            this.options.width = loggerPositionCookie.get('width');
            this.options.left = loggerPositionCookie.get('left');
            this.options.top = loggerPositionCookie.get('top');
            this.loggerDiv.setStyles({
                'position': this.options.position,
                'height': this.options.height + "px",
                'left': this.options.left + "px",
                'top': this.options.top + "px",
                'width': this.options.width + "px"
            });
            this.loggerTailPositionCHK.checked = true;
        } else {
            this.loggerTailPositionCHK.checked = false;
        }
    },
    buildDrag: function() {
        new Drag(this.loggerDiv, {
            handle: this.loggerCaptionDiv,
            onComplete: function(el) {
                if (this.displayFlag == 'normal') {
                    this.options.left = el.getPosition().x;
                    this.options.top = el.getPosition().y;
                    if (this.loggerTailPositionCHK.checked == true) {
                        var loggerPositionCookie = new Hash.Cookie('loggerPositionCookie', {duration: 3600});
                        loggerPositionCookie.set('left', this.options.left);
                        loggerPositionCookie.set('top', this.options.top);
                        loggerPositionCookie.save();
                    }
                }
            }.bind(this)
        });
    },
    debug: function(msg, module, func, time) {
        this.addMessage('debug', msg, module, func, time);
    },
    info: function(msg, module, func, time) {
        this.addMessage('info', msg, module, func, time);
    },
    warn: function(msg, module, func, time) {
        this.addMessage('warn', msg, module, func, time);
    },
    error: function(msg, module, func, time) {
        this.addMessage('error', msg, module, func, time);
    },
    fatal: function(msg, module, func, time) {
        this.addMessage('fatal', msg, module, func, time);
    },
    profile: function(msg, module, func,time) {
		if(!$defined(time)){
			time = new Date();
		}
        if ($defined(this.profiler[msg])) {
            this.profiler[msg].endTime = time;
            this.profiler[msg].endModuleName = module;
            this.profiler[msg].endFuncName = func;
            this.addMessage('profile', msg, this.profiler[msg].beginModuleName + "->" + this.profiler[msg].endModuleName, this.profiler[msg].beginFuncName + "->" + this.profiler[msg].endFuncName, this.profiler[msg].endTime - this.profiler[msg].beginTime);
            delete this.profiler[msg];
        } else {
            this.profiler[msg] = {
                beginTime: time,
                beginModuleName: module,
                beginFuncName: func,
                endTime: null,
                endModuleName: null,
                endFuncName: null,
                key: msg
            };
            return;
        }
    },
    addMessage: function(type, msg, module, func, time) {
        var displayFlag = "none";
        var moduleSelect = this.loggerTitleModuleSelect.getSelected()[0].value;
        var funcSelect = this.loggerTitleFuncSelect.getSelected()[0].value;
        var msgText = this.loggerTitleMsgText.value;
        if (this.searchFlag[type] == true
                && (moduleSelect == "all" || (moduleSelect != "all" && moduleSelect.contains(module)))
                && (funcSelect == "all" || (funcSelect != "all" && funcSelect.contains(func)))
                && (!$chk(msgText) || ($chk(msgText) && msgText.contains(msg)))
                ) {
            displayFlag = "block";
        } else {
            displayFlag = "none"
        }
		
		
		/*
        var levelDiv = new Element('div', {
            'class': 'contentDiv',
            'name': 'logger_Content',
            'type': type,
            'func': (func == undefined) ? "undefined" : func,
            'module': (module == undefined) ? "undefined" : module,
            'msg':msg
        }).inject(this.loggerAreaDiv);
        levelDiv.setStyles({
            'display': displayFlag
        });
		levelDiv.addClass("logger_" + type);

        var tempLevelDiv = new Element('div', {
            'class': 'areaLevel'
        }).inject(levelDiv);
        tempLevelDiv.appendText(type);

        var tempTimeDiv = new Element('div', {
            'class': 'areaTime'
        }).inject(levelDiv);
        var nowDate = new Date();
        var nowDateStr = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds() + " " + nowDate.getMilliseconds()
        if ($chk(time)) {
            tempTimeDiv.appendText(time);
        } else {
            tempTimeDiv.appendText(nowDateStr);
        }

        var tempModuleDiv = new Element('div', {
            'class': 'areaModule'
        }).inject(levelDiv);
        tempModuleDiv.appendText(module);

        var tempFuncDiv = new Element('div', {
            'class': 'areaFunc'
        }).inject(levelDiv);
        tempFuncDiv.appendText(func);

        var tempMsgDiv = new Element('div', {
            'class': 'areaMsg'
        }).inject(levelDiv);
        tempMsgDiv.appendText(msg);
        
        */
		
		
		var lineDiv = this.loggerAreaModelLineDiv.clone().inject(this.loggerAreaDiv);
		lineDiv.addClass("logger_" + type);
		lineDiv.setProperties({
		    'name': 'logger_Content',
            'type': type,
            'func': (func == undefined) ? "undefined" : func,
            'module': (module == undefined) ? "undefined" : module,
            'msg':msg
		});
		lineDiv.setStyles({
            'display': displayFlag
        });
		
		var tempLevelDiv = lineDiv.getElement('div[class=areaLevel]');
		tempLevelDiv.empty();
		tempLevelDiv.appendText(type);
		
		var tempTimeDiv = lineDiv.getElement('div[class=areaTime]');
		tempTimeDiv.empty();
        var nowDate = new Date();
        var nowDateStr = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds() + " " + nowDate.getMilliseconds()
        if ($chk(time)) {
            tempTimeDiv.appendText(time);
        } else {
            tempTimeDiv.appendText(nowDateStr);
        }
		
		var tempModuleDiv = lineDiv.getElement('div[class=areaModule]');
		tempModuleDiv.empty();
		tempModuleDiv.appendText(module);
		
		var tempFuncDiv = lineDiv.getElement('div[class=areaFunc]');
		tempFuncDiv.empty();
		tempFuncDiv.appendText(func);
		
		var tempMsgDiv = lineDiv.getElement('div[class=areaMsg]');
		tempMsgDiv.empty();
		tempMsgDiv.appendText(msg);
		
		
        if ($chk(module)) {
            if (module.contains("->")) {
                module.split("->").each(function(item, index) {
                    this.addModule(item);
                }.bind(this));
            }
            else {
                this.addModule(module);
            }
        }
        if ($chk(func)) {
            if (func.contains("->")) {
                func.split("->").each(function(item, index) {
                    this.addfunc(item);
                }.bind(this));
            }
            else {
                this.addfunc(func);
            }
        }
		this.averageDivArray([tempLevelDiv,tempTimeDiv,tempModuleDiv,tempFuncDiv,tempMsgDiv]);
		this.scrollArea();
    },
	scrollArea: function(){
		this.loggerAreaDiv.scrollTo(0, this.loggerAreaDiv.getScrollSize().y);
	},
	averageDivArray: function(divArray){
/*		var displayFlag = this.loggerDiv.getStyle('display');
		this.loggerDiv.setStyle('display','block');//由于必须在显示的时候,也就是display='block',才有高度,否则item.getSize().y为空,所以先让其显示,然后再说
		var max = 0;
		divArray.each(function(item, index) {
           (item.getSize().y > max) ? (max = item.getSize().y) : (max = max);
        });
		divArray.each(function(item, index) {
           item.setStyles({
                'height': max
            });
        });
		this.loggerDiv.setStyle('display',displayFlag);*/
	},
    addModule: function(moduleName) {
        if (!$chk(moduleName)) {
            return;
        }
        if (this.loggerTitleModuleSelect.getElements("option[value=" + moduleName + "]").length > 0) {
            return;
        }
        var tempAllOption = new Element('option', {
            'value': moduleName,
            'text': moduleName
        }).inject(this.loggerTitleModuleSelect);
    },
    addfunc: function(funcName) {
        if (!$chk(funcName)) {
            return;
        }
        if (this.loggerTitleFuncSelect.getElements("option[value=" + funcName + "]").length > 0) {
            return;
        }
        var tempAllOption1 = new Element('option', {
            'value': funcName,
            'text': funcName
        }).inject(this.loggerTitleFuncSelect);
    },
    clearMessage: function() {
        this.loggerAreaDiv.getElements("div[name=logger_Content]").each(function(item, index) {
            item.destroy();
        });
		this.loggerTitleModuleSelect.getElements("option").each(function(item, index) {
            if(item.value != "all"){
				item.destroy();
			}
        });
		this.loggerTitleFuncSelect.getElements("option").each(function(item, index) {
            if(item.value != "all"){
				item.destroy();
			}
        });
    },
    searchMessage: function() {
        var typeStr = "";
        if (this.searchFlag.debug == false) {
            typeStr += "[type!=debug]";
        }
        if (this.searchFlag.info == false) {
            typeStr += "[type!=info]";
        }
        if (this.searchFlag.warn == false) {
            typeStr += "[type!=warn]";
        }
        if (this.searchFlag.error == false) {
            typeStr += "[type!=error]";
        }
        if (this.searchFlag.fatal == false) {
            typeStr += "[type!=fatal]";
        }
        if (this.searchFlag.profile == false) {
            typeStr += "[type!=profile]";
        }

        var moduleName = this.loggerTitleModuleSelect.getSelected()[0].value;
        var moduleStr = "";
        if (moduleName == "all") {
            moduleStr = "";
        } else {
            moduleStr = "[module*=" + this.loggerTitleModuleSelect.getSelected()[0].value + "]";
        }

        var funcName = this.loggerTitleFuncSelect.getSelected()[0].value;
        var funcStr = "";
        if (funcName == "all") {
            funcStr = "";
        } else {
            funcStr = "[func*=" + this.loggerTitleFuncSelect.getSelected()[0].value + "]";
        }

        var msgStr = "";
        if ($chk(this.loggerTitleMsgText.value)) {
            msgStr = "[msg*=" + this.loggerTitleMsgText.value + "]";
        } else {
            msgStr = "";
        }
		
		//alert("div[name=logger_Content]" + typeStr + moduleStr + funcStr + msgStr);
        this.selector = "div[name=logger_Content]" + typeStr + moduleStr + funcStr + msgStr;

        this.loggerAreaDiv.getElements("div[name=logger_Content]").each(function(item, index) {
            item.setStyles({
                'display': 'none'
            });
        });


        this.loggerAreaDiv.getElements(this.selector).each(function(item, index) {
            item.setStyles({
                'display': 'block'
            });
        });
    }

});




