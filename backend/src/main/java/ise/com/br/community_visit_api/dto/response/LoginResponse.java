package ise.com.br.community_visit_api.dto.response;


public record LoginResponse(
        Long id,
        String token,
        String nome,
        String role
) {
}
