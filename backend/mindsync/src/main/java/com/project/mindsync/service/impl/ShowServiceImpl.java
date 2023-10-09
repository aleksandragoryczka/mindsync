package com.project.mindsync.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
import com.project.mindsync.dto.response.ScreenshotResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.ShowWithScreenshotsResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Screenshot;
import com.project.mindsync.model.Show;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.ScreenshotRepository;
import com.project.mindsync.repository.ShowRepository;
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
	private ScreenshotRepository screenshotRepository;

	@Override
	public PagedResponseDto<ShowWithScreenshotsResponseDto> getShowWithScreenshots(Long showId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);

		Show show = showRepository.findById(showId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SHOW, AppConstants.ID, showId));

		Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, AppConstants.ID);
		Page<Screenshot> screenshots = screenshotRepository.findByShowId(showId, pageable);
		List<ScreenshotResponseDto> screenshotResponses = screenshots.getContent().stream()
				.map(this::mapToScreenshotResponseDto).collect(Collectors.toList());
		ShowWithScreenshotsResponseDto showWithScreenshotsResponse = new ShowWithScreenshotsResponseDto();
		showWithScreenshotsResponse.setAttendeesNumber(show.getAttendeesNumber());
		showWithScreenshotsResponse.setScreenshots(screenshotResponses);
		showWithScreenshotsResponse.setCreatedAt(show.getCreatedAt().toString());
		showWithScreenshotsResponse.setId(showId);

		return new PagedResponseDto<ShowWithScreenshotsResponseDto>(List.of(showWithScreenshotsResponse),
				screenshots.getNumber(), screenshots.getSize(), screenshots.getTotalElements(),
				screenshots.getTotalPages(), screenshots.isLast());
	}

	@Override
	public PagedResponseDto<ScreenshotResponseDto> getScreenshotsByShowId(Long showId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, AppConstants.ID);
		Page<Screenshot> screenshots = screenshotRepository.findByShowId(showId, pageable);
		List<ScreenshotResponseDto> screenshotResponses = screenshots.getContent().stream()
				.map(this::mapToScreenshotResponseDto).collect(Collectors.toList());

		return new PagedResponseDto<ScreenshotResponseDto>(screenshotResponses, screenshots.getNumber(),
				screenshots.getSize(), screenshots.getTotalElements(), screenshots.getTotalPages(),
				screenshots.isLast());
	}

	@Override
	public byte[] getExcelFile(Long showId) {
		Show show = showRepository.findById(showId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SHOW, AppConstants.ID, showId));
		return show.getExcelFile();
	}

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
		List<Screenshot> screenshots = new ArrayList<Screenshot>();
		/*try {
			for (MultipartFile screenshotFile : showRequest.getScreenshots()) {
				Screenshot screenshot = new Screenshot();
				screenshot.setPicture(screenshotFile.getBytes());
				screenshot.setShow(show);
				screenshots.add(screenshot);
			}
		} catch (IOException e) {
			logger.error("Failed to process screenshot file: {}", e.getMessage());
		}
		show.setScreenshots(screenshots);*/

		Show savedShow = showRepository.save(show);
		return ResponseEntity.ok().body(new ShowResponseDto(savedShow.getId(), savedShow.getAttendeesNumber(),
				savedShow.getCreatedAt().toString()));
	}

	@Override
	public PagedResponseDto<ShowResponseDto> getAllShowsByPresentation(Long presentationId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);

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
	public ResponseEntity<ApiResponseDto> deleteShow(Long showId, UserPrincipal currentUser) {
		Show show = showRepository.findById(showId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SHOW, AppConstants.ID, showId));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(show.getPresentation().getUser(), currentUser)) {
			showRepository.delete(show);
			return ResponseEntity.ok().body(new ApiResponseDto(true, "Successfully deleted Show with ID: " + showId));
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to delete that show.");
		throw new UnauthorizedException(apiResponse);
	}

	private ScreenshotResponseDto mapToScreenshotResponseDto(Screenshot screenshot) {
		ScreenshotResponseDto screenshotResponse = new ScreenshotResponseDto();
		screenshotResponse.setId(screenshot.getId());
		screenshotResponse.setPicture(screenshot.getPicture());
		// TODO: is it necessary? - byloby gdybym np. po kliknieciu na maly screenshot
		// chciala go powiekszac - czy nie da sie tego dodac na forntendzie?
		//String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/screenshots/")
		//		.path(screenshotResponse.getId().toString()).toUriString();
		//screenshotResponse.setUrl(fileDownloadUri);
		return screenshotResponse;
	}
}
