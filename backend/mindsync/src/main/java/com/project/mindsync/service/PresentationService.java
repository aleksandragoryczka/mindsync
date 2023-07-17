package com.project.mindsync.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.PresentationResponseDto;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.utils.AppUtils;

import org.modelmapper.ModelMapper;

@Service
public class PresentationService {
	private static final String CREATED_AT = "createdAt";

	@Autowired
	private PresentationRepository presentationRepository;

	public PagedResponseDto<Presentation> getAllSlidesForUser(UserPrincipal currentUser, int page, int size) {

		AppUtils.validatePageNumberAndSIze(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, CREATED_AT); // TODO: sortowanie??
		Page<Presentation> presentatations = presentationRepository.findByUserId(currentUser.getId(), pageable);

		List<Presentation> content = presentatations.getNumberOfElements() == 0 ? Collections.emptyList()
				: presentatations.getContent();

		return new PagedResponseDto<Presentation>(content, presentatations.getNumber(), presentatations.getSize(),
				presentatations.getTotalElements(), presentatations.getTotalPages(), presentatations.isLast());
		/*
		 * if (presentatations.getNumberOfElements() == 0) { return new
		 * PagedResponseDto<PresentationResponseDto>(Collections.emptyList(),
		 * presentatations.getNumber(), presentatations.getSize(),
		 * presentatations.getTotalElements(), presentatations.getTotalPages(),
		 * presentatations.isLast()); } List<PresentationResponseDto>
		 * presentationResponses = Arrays
		 * .asList(modelMapper.map(presentatations.getContent(),
		 * PresentationResponseDto[].class)); return new
		 * PagedResponseDto<PresentationResponseDto>(presentationResponses,
		 * presentatations.getNumber(), presentatations.getSize(),
		 * presentatations.getTotalElements(), presentatations.getTotalPages(),
		 * presentatations.isLast());
		 */
	}

}
