package com.css.sword.platform.web.gzip;


import java.io.IOException;
import java.util.Enumeration;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CompressionFilter implements Filter{

    private int minThreshold = 128;
    protected int compressionThreshold;


    public void init(FilterConfig filterConfig) {

        if (filterConfig != null) {
            String str = filterConfig.getInitParameter("compressionThreshold");
            if (str!=null) {
                compressionThreshold = Integer.parseInt(str);
                if (compressionThreshold != 0 && compressionThreshold < minThreshold) {
                    compressionThreshold = minThreshold;
                }
            } else {
                compressionThreshold = 0;
            }
        } else {
            compressionThreshold = 0;
        }

    }

    public void doFilter ( ServletRequest request, ServletResponse response,
                        FilterChain chain ) throws IOException, ServletException {
   
        if (compressionThreshold == 0) {
            chain.doFilter(request, response);
            return;
        }
       
        boolean supportCompression = false;
        if (request instanceof HttpServletRequest) {
           
            String s = (String) ((HttpServletRequest)request).getParameter("gzip");
            
            if ("false".equals(s)) {
                chain.doFilter(request, response);
                return;
            }
            String agent =
                ((HttpServletRequest)request).getHeader("User-Agent");
//            if(agent.indexOf("MSIE 6.0") != -1){
//            	supportCompression = false;
//             }else{
     			Enumeration e =
                     ((HttpServletRequest)request).getHeaders("Accept-Encoding");
                 while (e.hasMoreElements()) {
                     String name = (String)e.nextElement();
                     if (name.indexOf("gzip") != -1) {
                         supportCompression = true;
                     }
                 }
//             }
        }

        if (!supportCompression) {
            chain.doFilter(request, response);
            return;
        } else {
            if (response instanceof HttpServletResponse) {

                CompressionServletResponseWrapper wrappedResponse =
                    new CompressionServletResponseWrapper((HttpServletResponse)response);
                wrappedResponse.setCompressionThreshold(compressionThreshold);
                String requestUri = ((HttpServletRequest)request).getRequestURI();
                if (requestUri.endsWith(".js")){
                	wrappedResponse.setContentType("application/x-javascript");
                }
                try {
                    chain.doFilter(request, wrappedResponse);
                } finally {
                    wrappedResponse.finishResponse();
                }
                return;
            }
        }
    }

	public void destroy() {
		// TODO Auto-generated method stub
		
	}

}

