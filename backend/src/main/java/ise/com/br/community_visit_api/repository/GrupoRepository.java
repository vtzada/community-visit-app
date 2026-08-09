package ise.com.br.community_visit_api.repository;

import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    Optional<Grupo> findByLider(Usuario lider);
}
