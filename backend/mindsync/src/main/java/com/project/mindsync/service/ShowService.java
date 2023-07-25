package com.project.mindsync.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ShowResponseDto;

public interface ShowService {
	ResponseEntity<ShowResponseDto> addShow(ShowRequestDto showRequest, Long presentationId);
}
