package com.project.mindsync.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class QuizWithSlidesResponseDto {
	private Long id;
	private String title;
	private String code;
	private String createdAt;
	private List<SlideResponseDto> slides;
}
