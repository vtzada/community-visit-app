package ise.com.br.community_visit_api.service;

import ise.com.br.community_visit_api.dto.request.GrupoRequest;
import ise.com.br.community_visit_api.exception.ResourceNotFoundException;
import ise.com.br.community_visit_api.model.Grupo;
import ise.com.br.community_visit_api.model.Usuario;
import ise.com.br.community_visit_api.repository.GrupoRepository;
import ise.com.br.community_visit_api.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GrupoServiceTest {

}