package com.project.mindsync.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class ShowWithScreenshotsResponseDto {
	private Long id;
	private String attendeesNumber;
	private String createdAt;
	List<ScreenshotResponseDto> screenshots;
}
