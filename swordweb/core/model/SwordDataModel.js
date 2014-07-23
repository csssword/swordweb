
Sword.data = {};

/**
 * 数据容器
 * @author Administrator
 */
SwordDataModelContainer=new Class({
	
	$family: {name: 'SwordDataModelContainer'}
	,pool: $H()
	
	
	,regModel:function(key,model){
		if(model){
			this.pool.set(key,model);
		}
	}
	
	,getModel:function(key){
		return this.pool.get(key);
	}
	
});

Sword.data.container = new SwordDataModelContainer();

/**
 * 数据模型基类
 */
Sword.data.SwordDataModel=new Class({
	Implements:[Options,Events]
	
	,$family: {name: 'Sword.data.SwordDataModel'}
	/**
	 * 数据容器
	 * @type 
	 */
	,dataContainer:null
	,reader : null
	,writer : null
	
	,initialize:function(obj) {
		this.key = obj['key']||$random(1,1000000);
		this.writer = obj['writer']||new Sword.data.SwordDataWriter();
		this.writer.setModel(this);
		this.reader = obj['reader']||new Sword.data.SwordDataReader();
		this.reader.setModel(this);
		Sword.data.container.regModel(this.key,this);
    }
    
	,options:{
		
		onInsert:null
		,onDelete:null
		,onUpdate:null
		,onGet:null
	}
	
	,getKey:function(){
		return this.key;
	}

	/**
	 * @param {} receiver
	 */
	,setReader:function(reader){
		if(reader){
			this.reader = reader;
			this.reader.setModel(this);
		}
	}
	
	,getReader:function(){
		return this.reader;
	}
	
	,setWriter: function(writer){
		if(writer){
			this.writer = writer;
			this.writer.setModel(this);
		}
	}
	
	,getWriter:function(){
		return this.writer;
	}
		
	/**
	 * 设置数据
	 * @param {} dataContainer
	 */
	,setData:function(dataContainer){
		if(this.reader){
			this.dataContainer = this.reader.read(dataContainer);
		}
	}
	
	,getData:function(){
		return this.dataContainer;
	}
	
});

/**
 * 写数据
 */
Sword.data.SwordDataWriter = new Class({
	Implements:[Options,Events]
	,$family: {name: 'Sword.data.SwordDataWriter'}

	,model : null
	
	,setModel:function(model){
		this.model = model;
	}
	
	,write:function(){
	}
	
});

/**
 * 读数据
 */
Sword.data.SwordDataReader = new Class({
	Implements:[Options,Events]
	,$family: {name: 'Sword.data.SwordDataReader'}
	
	,model : null
	
	,setModel:function(model) {
		this.model = model;
    }
	
	,read:function(data){
		return data;
	}
	
	,findByPath:function(path){
		var resData;
    	if(!path){
    		resData = this.model.dataContainer;
    	}else if(this.model.dataContainer){
    		var str = "this.model.dataContainer"+path;
    		resData = eval(str);
    	}
		return resData;
	}
	
	,query:function(query){
		return this.model.domainData;
	}
	
});
