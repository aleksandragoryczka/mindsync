package com.project.mindsync.service;

import org.springframework.http.ResponseEntity;
import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.ShowWithScreenshotsResponseDto;
import com.project.mindsync.security.UserPrincipal;

public interface ShowService {
	ResponseEntity<ShowResponseDto> addShow(ShowRequestDto showRequest, Long presentationId);

	byte[] getExcelFile(Long showId);

	PagedResponseDto<ShowResponseDto> getAllShowsByPresentation(Long presentationId, int page, int size);

	ResponseEntity<ApiResponseDto> deleteShow(Long showId, UserPrincipal currentUser);

	PagedResponseDto<ShowWithScreenshotsResponseDto> getShowWithScreenshots(Long showId, int page, int size);
}
