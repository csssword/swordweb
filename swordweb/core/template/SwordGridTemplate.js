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
			}
		   ,formats : new Hash() ///format与juicer解析冲突，每列的format放在该对象中方便获取

		   ,initialize : function(options) {
				this.setOptions(options);
				if (!this.options.gridObj)throw new Error("SwordGridRender 初始化必须要传入 gridObj");
				this.g = this.options.gridObj;
				this.fieldRender = new SwordGridFields({
					'gridObj' : this.options.gridObj
				});
				this._showDataHandlers = {// 定义特殊数据处理器
					'checkbox' : this._checkbox_radioDataHandler.bind(this),
					'radio' : this._checkbox_radioDataHandler.bind(this),
					'date' : this._dateDataHandler.bind(this),
//					'file2' : this._file2DataHandler.bind(this),
//					'password' : this._textDataHandler.bind(this),
					'pulltree' : this._pulltreeDataHandler.bind(this),
					'select' : this._selectDataHandler.bind(this),
					'rowNum' : this._rowNumDataHandler.bind(this)
				};
			}

			,render : function(datas, items) {
				if (!items)items = this.options.items;
				var rows = this._createRow(datas, items);
				var rowsFragment = STemplateEngine.createFragment(rows);
				this._renderAfter($$(rowsFragment.childNodes), datas, items);
				return rowsFragment;
			}

			,renderRow : function(rowData, items,status) {
				var h = this._createRow([rowData], items);
				var row = new Element('div', {
					'html' : h
				}).getFirst();
				if(status=="insert"){row.set("status",status);}
				this._renderAfter([ row ], [ rowData ], items);

				return row;
			}

			,_renderAfter : function(rows, datas, items) {
				var self = this;
				var timeNum = 0;
				var len = datas.length;
				if(len<=0)return;
				setTimeout(function() {
					var row = rows[timeNum];
					if (!row.retrieve('rowData')) {
						self._renderRowAfter(row, datas[timeNum]);
						self._renderCellAfter(datas[timeNum], row, timeNum + 1,
								items);
					}
					self.g.fireEvent("onAfterCreateRow", [ datas[timeNum], row,
							self.g ]);
					timeNum = timeNum + 1;
					if (len > timeNum) {
						setTimeout(arguments.callee, 10);
					} else {
						// sometodo
					}
				}, 10);
			}

			,_renderRowAfter : function(row, rowData) {
				row.store('rowData', rowData);// 注册行数据
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
				juicer.register('pageNum', function(rowData) {
					return self.g.pageNum();
				}); // 注册自定义函数
				juicer.register('dataHandler', function() {
					// var args = Array.prototype.slice.call(arguments,2);若需要分割参数
					return self._findDataHandler(arguments[1]).apply(this,arguments);
				}); // 注册自定义函数
				var h = [];
				if (this.g.options.type != 'tree') {// 树形表格将不使用此逻辑
					var row_shuang = [ SwordGrid_OTemplate['row_shuang'],
					                   cellsDom, SwordGrid_OTemplate['div_end'] ].join("");
					var row_dan = [ SwordGrid_OTemplate['row_dan'], cellsDom,
							SwordGrid_OTemplate['div_end'] ].join("");
					datas.each(function(rowData, i) { // IE9以上 数组没有字符串拼接快
						if (i % 2 == 0) { // 偶数行
							h.push(juicer(row_shuang, rowData));
						} else {// 奇数行 singular
							h.push(juicer(row_dan, rowData));
						}
					}, this);
				} else {
					var row_tree = [ SwordGrid_OTemplate['row_tree'],cellsDom, SwordGrid_OTemplate['div_end'] ].join("");
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
				if (this._showDataHandlers[type])
					return this._showDataHandlers[type];
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
			,_rowNumDataHandler : function(rowData, type) {// 删除过行后 显示与内部值不一样
															// ，应该在表格上加属性 不以数据为准
//				var rowNum = 1 / 1 + 1;
				return ' title=""></div>';
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
					checkAllFlag == 'true' ? check = true : check = false;
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
				var cal = this.g.getCalendar();
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
					dataformat = dataformat || cal.defaultdataformat;
					submitDateformat = submitDateformat || cal.submitDateformat;
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
					var data = pc.getInitData(treeName);
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
//			,_file2DataHandler : function(item, cellData) {
//				if (!$chk(cellData))
//					return;
//				var html = cellData.value;
//				var itemEl = item;
//				var r;
//				var d = this.g.file2_Data(html);
//				if (d) {
//					// s='<li class="file" id="file-id"><span
//					// class="file-title">'+d.name+'</span></li></ul></div>';
//					r = this._getRes({
//						'filename' : d.name
//					});
//				} else {
//					var addCaption = itemEl.get('addCaption') || '添加文件';
//					// s='</ul><a name="up-attach" style="color: blue;
//					// text-decoration: underline; ">'+addCaption+'</a></div>';
//					r = this._getRes({
//						'addCaption' : addCaption
//					});
//				}
//				// var s1='<div class="sword_file_upload2" name="tmp"> <ul
//				// class="up-list" name="up-list">';
//
//				return r;
//			}

		});
