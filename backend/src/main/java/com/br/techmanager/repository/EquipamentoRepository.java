package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Integer> {
    boolean existsByNumeroSerie(String numeroSerie);
}
