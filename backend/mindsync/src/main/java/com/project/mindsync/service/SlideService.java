package com.project.mindsync.service;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.UserPrincipal;

public interface SlideService {

	ResponseEntity<Slide> addSlide(SlideRequestDto slideRequest, Long presentationId);

	PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size);

	Slide updateSlide(Long id, @Valid SlideRequestDto updatedSlideRequest);

	ResponseEntity<ApiResponseDto> deleteSlide(Long id, UserPrincipal currentUser);
}
