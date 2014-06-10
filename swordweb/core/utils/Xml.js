/**
 * XML工具类接口
 */

//初始化构造器,参数为:{"xmlurl":"","xmlstr":"","onReady":function(){}}
//如果不传递参数，则返回空的Dom对象
$dom = function(props) {
    var oDom = null;
    if (Browser.Engine.trident) {
        oDom = new ActiveXObject("Msxml2.domdocument");
    }
    if ($defined(props)) {
        if ($defined(props.xmlurl) && props.xmlurl != "") {
            if (!Browser.Engine.trident)
                oDom = document.implementation.createDocument("", "", null);
            oDom.async = false;
            oDom.load(props.xmlurl);
        } else if ($defined(props.xmlstr)) {
            if (!Browser.Engine.trident) {
                var oDomP = new DOMParser();
                oDom = oDomP.parseFromString(props.xmlstr, "text/xml");
            } else {
                oDom.async = false;
                oDom.loadXML(props.xmlstr);
            }
        }
    } else {
        if (!Browser.Engine.trident)
            oDom = document.implementation.createDocument("", "", null);
        oDom.async = false;
    }
    return oDom.documentElement||oDom;
};
$childs = function(xPath, oNode) {
    var res = [];
    var oNs = oNode.selectSingleNode(xPath).childNodes;
    for (var i = 0; i < oNs.length; i++) {
        res[i] = oNs[i];
    }
    return res;
};
function $xml(oNode) {
    if (Browser.Engine.trident) {
        return oNode.xml;
    } else {
        var oSerializer = new XMLSerializer();
        return oSerializer.serializeToString(oNode);
    }
}
(function() {
    if (document.implementation && document.implementation.createDocument) {
        if (document.implementation.hasFeature("XPath", "3.0")) {
            XMLDocument.prototype.selectNodes = function(xPath, xNode) {
                if (!xNode) {
                    xNode = this;
                }
                var oNSResolver = this.createNSResolver(this.documentElement)
                var aItems = this.evaluate(xPath, xNode, oNSResolver,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
                var aResult = [];
                for (var i = 0; i < aItems.snapshotLength; i++) {
                    aResult[i] = aItems.snapshotItem(i);
                }
                return aResult;
            }
            Element.prototype.selectNodes = function(xPath) {
                if (this.ownerDocument.selectNodes) {
                    return this.ownerDocument.selectNodes(xPath, this);
                } else {
                    throw "For XML Elements Only";
                }
            }
        }
        if (document.implementation.hasFeature("XPath", "3.0")) {
            XMLDocument.prototype.selectSingleNode = function(xPath, xNode) {
                if (!xNode)xNode = this;
                var xItems = this.selectNodes(xPath, xNode);
                return (xItems.length > 0) ? xItems[0] : null;
            }
            Element.prototype.selectSingleNode = function(xPath) {
                if (this.ownerDocument.selectSingleNode) {
                    return this.ownerDocument.selectSingleNode(xPath, this);
                } else {
                    throw "For XML Elements Only";
                }
            }
        }
    }
})()