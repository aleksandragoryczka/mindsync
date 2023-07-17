package com.project.mindsync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.RoleRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	public ApiResponseDto deleteUser(Long userId, UserPrincipal currentUser) {
		User user = userRepository.findByIdAndIsActive(userId, true);
		// .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		if (user != null) {
			/*
			 * if (!user.getId().equals(currentUser.getId()) ||
			 * !currentUser.getAuthorities().contains(new
			 * SimpleGrantedAuthority(RoleName.ROLE_ADMIN.toString()))) { ApiResponseDto
			 * apiResponse = new ApiResponseDto(false,
			 * "No permission to delete profile of: " + user.getUsername()); throw new
			 * AccessDeniedException(apiResponse); }
			 */
			// if (!user.isActive()) {
			// return new ApiResponseDto(false, "Already deleted user: " +
			// user.getUsername());
			// }

			user.setActive(false);
			userRepository.save(user);
			return new ApiResponseDto(true, "Successfully deleted account of: " + user.getUsername());
		}else{
			return new ApiResponseDto(false, "Not found user with Id: " + userId);
		}

	}

}
