/**
 * 计算用公式

 * 
 * @type {}
 */
var gs_caculate;
/**
 * 页面元素缓存
 * 
 * @type {}
 */
var s5_formula_ele = {};
/**
 * 测试用公式

 * 
 * @type {}
 */
/*
var gs_gjj = ["{f1_18}={f1_15}",
		"{f1_25}={f1_18}>20?{f1_21}+{f1_23}+{f1_24}:{f1_21}",
		"{f1_15}={f1_11}+{f1_13}", "{f1_28}={f1_25}/{f1_26}",
		"{f1_35}={f1_31}+{f1_33}+{f1_34}"];
*/
var gs_gjj = null;
/**
 * 需要注册onchange事件的元素

 * 
 * @type {}
 */
var id_need_registed_change = {};
/**
 * 需要注册onfocus事件的元素

 * 
 * @type {}
 */
var id_need_registed_onfocus = {};
/**
 * 默认背景色

 * 
 * @type {String}
 */
var background_default = "";
/**
 * 警告背景色

 * 
 * @type {String}
 */
var background_alarm = "#cc99ff";
/**
 * 提交标记
 * 
 * @type {true:能提交 false:不能提交}
 */
var commit_flag;
/**
 * 初始化

 */
var $init_gs_caculate = function(){
	if (!gs_gjj || gs_gjj.length == 0) {
		return;
	}
	gs_caculate = thgs(gs_gjj); //替换公式
	for (var p in id_need_registed_change) {
		var obj = val_ps(p);
		registerEvent(obj, {
			"change" : [function() {
				try {
					caculate(this.id);   //公式计算
				} catch (e) {
					alert(e);
					this.focus();
				}
			}]
		});
	}
	// 给函数集合注册异常处理事件

	for (var p in id_need_registed_onfocus) {
		var obj = val_ps(p);
		registerEvent(obj, {
			"focus" : [function() {
				//alert("111");
				if (this.value == "Infinity") {
					for (var pp in id_need_registed_onfocus[this.id]) {
						val_ps(pp).style.background = background_alarm;
					}
				}
			}],
			"blur" : [function() {
				//alert("222");
				for (var pp in id_need_registed_onfocus[this.id]) {
					val_ps(pp).style.background = background_default;
				}
			}]
		});
	}

}
//window.addEvent("domready",$init_gs_caculate);

/**
 * 注册事件
 * 
 * @param {}
 *            obj
 * @param {}
 *            events
 */
function registerEvent(obj, events) {
	for (var e in events) {
		var array = events[e];
		// 使用代理注册事件，能够将this指定到当前元素

		obj.addEvent(e, delegate(obj, array));
	}
}
function delegate(o, array) {
	return function() {
		for (var i = 0; i < array.length; i++) {
			array[i].call(o);
		}
	}
};
/**
 * 替换公式
 * 
 * @param {}
 *            gs
 * @return {}
 */
function thgs(ysgs) {
	var gs = ysgs.join("][");
	gs = "[" + gs + "]"
	var result;
	var map = {};
	for (var loop = 0; loop < ysgs.length; loop++) {
		var array = String.prototype.split.call(ysgs[loop], "=");
		// map[$.trim(array[0])] = $.trim(array[1]); edit by pushi 2011-05-04
		map[array[0]] = array[1];
	}
	// 从公式组字符串中截取单个公式
	result = gs.replace(/\[{1}[^\[\]]*?\]{1}/g, function(m) {
		// 筛选{y5}={y1}+{y2};这种公式
		var regsep = /\[{1}([^(\[|\])])*?\=[^{]*\{(.+?)\}*[^{]*\]{1}/;
		if (m.match(regsep)) {
			var tmp = String.prototype.split.call(m, "=");
			// 当前公式涉及的自变量集合
			var zbl_array = {};
			// 替换公式递归函数
			function thstr(str) {
				// 将等号右边的公式自变量部分的所有自变量筛选出来，如果是伪自变量（即函数作为其他公式的自变量存在）的，进行迭代替换。

				str = str.replace(/\{(.+?)\}/g, function(x, i) {
					if (map[x]) {
						x = "(" + thstr(map[x]) + ")";
					}
					// 注册自变量集合

					id_need_registed_change[i] = i;
					zbl_array[i] = i;
					return x;
				});
				return str;
			}
			var tmp_y = new String(tmp[0].substr(1, tmp[0].length));
			tmp_y.replace(/\{(.+?)\}/g, function(x, i) {
				// 注册函数集合
				id_need_registed_onfocus[i] = zbl_array;
				return "";
			});
			m = tmp[0] + "=" + thstr(tmp[1].substr(0, tmp[1].length - 1)) + "]";
		}
		return m;
	});
	return result;
}

/**
 * 取小数点后两位，如果为负数，置为0
 * 
 * @param {}
 *            s
 * @return {Number}
 */
function pf(s,id) {
	if (!isNaN(parseFloat(s))) {
        var strInt = Math.round(parseFloat(s) * 100) / 100;
        var el=$(id);
        if (el.format) {
            return sword_fmt.formatText(el, strInt, '', el.format).value;
        } else {
            var strInt = parseFloat(s).round(2);
            return parseFloat(strInt);
        }
	} else {
        return 0;
	}
}
/**
 * 填充FROM缓存对象
 */
function fillform() {
	var tags = document.getElementsByTagName("input");
	for (var i = 0; i < tags.length; i++) {
		if (tags[i].id != "") {
			s5_formula_ele[tags[i].id] = tags[i];
		}
	}
}
/**
 * 公式引擎--计算方法
 * 
 * @param {}
 *            id
 */
function caculate(id) {
	// 截取自变量变化所影响到的公式
	var re = new RegExp("\\[{1}[^\\[|\\]]*?\\{" + id + "}.*?\\]{1}", "g");
	var temp = new String(gs_caculate);
	var begin = new Date();
	temp.replace(re, function() {// 筛选出的需要计算的公式[]
				var s = Array.prototype.slice.call(arguments, 0, 1)[0];
				var index = s.indexOf("=");
				// 将自变量的值替换进公式并执行计算
				var y;// 缓存需要计算公式的y
				s = String.prototype.slice.call(s, 1, -1).replace(/\{(.+?)\}/g,
						function(m, i) {// 替换自变量
							var l = Array.prototype.slice.call(arguments, -2,
									-1)[0];
							if (l < index) {
								y = "s5_formula_ele['" + i + "'].value";
								return y;
							} else {
								var v = val(s5_formula_ele[i].value);
								if(v<0){
									v=v+"";
									var vs = v.split('-');
									v = "(0).subtract("+vs[1]+")"; //解决负数解析出错
								}
								return '('+v+')';
							}

						});
				var str = beforeval(s);
				eval(str);// 公式计算
                var real = y.replace(/value$/,"set('realvalue'," + y+ ".replace(/[$,%]/g,''))");
				eval(y + "=pf(" + y+","+y.split("'")[1]+ ")");// 对公式计算结果截取小数点
				eval(real);
				if (eval(y + "=='Infinity'")) {
					throw "除零错误！请检查录入的数据！";
				}
				return "";
			});
	var end = new Date();
	
}

function beforeval(s){
	var re=new RegExp("[\\+\\-*/]+","g");
	s = s.replace(re, function(m) {
				if(m=="+")return ".accAdd";
				else if(m=="-") return ".subtract";
				else if(m=="*") return ".multiple";
				else if(m=="/") return ".divide";
				else return m;
			});
	
	return s;
}

/**
 * 取元素值，没有值按0对待
 * 
 * @param {}
 *            v
 * @return {Number}
 */
function val(v) {
	var value = replaceNum(v);
	if (isNaN(value)) {
		return 0;
	}
	if(new String(value).length>16){
		return value;
	}else{
		return new Number(value);
	}
}
/**
 * 替换页面空格
 * 
 * @param {}
 *            Num
 * @return {}
 */
function replaceNum(Num) {
	if(new String(Num).length>16){
		return ("" + Num).replace(/(^\s+)|(\s+$)/g, "")
			.replace(/,/g, "");
	}else{
		return parseFloat(("" + Num).replace(/(^\s+)|(\s+$)/g, "")
			.replace(/,/g, ""));
	}
}
/**
 * 根据ID获取界面元素
 * 
 * @param {}
 *            id
 * @return {}
 */
function val_ps(id) {
	if (s5_formula_ele[id]) {
		return s5_formula_ele[id];
	} else {
		s5_formula_ele[id] = $(id);
		return s5_formula_ele[id];

	}
}

/**
 * 取绝对值计算。
 * @param val 数值
 * @return
 */
var ABS = function (val){
	return Math.abs(val);
}

/**
 * IF判断计算,如果条件值为真则返回param1,如果条件值为假则返回param2。
 * @param bj 布尔值,param1 真值, param2 假值
 * @return param1/param2 值
 */
var IF = function(bj,param1, param2){
	if(bj){
		return param1;
	}else{
		return param2;
	}
}
/**
 * OR函数。
 * @param 不定参数。参数全部为布尔值
 * @return 当所有参数为假则返回false,否则返回true
 */
var OR = function(){
	var leng = arguments.length;
	for(var i = 0; i < leng; i++){
		if(arguments[i]){
			return true;
		}
	}
	return false;
}
/**
 * AND函数。
 * @param 不定参数。参数全部为布尔值
 * @return 当所有参数为真则返回true,否则返回false
 */
var AND = function(){
	var leng = arguments.length;
	for(var i = 0; i < leng; i++){
		if(!arguments[i]){
			return false;
		}
	}
	return true;
}


