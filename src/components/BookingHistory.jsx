import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog } from "@mui/material";
import apis from "../api/apis";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import PilgrimDialog from "./PilgrimDialog";
export default function BookingHistory() {
    const [history, setHistory] = useState({ results: [] });
    const [fHistory, setFHistory] = useState(history.results);

    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [filters, setFilters] = useState({
        username: "",
        constituency: "",
    });
    const handleFilterChange = (e) => {
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCurrentRow(null);
    };
    function handleButtonClick(i) {
        if (fHistory) setCurrentRow(fHistory?.find((row) => row.id == i));
        handleOpen();
    }

    const [page, setPage] = useState(1);
    async function fetchUserHistory(page) {
        apis.getUserHistory(page)
            .then((data) => {
                // console.log(data.data.results);
                const results = data.data.results.map((row) => ({ ...row, id: row.user_id }));
                setHistory({ ...data.data, results });
                setFHistory(results);
            })
            .catch((error) => {});
    }
    useEffect(() => {
        fetchUserHistory(page);
    }, [page]);

    useEffect(() => {
        const filtered = history.results.filter((i) => {
            const matchesConstituency = filters.constituency !== "" ? i.constituency.toLowerCase().includes(filters.constituency.toLowerCase()) : true;
            const matchesUsername = filters.username !== "" ? i.username.toLowerCase().includes(filters.username.toLowerCase()) : true;
            return matchesConstituency && matchesUsername;
        });

        setFHistory(filtered);
    }, [filters, history]);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },

        {
            field: "username",
            headerName: "Username",
        },
        {
            field: "constituency",
            headerName: "Constituency",
        },
        {
            field: "pilgrim_count",
            headerName: "Pilgrim Count",
            width: 160,
        },
    ];

    return (
        <div className="w-full  p-4 pl-20">
            <div className="flex gap-2 items-center">
                <div className="text-sm font-semibold text-zinc-400">Filters:</div>
                <div className="relative z-0 w-64 group">
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={handleFilterChange}
                        placeholder=" "
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    />
                    <label
                        htmlFor="username"
                        className="absolute text-sm select-none text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Username
                    </label>
                </div>
                <div className="relative z-0 w-64 group">
                    <input
                        type="text"
                        name="constituency"
                        id="constituency"
                        onChange={handleFilterChange}
                        placeholder=" "
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    />
                    <label
                        htmlFor="constituency"
                        className="absolute text-sm select-none text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Constituency
                    </label>
                </div>
            </div>
            <div className="py-2 space-x-2">
                <Button
                    color="info"
                    variant="outlined"
                    size="small"
                    disabled={page <= 1}
                    onClick={() => {
                        if (page > 1) setPage((prev) => page - 1);
                    }}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    color="info"
                    variant="outlined"
                    size="small"
                    disabled={history.next === null}
                    onClick={() => {
                        if (history.next !== null) setPage((prev) => page + 1);
                    }}
                >
                    <ChevronRight />
                </Button>
            </div>
            <DataGrid
                style={{ minHeight: "100px" }}
                rows={fHistory}
                columns={[
                    ...columns,
                    {
                        field: "details",
                        headerName: "Details",
                        width: 150,
                        renderCell: (params) => (
                            <Button color="primary" onClick={() => handleButtonClick(params.row.id)}>
                                <Ellipsis />
                            </Button>
                        ),
                    },
                ]}
                disableRowSelectionOnClick
            />
            <PilgrimDialog open={open} handleClose={handleClose} currentRow={currentRow} />
        </div>
    );
}
