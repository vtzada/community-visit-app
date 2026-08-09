package ise.com.br.community_visit_api.mapper;

import ise.com.br.community_visit_api.dto.response.VisitaResponse;
import ise.com.br.community_visit_api.model.Visita;

public class VisitaMapper {

    private VisitaMapper() {
    }

    public static VisitaResponse toResponseDTO(Visita visita) {
        return new VisitaResponse(
                visita.getId(),
                SolicitacaoMapper.toResponseDTO(visita.getSolicitacao()),
                visita.getSolicitacao().getNomeSolicitante(),
                visita.getGrupo().getId(),
                visita.getGrupo().getNome(),
                visita.getStatusVisita(),
                visita.getDataHoraVisita(),
                visita.getObservacao()
        );
    }
}
