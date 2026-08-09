package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.model.Endereco;
import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import ise.com.br.community_visit_api.repository.SolicitacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @InjectMocks
    private SolicitacaoService solicitacaoService;

    private Solicitacao solicitacaoBase;

    @BeforeEach
    void setUp() {
        solicitacaoBase = new Solicitacao();
        solicitacaoBase.setNomeSolicitante("Maria da Silva");
        solicitacaoBase.setTelefoneSolicitante("22999998888");
        solicitacaoBase.setEndereco(new Endereco());
    }

    @Test
    void deveCriarSolicitacaoComStatusPendente() {
        when(solicitacaoRepository.save(any(Solicitacao.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Solicitacao resultado = solicitacaoService.criarSolicitacao(solicitacaoBase);

        assertThat(resultado.getStatusSolicitacao()).isEqualTo(StatusSolicitacao.PENDENTE);
        verify(solicitacaoRepository).save(solicitacaoBase);
    }

    @Test
    void deveListarPorStatusQuandoInformado() {
        when(solicitacaoRepository.findByStatusSolicitacao(StatusSolicitacao.PENDENTE))
                .thenReturn(List.of(solicitacaoBase));

        List<Solicitacao> resultado = solicitacaoService.listar(StatusSolicitacao.PENDENTE);

        assertThat(resultado).hasSize(1);
        verify(solicitacaoRepository).findByStatusSolicitacao(StatusSolicitacao.PENDENTE);
    }

    @Test
    void deveListarTodasQuandoStatusForNulo() {
        when(solicitacaoRepository.findAll()).thenReturn(List.of(solicitacaoBase));

        List<Solicitacao> resultado = solicitacaoService.listar(null);

        assertThat(resultado).hasSize(1);
    }

    @Test
    void deveBuscarPorIdQuandoExistir() {
        solicitacaoBase.setId(1L);
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(solicitacaoBase));

        Solicitacao resultado = solicitacaoService.buscarPorId(1L);

        assertThat(resultado.getId()).isEqualTo(1L);
    }

    @Test
    void deveLancarExcecaoQuandoIdNaoExistir() {
        when(solicitacaoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> solicitacaoService.buscarPorId(99L))
                .isInstanceOf(ise.com.br.community_visit_api.exception.ResourceNotFoundException.class);
    }
}