SwordSelect
		.implement({
			initialize: function(options) {
	        if(pc.SwordSelectWindowClick) return;
	        pc.SwordSelectWindowClick = true;
	        window.document.addEvent('click', function(e) {
	            var obj = e.target;
	            while(obj.parentNode && obj != this.box && obj != this.selDiv) obj = obj.parentNode;
	            if(obj != this.box && obj != this.selDiv && this.box) {
	                if(this.box.get("display") == 'true') {
	                    if($defined(this.box.onSelectBlur)) {
	                        this.box.onSelectBlur(this.box.get('value'));
	                    }
	                }
	                if(this.box.get('handInput') == "true" && !$chk(this.box.get('realvalue')) && $chk(this.box.get("value"))) {
	                    this.box.set({'code':this.box.get("value"),'realvalue':this.box.get("value")});
	                }
	                this.hide();
	                if(!$(e.target).hasClass('sGrid_data_row_item_select')) {
	                    this.execGridOnFinished();
	                }
	            }
	        }.bind(this));
	    },
			exSelectDataFunc : function() {
				for ( var i = 0; i < pc.swordCacheArray.length; i++) {
					var q = pc.swordCacheArray[i];
					//if (q.WN == this.box.get('name') && q.load == 'lazy') {
					if (q.T == this.box.get('dataname') && q.load == 'lazy') {//dataname与表名绑定
						return this.cacheResult(this.sel_buildSql(q, false),
								q.WN);
					}
				}
			},
			cacheResult : function(sql, widgetName) {
				var data = null;
				$cache.get(sql, function(result, tableName) {
					var tempdata = $H({
						"data" : [ {
							"data" : result,
							dataName : tableName,
							"sword" : "SwordSelect"
						} ]
					});
					data = tempdata.data;
					if (!$chk(pc.initData)) {
						pc.initData = tempdata;
					} else {
						pc.initData.data.extend(data);
					}
				});
				return $defined(data) ? data[0].data : data;
			},
			sel_buildSql : function(q, isall) {
				var sql = "";
				var bm = null;
				if (!q.MC) {
					if (!bm)
						bm = q.T.substring(q.T.lastIndexOf('_') + 1);
					q.MC = bm + "MC";
				}
				if (!q.DM) {
					if (!bm)
						bm = q.T.substring(q.T.lastIndexOf('_') + 1);
					q.DM = bm + "_DM";
				}
				if (q.PDM) {
					sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T"
							.substitute(q);
				} else {
					sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T"
							.substitute(q);
				}
				if (q.W && !isall) {
					sql += " WHERE " + q.W;
				}
				sql += " ORDER BY  code";
				return sql;
			}

		});