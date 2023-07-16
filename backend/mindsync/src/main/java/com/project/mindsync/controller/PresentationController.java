package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.response.PresentationResponseDto;
import com.project.mindsync.service.PresentationService;

@RestController
@RequestMapping("/api/presentations")
public class PresentationController {
	//@Autowired
	//private PresentationService presentationService;

	//@PostMapping
	//@PreAuthorize("hasRole('USER')")
	//public ResponseEntity<PresentationResponseDto> addPresentation(@Valid @RequestBody presentation)
}
