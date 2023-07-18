package com.project.mindsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.service.impl.PresentationServiceImpl;
import com.project.mindsync.service.impl.SlideServiceImpl;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationServiceImpl presentationService;

	@Autowired
	private SlideServiceImpl slideService;



	// @PostMapping
	// @PreAuthorize("hasRole('USER')")
	// public ResponseEntity<PresentationResponseDto> addPresentation(@Valid
	// @RequestBody presentation)
}
