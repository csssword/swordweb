/*
 * Copyright 2002-2004 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.css.sword.platform.comm.util.io;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;


public abstract class AbsResource implements IResource {

    protected static final String URL_PROTOCOL_FILE = "file";

    /**
     * This implementation checks whether a File can be opened,
     * falling back to whether an InputStream can be opened.
     * This will cover both directories and content resources.
     */
    public boolean exists() {
        // try file existence
        try {
            return getFile().exists();
        } catch (IOException ex) {
            // fall back to stream existence
            try {
                InputStream is = getInputStream();
                is.close();
                return true;
            } catch (IOException ex2) {
                return false;
            }
        }
    }

    /**
     * This implementations always returns false.
     */
    public boolean isOpen() {
        return false;
    }

    /**
     * This implementation throws a FileNotFoundException, assuming
     * that the resource cannot be resolved to a URL.
     */
    public URL getURL() throws IOException {
        throw new FileNotFoundException(getDescription() +
                                        " cannot be resolved to URL");
    }

    /**
     * This implementation throws a FileNotFoundException, assuming
     * that the resource cannot be resolved to an absolute file path.
     */
    public File getFile() throws IOException {
        throw new FileNotFoundException(getDescription() +
            " cannot be resolved to absolute file path");
    }

    /**
     * This implementation returns the description of this resource.
     * @see #getDescription
     */
    public String toString() {
        return getDescription();
    }

    /**
     * This implementation compares description strings.
     * @see #getDescription
     */
    public boolean equals(Object obj) {
        return (obj instanceof IResource &&
                ( (IResource) obj).getDescription().equals(getDescription()));
    }

    /**
     * This implementation returns the description's hash code.
     * @see #getDescription
     */
    public int hashCode() {
        return getDescription().hashCode();
    }

}
