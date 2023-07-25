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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.service.ShowService;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;

@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationService presentationService;

	@Autowired
	private SlideService slideService;

	@Autowired
	private ShowService showService;

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
			@CurrentUser UserPrincipal currentUser) {
		ApiResponseDto apiResponse = presentationService.deletePresentation(id, currentUser);
		return ResponseEntity.ok().body(apiResponse);
	}

	@GetMapping("/{id}/slides")
	public ResponseEntity<PagedResponseDto<Slide>> getAllSlidesByPresentation(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<Slide> slides = slideService.getAllSlidesByPresentation(id, page, size);
		return ResponseEntity.ok().body(slides);
	}

	@GetMapping("{id}/shows")
	public ResponseEntity<PagedResponseDto<ShowResponseDto>> getAllShowsByPresentation(
			@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<ShowResponseDto> shows = showService.getAllShowsByPresentation(id, page, size);
		return ResponseEntity.ok().body(shows);
	}
}
