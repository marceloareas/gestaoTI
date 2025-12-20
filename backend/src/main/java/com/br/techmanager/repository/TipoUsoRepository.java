package com.br.techmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.br.techmanager.domain.uso.TipoUso;
import java.util.Optional;

public interface TipoUsoRepository extends JpaRepository<TipoUso, Integer> {

    // Caso já tenha a entidade TipoUso mapeada, ou crie uma simples com (id, codigo, descricao)
    Optional<TipoUso> findByCodigo(String codigo);

    // Se você ainda não tem a entidade TipoUso, você pode buscar por query nativa.
    // @Query(value = "SELECT id FROM techmanager.tipo_uso WHERE codigo = :codigo", nativeQuery = true)
    // Optional<Integer> findIdByCodigo(String codigo);
}
