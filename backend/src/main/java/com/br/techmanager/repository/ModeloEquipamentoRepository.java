package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.ModeloEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModeloEquipamentoRepository extends JpaRepository<ModeloEquipamento, Integer> {
    List<ModeloEquipamento> findAllByOrderByMarcaAscModeloAsc();
    List<ModeloEquipamento> findByTipoEquipamento_IdOrderByMarcaAscModeloAsc(Integer tipoEquipamentoId);
}
