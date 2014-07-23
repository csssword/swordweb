/**
 * 树模板
 * 
 * @author zb
 */
SwordBigTree.Template = {

	divAfter : "</DIV>",
	childrenEleTpl : "<DIV style='DISPLAY: ${display}' class='tree-children' leaftype='100'>"

	,
	eleTpl : "<DIV class='${eleClass}' leaftype='${leaftype}' ${dataPathSign}=${dataPath} title='${caption}'  depth='${depth}' isLoadSign='${isLoadSign}'"
			+ " {@each attrs as it,index}"
			+ " ${index} = '${it}' "
			+ " {@/each}" + ">"
	// "{@include wrapperSpanTpl, wrapperSpanTplData}"

	,
	wrapperSpanTpl : "<SPAN class=tree-node-wrapper type='wrapperSpan'>"
			+ "<SPAN	class='tree-gadjet ${gadGetSpan}' type='gadGetSpan'>$${space}</SPAN>"
			+ "{@if treeType==='1'}<SPAN class='tree-checkbox ${checkSpanCls}' type='checkSpan'>$${space}</SPAN>{@/if}"
			+ "{@if treeType==='2'}<INPUT class=tree-radio type=radio value=on name=radio>{@/if}"
			+ "<SPAN   class='tree-icon ${iconSpan}' type='iconSpan'>$${space}</SPAN>"
			+ "<SPAN   class='tree-name' type='displaySpan'>$${caption}</SPAN>"
			+ "</SPAN>"
			
};
