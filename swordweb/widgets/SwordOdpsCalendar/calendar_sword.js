//Js Axis   Var 1.0.0 
/**
 * Axis.class
 * 
 * JsAxis主类。
 * 提供类操作(extend、typeOf、forName)、选择器、垃圾回收
 * 
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */


var JsAxis = {};
window["undefined"] = window["undefined"];

/**
 * 类继承
 * @param {Object}	子类
 * @param {Object}	父类
 * @param (Object*) 参数
 */
JsAxis.extend = function(_child, _parent){
	var _args = "";
	if(arguments.length > 2)
	{
		for(var i = 2; i < arguments.length; i++)
		{
			_args += ", arguments[" + i + "]";
		}
	}
	if(JsAxis.typeOf(_child) == "function")
	{
		
	}
	else
	{
			
	}
}

/**
 * 获得实例类型
 * 
 * 通过获取对象的constructor()方法获得对象的源码，再通过处理字符串获得类名。
 * 没有constructor()方法的对象，通过tagName属性和xml属性来判断是否是XML或HTML。
 * 
 * @param {Object} object
 */
JsAxis.typeOf = function(_object)
{
	if (_object && _object.constructor)
	{
		var _funString	= _object.constructor.toString();
		var _className	= _funString.substr(0, _funString.indexOf("("));
		_className		= _className.replace("function", "");
		return ([_className.replace(/(^\s*)|(\s*JsAxis)/ig, ""), typeof(_object)]);  
	} 
	else if(_object && _object.tagName)
	{
		return _object.xml ? ([_object.tagName, "xml"]) : ([_object.tagName.toLowerCase(), "html"]);
	}
	return ([typeof(_object), typeof(_object)]);
}

/**
 * 通过字符串获得类对象
 * @param {String} _str
 */
JsAxis.forName = function(_str)
{
	return eval(_str);
}

/**
 * 垃圾回收器
 * 
 * @param {Object} object
 */
JsAxis.cg = function(_object)
{
	if(_object != null)
	{
		_object = function(){};
		_object = null;
		return _object;
	}
	else
	{
		CollectGarbage();
	}
}
setInterval(JsAxis.cg, 2000);


var _urlParams	= null;

JsAxis.getURLParams = function ()
{
	if(_urlParams == null)
	{
		_urlParams	= [];
		var _params	= [];
		try
		{
			_params = document.location.search.substr(1).split('&');
		}
		catch(e){}
		for (var i=0; i < _params.length; i++){
			try
			{
				var _param = _params.split('=');
				_urlParams[_param[0]] = _param[1];
			}	
			catch(e){}
		}
	}
	return _urlParams;
}

JsAxis.getURLParam = function (_key)
{
	return getURLParams()[_key];
}

// 多语种支持
var _language = null;
JsAxis.getLanguage = function()
{
	if(_language == null)
	{
		_language = MultiLanguage.newInstance("ZH_CN", "Axis_");
	}
	return _language;
}



function Axis_EN()
{
	// 日期控件
	this.date = 
	{
		monthNames : 
		[
		   "January",
		   "February",
		   "March",
		   "April",
		   "May",
		   "June",
		   "July",
		   "August",
		   "September",
		   "October",
		   "November",
		   "December"
		],
		dayNames :
		[
		   "Sunday",
		   "Monday",
		   "Tuesday",
		   "Wednesday",
		   "Thursday",
		   "Friday",
		   "Saturday"
		]
	};
}


function Axis_ZH_CN()
{
	// 日期控件
	this.date = 
	{
		monthNames : 
		[
		   "一月",
		   "二月",
		   "三月",
		   "四月",
		   "五月",
		   "六月",
		   "七月",
		   "八月",
		   "九月",
		   "十月",
		   "十一月",
		   "十二月"
		],
		dayNames :
		[
		   "周日",
		   "周一",
		   "周二",
		   "周三",
		   "周四",
		   "周五",
		   "周六"
		]
	};
}

JsAxis.ui = {};

JsAxis.ui.initPanel = function(__element, __childs)
{
	var _panel	= Panel.parse(__element);
	var _layout	= __element.getAttribute("layout");
	var _param	= __element.getAttribute("layoutParam");
	
	if(_layout != null && _layout != "")
	{
		_panel.setLayout(eval("new " + _layout + "(" + (_param != null ? _param : "") + ")"));
	}
	else
	{
	//	alert(1);
	}
	
	
	for(var _i = 0; _i < __childs.length; _i++)
	{
		_child = __childs[_i];
		if(_child != null)
		{
			var _layoutFormat = _child.getAttribute("layoutFormat");
			try
			{
				_layoutFormat = _layoutFormat != null && _layoutFormat != "" ? eval(_layoutFormat) : null;
			}
			catch(_e)
			{
			}
			_panel.add(_child, _layoutFormat);
		}
	}

	var _layoutFormat = __element.getAttribute("layoutFormat");
	if(_layoutFormat != null && _layoutFormat != "")
	{
		_panel.setAttribute("layoutFormat", _layoutFormat);
	}
	var _id = __element.getAttribute("id");
	if(_id != null && _id!="")
	{
		eval("window." + _id + " = " + _panel.getId() + ";");
	}
	return _panel;
}

JsAxis.ui.initElement = function(__element)
{
	if(JsAxis.typeOf(__element)[1] != "html")
	{
		return __element;
	}
	var _extend = __element.getAttribute("extend");
	if(_extend == null)
	{
		return __element;
	}
	try
	{
		var _extendClass	= eval(_extend);
		var _uiObjcet		= new _extendClass();
		var _attrs			= {};
		var _id				= null;
		var _name			= null;

		__element.insertAdjacentElement("beforeBegin", _uiObjcet.getHtmlElement());
		try
		{		
			_uiObjcet.paint(true);
		}
		catch(_e)
		{
			throw _e;
		}
		_attrs.inner = __element.innerHTML;
		for(var _attr in __element.attributes)
		{
			//alert(_attr);
			if(_attr == "id")
			{
				_id = __element.getAttribute("id");
			}
			else if(_attr == "name")
			{
				_name = __element.getAttribute("name");
			}
			else if(_attr.length > 2 && _attr.startsWith("on") &&
					__element.getAttribute(_attr) != null
					)
			{
				for(var _event in _uiObjcet.event)
				{
		
					if(_event.toLowerCase() == _attr.substr(2).toLowerCase())
					{
						try
						{		
										
							_event = eval("_uiObjcet.event." + _event);
							
							_eventStr = __element.getAttribute(_attr);
							if(typeof(_eventStr) == "function")
							{
								_eventStr = _eventStr.toString();
								_eventI		= _eventStr.indexOf("{") + 1;
								_eventStr = _eventStr.substr(_eventI);
								_eventI	= _eventStr.lastIndexOf("}");
								_eventStr = _eventStr.substr(0, _eventI);
							}
							_event.addListener(_eventStr);
							break;
						}
						catch(_e){alert(_e.message);}	
					}
				}		
			}

			else
			{
				try
				{
					var _prop = Beans.setMethod(_attr);
					if(_uiObjcet.hasOwnProperty(_prop))
					{
						eval("_attrs." + _attr + " = __element.getAttribute(\"" + _attr + "\");");
					}
				}
				catch(_e)
				{
				}
			}
		}
		_uiObjcet.init(_attrs);
		var _hidden = null;
		if(_name != null && _name!="")
		{
			var _hidden = __element;
			__element.setAttribute("extend", "");
		}
		else
		{
			__element.parentElement.removeChild(__element);
		}
		
		if(_id != null && _id!="")
		{
			eval("window." + _id + " = " + _uiObjcet.getId() + ";");
		}
		if(_name != null && _name!="")
		{
			
			_hidden.setAttribute("type", "text");
			_hidden.setAttribute("name", _name);
			_hidden.setAttribute("tabIndex", "-1");
			_hidden.setAttribute("value", _uiObjcet.getValue().toString());
			_hidden.setAttribute("acObj", _uiObjcet);	
			_hidden.attachEvent("onpropertychange", function(__event)
			{
				var _uiObjcet = __event.srcElement.getAttribute("acObj");
				_uiObjcet.setValue(__event.srcElement.value);
			});
			_uiObjcet.getHtmlElement().insertAdjacentElement("afterEnd", _hidden);
			_uiObjcet.setAttribute("hideenInput", _hidden);
			_uiObjcet.event.change.addListener(function(__uiObjcet)
			{
				var _hidden = __uiObjcet.getAttribute("hideenInput");
				if(__uiObjcet.getValue().toString() != _hidden.value)
				{
					_hidden.value = __uiObjcet.getValue().toString();
					//alert(_hidden.name);
				}
			});
			_hidden.style.width		= "0px";
			_hidden.style.height	= "0px";
			_hidden.style.display	= "block";
			_hidden.setAttribute("style", _hidden.getAttribute("style")+"float:left;");	
		}
		if(_attrs.layoutFormat != null && _attrs.layoutFormat != "")
		{
			_uiObjcet.setAttribute("layoutFormat", _attrs.layoutFormat);
		}
		return _uiObjcet;
	}
	catch(_e)
	{
	//	alert(_e.message);
		return __element;
	}
}

JsAxis.ui.getOffsetPosition = function(__obj, __rootTag) 
{
	var __objLeft	= __obj.offsetLeft;
	var __objTop	= __obj.offsetTop;
	var __objParent = __obj.offsetParent;
	__rootTag = __rootTag == null ? "BODY" : __rootTag;
	while (__objParent.tagName != __rootTag)
	{
		__objLeft	+= __objParent.offsetLeft;
		__objTop	+= __objParent.offsetTop;
		__objParent	= __objParent.offsetParent;
	}
	return([__objLeft,__objTop]);
}

/**
 * Component.class
 * 
 * 视图控件的抽象基类
 * 主要功能是位控件创建Window级索引，以及基础
 *  
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */


function Component(__controlName, __htmlElement)
{
	Initializtion.call	(this);
	Attributes.call		(this);
	
	var _id				= null;
	var _controlName	= __controlName == null ? "AcObj" : __controlName;
	var _htmlElement	= __htmlElement;			// 试图元素
	var _this			= this;
	var _init			= false;
	var _parent			= document.body;
	
	this.paint			= null;
	this.event			= {};
	
	this.event.blur		= new EventBase();
	this.event.focus	= new EventBase();
	
	this.setAttribute("_EPc", 0);
	
	/**
	 * 获得ID的字符串。
	 */
	this.getId = function() 
	{
		if(_id == null && _controlName != null)
		{
			_id = _controlName + (Component._count++);
			eval("window." + _id + " = this;");
		}
		return _id;
	}
	
	
	/**
	 * 获取控件的根级元素
	 */ 
	this.getHtmlElement = function()
	{
		if(_htmlElement == null)
		{
			_htmlElement = document.createElement("SPAN");
			//this.eventBinding(_htmlElement, ["onclick", "onkeyup"], _blur);
		}
		return _htmlElement;
	}
	


	/**
	 * 刷新试图
	 * @param {Object} __parent
	 */
	this.updateUI = function(__parent)
	{
		__parent = __parent != null ? __parent : _parent;
		__parent.appendChild(this.getHtmlElement());
		if(this.paint != null)
		{
			this.paint(_init);
			_init = true;
		}
		_parent = __parent;
	}

	/**
	 * 事件绑定
	 * @param {对象} __html
	 * @param {事件} __event
	 * @param {方法} __method
	 * @param {参数} __params
	 */
	this.eventBinding = function(__html, __event, __method, __params)
	{
		__html = typeof(__html) == "string" ? eval(__html) : __html;
		if(typeof(__event) == "string")
		{
			__event = [__event];
		}
		var _EPc = _this.getAttribute("_EPc");
		var _params = "_EPs" + (_EPc++);
		_this.setAttribute("_EPc", _EPc);
		_this.setAttribute(_params, [__html, __params]);
		for(var _i = 0; _i < __event.length; _i++)
		{
			if(typeof(__method) == "function")
			{
				__html.attachEvent(__event[_i], 
					function(__event)
					{
						return __method(_this.getAttribute(_params)[0], __event, _this.getAttribute(_params)[1]);
					});
			}
			else
			{
				__html.attachEvent(__event[_i], 
					function(__event)
					{
						return eval(_this.getId() + "." + __method + "(" + _this.getId() + ".getAttribute(\"" + _params + "\")[0], __event, " + _this.getId() + ".getAttribute(\"" + _params + "\")[1]);")
					});
			}
		}
	}

	/**
	 * HTML代码转化
	 * @param {Object} __html
	 */
	this.transUserHtml = function(__html)
	{
		return __html.replace(/ id=\"/g, " id=\"" + this.getId() + "_");
	}

	/**
	 * 从转化的HTML中获得对象
	 * @param {Object} __id
	 */
	this.getUserObject = function(__id)
	{
		return eval("_this.getHtmlElement().all(\"" + this.getId() + "_" + __id +"\")");
	}
	
	this.setVisible	= function(__visible)
	{
		this.getHtmlElement().style.display = __visible ? "" : "none";
	}

}

/**
 * 控件计数器
 */
Component._count = 0;

Component._current = {};

Component._current._widget	= null;
Component._current._pass	= true;
Component._current._timeout	= 0;
try{
	if(document.attachEvent){
document.attachEvent("onclick", function()
{
	try
	{
		if(Component._current._pass && Component._current._widget != null)
		{
			Component._current._timeout = window.setTimeout("Component._current._widget.event.blur.call(Component._current._widget);Component._current._widget = null;",10);
		}
			
		Component._current._pass = true;	
	}
	catch (_e)
	{
	}

});
document.attachEvent("onkeyup", function()
{
	try
	{
		if(Component._current._pass && Component._current._widget != null)
		{	
			Component._current._timeout = window.setTimeout("Component._current._widget.event.blur.call(Component._current._widget);Component._current._widget = null;",10);
		}	
		Component._current._pass = true;
	}
	catch (_e)
	{
	}

});
	}
}catch(e){

}



function InputBase(__controlName)
{
	Component.call(this, __controlName);

	this.event.change = new EventBase();
	this.getValue = null; 
	this.setValue = null; 
}

/**
* @author UI band
*/

function Calendar()
{
	InputBase.call(this, "Calendar");
	var _me					= this;
	var _popCal_matrix_Box	= null;
	var _popCalendar_timeBox_up			 = null;//日历体时选择区的上滚动箭头
	var _popCalendar_timeBox_down		 = null;//日历体时选择区的下滚动箭头
	var _popCal_timeBox_body 			 = null;//时选择体
	var _popCal_timeBox_year			 = null;
	var _popCal_timeBox_month			 = null;
	var _popCal_thisDay					 = null;
	//var _top_calendar_div				 = null;
	var _timeBox						 = null;
	var _popCal_timeBox_year_pre = null;
	var _popCal_timeBox_month_pre = null;
	
	var _day 							= null;
	var _type				= null;	
		
	this.paint = function(__init)  //----------------构造HTML------------------
				{
	//alert("calpaint")
			var _timeHTML = 
				'<div id="top_calendar_div" class="popCal_outerSpan">' +
				'<div id="popCalendar_timeBox" class="popCalendar_timeBox"><!--时选择-->' +
				'	<input type="button" id="popCalendar_timeBox_up" class="popCalendar_timeBox_up" onmouseover="this.className=\'popCalendar_timeBox_up_hover\'" onmouseout="this.className=\'popCalendar_timeBox_up\'" onmousedown="this.className=\'popCalendar_timeBox_up_down\'" onmouseup="this.className=\'popCalendar_timeBox_up_hover\'" /><!--时选择上翻页-->' +
				'	<div class="popCalendar_timeBox_body_outer"><!--时选择体-->' +
				'		<div class="popCal_timeBox_body" id="popCal_timeBox_body" style="bottom: 160px">';
				
			for(var _i = 0; _i < 24; _i++)
			{
				if ( _i >= 0 && _i <= 9 )
				{
					_timeHTML += 
						'			<div onmouseover="this.className=\'popCal_timeBox_hour_hover\'"; onmouseout="this.className=\'\'">' + '0' + _i.toString() + ':00</div>' +
						'			<div pervalue='+ _i +' class="popCal_timeBox_half" onmouseover="this.className=\'popCal_timeBox_half_hover\'"; onmouseout="this.className=\'popCal_timeBox_half\'" >30</div>';
				}
				else{
					_timeHTML += 
						'			<div onmouseover="this.className=\'popCal_timeBox_hour_hover\'"; onmouseout="this.className=\'\'">' + _i + ':00</div>' +
						'			<div pervalue='+ _i +' class="popCal_timeBox_half" class="popCal_timeBox_half" onmouseover="this.className=\'popCal_timeBox_half_hover\'"; onmouseout="this.className=\'popCal_timeBox_half\'">30</div>';
				}
			}
			_timeHTML += 
				'		</div>' +
				'	</div>' +
				'	<input id="popCalendar_timeBox_down" type="button" class="popCalendar_timeBox_down" onmouseover="this.className=\'popCalendar_timeBox_down_hover\'" onmouseout="this.className=\'popCalendar_timeBox_down\'" onmousedown="this.className=\'popCalendar_timeBox_down_down\'" onmouseup="this.className=\'popCalendar_timeBox_down_hover\'" /><!--时选择上翻页-->' +
				'</div>';
			var _dateHTML = 
				'<div id="popCalendar_outerBox" class="popCalendar_outerBox"><!--日历-->' +
				'	<div class="popCalendar_titleBar"><!--日历标题栏-->' +
				'		<div class="popCal_yearBox">' +
				'			<span id="popCal_yearBox_yearNo" class="popCal_yearBox_yearNo"></span>' +
				'			<span class="popCal_yearBox_year">年</span>' +
				'			<div class="popCal_spinset">' +
				'				<input id="popCal_spin_up_year" type="button" class="popCal_spin_up" onMouseOver="this.className=\'popCal_spin_up_hover\'" onMouseOut="this.className=\'popCal_spin_up\'"  onmousedown="this.className=\'popCal_spin_up_down\'"  onmouseup="this.className=\'popCal_spin_up_hover\'"/>' +
				'				<input id="popCal_spin_down_year" type="button" class="popCal_spin_down" onMouseOver="this.className=\'popCal_spin_down_hover\'" onMouseOut="this.className=\'popCal_spin_down\'"  onmousedown="this.className=\'popCal_spin_down_down\'"  onmouseup="this.className=\'popCal_spin_down_hover\'" />' +
				'			</div>' +
				'		</div>' +
				'		<div class="popCal_monthBox">' +
				'			<span id="popCal_monthBox_monthNo" class="popCal_monthBox_monthNo"></span>' +
				'			<span class="popCal_monthBox_month">月</span>' +
				'			<div class="popCal_spinset">' +
				'				<input id="popCal_spin_up_month" type="button" class="popCal_spin_up" onMouseOver="this.className=\'popCal_spin_up_hover\'" onMouseOut="this.className=\'popCal_spin_up\'"  onmousedown="this.className=\'popCal_spin_up_down\'"  onmouseup="this.className=\'popCal_spin_up_hover\'" />' +
				'				<input id="popCal_spin_down_month" type="button" class="popCal_spin_down" onMouseOver="this.className=\'popCal_spin_down_hover\'" onMouseOut="this.className=\'popCal_spin_down\'"  onmousedown="this.className=\'popCal_spin_down_down\'"  onmouseup="this.className=\'popCal_spin_down_hover\'" />' +
				'			</div>' +
				'		</div>' +
				'	</div>' +
				'	<div class="popCal_bodyBox" id="popCal_bodyBox"><!--日历体-->' +
				'		<p><span>日</span>一二三四五<span>六</span></p>' +
				'	<div id="popCal_thisDay" style="display:none"></div>' +
				'		<div id="popCal_matrixBox" class="popCal_matrixBox"><!--7*6的矩阵-->' +
				'		</div>' +
				'	</div>' +
				'</div>' +
				'</div>'
			_me.getHtmlElement().innerHTML	= _me.transUserHtml(_timeHTML + _dateHTML);
			//_me.getHtmlElement().className  = "popCal_outerSpan";
			_popCalendar_timeBox_up		 = _me.getUserObject("popCalendar_timeBox_up");
			_popCalendar_timeBox_down	 = _me.getUserObject("popCalendar_timeBox_down");
			_popCal_timeBox_body		 = _me.getUserObject("popCal_timeBox_body");
			_popCal_thisDay	     		 = _me.getUserObject("popCal_thisDay");
			_popCal_timeBox_year		 = _me.getUserObject("popCal_yearBox_yearNo");
			_popCal_timeBox_month	     = _me.getUserObject("popCal_monthBox_monthNo");
			_timeBox				     = _me.getUserObject("popCalendar_timeBox");
			
			_me.eventBinding(_popCalendar_timeBox_up, "onclick", _timeBox_up );
			_me.eventBinding(_popCalendar_timeBox_down, "onclick", _timeBox_down );

			
			_popCal_matrix_Box				= _me.getUserObject("popCal_matrixBox");

			//_top_calendar_div = _me.getUserObject("top_calendar_div");
			
			_me.eventBinding(_me.getUserObject("popCal_spin_up_year"), 		["onmousedown", "onmouseup"], _arrowevent, { __keyid:"popCal_spin_up_year" } );
			_me.eventBinding(_me.getUserObject("popCal_spin_down_year"), 	["onmousedown", "onmouseup"], _arrowevent, { __keyid:"popCal_spin_down_year" } );
			_me.eventBinding(_me.getUserObject("popCal_spin_up_month"), 	["onmousedown", "onmouseup"], _arrowevent, { __keyid:"popCal_spin_up_month" } );
			_me.eventBinding(_me.getUserObject("popCal_spin_down_month"), 	["onmousedown", "onmouseup"], _arrowevent, { __keyid:"popCal_spin_down_month" } );
			
			_me.eventBinding(_popCal_timeBox_body, "onclick", _popCalendarTimeBox );
			
			_me.setAttribute("_YearInput", _popCal_timeBox_year);
			_me.setAttribute("_YearMonth", _popCal_timeBox_month);
		}	
		

	
	var _commonInputHoverOut = function(__html, __event, __args)
	{
		switch ( __event.type )
		{
			case "mouseover":
					__html.style.backgroundImage = "url(../../common/images/axis/pop_calendar_matrix_hover.png)";
					__html.style.fontSize = "12px";
					__html.style.fontWeight = "bold";
				break;
			case "mouseout":
					__html.style.backgroundImage = "";
					__html.style.fontSize = "10px";
					__html.style.fontWeight = "normal";
				break;
			case "click":
				_day = { __year:__args.__year , __month: __args.__month, __day: __args.__day };
				_popCal_thisDay.innerText = __args.__day;
				_me.event.change.call(_me);
				try{
					document.all._bgFrame.style.display = "none";
					document.all._bgFrame.removeNode(true)
				}catch(e){}
				break;
		}
	};
	
	this.updateMatrix=function()
	{
		_popCal_matrix_Box_Show();
	}

	var _popCal_matrix_Box_Show = function(){
	//alert("_popCal_matrix_Box_Show")
	if( _popCal_timeBox_year_pre!=_popCal_timeBox_year.innerHTML||_popCal_timeBox_month_pre!=_popCal_timeBox_month.innerHTML ){
		_popCal_timeBox_year_pre = _popCal_timeBox_year.innerHTML;
		_popCal_timeBox_month_pre = _popCal_timeBox_month.innerHTML;
		
		
		_popCal_matrix_Box.innerHTML = "";
		var _tmpMonth	= _popCal_timeBox_month.innerHTML.substring(0, 1) == '0'? _popCal_timeBox_month.innerHTML.substring(1, 2): _popCal_timeBox_month.innerHTML;
		//_tmpMonth--;
		var _tmpYear		= _popCal_timeBox_year.innerHTML;
		var _tmpDay = new Date();
		_tmpDay.setFullYear(_tmpYear);
		_tmpDay.setMonth(_tmpMonth - 1);
		_tmpDay.setDate(1);
		_thisDay = _tmpDay.getCalendarLinked();
		
		for( i = 0 ; i < _thisDay.length ; i++ )
		{
			//alert(  _tmpMonth +"$"+ (parseInt(new Date().getMonth())+1) +"*"+ _tmpYear +"$"+( new Date().getYear() )  +"*"+ _thisDay[i] +"$"+(new Date().getDate()) +"$"+ _thisDay[i].state);
			var _dayDiv = document.createElement("div");
			_popCal_matrix_Box.appendChild(_dayDiv);
			_dayDiv.innerText = _thisDay[i].toString().length ==1? "0"+_thisDay[i].toString(): _thisDay[i].toString() ;
			//other month
			if( _thisDay[i].state !=1 )
			{
				_dayDiv.className = "popCal_notThisMonth";
			}else if( _tmpYear   		 == (new Date().getYear())
					&& _tmpMonth  		 == parseInt(new Date().getMonth())+1
					&& _thisDay[i] 		 == (new Date().getDate())
					&& _thisDay[i].state == 1 )
			{
			//today
				_dayDiv.style.fontWeight = "bold";
			}else if( i%7==0 || i%7==6 )
			{
			//weekend
				_dayDiv.className = "popCal_weekend";
			}
			_me.eventBinding(_dayDiv, ["onmouseover", "onmouseout", "onclick"], _commonInputHoverOut, { __year: _thisDay[i].year, __month: _thisDay[i].month, __day: _thisDay[i].day } );
			
		}
		}
	};
	

	var _arrowevent =function(__html, __event, __args) {
		switch(__event.type){
			case "mouseup":
				if( __args.__keyid.toString().indexOf("year")>0 ){
					if( __args.__keyid.toString().indexOf("up")>0  ){
						_popCal_timeBox_year.innerHTML++;
					}
					else{				
						_popCal_timeBox_year.innerHTML--;
					}
				}else{
					if( __args.__keyid.toString().indexOf("up")>0  ){
						var __curMonth = _popCal_timeBox_month.innerHTML.toString().substring(0, 1) =="0"? _popCal_timeBox_month.innerHTML.toString().substring(1, 2): _popCal_timeBox_month.innerHTML.toString() ;						
						__curMonth = (__curMonth % 12)+1;
						_popCal_timeBox_month.innerHTML = __curMonth.toString().length==1? "0"+__curMonth.toString(): __curMonth;		
					}
					else{
						var __curMonth = _popCal_timeBox_month.innerHTML.toString().substring(0, 1) =="0"? _popCal_timeBox_month.innerHTML.toString().substring(1, 2): _popCal_timeBox_month.innerHTML.toString() ;						
						__curMonth--;
						_popCal_timeBox_month.innerHTML = __curMonth.toString().length==1? "0"+__curMonth.toString(): __curMonth;	
						if(__curMonth==0)
						_popCal_timeBox_month.innerHTML = 12;	
					}
				}
				break;
		}
		_popCal_matrix_Box_Show();
		//_me.event.change.call(_me);
	};	//end _arrowevent

	var _popCalendarTimeBox = function()
	{
		var __html   = event.srcElement;
		var __offset = __html.getAttribute("pervalue")
		var __time     = (__offset != null) ? __offset+":"+__html.innerText : __html.innerText;
		_day = { __year:_popCal_timeBox_year.innerText , __month: _popCal_timeBox_month.innerText , __time:__time };
				//_day = { __year:_popCal_timeBox_year.innerText , __month: _popCal_timeBox_month.innerText, __day: _day.__day , __time : __time };
		_me.event.change.call(_me);		
	}
	
	var _timeBox_up = function()
	{
		if ( _popCal_timeBox_body.style.bottom == "160px" )
		{
			_popCal_timeBox_body.style.bottom = "0px";
		}
		if ( _popCal_timeBox_body.style.bottom == "260px" )
		{
			_popCal_timeBox_body.style.bottom = "160px";
		}
		if ( _popCal_timeBox_body.style.bottom == "0px" )
		{
			return;
		}
	}
	
	var _timeBox_down = function()
	{
		if ( _popCal_timeBox_body.style.bottom == "160px" )
		{
			_popCal_timeBox_body.style.bottom = "260px";
		}
		if ( _popCal_timeBox_body.style.bottom == "0px" )
		{
			_popCal_timeBox_body.style.bottom = "160px";
		}
		if ( _popCal_timeBox_body.style.bottom == "260px" )
		{
			return;
		}
	}
	
	this.setValue = function(__date)
	{
		if(__date!="" && !isNaN(__date) )
		{
			_popCal_timeBox_year.innerText  = __date.getFullYear();
			_popCal_timeBox_month.innerText = __date.getFullMonth();
			_popCal_thisDay.innerText		= __date.getFullDate();
		}else if( "string" == typeof(__date) && __date!="" ){
			var _tmpString = __date.split("-");
			if(  _tmpString[0]!="" )
				_popCal_timeBox_year.innerText 		= _tmpString[0];
			if(  _tmpString[1]!="" )
				_popCal_timeBox_month.innerText 	= _tmpString[1];

		}else {
			_popCal_timeBox_year.innerText  = new Date().getFullYear();
			_popCal_timeBox_month.innerText = new Date().getFullMonth();
			_popCal_thisDay.innerText		= new Date().getFullDate();		
		}
		_popCal_matrix_Box_Show();
	}
	
	this.getValue = function()
	{
		__y = _day.__year;
		__m = _day.__month;
		__d = _popCal_thisDay.innerText;
		__t = _day.__time;
		var __tmpdate = new Date();
		__tmpdate.setYear(__y);
		__tmpdate.setMonth(__m - 1);
		__tmpdate.setDate(__d);
		if(__t != null)
		{
			if( __t.toString().length == 4 )
			{
				__tmpdate.setHours(__t.substring(0, 1));
				__tmpdate.setMinutes(__t.substring(2, 4));
			} else{
				__tmpdate.setHours(__t.substring(0, 2));
				__tmpdate.setMinutes(__t.substring(3, 5));
			}
		}
		return __tmpdate;
	}

	this.setStyleType = function(__type)
	{
		_type = __type;			
		_typeSetting();
	}

	
	this.getStyleType = function(__helpType)
	{
		if(_type == null)
		{
			_type = "datetime";
		}
		return _type;
	}
	
	
	var _typeSetting = function()
	{ 

		if ( _me.getStyleType()  == "date" )
		{
			_timeBox.style.display = "none";

		}
		else if ( _me.getStyleType()  == "datetime" )
		{
			_timeBox.style.display = "block";

		}
	}
}	/**
* @author UI band
*/

function DateBox()
{
	InputBase.call(this, "DateBox");
	var _me = this;
	
	var _dateInputLite		= null;
	var _inputYear 			= null;
	var _inputMonth 		= null;
	var _inputDay 			= null;
	var _inputHour 			= null;
	var _inputMin 			= null;
	var _output 			= null;
	var _dateInputButton 	= null;	
	var _timeBox			= null;
	var _date_yearBox		= null;
	var _date_yearSelBox	= null;
	var _date_monthSelBox	= null;
	var _date_daySelBox		= null;				
	var _date_timeSelBox	= null;
	var _date_timeBox		= null;
	var _dateInputButton_	= null;
	var _bgFrame			= null;
	var _inputCoonYear		= null;
	var _inputCoonMonth		= null;
	var _date_monthBox		= null;
	var _date_dayBox		= null;
	var _activeElement		= null;
	var _calendar			= null;
	var _topdiv			 	= null;
	var _currentDivId		= null;
	var _enabled			= true;	
	var _conType			= null;
	
	var _date_timeBox  = null;
	var _date_yearScroll_up = null;
	var _date_yearScroll_dn = null;
	var _date_timeScroll_up = null;
	var _date_timeScroll_dn = null;
		
	var _htmlElement		= null;
	var _pageDiv			= document.all.bdiv || document.body;
	
	//var _dateOuter			= null;

	//=============================设定内置的属性值
	var _type				= "date";	
	var _maxYear			= 2049;	
	var _minYear			= 1900;
	var _oldMaxYear			= null;	
	var _oldMinYear			= null;
	var _oldYearValue		= null;
	var _oldMonthValue		= null;


	this.paint = function(__init)  //----------------构造HTML------------------
	{
		var _dateInputBox = _me.transUserHtml(
				'<div id="dateOuter" class="">' +
				'	<div class="dateInputLite" id="dateInputLite">' +
				'		<div class="dateBox">' +
				'			<div class="yearBox">' +
				'				<input id="yearInputBox" type="text" class="dateInput yearBoxInput" maxlength="4"/>' +
				'				<span class="inputCoonSpan" id="inputCoonYear">/</span>			</div>' +
				'			<div class="monthBox" id="date_monthBox">' +
				'				<input id="monthInputBox" type="text" class="dateInput monthBoxInput" />' +
				'				<span class="inputCoonSpan" id="inputCoonMonth">/</span>			</div>' +
				'			<div class="dayBox" id="date_dayBox">' +
				'				<input id="dayInputBox" type="text" class="dateInput dayBoxInput"/>' +
				'			</div>' +
				'		</div>' +
				'		<div class="timeBox" id="timeBox">' +
				'			<div class="hourBox">' +
				'				<input id="hourInputBox" type="text" class="dateInput hourBoxInput"/>' +
				'				<span class="inputCoonSpan" id="inputCoonHour">:</span>			</div>' +
				'			<div class="miniteBox">' +
				'				<input id="minuteInputBox" type="text" class="dateInput miniteBoxInput"/>' +
				'			</div>' +
				'		</div>' +
				'		<input type="text" id="dateOutput" style="display:none;" value="">' +
				'	</div>' +
				'	<div class="dateInputButton" id="dateInputButton">' +
				'		<input id="calenderBtn" type="button" />' +
				'	</div>' +
				'</div>'+
				'<div id="date_yearSelBox" class="date_yearSelBox" style="display:none;">'+
				'	<div id="date_yearCtrlBox" class="date_yearCtrlBox">'+
				'		<div id="date_yearBox" class="date_yearBox">'+
				'		</div>'+
				'	</div>'+
				'	<div id="date_yearScroll" class="date_yearScroll">'+
				'		<input id="date_yearScroll_up" type="button" class="date_yearScroll_up" onmouseover="this.className=\'date_yearScroll_up_hover\'" onmouseout="this.className=\'date_yearScroll_up\'" onmousedown="this.className=\'date_yearScroll_up_down\'" onmouseup="this.className=\'date_yearScroll_up_hover\'" />'+
				'		<input id="date_yearScroll_dn" type="button" class="date_yearScroll_down" onmouseover="this.className=\'date_yearScroll_down_hover\'" onmouseout="this.className=\'date_yearScroll_down\'" onmousedown="this.className=\'date_yearScroll_down_down\'" onmouseup="this.className=\'date_yearScroll_down_hover\'" />'+
				'	</div>'+
				'</div>'+
				'<div id="date_monthSelBox" class="date_monthSelBox" style="display:none">'+
				'</div>'+
				'<div id="date_daySelBox" class="date_daySelBox" style="display:none">'+
				'</div>'+
				'<div id="date_timeSelBox" class="date_timeSelBox" style="display:none">'+
				'	<div id="date_timeCtrlBox" class="date_timeCtrlBox">'+
				'		<div id="date_timeBox" class="date_timeBox">'+
				'		</div>'+
				'	</div>'+
				'	<div id="date_timeScroll" class="date_timeScroll">'+
				'		<input id="date_timeScroll_up" type="button" class="date_timeScroll_up" onmouseover="this.className=\'date_timeScroll_up_hover\'" onmouseout="this.className=\'date_timeScroll_up\'" onmousedown="this.className=\'date_timeScroll_up_down\'" onmouseup="this.className=\'date_timeScroll_up_hover\'" />'+
				'		<input id="date_timeScroll_dn" type="button" class="date_timeScroll_down" onmouseover="this.className=\'date_timeScroll_down_hover\'" onmouseout="this.className=\'date_timeScroll_down\'" onmousedown="this.className=\'date_timeScroll_down_down\'" onmouseup="this.className=\'date_timeScroll_down_hover\'" />'+
				'	</div>'+
				'</div>');
	
		_me.getHtmlElement().innerHTML=_dateInputBox;

		_dateInputLite		= _me.getUserObject("dateInputLite");

		_inputYear 			= _me.getUserObject("yearInputBox");
		_inputMonth 		= _me.getUserObject("monthInputBox");
		_inputDay 			= _me.getUserObject("dayInputBox");
		_inputHour 			= _me.getUserObject("hourInputBox");
		_inputMin 			= _me.getUserObject("minuteInputBox");
		_timeBox			= _me.getUserObject("timeBox");
		_output 			= _me.getUserObject("dateOutput");
		_date_yearSelBox	= _me.getUserObject("date_yearSelBox");
		_dateInputButton_	= _me.getUserObject("dateInputButton");
		_inputCoonYear		= _me.getUserObject("inputCoonYear");
		_inputCoonMonth		= _me.getUserObject("inputCoonMonth");
		_date_monthBox		= _me.getUserObject("date_monthBox");
		_date_dayBox		= _me.getUserObject("date_dayBox");
		_date_monthSelBox	= _me.getUserObject("date_monthSelBox");
		_date_daySelBox		= _me.getUserObject("date_daySelBox");	
		_date_timeSelBox	= _me.getUserObject("date_timeSelBox");
		_dateInputButton 	= _me.getUserObject("calenderBtn");
		_date_timeBox		= _me.getUserObject("date_timeBox");
		_date_yearScroll_up = _me.getUserObject("date_yearScroll_up");
		_date_yearScroll_dn = _me.getUserObject("date_yearScroll_dn");
		_date_timeScroll_up = _me.getUserObject("date_timeScroll_up");
		_date_timeScroll_dn = _me.getUserObject("date_timeScroll_dn");
		_topdiv			 	= document.createElement("div");
		_date_yearBox		= _me.getUserObject("date_yearBox");
		_htmlElement		= _me.getHtmlElement();

		document.body.appendChild(_date_monthSelBox);
		document.body.appendChild(_date_yearSelBox);
		document.body.appendChild(_date_daySelBox);	
		document.body.appendChild(_date_timeSelBox);
		
		_typeSetting();
		//_me.monthBoxSetting();
		_me.eventBinding(_date_yearBox, ["onmouseover", "onmouseout", "onclick"], _commonInputHoverOut, {__hoverClassName:"date_years_hover", __outClassName:"date_years", __isThisDate:true, __thisHoverClassName:"date_years_thisYear", __type:"year"} );
		_me.eventBinding(_date_yearBox, "onclick", "selectInSelBox", {__objectBox:_inputYear, __ctrlBox:_date_yearSelBox, __type:"year"} );
		_eventSetting();
		
		document.attachEvent("onclick", function(){ 
				var __element = event.srcElement;
				var __blockflag = 0;
					while ( __element != null )
					{
						if( __element.id != null )
						{
							if( _currentDivId == __element.id || __element.id.toString().indexOf("dateInputLite") >= 0  || __element.id.toString().indexOf("top_calendar_div") >= 0 || __element.id.toString().indexOf("calenderBtn") >= 0 )
							{
								__blockflag = 1;
								break;
							}
						}	
						__element = __element.parentNode;	
					}
					if( __blockflag == 0 )
					{
						_topdiv.style.display = "none";
						_calendar.getHtmlElement().style.display = "none";
						try{
							document.all._bgFrame.style.display = "none";
							document.all._bgFrame.removeNode(true);
						}catch(e){}
					}
					__blockflag = 0;
		});
	};
							
	this.setConType = function(__conType)
	{
		_conType = __conType;
		_formatSetting();
	};
	
	this._ = function()
	{//alert("_")
		 _dateInputLite		= null;
		 _inputYear 			= null;
		 _inputMonth 		= null;
		 _inputDay 			= null;
		 _inputHour 			= null;
		 _inputMin 			= null;
		 _output 			= null;
		 _dateInputButton 	= null;	
		 _timeBox			= null;
		 _date_yearBox		= null;
		 _date_yearSelBox	= null;
		 _date_monthSelBox	= null;
		 _date_daySelBox		= null;				
		 _date_timeSelBox	= null;
		 _date_timeBox		= null;
		 _dateInputButton_	= null;
		 _inputCoonYear		= null;
		 _inputCoonMonth		= null;
		 _date_monthBox		= null;
		 _date_dayBox		= null;
		 _activeElement		= null;
		 _calendar			= null;
		 _topdiv			 	= null;
		 _currentDivId		= null;
		 _enabled			= true;	
		 _conType			= null;
		 _date_timeBox  = null;
		 _date_yearScroll_up = null;
		 _date_yearScroll_dn = null;
		 _date_timeScroll_up = null;
		 _date_timeScroll_dn = null;
		 _htmlElement		= null;
		 _pageDiv			= document.all.bdiv || document.body;
	}
	
	this.getConType = function()
	{
		return _conType;
	};

	this.setMaxYear = function(__maxYear)
	{	
		_maxYear = __maxYear;
	};
	
	this.setMinYear = function(__minYear)
	{
		
		_minYear = __minYear;
	};
	
	this.getMaxYear = function(__maxYear)
	{
		return _maxYear;
	}
	
	this.getMinYear = function(__minYear)
	{
		return _minYear;
	}
	
	this.setEnabled = function(__enabled)
	{	
		_enabled = __enabled;
		_inputYear.disabled = _inputMonth.disabled = _inputDay.disabled = _inputHour.disabled = _inputMin.disabled = _dateInputButton.disabled = !_enabled;
	}
	
	this.getEnabled = function(__enabled)
	{
		return _enabled;
	}
	
	this.setStyleType = function(__type)
	{
		_type = __type;
		_typeSetting();	
						
	}
	
	this.getStyleType = function(__helpType)
	{
		if(_type == null)
		{
			_type = "date";
		}
		return _type;
	}

	var _format="YYYY/MM/dd hh:mm:ss";

	var _printFormat = null;

	this.setFormat = function(__format)
	{
		_format = __format;
	}

	this.getFormat = function()
	{
		return _format;
	}

	this.setPrintFormat = function(__format)
	{
		_printFormat = __format;
	}

	this.getPrintFormat = function()
	{
		return _printFormat;
	}

	this.setValue = function(__date)
	{

		if(__date == null || __date == "")
		{
		 _inputYear.value	= "";

		 _inputMonth.value	= "";
		 _inputDay.value		= "";
		 _inputHour.value	= "";
		 _inputMin.value		= "";
			return;
		}
			
		if(JsAxis.typeOf(__date)[0] != "Date")
		{
	

			__date = Date.parseByFormat(_format,__date);
			
			if(isNaN(__date.getTime()))
				__date = new Date();
		}

		_inputYear.value	= __date.getFullYear();
		_inputMonth.value	= _autoInitZero(2,1,__date.getMonth() + 1);
		_inputDay.value		= _autoInitZero(2,3,__date.getDate());
		_inputHour.value	= _autoInitZero(2,2,__date.getHours());
		_inputMin.value		= _autoInitZero(2,5,__date.getMinutes());
		try{
			if( event.srcElement.parentNode.id.toString().indexOf("timeBox_body") > 0 && _me.getStyleType()  == "datetime" )
				{_calendar.getHtmlElement().style.display = "none";}
			if( event.srcElement.parentNode.id.toString().indexOf("matrixBox") > 0 && _me.getStyleType()  == "date" )
				{_calendar.getHtmlElement().style.display = "none";}
		}catch(e){}
		_me.event.change.call(_me);
	}
	
	this.getValue = function(_getType)/*_GETTYPE is a inner variable that let u can get whether a date or a string*/
	{
		_setDefaultValue();
		var _outputDate = _inputYear.value.toString() + "/" + _inputMonth.value.toString() + "/" +  _inputDay.value.toString() + " " + _inputHour.value.toString() + ":" + _inputMin.value.toString();
		if(null != _getType && "string" == _getType)
			return _outputDate+"";

		if ( _inputMonth.value <= 0 || _inputMonth.value > 12 )
		{
			return "";
		}
		var _date = new Date(_outputDate);
		if(!isNaN(_date.getTime()))
		{
			_date.type = _type;
			if(_printFormat != null)
				_date.formatString = _printFormat;
			else
				_date.formatString = _format;	
			return _date;	
		}
		else
		{
			return "";
		}
	}
	
	var _typeSetting = function()
	{ 
		if ( _me.getStyleType()  == "date" )
		{
			_timeBox.style.display = "none";
			_dateInputLite.style.width = "95px";
			_htmlElement.className = "date_commonInput_date";
		}
		else if ( _me.getStyleType()  == "datetime" )
		{
			_timeBox.style.display = "block";
			_dateInputLite.style.width = "337px";
			_htmlElement.className = "date_commonInput_datetime";
		}
		else if ( _me.getStyleType()  == "year" )
		{
			_dateInputLite.style.borderRight = "1px solid #cccccc";
			_timeBox.style.display = "none";
			_htmlElement.className = "date_commonInput_date";
			_dateInputButton_.style.display = "none";
			_inputCoonYear.style.display = "none";
			_date_monthBox.style.visibility  = "hidden";
			_date_dayBox.style.display = "none";
			_inputMonth.value = "01";
			_inputDay.value = "01";
		}
		else if ( _me.getStyleType()  == "month" )
		{
			_dateInputLite.style.borderRight = "1px solid #cccccc";
			_timeBox.style.display = "none";
			_htmlElement.className = "date_commonInput_date";
			_dateInputButton_.style.display = "none";
			_date_dayBox.style.display = "none";
			_inputCoonMonth.style.display = "none";
			_inputDay.value = "01";
		}
	}

	var _setDefaultValue = function()
	{
		if ( _me.getStyleType()  == "year" )
		{
			_inputMonth.value = "01";
			_inputDay.value = "01";
		}
		else if ( _me.getStyleType()  == "month" )
		{
			_inputDay.value = "01";
		}
	}
	
	var _eventSetting = function() //给输入框绑定事件
	{	
		_me.eventBinding(_inputYear, "onkeydown", "inputChecking");
		_me.eventBinding(_inputYear, "onkeydown", _hyperTab);
		_me.eventBinding(_inputYear, "change", _monthDays);
		_me.eventBinding(_inputYear, "onkeyup", "inputYearSetting");
		_me.eventBinding(_inputYear, "onfocus", "setActiveElement");
		_me.eventBinding(_inputYear, "onmouseover", _inputBoxHover);
		_me.eventBinding(_inputYear, "onmouseout", _inputBoxOut);
		_me.eventBinding(_inputYear, "onclick", "showSelBox" , {__inputBoxName:_inputYear, __selBoxName:_date_yearSelBox});

		_me.eventBinding(_inputMonth, "onkeydown", "inputChecking");
		_me.eventBinding(_inputMonth, "change", _monthDays);
		_me.eventBinding(_inputMonth, "onfocus", "setActiveElement");
		_me.eventBinding(_inputMonth, "onblur", _autoAddZeroTab);
		_me.eventBinding(_inputMonth, "onkeyup", _commonInputSetting, { __maxLength:2, __minValue:1, __leftEdge:1, __rightEdge:12, __nextInputName:_inputDay });
		_me.eventBinding(_inputMonth, "onmouseover", _inputBoxHover);
		_me.eventBinding(_inputMonth, "onmouseout", _inputBoxOut);
		_me.eventBinding(_inputMonth, "onclick", "showSelBox" , {__inputBoxName:_inputMonth, __selBoxName:_date_monthSelBox});

		_me.eventBinding(_inputDay, "onkeydown", "inputChecking");
		_me.eventBinding(_inputDay, "onkeyup", "inputDaySetting");
		//_me.eventBinding(_inputDay, "onkeyup", _commonInputSetting, { __maxLength:2, __minValue:4, __leftEdge:1, __rightEdge:_calMoonLastDay(), __nextInputName:_inputHour });
		_me.eventBinding(_inputDay, "onblur", _autoAddZeroTab);
		_me.eventBinding(_inputDay, "onfocus", "setActiveElement");
		_me.eventBinding(_inputDay, "onmouseover", _inputBoxHover);
		_me.eventBinding(_inputDay, "onmouseout", _inputBoxOut);
		_me.eventBinding(_inputDay, "onclick", "showSelBox" , {__inputBoxName:_inputDay, __selBoxName:_date_daySelBox});

		_me.eventBinding(_inputHour, "onkeydown", "inputChecking");
		_me.eventBinding(_inputHour, "onfocus", "setActiveElement");
		_me.eventBinding(_inputHour, "onblur", _autoAddZeroTab);
		_me.eventBinding(_inputHour, "onkeyup", _commonInputSetting, { __maxLength:2, __minValue:2, __leftEdge:0, __rightEdge:23, __nextInputName:_inputMin });
		_me.eventBinding(_inputHour, "onmouseover", _inputBoxHover);
		_me.eventBinding(_inputHour, "onmouseout", _inputBoxOut);
		_me.eventBinding(_inputHour, "onclick", "showSelBox" , {__inputBoxName:_inputHour, __selBoxName:_date_timeSelBox});

		_me.eventBinding(_inputMin, "onkeydown", "inputChecking");
		_me.eventBinding(_inputMin, "onfocus", "setActiveElement");
		_me.eventBinding(_inputMin, "onblur", _autoAddZeroTab);
		_me.eventBinding(_inputMin, "onkeyup", _commonInputSetting, { __maxLength:2, __minValue:5, __leftEdge:0, __rightEdge:59, __nextInputName:_inputMin });
		_me.eventBinding(_inputMin, "onmouseover", _inputBoxHover);
		_me.eventBinding(_inputMin, "onmouseout", _inputBoxOut);
		_me.eventBinding(_inputMin, "onclick", "showSelBox" , {__inputBoxName:_inputMin, __selBoxName:_date_timeSelBox});

		_me.eventBinding(_dateInputButton, "onclick", "showCalBox"  , {__inputBoxName:_inputYear , __selBoxName:_getCalendar().getHtmlElement()});

		_me.eventBinding(_date_yearScroll_up, "onclick", _yearBoxScrollup );
		_me.eventBinding(_date_yearScroll_dn, "onclick", _yearBoxScrolldn );
		_me.eventBinding(_date_timeScroll_up, "onclick", _timeBoxScrollup );
		_me.eventBinding(_date_timeScroll_dn, "onclick", _timeBoxScrolldn );
	}
	
	this.setActiveElement = function()
	{
		
		event.srcElement.select();
	}
	
	var _inputBoxHover = function()
	{
		var _thisClassName = event.srcElement.className;
		var _trancedClassName = _thisClassName.replace(/dateInput/g,'dateInput dateInput_hover');
		event.srcElement.className = _trancedClassName;
	}
	
	var _inputBoxOut = function()
	{
		var _thisClassName = event.srcElement.className;
		var _trancedClassName = _thisClassName.replace(/dateInput dateInput_hover/g,'dateInput');
		event.srcElement.className = _trancedClassName;
	}
	
	var _isTab = true;
	this.inputChecking = function()
	{
		var nKeyCode = event.keyCode;
		if(!(((event.ctrlKey)&&( (nKeyCode==65)||(nKeyCode==67)||(nKeyCode==90)||(nKeyCode==86)||(nKeyCode==88) )) ||
		((nKeyCode >= 48 && nKeyCode <= 57) || (nKeyCode >= 96 && nKeyCode <= 105)) ||
		( nKeyCode == 9 || ( nKeyCode == 9 && nKeyCode == 16 ) || nKeyCode == 8 )))
		{ _isTab =false;return false }
		
		_isTab =true;
		_isTab = nKeyCode!=9;
		
		//alert(_isTab);
		return true;
	}
	
	this.inputYearSetting = function()
	{
		if ( _inputYear.value.length == 2 && _inputYear.value < 18 )
		{
			_inputYear.value = "20" + _inputYear.value;
		}
		if ( _inputYear.value.length == 2 && _inputYear.value >= 49 )
		{
			_inputYear.value = "19" + _inputYear.value;
		}
		if ( event.keyCode == "16" || event.keyCode == "9" )
		{
			return;
		}
		if ( _inputYear.value.length == 4 )
		{
			if ( _inputYear.value < _minYear || _inputYear.value > _maxYear )
			{
				event.srcElement.select();
				event.srcElement.focus();
			}
			try{
				_inputMonth.focus();
			}
			catch (e){}
		}
	}
	
	var _monthDays = function()
	{
		var _yearValue = parseInt(_inputYear.value);
		var _monthValue = null;
		if ( _inputMonth.value.substring(0,1) == 0 )
		{
			_monthValue = parseInt(_inputMonth.value.substring(1,2));
		}
		else{
			_monthValue = parseInt(_inputMonth.value);
		}
		_thisMonthDays = Date.getDays(_yearValue, _monthValue - 1);
	}

	var _commonInputSetting = function(__html, __event, __args)//__maxLength, __minValue, __leftEdge, __rightEdge, __nextInputName
	{
		if(!_isTab)
		{
			return;
		}
		_autoAddZero(__args.__maxLength, __args.__minValue);
		if ( event.srcElement.value > __args.__minValue )
		{
			if ( event.srcElement.value < __args.__leftEdge || event.srcElement.value > __args.__rightEdge )
			{
				event.srcElement.select();
				event.srcElement.focus();
			}
			else{
				try{
					__args.__nextInputName.focus();
				}
				catch(e) {}
			}
		}
		if ( event.srcElement.value.length > __args.__maxLength )
		{
			event.srcElement.value = event.srcElement.value.substring( 0, __args.__maxLength );
			event.srcElement.select();
			event.srcElement.focus();
		}
	}
	
	var _calMoonLastDay = function( __yearNum, __moonNum)
	{
		var _strLastdate = null;
		if (__moonNum == "01" || __moonNum == "03" || __moonNum == "05" || __moonNum == "07" || __moonNum == "08" || __moonNum == "10" || __moonNum == "12")
			{
				_strLastdate = 31;
			}
		else if (__moonNum == "04" || __moonNum == "06" || __moonNum == "09"|| __moonNum == "11")
			{
				_strLastdate = 30;
			}
		else if (__moonNum == "02")
			{
				var _frb29 = new Date(__yearNum + "/02/29");
				var _currMoon = _frb29.getMonth() + 1;
				if (_currMoon == 2)
					{
						_strLastdate = 29;
					}
				else if (_currMoon == 3)
					{
						_strLastdate = 28;
					}
			}
		return _strLastdate;	
	}
	
	this.inputDaySetting = function() //日输入框的事件
	{
		var _numLastDay = null;
		_numLastDay = _calMoonLastDay(_inputYear.value, _inputMonth.value);
		//alert(_numLastDay);
		if(!_isTab)
		{
			return;
		}
		_autoAddZero(2,3);
		if ( _inputDay.value > 3 )
		{
			if ( _inputDay.value <= 0 || _inputDay.value > _numLastDay )
			{
				event.srcElement.select();
				event.srcElement.focus();
			}
			if (  _inputDay.value.length > 2 )
			{
				_inputDay.value = _inputDay.value.substring( 0, 2 );
				_inputDay.select();
				_inputDay.focus();
			}			
			if ( _type == "datetime" )
			{
				_inputHour.focus();
			}
			else if ( _type == "date" )
			{
				return;
			}
		}

	}
	
	var _autoAddZeroTab = function(__html, __event, __args)
	{
		if (event.srcElement.value.length == 1)
		{
			event.srcElement.value = "0" + event.srcElement.value.toString();
		}
		_me.event.change.call(_me);
	}
	
	var _autoAddZero = function(__maxLength , __minValue)
	{
		if ( __maxLength == 2 )
		{
			if ( event.srcElement.value.length == 1 && event.srcElement.value > __minValue )
			{
				event.srcElement.value = "0" + event.srcElement.value.toString();
			}
		}
	}
	
	var _autoInitZero = function(__maxLength , __minValue , __traceValue)
	{
		if ( __maxLength == 2 )
		{
			if ( __traceValue.toString().length == 1 )
			{
				var valueWithZero = "0" + __traceValue.toString();
				return valueWithZero;
			}
			else
				return __traceValue;
		}
	}				
	
	this.YearSelBoxSetting = function()
	{
		
		if(_oldMaxYear != _maxYear && _oldMinYear != _minYear)
		{//alert("YearSelBox")
			_oldMaxYear = _maxYear;
			_oldMinYear = _minYear;
			
			var _thisYear			= new Date().getFullYear();
			_date_yearBox.innerHTML = "";		
			var _html = new StringBuffer();
			for ( var i = _minYear; i <= _maxYear; i++ )
			{			
				_html.append('<div son="true" isThis="'+(i == _thisYear)+'" class="' +(i == _thisYear?"date_years_thisYear":"date_years")+ '">' + i.toString() + '</div>')
			}
			_date_yearBox.innerHTML = _html;
			var thisYearLine = Math.ceil( ( _thisYear - _minYear ) / 5 ) - 5;
			_date_yearBox.style.top = 0 - ( thisYearLine * 20 ) + "px";
		}
	}
	
	var _commonInputHoverOut = function(__html, __event, __args)//__hoverClassName, __outClassName, __isThisDate, __thisHoverClassName
	{

		if(__args.__type)
		{
			
			__html = __event.srcElement;
			if(__html.getAttribute("son") != null)
			switch ( __event.type )
			{
				case "mouseover":
					__html.className = __args.__hoverClassName;
					if ( __html.getAttribute("isThis") == "true" )
					{
						__html.style.fontWeight = "bold";
					}
					break;
				case "mouseout":
					__html.className = __args.__outClassName;
					if ( __html.getAttribute("isThis") == "true" )
					{
						__html.className = __args.__thisHoverClassName;
					}
					break;
				case "click":
					//alert(__event.srcElement.innerText);
					break;	
			}
		}
		else
		{
			switch ( __event.type )
			{
				case "mouseover":
					__html.className = __args.__hoverClassName;
					if ( __args.__isThisDate == true )
					{
						__html.style.fontWeight = "bold";
					}
					break;
				case "mouseout":
					__html.className = __args.__outClassName;
					if ( __args.__isThisDate == true )
					{
						__html.className = __args.__thisHoverClassName;
					}
					break;
			}
		}
		

	}
	
	var _yearBoxScrollup = function()
	{
		if( parseInt(_date_yearBox.style.top) > -50)
		{
			_date_yearBox.style.top = "0px";
		}
		else
		{
			_date_yearBox.style.top = parseInt(_date_yearBox.style.top) + 100 + "px";
		}
	}
	
	var _yearBoxScrolldn = function()
	{
		var _yearBoxHeightSign = 0 - (_date_yearBox.offsetHeight - 100);
		
		if( parseInt(_date_yearBox.style.top) <= _yearBoxHeightSign  + 100)
		{
			_date_yearBox.style.top =  _yearBoxHeightSign + "px";
		}
		else
		{
			_date_yearBox.style.top = parseInt(_date_yearBox.style.top) - 100 + "px";
		}
	}
	
	this.selectYearInYearSelBox = function()
	{
		_inputYear.value = event.srcElement.innerText;
		_date_yearSelBox.style.display 	= "none";
		_inputYear.focus();
	}
	
	this.monthBoxSetting = function()
	{
		
		if (_date_monthSelBox.innerHTML == "")
		{//alert("monthBox")
			_date_monthSelBox.innerHTML = "";
			var _thisMonth = new Date().getMonth();
			var _thisYear  = new Date().getFullYear();
			var _monthList = JsAxis.getLanguage().date.monthNames;
			
			for ( var _i = 1 ; _i <= 12 ; _i++ )
			{
				var _monthDiv = document.createElement("div");
				_monthDiv.innerText = _monthList[_i - 1];
			
				if ( _i-1 == _thisMonth && _inputYear.value == _thisYear.toString() )
				{
					_monthDiv.className = "date_months_thismonth";
					_me.eventBinding(_monthDiv, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_months_hover", __outClassName:"date_months", __isThisDate:true, __thisHoverClassName:"date_months_thismonth"} );						
				}
				else
				{
					_monthDiv.className = "date_months";
					_me.eventBinding(_monthDiv, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_months_hover", __outClassName:"date_months", __isThisDate:false, __thisHoverClassName:"date_months_thismonth"} );						
				}
				_me.eventBinding(_monthDiv, "onclick", "selectInSelBox", {__objectBox:_inputMonth, __ctrlBox:_date_monthSelBox, __month : (_i <= 9 ? "0" : "") + _i.toString()} );
				_date_monthSelBox.appendChild(_monthDiv);
		}
		
		}
	}		

	this.dayBoxSetting = function()
	{
		
		if ( _oldYearValue != _inputYear.value || _oldMonthValue != _inputMonth.value)
		{//alert("dayBox")
			_oldYearValue = _inputYear.value;
			_oldMonthValue = _inputMonth.value;
			
			_date_daySelBox.innerHTML = "";
			delete _date_daySelBox;
			var myDate = new Date();
			var __today = myDate.getDate();
			var __tomonth = (myDate.getMonth()+1).toString().length ==1? "0"+(myDate.getMonth()+1).toString(): (myDate.getMonth()+1).toString() ;;
			var __toyear = myDate.getYear();
	
			if(_inputMonth.value != '')
			{
				var _tmpMonth = _inputMonth.value.substring(0, 1) == '0'? _inputMonth.value.substring(1, 2): _inputMonth.value;
				var _theDay = new Date(_inputYear.value, parseInt(_tmpMonth) - 1, 1);
				var _thisDay = _theDay.getCalendarLinked();
			}else {
				var _thisDay = new Date().getCalendarLinked();
	
			}
			for( i = 0 ; i < _thisDay.length ; i++ )
			{
				if( _thisDay[i].state < 2)
				{
					var _dayDiv = document.createElement("div");
					if( _thisDay[i].state == 1)
					{
						_dayDiv.innerText = _thisDay[i].toString().length ==1? "0"+_thisDay[i].toString(): _thisDay[i].toString() ;
						_me.eventBinding(_dayDiv, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_days_hover", __outClassName:"date_days", __isThisDate:false, __thisHoverClassName:"date_days_thisday"} );
						_me.eventBinding(_dayDiv, "onclick", "selectInSelBox", {__objectBox:_inputDay, __ctrlBox:_date_daySelBox} );				
					}	
					_dayDiv.className = "date_days";
					
					
					if( _thisDay[i] == __today 
					&& _inputMonth.value  == __tomonth 
					&& _inputYear.value == __toyear )
					{
						_dayDiv.className = "date_days_thisday";
						_me.eventBinding(_dayDiv, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_days_hover", __outClassName:"date_days", __isThisDate:true, __thisHoverClassName:"date_days_thisday"} );
					}
					_date_daySelBox.appendChild(_dayDiv);
				}	
	
			}
			
		}

	}
	
	this.timeBoxSetting = function()
	{
		
		_date_timeBox.innerHTML = "";
		
		
		for ( var _i = 0; _i < 24; _i++ )
		{
			var _timeOuterDiv = document.createElement("div");
			_timeOuterDiv.className = "date_timeBox";
			
			var _timeHourDiv = document.createElement("div");
			_timeHourDiv.className = "date_hourBox";
			
			if ( _i <= 9 )
			{
				_timeHourDiv.innerText = "0" + _i.toString() + ":00"
			}
			else{
				_timeHourDiv.innerText = _i.toString() + ":00"
			}
			
			var _timeZone = document.createElement("div");
			_timeZone.className = "date_timezone";
			
			for( var _ii = 1; _ii <= 3; _ii++ )
			{
				var _time_minBox = document.createElement("div");
				_time_minBox.innerText = _ii * 15;
				_time_minBox.className = "date_time_min";
				_me.eventBinding(_time_minBox, "onclick", "_selectTimeInSelBox");
				_timeZone.appendChild(_time_minBox);
				_me.eventBinding(_time_minBox, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_time_min_hover", __outClassName:"date_time_min", __isThisDate:false, __thisHoverClassName:"date_time_min_hover"} );
			}
			_me.eventBinding(_timeHourDiv, ["onmouseover", "onmouseout"], _commonInputHoverOut, {__hoverClassName:"date_hourBox_hover", __outClassName:"date_hourBox", __isThisDate:false, __thisHoverClassName:"date_hourBox_hover"} );
			_me.eventBinding(_timeHourDiv, "onclick", "_selectTimeInSelBox");
			_timeOuterDiv.appendChild(_timeHourDiv);
			_timeOuterDiv.appendChild(_timeZone);
			_date_timeBox.appendChild(_timeOuterDiv);
			_date_timeBox.style.top = "-130px";
		}
		
	}
	
	this._selectTimeInSelBox = function()
	{
		var _selMinute = null;
		var _seledHour = null;
		var _selHour   = null;
		if( event.srcElement.className == "date_hourBox_hover" )
		{
			_selMinute = "00";
			_selHour = event.srcElement.innerText.split(':')[0];
		}
		else{
			_selMinute = event.srcElement.innerText;
			_seledHour   = event.srcElement.parentNode.previousSibling.innerText;
			_selHour = _seledHour.split(':')[0].substring(0, 1)=='0'? _seledHour.split(':')[0].substring(1, 2): _seledHour.split(':')[0];
		}

		if ( _selHour.length == 1 )
		{
			_selHour = "0" + _selHour.toString();
		}
		_inputHour.value = _selHour;
		_inputMin.value  = _selMinute;
		_date_timeSelBox.style.display = "none";
		_me.event.change.call(_me);
	}
	
	var _timeBoxScrollup = function()
	{
		if ( _date_timeBox.style.top == "-130px" )
		{
			_date_timeBox.style.top = "-2px";
		}
		else if ( _date_timeBox.style.top == "-210px" )
		{
			_date_timeBox.style.top = "-130px";
		}
		else if ( _date_timeBox.style.top == "0px" )
		{
			return;
		}
	}
	
	var _timeBoxScrolldn = function()
	{
		if ( _date_timeBox.style.top == "-130px" )
		{
			_date_timeBox.style.top = "-210px";
		}
		else if ( _date_timeBox.style.top == "-2px" )
		{
			_date_timeBox.style.top = "-130px";
		}
		else if ( _date_timeBox.style.top == "-210px" )
		{
			return;
		}
	}

	var creatMaskFrame = function(){
		if (_bgFrame == null)
		{
			_bgFrame = document.createElement("iframe");
			_bgFrame.style.position = "absolute";
			_bgFrame.style.width	= "180px";
			_bgFrame.style.height	= "240px";
		}
		_bgFrame.id				= "_bgFrame";
		_bgFrame.style.top		= _calendar.getHtmlElement().style.top;
		_bgFrame.style.left		= _calendar.getHtmlElement().style.left;
		_bgFrame.style.zIndex	= 1;
		_bgFrame.style.display  = "block";
		document.body.appendChild(_bgFrame);
	}

	this.showCalBox = function(__html, __event, __args)//__inputBoxName, __selBoxName)
	{
		var _inputTop   = _calculateCtrlTop(__args.__inputBoxName, document.body);
		var _inputLeft  = JsAxis.ui.getOffsetPosition(__args.__inputBoxName)[0];

		var _inputRight = _pageDiv.clientWidth - _inputLeft;
		var _inputBottom = _pageDiv.offsetHeight - _inputTop;
		
		_calendar.getHtmlElement().style.top  	= _inputTop + _inputMonth.offsetHeight + 5 + "px";
		_calendar.getHtmlElement().style.left 	= _inputLeft + 2 + "px";
		creatMaskFrame();
		
		_calendar.getHtmlElement().style.zIndex = _bgFrame.style.zIndex + 1;
		
		//creatMaskFrame();
		
		_calendar.setVisible(true);

		_calendar.setStyleType(_me.getStyleType());
		if( _inputRight < _calendar.getHtmlElement().offsetWidth )
		{
			_calendar.getHtmlElement().style.left = _pageDiv.clientWidth - _calendar.getHtmlElement().offsetWidth + 20 + "px";
			creatMaskFrame();
		}
		//太靠下则往上弹

		if ( _inputBottom < _calendar.getHtmlElement().offsetHeight )
		{
			_calendar.getHtmlElement().style.top = _inputTop - _calendar.getHtmlElement().offsetHeight - 4 + "px";
			creatMaskFrame();
		}

		
		_currentDivId = _calendar.getId();
		
		_calendar.setValue(_me.getValue());
	}

	
	this.showSelBox = function(__html, __event, __args)//__inputBoxName, __selBoxName)
	{
		var _inputBoxId = __args.__inputBoxName.id.toString();
		if(_inputBoxId.indexOf("yearInputBox") > 0 || _inputBoxId.indexOf("popCal_yearBox_yearNo") > 0)
			_me.YearSelBoxSetting();
		else if(_inputBoxId.indexOf("monthInputBox") > 0 || _inputBoxId.indexOf("popCal_monthBox_monthNo") > 0)
			_me.monthBoxSetting();
		else if(_inputBoxId.indexOf("dayInputBox") > 0)	
			_me.dayBoxSetting();
		else if(_inputBoxId.indexOf("hourInputBox") > 0)	
			_me.timeBoxSetting();					
		else if(_inputBoxId.indexOf("minuteInputBox") > 0)	
			_me.timeBoxSetting()	

		_topdiv.style.display = "none";
		_currentDivId = __args.__selBoxName.id;
		_topdiv = __args.__selBoxName;
		
		//_calendar.getHtmlElement().style.zIndex = 0;
		_topdiv.style.zIndex = _calendar.getHtmlElement().style.zIndex + 1;

		var _inputTop   = _calculateCtrlTop(__args.__inputBoxName, document.body);
		var _inputLeft  = _calculateCtrlLeft(__args.__inputBoxName, document.body);
		
		/*李欧加入*/

			var _inputRight = _pageDiv.clientWidth - _inputLeft; 
			var _inputBottom = _pageDiv.offsetHeight - _inputTop;
	
			_topdiv.style.top  	= _inputTop + _inputMonth.offsetHeight + 5 + "px";
			_topdiv.style.left 	= _inputLeft + 2 + "px";
			_topdiv.style.display = "block";

			if ( _inputRight < _topdiv.offsetWidth )
			{
				_inputLeft = _pageDiv.clientWidth - _topdiv.offsetWidth;
				_topdiv.style.left 	= _inputLeft + "px";
			}
			if ( _inputBottom < _topdiv.offsetHeight )
			{
				_topdiv.style.top = _inputTop - _topdiv.offsetHeight - 4 + "px";
			}

	}
	
	this.selectInSelBox = function(__html, __event, __args)
	{
		if(__args.__month)
		{
			__args.__objectBox.value = __args.__month;
		}
		else
		{
			var _getNum = new RegExp("[0-9]+","g");
			
			__args.__objectBox.value = event.srcElement.innerText.match(_getNum);
		}
		__args.__ctrlBox.style.display 	= "none";
		__args.__objectBox.focus();
		
		_me.event.change.call(_me);			
	}
		
	this.setDayFocus = function()
	{
		_inputDay.focus();
	}

	var _getCalendar = function()
	{
		if(_calendar == null)
		{
			_calendar = new Calendar()
			_calendar.updateUI();
			_calendarYear		= _calendar.getAttribute("_YearInput");
			_calendarMonth		= _calendar.getAttribute("_YearMonth");
			_calendar.event.change.addListener(_me.getId() + ".setValue("+_calendar.getId()+".getValue());"+_me.getId() + ".setDayFocus();");
			_me.event.change.addListener(_calendar.getId() + ".setValue("+_me.getId()+".getValue())");/*because the synchronization bug*/

			_me.eventBinding(_calendarYear, "onclick", "showSelBox" , {__inputBoxName:_calendarYear, __selBoxName:_date_yearSelBox});
			_me.eventBinding(_calendarMonth, "onclick", "showSelBox" , {__inputBoxName:_calendarMonth, __selBoxName:_date_monthSelBox});					
			_calendar.getHtmlElement().style.position = "absolute";	
			_calendar.setVisible(false);
		}
		return _calendar;
	}
	
	this.yearFocus = function()
	{
		_inputYear.focus();
		_inputYear.select();
	}
	
	var _formatSetting = function()
	{
		_inputCoonYear.innerText	= _conType;
		_inputCoonMonth.innerText	= _conType;	
	}
	
	var _hyperTab = function()
	{
		if( event.keyCode == 9 )
		{
			if ( _me.getValue == "" || _me.getValue == null )
			{
				return;
			}
			else
			{
				try{
					_findNextSibling(_dateInputButton);
				}
				catch (e) {}
			}
		}
	}
	
	var _findNextSibling =	function (__item)
	{
		/*
		i = __item.sourceIndex;
		while(document.all[i].focus == null){}
		document.all[i].focus();
		*/
		i = __item.sourceIndex;
		while(document.all[i].focus == null)
			if(!(i < document.all.length))
				break;
		if(document.all[i].focus)
			document.all[i].focus();
	}

    //计算控件向上到body的距离
    var _calculateCtrlTop = function(obj, container)
    {
        if (obj != null)
        {
            var nTop = 0;
            while(obj != null)
            {   
                nTop += obj.offsetTop;
                if (container == obj.offsetParent)
                    break;
                else{
					if(obj.offsetParent == null){
						return nTop;
					}
                    nTop -= obj.offsetParent.scrollTop;
				}
                
                obj = obj.offsetParent;
            }
            return nTop;
        }
    }

    //计算控件向左到body的距离
    var _calculateCtrlLeft = function(obj, container)
    {
        if (obj != null)
        {
            var nLeft = 0;
            while(obj != null)
            {
		nLeft += obj.offsetLeft;
                if (container == obj.offsetParent)
                    break;
                else{
					if(obj.offsetParent == null){
						return nLeft;
					}
                    nLeft -= obj.offsetParent.scrollLeft;
				}
                
                obj = obj.offsetParent;

            }
            return nLeft;
        }
    }

}/**
 * Panel.class
 * 
 * 容器控件
 *  
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */
function Panel(__div)
{
	Component.call(this, "Panel", __div);
	
	var _layout = null;
	
	this.add = function(__component, __position)
	{
		this.getLayout().add(__component, __position);
	}
	
	this.getLayout = function()
	{
		if(_layout == null)
		{
			this.setLayout(new BorderLayout());
		}
		return _layout;
	}
	
	this.setLayout = function(__layout)
	{
		_layout = __layout;
		_layout.binding(this);
	}
}

Panel.parse = function(__div)
{
	return new Panel(__div);
}



/**
 * Attributes.class
 * 
 * 属性基类。
 * 
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */

function Attributes()
{
	var _attributes = [];
	
	this.getAttribute = function(__name)
	{
		return _attributes[__name];
	}
	
	this.setAttribute = function(__name, __value)
	{
		_attributes[__name] = __value;
	}
	
}

function Beans()
{
	
}

Beans.setMethod = function(__prop)
{
	return "set" + __prop.substr(0, 1).toUpperCase() + __prop.substr(1);
}

Beans.getMethod = function(__prop)
{
	return "get" + __prop.substr(0, 1).toUpperCase() + __prop.substr(1);
}

Beans.getEvent = function(__event)
{
	return "on" + __event.substr(0, 1).toUpperCase() + __event.substr(1);
}


// 备份Date的parse方法
Date._parse = Date.parse;

/**
 * 重写parse方法，简化和统一parse操作
 * 
 */
Date.parse = function()
{
	
	if(typeof(arguments[0]) == "string" && arguments.length == 1)
	{
		return new Date(Date._parse(arguments[0]));
	}
	if(arguments.length == 3)
	{
		var _date = new Date();
		_date.setFullYear(parseInt(arguments[0]));
		_date.setMonth(parseInt(arguments[1]) - 1);
		_date.setDate(parseInt(arguments[2]));
		return _date;
	}
	return Date._parse(arguments[0]);
}

Date.prototype.type = null;

Date.prototype._toString = Date.prototype.toString;

Date.prototype.toString = function()
{
	return this.format(this.formatString);
}


Date.getDays = function(__year, __month)
{
	var _monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31,30, 31, 30, 31);
	if (1 == __month)
	{
		return ((0 == __year % 4) 
				&& (0 != (__year % 100))) 
				||(0 == __year % 400) ? 29 : 28;
	}
	else
	{
		return _monthDays[__month];
	}
}

Date.prototype.getDays = function()
{
	return Date.getDays(this.getFullYear(), this.getMonth())
}

Date.prototype.getCalendarMatrix = function()
{
	var _days = this.getCalendarLinked();
	var _weekArray	= [];
	var _dayArray = null;
	for(var _i = 0; _i < _days.length; _i++)
	{
		if(_i % 7 == 0)
		{
			if(_dayArray != null)
			{
				_weekArray.push(_dayArray);
			}
			_dayArray = [];
		}
		_dayArray.push(_days[_i]);
	}
	_weekArray.push(_dayArray);
	return _weekArray;
}

Date.prototype.getCalendarLinked = function()
{
	var _dayArray	= [];
	var _week		= this.getDay();
	var _days		= this.getDays();
	var _prevYear	= this.getMonth() == 0 ? this.getFullYear() - 1 : this.getFullYear();
	var _prevMonth	= 1 + (this.getMonth() == 0 ? 11 : this.getMonth() - 1);
	var _prevDays	= Date.getDays(_prevYear, _prevMonth - 1);
	var _nextYear	= this.getMonth() == 11 ? this.getFullYear() + 1 : this.getFullYear();
	var _nextMonth	= 1 + (this.getMonth() == 11 ? 0 : this.getMonth() + 1);
	var _nextDays	= null;
	var _calendarDate = function(__year, __month, __day, __state)
	{
		this.year	= __year;
		this.month	= __month;
		this.day	= __day;
		this.state	= __state;
		
		this.getDate = function()
		{
			return Date.parse(this.year, this.month, this.day);
		}
		
		this.toString = function()
		{
			return this.day.toString();
		}
	}
	for(var _i = 0; _i < _week; _i++)
	{
		_dayArray.push(new _calendarDate(_prevYear, _prevMonth, _prevDays - (_week - _i - 1), 0));
	}
	for(var _i = 0; _i < _days; _i++)
	{
		_dayArray.push(new _calendarDate(this.getFullYear(), this.getMonth() + 1, _i + 1, 1));
	}
	_nextDays = 7 - (_dayArray.length % 7);
	for(var _i = 0; _i < _nextDays; _i++)
	{
		_dayArray.push(new _calendarDate(_nextYear, _nextMonth, _i + 1, 2));
	}
	return _dayArray;
}

Date.prototype.getFullMonth = function()
{
	var _theMonth = this.getMonth() + 1;
	return _theMonth.toString().length == 1 ? "0" + _theMonth : _theMonth ;
}

Date.prototype.getFullDate = function()
{	
	var _theDate = this.getDate();
	return _theDate.toString().length == 1 ? "0" + _theDate : _theDate ;
}

Date.prototype.getFullHours = function()
{
	var _theHour = this.getHours();
	return _theHour.toString().length == 1 ? "0" + _theHour : _theHour ;
}

Date.prototype.getFullMinutes = function()
{
	var _theMinute = this.getMinutes();
	return _theMinute.toString().length == 1 ? "0" + _theMinute : _theMinute ;
}

Date.prototype.getFullSeconds = function()
{
	var _theSeconds = this.getSeconds();
	return _theSeconds.toString().length == 1 ? "0" + _theSeconds : _theSeconds ;
}


Date.prototype.format = function(__format){
	var _a = {
		"M+" :  this.getMonth()+1, 
		"d+" :  this.getDate(),    
		"h+" :  this.getHours(),  
		"m+" :  this.getMinutes(), 
		"s+" :  this.getSeconds()
	}
  
	if(/(Y+)/.test(__format)) 
		__format = __format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));

	for(var _b in _a) 
		if(new RegExp("("+ _b +")").test(__format)) 
			__format = __format.replace(RegExp.$1, RegExp.$1.length == 1 ? _a[_b] : ("00" + _a[_b]).substr(("" + _a[_b]).length));

	return __format;
}


Date.parseByFormat = function(__format, __Str)
{
	var _format	= __format.split(/[^YMdhms]/);
	var _Str	= __Str.split(/[^0-9]/);
	
	var _a = new Array();

	for(var _i = 0; _i < 6; _i++)
		_a[_i] = "0";

	for(var _i = 0; _i < _format.length; _i++)
		if(/(Y+)/.test(_format[_i]))
			_a[0] = isNaN(_Str[_i]) ? "0" : _Str[_i];
		else if(/(M+)/.test(_format[_i]))
			_a[1] = isNaN(_Str[_i]) ? "0" : _Str[_i];
		else if(/(d+)/.test(_format[_i]))
			_a[2] = isNaN(_Str[_i]) ? "0" : _Str[_i];
		else if(/(h+)/.test(_format[_i]))
			_a[3] = isNaN(_Str[_i]) ? "0" : _Str[_i];
		else if(/(m+)/.test(_format[_i]))
			_a[4] = isNaN(_Str[_i]) ? "0" : _Str[_i];
		else if(/(s+)/.test(_format[_i]))
			_a[5] = isNaN(_Str[_i]) ? "0" : _Str[_i];

	var _b = _a[0] + "/" + _a[1] + "/" + _a[2] + " " + _a[3] + ":" + _a[4] + ":" + _a[5];

	return new Date(_b);
}

Date.prototype.formatString = "YYYY/MM/dd hh:mm;ss";



Date.prototype.formatA = function(fmt) 
{ 
	var o = { 
		"M+" : this.getMonth() + 1, 
		"d+" : this.getDate(), 
		"h+" : this.getHours(),
		"m+" : this.getMinutes(), 
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth()+3)/3),
		"S" : this.getMilliseconds() 
	}; 
	if(/(y+)/.test(fmt)) 
		fmt=fmt.replace(RegExp.$1, ""); 
	for(var k in o) 
		if(new RegExp("("+ k +")").test(fmt)) 
	fmt = fmt.replace(RegExp.$1, ","); 
	return fmt; 
}
/**
 * EventBase.class
 * 
 * 自定义事件的基类
 *  
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */

function EventBase()
{
	var _listene = null;

	var _eval		= function(__listene, __object, __params)
	{
		__listene = __listene.replace(/this/g, "__object");
		eval(__listene);
	}
	/**
	 * 增加事件
	 * @param {函数名或JavaSrcipt语句} _funOrStr
	 */
	this.addListener = function(__funOrStr)
	{
		if(_listene == null)
		{
			_listene = [];
		}
		_listene.push(__funOrStr);
	}
	
	/**
	 * 激发一次事件连锁反应
	 * @param {参数} *
	 */
	this.call = function(__object, __params)
	{
		if(_listene == null)
		{
			return;
		}
		/**
		 * 苑桐修改了原来的数组遍历的方法,在mootools中的数组是一个含有多个属性的对象,使用for(var i in xx),会遍历属性
		 */
		for(var _i = 0 ; _i < _listene.length ; _i++)
		{
			switch (typeof(_listene[_i])) 
			{
			   case "function":
			      _listene[_i](__object, __params);
			      break;
			   case "string":
			      _eval(_listene[_i], __object, __params);
			      break;
			   default: 
			      break;
			}
		}
	}
	
	/**
	 * 删除事件
	 * @param {函数名或JavaSrcipt语句} __funOrStr
	 */
	this.removeListener = function(__funOrStr)
	{
		if(_listene == null)
		{
			return;
		}
		_listene.shift(__funOrStr);
		if(_listene.length == 0)
		{
			this.removeAllListene();
		}
	}

	/**
	 * 删除全部事件
	 */
	this.removeAllListene = function()
	{
		_listene = JsAxis.cg(_listene);
	}


}

function Initializtion()
{
	this.init = function(__params)
	{
		if(__params == null)
		{
			return;
		}
		for(var _param in __params)
		{
			try
			{
				var _prop = Beans.setMethod(_param);
				if(this.hasOwnProperty(_prop))
				{
					var _value = eval("__params." + _param);
					//alert(eval(_value));
					if(_value.specified)
					{
						_value = _value.value;
					}
					if(_value.startsWith("(") && _value.endsWith(")"))
					{
						try
						{
							_value = eval(_value);
						}
						catch(_e) {}
					}

					eval("this." + _prop + "(_value);");		
				}
			}
			catch(_e)
			{
			}
		}
	}
}
/**
 * MultiLanguage.class
 * 
 * 多语种。
 * 
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */

function MultiLanguage()
{
}

MultiLanguage.getLanguageString = function()
{
	return navigator.systemLanguage ? navigator.systemLanguage : navigator.language; 
} 

MultiLanguage.newInstance = function(__default, __prefix, __postfix)
{
	var _language = MultiLanguage.getLanguageString();
	var _getLanguageClassName = function(__language, __prefix, __postfix)
	{
		return (__prefix != null ? __prefix : "") + _language + (__postfix != null ? __postfix : "");
	}
	var _languageClass = null;
	
	_language = _language.toUpperCase().replace(/-/g, "_");
	
	try
	{
		var _languageClass = eval(_getLanguageClassName(_language, __prefix, __postfix)); 
	}
	catch(_e)
	{
		try	
		{
			_language = eval(_getLanguageClassName(_language.substr(0, _language.indexOf("_")), __prefix, __postfix));
		}
		catch(__e)
		{
			_language = eval(_getLanguageClassName(__default, __prefix, __postfix)); 
		}
	}
	var _languageInstance = new _languageClass();
	return _languageInstance;
}

String.prototype.startsWith = function(__prefix)
{
	return this.substring(0, __prefix.length) == __prefix; 
}

String.prototype.endsWith = function(__suffix)
{
	return this.substring(this.length - __suffix.length) == __suffix; 
}

/**
 * StringBuffer.class
 * 
 * 提供一种新的字符串拼接机制，比原有的+=更快。
 * 
 * @author	战略客户部 于虒
 * @email	ravenbj@sina.com
 */
function StringBuffer(_str)
{
	var _strs = [];
	
	/**
	 * 清空字符串
	 */
	this.clean = function()
	{
		_strs = [];
	}
	
	/**
	 * 追加字符串
	 * @param {字符串} _str
	 */
	this.append = function(__str)
	{
		_strs.push(__str);
	}
	
	this.toString= function()
	{
		return _strs.join("");
	}
}

function initAxisCalendar(htmlNode)
{
	JsAxis.ui.initElement(htmlNode);
}