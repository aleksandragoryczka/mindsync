package com.project.mindsync.dto.response;

import lombok.Data;

@Data
public class QuizWithShowsResponseDto {
	private Long id;
	private String title;
	private PagedResponseDto<ShowResponseDto> shows;
	//private String attendeesNumber;
	//private String createdAt;
	//List<ScreenshotResponseDto> screenshots;
}
