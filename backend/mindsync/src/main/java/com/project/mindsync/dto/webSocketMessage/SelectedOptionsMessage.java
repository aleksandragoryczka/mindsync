package com.project.mindsync.dto.webSocketMessage;

import java.util.List;

import com.project.mindsync.model.Option;

import lombok.Data;

@Data
public class SelectedOptionsMessage {
	private String name;
	private String surname;
	private List<Option> selectedOptions;
}
