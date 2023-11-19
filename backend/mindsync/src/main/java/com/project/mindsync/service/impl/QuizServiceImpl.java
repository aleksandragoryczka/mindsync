package com.project.mindsync.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.QuizRequestDto;
import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.QuizWithShowsResponseDto;
import com.project.mindsync.dto.response.QuizWithSlidesResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.SlideResponseDto;
import com.project.mindsync.dto.response.UserWithQuizzesCountResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Option;
import com.project.mindsync.model.Quiz;
import com.project.mindsync.model.Show;
import com.project.mindsync.model.Slide;
import com.project.mindsync.model.SlideType;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.SlideTypeName;
import com.project.mindsync.repository.OptionRepository;
import com.project.mindsync.repository.QuizRepository;
import com.project.mindsync.repository.ShowRepository;
import com.project.mindsync.repository.SlideRepository;
import com.project.mindsync.repository.SlideTypeRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.QuizService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

import jakarta.transaction.Transactional;

@Service
public class QuizServiceImpl implements QuizService {

	@Autowired
	private QuizRepository quizRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SlideTypeRepository slideTypeRepository;

	@Autowired
	private SlideRepository slideRepository;

	@Autowired
	private OptionRepository optionRepository;

	@Autowired
	ShowRepository showRepository;

	@Override
	public QuizWithShowsResponseDto getQuizWithShows(Long quizId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Quiz quiz = quizRepository.findById(quizId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, quizId));
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, AppConstants.ID);
		Page<Show> shows = showRepository.findByQuizId(quizId, pageable);
		List<ShowResponseDto> showsResponses = shows.getContent().stream().map(this::mapToShowResponseDto)
				.collect(Collectors.toList());
		PagedResponseDto<ShowResponseDto> pagedShowsResponse = new PagedResponseDto<ShowResponseDto>(showsResponses,
				shows.getNumber(), shows.getSize(), shows.getTotalElements(), shows.getTotalPages(), shows.isLast());
		QuizWithShowsResponseDto quizWithShowsResponse = new QuizWithShowsResponseDto();
		quizWithShowsResponse.setId(quizId);
		quizWithShowsResponse.setTitle(quiz.getTitle());
		quizWithShowsResponse.setShows(pagedShowsResponse);
		return quizWithShowsResponse;
	}

	@Override
	public QuizWithSlidesResponseDto getQuizWithSlides(Long quizId) {
		Quiz quiz = quizRepository.findById(quizId)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, quizId));
		return this.mapQuizToQuizWithSlides(quizId, quiz);
	}

	@Override
	public PagedResponseDto<Quiz> getUserQuizzes(UserPrincipal currentUser, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT);
		Page<Quiz> presentatations = quizRepository.findByUserId(currentUser.getId(), pageable);

		List<Quiz> content = presentatations.getNumberOfElements() == 0 ? Collections.emptyList()
				: presentatations.getContent();

		return new PagedResponseDto<Quiz>(content, presentatations.getNumber(), presentatations.getSize(),
				presentatations.getTotalElements(), presentatations.getTotalPages(), presentatations.isLast());
	}

	@Override
	public List<UserWithQuizzesCountResponseDto> getUsersWithQuizzesCount() {
		List<User> users = userRepository.findAll();
		List<UserWithQuizzesCountResponseDto> usersQuizzesCounts = new ArrayList<UserWithQuizzesCountResponseDto>();
		for (User user : users) {
			Long quizzesCount = quizRepository.countByUser(user);
			usersQuizzesCounts.add(new UserWithQuizzesCountResponseDto(user, quizzesCount));
		}
		return usersQuizzesCounts;
	}

	@Override
	public Quiz getQuiz(Long id) {
		return quizRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, id));
	}

	@Override
	public ResponseEntity<Quiz> addQuiz(QuizRequestDto quizRequest, UserPrincipal currentUser) throws IOException {
		User user = userRepository.getUser(currentUser);

		Quiz quiz = new Quiz();
		quiz.setTitle(quizRequest.getTitle());
		quiz.setPicture(quizRequest.getPicture().getBytes());

		quiz.setUser(user);
		quiz.setCode(generateCode());
		Quiz savedQuiz = quizRepository.save(quiz);
		return ResponseEntity.ok().body(savedQuiz);
	}

	@Override
	@Transactional
	public Quiz updateQuiz(Long id, QuizRequestDto updatedQuizRequest, UserPrincipal currentUser) throws IOException {
		Quiz quiz = quizRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, id));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(quiz.getUser(), currentUser)) {
			quiz.setTitle(updatedQuizRequest.getTitle());
			quiz.setPicture(updatedQuizRequest.getPicture().getBytes());
			List<Slide> existingSlides = quiz.getSlides();
			List<SlideRequestDto> updatedSlides = updatedQuizRequest.getSlides();

			for (SlideRequestDto updatedSlide : updatedSlides) {
				if (updatedSlide.getId() != null) {
					Slide existingSlide = existingSlides.stream()
							.filter(slide -> slide.getId().equals(updatedSlide.getId())).findFirst()
							.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SLIDE, AppConstants.ID,
									updatedSlide.getId()));
					existingSlide = updateSlide(existingSlide, updatedSlide);
				} else {
					Slide newSlide = createSlide(updatedSlide, quiz);
					existingSlides.add(newSlide);
				}
			}

			existingSlides = deleteSlides(existingSlides, existingSlides);

			quiz.setSlides(existingSlides);

			Quiz updatedQuiz = quizRepository.save(quiz);
			return updatedQuiz;
		}
		throw new UnauthorizedException(new ApiResponseDto(false, "You do not have permissions to edit that post."));
	}

	@Override
	public ApiResponseDto deleteQuiz(Long id, UserPrincipal currentUser) {
		Quiz quiz = quizRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, currentUser));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(quiz.getUser(), currentUser)) {
			quizRepository.deleteById(id);
			return new ApiResponseDto(true, "Successfully deleted quiz");
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to delete that quiz.");
		throw new UnauthorizedException(apiResponse);
	}

	@Override
	public Long getQuizByVerificationCode(String verificationCode) {
		Optional<Quiz> optionalQuiz = this.quizRepository.findByCode(verificationCode);
		if (optionalQuiz.isPresent()) {
			Quiz quiz = optionalQuiz.get();
			return quiz.getId();
		}
		return null;
	}

	private QuizWithSlidesResponseDto mapQuizToQuizWithSlides(Long quizId, Quiz quiz) {
		List<Slide> slides = slideRepository.findByQuizId(quizId);
		List<SlideResponseDto> slidesResponses = slides.stream().map(this::mapToSlideResponseDto)
				.sorted(Comparator.comparingLong(SlideResponseDto::getId)).collect(Collectors.toList());
		QuizWithSlidesResponseDto quizWithSlidesResponse = new QuizWithSlidesResponseDto();
		quizWithSlidesResponse.setId(quizId);
		quizWithSlidesResponse.setCode(quiz.getCode());
		quizWithSlidesResponse.setCreatedAt(quiz.getCreatedAt().toString());
		quizWithSlidesResponse.setTitle(quiz.getTitle());
		quizWithSlidesResponse.setSlides(slidesResponses);
		return quizWithSlidesResponse;
	}

	private Slide updateSlide(Slide existingSlide, SlideRequestDto updatedSlide) {
		existingSlide.setTitle(updatedSlide.getTitle());
		existingSlide.setDisplayTime(updatedSlide.getDisplayTime());
		existingSlide.setHeaderColor(updatedSlide.getHeaderColor());
		existingSlide.setTitleColor(updatedSlide.getTitleColor());
		SlideType slideType = slideTypeRepository.findByName(SlideTypeName.valueOf(updatedSlide.getType()));
		existingSlide.setType(slideType);
		if (AppConstants.OPTIONS_SLIDES_TYPES.contains(slideType.getName())) {
			List<Option> existingOptions = existingSlide.getOptions();
			List<Option> updatedOptions = updatedSlide.getOptions();

			// update existing option
			for (Option updatedOption : updatedOptions) {
				for (Option existingOption : existingOptions) {
					if (existingOption.getId() != null && existingOption.getId().equals(updatedOption.getId())) {
						existingOption.setOption(updatedOption.getOption());
						break;
					}
				}
			}

			// delete option if not present in updatedOptions list
			existingOptions = deleteOptions(existingOptions, updatedOptions);

			// add new option if is not present in current existingOptions list
			existingOptions = updateOptions(existingOptions, updatedOptions, existingSlide);

			existingSlide.setOptions(existingOptions);
		}
		return existingSlide;
	}

	private List<Option> deleteOptions(List<Option> existingOptions, List<Option> updatedOptions) {
		for (Option existingOption : existingOptions) {
			if (existingOption.getId() != null
					&& updatedOptions.stream().noneMatch(updatedOption -> updatedOption.getId() != null
							&& updatedOption.getId().equals(existingOption.getId()))) {
				existingOption.setSlide(null);
				optionRepository.delete(existingOption);
			}
		}
		existingOptions.removeIf(existingOption -> existingOption.getId() != null
				&& updatedOptions.stream().noneMatch(updatedOption -> updatedOption.getId() != null
						&& updatedOption.getId().equals(existingOption.getId())));
		return existingOptions;
	}

	private List<Option> updateOptions(List<Option> existingOptions, List<Option> updatedOptions, Slide existingSlide) {
		for (Option updatedOption : updatedOptions) {
			if (updatedOption.getId() == null) {
				Option newOption = new Option();
				newOption.setOption(updatedOption.getOption());
				newOption.setSlide(existingSlide);
				existingOptions.add(newOption);
				optionRepository.save(newOption);
			}
		}
		return existingOptions;
	}

	private Slide createSlide(SlideRequestDto updatedSlide, Quiz quiz) {
		SlideType slideType = slideTypeRepository.findByName(SlideTypeName.valueOf(updatedSlide.getType()));
		Slide newSlide = new Slide();
		newSlide.setTitle(updatedSlide.getTitle());
		newSlide.setType(slideType);
		newSlide.setQuiz(quiz);
		newSlide.setDisplayTime(updatedSlide.getDisplayTime());
		newSlide.setHeaderColor(updatedSlide.getHeaderColor());
		newSlide.setTitleColor(updatedSlide.getTitleColor());
		if (AppConstants.OPTIONS_SLIDES_TYPES.contains(slideType.getName())) {
			List<Option> options = new ArrayList<Option>();
			for (Option updatedOption : updatedSlide.getOptions()) {
				Option newOption = new Option();
				newOption.setOption(updatedOption.getOption());
				newOption.setSlide(newSlide);
				options.add(newOption);
			}
			newSlide.setOptions(options);
		}
		return newSlide;
	}

	private List<Slide> deleteSlides(List<Slide> existingSlides, List<Slide> updatedSlides) {
		for (Slide existingSlide : existingSlides) {
			if (existingSlide.getId() != null
					&& updatedSlides.stream().noneMatch(updatedSlide -> updatedSlide.getId() != null
							&& updatedSlide.getId().equals(existingSlide.getId()))) {
				existingSlide.setQuiz(null);
				slideRepository.delete(existingSlide);
			}
		}

		existingSlides.removeIf(existingSlide -> existingSlide.getId() != null && updatedSlides.stream().noneMatch(
				updatedSlide -> updatedSlide.getId() != null && updatedSlide.getId().equals(existingSlide.getId())));

		return existingSlides;
	}

	private String generateCode() {
		List<String> existingCodes = quizRepository.findAll().stream().map(Quiz::getCode).collect(Collectors.toList());
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

	private ShowResponseDto mapToShowResponseDto(Show show) {
		ShowResponseDto showResponse = new ShowResponseDto();
		showResponse.setId(show.getId());
		showResponse.setAttendeesNumber(show.getAttendeesNumber());
		showResponse.setCreatedAt(show.getCreatedAt().toString());
		return showResponse;
	}

	private SlideResponseDto mapToSlideResponseDto(Slide slide) {
		SlideResponseDto slideReponse = new SlideResponseDto();
		slideReponse.setId(slide.getId());
		slideReponse.setTitle(slide.getTitle());
		slideReponse.setType(slide.getType().getName().toString());
		slideReponse.setDisplayTime(slide.getDisplayTime());
		slideReponse.setHeaderColor(slide.getHeaderColor());
		slideReponse.setTitleColor(slide.getTitleColor());
		slideReponse.setOptions(slide.getOptions());
		return slideReponse;
	}

}
