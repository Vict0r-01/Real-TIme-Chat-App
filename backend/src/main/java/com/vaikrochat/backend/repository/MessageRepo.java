package com.vaikrochat.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vaikrochat.backend.model.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

    public List<Message> findAllMessagesByChatId(int chatId); // Assuming you have a chatId field in your Message entity
    
}
