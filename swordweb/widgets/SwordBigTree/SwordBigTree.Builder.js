/**
 * 生成器
 * @author Administrator
 */
SwordBigTree.Builder=new Class({
	
	$family: {name: 'SwordBigTree.Builder'}
	
	,Implements:[Options,Events]
    
	/**
	 * 树容器
	 */
	,container:$empty

 
	/**
	 * 绘画工厂
	 * @param {Object} container
	 * @param {Object} options
	 */
	,draw:null
	
	,initialize:function(container,options,events){
		this.container=container;
		this.setOptions(options);
        this.$events = $merge(this.$events,events);
	}
	
	/**
	 * 构建树
	 */
	,build:function(tree){
		
        var dom = this.domFactory({'treeContainerName':this.options.treeContainerName,
            'tid':this.options.tid,
            'ctrl':this.options.ctrl,
            'dataStr':this.options.dataStr,
            'type': this.options.dataType,
            'postData':this.options.postData
        },this.$events);
         
        
        var iterator = this.iterator(dom,this.options.dataType,this.options.cascadeSign);
        
        if($defined(iterator)){
            this.draw = this.drawFactory(this.options, tree);
            this.draw.$events = $merge(this.draw.$events,this.$events);
            this.draw.build(this.container,iterator);
            
            if(this.options.isDrag=="true" ){

            	this.draw.initDrag = function(){
	            	 var drag = this.dragFactory(this.draw,this.options);
	                 drag.$events = $merge(drag.$events,this.$events);
	                 drag.startDrag();
            	}.bind(this);
            }
        }

	}
	/**
	 * 初始化数据加载工厂
	 */
	,domFactory:function(obj,event){
 
		var dom  = SwordBigTree.DomFactory.newInstance(obj,event);

		return dom;
	}
	
	/**
	 * 初始化数据迭代器
	 */
	,iterator:function(dom,dataType,cascadeSign){

		var iterator = SwordBigTree.Iterator.newInstance(dom,dataType,cascadeSign);
		
		return iterator;
	}
	/**
	 * 绘画工厂 
	 * @param {Object} dom
	 */
	,drawFactory:function(options, tree){
		var draw = new SwordBigTree.Draw(options, tree);
        return draw;
	}
    /**
     * 拖拽工厂
     * @param drawFacotory
     * @param options
     */
    ,dragFactory:function(drawFacotory,options){
         var drag = new SwordBigTree.Drag(drawFacotory,options);
         return drag;
    }
	
});
