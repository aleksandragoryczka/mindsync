package com.project.mindsync.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class SignInRequestDto {
	@NotBlank
	private String email;

	@NotBlank
	private String password;
}
