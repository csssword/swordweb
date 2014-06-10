var SwordOdpsCalendar = new Class({
    Implements: [Events,Options],
    name: 'SwordOdpsCalendar',
    options:{
        
    },
    initialize: function(options) {
        this.setOptions(options);
    },
    initParam: function(node) {
		initAxisCalendar(node);//这里调用odps的方法
    },
    initData: function() {

    }
});






