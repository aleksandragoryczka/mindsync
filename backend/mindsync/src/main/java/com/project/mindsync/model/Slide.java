package com.project.mindsync.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.mindsync.model.audit.DateAudit;
import jakarta.persistence.CascadeType;
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
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "slides")
@Getter
@Setter
@NoArgsConstructor
public class Slide extends DateAudit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private SlideType type;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "presentation_id", nullable = false)
	@JsonIgnore
	private Presentation presentation;

	@OneToMany(mappedBy = "slide", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Option> options;

	public SlideType getType() {
		return type;
	}

	public Slide(String title, SlideType slideType) {
		this.title = title;
		this.type = slideType;
	}

	public List<Option> getOptions() {
		return options == null ? null : new ArrayList<>(options);
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

	public void removeOption(Option option){
		options.remove(option);
		option.setSlide(this);
	}
	/*
	 * public void setOptions(List<Option> options) { if (options == null) {
	 * this.options = null; } else { this.options =
	 * Collections.unmodifiableList(options); } }
	 */
}
