package com.project.mindsync.dto.response;

import com.project.mindsync.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserWithQuizzesCountResponseDto {
	private User user;
	private Long quizzesCount;
}
