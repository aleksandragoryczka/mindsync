package com.project.mindsync.service;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Presentation;

public interface PresentationService {
	public PagedResponseDto<Presentation> getUserPresentations(Long id, int page, int size);

}
