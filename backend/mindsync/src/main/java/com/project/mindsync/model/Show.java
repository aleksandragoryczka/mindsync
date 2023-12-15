package com.project.mindsync.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shows")
@Getter
@Setter
@NoArgsConstructor
public class Show extends DateAudit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "attendees_number")
	private String attendeesNumber;

	@Column(name = "excel_file", columnDefinition = "BYTEA")
	private byte[] excelFile;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "quiz_id", nullable = false)
	@JsonIgnore
	private Quiz quiz;

	@JsonIgnore
	@OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screenshot> screenshots;

	public Show(String attendeesNumber, byte[] excelFile, Quiz quiz, List<Screenshot> screenshots) {
		this.attendeesNumber = attendeesNumber;
		this.excelFile = excelFile;
		this.quiz = quiz;
		this.screenshots = screenshots;
	}

	public void setExcelFile(byte[] excelFile) {
		this.excelFile = excelFile;
	}

	public List<Screenshot> getScreenshots() {
		return screenshots == null ? null : new ArrayList<Screenshot>(screenshots);
	}

	public void setScreenshots(List<Screenshot> screenshots) {
		if (screenshots == null) {
			this.screenshots = null;
		} else {
			this.screenshots = Collections.unmodifiableList(screenshots);
		}
	}

}
