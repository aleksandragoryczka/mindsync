package com.project.mindsync.service;

import org.springframework.http.ResponseEntity;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.UserPrincipal;

public interface PresentationService {
	PagedResponseDto<Presentation> getUserPresentations(Long id, int page, int size);

	ResponseEntity<Presentation> addPresentation(PresentationRequestDto presentationRequest, UserPrincipal currentUser);

}
