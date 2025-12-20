import * as yup from "yup";

export const schemaAdd = yup.object().shape({
  numeroSerie: yup
    .string()
    .trim()
    .required("Informe o número de série."),
  categoriaId: yup
    .number()
    .typeError("Selecione o tipo de equipamento.")
    .required("Selecione o tipo de equipamento."),
  modeloEquipamentoId: yup
    .number()
    .typeError("Selecione o modelo do equipamento.")
    .required("Selecione o modelo do equipamento."),
  dataCompra: yup.date().nullable(true),
  dataFimGarantia: yup.date().nullable(true),
  precoCompra: yup
    .number()
    .nullable(true)
    .min(0, "O preço não pode ser negativo."),
  observacoes: yup.string().nullable(true),
});

export const schemaEdit = yup.object().shape({
  numeroSerie: yup
    .string()
    .trim()
    .required("Informe o número de série."),
  categoriaId: yup
    .number()
    .typeError("Selecione o tipo de equipamento.")
    .required("Selecione o tipo de equipamento."),
  modeloEquipamentoId: yup
    .number()
    .typeError("Selecione o modelo do equipamento.")
    .required("Selecione o modelo do equipamento."),
  dataFimGarantia: yup.date().nullable(true),
  precoCompra: yup
    .number()
    .nullable(true)
    .min(0, "O preço não pode ser negativo."),
  observacoes: yup.string().nullable(true),
});
