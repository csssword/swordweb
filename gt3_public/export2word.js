var $report = (function () {
    var wordObj = null;
    /*私有方法 获取全路径*/
    function getRootPath() {
        var location = document.location;
        if("file:" == location.protocol) {
            var str = location.toString();
            return str.replace(str.split("/").reverse()[0], "");
        }
        var pathName = location.pathname.split("/");
        return location.protocol + "//" + location.host + "/" + pathName[1] + "/";
    }

    /*私有方法 获取DsoFramer对象*/
    function getwordObj(oframeid, wordpath,orientLandscape) {
        if(wordObj == null) {
            wordObj = document.getElementById(oframeid);
            if(wordObj == null || wordObj.Caption != "Office Framer Control") {
                alert("加载组件出错，请先注册组件");
                return;
            }
            wordObj.Titlebar = false;
            wordObj.Toolbars = false;
            wordObj.Menubar = false;
            wordObj.open(getRootPath() + wordpath, true);
            var orientation = wordObj.ActiveDocument.PageSetup.Orientation;
            if(orientLandscape&&orientation!=1){
                wordObj.ActiveDocument.PageSetup.TogglePortrait();
            }else if(!orientLandscape&&orientation!=0){
            	wordObj.ActiveDocument.PageSetup.TogglePortrait();
            }
            wordObj.ActiveDocument.Protect(2);
        }
        return wordObj;
    }

    /*私有方法 根据名称替换书签*/
    function replaceBookmark(strName, content, type) {
        try {
            wordObj.ActiveDocument.Unprotect();
        } catch(e) {
        }
        if(wordObj.ActiveDocument.BookMarks.Exists(strName)) {
            if(type != null && type == "pic") {//图片
                var objDoc = wordObj.ActiveDocument.BookMarks(strName).Range.Select();
                var objSelection = wordObj.Selection;
                objSelection.TypeParagraph();
                var objShape = objSelection.InlineShapes.AddPicture(getRootPath() + content);
            }
            else {
                wordObj.ActiveDocument.BookMarks(strName).Range.Select();
                wordObj.ActiveDocument.Application.selection.Text = content;
            }
        }
        wordObj.ActiveDocument.Protect(2);
    }

    function exitPreview() {
        wordObj.PrintPreviewExit();
    }

    function baseVoListObj() {
        this.singlevo = null;
        this.volist = [];
        this.cols = [];
        this.captions = [];
        this.widths = [];
    }

    /*私有方法 删除所有书签*/
    function clearAllBookMarksValue() {
        while(wordObj.ActiveDocument.Bookmarks.Count != 0) {
            wordObj.ActiveDocument.Bookmarks(1).Delete();
        }
    }

    return {

        //	接口方法 第一个参数可以接收数组 或者是对象，第二个参数是要生成的form的 名字
        jsonToForm : function (json, name) {

            if('array' == $type(json)) {
                json.each(function(v, i) {
                    createOneForm(v);
                });
            } else if('object' == $type(json)) {
                createOneForm(json);
            } else {
                return false;
            }
            return true;
            function createOneForm(oneForm) {
                var form = new Element('form', {
                    'id':name,
                    'name':name,
                    'styles':{'display':'none'}
                }).inject(window.document.body, 'bottom');
                for(e in oneForm) {
                    var value = $defined(oneForm[e].value) ? oneForm[e].value : oneForm[e];
                    value = value || '';
                    new Element('textarea', {
                        'name':e,
                        'text': value
                    }).inject(form, 'bottom');
                }
            }

        },
        //	接口方法 合并form类型的JSON对象，第一个参数为将被合并的对象，第二个参数是要将第一个参数合并的目标对象，如果两个对象中存在相同key的值，第二个参数中的值将被第一个覆盖。
        mergeJsonForm : function (des, src) {
        	if('object' == $type(des)&&'object' == $type(src)){
        		for(e in des){
        			src[e] = des[e];
            	}
        	}else{
        		alert("请输入正确的表单数据");
        	}
        	
        },

        /*
         test : function(){
         try{wordObj.ActiveDocument.Unprotect();}catch(e){}

         wordObj.ActiveDocument.Select();
         wordObj.ActiveDocument.Application.selection.Copy();
         wordObj.ActiveDocument.Application.selection.Collapse(0);
         //clearAllBookMarksValue();
         alert(wordObj.ActiveDocument.Bookmarks.Count);
         wordObj.ActiveDocument.Application.selection.MoveEnd();
         wordObj.ActiveDocument.Application.selection.InsertBreak();
         wordObj.ActiveDocument.Application.selection.Paste();
         alert(wordObj.ActiveDocument.Bookmarks.Count);

         },
         */
        /*公共方法  批量生成*/
        batchprint:function(volistarray, oframeid, wordpath, beforeprint, afterprint) {
            if(beforeprint) beforeprint.call();
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            exitPreview();
            var len = volistarray.length,i = 0;
            wordObj.ActiveDocument.Select();
            wordObj.ActiveDocument.Application.selection.Copy();
            for(i; i < len; i++) {
                if(i == 0) {
                    this.replaceBookmark(volistarray[i]);
                }
                try {
                    wordObj.ActiveDocument.Unprotect();
                } catch(e) {
                }
                clearAllBookMarksValue();
                if(i != 0) {
                    wordObj.ActiveDocument.Select();
                    wordObj.ActiveDocument.Application.selection.Collapse(0);
                    wordObj.ActiveDocument.Application.selection.MoveEnd();
                    wordObj.ActiveDocument.Application.selection.InsertBreak(2);
                    wordObj.ActiveDocument.Application.selection.Paste();
                    this.replaceBookmark(volistarray[i]);
                }
            }
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
            if(afterprint) afterprint.call();
        },

        /*公共方法  批量生成*/
        batchBuild:function(volistarray, oframeid, wordpath, beforeprint, afterprint) {
            if(beforeprint) beforeprint.call();
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            exitPreview();
            var len = volistarray.length,i = 0;
            wordObj.ActiveDocument.Select();
            wordObj.ActiveDocument.Application.selection.Copy();
            for(i; i < len; i++) {
                if(i == 0) {
                    this.replaceBookmark(volistarray[i]);
                }
                try {
                    wordObj.ActiveDocument.Unprotect();
                } catch(e) {
                }
                clearAllBookMarksValue();
                if(i != 0) {
                    wordObj.ActiveDocument.Select();
                    wordObj.ActiveDocument.Application.selection.Collapse(0);
                    wordObj.ActiveDocument.Application.selection.MoveEnd();
                    wordObj.ActiveDocument.Application.selection.InsertBreak(2);
                    wordObj.ActiveDocument.Application.selection.Paste();
                    this.replaceBookmark(volistarray[i]);
                }
            }
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
            if(afterprint) afterprint.call();
        },
        /*公共方法  关闭*/
        close :function() {
        	var box = window.parent[window.name];
        	if($chk(box))box.close();
        	else  window.close();
        },
        /*公共方法  根据表格模板构造表格*/
        replaceBookmarkbuildtable:function(volist) {
            exitPreview();
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            var firstbookmark = volist.cols[0];
            if(wordObj.ActiveDocument.Bookmarks.Exists(firstbookmark)) {
                var colindex = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Cells(1).ColumnIndex;
                var rowindex = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Cells(1).RowIndex;
                var colcount = volist.cols.length;
                var rowcount = volist.volist.length;

                var currenttable = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Tables(1);
                currenttable.Cell(rowindex, colindex).Select();
                var i = 0,j = 0;
                for(i; i < rowcount - 1; i++) {
                    wordObj.ActiveDocument.Application.selection.InsertRowsAbove();
                }
                var temprc = rowcount + rowindex;
                var tempcc = colcount + colindex;

                var m = 0,n = 0;
                for(i = rowindex; i < temprc; i++) {
                    for(j = colindex; j < tempcc; j++) {
                        var temptext = volist.volist[m][volist.cols[n]];
                        currenttable.Cell(i, j).Range.InsertAfter(temptext);
                        //currenttable.Cell(i,j).Range.InsertAfter((i)+","+(j));
                        n += 1;
                    }
                    n = 0;
                    m += 1;
                }
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
        },
        
        /*公共方法  根据表格模板构造表格*/
        replaceBookmarkByGridData:function(gridData,keyList) {
            if(!gridData||typeof gridData != "object"){
            	alert("请输入正确的表格数据");
            	return;
            }
            exitPreview();
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            if(!keyList){
            	keyList = {};
            	var tds = gridData.trs[0].tds;
            	var n=0;
            	for(var i in tds) {
            		keyList[n] = i;
            		n=n+1;
                }
            }
            var firstbookmark = keyList[0];
            if(wordObj.ActiveDocument.Bookmarks.Exists(firstbookmark)) {
                var colindex = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Cells(1).ColumnIndex;
                var rowindex = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Cells(1).RowIndex;
                var colcount = keyList.length;
                var rowcount = gridData.trs.length;

                var currenttable = wordObj.ActiveDocument.Bookmarks(firstbookmark).Range.Tables(1);
                currenttable.Cell(rowindex, colindex).Select();
                var i = 0,j = 0;
                for(i; i < rowcount - 1; i++) {
                    wordObj.ActiveDocument.Application.selection.InsertRowsAbove();
                }
                var temprc = rowcount + rowindex;
                var tempcc = colcount + colindex;

                var m = 0,n = 0;
                for(i = rowindex; i < temprc; i++) {
                    for(j = colindex; j < tempcc; j++) {
                    	var td = gridData.trs[m].tds[keyList[n]];
                    	var temptext = "";
                    	if($chk(td))temptext = td.value;
                        currenttable.Cell(i, j).Range.InsertAfter(temptext);
                        n += 1;
                    }
                    n = 0;
                    m += 1;
                }
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
        },
        /*公共方法 初始化*/
        init:function(oframeid, wordpath,orientLandscape,customBars) {
  			var box = window.parent[window.name];
//        		toolbar  = new Element('div', {name:'printBarButton',sword:'SwordToolBar',showType:'mini'});
      		 if(!$chk(box)){
        		var installPrint = new Element('div', {name:'installPrint',type:'print',caption:'打印',onclick:'$report.installPrint()',enabled:'true'});
        		var print = new Element('div', {name:'print',type:'print',caption:'快速打印',onclick:'$report.print()',enabled:'true'});
        		var printpreview = new Element('div', {name:'printpreview',type:'print',caption:'打印预览',onclick:'$report.printpreview()',enabled:'true'});
        		var leftMargin  = new Element('div', {name:'leftMargin',type:'edit',caption:'左边距',onclick:'$report.leftMargin()',enabled:'true'});
        		var rightMargin = new Element('div', {name:'rightMargin',type:'edit',caption:'右边距',onclick:'$report.rightMargin()',enabled:'true'});
        		var topMargin = new Element('div', {name:'topMargin',type:'edit',caption:'上边距',onclick:'$report.topMargin()',enabled:'true'});
        		var bottomMargin = new Element('div', {name:'bottomMargin',type:'edit',caption:'下边距',onclick:'$report.bottomMargin()',enabled:'true'});
        		var orientation = new Element('div', {name:'orientation',type:'edit',caption:'纸张方向',onclick:'$report.changeOrientation()',enabled:'true'});
        		var lineSpacing = new Element('div', {name:'lineSpacing',type:'edit',caption:'行间距',onclick:'$report.changeLineSpacing()',enabled:'true'});
        		var close = new Element('div', {name:'close',type:'close',caption:'退出',onclick:'$report.close()',enabled:'true'});
        		var toolbar  = new Element('div', {name:'printBarButton',sword:'SwordToolBar'});
        		$(toolbar).grab(installPrint);
      		    $(toolbar).grab(print);
        		$(toolbar).grab(printpreview);
        		$(toolbar).grab(leftMargin);
        		$(toolbar).grab(rightMargin);
        		$(toolbar).grab(topMargin);
        		$(toolbar).grab(bottomMargin);
        		$(toolbar).grab(orientation);
        		$(toolbar).grab(lineSpacing);
        		if($chk(customBars)){
        			for(var i=0;i<customBars.length;i++){
  	      			$(toolbar).grab(customBars[i]);
  	    		}
        		}
      		    $(toolbar).grab(close);
        		$(document.body).grab(toolbar);
        		pc.initWidgetParam(toolbar);
        		pc.firePIOnDataInit();
         		var brs = document.getElements('br');
        		for(var i=0;i<brs.length;i++){
        			brs[i].destroy();
        		}
        		var inps = document.getElements('input');
        		for(var i=0;i<inps.length;i++){
        			inps[i].destroy();
        		}
        		
        		var winheight = screen.availHeight;
            	var winwidth = screen.availWidth-5;
            	var sUserAgent = navigator.userAgent;
            	var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            	if (isWin2003) winheight = winheight - 40
                if(Browser.Engine.trident4)winheight = winheight-80-30;
                else winheight = winheight-50-30;

                pc.getMask().mask(document.body);
         		if($(oframeid))$(oframeid).parentNode.removeChild($(oframeid));
            	var div=document.createElement("div");
                var codes=[];  
                codes.push('<object classid="clsid:00460182-9E5E-11d5-B7C8-B8269041DD57" CODEBASE="/gt3_public/ocx/dsoframer.ocx" id="'+oframeid+'" width="100%" height="'+winheight+'"px">');
                codes.push('<param name="BorderStyle" value="1">');
                codes.push('<param name="TitlebarColor" value="52479"> ');
                codes.push('<param name="TitlebarTextColor" value="0">');
                codes.push('<param name="Menubar" value="0">'); 
                codes.push('</object> ');
                 
                div.style.cssText="display:none;"
                div.innerHTML=codes.join("");
                var dso =div.removeChild(div.getElementsByTagName("object")[0]);
                document.body.appendChild(dso);
                div=null;
                setTimeout("$report.lazyWidth()",10);
               }
            return getwordObj("oframe", wordpath,orientLandscape);
        },
        lazyWidth:function(){
    		wordObj.ActiveDocument.GoTo(11,0,0).Select();//保证光标在最上面
        	pc.getMask().unmask();
        },
        /*公共方法 打印预览*/
        printpreview : function () {
            wordObj.Titlebar = false;
            try {
                var officeVer = wordObj.ActiveDocument.Application.Version;//获取本地word版本
                if(officeVer!=11.0)wordObj.Toolbars = true;
                wordObj.Menubar = false;
                wordObj.PrintPreview();
			} catch (e) {
				// TODO: handle exception
			}
        },
        /*公共方法 左边距*/
        leftMargin : function () {
        	swordPrompt("请输入左边距",{width:400,height:300,   
                onOk: function(promptValue){  
                	try {
                        wordObj.ActiveDocument.Unprotect();
                    } catch(e) {
                    }
                	try {
                    	wordObj.ActiveDocument.PageSetup.LeftMargin = promptValue;   
                    	wordObj.ActiveDocument.Protect(2);
          			} catch (e) {
          				swordAlert(e.message);
                    	wordObj.ActiveDocument.Protect(2);
          			}
                    }   
                });   
        }, 
        /*公共方法 右边距*/
        rightMargin : function () {
        	swordPrompt("请输入右边距",{width:400,height:300,   
                onOk: function(promptValue){  
                	try {
                        wordObj.ActiveDocument.Unprotect();
                    } catch(e) {
                    }
                	try {
                    	wordObj.ActiveDocument.PageSetup.RightMargin = promptValue;   
                    	wordObj.ActiveDocument.Protect(2);
          			} catch (e) {
          				swordAlert(e.message);
                    	wordObj.ActiveDocument.Protect(2);
          			}
                    }   
                });   
        }, 
        /*公共方法 上边距*/
        topMargin : function () {
        	swordPrompt("请输入上边距",{width:400,height:300,   
                onOk: function(promptValue){  
                	try {
                        wordObj.ActiveDocument.Unprotect();
                    } catch(e) {
                    }
                	try {
                    	wordObj.ActiveDocument.PageSetup.TopMargin = promptValue;   
                    	wordObj.ActiveDocument.Protect(2);
          			} catch (e) {
          				swordAlert(e.message);
                    	wordObj.ActiveDocument.Protect(2);
          			}
                    }   
                });   
        }, 
        /*公共方法 下边距*/
        bottomMargin : function () {
        	swordPrompt("请输入下边距",{width:400,height:300,   
                onOk: function(promptValue){  
                	try {
                        wordObj.ActiveDocument.Unprotect();
                    } catch(e) {
                    }
                	try {
                    	wordObj.ActiveDocument.PageSetup.BottomMargin = promptValue;   
                    	wordObj.ActiveDocument.Protect(2);
          			} catch (e) {
          				swordAlert(e.message);
                    	wordObj.ActiveDocument.Protect(2);
          			}
                    }   
                });   
        },  /*公共方法 横纵向切换*/
        changeOrientation : function () {
        	try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
        	wordObj.ActiveDocument.PageSetup.TogglePortrait();
        	wordObj.ActiveDocument.Protect(2);
        }, 
        /*公共方法修改行间距*/
        changeLineSpacing : function () {
        	swordPrompt("请输入行间距",{width:400,height:300,   
                onOk: function(promptValue){
                	 try {
                         wordObj.ActiveDocument.Unprotect();
                     } catch(e) {
                     }
                	  try {
            	   	      wordObj.ActiveDocument.Application.Selection.WholeStory();  //选中整个文档
            	   	      wordObj.ActiveDocument.Application.Selection.ParagraphFormat.LineSpacingRule = 4
            	   	      wordObj.ActiveDocument.Application.Selection.ParagraphFormat.LineSpacing = promptValue;  //行距
               	          wordObj.ActiveDocument.Protect(2);
          			} catch (e) {
          				swordAlert(e.message);
                    	wordObj.ActiveDocument.Protect(2);
          			}
                    }   
                });  
        }, 
        /*公共方法 打印*/
        print : function (breforeprint, afterprint, flag) {
            if(breforeprint) breforeprint.call();
            exitPreview();
            try {
                wordObj.PrintOut();
                if(afterprint) afterprint.call();
			} catch (e) {
				// TODO: handle exception
			}
        }, 
        /*打印设置方法 打印*/
        installPrint : function () {
            exitPreview();
            try {
                wordObj.PrintOut(true);
			} catch (e) {
				// TODO: handle exception
			}
        },
        /*公共方法 根据vo替换书签*/
        replaceBookmarkUsevo: function (voObj) {
            exitPreview();
            if(typeof voObj != "object") {
                alert("请输入正确的vo对象");
            } else {
                for(var i in voObj) {
                    replaceBookmark(i, voObj[i]);
                }
                wordObj.ActiveDocument.Fields.Update();
            }
        },
        /*公共方法 根据JsonForm对象替换书签*/
        replaceBookmarkUseJsonForm: function (jsonForm) {
        	 try {
                 wordObj.ActiveDocument.Unprotect();
             } catch(e) {
             }
            exitPreview();
            if(typeof jsonForm != "object") {
                alert("请输入正确的jsonForm对象");
            } else {
                for(var i in jsonForm) {
                	 if(wordObj.ActiveDocument.BookMarks.Exists(i)) {
                           wordObj.ActiveDocument.BookMarks(i).Range.Select();
                           wordObj.ActiveDocument.Application.selection.Text = jsonForm[i].value;
                     }
                }
                wordObj.ActiveDocument.Fields.Update();
            }
            wordObj.ActiveDocument.Protect(2);
        },
        /*公共方法 根据voList替换标签*/
        replaceBookmark:function(voList, tablebookmark, beforeprint, afterprint) {
            if(beforeprint) beforeprint.call();
            if(voList.singlevo != null) {
                this.replaceBookmarkUsevo(voList.singlevo);
            }
            if(tablebookmark) {
                this.replaceBookmarkUsevolist(tablebookmark, voList);
            } else {
                this.replaceBookmarkbuildtable(voList);
            }
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
            if(afterprint) afterprint.call();
        },

        /*公共方法 获取数据volist*/
        getVodata:function(singlevoformName, volistformName) {
            var voListObj = new baseVoListObj();
            var formObj = document.forms[singlevoformName];
            if(formObj) {
                var vo = {};
                if(formObj.elements) {
                    var elArray = formObj.elements;
                    for(var i = elArray.length; i >= 1;) {
                        i--;
                        vo[elArray[i].name] = elArray[i].value;
                    }
                    voListObj.singlevo = vo;
                }

            }
            if(volistformName) {
                volistformName.each(function(item, index) {
                    var formArray = document.getElementsByName(item);
                    var formObj = null;
                    if(formArray.length > 0)formObj = formArray[0];
                    if(formObj != null & formObj.elements) {
                        var vo = {};
                        var elArray = formObj.elements;
                        for(var i = elArray.length; i >= 0; i--) {
                            vo[elArray[i].name] = elArray[i].value;
                        }
                        voListObj.volist.push(vo);
                        if(index = 0) {
                            voListObj.cols.push(formObj.elements[0].name);
                            voListObj.captions.push(formObj.elements[0].caption ? formObj.elements[0].caption : "");
                            voListObj.widths.push(formObj.elements[0].style.width);
                        }
                    }
                });
            }
            return voListObj;
        },


        /*公共方法 根据Form表单元素构造vo*/
        getSingleVo: function (formName, arrayObj) {//第二个参数可以为空，不填时默认为表单里的所有元素
            var formObj = document.forms[formName];
            if(formObj != null) {
                if(arrayObj != null) {
                    if(arrayObj instanceof Array) {
                        var vo = {};
                        for(var i = 0; i < arrayObj.length; i++) {
                            if(formObj.elements[arrayObj[i]] != undefined) {
                                vo[arrayObj[i]] = formObj.elements[arrayObj[i]].value;
                            }
                        }
                        return vo;
                    } else {
                        alert("弟二个参数应为数组类型");
                    }
                } else {
                    var vo = {};
                    for(var i = 0; i < formObj.elements.length; i++) {
                        vo[formObj.elements[i].name] = formObj.elements[i].value;
                    }
                    return vo;
                }
            } else {
                alert("第一个参数表示的表单不存在");
                return null;
            }
        },
        /*公共方法 根据Form表单元素构造vo*/
        getVoList :function(formName, arrayObj) {//表单名，属性数组(可以为空)
            /*ar formArray = document.forms[formName];*/
            var formArray = document.getElementsByName(formName);
            if(formArray != null) {
                if(arrayObj instanceof Array) {
                    var voListObj = new baseVoListObj();
                    /*for(var i=0;i<formArray.length;i++){
                     var vo = {};
                     for(var j=0;j<arrayObj.length;j++){
                     if(formArray[i].elements[arrayObj[j]]!= undefined ){
                     vo[arrayObj[j]] =  formArray[i].elements[arrayObj[j]].value;
                     if(i==0){
                     voListObj.captions.push( formArray[i].elements[arrayObj[j]].caption? formArray[i].elements[arrayObj[j]].caption:"");
                     voListObj.cols.push(arrayObj[j]);
                     voListObj.widths.push(formArray[i].elements[arrayObj[j]].style.width);
                     }
                     }
                     }
                     voListObj.singlevo.push(vo);
                     }*/
                    var vo = {};
                    if(formArray[0].elements) {
                        arrayObj.each(function(item, index) {
                            vo[item] = formArray[0].elements[item].value;
                        });
                    }
                    voListObj.singlevo = vo;
                    return voListObj;
                } else {
                    var voListObj = new baseVoListObj();
                    for(var i = 0; i < formArray.length; i++) {
                        var vo = {};
                        for(var j = 0; j < formArray[i].elements.length; j++) {
                            vo[formArray[i].elements[j].name] = formArray[i].elements[j].value;
                            if(i == 0) {
                                voListObj.cols.push(formArray[i].elements[j].name);
                                voListObj.captions.push(formArray[i].elements[j].caption ? formArray[i].elements[j].caption : "");
                                voListObj.widths.push(formArray[i].elements[j].style.width);
                            }
                        }
                        voListObj.volist.push(vo);
                    }
                    return voListObj;
                }
            } else {
                return null;
            }
        },


        /*公共方法 根据volist替换书签*/
        replaceBookmarkUsevolist:function(strName, voListObj, isBorder) {
            try {
                wordObj.ActiveDocument.Unprotect();
            } catch(e) {
            }
            if(typeof voListObj != "object") {
                alert("参数应为数组类型");
            } else {
                var row = voListObj.volist.length;
                var col = voListObj.cols.length;
                if(row != 0 && col != 0) {
                    var objDoc = wordObj.ActiveDocument.BookMarks(strName).Range;
                    var objTable = wordObj.ActiveDocument.Tables.Add(objDoc, row + 1, col);//插入表格
                    for(var k = 0; k < voListObj.captions.length; k++) {
                        objTable.Cell(1, k + 1).Range.InsertAfter(voListObj.captions[k]);
                    }
                    for(var i = 0; i < row; i++) {
                        for(var j = 0; j < col; j++) {
                            objTable.Cell(i + 2, j + 1).Range.InsertAfter(voListObj.volist[i][voListObj.cols[j]]);
                            var width = voListObj.widths[j];
                            if(width.indexOf("px") != -1) {
                                objTable.Cell(i + 2, j + 1).Width = (width.substr(0, width.length - 2) / 100) * 28.35;//1厘米=28.35磅
                            }
                        }
                    }
                    //objTable.AutoFormat(1);
                    if(false == isBorder) {
                        objTable.Borders.InsideLineStyle = 0;
                    } else {
                        objTable.Borders.InsideLineStyle = 1;
                    }
                    objTable.Borders.OutsideLineStyle = 1;
                }
            }
            wordObj.ActiveDocument.Fields.Update();
            wordObj.ActiveDocument.Protect(2);
        }
        /************************end****************************************************/
    };
}());