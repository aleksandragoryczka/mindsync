package com.project.mindsync.dto.response;

import lombok.AllArgsConstructor;
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
