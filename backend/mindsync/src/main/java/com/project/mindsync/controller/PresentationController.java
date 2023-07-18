package com.project.mindsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationServiceImpl;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationServiceImpl presentationService;

	@Autowired
	private SlideService slideService;



	// @PostMapping
	// @PreAuthorize("hasRole('USER')")
	// public ResponseEntity<PresentationResponseDto> addPresentation(@Valid
	// @RequestBody presentation)
}
