package com.css.sword.platform.web.chart.ofc4j;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class XmlHelper {

	/**
	 * 创建dom
	 * 
	 * @return Document
	 */
	public static Document newDocument() {
		try {
			return newDocumentBuilderFactory().newDocumentBuilder().newDocument();
		} catch (ParserConfigurationException e) {
			return null;
		}
	}

	/**
	 * DocumentBuilder类的实例
	 * 
	 * @return DocumentBuilder DocumentBuilder类的实例
	 * @throws ParserConfigurationException
	 */
	private static DocumentBuilder newDocumentBuilder()
			throws ParserConfigurationException {
		return newDocumentBuilderFactory().newDocumentBuilder();
	}

	/**
	 * DocumentBuilderFactory类的实例
	 * 
	 * @return DocumentBuilderFactory DocumentBuilderFactory类的实例
	 */
	private static DocumentBuilderFactory newDocumentBuilderFactory() {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		dbf.setIgnoringElementContentWhitespace(true);
		dbf.setIgnoringComments(true);
		dbf.setIgnoringElementContentWhitespace(true);
		dbf.setExpandEntityReferences(false);
		return dbf;
	}

	/**
	 * 
	 * 将Document对象以文本形式保存到物理文件 ,供测试使用�?��?��?��?��??
	 * 
	 * @param xmlDoc
	 *            Document xml的Document对象
	 * @param fileName
	 *            String 文件路径及文件名
	 * @return boolean 保存是否成功
	 */
	public static void saveDom(Document xmlDoc, String fileName) {
		try {
			OutputStream stream = new FileOutputStream(fileName);
			saveDom(xmlDoc, stream);
			stream.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将Document对象以文本形式保存到输出�?
	 * 
	 * @param xmlDoc
	 *            Document xml的Document对象
	 * @param stream
	 *            OutputStream 输出�?
	 * @return boolean 保存是否成功
	 */
	public static void saveDom(Document xmlDoc, OutputStream stream) {
		try {
			TransformerFactory tfactory = TransformerFactory.newInstance();
			Transformer transformer = tfactory.newTransformer();
			// 将DOM对象转化为DOMSource类对象，该对象表现为转化成别的表达形式的信息容器�?
			DOMSource source = new DOMSource(xmlDoc);
			// 获得�?个StreamResult类对象，该对象是DOM文档转化成的其他形式的文档的容器，可以是XML文件，文本文件，HTML文件�?
			// 这里为一个XML文件�?
			stream.flush();
			StreamResult result = new StreamResult(new BufferedOutputStream(
					stream));
			// 调用API，将DOM文档转化成XML文件�?
			transformer.transform(source, result);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将字符串形式的xml转化为dom对象
	 * 
	 * @param xml
	 *            String 输入的xml�?
	 * @return Document dom对象
	 */
	public static Document loadXML(String xml) {
		if (null == xml) {
			return null;
		}
		Document dom = null;
		InputStream stream = null;
		try {
			stream = new ByteArrayInputStream(xml.getBytes("utf-8"));
			return load(stream);
		} catch (Exception e) {
		} finally {
			try {
				stream.close();
			} catch (Exception e) {

			}
		}
		return dom;
	}

	/**
	 * 将输入流转化为dom对象
	 * 
	 * @param stream
	 *            InputStream 输入�?
	 * @return Document dom对象
	 */
	public static Document load(InputStream stream) {
		try {
			BufferedInputStream bs = new BufferedInputStream(stream);
			bs.mark(1);

			if (-1 == bs.read())
				return null;

			bs.reset();
			return newDocumentBuilder().parse(bs);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 将uri指向的内容转化为dom对象
	 * 
	 * @param uri
	 *            String 输入的xml�?
	 * @return Document dom对象
	 */
	public static Document load(String uri) {
		Document dom = null;
		try {
			DocumentBuilder db = newDocumentBuilder();
			dom = db.parse(uri);
		} catch (Exception e) {
		}
		return dom;
	}

	/**
	 * 将节点转换为字符串的形式
	 * 
	 * @param node
	 *            Node xml文档节点
	 * @return String 转换后的字符�?
	 */
	public static String nodeXML(Node node) {
		try {
			TransformerFactory tfactory = TransformerFactory.newInstance();
			Transformer transformer = tfactory.newTransformer();
			DOMSource source = new DOMSource(node);
			StringWriter sw = new StringWriter();
			StreamResult result = new StreamResult(sw);
			transformer.transform(source, result);
			return sw.toString();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * 获取element节点的内�?
	 * 
	 * @param element
	 *            Element 节点
	 * @return String 节点的内�?
	 */
	public static String getText(Element element) {
		try {
			String text = element.getFirstChild().getNodeValue();
			return null == text ? "" : text;
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * 设置节点的Text属�?�，该方法实现msxml中的.text赋�?�方法，，该方法会删除该节点下的�?有子节点
	 * 
	 * @param ele
	 *            Element 节点
	 * @param stext
	 *            String 节点的�??
	 */
	public static void setText(Element ele, String stext) {
		try {
			if (null == ele)
				return;
			if (null == stext) {
				ele.appendChild(ele.getOwnerDocument().createTextNode(""));
			} else {
				ele.getFirstChild().setNodeValue(stext);
			}
		} catch (Exception e) {
			ele.appendChild(ele.getOwnerDocument().createTextNode(stext));
		}
	}

	// public static String toXML(Node node) {
	// if (node == null)
	// throw new IllegalArgumentException() ;
	// try {
	// Transformer transformer =
	// TransformerFactory.newInstance().newTransformer() ;
	// Properties properties = transformer.getOutputProperties() ;
	// properties.setProperty(OutputKeys.ENCODING , "gb2312") ;
	// properties.setProperty(OutputKeys.METHOD , "xml") ;
	// properties.setProperty(OutputKeys.VERSION , "1.0") ;
	// //properties.setProperty(OutputKeys.INDENT , "yes") ;
	// transformer.setOutputProperties(properties) ;
	// if (transformer != null) {
	// StringWriter sw = new StringWriter() ;
	// transformer.transform(new DOMSource(node) , new StreamResult(sw)) ;
	// return sw.toString() ;
	// }
	// return new String("不能生成XML信息") ;
	// }
	// catch (TransformerConfigurationException e) {
	// throw new RuntimeException(e.getMessage()) ;
	// }
	// catch (TransformerException e) {
	// throw new RuntimeException(e.getMessage()) ;
	// }
	// }
}
