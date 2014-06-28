var SwordToolTips = new Class({
    Implements:[Events,Options],
    style:{
        styBase:'box_sty' ,
        defSty:'c',
        defCont:'cont'
    },
    options:{
    	imagePath : $SwordLoader.rootPath +'swordweb/styles/gt3new/SwordToolTips/images/',
    	arrowImageFile : 'green-arrow.gif',
    	tarrowImageFileRight : 'green-arrow-right.gif',
    	formTooltipDivClassName : 'DHTMLgoodies_formTooltipDiv',
    	tooltipWidth : 150,
    	tooltipBgColor: 'blue', //green or blue
    	closeMessage : '关闭',
    	disableTooltipMessage : '不再提示',
    	tooltipPosition : 'below',// Tooltip position, possible values: "below" or "right" or "up"
    	arrowRightWidth : 16,			// Default width of arrow when the tooltip is on the right side of the inputs.
    	arrowTopHeight : 13,			// Default height of arrow at the top of tooltip
    	toptipHeight : 33,			
    	tooltipCornerSize : 10,
    	tooltipDisabled : false,
    	disableTooltipPossibility : false,
    	disableTooltipClose:false,
    	displayArrow : true,
    	pageBgColor : '#FFFFFF'
    },
	tooltipDiv : null,
	tooltipText : null,
	activeInput : null,
	tooltipContentDiv:null,
	positionLeft:null,
	positionTop:null,
    
    
    initialize:function(options) {
        this.setOptions(options);
        if(navigator.userAgent.indexOf('MSIE')>=0 && navigator.userAgent.indexOf('MSIE 9')==-1)this.isMSIE = true; else this.isMSIE = false;
        window.refToFormTooltip = this;
        window.onresize = function(){
        	window.refToFormTooltip.__positionCurrentToolTipObj();
        }
        if(window.refToFormTooltip.options.tooltipBgColor == 'green'){
        	window.refToFormTooltip.options.tooltipUpClassName = 'DHTMLgoodies_green_formTooltip_upImg';
        	window.refToFormTooltip.options.tooltipBottomClassName = 'DHTMLgoodies_green_formTooltip_bottomImg';
        	window.refToFormTooltip.options.tooltipRightClassName = 'DHTMLgoodies_green_formTooltip_rightImg';
        	window.refToFormTooltip.options.tooltipBgColor = '#589a82';
        }else if(window.refToFormTooltip.options.tooltipBgColor == 'blue'){
        	window.refToFormTooltip.options.tooltipUpClassName = 'DHTMLgoodies_blue_formTooltip_upImg';
        	window.refToFormTooltip.options.tooltipBottomClassName = 'DHTMLgoodies_blue_formTooltip_bottomImg';
        	window.refToFormTooltip.options.tooltipRightClassName = 'DHTMLgoodies_blue_formTooltip_rightImg';
        	window.refToFormTooltip.options.tooltipBgColor = '#7d9bc5';
        }
    },
    createTip:function(activeInput,msg) { 
    	var top = window.refToFormTooltip.getTopPos(activeInput);
    	if($(document.body).getScroll().y == top)return;  //如果显示的时候input对象已经被删除，$(document.body).getScroll().y == top，无法定位直接返回。
    	window.refToFormTooltip.tooltipText = msg;
    	window.refToFormTooltip.activeInput  = activeInput;  //
    	window.refToFormTooltip.__displayTooltip();
    },
    hide:function() {
    	window.refToFormTooltip.__hideTooltip();
    },
    /**
    *
	 *
    *  This method displays the tooltip
    *
    * 
    * @private
    */		
	__displayTooltip : function()
	{
//		var inputObj = window.refToFormTooltip.activeInput;
//		var tooltipPosition = window.refToFormTooltip.options.tooltipPosition;
//		if(window.refToFormTooltip.options.tooltipPosition=='up'){
//			var top = window.refToFormTooltip.getTopPos(inputObj) - inputObj.offsetHeight - 3 - window.refToFormTooltip.options.toptipHeight;
//			if(top<0)window.refToFormTooltip.options.tooltipPosition='below';
//		}
//		
		
		if(window.refToFormTooltip.options.tooltipDisabled)return;	// Tooltip disabled
		if(!window.refToFormTooltip.tooltipDiv)window.refToFormTooltip.__createTooltip();
		
		window.refToFormTooltip.__positionTooltip();
		
	
		window.refToFormTooltip.tooltipContentDiv.innerHTML = ("<div style='color:white;' id='cont'>");//window.refToFormTooltip.tooltipText;
        var msgDiv = window.refToFormTooltip.tooltipContentDiv.getElements("div[id='cont']")[0];
        msgDiv.appendText(window.refToFormTooltip.tooltipText);
		window.refToFormTooltip.tooltipDiv.style.display='block';
		
//		window.refToFormTooltip.tooltipDiv.addEvent("click", function (e) {
//            window.refToFormTooltip.__hideTooltip();
//        }
		
	},
    /**
    *
	 *
    *  This function creates the tooltip elements
    *
    * 
    * @private
    */	
	__createTooltip : function()
	{
		
		window.refToFormTooltip.tooltipDiv = document.createElement('DIV');
		window.refToFormTooltip.tooltipDiv.style.position = 'absolute';
		window.refToFormTooltip.tooltipDiv.setStyle("z-index","1000");
		window.refToFormTooltip.tooltipDiv.set("id","formTooltipDivPNode");
		var topDiv = new Element("div") ;
		if(window.refToFormTooltip.options.displayArrow){
			if(window.refToFormTooltip.options.tooltipPosition=='below'){
				topDiv.addClass(window.refToFormTooltip.options.tooltipBottomClassName);
//				topDiv.style.marginLeft = '20px';
//				var arrowDiv = document.createElement('IMG');
//				arrowDiv.src = window.refToFormTooltip.options.imagePath + window.refToFormTooltip.options.arrowImageFile + '?rand='+ Math.random();
//				arrowDiv.style.display='block';
//				topDiv.appendChild(arrowDiv);
					
			}else if(window.refToFormTooltip.options.tooltipPosition=='right'){  //DHTMLgoodies_formTooltip_rightImg
				topDiv.addClass(window.refToFormTooltip.options.tooltipRightClassName);
//				topDiv.style.marginTop = '5px';
//				var arrowDiv = document.createElement('IMG');
//				arrowDiv.src = window.refToFormTooltip.options.imagePath + window.refToFormTooltip.options.tarrowImageFileRight + '?rand='+ Math.random();	
//				arrowDiv.style.display='block';
//				topDiv.appendChild(arrowDiv);					
//				topDiv.style.position = 'absolute';			
			}else if(window.refToFormTooltip.options.tooltipPosition=='up'){
				topDiv.addClass(window.refToFormTooltip.options.tooltipUpClassName);
			}
			if(window.refToFormTooltip.options.tooltipPosition!='up'){
				window.refToFormTooltip.tooltipDiv.appendChild(topDiv);	
			}
		}
		
		var outerDiv = document.createElement('DIV');
		outerDiv.style.position = 'relative';
		outerDiv.style.zIndex = 1000;
	
		if(window.refToFormTooltip.options.tooltipPosition!='up' &&window.refToFormTooltip.options.tooltipPosition!='below' && window.refToFormTooltip.options.displayArrow){			
			outerDiv.style.left = window.refToFormTooltip.options.arrowRightWidth + 'px';
		}
				
		outerDiv.id = 'formTooltipDiv';
		outerDiv.className = window.refToFormTooltip.options.formTooltipDivClassName;
		outerDiv.style.backgroundColor = window.refToFormTooltip.options.tooltipBgColor;
		window.refToFormTooltip.tooltipDiv.appendChild(outerDiv);

		window.refToFormTooltip.tooltipContentDiv = document.createElement('DIV');	
		window.refToFormTooltip.tooltipContentDiv.style.position = 'relative';	
		window.refToFormTooltip.tooltipContentDiv.id = 'formTooltipContent';
		outerDiv.appendChild(window.refToFormTooltip.tooltipContentDiv);			
		
		
		if(window.refToFormTooltip.options.disableTooltipClose){
			var closeDiv = document.createElement('DIV');
			closeDiv.style.textAlign = 'center';
		
			closeDiv.innerHTML = '<A class="DHTMLgoodies_formTooltip_closeMessage" href="#" onclick="window.refToFormTooltip.__hideTooltipFromLink();return false">' + window.refToFormTooltip.options.closeMessage + '</A>';
			
			if(window.refToFormTooltip.options.disableTooltipPossibility){
				var tmpHTML = closeDiv.innerHTML;
				tmpHTML = tmpHTML + ' | <A class="DHTMLgoodies_formTooltip_closeMessage" href="#" onclick="window.refToFormTooltip.disableTooltip();return false">' + window.refToFormTooltip.options.disableTooltipMessage + '</A>';
				closeDiv.innerHTML = tmpHTML;
			} 
			
			outerDiv.appendChild(closeDiv);
		}
		if(window.refToFormTooltip.options.displayArrow&&window.refToFormTooltip.options.tooltipPosition=='up'){
			window.refToFormTooltip.tooltipDiv.appendChild(topDiv);	
		}
		document.body.appendChild(window.refToFormTooltip.tooltipDiv);
		
		
				
		if(window.refToFormTooltip.options.tooltipCornerSize>0){
			window.refToFormTooltip.roundedCornerObj = new DHTMLgoodies_roundedCorners();
			window.refToFormTooltip.roundedCornerObj.addTarget('formTooltipDiv',window.refToFormTooltip.options.tooltipCornerSize,window.refToFormTooltip.options.tooltipCornerSize,window.refToFormTooltip.options.tooltipBgColor,window.refToFormTooltip.options.pageBgColor,5);
			window.refToFormTooltip.roundedCornerObj.init();
		}
		

		window.refToFormTooltip.tooltipContentDiv = $('formTooltipContent');

		$('formTooltipDiv').addEvent('click', function(e) {
			window.refToFormTooltip.tooltipDiv.style.display='none';
        });
	}
	,
	__positionTooltip : function()
	{	
		var inputObj = window.refToFormTooltip.activeInput
		var offset = 0;
		var left = 0;
		var top = 0;
		if(!window.refToFormTooltip.options.displayArrow)offset = 3;	
		if(window.refToFormTooltip.options.tooltipPosition=='below'){
			left = window.refToFormTooltip.getLeftPos(inputObj);
			top = (window.refToFormTooltip.getTopPos(inputObj) + inputObj.offsetHeight + offset);
		}else if(window.refToFormTooltip.options.tooltipPosition=='right'){
			left = (window.refToFormTooltip.getLeftPos(inputObj) + inputObj.offsetWidth + offset);
			top = window.refToFormTooltip.getTopPos(inputObj);			
		}else if(window.refToFormTooltip.options.tooltipPosition=='up'){
			left = window.refToFormTooltip.getLeftPos(inputObj);
			top = (window.refToFormTooltip.getTopPos(inputObj) - inputObj.offsetHeight - offset - window.refToFormTooltip.options.toptipHeight);
		}
    	window.refToFormTooltip.positionLeft = left;
    	window.refToFormTooltip.positionTop = top;
		window.refToFormTooltip.tooltipDiv.style.left = left + "px";
		window.refToFormTooltip.tooltipDiv.style.top = top + "px";
		window.refToFormTooltip.tooltipDiv.style.width=window.refToFormTooltip.options.tooltipWidth + 'px';
		
	},
	
	/**
     * window.refToFormTooltip method will return the left coordinate(pixel) of an object
     *
     * @param Object inputObj = Reference to HTML element
     * @public
     */	
	getLeftPos : function(inputObj)
	{	
	  try{
//		  var returnValue = inputObj.offsetLeft;
//		  while((inputObj = inputObj.offsetParent) != null){
//		  	if(inputObj.tagName!='HTML'){
//		  		returnValue += inputObj.offsetLeft;
//		  		if(document.all)returnValue+=inputObj.clientLeft;
//		  	}
//		  }
//		  var dW = document.documentElement.clientWidth;
//		  var sW = document.documentElement.scrollWidth;
//		  var w = (dW - sW)/4;
		  var p0 = inputObj._getPosition().x - $(document.body).getScrollWidth();
		    var returnValue = 0;
		    if(p0 > 0) {
		    	returnValue = $(document.body).getWidth();
		    } else {
		    	returnValue = inputObj._getPosition().x;
		    }
		  return returnValue;
	  }catch(e){
//      	  var fw = window.refToFormTooltip.getFullSize()["w"];
//      	  var ww = window.refToFormTooltip.getViewSize()["w"];
//      	  alert(fw);
//      	  alert(ww);
		  var dW = document.documentElement.clientWidth;
		  var sW = document.documentElement.scrollWidth;
		  var w = (dW - sW)/4;
		  return window.refToFormTooltip.positionLeft + w;
	  }
	},
	getTopPos : function(o)
	{		
		try{
		 	var returnValue = o._getPosition().y - $(document.body).getScroll().y + o.getHeight()  + 20;
		    var scanY = $(document.body).getHeight();
		    if((returnValue > scanY || returnValue >= 0)) {
		        returnValue = o._getPosition().y;
		    } else {
		    	returnValue = o._getPosition().y + o.getHeight();
		    }
		    return returnValue;
		 }catch(e){ 
			 return window.refToFormTooltip.positionTop;
		 }
	},

    
    getViewSize:function(){
    	return {"w": window['innerWidth'] || document.documentElement.clientWidth,
    	"h": window['innerHeight'] || document.documentElement.clientHeight}
    	},
    getFullSize:function(){
    	var w = Math.max(document.documentElement.clientWidth ,document.body.clientWidth) + 
    	
    	Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    	var h = Math.max(document.documentElement.clientHeight,document.body.clientHeight) +  

    	Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    	w = Math.max(document.documentElement.scrollWidth,w);
    	h = Math.max(document.documentElement.scrollHeight,h);
    	return {"w":w,"h":h};
    	},

    
	__positionCurrentToolTipObj : function()
	{
		if(window.refToFormTooltip.activeInput)window.refToFormTooltip.__positionTooltip();
		
	},
	 getSrcElement : function(e)
	    {
	    	var el;
			if (e.target) el = e.target;
				else if (e.srcElement) el = e.srcElement;
				if (el.nodeType == 3) // defeat Safari bug
					el = el.parentNode;
			return el;	
	    },
	__hideTooltip : function(){ 
			try{
				if($chk(window.refToFormTooltip.tooltipDiv)){
					window.refToFormTooltip.tooltipDiv.style.display='none';
				}
			}catch(e){
			}
			
		},
	__hideTooltipFromLink : function(){
		
		//window.refToFormTooltip.activeInput.focus();
		setTimeout('window.refToFormTooltip.__hideTooltip()',10);
	},
	disableTooltip : function()
	{
		window.refToFormTooltip.__hideTooltipFromLink();
		window.refToFormTooltip.options.tooltipDisabled = true;	
	},
	setTooltipPosition : function(newPosition)
	{
		window.refToFormTooltip.options.tooltipPosition = newPosition;
	},
	setCloseMessage : function(closeMessage)
	{
		window.refToFormTooltip.options.closeMessage = closeMessage;
	},
	setDisableTooltipMessage : function(disableTooltipMessage)
	{
		window.refToFormTooltip.options.disableTooltipMessage = disableTooltipMessage;
	},
	setTooltipDisablePossibility : function(disableTooltipPossibility)
	{
		window.refToFormTooltip.options.disableTooltipPossibility = disableTooltipPossibility;
	},
	setTooltipDisableClose : function(disableTooltipClose)
	{
		window.refToFormTooltip.options.disableTooltipClose = disableTooltipClose;
	},
	setTooltipWidth : function(newWidth)
	{
		window.refToFormTooltip.options.tooltipWidth = newWidth;
	},
	setArrowVisibility : function(displayArrow)
	{
		window.refToFormTooltip.options.displayArrow = displayArrow;
	},
	setTooltipBgColor : function(newBgColor)
	{
		window.refToFormTooltip.options.tooltipBgColor = newBgColor;
	},
	setTooltipCornerSize : function(tooltipCornerSize)
	{
		window.refToFormTooltip.options.tooltipCornerSize = tooltipCornerSize;
	},
	setTopArrowHeight : function(arrowTopHeight)
	{
		window.refToFormTooltip.options.arrowTopHeight = arrowTopHeight;
	},
	setRightArrowWidth : function(arrowRightWidth)
	{
		window.refToFormTooltip.options.arrowRightWidth = arrowRightWidth;
	},
	setPageBgColor : function(pageBgColor)
	{
		window.refToFormTooltip.options.pageBgColor = pageBgColor;
	}
    
    
    
    
});


/************************************************************************************************************<br>
<br>
	@fileoverview
	Rounded corners class<br>
	(C) www.dhtmlgoodies.com, September 2006<br>
	<br>
	This is a script from www.dhtmlgoodies.com. You will find this and a lot of other scripts at our website.	<br>
	<br>
	Terms of use:<br>
	Look at the terms of use at http://www.dhtmlgoodies.com/index.html?page=termsOfUse<br>
	<br>
	Thank you!<br>
	<br>
	www.dhtmlgoodies.com<br>
	Alf Magne Kalleland<br>
<br>
************************************************************************************************************/

// {{{ Constructor
function DHTMLgoodies_roundedCorners()
{
	var roundedCornerTargets;
	
	this.roundedCornerTargets = new Array();
	
}
	var string = '';
// }}}
DHTMLgoodies_roundedCorners.prototype = {

	// {{{ addTarget() 
    /**
     *
	 *
     *  Add rounded corners to an element
     *
     *	@param String divId = Id of element on page. Example "leftColumn" for &lt;div id="leftColumn">
     *	@param Int xRadius = Y radius of rounded corners, example 10
     *	@param Int yRadius = Y radius of rounded corners, example 10
     *  @param String color = Background color of element, example #FFF or #AABBCC
     *  @param String color = backgroundColor color of element "behind", example #FFF or #AABBCC
     *  @param Int padding = Padding of content - This will be added as left and right padding(not top and bottom)
     *  @param String heightOfContent = Optional argument. You can specify a fixed height of your content. example "15" which means pixels, or "50%". 
     *  @param String whichCorners = Optional argument. Commaseparated list of corners, example "top_left,top_right,bottom_left"
     * 
     * @public
     */		
    addTarget : function(divId,xRadius,yRadius,color,backgroundColor,padding,heightOfContent,whichCorners)
    {	
    	var index = this.roundedCornerTargets.length;
    	this.roundedCornerTargets[index] = new Array();
    	this.roundedCornerTargets[index]['divId'] = divId;
    	this.roundedCornerTargets[index]['xRadius'] = xRadius;
    	this.roundedCornerTargets[index]['yRadius'] = yRadius;
    	this.roundedCornerTargets[index]['color'] = color;
    	this.roundedCornerTargets[index]['backgroundColor'] = backgroundColor;
    	this.roundedCornerTargets[index]['padding'] = padding;
    	this.roundedCornerTargets[index]['heightOfContent'] = heightOfContent;
    	this.roundedCornerTargets[index]['whichCorners'] = whichCorners;  
    	
    }
    // }}}
    ,
	// {{{ init()
    /**
     *
	 *
     *  Initializes the script
     *
     * 
     * @public
     */	    
	init : function()
	{
		
		for(var targetCounter=0;targetCounter < this.roundedCornerTargets.length;targetCounter++){
			
			// Creating local variables of each option
			whichCorners = this.roundedCornerTargets[targetCounter]['whichCorners'];
			divId = this.roundedCornerTargets[targetCounter]['divId'];
			xRadius = this.roundedCornerTargets[targetCounter]['xRadius'];
			yRadius = this.roundedCornerTargets[targetCounter]['yRadius'];
			color = this.roundedCornerTargets[targetCounter]['color'];
			backgroundColor = this.roundedCornerTargets[targetCounter]['backgroundColor'];
			padding = this.roundedCornerTargets[targetCounter]['padding'];
			heightOfContent = this.roundedCornerTargets[targetCounter]['heightOfContent'];
			whichCorners = this.roundedCornerTargets[targetCounter]['whichCorners'];

			// Which corners should we add rounded corners to?
			var cornerArray = new Array();
			if(!whichCorners || whichCorners=='all'){
				cornerArray['top_left'] = true;
				cornerArray['top_right'] = true;
				cornerArray['bottom_left'] = true;
				cornerArray['bottom_right'] = true;
			}else{
				cornerArray = whichCorners.split(/,/gi);
				for(var prop in cornerArray)cornerArray[cornerArray[prop]] = true;
			}
					
				
			var factorX = xRadius/yRadius;	// How big is x radius compared to y radius
		
			var obj = document.getElementById(divId);	// Creating reference to element
			obj.style.backgroundColor=null;	// Setting background color blank
			obj.style.backgroundColor='transparent';
			var content = obj.innerHTML;	// Saving HTML content of this element
			obj.innerHTML = '';	// Setting HTML content of element blank-
			
	
			
			
			// Adding top corner div.
			
			if(cornerArray['top_left'] || cornerArray['top_right']){
				var topBar_container = document.createElement('DIV');
				topBar_container.style.height = yRadius + 'px';
				topBar_container.style.overflow = 'hidden';	
		
				obj.appendChild(topBar_container);		
				var currentAntialiasSize = 0;
				var savedRestValue = 0;
				
				for(no=1;no<=yRadius;no++){
					var marginSize = (xRadius - (this.getY((yRadius - no),yRadius,factorX)));					
					var marginSize_decimals = (xRadius - (this.getY_withDecimals((yRadius - no),yRadius,factorX)));					
					var restValue = xRadius - marginSize_decimals;		
					var antialiasSize = xRadius - marginSize - Math.floor(savedRestValue)
					var foregroundSize = xRadius - (marginSize + antialiasSize);	
					
					var el = document.createElement('DIV');
					el.style.overflow='hidden';
					el.style.height = '1px';					
					if(cornerArray['top_left'])el.style.marginLeft = marginSize + 'px';				
					if(cornerArray['top_right'])el.style.marginRight = marginSize + 'px';	
					topBar_container.appendChild(el);				
					var y = topBar_container;		
					
					for(var no2=1;no2<=antialiasSize;no2++){
						switch(no2){
							case 1:
								if (no2 == antialiasSize)
									blendMode = ((restValue + savedRestValue) /2) - foregroundSize;
								else {
								  var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2),xRadius,1/factorX);
								  blendMode = (restValue - foregroundSize - antialiasSize + 1) * (tmpValue - (yRadius - no)) /2;
								}						
								break;							
							case antialiasSize:								
								var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2 + 1),xRadius,1/factorX);								
								blendMode = 1 - (1 - (tmpValue - (yRadius - no))) * (1 - (savedRestValue - foregroundSize)) /2;							
								break;
							default:			
								var tmpValue2 = this.getY_withDecimals((xRadius - marginSize - no2),xRadius,1/factorX);
								var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2 + 1),xRadius,1/factorX);		
								blendMode = ((tmpValue + tmpValue2) / 2) - (yRadius - no);							
						}
						
						el.style.backgroundColor = this.__blendColors(backgroundColor,color,blendMode);
						y.appendChild(el);
						y = el;
						var el = document.createElement('DIV');
						el.style.height = '1px';	
						el.style.overflow='hidden';
						if(cornerArray['top_left'])el.style.marginLeft = '1px';
						if(cornerArray['top_right'])el.style.marginRight = '1px';    						
						el.style.backgroundColor=color;					
					}
					
					y.appendChild(el);				
					savedRestValue = restValue;
				}
			}
			
			// Add content
			var contentDiv = document.createElement('DIV');
			contentDiv.className = obj.className;
			contentDiv.style.border='1px solid ' + color;
			contentDiv.innerHTML = content;
			contentDiv.style.backgroundColor=color;
			contentDiv.style.paddingLeft = padding + 'px';
			contentDiv.style.paddingRight = padding + 'px';
	
			if(!heightOfContent)heightOfContent = '';
			heightOfContent = heightOfContent + '';
			if(heightOfContent.length>0 && heightOfContent.indexOf('%')==-1)heightOfContent = heightOfContent + 'px';
			if(heightOfContent.length>0)contentDiv.style.height = heightOfContent;
			
			obj.appendChild(contentDiv);
	
		
			if(cornerArray['bottom_left'] || cornerArray['bottom_right']){
				var bottomBar_container = document.createElement('DIV');
				bottomBar_container.style.height = yRadius + 'px';
				bottomBar_container.style.overflow = 'hidden';	
		
				obj.appendChild(bottomBar_container);		
				var currentAntialiasSize = 0;
				var savedRestValue = 0;
				
				var errorOccured = false;
				var arrayOfDivs = new Array();
				for(no=1;no<=yRadius;no++){
					
					var marginSize = (xRadius - (this.getY((yRadius - no),yRadius,factorX)));					
					var marginSize_decimals = (xRadius - (this.getY_withDecimals((yRadius - no),yRadius,factorX)));						
	
					var restValue = (xRadius - marginSize_decimals);				
					var antialiasSize = xRadius - marginSize - Math.floor(savedRestValue)
					var foregroundSize = xRadius - (marginSize + antialiasSize);	
					
					var el = document.createElement('DIV');
					el.style.overflow='hidden';
					el.style.height = '1px';					
					if(cornerArray['bottom_left'])el.style.marginLeft = marginSize + 'px';				
					if(cornerArray['bottom_right'])el.style.marginRight = marginSize + 'px';	
					bottomBar_container.insertBefore(el,bottomBar_container.firstChild);				
					
					var y = bottomBar_container;		
					
					for(var no2=1;no2<=antialiasSize;no2++){
						switch(no2){
							case 1:
								if (no2 == antialiasSize)
									blendMode = ((restValue + savedRestValue) /2) - foregroundSize;
								else {
								  var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2),xRadius,1/factorX);
								  blendMode = (restValue - foregroundSize - antialiasSize + 1) * (tmpValue - (yRadius - no)) /2;
								}						
								break;							
							case antialiasSize:								
								var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2 + 1),xRadius,1/factorX);								
								blendMode = 1 - (1 - (tmpValue - (yRadius - no))) * (1 - (savedRestValue - foregroundSize)) /2;							
								break;
							default:			
								var tmpValue2 = this.getY_withDecimals((xRadius - marginSize - no2),xRadius,1/factorX);
								var tmpValue = this.getY_withDecimals((xRadius - marginSize - no2 + 1),xRadius,1/factorX);		
								blendMode = ((tmpValue + tmpValue2) / 2) - (yRadius - no);							
						}
						
						el.style.backgroundColor = this.__blendColors(backgroundColor,color,blendMode);
						
						if(y==bottomBar_container)arrayOfDivs[arrayOfDivs.length] = el;
						
						try{	// Need to look closer at this problem which occures in Opera.
							var firstChild = y.getElementsByTagName('DIV')[0];
							y.insertBefore(el,y.firstChild);
						}catch(e){
							y.appendChild(el);							
							errorOccured = true;
						}
						y = el;
						
						var el = document.createElement('DIV');
						el.style.height = '1px';	
						el.style.overflow='hidden';
						if(cornerArray['bottom_left'])el.style.marginLeft = '1px';
						if(cornerArray['bottom_right'])el.style.marginRight = '1px';    						
										
					}
					
					if(errorOccured){	// Opera fix
						for(var divCounter=arrayOfDivs.length-1;divCounter>=0;divCounter--){
							bottomBar_container.appendChild(arrayOfDivs[divCounter]);
						}
					}
					
					el.style.backgroundColor=color;	
					y.appendChild(el);				
					savedRestValue = restValue;
				}
	
			}			
		}
	}		
	// }}}
	,		
	// {{{ getY()
    /**
     *
	 *
     *  Add rounded corners to an element
     *
     *	@param Int x = x Coordinate
     *	@param Int maxX = Size of rounded corners
	 *
     * 
     * @private
     */		
	getY : function(x,maxX,factorX){
		// y = sqrt(100 - x^2)			
		// Y = 0.5 * ((100 - x^2)^0.5);			
		return Math.max(0,Math.ceil(factorX * Math.sqrt( (maxX * maxX) - (x*x)) ));
		
	}	
	// }}}
	,		
	// {{{ getY_withDecimals()
    /**
     *
	 *
     *  Add rounded corners to an element
     *
     *	@param Int x = x Coordinate
     *	@param Int maxX = Size of rounded corners
	 *
     * 
     * @private
     */		
	getY_withDecimals : function(x,maxX,factorX){
		// y = sqrt(100 - x^2)			
		// Y = 0.5 * ((100 - x^2)^0.5);			
		return Math.max(0,factorX * Math.sqrt( (maxX * maxX) - (x*x)) );
		
	}
	

	,

	// {{{ __blendColors()
    /**
     *
	 *
     *  Simply blending two colors by extracting red, green and blue and subtracting difference between colors from them.
     * 	Finally, we multiply it with the blendMode value
     *
     *	@param String colorA = RGB color
     *	@param String colorB = RGB color
     *	@param Float blendMode 
	 *
     * 
     * @private
     */		
	__blendColors : function (colorA, colorB, blendMode) {
		if(colorA.length=='4'){	// In case we are dealing with colors like #FFF
			colorA = '#' + colorA.substring(1,1) + colorA.substring(1,1) + colorA.substring(2,1) + colorA.substring(2,1) + colorA.substring(3,1) + colorA.substring(3,1);
		}	
		if(colorB.length=='4'){	// In case we are dealing with colors like #FFF
			colorB = '#' + colorB.substring(1,1) + colorB.substring(1,1) + colorB.substring(2,1) + colorB.substring(2,1) + colorB.substring(3,1) + colorB.substring(3,1);
		}
		var colorArrayA = [parseInt('0x' + colorA.substring(1,3)), parseInt('0x' + colorA.substring(3, 5)), parseInt('0x' + colorA.substring(5, 7))];	// Create array of Red, Green and Blue ( 0-255)
		var colorArrayB = [parseInt('0x' + colorB.substring(1,3)), parseInt('0x' + colorB.substring(3, 5)), parseInt('0x' + colorB.substring(5, 7))];	// Create array of Red, Green and Blue ( 0-255)		
		var red = Math.round(colorArrayA[0] + (colorArrayB[0] - colorArrayA[0])*blendMode).toString(16);	// Create new Red color ( Hex )
		var green = Math.round(colorArrayA[1] + (colorArrayB[1] - colorArrayA[1])*blendMode).toString(16);	// Create new Green color ( Hex )
		var blue = Math.round(colorArrayA[2] + (colorArrayB[2] - colorArrayA[2])*blendMode).toString(16);	// Create new Blue color ( Hex )
		
		if(red.length==1)red = '0' + red;
		if(green.length==1)green = '0' + green;
		if(blue.length==1)blue = '0' + blue;
			
		return '#' + red + green+ blue;	// Return new RGB color
	}
}				


