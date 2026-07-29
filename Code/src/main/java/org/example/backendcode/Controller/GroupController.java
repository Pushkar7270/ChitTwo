package org.example.backendcode.Controller;


import org.example.backendcode.Entities.ChatGroup;
import org.example.backendcode.Entities.Message;
import org.example.backendcode.Repository.GroupRepository;
import org.example.backendcode.Repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/group")
@CrossOrigin("*")
public class GroupController {
    private final GroupRepository groupRepository;
    private final MessageRepository messageRepository;


    public GroupController(GroupRepository groupRepository, MessageRepository messageRepository){
        this.groupRepository = groupRepository;
        this.messageRepository = messageRepository;
    }

    //create group
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody String roomName){
        //create room
        ChatGroup chatGroup = new ChatGroup();
        chatGroup.setRoomName(roomName);
        groupRepository.save(chatGroup);
        return ResponseEntity.status(HttpStatus.CREATED).body(chatGroup);
    }



    //get group
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinGroup(@PathVariable String roomId){
        ChatGroup chatGroup = groupRepository.findById(roomId).orElse(null);


        if(chatGroup == null){
            return ResponseEntity.badRequest().body("Room not found!");
        }

        return ResponseEntity.ok(chatGroup);
    }


    //get messages from room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessage(@PathVariable String roomId,
                                                    @RequestParam(value = "page", defaultValue = "0",
                                                            required = false)int page,
                                                    @RequestParam(value =  "size",defaultValue = "0",required = false)
                                                        int size)
    {

        ChatGroup group = groupRepository.findById(roomId).orElse(null);

        if (!groupRepository.existsById(roomId)) {
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = messageRepository.findByRoomIdOrderByTimeSentAsc(roomId);

        //pagination
        if(size == 0){
            return ResponseEntity.ok(messages);
        }
        int start = Math.max(0,messages.size() - (page+1)*size);
        int end = Math.min(messages.size(),start+size);

        if(start > messages.size() || start>=end){
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }


        List<Message> paginatedMessage = messages.subList(start,end);
        return ResponseEntity.ok(paginatedMessage);
    }


}
