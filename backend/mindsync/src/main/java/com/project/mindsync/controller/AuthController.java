package com.project.mindsync.controller;

import java.io.UnsupportedEncodingException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.project.mindsync.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthService authService;

	@Autowired
	private EmailService emailService;

	@PostMapping("/register")
	public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest,HttpServletRequest httpServletRequest) throws UnsupportedEncodingException, MessagingException {
		User userRegistrated = authService.registerUser(registerRequest);
		if (userRegistrated != null) {
			emailService.sendVerificationEmail(userRegistrated, httpServletRequest);
			
			return ResponseEntity.ok().body(userRegistrated);

		}
		return ResponseEntity.badRequest().body(null);

	}

	@PostMapping("/signin")
	public ResponseEntity<JwtAuthenticationResponseDto> signInUser(@Valid @RequestBody SignInRequestDto signInRequest) {
		return ResponseEntity.ok().body(authService.signInUser(signInRequest));
	}

	@GetMapping("/verify")
	public ResponseEntity<Boolean> verifyUser(@Param("code") String code) {
		if (authService.verifyUser(code)) {
			return ResponseEntity.ok().body(true);
		}else{
			return ResponseEntity.badRequest().body(false);
		}
	}
}
