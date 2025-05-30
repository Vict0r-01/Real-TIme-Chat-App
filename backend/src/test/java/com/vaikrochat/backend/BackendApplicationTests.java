package com.vaikrochat.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // This empty test verifies that the Spring context can load
    }
}
