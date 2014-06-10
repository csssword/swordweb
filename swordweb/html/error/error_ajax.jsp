<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="/WEB-INF/taglib/c.tld" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>访问系统出现异常</title>
    <script type="text/javascript" src="../../swordweb/domain.js"></script>
    <link href="swordweb/html/error/styles/errorinfo.css" rel="stylesheet" type="text/css"/>
</head>
<body style="overflow:hidden;height:167px" onload="init()">
<div class="container" id="container">
    <div class="content">
        <div class="c_l" id='tubiao'></div>
        <table id="c_r" class="c_r">
            <tr>
                <td><span id='exceptionMes'></span></td>
            </tr>
        </table>
    </div>
    <div class="c_info" id="c_Info_DIV">
        <table>
            <tr>
                <td class="picdown" onclick='showmsg()' id="tdMsg"></td>
                <th><a href="javascript:void(0)" onclick='showmsg()' id="pict">显示详细信息</a></th>
                <th width="330px"></th>
                <th><a id='ywpt' href="javascript:void(0)" onclick='showywpt()'>运维平台</a>&nbsp;&nbsp;&nbsp;<a id="zxbz" href="javascript:onlinehelp()">在线帮助</a>
                </th>
            </tr>
        </table>

    </div>
    <div class="c_m">
        <div class="content_inner" style="display:none" id="detailMsgObj"></div>
    </div>
</div>
</body>
<script type="text/javascript">
    function closeError() {
        box.close();
    }
    function init() {
        if (typeof(box) == 'object')
            delayInit();
        else
            setTimeout("init()", 30);
    }
    function delayInit() {
        var data = box.options.param.data;
      //  document.getElementById("cwbmTR").style.display = (data['exceptionMes'] == "系统出错" || data['exceptionMes'] == data['exceptionName']) ? "none" : "";
      //  document.getElementById('exceptionName').innerHTML = data['exceptionName'];
        document.getElementById('exceptionMes').innerHTML = data['exceptionMes'].replace(/&lt;br&gt;/g, '<br>');
        document.getElementById('detailMsgObj').innerHTML = ['<pre>',data['debugMes'],'</pre>'].join('');
    }
    var _ChargeClickMele_ = 0;
    var _isOpen = false;
    function chargeIsShowmsg() {
        if (_isOpen) {
            _ChargeClickMele_ = 0;
            _isOpen = false;
            showmsg();
            return;
        }
        if (_ChargeClickMele_ == 0)
            _ChargeClickMele_ = 1;
        else if (_ChargeClickMele_ == 3) {
            showmsg();
        }
        else
            _ChargeClickMele_ = 0;
    }
    function _addClickCount() {
        if (_ChargeClickMele_ == 1)_ChargeClickMele_ = 2
        else _ChargeClickMele_ = 0;
    }
    function _addClickCount1() {
        if (_ChargeClickMele_ == 2)_ChargeClickMele_ = 3
        else _ChargeClickMele_ = 0;
    }
    function showmsg(detailid) {
        var msg = document.getElementById('detailMsgObj');
        if (msg.style.display == 'none') {
            document.getElementById("tdMsg").className = 'picup';
            //box.popUpDiv.setStyle('height', 507).getElements("div").setStyle('height', 507);
            box.contentDiv.setStyle('height', 479);
            box.contentIframe.setStyle('height', 479);
            document.body.style.height = 479;
            msg.style.display = '';
            _isOpen = true;
        } else {
            document.getElementById("tdMsg").className = 'picdown';
            box.contentDiv.setStyle('height', 167);
            box.contentIframe.setStyle('height', 167);
            msg.style.display = 'none';
            document.body.style.height = 167;
        }
        return false;
    }
    function onlinehelp() {

    }
    function showywpt() {
    var data = box.options.param.data;
    var msg = [{"ycxx":data["exceptionMes"]},{"dzxx":data["debugMes"]}];
    if (top.ywzcptcsfh != undefined) top.ywzcptcsfh(msg);
    }
</script>
</html>
