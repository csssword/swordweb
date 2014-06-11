package com.css.ctp.gateway.jco;

import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 演示程序
 * 
 * @author 史文帅
 * 
 */
public class DemoProtocolAdapter extends AbsProtocolAdapter {

	private static final LogWritter logger = LogFactory.getLogger(DemoProtocolAdapter.class);

	@Override
	public Map<String, Object> convert(Map<String, Object> parameter) throws CSSBizCheckedException {
		Map<String, Object> jcoResMap = new HashMap<String, Object>();
		logger.debug("进来了");

		return jcoResMap;
	}

	@Override
	public String getConvertFunctionName() {
		return "CONNECTION_STRUCTURE";
	}

}
