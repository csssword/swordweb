/**
 * 多表头
 * 
 * @return
 */
function buildHeader() {
	var pNodeArray = $$('div[type=SwordGridHeader]');
	pNodeArray.each(function(item,index){
		var _width = item.get('x');
		item.setStyles({
			'width' : _width,
			'height' : item.get('y')
		}).addClass('gridexhead');
		// 子元素
		var eles = item.getChildren('div');
		for(var i=0;i<eles.length;i++){
			parseElementNew(eles[i]);
		}
		
	});
	

}
function reHeader() {
	var pNodeArray = $$('div[type=SwordGridHeader]');
	pNodeArray.each(function(item,index){
		var grid = $w(item.get('bindGrid'));
		item.inject(grid.options.sGrid_header_div, 'after');
		var h = grid.sGrid_div().getHeight();
		var hs = item.getHeight();
		grid.sGrid_div().setStyle('height', h + hs);
		grid.scrollDiv.setStyle('height', h + hs);
		item.setStyle('border-top', '0');
		item.setStyle('border-left', '0');
	});
	
}

/*
 * 转换元素,在创建表格头的单元格时使用
 * @param 要进行转换的节点div元素
 * @desc 元素有三种类型
 * a x&y  有宽度和高度值   .xydiv  style{border-right:1px solid #C1DAD7;height: 93px;line-height: 93px;overflow: hidden;width: 60px;}
 * b x    只有宽度                  .xdiv   style{float: left;overflow: hidden;}
 * c y    只有高度                  .ydiv   style
 * .sGrid_header_item_div 表格头单元格样式
 * 具有y属性的div元素都是表格头需要渲染的列元素。如果没有子元素,需添加 sGrid_header_item_div,有子元素
 * 具有x属性的div元素下的子元素列元素。子元素的
 * 每一层的元素，若缺少x元素那么只向自己的父元素取x-1属性即可，缺少Y元素取y元素即可
 */
function parseElementNew(nodeEl){
	var width=nodeEl.get('x');
	var height=nodeEl.get('y');
	var tempArray=nodeEl.getChildren('div');
	var chrildrenNum=tempArray.length;
	var titleStr=nodeEl.get("text").trim();
	if(width){
		if(height){//说明 xy都有。
			nodeEl.setStyles({'border-right':'1px solid #C1DAD7',height: height,'line-height': height,overflow: 'hidden',width: width});
			nodeEl.addClass("sGrid_header_item_div").set("title",titleStr);
		}else{//只有x时
			nodeEl.setStyles({overflow: 'hidden',float: 'left',width:width});
			if(chrildrenNum!=0){
				for(var j=0;j<tempArray.length;j++)parseElementNew(tempArray[j]);
			}
		}
	}else{//说明只有y
		nodeEl.setStyles({'border-bottom': '1px solid #C1DAD7',overflow: 'hidden','border-right': '1px solid #C1DAD7','line-height': height,'text-align': 'center',
			height: height,width: nodeEl.getParent("div[x]").get("x").toInt()-1}).set("title",titleStr);
		if(nodeEl.get("isNextY")=="true")nodeEl.setStyle('border-bottom',"");
		var nextDiv=nodeEl.getNext("div");
		if(nextDiv)nextDiv.set("isNextY","true");
		if(chrildrenNum!=0){
			nodeEl.removeProperty("style");
			for(var k=0;k<tempArray.length;k++)parseElementNew(tempArray[k]);
		}
	}	
}

/*
function parseElement(nodes, pNodes, _width) {
	for ( var i = 0; i < nodes.length; i++) {
		var item = nodes[i];
		item.setStyles({
			'width' : item.get('x'),
			'float' : item.hasClass('nofloat')?'none':'left',
			'overflow':'hidden'
		});
		if (item.getChildren('div').length == 0) {
			item.addClass('sGrid_header_item_div');
			if (pNodes
					&& pNodes.indexOf(item.getParent().getParent()) == pNodes.length - 1
					&& i == nodes.length - 1) {
				item.setStyle('border-right', 'medium none');
			} else if (!pNodes && i == nodes.length - 1) {
				item.setStyle('border-right', 'medium none');
			} else {
				item.setStyle('border-right', '1px solid #C1DAD7');
			}
			var hy = item.get('y') || item.getParent().get('y');
			item.setStyles({
				'height' : hy,
				'line-height' : hy
			});
		} else {
			// 第二层
			var child0 = item.getChildren('div')[0];
			var hhy = child0.get('y') || child0.getParent().get('y');
			var wwd = child0.get('x') || child0.getParent().get('x');
			child0.setStyles({
				'height' : hhy,
				'line-height' : hhy,
				'text-align' : 'center',
				'border-bottom' : '1px solid #C1DAD7',
				'border-right' : i == nodes.length - 1 ? 'medium none'
						: '1px solid #C1DAD7'
			});
			if (!wwd.contains('%'))
				child0.setStyle('width', wwd.toInt() - 1);

			if (i == nodes.length - 1) {
				// 最后一个
				if (_width.contains('%')) {
					if (_width.toInt() <= 100) {
						var wid = 100 - _width.toInt();
						var rightEnd = new Element('div');
						rightEnd.setStyles({
							'width' : wid + '%',
							'border-bottom' : '1px solid #C1DAD7',
							'float' : 'left',
							'height' : hhy
						});
						rightEnd.inject(item, 'after');
					}
				} else {
					var rightEnd = new Element('div');
					rightEnd.setStyles({
						'width' : child0.get('x'),
						'border-bottom' : '1px solid #C1DAD7',
						'float' : 'left',
						'height' : hhy
					});
					rightEnd.inject(item, 'after');
				}
			}
			var clds = item.getChildren('div')[1].getChildren('div');
			parseElement(clds, nodes, _width);
		}
	}
}*/