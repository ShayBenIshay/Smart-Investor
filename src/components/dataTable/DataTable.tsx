import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import Image from "next/image";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  mutation: (id: Number) => Promise<void | { error: string }>;
};

const DataTable = (props: Props) => {
  const formattedRows = props.rows.map((row) => {
    const newRow = { ...row };
    Object.keys(newRow).forEach((key) => {
      const value = newRow[key];
      if (typeof value === "number") {
        newRow[key] = Number.isInteger(value) ? value : value.toFixed(2);
      }
    });
    return newRow;
  });

  const handleDelete = async (id: number) => {
    await props.mutation(id);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Image src="/view.svg" alt="" width={20} height={20} />
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <Image src="/delete.svg" alt="" width={20} height={20} />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={formattedRows}
        columns={
          props.slug === "portfolio"
            ? [...props.columns]
            : [...props.columns, actionColumn]
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
