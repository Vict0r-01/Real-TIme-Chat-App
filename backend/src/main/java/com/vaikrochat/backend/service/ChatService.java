package com.vaikrochat.backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;
import com.vaikrochat.backend.model.Image;
import com.vaikrochat.backend.repository.AccountRepository;
import com.vaikrochat.backend.repository.ChatRepo;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class ChatService {
    
    private final ChatRepo chatRepo;
    private final AccountRepository accountRepository;
    private final ImageService imageService;
    
    public ChatService(ChatRepo chatRepo, AccountRepository accountRepository, ImageService imageService) {
        this.imageService = imageService;
        this.accountRepository = accountRepository;
        this.chatRepo = chatRepo;
    }
    public List<Chat> getChats() {
        return chatRepo.findAll();
    }

    public Chat getChatById(int chatId) {
        return chatRepo.findById(chatId)
            .orElseThrow(() -> new RuntimeException("Chat not found"));
    }

    public Set<Chat> getChats(String username) {
        Account account = accountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<Chat> chats = account.getChats();
        
        return chats;
    }

    public Chat createChat(Chat chatRequest, String username, MultipartFile image) {
        // Create new chat instance
        Chat newChat = new Chat();
        Image chatImage = null;
        System.out.println("Creating chat with name: " + chatRequest.getName() + " for user: " + username);
        try{
            // If an image is provided, save it
            if (image != null && !image.isEmpty()) {
                chatImage = imageService.storeFile(image);
            } else chatImage = imageService.getDefaultImage(); // Use default image if none provided
        } catch (Exception e) {
            throw new RuntimeException("Error processing image: " + e.getMessage(), e);

        }
        System.out.println("Image processed successfully: " + (chatImage != null ? chatImage.getFileName() : "No image provided"));
        // Get raw Account entities from usernames in DTO

            // Process participants
            Set<Account> participants = new HashSet<>();
            try {
                log.info("Raw participants: {}", chatRequest.getParticipants());
                participants = chatRequest.getParticipants().stream()
                    .peek(dto -> log.info("Processing participant: {}", dto.getUsername()))
                    .map(dto -> {
                        Account account = accountRepository.findByUsername(dto.getUsername())
                            .orElseThrow(() -> new RuntimeException("Participant not found: " + dto.getUsername()));
                        log.info("Found account: {}", account.getUsername());
                        return account;
                    })
                    .collect(Collectors.toSet());
                log.info("Participants processed: {}", participants.size());
            } catch (Exception e) {
                log.error("Participant processing error", e);
                throw e;
            }

        System.out.println("Setting new chat");
        // Set chat properties
        newChat.setName(chatRequest.getName());
        newChat.setType(chatRequest.getType());
        newChat.setChatImage(chatImage);

        // Set up bidirectional relationships
        for (Account participant : participants) {
            participant.getChats().add(newChat);
        }
        
        newChat.setRawParticipants(participants);

        System.out.println("Saving chat with name: " + newChat.getName() + " for user: " + username);
        return chatRepo.save(newChat);
    }
    
    public void deleteChat(int chatId) {
        chatRepo.deleteById(chatId);
    }
}
