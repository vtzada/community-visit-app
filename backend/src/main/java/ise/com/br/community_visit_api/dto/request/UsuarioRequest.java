package ise.com.br.community_visit_api.dto.request;

import ise.com.br.community_visit_api.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequest(
        @NotBlank(message = "Nome é obrigatório")
        String nome,
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,
        @NotBlank(message = "Senha é obrigatória")
        String senha,
        @NotBlank(message = "Telefone é obrigatório")
        String telefone,
        @NotNull(message = "Perfil é obrigatório")
        UserRole role
) {
}
