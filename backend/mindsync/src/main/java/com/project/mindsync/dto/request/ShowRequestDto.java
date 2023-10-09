package com.project.mindsync.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowRequestDto {
	private String attendeesNumber;
	private MultipartFile excelFile;
	// private List<MultipartFile> screenshots;

	public MultipartFile getExcelFile() {
		return this.excelFile;
	}

	// public List<MultipartFile> getScreenshots() {
	// return this.screenshots;
	// }
}
