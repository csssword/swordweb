package com.css.sword.platform.persistence.pagination;

import java.util.Map;

public interface IPaginationReqEvent {
    public static final String PAGINATION_PARAM = "paginationParam";
	Map<String, Object> getPaginationParams();
}
