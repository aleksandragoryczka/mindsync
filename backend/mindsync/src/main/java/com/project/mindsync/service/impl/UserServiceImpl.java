package com.project.mindsync.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.exception.AccessDeniedException;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.UserService;
import com.project.mindsync.utils.AppUtils;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public UserSummaryResponseDto getCurrentUser(UserPrincipal currentUser) {
		return new UserSummaryResponseDto(currentUser.getName(), currentUser.getUsername(), currentUser.getEmail());
	}

	@Override
	public ApiResponseDto deleteUser(Long userId, UserPrincipal currentUser) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(user, currentUser)) {
			userRepository.deleteById(user.getId());
			return new ApiResponseDto(true, "Successfully deleted account of: " + user.getUsername());
		}
		throw new AccessDeniedException(
				new ApiResponseDto(false, "You do not have permissions to update profile of user with Id: " + userId));

	}

	@Override
	public User updateUser(UserUpdatedRequestDto newUser, Long userId, UserPrincipal currentUser) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(user, currentUser)) {
			user.setName(newUser.getName());
			user.setPassword(passwordEncoder.encode(newUser.getPassword()));

			return userRepository.save(user);
		}
		throw new UnauthorizedException(
				new ApiResponseDto(false, "You do not have permissions to update profile of user with Id: " + userId));
	}

}
