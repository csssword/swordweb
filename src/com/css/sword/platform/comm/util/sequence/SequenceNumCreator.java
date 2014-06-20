package com.css.sword.platform.comm.util.sequence;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.exception.CSSFrameworkCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 
 * 
 * <p>
 * Title: SequenceNumCreator
 * </p>
 * <p>
 * Description: SWORD 企业应用基础平台
 * </p>
 * <p>
 * Copyright: Copyright (c) 2004 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: CS&S
 * </p>
 * 
 * @author
 * @version 1.0 Created on 2004-12-16
 */
public class SequenceNumCreator {

	private final static LogWritter logger = LogFactory
			.getLogger(SequenceNumCreator.class);

	@SuppressWarnings("unused")
	private static HashMap<?, ?> sequenceMappings = null;
	// add by ywh 2003.10.27 begin
	@SuppressWarnings("unused")
	private static final String SEQUENCE_FILE = "gdlt.cfg.sequence";

	// add by ywh 2003.10.27 end

	private SequenceNumCreator() {
	}

	/**
	 * 返回??个带有前??prefix的格式化了的Sequence??
	 * 
	 * @param prefix
	 *            String 前缀字符??
	 * @param con
	 *            Connection 数据库连??
	 * @param sequenceName
	 *            Sequence的名??
	 * @return Object 根据格式??做相应转??
	 * @exception TaxBPOException
	 * @author ywh
	 * @since 2003.10.23
	 */
	public static Object getSequenceNum(String prefix, String sequenceName,
			Connection con) throws CSSFrameworkCheckedException {
		ArrayList<Object> list = getSequenceNum(prefix, sequenceName, 1, con);
		if (null != list && list.size() > 0)
			return list.get(0);
		else
			return null;
	}

	/**
	 * 取得Sequence??
	 * 
	 * @param con
	 *            Connection 数据库连??
	 * @param sequenceName
	 *            String Sequence的名??
	 * @return Object 根据格式??做相应转??
	 * @exception TaxBPOException
	 * @author ywh
	 * @since 2003.10.23
	 */
	public static Object getSequenceNum(String sequenceName, Connection con)
			throws CSSFrameworkCheckedException {
		ArrayList<Object> list = getSequenceNum(null, sequenceName, 1, con);
		if (null != list && list.size() > 0)
			return list.get(0);
		else
			return null;
	}

	/**
	 * 在返回的值前面一律加上prefix字符??
	 * 
	 * @param prefix
	 *            String 前缀字符??
	 * @param con
	 *            Connection 数据库连??
	 * @param sequenceName
	 *            String Sequence的名??
	 * @param count
	 *            int 要生成的SequenceNumber的数??
	 * @return ArrayList 以ArrayList的形式返回SequenceNumber
	 * @exception TaxBPOException
	 */
	public static ArrayList<Object> getSequenceNum(String prefix, String sequenceName,
			int count, Connection con) throws CSSFrameworkCheckedException {
		ArrayList<Object> list = getSequenceNum(sequenceName, count, con);
		ArrayList<Object> results = new ArrayList<Object>(list.size());
		// add by ywh 2003.10.23 begin
		// 如果前缀?? null ?? 空字?? 返回list
		if (null == prefix || prefix.length() <= 0) {
			return list;
		}
		// add by ywh 2003.10.23 end
		// 前面??律加上prefix前缀字符??
		for (int i = 0; i < list.size(); i++) {
			results.add(i, prefix + (String) list.get(i));
		}
		return results;
	}

	/**
	 * 根据数据库连接con,从后台数据库获取??定数量的sequence,并以ArrayList的形?? 返回??
	 * 
	 * @param con
	 *            数据库连??
	 * @param sequenceName
	 *            Sequence的名??
	 * @param count
	 *            要生成的SequenceNumber的数??
	 * @return ArrayList 以ArrayList的形式返回SequenceNumber
	 * @exception TaxBPOException
	 */
	public static ArrayList<Object> getSequenceNum(String name, int count,
			Connection con) throws CSSFrameworkCheckedException {
		ArrayList<Object> results = new ArrayList<Object>(count);
		// modified by ywh 2003.10.27 begin
		// String sequenceName = SequenceNames.getSequenceName(name);
		SequenceMapping sm = getSequenceMapping(name);
		if (null == sm) {
			logger.error("Sequence??" + name + "不存在，请检查配置文件是否正确???");
			throw new CSSFrameworkCheckedException("32");
		}
		// modified by ywh 2003.10.27 end
		String sequenceName = sm.getSeqName();
		if (null == sequenceName) {
			logger.error("Sequence??" + sequenceName + "不存在，请检查配置文件是否正确???");
			throw new CSSFrameworkCheckedException("32");
		}

		try {
			// 从后台数据库中获取Sequence
			ArrayList<Long> sequences = SequenceNumberDAO.getSequenceNumbers(con,
					sequenceName, count);

			ArrayList<SequenceNumber> seqNums = convertToSequenceNumber(sequences.iterator());
			// modified by ywh 2003.10.27 begin
			// String sequenceFormat = SequenceNames.getFormat(sequenceName);
			String sequenceFormat = sm.getSeqFormat();
			// modified by ywh 2003.10.27 end
			results = format(seqNums.iterator(), sequenceFormat);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new CSSFrameworkCheckedException("32");
		}
		return results;
	}

	/**
	 * @param name
	 *            Sequence别名 返回Sequence对应的数据库中的名称
	 * @author 杨文??
	 * @since 2003.10.27
	 */
	private static SequenceMapping getSequenceMapping(String name) {
		// TODO: lfw: 如何取参数?
		Object obj = ConfManager.getValueByKey("???");
		if (obj != null && obj instanceof SequenceMapping) {
			return (SequenceMapping) obj;
		}
		return null;
	}

	/**
	 * 把sequence转换成SequenceNumber类，并以ArrayList的形式返回???
	 * 
	 * @param sequences
	 *            Iterator类型的sequence??
	 * @return ArrayList 把转换结果SequenceNumber类集以ArrayList形式返回
	 */
	private static ArrayList<SequenceNumber> convertToSequenceNumber(
			Iterator<Long> sequences) {
		ArrayList<SequenceNumber> results = new ArrayList<SequenceNumber>();
		for (; sequences.hasNext();) {
			results.add(new SequenceNumber(((Long) sequences.next())
					.longValue()));
		}
		return results;
	}

	/**
	 * 根据格式化参数format，调用SequenceNumberFormat类把Iterator里的
	 * SequenceNumber格式化成相应的格式，并以ArrayList形式返回结果??
	 * 
	 * @param seqNums
	 *            Iterator类型，里面存放的是SequenceNumber对象??
	 * @param format
	 *            SequenceFormats类的格式化种类静态常??
	 * @return ArrayList 返回结果
	 */
	private static ArrayList<Object> format(Iterator<SequenceNumber> seqNums,
			String format) {
		ArrayList<Object> results = new ArrayList<Object>();
		if (format.equals(SequenceFormats.LONG_YYYYMM_10SEQ_L0)) {
			// format to long
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_YYYYMM_10SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
		} else if (format.equals(SequenceFormats.LONG_1_9SEQ_L0)) {
			// format to number
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_1_9SEQ_L0((SequenceNumber) seqNums.next()));
			}

		} else if (format.equals(SequenceFormats.STR_8SEQ_L0)) {
			// format to String
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_8SEQ_L0((SequenceNumber) seqNums.next()));
			}
		} else if (format.equals(SequenceFormats.LONG_1YYYYMM_9SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_1YYYYMM_9SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
		} else if (format.equals(SequenceFormats.LONG_2YYYYMM_9SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_2YYYYMM_9SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
		} else if (format.equals(SequenceFormats.LONG_3YYYYMM_9SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_3YYYYMM_9SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
		} else if (format.equals(SequenceFormats.LONG_4YYYYMM_9SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_4YYYYMM_9SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
			// }else if (format.equals(SequenceFormats.FORMAT_STRING_21B )) {
			// for (; seqNums.hasNext(); ) {
			// results.add(SequenceNumberFormat.formatToStringWith21Bit(
			// (SequenceNumber) seqNums.next()));
			// }
			// added at 2003-09-20 css_zyd
		} else if (format.equals(SequenceFormats.LONG_SEQ)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToLONG_SEQ((SequenceNumber) seqNums.next()));
			}
			// added at 2003-10-03 朱宇??
		} else if (format.equals(SequenceFormats.STR_16SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_16SEQ_L0((SequenceNumber) seqNums.next()));
			}
			// added at 2003-10-04 朱宇??
		} else if (format.equals(SequenceFormats.STR_SEQ)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_SEQ((SequenceNumber) seqNums.next()));
			}
		} else if (format.equals(SequenceFormats.STR_3SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_3SEQ_L0((SequenceNumber) seqNums.next()));
			}
		}// 10??22，duanxx添加
		else if (format.equals(SequenceFormats.STR_YYYY_16SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_YYYY_16SEQ_L0((SequenceNumber) seqNums
								.next()));
			}
			// add by ywh 2003.10.29 begin
		} else if (format.equals(SequenceFormats.STR_1_4SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_1_4SEQ_L0((SequenceNumber) seqNums.next()));
			}
			// add by ywh 2003.10.25 begin
		} else if (format.equals(SequenceFormats.STR_1_10SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_1_10SEQ_L0((SequenceNumber) seqNums.next()));
			}
			// add by ywh 2003.12.27 begin
		} else if (format.equals(SequenceFormats.STR_1_9SEQ_L0)) {
			for (; seqNums.hasNext();) {
				results.add(SequenceNumberFormat
						.formatToSTR_1_9SEQ_L0((SequenceNumber) seqNums.next()));
			}
		} else {
			logger.error("找不到处理该格式的方??!格式名：" + format);
		}
		// add by ywh 2003.10.25 end
		return results;
	}
}