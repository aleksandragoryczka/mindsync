package com.project.mindsync.service.impl;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.project.mindsync.model.User;
import com.project.mindsync.service.EmailService;
import com.project.mindsync.utils.AppConstants;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class EmailServiceImpl implements EmailService {
	@Value("{spring.mail.username}")
	private String fromAddress;

	private JavaMailSender mailSender;

	public EmailServiceImpl(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	@Override
	public void sendVerificationEmail(User user, HttpServletRequest httpServletRequest)
			throws UnsupportedEncodingException, MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		helper.setFrom(fromAddress, AppConstants.MAIL_SENDER);
		helper.setTo(user.getEmail());
		helper.setSubject(AppConstants.MAIL_SUBJECT);
		String contenet = AppConstants.MAIL_CONTENT.replace("[[name]]", user.getName());
		String verifyURL = AppConstants.MAIL_VERIFY_URL_FIRST_PART + user.getVerificationCode();
		contenet = contenet.replace("[[URL]]", verifyURL);
		helper.setText(contenet, true);
		mailSender.send(message);
	}

}
