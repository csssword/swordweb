package com.css.sword.platform.persistence.pagination;

import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.mvc.SwordDataSet;

/**
 * 分页信息管理
 * <br>
 * Information:<br>
 * 此类用于管理，处理分页参数，需结合SwordWeb
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.persistence.pagination<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> PaginationManager.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class PaginationManager {
	public static final String TOTAL_NUMBER = "rows"; // 每页显示行数
	public static final String PAGE_NUMBER = "pageNum"; // 请求页数，第几页 todo 与前端重构一致
	public static final String QUERY_FLAG = "queryType";
	public static final String QUERY_FIRST = "first";// 第一次请求
	public static final String QUERY_PAGE = "page";// 翻页请求
	public static final String QUERY_SORT = "sort";// 翻页请求
	public static final String TOTAL_RECORDER = "totalRows";// 数据总数
	public static final String BIZ_PARAMS = "bizParams";
	public static final String SORT_FLAG = "sortFlag";
	public static final String SORT_NAME = "sortName";
	public static final String PAGINATION_CONFIG = "paginationConfig";
	public static final String WIDGET_NAME = "widgetname";

	/**
	 * 此枚举类规约了排序标记<br>
	 * DESC|ASC
	 * 
	 * @author WangJingLong
	 * 
	 */
	public static enum SortFlag {
		desc, asc
	};

	protected static final LogWritter log = LogFactory
			.getLogger(PaginationManager.class);

	public static void load(String widgetName) {
		log.debug("获取分页信息！组件名称：" + widgetName);
		// 1、 获得提交参数
		Map<String, Object> rdoData = getRdoDatas();
		// 2、创建Ticket
		createTicket();
		// 3、创建此组件的分页信息
		createWidgetConfig(widgetName);
		// 4、根据不同种类的请求，初始化分页信息
		if (isPageQuery(rdoData)) {
			initPageInfo(widgetName, rdoData);
			if (isSortQuery(rdoData)) {
				initSortQuery(widgetName, rdoData);
			}
		} else {
			setDefault(widgetName, rdoData);
		}
		// 5、存入必要参数
		setCommonConfig(widgetName, rdoData);
	}

	public static Map<String, Object> getRdoDatas() {
		log.debug("获取提交数据。");
        //todo edit by liuzhy
		SwordDataSet rsds = ContextAPI.getReqDataSet();
        //(IPaginationReqEvent) ThreadLocalManager.get(IPaginationReqEvent.PAGINATION_PARAM);
		return rsds.getPaginationParams();
	}

	private static void createTicket() {
		Map<String, Map<String, Object>> ticket = new HashMap<String, Map<String, Object>>();
		if (ThreadLocalManager.get(PAGINATION_CONFIG) == null) {
			log.debug("创建分页配置信息。");
			ThreadLocalManager.add(PAGINATION_CONFIG, ticket);
		}
	}

	private static void createWidgetConfig(String widgetName) {
		Map<String, Map<String, Object>> ticketMap = getTicket();
		Map<String, Object> configMap = getConfig(widgetName);
		if (configMap == null) {
			log.debug("创建分页参数。组件名称：" + widgetName);
			configMap = new HashMap<String, Object>();
			ticketMap.put(widgetName, configMap);
		}
	}

	private static boolean isSortQuery(Map<String, Object> rdoData) {
		Object paginationFlag = rdoData.get(SORT_NAME);
		if (paginationFlag == null) {
			return false;
		} else {
			return true;
		}
	}

	private static boolean isPageQuery(Map<String, Object> rdo) {
		Object paginationFlag = rdo.get(QUERY_FLAG);
		if (paginationFlag == null || !paginationFlag.equals(QUERY_PAGE)) {
			return false;
		} else {
			return true;
		}
	}

	private static void setDefault(String widgetName, Map<String, Object> rdo) {
		log.debug("使用默认分页参数。组件名称：" + widgetName);
		Map<String, Object> configMap = getConfig(widgetName);
		if (configMap.get(PAGE_NUMBER) == null) {
			configMap.put(PAGE_NUMBER, 1);
		}
		if (configMap.get(TOTAL_NUMBER) == null) {
			configMap.put(TOTAL_NUMBER, 20);
		}
	}

	private static void initPageInfo(String widgetName, Map<String, Object> rdo) {
		log.debug("从提交的数据中获取分页参数，并初始化分页信息。组件名称：" + widgetName);
		Map<String, Object> configMap = getConfig(widgetName);
		Object pageNum = rdo.get(PAGE_NUMBER);
		Object totalNum = rdo.get(TOTAL_NUMBER);
		if (pageNum == null || totalNum == null) {
			throw new RuntimeException("获取分页信息时失败，请检查分页信息是否正确。组件名称："
					+ widgetName);
		}
		configMap.put(PAGE_NUMBER, pageNum);
		configMap.put(TOTAL_NUMBER, totalNum);
	}

	private static void initSortQuery(String widgetName,
			Map<String, Object> rdoData) {
		Map<String, Object> configMap = getConfig(widgetName);
		//此判断为了适应链式调用BLH时防止初始化所有组件分页信息。
		if (!widgetName.equals(rdoData.get(WIDGET_NAME))) {
			return;
		}
		log.debug("初始化组件排序信息。组件名称：" + widgetName);
		Object sortFlag = rdoData.get(SORT_FLAG);
		Object sortName = rdoData.get(SORT_NAME);
		if (sortFlag.toString() != null && !sortFlag.toString().equals("null")) {
			configMap.put(SORT_FLAG, sortFlag);
		}
		if (sortName.toString() != null && !sortName.toString().equals("null")) {
			configMap.put(SORT_NAME, sortName);
		}
	}

	private static Object getTicketValue(String widgetName, String key) {
		return getConfig(widgetName).get(key);
	}

	private static Map<String, Object> getConfig(String widgetName) {
		Map<String, Map<String, Object>> ticketMap = getTicket();
		return ticketMap.get(widgetName);
	}

	@SuppressWarnings("unchecked")
	private static Map<String, Map<String, Object>> getTicket() {
		Map<String, Map<String, Object>> ticketMap = (Map<String, Map<String, Object>>) ThreadLocalManager
				.get(PAGINATION_CONFIG);
		return ticketMap;
	}

	public static void setParams(String widgetName, String key, Object value) {
		// 创建Ticket
		createTicket();
		// 创建配置
		createWidgetConfig(widgetName);
		Map<String, Map<String, Object>> ticketMap = getTicket();
		Map<String, Object> configMap = getConfig(widgetName);
		configMap.put(key, value);
		ticketMap.put(widgetName, configMap);
	}

	public static int getTotalNum(String widgetName) {
		return (Integer) getTicketValue(widgetName, TOTAL_NUMBER);
	}

	public static int getPageNum(String widgetName) {
		return (Integer) getTicketValue(widgetName, PAGE_NUMBER);
	}

	public static String getSortFlag(String widgetName) {
		Object obj = getTicketValue(widgetName, SORT_FLAG);
		if (obj == null) {
			return null;
		}
		return (String) obj;
	}

	public static String getSortName(String widgetName) {
		Object obj = (String) getTicketValue(widgetName, SORT_NAME);
		if (obj == null) {
			return null;
		}
		return (String) obj;
	}

	public static void setTotalRecorder(String widgetName, int num) {
		Map<String, Map<String, Object>> ticketMap = getTicket();
		Map<String, Object> configMap = ticketMap.get(widgetName);
		configMap.put(TOTAL_RECORDER, num);
	}

	public static int getTotalRecorder(String widgetName) {
		Map<String, Map<String, Object>> ticketMap = getTicket();
		Map<String, Object> configMap = ticketMap.get(widgetName);
		return (Integer) configMap.get(TOTAL_RECORDER);
	}

	public static void setCommonConfig(String widgetName,
			Map<String, Object> rdoData) {
		getConfig(widgetName).put(BIZ_PARAMS, rdoData.get(BIZ_PARAMS));
	}
}
