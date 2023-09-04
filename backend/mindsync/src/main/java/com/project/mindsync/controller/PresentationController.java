package com.project.mindsync.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
import com.project.mindsync.dto.response.PresentationWithShowsResponseDto;
import com.project.mindsync.dto.response.PresentationWithSlidesResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
@RestController
@RequestMapping("/api/presentation")
public class PresentationController {
	@Autowired
	private PresentationService presentationService;

	@Autowired
	private SlideService slideService;

	@GetMapping("/{id}")
	public ResponseEntity<Presentation> getPresentation(@PathVariable(name = "id") Long id) {
		Presentation presentation = presentationService.getPresentation(id);

		return ResponseEntity.ok().body(presentation);
	}

	@GetMapping("")
	public ResponseEntity<Long> getPresentationByVerificationCode(
			@RequestParam(name = "verificationCode", required = true) String verificationCode) {
		Long presentationId = presentationService.getPresentationByVerificationCode(verificationCode);
		return ResponseEntity.ok().body(presentationId);
	}

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Presentation> addPresentation(
			@ModelAttribute @Valid PresentationRequestDto presentationRequest, @CurrentUser UserPrincipal currentUser)
			throws IOException {
		System.out.println(presentationRequest.getTitle());
		return presentationService.addPresentation(presentationRequest, currentUser);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<Presentation> updatePresentation(@PathVariable(name = "id") Long id,
			@Valid @RequestBody PresentationRequestDto updatedPresentationRequest,
			@CurrentUser UserPrincipal currentUser) throws IOException {
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

	@GetMapping("/{id}/allslides")
	public ResponseEntity<PagedResponseDto<Slide>> getAllSlidesByPresentation(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<Slide> slides = slideService.getAllSlidesByPresentation(id, page, size);
		return ResponseEntity.ok().body(slides);
	}

	@GetMapping("/{id}/slides")
	public ResponseEntity<PresentationWithSlidesResponseDto> getPresentationWithSlides(
			@PathVariable(name = "id") Long id) {
		PresentationWithSlidesResponseDto response = presentationService.getPresentationWithSlides(id);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/{id}/shows")
	public ResponseEntity<PresentationWithShowsResponseDto> getPresentationWithShows(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PresentationWithShowsResponseDto response = presentationService.getPresentationWithShows(id, page, size);
		return ResponseEntity.ok().body(response);
	}
}
