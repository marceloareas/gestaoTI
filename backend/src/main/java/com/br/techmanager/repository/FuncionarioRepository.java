package com.br.techmanager.repository;

import com.br.techmanager.domain.funcionario.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    boolean existsByNumeroRegistro(String numeroRegistro);
    boolean existsByEmail(String email);
}
