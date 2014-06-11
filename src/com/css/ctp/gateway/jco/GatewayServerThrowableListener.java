package com.css.ctp.gateway.jco;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.sap.conn.jco.server.JCoServer;
import com.sap.conn.jco.server.JCoServerContextInfo;
import com.sap.conn.jco.server.JCoServerErrorListener;
import com.sap.conn.jco.server.JCoServerExceptionListener;

/**
 * 协议网关服务器-错误监听器
 * 
 * @author 史文帅
 * 
 */
public class GatewayServerThrowableListener implements JCoServerErrorListener, JCoServerExceptionListener {

	private static final LogWritter logger = LogFactory.getLogger(GatewayServerThrowableListener.class);

	public void serverErrorOccurred(JCoServer jcoServer, String connectionId, JCoServerContextInfo serverCtx,
			Error error) {
		logger.error(">>> Error occured on " + jcoServer.getProgramID() + " connection " + connectionId, error);
	}

	public void serverExceptionOccurred(JCoServer jcoServer, String connectionId, JCoServerContextInfo serverCtx,
			Exception error) {
		logger.error(">>> Error occured on " + jcoServer.getProgramID() + " connection " + connectionId, error);
	}

}
