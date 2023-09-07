package com.project.mindsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.project.mindsync.dto.webSocketMessage.AttendeeMessage;
import com.project.mindsync.dto.webSocketMessage.SelectedOptionsMessage;

@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:4300", "http://localhost:4000" })
@Controller
public class WebSocketController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@MessageMapping("send/attendees")
	public AttendeeMessage sendAttendeeData(AttendeeMessage message) {
		messagingTemplate.convertAndSend("/topic/attendees", message);

		return message;
	}

	@MessageMapping("send/current-slide")
	public int sendCurrentSlide(int message) {
		messagingTemplate.convertAndSend("/topic/current-slide", message);
		return message;
	}

	@MessageMapping("send/start-button")
	public boolean sendStartShowButton(boolean message) {
		messagingTemplate.convertAndSend("/topic/start-button", message);
		return message;
	}

	// TODO: unused!!!
	@MessageMapping("send/time-end")
	public String sendTimeEnd(String slideId) {
		messagingTemplate.convertAndSend("/topic/time-end", slideId);
		return slideId;
	}

	@MessageMapping("send/selected-options")
	public SelectedOptionsMessage sendSelectedOptions(SelectedOptionsMessage message) {
		messagingTemplate.convertAndSend("/topic/selected-options", message);
		return message;
	}
}
