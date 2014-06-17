SwordTree
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
SwordTree.Draw.implement({
	 /**
     * 添加节点
     * @param {Hash} hash
     */
    addTreeNode:function(hash, isLoad, item) {
        var dom;
        var tpNode;
        var node;
        if ($defined(item)) {
            tpNode = item;
        } else {
            tpNode = this.getSelectedNode();//||this.getRootNode();//todo,如果没有选择节点，默认在根节点下面添加
            if (this.isLazyTree() && tpNode && !tpNode.get(this.options.isLoadSign)) {
                var func = function(hash) {
                    var node = this.getTreeNode(hash);
                    this.setSpanClass(node, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(node, "iconSpan", this.options.treeStyle.treeCloseIcon);
                }.bind(this);
                this.lazyExtend(tpNode, func, hash);
                return;
            }
        }
        if ($type(hash) == "SwordTree.Iterator") {
            dom = hash;
        } else {
            dom = new SwordTree.JSONIterator(hash);
            dom.setLastSign(true);
        }

        if ($defined(tpNode)) {
            tpNode.store("data", hash);
            if ($defined(isLoad)) {
                if (!dom.hasChildNodes()) {
                    this.setSpanClass(tpNode, "gadGetSpan", this.options.treeStyle.treeGadGetNone);
                    this.setSpanClass(tpNode, "iconSpan", this.options.treeStyle.treeCloseIcon);
                    return;
                }
            }
            var element = this.beforeAddTreeNode(tpNode);
            var childrenElement = element.childrenElement;

            node = this.createNode(childrenElement, dom, tpNode.get("depth").toInt(), isLoad);
            node.setProperty(this.options.isLoadSign, true);
            if ($chk(tpNode.get(this.options.cascadeSign.id))) {
                node.setProperty(this.options.cascadeSign.pid, tpNode.get(this.options.cascadeSign.id));
            }
            var gadGetSpan = element.gadGetSpan;
            if (gadGetSpan.hasClass(this.options.treeStyle.treeGadGetPlus)) {
                this.extend(tpNode);
            }
            if (this.options.treeType == "1") {
                var span = tpNode.getFirst("span[type='wrapperSpan']");
                var checkSpan = span.getFirst("span[type='checkSpan']");
                if (checkSpan.hasClass(this.options.treeStyle.treeNodeChecked)) {
                    var checkState = this.getCheckedState(checkSpan);
                    this.checkedClick(node, checkState, false);
                    //父节点选中时，懒加载的子节点也选中
                    if(this.options.isCascadeCheckedClick == "true"){
                        var childrenNodes = childrenElement.getElements('div.tree-node')
                        if(childrenNodes) {
                        	this.changeCheckedState2(childrenNodes.getElement("span[type='checkSpan']"), 1);
                        	childrenNodes.set(this.options.checkSign,'true');
                        }
                    }
                }
            }
        } else {//if (this.container.getFirst("div").getChildren("div").length == 0) {
            node = this.createNode(this.container, dom, this.depth + 1);
            this.container.getFirst("div").grab(node);
        }
        //        this.findTreeNode(node);
        this.reset();
        this.extendNodeByIdPath();
    }
});