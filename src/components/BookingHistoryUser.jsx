//booking history specially for user ie MLA or MP
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseISO, format, getYear } from "date-fns";
import apis from "../api/apis";

export default function BookingHistoryUser() {
    const [pilgrims, setPilgrims] = useState({ results: [] });

    // const [page, setPage] = useState(1);
    const [fields, setFields] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    const years = Array.from({ length: getYear(new Date()) - 2000 + 1 }, (_, i) => getYear(new Date()) - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    function handleChangeFields(e) {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function fetchPilgrims(month, year) {
        apis.getPilgrimsForUser(month, year)
            .then((data) => {
                console.log(data.data);
                const results = data.data.results
                    .map((row) => ({
                        ...row,
                        id: row.pilgrim_id,
                        booked_datetime: format(row.booked_datetime, "dd MMM yyyy"),
                    }))
                    .reverse();
                setPilgrims({ ...data.data, results });
            })
            .catch((error) => {});
    }

    useEffect(() => {
        fetchPilgrims(Number(fields.month), Number(fields.year));
    }, [fields]);

    const columns = [
        { field: "id", headerName: <b>ID</b>, width: 70 },
        {
            field: "booked_datetime",
            headerName: <b>Booking Date</b>,
            width: 150,
        },

        {
            field: "pilgrim_name",
            headerName: <b>Name</b>,
            flex: 1,
        },
        {
            field: "phone_number",
            headerName: <b>Phone Number</b>,
            width: 140,
        },
        {
            field: "aadhaar_number",
            headerName: <b>Aadhar</b>,
            width: 150,
        },
        {
            field: "age",
            headerName: <b>Age</b>,
            width: 90,
        },
        // {
        //     field: "gender",
        //     headerName: "Gender",
        //     width: 90,
        // },
        {
            field: "seva",
            headerName: <b>Seva</b>,
            width: 90,
        },
    ];
    return (
        <div>
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

            <DataGrid style={{ minHeight: "100px" }} rows={pilgrims.results} columns={columns} disableRowSelectionOnClick />
        </div>
    );
}
