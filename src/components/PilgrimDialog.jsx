import { Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import { parseISO, format, getYear } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import apis from "../api/apis";

export default function PilgrimDialog({ open, handleClose, currentRow }) {
    const [fields, setFields] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() });
    const [pilgrims,setPilgrims]=useState({results:[]})
    const years = Array.from({ length: getYear(new Date()) - 2000 + 1 }, (_, i) => getYear(new Date()) - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    function handleChangeFields(e) {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }
 
    async function fetchPilgrims(month,year,userId){
        apis.getPilgrimsForAdmin(month,year,userId)
        .then((data)=>{
            const results = data.data.results.map((row)=>({...row,id:row.pilgrim_id}))
            setPilgrims({...data.data,results})
            
        })
        .catch((error)=>{

        })
    }
    useEffect(()=>{        
        if(currentRow) fetchPilgrims(fields.month,fields.year,currentRow?.id);
    },[fields,currentRow])
    const columns = [
        { field: "id", headerName:<span style={{ fontWeight: 600 }}>ID</span>, width: 100 },
        {
            field: "booked_datetime",
            headerName: <span style={{ fontWeight: 600 }}>Booking Date</span>,
            width:140,
            valueGetter: (params) => {
                const dateValue = params;
                // Check if dateValue is valid before trying to parse it
                return dateValue ? format(parseISO(dateValue), "dd-MM-yyyy") : 'a';
            },
        },

        {
            field: "pilgrim_name",
            headerName: <span style={{ fontWeight: 600 }}>Name</span>,
            flex: 1,
        },
        {
            field: "phone_number",
            headerName: <span style={{ fontWeight: 600 }}>Phone Number</span>,
            width: 140,
        },
        {
            field: "aadhaar_number",
            headerName: <span style={{ fontWeight: 600 }}>Aadhar</span>,
            width: 150,
        },
        {
            field: "age",
            headerName: <span style={{ fontWeight: 600 }}>Age</span>,
            width: 90,
        },
        // {
        //     field: "gender",
        //     headerName: <b>Gender</b>,
        //     width: 90,
        // },
        {
            field: "seva",
            headerName: <span style={{ fontWeight: 600 }}>Seva</span>,
            width: 90,
        },
    ];
    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='lg'>
            <div className="p-4">
                <div className="mx-auto block text-lg font-semibold p-4">Pilgrim Details</div>
                <div className="filters flex gap-4 py-4 items-center">
                    <div className="font-semibold text-zinc-600 text-sm ">Filters:</div>
                    <div className="relative z-0 w-64  group">
                        <select
                            id="month"
                            placeholder=" "
                            name="month"
                            value={fields.month}
                            onChange={handleChangeFields}
                            className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        >
                            <option value="">Select Month</option>
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {format(new Date(0, month - 1), "MMMM")}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative z-0 w-64 group">
                        <select
                            id="year"
                            placeholder=" "
                            name="year"
                            value={fields.year}
                            onChange={handleChangeFields}
                            className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        >
                            <option value={""}>Select Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                    {currentRow !== null ? <DataGrid style={{ minHeight: "100px" }} rows={pilgrims.results} columns={columns} /> : "loading"}
                </div>
            </div>
        </Dialog>
    );
}
