package com.project.mindsync.service;

import com.project.mindsync.dto.request.PasswordUpdatedRequestDto;
import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.dto.response.UserWithRoleResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.security.UserPrincipal;

public interface UserService {
	UserSummaryResponseDto getCurrentUser(UserPrincipal currentUser);

	PagedResponseDto<UserWithRoleResponseDto> getAllUsers(int page, int size);

	User updateUser(UserUpdatedRequestDto newUser, Long userId, UserPrincipal currentUser);

	boolean updateUserPassword(PasswordUpdatedRequestDto updatedPassword, Long userId, UserPrincipal currentUser);

	ApiResponseDto deleteUser(Long userId, UserPrincipal currentUser);

	ApiResponseDto giveAdmin(Long id);

	ApiResponseDto removeAdmin(Long id);
}
