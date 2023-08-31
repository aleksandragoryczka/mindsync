package com.project.mindsync.service;

import javax.validation.Valid;

import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.SlideResponseDto;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.UserPrincipal;

public interface SlideService {

	PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size);

	Slide updateSlide(Long id, @Valid SlideRequestDto updatedSlideRequest);
}
