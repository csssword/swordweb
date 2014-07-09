(function(){
	var index = 0;
	var girdName = null;
	this.addrow=function(){
		if(girdName){
			var index = girdName.substring(4);
			var hj_left = $('lx'+index).getElement('div.hj_left');
			hj_left.setStyles('display','none');
			$w(girdName).insertRow();
			var left = $('lx'+index).getElement('div.left');
			left.getElements("input").each(function(item,index){var inputH=item.getHeight()+24;item.setStyles({'height':inputH,'line-height':inputH});});
			var h = left.getHeight()+24;
			left.setStyles({'height':h,'line-height':h});
			hj_left.setStyles('display','none');
		}else{
			alert('请选择类型!');
		}
	};
	/*
	 * 在表格中添加总合计
	 * 多个表格时需用
	 */
	var addZhj=function(){
		var wrap = $('hjwrap');
		var cloneEl = $('hjouter');
		var newlx = cloneEl.clone().cloneEvents(cloneEl).setStyle('display','').inject(wrap);//.set('id','lx'+index);
		newlx.getElement('*[type=SwordGrid]').set('name', 'hjgrid').set('sword','SwordGrid');
		pc.initSwordTag(newlx);
		var grid=$w('hjgrid');
		grid.hjRow.getElements("div").each(function(r, index) {
            var n = r.get("name");
            if(r.get("hj") && n) {
                var tempobj = grid.hjRow.getElement("div[name='" + n + "']");
                tempobj.setStyle("text-align", "right");
                r.get('format') ? tempobj.set("format", r.get('format')) : null;
                var showvalue = html = '0.00';
                if(tempobj.get('format')) showvalue = sword_fmt.convertText(tempobj, showvalue).value;
                tempobj.set({'text':showvalue,'realvalue':html || "",'title':showvalue,"isHj":"true"});
            }
    	}.bind(this));
//		var wn = new Element('div').set('widgetName', 'hjgrid').inject($('save'));
//		$w('save').load = null;
	};
	this.addlx=function(){
		//debugger;
		girdName = null;
		var wrap = $('lxwrap');
		var clickedDiv=wrap.getElement('div.clicked');
		if($chk(clickedDiv)){
			clickedDiv.getElements("input").each(function(item,index){item.removeClass('clicked');});
			clickedDiv.removeClass('clicked');
		}
		++index;
		var cloneEl = $('gridouter');
		var newlx = cloneEl.clone().cloneEvents(cloneEl).setStyle('display','').inject(wrap).set('id','lx'+index);
		newlx.getElement('*[type=SwordGrid]').set('name', 'grid'+index).set('sword','SwordGrid');
		pc.initSwordTag(newlx);
		var grid=$w('grid'+index);
		$('lx'+index).getElement('div.sGrid_div').setStyle('border-bottom', '1px solid #FFFFFF')
		grid.insertRow();
		
		var hjRow = grid.hjRow;
		var cells = hjRow.getChildren();
		cells.each(function(el,index){
			var hj = el.get("hj");
			if(hj=="hj"){
				el.addEvent('onchange', function(oldValue,newValue){
					var row = $w('hjgrid').hjRow;
					var cell = row.getChildren()[index];
					var oldHj = cell.get("text");
					var c = isNaN(parseFloat(oldHj)) ? 0 : parseFloat(oldHj);
					var addValue = newValue - oldValue;
					var n = isNaN(parseFloat(addValue)) ? 0 : parseFloat(addValue);
					var showValue=(c+n)+"";
					cell.set("text",sword_fmt.convertText(showValue,"{'type':'number','format':'0.00'}").value);
				});
	
			}
		});
		
		if(index==1){//合计只加载一次
			addZhj();
		}
		var wn = new Element('div').set('widgetName', 'grid'+index).inject($('save'));
		$w('save').load = null;
	};
	this.clicklf=function (tar){
		tar = $(tar);
		var clickedDiv= $('lxwrap').getElement('div.clicked');
		if($chk(clickedDiv)){
			clickedDiv.getElements("input").each(function(item,index){item.removeClass('clicked');});
			clickedDiv.removeClass('clicked');
		}
		tar.addClass('clicked');
		tar.getElements("input").each(function(item,index){item.addClass('clicked');});
		girdName = tar.getNext().get('name');
	};
	this.delrow=function(){
		if(girdName){
			var cr = $w(girdName).getCheckedRow();
			if($w(girdName).rows() >1)
				if(cr){
					$w(girdName).deleteRow(cr);
					var index = girdName.substring(4);
					var left = $('lx'+index).getElement('div.left');
					left.getElements("input").each(function(item,index){var inputH=item.getHeight()-28;item.setStyles({'height':inputH,'line-height':inputH})});
					var h = left.getHeight()-28;
					left.setStyles({'height':h,'line-height':h});
				}
				else alert('请选择要删除的行');
			else alert('最后一行');
		}else{
			alert('请选择类型!');
		}
	};
	/*计算总合计*/
	this.jshj=function(){
		var xyZhjDiv,gridHjRowDivArray=[];//需要总合计的div和
		var rowDiv=$('zhjRow').getChildren()[0];
		$('lxwrap').getElements("div[sword='SwordGrid']").each(function(item,index){
			gridHjRowDivArray[index]=item.getElement('div.sGrid_div>div.sGrid_data_div').getChildren()[0];//得到所有的表格的小计行div
			xyZhjDiv=xyZhjDiv||gridHjRowDivArray[index].getChildren().filter(function(item,index){
				return $type(item.get('realvalue')/1)=="number";
			});//得到需要进行合计的div列元素
		});
		if($chk(xyZhjDiv)){
			xyZhjDiv.each(function(item,index){
				var cellDiv=rowDiv.getElement("div[name="+item.get('name')+"]");//得到当前要设置text属性的值。
				cellDiv.set({'text':"0.00",'realvalue':"0.00" || "",'title':"0.00"});
				gridHjRowDivArray.each(function(item,index){
					var tempCell=item.getElement("div[name="+cellDiv.get('name')+"]");
					cellDiv.set('format',tempCell.get("format"));
					var showvalue=html=(cellDiv.get('realvalue')/1)+(tempCell.get("realvalue")/1);
					showvalue = sword_fmt.convertText(cellDiv, showvalue).value;
					cellDiv.set({'text':showvalue,'realvalue':html || "",'title':showvalue});
				});
			});
		}
	};
	/*删除类型*/
	this.dellx=function(){
		var lxwrap=$('lxwrap');
		var save=$('save');
		var xzlxDiv=lxwrap.getElement("div.clicked");//获取到选中的类型
		if($chk(xzlxDiv)){
			var lxDiv=xzlxDiv.getParent();//获取到当前选中的lxDiv
			var zhjLabelDiv=xzlxDiv.getNext("div.zhj");//合计的标签div
			if($chk(zhjLabelDiv)){  //如果取到合计的标签div,说明是最后一个表格，不可以直接删除。先取出zhjrowDiv和标签的克隆
				var zhjDiv=$('zhjRow').clone(true,true);
				var zhjCloneDiv=zhjLabelDiv.clone();
				var delGridName=lxDiv.getElement("div[type='SwordGrid']").get("name");
				lxDiv.destroy();
				save.getElement("div[widgetName="+delGridName+"]").destroy();
				index=lxwrap.getElements("div[id]&&div[id!='outer']&&div[id!='zhjRow']").length;
				var lastLxDiv=lxwrap.getLast("div[id!='outer']");//取到最后一个lxDiv
				if($chk(lastLxDiv)){
					lastLxDiv.grab(zhjCloneDiv,"bottom");
					lastLxDiv.getElement("div.hj").addClass("hj_bottom").set("style","width: 100%;");
					var lastGridDiv=lastLxDiv.getElement('div[sword="SwordGrid"]');
					var grid=$w(lastGridDiv.get("name"));
					zhjDiv.inject(grid.console(),"before");
				}
			}else{
				lxDiv.destroy();
				var lxDivArray=lxwrap.getElements("div[id]&&div[id!='outer']&&div[id!='zhjRow']");
				lxDivArray.each(function(item,index){
					index++;
					item.set("id","lx"+index);
					var gridDivtemp=item.getElement("div[sword='SwordGrid']");
					var gridObj=$w(gridDivtemp.get("name"));//取到修改之前的对象
					var tempName="grid"+index;
					gridDivtemp.set("name",tempName);//设置表格div对象的name属性
					gridObj.options.name=tempName;//修改表格对象的name值
					pc.widgets.set(tempName, gridObj);//修改在pc.widgets哈希对象中的键值对
				});
				save.getLast().destroy();
				index=lxDivArray.length;
			}
		}else{
			alert("请选择您要删除的类型！");
		}
	};
})();