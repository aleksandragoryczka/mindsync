package com.project.mindsync.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.request.SlideRequestDto;
import com.project.mindsync.dto.response.ApiResponseDto;
import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.exception.ResourceNotFoundException;
import com.project.mindsync.exception.UnauthorizedException;
import com.project.mindsync.model.Option;
import com.project.mindsync.model.Presentation;
import com.project.mindsync.model.Show;
import com.project.mindsync.model.Slide;
import com.project.mindsync.model.SlideType;
import com.project.mindsync.model.enums.SlideTypeName;
import com.project.mindsync.repository.OptionRepository;
import com.project.mindsync.repository.PresentationRepository;
import com.project.mindsync.repository.SlideRepository;
import com.project.mindsync.repository.SlideTypeRepository;
import com.project.mindsync.security.UserPrincipal;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

import jakarta.transaction.Transactional;

@Service
public class SlideServiceImpl implements SlideService {
	@Autowired
	private SlideRepository slideRepository;

	@Autowired
	private PresentationRepository presentationRepository;

	@Autowired
	private SlideTypeRepository slideTypeRepository;

	@Autowired
	private OptionRepository optionRepository;

	// TODO: isGetSLide() is needed?
	// TODO: update single pslide is needed?

	@Override
	public ResponseEntity<Slide> addSlide(SlideRequestDto slideRequest, Long presentationId) {
		Presentation presentation = presentationRepository.findById(presentationId).orElseThrow(
				() -> new ResourceNotFoundException(AppConstants.PRESENTATION, AppConstants.ID, presentationId));
		Slide slide = new Slide();
		slide.setTitle(slideRequest.getTitle());
		slide.setDisplayTime(slideRequest.getDisplayTime());
		slide.setHeaderColor(slideRequest.getHeaderColor());
		slide.setTitleColor(slideRequest.getTitleColor());
		SlideType slideType = slideTypeRepository.findByName(SlideTypeName.valueOf(slideRequest.getType()));
		slide.setType(slideType);
		slide.setPresentation(presentation);

		if (AppConstants.OPTIONS_SLIDES_TYPES.contains(slideType.getName())) {
			List<Option> options = new ArrayList<Option>(slideRequest.getOptions().size());
			for (Option option : slideRequest.getOptions()) {
				Option newOption = this.createOption(option, slide);
				slide.addOption(newOption);
				options.add(newOption);
			}
			slide.setOptions(options);
		}
		Slide savedSlide = slideRepository.save(slide);
		return ResponseEntity.ok().body(savedSlide);
	}

	@Override
	public PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size) {
		AppUtils.validatePageNumberAndSize(page, size);

		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT);
		Page<Slide> slides = slideRepository.findByPresentationId(presentationId, pageable);

		List<Slide> content = slides.getNumberOfElements() == 0 ? Collections.emptyList() : slides.getContent();

		return new PagedResponseDto<Slide>(content, slides.getNumber(), slides.getSize(), slides.getTotalElements(),
				slides.getTotalPages(), slides.isLast());
	}

	@Override
	@Transactional
	public Slide updateSlide(Long id, @Valid SlideRequestDto updatedSlideRequest) {
		Slide slide = slideRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SLIDE, AppConstants.ID, id));
		slide.setDisplayTime(updatedSlideRequest.getDisplayTime());
		slide.setHeaderColor(updatedSlideRequest.getHeaderColor());
		slide.setTitle(updatedSlideRequest.getTitle());
		slide.setTitleColor(updatedSlideRequest.getTitleColor());
		SlideType slideType = slideTypeRepository.findByName(SlideTypeName.valueOf(updatedSlideRequest.getType()));
		slide.setType(slideType);
		if (AppConstants.OPTIONS_SLIDES_TYPES.contains(slideType.getName())) {
			List<Option> existingOptions = slide.getOptions();
			List<Option> updatedOptions = updatedSlideRequest.getOptions();

			// update existing option
			for (Option updatedOption : updatedOptions) {
				for (Option existingOption : existingOptions) {
					if (existingOption.getId() != null && existingOption.getId().equals(updatedOption.getId())) {
						existingOption.setOption(updatedOption.getOption());
						existingOption.setIsCorrect(updatedOption.getIsCorrect());
						break;
					}
				}
			}

			// delete option if not present in updatedOptions list
			existingOptions = deleteOptions(existingOptions, updatedOptions);

			// add new option if is not present in current existingOptions list
			existingOptions = updateOptions(existingOptions, updatedOptions, slide);

			slide.setOptions(existingOptions);
		} else {
			if (slide.getOptions().size() != 0) {
				List<Option> existingOptions = slide.getOptions();
				for (Option existingOption : existingOptions) {
					existingOption.setSlide(null);
					optionRepository.delete(existingOption);
				}
				slide.setOptions(null);
			}
		}
		return slideRepository.save(slide);
	}

	@Override
	public ResponseEntity<ApiResponseDto> deleteSlide(Long id, UserPrincipal currentUser) {
		Slide slide = slideRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(AppConstants.SLIDE, AppConstants.ID, id));
		if (AppUtils.checkUserIsCurrentUserOrAdmin(slide.getPresentation().getUser(), currentUser)) {
			slideRepository.delete(slide);
			return ResponseEntity.ok().body(new ApiResponseDto(true, "Successfully deleted Slide with ID: " + id));
		}
		ApiResponseDto apiResponse = new ApiResponseDto(false, "You do not have permissions to delete that slide.");
		throw new UnauthorizedException(apiResponse);
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
				newOption.setIsCorrect(updatedOption.getIsCorrect());
				newOption.setSlide(existingSlide);
				existingOptions.add(newOption);
				optionRepository.save(newOption);
			}
		}
		return existingOptions;
	}

	private Option createOption(Option optionRequest, Slide slide) {
		Option newOption = new Option();
		newOption.setIsCorrect(optionRequest.getIsCorrect());
		newOption.setOption(optionRequest.getOption());
		newOption.setSlide(slide);
		return newOption;
	}
}
