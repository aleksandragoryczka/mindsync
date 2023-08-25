package com.project.mindsync.dto.request;

import lombok.Data;

@Data
public class UserUpdatedRequestDto {
	private String name;
	private String username;
	private String password;
}
