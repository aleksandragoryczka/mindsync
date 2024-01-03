package com.project.mindsync.dto.request;

import java.util.List;

import com.project.mindsync.model.Option;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SlideRequestDto {
	private Long id;
	private String title;
	private String type;
	private String displayTime;
	private String headerColor;
	private String titleColor;
	private List<Option> options;
}
