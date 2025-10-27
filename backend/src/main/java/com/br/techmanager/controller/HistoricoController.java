package com.br.techmanager.controller;

import com.br.techmanager.service.HistoricoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HistoricoController {

    private final HistoricoService service;

    public HistoricoController(HistoricoService service) {
        this.service = service;
    }

    @GetMapping("/historico")
    public ResponseEntity<Map<String, Object>> getHistorico(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "desc") String order
    ) {
        return ResponseEntity.ok(service.listar(q, page, perPage, order));
    }
}
