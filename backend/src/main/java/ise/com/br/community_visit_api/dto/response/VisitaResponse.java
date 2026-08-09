package ise.com.br.community_visit_api.dto.response;

import ise.com.br.community_visit_api.model.Solicitacao;
import ise.com.br.community_visit_api.model.enums.StatusVisita;

import java.time.LocalDateTime;

public record VisitaResponse(
        Long id,
        SolicitacaoResponse solicitacao,
        String nomeSolicitante,
        Long grupoId,
        String nomeGrupo,
        StatusVisita statusVisita,
        LocalDateTime dataHoraVisita,
        String observacao
) {
}
