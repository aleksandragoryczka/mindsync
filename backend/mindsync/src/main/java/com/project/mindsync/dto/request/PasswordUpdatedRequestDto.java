package com.project.mindsync.dto.request;

import lombok.Data;

@Data
public class PasswordUpdatedRequestDto {
	private String oldPassword;
	private String newPassword;
}
