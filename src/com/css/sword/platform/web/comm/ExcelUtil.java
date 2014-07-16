package com.css.sword.platform.web.comm;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Calendar;

import org.apache.poi.ss.usermodel.BuiltinFormats;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

public class ExcelUtil {
    // 定制日期格式
    private static String DATE_FORMAT = " m/d/yy "; // "m/d/yy h:mm"

    // 定制浮点数格式
    private static String NUMBER_FORMAT = " #,##0.00 ";

    private SXSSFWorkbook workbook;

    private Sheet sheet;

    private Row row;

    public ExcelUtil(int cacheRow) {
        this.workbook = new SXSSFWorkbook(cacheRow);
        this.sheet = workbook.createSheet();
    }
    public ExcelUtil() {
    	this(100);
    }

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
        Cell cell = this.row.createCell(index);
        cell.setCellType(Cell.CELL_TYPE_STRING);
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
        Cell cell = this.row.createCell(index);
        //cell.setEncoding(XLS_ENCODING);
        cell.setCellValue(value.getTime());
        CellStyle cellStyle = this.workbook.createCellStyle(); // 建立新的cell样式
        cellStyle.setDataFormat((short) BuiltinFormats.getBuiltinFormat(DATE_FORMAT)); // 设置cell样式为定制的日期格式
        cell.setCellStyle(cellStyle); // 设置该cell日期的显示格式
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, int value) {
        Cell cell = this.row.createCell(index);
        cell.setCellType(Cell.CELL_TYPE_NUMERIC);
        cell.setCellValue(value);
    }

    /**
     * 设置单元格
     *
     * @param index 列号
     * @param value 单元格填充值
     */
    public void setCell(int index, double value) {
        Cell cell = this.row.createCell(index);
        cell.setCellType(Cell.CELL_TYPE_NUMERIC);
        cell.setCellValue(value);
        CellStyle cellStyle = workbook.createCellStyle(); // 建立新的cell样式
        DataFormat format = workbook.createDataFormat();
        cellStyle.setDataFormat(format.getFormat(NUMBER_FORMAT)); // 设置cell样式为定制的浮点数格式
        cell.setCellStyle(cellStyle); // 设置该cell浮点数的显示格式
    }
    
    public void write(OutputStream os) throws IOException {
    	this.write(os, false);
    }
    public void write(OutputStream os, boolean autoClose) throws IOException {
    	this.workbook.write(os);
    	os.flush();
    	if(autoClose) {
    		os.close();
    	}
    }
	public Workbook getWorkbook() {
		return this.workbook;
	}
}
