package com.project.mindsync.dto.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {
	@NotBlank
	@Size(max = 40)
	@Email
	private String email;

	@NotBlank
	@Size(min = 3, max = 15)
	private String username;

	@NotBlank
	@Size(min = 3, max = 40)
	private String name;

	@NotBlank
	@Size(min = 3, max = 40)
	private String surname;

	@NotBlank
	@Size(min = 6, max = 40)
	private String password;

}
