package com.project.mindsync.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class MindSyncException extends RuntimeException {
	private final HttpStatus httpStatus;
	private final String message;

	public MindSyncException(HttpStatus httpStatus, String message) {
		super();
		this.httpStatus = httpStatus;
		this.message = message;
	}

	public MindSyncException(HttpStatus httpStatus, String message, Throwable exception) {
		super(exception);
		this.httpStatus = httpStatus;
		this.message = message;
	}
}
