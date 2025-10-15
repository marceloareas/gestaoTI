package com.br.techmanager.controller;

import com.br.techmanager.dto.equipamento.*;
import com.br.techmanager.service.EquipamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
@RequiredArgsConstructor
public class EquipamentoController {
    private final EquipamentoService service;

    @GetMapping
    public List<EquipamentoListItem> listarResumo() {
        return service.listarResumo();
    }


    @PostMapping
    public ResponseEntity<EquipamentoResponse> criar(@Valid @RequestBody EquipamentoRequest req) {
        var resp = service.criar(req);
        return ResponseEntity.created(URI.create("/api/equipamentos/" + resp.id())).body(resp);
    }

    @PutMapping("/{id}")
    public EquipamentoResponse atualizar(@PathVariable Integer id, @Valid @RequestBody EquipamentoRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
