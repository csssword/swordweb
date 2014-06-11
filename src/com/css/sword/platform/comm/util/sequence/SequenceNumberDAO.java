package com.css.sword.platform.comm.util.sequence;

import java.sql.Connection;
import java.util.ArrayList;

import sun.jdbc.rowset.CachedRowSet;

import com.css.sword.platform.comm.exception.CSSFrameworkCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 根据SequenceName值，采用Orcale的SEQUENCE机制获取??定数量的sequence值，并以 ArrayList的形式返回???
 * 
 * <p>
 * Title: SequenceNumberDAO
 * </p>
 * <p>
 * Description: 广东地税大集中项目新??代税收征管信息系??
 * </p>
 * <p>
 * Copyright: Copyright (c) 2003 广东省地方税务局、中软网络技术股份有限公??
 * </p>
 * <p>
 * Company: 中软网络??术股份有限公??
 * </p>
 * 
 * @author 朱宇??
 * @version 1.0
 */

public class SequenceNumberDAO {

	private final static LogWritter logger = LogFactory
			.getLogger(SequenceNumberDAO.class);
	private static String GEN_BEFORE = "SELECT ";
	private static String GEN_AFTER = ".NEXTVAL FROM DUAL";

	protected SequenceNumberDAO() {
	}

	/**
	 * 根据数据库连接conn,从后台数据库获取??定数量的sequence,并以ArrayList的形 式返回???
	 * 
	 * @param con
	 *            数据库连??
	 * @param name
	 *            Sequence的名??
	 * @param count
	 *            ??要获取的Sequence的数??
	 * @return ArrayList 以ArrayList的形式返回Sequence
	 * @throws Exception
	 *             TaxBPOException
	 */
	public static ArrayList<Long> getSequenceNumbers(Connection con,
			String sequenceName, int count) throws CSSFrameworkCheckedException {
		ArrayList<Long> results = new ArrayList<Long>(count);
		CachedRowSet rs = null;
		ArrayList<Object> sqlParms = new ArrayList<Object>();

		try {
			for (int i = 1; i <= count; i++) {
				rs = QueryBPO.findAll(con, getSQL(sequenceName), sqlParms);
				if (rs.first()) {
					results.add(new Long(rs.getLong(1)));
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new CSSFrameworkCheckedException("32");
		}
		return results;
	}

	// 构???sql语句
	private static String getSQL(String sequenceName) {
		return GEN_BEFORE + sequenceName + GEN_AFTER;
	}
}