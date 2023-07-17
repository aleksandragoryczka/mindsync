package com.project.mindsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.PresentationResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationService presentationService;

	@Autowired
	private SlideService slideService;

	@GetMapping("")
	public ResponseEntity<PagedResponseDto<Presentation>> getAllPresentationsForUser(
			@CurrentUser UserPrincipal currentUser,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

				
		PagedResponseDto<Presentation> response = presentationService.getAllSlidesForUser(currentUser, page, size);
		return ResponseEntity.ok().body(response);
	}

	// @PostMapping
	// @PreAuthorize("hasRole('USER')")
	// public ResponseEntity<PresentationResponseDto> addPresentation(@Valid
	// @RequestBody presentation)
}
