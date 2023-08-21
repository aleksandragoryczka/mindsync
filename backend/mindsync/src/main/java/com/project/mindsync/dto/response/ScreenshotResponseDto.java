package com.project.mindsync.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScreenshotResponseDto {
	// TODO: is id needed ????????
	private Long id;
	private String url;
	private byte[] picture;
}
