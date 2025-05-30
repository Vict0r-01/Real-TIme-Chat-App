package com.vaikrochat.backend.controller;

import com.vaikrochat.backend.DTO.ChatResponseDTO;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.service.ChatService;
import com.vaikrochat.backend.service.JwtService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("chat")
@CrossOrigin(origins = "http://localhost:3000",
allowedHeaders = {"Authorization", "Content-Type"})
public class ChatController {
    private final ChatService chatService;
    private final JwtService jwtService;

    public ChatController(JwtService jwtService, ChatService chatService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
    }

    @GetMapping()
    public ResponseEntity<List<ChatResponseDTO>> getChats(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtService.extractUsername(token.substring(7));
            Set<Chat> chats = chatService.getChats(username);
            if (chats.isEmpty()) return ResponseEntity.noContent().build(); // No chats found
            
            List<ChatResponseDTO> response = chats.stream()
            .map(ChatResponseDTO::fromChat)
            .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/private")
    public ResponseEntity<ChatResponseDTO> createPrivateChat(
            @RequestHeader("Authorization") String token,
            @RequestBody Chat chat) {
        try {
            String username = jwtService.extractUsername(token.substring(7));
            Set<Chat> chats = chatService.getChats(username);
            if(chats.contains(chat)) {
                return ResponseEntity.status(409).body(null); // Chat already exists
            }
            System.out.println("Creating private chat for user: " + username);
            Chat newChat = chatService.createChat(chat, username, null);
            System.out.println("Private chat created with name: " + newChat.getName());
            return ResponseEntity.ok(ChatResponseDTO.fromChat(newChat));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatResponseDTO> createChat(
            @RequestHeader("Authorization") String token,
            @RequestPart("chat") Chat chat,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            String username = jwtService.extractUsername(token.substring(7));
            Set<Chat> chats = chatService.getChats(username);
            if(chats.contains(chat)) {
                return ResponseEntity.status(409).body(null); // Chat already exists
            }
            Chat newChat = chatService.createChat(chat, username, image);
            System.out.println("CHAT CREATED");
            return ResponseEntity.ok(ChatResponseDTO.fromChat(newChat));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}