import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apis from '../api/apis';
import { useEffect, useState } from 'react';
import { PencilIcon, CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useLoading } from './../context/LoadingContext';

function ViewUsers() {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const columns = [
    { field: 'user_id', headerClassName: 'custom-header', headerName: 'ID', minWidth: 90, flex: 0.5 },
    { field: 'email', headerClassName: 'custom-header-bg', headerName: 'Email', minWidth: 200, flex: 1 },
    {
      field: 'FullName',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      valueGetter: (params,row) => `${row.first_name || ''} ${row.last_name || ''}`,
    },
    { field: 'phone_number', headerName: 'Phone', minWidth: 150, flex: 0.7 },
    {
      field: 'is_mla',
      headerName: 'Role',
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (params.value ? 'MLA' : 'MP'),
    },
    {
      field: 'constituency',
      headerName: 'Constituency',
      minWidth: 100,
      flex: 0.5,
      
    },
    {
      field: 'edit',
      headerName: 'Edit',
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <button
          className="text-green-700"
          onClick={() => navigate(`/edit_user/${params.row.user_id}`, { state: params.row })}
        >
          <PencilIcon />
        </button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      minWidth: 140,
      flex: 0.5,
      renderCell: (params) => (
        <button onClick={() => handleDeleteUser(params.row.user_id)}>
          <CircleX className="text-red-500 text-center" />
        </button>
      ),
    },
  ];

  const handleDeleteUser = async (id) => {
    try {
      const res = await apis.deleteUser(id);
      toast.success('User deleted successfully!');
      getUsers();
    } catch (e) {
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apis.getAllUsers();
      const filteredSuperUsers = response.data.filter(user => {
      
        return user.is_superuser!==true})
      console.log("filtered",filteredSuperUsers)
      console.log(response?.data);
      setUsersList(filteredSuperUsers);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="w-full mx-auto sm:max-w-7xl mb-4 h-5/6 sm:h-[500px]">
        {usersList?.length > 0 && (
          <DataGrid
            rows={usersList}
            columns={columns}
            disableSelectionOnClick
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5]}
            className="h-full"
            getRowId={(row) => row.user_id}
          />
        )}
      </div>
    </>
  );
}

export default ViewUsers;
