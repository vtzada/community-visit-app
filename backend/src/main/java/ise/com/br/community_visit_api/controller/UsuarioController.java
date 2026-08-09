package ise.com.br.community_visit_api.controller;

import ise.com.br.community_visit_api.dto.request.UsuarioRequest;
import ise.com.br.community_visit_api.dto.response.UsuarioResponse;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> cadastrar(@RequestBody @Valid UsuarioRequest request) {

        Usuario usuario = usuarioService.cadastrar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponse(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getRole()));
    }

}
