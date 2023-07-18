package com.project.mindsync.service;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.model.User;

public interface AuthService {
	public User registerUser(RegisterRequestDto registerRequest);

	public JwtAuthenticationResponseDto signInUser(SignInRequestDto signInRequest);
}
