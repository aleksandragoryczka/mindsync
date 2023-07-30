package com.project.mindsync.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.project.mindsync.dto.response.PagedResponseDto;
import com.project.mindsync.model.Slide;
import com.project.mindsync.repository.SlideRepository;
import com.project.mindsync.service.SlideService;
import com.project.mindsync.utils.AppConstants;
import com.project.mindsync.utils.AppUtils;

@Service
public class SlideServiceImpl implements SlideService {
	@Autowired
	private SlideRepository slideRepository;

	//TODO: isGetSLide() is needed?
	//TODO: update single pslide is needed?
	

	@Override
	public PagedResponseDto<Slide> getAllSlidesByPresentation(Long presentationId, int page, int size) {
		AppUtils.validatePageNumberAndSIze(page, size);

		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, AppConstants.CREATED_AT);
		Page<Slide> slides = slideRepository.findByPresentationId(presentationId, pageable);

		List<Slide> content = slides.getNumberOfElements() == 0 ? Collections.emptyList() : slides.getContent();

		return new PagedResponseDto<Slide>(content, slides.getNumber(), slides.getSize(), slides.getTotalElements(),
				slides.getTotalPages(), slides.isLast());
	}

}
