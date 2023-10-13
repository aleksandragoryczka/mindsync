package com.project.mindsync.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScreenshotResponseDto {
	private Long id;
	private byte[] picture;
}
