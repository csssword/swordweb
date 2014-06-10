var SwordFileUpload = new Class({
    Implements:[Events,Options],
    name:'fileUploadCommit',
    options:{
        postData:null
    },
    ExtraDataKey:'postData',
    postDataInput:null,
    formKey:'FileUploadCommitForm',
    iframeKey:'FileUploadCommitIframe',
    commitForm:null,
    commitIframe:null,
    initialize:function(options) {
        new Element('iframe', {
            id:'FileUploadCommitIframe',
            name:'FileUploadCommitIframe',
            styles:{'display':'none'}
        }).inject(document.body);
    },
    initParam:function(options) {
        $extend(this.options, options);
        return this;
    },
    commit:function(isJump, postType) {
        this.createUploadForm();
        this.commitForm.getElements("div.uploadGroup").each(function(el) {
            el.destroy();
        });
        var el,pel,file;
        $$("div.uploadGroup").each(function(item) {
            if(item.get("keepfile") != "true") {
                el = item.clone(true);
                el.getElement("input").cloneEvents(item.getElement("input"));
                pel = item.getParent();
                pel.insertBefore(el, item);
                file = item.retrieve("parent").getWidget(item.get("name"));
                file.resetElStatus(el);
                file.parent.fieldElHash.set(item.get('name'), el);
            } else {
                item.store("pNode", item.getParent());
            }
            item.setStyle('display', "none").inject(this.commitForm);
        }, this);
        var param;
        var ctrl= param= this.options.postData.ctrl;//在ctrl后拼参数swordFileMaxSize，值为数字，单位为kb(但是不要写单位) 如果传-1表示不限制
         if($defined(ctrl)) {
        	var i = ctrl.lastIndexOf("?");
            if(i != -1)
                param = param.replace('?','&');
        }
        this.commitForm.set('action', "upload.sword?ctrl=" + ($defined(param) ? param : ""));
        if(isJump == "false") {
            this.options.postData.data = this.options.postData.data.combine([{'sword':'attr','name':'uploadRedirect','value':'true'}]);
            if($defined(postType)&&postType.contains("form_"))
                this.commitForm.set('target', postType.split("_")[1]);
            else
                this.commitForm.set('target', 'FileUploadCommitIframe');
        }
        if($defined(this.postDataInput)) {
            this.postDataInput.set('value', JSON.encode(this.options.postData));
        } else {
            this.postDataInput = new Element("input", {'type':'hidden','name':'postData','value':JSON.encode(this.options.postData)}).inject(this.commitForm);
        }
        this.commitForm.submit();
        this.commitForm.getChildren("div.uploadGroup").each(function(item) {
            if(item.get("keepfile") == "true") {
                item.setStyle('display', "").inject(item.retrieve("pNode"));
            }
        });
    },
    createUploadForm:function() {
        if(!$defined(this.commitForm)) {
            this.commitForm = new Element('form', {
                'name':this.formKey,
                'id':this.formKey,
                'method':'post',
                'display':'none',
                'encoding':'multipart/form-data',
                'enctype':"multipart/form-data"
            }).inject(document.body);
        }
        return this.commitForm;
    }
});
