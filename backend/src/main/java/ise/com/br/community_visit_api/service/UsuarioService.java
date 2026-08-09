package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.dto.request.UsuarioRequest;
import ise.com.br.community_visit_api.exception.BusinessRuleException;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario cadastrar(UsuarioRequest dto) {

        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new BusinessRuleException("Já existe um usuário com esse email.");
        }
        Usuario usuario = Usuario.builder()
                .nome(dto.nome())
                .email(dto.email())
                .senha(passwordEncoder.encode(dto.senha()))
                .telefone(dto.telefone())
                .role(dto.role())
                .build();

        return usuarioRepository.save(usuario);
    }

}
