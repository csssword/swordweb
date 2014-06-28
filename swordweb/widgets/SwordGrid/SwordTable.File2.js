SwordGrid.implement({
            file2_onFileRemove:function(up,el,n) {
                var  dataObj= this.getOneRowData(el);
                this.updateCell(el,'');
                up.target.setStyle('display', '');
//                up.reposition({top: window.getScrollTop(), left: 0, width: 40, height: 40});
                if(dataObj.tds[n])dataObj.tds[n].tmp=undefined; //文件被删掉了，已经没有文件，所以，不存在临时状态
            }
             ,file2_onComplete:function(up,el,n) {
                if(up.fileList[0]){
                    var  dataObj= this.getOneRowData(el);
                    up.fileList[0].grid={name:n,manager:this,cell:el};
                    this.updateCell(el, up.getValue());
                    up.reposition({top: window.getScrollTop(), left: -9999, width: 40, height: 40});
                    if (dataObj.tds[n])dataObj.tds[n].tmp = true; //刚刚上传完的文件肯定是临时文件
                }

            }

            ,file2_onStart:function(up){
                up.target.setStyle('display', 'none');
            }

            ,createFile2:function(itemEl,el,html,dataObj){
                itemEl.setAttribute('multiple', 'false'); //强制使用单个文件选择方式 ，表格暂时不支持多单cell多文件上传模式
                var n = itemEl.get("name");
                el.addClass('sGrid_data_row_item_file2');
                var up = initIntimeUp(el, n, itemEl);
//                up.addEvent('onComplete', this.file2_onComplete.bind(this, [up,el,n]));
                up.addEvent('onFileSuccess',this.file2_onComplete.bind(this, [up,el,n]));
                up.addEvent('onFileRemove', this.file2_onFileRemove.bind(this, [up,el,n]));
                up.addEvent('onStart', this.file2_onStart.bind(this, [up]));
                el.store('up', up);

                var d=this.file2_Data(html);
                if(d){
                    var ui=Swiff.Uploader.createFileUi('id',d.name,d.size);
                    ui.element.inject(up.list);
                    up.target.setStyle('display', 'none');
                    ui.del.addEvent('click',this.file2_delete.bind(this,[ui,up,dataObj,el,n,d,itemEl]));
                    ui.title.addEvent('click',this.file2_download.bind(this,[ui,up,dataObj,el,n,d,itemEl]));
                }

            }
            
            ,lazyInitFile2:function(itemEl,el,html,dataObj){
                itemEl.setAttribute('multiple', 'false'); //强制使用单个文件选择方式 ，表格暂时不支持多单cell多文件上传模式
                var n = itemEl.get("name");
                el.addClass('sGrid_data_row_item_file2');
                var up = initIntimeUp(el, n, itemEl);
                up.addEvent('onFileSuccess',this.file2_onComplete.bind(this, [up,el,n]));
                up.addEvent('onFileRemove', this.file2_onFileRemove.bind(this, [up,el,n]));
                up.addEvent('onStart', this.file2_onStart.bind(this, [up]));
                el.store('up', up);
                                
                var d=this.file2_Data(html);
                if(d){
                    var ui=Swiff.Uploader.createFileUi('id',d.name,d.size);
                    Swiff.Uploader.uiAddOverOutEvent(ui,up);
                    ui.element.inject(up.list);
                    up.target.setStyle('display', 'none');
                    ui.del.addEvent('click',this.file2_delete.bind(this,[ui,up,dataObj,el,n,d,itemEl]));
                    ui.title.addEvent('click',this.file2_download.bind(this,[ui,up,dataObj,el,n,d,itemEl]));
                }
            	
            }

            ,file2_delete:function(ui,up,dataObj,el,n,d,itemEl) {
                if (this.file2_isTmp(dataObj,n)) {//调用删除临时文件的方法
                    Swiff.Uploader.deleteTmp(d.fileId,function(){
                        ui.element.destroy();
                        this.file2_onFileRemove(up,el,n,dataObj);
                    }.bind(this));
                } else {//调用业务注册的删除方法,暂时不用调用，因为保存时候提交即可
                    ui.element.destroy();
                    this.file2_onFileRemove(up,el,n,dataObj);
                }
            }

            ,file2_download:function(ui,up,dataObj,el,n,d,itemEl) {
                if (this.file2_isTmp(dataObj,n)) {//调用下载临时文件的方法
                     Swiff.Uploader.downloadTmp(d.fileId,d.name);
                } else {//调用业务注册的下载方法
                    if(itemEl.get('downloadCtrl'))
                        Swiff.Uploader.download(itemEl.get('downloadCtrl'),this.getRowsGridData([el]));
                }
            }

//            s=[{"name":"Desert.jpg","fileId":"1321861812122_638439432679047139"}];
            ,file2_Data:function(s){
                if(!s)return '';
                try {
                    var d = JSON.decode(s);
                    if ($type(d) == 'array') {
                        if (d.length == 1)return d[0];
                    }else{
                    	return d;
                    }
                } catch(e) {
                    return {name:s};
                }
                return {name:s};
            }

            ,file2_isTmp:function(rowData,n){
                if(!rowData.tds[n])return false;
                return rowData.tds[n].tmp == true;
            }
        });
