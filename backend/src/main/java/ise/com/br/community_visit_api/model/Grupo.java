package ise.com.br.community_visit_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "grupos")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @OneToOne
    @JoinColumn(name = "lider_id", nullable = false, unique = true)
    private Usuario lider;

    @ElementCollection
    @CollectionTable(
            name = "grupo_membros",
            joinColumns = @JoinColumn(name = "grupo_id")
    )
    @Column(name = "nome_membro")
    private List<String> membros = new ArrayList<>();

}
