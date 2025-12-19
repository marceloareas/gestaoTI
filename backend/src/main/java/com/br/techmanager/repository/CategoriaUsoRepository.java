package com.br.techmanager.repository;

import com.br.techmanager.domain.equipamento.CategoriaUso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaUsoRepository extends JpaRepository<CategoriaUso, Integer> {

    List<CategoriaUso> findAllByOrderByDescricaoAsc();
}
