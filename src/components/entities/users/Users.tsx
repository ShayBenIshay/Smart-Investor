"use client";

import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/components/dataTable/DataTable";
import "./users.scss";
import { useState } from "react";
import Add from "@/components/add/Add";
import { addUser, deleteUser } from "@/lib/action";
import { userFormInput } from "@/data/forms";

const columns: GridColDef[] = [
  {
    field: "firstName",
    type: "string",
    headerName: "First name",
    width: 150,
  },
  {
    field: "lastName",
    type: "string",
    headerName: "Last name",
    width: 150,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },

  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const Users = ({ users }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>
      <DataTable
        slug="users"
        columns={columns}
        rows={users}
        mutation={deleteUser}
      />
      {open && (
        <Add
          slug="user"
          formInput={userFormInput}
          setOpen={setOpen}
          mutation={addUser}
        />
      )}
    </div>
  );
};

export default Users;
