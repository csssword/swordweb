package com.css.sword.platform.comm.util.sequence;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 
 * @since 4.0
 *
 */
public class SequenceProvider {

	private static final String GEN_BEFORE = "SELECT ";
    
	public static final String GEN_AFTER = ".NEXTVAL FROM DUAL";
    
    private final static LogWritter logger = LogFactory.getLogger(SequenceProvider.class);
    
    private Connection conn;

    public Connection getConn() {
        return conn;
    }

    public void setConn(Connection conn) {
        this.conn = conn;
    }

    private String getSequence(String sql) {

		//IPersistenceDAO dao = this.getDao();
		Connection conn = this.getConn();

		Statement stmt = null;
		ResultSet rs = null;
		long sequence = 0l;//L字母
		try {

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql); //执行查询操作
		
			if (rs.next()) {
				sequence = rs.getLong(1);
			}
			
		} catch (SQLException ex) {
			logger.error("00051", ex);
			throw new RuntimeException(ex);
		} finally {
			try {
				if (rs != null)
					rs.close(); //   关闭结果集
				if (stmt != null)
					stmt.close(); //   关闭Statement对象
				//if(conn!=null)conn.close();     //  此处不能关闭连接
			} catch (SQLException ex1) {
				logger.error(ex1.getMessage());
			}
		}	
		return sequence + "";
	}

	public static String getSequence(Connection conn,String sequenceName) {
		SequenceProvider sq = new SequenceProvider();
		sq.setConn(conn);
        String sql = getSql(sequenceName);
        return sq.getSequence(sql);
	}

    private static String getSql(String sequenceName) {
        return new StringBuffer(GEN_BEFORE).append(sequenceName).append(GEN_AFTER).toString();
    }
}
