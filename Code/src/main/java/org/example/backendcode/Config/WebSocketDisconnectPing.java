package org.example.backendcode.Config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backendcode.Controller.ChatMessage;
import org.example.backendcode.Controller.messageType;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


/**
 * This class basically helps in telling the users that a user and left the chat.
 * @RequiredARgsConstructor automatically creates constructors for all fields
 * @Slf4j automatically creates a logger for the class
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketDisconnectPing {

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        if (headerAccessor.getSessionAttributes() == null) {
            return;
        }

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null){
            log.info("user disconnected:{} ",username);
            var chatMessage = ChatMessage.builder().type(messageType.LEAVE).sender(username).build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }

    }

}
