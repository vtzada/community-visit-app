package ise.com.br.community_visit_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GrupoRequest(
        @NotBlank(message = "Nome do grupo é obrigatório")
        String nome,
        List<String> membros
) {
}
