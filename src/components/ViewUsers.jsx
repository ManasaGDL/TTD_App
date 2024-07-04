import * as React from 'react';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import apis from '../api/apis';
import { useEffect, useState } from 'react';
import { PencilIcon,CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



function ViewUsers() {
const [ usersList , setUsersList] = useState();
const navigate = useNavigate()
const columns = [
  { field: 'user_id', 
  headerClassName: 'custom-header',
    headerName: 'ID', width: 10, },
  { field: 'email',
    headerClassName: 'custom-header-bg', headerName: 'Email', flex:1},
  // { field: 'first_name', headerName: 'FirstName', width: 150 },
  // { field: 'last_name', headerName: 'LastName', width: 150 },
  { field:"FullName",headerName:'Name', flex:0.8,valueGetter: (value, row) => {
    return `${row.first_name || ''} ${row.last_name || ''}`;
  }},
  // { field: 'password', headerName: 'Password', width: 150 },
  { field: 'phone_number', headerName: 'Phone', width: 150 ,flex:0.7},
  { field: 'is_mla', headerName: 'Role', flex:0.5 ,renderCell:(params)=>{
    return params.value?'MLA':'MP'
  }},
  {
    field:'edit',
    headerName:"Edit",
    flex:0.5,
    renderCell:(params)=>{
      console.log(params)
 return <button className="text-green-700" onClick={()=>navigate(`/edit_user/${params.row.user_id}`,{state:params.row})}><PencilIcon /></button>
    }
  },
  {
    field:'delete',
    headerName:"Delete",
    flex:0.5,
    renderCell:(params)=>{
 return <button><CircleX  className="text-red-500 text-center"/></button>
    }
  }
];

useEffect(()=>{
getUsers()
},[])
 const getUsers= async()=>{
try{
 const response = await apis.getAllUsers();
 console.log(response?.data)
setUsersList(response?.data)
}
catch(e)
{
console.log(e)
}
 }

  return (
    <div className="w-full mx-auto h-7xl sm:max-w-4xl mb-4 h-5/6" style={{ height: '500px' }}>
      {usersList?.length >0 && <DataGrid rows={usersList} columns={columns}  disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }} 
        getRowId={(row) => row.user_id}
        />}
    </div>
  );
}

export default ViewUsers;
