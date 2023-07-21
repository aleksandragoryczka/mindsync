package com.project.mindsync.service;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Slide;

public interface SlideService {
	
	PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size);
}
