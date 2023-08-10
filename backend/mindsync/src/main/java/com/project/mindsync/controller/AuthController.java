package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.service.AuthService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
		User userRegistrated = authService.registerUser(registerRequest);
		if (userRegistrated != null) {
			// URI location =
			// ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/{id}").buildAndExpand(userRegistrated.getId()).toUri();
			// TODO: po co to location ???
			return ResponseEntity.ok().body(userRegistrated);

		}
		return ResponseEntity.badRequest().body(null);

	}

	@PostMapping("/signin")
	public ResponseEntity<JwtAuthenticationResponseDto> signInUser(@Valid @RequestBody SignInRequestDto signInRequest) {
		return ResponseEntity.ok().body(authService.signInUser(signInRequest));
	}
}
