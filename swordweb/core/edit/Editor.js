var Editor = new Class({
    name:"Editor"
    ,menu:null
    ,initialize: function() {
        $(document).addEvent('click', function() {
            pc.getEditor().getMenu().hide();
        });
    }
    ,drag:null
    ,getDrag:function() {
        return this.drag;
    }
    ,start:function() {
        this.drag = new DragTable(document.body, {
            clone:function(event, el, list) {
                return el.clone(false).set('name', null).setStyles({
                    'margin': '0px',
                    'position': 'absolute',
                    'visibility': 'hidden',
                    'width': el.getWidth()
                    ,'height':el.getHeight()
                }).inject(list).position(el.getPosition(el.getOffsetParent()));
            }
            ,revert: true
            ,onStart: function(el) {
                el.addClass('edit_drag_start');
            }
            ,onEnter: function(el, dl) {
                dl.addClass('edit_drag_enter');
            }
            ,onLeave: function(el, dl) {
                dl.removeClass('edit_drag_enter');
            }
            ,onSort:function(el, cl, dl, where) {
                el.removeClass('edit_drag_start');
                dl.removeClass('edit_drag_enter');

                var elName = this.getWidgetName(el);
                var dlName = this.getWidgetName(dl);
                if (elName == null || dlName == null) {
                    return;
                }
                var data = this.dragData(elName, dlName, where);
                this.callStudio(JSON.encode(data));
            }.bind(this)
            ,onComplete:function(el) {
                el.removeClass('edit_drag_start');
                el.removeClass('edit_drag_enter');
            }
        });
    }
    ,getMenu:function() {
        if (this.menu != null) {
            return this.menu;
        }
        var dataObj = {
            "data": [
                {
                    "pcode": null,
                    "code": "1",
                    "caption": "编辑组件"
                },
                {
                    "pcode": null,
                    "code": "2",
                    "caption": "添加组件"
                },
                {
                    "pcode": null,
                    "code": "3",
                    "caption": "删除组件"
                }
                ,
                {
                    "pcode": null,
                    "code": "4",
                    "caption": "刷新页面"
                }
                ,
                {
                    "pcode": 2,
                    "code": "21",
                    "caption": "表单组件"
                    ,
                    'widgetType':'SwordForm'
                },
                {
                    "pcode": 2,
                    "code": "22",
                    "caption": "表格组件"
                    ,
                    'widgetType':'SwordGrid'
                },
                {
                    "pcode": 2,
                    "code": "23",
                    "caption": "树组件"
                    ,
                    'widgetType':'SwordTree'
                },
                {
                    "pcode": 2,
                    "code": "24",
                    "caption": "提交组件"
                    ,
                    'widgetType':'SwordSubmit'
                }
            ],
            "name": "SwordTreeJSON1",
            "sword": "SwordTree"
        };
        this.menu = new SwordMenu({
            'name': 'editMenu',
            'pos': 'absolute',
            'dataStr': JSON.encode(dataObj),
            'dataType': 'json',
            'type': 'vertical',
            'pNode': document.body
            ,'onSelect': this.menuSelect.bind(this)
        });
        this.menu.build();
        this.menu.hide();
        return this.menu;
    }
    ,menuSelect:function(menuEl) {
        this.getMenu().hide();
        var targetEl = new Event(this.getMenu().event).target;
        var code = menuEl.get('code');
        var pcode = menuEl.get('pcode');
        var targetName = this.getWidgetName(targetEl);
        var data;
        if (code == 1) {
            data = this.editData(targetName);
        } else if (pcode == 2) {
            var widgetType = menuEl.get('widgetType');
            data = this.newData(widgetType, targetName, 'after');
        } else if (code == 3) {
            if (confirm("您确认删除这个组件吗？")) {
                data = this.deleteData(targetName);
                pc.getStudioComm().deleteWidget(targetName);
            }
        } else if (code == 2) {
            return;
        }
        this.callStudio(JSON.encode(data));
    }
    ,getWidgetName:function(el) {
        if (el.get('Sword')) {
            return el.get('name');
        }
        if (el.getParent("[sword]")) {
            return el.getParent("[sword]").get('name');
        }
        return null;
    }
    ,addEl:function(el) {
        if (!pc.isEdit()) {
            return;
        }
        this.dealEl(el);
        this.getDrag().addItems(el);
    }
    ,dealEl:function(el) {
        el.addEvent('click', function(e) {
            var targetEl = new Event(e).target;
            var name = this.getWidgetName(targetEl);
            var data = this.clickData(name);
            this.callStudio(JSON.encode(data));
        }.bind(this));
        el.addEvent('contextmenu', function(e) {
            e.stop();
            this.getMenu().display({
                left: e.page.x,
                top:e.page.y
            });
            this.getMenu().event = e;
        }.bind(this));
        el.hover(function() {
            el.addClass("edit_in");
        },
                function() {
                    el.removeClass("edit_in");
                });
    }
    ,callStudio:function(data) {
        document.title = data;
    }
    ,editData:function(editedName) {
        return {
            'type':'edit'
            ,'editedName':editedName
        };
    }
    ,newData:function(widgetType, referName, referType) {
        return {
            'type':'new'
            ,'widgetType':widgetType
            ,'referName':referName
            ,'referType':referType
        };
    }
    ,deleteData:function(deletedName) {
        return {
            'type':'delete'
            ,'deletedName':deletedName
        };
    }
    ,dragData:function(dragedName, referName, referType) {
        return {
            'type':'drag'
            ,'dragedName':dragedName
            ,'referName':referName
            ,'referType':referType
        };
    }
    ,clickData:function(selectName) {
        return {
            'type':'onClick'
            ,'selectName':selectName
        };
    }
});





