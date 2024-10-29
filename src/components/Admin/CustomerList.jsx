import React, { useState, useEffect, useCallback } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUpDownIcon,
  MagnifyingGlassCircleIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
  CameraIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import CustomerInfoModal from "./CustomerInfoModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  deleteCustomerById,
  getAllDataBooking,
  refundCustomer,
} from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhotoGallery from "./PhotoGallery";
import RefundModal from "./RefundModal";
import UpdateBookingbyAdminForm from "./UpdateBookingbyAdminForm";
export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page"), 10) || 1;
  const initialPageSize = parseInt(queryParams.get("pageSize"), 10) || 10;
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [OrderId, setOrderId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  const openGallery = (photos) => {
    setSelectedPhotos(photos);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDataBooking(pageIndex, pageSize);
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      if (err.response.data.message === "Unauthorized request") {
        navigate("/login");
      }
      setError("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", pageIndex + 1);
    newSearchParams.set("pageSize", pageSize);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [pageIndex, pageSize, location.pathname, navigate]);

  const handleRefundClick = (booking) => {
    setSelectedBooking(booking);
    setRefundAmount(booking.totalPrice);
    setRefundModalOpen(true);
  };

  const handleRefund = async () => {
    if (!selectedBooking || !refundAmount || !refundReason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await refundCustomer(
        selectedBooking.captureId,
        refundAmount,
        refundReason
      );
      if (response.status == 200)
        // toast.success(response.data.message);
        fetchCustomers(); // Refresh the customer list
      setIsSuccess(true);
      // setRefundModalOpen(false);
    } catch (err) {
      // Display a user-friendly message
      const errorMessage =
        err.response?.data?.message || "Failed to process refund";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Photos",
        accessor: "photos",
        Cell: ({ value }) => (
          <div className="flex items-center space-x-2">
            {value.length > 0 ? (
              <button
                onClick={() => openGallery(value)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <PhotoIcon className="h-5 w-5" />
                <span className="ml-2">View Photos</span>
              </button>
            ) : (
              <div className="flex items-center text-gray-500">
                <CameraIcon className="h-5 w-5" />
                <span className="ml-2">No Photos</span>
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "customerName",
        sortType: "alphanumeric",
      },
      {
        Header: "Date",
        accessor: "selectedDate",
        sortType: "basic",
        Cell: ({ value }) => {
          const formattedDate = format(new Date(value), "dd/MM/yyyy");
          return formattedDate;
        },
      },
      {
        Header: "Time Slot",
        accessor: "selectedTimeSlot",
        sortType: "basic",
      },
      {
        Header: "Total",
        accessor: "totalPrice",
        sortType: "basic",
        Cell: ({ value }) => `£${value}`,
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        sortType: "basic",
        Cell: ({ value }) => (value ? value.toUpperCase() : value),
      },
      {
        Header: "Booked By",
        accessor: "bookedBy",
        sortType: "basic",
        Cell: ({ value }) => (value ? value.toUpperCase() : value),
      },
      {
        Header: "Action",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedCustomerId(row.original._id);
                setModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setSelectedCustomerId(row.original._id);
                setEditModalOpen(true); // Open edit modal
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setSelectedCustomerId(row.original._id);
                setDeleteModalOpen(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleRefundClick(row.original)}
              className={`text-green-500 flex items-center ${
                row.original.refundStatus === "completed"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-green-700"
              }`}
              disabled={row.original.refundStatus === "completed"}
            >
              <ReceiptRefundIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: customers,
      initialState: { pageIndex, pageSize },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setPageIndex(tablePageIndex);
  }, [tablePageIndex]);

  useEffect(() => {
    setPageSize(tablePageSize);
  }, [tablePageSize]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  const deleteCustomer = async (id) => {
    try {
      const response = await deleteCustomerById(id);
      toast.success(response?.data?.message);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (err) {
      setError("Failed to delete customer");
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
        <input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || undefined)}
          placeholder="Search all data..."
          className="p-2 border rounded w-full"
        />
      </div>

      {loading && <p>Loading customer data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup,index) => {
                 
                  const { key, ...headerGroupProps } =
                    headerGroup.getHeaderGroupProps(); // Destructure to separate key
                  return (
                    <tr key={index} {...headerGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key, ...columnProps } = column.getHeaderProps(
                          column.getSortByToggleProps()
                        ); // Destructure to separate key
                        return (
                          <th
                            key={column.id}
                            {...columnProps}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          >
                            <div className="flex items-center">
                              {column.render("Header")}
                              {column.canSort && (
                                <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>

              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {page.map((row,index) => {
                  prepareRow(row);
                  const { key, ...rowProps } = row.getRowProps(); 
                  return (
                    <motion.tr
                      key={index}
                      {...rowProps}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {row.cells.map((cell,index) => {
                        const { key, ...cellProps } = cell.getCellProps(); // Destructure to separate key
                        return (
                          <motion.td
                            key={index}
                            {...cellProps}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            {cell.render("Cell")}
                          </motion.td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Improved pagination */}
          <div className="pagination mt-4 flex justify-between items-center">
            <div>
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
              <select
                value={pageSize}
                onChange={(e) => setTablePageSize(Number(e.target.value))}
                className="ml-2 border rounded p-1"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <motion.button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDoubleLeftIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDoubleRightIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <CustomerInfoModal
            isOpen={modalOpen}
            onClose={closeModal}
            customerId={selectedCustomerId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={() => {
              deleteCustomer(selectedCustomerId);
              closeDeleteModal();
            }}
          />
        )}
      </AnimatePresence>
      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <PhotoGallery photos={selectedPhotos} onClose={closeGallery} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        <RefundModal
          isOpen={refundModalOpen}
          closeModal={() => setRefundModalOpen(false)}
          booking={selectedBooking}
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
          refundReason={refundReason}
          setRefundReason={setRefundReason}
          handleRefund={handleRefund}
          isProcessing={isProcessing}
          isSuccess={isSuccess}
        />
      </AnimatePresence>
      <AnimatePresence>
        {editModalOpen && (
          <UpdateBookingbyAdminForm
            customerId={selectedCustomerId}
            isOpen={editModalOpen}
            onClose={closeEditModal}
            fetchCustomers={fetchCustomers}
          />
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

//****************is final  */
// import React, { useState, useEffect, useCallback } from 'react';
// import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronUpDownIcon,
//   MagnifyingGlassCircleIcon,
//   EllipsisHorizontalIcon,
//   PhotoIcon,
//    TrashIcon ,
//    CameraIcon,
//    ReceiptRefundIcon,
// } from '@heroicons/react/24/outline';
// import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
// import CustomerInfoModal from './CustomerInfoModal';
// import DeleteConfirmationModal from './DeleteConfirmationModal';
// import { deleteCustomerById, getAllDataBooking ,refundCustomer} from '../../services/api';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import PhotoGallery from './PhotoGallery';

// export default function Booking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const queryParams = new URLSearchParams(location.search);
//   const initialPage = parseInt(queryParams.get('page'), 10) || 1;
//   const initialPageSize = parseInt(queryParams.get('pageSize'), 10) || 10;
//   const [pageIndex, setPageIndex] = useState(initialPage - 1);
//   const [pageSize, setPageSize] = useState(initialPageSize);
//   const [selectedPhotos, setSelectedPhotos] = useState([]);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);
//   const [refundAmount, setRefundAmount] = useState('');
//   const [OrderId,  setOrderId] = useState('');
//   const handleRefund = async ( amount) => {
//     try {
//       console.log("amount,order",amount,OrderId);

//       const response = await refundCustomer(OrderId, amount);
//       toast.success(response.data.message);
//       fetchCustomers(); // Refresh the customer list
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to process refund");
//     }
//     setRefundModalOpen(false);
//   };

//   const openGallery = (photos) => {
//     setSelectedPhotos(photos);
//     setIsGalleryOpen(true);
//   };

//   const closeGallery = () => {
//     setIsGalleryOpen(false);
//   };

//   const fetchCustomers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getAllDataBooking(pageIndex, pageSize);
//       setCustomers(response.data.data.customers);
//       setTotalPages(response.data.data.totalPages);
//     } catch (err) {
//       if (err.response.data.message === "Unauthorized request") {
//         navigate('/login');
//       }
//       setError("Failed to fetch customer data");
//     } finally {
//       setLoading(false);
//     }
//   }, [pageIndex, pageSize]);

//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   useEffect(() => {
//     const newSearchParams = new URLSearchParams(location.search);
//     newSearchParams.set('page', pageIndex + 1);
//     newSearchParams.set('pageSize', pageSize);
//     navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
//   }, [pageIndex, pageSize, location.pathname, navigate]);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Photos",
//         accessor: "photos",
//         Cell: ({ value }) => (
//           <div className="flex items-center space-x-2">
//             {value.length > 0 ? (
//               <button
//                 onClick={() => openGallery(value)}
//                 className="text-blue-500 hover:text-blue-700 flex items-center"
//               >
//                 <PhotoIcon className="h-5 w-5" />
//                 <span className="ml-2">View Photos</span>
//               </button>
//             ) : (
//               <div className="flex items-center text-gray-500">
//                 <CameraIcon className="h-5 w-5" />
//                 <span className="ml-2">No Photos</span>
//               </div>
//             )}
//           </div>
//         ),
//       },
//       {
//         Header: "Name",
//         accessor: "customerName",
//         sortType: "alphanumeric",
//       },
//       {
//         Header: "Date",
//         accessor: "selectedDate",
//         sortType: "basic",
//         Cell: ({ value }) => {
//           const formattedDate = format(new Date(value), 'dd/MM/yyyy');
//           return formattedDate;
//         },
//       },
//       {
//         Header: "Time Slot",
//         accessor: "selectedTimeSlot",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "totalPrice",
//         sortType: "basic",
//         Cell: ({ value }) => `£${value}`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//       },
//       {
//         Header: "Action",
//         accessor: "_id",
//         disableSortBy: true,
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setModalOpen(true);
//               }}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <EllipsisHorizontalIcon className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setDeleteModalOpen(true);
//               }}
//               className="text-red-500 hover:text-red-700"
//             >
//               <TrashIcon className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setRefundAmount(row.original.totalPrice);
//                 setOrderId(row.original.captureId);
//                 setRefundModalOpen(true);
//               }}
//               className="text-green-500 hover:text-green-700"
//             >
//               <ReceiptRefundIcon className="h-5 w-5" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize: setTablePageSize,
//     state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data: customers,
//       initialState: { pageIndex, pageSize },
//       manualPagination: true,
//       pageCount: totalPages,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   useEffect(() => {
//     setPageIndex(tablePageIndex);
//   }, [tablePageIndex]);

//   useEffect(() => {
//     setPageSize(tablePageSize);
//   }, [tablePageSize]);

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const closeDeleteModal = useCallback(() => {
//     setDeleteModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const deleteCustomer = async (id) => {
//     try {
//       const response = await deleteCustomerById(id);
//       toast.success(response?.data?.message);
//       setCustomers(customers.filter(customer => customer._id !== id));
//     } catch (err) {
//       setError("Failed to delete customer");
//       toast.error(err.response.data.message);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={globalFilter || ""}
//           onChange={(e) => setGlobalFilter(e.target.value || undefined)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {loading && <p>Loading customer data...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup) => (
//                   <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         key={column.id}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       >
//                         <div className="flex items-center">
//                           {column.render("Header")}
//                           {column.canSort && (
//                             <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                           )}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <motion.tr
//                       key={row.id}
//                       {...row.getRowProps()}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell) => (
//                         <motion.td
//                           key={cell.id}
//                           {...cell.getCellProps()}
//                           className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                         >
//                           {cell.render("Cell")}
//                         </motion.td>
//                       ))}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Improved pagination */}
//           <div className="pagination mt-4 flex justify-between items-center">
//             <div>
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{' '}
//               </span>
//               <select
//                 value={pageSize}
//                 onChange={e => setTablePageSize(Number(e.target.value))}
//                 className="ml-2 border rounded p-1"
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <motion.button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronRightIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className="px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleRightIcon className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {modalOpen && (
//           <CustomerInfoModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             customerId={selectedCustomerId}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {deleteModalOpen && (
//           <DeleteConfirmationModal
//             isOpen={deleteModalOpen}
//             onClose={closeDeleteModal}
//             onConfirm={() => {
//               deleteCustomer(selectedCustomerId);
//               closeDeleteModal();
//             }}
//           />
//         )}
//       </AnimatePresence>
//       {/* Photo Gallery Modal */}
//       <AnimatePresence>
//         {isGalleryOpen && (
//           <PhotoGallery
//             photos={selectedPhotos}
//             onClose={closeGallery}
//           />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {refundModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//           >
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -50, opacity: 0 }}
//               className="bg-white p-6 rounded-lg shadow-lg"
//             >
//               <h2 className="text-xl font-bold mb-4">Process Refund</h2>
//               <input
//                 type="number"
//                 value={refundAmount}
//                 onChange={(e) => setRefundAmount(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//                 placeholder="Refund Amount"
//               />
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => setRefundModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleRefund(refundAmount)}
//                   className="px-4 py-2 bg-green-500 text-white rounded"
//                 >
//                   Confirm Refund
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// }

// // ******** url page route */
// import React, { useState, useEffect, useCallback } from 'react';
// import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronUpDownIcon,
//   MagnifyingGlassCircleIcon,
//   EllipsisHorizontalIcon,
//   TrashIcon
// } from '@heroicons/react/24/outline';
// import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
// import CustomerInfoModal from './CustomerInfoModal'; // Assume this component exists
// import DeleteConfirmationModal from './DeleteConfirmationModal'; // New component for delete confirmation
// import { deleteCustomerById, getAllDataBooking } from '../../services/api';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
// import 'react-toastify/dist/ReactToastify.css';

// export default function Booking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//    const queryParams = new URLSearchParams(location.search);
//    const initialPage = parseInt(queryParams.get('page'), 10) || 1;
//    const initialPageSize = parseInt(queryParams.get('pageSize'), 10) || 10;
//    const [pageIndex, setPageIndex] = useState(initialPage - 1);
//    const [pageSize, setPageSize] = useState(initialPageSize);

//    const fetchCustomers = useCallback(async () => {
//      setLoading(true);
//      setError(null);
//      try {
//        const response = await getAllDataBooking(pageIndex, pageSize);
//        console.log("rsponece ",response);

//        setCustomers(response.data.data.customers);
//        setTotalPages(response.data.data.totalPages);
//      } catch (err) {
//       console.log("error xyz abc",err);

//        if(err.response.data.message==="Unauthorized request"){
//          navigate('/login')
//        }
//        setError("Failed to fetch customer data");
//      } finally {
//        setLoading(false);
//      }
//    }, [pageIndex, pageSize]);

//    useEffect(() => {
//      fetchCustomers();
//    }, [fetchCustomers]);

//    useEffect(() => {
//      const newSearchParams = new URLSearchParams(location.search);
//      newSearchParams.set('page', pageIndex + 1);
//      newSearchParams.set('pageSize', pageSize);
//      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
//    }, [pageIndex, pageSize, location.pathname, navigate]);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Photos",
//         accessor: "photos", // This should be an array of URLs
//         Cell: ({ value }) => (
//           <div className="flex space-x-2">
//             {value && value.length > 0 ? (
//               value.slice(0, 3).map((photo, index) => (
//                 <img
//                   key={index}
//                   src={photo}
//                   alt={`Customer Photo ${index + 1}`}
//                   className="w-12 h-12 object-cover rounded-full" // Adjust size as needed
//                 />
//               ))
//             ) : (
//               <span>No photos</span> // Fallback when there are no photos
//             )}
//           </div>
//         ),
//         width: 150, // Adjust width to fit your design
//       },
//       {
//         Header: "Name",
//         accessor: "customerName",
//         sortType: "alphanumeric",
//       },
//       {
//         Header: "Date",
//         accessor: "selectedDate",
//         sortType: "basic",
//         Cell: ({ value }) => {
//           const formattedDate = format(new Date(value), 'dd/MM/yyyy');
//           return formattedDate;
//         },
//       },
//       {
//         Header: "Time Slot",
//         accessor: "selectedTimeSlot",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "totalPrice",
//         sortType: "basic",
//         Cell: ({ value }) => `£${value}`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//       },
//       {
//         Header: "Action",
//         accessor: "_id",
//         disableSortBy: true,
//         Cell: ({ value }) => (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(value);
//                 setModalOpen(true);
//               }}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <EllipsisHorizontalIcon className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(value);
//                 setDeleteModalOpen(true);
//               }}
//               className="text-red-500 hover:text-red-700"
//             >
//               <TrashIcon className="h-5 w-5" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize: setTablePageSize,
//     state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data: customers,
//       initialState: { pageIndex, pageSize },
//       manualPagination: true,
//       pageCount: totalPages,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );
//   useEffect(() => {
//     setPageIndex(tablePageIndex);
//   }, [tablePageIndex]);

//   useEffect(() => {
//     setPageSize(tablePageSize);
//   }, [tablePageSize]);

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);
//   const closeDeleteModal = useCallback(() => {
//     setDeleteModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);
//   const deleteCustomer = async (id) => {
//     try {
//       const responce=await deleteCustomerById(id);
//       console.log("responcee",responce);

//       toast.success(responce?.data?.message)
//       // setCustomers(customers.filter(customer => customer.id !== id));
//       setCustomers(customers.filter(customer => customer._id !== id));
//     } catch (err) {
//       setError("Failed to delete customer");
//       toast.error(err.responce.data.massage)
//     }
//   };
//   return (
//     <div className="flex flex-col">
//          <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={globalFilter || ""}
//           onChange={(e) => setGlobalFilter(e.target.value || undefined)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {loading && <p>Loading customer data...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
//               {/* Table header remains the same */}
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup) => (
//                   <tr
//                     key={headerGroup.id}
//                     {...headerGroup.getHeaderGroupProps()}
//                   >
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         key={column.id}
//                         {...column.getHeaderProps(
//                           column.getSortByToggleProps()
//                         )}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       >
//                         <div className="flex items-center">
//                           {column.render("Header")}
//                           {column.canSort && (
//                             <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                           )}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <motion.tr
//                       key={row.id}
//                       {...row.getRowProps()}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell) => (
//                         <motion.td
//                           key={cell.id}
//                           {...cell.getCellProps()}
//                           className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                         >
//                           {cell.render("Cell")}
//                         </motion.td>
//                       ))}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Improved pagination */}
//           <div className="pagination mt-4 flex justify-between items-center">
//             <div>
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{' '}
//               </span>
//               <select
//                 value={pageSize}
//                 onChange={e => {
//                   setTablePageSize(Number(e.target.value));
//                 }}
//                 className="ml-2 border rounded p-1"
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <motion.button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                  <ChevronDoubleLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                <ChevronLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronRightIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className="px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                <ChevronDoubleRightIcon className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {modalOpen && (
//           <CustomerInfoModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             customerId={selectedCustomerId}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {deleteModalOpen && (
//           <DeleteConfirmationModal
//             isOpen={deleteModalOpen}
//             onClose={closeDeleteModal}
//             onConfirm={() => {
//               deleteCustomer(selectedCustomerId);
//               closeDeleteModal();
//             }}
//           />
//         )}
//       </AnimatePresence>
//       <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// }
