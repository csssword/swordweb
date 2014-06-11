package com.css.sword.extensions.portal.web.session;

import com.css.sword.kernel.utils.SwordSessionUtils;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.session.ISwordOnFinish;

public class SwordOnFinishMH implements ISwordOnFinish {

	@Override
	public void onFinish(SwordDataSet dataSet) {
		if(dataSet==null)return;
		/**
		 * 岗位序号
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("gwxh")!=null)
			dataSet.addAttr("gwxh", SwordSessionUtils.getTempDataIntoApplicationContext("gwxh"));
		/**
		 * 职能代码
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("zndm")!=null)
			dataSet.addAttr("zndm", SwordSessionUtils.getTempDataIntoApplicationContext("zndm"));
		/**
		 * 功能代码
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("gndm")!=null)
			dataSet.addAttr("gndm", SwordSessionUtils.getTempDataIntoApplicationContext("gndm"));
		/**
		 * 功能集代码
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("gnjdm")!=null)
			dataSet.addAttr("gnjdm", SwordSessionUtils.getTempDataIntoApplicationContext("gnjdm"));
		/**
		 * 角色代码
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("jsdm")!=null)
			dataSet.addAttr("jsdm", SwordSessionUtils.getTempDataIntoApplicationContext("jsdm"));
		/**
		 * 岗位所属税务机关--后增
		 */
		if(SwordSessionUtils.getTempDataIntoApplicationContext("gwssswjg")!=null)
			dataSet.addAttr("gwssswjg", SwordSessionUtils.getTempDataIntoApplicationContext("gwssswjg"));
		/**
		 * sessionID
		 */
		if(SwordSessionUtils.getSessionID()!=null)
			dataSet.addAttr("sessionID", SwordSessionUtils.getSessionID());
		
	}

}
