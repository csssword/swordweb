
SwordToolBar.implement({buttonEvents : {
        "onClick" : {
            "SwordGrid" : {
                "firstPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(1);
                    this.initStatus(this);
                },
                "endPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.totalPage());
                    this.initStatus(this);
                },
                "nextPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.pageNum() + 1);
                    this.initStatus(this);
                },
                "previousPage" : function(wighetName) {
                    var w = $w(wighetName);
                    w.loadPage(w.pageNum() - 1);
                    this.initStatus(this);
                },
                "delete" :function(wighetName){
                	var w = $w(wighetName);
                	w.deleteGridsRows();
                }
                /*,
                "new"  : function(wighetName){
                  	var w = $w(wighetName);
                  	w.createGridsNewRow();
                },
                "edit" : function(wighetName){
                	var w = $w(wighetName);
                  	w.editGridsOneRow();
                }*/
            }
        }
    }});

