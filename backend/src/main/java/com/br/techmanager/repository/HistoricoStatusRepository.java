package com.br.techmanager.repository;

import com.br.techmanager.domain.historico.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Integer> {}