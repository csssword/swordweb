package com.css.sword.platform.web.commonCtrl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

import com.css.sword.platform.web.comm.ExcelUtil;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;


@CTRL("ExcelCtrl")
public class ExcelCtrl extends BaseDomainCtrl {

     public IResData test(IReqData req) throws Exception {
        IResData res = new SwordRes();
         res.addPage("/uitest/table17.html");
         return res;
     }

    public IResData export(IReqData req) throws Exception {
        IResData res = new SwordRes();

        String tableName = (String) req.getAttr("tableName");

        Map<String, String> headerIndex = req.getFormData(tableName + "_headerIndex");
        Map<String, String> headerInfo = req.getFormData(tableName + "_headerInfo");
        List<Map<String, String>> showData = req.getTableData(tableName);


        ExcelUtil e = new ExcelUtil();
        e.createRow(0);

        for (int i = 0; i < headerIndex.keySet().size(); i++) {
            String name = (String) headerIndex.get("" + i);
            String v = (String) headerInfo.get(name);
            e.setCell(i, v);
        }
        for (int i = 0; i < showData.size(); i++) {
            e.createRow(i + 1);
            Map<?, ?> row = (Map<?, ?>) showData.get(i);
            for (int j = 0; j < headerIndex.keySet().size(); j++) {
                String name = (String) headerIndex.get("" + j);
                String v = (String) row.get(name);
                e.setCell(j, v);
            }
        }
                                    

        java.io.ByteArrayOutputStream os = new ByteArrayOutputStream();
        e.write(os);
        java.io.ByteArrayInputStream is = new ByteArrayInputStream(os.toByteArray());

//        if(true)throw  new Exception("666677777");
        this.downLoad(is, tableName + "_excel.xls");

//        res.addPage("/swordweb/widgets/SwordFile/SwordFileTarget.jsp"); 
//        res.addMessage("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        return res;
    }

}