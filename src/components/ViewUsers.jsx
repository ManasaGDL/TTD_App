import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apis from '../api/apis';
import { useEffect, useState } from 'react';
import { PencilIcon, CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useLoading } from './../context/LoadingContext';
import MyModal from './Common/MyModal';

function ViewUsers() {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const [openModal, setOpenModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');

  const columns = [
    { field: 'user_id', headerClassName: 'custom-header', headerName: 'ID', minWidth: 90, flex: 0.5 },
    { field: 'email', headerClassName: 'custom-header-bg', headerName: 'Email', minWidth: 200, flex: 1 },
    {
      field: 'FullName',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      valueGetter: (params, row) => `${row.first_name || ''} ${row.last_name || ''}`,
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
        <button
          onClick={() => {
            setOpenModal(true);
            setIdToDelete(params.row.user_id);
          }}
        >
          <CircleX className="text-red-500 text-center" />
        </button>
      ),
    },
  ];

  const handleDeleteUser = async (id) => {
    try {
      const res = await apis.deleteUser(id);
      toast.success('User deleted successfully!');
      setOpenModal(false);
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
      const filteredSuperUsers = response.data.filter(user => !user.is_superuser);
      setUsersList(filteredSuperUsers);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MyModal
        isOpen={openModal}
        id={idToDelete}
        handlePilgrimDelete={handleDeleteUser}
        setIsModalOpen={setOpenModal}
        title="Delete?"
        message="Are you sure to Delete the User"
      />
      <div className="w-full mx-auto sm:max-w-7xl mb-4 h-5/6 sm:h-[500px]">
        {usersList?.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-500">No users</p>
        )}
      </div>
    </>
  );
}

export default ViewUsers;
