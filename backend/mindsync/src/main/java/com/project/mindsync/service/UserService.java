package com.project.mindsync.service;

import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.security.UserPrincipal;

public interface UserService {
	public UserSummaryResponseDto getCurrentUser(UserPrincipal currentUser);

	public ApiResponseDto deleteUser(Long userId, UserPrincipal currentUser);
}
