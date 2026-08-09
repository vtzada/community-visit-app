package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.exception.BusinessRuleException;
import ise.com.br.community_visit_api.exception.ResourceNotFoundException;
import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.model.Visita;
import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import ise.com.br.community_visit_api.model.enums.StatusVisita;
import ise.com.br.community_visit_api.model.enums.UserRole;
import ise.com.br.community_visit_api.repository.GrupoRepository;
import ise.com.br.community_visit_api.repository.SolicitacaoRepository;
import ise.com.br.community_visit_api.repository.VisitaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class VisitaService {

    private final VisitaRepository visitaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final GrupoRepository grupoRepository;

    @Transactional
    public List<Visita> aceitarSolicitacao(Long solicitacaoId, Usuario usuario, LocalDate primeiraVisita) {
        Solicitacao solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (usuario.getRole() != UserRole.VOLUNTARIO) {
            throw new BusinessRuleException("Apenas voluntários podem aceitar visitas.");
        }

        Grupo grupo = grupoRepository.findByLider(usuario)
                .orElseThrow(() -> new BusinessRuleException("Você não é líder de nenhum grupo."));

        if (solicitacao.getStatusSolicitacao() != StatusSolicitacao.PENDENTE) {
            throw new BusinessRuleException("Esta solicitação não está mais disponível.");
        }

        if (primeiraVisita.isBefore(LocalDate.now())) {
            throw new BusinessRuleException("A data da primeira visita não pode estar no passado.");
        }

        if (primeiraVisita.getDayOfWeek() != DayOfWeek.TUESDAY) {
            throw new BusinessRuleException("As visitas devem ser agendadas para terças-feiras.");
        }

        LocalDateTime visita1 = primeiraVisita.atTime(19, 30);
        LocalDateTime visita2 = visita1.plusWeeks(1);
        LocalDateTime visita3 = visita1.plusWeeks(2);
        List<LocalDateTime> datasVisitas = List.of(visita1, visita2, visita3);

        boolean conflito = visitaRepository.existsByGrupoAndDataHoraVisitaInAndStatusVisita(
                grupo, datasVisitas, StatusVisita.AGENDADA);
        if (conflito) {
            throw new BusinessRuleException("Seu grupo possui conflito de agenda em uma das terças-feiras deste ciclo.");
        }

        List<Visita> visitasCriadas = datasVisitas.stream()
                .map(data -> salvarVisita(solicitacao, grupo, data))
                .toList();

        solicitacao.setStatusSolicitacao(StatusSolicitacao.AGENDADA);
        solicitacaoRepository.save(solicitacao);

        return visitasCriadas;
    }

    @Transactional
    public Visita remarcarVisita(Long visitaId, LocalDate novaData, Usuario usuario) {
        Visita visita = visitaRepository.findById(visitaId)
                .orElseThrow(() -> new ResourceNotFoundException("Visita não encontrada"));

        Grupo grupo = grupoRepository.findByLider(usuario)
                .orElseThrow(() -> new BusinessRuleException("Você não é líder de nenhum grupo."));

        if (!visita.getGrupo().equals(grupo)) {
            throw new BusinessRuleException("Você só pode remarcar visitas do seu próprio grupo.");
        }

        if (novaData.isBefore(LocalDate.now())) {
            throw new BusinessRuleException("A nova data não pode estar no passado.");
        }

        if (novaData.getDayOfWeek() != DayOfWeek.TUESDAY) {
            throw new BusinessRuleException("A remarcação deve ser feita para uma terça-feira.");
        }

        LocalDateTime novaDataHora = novaData.atTime(19, 30);

        boolean conflito = visitaRepository.existsByGrupoAndDataHoraVisitaAndStatusVisita(
                grupo, novaDataHora, StatusVisita.AGENDADA);
        if (conflito) {
            throw new BusinessRuleException("Seu grupo já possui outro compromisso nesta terça-feira.");
        }

        visita.setDataHoraVisita(novaDataHora);
        return visitaRepository.save(visita);
    }

    private Visita salvarVisita(Solicitacao solicitacao, Grupo grupo, LocalDateTime dataHora) {
        Visita visita = new Visita();
        visita.setSolicitacao(solicitacao);
        visita.setGrupo(grupo);
        visita.setDataHoraVisita(dataHora);
        visita.setStatusVisita(StatusVisita.AGENDADA);
        return visitaRepository.save(visita);
    }

    @Transactional
    public Visita concluirVisita(Long visitaId, Usuario usuario) {
        Visita visita = visitaRepository.findById(visitaId)
                .orElseThrow(() -> new ResourceNotFoundException("Visita não encontrada."));

        Grupo grupoUsuario = grupoRepository.findByLider(usuario)
                .orElseThrow(() -> new BusinessRuleException("Você não é lider de nenhum grupo."));

        if (!visita.getGrupo().equals(grupoUsuario)) {
            throw new BusinessRuleException("Você só pode concluir visitas do seu grupo.");
        }

        if (visita.getStatusVisita() != StatusVisita.AGENDADA) {
            throw new BusinessRuleException("Apenas visitas agendadas podem ser concluídas.");
        }

        visita.setStatusVisita(StatusVisita.REALIZADA);

        Solicitacao solicitacao = visita.getSolicitacao();
        solicitacao.setStatusSolicitacao(StatusSolicitacao.CONCLUIDA);
        solicitacaoRepository.save(solicitacao);

        return visitaRepository.save(visita);
    }

    public List<Visita> listarVisitas(StatusVisita status, Usuario usuario) {
        if (usuario.getRole() == UserRole.ADMIN) {
            if (status != null) {
                return visitaRepository.findByStatusVisita(status);
            }
            return visitaRepository.findAll();
        }

        Grupo grupoUsuario = grupoRepository.findByLider(usuario)
                .orElseThrow(() -> new BusinessRuleException("Você não é lider de nenhum grupo."));

        if (status != null) {
            return visitaRepository.findByGrupoAndStatusVisita(grupoUsuario, status);
        }

        return visitaRepository.findByGrupo(grupoUsuario);
    }
}