import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import ClientService from "../services/client.service";

const isValidCPF = (strCPF) => {
  let sum;
  let rest;
  sum = 0;
  if (strCPF === "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(strCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(strCPF.substring(10, 11))) return false;
  return true;
};


const AddClient = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const initialValues = {
    nome: "",
    email: "",
    cpf: "",
    renda: "",
    telefone: "",
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("O nome é obrigatório"),

    email: Yup.string()
      .email("Digite um email válido")
      .required("O email é obrigatório"),

      cpf: Yup.string()
      .required("O CPF é obrigatório")
      .test("cpf", "CPF inválido", (value) => {
        const numericValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        return isValidCPF(numericValue); // Valida o CPF apenas com os números
      }),

    renda: Yup.string().required("Renda é obrigatório"),

    telefone: Yup.string()
      .transform((value, originalValue) => {
        // Remove todos os caracteres não numéricos
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length === 11) {
          // Aplica a máscara para telefones com DDD
          return numericValue.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
          );
        } else if (numericValue.length === 10) {
          // Aplica a máscara para telefones sem DDD
          return numericValue.replace(
            /^(\d{5})(\d{4})$/,
            "$1-$2"
          );
        }

        return value;
      })
      
  });

  const handleSubmit = (values) => {
    // Antes de enviar o CPF para a API, remova caracteres não numéricos
    const cleanedCPF = values.cpf.replace(/[^\d]/g, '');

    // Antes de enviar o telefone para a API, remova caracteres não numéricos
    const cleanedTelefone = values.telefone.replace(/[^\d]/g, '');
  
    const clientData = {
      ...values,
      cpf: cleanedCPF,
      telefone: cleanedTelefone,
      dataCriacao: selectedDate,
    };
  
    // Obtenha a data atual (sem horário)
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0); // Zere o horário
  
    // Verifique se a data de criação é igual ou posterior à data atual
    if (selectedDate >= dataAtual) {
      // Data de criação é válida, prossiga com o envio para a API
      ClientService.createClient(clientData)
        .then((response) => {
          if (response.data && response.data.message) {
            setSuccessMessage(response.data.message);
            setErrorMessage(""); // Limpa a mensagem de erro se houver
          } else {
            setSuccessMessage(""); // Limpa a mensagem de sucesso
            setErrorMessage("Mensagem de erro não encontrada na resposta da API.");
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setSuccessMessage(""); // Limpa a mensagem de sucesso se houver
          } else {
            setErrorMessage("Erro desconhecido ao processar a resposta da API.");
            setSuccessMessage(""); // Limpa a mensagem de sucesso se houver
          }
        });
    } else {
      // Data de criação é anterior à data atual, exiba uma mensagem de erro
      setErrorMessage("A data de criação não pode ser anterior à data atual.");
      setSuccessMessage("");
    }
  };
  
  

  return (
    
    <div className="col-md-12">
    <div className="card card-container">
      <h2>Adicionar Cliente</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <div className="form-group">
              <label>Nome:</label>
              <Field
                type="text"
                name="nome"
                className="form-control"
              />
              <ErrorMessage
                name="nome"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <Field
                type="text"
                name="email"
                className="form-control"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label>CPF:</label>
              <Field
                name="cpf"
              >
                {({ field }) => (
                  <InputMask
                    {...field}
                    mask="999.999.999-99"
                    maskChar="_"
                    className="form-control"
                  />
                )}
              </Field>
              <ErrorMessage
                name="cpf"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label>Renda:</label>
              <Field
                name="renda"
              >
                {({ field }) => (
                  <InputMask
                    {...field}
                    mask="99999.99"
                    className="form-control"
                    placeholder="12345.67" // Exemplo de formato}
                  />
                )}
              </Field>
  <ErrorMessage
    name="renda"
    component="div"
    className="error"
  />
</div>


            <div className="form-group">
              <label>Telefone:</label>
              <Field
                name="telefone"
              >
                {({ field }) => (
                  <InputMask
                    {...field}
                    mask="(99) 99999-9999"
                    maskChar="_"
                    className="form-control"
                  />
                )}
              </Field>
              <ErrorMessage
                name="telefone"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label>Data de Criação:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="dd/MM/yyyy HH:mm"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Adicionar Cliente
            </button>
          </Form>
        )}
      </Formik>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
    </div>
    </div>
   
  );
};

export default AddClient;
