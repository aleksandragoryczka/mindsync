package com.project.mindsync.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserSummaryResponseDto {
	private Long id;
	private String name;
	private String surname;
	private String username;
	private String email;
}
