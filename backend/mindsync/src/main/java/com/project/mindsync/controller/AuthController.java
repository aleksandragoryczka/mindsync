package com.project.mindsync.controller;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
		User userRegistrated = authService.registerUser(registerRequest);
		if (userRegistrated != null) {
			// URI location =
			// ServletUriComponentsBuilder.fromCurrentContextPath().path("/users/{username}")
			// .buildAndExpand(userRegistrated.getUsername()).toUri();
			// TODO: po co to location ???
			return ResponseEntity.ok().body(new ApiResponseDto(true, "User registered successfully!"));

		} else {
			return ResponseEntity.badRequest()
					.body(new ApiResponseDto(false, "User with this email or username already exists"));
		}
	}

}
