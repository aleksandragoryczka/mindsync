package com.project.mindsync.service;

import javax.validation.Valid;

import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Slide;

public interface SlideService {

	PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size);

	Slide updateSlide(Long id, @Valid SlideRequestDto updatedSlideRequest);
}
