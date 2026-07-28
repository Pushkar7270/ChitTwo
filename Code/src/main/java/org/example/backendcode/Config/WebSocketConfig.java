package org.example.backendcode.Config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;


/**
 * This class customizes Spring's WebSocket infrastructure.
        *
        * @Configuration tells Spring this is a configuration class.
        * @EnableWebSocketMessageBroker enables WebSocket and STOMP support.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * It registers one or more WebSocket endpoints where clients can initiate a WebSocket connection.
     * An endpoint is an address where a client connects to a server.
     *
     * @param registry
     *
     * /chat is the place where connection is established
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/chat")
               .setAllowedOriginPatterns("*")
               .withSockJS();
    }



    /**
     * Tells Spring how messages should be routed.
     *
     * @/app   -> Messages sent to our application.
     * @/topic -> Messages sent from the server to connected users.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }


}
