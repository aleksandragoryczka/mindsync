package com.project.mindsync.dto.response;

import java.util.List;

import com.project.mindsync.model.Option;

import lombok.Data;

@Data
public class SlideResponseDto {
	private Long id;
	private String title;
	private String displayTime;
	private String type;
	private String headerColor;
	private String titleColor;
	private List<Option> options;
}
