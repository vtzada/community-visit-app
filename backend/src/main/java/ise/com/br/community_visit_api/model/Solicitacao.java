package ise.com.br.community_visit_api.model;

import ise.com.br.community_visit_api.model.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "solicitacoes")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeSolicitante;

    private String telefoneSolicitante;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    private String pedidoOracao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao statusSolicitacao = StatusSolicitacao.PENDENTE;

    private LocalDateTime dataSolicitacao;

    @PrePersist
    public void prePersist() {
        this.dataSolicitacao = LocalDateTime.now();
    }
}