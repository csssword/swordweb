package com.css.ctp.gateway.jco;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.sap.conn.jco.server.JCoServer;
import com.sap.conn.jco.server.JCoServerState;
import com.sap.conn.jco.server.JCoServerStateChangedListener;

/**
 * 协议网关服务器-状态监听器
 * 
 * @author 史文帅
 * 
 */
public class GatewayServerStateListener implements JCoServerStateChangedListener {

	private final static LogWritter logger = LogFactory.getLogger(GatewayServerStateListener.class);

	public void serverStateChangeOccurred(JCoServer server, JCoServerState oldState, JCoServerState newState) {
		logger.debug("Server state changed from " + oldState.toString() + " to " + newState.toString()
				+ " on server with program id " + server.getProgramID());
	}

}
