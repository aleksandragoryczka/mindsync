package com.project.mindsync.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ScreenshotResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.ShowWithScreenshotsResponseDto;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.ShowService;
import com.project.mindsync.utils.AppConstants;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
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

	@GetMapping("/{id}/screenshots")
	public ResponseEntity<PagedResponseDto<ScreenshotResponseDto>> getScreenshotsByShowId(
			@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<ScreenshotResponseDto> response = showService.getScreenshotsByShowId(id, page, size);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/{id}/excel")
	public ResponseEntity<byte[]> getExcelFile(@PathVariable(name = "id") Long id) {
		byte[] excelContent = showService.getExcelFile(id);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
				.contentType(MediaType.parseMediaType("multipart/form-data")).body(excelContent);
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
