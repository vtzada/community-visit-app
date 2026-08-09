package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.dto.request.GrupoRequest;
import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.repository.GrupoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class GrupoService {

    private final GrupoRepository grupoRepository;

    @Transactional
    public Grupo criarGrupo(GrupoRequest dto, Usuario liderAutenticado) {

        Grupo grupo = new Grupo();
        grupo.setNome(dto.nome());
        grupo.setLider(liderAutenticado);
        grupo.setMembros(dto.membros() != null ? dto.membros() : new ArrayList<>());

        return grupoRepository.save(grupo);
    }

    public List<Grupo> listar() {
        return grupoRepository.findAll();
    }
}