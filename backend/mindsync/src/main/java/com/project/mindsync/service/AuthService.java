package com.project.mindsync.service;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.model.User;

import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
	User registerUser(RegisterRequestDto registerRequest);

	JwtAuthenticationResponseDto signInUser(HttpServletRequest request, SignInRequestDto signInRequest);
	boolean verifyUser(String verificationCode);
}
