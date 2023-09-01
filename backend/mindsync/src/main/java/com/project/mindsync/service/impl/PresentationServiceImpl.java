package com.project.mindsync.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.PresentationRequestDto;
import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.dto.response.PresentationWithShowsResponseDto;
import com.project.mindsync.dto.response.PresentationWithSlidesResponseDto;
import com.project.mindsync.dto.response.ShowResponseDto;
import com.project.mindsync.dto.response.SlideResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Option;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Show;
import com.project.mindsync.model.Slide;
import com.project.mindsync.model.SlideType;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.SlideTypeName;
import com.project.mindsync.repository.OptionRepository;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.ShowRepository;
import com.project.mindsync.repository.SlideRepository;
import com.project.mindsync.repository.SlideTypeRepository;
import com.project.mindsync.repository.UserRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.PresentationService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

import jakarta.transaction.Transactional;

@Service
public class PresentationServiceImpl implements PresentationService {

	@Autowired
	private PresentationRepository presentationRepository;

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
	public PresentationWithShowsResponseDto getPresentationWithShows(Long presentationId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Presentation presentation = presentationRepository.findById(presentationId).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, presentationId));
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC, AppConstants.ID);
		Page<Show> shows = showRepository.findByPresentationId(presentationId, pageable);
		List<ShowResponseDto> showsResponses = shows.getContent().stream().map(this::mapToShowResponseDto)
				.collect(Collectors.toList());
		PagedResponseDto<ShowResponseDto> pagedShowsResponse = new PagedResponseDto<ShowResponseDto>(showsResponses,
				shows.getNumber(), shows.getSize(), shows.getTotalElements(), shows.getTotalPages(), shows.isLast());
		PresentationWithShowsResponseDto presentationWithShowsResponse = new PresentationWithShowsResponseDto();
		presentationWithShowsResponse.setId(presentationId);
		presentationWithShowsResponse.setTitle(presentation.getTitle());
		presentationWithShowsResponse.setShows(pagedShowsResponse);
		return presentationWithShowsResponse;
		// return new
		// PagedResponseDto<PresentationWithShowsResponseDto>(List.of(presentationWithShowsResponse),
		// shows.getNumber(), shows.getSize(), shows.getTotalElements(),
		// shows.getTotalPages(), shows.isLast());
	}

	@Override
	public PresentationWithSlidesResponseDto getPresentationWithSlides(Long presentationId) {
		Presentation presentation = presentationRepository.findById(presentationId).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, presentationId));
		List<Slide> slides = slideRepository.findByPresentationId(presentationId);
		List<SlideResponseDto> slidesResponses = slides.stream().map(this::mapToSlideResponseDto)
				.sorted(Comparator.comparingLong(SlideResponseDto::getId)).collect(Collectors.toList());
		PresentationWithSlidesResponseDto presentationWithSlidesResponse = new PresentationWithSlidesResponseDto();
		presentationWithSlidesResponse.setId(presentationId);
		presentationWithSlidesResponse.setCode(presentation.getCode());
		presentationWithSlidesResponse.setCreatedAt(presentation.getCreatedAt().toString());
		presentationWithSlidesResponse.setTitle(presentation.getTitle());
		presentationWithSlidesResponse.setSlides(slidesResponses);
		return presentationWithSlidesResponse;
	}

	@Override
	public PagedResponseDto<Presentation> getUserPresentations(UserPrincipal currentUser, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT);
		Page<Presentation> presentatations = presentationRepository.findByUserId(currentUser.getId(), pageable);

		List<Presentation> content = presentatations.getNumberOfElements() == 0 ? Collections.emptyList()
				: presentatations.getContent();

		return new PagedResponseDto<Presentation>(content, presentatations.getNumber(), presentatations.getSize(),
				presentatations.getTotalElements(), presentatations.getTotalPages(), presentatations.isLast());
	}

	@Override
	public Presentation getPresentation(Long id) {
		return presentationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, id));
	}

	@Override
	public ResponseEntity<Presentation> addPresentation(PresentationRequestDto presentationRequest,
			UserPrincipal currentUser) throws IOException {
		User user = userRepository.getUser(currentUser);

		Presentation presentation = new Presentation();
		presentation.setTitle(presentationRequest.getTitle());
		presentation.setPicture(presentationRequest.getPicture().getBytes());

		presentation.setUser(user);
		presentation.setCode(generateCode());

		/*
		 * List<Slide> slides = new
		 * ArrayList<Slide>(presentationRequest.getSlides().size()); for
		 * (SlideRequestDto slideRequest : presentationRequest.getSlides()) { Slide
		 * newSlide = createSlide(slideRequest, presentation);
		 * presentation.addSlide(newSlide); slides.add(newSlide); }
		 */
		Presentation savedPresentation = presentationRepository.save(presentation);
		return ResponseEntity.ok().body(savedPresentation);
	}

	@Override
	@Transactional
	public Presentation updatePresentation(Long id, PresentationRequestDto updatedPresentationRequest,
			UserPrincipal currentUser) throws IOException {
		Presentation presentation = presentationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, id));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(presentation.getUser(), currentUser)) {
			presentation.setTitle(updatedPresentationRequest.getTitle());
			presentation.setPicture(updatedPresentationRequest.getPicture().getBytes());
			List<Slide> existingSlides = presentation.getSlides();
			List<SlideRequestDto> updatedSlides = updatedPresentationRequest.getSlides();

			for (SlideRequestDto updatedSlide : updatedSlides) {
				if (updatedSlide.getId() != null) {
					Slide existingSlide = existingSlides.stream()
							.filter(slide -> slide.getId().equals(updatedSlide.getId())).findFirst()
							.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SLIDE, AppConstants.ID,
									updatedSlide.getId()));
					existingSlide = updateSlide(existingSlide, updatedSlide);
				} else {
					Slide newSlide = createSlide(updatedSlide, presentation);
					existingSlides.add(newSlide);
				}
			}

			existingSlides = deleteSlides(existingSlides, existingSlides);

			presentation.setSlides(existingSlides);

			Presentation updatedPresentation = presentationRepository.save(presentation);
			return updatedPresentation;
		}
		throw new UnauthorizedException(new ApiResponseDto(false, "You do not have permissions to edit that post."));
	}

	@Override
	public ApiResponseDto deletePresentation(Long id, UserPrincipal currentUser) {
		Presentation presentation = presentationRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, currentUser));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(presentation.getUser(), currentUser)) {
			presentationRepository.deleteById(id);
			return new ApiResponseDto(true, "Successfully deleted presentation");
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false,
				"You do not have permissions to delete that presentation.");
		throw new UnauthorizedException(apiResponse);
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

	private Slide createSlide(SlideRequestDto updatedSlide, Presentation presentation) {
		SlideType slideType = slideTypeRepository.findByName(SlideTypeName.valueOf(updatedSlide.getType()));
		Slide newSlide = new Slide();
		newSlide.setTitle(updatedSlide.getTitle());
		newSlide.setType(slideType);
		newSlide.setPresentation(presentation);
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
				existingSlide.setPresentation(null);
				slideRepository.delete(existingSlide);
			}
		}

		existingSlides.removeIf(existingSlide -> existingSlide.getId() != null && updatedSlides.stream().noneMatch(
				updatedSlide -> updatedSlide.getId() != null && updatedSlide.getId().equals(existingSlide.getId())));

		return existingSlides;
	}

	private String generateCode() {
		List<String> existingCodes = presentationRepository.findAll().stream().map(Presentation::getCode)
				.collect(Collectors.toList());
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
