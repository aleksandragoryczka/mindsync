package com.project.mindsync.model;

import java.util.List;

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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "shows")
@Getter
@Setter
public class Show {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String attendees_number;

	@Lob
	@Column(name = "excel_file")
	private byte[] excelFile;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "presentation_id", nullable = false)
	@JsonIgnore
	private Presentation presentation;

	@JsonIgnore
	@OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screenshot> screenshots;

}
