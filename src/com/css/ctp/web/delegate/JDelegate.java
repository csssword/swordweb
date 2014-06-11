package com.css.ctp.web.delegate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.css.ctp.core.commutils.SessionUtils;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.comm.DateUtil;
import com.css.sword.platform.web.comm.ViewDataHelper;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoField;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoMetaData;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;
import com.sap.conn.jco.JCoTable;

/**
 * 系统远程调用服务类
 * 
 * @author 张久旭
 * 
 */
@SuppressWarnings("unchecked")
public final class JDelegate {

	private static final LogWritter logger = LogFactory
			.getLogger(JDelegate.class);

	private DestinationPool destinationPool = null;

	/**
	 * 使用默认连接池进行调用
	 */
	public JDelegate() {
		this.destinationPool = DestinationPoolManager
				.getDefaultDestinationPool();
	}

	/**
	 * 使用指定连接池进行调用
	 * 
	 * @param destinationPoolName
	 */
	public JDelegate(String destinationPoolName) {
		this.destinationPool = DestinationPoolManager
				.getDestinationPool(destinationPoolName);
	}

	/**
	 * 远程调用接口－Ctrl类专用
	 * 
	 * @param resView
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public Map<String, Object> callRFC(SwordDataSet resView)
			throws CSSBizCheckedException {
		Map<String, String> session = new HashMap<String, String>();
		session.put("SESSION_ID", resView.getSessionID());
		session.put("TID", resView.getTid());
		session.put("SWRY_DM", resView.getContextValue("SWRY_DM"));
		session.put("SWJG_DM", resView.getContextValue("SWJG_DM"));
		session.put("SWRY_MC", resView.getContextValue("SWRY_MC"));
		session.put("SWJG_MC", resView.getContextValue("SWJG_MC"));
		return callRFC(session, resView.getTid(), ViewDataHelper
				.getReqMap(resView));
	}

	/**
	 * 远程调用接口－其它类使用
	 * 
	 * @param session
	 * @param apiName
	 * @param parameter
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public Map<String, Object> callRFC(String rfmName,
			Map<String, Object> parameter) throws CSSBizCheckedException {
		Map<String, String> session = new HashMap<String, String>();
		session.put("SESSION_ID", SessionUtils.genSessionID());
		session.put("TID", rfmName);
		return callRFC(session, rfmName, parameter);
	}

	/**
	 * 远程调用接口
	 * 
	 * @param session
	 * @param rfmName
	 * @param parameter
	 * @return
	 * @throws CSSBizCheckedException
	 */
	private Map<String, Object> callRFC(Map<String, String> session,
			String rfmName, Map<String, Object> parameter)
			throws CSSBizCheckedException {
		JCoDestination destination = destinationPool.getDestination();
		JCoFunction function = null;
		Map<String, Object> value = null;

		if (parameter == null) {
			parameter = new HashMap<String, Object>();
		}
		parameter.put("SESSION", session);

		try {
			function = destination.getRepository().getFunction(rfmName);
		} catch (JCoException ex) {
			throw new CSSBizCheckedException("0", ex);
		}

		if (function == null) {
			logger.error("SAP系统中没有" + rfmName + "方法，或该方法不是远程方法");
			throw new CSSBizCheckedException("0");
		}

		// 进行输入参数类型转换
		convertParameterToSapObject(parameter, function, false);

		// 调用远程方法
		try {
			logger.debug("开始调用远程方法-->" + rfmName);
			function.execute(destination);
		} catch (JCoException ex) {
			String exstr = ex.getLocalizedMessage();
			int index = exstr.indexOf("EX_");
			if (index != -1) {
				exstr = exstr.substring(index+3);
			}
			throw new CSSBizCheckedException("0", new Exception(exstr));
		}

		// 进行返回参数类型转换
		value = convertSapObjectToParameter(function, false);

		return value;
	}

	/**
	 * 将输入参数转换成SAP远程方法需要的对象
	 * 
	 * @param parameter
	 * @param function
	 * @param abapCallJava
	 * @throws CSSBizCheckedException
	 */
	public static void convertParameterToSapObject(
			Map<String, Object> parameter, JCoFunction function,
			boolean abapCallJava) throws CSSBizCheckedException {
		JCoFieldIterator iterator = null;

		// 处理单向传入参数
		JCoParameterList ipara = null;
		if (abapCallJava) {
			ipara = function.getExportParameterList();
		} else {
			ipara = function.getImportParameterList();
		}

		if (ipara != null) {
			iterator = ipara.getFieldIterator();
			while (iterator.hasNextField()) {
				JCoField field = iterator.nextField();
				convertParameterToSapObject(field, parameter.get(field
						.getName()));
			}
		}

		// 处理双向传入传出参数
		JCoParameterList cpara = function.getChangingParameterList();
		if (cpara != null && cpara.getFieldCount() > 0) {
			iterator = cpara.getFieldIterator();
			while (iterator.hasNextField()) {
				JCoField field = iterator.nextField();
				convertParameterToSapObject(field, parameter.get(field
						.getName()));
			}
		}
	}

	/**
	 * 将返回的SAP对象转换为Java结构
	 * 
	 * @param function
	 * @param abapCallJava
	 * @return
	 */
	public static Map<String, Object> convertSapObjectToParameter(
			JCoFunction function, boolean abapCallJava) {
		Map<String, Object> value = null;
		JCoFieldIterator iterator;

		// 获取单向传出参数值
		JCoParameterList opara = null;
		if (abapCallJava) {
			opara = function.getImportParameterList();
		} else {
			opara = function.getExportParameterList();
		}

		if (opara != null && opara.getFieldCount() > 0) {
			iterator = opara.getFieldIterator();
			value = new HashMap<String, Object>(opara.getFieldCount());
			while (iterator.hasNextField()) {
				JCoField field = iterator.nextField();
				value.put(field.getName(), convertSapObjectToParameter(field
						.getValue()));
			}
		}

		// 处理双向传入传出参数
		JCoParameterList cpara = function.getChangingParameterList();
		if (cpara != null && cpara.getFieldCount() > 0) {
			iterator = cpara.getFieldIterator();
			if (value == null) {
				value = new HashMap<String, Object>(cpara.getFieldCount());
			}
			while (iterator.hasNextField()) {
				JCoField field = iterator.nextField();
				value.put(field.getName(), convertSapObjectToParameter(field
						.getValue()));
			}
		}

		return value;
	}

	/**
	 * 将输入参数转换成SAP远程方法需要的对象
	 * 
	 * @param field
	 * @param obj
	 * @throws CSSBizCheckedException
	 */
	public static void convertParameterToSapObject(JCoField field, Object obj)
			throws CSSBizCheckedException {
		if (obj == null) {
			return;
		}

		if (field.isStructure()) {
			if (!(obj instanceof Map)) {
				logger.error("参数" + field.getName() + "参数类型不是Map");
				throw new CSSBizCheckedException("0");
			}

			Map<String, Object> data = (Map<String, Object>) obj;
			JCoFieldIterator iterator = field.getStructure().getFieldIterator();

			while (iterator.hasNextField()) {
				JCoField nextField = iterator.nextField();
				try {
					convertParameterToSapObject(nextField, data.get(nextField
							.getName()));
				} catch (Exception e) {
					throw new CSSBizCheckedException("0", e);
				}
			}
		} else if (field.isTable()) {
			if (!(obj instanceof List)) {
				logger.error("参数" + field.getName() + "参数类型不是List");
				throw new CSSBizCheckedException("0");
			}

			List<Map<String, Object>> data = (List<Map<String, Object>>) obj;
			JCoTable table = field.getTable();
			// 2011-5-26张久旭，开始
			// 尝试解决数据翻倍问题
			table.clear();
			// 2011-5-26张久旭，结束

			for (int idx = 0; idx < data.size(); idx++) {
				Map<String, Object> row = data.get(idx);
				table.appendRow();
				JCoFieldIterator iterator = table.getFieldIterator();
				while (iterator.hasNextField()) {
					JCoField nextField = iterator.nextField();
					convertParameterToSapObject(nextField, row.get(nextField
							.getName()));
				}
			}
		} else {
			// edit by pushi begin
			int type = field.getType();
			if (!(obj instanceof String)) {
				logger.error("参数" + field.getName() + "参数类型有误，要求String");
				throw new CSSBizCheckedException("0");
			}
			String value = ((String) obj).trim();
			if ("".equals(value)) {
				return;
			}
			switch (type) {
			case JCoMetaData.TYPE_CHAR:
				field.setValue(value);
				break;
			case JCoMetaData.TYPE_INT:
				field.setValue(Integer.parseInt(value));
				break;
			case JCoMetaData.TYPE_INT1:
				value = value.trim();
				field.setValue(Integer.parseInt(value));
				break;
			case JCoMetaData.TYPE_INT2:
				field.setValue(Integer.parseInt(value));
				break;
			case JCoMetaData.TYPE_NUM:
				field.setValue(value);
				break;
			case JCoMetaData.TYPE_BCD:
				field.setValue(new BigDecimal(value));
				break;
			case JCoMetaData.TYPE_DATE:
				field.setValue(DateUtil.parseToDate(value));
				break;
			case JCoMetaData.TYPE_TIME:
				field.setValue(DateUtil.parseToDate(value));
				break;
			case JCoMetaData.TYPE_FLOAT:
				field.setValue(Double.parseDouble(value));
				break;
			case JCoMetaData.TYPE_BYTE:
				// byte数组要求以'，'分隔
				field.setValue(value.split(","));
				break;
			case JCoMetaData.TYPE_STRING:
				field.setValue(value);
				break;
			case JCoMetaData.TYPE_XSTRING:
				// byte数组要求以'，'分隔
				field.setValue(value);
				break;
			}
			// edit by pushi end
		}
	}

	/**
	 * 将返回的SAP对象转换为Java结构
	 * 
	 * @param obj
	 * @return
	 */
	public static Object convertSapObjectToParameter(Object obj) {
		Object value = null;

		if (obj == null) {
			return null;
		} else if (obj instanceof JCoStructure) {
			JCoStructure struct = (JCoStructure) obj;
			Map<String, Object> tmp = new HashMap<String, Object>(struct
					.getFieldCount());
			JCoFieldIterator iterator = struct.getFieldIterator();

			while (iterator.hasNextField()) {
				JCoField field = iterator.nextField();
				tmp.put(field.getName(), convertSapObjectToParameter(field
						.getValue()));
			}
			value = tmp;
		} else if (obj instanceof JCoTable) {
			JCoTable table = (JCoTable) obj;
			if (table.isEmpty()) {
				value = new ArrayList<Object>(1);
			} else {
				List<Map<String, Object>> tmp = new ArrayList<Map<String, Object>>(
						table.getNumRows());
				int columnNum = table.getFieldCount();
				table.firstRow();
				do {
					Map<String, Object> data = new HashMap<String, Object>(
							columnNum);
					JCoFieldIterator iterator = table.getFieldIterator();
					while (iterator.hasNextField()) {
						JCoField field = iterator.nextField();
						data.put(field.getName(),
								convertSapObjectToParameter(field.getValue()));
					}
					tmp.add(data);
				} while (table.nextRow());
				value = tmp;
			}
		} else {
			if (obj instanceof BigDecimal) {
				value = obj.toString();
			} else if (obj instanceof Date) {
				value = DateUtil.dateToStr(obj);
			} else {
				value = String.valueOf(obj);
			}
		}

		return value;
	}

}
