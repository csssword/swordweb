/**
 * fileUpload的扩展类
 */
fileUpload.implement({
    options : {
        pNode : null,
        name : null,
        rule : null,
        css : null,
        'edit': null,
        'download':null,
        'delete':null,
        doc :null
    },
    uploadButton : null,
    uploadContent : null,
    uploadTempContent : null,
    uploadLoading : null,
    selectFile : null,
    uploadForm : null,
    //当前操作的模式，如果为0,表示上传，如果为1,表示更新。
    mode:null,
    initParam : function(item) {
        //设置页面title为随机数
        document.title = Math.random();
        //
        this.iframeKey = this.iframeKey + "" + this.options.name;
        var wrap = new Element('div', {
            'class' : 'uploadwrap swordform_item_oprate',
            'widget' : 'true',
            'widgetGetValue' : 'true',
            'name' : this.options.name
        }).inject(this.options.pNode);
        this.uploadButton = new Element('div').inject(wrap);
        var btnDiv = new Element('div', {
            'class' : 'x-form-file-wrap',
            'styles' : {
                'width' : '76px'
            }
        }).inject(this.uploadButton);
        if (this.options.doc != null && this.options.doc == 'true') {
            this.uploadForm = new Element('form', {'method' : 'post','encoding' : 'multipart/form-data','enctype' : "multipart/form-data",           'target' : this.iframeKey
            }).inject(btnDiv);
            this.selectFile = new Element('input', {
                'type' : 'button',
                'name' : 'uploadFile',
                'size' : '1000',
                'value': '请选择文件',
                'events' : {
                    'click' : function() {
                        this.mode = 0;
                        var xmlstr = "<Field Edit='1'></Field>";
                        oScanFile.scanfile(xmlstr, 'dso', this);
                    }.bind(this)
                }
            }).inject(btnDiv);
        } else {
            this.uploadForm = new Element('form', {'method' : 'post','encoding' : 'multipart/form-data','enctype' : "multipart/form-data",           'target' : this.iframeKey
            }).inject(btnDiv);
            this.selectFile = new Element('input', {
                'type' : 'file',
                'name' : 'uploadFile',
                'size' : '1',
                'class' : 'x-form-file',
                'events' : {
                    'change' : this.upload.bind(this)
                }
            }).inject(this.uploadForm);
            new Element('input', {
                'type' : 'button',
                'value' : '请选择文件'
            }).inject(btnDiv);
        }
        //显示上传的文件列表
        this.uploadContent = new Element('div', {
            'class' : 'fi-button-msg',
            'styles' : {
                'visibility' : 'visible',
                //'height':this.selectFile.getHeight(),//todo 此处高度需要动态
                'height':'200px',
                'position' : 'static',
                'left' : 'auto',
                'z-index' : '1'
                //'display' : 'none'
            }
        }).inject(wrap);
        //如果自定义了Grid节点。则将内容移动到uploadContent内部
        if ($defined(item.getFirst())) {
            item.getFirst().set('lazy','false').inject(this.uploadContent);
            //this.gridObject = pageContainer.getWidget(this.options.name);
            this.userDefine = true;
        } else {
            this.initFileGrid();

        }
        this.createGrid();
        //提示等待的div
        this.uploadLoading = new Element('div', {
            'id' : 'loadingdiv',
            'styles' : {
                'position' : 'absolute',
                'z-index' : '99999',
                'background' : '#99bbe8',
                'text-align' : 'center',
                'display' : 'none'
            }
        }).inject(wrap);
        var loadchildDiv = new Element('div', {
            'styles' : {
                'margin' : '0px auto',
                'width' : '60px',
                'padding' : '0px'
            }
        }).inject(this.uploadLoading);
        loadchildDiv.set('text', '请稍后');
        var childDiv = new Element('div', {
            'class' : 'x-form-upload-loading'
        }).inject(loadchildDiv);
        return this;
    },
    //当前编辑的行
    editRow:null,
    initFileGrid:function() {
        var grid = new Element('div', {'sword':'SwordGrid','fenye':'false','name':this.options.name,'showHeader':'false'}).inject(this.uploadContent);
        grid.innerHTML += "<div name='title' caption='文件名' x='150'></div>";
        var dataX = 150;
        if (this.options.doc != null && this.options.doc == 'true') {
            //TODO 等待文档处理器修改,添加size属性
        } else {
            grid.innerHTML += "<div name='size' caption='文件大小' x='100'></div>";
            dataX+=100;
        }
        grid.innerHTML += "<div name='domain' caption='domain' show='false'></div>" +
                          "<div name='filename' caption='filename'  show='false'></div>";

        if (this.options['delete'] == "true") {
            grid.innerHTML += "<div name='delete' caption='删除'   act='deleting' x='50' ></div>";
            dataX+=50;
        }
        if (this.options['download'] == "true") {
            grid.innerHTML += "<div name='download' caption='下载' type='button' x='50' ></div>";
            dataX+=50;
        }
        if (this.options['edit'] == "true") {
            grid.innerHTML += "<div name='edit' caption='编辑'   type='button' x='50' ></div>";
            dataX+=50;
        }
        grid.set({"dataX":dataX,'dataY':150});
    }
    //创建列表对象。
    ,createGrid:function(bz) {
        //todo 此处构造表格
        pageContainer.initSwordTag(this.uploadContent);
        this.gridObject = pageContainer.getWidget(this.options.name);
        this.gridObject.initData(pageContainer.getResData(this.options.name, pageContainer.pinitData));
        this.gridObject.addEvent('onAfterCreateRow', function(data, row) {
            if (row.get("status") == "insert") {
                //if($defined(row.getCell("download")))row.getCell("download").setStyle('visibility','hidden');
                //if($defined(row.getCell("edit")))row.getCell("edit").setStyle('visibility','hidden');
                if ($defined(row.getCell("download")))row.getCell("download").setStyle('display', 'none');
                if ($defined(row.getCell("edit")))row.getCell("edit").setStyle('display', 'none');
            } else {
                //todo
            }
            if ($defined(row.getCell("download"))) {
                row.getCell("download").addEvent('click', this.download.bind(this, data));
            }
            if ($defined(row.getCell("delete"))) {
                row.getCell("delete").addEvent('click', this.deleted.bind(this, data));
            }
            if ($defined(row.getCell("edit"))) {
                row.getCell("edit").addEvent('click', this.editFile.bind(this, [data,row]));
            }
        }.bind(this));
    },
    //删除
    deleted:function(data) {
        //todo 不用做任何处理，表格已经做了处理
    },
    //下载文件
    download : function(data) {
        this.loading();
        this.createIFrame();
        this.uploadForm.set('action',
                "1.HttpFileServlet?method=downLoad&fileName="
                        + data.getValue("filename") + "&domain="
                        + data.getValue("domain") + "&title="
                        + data.getValue("title") + "&path="
                        + data.getValue('path'));
        this.uploadForm.submit();
        this.endLoding();
    },
    //处理提交文件
    upload : function() {
        this.loading();
        this.createIFrame();
        var nm = this.selectFile.get('value');
        var title = nm.substring(nm.lastIndexOf("\\") + 1, nm.length);
        var suffix = title.substring(title.lastIndexOf(".") + 1, title.length);
        var fileName = title.substring(0, title.lastIndexOf("."));
        this.uploadForm.set('action', "1.HttpFileServlet?method=webUpload&suffix=" + suffix + "&fileName=" + fileName);
        this.uploadForm.submit();
    },
    //文件列表的表格对象
    //在内容层增加一条记录
    addFile : function(file) {
        this.gridObject.insertRow(file);
        //pageContainer.getWidget(this.options.name).insertRow(file);
    },
    //创建提交的Iframe
    createIFrame : function() {
        if (!$defined($(this.iframeKey))) {
            var fra = new Element('iframe', {
                'id' : this.iframeKey,
                'name' : this.iframeKey,
                'src' : '',
                'styles' : {
                    'display' : 'none',
                    'width' : '300px',
                    'height' : '400px'
                }
            }).inject(document.body);
            fra.addEvent('load', this.dealResData.bind(this));
        }
    },
    //处理返回数据
    /**
     * <Files> <File filename="fe40af18-8624-11de-a806-a12050dc41e6.txt"
     * (文件的uuid名称) title="xml描述.txt"(文件 的显示名称) domain = "sw"
     * (存储文件的文件域，同FileServiceConfig.xml中的fileDomain名称匹配) state
     * ="add/delete/update"(文件的状态标识，add--新增，delete-删除，update-更新) size =
     * ""(文件大小，可选) ></File> </Files>
     */
    oDom : null,
    rootFile : null,
    /**
     * 获取文件上传的xml串
     */
    getValue : function() {
        return (this.rootFile == null || this.rootFile.childNodes.length == 0) ? ""
                : $xml(this.rootFile);
    },
    /**
     * 处理iframe的返回值
     */
    dealResData : function() {
        this.loading();
        try {
            var res = $(this.iframeKey).contentWindow.getReturnValue();

            if (res.tds.errorMessage.value == null || res.tds.errorMessage.value == '') {
                this.addFile(res);
            } else {
                alert(res.tds.errorMessage.value);
                this.endLoding();
                return;
            }

            /*
             if (res.errorMessage == null || res.errorMessage == '') {
             if (!$defined(this.oDom) && !$defined(this.rootFile)) {
             this.oDom = $dom();
             this.rootFile = this.oDom.createElement("Files");
             }
             var returnSize = this.setupSize(parseInt(res.size));
             // todo 此处缺少对异常情况的处理。暂时按正确的处理
             var File = this.rootFile.ownerDocument.createElement("File");
             File.setAttribute('filename', res.uuid);
             File.setAttribute('title', res.fileName);
             File.setAttribute('domain', res.domain);
             File.setAttribute('state', 'add');
             File.setAttribute('size', returnSize);//todo
             this.rootFile.appendChild(File);
             this.addFile(File);
             this.endLoding();
             } else {
             alert(res.errorMessage);
             this.endLoding();
             }
             */
            this.endLoding();
        } catch (e) {
            this.endLoding();
            return;
        }
    },
    /********************************************************/
    /******        以下是调用文档处理器的接口       *********/
    /********************************************************/
    //编辑文件
    /*
     <Field Edit='1' Name='wjm'>
     <Files Domain='filetemppath' Path=''>
     <File  Title='' Index='1' Type='dso'  Name='83b572c8-913e-11de-a740-bd85fcdfb826.doc'/>
     </Files>
     </Field>
     */
    editFile:function(data, row) {
        var xmlstr = "<Field Edit='" + data.getValue('edit') + "'>";
        xmlstr += "<Files Domain='" + data.getValue('domain') + "' Path='" + data.getValue('path') + "'>";
        xmlstr += "<File Title='" + data.getValue('title') + "' Type='dso' Name='" + data.getValue('filename') + "' />";
        //增加添加书签的功能
         try{
       		//prompt("edit==",data.getValue('edit'));
       		if(data.getValue('edit')){
       		bkmark = initbkmark();
       		xmlstr+=bkmark;
       		}
         }catch(e){
         }
        xmlstr+="</File></Files></Field>";
        this.mode = 1;
        oScanFile.scanfile(xmlstr, 'dso', this);
        this.editRow = row;
        this.editRow.store('FileData', data);
    },

    //新增加一个文件,只能打开一个Word文件
    addNewFile:function() {

    },
    //更新状态
    //<Files>
    //   <File Title="" Index="1" Type="dso" Replaced="1" FileTempPath="483e70d0-92ae-11de-a6fb-ed053207ba70.doc" />
    //</Files>
    updateStatus:function(reDom) {
        var Files = reDom.selectSingleNode("/Files");
        var File = reDom.selectSingleNode("/Files/File");
        if (this.mode == 0) {
            var filename = File.getAttribute('FileTempPath');
            var suffix = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
            var value = "附件[" + this.gridObject.getInsertRows().length + "]." + suffix;
            var data = {tds:{
                'filename':{'value':File.getAttribute('FileTempPath')},
                'domain':{'value':""},
                'path':{'value':Files.getAttribute('Path')},
                'title':{'value':value}
            }};
            this.addFile(data);
        } else if (this.mode == 1) {
            var data = {tds:{
                'filename':{'value':File.getAttribute('FileTempPath')},
                'oldfilename':{'value':this.editRow.retrieve('FileData').getValue('filename')},
                //TODO:编辑文件后，将domain修改为临时文件域
                //              'domain':{'value':Files.getAttribute('Domain')},
                'domain':{'value':'filetemppath'},
                'size':{'value':''},
                'path':{'value':Files.getAttribute('Path')},
                'title':{'value':File.getAttribute('Title')}
            }};
            this.editRow.update(data);
        }
        delete this.editRow;
    }
});
/*********************************************************************************/
/***************       以下是文档处理器原有JS类         **************************/
/*********************************************************************************/
var oScanFile = new clsScanFile();
if (Browser.trident) {
    var scanfileDom = new ActiveXObject("MSXML2.DOMDocument");
    scanfileDom.async = false;
}
var fileinfo;
function clsScanFile() {
    this.scanfile = clsScanFile$scanfile;
    this.refreshctrl = clsScanFile$refreshctrl;
    //文件上传组件对象的引用
    this.refferObj = null;
}
//打开文档处理器接口
//fileDomain   是一个xml字符串，格式省
//FileType    打开的类型，dso:正常打开， scan:扫描
//Obj         文件上传对象的引用
function clsScanFile$scanfile(fileDomain, FileType, Obj) {
    //todo 更新文件上传组件的对象
    this.refferObj = Obj;
    //alert(top.document.title)
    //todo scanfile.htm 页面放在swordweb之外的路径   
    window.open(jsR.rootPath + "scanfile.htm?filedm=" + fileDomain + "&FileType=" + FileType + "&PageTitle=" + document.title + "&ApplicationTitle=" + top.document.title);
}
//文档处理器的回调函数
//<Files>
//   <File State="add" Title="" Index="1" Type="dso" Replaced="1" FileTempPath="483e70d0-92ae-11de-a6fb-ed053207ba70.doc" />
//</Files>
function clsScanFile$refreshctrl() {
    //todo 此处是根据文档处理器的返回值改变文件列表的状态
    //todo 1.如果是编辑之后返回，则将行置为更新状态
    //todo 2.如果是扫描之后返回，则新增一行
    if ($defined(fileinfo)) {
        var reDom = new ActiveXObject("Microsoft.XMLDOM");
        reDom.loadXML(fileinfo);
        this.refferObj.updateStatus(reDom);
    }
}
