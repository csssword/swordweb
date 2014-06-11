package com.css.ctp.web.delegate;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.List;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;

/**
 * JCo连接池
 * 
 * @author 张久旭
 * 
 */
final class DestinationPool {

	private static final LogWritter logger = LogFactory.getLogger(DestinationPool.class);

	private String destinationPoolName = null;

	private List<JCoDestination> destinationPool = new ArrayList<JCoDestination>();

	private boolean isPool = true;

	private int head = -1;

	/**
	 * 初始化JCo连接池
	 * 
	 * @param dir
	 * @param destinationPoolName
	 * @exception CSSBaseBizCheckedException
	 */
	protected DestinationPool(String dir, String destinationPoolName) throws CSSBizCheckedException {
		JCoDestination destination = null;
		File[] configFiles = new File(dir).listFiles(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.endsWith(".jcoDestination");
			}
		});

		logger.debug("Starting init JCo destination pool: " + destinationPoolName + "..............");
		for (File file : configFiles) {
			String fileName = file.getName();
			try {
				fileName = fileName.substring(0, fileName.lastIndexOf("."));
				destination = JCoDestinationManager.getDestination(fileName);

				String host = destination.getMessageServerHost();

				if (host == null) {
					host = "Application Server -> " + destination.getApplicationServerHost() + ":"
							+ destination.getSystemNumber();
				} else {
					host = "Message Server : " + host;
				}

				logger.debug("Test the connection to the " + host + ".......");
				destination.ping();
				logger.debug("Successfully connected to the server.......");

				destinationPool.add(destination);
			} catch (Exception ex) {
				logger.error("Loading jco config file fail --> " + file.getAbsolutePath());
				throw new CSSBizCheckedException("0", ex);
			}
		}

		if (destinationPool.size() > 1) {
			isPool = true;
			head = (int) (Math.random() * destinationPool.size());
		} else {
			isPool = false;
		}

		this.destinationPoolName = destinationPoolName;
	}

	/**
	 * 连接获取方法
	 * 
	 * @return
	 */
	public JCoDestination getDestination() {
		if (isPool) {
			synchronized (destinationPool) {
				head++;
				if (head >= destinationPool.size()) {
					head = 0;
				}
			}
		} else {
			head = 0;
		}

		return destinationPool.get(head);
	}

	/**
	 * 连接池名
	 * 
	 * @return
	 */
	public String getDestinationPoolName() {
		return destinationPoolName;
	}

}