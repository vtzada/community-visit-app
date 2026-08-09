package ise.com.br.community_visit_api.controller;

import ise.com.br.community_visit_api.dto.response.VisitaResponse;
import ise.com.br.community_visit_api.mapper.VisitaMapper;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.model.Visita;
import ise.com.br.community_visit_api.model.enums.StatusVisita;
import ise.com.br.community_visit_api.service.VisitaService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/visitas")
@AllArgsConstructor
public class VisitaController {

    private final VisitaService visitaService;

    @PostMapping("/aceitar/{solicitacaoId}")
    @PreAuthorize("hasRole('VOLUNTARIO')")
    public ResponseEntity<List<VisitaResponse>> aceitarSolicitacao(
            @PathVariable Long solicitacaoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate primeiraVisita,
            @AuthenticationPrincipal Usuario usuario) {

        List<Visita> visitas = visitaService.aceitarSolicitacao(solicitacaoId, usuario, primeiraVisita);
        List<VisitaResponse> response = visitas.stream()
                .map(VisitaMapper::toResponseDTO)
                .toList();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{visitaId}/remarcar")
    @PreAuthorize("hasRole('VOLUNTARIO')")
    public ResponseEntity<VisitaResponse> remarcarVisita(
            @PathVariable Long visitaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate novaData,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        Visita visita = visitaService.remarcarVisita(visitaId, novaData, usuarioLogado);
        return ResponseEntity.ok(VisitaMapper.toResponseDTO(visita));
    }

    @PatchMapping("/{id}/concluir")
    @PreAuthorize("hasRole('VOLUNTARIO')")
    public ResponseEntity<VisitaResponse> concluirVisita(
            @PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {

        Visita visita = visitaService.concluirVisita(id, usuario);
        return ResponseEntity.ok(VisitaMapper.toResponseDTO(visita));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'VOLUNTARIO')")
    @GetMapping
    public ResponseEntity<List<VisitaResponse>> listarVisitas(
            @RequestParam(required = false) StatusVisita status,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        List<VisitaResponse> response = visitaService.listarVisitas(status, usuarioLogado).stream()
                .map(VisitaMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }
}