package ise.com.br.community_visit_api.mapper;

import ise.com.br.community_visit_api.dto.response.GrupoResponse;
import ise.com.br.community_visit_api.model.Grupo;

public class GrupoMapper {

    private GrupoMapper() {
    }

    public static GrupoResponse toResponseDTO(Grupo grupo) {
        return new GrupoResponse(
                grupo.getId(),
                grupo.getNome(),
                grupo.getLider().getNome(),
                grupo.getMembros()
        );
    }

}
