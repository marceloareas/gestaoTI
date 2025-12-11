package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.StatusEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusEquipamentoRepository extends JpaRepository<StatusEquipamento, Integer> {
    Optional<StatusEquipamento> findByNome(String nome);
}
