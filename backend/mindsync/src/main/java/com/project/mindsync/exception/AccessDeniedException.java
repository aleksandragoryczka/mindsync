package com.project.mindsync.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.project.mindsync.dto.response.ApiResponseDto;

import lombok.Getter;
import lombok.Setter;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
@Getter
@Setter
public class AccessDeniedException extends RuntimeException {
	private ApiResponseDto apiResponse;
	private String message;

	public AccessDeniedException(ApiResponseDto apiResponse) {
		super();
		this.apiResponse = apiResponse;
	}

	public AccessDeniedException(String message) {
		super(message);
		this.message = message;
	}

	public AccessDeniedException(String message, Throwable cause) {
		super(message, cause);
	}
}
