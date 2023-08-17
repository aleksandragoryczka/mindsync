package com.project.mindsync.service;

import org.springframework.http.ResponseEntity;
import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.UserPrincipal;

public interface PresentationService {
	PagedResponseDto<Presentation> getUserPresentations(UserPrincipal currentUser, int page, int size);

	Presentation getPresentation(Long id);

	ResponseEntity<Presentation> addPresentation(PresentationRequestDto presentationRequest, UserPrincipal currentUser);

	Presentation updatePresentation(Long id, PresentationRequestDto updatedPresentationRequest,
			UserPrincipal currentUser);

	ApiResponseDto deletePresentation(Long id, UserPrincipal currentUser);
}
