package com.project.mindsync.dto.request;

import java.util.List;

import com.project.mindsync.model.Option;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SlideRequestDto {
	private Long id;
	private String title;
	private String type;
	private String displayTime;
	private List<Option> options;
}
