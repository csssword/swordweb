/**
 * 数据迭代器
 *
 * @author Administrator
 */

SwordGrid.Iterator = new Class({

    $family: {name: 'SwordGrid.Iterator'}
    /**
     * 被迭代节点
     */
    ,node:$empty
    /**
     *
     */
    ,iterator:$empty
    /**
     * 是否末节点
     */
    ,lastSign:true
    /**
     * 数据深度
     */
    ,dataDetph:0
    ,domainData:[]

    ,initialize:function(node, depth) {

        /**
         * Abstract 由子类实现
         */
        this.iterator(node);
        if ($defined(depth)) {
            this.dataDepth = depth;
        }
    }

    /**
     * 是否有子节点
     */
    ,hasChildNodes:$lambda(false)

    /**
     * 是否父节点下的最后一个节点
     */
    ,isLast:$lambda(true)

    /**
     * 获取节点属性集
     */
    ,getAttributes:$empty
    /**
     * 获取节点某一属性
     */
    ,getAttribute:$empty

    /**
     * 获取子节点集
     */
    ,getChildNodes:$empty

    ,setParentSign:function(code, pcode) {
        SwordGrid.Iterator.code = code;
        SwordGrid.Iterator.pcode = pcode;

    }

});


SwordGrid.Iterator.newInstance = function(node, type, cascadeSign) {
    var instance = null;
    SwordGrid.Iterator.treeNodeNum = 0;
    if ($chk(type) && 'json'.test(type.trim(), 'i')) {
        instance = new SwordGrid.JSONIterator(node || {}, 0);
    } else if ($chk(type) && 'jsonAptitude'.test(type.trim(), 'i')) {
//        var data = [];
//        if ($defined(node) && $defined(node.data)) {
//            data = node.data;
//        }

        instance = new SwordGrid.JSONAptitudeIterator(node, 0);
        instance.setDomainData(node);
        instance.setParentSign(cascadeSign.id, cascadeSign.pid, node);
    } else {
        instance = new SwordGrid.XMLIterator(node, 0);
    }
    return instance;
};


/**
 * xml迭代器
 */
SwordGrid.XMLIterator = new Class({
    Extends :SwordGrid.Iterator

    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }

    ,iterator:function(node) {
        this.node = node;
    }

    ,hasChildNodes:function() {
        return this.node.hasChildNodes();
    }

    ,getChildNodes: function() {
        var nodes = new Array();
        this.dataDepth++;
        for (var k = 0; k < this.node.childNodes.length; k++) {
            if ((/[^\t\n\r ]/.test(this.node.childNodes[k].data))) {
                var it = new SwordGrid.XMLIterator(this.node.childNodes[k], this.dataDepth);
                it.setLastSign(false);
                nodes.push(it);
            }
        }
        if (nodes.length > 0) {
            nodes[nodes.length - 1].setLastSign(true);
        }
        return nodes;
    }

    ,getAttributes:function() {

        return this.node.attributes;
    }

    ,getAttribute:function(key) {
        return this.node.getAttribute(key);
    }

    ,isLast:function() {
        if (this.node.parentNode == null || this.node.parentNode.nodeName == "#document" || this.lastSign) return true;
        return false;
    }
});

/**
 * JSON迭代器
 */
SwordGrid.JSONIterator = new Class({
    Extends:SwordGrid.Iterator

    /**
     * 用于缓存当前属性，避免每次都查询
     */
    ,attributes:[]

    ,iterator:function(node) {
        this.node = new Hash(node);

    }
    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }
    ,hasChildNodes:function() {
        var res = false;
        res = this.node.some(function(value, key) {
            return $type(value) == 'array' || $type(value) == 'object';
        });
        return res;
    }

    ,getChildNodes:function() {
        var array = new Array();
        this.dataDepth++;
        this.node.getKeys().each(function (item, index) {
            if ($type(this.node.get(item)) == 'array') {
                this.node.get(item).each(function(value) {
                    var it = new SwordGrid.JSONIterator(value, this.dataDepth);
                    it.setLastSign(false);
                    array.push(it);
                }.bind(this));
            } else if ($type(this.node.get(item)) == 'object') {
                var it = new SwordGrid.JSONIterator(this.node.get(item), this.dataDepth);
                it.setLastSign(false);
                array.push(it);
            }
        }.bind(this));
        if (array.length > 0) {
            array[array.length - 1].setLastSign(true);
        }
        return array;
    }

    ,getAttributes:function() {

        if (this.attributes.length != 0) {
            return this.attributes;
        }

        var res = new Array();

        this.node.getKeys().each(function(item) {
            switch ($type(this.node.get(item))) {
                case 'string':
                case 'number':
                case 'boolean':
                    res.push({ nodeName:item,nodeValue:this.node.get(item)});
                case false:return null;
            }
        }.bind(this));
        this.attributes = res;
        return res;
    }
    ,getAttribute:function(key) {
        if ($defined(this.node)) {
            return this.node.get(key);
        } else {
            return null;
        }
    }

    ,isLast:function() {
        return this.lastSign;
    }
});


/**
 * 智能处理json数据，数据无需满足树的标准格式
 */
SwordGrid.JSONAptitudeIterator = new Class({
    Extends:SwordGrid.Iterator

    /**
     * 当前指向的元素
     * @param node
     */
    ,current:null 
		,tdsSign:'tds'
		,rootNodes:[]
		,childNodes:[]
    ,iterator:function(node) {
        this.node = node;

    }
    ,setLastSign:function(sign) {
        this.lastSign = sign;
    }
    ,hasChildNodes:function() {

       /* if (this.dataDepth == 0) {
            return    this.domainData.length > 0;
        } else {
            return this.domainData.some(function(item) {
                return item[this.tdsSign][this.tdsSign][SwordGrid.Iterator.pcode]['value'] == this.node[this.tdsSign][SwordGrid.Iterator.code]['value'];
            }, this);
        }*/
        return (this.getChildNodes()!=0);
    }
    ,setDomainData:function(data) {
        this.domainData = data;
    }
    
    ,getRootNodes:function(){
    		this.dataDepth==0;    		
    		if ($defined(this.domainData) && this.domainData.length > 0  && this.rootNodes.length==0) {
    				this.dataDepth++;
            for (var i = 0; i < this.domainData.length; i++) {
                var tp=true;
                for(var j=0;j<this.domainData.length;j++){
                    if(this.domainData[i][this.tdsSign][SwordGrid.Iterator.pcode]['value']==this.domainData[j][this.tdsSign][SwordGrid.Iterator.code]['value']){
                        tp=false;
                        break;
                    }
                }
                if (tp) {
                    var it = new SwordGrid.JSONAptitudeIterator(this.domainData[i], this.dataDepth);
                    it.setLastSign(false);
                    it.setDomainData(this.domainData);
                    this.rootNodes.push(it);
                }
            }
        } 
        return this.rootNodes;
        
    }
    
    ,getChildNodes:function() {
      
        if ($defined(this.domainData) && this.domainData.length > 0 && this.childNodes.length==0){
        		this.dataDepth++;
            for (var i = 0; i < this.domainData.length; i++) {
                if (this.domainData[i][this.tdsSign][SwordGrid.Iterator.pcode]['value'] == this.node[this.tdsSign][SwordGrid.Iterator.code]['value']) {
                    var it = new SwordGrid.JSONAptitudeIterator(this.domainData[i], this.dataDepth);
                    it.setLastSign(false);
                    this.childNodes.push(it);
                    //this.domainData.splice(i, 1);
                    it.setDomainData(this.domainData);
                    //i--;
                }
            }
            if (this.childNodes.length > 0) {
		            this.childNodes[this.childNodes.length - 1].setLastSign(true);
		        }
        }
        return this.childNodes;
    }

    ,getAttributes:function() {

        var res = new Array();
        var attrs = new Hash(this.node);
        attrs.getKeys().each(function(item) {
            switch ($type(attrs.get(item))) {
                case 'string':
                case 'number':
                case 'boolean':
                    res.push({ nodeName:item,nodeValue:attrs.get(item)});
                case false:return null;
            }
        });
        return res;
    }
    ,getAttribute:function(key) {
        if ($defined(this.node)) {
            return this.node[key];
        } else {
            return null;
        }
    }

    ,isLast:function() {
        return this.lastSign;
    }

});



