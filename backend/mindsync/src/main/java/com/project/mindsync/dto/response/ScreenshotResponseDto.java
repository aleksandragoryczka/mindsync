package com.project.mindsync.dto.response;

import lombok.Data;

@Data
public class ScreenshotResponseDto {
	// TODO: is id needed ????????
	private Long id;
	private String url;
	private byte[] picture;
}
