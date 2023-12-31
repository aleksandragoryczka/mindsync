package com.project.mindsync.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.JwtUtils;
import com.project.mindsync.service.AuthService;
import com.project.mindsync.utils.AppConstants;

import jakarta.servlet.http.HttpServletRequest;
import net.bytebuddy.utility.RandomString;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils tokenProvider;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Override
	public User registerUser(RegisterRequestDto registerRequest) {
		if (userRepository.existsByEmail(registerRequest.getEmail())) {
			return null;
		}
		User newUser = new User(registerRequest.getName(), registerRequest.getSurname(), registerRequest.getUsername(),
				registerRequest.getEmail(), registerRequest.getPassword());
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

		Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User Role is not set."));
		newUser.setRoles(Collections.singleton(userRole));

		String randomVerificationCode = RandomString.make(64);
		newUser.setVerificationCode(randomVerificationCode);
		newUser.setEnabled(false);
		// newUser.setEnabled(true);
		userRepository.save(newUser);

		return newUser;
	}

	@Override
	public JwtAuthenticationResponseDto signInUser(HttpServletRequest request, SignInRequestDto signInRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		User user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.USER, AppConstants.ID, signInRequest.getEmail()));
		if (!user.isEnabled())
			return null;
		Set<GrantedAuthority> authorities = new HashSet<>(
				SecurityContextHolder.getContext().getAuthentication().getAuthorities());
		String jwt = tokenProvider.generateTokenFromId(user.getId(), authorities);
		return new JwtAuthenticationResponseDto(jwt);
	}

	@Override
	public boolean verifyUser(String verificationCode) {
		User user = userRepository.findByVerificationCode(verificationCode);
		if (user == null || user.isEnabled()) {
			return false;
		} else {
			user.setVerificationCode(null);
			user.setEnabled(true);
			userRepository.save(user);
			return true;
		}
	}
}
