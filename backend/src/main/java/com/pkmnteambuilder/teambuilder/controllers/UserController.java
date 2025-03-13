package com.pkmnteambuilder.teambuilder.controllers;

import com.pkmnteambuilder.teambuilder.models.User;
import com.pkmnteambuilder.teambuilder.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // En el metodo de registro
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        // Verifica si el usuario ya existe
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El usuario ya existe"));
        }

        // Guarda el usuario en la base de datos
        userRepository.save(user);

        // Crea un mapa para devolverlo como JSON con el mensaje y el id del usuario
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuario registrado con éxito");
        response.put("id", user.getId());  // Aquí estamos agregando el ID del usuario registrado

        // Devuelve la respuesta con status 201 (CREATED)
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }




    // Endpoint para obtener todos los usuarios (si lo necesitas)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Endpoint para obtener un usuario por su nombre de usuario
    @GetMapping("/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    // Endpoint para eliminar un usuario por su ID
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
