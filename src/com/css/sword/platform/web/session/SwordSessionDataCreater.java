package com.css.sword.platform.web.session;

import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.kernel.utils.SwordSessionUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: CSS
 * Date: 11-11-17
 * Time: 上午9:37
 * To change this template use File | Settings | File Templates.
 */
public class SwordSessionDataCreater implements ISwordSessionDataCreater{
    @Override
    public void createSessionData(HttpServletRequest request, SwordSession swordSession) {
        //todo 暂时这样写，为了兼容原有系统，当门户组实现完真正的类之后，可以全部去掉
       HttpSession hs = request.getSession();
        String swrydm = (String) hs.getAttribute("swrydm");
        String swjgdm = (String) hs.getAttribute("swjgdm") ;

        swordSession.setOrgID(swrydm);
        swordSession.setUserID(swjgdm);

 /*  Map map = new HashMap();
        map.put("test1", "11111111111");
        map.put("test2", "22222222222");
        //放入到tmpData中的数据会跟随远程调用dto传递，ISwordSessionDataCreater.DataFromSessionCreater为key，后面数据访问工具类需要使用此key来获取数据。
        SwordSessionUtils.putTempDataInSession(ISwordSessionDataCreater.DataFromSessionCreater, map);
*/
    }
}
