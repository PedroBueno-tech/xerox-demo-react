import { DataTable as PrimeDataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

const DataTable = ({ documents, dossierName, selectedDoc}) => {
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    if (selectedRow) {
      selectedDoc(selectedRow.id);
    }
  }, [selectedRow, selectedDoc]);

  // Cria os dados para o DataTable
  const tableData = documents.map((doc, index) => ({
    ...doc,
    dossierName,
    id: index, // Garante que cada item tenha uma propriedade 'id'
  }));

  return (
    <PrimeDataTable
      value={tableData}
      selectionMode="single"
      selection={selectedRow}
      onSelectionChange={(e) => setSelectedRow(e.value)}
      dataKey="id" // Usando a propriedade 'id' como chave única
    >
      <Column field="dossierName" header="Dossier Id"></Column>
      <Column field="key" header="Filename"></Column>
    </PrimeDataTable>
  );
};

export default DataTable;
