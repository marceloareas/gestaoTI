package com.br.techmanager.service;

import com.br.techmanager.domain.historico.HistoricoView;
import com.br.techmanager.dto.historico.HistoricoItemResponse;
import com.br.techmanager.repository.HistoricoRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    private final HistoricoRepository repo;

    public HistoricoService(HistoricoRepository repo) {
        this.repo = repo;
    }

    public Map<String, Object> listar(String q, int page, int perPage, String order) {
        int pageIdx = Math.max(page - 1, 0);
        int size = Math.min(Math.max(perPage, 1), 100);

        Sort.Direction dir = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(dir, "dataEvento").and(Sort.by(Sort.Direction.DESC, "idEvento"));

        Page<HistoricoView> p = repo.search(q, PageRequest.of(pageIdx, size, sort));

        List<HistoricoItemResponse> items = p.getContent().stream().map(h -> {
            HistoricoItemResponse r = new HistoricoItemResponse();
            r.idEvento       = h.getIdEvento();
            r.dataEvento     = h.getDataEvento();
            r.equipamentoId  = h.getEquipamentoId();
            r.numeroSerie    = h.getNumeroSerie();
            r.marca          = h.getMarca();
            r.modelo         = h.getModelo();
            r.funcionarioId  = h.getFuncionarioId();
            r.funcionarioNome= h.getFuncionarioNome();
            r.tipoUso        = h.getTipoUso();
            r.statusEvento   = h.getStatusEvento();
            r.tipoEvento     = h.getTipoEvento();
            r.observacoes    = h.getObservacoes();
            return r;
        }).collect(Collectors.toList());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("page", pageIdx + 1);
        out.put("perPage", size);
        out.put("total", p.getTotalElements());
        out.put("totalPages", Math.max(p.getTotalPages(), 1));
        out.put("items", items);
        return out;
    }
}
