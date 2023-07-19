package com.project.mindsync.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

@Service
public class PresentationServiceImpl implements PresentationService {
	private static final String CREATED_AT = "createdAt";

	@Autowired
	private PresentationRepository presentationRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public PagedResponseDto<Presentation> getUserPresentations(Long id, int page, int size) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
		AppUtils.validatePageNumberAndSIze(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, CREATED_AT);
		Page<Presentation> presentatations = presentationRepository.findByUserId(user.getId(), pageable);

		List<Presentation> content = presentatations.getNumberOfElements() == 0 ? Collections.emptyList()
				: presentatations.getContent();

		return new PagedResponseDto<Presentation>(content, presentatations.getNumber(), presentatations.getSize(),
				presentatations.getTotalElements(), presentatations.getTotalPages(), presentatations.isLast());
	}

	@Override
	public Presentation getPresentation(Long id) {
		return presentationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Presentation", "Id", id));
	}

	@Override
	public ResponseEntity<Presentation> addPresentation(PresentationRequestDto presentationRequest,
			UserPrincipal currentUser) {
		User user = userRepository.getUser(currentUser);

		Presentation presentation = new Presentation();
		presentation.setTitle(presentationRequest.getTitle());
		presentation.setSlides(presentationRequest.getSlides());
		presentation.setUser(user);
		presentation.setCode(generateCode());
		Presentation newPresentation = presentationRepository.save(presentation);
		return ResponseEntity.ok().body(newPresentation);
	}

	@Override
	public Presentation updatePresentation(Long id, PresentationRequestDto updatedPresentationRequest,
			UserPrincipal currentUser) {
		Presentation presentation = presentationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, id));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(presentation.getUser(), currentUser)) {
			presentation.setTitle(updatedPresentationRequest.getTitle());
			presentation.setSlides(updatedPresentationRequest.getSlides());
			// presentation.setShows(updatedPresentationRequest.);
			return presentationRepository.save(presentation);
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to edit that post.");
		throw new UnauthorizedException(apiResponse);
	}

	@Override
	public ApiResponseDto deletePresentation(Long id, UserPrincipal currentUser) {
		Presentation presentation = presentationRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, currentUser));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(presentation.getUser(), currentUser)) {
			presentationRepository.deleteById(id);
			return new ApiResponseDto(true, "Successfully deleted presentation");
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to delete that post.");
		throw new UnauthorizedException(apiResponse);
	}

	private String generateCode() {
		List<String> existingCodes = presentationRepository.findAll().stream().map(Presentation::getCode)
				.collect(Collectors.toList());
		Random random = new Random();

		String codeGenerated;
		boolean codeExists;

		do {
			StringBuilder codeBuilder = new StringBuilder();
			for (int i = 0; i < 6; i++) {
				codeBuilder.append(random.nextInt(10));
			}
			codeGenerated = codeBuilder.toString();
			codeExists = existingCodes.contains(codeGenerated);
		} while (codeExists);

		return codeGenerated;
	}

}
