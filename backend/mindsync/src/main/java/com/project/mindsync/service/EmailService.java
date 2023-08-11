package com.project.mindsync.service;

import java.io.UnsupportedEncodingException;

import com.project.mindsync.model.User;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;

public interface EmailService {
	void sendVerificationEmail(User user, HttpServletRequest httpServletRequest) throws UnsupportedEncodingException, MessagingException;
}
