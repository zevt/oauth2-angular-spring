package com.zeroexception.demo.authenticationserver.controllers;


import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zeroexception.demo.authenticationserver.model.SocialUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1")
@Slf4j
public class InfoController {

	@GetMapping("/info")
	public ResponseEntity<?> getInfo() {
		ObjectNode node = JsonNodeFactory.instance.objectNode();
		node.put("message", "Welcome to Awesome Authentication Server");
		log.info("Someone visit info");
		return ResponseEntity.ok().body(node);
	}

	@GetMapping("/user")
	public ResponseEntity<?> getUser() {
		SocialUser user = (SocialUser) SecurityContextHolder.getContext().getAuthentication();
		log.info("User: {} ",user);
		return ResponseEntity.ok().body(user);
	}

}
