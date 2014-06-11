package com.css.sword.platform.web.tag;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.http.HttpSession;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspTagException;
import javax.servlet.jsp.tagext.TagSupport;

import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.web.comm.CommParas;

public class SwordMessageTag extends TagSupport {

	private static final long serialVersionUID = 1523810351034542874L;

	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Override
	public int doStartTag() throws JspException {
		try {
			String msg = resolveMessage();
			writeMessage(msg);
			return EVAL_BODY_INCLUDE;
		} catch (IOException ex) {
			throw new JspTagException(ex);
		}
	}

	/**
	 * 根据code查找对应的message信息 采用懒加载方式加载message.properties相关国际化资源文件
	 * 注意需要获取session中对应的locale作为对应的国际化消息key
	 * 当session中没有改属性时,先获取request中的locale,作为获取国际化信息的key
	 * 
	 * @return
	 * @throws JspException
	 * @throws NoSuchMessageException
	 */
	protected String resolveMessage() throws JspException {

		// 增加一个初始化classes目录下国际化信息资源文件的方法,
		// 参考load方法,加入懒加载标记,
		// 构建map,key为locale
		// ConfManager.loadMessageResource();

		String code = this.code;
		Locale _locale = Locale.getDefault();
		HttpSession session = pageContext.getSession();
		Object _customer_locale = session
				.getAttribute(CommParas.CUSTOMER_LOCALE);
		if (_customer_locale == null) {
			_locale = pageContext.getRequest().getLocale();
		} else {
			_locale = Locale.class.cast(_customer_locale);
		}
		String resolvedText = ConfManager.getMessage(_locale, code);

		return resolvedText;
	}

	protected void writeMessage(String msg) throws IOException {
		pageContext.getOut().write(String.valueOf(msg));
	}

}
