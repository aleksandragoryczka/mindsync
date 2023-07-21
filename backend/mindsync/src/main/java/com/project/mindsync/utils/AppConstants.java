package com.project.mindsync.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.project.mindsync.model.enums.SlideTypeName;

public class AppConstants {
	public static final String DEFAULT_PAGE_NUMBER = "0";
	public static final String DEFAULT_PAGE_SIZE = "30";
	public static final int MAX_PAGE_SIZE = 30;
	public static final String PRESENTATION = "Presentation";
	public static final String USER = "User";
	public static final String ID = "Id";
	public static final String CREATED_AT = "createdAt";
	public static final String SLIDE = "Slide";
	public static final List<SlideTypeName> OPTIONS_SLIDES_TYPES = Collections
			.singletonList(SlideTypeName.MULTIPLE_CHOICE);
}
