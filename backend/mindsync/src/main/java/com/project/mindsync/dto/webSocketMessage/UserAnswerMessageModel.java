package com.project.mindsync.dto.webSocketMessage;

import lombok.Data;

@Data
public class UserAnswerMessageModel {
	private String name;
	private String surname;
	private String answer;
}
