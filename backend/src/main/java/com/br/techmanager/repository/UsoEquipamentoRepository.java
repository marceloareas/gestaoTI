package com.br.techmanager.repository;

import com.br.techmanager.domain.uso.UsoEquipamento;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface UsoEquipamentoRepository extends JpaRepository<UsoEquipamento, Integer> {

    // Uma alocação ativa = data_devolucao IS NULL
    List<UsoEquipamento> findByEquipamentoIdAndDataDevolucaoIsNull(Integer equipamentoId);

    List<UsoEquipamento> findByFuncionarioIdAndDataDevolucaoIsNull(Integer funcionarioId);

    // Empréstimos vencidos (tipo_uso = 'emprestimo' e data_limite < hoje e sem devolução)
    @Query(value = """
    SELECT u.*
    FROM gestao_ti.uso_equipamento u
    JOIN gestao_ti.tipo_uso t ON t.id = u.tipo_uso_id
    WHERE t.codigo = 'emprestimo'
      AND u.data_devolucao IS NULL
      AND u.data_limite < :hoje
  """, nativeQuery = true)
    List<UsoEquipamento> findEmprestimosVencidos(@Param("hoje") LocalDate hoje);
}
