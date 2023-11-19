package com.project.mindsync.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mindsync.dto.request.QuizRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.QuizWithShowsResponseDto;
import com.project.mindsync.dto.response.QuizWithSlidesResponseDto;
import com.project.mindsync.model.Quiz;
import com.project.mindsync.model.Slide;
import com.project.mindsync.security.CurrentUser;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.QuizService;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
@RestController
@RequestMapping("/api/quiz")
public class QuizController {
	@Autowired
	private QuizService quizService;

	@Autowired
	private SlideService slideService;

	@GetMapping("/{id}")
	public ResponseEntity<Quiz> getQuiz(@PathVariable(name = "id") Long id) {
		Quiz quiz = quizService.getQuiz(id);

		return ResponseEntity.ok().body(quiz);
	}

	@GetMapping("")
	public ResponseEntity<Long> getQuizByVerificationCode(
			@RequestParam(name = "verificationCode", required = true) String verificationCode) {
		Long quizId = quizService.getQuizByVerificationCode(verificationCode);
		return ResponseEntity.ok().body(quizId);
	}

	@PostMapping("")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Quiz> addQuiz(@ModelAttribute @Valid QuizRequestDto quizRequest,
			@CurrentUser UserPrincipal currentUser) throws IOException {
		return quizService.addQuiz(quizRequest, currentUser);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<Quiz> updateQuiz(@PathVariable(name = "id") Long id,
			@Valid @RequestBody QuizRequestDto updatedQuizRequest, @CurrentUser UserPrincipal currentUser)
			throws IOException {
		Quiz quiz = quizService.updateQuiz(id, updatedQuizRequest, currentUser);

		return ResponseEntity.ok().body(quiz);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDto> deleteQuiz(@PathVariable(name = "id") Long id,
			@CurrentUser UserPrincipal currentUser) {
		ApiResponseDto apiResponse = quizService.deleteQuiz(id, currentUser);
		return ResponseEntity.ok().body(apiResponse);
	}

	@GetMapping("/{id}/allslides")
	public ResponseEntity<PagedResponseDto<Slide>> getAllSlidesByQuiz(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		PagedResponseDto<Slide> slides = slideService.getAllSlidesByQuiz(id, page, size);
		return ResponseEntity.ok().body(slides);
	}

	@GetMapping("/{id}/slides")
	public ResponseEntity<QuizWithSlidesResponseDto> getQuizWithSlides(@PathVariable(name = "id") Long id) {
		QuizWithSlidesResponseDto response = quizService.getQuizWithSlides(id);
		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/{id}/shows")
	public ResponseEntity<QuizWithShowsResponseDto> getQuizWithShows(@PathVariable(name = "id") Long id,
			@RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		QuizWithShowsResponseDto response = quizService.getQuizWithShows(id, page, size);
		return ResponseEntity.ok().body(response);
	}
}
