
var SwordEventDelegator = new Class({
	
	Implements:[Options]

	,name : "SwordEventDelegator"
		
	,options:{
		container:null//容器
	}
		
	,initialize : function(options) {
		this.setOptions(options);
		if(!this.options.container)throw new Error("SwordEventManager初始化必须要传入 container");
		
		this.options.container=$(this.options.container);
		this._initEvents();
	}
	
	
	,add: function(type, fn, condition, args) {
		if(!this._types.has(type))throw new Error('事件处理器不能处理【'+type+'】类型的事件！！');
		var _l = this._listener;
		if (!_l.has(type)) _l.set(type, []);
		_l.get(type).push(this._newListener(fn, condition, args));
		return this;
	}
	
	,remove:function(){//todo
		alert('remove尚未实现！！');
		return this;
	}
		
		
	
	//私有开始
	,_listener:new Hash()//监听器列表，key:type, value:listener{fn,condition,args}
	,_types : new Hash({//key是定义的类型（即add进来的类型），value是真正注册给容器的类型
		'click' : 'click',
		'mouseover' : 'mouseover',
		'mouseout' : 'mouseout',
		'mouseenter' : 'mouseover',
		'mouseleave' : 'mouseout',
		'mousedown' : 'mousedown',
		'dblclick' : 'dblclick',
		'contextmenu' : 'contextmenu',
		'keyup' : 'keyup',
		'keydown' : 'keydown'
	})
	
	,_newListener:function(fn,condition,args){
		//todo 合法性校验
		return {
			'fn':fn
			,'condition':condition
			,'args':args
		}
	}	
	
	,_initEvents:function(){
		var con=this.options.container;
		this._types.each(function(relType,defType){
			con.addEvent(relType,this._getHandler(defType).bindWithEvent(this,defType));
		},this);
		
	}
		
	,_handlers:null
	
	,_getHandler:function(type){
		if(!this._handlers){
			this._handlers={//定义特殊事件处理器
				'mouseenter':this._enterLeaveHandler
				,'mouseleave':this._enterLeaveHandler
			};
		}
		
		if(this._handlers[type])return this._handlers[type];
		return this._defaultHandler;
	}	
	
	
	
	,_baseHandler:function(e,type,cur,pro){if(type=='click')
		if (!e.$extended)e=new Event(e);
		if(!cur)cur=$(e.target);
		if(cur){
			if(cur.get('disabled')==true)return;
			var r=$(e.relatedTarget);
			var ls=this._listener.get(type);
			if(ls){
				ls.each(function(l){
					if(pro(cur,r,l['condition'])){
						if(l['args'])l['fn'](e,cur,l['args']);
						else l['fn'](e,cur);
					}
					if(this._cancelBubble(e.event)) return ;//终止循环
				},this);
			}
			if(this._cancelBubble(e.event)) return ;//退出递归
			if(cur==this.options.container)return;	
			cur=cur.getParent();if(!cur)return;
			this._baseHandler(e,type,cur,pro);
		}else return;
	}
	
	,_cancelBubble:function(event){
	       return event.cancelBubble ;
	}
	
	//默认处理器：冒泡算法
	,_defaultHandler:function(e,type,cur){
		this._baseHandler(e,type,cur,this._defalutProcessor);
	}
	
	//用于mouseenter 和 mouseleave
	,_enterLeaveHandler:function(e,type,cur){
		this._baseHandler(e,type,cur,this._enterLeaveProcessor);
	}
	
	
	,_defalutProcessor:function(el,r,condition){//r是event中的relatedTarget
		return el.match(condition);
	}
	
	,_enterLeaveProcessor:function(el,r,condition){
		if(!r) return el.match(condition);
		var rp=r.getParent(condition)||r;
		return el.match(condition)&&el!=rp;
	}
	
	

});

