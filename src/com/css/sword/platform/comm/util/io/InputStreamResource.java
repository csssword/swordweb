package com.css.sword.platform.comm.util.io;


/**
 * <p>Title: </p>
 * <p>Description:  * Resource implementation for a given InputStream. Should only
 * be used if no specific Resource implementation is applicable.
 *
 * <p>In contrast to other Resource implementations, this is a descriptor
 * for an <i>already opened</i> resource - therefore returning true on
 * isOpen(). Do not use it if you need to keep the resource descriptor
 * somewhere, or if you need to read a stream multiple times.</p>
 *
 * <p>Copyright: Copyright (c) 2004 中软网络??术股份有限公??</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.io.IOException;
import java.io.InputStream;


public class InputStreamResource extends AbsResource {

    private InputStream inputStream;

    private final String description;

    private int length;

    /**
     * Create a new InputStreamResource.
     * @param inputStream the InputStream to use
     * @param description where the InputStream comes from
     */
    public InputStreamResource(InputStream inputStream, String description,int length) {
        if (inputStream == null) {
            throw new IllegalArgumentException("inputStream must not be null");
        }
        this.inputStream = inputStream;
        this.description = description;
        this.length=length;
    }

    /**
     * Create a new InputStreamResource.
     * @param inputStream the InputStream to use
     * @param description where the InputStream comes from
     */
    public InputStreamResource(InputStream inputStream, String description) {
        if (inputStream == null) {
            throw new IllegalArgumentException("inputStream must not be null");
        }
        this.inputStream = inputStream;
        this.description = description;
    }

    public boolean exists() {
        return true;
    }

    public boolean isOpen() {
        return true;
    }

    /**
     * This implementation throws IllegalStateException if attempting to
     * read the underlying stream multiple times.
     */
    public InputStream getInputStream() throws IOException,
        IllegalStateException {
        if (this.inputStream == null) {
            throw new IllegalStateException(
                "InputStream has already been read - " +
                "do not use InputStreamResource if a stream needs to be read multiple times");
        }
        InputStream result = this.inputStream;
        this.inputStream = null;
        return result;
    }

    public String getDescription() {
        return description;
    }

    public int getLength(){
        return this.length;
    }

}