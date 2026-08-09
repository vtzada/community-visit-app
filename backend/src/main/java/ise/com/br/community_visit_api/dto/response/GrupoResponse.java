package ise.com.br.community_visit_api.dto.response;

import java.util.List;

public record GrupoResponse(
        Long id,
        String nome,
        String nomeLider,
        List<String> membros
) {
}
