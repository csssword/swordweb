//SwordForm表单的模板描述
var SwordForm_Template = {
    //共有属性
    'PUBATTR':' style="{css}" rule="{rule}" bizctrl="{bizctrl}" biztid="{biztid}" name="{name}" msg="{msg}" '
    ,'panel':'<div class="swordform-panel-box"><div class="swordform-panel-tl"></div><div class="swordform-panel-tr"></div><div class="swordform-panel-title" id="{name}_panelTitle" ><div id="{name}_panelTog" class="x-tool" title="收缩"></div>{caption}</div></div>'
    ,htmlStrs:[]
    
    /**
     * 创建FORM结构
     * @param pNode 代表sword="SwordForm"的整个DIV节点(包括子节点)的element对象
     * @param data  FORM的初始化数据//原为初始化数据对象,现修改为formObj
     */
    ,render:function (pNode, formObj) {
    	this.realRender(pNode,formObj);
    }
	,realRender:function(pNode,formObj,formData){
		/*
		 * 1, 先处理panel="true"
		 * 2，然后处理内部div(例如div type="hidden")
		 * 3, 处理table定义.
		 * 			思路：参照申报大表单处理方式，不停的向一个临时的表单数组中放入html片段.最后完成一个innerhtml的设置.
		 */
		pNode=$(pNode),this.formObj=formObj,this.fName=pNode.get("name");
		var tHStrs=this.htmlStrs;
		if(pNode.get("panel")=="true"){
			tHStrs.push(this["panel"].substitute({caption:formObj.options.caption, name:this.fName}));
		}
		var tb = pNode.getChildren();
        tb.each(function(item, index) {
        	if(item.get("tag")=="div"){
        		var typeStr=item.get('type');
        		if(typeStr=='hidden'){
        			var itemName=item.get("name");
        			tHStrs.push(this.getItemHtml(typeStr, item, formData[itemName]));
        		}else{
        			tHStrs.push(item.outerHTML);
        		}
        	}else{
        		this.buildTable(item,formData);
        	}
        }.bind(this));
        this.render();
	}
	,buildTable:function(tableEl,formData){
		var tem = this.htmlStrs;
   	 	tem.push("<table class='tab_form' width='{w}' id='{id}' border='0' cellpadding='0' cellspacing='0' style='{style}'>".substitute({w:tableEl.get('width'), id:tableEl.get('id'), style:tableEl.get("style")}));
        var cg = tableEl.getFirst();
        if (cg&&cg.tagName.toLowerCase() == 'colgroup') {
            tem.push('<colgroup>');
            tem.push(cg.innerHTML);
            tem.push('</colgroup>');
        }
        var trs = tableEl.getFirst('tbody').getChildren('tr');
        tem.push('<tbody>');
        var tr = trs[0], tds, i, tag, d, type,tdl;
        while (tr) {
            var subid = tr.get('id');
            if($chk(subid)){
                tem.push("<tr style='{style}' id='{id}'>".substitute({style:tr.get('style'), id: subid}));
            }else{
                tem.push("<tr style='{style}'>".substitute({style:tr.get('style')}));
            }
            tds = tr.getChildren(),tdl=tds.length;
            for (i = 0; i < tdl; i++) {
                tag = tds[i].tagName.toLowerCase();
                if (tag == 'th') {
                    tem.push(("<th style='{style}' colspan='{c}' rowspan='{r}' >" + tds[i].innerHTML + "</th>").substitute({c:tds[i].get('colspan'), r:tds[i].get('rowspan'), style:tds[i].get('style')}));
                } else {
                    var tdEls = tds[i].getChildren();
                    tdEls.each(function(d){
                    	if (d != null) {
	                       	 if(d.get("tag")!="table"){
	                       		 type = d.get('type'),itemName=d.get("name");
	   		                   	 tem.push(("<td style='{style}' colspan='{c}' rowspan='{r}' >").substitute({c:tds[i].get('colspan'), r:tds[i].get('rowspan'), style:tds[i].get('style')}));
	   		                   	 if(type){
	   		                   		tem.push(this.getItemHtml(type, d, formData[itemName]));
	   		                   	 }
	   		                   	 tem.push(d.outerHTML);
	   		                   	 tem.push("</td>");
	                       	 }else{
	                       		 this.buildTable(d,formData);
	                       	 }
                    	}
                    }.bind(this));
                }
            }
            tem.push('</tr>');
            tr = tr.getNext('tr');
        }
        tem.push('</tbody></table>');
	}
	,render:function () {
		this.formObj.options.pNode.set("isRender","true").innerHTML = this.htmlStrs.join('');
		this.htmlStrs.empty();
    }
	/*
	 * 根据类型,itemEl,和elData返回一段完整的HTML字符串
	 */
	,getItemHtml:function(type,itemEl,elData){
		return pc.formItems[type].render(itemEl,this.formObj,this.fName,elData);
	}
};






