var SwordValidator = new Class({
    Implements:[Events, Options],
    options:{
        vType:'intime'
    },
    initialize:function (options) {
        this.setOptions(options);
    },
    initParam:function (vType) {
    	 if (!window.tooltips) {
         	window.tooltips = pageContainer.create('SwordToolTips');
         }
         this.tooltips = window.tooltips;
        if ($chk(vType))
            this.options.vType = vType;
    },
    exeVal:true,
    activeV:function () {
        this.exeVal = true;
    },
    cancelV:function () {
        this.exeVal = false;
    },
    tooltips:null,
    _add:function (el) {
        var up = el.retrieve('upManager');
        if (up) {
            up.addEvent('onFileSuccess', function () {
                this.validate(el);
            }.bind(this));
        }
        if (this.options.vType == 'intime') {
            el.addEvent('focus', function (event) {
                if (Browser.Engine.trident) {
                    event.target.originValue = event.target.value;
                }
                this.intimeValidate(event.target);
            }.bind(this));
            el.addEvent('blur', function (event) {
                this.intimeValidate(event.target);
                this.tooltips.hide();
            }.bind(this));
            if (Browser.Engine.trident) {
                el.attachEvent('onpropertychange', function (event) {
                    if (el != document.activeElement) {
                        return;
                    }
                    if (event.propertyName != 'value')return;
                    if (event.srcElement.originValue == event.srcElement.value)return;
                    event.srcElement.originValue = event.srcElement.value;
                    this.intimeValidate($(event.srcElement));
                }.bind(this));
            } else {
                el.addEventListener('input', function (event) {
                    this.intimeValidate(event.target);
                }.bind(this), false);
            }
        } else {
        	if(el.get("placeholder") != "true"){
        		 el.addEvent('blur', this.validate.bind(this));
        	}
        }
        var rule = el.get('rule').split('||'), isAdd = true;
        for (var i = 0; i < rule.length; i++) {
            if (rule[i] != 'number') {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            if (Browser.Engine.trident)el.style.imeMode = "disabled";
            el.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress', function (event) {
                var key = event.code;
                if ((key > 95 && key < 106) || (key > 47 && key < 58) || key == 110 || key == 190 || key == 189 || key == 107 || (event.shift && key == 187) || key == 107)return true;
                if (Browser.Engines.gecko() && (key == 46 || key == 45 || key == 43))return true;
                return (key == 8 || key == 37 || key == 39 || (event.control && key == 86) || (event.shift && key == 36));
            }.bind(this));
        }
    },
    validate:function (e) {
        if (!this.exeVal)return true;
        e = ($type(e) == 'event') ? new Event(e).target : e;
        var state = "";
        var msg = "";
        if(e.get("placeholder")=="true" && e.get("value") == e.get("defvalue")){
        	state = "true";
        }else{
        	 var obj = this.doValidate(e);
             state = obj.state;
             msg = obj.msg;
        }
        var vType = $defined(e.get('vType')) ? e.get('vType') : this.options.vType;
        if ($chk(e.get('error'))) {
            msg = e.get('error');
        }
        this[vType].run([e, state, msg], this);
        return state;
    },
    doValidate:function (e) {
        var msg = "";
        var customFunctionReturnObj;
        var rule = e.get("rule");
        if (!rule)return {state:"true"};
        if (!$defined(e.get("ruleType"))) {
            var ruleArray = [];
            var type = 'solo';
            if (rule.contains('_')) { //与关系
                ruleArray = rule.split('_');
                msg = this._msg.t;
                type = 'and';
            } else if (rule.contains('||')) { //或关系
                ruleArray = rule.split('||');
                msg = this._msg.t;
                type = 'or';
            } else {   //单个校验
                ruleArray[0] = rule;
            }
            var flag = (type != 'or') ? true : false;
            var state = flag;
            ruleArray.each(function (item, index, a) {
                var tempMSG = "";
                if (item.contains('contrast')) {
                    e.set('contrastValue1', item.split(";")[1]);
                    if (item.split(";").length == 3) {
                        e.set('contrastValue2', item.split(";")[2]);
                    }
                    item = 'contrast';
                } else if (item.contains('range')) {
                    e.set('begin', item.split(";")[1]);
                    e.set('end', item.split(";")[2]);
                    item = 'range';
                } else if (item.contains('customCheckStyle')) {
                    e.set('customCheckStyle', item.split(";")[1]);
                    item = 'customCheckStyle';
                } else if (item.contains('length')) {
                    var tempItemArray = item.split(";");
                    if (tempItemArray.length == 3) {
                        e.set('begin', item.split(";")[1]);
                        e.set('end', item.split(";")[2]);
                    } else {
                        if (tempItemArray[1].contains(",")) {
                            e.set('begin', tempItemArray[1].split(",")[0]);
                            e.set('end', tempItemArray[1].split(",")[1]);
                        } else {
                            e.set('begin', tempItemArray[1]);
                        }
                    }
                    item = 'length';
                } else if (item.contains('customFunction')) {
                    e.set('onValidate', item.split(";")[1]);
                    item = 'customFunction';
                } else if (item.contains('regexp')) {
                    e.set('regexp', item.split(";")[1]);
                    item = 'regexp';
                } else if (item.contains("number") && item.contains(",")) {
                    var defineArray = item.substring(item.indexOf("(") + 1, item.indexOf(")")).split(",");
                    e.set("zl", defineArray[0] - defineArray[1]);
                    e.set("xl", defineArray[1]);
                    item = 'numberDefine';
                }else if(item.contains("file")){
               	    var tempItemArray = item.split(";");
            	 if (tempItemArray.length == 2) {
            		e.set("filetype", tempItemArray[1]);
            	 }
            	    item = 'fileDefine';
                }
                if ($defined(this.reg[item])) {
                    state = (state == flag) ? this["testRegexp"].run([e, this.reg[item]], this) : state;
                } else if (item == "regexp") {
                    state = (state == flag) ? this["testRegexp"].run([e, e.get("regexp")], this) : state;
                } else if (item == "customFunction") {
                    if ($chk(e.get('onValidate'))) {
                        customFunctionReturnObj = this.getFunc(e.get("onValidate"))[0](e, this.getElValue(e));
                        if ($defined(customFunctionReturnObj["state"]) && (state == flag) && (customFunctionReturnObj["state"] == !flag)) {
                            state = customFunctionReturnObj["state"];
                        }
                        tempMSG = customFunctionReturnObj["msg"];
                    }
                } else if (item != "customFunction") {
                    state = (state == flag) ? this[item].run(e, this) : state;
                }
                if (item.contains('contrast')) {
                    tempMSG = this._msg.t + this._msg['contrast'] + e.get("contrastValue1");
                    if ($chk(e.get("contrastValue2")))
                        tempMSG += e.get("contrastValue2");
                } else if (item.contains('range')) {
                    tempMSG = this._msg.t + this._msg['range'] + e.get("begin") + "和" + e.get("end") + "之间";
                } else if (item.contains('length')) {
                    tempMSG = this._msg.t + this._msg['length'] + e.get("begin") + ($defined(e.get("end")) ? ("和" + e.get("end") + "之间") : "")+i18n.nullStr;
                } else if (item.contains("numberDefine")) {
                    tempMSG = this._msg.t + "数字,且整数部分最多" + e.get("zl") + "位,且小数部分最多" + e.get("xl") + "位";
                } else if (item.contains("customCheckStyle")) {
                    tempMSG = this._msg.t + this._msg['customCheckStyle'] + e.get("customCheckStyle");
                } else if(item.contains("fileDefine")){
                	 tempMSG = this._msg.t + "文件后缀名必须为：" + e.get("filetype");
                } else if (!item.contains('customFunction')) {
                    tempMSG = this._msg.t + this._msg[item];
                }
                if (index == 0) {
                    msg += tempMSG;
                } else {
                    msg += ($defined(tempMSG)) ? (this._msg[type] + tempMSG) : "";
                }
                if (item == 'date') {
                    var formatString = e.get("dataformat");
                    if (!$chk(formatString)) formatString = "yyyy-MM-dd";
                    msg += formatString;
                }

            }.bind(this));
        } else {
            e = (e.hasClass('swordform_item_oprate')) ? e : e.getParent('div.swordform_item_oprate');
            re = this.Group(e, msg);
            state = re.state;
            msg = re.msg;
        }
        return {'state':state, 'msg':$chk(e.get('msg')) ? e.get('msg') : msg};
    },
    Group:function (e, msg) {
        var els = e.getElements('input:checked').length;
        var rule = e.get('rule');
        var ruleArray = [];
        ruleArray = rule.split('_');
        if (ruleArray.length > 2) {
            var msg = '请您选择至少' + ruleArray[1].toInt() + '项,最多不超过' + ruleArray[2].toInt() + '项';
            if (ruleArray[1] == ruleArray[2])msg = "请您至少选择" + ruleArray[1].toInt() + "项";
            return {state:(ruleArray[1].toInt() <= els && els <= ruleArray[2].toInt()), msg:msg};
        } else {
            if (ruleArray.length == 2)ruleArray[0] = ruleArray[1];
            return {state:(ruleArray[0].toInt() <= els), msg:'请您至少选择' + ruleArray[0].toInt() + '项'};
        }
    },
    _msg:{
        't':'',
        'number':i18n.num,
        'numberInt':i18n.numInt,
        'numberFloat':i18n.numFloat,
        'numberScience':i18n.numScience,
        'character':i18n.character,
        'chinese':i18n.chinese,
        'twoBytes':i18n.twoBytes,
        'english':i18n.english,
        'date':i18n.date,
        'number$character':i18n.numChar,
        'number$english':i18n.numEnglish,
        'qq':i18n.qq,
        'telephone':i18n.telephone,
        'cellphone':i18n.cellphone,
        'idcard':i18n.idcard,
        'postal':i18n.postal,
        'currency':i18n.currency,
        'email':i18n.email,
        'url':i18n.url,
        'and':i18n.and1,
        'or':i18n.or,
        'solo':'',
        'must':i18n.must,
        'contrast':i18n.contrast,
        'range':i18n.range,
        'customCheckStyle':i18n.customCheckStyle,
        'length':i18n.length1,
        'customFunction':i18n.customFunction
    },
    reg:{
        number:/^[-]?\d+(\.\d+)?([Ee][-+]?[1-9]+)?$/i,
        numberInt:/^[-]?\d+$/i,
        numberFloat:/^[-]?\d+\.\d+$/i,
        numberScience:/^[+|-]?\d+\.?\d*[E|e]{1}[+]{1}\d+$/,
        character:/^[\u4e00-\u9fa5A-Za-z]+$/i,
        chinese:/^[\u4e00-\u9fa5]+$/i,
        twoBytes:/^[^\x00-\xff]+$/i,
        english:/^[A-Za-z]+[A-Za-z\s]*$/i,
        number$character:/^[\u4e00-\u9fa5A-Za-z0-9]+$/i,
        number$english:/^[\w]+$/i,
        qq:/^[1-9]\d{4,8}$/i,
        telephone:/^((\(0\d{2,3}\))|(0\d{2,3}-))?[1-9]\d{6,7}(-\d{1,4})?$/i,
        cellphone:/^0?1\d{10}$/i,
        postal:/^\d{6}$/i,
        currency:/^\$[-+]?\d+(\.\d+)?([Ee][-+]?[1-9]+)?$/i,
        email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i,
        url:/^(http|https|ftp):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i
    }, getElValue:function (e) {
        var value;
        if (e.get('tag') == 'div') {
            if ($defined(e.get('realvalue'))) {
                value = e.get('realvalue');
            } else {
                value = e.get('text');
            }
        } else {
            value = e.get('realvalue') || e.get('value');
        }
        var input = e.getElement("input");
        if(value == "" && $chk(input)){
        	value = input.get("value");
        }
        if (value == undefined)value = '';
        return value;
    }, testRegexp:function (e, rule) {
        if ($type(rule) != 'regexp') {
            //转成RegExp对象
            if (rule.test('\\/\\^'))
                rule = rule.substring(1, rule.length);
            if (rule.test('\\/\\i'))
                rule = rule.substring(0, rule.length - 2);
            rule = new RegExp(rule);
        }
        var value = this.getElValue(e);
        if (value == "")
            return true;
        return rule.test(value);
    },
    must:function (e) {
        var up = e.retrieve('upManager');
        if (up) {//file2
            return up.fileList.length > 0;
        }
        if (e.get('tag') == 'div') {
            return ($defined(e.get("text")) && (e.get("text").trim() != ""));
        } else {
        	if($defined(e.get("swordType")) && (e.get("swordType")== "tree"))
        		return ($defined(e.get("realvalue")) && (e.get("realvalue").trim() != ""));
        	else
        		return ($defined(e.get("value")) && (e.get("value").trim() != ""));
        }
    },
    contrast:function (e) {
        var value = this.getElValue(e);
        if (value == "")
            return true;
        if (this.reg.number.test(value)) {
            var flag = eval(value + e.get("contrastValue1"));
            if ($chk(e.get("contrastValue2")))
                flag = flag ? eval(value + e.get("contrastValue2")) : false;
            return flag;
        } else {
            return false;
        }
    },
    range:function (e) {
        var value = this.getElValue(e);
        if (value == "")
            return true;
        if (this.reg.number.test(value)) {
            return (value > e.get("begin") && value < e.get("end"));
        } else {
            return false;
        }
    },
    customCheckStyle:function (e) {
        var text = this.getElValue(e);

        var reList = e.get('customCheckStyle');
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (reList.indexOf(c) >= 0) {
                return false;
            }
        }
        return true;
    },
    length:function (e) {
        var value = this.getElValue(e);
        if (value == "")
            return true;
        var len = this.getLen(value);
        if (e.get("rule").contains(",")) {
            return (len >= e.get("begin") && len <= e.get("end"));
        } else {
            if ($defined(e.get("end")))
                return (len > e.get("begin") && len < e.get("end"));
            else return len == e.get("begin");
        }
    },
    getLen:function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var strCode = str.charCodeAt(i);
            var strChar = str.charAt(i);
            if ((strCode > 65248) || (strCode == 12288) || this.reg.chinese.test(strChar))
                len = len + 2;
            else
                len = len + 1;
        }
        return len;
    },
    idcard:function (e) {
        var value = this.getElValue(e);
        if (value == "")
            return true;
        return this.checkIdcard(value);
    },
    
    checkIdcard:function(num){
        num = num.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
//            alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。 ');
            return false;
        }
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        // 下面分别分析出生日期和校验位
        var len, re; len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);  // 检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay; bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
//                alert('输入的身份证号里出生日期不对！');
                return false;
            } else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD
         // 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);  // 检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
//                alert('输入的身份证号里出生日期不对！');
                return false;
            }
            else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD
        // 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
//                    alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
        }
       
        return false;
    },
    
//    ,checkIdcard1:function(idcard){
//    	debugger;
//    	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
//
//    	var idcard,Y,JYM; 
//    	var S,M; 
//    	var idcard_array = new Array(); 
//    	idcard_array = idcard.split(""); 
//
//    	//地区检验 
//    	if(area[parseInt(idcard.substr(0,2))]==null) return false; 
//
//    	//身份号码位数及格式检验 
//    	switch(idcard.length){ 
//    	case 15: 
//    	if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){ 
//    	ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性 
//    	} else { 
//    	ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性 
//    	} 
//
//    	if(ereg.test(idcard)) return true;
//    	else return false; 
//    	break; 
//    	case 18: 
//    	//18位身份号码检测 
//    	//出生日期的合法性检查 
//    	//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])) 
//    	//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])) 
//    	if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
//    	ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
//    	} else { 
//    	ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
//    	} 
//    	if(ereg.test(idcard)){//测试出生日期的合法性 
//    	//计算校验位 
//    	S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
//    	+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
//    	+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
//    	+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
//    	+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
//    	+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
//    	+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
//    	+ parseInt(idcard_array[7]) * 1 
//    	+ parseInt(idcard_array[8]) * 6 
//    	+ parseInt(idcard_array[9]) * 3 ; 
//    	Y = S % 11; 
//    	M = "F"; 
//    	JYM = "10X98765432"; 
//    	M = JYM.substr(Y,1);//判断校验位 
//    	if(M == idcard_array[17]) return true; //检测ID的校验位 
//    	else return false; 
//    	} 
//    	else return false; 
//    	break; 
//    	default: 
//    	return false; 
//    	break; 
//    	} 
//    },
    numberDefine:function (e) {
        var value = this.getElValue(e);
        if (value == "")return true;
        if (!this.reg.number.test(value))return false;
        var valueStrArray = value.split(".");
        var zlength = e.get("zl");
        if (valueStrArray.length == 2){
        	var zlArray = valueStrArray[0].split(",");
        	var zlLength=0;
        	for(var i=0;i<zlArray.length;i++){
        		zlLength = zlLength + zlArray[i].length;
        	}
        	return zlLength <= zlength && valueStrArray[1].length <= e.get("xl");
        }
        
        else return valueStrArray[0].length <= zlength;
    },
    fileDefine:function (e) {
        var value = this.getElValue(e);
        if (value == "")return true;
        var i = value.lastIndexOf(".");
        var type = value.substring(i+1, value.length);
        var validatorType = e.get("filetype");
        if(validatorType.contains(",")){
        	var typeArray = validatorType.split(",");
        	if(typeArray.contains(type)){
        		return true;
        	}else{
        		return false;
        	}
        }else{
        	if(validatorType == type){
        		return true;
        	}else{
        		return false;
        	}
        }
    },
    date:function (e) {
        var val;
        if (e.get('widget') == 'calendar') {
            val = e.get('value');
        } else {
            val = this.getElValue(e);
        }
        if (val == "")
            return true;
        
        var dataformat = e.get('dataformat') || "yyyy-MM-dd";
        if (val.split(".").length == 2) {
        	val = val.split(".")[0];
        }
        val = SwordDataFormat.formatStringToString(val, "yyyy-MM-dd HH:mm:ss", dataformat);
        if (!SwordDataFormat.isDate(val, dataformat))
            return false;
        else
            return true;
    },
    userDefineFunction:null,
    elafter:function (e, state, msg) {
        var wrapDiv = e.getNext("div.swordform_field_valiwrap") || e.valWrapDiv;
        if (!wrapDiv)return;
        var imag = wrapDiv.getElement('div.swordform_fieldimg_nomal');
        var msgBox = wrapDiv.getElement("div[name='msgText']");
        if ($defined(e.get('ruleType'))) {
            imag = e.getNext("div").getElement(".swordform_fieldimg_nomal");
        }
        if (imag && msgBox) {
            msgBox.set('text', msg);
            if (state) {
                imag.removeClass('swordform_fieldimg_failed');
                imag.removeEvents('mouseenter');
                this.elAfterHide(wrapDiv);
            } else {
                imag.addClass('swordform_fieldimg_failed');
                this.elAfterShow(wrapDiv);
            }
        }
    },
    fldiv:function (e, state, msg) {
    	this.tooltips.createTip(e,msg);
    	if (state) {
            e.removeClass("invalid");
            this.tooltips.hide();
        } else {
            e.addClass("invalid");
        }
    },
    showAlert:function (e, state, msg) {
        if (state == true) {
            msg = $defined(e.get("success")) ? e.get("success") : this.options.msg.success;
        } else {
            msg = $defined(e.get("error")) ? e.get("error") : this.options.msg.error;
        }
        alert(msg);
    },
    showIntimeMes:function (el, msg) {
    	this.tooltips.createTip(el,msg);
    }, showIntimeError:function (el,msg) {
    	 el.addClass("invalid");
         this.tooltips.createTip(el,msg);
    }, showIntimeCorrect:function (el,msg) {
    	 el.removeClass("invalid");
         this.tooltips.hide();
    }, intime:function (el, state, msg) {
        this.fldiv(el, state, msg);
    }, intimeValidate:function (el) {
        var obj = this.doValidate(el);
        var state = obj.state;
        var msg = obj.msg;
        this.showIntimeMes(el, msg);
        if (!state) {
        	 this.showIntimeError(el,msg);
        } else {
            this.showIntimeCorrect(el,msg);
        }
    }, intimeValidate_Biz:function (el, msg, state) {
        this.showIntimeMes(el, msg);
        if (!state) {
        	this.showIntimeError(el,msg);
        } else {
            this.showIntimeCorrect(el,msg);
        }
    }, clearElTip:function (e) {
    	this.tooltips.hide();
    }, elAfterShow:function (el) {
        el.setStyle('display', '');
    }, elAfterHide:function (el) {
        el.setStyle('display', 'none');
    }
});











