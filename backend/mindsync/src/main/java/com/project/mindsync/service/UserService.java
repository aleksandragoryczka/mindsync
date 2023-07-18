package com.project.mindsync.service;

import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.security.UserPrincipal;

public interface UserService {
	UserSummaryResponseDto getCurrentUser(UserPrincipal currentUser);

	ApiResponseDto deleteUser(Long userId, UserPrincipal currentUser);

	User updateUser(UserUpdatedRequestDto newUser, Long userId, UserPrincipal currentUser);
}
