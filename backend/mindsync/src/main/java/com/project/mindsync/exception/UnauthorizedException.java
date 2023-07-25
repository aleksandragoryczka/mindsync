package com.project.mindsync.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.project.mindsync.dto.response.ApiResponseDto;

import lombok.Getter;
import lombok.Setter;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
@Getter
@Setter
public class UnauthorizedException extends RuntimeException {
	private ApiResponseDto apiResponse;
	private String message;

	public UnauthorizedException(ApiResponseDto apiResponse) {
		super();
		this.apiResponse = apiResponse;
	}

	public UnauthorizedException(String message) {
		super();
		this.message = message;
	}

	public UnauthorizedException(String message, Throwable cause) {
		super(message, cause);
	}

}
