package com.css.sword.platform.web.comm;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PushbackInputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFFormulaEvaluator;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


/**
 * Title: 系统组件 XLS，XLSX文件解析 Company: 中国软件与技术服务股份有限公司
 * 
 * @author 李伟杰
 * @version 1.0
 */
public class Excel {
	private Workbook wb;
	private boolean xls; // 2003?
	private final static SimpleDateFormat fullTimeFmt = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
	private final static String EXCEL_HIDE_SHEET_NAME = "excelhidesheetname"; 

	// private final static SimpleDateFormat fullDateFmt = new
	// SimpleDateFormat("yyyy-MM-dd");
	public Excel(InputStream inp) {
		try {
			if (!inp.markSupported()) {
				inp = new PushbackInputStream(inp, 8);
			}

			if (POIFSFileSystem.hasPOIFSHeader(inp)) {
				wb = new HSSFWorkbook(inp);
				xls = true;
			} else if (POIXMLDocument.hasOOXMLHeader(inp)) {
				wb = new XSSFWorkbook(OPCPackage.open(inp));
				xls = false;
			} else {
				throw new IllegalArgumentException(
						"Your InputStream was neither an OLE2 stream, nor an OOXML stream");
			}
		} catch (InvalidFormatException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public Excel(boolean xls) {
		this.xls = xls;
		wb = xls ? new HSSFWorkbook() : new XSSFWorkbook();
	}

	public Excel(String filePath) {
		try {
			InputStream inp = new FileInputStream(filePath);
			if (!inp.markSupported()) {
				inp = new PushbackInputStream(inp, 8);
			}

			if (POIFSFileSystem.hasPOIFSHeader(inp)) {
				wb = new HSSFWorkbook(inp);
				xls = true;
			} else if (POIXMLDocument.hasOOXMLHeader(inp)) {
				wb = new XSSFWorkbook(OPCPackage.open(inp));
				xls = false;
			} else {
				throw new IllegalArgumentException(
						"Your filePath  nor an Effective path");
			}
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		} catch (InvalidFormatException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 
	 * @author 李伟杰
	 * 
	 */
	class Point {
		public Point(String cellPositionStr) {
			char[] chars = cellPositionStr.toCharArray();
			int i = 0;
			for (; i < chars.length; i++) {
				if (Character.isDigit(chars[i])) {
					break;
				}
			}
			row = Integer.parseInt(cellPositionStr.substring(i)) - 1;
			col = cellNumStr2Int(cellPositionStr.substring(0, i));
		}

		public Point(String colStr, int row) {
			col = cellNumStr2Int(colStr);
			this.row = row;
		}

		int row;
		int col;
	}

	/**
	 * 获取sheet数目。
	 * 
	 * @return
	 */
	public int getSheetCnt() {
		return this.wb.getNumberOfSheets();
	}
	
	/**
	 * 获取sheetNum。
	 * 
	 * @return
	 */
	public int getSheetNum(String sheet) {
		return this.wb.getSheetIndex(sheet);
	}

	/**
	 * 给Excel中的某个sheet的某个单元格赋值。
	 * 
	 * @param cellPositionStr
	 *            位置参数如A12表示A列，12行。
	 * @param sheetNo
	 * @param v
	 * @return
	 */
	public Cell setCellValue(String cellPositionStr, int sheetNo, Object v) {
		Point p = new Point(cellPositionStr);
		return setCellValue(p, sheetNo, v);
	}

	public Cell setCellValue(String cellPositionStr, Object v) {
		Point p = new Point(cellPositionStr);
		return setCellValue(p, 0, v);
	}

	/**
	 * 给Excel中的某个sheet的某个单元格赋值。
	 * 
	 * @param colNumStr
	 *            哪一列
	 * @param rowNum
	 * @param sheetNo
	 * @param v
	 * @return
	 */
	public Cell setCellValue(String colNumStr, int rowNum, int sheetNo, Object v) {
		Point p = new Point(colNumStr, rowNum);
		return setCellValue(p, sheetNo, v);
	}

	public Cell setCellValue(Point p, int sheetNo, Object v) {
		return setCellValue(p.col, p.row, sheetNo, v);
	}

	/**
	 * 给Excel中的某个sheet的某个单元格赋值。
	 * 
	 * @param colNum
	 *            从0开始。
	 * @param rowNum
	 *            从0开始。
	 * @param sheetNo
	 *            从0开始。
	 * @param v
	 * @return
	 */
	public Cell setCellValue(int colNum, int rowNum, int sheetNo, Object v) {
		Cell cell = this.getCell(colNum, rowNum, sheetNo);
		if (v == null) {
			cell.setCellValue(this.xls ? new HSSFRichTextString("")
					: new XSSFRichTextString(""));// TODO
			// 添加的值是以单元格格式为准，还是以数据类型为准？
			return cell;
		}
		if (v.getClass() == Boolean.class) {
			cell.setCellValue((Boolean) v);
		} else if (v.getClass() == Integer.class) {
			cell.setCellValue((Integer) v);
		} else if (v.getClass() == Double.class) {
			cell.setCellValue((Double) v);
		} else if (v.getClass() == Float.class) {
			cell.setCellValue((Float) v);
		} else if (v.getClass() == BigDecimal.class) {
			cell.setCellValue(((BigDecimal) v).doubleValue());
		} else if (v instanceof Date) {
			cell.setCellValue(this.xls ? new HSSFRichTextString(fullTimeFmt
					.format((Date) v)) : new XSSFRichTextString(fullTimeFmt
					.format((Date) v)));// TODO 权益之计
		} else if (v instanceof    Timestamp) {
			Timestamp vx = (Timestamp) v;
			cell.setCellValue(this.xls ? new HSSFRichTextString(fullTimeFmt
					.format(vx.toString())) : new XSSFRichTextString(
					fullTimeFmt.format(vx.toString())));
		} else if (v.getClass() == String.class) {
			String cellStr = (String) v;
			if (cellStr.length() >= 32766) {
				cellStr = cellStr.substring(0, 32765);
			}
			cell.setCellValue(this.xls ? new HSSFRichTextString(cellStr)
					: new XSSFRichTextString(cellStr));
		} else {
			cell.setCellValue(this.xls ? new HSSFRichTextString(v.toString())
					: new XSSFRichTextString(v.toString()));
		}
		return cell;
	}

	/**
	 * 根据指定行列和sheet获取单元。
	 * 
	 * @param rowNum
	 *            从0开始。
	 * @param cellNum
	 *            从0开始。
	 * @param sheetNo
	 *            从0开始。
	 * @return
	 */
	public Cell getCell(int colNum, int rowNum, int sheetNo) {
		Row row = getRow(rowNum, sheetNo);
		Cell cell = row.getCell(colNum);
		if (cell == null)
			cell = row.createCell(colNum);
		return cell;
	}

	/**
	 * @param colNumStr
	 *            A,B,C,D
	 * @param rowNum
	 * @param sheetNo
	 * @return
	 */
	public Cell getCell(String colNumStr, int rowNum, int sheetNo) {
		int colNum = cellNumStr2Int(colNumStr);
		return getCell(colNum, rowNum, sheetNo);
	}

	/**
	 * @param cellPositionStr
	 *            例 A12即 A列 12行
	 * @param sheetNo
	 * @return
	 */
	public Cell getCell(String cellPositionStr, int sheetNo) {
		Point p = new Point(cellPositionStr);
		return getCell(p.col, p.row, sheetNo);
	}

	public Sheet getSheetAt(int num) {
		return wb.getSheetAt(num);
	}

	/**
	 * 合并。
	 * 
	 * @param sheetNum
	 * @param firstRow
	 * @param lastRow
	 * @param firstCol
	 * @param lastCol
	 */
	public void addMergedRegion(int sheetNum, int firstRow, int lastRow,
			int firstCol, int lastCol) {
		Sheet sheet = getSheetAt(sheetNum);
		sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol,
				lastCol));// 指定合并区域
	}

	/**
	 * 获取某一行。
	 * 
	 * @param rowNum
	 * @param sheetNo
	 * @return
	 */
	public Row getRow(int rowNum, int sheetNo) {
		Sheet sheet = null;
		if (sheetNo >= wb.getNumberOfSheets()) {
			sheet = wb.createSheet("sheet-" + sheetNo);
		} else {
			sheet = wb.getSheetAt(sheetNo);
		}
		Row row = sheet.getRow(rowNum);
		if (row == null)
			row = sheet.createRow(rowNum);
		return row;
	}

	/**
	 * 将列的名称转换为数字。
	 * 
	 * @param cellNumStr
	 *            A,B,C,D.....转换为0,1,2,3
	 * @return
	 */
	private static int cellNumStr2Int(String cellNumStr) {
		cellNumStr = cellNumStr.toLowerCase();
		int cellNum = 0;
		char[] chars = cellNumStr.toCharArray();
		int j = 0;
		for (int i = chars.length - 1; i >= 0; i--) {
			cellNum += (chars[i] - 'a' + 1) * Math.pow(26, j);
			j++;
		}
		return cellNum - 1;
	}

	/**
	 * @param colNum
	 *            0,1,2,3,4..... 转换为 A,B,C,D.....
	 * @return
	 */
	public static String cellNumIntToStr(int colNum) {
		String colName = "";
		do {
			char c = (char) (colNum % 26 + 'A');
			colName = c + colName;
			colNum = colNum / 26 - 1;
		} while (colNum >= 0);
		return colName;
	}

	/**
	 * 将excel写入到某个输出流中。
	 * 
	 * @param out
	 */
	public void write(OutputStream out) {
		try {
			wb.write(out);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将EXCEL写入到指定路径的文件中
	 * 
	 * @param filePath
	 *            完整的文件路径
	 */
	public void save(String filePath) {
		try {
			OutputStream out = new FileOutputStream(new File(filePath));
			write(out);
			out.flush();
			out.close();
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e.getMessage(), e);
		} catch (IOException e) {
			throw new RuntimeException(e.getMessage(), e);
		}
	}

	/**
	 * 获取某个单元格的值，并做一定的类型判断。
	 * 
	 * @param cell
	 * @return
	 */
	public Object getCellValue(Cell cell) {
		Object value = null;
		if (cell != null) {
			int cellType = cell.getCellType();
			CellStyle style = cell.getCellStyle();
			short format = style.getDataFormat();
			switch (cellType) {
			case Cell.CELL_TYPE_NUMERIC:
				double numTxt = cell.getNumericCellValue();
				if (format == 22 || format == 14)
					value = HSSFDateUtil.getJavaDate(numTxt);
				else
					value = numTxt;
				break;
			case Cell.CELL_TYPE_BOOLEAN:
				boolean booleanTxt = cell.getBooleanCellValue();
				value = booleanTxt;
				break;
			case Cell.CELL_TYPE_BLANK:
				value = null;
				break;
			case Cell.CELL_TYPE_FORMULA:
				HSSFFormulaEvaluator eval = new HSSFFormulaEvaluator(
						(HSSFWorkbook) wb);
				eval.evaluateInCell(cell);
				value = getCellValue(cell);
				break;
			case Cell.CELL_TYPE_STRING:
				RichTextString rtxt = cell.getRichStringCellValue();
				if (rtxt == null) {
					break;
				}
				String txt = rtxt.getString();
				value = txt;
				break;
			default:
				// System.out.println(cell.getColumnIndex()+" col cellType="+cellType);
			}
		}
		return value;

	}

	public static interface CellCallback {
		public void handler(Cell cell);
	}

	/**
	 * 遍历所有的单元格。
	 * 
	 * @param callback
	 * @param sheetNo
	 */
	public void iterator(CellCallback callback, int sheetNo) {
		Sheet sheet = wb.getSheetAt(sheetNo);
		if (sheet == null)
			return;
		int firstRowNum = sheet.getFirstRowNum();
		int lastRowNum = sheet.getLastRowNum();
		for (int i = firstRowNum; i <= lastRowNum; i++) {
			Row row = sheet.getRow(i);
			if (row == null)
				continue;
			for (int j = row.getFirstCellNum(); j < row.getLastCellNum(); j++) {
				Cell cell = row.getCell(j);
				callback.handler(cell);
			}
		}
	}

	/**
	 * 读取某个excel，然后将其转化为List的List。
	 * 
	 * @param source
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	public List<List> excelToListList(int sheetNo) {
		// 首先是讲excel的数据读入，然后根据导入到的数据库的结构和excel的结构来决定如何处理。

		Sheet sheet = wb.getSheetAt(sheetNo);
		int firstRowNum = sheet.getFirstRowNum();
		int lastRowNum = sheet.getLastRowNum();
		List rows = new ArrayList();
		for (int i = firstRowNum; i <= lastRowNum; i++) {
			Row row = sheet.getRow(i);
			if (row == null) {
				continue;
			}
			List cellList = new ArrayList();
			for (int j = row.getFirstCellNum(); j < row.getLastCellNum(); j++) {
				Object value = null;
				Cell cell = row.getCell(j);
				if (cell != null)
					value = getCellValue(cell);

				cellList.add(value);

			}
			rows.add(cellList);
		}
		return rows;
	}

	/**
	 * 把excel转换成List<Map>格式
	 * 
	 * @param sheetNo
	 *            需要转换的数据所在的sheet次序号(0,1,2...n)
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Map> excelToMapList(int sheetNo) {
		Sheet sheet = this.wb.getSheetAt(sheetNo);
		int firstRowNum = sheet.getFirstRowNum();
		return excelToMapList(sheetNo, firstRowNum, firstRowNum + 1);
	}

	/**
	 * 把excel转换成List<Map>格式
	 * 
	 * @param sheetNo需要转换的数据所在的sheet次序号
	 *            (0,1,2...n)
	 * @param keyRowNo
	 *            作为key的行号 （0,1,2...n）
	 * @param dataStartRowNo第一行数据的行号
	 *            （1,2...n）
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Map> excelToMapList(int sheetNo, int keyRowNo,
			int dataStartRowNo) {
		return excelToMapList(sheetNo, keyRowNo, keyRowNo, dataStartRowNo);
	}

	/**
	 * 标题从多行进行合并得到。
	 * 
	 * @param sheetNo
	 * @param keyRowNoFrom
	 * @param keyRowNoTo
	 * @param dataStartRowNo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Map> excelToMapList(int sheetNo, int keyRowNoFrom,
			int keyRowNoTo, int dataStartRowNo) {
		Sheet sheet = this.wb.getSheetAt(sheetNo);
		List rowMapList = new ArrayList();
		String[] keyList = new String[200];
		for (int i = keyRowNoFrom; i <= keyRowNoTo; i++) {
			Row mapKeyRow = sheet.getRow(i);
			String lstKey = null;
			for (int j = mapKeyRow.getFirstCellNum(); j < mapKeyRow
					.getLastCellNum(); j++) {
				Cell col = mapKeyRow.getCell(j);
				String key = col.getRichStringCellValue().getString();
				String keyx = keyList[j];
				if (key == null) {
					key = keyx;
				} else if (keyx != null)
					key = keyx + key;

				if (key == null || "".equals(key)) {
					key = lstKey;
				}
				lstKey = key;

				keyList[j] = key;
			}
		}
		int lastRowNum = sheet.getLastRowNum();
		for (int i = dataStartRowNo; i <= lastRowNum; ++i) {
			Row dataRow = sheet.getRow(i);
			if (dataRow == null)
				continue;
			Map rowMap = new HashMap();
			for (int j = dataRow.getFirstCellNum(); j < dataRow
					.getLastCellNum(); ++j) {
				String key = keyList[j];
				if (key == null || key.equals("")) {
					continue;
				}
				Object value = getCellValue(dataRow.getCell(j));
				rowMap.put(key, value);
			}
			rowMapList.add(rowMap);
		}
		return rowMapList;
	}

	public static interface RowCallBack {
		@SuppressWarnings("unchecked")
		void handler(Map m);
	}

	/**
	 * 迭代指定sheet中的每一行对象
	 * 
	 * @param sheet
	 *            第几个sheet页
	 * @param callBack
	 *            回调函数 获取完每行数据后执行
	 * @param keyRowNoFrom
	 *            回调函数中rowMap 的key的来源行开始行号
	 * @param keyRowNoTo
	 *            回调函数中rowMap 的key的来源行结束行号
	 * @param dataStartRowNo
	 *            获取数据的开始行号
	 */
	@SuppressWarnings("unchecked")
	public void iterateRows(Sheet sheet, RowCallBack callBack,
			int keyRowNoFrom, int keyRowNoTo, int dataStartRowNo) {
		@SuppressWarnings("unused")
		List rowMapList = new ArrayList();
		String[] keyList = new String[200];
		for (int i = keyRowNoFrom; i <= keyRowNoTo; i++) {
			Row mapKeyRow = sheet.getRow(i);
			String lstKey = null;
			for (int j = mapKeyRow.getFirstCellNum(); j < mapKeyRow
					.getLastCellNum(); j++) {
				Cell col = mapKeyRow.getCell(j);
				String key = col.getRichStringCellValue().getString();
				String keyx = keyList[j];
				if (key == null) {
					key = keyx;
				} else if (keyx != null)
					key = keyx + key;

				if (key == null || "".equals(key)) {
					key = lstKey;
				}
				lstKey = key;

				keyList[j] = key;
			}
		}
		int lastRowNum = sheet.getLastRowNum();
		for (int i = dataStartRowNo; i <= lastRowNum; ++i) {
			Row dataRow = sheet.getRow(i);
			if (dataRow == null)
				continue;
			Map rowMap = new HashMap();
			for (int j = dataRow.getFirstCellNum(); j < dataRow
					.getLastCellNum(); ++j) {
				String key = keyList[j];
				if (key == null || key.equals("")) {
					continue;
				}
				Object value = getCellValue(dataRow.getCell(j));
				rowMap.put(key, value);
			}
			callBack.handler(rowMap);
		}
	}

	// public void mapListToExcel(Excel excel,List<Map> rs, Iterator it){
	//                
	// }
	/**
	 * 复制srcRowNum，然后在targetRowNum处添加一行。
	 * 
	 * @param srcRowNum
	 * @return
	 */
	public Row createRow(int srcRowNum) {
		Sheet sheet = wb.getSheetAt(0);
		int targetRowNum = sheet.getLastRowNum() + 1;
		return createRow(sheet, sheet, srcRowNum, targetRowNum);
	}

	/**
	 * 复制srcRowNum，然后在targetRowNum处添加一行。
	 * 
	 * @param srcRowNum
	 * @param targetRowNum
	 * @return
	 */
	public Row createRow(int srcRowNum, int targetRowNum) {
		Sheet sheet = wb.getSheetAt(0);
		return createRow(sheet, sheet, srcRowNum, targetRowNum);
	}

	/**
	 * 复制srcRowNum，然后在targetRowNum处添加一行。
	 * 
	 * @param sheet
	 * @param srcRowNum
	 * @param targetRowNum
	 * @return
	 */
	public Row createRow(Sheet sheet, Sheet sheet2, int srcRowNum,
			int targetRowNum) {
		Row srcRow = sheet.getRow(srcRowNum);
		Row newRow = sheet2.createRow(targetRowNum);
		newRow.setHeight(srcRow.getHeight());
		int i = 0;
		for (Iterator<Cell> cit = srcRow.cellIterator(); cit.hasNext();) {
			Cell hssfCell = cit.next();
			// HSSFCell中的一些属性转移到Cell中
			Cell cell = newRow.createCell(i++);
			@SuppressWarnings("unused")
			CellStyle s = hssfCell.getCellStyle();
			cell.setCellStyle(hssfCell.getCellStyle());
		}
		return newRow;
	}

	public void deleteRow(int rowNum) {
		deleteRow(0, rowNum);
	}

	public void deleteRow(int sheetNo, int rowNum) {
		Sheet sheet = wb.getSheetAt(sheetNo);
		sheet.shiftRows(rowNum, sheet.getLastRowNum(), -1);
	}

	/**
	 * 拷贝行粘帖到指定位置。
	 * 
	 * @param sheet
	 * @param srcRow
	 * @param rowNum
	 * @return
	 */
	public Row copyAndInsertRow(Sheet sheet, Row srcRow, int targetRowNum) {
		sheet.shiftRows(targetRowNum, sheet.getLastRowNum(), 1);
		Row newRow = sheet.getRow(targetRowNum);
		newRow.setHeight(srcRow.getHeight());
		int j = 0;
		for (Iterator<Cell> cit = srcRow.cellIterator(); cit.hasNext();) {
			Cell hssfCell = cit.next();
			// HSSFCell中的一些属性转移到Cell中
			Cell cell = newRow.createCell(j++);
			cell.setCellStyle(hssfCell.getCellStyle());
		}
		for (int i = 0; i < sheet.getNumMergedRegions(); i++) {
			CellRangeAddress region = sheet.getMergedRegion(i);
			if (region.getFirstRow() == srcRow.getRowNum()
					&& region.getLastRow() == region.getFirstRow()) {
				sheet
						.addMergedRegion(new CellRangeAddress(targetRowNum,
								region.getFirstColumn(), targetRowNum, region
										.getLastColumn()));
			}
		}
		return newRow;
	}

	/**
	 * 拷贝并插入到指定行号
	 * 
	 * @param sheetNo
	 * @param fromRowNum
	 * @param targetRowNum
	 * @return
	 */
	public Row copyAndInsertRow(int sheetNo, int fromRowNum, int targetRowNum) {
		Sheet sheet = wb.getSheetAt(sheetNo);
		Row srcRow = sheet.getRow(fromRowNum);
		return copyAndInsertRow(sheet, srcRow, targetRowNum);
	}

	/**
	 * 拷贝并插入到指定行号
	 * 
	 * @param fromRowNum
	 * @param targetRowNum
	 * @return
	 */
	public Row copyAndInsertRow(int fromRowNum, int targetRowNum) {
		return copyAndInsertRow(0, fromRowNum, targetRowNum);
	}

	public Workbook getWb() {
		return wb;
	}

	public void setWb(Workbook wb) {
		this.wb = wb;
	}

	/**
	 * 設置文件的第一個sheet也是否強制執行公式
	 * 
	 * @param v
	 */
	public void setForceFormulaRecalculation(boolean v) {
		setForceFormulaRecalculation(wb.getSheetAt(0), v);
	}

	/**
	 * 生成的文件是否強制執行公式
	 * 
	 * @param sheet
	 * @param v
	 */
	public void setForceFormulaRecalculation(Sheet sheet, boolean v) {
		sheet.setForceFormulaRecalculation(v);
	}

	/**
	 * 将MapList中的数据导出到Excel，并从生成的Excel文件
	 * 
	 * 注：此方法只应被前台调用
	 * 
	 * @param dataList
	 *            数据列表，结构为List，元素为Map
	 * @param sheetName
	 *            Excel文件中的Sheet名称，如果参数值为null，则默认SheetName为"Sheet1"
	 * @param format
	 *            表格结构描述，结构为String[]，元素为Strng，String的构成为"列名"，列名为为要在Sheet中显示的中文列名
	 * 
	 * @return
	 * 
	 * 
	 */
	@SuppressWarnings("unchecked")
	public void pushDataFromDataList(List<Map> dataList, String sheetName,
			String[] format) {
		Sheet sheet = wb.createSheet(sheetName == null ? "sheet1" : sheetName);
		CellStyle cellStyle = wb.createCellStyle();
		Row row = sheet.createRow(0);
		Map tempMap = null;

		for (short index = 0; index < format.length; index++) {
			Cell cell = row.createCell(index);
			cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
			cell.setCellStyle(cellStyle);
			cell.setCellValue(format[index]);
		}

		for (int index = 0; index < dataList.size(); index++) {
			row = sheet.createRow(index + 1);
			tempMap = (Map) dataList.get(index);
			createCell(row, tempMap, format, cellStyle);
		}
	}

	/**
	 * 生成单元格并设置单元格的对齐格式
	 * 
	 * @param wb
	 * @param row
	 * @param column
	 * @param align
	 * 
	 * 
	 */
	@SuppressWarnings("unchecked")
	private void createCell(Row row, Map element, String[] format) {
		Cell cell = null;
		String[] formatStr = null;
		CellStyle cellStyle = wb.createCellStyle();
		for (int index = 0; index < format.length; index++) {
			formatStr = format[index].split("-");
			cell = row.createCell(index);
			cellStyle.setAlignment(getCellStyle(element.get(formatStr[0])));
			cell.setCellStyle(cellStyle);
			this.setCellValue(cell, element.get(formatStr[0]));
		}
	}
	
	/**
	 * 生成单元格并设置单元格的对齐格式(为避免创建CellStyle对象超过4000个)
	 * 
	 * @param wb
	 * @param row
	 * @param column
	 * @param align
	 * 
	 * 
	 */
	@SuppressWarnings("unchecked")
	private void createCell(Row row, Map element, String[] format,CellStyle cellStyle) {
		Cell cell = null;
		String[] formatStr = null;
		for (int index = 0; index < format.length; index++) {
			formatStr = format[index].split("-");
			cell = row.createCell(index);
			cellStyle.setAlignment(getCellStyle(element.get(formatStr[0])));
			cell.setCellStyle(cellStyle);
			this.setCellValue(cell, element.get(formatStr[0]));
		}
	}

	/**
	 * 根据dataList中元素的指定列的数据类型来确定在Cell中的对齐方式
	 * 
	 * @param obj
	 * @return
	 * 
	 * 
	 */
	private static short getCellStyle(Object obj) {
		short cellType = CellStyle.ALIGN_RIGHT;
		String objType = null;
		if (obj != null) {
			objType = obj.getClass().getName();
		} else {
			objType = "java.lang.String";
		}
		if ("java.lang.Integer".equals(objType)) {
			cellType = CellStyle.ALIGN_RIGHT;
		} else if ("java.lang.Long".equals(objType)) {
			cellType = CellStyle.ALIGN_RIGHT;
		} else if ("java.lang.Float".equals(objType)) {
			cellType = CellStyle.ALIGN_RIGHT;
		} else if ("java.lang.Double".equals(objType)) {
			cellType = CellStyle.ALIGN_RIGHT;
		} else if ("java.lang.String".equals(objType)) {
			cellType = CellStyle.ALIGN_LEFT;
		} else if ("java.util.Calendar".equals(objType)) {
			cellType = CellStyle.ALIGN_LEFT;
		}
		return cellType;
	}

	/**
	 * 给Excel中的某个单元格赋值
	 * 
	 * @param cell
	 * @param v
	 */
	public void setCellValue(Cell cell, Object v) {
		if (v == null) {
			cell.setCellValue(this.xls ? new HSSFRichTextString("")
					: new XSSFRichTextString(""));// TODO
			// 添加的值是以单元格格式为准，还是以数据类型为准？
		} else if (v.getClass() == Boolean.class) {
			cell.setCellValue((Boolean) v);
		} else if (v.getClass() == Integer.class) {
			cell.setCellValue((Integer) v);
		} else if (v.getClass() == Double.class) {
			cell.setCellValue((Double) v);
		} else if (v.getClass() == Float.class) {
			cell.setCellValue((Float) v);
		} else if (v.getClass() == BigDecimal.class) {
			cell.setCellValue(((BigDecimal) v).doubleValue());
		} else if (v instanceof Date) {
			cell.setCellValue(this.xls ? new HSSFRichTextString(fullTimeFmt
					.format((Date) v)) : new XSSFRichTextString(fullTimeFmt
					.format((Date) v)));// TODO 权益之计
		} else if (v instanceof Timestamp) {
			Timestamp vx = (Timestamp) v;
			cell.setCellValue(this.xls ? new HSSFRichTextString(fullTimeFmt
					.format(vx.toString())) : new XSSFRichTextString(
					fullTimeFmt.format(vx.toString())));
		} else if (v.getClass() == String.class) {
			String cellStr = (String) v;
			if (cellStr.length() >= 32766) {
				cellStr = cellStr.substring(0, 32765);
			}
			cell.setCellValue(this.xls ? new HSSFRichTextString(cellStr)
					: new XSSFRichTextString(cellStr));
		} else {
			cell.setCellValue(this.xls ? new HSSFRichTextString(v.toString())
					: new XSSFRichTextString(v.toString()));
		}
	}

	/**
	 * 
	 * 功能：创建CellStyle样式
	 * 
	 * @param backgroundColor
	 *            背景色
	 * 
	 * @param foregroundColor
	 *            前置色
	 * 
	 * @param font
	 *            字体
	 * 
	 * @return CellStyle
	 */

	public CellStyle createCellStyle(short backgroundColor,
			short foregroundColor, short halign, Font font) {

		CellStyle cs = wb.createCellStyle();

		cs.setAlignment(halign);

		cs.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		cs.setFillBackgroundColor(backgroundColor);

		cs.setFillForegroundColor(foregroundColor);

		cs.setFillPattern(CellStyle.SOLID_FOREGROUND);

		cs.setFont(font);

		return cs;

	}

	/**
	 * 
	 * 功能：创建带边框的CellStyle样式
	 * 
	 * @param wb
	 *            HSSFWorkbook
	 * 
	 * @param backgroundColor
	 *            背景色
	 * 
	 * @param foregroundColor
	 *            前置色
	 * 
	 * @param font
	 *            字体
	 * 
	 * @return CellStyle
	 */

	public CellStyle createBorderCellStyle(short backgroundColor,
			short foregroundColor, short halign, Font font) {

		CellStyle cs = wb.createCellStyle();

		cs.setAlignment(halign);

		cs.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		cs.setFillBackgroundColor(backgroundColor);

		cs.setFillForegroundColor(foregroundColor);

		cs.setFillPattern(CellStyle.SOLID_FOREGROUND);

		cs.setFont(font);

		cs.setBorderLeft(CellStyle.BORDER_DASHED);

		cs.setBorderRight(CellStyle.BORDER_DASHED);

		cs.setBorderTop(CellStyle.BORDER_DASHED);

		cs.setBorderBottom(CellStyle.BORDER_DASHED);

		return cs;

	}

	/**
	 * 合并单元格
	 * 
	 * @param sheet
	 * @param firstRow
	 * @param lastRow
	 * @param firstColumn
	 * @param lastColumn
	 * @return
	 */
	public int mergeCell(Sheet sheet, int firstRow, int lastRow,
			int firstColumn, int lastColumn) {

		return sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow,
				firstColumn, lastColumn));

	}

	/**
	 * 创建字体
	 * 
	 * @param boldweight
	 * @param color
	 * @param size
	 * @return
	 */
	public Font createFont(short boldweight, short color, short size) {

		Font font = wb.createFont();

		font.setBoldweight(boldweight);

		font.setColor(color);

		font.setFontHeightInPoints(size);

		return font;

	}

	/**
	 * 设置合并单元格的边框样式
	 * 
	 * @param sheet
	 * @param ca
	 * @param style
	 */
	public void setRegionStyle(Sheet sheet, CellRangeAddress ca, CellStyle style) {

		for (int i = ca.getFirstRow(); i <= ca.getLastRow(); i++) {

			Row row = CellUtil.getRow(i, sheet);

			for (int j = ca.getFirstColumn(); j <= ca.getLastColumn(); j++) {

				Cell cell = CellUtil.getCell(row, j);

				cell.setCellStyle(style);

			}

		}

	}

	/**
	 * 设置单元格的样式
	 * 
	 * @param sheet
	 * @param ca
	 * @param style
	 */
	public void setCellStyle(Cell cell, CellStyle style) {
		cell.setCellStyle(style);
	}
	
	/**  
     * 存储下拉的数据到一个隐藏的sheet页中,map中的key即为下拉的key (注意，key值必须为字母开头)
     * @param wb  
     * @return  
     */ 
    public  void saveListData(Map<String , String[]> m){   
        Sheet hideInfoSheet = wb.getSheet(EXCEL_HIDE_SHEET_NAME);
        if(hideInfoSheet==null){
        	hideInfoSheet =  wb.createSheet(EXCEL_HIDE_SHEET_NAME);//隐藏一些信息  
            wb.setSheetHidden(wb.getSheetIndex(EXCEL_HIDE_SHEET_NAME), true);
        }
        	Iterator<String> it = m.keySet().iterator();
            int cellNum = 0;
            Row row = hideInfoSheet.getRow(0);
            if(row!=null){
           	 cellNum = row.getLastCellNum();
            }
            while(it.hasNext()){
            	String k = it.next();
            	String[] s = m.get(k);
            	creatRows(hideInfoSheet,cellNum, s);  
            	creatExcelNameList(k,cellNum, 1, s.length);   
            }
    }  
    
    
    /**  
     * 给制定cell添加数据下拉
     * @param k  下拉的在数据MAP中的key
     * @param firstRow 
     * @param lastRow
     * @param firstCol
     * @param lastCol 
     */
    public  void setDataToCell(String k,int firstRow,int lastRow,int firstCol,int lastCol){   
        int sheetIndex = wb.getNumberOfSheets();   
        if(sheetIndex>0){   
            for(int i=0;i<sheetIndex;i++){   
                Sheet sheet = wb.getSheetAt(i);   
                if(!EXCEL_HIDE_SHEET_NAME.equals(sheet.getSheetName())){
                 DataValidation data_validatio = getDataValidationByFormula(k,firstRow,lastRow,firstCol,lastCol);  
                 sheet.addValidationData(data_validatio); 
                }   
            }   
        }   
    }  
    
  
    /**给制定cell添加級聯数据下拉
     * @param parentCellNum
     * @param firstRow
     * @param lastRow
     * @param firstCol
     * @param lastCol
     */
    public  void setDataToCellcCascade(int parentCellNum,int firstRow,int lastRow,int firstCol,int lastCol){ 
    	String cellChar = getCellChar(parentCellNum);
        int sheetIndex = wb.getNumberOfSheets();   
        if(sheetIndex>0){   
            for(int i=0;i<sheetIndex;i++){   
                Sheet sheet = wb.getSheetAt(i);   
                if(!EXCEL_HIDE_SHEET_NAME.equals(sheet.getSheetName())){
                	for(int m = firstRow;m<=lastRow;m++){
                		for(int n = firstCol; n<=lastCol;n++){
                			String formula = "INDIRECT("+cellChar+(m+1)+")";
                	    	DataValidation data_validatio = getDataValidationByFormula(formula,m,m,n,n);  
                            sheet.addValidationData(data_validatio); 
                		}
                	}
                 
                }   
            }   
        }   
    }  
    
    
    /**  
     * 给指定sheet页指定cell添加数据下拉
     * @param k  下拉的在数据MAP中的key
     * @param firstRow 
     * @param lastRow
     * @param firstCol
     * @param lastCol
     */
    public  void setDataToSheetCell(String Sheet ,String k,int firstRow,int lastRow,int firstCol,int lastCol){   
              	Sheet sheet = wb.getSheet(Sheet);
              	if(sheet!=null){
                    if(!EXCEL_HIDE_SHEET_NAME.equals(sheet.getSheetName())){
                     DataValidation data_validatio = getDataValidationByFormula(k,firstRow,lastRow,firstCol,lastCol);  
                     sheet.addValidationData(data_validatio); 
                    }   
              	}
     
    } 
    
    /**  
     * 给指定sheet页指定cell添加级联数据下拉
     * @param k  下拉的在数据MAP中的key
     * @param firstRow 
     * @param lastRow
     * @param firstCol
     * @param lastCol
     */
    public  void setDataToSheetCellCascade(String Sheet,int parentCellNum ,int firstRow,int lastRow,int firstCol,int lastCol){   
    			String cellChar = getCellChar(parentCellNum);
              	Sheet sheet = wb.getSheet(Sheet);
              	if(sheet!=null){
                    if(!EXCEL_HIDE_SHEET_NAME.equals(sheet.getSheetName())){
                    	for(int m = firstRow;m<=lastRow;m++){
                    		for(int n = firstCol; n<=lastCol;n++){
                    			String formula = "INDIRECT("+cellChar+(m+1)+")";
                    	    	DataValidation data_validatio = getDataValidationByFormula(formula,m,m,n,n);  
                                sheet.addValidationData(data_validatio); 
                    		}
                    	}
                    }   
              	}
     
    } 
    
    /**  
     * 创建一个名称  
     * @param workbook  
     */  
    private  void creatExcelNameList(String nameCode,int cellNum,int order,int size){   
    	Name name = wb.getName(nameCode);  
    	if(name!=null)return;
        name = wb.createName(); 
        name.setNameName(nameCode);   
        name.setRefersToFormula(EXCEL_HIDE_SHEET_NAME+"!"+creatExcelNameList(cellNum,order,size));   
    }   
    
    /**  
     * 创建一列数据  
     * @param currentRow  
     * @param textList  
     */  
    private  void creatRows(Sheet hideInfoSheet,int cellNum,String[] textList){   

        if(textList!=null&&textList.length>0){   
            int i = 0;   
            for(String cellValue : textList){   
             	Row r = hideInfoSheet.getRow(i);
             	if(r==null){
             		r = hideInfoSheet.createRow(i);   
             	}
                Cell userNameLableCell = r.createCell(cellNum);   
                userNameLableCell.setCellValue(cellValue);   
                i++;
            }   
        }   
    }
    
    
    /**  
     * 名称数据行列计算表达式  
     * @param workbook  
     */  
    private  String creatExcelNameList(int cellNum,int order,int size){ 
    	String start = getCellChar(cellNum);   
        return "$"+start+"$1:$"+start+"$"+size;   
    } 
    
    /**获取列号对应的CELL char A B C D E
     * @param cellNum
     * @return
     */
    private String getCellChar(int cellNum){
    	cellNum = cellNum+1;
        if(cellNum<=26){   
            char ch = (char)('A'+cellNum-1);   
            String c = "$"+ch;
            return c.substring(1,c.length());   
        }else{   
            char endPrefix = 'A';   
            char endSuffix = 'A';   
            if(cellNum%26==0){   
                endSuffix = (char)('A'+25);   
                if(cellNum>52&&cellNum/26>0){   
                    endPrefix = (char)(endPrefix + cellNum/26-2);   
                }   
            }else{   
                endSuffix = (char)('A'+cellNum%26-1);   
                if(cellNum>52&&cellNum/26>0){   
                    endPrefix = (char)(endPrefix + cellNum/26-1);   
                }   
            }   
            String c = "$"+endPrefix+endSuffix;
            return c.substring(1,c.length());   
        } 
    }
    
    
    /**  
     * 使用已定义的数据源方式设置一个数据验证  
     * @param formulaString  
     * @param firstRow  
     * @param lastRow  
     * @param firstCol  
     * @param lastCol  
     * @return  
     */  
    private  DataValidation getDataValidationByFormula(String formulaString,int firstRow,int lastRow,int firstCol,int lastCol){   
        //加载下拉列表内容     
        DVConstraint constraint = DVConstraint.createFormulaListConstraint(formulaString);    
        //设置数据有效性加载在哪个单元格上。     
        //四个参数分别是：起始行、终止行、起始列、终止列     
        CellRangeAddressList regions=new CellRangeAddressList(firstRow,lastRow,firstCol,lastCol);     
        //数据有效性对象    
        DataValidation data_validation_list = new HSSFDataValidation(regions,constraint);   
        //设置输入信息提示信息   
        data_validation_list.createPromptBox("下拉选择提示","请使用下拉方式选择合适的值！");   
        //设置输入错误提示信息   
        data_validation_list.createErrorBox("选择错误提示","你输入的值未在备选列表中，请下拉选择合适的值！");   
        return data_validation_list;   
    }   

}
