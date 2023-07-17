package com.project.mindsync.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class SignInRequestDto {
	@NotBlank
	private String username;

	@NotBlank
	private String password;
}
