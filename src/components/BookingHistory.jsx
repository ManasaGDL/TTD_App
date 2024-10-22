import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog } from "@mui/material";
import { result } from "./results";
import { parseISO, format, getYear, getMonth } from "date-fns";
export default function BookingHistory() {
    const [fields, setFields] = useState({ constituency: "", month: "", year: "" });

    const [history, setHistory] = useState(result);
    const [filteredHistory, setFilteredHistory] = useState(history);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const years = Array.from({ length: getYear(new Date()) - 2000 + 1 }, (_, i) => getYear(new Date()) - i);
    const months = Array.from({ length: 12 }, (_, i) => i+1);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
    };
    function handleButtonClick(i) {
        if (filteredHistory) setCurrentRow(filteredHistory?.find((row) => row.id == i));
        handleOpen();
    }
    function handleChangeFields(e) {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }
    useEffect(() => {
        const filtered = history.filter((i) => {
            const matchesConstituency = fields.constituency!=='' ? i.constituency.toLowerCase().includes(fields.constituency.toLowerCase()) : true;
            const matchesMonth = fields.month !==''
                ? new Date(i.date).getMonth() + 1 === parseInt(fields.month) // month is 1-based
                : true;
            const matchesYear = fields.year!=='' ? new Date(i.date).getFullYear() === parseInt(fields.year) : true;
            console.log(fields.month);

            return matchesConstituency && matchesMonth && matchesYear;
        });

        setFilteredHistory(filtered);
    }, [fields, history]);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "date",
            headerName: "Date",
            width: 150,
        },
        {
            field: "constituency",
            headerName: "Constituency",
        },
        {
            field: "username",
            headerName: "Username",
        },
        {
            field: "pilgrim_count",
            headerName: "Pilgrim Count",
            width: 160,
        },
    ];

    return (
        <div className="w-full  p-4 pl-20">
            <div className="filters flex gap-4 py-4 items-center">
                <div className="font-semibold text-zinc-600 text-sm ">Filters:</div>
                <div className="relative z-0 w-64 group">
                    <input
                        type="text"
                        name="constituency"
                        id="constituency"
                        onChange={handleChangeFields}
                        placeholder=" "
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    />
                    <label
                        htmlFor="constituency"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Constituency
                    </label>
                </div>
                <div className="relative z-0 w-64  group">
                    <select
                        id="month"
                        placeholder=" "
                        name="month"
                        onChange={handleChangeFields}
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    >
                        <option value=''>Select Month</option>
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {format(new Date(0, month-1), "MMMM")}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative z-0 w-64 group">
                    <select
                        id="year"
                        placeholder=" "
                        name="year"
                        onChange={handleChangeFields}
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    >
                        <option value={''}>Select Year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <div className="mx-auto block text-lg font-semibold p-4">Pilgrim Details</div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                    {currentRow !== null ? (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Phone Number</th>
                                    <th className="px-6 py-3">Aadhar</th>
                                    <th className="px-6 py-3">Booked Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRow?.pilgrims?.map((i) => {
                                    return (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td class="px-6 py-4">{i.pilgrim_id}</td>
                                            <td class="px-6 py-4">{i.pilgrim_name}</td>
                                            <td class="px-6 py-4">{i.phone_number}</td>
                                            <td class="px-6 py-4">{i.aadhaar_number}</td>
                                            <td class="px-6 py-4">{format(parseISO(i.booked_datetime), "dd MMM yyyy")}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        "loading"
                    )}
                </div>
            </Dialog>
            <DataGrid
                rows={filteredHistory}
                columns={[
                    ...columns,
                    {
                        field: "details",
                        headerName: "Details",
                        width: 150,
                        renderCell: (params) => (
                            <Button variant="contained" color="primary" onClick={() => handleButtonClick(params.row.id)}>
                                Details
                            </Button>
                        ),
                    },
                ]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </div>
    );
}
