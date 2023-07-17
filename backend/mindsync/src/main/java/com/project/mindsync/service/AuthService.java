package com.project.mindsync.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.JwtTokenProvider;
import com.project.mindsync.security.JwtUtils;

@Service
public class AuthService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;
	// TODO: Implement PasswordEncoder better (?)

	@Autowired
	JwtUtils tokenProvider;

	public User registerUser(RegisterRequestDto registerRequest) {
		if (userRepository.existsByUsername(registerRequest.getUsername())
				|| userRepository.existsByEmail(registerRequest.getEmail())) {
			return null;
		}
		System.out.println("kkkkkkkkkkkkkkkkkk");
		User newUser = new User(registerRequest.getName(), registerRequest.getUsername(), registerRequest.getEmail(),
				registerRequest.getPassword());
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

		Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User Role is not set."));
		newUser.setActive(true);
		newUser.setRoles(Collections.singleton(userRole));

		userRepository.save(newUser);
		return newUser;
	}
}
