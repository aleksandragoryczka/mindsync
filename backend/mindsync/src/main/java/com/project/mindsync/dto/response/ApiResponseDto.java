package com.project.mindsync.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponseDto {
	private boolean success;
	private String message;
}
