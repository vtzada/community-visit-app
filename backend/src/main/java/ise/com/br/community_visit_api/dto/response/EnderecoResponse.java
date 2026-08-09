package ise.com.br.community_visit_api.dto.response;

public record EnderecoResponse(
        Long id,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cep
) {
}