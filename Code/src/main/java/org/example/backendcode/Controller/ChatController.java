package org.example.backendcode.Controller;


import org.example.backendcode.Entities.ChatGroup;
import org.example.backendcode.Entities.Message;
import org.example.backendcode.Payload.MessageRequest;
import org.example.backendcode.Repository.GroupRepository;
import org.springframework.cglib.core.Local;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private GroupRepository groupRepository;

    public ChatController(GroupRepository groupRepository){
        this.groupRepository = groupRepository;
    }

    //for sending and recieving messages
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/group/{roomId}") //this is where message will reach
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest messageRequest){
       ChatGroup chatGroup = groupRepository.findById(roomId).orElse(null);
        if (chatGroup == null) {
            throw new RuntimeException("Group room not found!");
        }
       Message message = new Message();
       message.setContent(messageRequest.getContent());
       message.setSenderId(messageRequest.getSender());
       message.setTimeSent(LocalDateTime.now());
       message.setRoomId(messageRequest.getRoomId());


       if(chatGroup != null){
           chatGroup.getMessage().add(message);
           groupRepository.save(chatGroup);
       }else{
           throw new RuntimeException("room not Found!");
       }
       return message;

    }
}
