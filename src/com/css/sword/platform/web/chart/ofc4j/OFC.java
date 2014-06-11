package com.css.sword.platform.web.chart.ofc4j;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.css.sword.platform.web.chart.json.JSONException;
import com.css.sword.platform.web.chart.json.JSONObject;
import com.css.sword.platform.web.chart.ofc4j.model.Chart;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.SingleValueConverter;
import com.thoughtworks.xstream.io.json.JsonHierarchicalStreamDriver;

/**
 * <p>
 * This is the class responsible for converting a Chart object into the JSON
 * string which feeds the charting widget. There is no need to make explicit use
 * of this class, but if necessary, there are several ways to do so:
 * </p>
 * <ol>
 * <li>The "instance" field contains a static instance of an OFC object.</li>
 * <li>The Chart object overrides toString() and uses this instance to render
 * itself.</li>
 * <li>For tricky threading situations, you may prefer to create and manage
 * instances of OFC yourself.</li>
 * </ol>
 * <p>
 * Theoretically, XStream (the JSON conversion library used here) is
 * thread-safe, but it does not hurt to have the option to synchronize or to
 * have thread local instances, whatever may be necessary.
 * </p>
 */
public class OFC {

	/**
	 * A pre-instantiated instance of OFC ready to go. This is used implicitly
	 * by the
	 * {@link com.css.sword.platform.web.chart.ofc4j.model.Chart#toString Chart
	 * class}.
	 */
	public static final OFC instance = new OFC();

	private final XStream converter = new XStream(
			new JsonHierarchicalStreamDriver());

	// private final XStream converter = new XStream(new OFCJSONDriver());
	/**
	 * Sole constructor.
	 * 
	 * @throws FileNotFoundException
	 * @throws TransformerException
	 */
	public OFC() {

		try {
			InputStream is = getClass().getResourceAsStream("/ofj4j.xml");
			Document doc = XmlHelper.load(is);
			XPathFactory xf = XPathFactory.newInstance();
			XPath path = xf.newXPath();
			NodeList m = (NodeList) path.evaluate("//class", doc,
					XPathConstants.NODESET);
			// NodeList m = XPathAPI.selectNodeList(doc, "//class");
			for (int i = 0; i < m.getLength(); i++) {
				Node n = m.item(i);
				NamedNodeMap nmn = n.getAttributes();
				if (nmn != null) {
					String convertClass = "";
					String classname = "";

					if (nmn.getNamedItem("classname") != null) {
						classname = nmn.getNamedItem("classname")
								.getNodeValue();
					}

					if (nmn.getNamedItem("convert") != null) {
						convertClass = nmn.getNamedItem("convert")
								.getNodeValue();

						Class<?> clazz = Class.forName(convertClass);

						if (SingleValueConverter.class.isAssignableFrom(clazz)) {
							converter
									.registerConverter((SingleValueConverter) clazz
											.newInstance());
						} else {
							converter
									.registerConverter((com.thoughtworks.xstream.converters.Converter) clazz
											.newInstance());
						}
					}
					if (n.hasChildNodes() == true) {
						NodeList nl = n.getChildNodes();
						for (int j = 0; j < nl.getLength(); j++) {
							Node nb = nl.item(j);
							NamedNodeMap nmn1 = nb.getAttributes();
							if (nmn1 != null) {
								String fieldname = "";
								if (nmn1.getNamedItem("alias") != null) {
									fieldname = nmn1.getNamedItem("alias")
											.getNodeValue();
									String fieldAliasValue = nb.getFirstChild()
											.getNodeValue();
									converter
											.aliasField(fieldAliasValue,
													Class.forName(classname),
													fieldname);
								}
							}
						}
					}

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * Use this method in your applications to send data back to the chart
	 * widget.
	 * 
	 * @param c
	 *            the chart to render
	 * @return the JSONified chart data
	 */
	public String render(Chart c) {
		String json = converter.toXML(c);

		try {
			return new JSONObject(json).getString(Chart.class.getName());
		} catch (JSONException je) {
			System.err.println(json);
			je.printStackTrace();
			return null;
		}
	}

	/**
	 * Use this method for debugging purposes.
	 * 
	 * @param c
	 *            the chart to render
	 * @param indentationLevel
	 *            number of spaces to use for indentation
	 * @return pretty-printed JSONified chart data
	 */
	public String prettyPrint(Chart c, int indentationLevel) {
		String json = converter.toXML(c);
		try {
			return new JSONObject(json).getJSONObject(Chart.class.getName())
					.toString(indentationLevel);
		} catch (JSONException je) {
			System.err.println(json);
			je.printStackTrace();
			return null;
		}
	}

	/**
	 * Convenience method for converting Collections to Arrays. You can use this
	 * where the API has limited support for collections:
	 * getLabels().addLabels(OFC.toArray(stringList, String.class));
	 * 
	 * @param collection
	 *            The collection to use
	 * @param type
	 *            The supertype for the collection. This will commonly be
	 *            Integer, Number, etc.
	 * @return the array of the collection
	 */
	public static Object[] toArray(Collection<?> collection, Class<?> type) {
		return collection.toArray((Object[]) Array.newInstance(type,
				collection.size()));
	}

	/**
	 * Convenience method to generate labels from a collection of Objects, if so
	 * desired.
	 * 
	 * @param source
	 *            the source collection holding Objects.
	 * @return a collection of all the objects toString() method invoked
	 */
	public static List<String> stringify(List<?> source) {
		List<String> strings = new ArrayList<String>(source.size());
		for (int i = 0; i < source.size(); i++) {
			strings.add(source.get(i).toString());
		}

		return strings;
	}

	public static void main(String[] a) {

	}

}
