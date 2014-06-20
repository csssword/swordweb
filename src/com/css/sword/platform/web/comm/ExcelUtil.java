package com.css.sword.platform.web.comm;

import java.util.Calendar;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ExcelUtil {
    // 设置cell编码解决中文高位字节截断
    //private static short XLS_ENCODING = HSSFWorkbook.ENCODING_UTF_16;

    // 定制日期格式
    private static String DATE_FORMAT = " m/d/yy "; // "m/d/yy h:mm"

    // 定制浮点数格式
    private static String NUMBER_FORMAT = " #,##0.00 ";

    private HSSFWorkbook workbook;

    private HSSFSheet sheet;

    private HSSFRow row;

    public HSSFWorkbook getWorkbook() {
        return workbook;
    }

    public ExcelUtil() {
        this.workbook = new HSSFWorkbook();
        this.sheet = workbook.createSheet();
    }

    /**
     * 导出Excel文件
     *
     */
    /*public void exportXLS() throws Exception {
        try {
            FileOutputStream fOut = new FileOutputStream(xlsFileName);
            workbook.write(fOut);
            fOut.flush();
            fOut.close();
        } catch (FileNotFoundException e) {
            throw new Exception(" 生成导出Excel文件出错! ", e);
        } catch (IOException e) {
            throw new Exception(" 写入Excel文件出错! ", e);
        }

    }*/

    /**
     * 增加一行
     *
     * @param index 行号
     */
    public void createRow(int index) {
        this.row = this.sheet.createRow(index);
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, String value) {
        HSSFCell cell = this.row.createCell(index);
        cell.setCellType(HSSFCell.CELL_TYPE_STRING);
        //cell.setEncoding(XLS_ENCODING);
        cell.setCellValue(value);
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, Calendar value) {
        HSSFCell cell = this.row.createCell(index);
        //cell.setEncoding(XLS_ENCODING);
        cell.setCellValue(value.getTime());
        HSSFCellStyle cellStyle = workbook.createCellStyle(); // 建立新的cell样式
        cellStyle.setDataFormat(HSSFDataFormat.getBuiltinFormat(DATE_FORMAT)); // 设置cell样式为定制的日期格式
        cell.setCellStyle(cellStyle); // 设置该cell日期的显示格式
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, int value) {
        HSSFCell cell = this.row.createCell(index);
        cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
        cell.setCellValue(value);
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, double value) {
        HSSFCell cell = this.row.createCell(index);
        cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
        cell.setCellValue(value);
        HSSFCellStyle cellStyle = workbook.createCellStyle(); // 建立新的cell样式
        HSSFDataFormat format = workbook.createDataFormat();
        cellStyle.setDataFormat(format.getFormat(NUMBER_FORMAT)); // 设置cell样式为定制的浮点数格式
        cell.setCellStyle(cellStyle); // 设置该cell浮点数的显示格式
    }

    public static void main(String[] args) {
        System.out.println(" 开始导出Excel文件 ");
        ExcelUtil e = new ExcelUtil();
        e.createRow(0);
        e.setCell(0, " 编号 ");
        e.setCell(1, " 名称 ");
        e.setCell(2, " 日期 ");
        e.setCell(3, " 金额 ");
        e.createRow(1);
        e.setCell(0, 1);
        e.setCell(1, " 工商银行 ");
        e.setCell(2, Calendar.getInstance());
        e.setCell(3, 111123.99);
        e.createRow(2);
        e.setCell(0, 2);
        e.setCell(1, " 招商银行 ");
        e.setCell(2, Calendar.getInstance());
        e.setCell(3, 222456.88);
        try {
//                e.exportXLS();
            System.out.println(" 导出Excel文件[成功] ");
        } catch (Exception e1) {
            System.out.println(" 导出Excel文件[失败] ");
            e1.printStackTrace();
        }
    }

}
