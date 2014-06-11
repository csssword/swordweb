package com.css.sword.platform.comm.util.performancelog;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DSLocator {
    private static Map<String, DataSource> dsMap = Collections.synchronizedMap(new HashMap<String, DataSource>());
    private static DSLocator dsLocator = new DSLocator();
    
    private Properties props = new Properties();
    
    private DSLocator() {
    }

    public static DSLocator singleton() {
        return dsLocator;
    }

    protected Context getContext()throws NamingException{
        Context ctx = new InitialContext(getProperties()) ;
        return ctx ;
      }

      protected void closeContext(Context context)
          throws NamingException{
          if(context != null){
              context.close();
          }
      }

      protected Properties getProperties(){
        Properties prop = new Properties() ;
        prop.put(Context.INITIAL_CONTEXT_FACTORY, this.props.get("factory"));
        prop.put(Context.PROVIDER_URL, this.props.get("provider.url"));

        return prop ;
      }

    public Connection getInstance(Properties props) throws Exception {
    	this.props = props;
    	String key = this.props.getProperty("dsname");
        if (dsMap.containsKey(key)) { //如果存在于缓存中，返回缓存
            try {
                DataSource ds = (DataSource) dsMap.get(key);
                Connection con = ds.getConnection();
                return con;
            } //缓存的内容过期，重新查找
            catch (SQLException ex) {
                clear(key);
                Connection con = null;
                try {
                    DataSource ds = (DataSource) lookup(key);
                    dsMap.put(key, ds);
                    con = ds.getConnection();
                }
                catch (Exception e) {
                	e.printStackTrace();
                    throw e; //
                }
                

                return con;
            }
        }
        else { //如果不存在于缓存中，查找实例
            Connection con = null;
            try {
                DataSource ds = (DataSource) lookup(key);
                dsMap.put(key, ds);
                con = ds.getConnection();
            }
            catch (Exception e) {
            	e.printStackTrace();
                throw e;
            }
            
            return con;
        }

    }

    /**
     * 抽象类AbstractLocator的getInstance方法的实现。
     * @param name:String 被查找对象的JNDI名
     * @return Object - JNDI得到的对象
     * @throws NamingException
     */
    protected Object lookup(String name) throws NamingException {
        Context ctx = getContext();
        Object obj = ctx.lookup(name);
        return obj;
    }

    /**
     * 清空DSMap属性中的所用缓存实例。然后调用LogWritter的<br>
     * 静态方法sysInfo,在日志中记录缓存已经清空的信息。
     */
    private void clear(String key) {
        if(dsMap.containsKey(key) ){
            dsMap.remove(key) ;
        }

    }

}