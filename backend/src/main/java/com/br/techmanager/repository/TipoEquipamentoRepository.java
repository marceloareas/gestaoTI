package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.TipoEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoEquipamentoRepository extends JpaRepository<TipoEquipamento, Integer> {
    List<TipoEquipamento> findAllByOrderByNomeAsc();
}