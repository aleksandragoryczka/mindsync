package com.project.mindsync.service;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.utils.AppUtils;

@Service
public class PresentationServiceImpl {
	private static final String CREATED_AT = "createdAt";

	@Autowired
	private PresentationRepository presentationRepository;

	@Autowired
	private UserRepository userRepository;

	public PagedResponseDto<Presentation> getUserPresentations(Long id, int page, int size) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
		AppUtils.validatePageNumberAndSIze(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, CREATED_AT);
		Page<Presentation> presentatations = presentationRepository.findByUserId(user.getId(), pageable);

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
