package com.pkmnteambuilder.teambuilder.controllers;

import com.pkmnteambuilder.teambuilder.models.User;
import com.pkmnteambuilder.teambuilder.repositories.UserRepository;
import com.pkmnteambuilder.teambuilder.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200") // Permitir solicitudes desde Angular
public class AuthController {
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateUsernameAndPassword(@RequestParam String username, @RequestParam String password) {
        User user = userService.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", user.getUsername());
            response.put("id", user.getId());  // Enviar esl id del usuario también
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(Map.of("valid", false));
    }


}


