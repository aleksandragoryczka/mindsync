package com.project.mindsync.model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "slides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
	@JoinColumn(name = "quiz_id", nullable = false)
	@JsonIgnore
	private Quiz quiz;

	@OneToMany(mappedBy = "slide", cascade = CascadeType.ALL)
	private List<Option> options;

	@Column(name = "display_time", length = 5)
	private String displayTime = "20";

	@Column(name = "header_color")
	private String headerColor;

	@Column(name = "title_color")
	private String titleColor;

	public Slide(String title, SlideType slideType) {
		this.title = title;
		this.type = slideType;
	}

	public Slide(Long id, String title, SlideType slideType, Quiz quiz) {

	}

	public List<Option> getOptions() {
		return options == null ? null : new ArrayList<Option>(options);
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

	public SlideType getType() {
		return type;
	}

	public void setDisplayTime(String displayTime) {
		if (displayTime == null) {
			this.displayTime = "20";
		} else {
			this.displayTime = displayTime;
		}
	}

	public void addOption(Option option) {
		if (options == null)
			this.options = new ArrayList<Option>();
		options.add(option);
		option.setSlide(this);
	}

}
