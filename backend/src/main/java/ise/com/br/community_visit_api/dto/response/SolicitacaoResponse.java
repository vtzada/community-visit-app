package ise.com.br.community_visit_api.dto.response;

import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record SolicitacaoResponse(
        Long id,
        String nomeSolicitante,
        String telefoneSolicitante,
        String pedidoOracao,
        StatusSolicitacao statusSolicitacao,
        LocalDateTime dataSolicitacao,
        EnderecoResponse endereco
) {
}