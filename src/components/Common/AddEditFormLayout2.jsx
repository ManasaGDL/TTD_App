import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  format,
  parseISO,
  isValid,
  differenceInHours,
  subDays,
} from "date-fns";
import PropTypes from "prop-types";
import apis from "../../api/apis";
import { constants } from "../../constant";
import { MdDeleteOutline } from "react-icons/md";
import { Toaster, toast } from "sonner";
import MyModal from "./MyModal";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa6";
import { MdOutlineEditOff } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";

import { useLoading } from "../../context/LoadingContext";
import PDFViewer from "../PDFViewer";
import Swal from "sweetalert2";

const schema = yup.object({
  pilgrims: yup.array().of(
    yup.object({
      pilgrim_name: yup.string().required("Name is required"),
      age: yup
        .number()
        .typeError("Age must be a number")
        .positive()
        .integer()
        .required("Age is required"),
      phone_number: yup
        .number()
        .typeError("Phone number must be a number")
        .test(
          "len",
          "Phone number must be exactly 10 digits",
          (value) => value && value.toString().length === 10
        )
        .required("Phone number is required"),
      aadhaar_number: yup
        .number()
        .typeError("Aadhaar must be a number")
        .test(
          "len",
          "Aadhaar must be exactly 12 digits",
          (value) => value.toString().length === 12
        )
        .required("Aadhaar is required"),
      seva: yup.string().default("VIP Break"),
      booked_datetime: yup.string(),
    })
  ),
});

const AddEditFormLayout2 = ({
  bookingsObject,
  getPilgrimDetails,
  getMonthSlotAvailability,
  date,
  bookingsCount,
  setIsModalOpen,
  setToastMessage,
  isModalOpen,
  bookedPilgrimDetails = [],
}) => {
  const [initialBookings, setInitialBookings] = useState(
    localStorage.getItem("is_mla") === "true" ? constants.Mla : constants.Mp
  );
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const mid_bookings = localStorage.getItem("is_mla") ? 3 : 5;
  const [selectedPilgrims, setSelectedPilgrims] = useState([]);
  const [masterPilgrim, setMasterPilgrim] = useState(null);
  const [startPreviewDownload, setStartPreviewDownload] = useState(false);
  const [pilgrimCount, setPilgrimCount] = useState(bookingsCount);
  const [hideAddCountButton, setHideAddCountButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bookedDateTime, setBookedDateTime] = useState(
    bookedPilgrimDetails[0]?.bookedDateTime || ""
  );
  const { setIsLoading } = useLoading();
  const [payloadForDownload, setPayloadForDownload] = useState({});
  const [disableAddPilgrimsButton, setDisableAddPilgrimsButton] =
    useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pilgrims: bookedPilgrimDetails.map((pilgrim) => ({
        ...pilgrim,
        editable: true,
        clicked: false,
        seva: "VIP Break",
        booked_datetime: pilgrim.booked_datetime, // All initially booked pilgrims are editable
      })),
    },
  });

  useEffect(() => {
    if (Object.keys(payloadForDownload).length === 0)
      setStartPreviewDownload(false);
  }, [payloadForDownload]);

  useEffect(() => {
    if (bookedPilgrimDetails.length > 0) {
      setBookedDateTime(bookedPilgrimDetails[0].booked_datetime);
    } else {
      setBookedDateTime("");
    }
    setIsLoading(false);
  }, [bookedPilgrimDetails[0]?.booked_datetime, date]);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "pilgrims",
  });
  const watchFields = watch("pilgrims");
  useEffect(() => {
    //set pilgrimscount
    if (bookingsCount >= 0) setIsLoading(false);
    setPilgrimCount(bookingsCount ? bookingsCount : 1);
  }, [bookingsCount]);
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") trigger(name);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    reset({
      pilgrims: bookedPilgrimDetails.map((pilgrim) => ({
        ...pilgrim,
        editable: true,
        clicked: false,
        seva: pilgrim.seva || "VIP Break",
        booked_datetime: pilgrim.booked_datetime, // Ensure editable flag is set to true for booked pilgrims on reset
      })),
    });
  }, [date, bookedPilgrimDetails, reset]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      setHideAddCountButton(false);
      setPilgrimCount(bookingsCount ? bookingsCount : 1);
    }
    if (isModalOpen) {
      setEditMode(false);
    }
  }, [isModalOpen, reset, bookingsCount]);
  const shouldDisableEditDeleteIn38hrs = (bookingDate) => {
    const currentDate = new Date();
    const parsedBookingDate = parseISO(bookingDate);
    return differenceInHours(parsedBookingDate, currentDate) < 38;
  };
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedPilgrims([]);
      setMasterPilgrim(null);
    }
  }, [isModalOpen]);
  const extractErrorMessage = (error) => {
    try {
      const regex = /ErrorDetail\(string='([^']+)'/;
      const match = regex.exec(error);

      if (match && match[1]) {
        return match[1];
      }
    } catch (e) {
      console.error("Error extracting error message:", e);
    }
    return "Unknown error";
  };
  const pilgrimCountsallowed = Array.from(
    { length: initialBookings },
    (_, index) => index + 1
  );
  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      // Filter out pilgrims that are already booked and should not be added again
      // const newPilgrims = data.pilgrims.filter(pilgrim => !bookedPilgrimDetails.some(bookedPilgrim => bookedPilgrim.aadhaar_number === pilgrim.aadhaar_number));
      data.pilgrims.forEach((pilgrim, index) => {
        pilgrim.is_master = index === 0;
      });
      const editPilgrims = [];
      const newPilgrims = [];

      data.pilgrims.forEach((pilgrim) => {
        if (!pilgrim.seva || pilgrim.seva.trim() === "") {
          pilgrim.seva = "VIP Break";
        }

        if (
          (pilgrim.clicked && pilgrim.editable == false) ||
          (editMode && bookedPilgrimDetails.length > 0)
        ) {
          console.log("edited", pilgrim);
          editPilgrims.push(pilgrim);
        }
        if (!Object.prototype.hasOwnProperty.call(pilgrim, "editable"))
          newPilgrims.push(pilgrim);
      });

      // Object.values(data).flat()
      if (newPilgrims.length > 0) {
        const response = await apis.addPilgrims({
          pilgrims: newPilgrims,
          pilgrim_count: pilgrimCount,
          booked_datetime:
            newPilgrims.length > 0 ? newPilgrims[0].booked_datetime : "",
        });

        if (response.status === 201) {
          setIsModalOpen(false);

          Swal.fire({
            title: "Success",
            text: `Booked Successfully : ${format(parseISO(newPilgrims[0].booked_datetime),'dd MMM yyyy')}`,
            icon: "success",
            confirmButtonText: "Ok",
          }).then((ok) => {
            if (ok.isConfirmed) {
              getMonthSlotAvailability()
            }
          });
          // setToastMessage({ type: 'success', message: `Booked Successfully - ${newPilgrims[0].booked_datetime}` });
          reset();
        }
      }
      if (editPilgrims.length > 0) {
        const transformedObject = editPilgrims.map((obj) => ({
          ...obj,
          pilgrim_count: parseInt(pilgrimCount),
        }));

        const response = await apis.updatePilgrims(transformedObject);
        if (response.status === 200) {
          setIsModalOpen(false);
          setHideAddCountButton(false);
          setEditMode(false);
          setToastMessage({
            type: "success",
            message: `Details Successfully updated for date-${date}`,
          });
          reset();
        }
      }
    } catch (e) {
      setHideAddCountButton(false);
      setPilgrimCount(1);
      if (e.response && e.response.status === 400) {
        const errorMessage = extractErrorMessage(e.response?.data?.error);

        setToastMessage({ type: "error", message: errorMessage });
      } else {
        setToastMessage({ type: "error", message: "Something went wrong!" });
        reset();
      }
    }
  };

  const addPilgrim = () => {
    setHideAddCountButton(true);
    if (fields.length < pilgrimCount) {
      append({
        pilgrim_name: "",
        age: "",
        aadhaar_number: "",
        seva: "",
        phone_number: "",
        booked_datetime: date,
      });
    }
  };
  const addPilgrimCount = () => {
    setDisableAddPilgrimsButton(false);
    setHideAddCountButton(true);
    if (fields.length < pilgrimCount)
      for (let i = fields.length; i < pilgrimCount; i++)
        append({
          pilgrim_name: "",
          age: "",
          aadhaar_number: "",
          seva: "",
          phone_number: "",
          booked_datetime: date,
        });
    else {
      for (let i = fields.length; i > pilgrimCount; i--) remove(i - 1);
    }
  };

  const toggleEdit = (index) => {
    const updatedPilgrims = [...fields];
    setHideAddCountButton(true);
    updatedPilgrims[index].editable = !updatedPilgrims[index].editable;
    updatedPilgrims[index].clicked = !updatedPilgrims[index].clicked;
    update(index, updatedPilgrims[index]);

    // reset({
    //   pilgrims: updatedPilgrims
    // });
  };

  const parseDate = (date) => {
    if (!date) return "No Date Available";
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, "d-MMMM-yyyy");
    }
    return "Invalid Date";
  };
  const handleDelete = (index) => {
    setDeleteIndex(index);
    if (Object.prototype.hasOwnProperty.call(fields[index], "editable")) {
      setOpenModal(true);
    } else remove(index);
  };

  const handlePilgrimDelete = async () => {
    try {
      const res = await apis.deletePilgrim(fields[deleteIndex].pilgrim_id);
      let date = format(
        parseISO(fields[deleteIndex]?.booked_datetime),
        "yyyy-MM-dd"
      );
      if (res.status == 204) {
        setToastMessage({
          type: "success",
          message: `Successfully deleted bookings on date-${date}`,
        });
        setOpenModal(false);
        setIsModalOpen(false);
        getPilgrimDetails(date);
        getMonthSlotAvailability();
        setIsLoading(true);
      }
    } catch (e) {
      toast.error("Something went wrong!");
      console.log(e);
    }
  };

  //  P
  const handlePreviewOrDownload = () => {
    setStartPreviewDownload(true);
    setPayloadForDownload({
      pilgrims: bookedPilgrimDetails,
      accommodation_date: format(
        subDays(
          format(
            parseISO(bookedPilgrimDetails[0]?.booked_datetime),
            "yyyy-MM-dd"
          ),
          1
        ),
        "yyyy-MM-dd"
      ),
      darshan_date: format(
        parseISO(bookedPilgrimDetails[0]?.booked_datetime),
        "yyyy-MM-dd"
      ),
      pilgrim_count: bookingsCount,
    });
  };
  useEffect(() => {
    if (startPreviewDownload)
      setPayloadForDownload({
        pilgrims: bookedPilgrimDetails,
        accommodation_date: format(
          subDays(
            format(
              parseISO(bookedPilgrimDetails[0]?.booked_datetime),
              "yyyy-MM-dd"
            ),
            1
          ),
          "yyyy-MM-dd"
        ),
        darshan_date: format(
          parseISO(bookedPilgrimDetails[0]?.booked_datetime),
          "yyyy-MM-dd"
        ),
        pilgrim_count: bookingsCount,
      });
  }, [bookedPilgrimDetails, startPreviewDownload]);
  const getTicketClass = (bookingsLeft) => {
    if (bookingsLeft === initialBookings) return "text-lime-500";
    if (bookingsLeft > mid_bookings) return "text-yellow-500";
    if (bookingsLeft > 0) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="overflow-y-auto h-full max-h-screen">
      <MyModal
        isOpen={openModal}
        handlePilgrimDelete={handlePilgrimDelete}
        setIsModalOpen={setOpenModal}
        title="Delete?"
        message="Are you sure to Delete the Booked Pilgrim"
      />
      <div className="flex justify-between ">
        {bookingsCount === 0 ? (
          <div className="text-sm text-red-700 font-mono flex ml-30">
            <label className="flex ml-30">
              <IoIosWarning size={30} />
              This is Blocked Date. Please Unblock to continue booking!
            </label>
          </div>
        ) : (
          <div className="text-sm text-black-600 font-mono">
            <div>
              {date && (
                <span className="font-mono text-lg text-green-900">
                  Date: {parseDate(date)}{" "}
                </span>
              )}
            </div>
            <label>
              {" "}
              Enter number of pilgrims
              <select
                onChange={(e) => {
                  setEditMode(true);
                  setPilgrimCount(e.target.value);
                  setDisableAddPilgrimsButton(true);
                }}
                value={pilgrimCount}
                disabled={shouldDisableEditDeleteIn38hrs(bookedDateTime)}
                className="border border-green-300 rounded ml-3 focus:outline-none p-2"
              >
                {pilgrimCountsallowed.map((val) => {
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              {bookingsCount === null && (
                <button
                  type="submit"
                  onClick={addPilgrimCount} //for old layout -> getting rows use addPilgrim
                  className="ml-2 bg-lime-500 text-white py-1 w-20 px-2 rounded hover:bg-lime-700"
                >
                  Submit
                </button>
              )}
            </label>
            {shouldDisableEditDeleteIn38hrs(bookedDateTime) && (
              <div className="text-sm text-red-500 font-mono">
                Cannot edit before 36 hours of booking date
              </div>
            )}
          </div>
        )}

        {bookedPilgrimDetails.length > 0 && (
          <div>
            {/* <span>{"Edit is disabled before 38hrs of darshan"}</span> */}
            <div>
              <button
                className=" px-4 py-2 rounded"
                onClick={() => {
                  handlePreviewOrDownload();
                }}
              >
                {
                  <PDFViewer
                    payloadForDownload={payloadForDownload}
                    setStartPreviewDownload={setStartPreviewDownload}
                    download={startPreviewDownload}
                    setPayloadForDownload={setPayloadForDownload}
                  />
                }
                {/* <IoPrint size={25}></IoPrint><span className="font-mono text-xs text-lime-700">{selectedPilgrims.length>0?"Pilgrims selected for print":""} </span> */}
              </button>
            </div>
            {
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Print
                <svg
                  className="absolute text-gray-800 h-2 w-full left-0 top-full"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                >
                  <polygon
                    className="fill-current"
                    points="0,0 127.5,127.5 255,0"
                  />
                </svg>
              </div>
            }
            {/* {date && <span className={`font-mono ml-4 text-base mr-5 text-black font-bold ${getTicketClass(bookingsLeft)} `}> Available:{bookingsLeft}</span>} */}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-6 w-full max-w-8xl"
      >
        {(hideAddCountButton || bookedPilgrimDetails.length > 0) && (
          <div className="tex-xs text-lime-500 font-mono">
            Pilgrim Detail(s):
          </div>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-2 mb-4"
            style={{ gridTemplateColumns: "repeat(14, 1fr)" }}
          >
            <div className="col-span-12 md:col-span-3 relative ml-2">
              <input
                placeholder={`Name ${index + 1}`}
                type="text"
                title={field.pilgrim_name}
                {...register(`pilgrims.${index}.pilgrim_name`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full  ${
                  field.editable ? "bg-slate-200" : ""
                }`}
                disabled={field.editable} // Disable input based on editable flag
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none h-9">
                <IoMdPerson className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.pilgrim_name && (
                <p className="text-red-600 text-xs">
                  {errors.pilgrims[index].pilgrim_name.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 col-span-6 relative">
              <input
                placeholder={`Phone ${index + 1}`}
                type="text"
                title={field.phone_number}
                {...register(`pilgrims.${index}.phone_number`)}
                className={`border pl-6 border-gray-300 rounded p-2 w-full relative ${
                  field.editable ? "bg-slate-200" : ""
                }`}
                disabled={field.editable} // Disable input based on editable flag
              />
              {/* <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2"> */}
              <div className="flex absolute items-center inset-y-0 left-0 h-9 space-x-2">
                <FaPhoneAlt className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.phone_number && (
                <p className="text-red-600 text-xs mt-2">
                  {errors.pilgrims[index].phone_number.message}
                </p>
              )}
            </div>
            <div className="md:col-span-3 col-span-6 relative">
              <input
                placeholder={`Adhaar ${index + 1}`}
                type="text"
                title={field.aadhaar_number}
                {...register(`pilgrims.${index}.aadhaar_number`)}
                className={`border border-gray-300 rounded p-2 pl-7 w-full ${
                  field.editable ? "bg-slate-200" : ""
                }`}
                disabled={field.editable} // Disable input based on editable flag
              />
              <div className="absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none h-9">
                <FaAddressCard className="text-gray-400" />
              </div>
              {errors?.pilgrims?.[index]?.aadhaar_number && (
                <p className="text-red-600 text-xs">
                  {errors.pilgrims[index].aadhaar_number.message}
                </p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 relative">
              <input
                placeholder={`Age ${index + 1}`}
                type="number"
                title={field.age}
                {...register(`pilgrims.${index}.age`)}
                className={`border border-gray-300 rounded p-2 w-full disable-spinner ${
                  field.editable ? "bg-slate-200" : ""
                }`}
                disabled={field.editable} // Disable input based on editable flag
              />
              <div className="absolute pl-8 inset-y-0 left-0 flex items-center pointer-events-none h-9"></div>
              {errors?.pilgrims?.[index]?.age && (
                <p className="text-red-600 text-xs">
                  {errors.pilgrims[index].age.message}
                </p>
              )}
            </div>

            <div className="md:col-span-3 col-span-4">
              <select
                {...register(`pilgrims.${index}.seva`)}
                className={`border border-gray-300 rounded p-2 w-full ${
                  field.editable ? "bg-slate-200" : ""
                }`}
                disabled={field.editable} // Disable input based on editable flag
                // defaultValue={"VIP Break"||field.seva}
                title={field.seva}
                value={"VIP Break" || field?.seva}
              >
                {/* <option value="">Select Seva</option> */}
                <option value="VIP Break">VIP Break</option>
              </select>
              {errors?.pilgrims?.[index]?.seva && (
                <p className="text-red-600 text-sm">
                  {errors.pilgrims[index].seva.message}
                </p>
              )}
            </div>

            {
              <div className="col-span-2 flex items-center h-9">
                {bookedPilgrimDetails.some(
                  (pilgrim) => pilgrim.aadhaar_number === field.aadhaar_number
                ) && (
                  <div>
                    {field.editable ? (
                      <button
                        type="button"
                        className="text-black"
                        onClick={() => toggleEdit(index)}
                        disabled={shouldDisableEditDeleteIn38hrs(
                          field.booked_datetime
                        )}
                      >
                        <MdOutlineEditOff className="mx-auto" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-black"
                        onClick={() => toggleEdit(index)}
                      >
                        <Pencil className="mx-auto" />
                      </button>
                    )}
                  </div>
                )}
                {
                  <button
                    type="button"
                    className="text-red-500 rounded hover:bg-red-700 ml-2"
                    onClick={() => handleDelete(index)} // Handle delete action
                  >
                    <MdDeleteOutline size={24} />
                  </button>
                }
              </div>
            }
          </div>
        ))}

        <div className="flex text-center justify-center">
          {(fields.some((field) => field.clicked === true) ||
            (editMode && bookedPilgrimDetails.length > 0)) && (
            <button
              type="submit"
              className="bg-lime-500 text-white font-mono py-2 w-20 px-2 rounded hover:bg-lime-700"
            >
              Edit
            </button>
          )}
        </div>

        <div>
          <div className={`flex text-center justify-center `}>
            {hideAddCountButton && !bookedPilgrimDetails.length > 0 && (
              <button
                type="submit"
                disabled={disableAddPilgrimsButton}
                className={`${
                  disableAddPilgrimsButton
                    ? "bg-transparent"
                    : "bg-lime-500 hover:bg-lime-700"
                } text-white font-mono text-xs py-3 w-20 px-1 rounded `}
              >
                AddPilgrims
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

AddEditFormLayout2.propTypes = {
  bookingsObject: PropTypes.object,
  date: PropTypes.string,
  bookingsLeft: PropTypes.number,
  setIsModalOpen: PropTypes.func,
  setToastMessage: PropTypes.func,
  isModalOpen: PropTypes.bool,
  bookedPilgrimDetails: PropTypes.array,
};

export default AddEditFormLayout2;
