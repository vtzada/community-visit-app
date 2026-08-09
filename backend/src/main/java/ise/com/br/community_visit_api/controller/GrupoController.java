package ise.com.br.community_visit_api.controller;

import ise.com.br.community_visit_api.dto.request.GrupoRequest;
import ise.com.br.community_visit_api.dto.response.GrupoResponse;
import ise.com.br.community_visit_api.mapper.GrupoMapper;
import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.service.GrupoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grupos")
@AllArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @PostMapping
    @PreAuthorize("hasRole('VOLUNTARIO')")
    public ResponseEntity<GrupoResponse> criarGrupo(@RequestBody @Valid GrupoRequest request,
                                                    @AuthenticationPrincipal Usuario usuario) {

        Grupo grupo = grupoService.criarGrupo(request, usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GrupoMapper.toResponseDTO(grupo));
    }

    @GetMapping
    public ResponseEntity<List<GrupoResponse>> listar() {
        List<GrupoResponse> response = grupoService.listar().stream()
                .map(GrupoMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }
}