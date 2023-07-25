package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.ShowWithScreenshotsResponseDto;
import com.project.mindsync.model.Show;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.ShowService;
import com.project.mindsync.utils.AppConstants;

@RestController
@RequestMapping("/api/show")
public class ShowController {
	@Autowired
	private ShowService showService;

	@GetMapping("/{id}")
	public ResponseEntity<PagedResponseDto<ShowWithScreenshotsResponseDto>> getShowWithScreenshots(
			@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<ShowWithScreenshotsResponseDto> response = showService.getShowWithScreenshots(id, page, size);
		return ResponseEntity.ok().body(response);
	}

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ShowResponseDto> addShow(
			@RequestParam(name = "presentationId", required = true) Long presentationId,
			@ModelAttribute @Valid ShowRequestDto showRequest) {
		return showService.addShow(showRequest, presentationId);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDto> deleteShow(@PathVariable(name = "id") Long id,
			@CurrentUser UserPrincipal currentUser) {
		return showService.deleteShow(id, currentUser);
	}
}
