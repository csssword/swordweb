package com.css.sword.platform.web.session;

import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.platform.web.event.SwordReq;
import com.css.sword.platform.web.event.SwordRes;
import com.css.sword.platform.web.mvc.SwordDataSet;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by IntelliJ IDEA.
 * User: CSS
 * Date: 12-3-30
 * Time: 上午10:41
 * To change this template use File | Settings | File Templates.
 */
public interface ISwordOnFinish {

    public void onFinish(SwordDataSet dataSet);


}
