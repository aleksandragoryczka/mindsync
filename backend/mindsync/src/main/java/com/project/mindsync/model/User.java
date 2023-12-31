package com.project.mindsync.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "verification_code", "username", "email" }) })
@Setter
@Getter
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(min = 3)
	private String name;

	@NotBlank
	@Size(min = 3)
	private String surname;

	@NotBlank
	@Size(min = 3)
	private String username;

	@NotBlank
	@Email
	private String email;

	@NotBlank
	@Size(min = 6, max = 40)
	private String password;

	@Column(name = "verification_code", length = 64, nullable = true)
	private String verificationCode;

	@Column(name = "enabled", nullable = false)
	private boolean enabled;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<Role>();

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Quiz> quizzes;

	public User() {
	}

	public User(String name, String surname, String username, String email, String password) {
		this.name = name;
		this.surname = surname;
		this.username = username;
		this.email = email;
		this.password = password;
	}

	public List<Quiz> getQuizzes() {
		return quizzes == null ? null : new ArrayList<Quiz>(quizzes);
	}

	public void setQuizzes(List<Quiz> quizzes) {
		if (quizzes == null) {
			this.quizzes = null;
		} else {
			this.quizzes = Collections.unmodifiableList(quizzes);
		}
	}

	public Set<Role> getRoles() {
		return roles == null ? null : new HashSet<Role>(roles);
	}

	public void setRoles(Set<Role> roles) {
		if (roles == null) {
			this.roles = null;
		} else {
			this.roles = roles;
		}
	}

}
