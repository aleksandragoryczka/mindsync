package com.project.mindsync.dto.request;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.project.mindsync.model.Slide;
import com.project.mindsync.model.User;

import lombok.Data;

@Data
public class PresentationRequestDto {
	private String title;
	// private User user;
	private Instant createdAAt;
	private List<Slide> slides;

	public List<Slide> getSlides() {
		return slides == null ? null : new ArrayList<>(slides);
	}

	public void setSlides(List<Slide> slides) {
		if (slides == null) {
			this.slides = null;
		} else {
			this.slides = Collections.unmodifiableList(slides);
		}
	}
}
