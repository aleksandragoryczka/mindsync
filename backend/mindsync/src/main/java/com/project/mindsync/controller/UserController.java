package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.impl.PresentationServiceImpl;
import com.project.mindsync.service.impl.UserServiceImpl;
import com.project.mindsync.utils.AppConstants;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	UserServiceImpl userService;

	@Autowired
	PresentationServiceImpl presentationService;

	@GetMapping("")
	public ResponseEntity<UserSummaryResponseDto> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
		UserSummaryResponseDto userSummary = userService.getCurrentUser(currentUser);

		return ResponseEntity.ok().body(userSummary);
	}

	@GetMapping("/{id}/presentations")
	public ResponseEntity<PagedResponseDto<Presentation>> getUserPresentations(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<Presentation> response = presentationService.getUserPresentations(id, page, size);

		return ResponseEntity.ok().body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdatedRequestDto newUser,
			@PathVariable(value = "id") Long id, @CurrentUser UserPrincipal currentUser) {
		User updatedUser = userService.updateUser(newUser, id, currentUser);

		return ResponseEntity.ok().body(updatedUser);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDto> deleteUser(@PathVariable(value = "id") Long userId,
			@CurrentUser UserPrincipal currentUser) {
		ApiResponseDto apiResponse = userService.deleteUser(userId, currentUser);

		return ResponseEntity.ok(apiResponse);
	}

}
