

Swiff.Uploader = new Class({

	Extends: Swiff,

	Implements: Events,

	options: {
		path: jsR.rootPath+'swordweb/widgets/SwordFileUpload2/Swiff.Uploader.swf',

		target: null,
		zIndex: 9999,

		callBacks: null,
		params: {
			wMode: 'opaque',
			menu: 'false',
			allowScriptAccess: 'always'
		},

		typeFilter: null,
		multiple: true,
		queued: true,
		verbose: false,
		height: 30,
		width: 100,
		passStatus: null,

		url: 'upload.sword?ctrl=FileHandleCtrl_save&swordFileMaxSize=-1&swordUploadMaxSize=-1&postData={"ctrl":"FileHandleCtrl_save"}',
		method: null,
		data: null,
		mergeData: true,
		fieldName: null,

		fileSizeMin: 1,
		fileSizeMax: 4*1024*1024, // -1是无限制，一般建议设置此值
		allowDuplicates: false,
		timeLimit: (Browser.Platform.linux) ? 0 : 30,

		policyFile: null,
		buttonImage: null,

		fileListMax: 0,
		fileListSizeMax: 0,

		instantStart: false,
		appendCookieData: false,

		fileClass: null   ,
        downloadCtrl:null,
        /*deleteTid:null,
        deleteCtrl:null,*/

		onLoad: $empty,
		onFail: $empty,
		onStart: $empty,
		onQueue: $empty,
		onComplete: $empty,
		onBrowse: $empty,
		onDisabledBrowse: $empty,
		onCancel: $empty,
		onSelect: $empty,
		onSelectSuccess: $empty,
		onSelectFail: $empty,

		onButtonEnter: $empty,
		onButtonLeave: $empty,
		onButtonDown: $empty,
		onButtonDisable: $empty,

		onFileStart: $empty,
		onFileStop: $empty,
		onFileRequeue: $empty,
		onFileOpen: $empty,
		onFileProgress: $empty,
		onFileComplete: $empty,
		onFileRemove: $empty,
        onFileSuccess: $empty,

		onBeforeStart: $empty,
		onBeforeStop: $empty,
		onBeforeRemove: $empty
	},

    initData:function(){
	},

	initialize: function(options) {
		// protected events to control the class, added
		// before setting options (which adds own events)
		this.addEvent('load', this.initializeSwiff, true)
			.addEvent('select', this.processFiles, true)
			.addEvent('complete', this.update, true)
			.addEvent('fileRemove', function(file) {
				this.fileList.erase(file);
			}.bind(this), true);

		this.setOptions(options);

		// callbacks are no longer in the options, every callback
		// is fired as event, this is just compat
		if (this.options.callBacks) {
			Hash.each(this.options.callBacks, function(fn, name) {
				this.addEvent(name, fn);
			}, this);
		}

		this.options.callBacks = {
			fireCallback: this.fireCallback.bind(this)
		};

		var path = this.options.path;
		if (!path.contains('?')) path += '?noCache=' + $time(); // cache in IE

		// container options for Swiff class
		this.options.container = this.box = new Element('span', {'class': 'swiff-uploader-box'}).inject($(this.options.container) || document.body);

		// target
		this.target = $(this.options.target);
		if (this.target) {
			var scroll = window.getScroll();
			this.box.setStyles({
				position: 'absolute',
				visibility: 'visible',
				zIndex: this.options.zIndex,
				overflow: 'hidden',
				height: 1, width: 1,
				top: scroll.y, left: scroll.x
			});

			// we force wMode to transparent for the overlay effect
			this.parent(path, {
				params: {
					wMode: 'transparent'
				},
				height: '100%',
				width: '100%'
			});

			this.target.addEvent('mouseenter', this.reposition.bind(this, []));

			// button interactions, relayed to to the target
			this.addEvents({
				buttonEnter: this.targetRelay.bind(this, ['mouseenter']),
				buttonLeave: this.targetRelay.bind(this, ['mouseleave']),
				buttonDown: this.targetRelay.bind(this, ['mousedown']),
				buttonDisable: this.targetRelay.bind(this, ['disable'])
			});

			this.reposition();
			window.addEvent('resize', this.reposition.bind(this, []));
		} else {
			this.parent(path);
		}

		this.inject(this.box);

		this.fileList = [];

		this.size = this.uploading = this.bytesLoaded = this.percentLoaded = 0;

		if (Browser.Plugins.Flash.version < 9) {
			this.fireEvent('fail', ['flash']);
		} else {
			this.verifyLoad.delay(1000, this);
		}
	},

	verifyLoad: function() {
		if (this.loaded) return;
		if (!this.object.parentNode) {
//            Swiff.Uploader.log('js: in verifyLoad disabled!!!!!');
			this.fireEvent('fail', ['disabled']);
		} else if (this.object.style.display == 'none') {
//             Swiff.Uploader.log('js: in verifyLoad hidden!!!!!');
			this.fireEvent('fail', ['hidden']);
		} else if (!this.object.offsetWidth) {
//             Swiff.Uploader.log('js: in verifyLoad empty!!!!!');
			this.fireEvent('fail', ['empty']);
		}
	},

	fireCallback: function(name, args) {
//         Swiff.Uploader.log('js: in fireCallback : '+name);
		// file* callbacks are relayed to the specific file
		if (name.substr(0, 4) == 'file') {
			// updated queue data is the second argument
			if (args.length > 1) this.update(args[1]);
			var data = args[0];

			var file = this.findFile(data.id);
			this.fireEvent(name, file || data, 5);
			if (file) {
				var fire = name.replace(/^file([A-Z])/, function($0, $1) {
					return $1.toLowerCase();
				});
				file.update(data).fireEvent(fire, [data], 10);
			}
		} else {
			this.fireEvent(name, args, 5);
		}
	},

	update: function(data) {
		// the data is saved right to the instance
		$extend(this, data);
		this.fireEvent('queue', [this], 10);
		return this;
	},

	findFile: function(id) {
		for (var i = 0; i < this.fileList.length; i++) {
			if (this.fileList[i].id == id) return this.fileList[i];
		}
		return null;
	},

	initializeSwiff: function() {
		// extracted options for the swf
		this.remote('xInitialize', {
			typeFilter: this.options.typeFilter,
			multiple: this.options.multiple,
			queued: this.options.queued,
			verbose: this.options.verbose,
			width: this.options.width,
			height: this.options.height,
			passStatus: this.options.passStatus,
			url: this.options.url,
			method: this.options.method,
			data: this.options.data,
			mergeData: this.options.mergeData,
			fieldName: this.options.fieldName,
			fileSizeMin: this.options.fileSizeMin,
			fileSizeMax: this.options.fileSizeMax,
			allowDuplicates: this.options.allowDuplicates,
			timeLimit: this.options.timeLimit,
			policyFile: this.options.policyFile,
			buttonImage: this.options.buttonImage
		});
		this.loaded = true;

		this.appendCookieData();
	},

	targetRelay: function(name) {
		if (this.target) this.target.fireEvent(name);
	},

	reposition: function(coords) {
		// update coordinates, manual or automatically
		coords = coords || (this.target && this.target.offsetHeight)
			? this.target.getCoordinates(this.box.getOffsetParent())
			: {top: window.getScrollTop(), left: -9999, width: 40, height: 40}
		this.box.setStyles(coords);
		this.fireEvent('reposition', [coords, this.box, this.target]);
        },

	setOptions: function(options) {
		if (options) {
			if (options.url) options.url = Swiff.Uploader.qualifyPath(options.url);
			if (options.buttonImage) options.buttonImage = Swiff.Uploader.qualifyPath(options.buttonImage);
			this.parent(options);
			if (this.loaded) this.remote('xSetOptions', options);
		}
		return this;
	},

	setEnabled: function(status) {
		this.remote('xSetEnabled', status);
	},

	start: function() {
		this.fireEvent('beforeStart');
		this.remote('xStart');
	},

	stop: function() {
		this.fireEvent('beforeStop');
		this.remote('xStop');
	},

	remove: function() {
		this.fireEvent('beforeRemove');
		this.remote('xRemove');
	},

	fileStart: function(file) {
		this.remote('xFileStart', file.id);
	},

	fileStop: function(file) {
		this.remote('xFileStop', file.id);
	},

	fileRemove: function(file) {
		this.remote('xFileRemove', file.id);
	},

	fileRequeue: function(file) {
		this.remote('xFileRequeue', file.id);
	},

	appendCookieData: function() {
		var append = this.options.appendCookieData;
		if (!append) return;

		var hash = {};
		document.cookie.split(/;\s*/).each(function(cookie) {
			cookie = cookie.split('=');
			if (cookie.length == 2) {
				hash[decodeURIComponent(cookie[0])] = decodeURIComponent(cookie[1]);
			}
		});

		var data = this.options.data || {};
		if ($type(append) == 'string') data[append] = hash;
		else $extend(data, hash);

		this.setOptions({data: data});
	},

	processFiles: function(successraw, failraw, queue) {
		var cls = this.options.fileClass || Swiff.Uploader.File;

		var fail = [], success = [];

		if (successraw) {
			successraw.each(function(data) {
				var ret = new cls(this, data);
				if (!ret.validate()) {
					ret.remove.delay(10, ret);
					fail.push(ret);
				} else {
					this.size += data.size;
					this.fileList.push(ret);
					success.push(ret);
					ret.render();
				}
			}, this);

			this.fireEvent('selectSuccess', [success], 10);
		}

		if (failraw || fail.length) {
			fail.extend((failraw) ? failraw.map(function(data) {
				return new cls(this, data);
			}, this) : []).each(function(file) {
				file.invalidate().render();
			});


            fail.each(function(file) {
                new Element('li', {
                            'class': 'file-invalid',
                            events: {
                                click: function() {
                                    this.destroy();
                                }
                            }
                        }).adopt(
                        new Element('span', {html: file.validationErrorMessage || file.validationError})
                ).inject(this.list, 'bottom');
            }, this);
            //选择出错时候触发
			this.fireEvent('selectFail', [fail], 10);
		}

		this.update(queue);

		if (this.options.instantStart && success.length) this.start();
	}

});

$extend(Swiff.Uploader, {

	STATUS_QUEUED: 0,
	STATUS_RUNNING: 1,
	STATUS_ERROR: 2,
	STATUS_COMPLETE: 3,
	STATUS_STOPPED: 4,

	log: function() {
		if (window.console && console.info) console.info.apply(console, arguments);
//        alert(arguments[0]);
	},

	unitLabels: {
		b: [{min: 1, unit: 'B'}, {min: 1024, unit: 'kB'}, {min: 1048576, unit: 'MB'}, {min: 1073741824, unit: 'GB'}],
		s: [{min: 1, unit: 's'}, {min: 60, unit: 'm'}, {min: 3600, unit: 'h'}, {min: 86400, unit: 'd'}]
	},

	formatUnit: function(base, type, join) {
		var labels = Swiff.Uploader.unitLabels[(type == 'bps') ? 'b' : type];
		var append = (type == 'bps') ? '/s' : '';
		var i, l = labels.length, value;

		if (base < 1) return '0 ' + labels[0].unit + append;

		if (type == 's') {
			var units = [];

			for (i = l - 1; i >= 0; i--) {
				value = Math.floor(base / labels[i].min);
				if (value) {
					units.push(value + ' ' + labels[i].unit);
					base -= value * labels[i].min;
					if (!base) break;
				}
			}

			return (join === false) ? units : units.join(join || ', ');
		}

		for (i = l - 1; i >= 0; i--) {
			value = labels[i].min;
			if (base >= value) break;
		}

		return (base / value).toFixed(1) + ' ' + labels[i].unit + append;
	}
    ,createFileUi:function(id,name,size){
        var ui={};
        ui.element = new Element('li', {'class': 'file', id: 'file-' + id});
		ui.title = new Element('span', {'class': 'file-title', text: name});
        ui.del = new Element('span', {'class': 'file-delete','styles':{'display':'none','cursor':'pointer'}});
		//if(size)ui.size = new Element('span', {'class': 'file-size', text: "("+Swiff.Uploader.formatUnit(size, 'b')+")"});

        ui.element.addEvents({
                                    'mouseover': function() {
                                        if(ui.progress)return;
                                        ui.del.setStyle('display','');
                                                   }.bind(this),
                                    'mouseout': function() {
                                        if(ui.progress)return;
                                        ui.del.setStyle('display','none');
                                                   }.bind(this)
         });


         ui.element.adopt(
			ui.title,
			//ui.size,
            ui.del
		);

        return ui;

    }
    ,uiAddOverOutEvent:function(ui,bindObj){
    	if(ui.element){
    		ui.element.addEvents({
	            'mouseover': function() {
	                if(ui.progress)return;
	                ui.del.setStyle('visibility','visible');
	                if(ui.detail) ui.detail.setStyle('visibility','visible');
		            		  }.bind(this),
	            'mouseout': function() {
	                if(ui.progress)return;
	                ui.del.setStyle('visibility','hidden');
	                if(ui.detail) ui.detail.setStyle('visibility','hidden');
	                           }.bind(this)
	    	});
    	}
    }
    
    ,uiAddEvent:function(ui,bindObj){
    	this.uiAddOverOutEvent(ui,bindObj);
    	if(ui.element){
	    	ui.element.addEvents('click', function() {
				this.remove();
				return false;
			}.bind(bindObj));
    	}
		if(ui.cancel){
			ui.cancel.addEvent('click', function() {
				this.remove();
				return false;
			}.bind(bindObj));
		}
        if(ui.del){
        	ui.del.addEvent('click',function(){
        		if(this.isTmp(ui)){
	                 Swiff.Uploader.deleteTmp(this.res.getAttr("fileId"),this.base, function() {
	                     this.remove();
	                 }.bind(this));
	             }else{   //调用业务注册的删除方法,暂时不用调用，因为保存时候提交即可
	                  this.remove();
	                  if($chk(ui.element.get("datamap"))){
	                	  var tempTarget=this.base.options.deleteCtrl||this.base.options.deleteTid;
	                	  if($chk(tempTarget)){
	                		  Swiff.Uploader.deleteF(tempTarget,this.base,this.getSubmitData(ui),this.base.form,function(){
		                    	  var elid=ui.element.get("id");
			                	  this.onRemove();
			                	  this.base.fileList.each(function(item,i,a){
			                		  if(item&&item.id==elid)a.splice(i,1);
			                	  });
		                      }.bind(this));
	                	  }else{alert("服务初始化的文件数据必须走服务删除(请定义deleteCtrl或者deleteTid)");}
	                  }
	             }
        	}.bind(bindObj));
        }
        if(ui.detail){
        	ui.detail.addEvents({'click':function(e){
        			if(["jpg","JPG","bmp","png","jpeg","gif"].contains(this.extension)){
        				Swiff.Uploader.preview(e,this.base,this);
        			}
        		}.bind(bindObj)
        	});
        }
        if(ui.title){
        	ui.title.addEvents({'click':function(e){
        		if(!ui.element.getParent("div").hasClass("sword_file_upload2_disable")){
		        	this.isStopClick=false;
		        	this.base.fireEvent("onFileClick",[e,this.base,this]);
		        	if(this.base.imgView)this.base.imgView.setStyle("display","none");
//		        	if(["jpg","JPG","bmp","png","jpeg","gif"].contains(this.extension)){
//		        		Swiff.Uploader.preview(e,this.base,this);
//		        	}else
		        	if(!this.isStopClick){
			        	if(this.isTmp(ui)){
			                 Swiff.Uploader.downloadTmp(this.res.getAttr("fileId"),e.target.get("text"));
			             }else{   //调用业务的下载方法
			            	 if(this.base.options.downloadCtrl)
			                      Swiff.Uploader.download(this.base.options.downloadCtrl,this.base,this.getSubmitData(ui),this.base.form);
			             }
		        	}
        		}
	        }.bind(bindObj),
	        'dblclick':function(e){
	        	this.base.fireEvent("onFileDbClick",[e,this.base,this]);
	        }.bind(bindObj),
	        'mouseenter':function(e){
	        	this.base.fireEvent("onFileMouseOver",[e,this.base,this]);
	        }.bind(bindObj),
	        'mouseleave':function(e){
	        	this.base.fireEvent("onFileMouseOut",[e,this.base,this]);
	        }.bind(bindObj),
	        'mousedown':function(e){
	        	if ( e.event.button == 2 ){
            		e.preventDefault();
            		this.base.fireEvent("onFileRightClick", [e,this.base,this]);
            		document.oncontextmenu = function() {return false;};
            	}
	        }.bind(bindObj)
	        });
        }
        
    }
    , deleteTmp:function(fileId,onSubmitAfter){
        var delSubmit = $submit(null,null,{"ctrl":"FileHandleCtrl_clearOne","onSubmitAfter":onSubmitAfter});
        delSubmit.pushData("fileId", fileId);
        delSubmit.submit();
    }

     , downloadTmp:function(fileId,fileName){
        var delSubmit = $submit(null,null,{"ctrl":"FileHandleCtrl_downloadOne",'postType':'download'});
        delSubmit.pushData("fileId", fileId);
        delSubmit.pushData("fileName", fileName);
        delSubmit.submit();
    }

     , download:function(ctrl,data){
        var delSubmit = $submit(null,null,{"ctrl":ctrl,'postType':'download'});
        delSubmit.pushData(data);
        delSubmit.submit();
    }

});

Swiff.Uploader.qualifyPath = (function() {

	var anchor;

	return function(path) {
		(anchor || (anchor = new Element('a'))).href = path;
		return anchor.href;
	};

})();

Swiff.Uploader.File = new Class({

	Implements: Events,

	initialize: function(base, data) {
		this.base = base;
		this.update(data);
	},

	update: function(data) {
		return $extend(this, data);
	},

	validate: function() {
		var options = this.base.options;

		if (options.fileListMax && this.base.fileList.length >= options.fileListMax) {
			this.validationError = 'fileListMax';
			return false;
		}

		if (options.fileListSizeMax && (this.base.size + this.size) > options.fileListSizeMax) {
			this.validationError = 'fileListSizeMax';
			return false;
		}

		return true;
	},

	invalidate: function() {
		this.invalid = true;
		this.base.fireEvent('fileInvalid', this, 10);
		return this.fireEvent('invalid', this, 10);
	},

	render: function() {
		return this;
	},

	setOptions: function(options) {
		if (options) {
			if (options.url) options.url = Swiff.Uploader.qualifyPath(options.url);
			this.base.remote('xFileSetOptions', this.id, options);
			this.options = $merge(this.options, options);
		}
		return this;
	},

	start: function() {
		this.base.fileStart(this);
		return this;
	},

	stop: function() {
		this.base.fileStop(this);
		return this;
	},

	remove: function() {
		this.base.fileRemove(this);
		return this;
	},

	requeue: function() {
		this.base.fileRequeue(this);
	}

});



if (!window.SwordUpload2) var SwordUpload2 = {};

SwordUpload2.Attach = new Class({

	Extends: Swiff.Uploader,

	options: {
		queued: false,
		instantStart: true
	},

	initialize: function(p,list, selects, options) {
        if(p){
            this.list = p.getElement(list);
            this.selects =p.getElements(selects);
        } else{
            this.list = $(list);
            this.selects = $(selects) ? $$($(selects)) : $$(selects);
        }

		options.target = this.selects[0];
		options.fileClass = options.fileClass || SwordUpload2.Attach.File;

		this.parent(options);

        this.addEvent('onFileRequeue', function(file) {  //点击重试时候触发
            file.ui.element.getElement('.file-error').destroy();

            file.ui.cancel.set('html', '取消').removeEvents().addEvent('click', function() {
                file.remove();
                return false;
            });

            this.start();
        }.bind(this));

		/**
		 * Button state
		 */
		var self = this;

		this.selects.addEvents({
			click: function() {
				return false;
			},
			mouseenter: function() {
				this.addClass('hover');
				self.reposition();
			},
			mouseleave: function() {
				this.removeClass('hover');
				this.blur();
			},
			mousedown: function() {
				this.focus();
			}
		});

		if (this.selects.length == 2) {
			this.selects[1].setStyle('display', 'none');
			this.addEvents({
				'selectSuccess': this.onSelectSuccess,
				'fileRemove': this.onFileRemove
			});
		}
	},

	onSelectSuccess: function() {
		if (this.fileList.length > 0) {
			this.selects[0].setStyle('display', 'none');
			this.selects[1].setStyle('display', 'inline');
			this.target = this.selects[1];
			this.reposition();
		}
	},

	onFileRemove: function() {
		if (this.fileList.length == 0) {
			this.selects[0].setStyle('display', 'inline');
			this.selects[1].setStyle('display', 'none');
			this.target = this.selects[0];
			this.reposition();
		}
	},

	start: function() {
		if (Browser.Platform.linux && window.confirm(MooTools.lang.get('SwordUpload2', 'linuxWarning'))) return this;
		return this.parent();
	}

    ,getValue:function(){
                if(this.fileList.length==0)return '';
                var res=[];
                this.fileList.each(function(f){
                     var one={
                          'name':f.name
                         ,'fileId':f.res.getAttr('fileId')
                         ,'size':f.size
                         ,'status':f.status
                         ,'dataMap':$chk(f.ui.element.get("dataMap"))?JSON.decode(f.ui.element.get("dataMap")):null
                     };
                    res.push(one);
                });
                return JSON.encode(res);
    }
    ,reset:function(){
           
     }

});

SwordUpload2.Attach.File = new Class({

	Extends: Swiff.Uploader.File,

	render: function() {

		if (this.invalid) {
			if (this.validationError) {
				var msg = MooTools.lang.get('SwordUpload2', 'validationErrors')[this.validationError] || this.validationError;
				this.validationErrorMessage = msg.substitute({
					name: this.name,
					size: Swiff.Uploader.formatUnit(this.size, 'b'),
					fileSizeMin: Swiff.Uploader.formatUnit(this.base.options.fileSizeMin || 0, 'b'),
					fileSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileSizeMax || 0, 'b'),
					fileListMax: this.base.options.fileListMax || 0,
					fileListSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileListSizeMax || 0, 'b')
				});
			}
			this.remove();
			return;
		}

		this.addEvents({
			'open': this.onOpen,
			'remove': this.onRemove,
			'requeue': this.onRequeue,
			'progress': this.onProgress,
			'stop': this.onStop,
			'complete': this.onComplete,
			'error': this.onError
		});

        this.ui=Swiff.Uploader.createFileUi(this.id,this.name,this.size);

		this.ui.cancel = new Element('a', {'class': 'file-cancel', text: '取消', href: '#'}).inject(this.ui.element);

        this.ui.element.addEvents('click', function() {
			this.remove();
			return false;
		}.bind(this));
		this.ui.cancel.addEvent('click', function() {
			this.remove();
			return false;
		}.bind(this));
      

         this.ui.del.addEvent('click',function(){

             if(this.isTmp()){
                 Swiff.Uploader.deleteTmp(this.res.getAttr("fileId"), function() {
                     this.remove();
                 }.bind(this));
             }else{   //调用业务注册的删除方法,暂时不用调用，因为保存时候提交即可
                  this.remove();
             }


         }.bind(this));

        this.ui.title.addEvent('click',function(){

            if(this.isTmp()){
                 Swiff.Uploader.downloadTmp(this.res.getAttr("fileId"),this.name);
             }else{   //调用业务的下载方法
                  if(this.base.options.downloadCtrl)
                      Swiff.Uploader.download(this.base.options.downloadCtrl,this.getSubmitData());
             }

        }.bind(this));

        this.ui.element.inject(this.base.list).highlight();

		var progress = new Element('img', {'class': 'file-progress', src: jsR.rootPath+'swordweb/widgets/SwordFileUpload2/progress_bar.gif'}).inject(this.ui.title, 'after');
		this.ui.progress = new Fx.ProgressBar(progress, {
			fit: true
		}).set(0);

		this.base.reposition();

		return this.parent();
	},

    isTmp:function(){
        if(!this.grid)return false;
        if(this.grid.manager.getRow(this.grid.cell).get('status')=='insert')return true;
        var rowData=this.grid.manager.getOneRowData(this.grid.cell);
        var n= this.grid.name;
        if (!rowData.tds[n])return false;
        return rowData.tds[n].tmp == true;
    },

    getSubmitData:function(){
        if(this.grid){
           return this.grid.manager.getRowsGridData([this.grid.cell]);
        }
    },

	onOpen: function() {
		this.ui.element.addClass('file-uploading');
		if (this.ui.progress) this.ui.progress.set(0);
	},

	onRemove: function() {
		this.ui = this.ui.element.destroy();
	},

	onProgress: function() {
		if (this.ui.progress) this.ui.progress.start(this.progress.percentLoaded);
	},

	onStop: function() {
		this.remove();
	},

	onComplete: function() {
		this.ui.element.removeClass('file-uploading');

		if (this.response.error) {
			var msg = MooTools.lang.get('SwordUpload2', 'errors')[this.response.error] || '{error} #{code}';
			this.errorMessage = msg.substitute($extend({name: this.name}, this.response));

            this.ui.cancel.set('html', '重试').removeEvents().addEvent('click', function() {
                this.requeue();
                return false;
            }.bind(this));

            new Element('span', {
                        html: this.errorMessage,
                        'class': 'file-error'
                    }).inject(this.ui.cancel, 'after');

            //传输出错时候触发
			this.base.fireEvent('fileError', [this, this.response, this.errorMessage]);
			this.fireEvent('error', [this, this.response, this.errorMessage]);
			return;
		}

		if (this.ui.progress) this.ui.progress = this.ui.progress.cancel().element.destroy();
		this.ui.cancel = this.ui.cancel.destroy();

		var response = this.response.text || '';
        this.ui.element.highlight('#e6efc2');

        var res=new Element('div').set('html',response).getElement('div[id=SwordPageData]').get('data');
        res=JSON.decode(res);
        res.getAttr=pc.getAttrFunc;
        this.res=res;
//        this.ui.element.store('res',res);

        //传输成功完成触发
		this.base.fireEvent('fileSuccess', [this, this.res]);
	},

	onError: function() {
		this.ui.element.addClass('file-failed');
	}


});

//Avoiding MooTools.lang dependency
(function() {

	var phrases = {
		'fileName': '{name}',
		'cancel': '取消',
		'cancelTitle': '单机进行取消',
		'validationErrors': {
			'duplicate': '文件 <em>{name}</em> 已经上传过了，请不要重复上传.',
			'sizeLimitMin': '文件 <em>{name}</em> (<em>{size}</em>) 太小了，不满足最小文件限制： {fileSizeMin}.',
			'sizeLimitMax': '文件 <em>{name}</em> (<em>{size}</em>) 太大了， 请上传小于 <em>{fileSizeMax}</em> 的文件.',
			'fileListMax': '文件 <em>{name}</em> 没有上传, 超过了最大数量限制： <em>{fileListMax} files</em> ，请删除已经上传的文件再上传.',
			'fileListSizeMax': '文件 <em>{name}</em> (<em>{size}</em>) 太大了, 超过了上传文件总大小 <em>{fileListSizeMax}</em> ，请删除一些或者挑小一些的文件上传.'
		},
		'errors': {
			'httpStatus': '出错了，服务器返回的状态码： #{code}',
			'securityError': 'Security error occured ({text})',
			'ioError': 'Error caused a send or load operation to fail ({text})'
		},
		'linuxWarning': 'Warning: Due to a misbehaviour of Adobe Flash Player on Linux,\nthe browser will probably freeze during the upload process.\nDo you want to start the upload anyway?'
	};

	if (MooTools.lang) {
//		MooTools.lang.set('en-US', 'SwordUpload2', phrases);
	} else {
		MooTools.lang = {
			get: function(from, key) {
				return phrases[key];
			}
		};
	}

})();


function file2OptionsReset(op,item){
	var newop={};
    for (var key in op) {
        var v = item.getAttribute(key);
        if (v == 'true') {
            newop[key] = true;
            continue;
        }
        if (v == 'false') {
            newop[key] = false;
            continue;
        }

        if('typeFilter'==key&&v){
            newop[key] = JSON.decode(v);
            continue;
        }

        if ((/^on[A-Z]/).test(key) && v) {
            var methods = sword_getFunc(v);
            if (methods.length > 0)newop[key] = methods[0];
            continue;
        }

        newop[key] = ($chk(v) && $defined(v)) ? v : op[key];
    }
    return newop;
}

//后台渲染file2对象创建
function initUp4Template(wrapDiv,item,tempEl,form){
	 var op=SwordUpload2.Attach.prototype.options;
	 var newop=file2OptionsReset(op,item);
	 var up = new SwordUpload2.Attach(wrapDiv,'[name=up-list]', '[name=up-attach]', newop);
	 up.form=form;
	 up.con=tempEl ;
	 var rule=item.get('rule');
	 if(rule) up.con.set('rule',rule);
	 var msg = item.get('msg');
	 if(msg) up.con.set('msg',msg);
	 up.con.store('upManager',up);
	 return up;
}

function initIntimeUp(p,name,item){
    var addCaption=item.get('addCaption')||'添加文件';
    var op=SwordUpload2.Attach.prototype.options;
    var newop=file2OptionsReset(op,item);
    
    var t=item.get('title')||'';
    if(t)t='title="'+t+'"';

    p.set('html','<div '+t+' name="'+name+'" class="sword_file_upload2" style="background-color:;"> <ul name="up-list" class="up-list"></ul> <a style=" color:blue;text-decoration: underline;" name="up-attach" >'+addCaption+'</a></div>');
    var up = new SwordUpload2.Attach(p,'[name=up-list]', '[name=up-attach]', newop);
    up.con=p.getElement('div.sword_file_upload2') ;
    var rule=item.get('rule');
    if(rule) up.con.set('rule',rule);
    var msg = item.get('msg');
    if(msg) up.con.set('msg',msg);
    up.con.store('upManager',up);
    //up.box.inject(p);
    return up;
}

/*function initIntimeUp(p,name,item){
    var addCaption=item.get('addCaption')||'添加文件';
    var op=SwordUpload2.Attach.prototype.options;
    var newop={};
    for (var key in op) {
        var v = item.getAttribute(key);
        if (v == 'true') {
            newop[key] = true;
            continue;
        }
        if (v == 'false') {
            newop[key] = false;
            continue;
        }

        if('typeFilter'==key&&v){
            newop[key] = JSON.decode(v);
            continue;
        }

        if ((/^on[A-Z]/).test(key) && v) {
            var methods = sword_getFunc(v);
            if (methods.length > 0)newop[key] = methods[0];
            continue;
        }

        newop[key] = ($chk(v) && $defined(v)) ? v : op[key];
    }


    p.set('html','<div name="'+name+'" class="sword_file_upload2"> <ul name="up-list" class="up-list"></ul> <a style=" color:blue;text-decoration: underline;" name="up-attach" >'+addCaption+'</a></div>');
    var up = new SwordUpload2.Attach(p,'[name=up-list]', '[name=up-attach]', newop);
    up.con=p.getElement('div.sword_file_upload2') ;
    var rule=item.get('rule');
    if(rule) up.con.set('rule',rule);
    up.con.store('upManager',up);
    //up.box.inject(p);
    return up;
}*/

