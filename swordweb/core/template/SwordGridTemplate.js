/**
 * SwordGrid的模板描述
 */

var SwordGrid_OTemplate = {
	'row_tree' : '<div status="${status}" class="sGrid_data_row_div " row="true"  pageNum="${_|pageNum}">',
	'row_shuang' : '<div status="${status}" class="sGrid_data_row_div  sGrid_data_row_div_shuang   " row="true"  pageNum="${_|pageNum}">',
	'row_dan' : '<div status="${status}" class="sGrid_data_row_div  sGrid_data_row_div_dan   " row="true"  pageNum="${_|pageNum}">',
	'div_end' : '</div>'
};

var SwordGridRender = new Class(
		{

			Implements : [ Options ]

			,name : "SwordGridRender"

			,options : {
				gridObj : null// 容器
				,gName:null
			}
		   ,formats : new Hash() ///format与juicer解析冲突，每列的format放在该对象中方便获取

		   ,initialize : function(options) {
				this.setOptions(options);
				if (!this.options.gridObj)throw new Error("SwordGridRender 初始化必须要传入 gridObj");
				this.g = this.options.gridObj;
				this.options.gName = this.options.gridObj.options.name;
				this.fieldRender = new SwordGridFields({
					'gridObj' : this.options.gridObj,
					'gName': this.options.gName
				});
				this._showDataHandlers = {// 定义特殊数据处理器
					'checkbox' : this._checkbox_radioDataHandler.bind(this),
					'radio' : this._checkbox_radioDataHandler.bind(this),
					'date' : this._dateDataHandler.bind(this),
					'file2' : this._file2DataHandler.bind(this),
//					'password' : this._textDataHandler.bind(this),
					'pulltree' : this._pulltreeDataHandler.bind(this),
					'select' : this._selectDataHandler.bind(this)
				};
			}

			,render : function(datas, items) {
				if (!items)items = this.options.items;
				var rows = this._createRow(datas, items);
				var rowsFragment = STemplateEngine.createFragmentForGrid(rows,datas);
				this._renderAfter($$(rowsFragment.childNodes), datas, items);
				return rowsFragment;
			}

			,renderRow : function(rowData, items,status) {
				var h = this._createRow([rowData], items);
				var row = new Element('div', {
					'html' : h
				}).getFirst();
				if(status=="insert"){
					row.set("status",status);
					row.store('rowData', rowData);// 注册行数据
				}
				this._renderAfter([ row ], [ rowData ], items);

				return row;
			}

			,_renderAfter : function(rows, datas, items) {
				var self = this;
				var timeNum = 0,vartime=10;
				var len = datas.length;
				if(len==0)return;
				if(len<11){vartime=0;}
				setTimeout(function() {
					var row = rows[timeNum];
					if(row.get("status")=="deleting"||row.get("status")=="delete"){
						row.addClass('sGrid_data_row_delete_div');
					 }
					self._addRowFuncs(row, datas[timeNum]);
					self._renderCellAfter(datas[timeNum], row, items);
					self.g.fireEvent("onAfterCreateRow", [ datas[timeNum], row,
							self.g ]);
					timeNum = timeNum + 1;
					if (len > timeNum) {
						setTimeout(arguments.callee, 10);
					} else {
						// sometodo
						self.g.fireEvent('onAfterInitData');
					}
				}.bind(this), vartime);
			}
			,_renderRowAfter : function(row, rowData) {
				this._storeRowData(row, rowData);
				this._addRowFuncs(row, rowData);
			}
			,_storeRowData:function(row, rowData){
				row.store('rowData', rowData);// 注册行数据
			}
			,_addRowFuncs : function(row, rowData){
				this.g.addRowApi(row); // 添加行接口
				rowData.getValue = this._getValue;
			}

			,_renderCellAfter : function(rowData, row, items) {
				var i = 0, childs = $$(row.childNodes), len = childs.length;
				for (; i < len; i++) {
					var cell = childs[i];
					var name = cell.getAttribute('name');
					this.g.addCellApi(cell);
					this.g.fireEvent("onAfterCreateCell", [ rowData,rowData.getValue(name), cell, items[i] ]);
				}
			}

			,_createRow : function(datas, items) {
				var cellsDom = this.fieldRender.render(items,this.formats);
				var self = this;
				var gname = this.options.gName;
				juicer.register(gname+'pageNum', function() {
					return self.g.pageNum();
				}); // 注册自定义函数
				juicer.register(gname+'dataHandler', function() {
					// var args = Array.prototype.slice.call(arguments,2);若需要分割参数
					return self._findDataHandler(arguments[1]).apply(this,arguments);
				}); // 注册自定义函数
				var h = [];
				if (this.g.options.type != 'tree') {// 树形表格将不使用此逻辑
//					var row_shuang = [ SwordGrid_OTemplate['row_shuang'],
//					                   cellsDom, SwordGrid_OTemplate['div_end'] ].join("");
//					var row_dan = [ SwordGrid_OTemplate['row_dan'], cellsDom,
//							SwordGrid_OTemplate['div_end'] ].join("");
					var row_shuang = ['<div status="${status}" class="sGrid_data_row_div  sGrid_data_row_div_shuang   " row="true"  pageNum="${_|',gname,'pageNum}">',cellsDom,'</div>'].join("");
					var row_dan = [ '<div status="${status}" class="sGrid_data_row_div  sGrid_data_row_div_dan   " row="true"  pageNum="${_|',gname,'pageNum}">', cellsDom,'</div>'].join("");
					datas.each(function(rowData, i) { // IE9以上 数组没有字符串拼接快
						if (i % 2 == 0) { // 偶数行
							h.push(juicer(row_shuang, rowData));
						} else {// 奇数行 singular
							h.push(juicer(row_dan, rowData));
						}
					}, this);
				} else {
//					var row_tree = [ SwordGrid_OTemplate['row_tree'],cellsDom, SwordGrid_OTemplate['div_end'] ].join("");
					var row_tree = ['<div status="${status}" class="sGrid_data_row_div " row="true"  pageNum="${_|',gname,'pageNum}">',cellsDom, '</div>' ].join("");
					datas.each(function(rowData, i) { // IE9以上 数组没有字符串拼接快
						h.push(juicer(row_tree, rowData));
					}, this);
				}
				return h.join("");
			}
			,_getValue : function(name) {// 注册取值方法
				var tmp = this.tds[name];
				if (!$defined(tmp)) {
					return null;
				}
				return tmp['value'];
			}
			,_findDataHandler : function(type) {
				if(["rowNum","rowNumOnePage","userdefineName"].contains(type)){
					return $empty;
				}
				var typeHander=this._showDataHandlers[type];
				if (typeHander){return typeHander;}
				return this._defalutDataHandler.bind(this);
			}
			,_defalutDataHandler : function(rowData, type, name) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				if (!$chk(value))
					return ' title="" realvalue="" showValue=""></div>';
				var format = this.formats.get(name);
				var showValue = (value + "").replace(/&/g, "&amp;");
				if ($chk(format)) {
					showValue = sword_fmt.convertText(showValue, format).value;
				}
				if ($defined(showValue)
						&& $type(showValue) == "string"
						&& (showValue.indexOf(">") != -1 || showValue
								.indexOf("<")) != -1)
					showValue = (showValue.replace(/</g, "&lt;")).replace(/>/g,
							"&gt;");
				showValue = showValue.replace(/&/g, "&amp;");
				return ' title="' + showValue + '" realvalue="' + value
						+ '" showValue="' + showValue + '">' + showValue
						+ '</div>';
			}
			
			,_checkbox_radioDataHandler : function(rowData, type, name,
					userClicked, checkAllFlag) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				var html = "0";
				if ($chk(value) && value != "0") {
					html = "1";
				}
				var check;
				if (this.g.isCP() && userClicked == 'true') {// cache+前台分页+用户点击过表头checkbox
					checkAllFlag == 'true' ? check = "checked" : check = "";
				} else if (html == '1') {
					check = "checked";
				} else {
					check = "";
				}
				return check + ' value="' + html + '"/></div>';
			}
			,_textDataHandler : function(rowData, type, name) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				if (!$chk(value))
					return 'title="" realvalue="" showValue=""></div>';
				var format = this.formats.get(name);
				var showValue = (value + "").replace(/&/g, "&amp;");
				if ($chk(format)) {
					showValue = sword_fmt.convertText(showValue, format).value;
				}
				if ($defined(showValue)
						&& $type(showValue) == "string"
						&& (showValue.indexOf(">") != -1 || showValue
								.indexOf("<")) != -1)
					showValue = (showValue.replace(/</g, "&lt;")).replace(/>/g,
							"&gt;");
				showValue = showValue.replace(/&/g, "&amp;");
				return 'title="' + showValue + '" realvalue="' + value
						+ '" showValue="' + showValue + '">' + showValue
						+ '</div>';
			}
			,_dateDataHandler : function(rowData, type, name, dataformat,
					defValue, showCurDate, submitDateformat) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				var showValue = "";
				if ($chk(value)) {
					showValue = value;
				} else if ($chk(defValue)) {
					showValue = defValue;
				} else if (showCurDate == 'true') {
					showValue = SwordDataFormat.formatDateToString(new Date(),
							dataformat);
				}
				if ($chk(showValue)) {
					dataformat = dataformat || SwordCalendar.defaultdataformat;
					submitDateformat = submitDateformat || SwordCalendar.submitDateformat;
					if (showValue.split(".").length == 2) {
						showValue = showValue.split(".")[0];
					}
					showValue = SwordDataFormat.formatStringToString(showValue,
							submitDateformat, dataformat);
					return 'title="' + showValue + '" realvalue="' + value
							+ '" showValue="' + showValue + '">' + showValue
							+ '</div>';
				} else {
					return 'title="" realvalue="" showValue=""></div>';
				}
			}
			,_selectDataHandler : function(rowData, type, defValue, defIndex,
					paren, name, dataName) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				if (!($chk(value) || $chk(defValue) || $chk(defIndex)))
					return ' title=""  code="" realvalue="" ></div>';
				var item = this.g.getItemElByName(name)[0];
				var sel = this.g.getSelect();
				sel.grid = true;
				var pcode = this._getPcode(item, rowData);
				var tmp = sel.dm2mc(item, value, pcode);
				if ($type(tmp) == 'object') { // 找到数据了
					return ' title="' + tmp['caption'] + '"  code="'
							+ tmp['code'] + '" realvalue="' + tmp["realvalue"]
							+ '" >' + tmp['caption'] + '</div>';
				} else { // 没有数据
					return ' title=""  code="" realvalue="" ></div>';
				}
			}
			,_pulltreeDataHandler : function(rowData, type, name, treeName,
					checkbox) {
				var value = rowData['tds'][name];
				if (value)
					value = value.value;
				if (!$chk(value))return ' title="" realvalue=""></div>';
				if (value.contains("code") && value.contains("caption")) {
					var vs = value.split('|');
					var text = vs[1].split(',')[1];
					var code = vs[0].split(',')[1];
					return ' title="'+text+'" realvalue="'+code+'">'+text+'</div>';
				} else {
					var data = pc.getInitData(treeName)||JSON.decode($w(treeName).options.dataStr);
					if(data){
						data = data.data;
						if (checkbox == "true") {// checkbox树
							var rv = $splat(value.split(','));
							var caption = [];
							rv.each(function(r){
								data.each(function(item){
									if(item['code'] == r){
										caption.push(item['caption']);
									}
								});
							},this);
							caption = caption.join(',');
							if (caption == '')caption = rv;
							return ' title="'+caption+'" realvalue="'+rv+'">'+caption+'</div>';
						} else {
							var caption = value;
							var i = 0;len = data.length;
							for(;i<len;i++){
								var item = data[i];
								if(item['code'] == value){
									caption = item['caption'];
								}
							}
							return ' title="'+caption+'" realvalue="'+value+'">'+caption+'</div>';
						}
					}else{
						return ' title="" realvalue=""></div>';
					}
				}
			}
			,_getPcode : function(item, rowData) {
				var p = item.get('parent');
				if (p) {
					if (rowData.tds[p]) {
						return rowData.tds[p].value;
					}
				}
			}
			,_file2DataHandler:function(rowData, type, name,dataName,addCaption){ 
				var dataValue=rowData?(rowData.tds[name]?rowData.tds[name].value:''):'';
				var htmlStr='<div class="sword_file_upload2" style="background-color:;" name="'+name+'"><ul class="up-list" name="up-list">',htmlStrR='';
				var addc=addCaption||'添加文件';
				if(dataValue){
					var dName="";
					try{var dObj=JSON.decode(dataValue);dName=dObj.name;
					}catch(e){}	
					dName=dName||dataValue;
					htmlStrR=" >"+htmlStr+'<li id="file-id" class="file"><span class="file-title">'+dName+'</span><span class="file-delete" style="visibility: hidden;"></span></li>'+
			   		'</ul><a name="up-attach" style="color: blue; text-decoration: underline; display: none;">'+addc+'</a></div></div>';
			   	}else{
			   		 htmlStrR=" >"+htmlStr+'</ul><a name="up-attach" style="color: blue; text-decoration: underline; ">'+addc+'</a></div></div>';
			    }
				return htmlStrR;
			}

		});
