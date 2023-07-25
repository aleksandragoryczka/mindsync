package com.project.mindsync.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.exception.AppException;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Screenshot;
import com.project.mindsync.model.Show;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.ShowRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.JwtUtils;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.ShowService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

@Service
public class ShowServiceImpl implements ShowService {
	private static final Logger logger = LoggerFactory.getLogger(ShowService.class);

	@Autowired
	private PresentationRepository presentationRepository;

	@Autowired
	private ShowRepository showRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public ResponseEntity<ShowResponseDto> addShow(ShowRequestDto showRequest, Long presentationId) {
		Presentation presentation = presentationRepository.findById(presentationId).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, presentationId));

		Show show = new Show();
		show.setAttendeesNumber(showRequest.getAttendeesNumber());
		show.setPresentation(presentation);
		try {
			show.setExcelFile(showRequest.getExcelFile().getBytes());
		} catch (IOException e) {
			logger.error("Failed to add excel file: {}", e.getMessage());
		}
		List<Screenshot> screenshots = new ArrayList<>();
		try {
			for (MultipartFile screenshotFile : showRequest.getScreenshots()) {
				Screenshot screenshot = new Screenshot();
				screenshot.setPicture(screenshotFile.getBytes());
				screenshot.setShow(show);
				screenshots.add(screenshot);
			}
		} catch (IOException e) {
			logger.error("Failed to process screenshot file: {}", e.getMessage());
		}
		show.setScreenshots(screenshots);

		Show savedShow = showRepository.save(show);
		return ResponseEntity.ok().body(new ShowResponseDto(savedShow.getId(), savedShow.getAttendeesNumber(),
				savedShow.getCreatedAt().toString()));
	}

	@Override
	public PagedResponseDto<ShowResponseDto> getAllShowsByPresentation(Long presentationId, int page, int size) {
		AppUtils.validatePageNumberAndSIze(page, size);

		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT);

		Page<Show> shows = showRepository.findByPresentationId(presentationId, pageable);

		List<ShowResponseDto> showResponses = new ArrayList<ShowResponseDto>(shows.getContent().size());
		for (Show show : shows.getContent()) {
			showResponses
					.add(new ShowResponseDto(show.getId(), show.getAttendeesNumber(), show.getCreatedAt().toString()));
		}
		return new PagedResponseDto<ShowResponseDto>(showResponses, shows.getNumber(), shows.getSize(),
				shows.getTotalElements(), shows.getTotalPages(), shows.isLast());
	}

	@Override
	public ResponseEntity<ApiResponseDto> deleteShow(Long id, UserPrincipal currentUser) {
		Show show = showRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SHOW, AppConstants.ID, id));
		User user = userRepository.getUser(currentUser);
		if (AppUtils.checkUserIsCurrentUserOrAdmin(show.getPresentation().getUser(), currentUser)) {
			showRepository.delete(show);
			return ResponseEntity.ok().body(new ApiResponseDto(true, "Successfully deleted Show with ID: " + id));
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to delete that show.");
		throw new UnauthorizedException(apiResponse);
	}

}
