package ise.com.br.community_visit_api.model;

import ise.com.br.community_visit_api.model.enums.StatusVisita;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "visitas")
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @Enumerated(EnumType.STRING)
    private StatusVisita statusVisita = StatusVisita.AGENDADA;

    @Column(nullable = false)
    private LocalDateTime dataHoraVisita;

    private String observacao;
}