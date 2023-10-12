package com.project.mindsync.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.PasswordUpdatedRequestDto;
import com.project.mindsync.dto.request.UserUpdatedRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.UserSummaryResponseDto;
import com.project.mindsync.dto.response.UserWithPresentationsCountResponseDto;
import com.project.mindsync.dto.response.UserWithRoleResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.service.UserService;
import com.project.mindsync.utils.AppConstants;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	private UserService userService;

	@Autowired
	private PresentationService presentationService;

	@GetMapping("")
	public ResponseEntity<UserSummaryResponseDto> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
		UserSummaryResponseDto userSummary = userService.getCurrentUser(currentUser);

		return ResponseEntity.ok().body(userSummary);
	}

	@GetMapping("/all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<PagedResponseDto<UserWithRoleResponseDto>> getAllUsers(
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<UserWithRoleResponseDto> response = userService.getAllUsers(page, size);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/presentations")
	public ResponseEntity<PagedResponseDto<Presentation>> getUserPresentations(
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
			@CurrentUser UserPrincipal currentUser) {
		PagedResponseDto<Presentation> response = presentationService.getUserPresentations(currentUser, page, size);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/presentations-count")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<UserWithPresentationsCountResponseDto>> getUserWithPresetationsCount() {
		return ResponseEntity.ok().body(this.presentationService.getUsersWithPresentationsCount());
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdatedRequestDto newUser,
			@PathVariable(value = "id") Long id, @CurrentUser UserPrincipal currentUser) {
		User updatedUser = userService.updateUser(newUser, id, currentUser);

		return ResponseEntity.ok().body(updatedUser);
	}

	@PutMapping("/{id}/password")
	public ResponseEntity<Boolean> updatePassword(@Valid @RequestBody PasswordUpdatedRequestDto passwordUpdated,
			@PathVariable(value = "id") Long id, @CurrentUser UserPrincipal currentUser) {
		boolean isPasswordUpdated = userService.updateUserPassword(passwordUpdated, id, currentUser);
		return ResponseEntity.ok().body(isPasswordUpdated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDto> deleteUser(@PathVariable(value = "id") Long userId,
			@CurrentUser UserPrincipal currentUser) {
		ApiResponseDto apiResponse = userService.deleteUser(userId, currentUser);

		return ResponseEntity.ok(apiResponse);
	}

	@PutMapping("/{id}/giveAdmin")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDto> giveAdmin(@PathVariable(name = "id") Long id) {
		ApiResponseDto apiResponse = userService.giveAdmin(id);

		return ResponseEntity.ok().body(apiResponse);
	}

	@PutMapping("/{id}/removeAdmin")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDto> removeAdmin(@PathVariable(name = "id") Long id) {
		ApiResponseDto apiResponse = userService.removeAdmin(id);

		return ResponseEntity.ok().body(apiResponse);
	}
}
