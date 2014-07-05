
var SwordGrid = new Class({

    Implements:[Events,Options]
    //继承容器
    //继承容器的属性 widgets(type Hash)
    ,Extends : PageContainer

    ,$family: {name: 'SwordGrid'}
    /**
     * 此类的类名称 值使用 SwordGrid
     * @property {private final string} name
     */
    ,name:"SwordGrid"

    ,options:{
        /**
         * 组件类别声明 ,应该为 SwordGrid ；在表格组件的根标签上必须声明此属性
         * @property {public string} sword
         */
        sword : null
        /**
         * 组件对象唯一标识，读取页面标签上的name属性；在表格组件的根标签上必须声明此属性，且要求声明的值唯一
         * @property {public string} name
         */
        ,name : null
        /**
         * 表格的标题栏；在表格组件的根标签上可以声明此属性 ，如果没有声明，表格将没有标题行
         * @property {public string} caption
         */
        ,caption : null
        /**
         * 每个元素的默认宽度（类似于table中的td）;在表格组件的根标签上可以声明此属性;默认值为200
         * @property {public int} itemX
         */
        ,itemX:200
        /**
         * 每个元素的默认高度（类似于table中的td）;在表格组件的根标签上可以声明此属性;默认值为25
         * @property {public int} itemY
         */
        ,itemY:25
        /**
         * 数据区域的高度 ;默认值为-1表示为动态高度【根据数据的行计算高度】；
         * 在表格组件的根标签上可以声明此属性,声明后，当数据行超出设定的高度，表格高度不会改变，将会出现滚动条;
         * @property {public int} dataY
         */
        ,dataY:-1
        /**
         * 表格宽度 ;默认值为-1表示为 宽度=元素宽度之和
         * 在表格组件的根标签上可以声明此属性;
         * @property {public int} dataX
         */
        ,dataX:'100%'
        /**
         * 每页显示行数【前台分页的时候才会生效，使用后台分页的时候，请在addTable接口中设置此参数】;
         * 在表格组件的根标签上可以声明此属性；
         * @property {public int} rows
         */
        ,rows:20
        /**
         * 数据总数；此属性是只读的；
         * @property {public int} totalRows
         */
        ,totalRows:0
        /**
         * 初始数据总数；此属性是只读的；
         * @property {public int} totalRows
         */
        ,initTotalRows:0
        /**
         * 当前页数,1代表第一页；此属性是只读的；
         * @property {public int} pageNum
         */
        ,pageNum:1
        /**
         * 分页功能标识，默认为true,如果false将展现所有数据，并且不支持翻页功能；false请在前台分页时候使用;
         * 在表格组件的根标签上可以声明此属性;
         * @property {public string} fenye
         */
        ,fenye:true
        /**
         * 一个字节占多少长度px , 在计算表格文本内容是否溢出的时候使用; 默认值为8；
         * 在表格组件的根标签上可以声明此属性;
         * @property {public int} bPx
         * @deprecated 此属性目前不生效；已经使用其他的方式解决溢出的问题。
         */
        ,bPx:8
        /**
         * 元素的最小宽度；拖拽时候的列宽的最小值；默认值为20；在表格组件的根标签上可以声明此属性;
         * @property {public string} minItemX
         */
        ,minItemX:20
        /**
         * 是否显示表头;默认值为true；
         * 在表格组件的根标签上可以声明此属性;
         * @property {public string} showHeader
         */
        ,showHeader:true
        /**
         * 表格绑定的javabean对象类名称，在提交到后台的时候，后台通过这个属性解析为JavaBean，
         * 如果从后台初始化表格数据使用的就是此JavaBean，就不用声明了；
         * 在表格组件的根标签上可以声明此属性；
         * @property {private string} beanname
         */
        ,beanname:null
        /**
         * 数据的字体大小，一般情况为一个项目组使用一套样式，字的大小可以自定义
         * @property {public int} dataFontSize
         */
        ,dataFontSize:null

        /**
         * 是否显示表头的弹出菜单，默认true ，菜单中的功能有 隐藏列 排序列  打开表格控制台 。。
         * @property {public string} showHeaderMenu
         */
        ,showHeaderMenu:'true'
        /**
         * 是否能拖拽改变列宽，默认true
         * @property {public string} dragWidth
         */
        ,dragWidth:jsR.config.swordGrid.dragWidth || 'false'

        ,headerHeight:jsR.config.swordGrid.headerHeight || 25

        ,toolConsole: jsR.config.swordGrid.toolConsole || 'false'

        /**
         * 是否能拖拽列，默认true
         * @property {public string} dragColumn
         */
        ,dragColumn:'false'

        //自动设置高度，不管数据多少，表格的高度永远与表格能装载数据的高度一致
        ,autoHeight:'true'

        //是否创建控制台区域
        ,showConsole:'true'

        //行选中模式：是否使用表格自带的checekbox或者radio的操作模式
        ,checkMoudle:'true'

        //控制台区域高度，与css保持一致
        ,consoleY:'26px'
        //表头高度，与css保持一致
        ,headerY:-1
        ,highQuality:'false'

        //控制台使用的样式         默认为 button ，可选项有： image（图片方式）
        ,consoleStyle:'button'
        ,issort:'true'    //整个表格是否需要排序
        ,cache:'true'   //翻页是否保存页面状态，默认为true
        ,'scrollX':-1
        ,'bufferView':'false'
        ,bufferDelay: 300
        ,bufferCreateRowDelay:50
        ,editRows:'false'
        ,'wordBreak':'false'

        ,ptid:null

        ,type:'common'    //默认为 普通common  ,可以为 树形 tree
        ,treeSignCol:null      //指定为tree的item名字，默认使用第一个元素
        ,treePcode:'pcode'
        ,treeCode:'code'
        ,treeEffect:false    //是否启用树的效果
        /**
         * 定义树初始展开的层次
         * @property {private string} extendLayer
         */
        ,extendLayer:2
        ,treeIt:null //树形数据遍历器
        ,vType:'intime'//校验提示

        //以下为私有属性。。。。。。
        ,pNode : null // 此组件的tag对象
        ,sGrid_div:null //显示内容容器对象
        ,items:null  //表格对象描述元素的属性
        ,data:null    //业务数据
        ,gridData:null//完整的表格数据
        ,fenyeType:'page'   //分页类型 page 和 server
        ,nextOrder:'row' //row:行的次序焦点转移、column:列的次序焦点转移；默认是行
        ,showHJ : 'false'
        ,rowCheckValidator : false   //设置当用户通过复选框选中某行时是否验证数据满足数据规则。
        ,treeRootNum:'false'

        ,collapse:'false'	//默认是否收缩表格
		,isRowEdit:"false"
		,openerWidth:"600px"
		,rowEditFinish:null
		,openerNoNextEvent:null
        //私有属性结束。。。。。。

        //以下为事件。。。
        /**
         * 在创建完console之后触发 ；在表格组件的根标签上可以声明此属性
         * @event onAfterCreateConsole
         * @param {object} consoleDiv
         */
        ,onAfterCreateConsole:$empty
        /**
         * 在创建完一行之后触发 ；在表格组件的根标签上可以声明此属性
         * @event onAfterCreateRow
         * @param {object} rowData，装载行的行数据，通过rowData.getValue(name)可以获得具体的值
         * @param {html element} rowEl ，装载行的html行元素，是一个div元素
         */
        ,onAfterCreateRow:$empty
        ,onBeforeCreateRow:$empty
        ,onAfterInsertRow:$empty
        ,valfocus:true//表格焦点移动的时候如果校验不通过是否可以移动到下一元素 true可以移动 false不可以移动
        ,noNextEvent:null//表格焦点移动没有时调用方法
        /**
         * 在创建完一个元素之后触发；在表格组件的根标签上可以声明此属性        rowData,cellValue,cellEl,itemEl
         * @event onAfterCreateCell
         * @param {object} cellData，装载元素的数据，通过 cellData.value 可以获得具体的值
         * @param {html element} cellEl ，装载cell的html元素，是一个div元素
         */
        ,onAfterCreateCell:$empty
        /**
         * 表格初始化数据结束之后触发，当表格没有被数据装载，即后台没有调用addtable接口，将不会被触发；
         * 在表格组件的根标签上可以声明此属性
         * @event onAfterInitData
         */
        ,onAfterInitData:$empty
        /**
         * 表格单击一行的时候触发；在表格组件的根标签上可以声明此属性
         * @event onRowClick
         * @param {object} rowData，被点击行的行数据，通过rowData.getValue(name)可以获得具体的值
         * @param {html element} rowEl ，被点击行的html行元素，是一个div元素
         */
        ,onRowClick:$empty

        /**
         * 表格双击一行的时候触发；在表格组件的根标签上可以声明此属性
         * @event onRowDbClick
         * @param {object} rowData，被双击行的行数据，通过rowData.getValue(name)可以获得具体的值
         * @param {html element} rowEl ，被点击行的html行元素，是一个div元素
         */
        ,onRowDbClick:$empty

        /**
         * 表格右键单击一行的时候触发；在表格组件的根标签上可以声明此属性
         * @event onRowRightClick
         * @param {object} rowData，被右键点击行的行数据，通过rowData.getValue(name)可以获得具体的值
         * @param {html element} rowEl ，被点击行的html行元素，是一个div元素
         */
        ,onRowRightClick:$empty

        //表格创建表头之后。。
        ,onAfterCreateHeader:$empty

        //点击全选的inpu
        ,onAllCheckClick:$empty


        //树形表格，新增行的时候，计算主键code的接口，这里是默认实现，可以扩展
        ,treeInsert_getCode:function(parent, brothers, treeLevel) {
            if(parent == null && brothers == null && treeLevel / 1 == 1) {//第一个结点
                return 1;
            } else if(parent == null && brothers != null && treeLevel / 1 == 1) {//第一层的某个节点
                return brothers.length + 1;
                ;
            } else if(parent != null && brothers != null) {//某个元素下的某个节点
                var tmp = Math.pow(100, treeLevel / 1) + brothers.length + 1;
                var pcode = parent.getValue(this.options.treeCode);
                return '' + pcode + tmp;
            }

            return -1;
        }

        //树形表格，新增第一层的行的时候，计算pcode的接口，这里是默认实现，可以扩展
        ,treeInsert_getRootPcode:function(brothers) {
            return 0;
        }

        ,onBeforeDelete :$empty   //todo 尚未实现。。
        ,onAfterDelete :$empty    //todo 尚未实现。。

    }
    ,headhash:new Hash()

    ,treeInsertChild:function(dataObj, items, rowNum) {
    	return this.insertRow(dataObj, items, rowNum, 'child');
    }
    ,treeInsertBrother:function(dataObj, items, rowNum) {
        return this.insertRow(dataObj, items, rowNum, 'brother');
    }

    /*    ,treeInsertRoot:function(dataObj,items,rowNum){

     }*/

    ,createCode:function(parent, brothers, treeLevel) {
        if($type(this.options.treeInsert_getCode) == 'function') {
            return this.options.treeInsert_getCode.run([parent, brothers,treeLevel], this);
        } else {
            return  this.getFunc(this.options.treeInsert_getCode)[0](parent, brothers, treeLevel);
//            return  this.getFunc(this.options.treeInsert_getCode)[0].run([parent, brothers,treeLevel],this);

        }
    }
    ,createRootPcode:function(brothers) {
        if($type(this.options.treeInsert_getRootPcode) == 'function') {
            return this.options.treeInsert_getRootPcode.run([brothers], this);
        } else {
            return  this.getFunc(this.options.treeInsert_getRootPcode)[0](brothers);
        }
    }

    ,tipDiv:null
    ,getTipDiv:function() {
        if(this.tipDiv == null) {
            /*var tmp=new Element('div');
             tmp.set('html',this.tipDivStr);
             this.tipDiv=tmp.getFirst();*/

            var gridTipDiv = new Element('div', {
                'class':'gridTipDiv'
            });
            var hiddenC = new Element('div', {
                'class':'gridTipItemDiv'
                ,'name': 'hiddenC'
                ,'html':'' + i18n.gridHide
            }).inject(gridTipDiv);
            var sortAsc = new Element('div', {
                'class':'gridTipItemDiv'
                ,'name':'sortAsc'
                ,'html':'' + i18n.gridEsc
            }).inject(gridTipDiv);
            var sortDesc = new Element('div', {
                'class':'gridTipItemDiv'
                ,'name':'sortDesc'
                ,'html':'' + i18n.gridDesc
            }).inject(gridTipDiv);

            var sgCtrl = new Element('div', {
                'class':'gridTipItemDiv'
                ,'html':'' + i18n.gridCtrl
            }).inject(gridTipDiv);


            hiddenC.addEvent('click', function(e) {
                e.stop();
                var name = gridTipDiv.header_item_div.get('_for');
                this.hideColumn(name);
            }.bind(this));

            sortAsc.addEvent('click', function(e) {
                e.stop();
                var name = gridTipDiv.header_item_div.get('_for');
                this.sortColumn(name, 'asc');
            }.bind(this));

            sortDesc.addEvent('click', function(e) {
                e.stop();
                var name = gridTipDiv.header_item_div.get('_for');
                this.sortColumn(name, 'desc');
            }.bind(this));

            sgCtrl.addEvent('click', function(e) {
                e.stop();
                this.openCtrl();//打开控制面板。
                gridTipDiv.setStyle('display', 'none');//关闭菜单。
            }.bind(this));

            this.tipDiv = gridTipDiv;

        }
        return this.tipDiv;
    }

    /**
     * 设置数据字体的大小，同时改变了表格行的高度。。。。
     * @function {public void} setDataFontSize
     * @param {string} size 字体的大小，单位为 px
     * @returns  void
     */
    ,setDataFontSize :function (size) {
        if(!$defined(size)) {
            if(this.options.dataFontSize != null) { //说明用户自定义了字体大小。
                this.dataDiv().setStyle('font-size', this.options.dataFontSize);
            }
            return;
        }
        this.dataDiv().setStyle('font-size', size);
    }

    ,openCtrl:function() {


        var columns = {"sword": "SwordGrid","name": "columns",'trs':[]};
        this.items().each(function(item) {
            var tds = {
                'check':{'value':item.get('show') == 'false' ? '' : '1'}
                ,'caption':{'value':item.get('caption')}
                ,'name':{'value':item.get('name')}
            };
            columns.trs[columns.trs.length] = {'tds':tds};
        });
        var dataFontSize = this.dataDiv().getStyle('font-size');
        var param = {'initData':{data:[columns]}
            ,'dataFontSize':dataFontSize};

        swordAlertIframe(jsR.rootPath + "swordweb/widgets/SwordGrid/html/sgCtrl.html",
                {width: 640
                    ,height:480
                    ,'param':param
                    ,'onOk':function(rows, fontSize) {
                    rows.each(function(row) {
                        var name = row.getValue('name');
                        var check = row.getValue('check');
                        if(check == '1') { //显示
                            this.showColumn(name);
                        } else {
                            this.hideColumn(name);
                        }
                    }.bind(this));

                    this.setDataFontSize(fontSize);
                }.bind(this)
                });

    }

    /**
     * 根据名字展现一列
     * @function {public null} showColumn
     * @param {String} name 要展现的列名称
     * @returns  null
     */
    ,showColumn:function(name) {
        this.getCells(name).setStyle('display', '').set('show', 'true');
        this.getHeaderEl(name).setStyle('display', '').set('show', 'true');
        this.getItemElByName(name).set('show', 'true');//保存状态
        this.buildXY();
    }


    /**
     * 根据名字隐藏一列
     * @function {public null} hideColumn
     * @param {String} name 要隐藏的列名称
     * @returns  null
     */
    ,hideColumn:function(name) {//todo 最后一个被隐藏的校验。
        this.getCells(name).setStyle('display', 'none').set('show', 'false');
        this.getHeaderEl(name).setStyle('display', 'none').set('show', 'false');
        this.getItemElByName(name).set('show', 'false');//保存状态
        if($chk(this.hjRow)) this.gethjRowEl(name).setStyle('display', 'none').set('show', 'false');//隐藏合计行
        this.buildXY();
    }

    //根据名字执行排序,如果传入了flag，按照flag的类型执行排序，否则执行默认算法。
    ,sortColumn:function(name, flag) {
        var headerEl = this.getHeaderEl(name)[0];
        if(headerEl.get('dragBoder') == 'true') {
            return;
        }
        if(this.totalRows() <= 0) {//没有任何数据，返回
            return;
        }


        if((this.isServer() && !this.isAllSave()) || (this.isPage() && (this.isInsert() || this.isDelete()))) {
            if(!confirm('当前列表中有数据没有保存，现在执行排序这部分数据将会丢失，是否继续执行排序？')) {
                return;
            }
        }

//        if (this.isServer()) { //后台分页，后台排序
        if(true) {
        	var ss = this.getSwordSort();
            var lastSortName = ss.options.sortName;//上次排序的字段
            var sortName = name; //当前点击排序的列名称
            var sortFlag = ss.options.sortFlag; //排序类型

            if(lastSortName != sortName) {
                sortFlag = 'asc';//当前点击列的首次排序，默认为升序
            } else {
                sortFlag == 'asc' ? sortFlag = 'desc' : sortFlag = 'asc';
            }

            ss.options.sortFlag = flag || sortFlag; //更新排序状态 ,排序类型
            ss.options.sortName = sortName; //更新排序状态 ，排序列名称
            ss.options.sortType = headerEl.get('sortType');

            //强制重新装载数据标识
            this.clearCache = true;

            this.loadPage(1);

            this.clearCache = false;

        } else {//前台分页，前台排序
//            this.alert('暂不支持前台分页的前台排序！');
        }
    }


    ,dataDivFxScroll:null //数据区域平滑滚动效果对象引用


    //校验错误 ,并记录错误状态
    ,checkError:function(row, names) {

        if($type(names) == 'string')names = [names];
        var flag = true;
        names.each(function(name) {
            if(!this.vObj.doValidate(row.getCell(name)).state)flag = false;
        }.bind(this));
        return flag;
    }

    /*
     * 存放有错误的元素，数组元素： 行号_元素名称
     * 此属性存放的只是当前页面的所有错误，页面改变后后应该清空
     * */
    ,errorCells:new Array()


    ,addError:function(rowIndex, cellName) {
    	return;
    }

  //去掉一行的错误
    ,removeRowError:function(el) {
    	this.celltooltips.hide();
    }

    ,removeAllError:function() {
    	this.celltooltips.hide();
    }

    ,isError:function() { //判断整个表格中是否有错误数据
        if(this.validate()) {//没有错误
            return false;
        }
        return true;
    }

    ,isUpdate:function() {
        if(this.getUpdateRows().length == 0) {//说明没有更新状态的行
            return false;
        }
        return true;
    }
    ,isInsert:function() {
        if(this.getInsertRows().length == 0) {//说明没有 新增 状态的行
            return false;
        }
        return true;
    }
    ,isDelete:function() {
        if(this.getDeleteRows().length == 0) {//说明没有 删除 状态的行
            return false;
        }
        return true;
    }
    ,isAllSave:function() {  //当前表格中没有未保存项目 返回 true  ，否则返回false
        return !this.isUpdate() && !this.isInsert() && !this.isDelete();
    }

    ,getUpdateRows:function() {
        return this.dataDiv().getChildren('div[status="update"][row]');
    }
    ,getInsertRows:function() {
        return this.dataDiv().getChildren('div[status="insert"][row]');
    }
    ,getDeleteRows:function() {
        return this.dataDiv().getChildren('div[status="delete"][row]');
    }

    ,getCheckedEls:function(checkName) {  //根据checkbox名字，获得选中状态的checkbox元素
        var els = this.dataDiv().getElements('input[name="' + checkName + '"][type="checkbox"][checked]');
        if(els.length == 0) {
            els = this.dataDiv().getElements('input[name="' + checkName + '"][type="radio"][checked]');
        }
        return els;
    }
    ,getStatusRows:function() {  //获得有状态（需要持久化）的数据行的数组，包括新增，更新，和删除
        return this.getUpdateRows().combine(this.getInsertRows().combine(this.getDeleteRows()))
    }

    /**
     * 获得有状态（需要持久化）的数据，包括新增，更新，和删除 ，此数据是grid的标准数据，可以进行提交
     * @function {public obj} getStatusGirdData
     * @returns obj
     */
    ,getStatusGirdData:function() {
        if(this.isCP()) {
            var trs = new Array();
            this.data().each(function(rowd) {
                if($chk(rowd)&&$chk(rowd['status'])) {
                    trs.push(rowd);
                }
            }, this);
            trs.combine(this.getRowsData(this.getInsertRows()));
            return {
                'sword':this.options.sword,
                'name' :this.options.name,
                'beanname':this.options.beanname,
                'trs' :trs
            };
        } else {
            return this.getRowsGirdData(this.getStatusRows());
        }
    }
    ,getStatusGridData:function() {  //为了接口名字
        return this.getStatusGirdData();
    }

    /**
     * 获得 当前页面的数据，包括新增，更新，和删除 ，此数据是grid的标准数据，可以进行提交
     * @function {public obj} getStatusGirdData
     * @returns obj
     */
    ,getCurPageGirdData:function() {
        return this.getRowsGirdData(this.dataDiv().getChildren());
    }
    ,getCurPageGridData:function() {//为了接口名字
        return this.getCurPageGirdData();
    }

    ,_inCache:function(index) {
        if((this.rows() * (this.pageNum() - 1) - 1) < index && index < (this.rows() * this.pageNum())) {
            return true;
        }
        for(var i = 0,l = this.cachePages.length; i < l; i++) {
            if((this.rows() * (this.cachePages[i] - 1) - 1) < index && index < (this.rows() * this.cachePages[i])) {
                return true;
            }
        }
        return false;
    }

    ,getAllGridData:function() {
        var d = this.getCurPageGirdData();
        this.data().each(function(rd, i) {//todo 过滤数据的代码可以进行优化
            if(!this._inCache(i)) {
                d.trs.include(rd);
            }
        }, this);

        return d;
    }
    /**
     * 从getAllGridData中取到一列的所有数据的和,可选状态过滤
     */
    ,getColumnSum:function(name, status) {
        var sum = 0;
        var agd = this.getAllGridData().trs;
        agd.each(function(rd, i) {
            var v = rd.getValue(name);
            v = v ? v / 1 : 0;
            if(['delete','insert','update'].contains(status)) {
                if(rd.status == status) sum += v;
            } else {
                sum += v;
            }
        });
        return sum;
    }
    /**
     * 获得有状态（需要持久化）的数据，包括新增，更新，和删除 ，此数据是行的数组trs
     * @function {public obj} getStatusRowsData
     * @returns array
     */
    ,getStatusRowsData:function() {
        return this.getRowsData(this.getStatusRows());
    }

    //返回一个新的行号，保证此行号不会与现有表格数据重复，类似于序列号
    ,createNewRowNum:function() {
        return this.options.totalRows + 1
    }
    ,validate:function(status,rows) {  
    	var allRows=this.options.sGrid_data_div.getElements("div.sGrid_data_row_div[status!='delete']");
		if($chk(rows))allRows=rows;
        var hasError = false;
		if(!$chk(allRows)||allRows.length == 0)return !hasError;
        var rowsLen = allRows.length;
        var cellsLen = allRows[0].getChildren().length;
        for(var r = 0;r<rowsLen;r++){
        	var row = allRows[r];
        	var cells = row.getChildren();
        	for(var c = 0;c<cellsLen;c++){
        		var cellDiv = cells[c];
        		 if(cellDiv.get('rule')) {
                     if(!this.vObj.doValidate(cellDiv).state) {
                    	 var pageNum = row.get('pageNum');
                         if(this.dataInCache(pageNum)){
                        	 if(pageNum <= 0 || pageNum > this.totalPage()) {
                                 this.alert('' + i18n.gridTarNotExist1 + pageNum + i18n.gridTarNotExist2);
                                 return;
                             }
                        	 if(this.options.fenye!='false'&&this.options.pageNum != pageNum){
                                 this.options.lastPageNum = this.options.pageNum;
                            	 this.options.pageNum = pageNum;
                            	 this.delayBuildData();
                             }
                             var s= this.getDataDivFxScroll();
                        	 var ls = this.eDelegator._listener.get("click");
                        	 if(ls){
                 				ls.each(function(l){
                 					if(l['condition'].indexOf(cellDiv.get("eventdele")) > 0){
                 						var e =new Event();
                 						if(l['args'])l['fn'](e,cellDiv,l['args']);
                 						else l['fn'](e,cellDiv);
                 					}
                 				},this);
                 			}
                        	 var inp = cellDiv.getElement("input");
                        	 if(!inp)return;
                        	var y = window.refToFormTooltip.getTopPos(inp);
                        	 var scrollY = window.refToFormTooltip.getTopPos(this.scrollDiv)+25;
                        	 var datay = this.scrollDiv.getHeight()-25;
                        	 var sy = y - scrollY;
                        	 if(sy>=0){
                            	 if(sy>=datay){
                                		 y = sy + datay/2 -90;
                            	 }else{
                            		 y =null;
                            	 }
                        	 }else{
                        		 if(Browser.Engine.trident6||Browser.Engine.trident7){
                            		 y = sy - datay/2 - 25;
                        		 }else{
                        			 y = sy - datay/2 + 285;
                        		 }
                        	 }
                        	 if($chk(y))s.set(0,y);
                        	 inp.focus();
                        	 this.vObj.validate(inp);
                         }
                         hasError = true;
                         break;
                     }
                 }
        	}
        	if(hasError)break;
        }
        return !hasError;
    }
    ,validateCheckedRow:function(check) {
        var checkedRows = this.getCheckedRow(check);
        if(checkedRows == null) return true;//没选中,则不校验
        return this.validate(false,checkedRows);
    }
    ,setText:function(cell, showvalue, realvalue) {
        if(cell.get('createInput') == 'true') {
            var input = cell.getElement('input[type=text]');
            input.set('value', realvalue);
            var type = cell.get('type');
            if(type == 'text'){
            	 cell.set('value',showvalue);
                 cell.set('createInput','false');
            }
           
        } else {
            //表格树时前面的展开样式要保存
            var lastNode = cell.getLast();
            if($chk(lastNode) && lastNode.get("name") == "treeSignDiv") {
                var childrenNode = cell.getChildren();
                var newNode = [];
                childrenNode.each(function(node, index) {
                    newNode[index] = node.clone().cloneEvents(node);
                });
                cell.set('text', showvalue);
                for(var j = newNode.length - 1; j >= 0; j--) {
                    cell.grab(newNode[j], "top");
                }
            } else {
                cell.set('text', showvalue);
                if(cell.get('type') == 'date') {//by用updateCell情况date的值时，不会去改变下列值
                    cell.set('showvalue', showvalue);
                    cell.set('realvalue', realvalue);
                }
            }
        }
        if(cell.get('type') == 'password') {
            var pw = this.dealPassword(realvalue);
            cell.set('showvalue', pw);
            cell.set('text', pw);
        }
    }

    //--------------持久化表格数据源接口---开始------




  //更新表格中一个cell的显示值，同时更新关联的表格数据源的值
    ,updateCell:function(cellDiv, newValue, showvalue, noDm2mc) {
        //如果没有传入showvalue的话，使用 newValue作为showvalue
        var row = this.getRow(cellDiv);
        if(!row)return;
        this.update(row, cellDiv, newValue, showvalue || newValue, noDm2mc);
    }

    /*
     *  更新的底层接口
     * newvalue 是 提交用的真实格式，realvalue  ,
     * 其实是要被提交的值，除了select(code)和date(showvalue)其余的用这个值比较状态
     *     //todo newValue是空格的情况 是否要trim掉后比较
     *  noDm2mc 为私有属性，只为createcellel创建select元素时候使用
     * */
    ,update:function(row, cellName, newValue, showvalue, noDm2mc) {
        if(!row)return;
        var insert = row.get('status') == 'insert';
        var cellDiv;
        if($type(cellName) == 'string') {
            cellDiv = row.getCell(cellName);
        } else {
            cellDiv = cellName;
            cellName = cellDiv.get('name');
        }

//        if(!cellDiv)return;

        var rowData = this.getOneRowData(row);
        var cellDs = rowData['tds'][cellName];
        if(cellDs == undefined) {
            rowData['tds'][cellName] = {}; //新建一个对象
            cellDs = rowData['tds'][cellName];
        }
        if(cellDs['originValue'] == undefined) {//如果没被创建过原始值，使用value作为原始值
            cellDs['originValue'] = cellDs['value'] || '';
        }
        var originValue = cellDs['originValue'];

        var haveCellDiv = $chk(cellDiv);


        if(haveCellDiv) {
            var type = cellDiv.get('type');
            if(type == 'select' && noDm2mc != true) { //处理下拉列表，代码转名称
                var itemELs = this.getItemElByName(cellName);
                if(itemELs.length > 0) {
                    var tmp = pc.getSelect().dm2mc(cellDiv.get('switched') == 'true' ? cellDiv : itemELs[0], newValue);
                    if($type(tmp) == 'object') {  //找到数据了
                        cellDiv.set('html', tmp['caption']);     //代码转名称
                        cellDiv.set('code', tmp['code']);
                        cellDiv.set('caption', tmp['caption']);
                        cellDiv.set("realvalue", tmp["realvalue"]);
                        showvalue = tmp['caption'];
                        if(newValue && newValue.contains('|')) {
                            cellDs['lazydata'] = newValue;
                            newValue = tmp['code'];
                        }

                    } else { //没有数据
                        cellDiv.set('html', newValue);
                        cellDiv.set('caption', newValue);
                        cellDiv.set('code', newValue);
                        cellDiv.set("realvalue", newValue);

                        cellDs['lazydata'] = null;
                    }

                }
            }


            if(type == 'pulltree' && noDm2mc != true) { //处理下拉列表，代码转名称
                var treeObj = $w(cellDiv.get('treename'));

                //传入的值为【code,999|caption,自然人】时，不用代码转名称，
                //这样就不用在页面初始化时加载树，减少页面加载压力,在点击时再去加载树的数据,
                //表格下拉树的懒加载方案
                if($chk(newValue)){
                    if(newValue.contains("code") && newValue.contains("caption")) {
                        var vs = newValue.split('|');
                        if(newValue.contains('codePath')) {
                            //懒加载树的反显路径
                            cellDiv.set('codePath', vs[2].substring('codePath,'.length));
                        }
                        showvalue = vs[1].split(',')[1];
                        //cellDiv.set('text',showvalue);
                        cellDiv.set('realvalue', vs[0].split(',')[1]);
                    } else {
                        //只有code值时，需要代码转名称，不推荐这么用
                        if(treeObj.gridShow != true) {
                            treeObj.select.show();
                            treeObj.options.pNode.setStyle('display', 'none');
                            treeObj.select.hide();
                            treeObj.gridShow = true;

                            this.addNextFocusEvent(treeObj.select.selBox);
                        }
                        var valueArray = newValue.split(',');//复选树
                        if(valueArray.length == 0) {
                            var query = new Hash();
                            query.set(treeObj.options.cascadeSign.id, newValue);//数据应为code值
                            var node = treeObj.getTreeNode(query);
                            var caption = '';
                            var rv = newValue;
                            if(node) {
                                caption = node.get('caption');
                                rv = node.get(treeObj.options.cascadeSign.id);
                            } else {
                                caption = newValue;
                            }
                            showvalue = caption;
                            //            cellDiv.set('text', caption);
                            cellDiv.set('realvalue', rv);
                        } else {
                            var rvs = '';
                            var captions = '';
                            valueArray.each(function(vv, index, a) {
                                var query = new Hash();
                                query.set(treeObj.options.cascadeSign.id, vv);//数据应为code值
                                var node = treeObj.getTreeNode(query);
                                var suf = (index == a.length - 1) ? '' : ',';
                                if(node) {
                                    captions += node.get('caption') + suf;
                                    rvs += node.get(treeObj.options.cascadeSign.id) + suf;
                                } else {
                                    captions += vv + suf;
                                    rvs += vv + suf;
                                }
                            });
                            showvalue = captions;
                            cellDiv.set('realvalue', rvs);
                        }
                    }
                }

            }

            if(type == 'text') {
                cellDiv.set('realvalue', newValue);
            }
            if(type == 'password') {
                cellDiv.set('realvalue', this.dealPassword(newValue));
                cellDiv.store('realvalue', newValue);
            }
            if(type == 'radio'){
            	if(newValue=='1'||newValue=='true')cellDiv.getElement('input').set('checked',true);
            	if(this.isradioSetChecked)this.radioSetChecked(cellDiv);
            }


            var format = cellDiv.get('format');
            if($chk(format)) {
                var sfct = sword_fmt.convertText(cellDiv, newValue).value;
                cellDiv.setSuitableValue(sfct, newValue);
                //为了不影响别的类型????
                //if(cellDiv.get('type')==null||cellDiv.get('type')=='label'||cellDiv.get('type')=='lable'){
                cellDiv.set('realvalue', newValue);
                cellDiv.set('showvalue', sfct);
                //}
            } else if(type == "date"){
            	 var sv = this.getCalendar().getShowValue(cellDiv, newValue);
                 var _sv = sword_fmt.convertText(cellDiv, sv).value;
                 cellDiv.setSuitableValue(_sv, newValue);
                 cellDiv.set('realvalue', newValue);
                 cellDiv.set('showvalue', _sv);
            }else {
                cellDiv.setSuitableValue(showvalue, newValue); //使用cell上面的showvalue来设置值
            }
        }

        if(insert) {//todo 需要处理更新
        	  rowData['tds'][cellName] = {'value':newValue}; 
        	  row.store('rowData', rowData);
            return;
        }

        var status = '';
        if(haveCellDiv) {
            if(cellDiv.get('type') == 'select') {//是下拉列表 用code来比较更新状态
                var code = cellDiv.get('code');
                if(code == null) {
                    code = '';
                }
                if(originValue != code) { //原来的值不等于新输入，为更新状态
                    if(haveCellDiv)cellDiv.addClass('sGrid_data_cell_update_div');
                    status = 'update';
                } else {
                    if(haveCellDiv)cellDiv.removeClass('sGrid_data_cell_update_div');
                }
            } else if(cellDiv.get('type') == 'date') {//日期 :用展现值来比较更新状态
                //            var showvalue=cellDiv.get('showvalue');
                if(showvalue == null) {
                    showvalue = '';
                }
                if(originValue != showvalue) { //原来的值不等于新输入，为更新状态
                    if(haveCellDiv)cellDiv.addClass('sGrid_data_cell_update_div');
                    status = 'update';
                } else {
                    if(haveCellDiv)cellDiv.removeClass('sGrid_data_cell_update_div');
                }
            } else {
                if(originValue != newValue) { //原来的值不等于新输入，为更新状态
                    if(haveCellDiv)cellDiv.addClass('sGrid_data_cell_update_div');
                    status = 'update';
                } else {
                    if(haveCellDiv)cellDiv.removeClass('sGrid_data_cell_update_div');
                }
            }
        } else {
            if(originValue != newValue) { //原来的值不等于新输入，为更新状态
                status = 'update';
            }
        }


        var rowStatus = '';
        if(row.get('status') == 'delete') {//如果是删除状态行，状态不做更改，仍为删除
            rowStatus = 'delete';
        }
        else if(status == 'update') {//此行至少有一个被更新项目
            rowStatus = 'update';
        } else { //看这行有没有其余的update状态的 cell
            for(var td in rowData['tds']) {
                if(rowData['tds'][td]['status'] == 'update' && td != cellName) {//有其余的update
                    rowStatus = 'update';
                    break;
                }
            }
        }
        row.set('status', rowStatus);  //更新本行的状态
        if(haveCellDiv)cellDiv.set('status', status);  //更新cell的状态


        cellDs['value'] = newValue;//更新cell的值为新的值
        cellDs['originValue'] = originValue;//记录原来的值,如果null的话，赋值''
        cellDs['status'] = status;//更新cell 的状态

        rowData['status'] = rowStatus;    //更新行的状态

    }


    //更新指定行的数据   public
    ,updateRow:function(row, data) {
        var tds = data['tds'];
        var tmp = [];
        if($chk(tds)) {
            var allCells = row.getChildren();
            for(var i = 0; i < allCells.length; i++) {
                var cell = allCells[i];
                var name = cell.get('name');
                if(tds[name]) {
                	var type = cell.get('type');
                	var value = tds[name]['value'];
                	var showvalue = tds[name]['showvalue'];
                	if(!$defined(showvalue)&&(type=='text'||type=='label')&& cell.get("format")){
                		 showvalue = sword_fmt.convertText(cell, value).value;
                	}else {showvalue=value;}
                    this.update(row, cell, value, showvalue);
                    tmp.push(cell.get('name'));
                }
            }
            for(var name in tds) {
                if(tmp.contains(name))continue;
                var type = cell.get('type');
                var cName=cell.get('name');
            	var value = tds[name]['value'];
            	var showvalue = tds[name]['showvalue'];
            	if(!$defined(showvalue) && cName==name&&(type=='text'||type=='label')&& cell.get("format")){
            		 showvalue = sword_fmt.convertText(cell, value).value;
            	}else {showvalue=value;}
                this.update(row, name, value, showvalue);
            }
        }
    }

    ,updateData:function(srcData, newData) {
        var g = this,
                i = g.data().indexOf(srcData),
                pageNum = Math.ceil((i + 1) / g.rows()),
                rowNum = (i + 1) - ((pageNum - 1) * g.rows()),
                haveRow = g.cachePages.contains(pageNum) || pageNum == g.pageNum();
        if(haveRow) {
            var row = g.dataDiv().getFirst('div[rowNum=' + rowNum + '][pageNum=' + pageNum + ']');
            if(row)this.updateRow(row, newData);
        } else {
            var rowData = srcData;
            var newTds = newData['tds'];
            for(var cellName in newTds) {
                var newValue = newTds[cellName]['value'];
                var cellDs = rowData['tds'][cellName];
                if(cellDs == undefined) {
                    rowData['tds'][cellName] = {}; //新建一个对象
                    cellDs = rowData['tds'][cellName];
                }
                if(cellDs['originValue'] == undefined) {//如果没被创建过原始值，使用value作为原始值
                    cellDs['originValue'] = cellDs['value'] || '';
                }
                var originValue = cellDs['originValue'];
                var rowStatus = '';
                var status = '';
                if(originValue != newValue) { //原来的值不等于新输入，为更新状态
                    status = 'update';
                }
                if(rowData['status'] == 'delete') {//如果是删除状态行，状态不做更改，仍为删除
                    rowStatus = 'delete';
                }
                else if(status == 'update') {//此行至少有一个被更新项目
                    rowStatus = 'update';
                } else { //看这行有没有其余的update状态的 cell
                    for(var td in rowData['tds']) {
                        if(rowData['tds'][td]['status'] == 'update' && td != cellName) {//有其余的update
                            rowStatus = 'update';
                            break;
                        }
                    }
                }
                cellDs['value'] = newValue;//更新cell的值为新的值
                cellDs['originValue'] = originValue;//记录原来的值,如果null的话，赋值''
                cellDs['status'] = status;//更新cell 的状态
                rowData['status'] = rowStatus;    //更新行的状态
            }
        }
    }
    ,useWhere:function(where) {
        if(!$chk(where))return false;
        if(this.dataDiv().getChildren(':not(.sGrid_data_row_delete_div)').length == 0)return false;
        return true;
    }


    /**
     * 表格新增一行
     * 在表格上增加一行，设置这些新增行的样式，并对这些行进行校验
     * @function {public null} insertRow
     * @param {obj} param  {rowNum:'',rowData:'',items:''}
     * @returns  null
     */
    ,insertRow:function(dataObj, items, rowNum, treeInsertType, where) {//todo 参数直接传入还是使用obj？
        if(!$chk(rowNum)) {
            rowNum = this.createNewRowNum();
        }
        if(!$chk(dataObj)) {
            var tds = {};
            var result = {'tds':tds,'getValue':function() {
            }};  //todo getValue 方法这样写不是很好。
            dataObj = result;
        }

        if(!$chk(items)) {
            items = this.items();
        }
        var row = null;
        if(this.options.type == 'tree') {
            if(!$chk(treeInsertType)) {
            	swordAlert('树形表格请使用treeInsertChild或者treeInsertBrother来新增行。');
                return;
            }

            var checkedRow = this.getCheckedRow();
            //delete隐藏状态的过滤
            if(this.dataDiv().getChildren('div[status!=delete][row]').length <= 0) {//没有行，创建根
                var code = this.createCode(null, null, 1);
                var pcode = this.createRootPcode(null);
                dataObj['tds'][this.options.treeCode] = {'value':code};
                dataObj['tds'][this.options.treePcode] = {'value':pcode};
                row = this.createTreeRow(dataObj,
                        rowNum - 1, null, 1, 'leaf', 'insert', items);

                row.inject(this.dataDiv());


            } else if(checkedRow == null) {

            	swordAlert('' + i18n.gridInsert);
                return;

            } else {//基于某行的增行

                if(treeInsertType == 'child') {
                    var parent = this.getOneRowData(checkedRow);
                    var pcode = parent.getValue(this.options.treeCode);
                    var cell = checkedRow.getElement('[code=' + pcode + ']');
                    var treeLevel = cell.get('treeLevel') / 1 + 1;

                    //先展开节点。。。todo 这里如果是异步加载的会有问题，以后实现
                    if(cell.get('signType') == 'plus') {
                        this.treeClick(cell);
                    }


                    var brothers = this.getRowsData(
                            this.dataDiv().getElements('[pcode=' + pcode + ']'));
                    var code = this.createCode(parent, brothers, treeLevel);

                    dataObj['tds'][this.options.treeCode] = {'value':code};
                    dataObj['tds'][this.options.treePcode] = {'value':pcode};

                    row = this.createTreeRow(dataObj,
                            rowNum - 1, null, treeLevel, 'leaf', 'insert', items);
                    row.inject(checkedRow, 'after');

                    //改变父亲cell显示策略
                    var signEl = cell.getElement('[name=treeSignDiv]');
                    if(signEl.hasClass('grid_sign_leaf')) {
                        cell.set('childNodesCreated', true); //标记为其子节点已被创建
                        signEl.removeClass('grid_sign_leaf');
                        signEl.addClass('grid_sign_minus');
                        cell.set('signType', 'minus');
                    }


                } else if(treeInsertType == 'brother') {
                    var brotherCell = checkedRow.getElement('[name=' + this.options.treeSignCol + ']');
                    var treeLevel = brotherCell.get('treeLevel') / 1;
                    var pcode = brotherCell.get('pcode');
                    var parent = this.getOneRowData(this.dataDiv().getElement('[code=' + pcode + ']'));


                    var brothers = this.getRowsData(
                            this.dataDiv().getElements('[treeLevel=' + treeLevel + ']'));
                    var code = this.createCode(parent, brothers, treeLevel);

                    dataObj['tds'][this.options.treeCode] = {'value':code};
                    dataObj['tds'][this.options.treePcode] = {'value':pcode};

                    row = this.createTreeRow(dataObj,
                            rowNum - 1, null, treeLevel, 'leaf', 'insert', items);

                    if(where && ['top','bottom'].contains(where))
                        row.inject(this.dataDiv(), where);
                    else
                        row.inject(checkedRow, 'before');//todo 重构插入位置

                }

            }


        } else {
            var checkedRow;
            if(this.useWhere(where)) {
                if(['before','after'].contains(where)) {
                    checkedRow = this.getCheckedRow();
                    if(!checkedRow) {
                    	swordAlert('请先选择行！');
                        return;
                    }
                }
            }
            row = this.createRow(rowNum, dataObj, items, 'insert'); //标记为 新增状态 状态 ，此状态的row 当删除的时候不调用后台接口，点击访问后台的详细信息活编辑按钮的时候将不执行
            if(this.useWhere(where)) {
                if(['before','after'].contains(where)) {
                    row.inject(checkedRow, where);
                    this.getDataDivFxScroll().toElement(row);
                } else if(['top','bottom'].contains(where)) {
                    row.inject(this.dataDiv(), where);
                    where == 'top' ? this.getDataDivFxScroll().toTop() : this.getDataDivFxScroll().toBottom();
                    ;
                }
            } else {
                row.inject(this.dataDiv());
                this.getDataDivFxScroll().toBottom();
            }
            row.addClass('sGrid_data_row_insert_div');

        }
        this.options.totalRows = this.options.totalRows / 1 + 1;
        this.refreshConsole();
        this.buildXY();
        this.fireEvent("onAfterInsertRow", [dataObj,row,items,this]);
        return row;
    }
    /*在表格数据源里新增一行或者几行的数项目*/    //todo 没有实现的方法
    ,insert:function(para) {
        var rows = para;
        if($type(para) != 'array') {
            rows = [para];
        }

        if(this.isServer()) {//后台分页

        } else {//前台分页

        }

        this.insertData = [];

    }

    /**
     * 标记删除行,并且更新表格数据源的数据状态【在保存表格的时候，会将此行作为删除状态提交】，
     * 表格上不执行删除的物理操作,返回被标记行元素;如果是新增行，直接删除,返回null;
     * 一般与 deleteRow(el) 接口一起使用；
     * @function {public htmlObj} deleting
     * @see deleteRow
     * @param {object} el：要删除的html行元素或者属于这行的一个html元素。
     * @returns deletingEl or null
     */
    ,deleting:function(el) {
    	var row = this.getRow(el);
        var status = row.get('status');
        row.addClass('sGrid_data_row_delete_div');
        if(status == 'insert') {//是新增的行的时候直接执行删除操作
            this.deleteRow(el);
            return null;
        }

        row.set('status', 'delete');
        var chks = row.getElements('input[type="checkbox"][checked]');
        row.getElements('input[type="checkbox"][checked]').set("checked",false)
        /*var realRowNum = this.getRealRowNum(el);
        this.data()[realRowNum - 1]['status'] = 'delete';    //更新行的状态
*/        row.retrieve('rowData')['status'] = 'delete';
        this.buildXY();
        this.scrollHeader();
        this.rereshHjRowData();
        this.refreshConsole();
        return row;

    }


    /* 数据状态回滚
     * 将表格和表格数据源的待提交状态（update 等、、） 回退为正常状态
     * */
    ,rollback:function(rows) {//rows 本次要同步的行 或者 行数组
        if($type(rows) == 'array') {
            rows.each(function(row) {
                this.rollbackRow(row);
            }, this);
        } else {
            this.rollbackRow(rows);
        }
    }

    //private 请使用 rollback 方法
    ,rollbackRow :function(row) {
        var rowStatus = row.get('status');
        if(rowStatus == 'update') {

            row.getChildren('*[status="update"]').each(function(cell) {
                // 重置每个cell的 显示 值为原始值
                var originValue = this.getCellOriginValue(cell);
                // 将数据源行的状态清空 // 将数据源每个cell的状态清空 / 将每个cell的状态清空//去掉 update 样式
                this.updateCell(cell, originValue);
            }, this);

        } else if(rowStatus == 'insert') {

        } else if(rowStatus == 'delete') {

        }
    }

    //获得cell的原始值，在ds中
    //如果数据中没有这个值，将使用数据的value作为此值。
    //如果都没有name对应的数据块，返回''
    ,getCellOriginValue:function(cell) {
        var cellName = cell.get('name');
        var rowData = this.getOneRowData(cell);
        var cellDs = rowData['tds'][cellName];
        if(cellDs == undefined) {//没有数据块
            return '';
        }
        if(cellDs['originValue'] == undefined) { //数据块中没有originValue
            return  cellDs['value'] || '';
        }
        //有这个值，直接返回
        return cellDs['originValue'];
    }

    /*
     * 将表格数据源的数据同步为一般状态（没有持久化状态）
     * 将表格中的状态同步为一般状态（没有持久化状态）
     * */
    ,commit:function(rows) {//rows 本次要同步的行 或者 行数组
        if(arguments.length == 0) {  //没有传入指定rows，使用表格当前的有状态的数据行进行提交
            rows = this.getStatusRows();
        }
        if($type(rows) == 'array') {
            rows.each(function(row) {
                this.commitRow(row);
            }, this);
        } else {
            this.commitRow(rows);
        }
        this.data().each(function(rd, i) {//todo 过滤数据的代码可以进行优化
            if(!this._inCache(i)) {
            	var status = rd['status']
            	if($chk(status))rd['status'] = '';
            }
        }, this);
    }

    //private 请使用 commit 方法
    ,commitRow :function(row) {
        var rowStatus = row.get('status');
        if(rowStatus == 'update') {
            this.commitUpdateRow(row);
        } else if(rowStatus == 'insert') {
            this.commitInsertRow(row);
        } else if(rowStatus == 'delete') {
            this.commitDeleteRow(row);
        }
    }

    //提交更新行
    ,commitUpdateRow:function(row) {
        /* row.getChildren('*[status="update"]').each(function(cell) {
         // 重置每个cell的 originValue
         cell.set('originValue', cell.get('fullValue'));
         // 将数据源行的状态清空 // 将数据源每个cell的状态清空 / 将每个cell的状态清空//去掉 update 样式
         this.updateCell(cell, cell.get('fullValue'));
         }, this);      */
        var rowdata = this.getOneRowData(row);
        var tds = rowdata['tds'];
        for(var name in tds) {
            var status = tds[name]['status'];
            if(status == 'update') {
                //改变初始值:select date  other
                var originValue = '';
                var cell = row.getCell(name);
                if($defined(cell)) {
                    var type = cell.get('type');
                    if(type == 'select') {
                        originValue = cell.get('code') || '';
                    } else if(type == 'date') {
                        originValue = cell.get('text') || '';
                    } else if(type == 'checkbox' || type == 'radio') {
                        originValue = cell.getElement('input[type=' + type + ']').get('checked') ? '1' : '0';
                    } else if(type == 'file2') {
                        var up = cell.retrieve('up');
                        originValue = up.getValue();
                        tds[name].tmp = undefined;  //提交成功说明文件已经不是临时文件了。
                    } else if(type == 'password') {
                        originValue = cell.retrieve('realvalue') || '';
                    } else {
                        originValue = cell.get('realvalue') || '';
                    }
                } else {
                    originValue = tds[name]['value'];
                }


                tds[name]['originValue'] = originValue;
                tds[name]['status'] = '';
                //在此去掉update，用途不明
                //this.update(row, name, tds[name]['value'], cell.get('text'));
            }
        }
        rowdata.status = '';
        row.set('status', '');
    }
    //提交新增行
    ,commitInsertRow:function(row) {
    	var rowNum = this.data().length;
    	if(rowNum < this.options.initTotalRows){
    		rowNum = this.options.initTotalRows;
    	}
        var tmp = this.getOneRowData(row);
        tmp.status = '';
        row.store('rowData', tmp);
        this.data()[rowNum] = tmp
        row.set('rowNum', rowNum + 1);


        //todo  保存成功后，要把 新增行的数据 同步到数据源中。。
        row.set('status', '');  //更新本行的状态
        row.removeClass('sGrid_data_row_insert_div');
        this.createRebuildButton();//新增行保存成功和删除成功和改变了页面结构


    }
    //提交 删除行
    ,commitDeleteRow:function(row) {
        row.set('status', '');  //更新本行的状态
        this.deleteRow(row);
    }


    //--------------持久化表格数据源接口---结束------

    //取值接口开始-------

    //当前表格的分页类型，page是前台分页  ，server是后台分页
    ,fenyeType:function() {
        return this.options.fenyeType;
    }
    //后台分页
    ,isServer:function() {
        if(this.fenyeType() == 'server')return true;
        return false;
    }
    //前台分页
    ,isPage:function() {
        return !this.isServer();
    }


    //每个元素的默认宽度（类似于table中的td）
    ,itemX:function() {
        return this.options.itemX / 1;
    }

    //每个元素的默认宽度（类似于table中的td）
    ,itemY:function() {
        return this.options.itemY / 1;
    }


    ,dataY:function() {
        return this.options.dataY / 1;
    }

    ,panel:function() {
        return this.options.panel;
    }

    //返回表头的div el
    ,header:function() {
        return this.options.sGrid_header_div;
    }

    //返回数据区的div el
    ,dataDiv:function() {
        return this.options.sGrid_data_div;
    }
    //返回控制台区的div el
    ,console:function() {
        return this.options.sGrid_console_div;
    }
    //返回控制台的item配置
    ,consoleItems:function() {
        return this.options.consoleItems;
    }

    ,sGrid_div:function() {
        return this.options.sGrid_div;
    }
    ,earseEvent:function(el, events) {
        events.each(function(e) {
            var f = el.get(e);
            if(f) {
                if(Browser.Engine.trident4 || Browser.Engine.trident5) {
                    f += '';
                    f = f.substring(f.indexOf('{') + 1, f.lastIndexOf('}'));
                }
                el.set('_' + e, f);
                el.erase(e);
            }
        });
    }
    ,items:function() {
        var r = this.options.pNode.getChildren(">div:not([console])[name]");
        if(this.intiItems)return r;
        this.intiItems = true;
        r.each(function(el) {
            var type = el.get('type');
            this.earseEvent(el, ['onblur','onclick']);
            if((['edit','detail','delete','deleting'].contains(el.get('act')) && !['a'].contains(type))
                    || ['button'].contains(type)) { //注册按钮类型
                el.set('buttonEl', 'true');
            } else {  //当不是按钮类型的时候将其设置为data元素
                el.set('dataEl', 'true');
            }
            el.addClass('sGrid_data_row_item_div');
            el.set('style', el.get('css'));
            el.setStyle('width', this.getItemX(el))
            el.set('TemplateStyle',el.get('style'));
        }, this);
        var lastShowItemEl = this.getLastShowItemEl();
        lastShowItemEl.setStyle('border-right', 'none').set('TemplateStyle',lastShowItemEl.get('style'));
        return r;
    }
    //根据名字获取元素的描述信息el的数组 。。。，不包括控制台元素。。。 注意。返回的是数组
    ,getItemElByName:function (name) {
//       return this.options.pNode.getChildren(">div:not([console])[name="+name+"]'") ;
        //todo 此种写法，取出了多余的元素，需要重构
        return this.options.pNode.getChildren("div:not([console])[name=" + name + "]'");
    }
    //获取最后显示的元素配置信息
    ,getLastShowItemEl:function () {
        var t = this.options.pNode.getChildren("div:not([console]):not([show=false])[name]");
        return t[t.length - 1];
    }
    
    //返回当前页数
    ,pageNum:function() {
        return this.options.pageNum / 1;
    }


    //获得当前页面中缓存的所有数据[obj,obj,obj,.......]
    ,data:function() {
        if(!$chk(this.options.data)) {
            this.options.data = [];
        }
        return this.options.data;
    }
    //获得表头上checkbox的数组
    ,getHeaderCheckboxs:function() {
        return this.header().getElements('input[type=checkbox]');
    }

    ,getHeaderCheckboxs_checked:function() {
        return this.header().getElements('input[type=checkbox][checked]');
    }

    ,getHeaderCheckboxs_noneChecked:function() {
        return this.header().getElements('input[type=checkbox]:not([checked])');
    }

    ,getHeaderCheckboxByName:function(name) {
        var _el = this.header().getElement('div[_for=' + name + ']');
        if(_el)return _el.getElement('input[type=checkbox]');
        return null;
        //return this.header().getElement('div[_for=' + name + ']').getElement('input[type=checkbox]');
    }

    ,allInCache:function() { //返回是否所有的页面都被创建过了。
        if(!this.cache())return false;
        if(this.cachePages.length == this.totalPage())return true;
        if((this.cachePages.length == this.totalPage() - 1) && !(this.cachePages.contains(this.pageNum())))return true;
        return false;
    }

    //获得数据总数
    ,totalRows:function() {
    	var totalrows = this.getConsoleArg();
        return $chk(totalrows)?totalrows:0;
    }
  //获得初始数据总数
    ,initTotalRows:function() {
        return this.options.initTotalRows / 1;
    }

    //获得总页数，当数据总数为负数或者0时候，返回0
    ,totalPage:function() {
    	if(this.options.fenye == 'false') return 1;
    	var initTotalRows = this.initTotalRows();
    	if(initTotalRows == 0)return 1;
        var yu = initTotalRows % this.rows();
        var result = (initTotalRows / this.rows()).toInt();
        if(yu != 0) {//有余数
            result++;
        }

        return result;
    }
    
  //返回每页行数
    ,rows:function() {

        if(this.options.fenye == 'false') {
        	var rows = this.dataDiv().getChildren('div:[status!=delete][pageNum=' + 1 + ']');
            return  rows.length;
        }

        return this.options.rows / 1;
    }
    //获得控制台中显示当前页数的元素，el lable
    ,consolePage:function() {
        return this.options.sGrid_console_page_lable;
    }

    //获得控制台中显示总页数的元素，el lable
    ,consoleTotalPage:function() {
        return this.options.sGrid_console_totalPage_lable;
    }
    //获得控制台中显示数据总数的元素，el lable
    ,consoleTotalRows:function() {
        return this.options.sGrid_console_totalRows_lable;
    }
    //获得控制台中显示每页条数的元素，el lable
    ,consoleRows:function() {
        return this.options.sGrid_console_rows_lable;
    }

//取值接口结束------

    ,initialize: function() {

    }
    ,getCalculatedRowHeight : function() {
        return this.options.itemY + 1;
    },

    getVisibleRowCount : function() {
        var rh = this.getCalculatedRowHeight(),
                visibleHeight = this.scrollDiv.clientHeight + this.itemY();
        return (visibleHeight < 1) ? 0 : Math.ceil(visibleHeight / rh);
    }
    ,getVisibleRows: function() {
        var count = this.getVisibleRowCount(),
                sc = this.scrollDiv.scrollTop,
                start = (sc === 0 ? 0 : Math.floor(sc / this.getCalculatedRowHeight()) - 1);
        return {
            first: Math.max(start, 0),
            last: Math.min(start + count - 1, this.options.fenye == 'false' ? (this.totalRows() - 1) : (this.rows() - 1))
        };
    }
    ,scrollHeader:function() {
        this.header().setStyle('top', this.scrollDiv.getScrollTop());
        if(this.hjRow) {
        	this.scrollHjRow();
        }
    }
    ,autoScroll:false
    ,nextRowScroll:false  //为判断是否为回车换行触发，请不要动
    ,dealScroll:function() {
        if(!this.autoScroll) this.dealScroll4FloatBox();//手动去触发
        this.scrollHeader();
        if(this.options.bufferView != 'true')return;
        if(!this.renderTask) {
            this.renderTask = new DelayedTask(this.bufferCreatRow, this);
        }
        this.renderTask.delay(this.options.bufferDelay / 1);
    }
    ,dealScroll4FloatBox:function() {
        //处理下拉、日期、下拉树等浮动框
        var row = this.getCheckedRow();
        if(row) {
            var inputEl = row.getElement('input[type=text]');
            if(inputEl) {
                var widget = inputEl.retrieve('widgetObj');
                if(widget&&!this.nextRowScroll) {
                    widget.hide();
                    if(widget.execGridOnFinished)widget.execGridOnFinished();
                }
                if(this.nextRowScroll)this.nextRowScroll = false;
            }
        }
    }
    ,bufferCreatRow:function() {
        var vr = this.getVisibleRows();
        this.delayCreateBufferRow.delay(this.options.bufferCreateRowDelay / 1, this, [this.dataDiv().childNodes,vr.first,vr.last,vr.first]);
    }
    ,delayCreateBufferRow:function(rows, start, end, curIndex) {
        var row = rows[curIndex];
        if(row.childNodes.length == 0) {
            this.createRow(curIndex + 1, row.retrieve('rowData'), this.createRowItems, null, row);
        }
        curIndex++;
        if(curIndex <= end) {
            this.delayCreateBufferRow.delay(this.options.bufferCreateRowDelay / 1, this, [rows, start, end, curIndex]);
        }
    }

    /**
     * 初始化方法
     * @function {public null} init
     * @param {InitPara}  initPara 使用这个dto对象来描述组件的初始化所需要的参数信息，通常包含一个root节点
     */
    ,initParam: function(initPara) {
         this.htmlOptions(initPara);
         
         this.options.cache = "true";
         
         this.cachePages.include(1);
         
         if(!window.validator) {
           	window.validator = pc.widgetFactory.create("SwordValidator");
           	window.validator.initParam(this.options.vType);
            }
          this.vObj = window.validator;
         

          if(!window.tooltips) {
         	window.tooltips = pageContainer.create('SwordToolTips');
          }
          this.celltooltips = window.tooltips;


        //隐藏 userdefine 元素
        this.options.pNode.getChildren('div[type=userdefine]').setStyle('display', 'none');
        //没有数据行的话，隐藏下拉树
        //debugger;
        this.options.pNode.getChildren('div[type=pulltree]').each(function(t) {
        	var treeName=t.get('treename'),treeDataName=t.get("dataname")||t.get("dataName");
            var treeObj=$w(treeName);
            treeObj.options.pNode.setStyle('display', 'none');
            /*t.set('notFirst','true');*/
            /*if(treeObj.initDataFlag != true) {
                treeObj.initData(pc.getInitData(treeName)||pc.getInitData(treeDataName));
                treeObj.initDataFlag = true;
            }*/
        });
       
        //初始化 console 的配置信息
        this.options.consoleItems = this.options.pNode.getChildren(">div[console]");


        //创建显示容器
        var sGrid_div = new Element('div', {
            'class': 'sGrid_div'
        }).inject(this.options.pNode);
        this.options.sGrid_div = sGrid_div;
        this.initEvents();

        if(this.options.caption) {
            this.createPanel(sGrid_div, this.options.caption);
        }

        this.createToolConsole(sGrid_div);

        this.scrollDiv = new Element('div', {
            'styles':{
                'overflow':'auto'
                ,'width':'100%'
            }
            ,'events':{
                'scroll':this.dealScroll.bind(this)
            }
        }).inject(this.sGrid_div());
        if(this.options.wordBreak == 'true') {
            var c = (Browser.Engine.trident4 || Browser.Engine.trident5) ? 'wordBreak_ie67' : 'wordBreak';
            this.scrollDiv.addClass(c);
        }

        if(Browser.Engine.trident4 || Browser.Engine.trident5) {//是ie6
            this.scrollDiv.setStyle('position', 'relative');
            if(this.options.scrollX == -1) {   //不需要横向滚动条
                this.scrollDiv.setStyle('overflow-x', 'hidden');
            }
            var itemArr = this.items();
            var iCount = itemArr.length;
            var xCount = 0;
            for(var index=0; index<iCount;index++){
            	var temp = itemArr[index];
            	var tempX = temp.get("x");
            	var   reg =/^\d+(.\d+)?%$/;
            	if(tempX != null && tempX != 0 && reg.test(tempX)){
            		var tempNum = Number(tempX.substring(0,tempX.length-1));
            		xCount = xCount + tempNum;
            		if(xCount > 99){
            			var setX = tempNum-(xCount-98);
            			setX<0? setX = 0+"%":setX = setX+"%";
            			temp.set("x",setX);
            			temp.setStyle('width', setX);
            			break;
            		}
            	}
            }
        }

       	 var sGrid_header_div = new Element('div', {
                'class': 'sGrid_header_div'
            }).inject(this.scrollDiv);
       if(this.options.wordBreak != 'true') {
       		sGrid_header_div.setStyle('height', '25px');
       }
        if(this.options.headerY != -1)
            sGrid_header_div.setStyle('height', this.options.headerY);
        this.options.sGrid_header_div = sGrid_header_div;

        //创建数据行的容器div，并放在显示容器内部
        var sGrid_data_div = new Element('div', {
            'class': 'sGrid_data_div'
        }).inject(this.scrollDiv);
        this.options.sGrid_data_div = sGrid_data_div;

        //创建控制台的容器div，并放在显示容器内部
        var sGrid_console_div = new Element('div', {
            'class': 'sGrid_console_div'
            ,'styles':{
                'height':this.options.consoleY
            }
        }).inject(this.sGrid_div());
        this.options.sGrid_console_div = sGrid_console_div;

        if(this.options.showConsole != 'true') {
            sGrid_console_div.setStyle('display', 'none');
        }

        this.setDataFontSize();
        this.buildHeadr();
        this.createHjRow();
        this.buildConsole();
        this.buildXY();
        this.changeTableState();

    }
    
	,changeTableState:function(){

		if(this.options.collapse=="true"){
			this.collapseTable();
		}
	}

    /*创建合计行*/
    ,createHjRow:function(){
   	 	if(this.options.showHJ == "true") {
            var hjRowDiv = this.options.sGrid_header_div.clone(false);
            hjRowDiv.removeClass("sGrid_header_div").addClass("sGrid_hj_row_div");
            this.items().each(function(item,index){
           	 var empItem=item.clone();
           	 if(empItem.get("show")!="false")
           	 empItem.removeClass("sGrid_data_row_item_div").addClass("sGrid_hj_row_item_div").setProperties({"html":"-","realvalue":"-","title":"-","showvalue":"-","type":"label"}).inject(hjRowDiv);
           	 if(empItem.get("isHjLabel")=="true")empItem.setProperties({"html":"合计","title":"合计"}).setStyle("text-align","center").removeProperties("realvalue","showvalue");
            });
            hjRowDiv.setStyles({"height":25,"border-top":0}).inject(this.dataDiv(), "after");
            if(this.options.scrollX > "100%")hjRowDiv.setStyle("width",this.options.scrollX);
            if(Browser.Engine.trident6||Browser.Engine.trident7){
                this.hjRow = hjRowDiv.clone();
                this.hjRow.inject(hjRowDiv, "after");
                this.scrollHjRow();
            }else{
            	this.hjRow = hjRowDiv;
            }
      }
   }
    /*刷新合计行数据*/
    ,rereshHjRowData:function(){
    	if(this.hjRow){
	    	this.hjRow.getElements("div").each(function(r, index) {
	            var n = r.get("name");
	            if(r.get("hj") && n) {
	                var tempobj = this.hjRow.getElement("div[name='" + n + "']");
	                tempobj.setStyle("text-align", "right");
	                r.get('format') ? tempobj.set("format", r.get('format')) : null;
	                var showvalue = html = this.getHj(n) || '';
	                if(tempobj.get('format')) showvalue = sword_fmt.convertText(tempobj, showvalue).value;
	                tempobj.set({'text':showvalue,'realvalue':html || "",'title':showvalue,"isHj":"true"});
	            }
	    	}.bind(this));
    	}
    }
    ,scrollHjRow:function() {
    	var h=this.scrollDiv.getHeight();
    	var sh=this.scrollDiv.getScrollHeight();
    	var tempTop;
    	if(Browser.Engine.trident4||Browser.Engine.trident5||Browser.Engine.trident8||Browser.Engine.webkit||Browser.Engine.gecko19){
        	if(h<=sh){
        		tempTop = h - sh + this.scrollDiv.getScrollTop();
        		if(this.options.scrollX > "100%") {
                    tempTop = tempTop - 17;
               }
                this.hjRow.setStyle("top", tempTop);	
        	}else{
        		this.hjRow.setStyle("top", 0);	
        	}
    	}else{
    		if(h<sh){
        		tempTop = h - sh + this.scrollDiv.getScrollTop() - 25;
        		if(this.options.scrollX > "100%") {
                    tempTop = tempTop - 17;
               }
                this.hjRow.setStyle("top", tempTop);	
        	}else{
        		this.hjRow.setStyle("top", -25);
        	}
    	}
    }
    //设置某列的宽度
    ,setX:function(name, x) {
        var headerItemDiv = this.getHeaderEl(name)[0];
        var itemConfig = this.getItemElByName(name)[0];
        headerItemDiv.setStyle('width', x);
        if($chk(this.hjRow)){//获取合计行
        	var hjItemDiv = this.gethjRowEl(name)[0];
        	hjItemDiv.setStyle('width', x);
            hjItemDiv.set('x', x);
        }
        this.dataDiv().getElements('.sGrid_data_row_item_div[name=' + name + ']').setStyle('width', x);
        itemConfig.set('x', x); //保存状态
        itemConfig.setStyle('width',x);
        this.buildX();
    }

    ,getDragMaxX:function() {
        var childX = 0;
        this.header().getChildren().getWidth().each(function(w) {
            childX += w;
        });
        var headerX = this.header().getWidth();

        return headerX - childX - headerX * 0.01;
    }
    ,getNextShow:function(el) { //获得下一个可见元素
        return el.getNext(':not([show=false])');
    }
    ,getNextMaxX:function(el) {
        return this.getNextShow(el) ? this.getNextShow(el).getWidth() - 20 : 0;
    }

    ,getBorderDiv:function() {
        if(!$chk(this.borderDiv)) {
            this.borderDiv = new Element('div', {
                'class':'sGrid_border_div'
            }).inject(document.body);
            this.borderDiv.drag = new Drag.Move(this.borderDiv, {
                'snap':0
                ,'onComplete': function(el) {
                    var headerItemDiv = el.headerItemDiv;
                    var stManager = el.stManager;
                    var max = el.maxX;
                    var next = stManager.getNextShow(headerItemDiv);
                    var srcX = headerItemDiv.getWidth()-1;   //-1为border的宽度
                    var srcX2 = next ? next.getWidth()-1 : 0;
                    var x = el._getPosition().x - headerItemDiv._getPosition().x;
                    var fCellName = headerItemDiv.get("_for");
                    var sCellName = next.get("_for");
                    var x1 = x;
                    var x2 = 0;

                    var itemConfig = stManager.getItemElByName(headerItemDiv.get('_for'))[0];
                    if(itemConfig.get('x')) {
                        if(itemConfig.get('x').contains('%')) {//是百分比的情况
                            x = x / stManager.header().getWidth() * 100 + '%';
                        }
                    }
                    if(x1 < srcX) {//向左拖动
                        x2 = (srcX2 + (srcX - x1   )) / stManager.header().getWidth() * 100 + '%';
                        if(stManager.options.pNode.get("scrollx") && parseInt(stManager.options.pNode.get("scrollx")) > 100)
                            x2 = srcX2 + (srcX - x1   );
                        if(next) {
                            next.setStyle('width', x2);
                            stManager.getNextShow(itemConfig).set('x', x2).setStyle('width', x2);
                        }
                    } else {
                        x2 = (srcX2 - (x1 - srcX - max)) / stManager.header().getWidth() * 100 + '%';
                        if(stManager.options.pNode.get("scrollx") && parseInt(stManager.options.pNode.get("scrollx")) > 100)
                            x2 = srcX2 + (srcX - x1   );
                        if(next) {
                            next.setStyle('width', x2);
                            stManager.getNextShow(itemConfig).set('x', x2).setStyle('width', x2);
                        }
                    }
                    headerItemDiv.setStyle('width', x);

                    stManager.dataDiv().getElements('.sGrid_data_row_item_div[name=' + headerItemDiv.get('_for') + ']').each(function(cellDiv) {
                        cellDiv.setStyle('width', x);
//                        cellDiv.setSuitableValue(cellDiv.get('fullValue'));

                        if(x2 != 0 && next) {  //占了右边元素宽度
                            stManager.getNextShow(cellDiv).setStyle('width', x2);
                        }
                    });
                    itemConfig.set('x', x); //保存状态
                    itemConfig.setStyle('width', x);
                    if(stManager.hjRow) {
                        fhjCell = stManager.hjRow.getElement("div[name='" + fCellName + "']");
                        fhjCell.setStyle('width', x);
                        shjCell = stManager.hjRow.getElement("div[name='" + sCellName + "']");
                        shjCell.setStyle('width', x2);
                    }
                    stManager.buildX();
                    el.setStyle('display', 'none');


                    if(Browser.Engine.trident4||Browser.Engine.trident5)
                        stManager.getHeaderMaskDiv().setStyle('display', 'none');

                }
                ,'onDrop': function(el, droppable) {
//                    el.setStyle('display', 'none');
                }
                ,'onCancel':function(el) {
                    el.setStyle('display', 'none');
                }
                ,'onStart':function(el) {
                    if(!Browser.Engine.trident4&&!Browser.Engine.trident5)return;
                    var stManager = el.stManager;
                    stManager.getHeaderMaskDiv().setStyles({
                        'left':stManager.header().getPosition().x
                        ,'top':stManager.header().getPosition().y
                        ,'width':stManager.header().getWidth()
                        ,'display':''
                    });
                }
            });
        }

        return this.borderDiv;
    }



    ,getHeaderMaskDiv:function() {
        if(!this.headerMaskDiv) {
            this.headerMaskDiv = this.header().clone(false);
            this.headerMaskDiv.setStyles({
                'position':'absolute'
                ,'background':'white'
                ,'border':0
                ,'display':'none'
                ,'height':this.header().getHeight()
                ,'opacity':0.1
            });
            this.headerMaskDiv.inject(document.body);
        }

        return this.headerMaskDiv;
    }

    ,headerM: new Element('div', {
        'class': 'sGrid_header_item_div'
        ,'styles':{
//            'float':'left'
            'border-right-style':'solid'
            ,'border-right-width':'1px'
        }
    })

    ,buildHeadr:function() {
        if(this.options.showHeader == false || this.options.showHeader == 'false') {
//             this.header().setStyle('display','none');
            this.header().setStyle('height', 0);
            this.header().setStyle('border', 0);
            this.header().setStyle('overflow', 'hidden');
        }

        var lastName = this.getLastShowItemEl().get('name');
        //遍历items创建表头元素
        this.items().each(function(item) {

            var name = item.get('name');
            var caption = item.get('caption');
            var type = item.get('type');
            var allchk = item.get('allchk');
            this.headhash.set(name, caption);
            var sGrid_header_item_div = this.headerM.clone(false).set({'_for':name,'sortType':item.get('sortType') || ''}).inject(this.header());
            if(item.get("x")=="0%"){
            	sGrid_header_item_div.setStyle("display","none");
            }
            if(lastName == name)sGrid_header_item_div.setStyle('border-right', 'none');

            if(this.options.headerY != -1) { //如果程序员定义了表头高度的话
                sGrid_header_item_div.setStyles({
                    'height':this.options.headerY
                    ,'line-height':(caption && caption.contains('<br>')) ? this.options.headerY / 2 : this.options.headerY
                });
            }

            if(type == 'rowNum') {
                this.haveRowNum = true;
            }


            if(type == 'checkbox' && allchk != 'false') {
                var ce = new Element('input', {
                    'type' : 'checkbox'
                    ,'class':'sGrid_header_checkbox'
                    ,'events': {
                        'click': function(e) {
                            var el = new Event(e).target;
                            var checkFlag = el.get('checked');
                            var allrows = this.dataDiv().getChildren();
                            if(this.isCP()) {
                                item.set('userClicked', 'true');//客户点击过
                                item.set('checkAllFlag', '' + checkFlag);//客户点击全选按钮的最后状态
                            }
                            if(allrows.length != 0) {
                                var index = -1;
                                var allcells = allrows[0].getChildren();
                                for(var m = 0; m < allcells.length; m++) {
                                    if(allcells[m].get('name') == name) {
                                        index = m;
                                        break;
                                    }
                                }

                                if(index != -1) {
                                    for(var w = 0; w < allrows.length; w++) {
                                        var inp = allrows[w].getChildren()[index].getFirst('input[name="' + name + '"][type="checkbox"]:not(:disabled)');
                                        if(inp && !$chk(inp.get('disabled'))) {
                                            inp.set('checked', checkFlag);
                                            if(item.get('data') == 'true')this.updateCell(inp.getParent(), checkFlag ? '1' : '0');
                                        }
                                    }
                                }
                            }
                            //当全选时触发第一行的change事件，对所有选中行做数据规则验证，未通过验证的取消选中状态。
                            if(checkFlag && this.options.rowCheckValidator != false && this.options.rowCheckValidator != "false") {

                                var rows = this.getCheckedRow(name);
                                if(rows && rows[0]) {
                                    var checkeds = rows[0].getElement(">.sGrid_data_row_item_checkbox:checked:not(:disabled)");
                                    if(checkeds)
                                        checkeds.fireEvent("change", [checkeds]);
                                }
                            }
                            this.fireEvent('onAllCheckClick', [name,el]);

                        }.bind(this)
                    }
                }).inject(sGrid_header_item_div);
                if(this.options.headerY != -1)ce.setStyles({'height':this.options.headerY,'line-height':this.options.headerY});
            }
            
            if(item.getAttribute('sort') != 'false' && this.options.issort != "false") {//sort=false的时候，不执行排序，其他情况执行排序
                if(!['checkbox','button','rowNum','rowNumOnePage','radio','file2'].contains(type)) { //除了XX类型，其余类型注册排序功能
                    if(!(item.get('tid') && item.get('type') != 'a')) {   // 有tid且不是a类型的 也不注册排序
                        sGrid_header_item_div.addEvent('click', function(e) {
                            this.sortColumn(name);
                        }.bind(this));
                        sGrid_header_item_div.hoverClass('sGrid_header_item_div_hover');
                    }
                }
            }


            if((!['checkbox'].contains(type)) || (allchk == 'false')) {    //checkbox,radio 类型不注册caption 为了居中显示
                var rule = item.get('rule');
                var ismust = rule ? rule.contains('must') : false;
                new Element('div', {
                    'class': 'sGrid_header_text_div'
                    ,'html':ismust ? "<span class='red'>*</span>" + caption : caption
                    ,'title':caption
                }).inject(sGrid_header_item_div);
            }


            //设置宽度
            this.setItemX(item, sGrid_header_item_div);


            if(this.options.dragWidth == true || this.options.dragWidth == 'true') {

                if(['checkbox','radio'].contains(type)) {    //除了checkbox,radio 类型，其余类型注册拖拽宽度功能
//                   return;
                } else {
                    //宽度的拖拽  开始。
                    var sGrid_header_border_div = new Element('div', {
                        'class': 'sGrid_header_border_div'
                    }).inject(sGrid_header_item_div, 'top');

                    sGrid_header_border_div.addEvent('mousedown', function(e) {
                        var height = this.scrollDiv.getHeight();
                        var y = sGrid_header_item_div.getPosition().y;
                        var x = sGrid_header_item_div._getPosition().x;
                        var borderDiv = this.getBorderDiv();
                        borderDiv.setStyles({
                            'height':height + 'px'
                            ,'left':e.page.x
                            ,'top': y
                            ,'display':''
                        });
                        borderDiv.headerItemDiv = sGrid_header_item_div;
                        borderDiv.stManager = this;

                        var maxX = this.getDragMaxX();//表格剩余空间
                        var nextMaxX = this.getNextMaxX(sGrid_header_item_div);//下一个元素的空间

                        borderDiv.maxX = maxX;

                        borderDiv.drag.options.limit = {'x':[x + this.options.minItemX/1,e.page.x + maxX + nextMaxX],'y':[y,y]};
                        borderDiv.drag.bound.start(e);
                        e.stop();
                    }.bind(this));

                    sGrid_header_border_div.addEvent('click', function(e) {
                        e.stop();
                    });
                    /*sGrid_header_border_div.hover(function(e) {
                     e.stop()
                     }, function(e) {
                     e.stop()
                     });*/
                    //宽度的拖拽  结束。
                }


            }

            if(item.get('show') == 'false'||item.get('x') ==0) {//隐藏列
                sGrid_header_item_div.set('show', 'false');
                if(Browser.Engine.trident4) {   //ie6
                    sGrid_header_item_div.setStyle('width', 0).setStyle('border', '0px').setStyle('height', 0);
                } else {
                    sGrid_header_item_div.setStyle('display', 'none');
                }
            }
            
            if(item.get('type') == 'select'&&item.get('showVBC')=="true"){
            	var dataName = item.get('dataName');
                var data = pageContainer.getInitDataByDataName(dataName);
                if($chk(data))item.store("selectData",data);
            }


            //创建一个表头结束
        }.bind(this));


        if(this.options.dragColumn == true || this.options.dragColumn == 'true') {
            //列拖拽功能
            new DragTable(this.header(), {
//                clone:true,
                clone:function(event, el, list) {
                    return el.clone(false).set('name', null).setStyles({
                        'margin': '0px',
                        'position': 'absolute',
                        'visibility': 'hidden',
                        'width': el.getWidth()
                        ,'height':el.getHeight()
                        ,'border':"2px dotted black"
                        ,'background-color':'white'
                        ,'cursor':'move'
                    }).inject(list).position(el.getPosition(el.getOffsetParent()));
                },

                revert: true,
                //           handle :'span[dragRow=true]',
                /* initialization stuff here */
                initialize: function() {

                },
                /* once an item is selected */
                onStart: function(el) {
                    el.addClass('sGrid_header_drag_start_div');
                },
                onSort:this.dragHeader.bind(this)
                ,onEnter: function(el, dl) {
                    dl.addClass('sGrid_header_drag_enter_div');
                }
                ,onLeave: function(el, dl) {
                    dl.removeClass('sGrid_header_drag_enter_div');
                }

            });
            //列拖拽功能 结束
        }

//       this.header

        this.fireEvent('onAfterCreateHeader');

    }

    ,consoleInputRows:function() {
        if(!this.consoleInputRowsEl) {
            this.consoleInputRowsEl = new Element('input', {
                'value':this.rows()
                ,'rule' :'numberInt_must_contrast;>=1;<=50'
                ,'msg':'请输入一个大于0的整数'
                ,'styles':{
                    'width':20
                }
            }).inject(this.consoleRows(), 'after');
            this.vObj._add(this.consoleInputRowsEl);
            this.consoleInputRowsEl.addEvent('blur', function() {
                this.consoleRows().setStyle('display', '');
                this.consoleInputRowsEl.setStyle('display', 'none');

                if(!this.vObj.validate(this.consoleInputRowsEl)) {
                    this.vObj.clearElTip(this.consoleInputRowsEl);
                    return;
                }
                var rows = this.consoleInputRowsEl.get('value') / 1;
                if(rows == this.rows())return;
                this.options.rows = rows;
                if(this.isServer())
                    this.loadPage(1);
                else
                    this.initData(this.options.gridData);
            }.bind(this));
        }
        return  this.consoleInputRowsEl;
    }
    //创建控制台
    ,buildConsole:function() {

        this.createConsolePageButton();
        if(this.consoleButton_first) {//首页
            this.consoleButton_first.addEvent('click', function() {
                if(this.pageNum() == 1) {
                    this.alert("" + i18n.gridFirst);
                    return;
                }
                this.loadPage(1);
            }.bind(this));
        }

        if(this.consoleButton_last) { //末页
            this.consoleButton_last.addEvent('click', function() {
                if(this.pageNum() == this.totalPage()) {
                    this.alert('' + i18n.gridLast);
                    return;
                }
                this.loadPage(this.totalPage());
            }.bind(this))
        }

        if(this.consoleButton_next) { //下一页
            this.consoleButton_next.addEvent('click', function() {
                if(this.pageNum() + 1 > this.totalPage()) {
                    this.alert('' + i18n.gridLast);
                    return;
                }
                this.loadPage(this.pageNum() + 1);
            }.bind(this))
        }

        if(this.consoleButton_prev) {//上一页
            this.consoleButton_prev.addEvent('click', function() {
                if(this.pageNum() - 1 <= 0) {
                    this.alert('' + i18n.gridFirst);
                    return;
                }
                this.loadPage(this.pageNum() - 1);
            }.bind(this))
        }

        if(this.consoleButton_ok) { //确定按钮
            this.consoleButton_ok.addEvent('click', this.clickQueDing.bind(this))
        }

        
        this.autoInsertFunc = null;
        //增行 删行
        if(this.consoleItems()) {
            this.consoleItems().each(function(item, index) {
                var consoleType = item.get('console');
                var tid = item.get('tid');
                var ctrl = item.get('ctrl');
                var check = item.get('check');
                var name = item.get('name');

                if(consoleType == 'delete') {

                    var caption = item.get('caption') || '删行';

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'type':'button'
                        ,'value':caption
                        ,'name':name
                        ,'events': {
                            'click': function() {
                                this.deleteRows({
                                    'tid':tid
                                    ,'ctrl':ctrl
                                    ,'check':check
                                    , 'onSuccess':this.getFunc(item.get('onSuccess'))[0]
                                    , 'onError':this.getFunc(item.get('onError'))[0]
                                    ,'postType':item.get('postType')
                                    ,'popMes':item.get('popMes')
                                    ,'delConfirm':item.get('delConfirm')
                                });
                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());


                } else if(consoleType == 'deleting') {


                    var caption = item.get('caption') || '删行';

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'type':'button'
                        ,'name':name
                        ,'events': {
                            'click': function() {
                                var els; //获得每行选中的checkbox
                                if(!$defined(check)) {    //没有传入参数，直接返回最后被单击行
                                    els = this.dataDiv().getChildren('div.sGrid_data_row_click_div:not([status=delete]):not([cache=true])');
                                } else {
                                    els = this.dataDiv().getElements('div:not([status=delete]) div input[name="' + check + '"][type="checkbox"][checked]');
                                    if(els.length == 0) {
                                        els = this.dataDiv().getElements('div:not([status=delete]) div input[name="' + check + '"][type="radio"][checked]');
                                    }
                                }
                                if(els.length == 0) {
                                    swordAlert('请至少选择一行！');
                                    return;
                                }

                                els.each(function(el) {
                                    this.deleting(el);
                                }, this);

                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());


                } else if(consoleType == 'insert') {

                    var caption = item.get('caption') || '增行';

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'type':'button'
                        ,'name':name
                        ,'events': {
                            'click': function() {
                                this.insertRow(this.getDataObjByInsertItem(item), this.combineItems(item), this.createNewRowNum(), null, item.get('where')); //合并后的增行配置项目，替换原有的类型和校验规则

                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());
                    if(item.get('autoInsert')=='true')
                    this.autoInsertFunc = function() {

                        this.insertRow(this.getDataObjByInsertItem(item), this.combineItems(item), this.createNewRowNum(), null, item.get('where')); //合并后的增行配置项目，替换原有的类型和校验规则

                    }
                } else if(consoleType == 'treeInsertBrother') {

                    var caption = item.get('caption') || '添加兄弟节点';

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'type':'button'
                        ,'name':name
                        ,'events': {
                            'click': function() {

                                this.treeInsertBrother(this.getDataObjByInsertItem(item), this.combineItems(item), this.createNewRowNum()); //合并后的增行配置项目，替换原有的类型和校验规则

                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());
                    if(item.get('autoInsert')=='true')
                    this.autoInsertFunc = function() {

                        this.treeInsertBrother(this.getDataObjByInsertItem(item), this.combineItems(item), this.createNewRowNum()); //合并后的增行配置项目，替换原有的类型和校验规则

                    }
                } else if(consoleType == 'treeInsertChild') {

                    var caption = item.get('caption') || '添加孩子结点';
                    
                    var clickInsertTreeChild = function(){

                        var curLevel = 0;
                        var checkedRow = this.getCheckedRow();
                        if(checkedRow) {
                            curLevel = checkedRow.getElement('div[treeLevel]').get('treeLevel') / 1;
                        }

                        var maxLevel = item.get('maxLevel') || -1;
                        maxLevel = maxLevel / 1;
                        if(maxLevel != -1 && curLevel + 1 > maxLevel) {
                            var mes = item.get('maxMes') || '因为限制了增行的最大层数，所以不能在此处增行。';
                            swordAlert(mes);
                            return;
                        }

                        this.treeInsertChild(this.getDataObjByInsertItem(item), this.combineItems(item), this.createNewRowNum()); //合并后的增行配置项目，替换原有的类型和校验规则

                    
                    }

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'type':'button'
                        ,'name':name
                        ,'events': {
                            'click': function() {
                            	clickInsertTreeChild();
                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());
                    if(item.get('autoInsert')=='true')
                        this.autoInsertFunc = clickInsertTreeChild;


                } else if(consoleType == 'save') {//保存更新和新增行操作

                    var caption = item.get('caption') || '保存';

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'name':name
                        ,'type':'button'
                        ,'events': {
                            'click': function() {
                                if(this.validate()) {

                                    //submit before
                                    if(item.get('onSubmitBefore')) {
                                        var flag = this.getFunc(item.get('onSubmitBefore'))[0]();
                                        if(flag == false)return;
                                    }

                                    var req = this.getReq({
                                        'tid':tid
                                        ,'ctrl':ctrl
                                        ,'widgets':[this.getStatusGirdData()]
                                    });

                                    //----------------------------
                                    var popMes = item.get('popMes') != 'false';//是否自动弹出提示信息，默认为自动弹出
                                    pc.postReq({
                                        'req':req
                                        ,'postType':item.get('postType')
                                        ,'onSuccess':function(res) {//onSuccess
                                            if(popMes)this.alert('' + i18n.saveSuc);
                                            this.commit();

                                            if(item.get('onSuccess')) {
                                                this.getFunc(item.get('onSuccess'))[0](req, res);
                                            }
                                        }.bind(this)
                                        ,'onError':function (res) {//onError 出错的情况
                                            if(popMes)this.alertError('' + i18n.saveFai);

                                            if(item.get('onError')) {
                                                this.getFunc(item.get('onError'))[0](req, res);
                                            }
                                        }.bind(this)
                                    });


                                }
                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());

                } else if(consoleType == 'submitChecked') {


                    var caption = item.get('caption') || '' + i18n.save;
                    var dl = item.get('postType') == 'download';//提交类型有 普通，下载，上传，不设置为普通

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'name':name
                        ,'type':'button'
                        ,'events': {
                            'click': function() {
                                var item2 = this.getItemElByName(check);
                                if(this.isCP() && item2.get('userClicked') == 'true') {
                                    if(this.allInCache() || item2.get('checkAllFlag') == 'false') {
                                        if(this.getCheckedEls(check).length == 0) {
                                            this.alertError("" + i18n.gridInsert);
                                            return;
                                        }
                                    }
                                } else {
                                    if(this.getCheckedEls(check).length == 0) {
                                        this.alertError("" + i18n.gridInsert);
                                        return;
                                    }
                                }

                                var req = this.getReq({
                                    'tid':tid
                                    ,'ctrl':ctrl
                                    ,'widgets':[this.getCheckedData(check)]
                                });

                                pageContainer.postReq({
                                    'req':req
                                    ,'postType':item.get('postType')
                                    ,'onSuccess':function(res) {//onSuccess
                                        if(item.get('onSuccess')) {
                                            this.getFunc(item.get('onSuccess'))[0](req, res);
                                        }
                                    }.bind(this)
                                    ,'onError':function (res) {//onError 出错的情况
                                        if(item.get('onError')) {
                                            this.getFunc(item.get('onError'))[0](req, res);
                                        }
                                    }.bind(this)
                                });

                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());

                } else if(consoleType == 'curPageData' || consoleType == 'allData' || consoleType == 'allNoDeleteData') {


                    var caption = item.get('caption') || '' + i18n.save;

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'name':name
                        ,'type':'button'
                        ,'events': {
                            'click': function() {
                                var d;
                                if(consoleType == 'curPageData') {
                                    d = this.getCurPageGirdData();
                                } else if(consoleType == 'allData') {
                                    d = this.getAllGridData();
                                } else if(consoleType == 'allNoDeleteData') {
                                    d = this.getAllNoDeleteGridData();
                                }


                                var req = this.getReq({
                                    'tid':tid
                                    ,'ctrl':ctrl
                                    ,'widgets':[d]
                                });

                                pageContainer.postReq({
                                    'req':req
                                    ,'postType':item.get('postType')
                                    ,'onSuccess':function(res) {//onSuccess
                                        this.commit();
                                        if(item.get('onSuccess')) {
                                            this.getFunc(item.get('onSuccess'))[0](req, res);
                                        }
                                    }.bind(this)
                                    ,'onError':function (res) {//onError 出错的情况
                                        if(item.get('onError')) {
                                            this.getFunc(item.get('onError'))[0](req, res);
                                        }
                                    }.bind(this)
                                });

                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());

                } else if(consoleType == 'button') {


                    var caption = item.get('caption') || '' + i18n.button;

                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'type':'button'
                        ,'name':name
                        ,'events': {
                            'click': function() {
                                if(item.get('onClick')) {
                                    this.getFunc(item.get('onClick'))[0]();
                                }
                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());
                    if(item.get('autoInsert')=='true'){
                    	 if(item.get('onClick')) {
                             this.autoInsertFunc = this.getFunc(item.get('onClick'))[0];
                         }
                    }

                } else if(consoleType == 'excel') {
                    var caption = item.get('caption') || '导出';
                    new Element('input', {
                        'class': 'sGrid_console_item_button'
                        ,'value':caption
                        ,'name':name
                        ,'type':'button'
                        ,'events': {
                            'click': function() {
                                var d = this.getGridExcelInfo();
                                var req = this.getReq({
                                    'tid':tid
                                    ,'ctrl':ctrl
                                    ,'widgets':d
                                });
                                pageContainer.postReq({
                                    'req':req
                                    ,'postType':item.get('postType')
                                    ,'onSuccess':function(res) {//onSuccess
                                        this.commit();
                                        if(item.get('onSuccess')) {
                                            this.getFunc(item.get('onSuccess'))[0](req, res);
                                        }
                                    }.bind(this)
                                    ,'onError':function (res) {//onError 出错的情况
                                        if(item.get('onError')) {
                                            this.getFunc(item.get('onError'))[0](req, res);
                                        }
                                    }.bind(this)
                                });
                            }.bind(this)
                        }
                    }).hoverClass('sGrid_console_item_button_hover').inject(this.toolpanel || this.console());
                } else {
                    throw new Error('gird[' + this.options.name + ']:SwordGrid无法处理控制台属性：' + consoleType);
                }

            }, this);

        }

        //如果是image模式 和 ie 下， 创建一个隐藏的button来解决，键盘回车跳转页面的问题
        /*if (this.options.consoleStyle=='image'&&Browser.Engine.trident) {
         new Element('button', {
         'text':'111'
         ,'styles':{
         'display':'none'
         }
         }).inject(this.console());
         }*/


        this.fireEvent("onAfterCreateConsole", [this.console()]);

    }

    ,deleteRows:function(param) {
        var popMes = param.popMes != 'false';//是否自动弹出提示信息，默认为自动弹出
        var delConfirm = param.delConfirm || ('' + i18n.gridDelConfirm);
        var delConfirmTree = param.delConfirm || ('' + i18n.gridDelConfirmTree);
        var tid = param.tid;
        var ctrl = param.ctrl;
        var check = param.check;
        var onSuccess = param.onSuccess;
        var onError = param.onError;
        var postType = param.postType;
        var els = this.getCheckedEls(check); //获得每行选中的checkbox
        if(!$chk(check)) {  //没有声明check，删除单击选中的行
            els = [this.getCheckedRow()];
            var tmp = this.getCheckedRow();
            if(tmp == null) {
                swordAlert('' + i18n.gridDelete);
                return;
            }
            els = [tmp];
        } else {
            els = this.getCheckedEls(check);
            if(els.length == 0) {
            	swordAlert('' + i18n.gridDelete);
                return;
            }
        }
        //todo 以下代码应该封装起来。
        if(this.options.type == 'tree') { //
            if(popMes) {
                if(!confirm('' + delConfirmTree)) {
                    return;
                }
            }
            //计算选中节点的子节点。  todo 递归可以优化
            //todo 目前支持一个节点的删除
            if(els.length == 1) {
                var cell = this.getRow(els[0]).getElement('[name=' + this.options.treeSignCol + ']');
                els.extend(this.treeGetAllChildCell(cell));
            }

            /*var treeLevel
             els.each(function(el){
             var cell=this.getRow(el).getElement('[name='+this.options.treeSignCol+']');


             }.bind(this))*/
        } else {
            if(popMes) {
                if(!confirm(delConfirm)) {
                    return;
                }
            }
        }


        var deletingRows = [];

        els.each(function(el, index) {
            var deletingRow = this.deleting(el);
            if(deletingRow != null) { //不是新增行，标记成功
                deletingRows[deletingRows.length] = deletingRow;
            }
        }, this);

        if(deletingRows.length == 0) {
            return;
        }
        if(!$chk(tid)) { //没写tid
            var parentEl = null;
            var flag = false;

            if(this.options.type == 'tree') {
                var pcodeEle = this.getRow(tempEls[0]).getElement('div[pcode]');

                if($chk(pcodeEle)) {
                    var pcode = pcodeEle.get("pcode");
                    var len = this.dataDiv().getElements('[pcode=' + pcode + ']').length;
                    parentEl = this.getRow(tempEls[0]).getPrevious();
                    if(len <= 1 && $chk(parentEl)) {
                        flag = true;
                    }

                }

            }
            deletingRows.each(function(row) {
                if(row.get("status")=="insert")this.deleteRow(row);
                this.refreshConsole();
            }, this);
            if(flag) {
                parentEl.getElement("div[name='treeSignDiv']").removeClass("grid_sign_minus").addClass("grid_sign_leaf");
            }
            return;
        }


        var req = this.getReq({
            'tid':tid
            ,'ctrl':ctrl
            ,'widgets':[this.getRowsGirdData(deletingRows)]
        });

        pc.postReq({
            'req':req
            ,'postType':postType
            ,'onSuccess':function(res) {
                //表格树删除唯一一个子节点时，父节点的减号应该消失
                var parentEl = null;
                var flag = false;
                if(this.options.type == 'tree') {
                    var pcodeEle = this.getRow(tempEls[0]).getElement('div[pcode]');

                    if($chk(pcodeEle)) {
                        var pcode = pcodeEle.get("pcode");
                        var len = this.dataDiv().getElements('[pcode=' + pcode + ']').length;
                        parentEl = this.getRow(tempEls[0]).getPrevious();
                        if(len <= 1 && $chk(parentEl)) {
                            flag = true;
                        }

                    }

                }
                deletingRows.each(function(row) {
                    this.deleteRow(row);
                }, this);

                if(flag) {
                    parentEl.getElement("div[name='treeSignDiv']").removeClass("grid_sign_minus").addClass("grid_sign_leaf");
                }
                if(onSuccess) {
//                    this.getFunc(item.get('onSuccess'))[0](req, res);
                    onSuccess(req, res);
                }

            }.bind(this)
            ,'onError':function (res) {
                deletingRows.each(function(row) {
                    row.removeClass('sGrid_data_row_delete_div');
                }, this);

                if(onError) {
                    onError(req, res);
                }
            }.bind(this)
        });


    }
    /**
     * /获得checkbox数据 , 是完整的表格数据；可以进行提交操作；
     * 根据 checkbox或者radio的列名称 获得选中行的数据，或者获得最后点击行的数据；
     * @function {public obj } getCheckedData
     * @see  getCheckedRowData
     * @param {String} checkName checkbox或者radio的列名称，如果没有传入此值，将获得最后点击的行数据
     * @returns obj
     */
    ,getCheckedData:function(checkName) {
        if(!$defined(checkName)) {    //没有传入参数，直接返回最后被单击行的数据
            var els = this.dataDiv().getChildren('div.sGrid_data_row_click_div');
            if(els.length <= 0) {
                //this.alert('没有行被选中！');
                return null;
            }
            var data = this.getRowsGirdData(els);
            return data;
        } else {
            var item = this.getItemElByName(checkName);
            if(this.isCP() && item.get('userClicked') == 'true') {
                if(this.allInCache() || item.get('checkAllFlag') == 'false') {
                    return this.getRowsGirdData(this.getCheckedEls(checkName));
                } else {
                    var trs = new Array();
                    for(var i = 1,m = this.totalPage(); i <= m; i++) {
                        if(this.cachePages.contains(i) || i == this.pageNum())continue;
                        trs.extend(this.getOnePageData(i));
                    }
                    trs.extend(this.getRowsData(this.getCheckedEls(checkName)));

                    return {
                        'sword':this.options.sword,
                        'name' :this.options.name,
                        'beanname':this.options.beanname,
                        'trs' :trs   //数组从0开始
                    };
                }
            } else {
                return this.getRowsGirdData(this.getCheckedEls(checkName));
            }

        }
    }

    //获得选中行
    ,getCheckedRow:function(checkName) {
        if(!$defined(checkName)) {    //没有传入参数，直接返回最后被单击行
            var els = this.dataDiv().getChildren('.sGrid_data_row_click_div');
            if(els.length <= 0) {
                //this.alert('没有行被选中！');
                return null;
            }
            if(els[0].getStyle('display') == 'none') { //如果点击行被隐藏，将返回null
                return null;
            }
            return els[0];
        } else {
            var els = this.getCheckedEls(checkName);
            var rows = [];
            els.each(function(el) {
                rows[rows.length] = this.getRow(el);
            }.bind(this));
            return rows;
        }
    }

    /**
     * 获得选中行的数据；
     * 根据 checkbox或者radio的列名称 获得选中行的数据，或者获得最后点击行的数据；
     * @function {public obj or array} getCheckedRowData
     * @see  getCheckedData
     * @param {String} checkName checkbox或者radio的列名称，如果没有传入此值，将获得最后点击的行数据
     * @returns obj or array   如果是radio或者最后点击行数据，返回obj，可以使用obj.getValue(name)获得数据
     */
    ,getCheckedRowData:function(checkName) {
        if(!$defined(checkName)) {    //没有传入参数，直接返回最后被单击行的数据
            var els = this.dataDiv().getChildren('.sGrid_data_row_click_div');
            if(els.length <= 0) {
                //this.alert('没有行被选中！');
                return null;
            }
            var data = this.getOneRowData(els[0]);
            return data;
        } else {// 返回根据checkbox 或者 radio 获得的多行或单行数据
            return this.getCheckedData(checkName).trs;
        }

    }

    //合并items,为增行所使用  ,将原有item和新增配置的item合并
    ,combineItems:function(insertItem) {

        /*        if($chk(this.insertItems)){ // todo 为了解决当表格被拖拽过读取的配置信息不对的bug去掉了这行。是否有性能问题仍需要验证  只执行一次算法，其余都从缓存中获得
         return this.insertItems;
         }*/
        this.insertItems = [];//增行用的items数组，格式是trs中的一条tr
        this.insertNewTpyes = [];//增行用的items数组中，是新配置类型的描述对象数组 {name,new,src}
        this.insertNewRules = [];//增行用的items数组中，是新配置校验规则的描述对象数组 {name,new,src}

        this.items().each(function(oldItem) {
            var name = oldItem.get('name');
            var newItem = insertItem.getChildren('>div[name=' + name + ']')[0];

            var resItem = oldItem.clone();
            if(newItem) {
                if(newItem.get('type') && newItem.get('type') != oldItem.get('type')) {//增行配置了类型且与原有配置不同
                    resItem.set('type', newItem.get('type'));
                }
                if(newItem.get('rule') && newItem.get('rule') != oldItem.get('rule')) {//增行配置了校验规则且与原有配置不同
                    resItem.set('rule', newItem.get('rule'));
                }
                if(newItem.get('disable') && newItem.get('disable') != oldItem.get('disable')) {//增行配置了disable且与原有配置不同
                    resItem.set('disable', newItem.get('disable'));
                }
            }


            if(oldItem.get('act') && oldItem.get('type') == 'a') {
                resItem.set('act', '');
            }


            this.insertItems[this.insertItems.length] = resItem;

        }, this);

        return  this.insertItems;
    }


    //根据增行的默认配置项目，构建数据项 ，是一行的数据
    ,getDataObjByInsertItem:function(insertItem) {
        var tds = {};

        insertItem.getChildren('>div').each(function(newItem) {
            var value = newItem.getAttribute('value');//todo get('value') 取值取不出来
            if(value) {
                tds[newItem.get('name')] = {'value':value};
            }
        });

        var result = {'tds':tds};
        return result;
    }


    //获得重建按钮，如果没有，返回null
    ,getRebuildButton:function() {
        return this.console().getElement('.sGrid_console_item_button_rebuild');
    }

    //去掉重建表格按钮
    ,removeRebuildButton:function() {
        var el = this.getRebuildButton();
        if(el) {
            el.destroy();
//            this.tooltips.hide();
        }
    }

    //创建重建表格按钮   ,一般情况：新增行保存成功和删除成功和改变了页面结构
    ,createRebuildButton:function() {
        return;
        if(this.options.fenye == 'false') { //当不使用分页功能的时候，将不创建rebuild按钮
            return;
        }
        if(this.getRebuildButton()) {
            return;
        }
        var rebulidButton = new Element('button', {
            'class': 'sGrid_console_item_button_rebuild'
            ,'html':'重建此页'
            ,'events': {
                'click': function() {
                    this.loadPage(this.pageNum());
                }.bind(this)
            }
        }).inject(this.console());

        if(!window.tooltips) {
        	window.tooltips = pageContainer.create('SwordToolTips');
        	this.celltooltips = window.tooltips;
        }
//        var targetId = "rebulidMesDiv";
//        if(!this.tooltips.get(targetId)) {
//            this.tooltips.createTip({
//                divId : targetId,
////                className : 'tooltips_mesType_top',
//                message : ''
//            });
//
//            this.tooltips.tips.get(targetId).addEvent("mouseover", function(e) {
//                var flag = 'right';
//                if(e.target.flag == 'right') {
//                    flag = 'top';
//                }
////                var className = 'tooltips_mesType_' + flag;
////				this.tooltips.show(targetId, e.target.el,{'flag':flag,'className':className});
//                this.tooltips.show(targetId, e.target.el, {'flag':flag});
//            }.bind(this));
//        }
//        this.tooltips.fillText(targetId, "表格的数据结构已经被改变（发生了增行或者删行），点击此按钮重建本页结构！");
//        this.tooltips.show(targetId, rebulidButton, {'flag':'top','autoHidden':false});

    }




    ,loadPage:function(targetPage) {
        //首先执行数据有效性校验
        if(targetPage <= 0 || targetPage > this.totalPage()) {
            this.alert('' + i18n.gridTarNotExist1 + targetPage + i18n.gridTarNotExist2);
            return;
        }

        this.options.lastPageNum = this.options.pageNum;
        this.options.pageNum = targetPage;
        this.delayBuildData();
        this.getDataDivFxScroll().toTop();
        this.header().setStyle('top', 0);
        this.refreshConsole();

    }


    //重建表头，先删除原有表头结点，然后重新创建节点
    ,rebuildHeader:function() {
        //清理被拖拽过的表头。。
        this.header().getChildren().each(function(value) {
            value.destroy();
        });
        //重新构建表头
        this.buildHeadr();

    }
    //TODO ----------------------------------------------------
    ,getHj:function(name) {
        var c = 0;
        var accAdd=function (arg1,arg2){
            var r1,r2,m;
            try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
            try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
            m=Math.pow(10,Math.max(r1,r2));
            return (arg1*m+arg2*m)/m;
        }
        var el = this.dataDiv().getElement("div[name='" + name + "']");
        if($chk(!el))return 0;
        var hjrow = this.hjRow.getElement("div[name='" + name + "']");
        var hjCheck = hjrow?hjrow.get("hjCheck"):null;
        var hjAttrStr=el.get("hjShowValue")?"showvalue":"realvalue";
        if(!hjCheck){
         var items = this.dataDiv().getElements("div[name='" + name + "']");
         items.each(function(item) {
            	var par = item.getParent("div.sGrid_data_row_div[status!='delete']");
            	if(par){
            		var value = item.get(hjAttrStr);
            			if($chk(value) && value.contains(",")){
            				value = value.replace(/,/g,"");
            	        }
    	            var n = isNaN(parseFloat(item.get("html"))) ? 0 : parseFloat(value || item.get("html"));
                    c=accAdd(c,n);
    	            //c += n;
            	}
            });
       	 this.data().each(function(rd, i) {//todo 过滤数据的代码可以进行优化
                if(!this._inCache(i)) {
                   var cellDs = rd['tds'][name];
                   if(cellDs == undefined) {
                       rd['tds'][name] = {}; //新建一个对象
                       cellDs = rd['tds'][name];
                   }
                   var vellV = cellDs['value'];
                   if(!$chk(vellV))vellV = new String(0);
                   if(vellV.contains(",")){
                   	vellV = vellV.replace(/,/g,"");
       	        }
                   c=accAdd(c,vellV);
                }
            } .bind(this));
       }else {
    	   var items = this.getCheckedRow(hjCheck);
           items.each(function(item) {
           		item = item.getCell(name);
           	var par = item.getParent("div.sGrid_data_row_div[status!='delete']");
           	if(par){
           		var value = item.get(hjAttrStr);
           			if($chk(value) && value.contains(",")){
           				value = value.replace(/,/g,"");
           	        }
   	            var n = isNaN(parseFloat(item.get("html"))) ? 0 : parseFloat(value || item.get("html"));
                   c=accAdd(c,n);
   	            //c += n;
           	}
           });
           var els = this.items();
           var allclick = false;
           for(var index =0;index<els.length;index++){
        	   var el = els[index];
        	   if(el.get("userClicked")=='true'&&el.get("checkAllFlag")=='true'){
         		 	allclick = true;
         		 	break;
      		}
           }
           if(this.cache() && allclick){
        	   this.data().each(function(rd, i) {//todo 过滤数据的代码可以进行优化
                   if(!this._inCache(i)) {
                      var cellDs = rd['tds'][name];
                      if(cellDs == undefined) {
                          rd['tds'][name] = {}; //新建一个对象
                          cellDs = rd['tds'][name];
                      }
                      var vellV = cellDs['value'];
                      if(!$chk(vellV))vellV = new String(0);
                      if(vellV.contains(",")){
                      	vellV = vellV.replace(/,/g,"");
          	        }
                      c=accAdd(c,vellV);
                   }
               } .bind(this));
           }
       }
        return c.toFixed(2); 
    }
    ,getNoDeleteCells:function(cellName){
    	var cellArray=[];
    	this.dataDiv().getElements("div[name='" + cellName + "']").each(function(item) {
        	if(item.getParent("div.sGrid_data_row_div[status!='delete']")){
        		cellArray.include(item);
        	}
        });
    	return cellArray;
    }
    // 按照表格的状态，更新控制台的当前页数和总页数和数据总数
    ,refreshConsole:function() {
        if(this.hjRow) {
        	var funca=function(){
        		this.scrollHjRow();
	        	this.rereshHjRowData();
        	};funca.delay(500,this);
        	//此处是为解决ie8下,后台addTableMap数据合计行定位错乱bug所写的匿名函数延迟
        }
        //TODO ----------------------------------------------------
        var totalRows = this.totalRows() / 1; //行总数
        if(totalRows == 0){
        	this.items().each(function(el){
        		if(el.get("userClicked")=='true'&&el.get("checkAllFlag")=='true'){
           		 	 var cb = this.getHeaderCheckboxByName(el.get('name'));
	        		 if($chk(cb)){
		           		 cb.set("checked",false);
		    			 el.set('userClicked', 'false');//客户点击过
		            	 el.set('checkAllFlag', 'false');//客户点击全选按钮的最后状态
	        		 }
        		}
        	 }.bind(this));
        }
        var pageNum = this.pageNum();//当前页数
        var totalPage = this.totalPage();//总页数

        this.consoleTotalRows().set('html', (this.options.treeRootNum == 'true' && this.options.type == 'tree') ? this.dataDiv().getElements('div.sGrid_data_row_item_div[treelevel=1]').length : totalRows);

        if(this.options.fenye != 'false') {   //有分页功能
            if(totalRows <= 0) {
            	pageNum = 1;
            	totalPage = 1;
            }
            if(this.consolePage().get('tag') == 'input') {
                this.consolePage().set('value', pageNum);
            } else {
                this.consolePage().set('html', pageNum);
            }

            this.consoleTotalPage().set('html', totalPage);
            this.consoleRows().set('html', this.rows());
            this.removeRebuildButton();
        }

        if(this.options.fenye == 'false')return;
        if(totalRows <= 0 || totalPage == 1) {//没有数据 或者 仅有一页
            this.disableConsoleBtn(this.consoleButton_first, true)
            this.disableConsoleBtn(this.consoleButton_prev, true)
            this.disableConsoleBtn(this.consoleButton_next, true)
            this.disableConsoleBtn(this.consoleButton_last, true)
        } else {

            if(pageNum == 1) {  //首页
                this.disableConsoleBtn(this.consoleButton_first, true)
                this.disableConsoleBtn(this.consoleButton_prev, true)
                this.disableConsoleBtn(this.consoleButton_next, false)
                this.disableConsoleBtn(this.consoleButton_last, false)

            } else if(pageNum == totalPage) {//末页
                this.disableConsoleBtn(this.consoleButton_first, false)
                this.disableConsoleBtn(this.consoleButton_prev, false)
                this.disableConsoleBtn(this.consoleButton_next, true)
                this.disableConsoleBtn(this.consoleButton_last, true)
            } else {  //中间任何一页
                this.disableConsoleBtn(this.consoleButton_first, false)
                this.disableConsoleBtn(this.consoleButton_prev, false)
                this.disableConsoleBtn(this.consoleButton_next, false)
                this.disableConsoleBtn(this.consoleButton_last, false)
            }

        }

        this.consoleButton_first.removeClass('sGrid_console_item_button_hover');
        this.consoleButton_prev.removeClass('sGrid_console_item_button_hover');
        this.consoleButton_next.removeClass('sGrid_console_item_button_hover');
        this.consoleButton_last.removeClass('sGrid_console_item_button_hover');

    }
    ,disableConsoleBtn:function(el, status) {
        el.set('disabled', status);
        if(status) {
            el.addClass('sGrid_console_item_button_disabled');
        } else {
            el.removeClass('sGrid_console_item_button_disabled');
        }
    }

    //为 item 设置宽度     itemEl=页面定义item的html节点 (可能含有width属性)， itemDiv = 被赋予宽度的html节点
    ,setItemX:function(itemEl, itemDiv) {
        itemDiv.setStyle("width", this.getItemX(itemEl));
    }

    ,getItemX:function(itemEl) {
        var itemX = itemEl.get('x');  //获得用户自定宽度
        if(!$chk(itemX)) {  //如果没有自定义，使用默认宽度
            itemX = this.itemX();
        }
        itemX = '' + itemX;

        if(!(itemX.contains('%') || itemX.contains('px'))) {//数字
            itemX += 'px';
        }
        return itemX;
    }

    ,doMask:function() {
        this.getMask().mask(this.sGrid_div());
    }
    ,doUnmask:function() {
        this.getMask().unmask();
    }

    ,delayBuildData:function(data) {
        this.doMask();
//        this.buildData.delay(10,this,[data]);
        this.buildData(data); //去掉了延时
    }
    //页面缓存cache+前台分页page
    ,isCP:function() {
        return (this.cache() && this.isPage());
    }

    //根据当前表格状态，构建数据区域的数据,首先会执行数据区域清除操作
    ,buildData:function(data) {
        this.clearData();
        if(!this.cachePages.contains(this.pageNum()))this.cachePages.include(this.pageNum());
        if(this.dataInCache()) {
            //清除表头checkbox状态
            if(!(this.isCP()))this.getHeaderCheckboxs_checked().set('checked', false);
            this.dataDiv().getChildren('div[pageNum=' + this.pageNum() + ']').setStyle('display', '').set('cache', 'false');
            this.buildXY();
            this.doUnmask();
        } else if(this.isPage()) {    //前台分页
            this.onePageData(this.buildData2.bind(this));//前台分页直接计算并且装载数据
        } else if($chk(data)) {   //当表格是后台分页的情况，如果有传入data，直接装载此data，被initData使用
            this.buildData2(data);
        } else {
            this.onePageData(this.buildData2.bind(this));//按照当前表格的状态去后台取数据，支持异步提交
        }

    }

    ,dataInCache:function() {//数据是否在缓存中
        if(!this.cache())return false;
        if(this.dataDiv().getChildren('div[pageNum=' + this.pageNum() + ']').length > 0)return true;

        return false;
    }

    //level 从本层开始计算，要展开层数
    ,getSignType:function(extendLayer, it) {
        var signType;
        if(extendLayer > 0 || extendLayer == 'all') { //本层是展开的
            if(it.hasChildNodes()) { //有孩子结点
                signType = 'minus';
            } else {
                signType = 'leaf';
            }
        } else {
            if(it.hasChildNodes()) { //有孩子结点
                signType = 'plus';
            } else {
                signType = 'leaf';
            }
        }
        return signType;
    }

    /**
     * 创建row下面的所有tree节点，到deep层
     * 创建parentRow下面deep层节点
     */
    ,createTree:function(nodeIt, deep, parentRow) {
        var nextDeep = null;

        if(deep == 'all') {
            if(nodeIt.getChildNodes().length == 0) {
                return;
            }
            nextDeep = 'all';
        } else {
            if(deep == 0)return;
            nextDeep = deep - 1;
        }

        var cell = parentRow.getElement('[name=treeSignDiv]').getParent();
        var thisTreeLevel = cell.get('treeLevel') / 1 + 1;
        cell.set('childNodesCreated', true);  //标记为子节点已被创建，

        nodeIt.getChildNodes().eachFromLast(function(it, dataIndex) {
            var signType = this.getSignType(nextDeep, it);
            var dataObj = it.node;
            var row = this.createTreeRow(dataObj, dataObj['rownum'], it, thisTreeLevel, signType);
            row.inject(parentRow, 'after');
            this.createTree(it, nextDeep, row);
        }.bind(this));

    }
    /**
     *
     * @param dataObj
     * @param dataIndex
     * @param nodeIt
     * @param treeLevel    本层的层次
     * @param signType     本层的节点类型：plus minus leaf
     */
    ,createTreeRow:function(dataObj, dataIndex, nodeIt, treeLevel, signType, status, items) {
        /*if(!$defined(items)){
         items=this.items();
         }*/
        if(!$defined(items)) {  //由缓存来获得items，以提高性能
            if(!this.treeItems) {
                this.treeItems = this.items();
            }
            items = this.treeItems;
        }
        var row = this.createRow(dataIndex + 1, dataObj, items, status);
//        row.set('treeLevel',treeLevel);
        var firstCell;
        if(this.options.treeSignCol) {
            firstCell = row.getElement('[name=' + this.options.treeSignCol + ']');
        } else {
            firstCell = row.getFirst();
        }
        firstCell.set('treeLevel', treeLevel);
        firstCell.set('signType', signType);
        firstCell.store('nodeIt', nodeIt);
        firstCell.set('pcode', dataObj['tds'][this.options.treePcode]['value']);
        firstCell.set('code', dataObj['tds'][this.options.treeCode]['value']);
        this.treeCell(firstCell);
        if(status == 'insert') {
            row.addClass('sGrid_data_row_insert_div');
        }
        return row;
    }

    //添加树形点击标记
    ,treeCell:function(cell) {
        var treeLevel = cell.get('treeLevel') / 1;
        var it = cell.retrieve('nodeIt');
        var signType = cell.get('signType');

        var signEl = new Element('div', {
            'class':'grid_sign_' + signType
            ,'name':'treeSignDiv'
            ,'events': {
                'click': function(e) {
                    this.treeClick(cell, e);
                    this.scrollHeader();
                }.bind(this)
            }
        });

        cell.grab(signEl, 'top');
        cell.addClass('grid_sign_cell');

        for(var i = 1; i < treeLevel; i++) { //占位
            cell.grab(new Element('div', {
                'class':'grid_sign_white'
            }), 'top');
        }

    }
    //点击节点的模拟事件
    ,treeClick:function(cell, e) {

        if($defined(e)) {
//            e.stop();    //todo 没有终止事件
        }
        var signChange = cell.get('signType');
        if(signChange == 'leaf') { //如果点击的是叶子节点直接返回
            return;
        }

        var signEl = cell.getElement('[name=treeSignDiv]');
        var it = cell.retrieve('nodeIt');
        var treeLevel = cell.get('treeLevel') / 1;


        var childNodesCreated = cell.get('childNodesCreated');
        if(childNodesCreated != 'true') {//子节点没有被创建，可能是叶子节点
            if($defined(it) && !it.hasChildNodes()) {//是叶子节点，直接返回
                return;
            }
        }

        signEl.removeClass('grid_sign_' + signChange);
        if(signChange == 'plus') {
            signChange = 'minus';
        } else {
            signChange = 'plus'
        }
        signEl.addClass('grid_sign_' + signChange);
        cell.set('signType', signChange);

        if(signChange == 'minus') {//展开
            if(childNodesCreated != 'true') { //展开 -- 创建
                it.getChildNodes().eachFromLast(function(theIt, dataIndex) {
                    var dataObj = theIt.node;
                    var row = this.createTreeRow(dataObj, dataObj['rownum'], theIt,
                            treeLevel + 1,
                            this.getSignType(0, theIt));

                    row.inject(this.getRow(cell), 'after');

                    if(this.options.treeEffect == 'true') {//启用树的效果
                        var treeRealHeight = row.getHeight();
                        row.setStyle('opacity', 0);
                        row.set('treeRealHeight', treeRealHeight);
                        row.setStyle('height', 0);

                        var myfx2 = new Fx.Tween(row, {   //todo 需要优化fx对象的个数
                            'onComplete':function() {
                                row.tween('opacity', 1);
                            }
                        });
                        myfx2.start('height', treeRealHeight);
                    }

                }.bind(this));
                cell.set('childNodesCreated', true); //标记为子节点已被创建
            } else { //展开 -- 不用创建
                this.treeOpen(cell);
            }

        } else {//关闭
            //alert(cell.getPosition().y);
            this.treeClose(cell);
        }


        this.buildXY();
    }

    //关闭cell以下的节点。
    ,treeClose:function(cell) {
        var code = cell.get('code');
        this.dataDiv().getElements('[pcode=' + code + ']').each(function(el) {
            if(this.options.treeEffect == 'true') {//启用树的效果
                var row = this.getRow(el);
                var myFx = new Fx.Tween(row, {//todo 需要优化fx对象的个数
                    'onComplete':function() {
                        //row.setStyle('display', 'none');
                        row.set('treeRealHeight', row.getHeight());
                        var myfx2 = new Fx.Tween(row, {
                            'onComplete':function() {
                                row.setStyle('display', 'none');
                            }
                        });
                        myfx2.start('height', 0);
                    }
                });
                myFx.start('opacity', 0);
            } else {
                if(Browser.Engine.trident4) {//ie6
                    this.getRow(el).addClass("ieRemoveTreeBorder").getChildren().setStyles({
                        'display':'none'
                    });
                } else {
                    this.getRow(el).setStyle('display', 'none');
                }
            }

            if(el.get('signType') == 'minus') {//如果是打开状态 cell 也要关闭他的子节点
                this.treeClose(el);
            }

        }.bind(this))
    }

    //打开cell以下的节点。
    ,treeOpen:function(cell) {
        var code = cell.get('code');
        this.dataDiv().getElements('[pcode=' + code + ']').each(function(el) {

            if(this.options.treeEffect == 'true') {//启用树的效果
                var row = this.getRow(el);
                row.setStyle('display', '');
                var myfx2 = new Fx.Tween(row, { //todo 需要优化fx对象的个数
                    'onComplete':function() {
                        row.tween('opacity', 1);
                    }
                });
                myfx2.start('height', row.get('treeRealHeight'));
            } else {
//                this.getRow(el).setStyle('display', '');
                if(Browser.Engine.trident4) {//ie6
                    this.getRow(el).removeClass("ieRemoveTreeBorder").getChildren().setStyles({
                        'display':''
                    });
                } else {
                    this.getRow(el).setStyle('display', '');
                }
            }

            if(el.get('signType') == 'minus') {//如果是打开状态 cell 也要打开他的子节点
                this.treeOpen(el);
            }
        }.bind(this))
    }

    //获得某一个cell下面的所有子cell
    ,treeGetAllChildCell:function(cell) {
        this.treeClick(cell);       //展开没展开的子节点 todo 这样做性能会有问题
        var result = [];
        var code = cell.get('code');
        var tmp = this.dataDiv().getElements('[pcode=' + code + ']');
        result.extend(tmp);
        tmp.each(function(el) {
            result.extend(this.treeGetAllChildCell(el));
        }.bind(this))
        return result;
    }

    ,buildData2:function(data) {   //真正的装载表格的方法
        //清除表头checkbox状态
        if(!this.isCP()) {
            this.getHeaderCheckboxs_checked().set({'checked':false,'userClicked':'false','checkAllFlag':'false'});
            this.options.pNode.getChildren(">div:not([console])[name][type='checkbox']").set({'checked':false,'userClicked':'false','checkAllFlag':'false'});
        }
        //排序表头的样式设置 开始
//        if(this.isServer()){//当前只支持后台分页的后台排序
        if(true) {
        	var ss = this.getSwordSort();
            if($chk(ss.options.sortName)) {//当表格是排序状态的时候
                //clear sort info
                this.header().getChildren('div[issort=true]').each(function(el) {//todo 不知道为什么使用sort查不到,关键字？？
//                    el.getElements('.sGrid_header_text_div').set('text', this.orginSortText);
                    el.set('issort', 'false');

                    el.getElement('.sGrid_header_text_div').removeClass('sGrid_header_text_div_asc');
                    el.getElement('.sGrid_header_text_div').removeClass('sGrid_header_text_div_desc');
                }, this);
                //clear end

                //处理本次排序的表头状态 开始
                var sortImg = ss.options.sortFlag == 'asc' ? '↑' : '↓';
                this.header().getChildren('div[_for=' + ss.options.sortName + ']').each(function(el) {
//                    var text=el.getElement('.sGrid_header_text_div').get('text');
//                    this.orginSortText=text; //记录排序前原有显示信息
//                    el.getElements('.sGrid_header_text_div').set('text',text+' '+sortImg);
                    el.set('issort', 'true');

                    el.getElement('.sGrid_header_text_div').addClass('sGrid_header_text_div_' + ss.options.sortFlag);
                }, this);
                //处理本次排序的表头状态 结束

            }
        }
        //排序表头的样式设置 结束

        if(!$chk(data)) {
            this.doUnmask();
            return;
        }

        if(this.options.type == 'tree') {//创建树形菜单

            //把data里面加入 rownum 标示，可以与row 的 rownum 关联
            //此属性只作为关联，没有其他含义（顺序，总数等）
            //todo 目前只有tree使用，普通表格也要重构成这个结构。
            data.each(function(d, index) {
                d['rownum'] = index;
            }.bind(this));


            this.treeIt = SwordGrid.Iterator.newInstance
                    (data, 'jsonAptitude', {id:this.options.treeCode,pid:this.options.treePcode});

            this.treeIt.getRootNodes().eachFromLast(function(it, dataIndex) { //遍历trs节点 todo 遍历树形。。
                var extendLayer = this.options.extendLayer == 'all' ? 'all' : this.options.extendLayer / 1;//从本层开始计算，要展开层数
                var signType = this.getSignType(extendLayer, it);
                var dataObj = it.node;
                var row = this.createTreeRow(dataObj, dataObj['rownum'], it, 1, signType);
                row.inject(this.dataDiv());
                this.createTree(it, extendLayer, row); //启动递归创建树
            }, this);


        } else {
            this.createRowItems = this.items();
            var rows = this._getRender().render(data, this.createRowItems);
 			this.dataDiv().appendChild(rows);

        }
        if(this.options.highQuality != 'true') {
            this.lastBuildData();
        }

    } ,_getRender:function(){
    	if(!this.render){
    		this.render=new SwordGridRender({'gridObj':this});
    	}
    	return this.render;
    },_addRowNum:function(cell,rowIndex,deletedRows){
    	if(cell.get('type')=='rowNum'){
    		cell.set('text',this.rows() * (this.pageNum() - 1)+(rowIndex-deletedRows));
    	}else if(cell.get('type')=='rowNumOnePage'){
    		cell.set('text',rowIndex-deletedRows);
    	}
    	
    }
    ,treeChildrenNodeData:function(pcode) {
        if(this.options.type == 'tree') {
            var rowDatas = this.getCurPageGridData().trs;
            var cnd = [];
            for(var i = 0; i < rowDatas.length; i++) {
                var tds = rowDatas[i].tds;
                if(tds[this.options.treePcode].value == pcode) {
                    cnd.include(tds);
                }
            }
            return cnd;
        }
    }
    
    ,treeChildrenNodeStatusData:function(pcode) {
        if(this.options.type == 'tree') {
            var rowDatas = this.getCurPageGridData().trs;
            var trs = new Array();
            for(var i = 0; i < rowDatas.length; i++) {
                var tds = rowDatas[i].tds;
                if(tds[this.options.treePcode].value == pcode) {
                    trs.push(rowDatas[i]);
                }
            }
            return trs;
        }
    }


    ,lastBuildData:function() {
        this.buildXY();
        this.header().setStyle('top', '0px');
//        this.getDataDivFxScroll().toTop();
        this.fireEvent('onAfterInitData');

        this.doUnmask();    //结束的是 ： delayBuildData 中的 mask方法
    }

    ,delayCreateRow:function(i, dataIndex, datas) {
        var row = this.createRow(dataIndex + 1, datas[dataIndex], this.createRowItems);
        row.inject(this.dataDiv());
        i--;
        dataIndex++;
        if(i > 0) {
            this.delayCreateRow.delay(1, this, [i,dataIndex,datas]);
        } else {
            this.lastBuildData();
        }
    }

    //add get value
    ,addGV:function(rd) {
        if(rd.getValue == undefined) {
            rd.getValue = function(name) {
                var tmp = this.tds[name];
                if(!$defined(tmp)) {
                    return null;
                }
                return tmp['value'];
            }
        }
    }

    ,addCellApi:function(cell, itemEl, type) {
        cell.setSuitableValue = function(value, realvalue) {//设置合适的值的方法 ，同时更新 realData
            if(!['checkbox','radio','userdefine','file2'].contains(cell.get('type'))) {  //处理非文本类型
                this.setText(cell, value, realvalue);
                if(!cell.get("dateControl")||value!="")cell.set('title', value);
                if(cell.get('type') == 'password')cell.set('title', this.dealPassword(value));
            }
        }.bind(this);

    },
    dealPassword:function(value) {//先搞70个
        return "●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●".substring(0, value.length);
    }
    ,dealItem:function(itemEl, dataObj, sGrid_data_row_div, rowNum) {
        var name = itemEl.get('name');	
        //getValue有时是个空方法？？
        //var html=dataObj.getValue(name);
        var html = dataObj.tds[name];
        if(html)html = html['value'];
        var type = itemEl.get('type');

        var cell = itemEl.clone(false).inject(sGrid_data_row_div);

        if(type == 'userdefine') {
            cell.setStyle('display', '');
        }

//        itemEl.pNode = cell;
        this.createCellEl(itemEl, html, rowNum, dataObj, cell);//el 与 sGrid_data_row_item_div 是同一个对象。.当div里没有元素的时候
        if(cell.get('disable') == 'true') {
            this.cellDisable(cell);
        }

        if(cell.get('buttonEl') == 'true') { //注册按钮类型
            cell.hoverClass('sGrid_data_row_itemdiv_button_hover');
        }

        this.addCellApi(cell, itemEl, type);

        /* if (!['checkbox','radio','userdefine'].contains(type)) {  //处理非文本类型
         cell.set('title', cell.get('text'));
         }*/

        if(itemEl.get('show') == 'false'||itemEl.get('x') ==0) {//隐藏列
            if(Browser.Engine.trident4) {   //ie6
                cell.setStyle('width', 0).setStyle('border', '0px').setStyle('height', 0);
            } else {
                cell.setStyle('display', 'none');
            }
        }

        this.fireEvent("onAfterCreateCell", [dataObj,html,cell,itemEl]);      //本行的数据，cell元素，此cell的描述div

        //创建一个cell 结束
    }


    ,addRowApi:function(sGrid_data_row_div) {
        //注册根据名字获得cell div 的方法
        sGrid_data_row_div.getCell = function(name) {
            return this.getFirst('div.sGrid_data_row_item_div[name=' + name + ']');
        }

        sGrid_data_row_div.update = function(data) {//使用行来更新数据
            this.updateRow(sGrid_data_row_div, data);
        }.bind(this);

        //根据名字是button类型失效，有效
        sGrid_data_row_div.disable = function(name) {
            this.cellDisable(sGrid_data_row_div.getCell(name));
        }.bind(this);
        sGrid_data_row_div.enable = function(name) {
            this.cellEnable(sGrid_data_row_div.getCell(name));
        }.bind(this);
    }

    ,rowM_dan:new Element('div', {
        'class': 'sGrid_data_row_div sGrid_data_row_div_dan'
        ,'row' :true
    })

    ,rowM_shuang:new Element('div', {
        'class': 'sGrid_data_row_div sGrid_data_row_div_shuang'
        ,'row' :true
    })
    ,rowM_tree:new Element('div', {
        'class': 'sGrid_data_row_div'
        ,'row' :true
    })

    ,createBaseRow:function(rowNum) {
        //创建一个行div容器
        var sGrid_data_row_div;

        if(this.options.type != 'tree') {//树形表格将不使用此逻辑
            if(rowNum % 2 == 0) { //偶数行
                sGrid_data_row_div = this.rowM_shuang.clone(false);
            } else {//奇数行 singular
                sGrid_data_row_div = this.rowM_dan.clone(false);
            }
        } else { //tree
            sGrid_data_row_div = this.rowM_tree.clone(false);
        }
        if(this.options.wordBreak == 'true') {
        	if(Browser.Engine.trident4){
        		sGrid_data_row_div.setStyle('height', '100%');
        	}else{
        		sGrid_data_row_div.setStyle('height', 'auto');
        	}
        }
        sGrid_data_row_div.set('rowNum', rowNum);
        sGrid_data_row_div.set('pageNum', this.pageNum());
        sGrid_data_row_div.hoverClass('sGrid_data_row_div_hover');

        return sGrid_data_row_div;
    }

    ,createRow:function(rowNum, dataObj, items, status, row) {
    	 if(!row) row=this._getRender().renderRow(dataObj, items,status);
         return row;

    }

    ,cellEnable:function(cell) {
        if(!cell)return;
        cell.set('disable', 'false');
        if(cell.get('type') == 'checkbox')cell.getElement('input[type=checkbox]').set('disabled', false);
        if(cell.get('type') == 'a')cell.removeClass("sGrid_data_row_item_label").addClass("sGrid_data_row_item_a");
        if(cell.get('buttonEl') == 'true') {
            cell.removeClass('sGrid_data_row_itemdiv_button_disabled');
        } else {
            cell.removeClass('sGrid_data_row_itemdiv_disabled');
        }
    }

    ,cellDisable:function(cell) {
        if(!cell)return;
        cell.set('disable', 'true');
        if(cell.get('type') == 'checkbox')cell.getElement('input[type=checkbox]').set('disabled', true);
        if(cell.get('type') == 'a')cell.removeClass("sGrid_data_row_item_a").addClass("sGrid_data_row_item_label");
        if(cell.get('buttonEl') == 'true') {
            cell.addClass('sGrid_data_row_itemdiv_button_disabled')
        } else {
            cell.addClass('sGrid_data_row_itemdiv_disabled');
        }
    }

    ,$data:function(name, rownum) {
        if(this.options.data[rownum - 1] == null)return;
        var value = this.options.data[rownum - 1]['tds'][name]['value'];
        return value;
    }



    ,dealCellAct:function(type, html, itemEl, el, act, tid, ctrl, page, showRow) {
        if(type == 'a') {
            el.set('html', html);
            el.addClass('sGrid_data_row_item_a');
        } else {  //默认为 button ，button的时候使用caption为显示值
            el.set('html', itemEl.get('caption'));
            el.addClass('sGrid_data_row_itemdiv_button');
        }


        if(act == 'delete') {//注册删除的单击事件
            //代码执行到这里el肯定不为null
            var popMes = itemEl.get('popMes') != 'false';//是否自动弹出提示信息，默认为自动弹出
            var delConfirm = itemEl.get('delConfirm') || ('' + i18n.gridDelConfirm);

            el.addEvent('click', function() {

                if(el.get('disable') == 'true')return;
                if(popMes) {
                    if(!confirm(delConfirm))return;
                }

                var deletingRow = this.deleting(el);//标记删除
                if(deletingRow == null)return; //是增行直接删除

                //发送请求数据
                var req = this.getReq({
                    'tid':tid
                    ,'ctrl':ctrl
                    ,'widgets':[this.getOneRowGirdData(deletingRow)]
                });

                pc.postReq({
                    'req':req
                    ,'postType':itemEl.get('postType')
                    ,'onSuccess':function(res) {
                        this.deleteRow(deletingRow);

                        if(itemEl.get('onSuccess')) {
                            this.getFunc(itemEl.get('onSuccess'))[0](req, res);
                        }
                    }.bind(this)
                    ,'onError':function (res) {
                        deletingRow.removeClass('sGrid_data_row_delete_div');

                        if(itemEl.get('onError')) {
                            this.getFunc(itemEl.get('onError'))[0](req, res);
                        }
                    }.bind(this)
                });

                //发送请求数据 end

            }.bind(this));
        } else if(act == 'deleting') {
            var deleteCaption = el.get('text');
            var cancel = itemEl.get('cancel') || '' + i18n.cancel;

            el.set('deleteCaption', deleteCaption);
            el.set('cancelCaption', cancel);

            //代码执行到这里el肯定不为null
            el.addEvent('click', function() {

                if(el.get('disable') == 'true')return;

                var row = this.getRow(el);
                //                                   row.toggleClass('sGrid_data_row_delete_div');

                //取消的操作
                if(row.get('status') == 'delete') {
                    el.set('text', el.get('deleteCaption'));
                    row.set('status', '');
                    row.removeClass('sGrid_data_row_delete_div');
                    return;
                }

                //以下为标记删除操作-----
                if(row.get('status') != 'insert') {
                    el.set('text', el.get('cancelCaption'));
                } else {//是新增的行的时候直接执行删除操作
                    if(!confirm('' + i18n.gridInsertRowDel)) {
                        //                                          row.removeClass('sGrid_data_row_delete_div');
                        return;
                    }
                }
                this.deleting(el);

            }.bind(this));

        } else if(tid || ctrl) { //访问后台
            //代码执行到这里el肯定不为null
            el.addEvent('click', function() {

                if(el.get('disable') == 'true')return;

                var row = el.getParent('.sGrid_data_row_div');
                if(row.get('status') == 'insert') {//是新增的行的时候 不能执行此操作
                	swordAlert('' + i18n.gridSaveAlert);
                    return;
                }

                var req = this.getReq({
                    'tid':tid
                    ,'ctrl':ctrl
                    ,'widgets':[this.getOneRowGirdData(el)]
                });

                pc.postReq({
                    'req':req
                    ,'postType':itemEl.get('postType')
                    ,'onSuccess':function(res) {
                        if(itemEl.get('onSuccess')) {
                            this.getFunc(itemEl.get('onSuccess'))[0](req, res);
                        }
                    }.bind(this)
                    ,'onError': function(res) {
                        if(itemEl.get('onError')) {
                            this.getFunc(itemEl.get('onError'))[0](req, res);
                        }
                    }.bind(this)
                });

            }.bind(this));

        } else if(page) { //直接页面间跳转        //todo 当前只支持 tid  和 page 属性 互斥的情况
            el.addEvent('click', function() {

                if(el.get('disable') == 'true')return;

                var row = el.getParent('.sGrid_data_row_div');
                if(row.get('status') == 'insert') {//是新增的行的时候 不能执行此操作
                	swordAlert('' + i18n.gridSaveAlert);
                    return;
                }

                if(!showRow) {
                    throw new Error('gird[' + this.options.name + ']:使用表格一行数组直接页面间跳转到form页面展现时候，必须设置有效的showRow属性，具体请参阅用户手册！');
                }

                var formData = this.getOneRowFormData(el, showRow);
                pc.redirect.setData(formData);
                pc.redirect.go(page);

            }.bind(this));
        }


    }
    
    ,isVal:function() {
        return false;
    }

    ,createCellEl:function(itemEl, html, rowNum, dataObj, cell) {
        var type = itemEl.get('type');
        var act = itemEl.get('act');
        var tid = itemEl.get('tid');
        var ctrl = itemEl.get('ctrl');
        var page = itemEl.get('page');
        var elName = itemEl.get('name');
        var showRow = itemEl.get('showRow');
        var msg = itemEl.get('msg');
//            var rule=itemEl.get('rule');
        var el = cell;
        if($chk(msg)) el.set('msg', msg);//自定义校验的提示信息

        //类型的处理，并生成html item 节点
        if(['edit','detail','delete','deleting'].contains(act)) {  //处理行操作事件

            this.dealCellAct(type, html, itemEl, el, act, tid, ctrl, page, showRow);

        } else if([null,'a','lable','label'].contains(type)) { // 处理 lable
            el.addClass('sGrid_data_row_item_' + type);
            var showvalue = html || '';
            if(itemEl.get('format')) {
                showvalue = sword_fmt.convertText(itemEl, showvalue).value;
            }
            el.set({'text':showvalue,'realvalue':html || "",'title':showvalue});

            var d = dataObj['tds'][elName];
            if(d) {
                if(d['code']) {
                    el.set('code', d['code']);
                }
            }

        } else if(['rowNum'].contains(type)) {
            el.addClass('sGrid_data_row_item_' + type);

        } else if(['rowNumOnePage'].contains(type)) {
            el.addClass('sGrid_data_row_item_' + type);
            el.set('html', rowNum);


        } else if(['text','hidden','file','password'].contains(type)) { // 处理input
            el.addClass('sGrid_data_row_item_' + type);
            var convertRes = sword_fmt.convertText(itemEl, html);
            var showvalue = convertRes.value;
            if($defined(showvalue) && $type(showvalue) == "string" && (showvalue.indexOf(">") != -1 || showvalue.indexOf("<")) != -1)showvalue = (showvalue.replace(/</g, "&lt;")).replace(/>/g, "&gt;");
            el.set('html', showvalue);
            el.set('title', showvalue);
            el.set('realvalue', convertRes.realvalue);
            el.set('showvalue', showvalue);
            el.set('eventdele',"text");
            if(type == 'password') {
                var pw = this.dealPassword(showvalue);
                el.set('html', pw);
                el.set('title', pw);
                el.set('showvalue', pw);
                el.set('realvalue', pw);
                el.store('realvalue', convertRes.realvalue);
            }
        } else if(['button'].contains(type)) { // 处理input

            el.set('html', itemEl.get('caption'));
            el.addClass('sGrid_data_row_itemdiv_button');


        } else if(['checkbox','radio'].contains(type)) { // 处理input
            var check;
            if(this.isCP() && itemEl.get('userClicked') == 'true') {//cache+前台分页+用户点击过表头checkbox
                itemEl.get('checkAllFlag') == 'true' ? check = true : check = false;
            } else if(html == 'true' || html == '1') {
                check = true;
            } else {
                check = false;
            }
            el = new Element('input', {
                'type':type
                ,'name':elName
                ,'checked':check
                ,'value':html
                ,'class':'sGrid_data_row_item_checkbox'
            });
            el.set("eventdele","checkbox");

            if(itemEl.get('disable') == 'true') {
                el.set('disabled', true);
            }

            el.inject(cell);

        } else if(type == 'date') {//可编辑的日期组件
            el.addClass('sGrid_data_row_item_' + type);
            var sv = this.getCalendar().getShowValue(itemEl, html);
            var _sv = sword_fmt.convertText(el, sv).value;
            if($chk(html))el.set('realvalue', html);
            el.set('html', _sv);
            el.set('title', _sv);
            el.set('showvalue', _sv);  //使用这个值来展现
            el.set("eventdele","date");
            if(itemEl.get('showCurDate') == 'true') {
                var rv = this.getCalendar().getRealValue(itemEl, sv);
                el.set('realvalue', rv);
                dataObj['tds'][itemEl.get('name')] = {'value':rv};
            }
//                el.set('originValue',html); //保存原始值，作为更新状态的判断 改为在外面统一设置了。
            //使用 显示值 作为原始值。。
            if($defined(this.options.data)) {
                var ds = this.options.data[rowNum - 1];
                if($chk(html) && $defined(ds)) {
                    var name = itemEl.get('name');
                    if($chk(name)) {
                        var cellDs = ds['tds'][name];
                        if($defined(cellDs)) {
                            cellDs.originValue = el.get('html');
                        }
                    }
                }
            }
        } else if(type == 'select') { //可编辑的下拉列表
            el.addClass('sGrid_data_row_item_' + type);
            el.set("eventdele","select");
//                el= itemEl.pNode.set('html',html);
            var d = html;
            if(dataObj) {
                var ld = dataObj['tds'][elName];
                if(ld) {
                    ld = ld['lazydata'];
                    if(ld)d = ld;
                }
            }
            var tmp = this.getSelect().dm2mc(itemEl, d, el.getParent('.sGrid_data_row_div'));
            var code;
//                var caption;
            if($type(tmp) == 'object') {  //找到数据了
                el.set('html', tmp['caption']);     //代码转名称
                el.set('title', tmp['caption']);     //代码转名称
                el.set('code', tmp['code']);
                el.set('caption', tmp['caption']);
                code = tmp['code'];
                el.set("realvalue", tmp["realvalue"]);
                el.store("allDb", tmp["allDb"]);
//                    caption= tmp['caption'];
            } else { //没有数据
                el.set('html', html);
                el.set('title', html);
                el.set('caption', html);
                el.set('code', html);
                el.set("realvalue", html);
                code = html;
//                    caption= html;
            }

            //使用code作为原始值。。 ,使用realvalue作为value,提交用
            if($defined(this.options.data)) {
//                    var ds = this.options.data[rowNum - 1];
                var ds = dataObj;
                if($chk(code) && $defined(ds)) {
                    var name = itemEl.get('name');
                    if($chk(name)) {
                        var cellDs = ds['tds'][name];
                        if($defined(cellDs)) {
                            cellDs.originValue = code;
                            cellDs.value = tmp["realvalue"] || cellDs.value;
                            //  cellDs.caption = caption;
                            if(html && html.contains('|')) {
                                cellDs.lazydata = html;
                            }
                        }
                    }
                }
            }

            el.store("space", el.getParent('.sGrid_data_row_div'));


        } else if(type == 'userdefine') {
            el.addClass('sGrid_data_row_item_' + type);
            el.set('html', itemEl.get('html'));


        } else if(type == 'pulltree') {
            el.addClass('sGrid_data_row_item_' + type);
            el.set("eventdele","pulltree");
            var treename = itemEl.get('treename');
            el.set('treename', treename);
            var treeObj = $w(treename);


            if(treeObj.gridAddEvent != true) { //注册事件
                var eventTarget = treeObj.select ? treeObj.select : treeObj;
                eventTarget.addEvent('onSelectHide', function(input) {
                    var cell = input.getParent('.sGrid_data_row_item_pulltree');
                    treeObj.select.selBox.store('lastCell', cell);
                    treeObj.options.pNode.inject(document.body);
                    treeObj.options.pNode.setStyle('display', 'none');
                    
                    if(!cell)return;
                    cell.set('html', '');
                    var realvalue = input.get('realvalue');
                    var caption = input.get('value');
                    cell.set('realvalue', realvalue);

                    this.updateCell(cell, realvalue, caption, true);

                    input.set('value', '');
                    input.set('realvalue', '');
                    
                    if(cell.get('rule')) {//执行校验
                    	var obj = this.vObj.doValidate(cell);
                        if(!obj.state) {//校验没有通过
                            var vinput = new Element('input');
                            vinput.inject(cell); 
                            this.celltooltips.createTip(vinput,obj.msg);
                            this.pullTreeInputDestroy.delay(50,this, vinput); 
                        }                     }
                    

                }.bind(this))

                treeObj.gridAddEvent = true;
            }
            if(treeObj.inGrid != true) {
                treeObj.inGrid = true;
            }
            if(treeObj.initDataFlag != true) {
                treeObj.initData(pc.getInitData(treename));
                treeObj.initDataFlag = true;
            }

            if($chk(html)) {
                //传入的值为【code,999|caption,自然人】时，不用代码转名称，
                //这样就不用在页面初始化时加载树，减少页面加载压力,在点击时再去加载树的数据,
                //表格下拉树的懒加载方案
                if(html.contains("code") && html.contains("caption")) {
                    var vs = html.split('|');
                    if(html.contains('codePath')) {
                        //懒加载树的反显路径
                        el.set('codePath', vs[2].substring('codePath,'.length));
                    }
                    var text = vs[1].split(',')[1];
                    el.set('text', text);
                    el.set('title', text);
                    var code = vs[0].split(',')[1];
                    el.set('realvalue', code);
                    dataObj['tds'][itemEl.get('name')].value = code;
                } else {
                    //只有code值时，需要代码转名称，不推荐这么用
                    if(treeObj.gridShow != true) {
                        treeObj.select.show();
                        treeObj.options.pNode.setStyle('display', 'none');
                        treeObj.select.hide();
                        treeObj.gridShow = true;

                        this.addNextFocusEvent(treeObj.select.selBox);
                    }
                    var node = [];
                    var vs = html.split(',');
                    var caption = [];
                    vs.each(function(v) {
                        var query = new Hash();
                        query.set(treeObj.options.cascadeSign.id, v);
                        var n = treeObj.getTreeNode(query);
                        if($chk(n)){
                        	node.include(n);
                        	caption.include(n.get(treeObj.options.displayTag));
                        }
                    });
                    var realvalue = html;
                    if(node) {
                    	treeObj.setSelectedNode(node);
                    } else {
                    	treeObj.setSelectValue(html);
                    }

                    el.set('text', caption);
                    el.set('title', caption);
                    el.set('realvalue', realvalue);
                }
            }


        } else if(type == 'file2') {

            this.createFile2(itemEl, el, html, dataObj);

        } else {//没有处理此类型的方法
            throw new Error('grid[' + this.options.name + ']:SwordGrid不能处理这种类型的元素【' + itemEl.get('type') + '】，请查看用户手册。');
        }


        //设置样式和name
//            if(el!=null){//设置公用属性，el不为null 是 原生类型，不是复杂组件类型
//               this.setEl(el,type,act,elName);
//            }
        return el;


    },
    /*
     * @param rowEl:解决下拉树校验提示标签无法定位问题
     */
    pullTreeInputDestroy:function(input){
    	input.destroy();
    }
    
    /*
     * @param rowEl:刷新显示序号
     */
    ,getConsoleArg:function(){
    	 var totalRows = 0; //总行数
         var totalPage = this.totalPage();//总页数
         var rowShowIndex = 0;
         for(var p =1;p<=totalPage;p++){
        	 if(this.cachePages.contains(p)){
        		 var rows = this.dataDiv().getChildren('div:[status!=delete][pageNum=' + p + ']');
        		 totalRows = totalRows + rows.length;
        		 rows.each(function(item,index){
        			rowShowIndex ++;
         			item.set("rowShowIndex",rowShowIndex);
         			item.getElements("div[type='rowNum']").set("html",rowShowIndex);
         			item.getElements("div[type='rowNumOnePage']").set("html",index+1);
     	    	});
        	 }else{
        		 if(totalPage == p){
        			 	var yu = this.initTotalRows() % this.rows();
        		        if(yu != 0) {//有余数
        		        	totalRows = totalRows + yu;
        		        }else{
               			 	totalRows = totalRows + this.rows();
        		        }
        		 }else{
        			 rowShowIndex = rowShowIndex + this.rows();
            		 totalRows = totalRows + this.rows();
        		 }
        	 }
         }
         
         return totalRows;
    }
    
    //为输入框添加焦点转移事件,加一个参数，为了隐藏日历的弹出框
    ,addNextFocusEvent:function(srcEl, obj) {
    	srcEl.addEvent('keyup', function(event) {
            var e = Event(event);
            
            if(e.key == 'enter'||e.key== 'left' || e.key== 'up' || e.key== 'right' || e.key== 'down' ) {
            	var rule = srcEl.get('rule');
        		if($chk(rule)){
        			if(this.options.valfocus=="true"&&this.vObj.validate(srcEl)){
                    	this.nextCell(srcEl, event,obj,e.key);
        			}
        		}else{
                    this.nextCell(srcEl, event,obj);
            	}
            }
            if(obj)obj.hide();
        }.bind(this));
    }
    //加一个参数，为了解决GIRD中连续日期列，不触发hide时间，不执行校验及事件的BUG
    ,nextCell:function(srcEl, e,obj,nextOrder,autoinsert) {
        this.autoScroll = true;
        var startEl;
        var cell;
        if(srcEl.hasClass('sGrid_data_row_item_div')) {
            startEl = srcEl;
            cell = srcEl;
        } else {
            startEl = srcEl.getParent('.sGrid_data_row_item_div');
            cell = srcEl.getParent('.sGrid_data_row_item_div');
        }

        if(!startEl) {
            startEl = srcEl.retrieve('lastCell');
        }

        if(srcEl.get('onEnterPress')) {
            var f = this.getFunc(srcEl.get('onEnterPress'));
            var flag = f[0](srcEl, e);
            if(flag == false)return;
        }
        var nextEl;
        if( nextOrder=="right"  || (!$chk(nextOrder) && this.options.nextOrder == 'row') ) {//以行的方向焦点转移，默认的方向
            
            nextEl = this.findNextFocusInOneRow(startEl);
            while(!nextEl) {
                var nextRow = this.getRow(startEl).getNext();
                if(nextRow == null && !$chk(autoinsert)) {//没有下一行
                	if( !$chk(nextOrder) ){
	                	try{
	                    	if($chk(this.autoInsertFunc)){
	                    		this.autoInsertFunc();
		                        	var nextFunc = function(src, e, obj,autoinsert){
		                        		this.nextCell(src, e, obj,nextOrder,autoinsert);
		                        	}.bind(this);
	                        		nextFunc.delay(50,this, [startEl, e, obj,"insert"]);
	                        		e.target.blur();
	                    	}else{
		                    	if(this.options.noNextEvent)this.getFunc(this.options.noNextEvent)[0]();
	                    	}
	                         
	                	}catch(e){
	                	}
	              }
                    return;
                }
                startEl = nextRow.getFirst();
                var type = startEl.get('type');
                if(['text','date','select','pulltree','password'].contains(type) && startEl.get('disabled') != true && startEl.get('disable') != 'true') {
                     if(startEl.getStyle('display') != 'none') {//不是隐藏列
                    	 nextEl = startEl;
                      }
                }
                if(!$chk(nextEl))nextEl = this.findNextFocusInOneRow(startEl);
                if(nextEl){
                	 if(nextEl.get('type')=='date'||nextEl.get('type')=="pulltree"){
             	    	this.nextRowScroll = true;
             	    }
                }
        	   
            }
        } else if(  nextOrder == "down" ||  (!$chk(nextOrder) && this.options.nextOrder== 'column')) {//以列的方向焦点转移
      
            var cells = this.getCells(startEl.get('name'));
            nextEl = this.findNextFocusInOneColumn(startEl, cells);
            while(!nextEl) {
                startEl = startEl.getNext();//找下一列
                if(startEl == null) {
                    return;
                }
                cells = this.getCells(startEl.get('name'));
                nextEl = this.findNextFocusInOneColumn(null, cells);
            }
        }else if(  nextOrder == "left" ) {//以列的方向焦点转移
        
            nextEl = this.findPreviousFocusInOneRow(startEl);
            while(!nextEl) {
                var nextRow = this.getRow(startEl).getPrevious();
                if(nextRow == null) {//没有下一行
                    return;
                }
                startEl = nextRow.getLast();
                var type = startEl.get('type');
                if(['text','date','select','pulltree','password'].contains(type) && startEl.get('disabled') != true && startEl.get('disable') != 'true') {
                     if(startEl.getStyle('display') != 'none') {//不是隐藏列
                    	 nextEl = startEl;
                      }
                }
                if(!$chk(nextEl))nextEl = this.findPreviousFocusInOneRow(startEl);
                if(nextEl){
                	 if(nextEl.get('type')=='date'||nextEl.get('type')=="pulltree"){
             	    	this.nextRowScroll = true;
             	    }
                }
        	   
            }
        }else if(  nextOrder == "up" ) {//以列的方向焦点转移
        	
		var cells = this.getCells(startEl.get('name'));
	
		nextEl = this.findPreviousFocusInOneColumn(startEl, cells);
		
		while(!nextEl) {
			startEl = startEl.getPrevious();//找下一列
			if(startEl == null) {
				//e.target.blur();
				return;
			}
			cells = this.getCells(startEl.get('name'));
			nextEl = this.findPreviousFocusInOneColumn(null, cells);
		}
        }
        
        if(nextEl) {
            this.dataDiv().getChildren('.sGrid_data_row_click_div').each(function(el) {
                el.removeClass('sGrid_data_row_click_div');
            });
            var sGrid_row_div = this.getRow(nextEl).addClass('sGrid_data_row_click_div');
            
            if(this.options.checkMoudle == 'true') {
                    this.dataDiv().getElements('input:not([disabled])[type=checkbox][checked]').set('checked', false);
                    sGrid_row_div.getElements('input:not([disabled])[type=checkbox]').set('checked', true);
                    //新增，监听check被选中事触发 change事件。
                    if(this.options.rowCheckValidator != false && this.options.rowCheckValidator != "false") {
                        var __clickRow = sGrid_row_div.getElements('input[type=checkbox]:checked:not([disabled])');
                        __clickRow.fireEvent("change", [__clickRow]);
                    }
                    var radios = sGrid_row_div.getElements('input:not([disabled])[type=radio]');
                    radios.set('checked', true);
                    radios.each(function(radio){
                    	this.radioSetChecked(radio.getParent());
                    }.bind(this));

                var noneChecked = this.dataDiv().getElements('input[type=checkbox]:not([checked])').length;
                if(noneChecked == 0) {
                    this.getHeaderCheckboxs_noneChecked().set('checked', true);
                } else {
                    this.getHeaderCheckboxs_checked().set('checked', false);
                }
            }
            
            if(obj&&nextEl.get('type')=='date')obj.hide();
            var input = nextEl.getElement('input[type=text]');
            if($chk(input)){
            	input.focus();
            }else{
            	var ls = this.eDelegator._listener.get("click");
            	if(ls){
            	    ls.each(function(l){
     					if(l['condition'].indexOf(nextEl.get("eventdele")) > 0){
     						if(l['args'])l['fn'](e,nextEl,l['args']);
     						else l['fn'](e,nextEl);
     					}
     				},this);
     			}
            }
//            nextEl.fireEvent('click');
        }else{
        	if(this.options.noNextEvent)this.getFunc(this.options.noNextEvent)[0]();
        }
        this.autoScroll = false;
    }
    /**
     * 以列的方向焦点转移
     */
    ,findNextFocusInOneColumn:function(startEl, cells) {
        var indexBegin = 0;
        if(startEl) indexBegin = cells.indexOf(startEl) + 1;
        while(indexBegin < cells.length) {
            var temp = cells[indexBegin];
            var type = temp.get('type');
            if(['text','date','select','pulltree','password'].contains(type) && temp.get('disabled') != true && temp.get('disable') != 'true' && temp.getStyle('display') != 'none') {
                return temp;
            } else
                indexBegin++;
        }
        return null;
    }
    ,findPreviousFocusInOneColumn:function(startEl, cells) {
        var indexBegin = 0;
        if(startEl) {
        	indexBegin = cells.indexOf(startEl) - 1;
		if(indexBegin==-1) return null;        	
        }else   if(indexBegin==0) indexBegin = cells.length-1;
        while(indexBegin>-1) {
            var temp = cells[indexBegin];
            var type = temp.get('type');
            if(['text','date','select','pulltree','password'].contains(type) && temp.get('disabled') != true && temp.get('disable') != 'true' && temp.getStyle('display') != 'none') {
                return temp;
            }else{
            	indexBegin--;		
            }
        }
        return null;
    }
    /*
     * 从startEl 的开始找。。
     * 返回找到的元素el，没有找到返回null*/
    ,findNextFocusInOneRow:function(startEl) {
        var nextEl = startEl.getNext();
        while(nextEl) {
            var type = nextEl.get('type');
            if(['text','date','select','pulltree','password'].contains(type) && nextEl.get('disabled') != true && nextEl.get('disable') != 'true') {
                if(nextEl.getStyle('display') != 'none') {//不是隐藏列
                    return nextEl;
                }
            }
            nextEl = nextEl.getNext();
        }
    }
    
    /*
     * 从startEl 的开始找。。
     * 返回找到的元素el，没有找到返回null*/
    ,findPreviousFocusInOneRow:function(startEl) {
        var nextEl = startEl.getPrevious();
        while(nextEl) {
            var type = nextEl.get('type');
            if(['text','date','select','pulltree','password'].contains(type) && nextEl.get('disabled') != true && nextEl.get('disable') != 'true') {
                if(nextEl.getStyle('display') != 'none') {//不是隐藏列
                    return nextEl;
                }
            }
            nextEl = nextEl.getPrevious();
        }
    }
  

    /**
     * 表格上执行一行物理删除的接口;
     * 此接口仅仅实现了物理删除的动作，没有在表格数据源中更新行的状态，要想更新状态，请使用 deleting(el) 方法；
     * 一般在后台已经成功删除后调用此方法；
     * @function {public null} deleteRow
     * @see deleting
     * @param {object} el：要删除的html行元素或者属于这行的一个html元素。
     * @returns null
     */
    ,deleteRow:function(el) {
        var row = this.getRow(el);
        row.destroy();
        this.buildXY();
        this.scrollHeader();

        this.refreshConsole();

    }

    //设置el的 公用属性：name , class
    ,setEl:function(el, type, act, elName) {
        var className;
        if(type != null) {//当类型不为null的时候，设置样式
            className = 'sGrid_data_row_item_' + type;
        } else {//类型为null 默认为不可编辑的 lable 所以 设置样式为lable
            className = 'sGrid_data_row_item_lable';
            if(act != null) {//有act属性的元素 默认为 button
                className = 'sGrid_data_row_item_button';//todo 这行css没有用到，考虑删掉
            }
        }
        el.addClass(className);
    }



    ,getOneRowFormData:function(el, formName) { //传入cell 元素 ，返回cell所在行的数据，并将此数据转换为form的标准数据格式
        return {
            "fromGird": "fromGird",
            "data": [

                {
                    "sword": "SwordForm",
                    "name": formName,
                    "data": this.getOneRowData(el)['tds']

                }
            ]
        };
    }

    ,getOneRowGirdData:function(el) { //传入cell 元素 ，返回cell所在行的数据，此数据是表格的标准数据格式
        return {
            'sword':this.options.sword,
            'name' :this.options.name,
            'beanname':this.options.beanname,
            'trs' :[this.getOneRowData(el)]   //数组从0开始
        };
    }
    ,getRowsGirdData:function(els) { //传入cell 元素数组 ，返回cell所在行的数据，此数据是表格的标准数据格式

        var trs = new Array();
        els.each(function(el) {
            trs.push(this.getOneRowData(el));
        }, this);

        return {
            'sword':this.options.sword,
            'name' :this.options.name,
            'beanname':this.options.beanname,
            'trs' :trs   //数组从0开始
        };
    }
    ,getRowsGridData:function(els) { //为了接口名字
        return this.getRowsGirdData(els);
    }

    ,getRowsData:function(els) { //传入cell 元素数组 ，返回cell所在行的数据，此数据是tr data数组
        var trs = new Array();

        els.each(function(el) {
            trs.push(this.getOneRowData(el));
        }, this);

        return trs;
    }

    //传入cell 元素 ，返回cell所在行
    ,getRow:function(cell) {

        if(cell.hasClass('sGrid_data_row_div')) {
            return cell;
        }
        return cell.getParent('.sGrid_data_row_div');

    }

    //传入cell 元素 or rowNum ，返回cell所在行的行号,返回此cell处于当前页面的第几行
    ,getRowNum:function(cell) {
        return this.getRow(cell).get('rowNum');
    }
    
  //传入cell 元素 or rowNum ，返回cell所在行的行号(不包含删除状态数据在内),返回此cell处于当前页面的第几行
    ,getRowShowIndex:function(cell) {
        return this.getRow(cell).get('rowShowIndex');
    }

    //传入cell 元素 ，返回cell所在行的行号,当前台分页时候，返回此cell处于所有数据的第几行， 后台分页返回同 getRowNum 处于当前页面的第几行
    ,getRealRowNum:function(cell) {
    	var rowNum = cell;
        if($type(cell) == 'element') {
            rowNum = this.getRowNum(cell);
        }
        if(rowNum > this.initTotalRows())return rowNum;  ///大于初始条数 说明是后期新增行commit之后产生的rowNum  
        var real = rowNum;
        if(this.isPage()) {

            var pageNum;
            if(this.cache()) { //缓存的情况
                pageNum = this.getRow(cell).get('pageNum');
                if(!$chk(pageNum))pageNum = this.pageNum();
            } else {
                pageNum = this.pageNum();
            }

            real = (pageNum - 1) * this.rows() + rowNum / 1;  //数据行数 从1开始

        }
        return real;
    }



    //传入cell 元素 ，返回cell所在行的数据，此数据是从表格数据源中取得 。。 返回的数据 是trs数组中的一个元素tr
    ,getOneRowData:function(cell) {
        if(!$defined(cell)) {
            return null;
        }

        var row = this.getRow(cell);
        var status = row.get('status');

        var data;
        if(status == 'insert') {
            data = this.getOneRowDataFromDiv(row);
            var rd = row.retrieve('rowData').tds;
            for(var i in rd){
        		var tds = data["tds"];
        		if(!$defined(tds[i])){
        			tds[i]={'value':rd[i]["value"]};
        		}
             }

            //将新增行的数据(新增状态)注册到表格数据源中  todo 不应该在这个里写入数据源中。。应该在comit的时候写入。
//                this.data()[realRowNum-1]=data;
            //注册取值方法   todo  这种注册方法 没有统一，等待重构
            data.getValue = function(name) {
                var tmp = this.tds[name];
                if(!$defined(tmp)) {
                    return null;
                }
                return tmp['value'];
            }
        } else {
            if(this.cache()) {
                data = row.retrieve('rowData');
            } else {
                data = this.options.data[this.getRealRowNum(cell) - 1];
            }
        }

        return data;
    }
    //传入cell 元素 ，返回cell所在行的数据,此数据是从行div中取得 。。 返回的数据 是trs数组中的一个元素tr
    ,getOneRowDataFromDiv:function(cell) {
        var row = this.getRow(cell);
        var tr = {'tds':{},'status':'insert'};
        row.getElements('*[name][dataEl=true]').each(function(cell) {
            var value,td = {};
            var type = cell.get('type');
            if(type == 'checkbox' || type == 'radio') {
                value = cell.getElement('input[type=' + type + ']').get('checked') == true ? 1 : 0;
            } else if(['select','pulltree','text'].contains(type)) {
                value = cell.get('realvalue');
            } else if(type == 'password') {
                value = cell.retrieve('realvalue');
            } else if(type == 'file2') {
            	var file2Obj=cell.retrieve('up');
            	if(file2Obj){
            		value = cell.retrieve('up').getValue();
            	}else{value="";}
            } else if($chk(cell.get('code'))) {
                td['code'] = cell.get('code');
                value = cell.get('text');
            }
            //如果是label、format形式，不该去取text
            else if($chk(cell.get('format'))) {
                value = cell.get('realvalue');
            }
            else {
                value = cell.get('text');
            }
            td['value'] = value;
            tr.tds[cell.get('name')] = td;
        }, this);
        return tr;
    }


    ,createDivEl:function() {
        /*        if (this.divEl == null) {
         this.divEl = new Element('div');
         }

         return this.divEl.clone();*/

        return new Element('div');
    }


    ,createInput:function(type, value, name) {

        /*        if (this.inputEl == null) {
         this.inputEl = new Element('input');
         }

         return this.inputEl.clone().set({
         'type':type
         ,'value':value
         ,'name':name
         });*/

        if(['checkbox','radio'].contains(type)) {
            if(value == 'true' || value == '1') {
                return new Element('input', {
                    'type':type
                    ,'name':name
                    ,'checked':true
                    ,'value':value
                });
            }
        }


        return new Element('input', {
            'type':type
            ,'value':value
            ,'name':name
        });
    }

    ,dragHeader:function(el, cl, dl, where) {
        //清除进入有效区域的样式
        dl.removeClass('sGrid_header_drag_enter_div');
        //清除拖拽开始的样式
        el.removeClass('sGrid_header_drag_start_div');

        if(!this.dataDiv()) return;

       var lastN = this.getLastShowItemEl().get('name');
       var elN=el.get('_for');
       var dlN=dl.get('_for');

        var els = this.getCells(elN);
        var dls = this.getCells(dlN);



        if(lastN==elN){
           els.each(function(theEl, index) {
                theEl.inject(dls[index], where);
                theEl.setStyle('border-right', '');
                dls[index].setStyle('border-right', 'none');
            });
            el.setStyle('border-right', '');
            dl.setStyle('border-right', 'none');
        }else if(lastN==dlN){
            els.each(function(theEl, index) {
                theEl.inject(dls[index], where);
                dls[index].setStyle('border-right', '');
                theEl.setStyle('border-right', 'none');
            });
            dl.setStyle('border-right', '');
            el.setStyle('border-right', 'none');
        } else {
            els.each(function(theEl, index) {
                theEl.inject(dls[index], where);
            });
        }


        //更新配置项目
        var elItem = this.getItemElByName(elN)[0];
        var dlItem = this.getItemElByName(dlN)[0];
        elItem.inject(dlItem, where);


    }

    //根据名字获得 cell div 的数组 , 通常是一列具有相同的名字
    ,getCells:function(name) {
//        return this.dataDiv().getElements('div.sGrid_data_row_item_div[name=' + name + ']');
        var r = [];
        var allrows = this.dataDiv().getChildren();
        if(allrows.length != 0) {
            var allcells = allrows[0].getChildren();
            var index = -1;
            for(var i = 0; i < allcells.length; i++) {
                if(allcells[i].get('name') == name) {
                    index = i;
                    break;
                }
            }

            for(var w = 0; w < allrows.length; w++) {
                var c = allrows[w].getChildren()[index];
                if(c)r.push(c);
            }
        }

        return new Elements(r);
    }

    //根据名字获得 表头 元素的数组 , 通常是只有一列具有相同的名字
    ,getHeaderEl:function(name) {
        return this.header().getChildren('div.sGrid_header_item_div[_for=' + name + ']');
    },
    gethjRowEl:function(name) {
    	return $chk(this.hjRow) ? this.hjRow.getChildren('div.sGrid_hj_row_item_div[name=' + name + ']'):null;
    }
    ,setHeaderCaption:function(name, caption) {
        var headEl = this.getHeaderEl(name)[0];
        if(headEl) {
            var textEl = headEl.getElement('div.sGrid_header_text_div');
            if(textEl) textEl.set('text', caption);
        }
    }

    //根据当前页面状态信息【数据总数 totalRows，每页行数 rows，当前页码 page】，获得一页的数据
    ,onePageData:function(loadFunc) {
        if(this.isServer()) { //后台分页
            var req = JSON.decode(this.options.bizParams);
            req.pageNum = this.pageNum();
            req.rows = this.rows();
            req.queryType = 'page';
            req.widgetname = this.options.name;
            var ss =  this.getSwordSort();
            req.sortName = ss.options.sortName;  //排序
            req.sortFlag = ss.options.sortFlag;    //排序
            if($chk(this.options.ptid))req.tid = this.options.ptid;


            pc.postReq({
                'req':req
                ,'onSuccess':function(resData) {
                    var d=this.getResData(this.options.name, resData);
                    this.setInitData(d,true);
                    if(d.totalRows){
                    	this.options.totalRows=d.totalRows;
                    	this.options.initTotalRows = d.totalRows;
                    }
                    var result = this.getOnePageData(this.pageNum());
                    loadFunc(result);
                	this.refreshConsole();
                }.bind(this)
                ,'loaddata':'widget'
                ,'redirect':false
            });

            return;

        } else {
        	var ss = this.getSwordSort();
            //前台分页处理 开始
            if(ss.options.sortName) {
                ss.sort(this.data(), {
                    sortName:ss.options.sortName,
                    sortflag:ss.options.sortFlag,
                    type:ss.options.sortType || 'string'
                });
            }
            //前台分页处理 结束

            var result;
            if(this.options.bufferView == 'true') {
                var v = this.getVisibleRows();
                result = this.data().filter(function(item, index) {
                    return index >= v.first && index < v.last;
                }.bind(this));
                loadFunc(result);
                this.createEmptyRows(v.last, this.options.fenye == 'false' ? this.totalRows() : this.rows());
            } else {
                result = this.getOnePageData(this.pageNum());

                loadFunc(result);
                if(!this.cachePages.contains(this.pageNum()))this.cachePages.include(this.pageNum());
            }
        }

    }
    ,createEmptyRows:function(start, end) {
        var dataObj = this.data();
        for(var i = start; i < end; i++) {
            var sGrid_data_row_div = this.createBaseRow(i + 1).setStyle('height', '25px');
            sGrid_data_row_div.store('rowData', dataObj[i]);//注册行数据
            sGrid_data_row_div.inject(this.dataDiv());
        }

    }

    ,getOnePageData:function(pagenum) {
        var start = (pagenum - 1) * this.rows();
        var end = start + this.rows() - 1;
        if(this.options.fenye == 'false') {
        	end = this.initTotalRows() - 1;
        }

        var r = this.data().filter(function(item, index) {
            return index >= start && index <= end;
        }.bind(this));
        return r;
    }

//     ,cacheData:this.cache()?new Hash():null
    ,setInitData:function(data,isExtend) {
    ///如果是后台分页 则将数据累加  否则重置数据
    	if($chk(isExtend)&&isExtend){
            var dataLen =  data.trs.length;
    		for(var i=0;i<dataLen;i++){
    			var real = (this.pageNum() - 1) * this.rows() + i;  
    			this.options.gridData.trs[real] = data.trs[i];
    		}
    	}else{
            this.options.gridData = data;      
    	} //完整的表格数据
        this.options.data = this.options.gridData['trs'];   //业务数据  trs

    }

    ,getSwordSort:function() {
        if(!this.swordSort)this.swordSort = new SwordSort();
        return this.swordSort;
    }

    //此方法一般用在完全重新初始化一个表格的数据的时候，注意更新当前页和数据总数
    ,initData:function(girdData) {
        //强制重新装载数据标识
        this.clearCache = true;

//        this.rebuildHeader();

        //清理数据项。。清理错误状态
        this.clearData('all');

        //data 的类型为数组 。。。。 [{tds:{}},obj,obj]
        if(!$chk(girdData)) {
            return;
        }

        this.setInitData(girdData);

        if(!$chk(this.data())) {
            return;
        }


        if(girdData.totalRows >= 0) {
            this.options.fenyeType = 'server';
            this.options.totalRows = girdData.totalRows;
            this.options.initTotalRows = girdData.totalRows;
            this.options.pageNum = girdData.pageNum;
            this.options.rows = girdData.rows;
            /*            if(!$chk(girdData.bizParams)){
             throw new Error('server page :  bizParams can not be null !!!');
             }*/
            this.options.bizParams = girdData.bizParams;


            //对于排序的处理 开始
            this.sortFlag = girdData.sortFlag || ''; //更新排序状态 ,排序类型
            this.sortName = girdData.sortName || ''; //更新排序状态 ，排序列名称
            //对于排序的处理 结束

        } else {
            this.options.fenyeType = 'page';
            this.options.totalRows = this.data().length;
            this.options.initTotalRows = this.data().length;
            this.options.pageNum = 1;


            if(this.options.fenye == 'false') {  //不分页，使用数据总数作为每页显示行数
                this.options.rows = this.options.totalRows;
            }
        }
        //从buildConsole 方法中移动到该处，因在数据初始化之前无法判断是否后台分页
        if(this.options.editRows == 'true' && this.isPage() && this.options.fenye != 'false') {
            this.consoleRows().setStyles({
                cursor:'pointer'
                ,'text-decoration':'underline'
                ,'color':'blue'
            });
            this.consoleRows().addEvent('click', function() {
                this.consoleInputRows().setStyle('display', '');
                this.consoleInputRows().select();
                this.consoleRows().setStyle('display', 'none');
            }.bind(this));
        }

        this.delayBuildData(this.data());

        this.refreshConsole();

        this.clearCache = false;

//        this.doMask();
//        this.buildData2.delay(10,this,this.data());

    }

    ,cache:function() {
        return !this.clearCache && this.options.cache == 'true';
    }

    //清楚数据区域的数据
    ,clearData : function(all) {

        if(!this.cache() || $defined(all)) {//没有使用页面缓存
            this.dataDiv().getChildren().each(function(value) {
                value.destroy();
            });
            this.removeAllError();
            this.cachePages = [];
        } else {//使用页面缓存
            this.dataDiv().getChildren().setStyle('display', 'none');
            this.dataDiv().getChildren('[cache=false]').set('cache', true);
            var t = this.dataDiv().getChildren(':not([cache])').set('cache', true);
            if(t.length > 0) {
            	if(!this.cachePages.contains(this.options.lastPageNum))this.cachePages.include(this.options.lastPageNum);
            }

        }
    }

    ,cachePages:[] //缓存区有的页码数

    //数据区，是否有纵向滚动条
    ,haveYScroll:function() {
        var dataDiv = this.dataDiv();
        var allRows = $$(dataDiv.childNodes);
        if(allRows.length == 0) {//没有元素肯定没有滚动条
            return false;
        }
        if(this.options.dataY == -1 && this.options.autoHeight != 'true') {//当表格高度与数据高度用于一致肯定没有滚动条
            return false;
        }

        if(Browser.Engine.trident4) { //ie6
            return allRows[0].getFirst().getHeight() / 1 * allRows.length + allRows.length / 1 > dataDiv.getHeight();
        } else {
            return this.scrollDiv.getScrollHeight() > this.scrollDiv.getHeight();
        }


    }

    //重建表格宽度
    ,buildX:function(row) {
        var haveYScroll = this.haveYScroll();
        var scrollX = '' + this.options.scrollX;
        if(scrollX.contains('%')) {
            this.dataDiv().setStyle('width', scrollX);
            this.header().setStyle('width', scrollX);
        } else if(this.options.scrollX != -1) {//不是默认,业务代码设置了宽度
            if(scrollX.contains('px')) {
                this.dataDiv().setStyle('width', scrollX);
                this.header().setStyle('width', scrollX);
            } else {
                this.dataDiv().setStyle('width', scrollX + 'px');
                this.header().setStyle('width', scrollX + 'px');
            }
        }


        var dataX = '' + this.options.dataX;
        if(dataX.contains('%')) {//是百分比的宽度
            if(dataX != '100%')this.sGrid_div().setStyle('width', dataX);
            return;
        } else if(this.options.dataX != -1) {//不是默认,业务代码设置了宽度
            if(dataX.contains('px')) {
                this.sGrid_div().setStyle('width', dataX);
            } else {
                this.sGrid_div().setStyle('width', dataX + 'px');
            }
            return;
        }

        //设置宽度的表格：
        var oneRow;
        if(row) {
            oneRow = row;
        } else {
            oneRow = this.dataDiv().getElement('.sGrid_data_row_div');
        }

        var cells;
        var scrollXPy = 19;  //滚动条宽度的偏移量 todo 这个宽度可以准确计算出来
        var ieXPy = 0;      //解决ie显示样式和ff不准的问题的偏移量
        //-------------width --------------
//        if (!$chk(oneRow)) {//没有数据的情况
        if(true) {//由于css加载的问题，使用表头来计算表格的宽度
            oneRow = this.header();
            cells = oneRow.getElements('.sGrid_header_item_div');
        } else {//装载了数据的情况
            cells = oneRow.getElements('.sGrid_data_row_item_div');
        }

        var width = 0;
        cells.each(function(cell) {
            var w = cell.getWidth();
            if(w > 0) { //减去boder的px，因为已经用magin=-1减去了
                w--;
            }
            width = width + w;//返回的值就包含了border的宽度
        }, this);

        if(haveYScroll) {//如果含有滚动条
            width = width + scrollXPy;
        }
        if(Browser.Engine.trident) {//ie 的时候要加入此偏移量 ，来保证样式显示的正确
            width = width + ieXPy;
        }

        //             alert(this.dataDiv().getScrollHeight()) //大于css定义的样式,他加了被滚动过的高度   ,ps：如果生成滚动条的话，滚动条能滚动的距离，一般情况(ie和ff不同)，有滚动条的时候getScrollHeight>getHeight
        //             alert(this.dataDiv().getHeight())       //准的和css中定义的一样

        this.sGrid_div().setStyle('width', width);
        //--------------width end----------------
    }

    //重建表格高度
    ,buildY:function() {
        if(this.options.dataY == -1 && this.options.autoHeight == 'true') {  //没有定义数据高度 而且 是需要自动撑起的表格
            var dataHeight = this.itemY() * this.rows() + this.rows();
            if(this.hjRow)dataHeight= this.itemY() * (this.rows()+1) + this.rows();
            //var hh = this.header().getHeight();
            if(this.options.showHeader == true || this.options.showHeader == 'true')
                dataHeight += (this.options.headerY == -1 ? this.options.headerHeight + 1 : this.options.headerY / 1);
            var sx = this.options.scrollX.toInt();
            var dx = this.options.dataX.toInt();
            if($type(this.options.scrollX) == 'string' && this.options.scrollX.contains('%')) {
                if(sx > 100)dataHeight += 17;
            } else if(sx > dx) {
                dataHeight += 17;
            }
            this.scrollDiv.setStyle('height', dataHeight);
        } else if(this.options.dataY != -1) {
            this.scrollDiv.setStyle("height", this.dataY());
        }
    }

    //根据row的长度，重建表格宽度和高度
    ,buildXY:function(row) {
        this.buildX(row);
        this.buildY();
    }


    ,getDataDivFxScroll:function() {
        if(this.dataDivFxScroll == null) {
            this.dataDivFxScroll = new Fx.Scroll(this.scrollDiv);
            this.dataDivFxScroll.toBottom = function() {
                var f = function() {
                    this.scrollDiv.scrollTop = this.scrollDiv.getScrollSize().y;
                };
                f.delay(1, this);
            }.bind(this);
        }
        return this.dataDivFxScroll;
    }
    ,createPanel:function(p, t) {

        var panel = new Element('div',
                {
                    'class':'swordgird_panel_header'
                });

        new Element('div',
                {
                    'class':'swordgird_panel_header_1'
                }).inject(panel);

        new Element('div',
                {
                    'class':'swordgird_panel_header_2'
                }).inject(panel);

        var panelcap = new Element('div',
                {
                    'class':'swordgird_panel_header_caption'
                    ,'title':t
                }).appendText(t).inject(panel);

        this.collapseDiv = new Element('div', {
            'class':'x-tool',
            'title':'收缩',
            'events':{
                'click':function(e) {
                    this.toggle();
                }.bind(this)
            }
        }).inject(panelcap, 'top');
        /*
         var se = new Element('select').setStyles({'margin-left':'15px'}).inject(panelcap);
         var oe = null;
         this.items().each(function(item){
         var c = item.get('caption');
         if(!$chk(item.get('act')) && $chk(c)){
         if(oe==null){
         oe = new Element('option');
         }else{
         oe = oe.clone();
         }
         oe.set({'text':c,'name':item.get('name')}).inject(se);
         }
         });

         var filerInput = new Element('input').setStyles({'margin-left':'15px'}).inject(panelcap).addEvent('keyup',function(e){
         if(!$chk(this.allGridCacheData))this.allGridCacheData = this.getAllGridData();
         var seEl = se.options[se.selectedIndex];
         var columnName = seEl.get('name');
         var trs = this.allGridCacheData.trs;
         var tempData = [];
         for(var i=0;i<trs.length;i++){
         var cv = trs[i].tds[columnName].value||'';
         if(cv.contains(filerInput.value)){
         tempData.include(trs[i]);
         }
         }
         this.initData({'trs':tempData});
         }.bind(this));*/

        this.options.panel = panel;
        panel.inject(p);
    }


    ,createToolConsole:function(p) {
        if((this.options.toolConsole == 'true' || this.options.toolConsole == true) && this.consoleItems() && this.consoleItems().length > 0) {
            this.toolpanel = new Element('div',
                    {
                        'class':'swordgird_toolpanel_header'
                    });

            this.toolpanel.inject(p);
        }
    }



    //创建控制台的翻页按钮。。。
    ,createConsolePageButton:function() {

        if(this.options.consoleStyle == 'button') {
            this.createConsolePageButton_buttonStyle();
        } else if(this.options.consoleStyle == 'image') {
            this.createConsolePageButton_imageStyle();
        }

    }

    //点击控制台上确定后的相关操作
    ,clickQueDing:function() { 
        if(this.vObj.validate(this.sGrid_console_target_input)) {
            if(this.sGrid_console_target_input.get('value') / 1 == this.pageNum()) {
                this.alert('' + i18n.gridGo);
                return;
            }
            this.loadPage(this.sGrid_console_target_input.get('value') / 1);
            this.sGrid_console_target_input.focus();
        }
    }


    ,createConsolePageButton_imageStyle:function() {
        if(this.options.fenye != 'false') {

            this.consoleButton_first = new Element('button', {
                'class': 'sGrid_console_item_button_first'
                ,'html':'&nbsp'
                ,'fenye':'true'
            }).inject(this.console());


            this.consoleButton_prev = new Element('button', {
                'class': 'sGrid_console_item_button_prev'
                ,'html':'&nbsp'
                ,'fenye':'true'
            }).inject(this.console());

            // 1/30页
            new Element('lable', {
                'class': 'sGrid_console_text_lable sGrid_console_text_lable_di'
                ,'html':'' + i18n.gridDi
            }).inject(this.console());

            this.options.sGrid_console_page_lable = new Element('input', {
                'class': 'sGrid_console_target_input'
                ,'value':'0'
                ,'rule' :'numberInt_must'
                ,'error':'' + i18n.gridGoErr
                ,'fenye':'true'
                ,'name':this.options.name + '_sGrid_console_target_input'
                ,'events':{
                    'keyup':function(e) {
                        if(e.key == 'enter') {
                            this.clickQueDing();
                        }
                    }.bind(this)
                }
            }).inject(this.console());
            this.sGrid_console_target_input = this.options.sGrid_console_page_lable;
            this.vObj._add(this.options.sGrid_console_page_lable);

            new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'' + i18n.gridYeGong
            }).inject(this.console());

            this.options.sGrid_console_totalPage_lable = new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'0'
            }).inject(this.console());

            new Element('lable', {
                'class': 'sGrid_console_text_lable sGrid_console_text_lable_ye'
                ,'html':'' + i18n.gridYe
            }).inject(this.console());
            // 1/30页 结束


            this.consoleButton_next = new Element('button', {
                'class': 'sGrid_console_item_button_next'
                ,'html':'&nbsp'
                ,'fenye':'true'
            }).inject(this.console());

            this.consoleButton_last = new Element('button', {
                'class': 'sGrid_console_item_button_last'
                ,'html':'&nbsp'
                ,'fenye':'true'
            }).inject(this.console());


            //每页 条
            new Element('lable', {
                'class': 'sGrid_console_text_lable sGrid_console_text_lable_mei'
                ,'html':'' + i18n.gridMeiYeShow
            }).inject(this.console());


            this.options.sGrid_console_rows_lable = new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':this.rows()
            }).inject(this.console());


            new Element('lable', {
                'class': 'sGrid_console_text_lable sGrid_console_text_lable_tiao'
                ,'html':'' + i18n.gridTiao
            }).inject(this.console());

        }//if(this.options.fenye!='false'){

        //共 条
        new Element('lable', {
            'class': 'sGrid_console_text_lable'
            ,'html':'' + i18n.gridJsd
        }).inject(this.console());


        this.options.sGrid_console_totalRows_lable = new Element('lable', {
            'class': 'sGrid_console_text_lable'
            ,'html':0
        }).inject(this.console());


        new Element('lable', {
            'class': 'sGrid_console_text_lable sGrid_console_text_lable_lu'
            ,'html':'' + i18n.gridJsdL
        }).inject(this.console());
    }


    ,createConsolePageButton_buttonStyle:function() {
        if(this.options.fenye != 'false') {

            this.consoleButton_first = new Element('input', {
                'type':'button',
                'class': 'sGrid_console_item_button'
                ,'value':i18n.firstPage
                ,'fenye':'true'
            }).hoverClass('sGrid_console_item_button_hover').inject(this.console());


            this.consoleButton_prev = new Element('input', {
                'type':'button',
                'class': 'sGrid_console_item_button'
                ,'value':i18n.previousPage
                ,'fenye':'true'
            }).hoverClass('sGrid_console_item_button_hover').inject(this.console());

            this.consoleButton_next = new Element('input', {
                'type':'button',
                'class': 'sGrid_console_item_button'
                ,'value':i18n.nextPage
                ,'fenye':'true'
            }).hoverClass('sGrid_console_item_button_hover').inject(this.console());

            this.consoleButton_last = new Element('input', {
                'type':'button',
                'class': 'sGrid_console_item_button'
                ,'value':i18n.endPage
                ,'fenye':'true'
            }).hoverClass('sGrid_console_item_button_hover').inject(this.console());


            // 1/30页
            this.options.sGrid_console_page_lable = new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'0'
            }).inject(this.console());

            new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'/'
            }).inject(this.console());

            this.options.sGrid_console_totalPage_lable = new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'0'
            }).inject(this.console());

            new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'' + i18n.gridYe
            }).inject(this.console());
            // 1/30页 结束


            this.sGrid_console_target_input = new Element('input', {
                'class': 'sGrid_console_target_input'
                ,'rule' :'numberInt_must'
                ,'error':'' + i18n.gridGoErr
                ,'name':this.options.name + '_sGrid_console_target_input'
                ,'fenye':'true'
            }).addEvent('keydown', function(e) {
            		var tv = e.target.value/1;
            		if(!$type(tv)) return;
                    if(e.code==13){
                    	this.clickQueDing();
                    }else if(e.code==40){
                    	if(tv==1) return;
                    	e.target.value = tv-1;
                    }else if(e.code==38){//up
                    	if(tv == this.totalPage()) return;
                    	e.target.value = tv+1;
                    }
                }.bind(this)).inject(this.console());

            this.vObj._add(this.sGrid_console_target_input);
/*
            this.consoleButton_ok = new Element('input', {
                'type':'button',
                'class': 'sGrid_console_item_button sGrid_console_target_ok'
                ,'value':'' + i18n.okBtnName
                ,'fenye':'true'
            }).hoverClass('sGrid_console_target_ok_hover').inject(this.console());
*/

            //每页 条
            new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'' + i18n.gridMeiYe
            }).inject(this.console());


            this.options.sGrid_console_rows_lable = new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':this.rows()
            }).inject(this.console());


            new Element('lable', {
                'class': 'sGrid_console_text_lable'
                ,'html':'' + i18n.gridTiao
            }).inject(this.console());

        }//if(this.options.fenye!='false'){

        //共 条
        new Element('lable', {
            'class': 'sGrid_console_text_lable'
            ,'html':'' + i18n.gridGong
        }).inject(this.console());


        this.options.sGrid_console_totalRows_lable = new Element('lable', {
            'class': 'sGrid_console_text_lable'
            ,'html':0
        }).inject(this.console());


        new Element('lable', {
            'class': 'sGrid_console_text_lable'
            ,'html':'' + i18n.gridTiao
        }).inject(this.console());
    }

    ,lableClick: function(el, itemEl) {
        if(el.get('disable') == 'true')return;
        this.getFunc(itemEl.get('_onClick'))[0](this.getOneRowData(el), this.getRow(el), el);
    }
    ,tableCellTip:function(el, input, name) {
        if($chk(el.get('tipTitle'))) {
            if(!window.tooltips) {
            	window.tooltips = pageContainer.create('SwordToolTips');
            	this.celltooltips = window.tooltips;
            }
            var msg = el.get('tipTitle');
            this.celltooltips.createTip(input,msg);
        }
    }
    ,textClick: function(el, itemEl, type, elName, rowNum) {
        var rule = el.get('rule');
        var msg = el.get('msg');
        var inputEL;
        if(el.get('disable') == 'true' || el.get('disabled')==true)return;
        //                    var text=el.get('text');
        var text = el.get('realvalue');
        if(type == 'password') {
            text = el.retrieve('realvalue');
        }

        if(el.get('createInput') == 'true') {
            inputEL = el.getFirst();
        }else{
            el.set('html', ''); //todo ？清理html
            inputEL = this.createInput(type, text, elName).inject(el).addEvent('blur', function() {
                if(!$chk(rule) || this.vObj.doValidate(inputEL).state) { //校验通过 或 没有校验
                    el.set('createInput', 'false');
                    var realvalue = inputEL.get('value');
                    var showvalue = sword_fmt.convertText(itemEl, realvalue).value;
                    el.set('value', realvalue);//李伟杰  2012-3-22添加  避免 自定义校验  el.get(value)为空  校验不通过
                    el.set('realvalue', realvalue);
                    el.set('showvalue', showvalue);
                    this.updateCell(el, realvalue);//统一使用realvalue来更新值
                    if(itemEl.get('_onBlur')) {
                        this.getFunc(itemEl.get('_onBlur'))[0](realvalue, showvalue, this.getOneRowData(el), el, this.getRow(el), text || '', this);
                        this.refreshConsole();
                    }
                    this.celltooltips.hide();
                    inputEL.destroy();
                } else {//校验没有通过
                    if(el.get("realvalue") != "")el.setProperties({realvalue:'',title:'',showvalue:'',value:''});
                }
                //TODO ----------------------------------------------------
                if(this.hjRow) {
                    var hjdiv = this.hjRow.getElement("div[name='" + el.get("name") + "']");
                    if(hjdiv) {
                        if(hjdiv.get("isHj") && hjdiv.get("isHj").toUpperCase() == "TRUE") {
                            var oldValue=hjdiv.get("text");
                            var showvalue = html = this.getHj(el.get("name")) || '';
                            if(hjdiv.get('format')) showvalue = sword_fmt.convertText(hjdiv, showvalue).value;
                            hjdiv.set({'text':showvalue,'realvalue':html || "",'title':showvalue});
                            hjdiv.fireEvent('onchange',[oldValue,hjdiv.get("text")]);
                        }
                    }
                }
            }.bind(this));
        }



        this.tableCellTip(el, inputEL, elName);
        if($chk(rule)) {
            inputEL.set('rule', rule);
        }
        if($chk(el.get('maxLength')))
            inputEL.set('maxlength', el.get('maxLength'));
        if($chk(msg)) {
            inputEL.set('msg', msg);
        }
        if($chk(rule)) {
            this.vObj._add(inputEL);
        }

        inputEL.addClass('sGrid_data_row_item_text_input');
        inputEL.setStyle('width', el.getWidth()); //为 item 设置宽度
        inputEL.setStyle('float', 'left');

        el.set('createInput', 'true');
        if(itemEl.get('onEnterPress'))inputEL.set('onEnterPress', itemEl.get('onEnterPress'));
        if(itemEl.get('onfocus'))inputEL.set('onfocus', itemEl.get('onfocus'));
        //添加焦点转移事件
        this.addNextFocusEvent(inputEL);

        inputEL.focus();
        inputEL.focus();
        inputEL.select();
        var rv = inputEL.get('value');
        var sv = sword_fmt.convertText(itemEl, rv).value;
        if($defined(rule) && rule.contains('must'))inputEL.setStyle('background-color','#b5e3df');
        if(itemEl.get('_onClick'))this.getFunc(itemEl.get('_onClick'))[0](rv, sv, this.getOneRowData(el), el, this.getRow(el), text);
    }

    ,reset:function() {
        this.initData({trs:[]});
    }

    ,readonlyDiv:null
    ,readonly:function() {
        var g = this;
        g.header().getElements('input[type=checkbox]').set('disabled', 'true');
        g.console().getElements('input[type=button]:not([fenye=true])').each(function(el) {
            g.disableConsoleBtn(el, true);
        });

        var dataDiv = g.dataDiv();
        //var w = (dataDiv.getWidth()!=0)?(((dataDiv.getWidth() - 20) / dataDiv.getWidth()) * 100):1;
        var w = g.scrollDiv.getWidth();
        if(g.scrollDiv.getScrollHeight() > g.scrollDiv.getHeight()) w = w - 16;
        var _h = g.scrollDiv.getHeight() - this.header().getHeight();
        if(Browser.Engine.trident4)_h = g.scrollDiv.getHeight() - (this.header().getStyle('height')?this.header().getStyle('height').split('px')[0]:0)
        var h = _h;
        if(g.scrollDiv.getScrollWidth() > g.scrollDiv.getWidth()) h = h - 16;

        if(g.readonlyDiv) {
            g.readonlyDiv.setStyles({'display':'','width':w,'height':h,'margin-top':-_h});
            return;
        }
        g.readonlyDiv = dataDiv.clone(false).setStyles({
            'background-color':'white'
            ,'margin-top':-_h
            ,'height':h
            ,'opacity':0.2
            ,'width':w
            ,'border':'none'
            ,'float':'left'

        }).inject(g.scrollDiv, 'after');
        if(Browser.Engine.trident4 || Browser.Engine.trident5) {
            g.readonlyDiv.setStyle('position', 'relative');
        }
    }

    ,editable:function() {
        var g = this;
        if(g.readonlyDiv)g.readonlyDiv.setStyle('display', 'none');
        g.header().getElements('input[type=checkbox][disabled]').removeProperty('disabled');
        g.console().getElements('input[type=button][disabled]:not([fenye=true])').each(function(el) {
            g.disableConsoleBtn(el, false);
        });
    }

    ,getAllGridShowData:function(items, check) {
        var trs = [];
        if(!items)items = this.getExcelItems();
        var data = ($defined(check)) ? this.getCheckedData(check).trs : this.data();
        data.each(function(d, rowIndex) {
        	if(!$chk(d))return;
            if(d['status'] == 'delete')return;
            var tr = {'tds':{}};
            trs.push(tr);
            items.each(function(item) {
                var name = item.get('name');
                var type = item.get('type');
                var format = item.get('format');
                var v = d['tds'][name];
                if(v) {
                    v = v['value'];
                    if(!$defined(v))return;
                    //代码转名称 和 日期类型转换
                    if(format) {
                        v = sword_fmt.convertText(item, v).value;
                    } else if(type == 'date') {
                        v = this.getCalendar().getShowValue(item, v);
                    } else if(type == 'select') {
                    	if(item.get('showVBC')=="true"){
                    		var selectData = item.retrieve("selectData");
                    		var tmp = this.getSelect().dm2mc(item, v,null,selectData.data);  //todo  space没有传入，当级联下拉的时候会有bug
                            v = tmp['caption'];
                            if($type(tmp) == 'string') v = tmp;
                    	}else{
                            var tmp = this.getSelect().dm2mc(item, v);  //todo  space没有传入，当级联下拉的时候会有bug
                            v = tmp['caption'];
                            if($type(tmp) == 'string') v = tmp;
                    	}
                    } else if(type == 'pulltree') {
                        if(v.contains("code") && v.contains("caption")) {
                            var vs = v.split('|');
                            v = vs[1].split(',')[1];
                        } else {
                            var treeObj = $w(item.get('treename'));
                            var query = new Hash();
                            query.set(treeObj.options.cascadeSign.id, v);//数据应为code值
                            var node = treeObj.getTreeNode(query);
                            if(node) {
                                v = node.get('caption');
                            }
                        }
                    }
                    tr.tds[name] = {'value':v};
                } else if(type == 'rowNum') {
                	tr.tds[name] = {'value':this.getRowShowIndex(item)};
                }
            }, this);
        }, this);
        return {
            'sword':this.options.sword,
            'name' :this.options.name,
            'beanname':this.options.beanname,
            'trs' :trs
        };
    }
    ,getExcelItems:function() {
        return this.options.pNode.getChildren(">div[name]:not([console]):not([show=false]):not([type=checkbox]):not([type=radio]):not([type=button]):not([act])");
    }
    ,getExcelItem:function(name) {
        return this.options.pNode.getChildren(">div[name=" + name + "]:not([console]):not([show=false]):not([type=checkbox]):not([type=radio]):not([type=button]):not([act])");
    }
    ,getGridExcelInfo:function(check) {
        var items = this.getExcelItems();
        var showdata = this.getAllGridShowData(items, check);
        var d = {};
        var headerInfo = {
            'beanname':'',
            'sword':'SwordForm',
            'name' :this.options.name + "_" + 'headerInfo',
            'data' :d
        };
        var d2 = {};
        var headerIndex = {
            'beanname':'',
            'sword':'SwordForm',
            'name' :this.options.name + '_' + 'headerIndex',
            'data' :d2
        };
        items.each(function(item, i) {
            var name = item.get('name');
            d[name] = {'value':item.get('caption')};
            d2[i + ""] = {'value':name};
        }, this);
        return [showdata,headerInfo,headerIndex];
    }

    ,getAllNoDeleteGridData:function() {
        var d = this.getAllGridData();
        var trs = d.trs.filter(function(v) {
            if(v['status'] != 'delete')return true;
        });
        return {
            'sword':this.options.sword,
            'name' :this.options.name,
            'beanname':this.options.beanname,
            'trs' :trs
        };
    },
    _itemSwitch:function(name, type, options, row) {
    	if(!$chk(name) || !$chk(type))return;
        var updaterow = row || this.getCheckedRow();
        var cell = updaterow.getCell(name).set('type', type);
        if(options.css){
        	options.css.split(";").each(function(c,i){
        		cell.setStyle(c.split(":")[0], c.split(":")[1]);
        	})
        }
        cell.set(options);
        var cellclone = cell.clone(false).set('switched', 'true').inject(cell, 'before');
        cell.destroy();
        var itemEl = this.getExcelItem(name)[0];
        var cloneEl = itemEl.clone().set('type', type).inject(itemEl, 'before');
        cloneEl.set(options);
        this.addCellApi(cellclone, cloneEl, type);
        this.createCellEl(cloneEl, '', this.getRowNum(updaterow), this.getOneRowData(cellclone), cellclone);
        itemEl.destroy();
    }
    ,insertColumn:function(columnOptions, gridOptions) {//重新解析加载表格的方式，不适用大表格
        if($chk(columnOptions.name)) {
            var newItem = new Element('div').set(columnOptions);
            var lastItem = this.getLastShowItemEl();
            lastItem.setStyle('border-right', '');
            newItem.inject(lastItem, 'after').setStyle('border-right', 'none');
            this.options.sGrid_div.destroy();
            this.intiItems = false;
            this.options = $extend(this.options, gridOptions);
            this.initParam(this.options.pNode);
            if($chk(columnOptions.value)) {
                var rowDatas = this.options.gridData.trs;
                for(var i = 0; i < rowDatas.length; i++) {
                	if(!$chk(rowDatas[i]))continue;
                    var tds = rowDatas[i].tds;
                    tds[columnOptions.name] = {'value':columnOptions.value};
                }
            }
            this.initData(this.options.gridData);
        } else {
            swordAlert('请定义新增列的name属性!');
        }
    }
    ,getCurPageRowByCellValue:function(cellname, cellvalue) {
        var cell = this.dataDiv().getElement('div.sGrid_data_row_item_div[realvalue=' + cellvalue + '][name=' + cellname + ']');
        if(cell)return this.getRow(cell);
    }


    //自动收缩、展开
	,toggle:function(){

		if(this.collapseDiv.hasClass('x-tool-s')) {
			this.extendTable();
		}else{
			this.collapseTable();
		}

	}
	//收缩
	,collapseTable:function(){
		var toolbar = this.sGrid_div().getChildren('div[sword=SwordToolBar][bindto=' + this.options.name + ']')[0];
		if(toolbar)toolbar.setStyle("display", "none");

		this.scrollDiv.setStyle('display', 'none');
        if(this.options.showConsole == 'true')this.console().setStyle("display", "none");

        if(this.toolpanel)this.toolpanel.setStyle("display", "none");

        this.collapseDiv.set('title', '展开');
        this.collapseDiv.addClass("x-tool-s");
	}
	//展开
	,extendTable:function(){

        var toolbar = this.sGrid_div().getChildren('div[sword=SwordToolBar][bindto=' + this.options.name + ']')[0];
		if(toolbar)toolbar.setStyle("display", "");

		this.scrollDiv.setStyle("display", "");
        if(this.options.showConsole == 'true')this.console().setStyle("display", "");

        if(this.toolpanel)this.toolpanel.setStyle("display", "");

        this.collapseDiv.set('title', '收缩');
        this.collapseDiv.removeClass("x-tool-s");
	}
    ,setCellRuleMust:function(row,name){
    	this.setRule(row,name,"must");
    }
    
   ,setCellRule: function(row,cell,rule){
	    var name = cell.get('name');
	    this.setRule(row,name,rule);
    }
   ,setRule: function(row,name,rule){
	   if(!$chk(row))return;
	   var cell=row.getCell(name);
	   if(!$chk(cell))return;
   	   cell.set('rule', rule);
       var input = cell.getElement("input");
       if(input){this.vObj.clearElTip(input.set("rule",rule));input.destroy();cell.set('createInput','false')}
       this.updateCell(cell,cell.get("realvalue"),cell.get("text"));
       if(rule=='must'){
           var headerItem = this.options.sGrid_header_div.getElement("div[_for='"+name+"']");
           if(!headerItem.getElement("span")){
               var span=new Element("span",{'class':'red','text':'*'});
               span.inject(headerItem.getElement("div.sGrid_header_text_div"),"top");
           }
       }
   }
   ,isradioSetChecked :true
   ,radioSetChecked: function(cell){
	   this.isradioSetChecked = false;
	   if(!$chk(cell))return;
	   var cellName = cell.get('name');
	   var data = cell.get('data');
	   this.data().each(function(rd, i) {//todo 过滤数据的代码可以进行优化
           if(!this._inCache(i)) {
              var cellDs = rd['tds'][cellName];
              if(cellDs == undefined) {
            	  rd['tds'][cellName] = {}; //新建一个对象
                  cellDs = rd['tds'][cellName];
              }
              if(cellDs['value'] == '1'){
            	  if(cellDs['originValue'] == undefined) {//如果没被创建过原始值，使用value作为原始值
                      cellDs['originValue'] = cellDs['value'] || '';
                  }
            	  cellDs['value'] = '0';//更新cell的值为新的值
            	  if(data){
            		  cellDs['status'] = 'update';//更新cell 的状态
            		  rd['status'] = 'update';//更新cell 的状态
            	  }
              }
           }
       }, this);
	   
	   this.dataDiv().getChildren('div[status!="delete"][row]').each(function(row){
		  var c = row.getCell(cellName);
		  var inp = c.getElement('input');
		  if(!$chk(inp))return;
		  var v = inp.get('value');
		  if(v == "1"){
			  inp.set('value','0');
			  if(data){
				  var status = row.get('status');
				  if(status == 'insert')return;
				  if(!$chk(status)||status == 'update'){
					  this.updateCell(c, inp.get('checked') ? '0' : '0');
				  }
			  }
		  }
	   }.bind(this))
	   var input = cell.getElement('input');
	   input.set('value','1');
	   this.updateCell(cell, input.get('checked') ? '1' : '0');
	   this.isradioSetChecked = true;
   },
      setCellFocus : function(rownum, colname) {
   	    var childs = this.dataDiv().childNodes;
		var dlen = childs.length;
		var rownum = rownum - 1;
		if (rownum >= 0 && dlen != 0 && dlen >= rownum) {
			var ite = childs[rownum]
					.getElement('div.sGrid_data_row_item_div[name="' + colname
							+ '"]');
			var type = ite.get("type");
			if (type == "radio" || type == "checkbox") {
				ite.getElement("input[type=" + type + "]").set('checked',true);;
			} else {
				var ls = this.eDelegator._listener.get("click");
				var e = new Event();
				if (ls) {
					ls.each(function(l) {
								if (l['condition']
										.indexOf(ite.get("eventdele")) > 0) {
									if (l['args'])
										l['fn'](e, ite, l['args']);
									else
										l['fn'](e, ite);
								}
							}, this);
				}
			}
		}
	},formToRow:function(obj){
		var json = {};
		for(o in obj){
			json[o] = {'value':obj[o].value};
		}
		return {
			'tds':json
		};
	},objToForm:function(obj,fromName){
		var fd = {
			'sword':'SwordForm',
			'name' :fromName,
			'data' :{}
		};
		var json = {};
		for(o in obj.tds){
			json[o] = {'value':obj.tds[o].value};
		}

		fd['data'] = json;
		return fd;
	},
    gridToForm : function(dataObj,sGrid_data_row_div,e){
    	
        
    	var caption = this.options.caption||"";
	    var formName = "pop_panel_"+this.options.name+"_form";
	    var pop_panel = $(document.body).getElement("div[class='pop_panel']");
	    var pop_mask_div = $(document.body).getElement("div[class='pop_mask_div']");
	    var pop_panel_form="",pop_panel_form_item="",itemVal="",itemRule="",itemType="",itemName="",itemCpation="",i = 1,pNode="",itemDisable="",itemFormat="";
	    var pop_panel_table = new Element("div",{'class':'pop_panel_div'});
		var pop_panel_table_sbutton = $(document.body).getElement("input[class='pop_panel_sbutton']");
		
       	if(pop_panel_table_sbutton){
       		$(pop_panel_table_sbutton).destroy();
       		$(pop_panel_table_cbutton).destroy();
       	}
       	
	    pop_panel_table_sbutton = new Element("input",{'type':'button','value':'确定','class':'pop_panel_sbutton'}).inject(pop_panel_table);
	    pop_panel_table_cbutton = new Element("input",{'type':'button','value':'取消','class':'pop_panel_cbutton'}).inject(pop_panel_table);
	    
	    if(!pop_mask_div){
	    	pop_mask_div = 	new Element("div", {'class':'pop_mask_div'}).inject($(document.body));
	    	pop_mask_div.setStyle("height",$(document.body).getScrollSize().y);
	    	pop_panel =	new Element("div", {'class':'pop_panel'}).inject($(document.body));
	    	var w = this.options.openerWidth;
	    	if(w.indexOf("px")<1) w =  w+"px";
	    	pop_panel.setStyle("width",w)
	    }else{
			$(pop_panel.getElement("div[sword='SwordForm']")).destroy();
	    }
	    var onne = this.options.openerNoNextEvent||"";
	    
		pop_panel_form = new Element("div", {'sword':'SwordForm','name':formName,'caption':caption,'userdefine':'true','noNextEvent':onne,'vType':'intime'}).inject(pop_panel);
		if(caption!=""){
			pop_panel_form.set("panel","true");
		}
		var pop_panel_form_table='<table class="tab_form" border="0" cellpadding="0" cellspacing="0"><colgroup><col style="width: 16%"></col><col style="width: 16%"></col><col style="width: 16%"></col><col style="width: 16%"></col><col style="width: 16%"></col><col style="width: 16%"></col></colgroup><tr>'
		pNode = this.options.pNode; 
		var so = pc.getSelect();
		var co = pc.getCalendar();
		if(so.box&&so.box.get('display')=="true"){
			so.hide();
			if(!$(e.target).hasClass('sGrid_data_row_item_select')) {
				so.execGridOnFinished();
	         }
		}
		if(co.dateInput&&co.dateInput.get('show')=="true"){
			co.hide();
		}

    	sGrid_data_row_div.getElements(".sGrid_data_row_item_div").each(function(item,index){
    		var f = (i)/2+""; 
    		var tpl = this.options.pNode.getElements("div[class='sGrid_data_row_item_div']")[index];
			itemName = tpl.get("name");
			itemType = tpl.get("type") ||"label";
			itemCaption = (itemRule=="must" ? '<span class="red">*</span>' : '')  + tpl.get("caption")||"";
			itemDisable = tpl.get("disable")||"";
			itemFormat = tpl.get("format")||"";
			itemRule = item.get("rule")||"";
			itemNoView = tpl.get("noView")||"";
			
			if(!itemName) return;
			
			if(itemNoView=="true"||itemType=="checkbox"||itemType=="radio"||itemType=="rowNum"||itemType=="rowNumOnePage") return;
			if(itemType=="label"||itemType=="a" ||itemType=="select"||itemType=="pulltree"){
				itemVal = item.get("realvalue")||"";
			}else{
				itemVal = item.get("showValue")||"";
			}
			
			if(itemType=="a"){
				var oc = tpl.get("_onclick")||"";
			 	pop_panel_form_item += '<th>'+itemCaption+'</th><td><a href="#a" onclick=\"'+oc+'\">'+itemVal+'</a></td>';
			}else if(itemType=="userdefine"){
				pop_panel_form_item += '<th>'+itemCaption+'</th><td>'+item.innerHTML+'</td>';
			}else if(itemType=="pulltree"){
				pop_panel_form_item += '<th>'+itemCaption+'</th><td><div name=\"'+item.get("treename")+'\" disable=\"'+itemDisable+'\" type=\"'+itemType+'\" rule=\"'+itemRule+'\" defValue=\"'+item.get("title")+'\" defRealvalue=\"'+itemVal+'\"></div></td>';
			}else if(itemType=="select"){
				var df =  tpl.get("dataFilter")||"",dn = tpl.get("dataName")||"",sc = tpl.get("sbmitcontent")||"",pd = tpl.get("popdisplay")||"",ind = tpl.get("inputdisplay")||"";
				if(item.get("code")&&item.get("caption")&&dn==""){
					itemVal = "code,"+item.get("code")+"|caption,"+item.get("caption");
				}
					pop_panel_form_item += '<th>'+itemCaption+'</th><td><div name=\"'+itemName+'\" dataFilter=\"'+df+'\" sbmitcontent=\"'+sc+'\" popdisplay=\"'+pd+'\" inputdisplay=\"'+ind+'\"  disable=\"'+itemDisable+'\" type=\"'+itemType+'\" rule=\"'+itemRule+'\" dataName=\"'+dn+'\" defValue=\"'+itemVal+'\"></div></td>';
			}else{
				var ob = tpl.get("_onBlur")||"";
				pop_panel_form_item += '<th>'+itemCaption+'</th><td><div name=\"'+itemName+'\"  onBlur=\"'+ob+'\"  format=\"'+ itemFormat+'\" disable=\"'+itemDisable+'\" type=\"'+itemType+'\" rule=\"'+itemRule+'\" defValue=\"'+itemVal+'\"></div></td>';
			}
    	 	
    	 	if(f.indexOf(".")==-1){
    	 		pop_panel_form_item +=  "</tr>";
	    	 			if(index<sGrid_data_row_div.getElements("div").length){
	    					pop_panel_form_item += "<tr>"	 
	    				}
    				}
	    	 	i++;
	    	 	
    	}.bind(this)); 
    	
    	pop_panel_form_table += pop_panel_form_item +"</table>"; 
    	pop_panel_form.set("html",pop_panel_form_table)  ;

    	pop_panel_table_sbutton.addEvent('click', function() {
    		if(!$w(formName).validate()) return;
	    	var rowData = this.formToRow($w(formName).getSubmitData().data);
			var row=$w(this.options.name).getCheckedRow();
			var treeDivEl = row.getElement("[type='pulltree']");
			if(treeDivEl){
				var treeName=treeDivEl.get("treename"),treedivname=treeDivEl.get("name");
				rowData.tds[treedivname] = rowData.tds[treeName];
			}
			$w(this.options.name).updateRow(row,rowData)   
			$(pop_panel).destroy();
			$(pop_mask_div).destroy();
            pc.widgets.erase(formName);
    	}.bind(this));
    	
		pop_panel_table_cbutton.addEvent('click', function() {	
			$(pop_panel).destroy();
			$(pop_mask_div).destroy();
            pc.widgets.erase(formName);
    	}.bind(this));
    	
		pop_panel.addEvent('keydown', function(e) {	
			if(e.code==27){
				$(pop_panel).destroy();
				$(pop_mask_div).destroy();
                pc.widgets.erase(formName);
			}
		
    	}.bind(this));
	    pop_panel_table.inject(pop_panel);
	    pc.initWidgetParam(pop_panel_form);
		pc.initEventForForm();
	
	    var l =  ($((self||window).document.body).getSize().x - pop_panel.getSize().x)/2;
		var t = ($((self||window).document.body).getSize().y - pop_panel.getSize().y)/3+getScrollTop();
		pop_panel.setStyles({'left': l,'top':t});
	
		var ref = this.options.rowEditFinish;
		if(ref) this.getFunc(ref)[0]();
		if($('formTooltipDivPNode'))$('formTooltipDivPNode').destroy();

        var dragObj = new Drag(pop_panel, {
            snap :5,
            limit: {
                x:[0,$(document.body).getWidth()- pop_panel.getWidth()],
                y:[0,$(document.body).getHeight()-pop_panel.height-20]
            },
            handle: pop_panel
            //
        });
    }

});

function getScrollTop(){
	var doctemp=window.document;
	var scrollTop=0;
	if (doctemp.body && doctemp.body.scrollTop){
		scrollTop=doctemp.body.scrollTop;
	}else if (doctemp.documentElement && doctemp.documentElement.scrollTop){
		scrollTop=doctemp.documentElement.scrollTop;
	}
		return scrollTop; 
}
var DelayedTask = function(fn, scope, args) {
    var me = this,
            id,
            call = function() {
                clearInterval(id);
                id = null;
                fn.apply(scope, args || []);
            };
    me.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };
    me.cancel = function() {
        if(id) {
            clearInterval(id);
            id = null;
        }
    };
};
var SwordSort = new Class({
    Implements : [Events,Options],
    name:"SwordSort",
    options:{
        sortName:        "",//排序列name
        type:          "string",//比较的数据类型
        sortflag:          "asc",//默认升序
        widget:         "table",//目前支持table--存储满足表格的数据,array--存储普通数据
//        dataStr:        null, //数组数据
        onSortBegin:    null,//排序前执行
        onSortEnd:      null//排序后执行
    },
    initialize:function(options) {
        this.setOptions(options);
    },
    initParam: function(node) {

    },
    initData: function() {

    } ,

    //排序并显示
    sort: function(data, options) {
        this.setOptions(options);
        this.setData(data);

        //获取数据
        if($chk(this.options.dataStr)) {
            this.setData(JSON.decode(this.options.dataStr));
        }
        if(!$chk(this.getData()))
            return [];
        //排序前执行
        this.fireEvent('onSortBegin', this.data);
        //排序
        this.getData().sort(this.compare.bind(this));
        //排序后执行
        this.fireEvent('onSortEnd', this.data);
        return this.getData();
    },
    //比较函数
    compare: function(obj1, obj2) {
        var vValue1 = this.getValue(obj1);
        var vValue2 = this.getValue(obj2);
        if(vValue1 < vValue2) {
            return (this.options.sortflag == "asc") ? -1 : 1;
        } else if(vValue1 > vValue2) {
            return (this.options.sortflag == "asc") ? 1 : -1;
        }
        return 0;

    },

    //获取比较值
    getValue: function(obj) {
        var data = "";
        if(this.options.widget == "table") {
            if(!$chk(this.options.sortName)) {
                swordAlert("未指定排序列！！");
                return false;
            }
            data = obj["tds"][this.options.sortName];
            if(data) {
                data = data["value"];
            } else {
                data = '';
            }

        }
        if(this.options.widget == "array")
            data = obj;
        //数据转换
        switch(this.options.type.toLowerCase()) {
            case "int":
                return parseInt(data, 10) || 0;
            case "float":
                return parseFloat(data, 10) || 0;
            case "bool":
                return data === true || String(data).toLowerCase() == "true" ? 1 : 0;
            case "string":
            default:
                return data ? data.toString() : "";
        }
    },

    setData: function(data) {
        this.data = data;
    },
    getData: function() {
        return this.data;
    }
});
