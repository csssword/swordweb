package com.css.sword.platform.comm.util.io;


/**
 * <p>Title: </p>
 * <p>Description: Simple interface for objects that are sources for java.io.InputStreams.
 * Base interface for Cssnet's Resource interface.</p>
 * <p>Copyright: Copyright (c) 2004 中软网络??术股份有限公??</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.io.IOException;
import java.io.InputStream;


public interface IInputStreamSource {

    /**
     * Return an InputStream.
     * It is expected that each call creates a <i>fresh</i> stream.
     * @throws IOException if the stream could not be opened
     */
    InputStream getInputStream() throws IOException;

}