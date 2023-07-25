package com.project.mindsync.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
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

@Service
public class ShowServiceImpl implements ShowService {
	private static final Logger logger = LoggerFactory.getLogger(ShowService.class);

	@Autowired
	private PresentationRepository presentationRepository;

	@Autowired
	private ShowRepository showRepository;

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
		return ResponseEntity.ok().body(new ShowResponseDto(savedShow.getId(), savedShow.getAttendeesNumber()));
	}

}
