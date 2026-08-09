package ise.com.br.community_visit_api.controller;

import ise.com.br.community_visit_api.dto.request.SolicitacaoRequest;
import ise.com.br.community_visit_api.dto.response.SolicitacaoResponse;
import ise.com.br.community_visit_api.mapper.SolicitacaoMapper;
import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import ise.com.br.community_visit_api.repository.SolicitacaoRepository;
import ise.com.br.community_visit_api.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
@AllArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;
    private final SolicitacaoRepository solicitacaoRepository;

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criarSolicitacao(@RequestBody @Valid SolicitacaoRequest solicitacaoRequest){

        Solicitacao solicitacao = SolicitacaoMapper.toEntity(solicitacaoRequest);
        Solicitacao salva = solicitacaoService.criarSolicitacao(solicitacao);

        return ResponseEntity.status(HttpStatus.CREATED).body(SolicitacaoMapper.toResponseDTO(salva));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'VOLUNTARIO')")
    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listarSolicitacoes(@RequestParam(required = false) StatusSolicitacao status){

        List<Solicitacao> solicitacoes = solicitacaoService.listar(status);

        List<SolicitacaoResponse> response = solicitacoes.stream()
                .map(SolicitacaoMapper::toResponseDTO)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        Solicitacao solicitacao = solicitacaoService.buscarPorId(id);
        return ResponseEntity.ok(SolicitacaoMapper.toResponseDTO(solicitacao));
    }

    @GetMapping("/consultar")
    public ResponseEntity<List<SolicitacaoResponse>> consultarPorTelefone(@RequestParam String telefone){
        List<SolicitacaoResponse> response =  solicitacaoService.consultarPorTelefone(telefone);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

