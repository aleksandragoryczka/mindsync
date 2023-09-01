package com.project.mindsync.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserWithRoleResponseDto {
	private Long id;
	private String name;
	private String surname;
	private String username;
	private String email;
	private List<String> roles;
}
