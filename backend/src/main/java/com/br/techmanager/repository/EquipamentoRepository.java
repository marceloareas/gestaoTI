package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.Equipamento;
import com.br.techmanager.dto.equipamento.EquipamentoListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Integer> {

  boolean existsByNumeroSerie(String numeroSerie);

  @Query(value = """
    SELECT
      e.id                              AS id,
      e.numero_serie                    AS numeroSerie,
      me.marca                          AS marca,
      me.modelo                         AS modelo,
      te.nome                           AS categoria,
      e.data_compra                     AS dataCompra,
      e.data_fim_garantia               AS dataFimGarantia,
      e.preco_compra                    AS precoCompra,
      e.observacoes                     AS observacoes,
      e.data_criacao                    AS dataCriacao,
      COALESCE(sa.status_atual, 'Em estoque') AS status
    FROM techmanager.equipamento e
    LEFT JOIN techmanager.modelo_equipamento me ON me.id = e.modelo_equipamento_id
    LEFT JOIN techmanager.tipo_equipamento te    ON te.id = me.tipo_equipamento_id
    LEFT JOIN techmanager.status_atual_equipamento sa ON sa.equipamento_id = e.id
    ORDER BY e.id
    """, nativeQuery = true)
  List<EquipamentoListItem> listarResumo();
}