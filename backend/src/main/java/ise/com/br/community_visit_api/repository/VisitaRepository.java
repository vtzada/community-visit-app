package ise.com.br.community_visit_api.repository;


import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Visita;
import ise.com.br.community_visit_api.model.enums.StatusVisita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitaRepository extends JpaRepository<Visita, Long> {

    boolean existsByGrupoAndDataHoraVisitaAndStatusVisita(Grupo grupo, LocalDateTime dataHoraDaVisita, StatusVisita status);
    List<Visita> findByStatusVisita(StatusVisita statusVisita);
    List<Visita> findByGrupo(Grupo grupo);
    List<Visita> findByGrupoAndStatusVisita(Grupo grupo, StatusVisita status);
    boolean existsByGrupoAndDataHoraVisitaInAndStatusVisita(Grupo grupo, List<LocalDateTime> datasHoraVisita, StatusVisita statusVisita);
}
