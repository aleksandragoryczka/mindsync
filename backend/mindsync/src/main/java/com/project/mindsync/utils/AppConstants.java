package com.project.mindsync.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.project.mindsync.model.enums.SlideTypeName;

public class AppConstants {
	public static final String DEFAULT_PAGE_NUMBER = "0";
	public static final String DEFAULT_PAGE_SIZE = "30";
	public static final int MAX_PAGE_SIZE = 30;
	public static final String PRESENTATION = "presentation";
	public static final String USER = "user";
	public static final String ID = "id";
	public static final String CREATED_AT = "createdAt";
	public static final String SLIDE = "slide";
	public static final String NAME = "name";
	public static final String SHOW = "show";
	public static final List<SlideTypeName> OPTIONS_SLIDES_TYPES = Collections
			.singletonList(SlideTypeName.MULTIPLE_CHOICE);
}
