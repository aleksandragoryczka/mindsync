package com.project.mindsync.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.dto.response.UserWithRoleResponseDto;
import com.project.mindsync.exception.AccessDeniedException;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.UserService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

import jakarta.transaction.Transactional;

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
		return new UserSummaryResponseDto(currentUser.getUsername(), currentUser.getUsername(), currentUser.getEmail());
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
	@Transactional
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

	@Override
	public ApiResponseDto giveAdmin(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
		Set<Role> roles = new HashSet<Role>();
		roles.add(roleRepository.findByName(RoleName.ROLE_ADMIN)
				.orElseThrow(() -> new AppException("User role is not set.")));
		roles.add(roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User role is not set.")));
		user.setRoles(roles);
		userRepository.save(user);
		return new ApiResponseDto(true, "ADMIN role gave to user with Id: " + user.getId());

	}

	@Override
	public ApiResponseDto removeAdmin(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
		Set<Role> roles = new HashSet<Role>();
		roles.add(roleRepository.findByName(RoleName.ROLE_USER)
				.orElseThrow(() -> new AppException("User role is not set.")));
		user.setRoles(roles);
		userRepository.save(user);
		return new ApiResponseDto(true, "ADMIN role remove for user with Id: " + user.getId());
	}

	@Override
	public PagedResponseDto<UserWithRoleResponseDto> getAllUsers(int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.NAME);

		Page<User> users = userRepository.findAll(pageable);

		List<UserWithRoleResponseDto> content = users.getNumberOfElements() == 0 ? Collections.emptyList()
				: users.getContent().stream().map(this::mapUserToUserWithRoleResponseDto).collect(Collectors.toList());

		return new PagedResponseDto<UserWithRoleResponseDto>(content, users.getNumber(), users.getSize(),
				users.getTotalElements(), users.getTotalPages(), users.isLast());
	}

	private UserWithRoleResponseDto mapUserToUserWithRoleResponseDto(User user) {
		List<String> roleNames = user.getRoles().stream().map(role -> role.getName().toString())
				.collect(Collectors.toList());
		return new UserWithRoleResponseDto(user.getName(), user.getUsername(), user.getEmail(), roleNames);
	}
}
