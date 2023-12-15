package com.project.mindsync;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import com.project.mindsync.dto.request.ShowRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.ScreenshotResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Quiz;
import com.project.mindsync.model.Screenshot;
import com.project.mindsync.model.Show;
import com.project.mindsync.model.User;
import com.project.mindsync.repository.QuizRepository;
import com.project.mindsync.repository.ShowRepository;
import com.project.mindsync.repository.ScreenshotRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.impl.ShowServiceImpl;
import com.project.mindsync.utils.AppConstants;

class ShowServiceImplTest {

	@Mock
	private QuizRepository quizRepository;

	@Mock
	private ShowRepository showRepository;

	@Mock
	private ScreenshotRepository screenshotRepository;

	@InjectMocks
	private ShowServiceImpl showService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testGetScreenshotsByShowId() {
		Long showId = 1L;
		int page = 0;
		int size = 10;

		List<Screenshot> screenshotsList = new ArrayList<>();
		Screenshot screenshot = new Screenshot();
		screenshot.setId(1L);
		screenshot.setPicture(new byte[] { 1, 2, 3 });
		screenshotsList.add(screenshot);

		Page<Screenshot> screenshotsPage = new PageImpl<>(screenshotsList);

		when(screenshotRepository.findByShowId(showId, PageRequest.of(page, size, Sort.Direction.ASC, AppConstants.ID)))
				.thenReturn(screenshotsPage);

		PagedResponseDto<ScreenshotResponseDto> result = showService.getScreenshotsByShowId(showId, page, size);

		assertNotNull(result);
		assertEquals(1, result.getContent().size());

		ScreenshotResponseDto screenshotResponseDto = result.getContent().get(0);
		assertEquals(screenshot.getId(), screenshotResponseDto.getId());
		assertArrayEquals(screenshot.getPicture(), screenshotResponseDto.getPicture());
	}

	@Test
	void testGetExcelFile() {
		Long showId = 1L;

		byte[] excelFileContent = new byte[] { 1, 2, 3 };

		Show show = new Show();
		show.setId(showId);
		show.setExcelFile(excelFileContent);

		when(showRepository.findById(showId)).thenReturn(Optional.of(show));

		byte[] result = showService.getExcelFile(showId);

		assertNotNull(result);
		assertArrayEquals(excelFileContent, result);
	}

	@Test
	void testAddShow() throws IOException {
		Long quizId = 1L;
		Quiz quiz = new Quiz();
		quiz.setId(quizId);

		ShowRequestDto showRequestDto = new ShowRequestDto();
		showRequestDto.setAttendeesNumber("50");
		showRequestDto.setExcelFile(
				new MockMultipartFile("excelFile", "test.xlsx", "application/vnd.ms-excel", new byte[] { 1, 2, 3 }));
		showRequestDto.setScreenshots(
				List.of(new MockMultipartFile("screenshot", "screenshot.jpg", "image/jpeg", new byte[] { 4, 5, 6 })));

		when(quizRepository.findById(quizId)).thenReturn(Optional.of(quiz));
		when(showRepository.save(any(Show.class))).thenAnswer(invocation -> {
			Show savedShow = invocation.getArgument(0);
			savedShow.setId(1L);
			savedShow.setCreatedAt(java.sql.Timestamp.valueOf("2023-01-01 12:00:00").toInstant());
			return savedShow;
		});

		ResponseEntity<ShowResponseDto> result = showService.addShow(showRequestDto, quizId);

		assertNotNull(result);
		assertEquals(200, result.getStatusCode().value());

		ShowResponseDto showResponseDto = result.getBody();
		assertNotNull(showResponseDto);
		assertEquals(java.sql.Timestamp.valueOf("2023-01-01 12:00:00").toInstant().toString(),
				showResponseDto.getCreatedAt());
		assertEquals(1L, showResponseDto.getId());
	}

	@Test
	void testGetAllShowsByQuiz() {
		Long quizId = 1L;
		int page = 0;
		int size = 10;

		List<Show> showsList = new ArrayList<>();
		Show show = new Show();
		show.setId(1L);
		show.setAttendeesNumber("50");
		show.setCreatedAt(java.sql.Timestamp.valueOf("2023-01-01 12:00:00").toInstant());
		showsList.add(show);

		Page<Show> showsPage = new PageImpl<>(showsList);

		when(showRepository.findByQuizId(quizId,
				PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT))).thenReturn(showsPage);

		PagedResponseDto<ShowResponseDto> result = showService.getAllShowsByQuiz(quizId, page, size);

		assertNotNull(result);
		assertEquals(1, result.getContent().size());

		ShowResponseDto showResponseDto = result.getContent().get(0);
		assertEquals(show.getId(), showResponseDto.getId());
		assertEquals(show.getAttendeesNumber(), showResponseDto.getAttendeesNumber());
		assertEquals(show.getCreatedAt().toString(), showResponseDto.getCreatedAt());
	}

	@Test
	void testDeleteShow() {
		Long showId = 1L;
		UserPrincipal currentUser = new UserPrincipal(
				new User("user_name", "user_surname", "user_username", "user@example.com", "password"));

		Quiz quiz = new Quiz();
		quiz.setUser(currentUser.getUser());

		Show show = new Show();
		show.setId(showId);
		show.setQuiz(quiz);
		show.setCreatedAt(java.sql.Timestamp.valueOf("2023-01-01 12:00:00").toInstant());

		when(showRepository.findById(showId)).thenReturn(Optional.of(show));

		ArgumentCaptor<Show> showCaptor = ArgumentCaptor.forClass(Show.class);

		ResponseEntity<ApiResponseDto> result = showService.deleteShow(showId, currentUser);

		verify(showRepository).delete(showCaptor.capture());

		Show capturedShow = showCaptor.getValue();
		assertEquals(show.getId(), capturedShow.getId());
		assertEquals(show.getQuiz(), capturedShow.getQuiz());

		assertNotNull(result);
		assertEquals(200, result.getStatusCode().value());

		ApiResponseDto apiResponseDto = result.getBody();
		assertNotNull(apiResponseDto);
		assertTrue(apiResponseDto.isSuccess());
		assertEquals("Successfully deleted Show with ID: " + showId, apiResponseDto.getMessage());
	}

	@Test
	void testMapToScreenshotResponseDto() {
		Screenshot screenshot = new Screenshot();
		screenshot.setId(1L);
		screenshot.setPicture(new byte[] { 1, 2, 3 });

		ScreenshotResponseDto result = showService.mapToScreenshotResponseDto(screenshot);

		assertNotNull(result);
		assertEquals(screenshot.getId(), result.getId());
		assertArrayEquals(screenshot.getPicture(), result.getPicture());
	}
}
