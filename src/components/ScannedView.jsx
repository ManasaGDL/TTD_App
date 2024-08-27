import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apis from "../api/apis";
import { format, parseISO } from "date-fns";
import ChakramSpinner from "./Common/ChakramSpinner";
import { CircleCheck } from "lucide-react";

export default function ScannedView() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    if (id) {
        useEffect(() => {
            apis.getScanner(id)
                .then((res) => {
                    setData(res.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        }, [id]);
        return (
            <div>
                {isLoading ? (
                    <ChakramSpinner />
                ) : (
                    <div className="mx-auto mt-12 w-11/12 md:w-8/12 lg:w-6/12">
                        <div className="overflow-x-auto">
                            <div className="mx-auto w-min grid place-items-center gap-2 p-2">
                                <CircleCheck className="w-16 h-16 text-custom-header-bg " />
                                <div className="">Verified</div>
                            </div>
                            <div className="flex justify-center items-center gap-2 pb-3 font-mono">
                                <p className="text-gray-600 mb-2">
                                    <strong>Name:</strong> {data.user.first_name} {data.user.last_name}(MLA)
                                </p>

                                <p className="text-gray-600 mb-2">
                                    <strong>Constituency:</strong> {data.user.constituency}
                                </p>
                            </div>
                            <table className="min-w-full bg-white border">
                                <thead className="bg-gray-200 font-semibold font-mono">
                                    <tr>
                                        <td className="px-4 py-2 text-nowrap">Pilgrim Name</td>
                                        <td className="px-4 py-2 text-nowrap">Seva</td>
                                        <td className="px-4 py-2 text-nowrap">Date Of Darshan</td>
                                        <td className="px-4 py-2 text-nowrap">Aadhar Number</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pilgrim.map((item) => {
                                        return (
                                            <tr class="border-b font-mono">
                                                <td class="px-4 py-2">{item.pilgrim_name}</td>
                                                <td class="px-4 py-2">{item.seva}</td>
                                                <td class="px-4 py-2">{format(parseISO(item.booked_date), "dd-MM-yyyy")}</td>
                                                <td class="px-4 py-2">{item.aadhar_number}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    } else {
        return <div className="">Link Expired...</div>;
    }
}
