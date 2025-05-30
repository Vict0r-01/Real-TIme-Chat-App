package com.vaikrochat.backend.repository;
import com.vaikrochat.backend.model.Account;
import com.vaikrochat.backend.model.Chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Integer> {
    
    List<Account> findAccountsById(int chatId);
}
