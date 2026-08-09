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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisitaServiceTest {

    @Mock
    private VisitaRepository visitaRepository;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Mock
    private GrupoRepository grupoRepository;

    @InjectMocks
    private VisitaService visitaService;

    private Usuario usuarioVoluntario;
    private Usuario usuarioAdmin;
    private Grupo grupo;
    private Solicitacao solicitacaoPendente;
    private LocalDate proximaTerca;

    @BeforeEach
    void setUp() {
        proximaTerca = proximaTerca();

        usuarioVoluntario = new Usuario();
        usuarioVoluntario.setId(1L);
        usuarioVoluntario.setNome("João Voluntário");
        usuarioVoluntario.setRole(UserRole.VOLUNTARIO);

        usuarioAdmin = new Usuario();
        usuarioAdmin.setId(2L);
        usuarioAdmin.setNome("Admin");
        usuarioAdmin.setRole(UserRole.ADMIN);

        grupo = new Grupo();
        grupo.setId(1L);
        grupo.setNome("Grupo de Terça");
        grupo.setLider(usuarioVoluntario);

        solicitacaoPendente = new Solicitacao();
        solicitacaoPendente.setId(1L);
        solicitacaoPendente.setStatusSolicitacao(StatusSolicitacao.PENDENTE);
    }

    @Test
    void deveAceitarECriarCicloDeTresVisitasQuandoTudoValido() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));
        when(visitaRepository.existsByGrupoAndDataHoraVisitaInAndStatusVisita(eq(grupo), anyList(), eq(StatusVisita.AGENDADA)))
                .thenReturn(false);
        when(visitaRepository.save(any(Visita.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<Visita> resultado = visitaService.aceitarSolicitacao(1L, usuarioVoluntario, proximaTerca);

        assertThat(resultado).hasSize(3);
        assertThat(resultado).allMatch(v -> v.getStatusVisita() == StatusVisita.AGENDADA);
        assertThat(resultado).allMatch(v -> v.getGrupo().equals(grupo));
        assertThat(resultado).allMatch(v -> v.getSolicitacao().equals(solicitacaoPendente));
        assertThat(resultado.get(0).getDataHoraVisita()).isEqualTo(proximaTerca.atTime(19, 30));
        assertThat(resultado.get(1).getDataHoraVisita()).isEqualTo(proximaTerca.plusWeeks(1).atTime(19, 30));
        assertThat(resultado.get(2).getDataHoraVisita()).isEqualTo(proximaTerca.plusWeeks(2).atTime(19, 30));

        assertThat(solicitacaoPendente.getStatusSolicitacao()).isEqualTo(StatusSolicitacao.AGENDADA);
        verify(solicitacaoRepository).save(solicitacaoPendente);
        verify(visitaRepository, times(3)).save(any(Visita.class));
    }

    @Test
    void deveLancarExcecaoQuandoSolicitacaoNaoEncontrada() {
        when(solicitacaoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(99L, usuarioVoluntario, proximaTerca))
                .isInstanceOf(ResourceNotFoundException.class);

        verifyNoInteractions(grupoRepository, visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoForVoluntario() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioAdmin, proximaTerca))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Apenas voluntários");

        verifyNoInteractions(grupoRepository, visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoForLiderDeGrupo() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioVoluntario, proximaTerca))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("líder");

        verifyNoInteractions(visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoSolicitacaoJaFoiAceita() {
        solicitacaoPendente.setStatusSolicitacao(StatusSolicitacao.AGENDADA);

        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioVoluntario, proximaTerca))
                .isInstanceOf(BusinessRuleException.class);

        verifyNoInteractions(visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoDataEstiverNoPassado() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));

        LocalDate tercaPassada = proximaTerca.minusWeeks(4);

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioVoluntario, tercaPassada))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("passado");

        verifyNoInteractions(visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoNaoForTerca() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));

        LocalDate quartaFeira = proximaTerca.plusDays(1);

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioVoluntario, quartaFeira))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("terça");

        verifyNoInteractions(visitaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoHouverConflitoEmAlgumaDasTresTercas() {
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoPendente));
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));
        when(visitaRepository.existsByGrupoAndDataHoraVisitaInAndStatusVisita(eq(grupo), anyList(), eq(StatusVisita.AGENDADA)))
                .thenReturn(true);

        assertThatThrownBy(() -> visitaService.aceitarSolicitacao(1L, usuarioVoluntario, proximaTerca))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("conflito");

        verify(visitaRepository, never()).save(any());
    }

    @Test
    void deveListarTodasVisitasQuandoForAdmin() {
        when(visitaRepository.findAll()).thenReturn(List.of(new Visita(), new Visita()));

        List<Visita> resultado = visitaService.listarVisitas(null, usuarioAdmin);

        assertThat(resultado).hasSize(2);
        verifyNoInteractions(grupoRepository);
    }

    @Test
    void deveListarApenasVisitasDoProprioGrupoQuandoForVoluntario() {
        when(grupoRepository.findByLider(usuarioVoluntario)).thenReturn(Optional.of(grupo));
        when(visitaRepository.findByGrupo(grupo)).thenReturn(List.of(new Visita()));

        List<Visita> resultado = visitaService.listarVisitas(null, usuarioVoluntario);

        assertThat(resultado).hasSize(1);
        verify(visitaRepository).findByGrupo(grupo);
    }

    private LocalDate proximaTerca() {
        LocalDate data = LocalDate.now().plusWeeks(1);
        while (data.getDayOfWeek() != DayOfWeek.TUESDAY) {
            data = data.plusDays(1);
        }
        return data;
    }
}