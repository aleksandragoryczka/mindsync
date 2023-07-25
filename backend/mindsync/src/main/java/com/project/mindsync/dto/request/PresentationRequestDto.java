package com.project.mindsync.dto.request;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.project.mindsync.model.Slide;
import com.project.mindsync.model.User;

import lombok.Data;

@Data
public class PresentationRequestDto {
	private String title;
	private Instant createdAt;
	private List<SlideRequestDto> slides;
}
