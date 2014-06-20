package com.css.sword.platform.web.commonCtrl;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;

@CTRL("SwordPage")
public class PageCtrl extends BaseDomainCtrl {
    private final static LogWritter logger = LogFactory
            .getLogger(PageCtrl.class);
    
    public IResData redirect(IReqData req) {
		SwordRes res = new SwordRes();
		String pagename= (String) req.getAttr("pagename");
        logger.debug("开始转向页面【"+pagename+"】");
        res.addPage(pagename);
		return res;
	}

}