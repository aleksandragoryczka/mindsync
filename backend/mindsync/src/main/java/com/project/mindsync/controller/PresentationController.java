package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.impl.PresentationServiceImpl;
import com.project.mindsync.service.impl.SlideServiceImpl;
import com.project.mindsync.utils.AppUtils;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationServiceImpl presentationService;

	@Autowired
	private SlideServiceImpl slideService;

	@GetMapping("/{id}")
	public ResponseEntity<Presentation> getPresentation(@PathVariable(name = "id") Long id) {
		Presentation presentation = presentationService.getPresentation(id);

		return ResponseEntity.ok().body(presentation);
	}

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Presentation> addPresentation(@Valid @RequestBody PresentationRequestDto presentationRequest,
			@CurrentUser UserPrincipal currentUser) {
		return presentationService.addPresentation(presentationRequest, currentUser);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<Presentation> updatePresentaion(@PathVariable(name = "id") Long id,
			@Valid @RequestBody PresentationRequestDto updatedPresentationRequest,
			@CurrentUser UserPrincipal currentUser) {
		Presentation presentation = presentationService.updatePresentation(id, updatedPresentationRequest, currentUser);

		return ResponseEntity.ok().body(presentation);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDto> deletePresentation(@PathVariable(name = "id") Long id,
			@CurrentUser UserPrincipal curremtUser) {
		ApiResponseDto apiResponse = presentationService.deletePresentation(id, curremtUser);
		return ResponseEntity.ok().body(apiResponse);
	}
}
