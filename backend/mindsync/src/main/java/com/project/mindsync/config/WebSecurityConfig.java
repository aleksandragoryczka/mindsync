package com.project.mindsync.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.project.mindsync.security.AuthEntryPointJwt;
import com.project.mindsync.security.AuthTokenFilter;
import com.project.mindsync.security.service.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
// @EnableWebSecurity(debug = true)
public class WebSecurityConfig {
	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable())
				.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth.requestMatchers(new AntPathRequestMatcher("/swagger-ui"))
						.permitAll().requestMatchers(new AntPathRequestMatcher("/v3/api/docs/**")).permitAll()
						.requestMatchers(new AntPathRequestMatcher("/swagger-ui.html")).permitAll()
						.requestMatchers(new AntPathRequestMatcher("/ws/**")).permitAll()
						.requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
						.requestMatchers(new AntPathRequestMatcher("/api/quiz/**")).permitAll()
						.requestMatchers(new AntPathRequestMatcher("/api/show/**")).authenticated()
						.requestMatchers(new AntPathRequestMatcher("/api/slide/**")).authenticated()
						.requestMatchers(new AntPathRequestMatcher("/api/user/**")).permitAll());

		http.authenticationProvider(authenticationProvider());
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
