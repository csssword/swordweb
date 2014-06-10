var Redirect = new Class({
    Implements:Options,
    options:{
        data: null,
        isShowNavigator: "false",
        items: []//这个items具体是[{title:'a页面',page:'a.html',iframe:'xxx',bodyScroll:null},{title:'b页面',page:'b.html',iframe:'xxx',bodyScroll:null}]
    },
    navigator:null,
    topDiv: null,
    initialize:function() {

    },
    go:function(page) {
        var bodyScroll = $(document.body).getScroll();
        bodyScroll = (bodyScroll.x == 0 && bodyScroll.y == 0) ? null : bodyScroll;
        var iframeNode;
        var parentDoc = $(parent.document);
        var topDivs;
        if ($defined(parentDoc)) {
            topDivs = parentDoc.getElements('div[name=SwordRedirect_topDiv][create=false]');
        }
        if (parent && $defined(topDivs) && topDivs.length != 0) {
            var title = (document.title == null) ? "空title页面" : document.title;
            parent.pc.redirect.options.items[parent.pc.redirect.options.items.length - 1].title = title;
            parent.pc.redirect.options.items[parent.pc.redirect.options.items.length - 1].bodyScroll = bodyScroll;
            this.options.items = parent.pc.redirect.options.items;
            this.options.items[this.options.items.length - 1].iframe.setStyles({
                'display': 'none'
            });
            this.navigator = parent.pc.redirect.navigator;
            this.navigator.addItem(this.options.items[this.options.items.length - 1]);
            this.navigator.refreshItems();
            iframeNode = parent.document.createElement('iframe');
            iframeNode.frameBorder = "no";
            $(iframeNode).inject(parent.document.body);
        } else {
            if ($(document).getElements('div[name=SwordRedirect_topDiv][create=true]').length != 0) {
                this.topDiv.setProperty('create', 'false');
                this.topDiv.setStyles({
                    'display': 'none'
                });
            } else {
                this.topDiv = new Element('div', {
                    'name': 'SwordRedirect_topDiv',
                    'create': 'false',
                    'styles':{
                        'display':'none'
                    }
                }).inject(document.body, 'top');
                $$("body>*[name!=SwordRedirect_topDiv]").each(function(item) {
                    this.topDiv.wraps(item);
                }, this);
            }

            var title = (document.title == null) ? "空title页面" : document.title;
            this.options.items.include({
                'title': title,
                'page': null,
                'iframe': this.topDiv,
                'bodyScroll': bodyScroll
            });
            this.navigator = new SwordNavigation({
                'navigatorItems': this.options.items,
                'isShow': this.options.isShowNavigator
            });
            iframeNode = document.createElement('iframe');
            iframeNode.frameBorder = "no";//todo 这句话是ie不出现边框而设置的
            $(iframeNode).inject(document.body);
        }

        if (jsR.server()) {
            //服务器运行时候：为了保证页面引用js路径一致
            $(iframeNode).setProperty('src', jsR.rootPath + 'sword?ctrl=SwordPage_redirect&pagename=' + page);
        } else {
            //静态运行:
            $(iframeNode).setProperty('src', page);
        }

        $(iframeNode).setProperty('name', 'RedirectIframe_' + page);

        $(iframeNode).set('ifname', 'RedirectIframe_' + page);//使用这个ifname属性，来作为唯一标识符

        $(iframeNode).setProperty('frameborder', 'no');
        $(iframeNode).setStyles({
            'display': "",
            'width': '100%',
            'height': '100%',
            'overflow': 'auto',
            'border': 0
        });
        //下面是解决滚动条的问题的脚本,暂时的解决办法是设置iframe中的body高度,使其没有iframe中的高,有更好的解决办法,请修改
        $(iframeNode).addEvent('load', function() {
            if ($defined(window.frames['RedirectIframe_' + page])) {
                $(window.frames[window.frames.length - 1].document.body).setStyles({
                    'height': '100%'
                });
            } else {
                $(parent.frames[parent.frames.length - 1].document.body).setStyles({
                    'height': '100%'
                });
            }

        }.bind(this));

        this.options.items.include({
            'title': null,
            'page': page,
            'iframe': $(iframeNode),
            'bodyScroll': null
        });

    },
    back: function(page) {
        parent.pc.redirect.ItemBack(page);
    },
    ItemBack:function(page) {
        var backFlag = false;
        var bodyScroll;
        var backIndex = 0;
        this.options.items.each(function(item, index) {
            if (backFlag == true) {
                item.iframe.destroy();
            }
            if (item.page == page) {
                backFlag = true;
                backIndex = index;
                bodyScroll = item.bodyScroll;
                item.iframe.setStyles({
                    'display': 'block'
                });
            }
            if (backFlag == true) {
                this.navigator.deleteItem(item.page);
            }
        }.bind(this));
        this.navigator.refreshItems();
        this.options.items = this.options.items.filter(function(item, index) {
            return (index <= backIndex);
        });

        if (page == null) {
            this.options.items.empty();
            this.navigator.navBar.destroy();
            this.navigator == null;
            this.topDiv.setProperty('create', 'true');
        }

        if ($defined(bodyScroll)) {
            $(document.body).scrollTo(bodyScroll.x, bodyScroll.y);
        }

    },
    getData:function() {
        return this.options.data;
    },
    setData:function(data) {
        this.options.data = data;
    }
});

var SwordNavigation = new Class({
    Implements:[Events,Options],
    options:{
        left: "10%",
        top: 0,
        width: "80%",
        height: 20,
        isShow: "false",
        navigatorItems: null//具体是[{title:'刻度1',page:'a.html'},{title:'刻度2',page:'b.html'}]
    },
    initialize:function(options) {
        this.setOptions(options);
        this.buildBar();
        this.refreshItems();
    },
    navBar: null,
    navUL: null,
    navBarSlider:null,
    buildBar: function() {
        this.navBar = new Element('div', {
            'name': 'SwordNavigation',
            'class': 'navbar',
            'styles':{
                'position': 'absolute',
                'left': this.options.left,
                'top': this.options.top,
                'width': this.options.width,
                'height': this.options.height
            }
            //			,'slide':{
            //                duration: 500,
            //                transition:'bounce:out'
            //            }
        }).inject(document.body);
        if (this.options.isShow == "false") {
            this.navBar.setStyle('display', 'none');
        }
        //        window.document.addEvent('mouseover', function(e) {
        //                        if((new Event(e).page.x > this.options.left)
        //            			&& (new Event(e).page.x < this.options.left + this.options.width)
        //            			&& (new Event(e).page.y > this.options.top)
        //            			&& (new Event(e).page.y < this.options.top + this.options.height)){
        //                            this.navBar.slide('in');
        //            			}else{
        //							this.navBar.slide('out');
        //                        }
        //        }.bind(this));
        this.navUL = new Element('ul').inject(this.navBar);
    },
    refreshItems: function() {
        this.navUL.empty();
        var currentLi = new Element('li', {
            'name': 'currentPos',
            'text': '当前位置:'
        }).inject(this.navUL);
        this.options.navigatorItems.each(function(item, index) {
            this.buildItem(item, index);
        }.bind(this));
    },
    buildItem: function(item, index) {
        var currentLi = new Element('li', {
            'name': item.page
        }).inject(this.navUL);
        var a = new Element('a', {
            'href': '#',
            'title': item.title,
            'page': item.page,
            'text': item.title
        }).inject(currentLi);
        a.addEvent('click', function(e) {
            var title = new Event(e).target.getProperty('title');
            var page = new Event(e).target.getProperty('page');
            if ($defined(pc.redirect)) {
                pc.redirect.ItemBack(page);//耦合pageContainer.redirect,todo 以a标签最好以接口的方式
            }
        }.bind(this));
        if (index != (this.options.navigatorItems.length - 1)) {
            var span = new Element('span', {
                'text': '>>'
            }).inject(currentLi);
        }
    }
    ,
    addItem: function(item) {
        this.options.navigatorItems.include(item);
    }
    ,
    deleteItem: function(page) {
        this.options.navigatorItems = this.options.navigatorItems.filter(function(item, index) {
            return (item.page != page);
        }.bind(this));
    }
})
        ;

