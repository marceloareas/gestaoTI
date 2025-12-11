package com.br.techmanager.service;

import com.br.techmanager.domain.historico.HistoricoStatus;
import com.br.techmanager.domain.uso.UsoEquipamento;
import com.br.techmanager.dto.emprestimo.*;
import com.br.techmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final UsoEquipamentoRepository usoRepo;
    private final FuncionarioRepository funcRepo;
    private final EquipamentoRepository equipRepo;
    private final TipoUsoRepository tipoUsoRepo;
    private final StatusEquipamentoRepository statusRepo;
    private final HistoricoStatusRepository historicoRepo;

    private Integer findTipoUsoId(String codigo) {
        return tipoUsoRepo.findByCodigo(codigo)
                .map(t -> t.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "tipo inválido: " + codigo));
    }

    private Integer findStatusIdByNomeOrThrow(String nome) {
        return statusRepo.findByNome(nome)
                .map(s -> s.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Status não encontrado: " + nome));
    }

    @Transactional
    public EmprestimoResponse criar(EmprestimoCreateRequest r) {
        // valida existência
        funcRepo.findById(r.funcionarioId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        equipRepo.findById(r.equipamentoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado"));

        List<UsoEquipamento> usos = usoRepo.findByEquipamentoIdAndDataDevolucaoIsNull(r.equipamentoId());

        if (!usos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Equipamento já possui uso ativo"
            );
        }

        var tipoUsoId = findTipoUsoId(r.tipo().trim().toLowerCase());

        var hoje = LocalDate.now();
        var dataRetirada = (r.dataRetirada() != null) ? r.dataRetirada() : hoje;

        var uso = UsoEquipamento.builder()
                .funcionarioId(r.funcionarioId())
                .equipamentoId(r.equipamentoId())
                .tipoUsoId(tipoUsoId)
                .dataRetirada(dataRetirada)
                // data_limite é preenchida por trigger para "emprestimo"
                .observacoes(r.observacoes())
                .build();

        uso = usoRepo.save(uso);

        // Histórico: ao criar, item vai para "Em uso"
        var statusEmUsoId = findStatusIdByNomeOrThrow("Em uso");
        historicoRepo.save(HistoricoStatus.builder()
                .equipamentoId(r.equipamentoId())
                .statusId(statusEmUsoId)
                .dataAlteracao(LocalDateTime.now())
                .observacoes("Alocado ao funcionário ID " + r.funcionarioId())
                .build());

        return new EmprestimoResponse(
                uso.getId(),
                uso.getFuncionarioId(),
                uso.getEquipamentoId(),
                r.tipo().trim().toLowerCase(),
                uso.getDataRetirada(),
                uso.getDataLimite(),
                uso.getDataDevolucao(),
                uso.getObservacoes()
        );
    }

    @Transactional
    public EmprestimoResponse devolver(Integer id, DevolucaoRequest r) {
        var uso = usoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Uso/Empréstimo não encontrado"));

        if (uso.getDataDevolucao() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este empréstimo já foi devolvido");
        }

        var dataDev = r.dataDevolucao();
        if (dataDev.isBefore(uso.getDataRetirada())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "dataDevolucao não pode ser anterior à dataRetirada");
        }

        uso.setDataDevolucao(dataDev);
        if (r.observacoes() != null && !r.observacoes().isBlank()) {
            var obs = uso.getObservacoes();
            uso.setObservacoes((obs == null || obs.isBlank()) ? r.observacoes() : (obs + " | " + r.observacoes()));
        }
        uso = usoRepo.save(uso);

        // Histórico: ao devolver, item volta a "Em estoque"
        var statusEstoqueId = findStatusIdByNomeOrThrow("Em estoque");
        historicoRepo.save(HistoricoStatus.builder()
                .equipamentoId(uso.getEquipamentoId())
                .statusId(statusEstoqueId)
                .dataAlteracao(LocalDateTime.now())
                .observacoes("Devolvido do uso ID " + uso.getId())
                .build());

        // descobrir o "tipo" textual pelo id (se quiser enriquecer a resposta)
        var tipo = tipoUsoRepo.findById(uso.getTipoUsoId()).map(t -> t.getCodigo()).orElse("?");

        return new EmprestimoResponse(
                uso.getId(),
                uso.getFuncionarioId(),
                uso.getEquipamentoId(),
                tipo,
                uso.getDataRetirada(),
                uso.getDataLimite(),
                uso.getDataDevolucao(),
                uso.getObservacoes());
    }
}
