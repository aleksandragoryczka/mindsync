package com.project.mindsync.dto.request;

import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
public class PresentationRequestDto {
	private String title;
	private Instant createdAt;
	private List<SlideRequestDto> slides;
}
