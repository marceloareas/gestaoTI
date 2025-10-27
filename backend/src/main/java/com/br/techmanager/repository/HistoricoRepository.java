package com.br.techmanager.repository;

import com.br.techmanager.domain.historico.HistoricoView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

public interface HistoricoRepository extends JpaRepository<HistoricoView, String> {

    @Query("""
        SELECT h FROM HistoricoView h
        WHERE (:q IS NULL OR :q = '' OR
               LOWER(h.numeroSerie)    LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.funcionarioNome)LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.marca)          LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.modelo)         LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.tipoEvento)     LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.statusEvento)   LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(h.observacoes)    LIKE LOWER(CONCAT('%', :q, '%'))
        )
        """)
    Page<HistoricoView> search(String q, Pageable pageable);
}
