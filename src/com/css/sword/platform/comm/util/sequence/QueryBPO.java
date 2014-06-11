package com.css.sword.platform.comm.util.sequence;

import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import sun.jdbc.rowset.CachedRowSet;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.exception.CSSFrameworkCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.util.RefUtils;

/**
 * 
 * 
 * <p>
 * Title: QueryBPO
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

public class QueryBPO {

	private final static LogWritter logger = LogFactory
			.getLogger(QueryBPO.class);

	public QueryBPO() {
	}

	/**
	 * 查询方法。查询满足strSql条件的数据项。该方法会将捕获到的异常封 装成TaxBPOException异常抛出。
	 * 
	 * @param con
	 *            :Connection - 与数据库的连接
	 * @param strSql
	 *            :String - 将要执行的SQL查询语句；
	 * @param sqlParams
	 *            : ArrayList － java.util.ArrayList 类型的属性，该属性
	 *            用来存放将要执行的SQL语句中的参数（即，所有“？”的值）。sqlParams中封装了所有的
	 *            参数，他们按照在SQL语句中出现的先后顺序被封装在ArrayList中。
	 * @return CachedRowSet - 得到的结果
	 * @throws TaxBPOException
	 */
	public static CachedRowSet findAll(Connection con, String strSql,
			ArrayList<?> sqlParams) throws CSSFrameworkCheckedException {

		logger.info("对数据库进行操作，SQL:" + strSql); // 记录日志
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			CachedRowSet rowSet;
			//Calendar start = Calendar.getInstance();
			//Calendar createStart = Calendar.getInstance();
			ps = preparedStatementCreate(con, strSql, sqlParams); // 生成preparedStatement
																	// 实例
			//Calendar createEnd = Calendar.getInstance();
			//Calendar queryStart = Calendar.getInstance();
			rs = ps.executeQuery(); // 执行查询操作
			//Calendar queryEnd = Calendar.getInstance();

			rowSet = new CachedRowSet(); // 生成一个CachedRowSet对象
			rowSet.populate(rs); // 将查询结果加入到rowSet 实例中

			return rowSet;
		} catch (SQLException ex) {
			logger.error("00051", ex);
			throw new CSSFrameworkCheckedException("51");
		} finally {
			try {
				if (rs != null)
					rs.close(); // 关闭结果集
				if (ps != null)
					ps.close(); // 关闭preparedStatement对象
			} catch (SQLException ex1) {

			}
		}
	}

	/**
	 * 这个方法用根据提供的SQL语句对数据库进行查询。该方法与上一个 findAll方法不同
	 * 的是，他一次性执行与key值相对应的SQL语句。该方法会将捕获到的异常封装成 TaxBPOException异常抛出。
	 * 
	 * @param con
	 *            ：Connection 与数据库建立的连接
	 * @param key
	 *            ：String 将要执行的SQL语句的对应的key
	 * @param sqlParams
	 *            ：ArrayList java.util.ArrayList 类型的属性，该属性
	 *            用来存放将要执行的SQL语句中的参数（即，所有“？”的值）。sqlParams中封装了所有的
	 *            参数，他们按照在SQL语句中出现的先后顺序被封装在ArrayList中。
	 * @return
	 * @throws TaxBPOException
	 */
	public static CachedRowSet findAll(String key, Connection con,
			ArrayList<?> sqlParams) throws CSSBizCheckedException {

		return null;
	}

	/**
	 * 生成PreparedStatement实例，然后为PreparedStatement<br>
	 * 实例添加属性（data中传递进来的）。最后返回PreparedStatement<br>
	 * 实例。PreparedStatement由参数con生成。PreparedStatement<br>
	 * 中需要设置的参数由sqlParam给出。方法可以根据参数类型将参数转换<br>
	 * 为该类型，并调用PreparedStatement中相应的setＸＸＸ方法设置参<br>
	 * 数。
	 * 
	 * @param con
	 *            :Connection 与数据库建立的连接
	 * @param sqlStr
	 *            :String 将要执行的sql语句
	 * @param sqlParams
	 *            :ArrayList SQL语句中的参数（“?”）
	 * @return PreparedStatement 生成的PreparedStatement实例
	 * @throws SQLException
	 */
	private static PreparedStatement preparedStatementCreate(Connection con,
			String sqlStr, ArrayList<?> sqlParams) throws SQLException {
		PreparedStatement ps = con.prepareStatement(sqlStr); // 生成preparedStatement实例

		if (sqlParams == null) {
			return ps;
			// sqlParams = new ArrayList() ;
		}
		Iterator<?> ii = sqlParams.iterator();
		int i = 1;

		while (ii.hasNext()) {
			// 判断各个参数的类型，并调用相应的setter方法；
			Object value = ii.next();
			String type = RefUtils.getDataType(value);
			if (type == null) {
				ps.setNull(i++, Types.CHAR);
			} else if (type.equals("String")) {
				ps.setString(i++, (String) value);
			} else if (type.equals("Long")) {
				ps.setLong(i++, ((Long) value).longValue());
			} else if (type.equals("Integer")) {
				ps.setInt(i++, ((Integer) value).intValue());
			} else if (type.equals("Double")) {
				ps.setDouble(i++, ((Double) value).doubleValue());
			} else if (type.equals("Date")) {
				ps.setDate(i++, ((Date) value));
			} else if (type.equals("Boolean")) {
				ps.setBoolean(i++, ((Boolean) value).booleanValue());
			} else if (type.equals("Short")) {
				ps.setShort(i++, ((Short) value).shortValue());
			} else if (type.equals("Time")) {
				ps.setTime(i++, ((Time) value));
			} else if (type.equals("Timestamp")) {
				ps.setTimestamp(i++, ((Timestamp) value));
			} else if (type.equals("Float")) {
				ps.setFloat(i++, ((Float) value).floatValue());
			} else if (type.equals("Blob")) {
				ps.setBlob(i++, ((Blob) value));
			} else if (type.equals("Clob")) {
				ps.setClob(i++, ((Clob) value));
			} else {
				ps.setObject(i++, value);
			}

		}

		return ps;

	}

	/**
	 * 拼装以本级职能机关范围作为数据范围进行查询的SQL语句
	 */
	@SuppressWarnings("unused")
	private static String scopeSqlBuilder(String sqlStr, String swrydm,
			String zn, String jgColumn) {
		sqlStr = sqlStr.toLowerCase();
		StringBuffer sql = new StringBuffer(" WHERE ");
		sql.append(" EXISTS (SELECT NULL FROM T_XT_SWRY_ZN_JGFW ").append(
				"WHERE ").append(jgColumn).append(
				"= T_XT_SWRY_ZN_JGFW.SWJG_DM AND ").append(
				" T_XT_SWRY_ZN_JGFW.SWRY_DM = '").append(swrydm).append(
				"' AND T_XT_SWRY_ZN_JGFW.ZN_DM = '").append(zn).append("')");

		if (sqlStr.indexOf("where") >= 0) {
			sql.append(" and ");
			sqlStr = sqlStr.replaceFirst("where", sql.toString());
		} else {
			if (sqlStr.indexOf("order") >= 0) {
				sql.append(" order ");
				sqlStr = sqlStr.replaceFirst("order", sql.toString());
			} else {
				return sqlStr + sql.toString();
			}
		}

		return sqlStr;

	}

	/**
	 * 以层次代码作为数据权限进行查询
	 */
	private static String ccSqlBuilder(String sqlStr, Collection<String> cc, String zn,
			String jgColumn) {
		Iterator<String> ii = cc.iterator();

		StringBuffer sql = new StringBuffer(" WHERE ");
		sql.append(" EXISTS (SELECT NULL FROM T_XT_SWJG_ZN WHERE ").append(
				jgColumn).append(
				" = T_XT_SWJG_ZN.SWJG_DM AND T_XT_SWJG_ZN.ZN_DM = '")
				.append(zn).append("' ");

		if (!cc.isEmpty()) {
			sql.append(" AND (");
			while (ii.hasNext()) {
				sql.append("T_XT_SWJG_ZN.CC LIKE '").append(
						(String) ii.next() + "%");
				if (ii.hasNext()) {
					sql.append("' OR ");
				}
			}
			sql.append("'  )) ");
		} else {
			sql.append(" ) ");
		}

		sqlStr = sqlStr.toLowerCase();
		if (sqlStr.indexOf("where") >= 0) {
			sql.append(" and ");
			sqlStr = sqlStr.replaceFirst("where", sql.toString());
		} else {
			if (sqlStr.indexOf("order") >= 0) {
				sql.append(" order ");
				sqlStr = sqlStr.replaceFirst("order", sql.toString());
			} else {
				return sqlStr + sql.toString();
			}
		}

		return sqlStr;

	}

	public static void main(String[] args) throws Exception {
		// Connection con = DSLocator.singleton().getInstance("gdltds") ;
		List<String> cc = new ArrayList<String>();
		cc.add("11");
		System.out
				.println(ccSqlBuilder(
						"SELECT SLXX.NSRNBM,JMSQMX.JMLX_DM,SLXX.LR_RQ,JMSQMX.SQJMQX_QSRQ,JMSQMX.SQJMQX_ZZRQ,JMSQMX.PZJM_SX,JMSQMX.JMYE_JE,JMSQMX.ZSPM_DM,JMSQMX.ZSXM_DM "
								+ "FROM T_WS_SSWSJBXX SLXX, T_SB_JMSQMX JMSQMX"
								+ "WHERE SLXX.PZ_BJ='1' AND(sl_rq BETWEEN to_date('2003-12-01','yyyy-mm-dd') "
								+ "AND to_date('2003-12-17 23:59:59','yyyy-mm-dd hh24:mi:ss')) "
								+ "AND SLXX.WSH=JMSQMX.WSH ", cc, "1",
						"SLXX.SLSWJG_DM"));
	}

}