package com.project.mindsync.dto.response;

import com.project.mindsync.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserWithPresentationsCountResponseDto {
	private User user;
	private Long presentationsCount;
}
