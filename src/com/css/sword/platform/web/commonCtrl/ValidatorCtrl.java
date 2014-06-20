package com.css.sword.platform.web.commonCtrl;

import com.css.sword.platform.comm.exception.CSSBaseCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.comm.CommParas;
import com.css.sword.platform.web.event.publicServices.ValidatorReqEvent;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.mvc.dataobjects.ReqDataObject;

/**
 * 验证组件公共服务
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.commonCtrl<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ValidatorCtrl.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author liuzhongyuan <br>
 * @since Sword 4.0.0<br>
 */
public class ValidatorCtrl {
	protected static final LogWritter log = LogFactory
			.getLogger(ValidatorCtrl.class);

	private static final String VALIDATE_VAULE = "validateValue";
	private static final String VALIDATOR = "validator";
	@SuppressWarnings("unused")
	private static final String SUCCESS = "success";
	@SuppressWarnings("unused")
	private static final String MESSAGE = "message";

	public void validate() throws CSSBaseCheckedException {
		SwordDataSet sds = (SwordDataSet) ThreadLocalManager.get(CommParas.reqDataSet);
		String tid = sds.getTid();
		ValidatorReqEvent req = new ValidatorReqEvent(tid);
		ReqDataObject rdo = sds.getReqDataObject();
		Object validateValue = rdo.getViewData().get(VALIDATE_VAULE);
		if (validateValue == null) {
			throw new RuntimeException("不能获取验证信息！");
		}
		Object validator = rdo.getViewData().get(VALIDATOR);
		if (validator == null) {
			throw new RuntimeException("不能获取验证处理信息！");
		}
		req.setValidator(validator.toString());
		req.setValidateValue(validateValue);
		/*ValidatorResEvent res = (ValidatorResEvent) BizDelegate.delegate(req);
		boolean success = res.isSuccessed();
		String message = res.getMessage();
		ContextAPI.getResDataSet().addRootAttr(SUCCESS, success);
		ContextAPI.getResDataSet().addRootAttr(MESSAGE, message);*/
	}
}
