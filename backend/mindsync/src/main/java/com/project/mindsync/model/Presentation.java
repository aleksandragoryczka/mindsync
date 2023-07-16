package com.project.mindsync.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.hibernate.annotations.ManyToAny;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "presentatations")
@Setter
@Getter
public class Presentation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String code;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private User user;

	@JsonIgnore
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
}
