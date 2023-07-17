package com.project.mindsync.dto.response;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PagedResponseDto<T> {
	private List<T> content;
	private int page;
	private int size;
	private Long totalElements;
	private int totalPages;
	private boolean last;

	public PagedResponseDto(List<T> content, int page, int size, Long totalElements, int totalPages, boolean last) {
		setContent(content);
		this.page = page;
		this.size = size;
		this.totalElements = totalElements;
		this.totalPages = totalPages;
		this.last = last;
	}

	private final void setContent(List<T> content) {
		if (content == null) {
			this.content = null;
		} else {
			this.content = Collections.unmodifiableList(content);
		}
	}
}
