package com.project.mindsync.service;

import java.net.URI;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;

@Service
public class AuthService {
	// @Autowired
	// AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	// @Autowired
	// PasswordEncoder passwordEncoder;

	// @Autowired
	// JwtTokenProvider tokenProvider;

	public User registerUser(RegisterRequestDto registerRequest) {
		if (userRepository.existsByUsername(registerRequest.getUsername())
				|| userRepository.existsByEmail(registerRequest.getEmail())) {
			return null;
		}

		User newUser = new User(registerRequest.getName(), registerRequest.getUsername(), registerRequest.getEmail(),
				registerRequest.getPassword());
		// TODO: newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

		Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User Role is not set."));
		newUser.setRoles(Collections.singleton(userRole));

		userRepository.save(newUser);
		return newUser;
	}

}
