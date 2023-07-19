package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.impl.PresentationServiceImpl;
import com.project.mindsync.service.impl.SlideServiceImpl;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationServiceImpl presentationService;

	@Autowired
	private SlideServiceImpl slideService;

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Presentation> addPresentation(@Valid @RequestBody PresentationRequestDto presentationRequest,
			@CurrentUser UserPrincipal currentUser) {
		return presentationService.addPresentation(presentationRequest, currentUser);
	}
}
