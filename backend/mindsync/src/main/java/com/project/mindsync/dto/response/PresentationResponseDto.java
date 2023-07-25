package com.project.mindsync.dto.response;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.project.mindsync.model.Show;
import com.project.mindsync.model.Slide;
import com.project.mindsync.model.User;

import lombok.Data;
//TODO: to delted
@Data
public class PresentationResponseDto {
	private Long id;
	private String title;
	private String code;
	private User user;
	private Long createdAt;
	private List<Slide> slides;
	private List<Show> shows;

	public List<Slide> getSlides() {
		return slides == null ? null : new ArrayList<Slide>(slides);
	}

	public void setSlides(List<Slide> slides) {
		if (slides == null) {
			this.slides = null;
		} else {
			this.slides = Collections.unmodifiableList(slides);
		}
	}

	public List<Show> getShows() {
		return shows == null ? null : new ArrayList<Show>(shows);
	}

	public void setShows(List<Show> shows) {
		if (shows == null) {
			this.shows = null;
		} else {
			this.shows = Collections.unmodifiableList(shows);
		}
	}
}
