SwordValidator.implement( {
    length:function(e) {
	    var value = this.getElValue(e);
	    if(value == "")
	        return true;
	    var len = this.getLen(value);
        if (e.get("rule").contains(",")) {
            return (len >= e.get("begin") && len <= e.get("end"));
        } else {
            if ($defined(e.get("end")))
                return (len > e.get("begin") && len < e.get("end"));
            else return len == e.get("begin");
        }
    } , getLen:function(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var strCode = str.charCodeAt(i);
            var strChar = str.charAt(i);
            if ((strCode > 65248) || (strCode == 12288) || this.reg.chinese.test(strChar) || this.reg.twoBytes.test(strChar))
                len = len + 3;
            else
                len = len + 1;
        }
        return len;
    }
});