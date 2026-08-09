package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.dto.response.SolicitacaoResponse;
import ise.com.br.community_visit_api.exception.BusinessRuleException;
import ise.com.br.community_visit_api.exception.ResourceNotFoundException;
import ise.com.br.community_visit_api.mapper.SolicitacaoMapper;
import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import ise.com.br.community_visit_api.repository.SolicitacaoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;

    @Transactional
    public Solicitacao criarSolicitacao(Solicitacao solicitacao) {
        return solicitacaoRepository.save(solicitacao);
    }

    public List<Solicitacao> listar(StatusSolicitacao status) {
        if (status != null) {
            return solicitacaoRepository.findByStatusSolicitacao(status);
        }
        return solicitacaoRepository.findAll();
    }

    public Solicitacao buscarPorId(Long solicitacaoId) {
        return solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));
    }

    public List<SolicitacaoResponse> consultarPorTelefone(String telefone) {
        List<Solicitacao> solicitacoes = solicitacaoRepository.findByTelefoneSolicitanteContaining(telefone);
        return solicitacoes.stream()
                .map(SolicitacaoMapper::toResponseDTO)
                .toList();
    }
}

