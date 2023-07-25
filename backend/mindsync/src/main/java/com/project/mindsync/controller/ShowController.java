package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.service.ShowService;

@RestController
@RequestMapping("/api/show")
public class ShowController {
	@Autowired
	private ShowService showService;

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ShowResponseDto> addShow(@ModelAttribute @Valid ShowRequestDto showRequest,
			@RequestParam(name = "presentationId", required = true) Long presentationId) {
		return showService.addShow(showRequest, presentationId);
	}
}
