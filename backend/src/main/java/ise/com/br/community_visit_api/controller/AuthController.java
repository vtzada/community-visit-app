package ise.com.br.community_visit_api.controller;

import ise.com.br.community_visit_api.dto.request.LoginRequest;
import ise.com.br.community_visit_api.dto.response.LoginResponse;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.security.TokenService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {

        var authToken = new UsernamePasswordAuthenticationToken(
                request.email(), request.senha());

        var authentication = authenticationManager.authenticate(authToken);

        Usuario usuario = (Usuario) authentication.getPrincipal();
        String token = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new LoginResponse(usuario.getId(),
                token, usuario.getNome(), usuario.getRole().name()));
    }

}
