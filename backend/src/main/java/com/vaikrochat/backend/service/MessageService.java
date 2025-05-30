package com.vaikrochat.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vaikrochat.backend.model.Message;
import com.vaikrochat.backend.repository.MessageRepo;

@Service
public class MessageService {
    private final MessageRepo messageRepo;

    public MessageService(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }
    public List<Message> getMessagesByChatId(int chatId) {
        return messageRepo.findAllMessagesByChatId(chatId);
    }

    public Message saveMessage(Message message) {
        return messageRepo.save(message);
    }
}
