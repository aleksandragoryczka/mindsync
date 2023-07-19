package com.project.mindsync.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.mindsync.model.audit.DateAudit;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "presentatations")
@Setter
@Getter
public class Presentation extends DateAudit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String code;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private User user;

	@OneToMany(mappedBy = "presentation", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Slide> slides;

	@JsonIgnore
	@OneToMany(mappedBy = "presentation", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Show> shows;

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

	public List<Show> getShows() {
		return shows == null ? null : new ArrayList<>(shows);
	}

	public void setShows(List<Show> shows) {
		if (shows == null) {
			this.shows = null;
		} else {
			this.shows = Collections.unmodifiableList(shows);
		}
	}
}
