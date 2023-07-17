package com.project.mindsync.utils;

import org.springframework.http.HttpStatus;

import com.project.mindsync.exception.MindSyncException;

public class AppUtils {
	public static void validatePageNumberAndSIze(int page, int size) {
		if (page < 0) {
			throw new MindSyncException(HttpStatus.BAD_REQUEST, "Page number cannot be negative number.");
		}
		if (size < 0) {
			throw new MindSyncException(HttpStatus.BAD_REQUEST, "Size number cannot be negative number.");
		}
		if (size > AppConstants.MAX_PAGE_SIZE) {
			throw new MindSyncException(HttpStatus.BAD_REQUEST,
					"Size number cannot be greater than " + AppConstants.MAX_PAGE_SIZE);
		}
	}
}