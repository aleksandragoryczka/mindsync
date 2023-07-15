package com.project.mindsync.controller;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	UserService userService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
		User userRegistrated = userService.registerUser(registerRequest);
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

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDto> deleteUser(@PathVariable(value = "id") Long userId) {
		ApiResponseDto apiResponse = userService.deleteUser(userId);

		return ResponseEntity.ok(apiResponse);
	}

}
