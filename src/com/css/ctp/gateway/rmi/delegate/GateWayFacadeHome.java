package com.css.ctp.gateway.rmi.delegate;

import java.rmi.RemoteException;

import javax.ejb.CreateException;


/**
 * <p>Title: DomainFacadeHome</p>
 * <p>Description: DomainFacade EJB 的Home接口</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */
public interface GateWayFacadeHome extends javax.ejb.EJBHome {

	public GateWayFacade create() throws CreateException, RemoteException;
}