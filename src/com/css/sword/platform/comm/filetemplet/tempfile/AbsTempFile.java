package com.css.sword.platform.comm.filetemplet.tempfile;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.platform.comm.filetemplet.ITempFile;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: 应用产品研发中心
 * </p>
 * 
 * @author wwq
 * @version 1.0
 */

abstract public class AbsTempFile implements ITempFile {
	List<String> contentList = new ArrayList<String>();

	public List<String> getContentList() {
		return contentList;
	}

	public void setContentList(List<String> contentList) {
		this.contentList = contentList;
	}
}