package com.css.sword.platform.comm.util.performancelog;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

public class LogManager {

	private boolean debug = false;
	
	public static Map<Object, Object> map = new HashMap<Object, Object>();
	
	private static LogManager instance = null;
	private Properties props = new Properties();
	
	private LogManager(){
		init();
	}
	
	private void init(){
	        InputStream is = getClass().getResourceAsStream("/performancelog.properties");
	        try {
	        	if(is == null){
	        		debug = false;
	        		return ;
	        	}
	        	
	            props.load(is);
	            
	            if("true".equalsIgnoreCase(props.getProperty("debug"))){
	            	debug = true;
	            }
	            else{
	            	debug = false;
	            }
	        }
	        catch (Exception e) {
	        	debug = false;
	            e.printStackTrace();
	        }
	}
	
	public static LogManager getInstance(){
		if(instance == null){
			instance = new LogManager();
		}
		
		return instance;
	}
	
	
	public String getRandom(){
		String s = "" + Math.random();
		return s.substring(s.indexOf(".") + 1);
		
	}
	
	public void log(String transaction_flag){
		Map<?, ?> values = (Map<?, ?>)map.get(transaction_flag);
		Iterator<?> iter = values.keySet().iterator();
		String sql = "insert into tb_performancelog (v0";
		String sqlValues = " values ('" + transaction_flag + "'";
		
		while(iter.hasNext()){
			String key = (String)iter.next();
			String value = (String)values.get(key);
			sql += ", " + key;
			sqlValues += ", " + "'" + value + "'";
		}
		
		sql += ") " + sqlValues + ")";
		
		//System.out.println("sql = " + sql);
		
		Connection con = getConnection();
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(sql);
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally{
			try {
				con.close();
			} catch (SQLException e) {
			}
			map.remove(transaction_flag);
		}
		
	}

	public void logUpdate(String transaction_flag){
		Map<?, ?> values = (Map<?, ?>)map.get(transaction_flag);
		Iterator<?> iter = values.keySet().iterator();
		String sql = "update tb_performancelog set ";
		
		while(iter.hasNext()){
			String key = (String)iter.next();
			String value = (String)values.get(key);
			sql += key + "='" + value + "',";
		}
		
		if(sql.endsWith(",")){
			sql = sql.substring(0,sql.length()-1);
		}
		
		sql += " where v0='" + transaction_flag + "'";
		
		//System.out.println("sql = " + sql);
		
		Connection con = getConnection();
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(sql);
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally{
			try {
				con.close();
			} catch (SQLException e) {
			}
			map.remove(transaction_flag);
		}
		
	}

	public void logWeb(String uri, String value){
		String sql = "insert into tb_performancelog_web values('" +uri+ "','" +value+ "')";
		Connection con = getConnection();
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(sql);
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally{
			try {
				con.close();
			} catch (SQLException e) {
			}
		}
		
	}
	
//	private Connection getConnection(){
//		Connection con = null;
//		try {
//			String driver = this.props.getProperty("driver");
//			String url = this.props.getProperty("url");
//			String dbuser = this.props.getProperty("dbuser");
//			String dbpass = this.props.getProperty("dbpass");
//			
//			Class.forName(driver);
//			con = DriverManager.getConnection(url,dbuser,dbpass);
//		} catch (Exception e) {
//			e.printStackTrace();
//		} 
//		
//		
//		
//		return con;
//	}

	private Connection getConnection() {
		Connection con = null;
		try {
			con = DSLocator.singleton().getInstance(this.props);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return con;
	}

	
	public boolean isDebug() {
		return debug;
	}
	
//	public static void main(String[] args){
//		LogManager.getInstance();
//		System.out.println("QQQQQQQQQQ");
//	}
}
