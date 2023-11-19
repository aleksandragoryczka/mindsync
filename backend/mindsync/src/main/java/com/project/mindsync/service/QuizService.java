package com.project.mindsync.service;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import com.project.mindsync.dto.request.QuizRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.QuizWithShowsResponseDto;
import com.project.mindsync.dto.response.QuizWithSlidesResponseDto;
import com.project.mindsync.dto.response.UserWithQuizzesCountResponseDto;
import com.project.mindsync.model.Quiz;
import com.project.mindsync.security.UserPrincipal;

public interface QuizService {
	PagedResponseDto<Quiz> getUserQuizzes(UserPrincipal currentUser, int page, int size);

	List<UserWithQuizzesCountResponseDto> getUsersWithQuizzesCount();

	Quiz getQuiz(Long id);

	ResponseEntity<Quiz> addQuiz(QuizRequestDto quizRequest, UserPrincipal currentUser) throws IOException;

	Quiz updateQuiz(Long id, QuizRequestDto updatedQuizRequest, UserPrincipal currentUser) throws IOException;

	ApiResponseDto deleteQuiz(Long id, UserPrincipal currentUser);

	QuizWithShowsResponseDto getQuizWithShows(Long quizId, int page, int size);

	QuizWithSlidesResponseDto getQuizWithSlides(Long quizId);

	Long getQuizByVerificationCode(String verificationCode);
}
