package com.project.mindsync.service;

import java.net.URI;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;

@Service
public class UserService {
	// @Autowired
	// AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	public ApiResponseDto deleteUser(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		// TODO: Add user principal!?

		user.setActive(false);
		userRepository.save(user);
		return new ApiResponseDto(true, "Successfully deleted account of: " + user.getUsername());

	}

}
