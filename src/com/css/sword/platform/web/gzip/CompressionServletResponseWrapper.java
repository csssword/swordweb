package com.css.sword.platform.web.gzip;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class CompressionServletResponseWrapper extends HttpServletResponseWrapper {

    public CompressionServletResponseWrapper(HttpServletResponse response) {
        super(response);
        origResponse = response;
    }

    protected HttpServletResponse origResponse = null;

    protected static final String info = "CompressionServletResponseWrapper";

    protected ServletOutputStream stream = null;

    protected PrintWriter writer = null;

    protected int threshold = 0;

    protected String contentType = null;


    public void setContentType(String contentType) {
        this.contentType = contentType;
        origResponse.setContentType(contentType);
    }

    public void setCompressionThreshold(int threshold) {
        this.threshold = threshold;
    }

    public ServletOutputStream createOutputStream() throws IOException {

        CompressionResponseStream stream = new CompressionResponseStream(origResponse);
        stream.setBuffer(threshold);

        return stream;

    }

    public void finishResponse() {
        try {
            if (writer != null) {
                writer.close();
            } else {
                if (stream != null)
                    stream.close();
            }
        } catch (IOException e) {
        }
    }

    public void flushBuffer() throws IOException {
        ((CompressionResponseStream)stream).flush();

    }

    public ServletOutputStream getOutputStream() throws IOException {

        if (writer != null)
            throw new IllegalStateException("getWriter() has already been called for this response");

        if (stream == null)
            stream = createOutputStream();

        return (stream);

    }

    public PrintWriter getWriter() throws IOException {

        if (writer != null)
            return (writer);

        if (stream != null)
            throw new IllegalStateException("getOutputStream() has already been called for this response");

        stream = createOutputStream();
        String charEnc = origResponse.getCharacterEncoding();
        if (charEnc != null) {
            writer = new PrintWriter(new OutputStreamWriter(stream, charEnc));
        } else {
            writer = new PrintWriter(stream);
        }
        
        return (writer);

    }


    public void setContentLength(int length) {
    }


    @SuppressWarnings("unused")
	private static String getCharsetFromContentType(String type) {

        if (type == null) {
            return null;
        }
        int semi = type.indexOf(";");
        if (semi == -1) {
            return null;
        }
        String afterSemi = type.substring(semi + 1);
        int charsetLocation = afterSemi.indexOf("charset=");
        if(charsetLocation == -1) {
            return null;
        } else {
            String afterCharset = afterSemi.substring(charsetLocation + 8);
            String encoding = afterCharset.trim();
            return encoding;
        }
    }

}
