package com.project.mindsync.utils;

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
	public static final String VERIFICATION_CODE = "VerificationCode";
	public static final List<SlideTypeName> OPTIONS_SLIDES_TYPES = Collections
			.singletonList(SlideTypeName.MULTIPLE_CHOICE);
	public static final String MAIL_SENDER = "MindSync";
	public static final String MAIL_SUBJECT = "Please verify your Account";
	public static final String MAIL_CONTENT = "Dear [[name]],<br>"
            + "Please click the link below to verify your Account:<br>"
            + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
            + "Thank you,<br>"
			+ MAIL_SENDER;
}
