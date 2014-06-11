package com.css.sword.platform.web.session;

import com.css.sword.kernel.platform.SwordSession;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: CSS
 * Date: 11-11-17
 * Time: 上午9:35
 * To change this template use File | Settings | File Templates.
 */
public interface ISwordSessionDataCreater {

    public void createSessionData(HttpServletRequest request,SwordSession swordSession);

    public static final String DataFromSessionCreater="$dataFromSessionCreater$";

}
