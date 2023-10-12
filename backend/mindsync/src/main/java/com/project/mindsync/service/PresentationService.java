package com.project.mindsync.service;

import java.io.IOException;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.PresentationWithShowsResponseDto;
import com.project.mindsync.dto.response.PresentationWithSlidesResponseDto;
import com.project.mindsync.dto.response.UserWithPresentationsCountResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.security.UserPrincipal;

public interface PresentationService {
	PagedResponseDto<Presentation> getUserPresentations(UserPrincipal currentUser, int page, int size);

	List<UserWithPresentationsCountResponseDto> getUsersWithPresentationsCount();

	Presentation getPresentation(Long id);

	ResponseEntity<Presentation> addPresentation(PresentationRequestDto presentationRequest, UserPrincipal currentUser)
			throws IOException;

	Presentation updatePresentation(Long id, PresentationRequestDto updatedPresentationRequest,
			UserPrincipal currentUser) throws IOException;

	ApiResponseDto deletePresentation(Long id, UserPrincipal currentUser);

	PresentationWithShowsResponseDto getPresentationWithShows(Long presentationId, int page, int size);

	PresentationWithSlidesResponseDto getPresentationWithSlides(Long presentationId);

	Long getPresentationByVerificationCode(String verificationCode);
}
