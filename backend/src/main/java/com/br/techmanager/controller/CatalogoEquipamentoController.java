package com.br.techmanager.controller;

import com.br.techmanager.domain.equipamento.ModeloEquipamento;
import com.br.techmanager.domain.equipamento.TipoEquipamento;
import com.br.techmanager.dto.equipamento.ModeloEquipamentoDTO;
import com.br.techmanager.dto.equipamento.TipoEquipamentoDTO;
import com.br.techmanager.repository.ModeloEquipamentoRepository;
import com.br.techmanager.repository.TipoEquipamentoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogoEquipamentoController {

    private final TipoEquipamentoRepository tipoRepo;
    private final ModeloEquipamentoRepository modeloRepo;

    public CatalogoEquipamentoController(TipoEquipamentoRepository tipoRepo,
                                         ModeloEquipamentoRepository modeloRepo) {
        this.tipoRepo = tipoRepo;
        this.modeloRepo = modeloRepo;
    }

    @GetMapping("/tipos-equipamento")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TipoEquipamentoDTO>> listarTipos() {
        List<TipoEquipamento> tipos = tipoRepo.findAllByOrderByNomeAsc();
        var out = tipos.stream()
                .map(t -> new TipoEquipamentoDTO(t.getId(), t.getNome()))
                .toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/modelos-equipamento")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ModeloEquipamentoDTO>> listarModelos(
            @RequestParam(value = "tipoId", required = false) Integer tipoId
    ) {
        List<ModeloEquipamento> modelos = (tipoId == null)
                ? modeloRepo.findAllByOrderByMarcaAscModeloAsc()
                : modeloRepo.findByTipoEquipamento_IdOrderByMarcaAscModeloAsc(tipoId);

        var out = modelos.stream()
                .map(m -> new ModeloEquipamentoDTO(
                        m.getId(), m.getMarca(), m.getModelo(),
                        m.getTipoEquipamento() != null ? m.getTipoEquipamento().getId() : null
                ))
                .toList();
        return ResponseEntity.ok(out);
    }
}
