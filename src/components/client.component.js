import React, { useState, useEffect, useMemo, useRef } from "react";
import ClientService from "../services/client.service";
import { useTable } from "react-table";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Função para formatar o CPF
const formatCPF = (cpf) => {
  // Verifique se o CPF tem 11 dígitos
  if (cpf && cpf.length === 11) {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
  }
  return cpf;
};

// Função para formatar o número de telefone
const formatPhoneNumber = (phoneNumber) => {
  // Verifique se o número de telefone possui 11 ou 10 dígitos
  if (phoneNumber && (phoneNumber.length === 11 || phoneNumber.length === 10)) {
    const ddd = phoneNumber.slice(0, 2);
    const firstPart = phoneNumber.slice(2, 6);
    const secondPart = phoneNumber.slice(6);

    if (phoneNumber.length === 11) {
      return `(${ddd}) ${firstPart}-${secondPart}`;
    } else {
      return `(${ddd}) ${firstPart.slice(0, 5)}-${firstPart.slice(5)}${secondPart}`;
    }
  }
  return phoneNumber;
};

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const clientsRef = useRef([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para armazenar a mensagem de erro

  useEffect(() => {
    retrieveClients();
  }, [currentPage]);

  const retrieveClients = async () => {
    try {
      const response = await ClientService.getAllClients();
      clientsRef.current = response.data;
      setClients(paginateData(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const paginateData = (data) => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const deleteClient = (id) => {
    // Fazer a solicitação de exclusão para o servidor com base no ID do cliente
    ClientService.removeClient(id)
      .then(() => {
        // Recarregar a lista de clientes após a exclusão bem-sucedida
        retrieveClients();
      })
      .catch((error) => {
        // Verificar o código de status da resposta para determinar se é um erro de permissão
        if (error.response && error.response.status === 401) {
          setErrorMessage("Você não tem permissão para excluir este cliente.");
        } else {
          console.log(error);
        }
      });
  };

  const formatRenda = (renda) => {
    // Verifique se a renda é um número válido
    if (typeof renda === "number") {
      // Converta a renda para uma string e substitua o ponto decimal por uma vírgula
      const rendaFormatada = renda.toFixed(2).replace(".", ",");
      
      // Insira um ponto como separador de milhares
      const partes = rendaFormatada.split(",");
      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      
      return partes.join(",");
    }
  
    // Se não for um número, retorne a renda como está
    return renda;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "nome",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "CPF",
        accessor: "cpf",
        Cell: ({ value }) => formatCPF(value),
      },
      {
        Header: "Renda",
        accessor: "renda",
        Cell: ({ value }) => formatRenda(value),
      },
      {
        Header: "Telefone",
        accessor: "telefone",
        Cell: ({ value }) => formatPhoneNumber(value),
      },
      {
        Header: "Data de Criação",
        accessor: "dataCriacao",
        Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy HH:mm"),
      },
      {
        Header: 'Ações',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            <span
              onClick={() => deleteClient(row.original.id)}
              style={{ cursor: 'pointer' }} // Defina o estilo do cursor para indicar que é clicável
            >
              <FontAwesomeIcon icon={faTrash} className="action" />
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: clients,
  });

  const itemsPerPage = 11;
  
  return (
    <div className="container">
      <h2>Lista de Clientes</h2>
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      <div className="list row">
        <div className="col-md-12 list">
          <table
            className="table table-striped table-bordered"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Próxima"}
        pageCount={Math.ceil(clientsRef.current.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default ClientsList;
