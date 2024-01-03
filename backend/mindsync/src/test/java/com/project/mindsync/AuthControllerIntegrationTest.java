package com.project.mindsync;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.project.mindsync.dto.request.RegisterRequestDto;
import com.project.mindsync.dto.request.SignInRequestDto;
import com.project.mindsync.dto.response.JwtAuthenticationResponseDto;
import com.project.mindsync.model.Role;
import com.project.mindsync.model.User;
import com.project.mindsync.model.enums.RoleName;
import com.project.mindsync.service.AuthService;
import com.project.mindsync.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.HashSet;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@MockBean
	private AuthService authService;

	@MockBean
	private EmailService emailService;

	@Test
	public void testRegisterUser() throws Exception {
		RegisterRequestDto registerRequest = new RegisterRequestDto();
		registerRequest.setName("John");
		registerRequest.setSurname("Doe");
		registerRequest.setUsername("john.doe");
		registerRequest.setEmail("john.doe@example.com");
		registerRequest.setPassword("password");

		User registeredUser = new User("John", "Doe", "john.doe", "john.doe@example.com", "password");
		registeredUser.setPassword(passwordEncoder.encode("password"));
		registeredUser.setRoles(new HashSet<>(Collections.singleton(new Role(RoleName.ROLE_USER))));
		when(authService.registerUser(any(RegisterRequestDto.class))).thenReturn(registeredUser);

		mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
				.content("{\n" + "    \"name\": \"John\",\n" + "    \"surname\": \"Doe\",\n"
						+ "    \"username\": \"john.doe\",\n" + "    \"email\": \"john.doe@example.com\",\n"
						+ "    \"password\": \"password\"\n" + "}"))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("John"))
				.andExpect(jsonPath("$.email").value("john.doe@example.com"))
				.andExpect(jsonPath("$.roles[0].name").value("ROLE_USER"));
	}

	@Test
	public void testSignInUser() throws Exception {
		SignInRequestDto signInRequest = new SignInRequestDto();
		signInRequest.setEmail("john.doe@example.com");
		signInRequest.setPassword("password");

		User signedInUser = new User("John", "Doe", "john.doe", "john.doe@example.com", "password");
		signedInUser.setPassword(passwordEncoder.encode("password"));
		signedInUser.setRoles(new HashSet<>(Collections.singleton(new Role(RoleName.ROLE_USER))));
		when(authService.signInUser(any(HttpServletRequest.class), any(SignInRequestDto.class)))
				.thenReturn(new JwtAuthenticationResponseDto("jwt-token"));

		mockMvc.perform(post("/api/auth/signin").contentType(MediaType.APPLICATION_JSON).content(
				"{\n" + "    \"email\": \"john.doe@example.com\",\n" + "    \"password\": \"password\"\n" + "}"))
				.andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").value("jwt-token"));
	}

	@Test
	public void testVerifyUser() throws Exception {
		when(authService.verifyUser("verification-code")).thenReturn(true);

		mockMvc.perform(get("/api/auth/verify?code=verification-code")).andExpect(status().isOk())
				.andExpect(jsonPath("$").value(true));
	}
}