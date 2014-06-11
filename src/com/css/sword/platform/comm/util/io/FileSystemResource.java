package com.css.sword.platform.comm.util.io;


/**
 * <p>Title: </p>
 * <p>Description:  * Resource implementation for java.io.File handles.
 * Obviously supports resolution as File, and also as URL.</p>
 * <p>Copyright: Copyright (c) 2004 中软网络??术股份有限公??</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;


public class FileSystemResource extends AbsResource {

    private final File file;

    /**
     * Create a new FileSystemResource.
     * @param file a File handle
     */
    public FileSystemResource(File file) {
        this.file = file;
    }

    /**
     * Create a new FileSystemResource.
     * @param path a file path
     */
    public FileSystemResource(String path) {
        this.file = new File(path);
    }

    public boolean exists() {
        return this.file.exists();
    }

    public InputStream getInputStream() throws IOException {
        return new FileInputStream(this.file);
    }

    public URL getURL() throws IOException {
        return new URL(URL_PROTOCOL_FILE + ":" + this.file.getAbsolutePath());
    }

    public File getFile() {
        return file;
    }

    public String getDescription() {
        return "file [" + this.file.getAbsolutePath() + "]";
    }

}