package com.project.mindsync.dto.response;

import java.time.Instant;

import com.project.mindsync.model.audit.DateAudit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShowResponseDto {
	private Long id;
	private String attendeesNumber;
	private String createdAt;
}
