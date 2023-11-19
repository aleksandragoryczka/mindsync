package com.project.mindsync.dto.request;

import java.time.Instant;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class QuizRequestDto {
	private String title;
	private Instant createdAt;
	private MultipartFile picture;
	private List<SlideRequestDto> slides;
}
