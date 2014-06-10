/*== 该JS停止使用 接口在顶层窗口实现 ==*/
Persist = (function() {
  var VERSION = '0.2.0', P, B, esc, init, empty, ec;
  empty = function() {};
  esc = function(str) {return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s'); };
  C = {
    search_order: [ 'flash'],
    name_re: /^[a-z][a-z0-9_ -]+$/i,
    methods: [ 'init', 'get', 'set',  'remove', 'load',  'save', 'uncompress' ],
    flash: {     
      div_id:   '_persist_flash_wrap',  // ID of wrapper element
      id:       '_persist_flash',      // id of flash object/embed
      path: 'persist.swf',      // default path to flash object
      size: { w:1, h:1 },
      args: {autostart: true}   // arguments passed to flash object
    } 
  };
  // built-in backends
  B = {
    // flash  (requires flash 8 or newer)
    flash: {
      test: function() {	  
        // TODO: better flash detection
        if (!window.SWFObject || !deconcept || !deconcept.SWFObjectUtil)
          return false;
         // get the major version
         var major = deconcept.SWFObjectUtil.getPlayerVersion().major;
         // check flash version (require 8.0 or newer)
         return (major >= 8) ? true : false;
      },
      methods: {
        init: function() {
          if (!B.flash.el) {
            var o, key, el, cfg = C.flash;
            // create wrapper element
            el = new Element('div').inject(document.body);
            el.id = cfg.div_id;
            // FIXME: hide flash element
            // el.style.display = 'none';        
            //document.body.appendChild(el);       // append element to body
            o = new SWFObject(this.o.swf_path || cfg.path, cfg.id, cfg.size.w, cfg.size.h, '8');         // create new swf object  
            for (key in cfg.args)          // set parameters
              o.addVariable(key, cfg.args[key]); 
            o.write(el);            // write flash object         
            B.flash.el = document.getElementById(cfg.id);   // save flash element
          }
          // use singleton flash element
          this.el = B.flash.el;
        },/*,
        sleep :function (numberMillis) {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
            }
        },
        */
     get: function(key, fn, scope) {    
    	 	alert("old get........");
            var val=null;
            var obj = this;
            var clearObj;
            // escape key
            key = esc(key);
            count=1;
            // get value          
            (function(){
          	  		try{          	  			
  			 			if(sword.CacheManager.currentCacheObj.el.ready()){  	
  			 				  val = obj.el.get(obj.name, key);
  			 				  var tname = obj.name.substring(0,obj.name.indexOf('_version'));
  			 				  if (fn){
  	            					fn.call(scope || obj, val !== null, val,tname);
  			 				  }
  			 				   return;
  			 			}else{  			 				
  			 				if(count>5){
  			 				   clearTimeout(clearObj);
  			 				   var tname = obj.name.substring(0,obj.name.indexOf('_version'));
  			 					if (fn)
  	            					fn.call(scope || obj, val !== null, val,tname);
  			 					return;
  			 			    }
  			 				count++;
  			 				clearObj = setTimeout(arguments.callee,1);
  			 			}
  		 			}catch(e){  		 				 
  		 				if(count>5){
  		 						clearTimeout(clearObj);
  		 					    var tname = obj.name.substring(0,obj.name.indexOf('_version'));
  			 					if (fn)
  	            					fn.call(scope || obj, val !== null, val,tname);
  			 					return;
  			 			}
  		 				count++;
  		 				clearObj = setTimeout(arguments.callee,10);
  		 			}  		 			
  		  })();
        },        
         uncompress: function(data) {
        	 alert("old uncompress........");
        	return this.el.uncompress(data);
          },
        set: function(key, val, fn, scope) {
        	alert("old set........");
          key = esc(key);          // escape key
         var old_val = this.el.set(this.name, key, val);  // set value
         var getcd = this.el.get(this.name, key);
          if (fn)          // call handler
            fn.call(scope || this, true, val,getcd);
        },
        remove: function(key, fn, scope) {          
          key = esc(key);          // get key    
          var val = this.el.remove(this.name, key);    
          if (fn) // call handler
            fn.call(scope || this, true, val);
        }
      }
    }
  };
  var init = function() {
    var i, l, b, key, fns = C.methods, keys = C.search_order;
    /*
    for (i = 0, l = fns.length; i < l; i++) 
      P.Store.prototype[fns[i]] = empty;   
    */
    P.type = null;   P.size = -1; // clear type and size 
    for (i = 0, l = keys.length; !P.type && i < l; i++) {
      b = B[keys[i]];
      if (b.test()) {
        P.type = keys[i];
        P.size = b.size;
        for (key in b.methods)
          P.Store.prototype[key] = b.methods[key];
      }else{
    	  alert("浏览器未安装Flash Player插件或者该插件为禁用状态");
    	  return;
      }
    }
    P._init = true;
  };
  P = {
    VERSION: VERSION,
    type: null,
    size: 0,
    add: function(o) {
      B[o.id] = o;
      C.search_order = [o.id].concat(C.search_order);
      init();
    },
    remove: function(id) {
      var ofs = C.search_order.indexOf(id);
      if (ofs < 0)
        return;
      C.search_order.splice(ofs, 1);
      delete B[id];
      init();
    },
   Store: function(name, o) {
      if (!C.name_re.exec(name))
        throw new Error("Invalid name");
      if (!P.type)
        throw new Error("No suitable storage found");
      o = o || {};
      this.name = name;   
      o.domain = o.domain || location.host || 'localhost';
      // strip port from domain (XXX: will this break ipv6?)
      o.domain = o.domain.replace(/:\d+$/, '');
      // Specifically for IE6 and localhost
      o.domain = (o.domain == 'localhost') ? '' : o.domain;
      this.o = o;
      o.expires = o.expires || 365 * 2;
      o.path = o.path || '/';
      this.init();
    } 
  };
  init();
  return P;
})();