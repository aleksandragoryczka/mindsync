package com.project.mindsync.dto.response;

import java.util.List;

import com.project.mindsync.model.Slide;

public class PresentationWithSlidesResponseDto {
	private Long id;
	private String title;
	private String code;
	private String createdAt;
	private List<SlideResponseDto> slides;
}