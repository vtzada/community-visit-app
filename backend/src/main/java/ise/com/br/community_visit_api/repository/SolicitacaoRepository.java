package ise.com.br.community_visit_api.repository;

import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByStatusSolicitacao(StatusSolicitacao status);
    List<Solicitacao> findByTelefoneSolicitanteContaining(String telefone);
}
