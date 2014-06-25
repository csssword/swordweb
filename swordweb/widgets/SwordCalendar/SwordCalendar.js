var SwordCalendar = new Class({
    Implements:[Events, Options],
    options:{
        name:null,
        sword:null,
        caption:"日期控件",
        pNode:null,
        defaultValue:null,
        defValue:null,
        dataformat:"yyyy-MM-dd",
        yearNames:{'beginYear':'1900', 'endYear':'2099'},//根据金三项目要求，最小值：1949，最大值的限制为2099
        monthNames:i18n.months,
        monthDays:[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        weekNames:i18n.days,
        lazyMinute:500,
        showOptions:"true,true,true,false,false,false", //年月日时分秒
        rule:null,
        showCurDate:false, //初始化时是否显示当前日期
        isReadonly:"false", //是否可以修改
        edit:null,
        msg:null, //日期控件校验的成功和失败
        isShow:"true", //正常的是弹出显示框
        returnRealValue:"false",
        isShowCloseBtn:"false",
        isShowEraseBtn:"false",
        isShowTodayBtn:'false',
//        onHide:$empty,
        disable:null, //是否可以编辑
        toZero:false, //时 分 秒 归零
        handInput:'true', yearCap:'年', autoCtrl:'true', //可配置选择
        dateControl:null
    },
    validate:null,
    parent:null,
    defaultdataformat:"yyyy-MM-dd", //前台默认的格式
    submitDateformat:"yyyy-MM-dd HH:mm:ss", //后台的事件格式
    dateDiv:null,
    dateInput:null,
    dateBtn:null,
    datepopDiv:null,
    SelYear:null,
    SelMonth:null,
    SelDay:null,
    SelHour:null,
    SelMinute:null,
    SelSecond:null,
    DivTable:null,
    DivTbody:null,
    oldDate:new Date(),
    grid_onFinished:null,
    CloseBtn:null,

    bcContainer2:null,
    monthContent:null,
    yearContent:null,
    initParam:function (node, parent) {
        if (!$defined(node.get('dataformat'))) {
            node.setProperty('dataformat', this.defaultdataformat);
        }
        this.parent = parent;
        $extend(this.options, {
            disable:null,
            defValue:null,
            returnRealValue:'false',
            showOptions:"true,true,true,false,false,false",
            isShowCloseBtn:"false",
            isShowEraseBtn:"false",
            isShowTodayBtn:'false',
            showCurDate:false,
            handInput:'true',
            rule:null, toZero:false, isShow:"true", autoCtrl:'true'
        });
        this.htmlOptions(node);
        this.options.defaultValue = this.options.defValue;
        /*var width = '100%';
         if ($defined(parent)) {
         var w = node.get("width");
         if ($defined(w)) {
         width = w;
         } else if(parent.userSize&&parent.userSize.FiledWidth){
         width = parent.userSize.FiledWidth.toInt() - 17;
         }
         }*/ //0511
        this.build_input(node.get('rule'), node);
        this.build_inputBtn();

        Sword.utils.setWidth(node.get("width"), parent ? parent.userSize : null, this.dateContentDiv, this.dateInput, true);//0511

        if ((this.options.rule || "").indexOf("must") > -1 && this.parent && this.parent.options.requiredSign == "field") {
            new Element("span", {'styles':{'color':'red', 'float':'left'}, 'html':"*"}).inject(this.dateContentDiv);
        }
        this.getValidate();
        return this.dateInput;
    },
    setValidate:function (validate) {
        //if (this.validate == null)
        this.validate = validate;
    },
    getValidate:function () {
        if (this.validate == null) {
            this.validate = pc.widgetFactory.create("SwordValidator");
            this.validate.initParam('intime');
        }
    },
    initData:function (v, input) {
        if (!$defined(v) && !$defined(input))return;
        var fomat = input.get('dataformat');
        input.set("realvalue", v);
        if ($defined(fomat)) {
            if (v.split(".").length == 2) {
                v = v.split(".")[0];
                input.set("realvalue", v);
                v = SwordDataFormat.formatStringToString(v, this.submitDateformat, fomat);
            } else {
                v = SwordDataFormat.formatStringToString(v, this.submitDateformat, fomat);
            }
        }
        input.set("value", v);
        input.set("oValue", v);
    },
    createCalendar:function () {
        if ($chk(this.dateInput.value)) {
            if (SwordDataFormat.isDate(this.dateInput.value, this.dateInput.get('dataformat')))
                this.oldDate = SwordDataFormat.formatStringToDate(this.dateInput.value, this.dateInput.get('dataformat'));
            else
                this.oldDate = new Date();

        } else {
            this.oldDate = new Date();
            if (this.options.toZero == 'true') {
                this.oldDate.setSeconds(00);
                this.oldDate.setMinutes(00);
                this.oldDate.setHours(00);
            }

        }
        //在此创建新的年月标签
        this.buildCalendar2();

        this.build_firstPopDiv();
        this.build_SecondpopDiv();

    },
    showCalendar2:function (cdtype) {
        this.datepopDiv.setStyle('display', 'none');
        this.bcContainer2.setStyle('display', '');
        if (cdtype == 'month') {
            this.monthContent.setStyle('display', '');
            this.monthContent.set('show', true);
            this.yearContent.setStyle('display', 'none');
            this.yearContent.set('show', false);
        } else {
            this.monthContent.setStyle('display', 'none');
            this.monthContent.set('show', false);
            this.yearContent.setStyle('display', '');
            this.yearContent.set('show', true);
        }
    },
    hideCalendar2:function (tarEl) {
    	if( this.dateInput.get('dataformat') == "yyyy-MM"){
    		this.validateText(this.dateInput.value);
    	}
    	this.dateInput.set("realvalue", this.dateInput.value);
        this.bcContainer2.setStyle('display', 'none');
        //change
        if (this.dateInput.get('oValue') == null)this.dateInput.set('oValue', ' ');
        if (this.dateInput.get('oValue').trim() != this.dateInput.value) {
            //change时去执行
            this.execGridOnFinished();
            if (this.dateInput.get('show') == 'true'){
            	var changeFunc = this.dateInput.get('onChange')|| this.dateInput.get("_onChange");
            	if (changeFunc) this.getFunc(changeFunc)[0](this.dateInput, this);	
            }
            this.dateInput.set('oValue', this.dateInput.value);
        }
        //hide
        if (this.dateInput.get('show') == 'true')if (this.dateInput.get('onHide')) this.getFunc(this.dateInput.get('onHide'))[0](this.dateInput);
        this.dateInput.set('show', 'false');
        if (this.dateInput.get("rule")) {
            this.validate.validate(this.dateInput);
        }
//        this.dateInput.select();
    }, top_m:null, top_l:null, top_r:null, topDiv:null, topDivClone:null,
    buildCalendar2:function () {
        if (this.bcContainer2)return;
        this.bcContainer2 = new Element('div').inject($(document.body));
        this.bcContainer2.addClass('calendar2');
        this.bcContainer2.setStyle('display', 'none');
        this.topDiv = new Element('div').inject(this.bcContainer2);
        this.topDiv.addClass('cd2_top');
        this.top_l = new Element('div').inject(this.topDiv);
        this.top_l.addClass('cd2_top_l');

        this.top_m = this.top_l.clone();
        this.top_m.addClass('cd2_top_m');
        this.top_m.inject(this.topDiv);
        this.testMonthDaysFebruary(this.top_m.get('text')); //判断是否闰月
        this.top_r = this.top_l.clone();
        this.top_r.addClass('cd2_top_r');
        this.top_r.inject(this.topDiv);

        this.topDivClone = this.topDiv.clone(false, false);
        this.topDivClone.setStyles({'display':'none', 'line-height':'28px', 'text-align':'center', 'font-weight':'bold'});
        this.topDivClone.set('text', '请选择月份');
        this.topDivClone.inject(this.topDiv, 'after');
        //年份
        this.yearContent = new Element('div').inject(this.bcContainer2);
        this.yearContent.setStyle('display', 'none');
        this.yearContent.addClass('cdCellContent');

        //被clone对象
        var line = new Element('div').setStyle('cursor', 'pointer');
        var cell = new Element('div').addClass('cd2_cell');
        cell.addEvent('mouseover', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.addClass('cd2_cell_mouseover');
        }.bind(this));
        cell.addEvent('mouseout', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.removeClass('cd2_cell_mouseover');
        }.bind(this));
        cell.addEvent('click', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            var text = el.get('text');
            if (this.bcContainer2.get('cdtype') == 'month') {
                if (text.contains('月')) {
                    // date format
                    var monthText = text.split('月')[0];
                    this.testMonthDaysFebruary(this.top_m.get('text'));
                    var monthMax = this.options.monthDays[monthText - 1];
                    var oovv = this.top_m.get('text') + '-' + (monthText.length == 1 ? '0' + monthText : monthText);
                    if (this.options.dateControl == "minDay") {
                        this.dateInput.set('dataformat', 'yyyy-MM-dd');
                        this.dateInput.set('value', SwordDataFormat.formatStringToString(oovv + '-01', "yyyy-MM-dd", this.dateInput.get('dataformat')));
                    } else if (this.options.dateControl == "maxDay") {
                        this.dateInput.set('dataformat', 'yyyy-MM-dd');
                        this.dateInput.set('value', SwordDataFormat.formatStringToString(oovv + '-' + monthMax, "yyyy-MM-dd", this.dateInput.get('dataformat')));
                    } else {
                        this.dateInput.set('value', SwordDataFormat.formatStringToString(oovv, "yyyy-MM", this.dateInput.get('dataformat')));
                    }
                    //this.dateInput.set("realvalue", this.dateInput.value);
                    this.hideCalendar2(el);
                } else {
                    this.monthContent.setStyle('display', '');
                    this.monthContent.set('show', true);
                    this.changeTopMidState('pointer');
                    this.yearContent.setStyle('display', 'none');
                    this.yearContent.set('show', false);
                    this.top_m.set('text', text);
                    if (text == this.dateInput.get('selYear'))
                        this.monthContent.getElements('div.cd2_cell[text=' + this.dateInput.get('selMonth') + ']').addClass('cd2_cell_selected');
                    else
                        this.monthContent.getElements('div.cd2_cell').removeClass('cd2_cell_selected');
                }
            } else {
                this.dateInput.set('value', SwordDataFormat.formatStringToString(text, "yyyy", this.dateInput.get('dataformat')));
              //  this.dateInput.set("realvalue", this.dateInput.value);
                this.hideCalendar2(el);
            }
        }.bind(this));
        var currentYear = new Date().getFullYear() + '';
        var text = currentYear / 1 - 1;
        for (var i = 0; i < 3; i++) {
            var yearline = line.clone();
            yearline.inject(this.yearContent);
            for (var j = 0; j < 4; j++) {
                var cc = cell.clone().inject(yearline);
                cc.set('text', text++);
                cc.cloneEvents(cell);
                if ((i == 0 && j == 0) || (i == 2 && j == 3))cc.setStyle('color', 'gray');
            }
        }


        //月份
        this.monthContent = new Element('div').inject(this.bcContainer2);
        this.monthContent.setStyle('display', 'none');
        this.monthContent.addClass('cdCellContent');
        var index = 1;
        for (var i = 0; i < 3; i++) {
            var monthline = line.clone();
            monthline.inject(this.monthContent);
            for (var j = 0; j < 4; j++) {
                var cc = cell.clone().inject(monthline);
                cc.set('text', (index++) + "月");
                cc.cloneEvents(cell);
            }
        }

        //被克隆对象销毁
        cell.destroy();
        line.destroy();

        //事件处理
        this.top_l.addEvent('click', function () {
            if (this.yearContent.get('show') == 'true') {
                this.yearContent.getElements('div.cd2_cell').each(function (item) {
                    item.set('text', item.get('text') / 1 - 10);
                    if (item.get('text') == this.dateInput.get('selYear')) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                }.bind(this));
                var textA = this.top_m.get('text').split('-');
                this.top_m.set('text', (textA[0] / 1 - 10) + "-" + (textA[1] / 1 - 10));
            } else {
                this.top_m.set('text', this.top_m.get('text') / 1 - 1);
                if (this.top_m.get('text') != this.dateInput.get('selYear'))
                    this.monthContent.getElements('div.cd2_cell').removeClass('cd2_cell_selected');
                else
                    this.monthContent.getElements('div.cd2_cell[text=' + this.dateInput.get('selMonth') + ']').addClass('cd2_cell_selected');
            }

        }.bind(this));
        this.top_l.addEvent('mouseover', function () {
            this.top_l.addClass('cd2_top_l_over');
        }.bind(this));
        this.top_l.addEvent('mouseout', function () {
            this.top_l.removeClass('cd2_top_l_over');
        }.bind(this));

        this.top_r.addEvent('mouseover', function () {
            this.top_r.addClass('cd2_top_r_over');
        }.bind(this));
        this.top_r.addEvent('mouseout', function () {
            this.top_r.removeClass('cd2_top_r_over');
        }.bind(this));

        this.changeTopMidState('pointer');

        this.top_m.addEvent('click', function () {
            if (this.monthContent.get('show') == 'true') {
                this.monthContent.setStyle('display', 'none');
                this.monthContent.set('show', false);
                this.changeTopMidState('default');
                this.yearContent.setStyle('display', '');
                this.yearContent.set('show', true);
                var text = this.top_m.get('text');
                text = text.substring(0, 3) + '0';
                this.yearContent.getElements('div.cd2_cell').each(function (item, index) {
                    var _text = text / 1 + index - 1 + '';
                    item.set('text', _text);
                    if (_text == this.dateInput.get('selYear')) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                }.bind(this));
                this.top_m.set('text', text + '-' + (text / 1 + 9));
            }
        }.bind(this));
        this.top_r.addEvent('click', function () {
            if (this.yearContent.get('show') == 'true') {
                this.yearContent.getElements('div.cd2_cell').each(function (item) {
                    item.set('text', item.get('text') / 1 + 10);
                    if (item.get('text') == this.dateInput.get('selYear')) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                }.bind(this));
                var textA = this.top_m.get('text').split('-');
                this.top_m.set('text', (textA[0] / 1 + 10) + "-" + (textA[1] / 1 + 10));
            } else {
                this.top_m.set('text', this.top_m.get('text') / 1 + 1);
                if (this.top_m.get('text') != this.dateInput.get('selYear'))
                    this.monthContent.getElements('div.cd2_cell').removeClass('cd2_cell_selected');
                else
                    this.monthContent.getElements('div.cd2_cell[text=' + this.dateInput.get('selMonth') + ']').addClass('cd2_cell_selected');
            }
        }.bind(this));
    },
    changeTopMidState:function (state) {
        if (state == 'pointer') {
            this.top_m.setStyle('cursor', 'pointer');
            this.top_m.addEvent('mouseover', function () {
                this.topDiv.addClass('cd2_top_over');
            }.bind(this));
            this.top_m.addEvent('mouseout', function () {
                this.topDiv.removeClass('cd2_top_over');
            }.bind(this));
        } else {
            this.top_m.setStyle('cursor', 'default');
            this.top_m.removeEvents('mouseover');
            this.top_m.removeEvents('mouseout');
            this.topDiv.removeClass('cd2_top_over');
        }
    },
    build_SecondpopDiv:function () {
        var sOptions = this.dateInput.get("showOptions").split(",");
        //年月选择第二套方案
        if (sOptions[2] == 'false' && sOptions[3] == 'false' && sOptions[4] == 'false' && sOptions[5] == 'false') {
            this.bcContainer2.setStyle('display', '');
            var currentYear = new Date().getFullYear() + '';
            if (sOptions[1] == "true" && sOptions[0] == 'true') {
                var selMonth = new Date().getMonth() + 1 + '月';
                var selYear = currentYear;
                if (this.defaultdataformat == this.dateInput.get('dataformat')) {
                    //修改默认的格式
                    if (this.options.dateControl != "minDay" && this.options.dateControl != "maxDay")
                        this.dateInput.set('dataformat', 'yyyy-MM');
                }
                this.topDivClone.setStyle('display', 'none');
                this.topDiv.setStyle('display', '');
                this.changeTopMidState('pointer');
                this.showCalendar2('month');
                this.bcContainer2.set('cdtype', 'month');

                if (this.dateInput.value != '') {
                    var seldate = SwordDataFormat.formatStringToDate(this.dateInput.value, this.dateInput.get('dataformat'));
                    selMonth = seldate.getMonth() + 1 + '月';
                    selYear = seldate.getFullYear() + '';
                }
                this.top_m.set('text', selYear);
                this.dateInput.set('selYear', selYear);
                this.dateInput.set('selMonth', selMonth);
                this.monthContent.getElements('div.cd2_cell').each(function (item, index) {
                    if (item.get('text') == selMonth) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                });
            }
            else if (sOptions[0] == "true" && sOptions[1] == 'false') {
                if (this.defaultdataformat == this.dateInput.get('dataformat')) {
                    //修改默认的格式
                    this.dateInput.set('dataformat', 'yyyy');
                }
                this.topDivClone.setStyle('display', 'none');
                this.topDiv.setStyle('display', '');
                this.changeTopMidState('default');
                this.showCalendar2('year');
                this.bcContainer2.set('cdtype', 'year');
                if (this.dateInput.value != '') {
                    currentYear = SwordDataFormat.formatStringToDate(this.dateInput.value, this.dateInput.get('dataformat')).getFullYear() + '';
                }
                this.dateInput.set('selYear', currentYear);
                var cYearc = currentYear.substring(0, 3) + '0';
                this.top_m.set('text', cYearc + '-' + (cYearc / 1 + 9));
                this.yearContent.getElements('div.cd2_cell').each(function (item, index) {
                    item.set('text', cYearc / 1 + index - 1);
                    if ((cYearc / 1 + index - 1) + '' == currentYear) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                });
            } else {//只是月
                var selMonth = new Date().getMonth() + 1 + '月';
                if (this.defaultdataformat == this.dateInput.get('dataformat')) {
                    //修改默认的格式
                    this.dateInput.set('dataformat', 'MM');
                }
                this.topDivClone.setStyle('display', '');
                this.topDiv.setStyle('display', 'none');
                this.showCalendar2('month');
                this.bcContainer2.set('cdtype', 'month');
                if (this.dateInput.value != '') {
                    var seldate = SwordDataFormat.formatStringToDate(this.dateInput.value, this.dateInput.get('dataformat'));
                    selMonth = seldate.getMonth() + 1 + '月';
                }
                this.top_m.set('text', currentYear);
                this.dateInput.set('selMonth', selMonth);
                this.monthContent.getElements('div.cd2_cell').each(function (item, index) {
                    if (item.get('text') == selMonth) {
                        item.addClass('cd2_cell_selected');
                    } else {
                        item.removeClass('cd2_cell_selected');
                    }
                });
            }
        } else {
            this.bcContainer2.setStyle('display', 'none');
            this.bcContainer2.erase('cdtype');
            if (sOptions[0] == "true") {
                this.build_popSelectYear();
                this.SelYear.inject(this.ymct);
            } else {
                this.build_popSelectYear();
                this.SelYear.setStyle("display", 'none');
            }
            if (sOptions[1] == "true") {
                this.build_popSelectMonth();
                this.SelMonth.inject(this.ymct);
            } else {
                this.SelMonth.setStyle("display", "none");
            }
            if (sOptions[0] == "true" || sOptions[1] == "true")
                this.show4YearAndMonth(sOptions[0], sOptions[1]);
            if (sOptions[3] == "true") {
                this.build_popSelectHour();
            } else {
                this.SelHour.setStyle("display", "none");
            }
            if (sOptions[4] == "true") {
                this.build_popSelectMinute();
            } else {
                this.SelMinute.setStyle("display", "none");
            }
            if (sOptions[5] == "true") {
                this.build_popSelectSecond();
            } else {
                this.SelSecond.setStyle("display", "none");
            }
            if (sOptions[3] == "false" && sOptions[4] == "false" && sOptions[5] == "false") {
                if (this.DivTable.getElement('thead').getChildren().length > 1)
                    this.DivTable.getElement('thead').getChildren()[1].setStyle('display', 'none');
            }
            //没有下面的代码，display就一直为none
            else {
                if (this.DivTable.getElement('thead').getChildren().length > 1)
                    this.DivTable.getElement('thead').getChildren()[1].setStyle('display', '');
            }
        }
    },
    ymContainer:null, ymct:null,
    show4YearAndMonth:function (showYear, showMonth) {
        if (showYear == 'false') {
            $('navImgll').setStyle('display', 'none');
            $('navImgrr').setStyle('display', 'none');
            this.ymct.setStyle('width', '150px');
        } else {
            $('navImgll').setStyle('display', '');
            $('navImgrr').setStyle('display', '');
            this.ymct.setStyle('width', '110px');
        }
        if (showMonth == 'false') {
            $('navImgl').setStyle('display', 'none');
            $('navImgr').setStyle('display', 'none');
        }
    },
    build_YearAndMonth:function () {
        this.ymContainer = new Element('div').set('id', 'ymContainer').setStyles({'height':'20px', 'float':'left'}).inject(this.ymCtTh);
        var navImgll = new Element('div').inject(this.ymContainer);
        navImgll.set({'id':'navImgll', 'class':'navImgll', 'title':'上一年'});
        var navImgl = new Element('div').inject(this.ymContainer);
        navImgl.set({'id':'navImgl', 'class':'navImgl', 'title':'上个月'});
        this.ymct = new Element('div').set('id', 'ymct').inject(this.ymContainer).setStyles({'align':'center', 'width':'110px', 'height':'20px', 'float':'left', 'line-height':'20px'});
        var navImgr = new Element('div').inject(this.ymContainer);
        navImgr.set({'id':'navImgr', 'class':'navImgr', 'title':'下个月'});
        var navImgrr = new Element('div').inject(this.ymContainer);
        navImgrr.set({'id':'navImgrr', 'class':'navImgrr', 'title':'下一年'});

        this.ymContainer.addEvent('click', function (e) {
            var target = e.target;
            if (target != this.SelYear) {
                this.SelYear.setStyle('background', 'transparent');
                this.SelYearPopDiv.setStyle('display', 'none');
            }
            if (target != this.SelMonth) {
                this.SelMonth.setStyle('background', 'transparent');
                this.SelMonthPopDiv.setStyle('display', 'none');
            }
            if (target == this.SelYear || target == this.SelMonth) {
                target.setStyles({'background':'#fff'});
                target.focus();
                target.select();
                if (target == this.SelYear) {
                    this.build_year();
                    this.SelMonth.setStyle('background', 'transparent');
                    this.SelYearPopDiv.setStyles({
                        //'left':this.SelYear._getPosition().x,
                        'display':''
                    });
                    xyposition(this.SelYear, this.SelYearPopDiv);
                } else {
                    this.SelMonthPopDiv.setStyles({
                        //'left':this.SelMonth._getPosition().x,
                        'display':''
                    });
                    xyposition(this.SelMonth, this.SelMonthPopDiv);
                }
            } else {
                if (target == navImgll) {
                    //年度-1
                    this.SelYear.set('code', this.SelYear.get('code') / 1 - 1);
                    this.SelYear.set('value', this.SelYear.get('code') + this.options.yearCap);
                    this.refreshDate(this.SelYear.get('code'));
                }
                if (target == navImgl) {
                    //月度-1
                    var _code = this.SelMonth.get('code') / 1 - 1;
                    if (_code == -1) {
                        //年度减一
                        this.SelYear.set('code', this.SelYear.get('code') / 1 - 1);
                        this.SelYear.set('value', this.SelYear.get('code') + this.options.yearCap);
                        this.SelMonth.set('code', 11);
                        this.SelMonth.set('value', this.options.monthNames[11]);
                        this.refreshDate(this.SelYear.get('code'), 11);
                    } else {
                        this.SelMonth.set('code', this.SelMonth.get('code') / 1 - 1);
                        this.SelMonth.set('value', this.options.monthNames[this.SelMonth.get('code')]);
                        this.refreshDate(null, this.SelMonth.get('code'));
                    }
                }
                if (target == navImgr) {
                    //月度+1
                    var _code = this.SelMonth.get('code') / 1 + 1;
                    if (_code == 12) {
                        //年度加一
                        this.SelYear.set('code', this.SelYear.get('code') / 1 + 1);
                        this.SelYear.set('value', this.SelYear.get('code') + this.options.yearCap);
                        this.SelMonth.set('code', 0);
                        this.SelMonth.set('value', this.options.monthNames[0]);
                        this.refreshDate(this.SelYear.get('code'), 0);
                    } else {
                        this.SelMonth.set('code', this.SelMonth.get('code') / 1 + 1);
                        this.SelMonth.set('value', this.options.monthNames[this.SelMonth.get('code')]);
                        this.refreshDate(null, this.SelMonth.get('code'));
                    }
                }
                if (target == navImgrr) {
                    //年度+1
                    this.SelYear.set('code', this.SelYear.get('code') / 1 + 1);
                    this.SelYear.set('value', this.SelYear.get('code') + this.options.yearCap);
                    this.refreshDate(this.SelYear.get('code'));
                }
                this.giveOutValue();
            }
        }.bind(this));
    },
    show:function (dateInput) {
        this.dateInput = dateInput;
        //设置must输入框背景色
        var rule = dateInput.get('rule');
        if($defined(rule) && rule.contains('must'))this.dateInput.setStyle('background-color','#b5e3df');
        $extend(this.options, {autoCtrl:this.dateInput.get('autoCtrl'), isShow:this.dateInput.get('isShow'), toZero:this.dateInput.get('toZero'), name:this.dateInput.get('name'), defaultValue:this.dateInput.get('defaultValue'), dataformat:this.dateInput.get('dataformat'), dateControl:this.dateInput.get("dateControl")});

        this.dateInput.set('show', 'true');
        this.createCalendar();
        if (this.bcContainer2.get('cdtype')) {
            //this.bcContainer2.setStyle('left',this.dateInput._getPosition().x);
            xyposition(this.dateInput, this.bcContainer2);
        } else {
            this.datepopDiv.setStyles({
                //    'left':this.dateInput._getPosition().x,
                'display':''
            });
            xyposition(this.dateInput, this.datepopDiv);
            this.datepopDiv.fade('in');
        }
        //this.dateInput.set('show','true');
        this.dateBtn.addClass('dateBtn_active');
    },
    dateContentDiv:null, boxtd:null, imgtd:null,
    build_input:function (rule, node) {
        //this.dateContentDiv = new Element('div', {'class':'swordform_field_wrap'}).inject(this.options.pNode);
        this.dateContentDiv = Sword.utils.createTable(this, true, true);
        this.dateInput = new Element('input', {
            'rule':rule,
            'type':'text',
            'widget':'calendar',
            'name':this.options.name,
            'defaultValue':this.options.defaultValue,
            'msg':this.options.msg,
            'dataformat':this.options.dataformat,
            'class':'swordform_item_oprate swordform_item_input',
            'widgetGetValue':'true',
            'returnRealValue':this.options.returnRealValue,
            'showOptions':this.options.showOptions,
            'isShowCloseBtn':this.options.isShowCloseBtn,
            'isShowEraseBtn':this.options.isShowEraseBtn,
            'isShowTodayBtn':this.options.isShowTodayBtn,
            'isShow':this.options.isShow,
            'toZero':this.options.toZero,
            autoCtrl:this.options.autoCtrl,
            'dateControl':node.get("dateControl"),
            'styles':{
                'float':'left'
//                'width':width || '144px'    //0511
            },
            'oValue':' '
        }).inject(this.boxtd);
        this.dateInput.store('widgetObj', this);//向input存入对象
        if (node.get('onHide'))this.dateInput.set('onHide', node.get('onHide'));
        if (node.get('onChange')) {
            this.dateInput.set('_onChange', node.get('onChange'));
            if (this.parent && this.parent.name != "SwordGrid")node.set({'onChange':'', 'onchange':''});
        }
//        this.dateInput.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ?
//            'keydown' : 'keypress', this.keyEvents.bind(this));
//        if (this.options.handInput == "true" || (this.options.handInput == null && jsR.config.swordCalendar.handInput)) {
//            this.dateInput.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress',
//                this.options.autoCtrl == 'true' ? this.hand_Input.bind(this) : this.hand_Input_nctrl.bind(this));
//        }
        if (this.options.isReadonly == "true" || this.options.edit == "false") {
            this.dateInput.set("readonly", true);
        }
        if (this.options.disable == "true") {
            this.dateInput.set("disabled", true);
            this.dateInput.setStyle('cursor', "default");
        }
        if (this.options.showCurDate == "true") {
            this.oldDate = new Date();
            //this.giveOutValue();
            this.dateInput.value = SwordDataFormat.formatDateToString(this.oldDate, this.dateInput.get('dataformat'));
            this.dateInput.set("realvalue", this.dateInput.value);
            this.dateInput.set('oValue', this.dateInput.value);
        }
        else if ($chk(this.options.defaultValue)) {
            //if (SwordDataFormat.isDate(this.options.defaultValue, this.options.dataformat))
            this.dateInput.value = this.options.defaultValue;
            this.dateInput.set("realvalue", this.dateInput.value);
            this.dateInput.set('oValue', this.dateInput.value);
        }
        /* this.dateInput.addEvent('click', function(e) {
         var input= $(new Event(e).target);
         if (input.get('isShow') == "false") {
         return;
         }
         //            this.execGridOnFinished();
         this.show(input);

         }.bind(this));     */
        this.addEventToEl("input");
//        if (!this.windowClick) {
//            window.document.addEvent('click', function (e) {
//                if (this.dateInput.get('show') == 'true') {
//                    var obj = e.target;
//                    var parent = obj.parentNode;
//                    var p_parent = parent.parentNode;
//                    if (obj != this.dateInput
//                        && null != this.dateBtn
//                        && null != this.datepopDiv
//                        && obj != this.dateBtn
//                        && obj != this.ymContainer
//                        && obj != this.ymct
//                        && obj != this.SelHour
//                        && obj != this.SelMinute
//                        && obj != this.SelSecond
//                        && parent != this.ymContainer//options
//                        && parent != this.ymct
//                        && parent != this.SelHour
//                        && parent != this.SelMinute
//                        && parent != this.SelSecond
//                        && parent != this.topDiv
//                        && obj != this.topDiv
//                        && p_parent != this.mtbody
//                        && p_parent != this.ytbody
//                        && p_parent != this.yctbody
//                        && p_parent != this.monthContent
//                        && p_parent != this.yearContent) {
//                        this.hide();
//                    }
//                }
//            }.bind(this));
//            this.windowClick = true;
//        }
    },
    hide:function () {
    	if( this.dateInput.get('dataformat') == "yyyy-MM-dd"){
    		this.validateText(this.dateInput.value);
    	}
        if (this.dateInput.get('show') == 'true') {
        	//修改form中手动修改日期值之后，用getvalue方法获取到的是修改前的值
            this.dateInput.set("realvalue", this.dateInput.value);
            if (this.bcContainer2.get('cdtype'))
                this.hideCalendar2();
            else {
                if (this.SelMonthPopDiv)this.SelMonthPopDiv.setStyle('display', 'none');
                if (this.SelYearPopDiv)this.SelYearPopDiv.setStyle('display', 'none');
                this.datepopDiv.setStyles({'left':'-500px', 'top':'-500px'});
                this.datepopDiv.fade('out');
            }
            this.dateBtn.removeClass('dateBtn_active');
            //change
            if (this.dateInput.get('oValue') == null) {
                this.dateInput.set('oValue', ' ');
            }
            if (this.dateInput.get("rule")) {
                this.validate.validate(this.dateInput);
            }
            this.execGridOnFinished();
            if (this.dateInput.get('oValue').trim() != this.dateInput.value) {
            	var changeFunc;
            	if(this.parent && this.parent.name == "SwordGrid"){
            		changeFunc = this.dateInput.retrieve('onChange');
            	}
            	var changeFunc = this.dateInput.get('onChange')||this.dateInput.get('_onChange');
                if (changeFunc) this.getFunc(changeFunc)[0](this.dateInput, this);
                this.dateInput.set('oValue', this.dateInput.value);
            }
            if (this.dateInput.get('onHide')) this.getFunc(this.dateInput.get('onHide'))[0](this.dateInput);
            this.dateInput.set('show', 'false');
            this.defaultValidate(this.dateInput.value, this.dateInput);
        }
    },
    validateText:function(value){
    	var byear = this.options.yearNames.beginYear;
    	var nyear = this.options.yearNames.endYear;
    	var sOptions = this.dateInput.get("showOptions").split(",");
    	var dateCtl = this.dateInput.get("dateControl");
    	 if (sOptions[0] == "true" && sOptions[1] == "true") {
    		 var year ="";
    		 var month="";
    		 var day = "";
    		 var d1=0;
    		 var d2=0;
    	if(value.test("^\\d{4}-\\d{1,2}-\\d{0,2}$")){
    		year = value.substring(0,4);
    		month = value.substring(5,7);
    		if(month.contains("-")){
    			month=month.substring(0,1);
    			if(month.toInt() == 0){
    				month = "01";
    			}else{
    				month = "0" + month;
    			}
    			d1 = 7;
    		}else{
    			if (month.toInt() > 12)
                    month = "12";
                else if (month.toInt() == 0){
                	month = "01";
                }
    			d1 = 8;
    		}
    		d2 = value.length;
    	}else if(value.test("^\\d{5,7}-\\d{0,2}$")){
    		year = value.substring(0,4);
    		month = value.substring(4,7);
    		if(month.contains("-")){
    			month=month.replace(/-/g,"");
    			d1 = 7;
    		}else{
    			d1 = 8;
    		}
    		if (month.toInt() > 12)
                month = "12";
            else if (month.toInt() == 0){
            	month = "01";
            }
    		d2 = value.length;
    	}else if(value.test("^\\d{4}-\\d{2,5}$")){
    		year = value.substring(0,4);
    		var end = value.substring(5,value.length);
    		var endLen = end.length;
    		if(endLen == 2){
    			month = end.substring(0,2);
    			if (month.toInt() > 12)
                    month = "12";
                else if (month.toInt() == 0){
                	month = "01";
                }
//    			if (month.toInt() == 0){
//                	month = "1";
//                }
//    			month = "0" + month;
    			d1 = 6;
    			d2 = 7;
    		}else if(endLen==3){
    			var m1 = end.substring(0,1).toInt();
    			var m2 = end.substring(1,2).toInt();
    			if (m1 == 0){
                	if(m2 == 0){
                		month = "01";
                	}else if(m2 != 0){
                		month = "0" + m2;
                	}
                	d1 = 7;
        			d2 = 8;
                }else if(m1 == 1){
                	if(m2 < 3){
                		month = m1 + m2;
                	}else {
                		month = "0" + month;
                	}
                }else{
                	month = "0" + m1;
                	d1 = 6;
        			d2 = 8;
                }
    		}else{
    			var month = end.substring(0,2);
    			d1 = 7;
    			d2 = 9;
    			if (month.toInt() > 12)
                    month = "12";
                else if (month.toInt() == 0){
                	month = "01";
                }
    		}
    		}else if(value.test("^\\d{6,10}$")){
    			year = value.substring(0,4);
        		var end = value.substring(4, value.length);
        		var endLen = end.length;
        		var m1 = value.substring(4,5).toInt();
        		if(endLen == 2){
        			if(m1 == 0){
        				m1=1;
        			}
        			month = "0" + m1;
        			d1 = 9;
        			d2 = 10;
        		}else if(endLen == 3){
        			var m2 = end.substring(1,2).toInt();
        			if (m1 == 0){
                    	if(m2 == 0){
                    		month = "01";
                    	}else if(m2 != 0){
                    		month = "0" + m2;
                    	}
                    	d1 = 6;
                    	d2 = 7;
                    }else if(m1 == 1){
                    	if(m2 < 3){
                    		month = m1 + m2;
                    	}else {
                    		month = "0" + month;
                    	}
                    }else{
                    	month = "0" + m1;
                    	d1 = 5;
                    	d2 = 7;
                    }
        		}else if(endLen >= 4){
        			var month = end.substring(0,2);
        			d1 = 7;
        			d2 = 9;
        			if (month.toInt() > 12)
                        month = "12";
                    else if (month.toInt() == 0){
                    	month = "01";
                    }
        		}
    		}
    	if(year !="" && month !=""){
    		if (year.toInt() < byear.toInt()){
   			 year = byear;
   		}else if (year.toInt() > nyear.toInt()){
   			year = nyear;
   		}
    		if(month.length == 1) month = "0"+month;
    		var days = parseInt(this._getDays(year, month));
        	if(dateCtl== "minDay"){
        		day = "-01";
        	}else if(dateCtl == "maxDay"){
        		day = "-"+days;
        	}else if(sOptions[2] == "true"){
        		if(d1 == value.length){
        			day = "-01";
        		}else{
        			var day = value.substring(d1,d2);
            		if (day.toInt() > days) {
                        day = days;
                    } else if (day.toInt() == 0) {
                        day = "01";
                    }
            		if(day.length == 1) day = "0"+day;
            		day = "-" + day;
        		}
        	}else day="";
        	if(month.length == 1) month = "0"+month;
        	this.dateInput.value = year+"-"+month+day;
    	}else this.dateInput.value = "";
    	
    	 }else if(sOptions[0] == "true" && sOptions[1] == "false"){
			if(value.test("^\\d{1,10}$")){
				var year = "";
				if(value.length >3){
					year = value.substring(0,4);
				}else year = value;
				if (year.toInt() < byear.toInt()){
        			 year = byear;
        		}else if (year.toInt() > nyear.toInt()){
        			year = nyear;
        		}
				this.dateInput.value = year;
			}else this.dateInput.value = "";
		} else if(sOptions[0] == "false" && sOptions[1] == "true" && sOptions[2] == "false"){
			if(value.test("^\\d{1,10}")){
				var month = "";
				if(value.length >2){
					month = value.substring(0,2);
				}else month = value;
				if (month.toInt() > 12)
                    month = "12";
                else if (month.toInt() == 0){
                	month = "01";
                }
				if(month.length == 1) month = "0"+month;
				this.dateInput.value = month;
			}else this.dateInput.value = "";
		}
    },
    execGridOnFinished:function () {
        if ($defined(this.grid_onFinished)) {
            this.grid_onFinished(this.dateInput.get('value'));
            this.grid_onFinished = null;
        }
    },
    build_inputBtn:function () {

        this.dateBtn = this.imgtd;
        this.dateBtn.addClass('dateBtn').addEvents({
            'mouseover':function (e) {
                this.dateBtn.addClass('dateBtn_active');
            }.bind(this),
            'mouseout':function (e) {
                this.dateBtn.removeClass('dateBtn_active');
            }.bind(this)
        });

        /*this.dateBtn = new Element('div', {
         'class'  : 'dateBtn',
         'styles':{'float':'left'},
         'events':{
         'mouseover':function(e) {
         this.dateBtn.addClass('dateBtn_active');
         }.bind(this),
         'mouseout':function(e) {
         this.dateBtn.removeClass('dateBtn_active');
         }.bind(this)
         }
         }).inject(this.imgtd);*/
        if ($defined(this.parent) && this.parent.isVal() && $defined(this.options.rule)) {
            Sword.utils.createElAfter(this.dateContentDiv.getChildren()[0].getChildren()[0], this.dateInput);
        }
        /* var w = this.dateInput.getStyle('width');
         if(w!='100%')this.dateContentDiv.setStyle('width', w.contains('%')? w: 'auto');*/ //0511
        if (this.options.disable == "true") {
            this.disable(this.dateInput);
        }
        this.addEventToEl("div");
    }, ymCtTh:null,
    build_firstPopDiv:function () {
        var sOptions = this.dateInput.get("showOptions").split(",");

        if (this.datepopDiv) {
            if (!$chk(this.ymContainer)) {
                if (sOptions[0] == "true" || sOptions[1] == "true") {
                    this.build_YearAndMonth();
                    this.ymCtTh.setStyle('display', '');
                }
            } else if (sOptions[0] == "false" && sOptions[1] == "false") {
                this.ymContainer.setStyle('display', 'none');
                this.ymCtTh.setStyle('display', 'none');
            } else {
                this.ymContainer.setStyle('display', '');
                this.ymCtTh.setStyle('display', '');
            }
            if (sOptions[2] == "true") {
                this.DivTbody.setStyle("display", "");
                if (!this.buildWeek)this.build_popSelectDate();
                this.giveDataTopopDiv_selectDay(this.oldDate.getFullYear(), this.oldDate.getMonth().toInt() + 1, this.oldDate.getDate());
            } else {
                this.DivTbody.setStyle("display", "none");
            }
            this.build_popCloseBtn();
            return;
        }

        this.datepopDiv = new Element('div', {
            'class':'dp_cal'
        }).inject(document.body);
        this.DivTable = new Element('table').inject(this.datepopDiv);
        var thead = new Element('thead').inject(this.DivTable);
        var tr = new Element('tr').inject(thead);
        this.ymCtTh = new Element('th', {'colspan':'7'}).inject(tr);
        if (sOptions[0] == "true" || sOptions[1] == "true") {
            this.build_YearAndMonth();
        } else {
            this.ymCtTh.setStyle('display', 'none');
        }
        this.SelYear = new Element('input', {
            'id':'yearSelect'
        });
        this.SelYear.addEvents({
            'blur':function (e) {
                var tar = e.target;
                var v = tar.value.split(this.options.yearCap)[0];
                var beginYear = this.options.yearNames.beginYear.toInt();
                var endYear = this.options.yearNames.endYear.toInt();
                if (v < beginYear) v = beginYear;
                if (v > endYear) v = endYear;
                this.SelYear.set('code', v);
                this.SelYear.set('value', v + this.options.yearCap);
                this.SelYear.setStyle("display", "").empty();
                this.SelYear.setStyle('background', 'transparent');
                this.refreshDate(v);
                this.giveOutValue();
            }.bind(this), 'keydown':function (e) {
                var c = e.code;
                if ((c < 48 || c > 57) && c != 8) return false;
            }.bind(this), 'keyup':function (e) {
                if (e.code == 13) {
                    this.dateInput.focus();
                    this.SelYearPopDiv.setStyle("display", "none");
                }
            }.bind(this)
        });
        //var yearTempOption = new Element('option', {
        //  'value': this.oldDate.getFullYear()
        //}).appendText(this.oldDate.getFullYear());
        //yearTempOption.inject(this.SelYear);
        this.SelYear.set('value', this.oldDate.getFullYear() + this.options.yearCap);
        this.SelYear.set('code', this.oldDate.getFullYear());
        //this.SelYear.inject(th);
        this.SelMonth = new Element('input', {
            'id':'monthSelect', 'readOnly':true
        });
        //var monthTempOption = new Element('option', {
        //'value': this.oldDate.getMonth()
        //}).appendText(this.options.monthNames[this.oldDate.getMonth()]);
        //monthTempOption.inject(this.SelMonth);
        this.SelMonth.set('value', this.options.monthNames[this.oldDate.getMonth()]);
        this.SelMonth.set('code', this.oldDate.getMonth());
        var tr1 = new Element('tr').inject(thead);
        var th1 = new Element('th', {
            'colspan':'7'
        }).inject(tr1);
        this.SelHour = new Element('select', {
            'id':'hourSelect'
        });
        this.SelHour.set('title', '时');
        var hourTempOption = new Element('option', {
            'value':this.oldDate.getHours()
        }).appendText(this.oldDate.getHours());
        hourTempOption.inject(this.SelHour);
        this.SelHour.inject(th1);
        this.SelMinute = new Element('select', {
            'id':'minuteSelect'
        });
        this.SelMinute.set('title', '分');
        var minuteTempOption = new Element('option', {
            'value':this.oldDate.getMinutes()
        }).appendText(this.oldDate.getMinutes());
        minuteTempOption.inject(this.SelMinute);
        this.SelMinute.inject(th1);
        this.SelSecond = new Element('select', {
            'id':'secondSelect'
        });
        var secondTempOption = new Element('option', {
            'value':this.oldDate.getSeconds()
        }).appendText(this.oldDate.getSeconds());
        secondTempOption.inject(this.SelSecond);
        this.SelSecond.inject(th1);
        this.SelSecond.set('title', '秒');
        this.DivTbody = new Element('tbody').inject(this.DivTable);
        if (sOptions[2] == "true") {
            this.build_popSelectDate();
        }
        this.build_popCloseBtn();
    },
    build_popCloseBtn:function () {
        var close = this.dateInput.get("isShowCloseBtn");
        var erase = this.dateInput.get("isShowEraseBtn");
        var today = this.dateInput.get("isShowTodayBtn");
        //var btn = close || erase;
        var btn;
        if (close == "true" || erase == "true" || today == "true")
            btn = "true";
        if (this.CloseBtn != null) {
            this.CloseBtn.destroy();
            this.CloseBtn = null;
        }
        if (btn == "true") {
            this.CloseBtn = new Element('table').inject(this.datepopDiv);
            var body = new Element('tbody').inject(this.CloseBtn);
            var tr = new Element('tr', {'name':'dayTr'}).inject(body);
            var tdClose = new Element('th', {'colspan':'7'}).inject(tr);
            if (close == "true") {
                var closeDiv = new Element('div', {'class':'dp_error'}).inject(tdClose);
                closeDiv.addEvent('click', function (e) {
                    var obj = e.target;
                    this.giveOutValue();
//                    this.execGridOnFinished();
                }.bind(this));
            }
            if (today == 'true') {
                var todayDiv = new Element('div', {'class':'dp_todayBtn'}).inject(tdClose);
                todayDiv.addEvent('click', function () {
                    this.oldDate = new Date();
                    this.giveOutValue();
//                    this.execGridOnFinished();
                }.bind(this));
            }
            if (erase == "true") {
                var clearDiv = new Element('div', {'class':'dp_clear'}).inject(tdClose);
                clearDiv.addEvent('click', function (e) {
                    this.dateInput.set('value', "");
                    this.dateInput.set("realvalue", "");
                    this.dateInput.set('oValue', "");
//                    this.execGridOnFinished();
                }.bind(this));
            }

        }
    },
    SelYearPopDiv:null, SelMonthPopDiv:null,
    build_popSelectYear:function () {
        this.SelYear.setStyle("display", "").empty();
        this.SelYear.setStyle('background', 'transparent');
        this.SelYear.set('code', this.oldDate.getFullYear());
        this.SelYear.set('value', this.oldDate.getFullYear() + this.options.yearCap);
        if (this.SelYearPopDiv) return;
        this.SelYearPopDiv = new Element('div').addClass('selPopDiv').setStyle('display', 'none').inject($(document.body));
        this.build_year();
    },
    getYearMonthDayNum:function (year, month) {
        var dayNum = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if (new Date(year, 1, 29).getDate() == 29) {
            dayNum[1] = 29;
        }
        return dayNum[month - 1];
    }, refreshDate:function (year, month) {
        var dayNum;
        if (year != null && month != null) {
            if (this.dateInput.get("showOptions").split(",")[2] == "true")
                this.giveDataTopopDiv_selectDay(year, month.toInt() + 1, this.oldDate.getDate());
            this.oldDate.setMonth(month);
            this.oldDate.setFullYear(year);
        } else if (month) {
            if (this.dateInput.get("showOptions").split(",")[2] == "true") {
                dayNum = this.oldDate.getDate();
                var yearNum = this.oldDate.getFullYear();
                var monthNum = month.toInt() + 1;
                var lastDay = this.getYearMonthDayNum(yearNum, monthNum);
                if (dayNum > lastDay)dayNum = lastDay;
                this.giveDataTopopDiv_selectDay(yearNum, monthNum, dayNum);
            }
            this.oldDate.setDate(dayNum);
            this.oldDate.setMonth(month);
        }
        else if (year) {
            if (this.dateInput.get("showOptions").split(",")[2] == "true")
                this.giveDataTopopDiv_selectDay(year, this.oldDate.getMonth().toInt() + 1, this.oldDate.getDate());
            this.oldDate.setFullYear(year);
        }
        this.build_popCloseBtn();
    }, mtbody:null, ytbody:null, yctbody:null,
    build_popSelectMonth:function () {
        this.SelMonth.setStyle("display", "").empty();
        this.SelMonth.setStyle('background', 'transparent');
        this.SelMonth.set('code', this.oldDate.getMonth());
        this.SelMonth.set('value', this.options.monthNames[this.oldDate.getMonth()]);
        if (this.SelMonthPopDiv)return;
        this.SelMonthPopDiv = new Element('div').addClass('selPopDiv').setStyle('display', 'none').inject($(document.body));
        var mtable = new Element('table').set({'cellpadding':'3', 'cellspacing':'0', 'nowrap':'nowrap', 'width':'80px'}).inject(this.SelMonthPopDiv);
        this.mtbody = new Element('tbody').inject(mtable);
        var tr = new Element('tr');
        var td = new Element('td').addClass('yttd');
        td.addEvent('click', function (e) {
            var obj = e.target;
            var code = obj.get('code');
            this.SelMonthPopDiv.setStyle('display', 'none');
            this.SelMonth.set('code', code);
            this.SelMonth.set('value', obj.get('text'));
            this.SelMonth.setStyle('background', 'transparent');
            //刷新日历
            this.refreshDate(null, code);
            this.giveOutValue();
        }.bind(this));
        td.addEvent('mouseover', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.addClass('td_mouseover');
        });
        td.addEvent('mouseout', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.removeClass('td_mouseover');
        });
        for (var i = 0; i < 6; i++) {
            var mtr = tr.clone().inject(this.mtbody);
            var mtdl = td.clone().inject(mtr);
            mtdl.set({'text':this.options.monthNames[i], 'code':i});
            mtdl.cloneEvents(td);
            var mtdr = td.clone().inject(mtr);
            mtdr.set({'text':this.options.monthNames[i + 6], 'code':i + 6});
            mtdr.cloneEvents(td);
        }
        tr.destroy();
        td.destroy();
    },
    build_year:function () {
        this.SelYearPopDiv.empty();
        var ytable = new Element('table').set({'cellpadding':'3', 'cellspacing':'0', 'nowrap':'nowrap', 'width':'80px'}).inject(this.SelYearPopDiv);
        this.ytbody = new Element('tbody').inject(ytable);
        var tr = new Element('tr');
        var td = new Element('td').addClass('yttd');
        td.addEvent('click', function (e) {
            this.SelYearPopDiv.setStyle('display', 'none');
            var text = e.target.get('text');
            this.SelYear.set('code', text);
            this.SelYear.set('value', text + this.options.yearCap);
            this.SelYear.setStyle('background', 'transparent');
            //刷新日历
            this.refreshDate(text);
            this.giveOutValue();
        }.bind(this));
        td.addEvent('mouseover', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.addClass('td_mouseover');
        });
        td.addEvent('mouseout', function (e) {
            var eve = new Event(e);
            var el = $(eve.target);
            el.removeClass('td_mouseover');
        });
        var curSelYear = this.SelYear.get('code') / 1;
        var beginY = this.options.yearNames.beginYear.toInt();
        var endY = this.options.yearNames.endYear.toInt();
        for (var i = 0; i < 5; i++) {
            var ytr = tr.clone().inject(this.ytbody);
            var ytdl = td.clone().inject(ytr);
            ytdl.set('text', curSelYear - 5 + i);
            ytdl.cloneEvents(td);
            var ytdr = td.clone().inject(ytr);
            var _cy = curSelYear + i;
            if (_cy > endY)_cy = beginY - 1 + i;
            ytdr.set('text', _cy);
            ytdr.cloneEvents(td);
        }

        var ycTable = new Element('table').set({'id':'asdf', 'nowrap':'nowrap', 'width':'80px'}).inject(this.SelYearPopDiv);
        this.yctbody = new Element('tbody').inject(ycTable);
        var ctr = tr.clone().inject(this.yctbody);
        var ctd = td.clone().addClass('yttd').inject(ctr);
        ctd.cloneEvents(td, 'mouseover');
        ctd.cloneEvents(td, 'mouseout');
        ctd.set('text', '←');
        ctd.addEvent('click', function () {
            ytable.getElements('td.yttd').each(function (td, index) {
                td.set('text', td.get('text') / 1 - 10)
            });
        }.bind(this));
        var ctd1 = td.clone().inject(ctr);
        ctd1.cloneEvents(td, 'mouseover');
        ctd1.cloneEvents(td, 'mouseout');
        ctd1.set('text', '×');
        ctd1.addEvent('click', function () {
            this.SelYearPopDiv.setStyle('display', 'none');
            this.SelYear.setStyle('background', 'transparent');
        }.bind(this));
        var ctd2 = td.clone().inject(ctr);
        ctd2.cloneEvents(td, 'mouseover');
        ctd2.cloneEvents(td, 'mouseout');
        ctd2.set('text', '→');
        ctd2.addEvent('click', function () {
            ytable.getElements('td.yttd').each(function (td, index) {
                td.set('text', td.get('text') / 1 + 10)
            });

        }.bind(this));
        tr.destroy();
        td.destroy();
    },
    build_popSelectDate:function () {
        var tr2 = new Element('tr').inject(this.DivTbody);
        this.build_popTRWeek(tr2);
        this.build_popTRDays(this.DivTbody, this.oldDate.getFullYear(), this.oldDate.getMonth(), this.oldDate.getDate());
    },
    build_popSelectHour:function () {
        this.SelHour.setStyle("display", "").empty();
        for (var i = 0; i < 24; i++) {
            var option = new Element('option', {
                'value':i
            }).appendText(i);
            option.inject(this.SelHour);
            if (this.oldDate.getHours() == i)  option.selected = true;
        }
        this.SelHour.addEvent('change', function (e) {
            var obj = e.target;
            var value = obj.getSelected()[0].value;
            this.oldDate.setHours(value);
        }.bind(this));
    },
    build_popSelectMinute:function () {
        this.SelMinute.setStyle("display", "").empty();
        for (var i = 0; i < 60; i++) {
            var option = new Element('option', {
                'value':i
            }).appendText(i);
            option.inject(this.SelMinute);
            if (this.oldDate.getMinutes() == i)  option.selected = true;
        }
        this.SelMinute.addEvent('change', function (e) {
            var obj = e.target;
            var value = obj.getSelected()[0].value;
            this.oldDate.setMinutes(value);
        }.bind(this));
    },
    build_popSelectSecond:function () {
        this.SelSecond.setStyle("display", "").empty();
        for (var i = 0; i < 60; i++) {
            var option = new Element('option', {
                'value':i
            }).appendText(i);
            option.inject(this.SelSecond);
            if (this.oldDate.getSeconds() == i)  option.selected = true;
        }
        this.SelSecond.addEvent('change', function (e) {
            var obj = e.target;
            var value = obj.getSelected()[0].value;
            this.oldDate.setSeconds(value);
        }.bind(this));
    },
    build_popTRWeek:function (tr) {
        for (var i = 0; i < this.options.weekNames.length; i++) {
            var th = new Element('th').appendText(this.options.weekNames[i]);
            th.inject(tr);
        }
        this.buildWeek = true;
    },
    build_popTRDays:function (tbody, nowYear, nowMonth, nowDay) {
        this.testMonthDaysFebruary(nowYear);
        var firstDay = (1 - (7 + new Date(nowYear, nowMonth, 1).getDay() - this.getWeekStartDay()) % 7);
        var calDayRow;
        while (firstDay <= this.options.monthDays[nowMonth]) {
            calDayRow = new Element('tr', {
                'name':'dayTr'
            });
            for (i = 0; i < 7; i++) {
                if ((firstDay <= this.options.monthDays[nowMonth]) && (firstDay > 0)) {
                    var calDayCell = new Element('td').appendText(firstDay).inject(calDayRow);
                    calDayCell.addEvent('mouseover', function () {
                        $(this).addClass('dp_roll');
                    });
                    calDayCell.addEvent('mouseout', function () {
                        $(this).removeClass('dp_roll');
                    });
                    calDayCell.addEvent('click', function (e) {
                        var monthMax = this.options.monthDays.filter(function (item, index) {
                            if (this.SelMonth.get("code") == index)
                                return item;
                        }.bind(this))[0];
                        var obj = e.target;
                        if (this.options.dateControl == "minDay") {
                            if (obj.innerHTML.toInt() != 1) {
                                this.dateInput.getParent("div").set('title', "只能是当前选择月的月初");
                                this.dateInput.set("ovalue", "").set("value", "").focus();
                                return;
                            } else {
                                this.dateInput.getParent("div").set("title", "");
                            }
                        }
                        if (this.options.dateControl == "maxDay") {
                            if (obj.innerHTML.toInt() != monthMax) {
                                this.dateInput.getParent("div").set('title', "只能是当前选择月的月末");
                                this.dateInput.set("ovalue", "").set("value", "").focus();
                                return;
                            } else {
                                this.dateInput.getParent("div").set("title", "");
                            }
                        }
                        this.oldDate.setDate(obj.innerHTML.toInt());
                        this.giveOutValue();
//                        this.execGridOnFinished();
                    }.bind(this));
                } else {
                    calDayCell = new Element('td', {
                        'class':'dp_empty'
                    }).inject(calDayRow);
                }
                if ((firstDay == this.oldDate.getDate()) && (nowMonth == this.oldDate.getMonth() ) && (nowYear == this.oldDate.getFullYear())) {
                    calDayCell.addClass('dp_selected');
                }
                if ((firstDay == new Date().getDate()) && (nowMonth == new Date().getMonth() ) && (nowYear == new Date().getFullYear())) {
                    calDayCell.addClass('dp_today');
                }
                firstDay++;
            }
            calDayRow.inject(tbody);
        }
    },
    testMonthDaysFebruary:function (year) {
        if (this.isLeapYear(year)) {
            this.options.monthDays[1] = 29;
        } else {
            this.options.monthDays[1] = 28;
        }
    },
    isLeapYear:function (year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    },
    getWeekStartDay:function () {
        return 7;
    },
    giveDataTopopDiv:function (date) {
        this.giveDataTopopDiv_selectYear(date.getFullYear());
        this.giveDataTopopDiv_selectMonth(date.getMonth().toInt());
        this.giveDataTopopDiv_selectHour(date.getHours());
        this.giveDataTopopDiv_selectMinute(date.getMinutes());
        this.giveDataTopopDiv_selectSecond(date.getSeconds());
    },
    giveDataTopopDiv_selectYear:function (year) {
        //this.SelYear.getSelected.selected = false;
        //this.SelYear.getElement('option[value=' + year + ']').selected = true;
    },
    giveDataTopopDiv_selectMonth:function (month) {
        //this.SelMonth.getSelected.selected = false;
        //this.SelMonth.getElement('option[value=' + month + ']').selected = true;
    },
    giveDataTopopDiv_selectHour:function (hour) {
        this.SelHour.getSelected.selected = false;
        this.SelHour.getElement('option[value=' + hour + ']').selected = true;
    },
    giveDataTopopDiv_selectMinute:function (minute) {
        this.SelMinute.getSelected.selected = false;
        this.SelMinute.getElement('option[value=' + minute + ']').selected = true;
    },
    giveDataTopopDiv_selectSecond:function (second) {
        this.SelSecond.getSelected.selected = false;
        this.SelSecond.getElement('option[value=' + second + ']').selected = true;
    },
    giveDataTopopDiv_selectDay:function (year, month, day) {
        this.remove_popTRDays(this.DivTbody);
        this.build_popTRDays(this.DivTbody, year, month.toInt() - 1, day);
    },
    remove_popTRDays:function (tbody) {
        tbody.getElements('tr[name=dayTr]').each(function (item, index) {
            item.destroy();
        });
    },
    giveOutValue:function () {
        this.dateInput.value = SwordDataFormat.formatDateToString(this.oldDate, this.dateInput.get('dataformat'));
        this.dateInput.set("realvalue", this.dateInput.value);
//        this.dateInput.select();
    },
    getValue:function (obj) {
        var value,dataformat = obj.get('dataformat');
        if ($defined(obj.get('realvalue'))) {
            value =obj.get('realvalue');
        } else {
            value = obj.get('value');
        }
        if (obj.get("returnRealValue") == "false") {
            value = SwordDataFormat.formatStringToString(value, dataformat, this.submitDateformat);
        } else {
            value = $defined(obj.get('value')) ? obj.get('value') : "";
        }
        return value;
    }, getShowValue:function (obj, value) {
        var dataformat = obj.get('dataformat') || this.defaultdataformat;
        if (!$chk(value)) {
            if (obj.get('showCurDate') == 'true') return SwordDataFormat.formatDateToString(new Date(), dataformat);
            else return value;
        }
        if (value.split(".").length == 2) {
            value = value.split(".")[0];
        }
        return SwordDataFormat.formatStringToString(value, this.submitDateformat, dataformat);
    }, getRealValue:function (obj, value) {
        if (!$chk(value)) {
            return value;
        }
        if (value.split(".").length == 2) {
            value = value.split(".")[0];
        }
        var dataformat = obj.get('dataformat');
        if (obj.get("returnRealValue") == "false")
            value = SwordDataFormat.formatStringToString(value, dataformat, this.submitDateformat);
        return value;
    }, clear:function () {
        this.dateInput.destroy();
        this.dateBtn.destroy();
        this.datepopDiv.fade('out');
    }, hand_Input1:function (event) {
        var obj = event.target;
        try {
            var key = event.code;
            if (((key > 47) && (key < 58)) || ((key > 96) && (key < 106))) {
                var otext = obj.value;
                var keytext = String.fromCharCode(key);
                if (otext.length == 0) {
                    if (['1', '2'].contains(keytext))
                        obj.value = (keytext == '1') ? 199 : 20;
                    return false;
                } else if (otext.length == 1) {
                    if (otext == 1)obj.value = 19;
                    else obj.value = otext + keytext;
                    return false;
                } else if (otext.length == 3) {
                    obj.value = otext + keytext + "-";
                    return false;
                } else if (otext.length == 4) {
                    if (parseInt(keytext) > 1) {
                        obj.value = otext.substring(0, 4) + "-" + "0" + keytext + "-";
                        return false;
                    } else {
                        obj.value = otext.substring(0, 4) + "-" + keytext;
                        return false;
                    }
                } else if (otext.length == 5) {
                    if (parseInt(keytext) > 1) {
                        obj.value = otext.substring(0, 5) + "0" + keytext + "-";
                        return false;
                    }
                } else if (otext.length == 6) {
                    if (parseInt(otext.substring(5, 6) + keytext) > 12)
                        obj.value = otext.substring(0, 5) + "12" + "-";
                    else if (parseInt(otext.substring(5, 6) + keytext) == 0)
                        obj.value = otext + 1 + "-";
                    else
                        obj.value = otext + keytext + "-";
                    return false;
                }
                else if (otext.length == 7) {
                    if (otext.substring(5, 7) == "02" && parseInt(keytext) > 2) {
                        obj.value = otext + "-";
                        return false;
                    } else if (otext.substring(5, 7) != "02" && parseInt(keytext) > 3) {
                        obj.value = otext.substring(0, 7) + "-0" + keytext;
                        return false;
                    } else {
                        obj.value = otext.substring(0, 7) + "-" + keytext;
                        return false;
                    }
                }
                else if (otext.length == 8) {
                    if (otext.substring(5, 7) == "02" && parseInt(keytext) > 2) {
                        return false;
                    } else if (parseInt(keytext) > 3) {
                        obj.value = otext.substring(0, 8) + "0" + keytext;
                        return false;
                    }
                } else if (otext.length == 9) {
                    var val = otext.substring(8, 9) + keytext;
                    var t = parseInt(val);
                    var days = parseInt(this._getDays(otext.substring(0, 4), otext.substring(5, 7)));
                    if (t > days)
                        obj.value = otext.substring(0, 8) + days;
                    else if (t == 0)
                        obj.value = otext + 1;
                    else
                        obj.value = otext + keytext;
                    return false;
                } else if (otext.length >= 10) {
                    obj.value = (otext + keytext).substring(0, 10);
                    return false;
                } else {
                    return true;
                }
            } else return (key == 8 || key == 37 || key == 39 || (event.control && key == 86) || (event.shift && key == 36));
        } catch (e) {
        }
    },
    hand_Input:function (event) {
        var obj = event.target;
        try {
            var key = event.code;
            var otext = obj.value;
            var pos = this.getCursortPosition(obj);
            var textLen = otext.length;
            var selLen = document.selection.createRange().text.length;
            var sOptions = this.dateInput.get("showOptions").split(",");
            var dctrl =  this.options.dateControl;
            if ((key >= 96) && (key < 106))
                key = key - 48;
            var keytext = String.fromCharCode(key);
            if (((key > 47) && (key < 58))) {
                if(pos == textLen && selLen==0){
                	if(textLen == 2){
                		if (sOptions[0] == 'false' && sOptions[1] == 'true' && sOptions[2] == 'false')return false;
                	}else if (textLen == 3) {
                         var fx = "";
                         if (sOptions[1] == 'true')fx = '-';
                         var tempYear = otext + keytext;
                         if (tempYear.toInt() < this.options.yearNames.beginYear.toInt())
                             obj.value = this.options.yearNames.beginYear + fx;
                         else if (tempYear.toInt() > this.options.yearNames.endYear.toInt())
                             obj.value = this.options.yearNames.endYear + fx;
                         else
                             obj.value = otext + keytext + fx;
                         return false;
                     } else if (textLen == 4) {
                    	 if (sOptions[1] == 'true'){
                    		 if (parseInt(keytext) > 1 && sOptions[2] == 'true') {
                                 obj.value = otext.substring(0, 4) + "-" + "0" + keytext + "-";
                                 return false;
                             } else {
                                 obj.value = otext.substring(0, 4) + "-" + "0" + keytext;
                                 return false;
                             }
                    	 }else return false;
                     } else if (textLen == 5) {
                         if (parseInt(keytext) > 1) {
                             var sOptions = this.dateInput.get("showOptions").split(",");
                             var fx = "";
                             if (sOptions[2] == 'true')fx = '-';
                             obj.value = otext + "0" + keytext + fx;
                             return false;
                         }

                     } else if (textLen == 6) {
                         var sOptions = this.dateInput.get("showOptions").split(",");
                         var fx = "";
                         if (sOptions[2] == 'true')fx = '-';
                         var val = (otext.substring(5, 6) + keytext).toInt();
                         if (val > 12)
                             obj.value = otext.substring(0, 5) + "12" + fx;
                         else if (val == 0)
                             obj.value = otext + 1 + fx;
                         else
                             obj.value = otext + keytext + fx;
                         return false;
                     }
                     else if (textLen == 7) {
                    	 if (sOptions[2] == 'true'){
                         if (otext.substring(5, 7) == "02" && parseInt(keytext) > 2) {
                             obj.value = otext + "-";
                             return false;
                         } else if (otext.substring(5, 7) != "02" && parseInt(keytext) > 3) {
                             obj.value = otext.substring(0, 7) + "-0" + keytext;
                             return false;
                         } else {
                             obj.value = otext.substring(0, 7) + "-" + keytext;
                             return false;
                         }
                    	 }else return false;
                     }
                     else if (textLen == 8) {
                         if (otext.substring(5, 7) == "02" && parseInt(keytext) > 2) {
                         	obj.value = otext.substring(0, 8) + "0" + keytext;
                             return false;
                         } else if (parseInt(keytext) > 3) {
                             obj.value = otext.substring(0, 8) + "0" + keytext;
                             return false;
                         }
                     } else if (textLen == 9) {
                         var val = otext.substring(8, 9) + keytext;
                         var t = val.toInt();//parseInt(val);
                         var days = parseInt(this._getDays(otext.substring(0, 4), otext.substring(5, 7)));
                         if (t > days) {
                             obj.value = otext.substring(0, 8) + days;
                             return false;
                         } else if (t == 0) {
                             obj.value = otext + 1;
                             return false;
                         }
                     } else if (textLen >= 10) {
                     	if(selLen < 10){
                     		obj.value = (otext + keytext).substring(0, 10);
                     		return false;
                     	}else{
                     		otext = keytext;
                         	obj.value = "";
                         	return true;
                     	}
                     } else {
                         return true;
                     }
                }else{//修改输入框
                	if(sOptions[1]=="true"){
                		if(sOptions[2]=="true"){
                			if(textLen >= 10){
                        		if(selLen < 10){
                             		obj.value = (otext + keytext).substring(0, 10);
                             		return false;
                             	}else{
                             		otext = keytext;
                                 	obj.value = "";
                                 	return true;
                             	}
                        	}else return true;
                		}else{
                			var maxlen=7;
                			if(sOptions[0] == 'false') maxlen=2;
                    		if(dctrl == "minDay" || dctrl =="maxDay") maxlen =10;
                    		if(textLen >= maxlen){
                        		if(selLen < maxlen){
                             		obj.value = (otext + keytext).substring(0, maxlen);
                             		return false;
                             	}else{
                             		otext = keytext;
                                 	obj.value = "";
                                 	return true;
                             	}
                        	}else return true;
                		}
                		}else if(sOptions[0]=="true"){
                		if(textLen > 4){
                    		if(selLen < 4){
                         		obj.value = (otext + keytext).substring(0, 4);
                         		return false;
                         	}else{
                         		otext = keytext;
                             	obj.value = "";
                             	return true;
                         	}
                    	}else return true
                	}
                	
                	return true;
                }
               
            } else if(key == 229){
            	if(selLen > 0){
                 	obj.value = "";
                 	return true;
             	}
            	if (sOptions[1] == 'true'){
            		var maxlen=7;
            		if(dctrl == "minDay" || dctrl =="maxDay") maxlen =10;
            		if (sOptions[2] == 'true'){
            			if (textLen >= 10) {
            				return false;
                         }
            		}else if(sOptions[0] == 'false'){
            			if (textLen >= 2) {
            				return false;
                         }
            		}else if(textLen >= maxlen){
            			return false;
            		}
            	}else if(textLen >3){
            		return false;
            	}
            }else if(key==9){
        		this.hide();
        	}else return (key == 8 || key == 37 || key == 39 || (event.control && key == 86) || (event.shift && key == 36) || key==229);
        } catch (e) {
        }
    },
    hand_Input_nctrl:function (event) {
        try {
            var key = event.code;
            if ((key >= 96) && (key < 106))
                key = key - 48;
            if (((key > 47) && (key < 58)) || (key == 189 && !event.shift) || (!Browser.Engine.trident && key == 45)) {//'-':ff/ie不同
                var obj = event.target, otext = obj.value, otl = otext.length, dfl = obj.get('dataformat').length;
                var tri = this.getTextRangeIndex(obj);
                var tmpText;
                if (Browser.Engine.trident)
                    tmpText = otext.substring(0, tri[1]) + (key == 189 ? '-' : String.fromCharCode(key)) + otext.substring(tri[0], otl);
                else
                    tmpText = otext.substring(0, tri[0]) + (key == 45 ? '-' : String.fromCharCode(key)) + otext.substring(tri[1], otl);
                if (otl <= dfl - 1) {
                    //校验格式
                    this.defaultValidate(tmpText, obj);
                    return true;
                } else if (otl == dfl) {
                    if (tri[1] - tri[0] == 0)return false;
                    this.defaultValidate(tmpText, obj);
                    return true;
                }
            } else return (key == 8 || key == 37 || key == 39 || (event.control && key == 86) || (event.shift && key == 36));
        } catch (e) {
        }
    },
    _getDays:function (y, m) {
        m = parseInt(m, 10) + 1;
        return (new Date(y + "/" + m + "/0")).getDate();
    },
    defaultValidate:function (text, obj) {
        if (this.options.autoCtrl != 'true') {
            if (!obj.get('rule') || !obj.get('rule').contains('date')) {
                if ($chk(text) && !SwordDataFormat.isDate(text, obj.get('dataformat'))) {
                    this.validate.showIntimeMes(obj, '格式不符合' + obj.get('dataformat'));
                    this.validate.showIntimeError(obj);
                } else if (!obj.get('rule')) {
                    this.validate.showIntimeCorrect(obj);
                    this.validate.tooltips.hide(obj.get("name"));
                }
            }
        }
    },
    keyEvents:function (e) {
        if (e.key == 'backspace') {
            var obj = e.target;
            if (obj.get("readonly")) return false;
            var tmpText;
            var vt = obj.value, vtl = vt.length;
            if (this.options.autoCtrl == 'true') {
            	var pos = this.getCursortPosition(obj);
            	var sel = document.selection.createRange().text.length;
            	if(sel == 0){
            		sel =1;
            	}
        		vt=vt.substring(0,pos-sel)+vt.substring(pos,vt.length);
                obj.set("value", vt);
                var range = obj.createTextRange();  
                range.collapse(true); 
                range.moveEnd('character', pos-sel); 
                range.moveStart('character', pos-sel); 
                range.select(); 
//                obj.set("value", "");
//                obj.set("realvalue", "");
//                tmpText = '';
            } else {
                var tri = this.getTextRangeIndex(e.target);
                if (Browser.Engine.trident) {
                    if (tri[1] == tri[0])
                        tmpText = vt.substring(0, tri[1] - 1) + vt.substring(tri[1], vtl);
                    else
                        tmpText = vt.substring(0, tri[1]) + vt.substring(tri[0], vtl);
                }
                else {
                    if (tri[1] == tri[0])
                        tmpText = vt.substring(0, tri[1] - 1) + vt.substring(tri[1], vtl);
                    else
                        tmpText = vt.substring(0, tri[0]) + vt.substring(tri[1], vtl);
                }
            }
            this.defaultValidate(tmpText, obj);
            return true;
        }
    },
    getCursortPosition:function (input) {//获取光标位置函数
    	 var CaretPos = 0; // IE Support 
    	 if (document.selection){ 
    		 input.focus(); 
    		 var Sel = document.selection.createRange(); 
    		 Sel.moveStart ('character', -input.value.length);  
    		 CaretPos = Sel.text.length;
    		 } 
    	     // Firefox support
    	 else if (input.selectionStart || input.selectionStart == '0')  
    		 CaretPos = input.selectionStart; 
    	 return (CaretPos);
    	 },    	
    getTextRangeIndex:function (obj) {
        var index = [];
        if ($defined(document.selection)) {
            var s = document.selection.createRange();
            var oc = obj.createTextRange();
            s.setEndPoint("StartToStart", oc);
            index[0] = s.text.length;
            s = document.selection.createRange();
            oc = obj.createTextRange();
            s.setEndPoint("EndToStart", oc);
            index[1] = s.text.length;
        } else {
            index[0] = obj.selectionStart;
            index[1] = obj.selectionEnd;
        }
        return index;
    },
    getBoxEl:function (imgdiv) {//根据imgdiv找到input
        return imgdiv.getPrevious().getElement('.swordform_item_oprate');
    },
    getImgEl:function (inputEl) {//根据input找到imgdiv
        return inputEl.getParent().getNext();
    }, disable:function (inputEl) {
        if ($defined(inputEl)) {
            var img = this.getImgEl(inputEl);
            inputEl.set('disabled', true).addClass('calendar_input_disable').setStyle('background-color','');
            img.addClass('dateBtn_disable');
        }
    }, enable:function (inputEl) {
        if ($defined(inputEl)) {
            var img = this.getImgEl(inputEl);
            inputEl.erase('disabled').removeClass('calendar_input_disable');
            img.removeClass('dateBtn_disable');
            inputEl.setStyle('cursor', '');
            var rule = inputEl.get('rule');
        	if($defined(rule) && rule.contains('must'))inputEl.setStyle('background-color','#b5e3df');
        }
    }, addEventToEl:function (elType) {//根据元素类型添加事件
        if (elType == "input") {
            this.dateInput.addEvent('click', function (e) {
                var input = $(new Event(e).target);
                if (input.get('isShow') == "false") {
                    return;
                }
                if(Browser.Engine.trident){//避免chrome的不兼容
                    var txt =input.createTextRange();
                    txt.moveEnd('character',input.value.length);   
                    txt.moveStart('character',0);  
                    txt.select();
                }
                this.show(input);
            }.bind(this));
            this.dateInput.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ?
                    'keydown' : 'keypress', this.keyEvents.bind(this));
             if (this.options.handInput == "true" || (this.options.handInput == null && jsR.config.swordCalendar.handInput)) {
                   this.dateInput.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress',
                   this.options.autoCtrl == 'true' ? this.hand_Input.bind(this) : this.hand_Input_nctrl.bind(this));
              }
            if (!this.windowClick) {
                window.document.addEvent('click', function (e) {
                    if (this.dateInput.get('show') == 'true') {
                        var obj = e.target;
                        var parent = obj.parentNode;
                        var p_parent = parent.parentNode;
                        if (obj != this.dateInput
                            && null != this.dateBtn
                            && null != this.datepopDiv
                            && obj != this.dateBtn
                            && obj != this.ymContainer
                            && obj != this.ymct
                            && obj != this.SelHour
                            && obj != this.SelMinute
                            && obj != this.SelSecond
                            && parent != this.ymContainer//options
                            && parent != this.ymct
                            && parent != this.SelHour
                            && parent != this.SelMinute
                            && parent != this.SelSecond
                            && parent != this.topDiv
                            && obj != this.topDiv
                            && p_parent != this.mtbody
                            && p_parent != this.ytbody
                            && p_parent != this.yctbody
                            && p_parent != this.monthContent
                            && p_parent != this.yearContent) {
                            this.hide();
                        }
                    }
                }.bind(this));
                this.windowClick = true;
            }
        } else {
            this.dateBtn.addEvent('click', function (e) {
                var el=$(new Event(e).target);
                if(el.hasClass("dateBtn_disable")) return;
                if(Browser.Engine.trident4){
                	var input = el.getParent("td").getElement('input.swordform_item_oprate');
                	this.dateInput = $(input);
                	this.dateBtn = el.getParent("td").getElement('.dateBtn');
                }else {
                	this.dateBtn = el;
                    this.dateInput = this.getBoxEl(this.dateBtn);
                }
                this.show(this.getBoxEl(this.dateBtn));
            }.bind(this));
        }
    }
});