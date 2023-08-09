package com.project.mindsync.dto.response;

import lombok.Data;

@Data
public class JwtAuthenticationResponseDto {
	private String accessToken;

	public JwtAuthenticationResponseDto(String accesToken) {
		this.accessToken = accesToken;
	}
}
