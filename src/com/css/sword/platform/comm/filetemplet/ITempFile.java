package com.css.sword.platform.comm.filetemplet;

import java.util.List;

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

public interface ITempFile {
	Object getTempContent();

	void setContentList(List<String> contentList);
}