SwordBigTree
		.implement({
			getTreeData : function(attributes) {
				var nodeArr = this.getAllNode();
				var nodeDataArr = [];
				var len = $defined(attributes.length) ? attributes.length : 0;
				var nodeDataLen = 0;
				nodeArr.each(function(node, index) {
					nodeDataArr[nodeDataLen] = {};
					for ( var i = 0; i < len; i++) {
						nodeDataArr[nodeDataLen][attributes[i]] = node
								.get(attributes[i])
					}
					nodeDataLen++;
				});
				return nodeDataArr;
			},
			setSelectNode : function(code) {
				this.select.selDiv.fireEvent("click");
				var node = this.getTreeNode(new Hash({
					'code' : code
				}));
				this.setSelectedNode(node);
			},
			exTreeDataFunc : function() {
				for ( var i = 0; i < pc.swordCacheArray.length; i++) {
					var q = pc.swordCacheArray[i];
					if (q.WN == this.options.treeContainerName && q.load == 'lazy') {
						return this.cacheResult(this.tree_buildSql(q, false),
								q.WN);
					}
				}
			},
			cacheTreeDataFunc : function(widgetName,data,node) {
				if(!$chk(node))node = "";
				var result =  data.data.filter(function(item, index){
					return item.pcode == node;
				});
				var resData = {
						data : result,
						name : widgetName,
						"sword" : "SwordTree"
					};
				return resData;
			},
			cacheTreeCodePath :function(realValue,data,box) {
				var codePath = realValue;
					function filterCode(code){
						for(var i =0;i<data.data.length;i++){
							var item = data.data[i];
							if(item.code == code){
								if(!$chk(item.pcode))break;
								codePath = item.pcode +","+codePath;
								filterCode(item.pcode);
								break;
							}
						}
					}
				filterCode(realValue);
				box.set('codePath', codePath);
			},
			cacheResult : function(sql, widgetName) {
				var data = null;
				$cache.get(sql, function(result, tableName) {
					data = {
						data : result,
						name : widgetName,
						"sword" : "SwordTree"
					};
					if (pc.initData == null) {
						pc.initData = {};
					}
					if (pc.initData.data == null) {
						pc.initData.data = [];
					}
					pc.initData.data.include(data);
				});
				return data;
			},
			tree_buildSql : function(q, isall) {
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
				if (!$defined(q.PDM)) {
					if (!bm)
						bm = q.T.substring(q.T.lastIndexOf('_') + 1);
					q.PDM = "SJ" + bm + "_DM";
				}
				sql = "SELECT T.{DM} AS code,T.{PDM} AS pcode, T.{MC} AS caption,T.* FROM {T} AS T";
				if (q.PDM == '')
					sql = "SELECT T.{DM} AS code, T.{MC} AS caption,T.* FROM {T} AS T";
				sql = sql.substitute(q);
				if (q.W && !isall) {
					sql += " WHERE " + q.W;
				}
				sql += " ORDER BY  code";
				return sql;
			}
		});
