package com.css.sword.platform.web.comm;

/**
 * <p>Title: CharacterEncodingFilter</p>
 * <p>Description: WEB上关于中文问题的Filter</p>
 * <p>Copyright: Copyright (c) 2004 中软网络技术有限公司</p>
 * <p>Company: 中软网络技术有限公司</p>
 * @author 于英民
 * @version 1.0
 */

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

public class LoadingFilter implements Filter {
	protected static final LogWritter log = LogFactory
			.getLogger(LoadingFilter.class);


    public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
          HttpServletRequest req= (HttpServletRequest) request;
        if("true".equals(req.getParameter("FromSwordLoading"))){
          chain.doFilter(request, response);
            return;
        }
        response.setContentType("text/html;charset=" + request.getCharacterEncoding());
        req.getRequestDispatcher("swordweb/html/loading.jsp").include(request, response);
    }

    public void destroy() {
    }


}