package com.project.mindsync.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.project.mindsync.dto.response.ApiResponseDto;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
@Getter
public class ResourceNotFoundException extends RuntimeException {
	private ApiResponseDto apiResponse;

	private String resourceName;
	private String fieldName;
	private Object fieldValue;

	public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
		super();
		this.resourceName = resourceName;
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
	}

	private void setApiResponse() {
		String message = String.format("%s not found with %s: '%s", resourceName, fieldName, fieldValue);

		apiResponse = new ApiResponseDto(false, message);
	}

}
