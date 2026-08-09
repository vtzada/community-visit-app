package ise.com.br.community_visit_api.mapper;

import ise.com.br.community_visit_api.dto.request.SolicitacaoRequest;
import ise.com.br.community_visit_api.dto.response.EnderecoResponse;
import ise.com.br.community_visit_api.dto.response.SolicitacaoResponse;
import ise.com.br.community_visit_api.model.Endereco;
import ise.com.br.community_visit_api.model.Solicitacao;

public class SolicitacaoMapper {

    private SolicitacaoMapper() {
    }

    public static Solicitacao toEntity(SolicitacaoRequest dto) {
        Endereco endereco = new Endereco();
        endereco.setLogradouro(dto.endereco().getLogradouro());
        endereco.setNumero(dto.endereco().getNumero());
        endereco.setComplemento(dto.endereco().getComplemento());
        endereco.setBairro(dto.endereco().getBairro());
        endereco.setCep(dto.endereco().getCep());

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setNomeSolicitante(dto.nomeSolicitante());
        solicitacao.setTelefoneSolicitante(dto.telefoneSolicitante());
        solicitacao.setEndereco(endereco);
        solicitacao.setPedidoOracao(dto.pedidoOracao());

        return solicitacao;
    }

    public static SolicitacaoResponse toResponseDTO(Solicitacao solicitacao) {
        EnderecoResponse enderecoResponse = null;
        if (solicitacao.getEndereco() != null) {
            enderecoResponse = new EnderecoResponse(
                    solicitacao.getEndereco().getId(),
                    solicitacao.getEndereco().getLogradouro(),
                    solicitacao.getEndereco().getNumero(),
                    solicitacao.getEndereco().getComplemento(),
                    solicitacao.getEndereco().getBairro(),
                    solicitacao.getEndereco().getCep()
            );
        }

        return new SolicitacaoResponse(
                solicitacao.getId(),
                solicitacao.getNomeSolicitante(),
                solicitacao.getTelefoneSolicitante(),
                solicitacao.getPedidoOracao(),
                solicitacao.getStatusSolicitacao(),
                solicitacao.getDataSolicitacao(),
                enderecoResponse
        );
    }
}