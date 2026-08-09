package ise.com.br.community_visit_api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "enderecos")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String logradouro;

    private String numero;

    private String complemento;

    private String bairro;

    private String cep;

}
