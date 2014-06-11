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

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

public class CharacterEncodingFilter implements Filter {
	protected static final LogWritter log = LogFactory
			.getLogger(CharacterEncodingFilter.class);

	protected String encoding = null;

	protected FilterConfig filterConfig = null;

	protected boolean ignore = true;

	public void destroy() {
		this.encoding = null;
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// Conditionally select and set the character encoding to be used

//		log.info("开始设置request字符集参数......");
//		log.debug("设置前的request字符集参数为: " + request.getCharacterEncoding());
		if (!ignore || (request.getCharacterEncoding() == null)) {
			String encoding = selectEncoding(request);
			if (encoding != null)
				request.setCharacterEncoding(encoding);
		}
//		log.debug("设置后的request字符集参数为: " + request.getCharacterEncoding());

//		log.info("结束设置request字符集参数......");
		// Pass control on to the next filter
		chain.doFilter(request, response);
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		this.encoding = filterConfig.getInitParameter("encoding");
		String value = filterConfig.getInitParameter("ignore");
		if (value == null) {
			this.ignore = true;
		} else if (value.equalsIgnoreCase("true")) {
			this.ignore = true;
		} else if (value.equalsIgnoreCase("yes")) {
			this.ignore = true;
		} else {
			this.ignore = false;
		}
	}

	protected String selectEncoding(ServletRequest request) {
		return (this.encoding);
	}
}