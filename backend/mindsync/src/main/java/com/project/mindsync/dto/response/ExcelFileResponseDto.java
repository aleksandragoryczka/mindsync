package com.project.mindsync.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExcelFileResponseDto {
	private byte[] excelFile;
}
