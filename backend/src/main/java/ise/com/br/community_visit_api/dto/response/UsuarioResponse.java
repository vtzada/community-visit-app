package ise.com.br.community_visit_api.dto.response;

import ise.com.br.community_visit_api.model.enums.UserRole;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        UserRole role
) {
}
