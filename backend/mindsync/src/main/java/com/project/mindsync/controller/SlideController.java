package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.SlideService;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
@RestController
@RequestMapping("/api/slide")
public class SlideController {
	@Autowired
	private SlideService slideService;

	@PostMapping("/{id}")
	public ResponseEntity<Slide> addSlide(@PathVariable(name = "id") Long id,
			@Valid @RequestBody SlideRequestDto slideRequest) {
		return slideService.addSlide(slideRequest, id);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Slide> updateSlide(@PathVariable(name = "id") Long id,
			@Valid @RequestBody SlideRequestDto updatedSlideRequest) {
		Slide slide = slideService.updateSlide(id, updatedSlideRequest);

		return ResponseEntity.ok().body(slide);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDto> deleteSlide(@PathVariable(name = "id") Long id,
			@CurrentUser UserPrincipal currentUser) {
		return slideService.deleteSlide(id, currentUser);
	}
}
