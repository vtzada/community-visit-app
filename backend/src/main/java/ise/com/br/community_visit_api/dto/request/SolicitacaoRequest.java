package ise.com.br.community_visit_api.dto.request;

import ise.com.br.community_visit_api.dto.EnderecoDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequest(
        @NotBlank(message = "Nome é obrigatório") String nomeSolicitante,
        @NotBlank(message = "Telefone é obrigatório") String telefoneSolicitante,
        @Valid @NotNull(message = "Endereço é obrigatório") EnderecoDTO endereco,
        String pedidoOracao
) {}