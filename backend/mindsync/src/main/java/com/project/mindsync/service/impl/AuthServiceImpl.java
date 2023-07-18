package com.project.mindsync.service.impl;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.JwtUtils;
import com.project.mindsync.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils tokenProvider;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Override
	public User registerUser(RegisterRequestDto registerRequest) {
		if (userRepository.existsByUsername(registerRequest.getUsername())
				|| userRepository.existsByEmail(registerRequest.getEmail())) {
			return null;
		}
		User newUser = new User(registerRequest.getName(), registerRequest.getUsername(), registerRequest.getEmail(),
				registerRequest.getPassword());
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

		Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User Role is not set."));
		newUser.setRoles(Collections.singleton(userRole));

		userRepository.save(newUser);
		return newUser;
	}

	@Override
	public JwtAuthenticationResponseDto signInUser(SignInRequestDto signInRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = tokenProvider.generateTokenFromUsername(signInRequest.getUsername());
		System.out.println(jwt);
		return new JwtAuthenticationResponseDto(jwt);
	}
}
