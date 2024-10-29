// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const ServiceBookingForm = () => {
//   const [formData, setFormData] = useState({
//     customerName: "",
//     email: "",
//     contactNumber: "",
//     firstLineOfAddress: "",
//     town: "",
//     postcode: "",
//     selectedDate: "",
//     selectedTimeSlot: "",
//     selectService: "",
//     numberOfBedrooms: "",
//     numberOfStories: "",
//     howDidYouHearAboutUs: "",
//     file: null,
//     message: "",
//     paymentMethod: "",
//   });

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       file: e.target.files[0],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     try {
//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach((key) => {
//         formDataToSend.append(key, formData[key]);
//       });

//       const response = await fetch("/create", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to submit form");
//       }

//       const responseData = await response.json();
//       console.log("Form submitted successfully:", responseData);
//       // Redirect to thank you page
//       window.location.href = "/thank-you";
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setErrorMessage("Failed to submit form. Please try again later.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
//             Book a Service
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <InputField
//               label="Name"
//               name="customerName"
//               value={formData.customerName}
//               onChange={handleInputChange}
//               required
//             />
//             <InputField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />
//             <InputField
//               label="Contact Number"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleInputChange}
//               required
//             />
//             <InputField
//               label="Address"
//               name="firstLineOfAddress"
//               value={formData.firstLineOfAddress}
//               onChange={handleInputChange}
//               required
//             />
//             <InputField
//               label="Town"
//               name="town"
//               value={formData.town}
//               onChange={handleInputChange}
//               required
//             />
//             <InputField
//               label="Postcode"
//               name="postcode"
//               value={formData.postcode}
//               onChange={handleInputChange}
//               required
//             />
//             <DatePicker
//               currentDate={currentDate}
//               setCurrentDate={setCurrentDate}
//               selectedDate={formData.selectedDate}
//               setSelectedDate={(date) =>
//                 setFormData((prev) => ({ ...prev, selectedDate: date }))
//               }
//             />
//             <TimePicker
//               selectedTimeSlot={formData.selectedTimeSlot}
//               setSelectedTimeSlot={(time) =>
//                 setFormData((prev) => ({ ...prev, selectedTimeSlot: time }))
//               }
//             />
//             <SelectField
//               label="Service"
//               name="selectService"
//               value={formData.selectService}
//               onChange={handleInputChange}
//               options={[
//                 { value: "Gutter Cleaning", label: "Gutter Cleaning" },
//                 { value: "Gutter Wash Down", label: "Gutter Wash Down" },
//                 { value: "Gutter Repair", label: "Gutter Repair" },
//                 { value: "Gutter Replacement", label: "Gutter Replacement" },
//                 { value: "Soffits and Fascias", label: "Soffits and Fascias" },
//               ]}
//               required
//             />
//             <SelectField
//               label="Number of Bedrooms"
//               name="numberOfBedrooms"
//               value={formData.numberOfBedrooms}
//               onChange={handleInputChange}
//               options={[
//                 { value: "1", label: "1" },
//                 { value: "2", label: "2" },
//                 { value: "3", label: "3" },
//                 { value: "4", label: "4" },
//                 { value: "5", label: "5" },
//                 { value: "6+", label: "6+" },
//               ]}
//               required
//             />
//             <SelectField
//               label="Number of Stories"
//               name="numberOfStories"
//               value={formData.numberOfStories}
//               onChange={handleInputChange}
//               options={[
//                 { value: "1", label: "1" },
//                 { value: "2", label: "2" },
//                 { value: "3", label: "3" },
//                 { value: "4", label: "4" },
//               ]}
//               required
//             />
//             <SelectField
//               label="How did you hear about us?"
//               name="howDidYouHearAboutUs"
//               value={formData.howDidYouHearAboutUs}
//               onChange={handleInputChange}
//               options={[
//                 { value: "Search Engine", label: "Search Engine" },
//                 { value: "Recommendation", label: "Recommendation" },
//                 { value: "Social Media", label: "Social Media" },
//                 { value: "Flyers / Marketing", label: "Flyers / Marketing" },
//                 { value: "Other", label: "Other" },
//               ]}
//               required
//             />
//             <div>
//               <label
//                 htmlFor="file"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 File (optional)
//               </label>
//               <input
//                 type="file"
//                 id="file"
//                 name="file"
//                 onChange={handleFileChange}
//                 className="mt-1 block w-full text-sm text-gray-500
//                            file:mr-4 file:py-2 file:px-4
//                            file:rounded-md file:border-0
//                            file:text-sm file:font-semibold
//                            file:bg-blue-50 file:text-blue-700
//                            hover:file:bg-blue-100"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="message"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Message (optional)
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows={3}
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//               />
//             </div>
//             <SelectField
//               label="Payment Method"
//               name="paymentMethod"
//               value={formData.paymentMethod}
//               onChange={handleInputChange}
//               options={[
//                 { value: "paypal", label: "PayPal" },
//                 { value: "cash", label: "Cash" },
//                 { value: "online", label: "Online" },
//               ]}
//               required
//             />
//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Book Now
//               </button>
//             </div>
//           </form>
//           {errorMessage && (
//             <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//               {errorMessage}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   required,
// }) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       id={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//     />
//   </div>
// );

// const SelectField = ({ label, name, value, onChange, options, required }) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//       {label}
//     </label>
//     <select
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//     >
//       <option value="">Select an option</option>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const DatePicker = ({
//   currentDate,
//   setCurrentDate,
//   selectedDate,
//   setSelectedDate,
// }) => {
//   const formatDate = (date) => {
//     const options = { weekday: "short", day: "numeric", month: "short" };
//     return date.toLocaleDateString(undefined, options);
//   };

//   const renderDates = () => {
//     const dates = [];
//     for (let i = 0; i < 5; i++) {
//       const date = new Date(currentDate);
//       date.setDate(date.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">Date</label>
//       <div className="mt-1 flex items-center space-x-2">
//         <button
//           type="button"
//           onClick={() =>
//             setCurrentDate(
//               new Date(currentDate.setDate(currentDate.getDate() - 1))
//             )
//           }
//           className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
//         >
//           <ChevronLeft className="h-5 w-5 text-gray-600" />
//         </button>
//         <div className="flex-1 grid grid-cols-5 gap-2">
//           {renderDates().map((date) => (
//             <button
//               key={date.toISOString()}
//               type="button"
//               onClick={() => setSelectedDate(date.toISOString().split("T")[0])}
//               className={`p-2 text-sm rounded-md ${
//                 selectedDate === date.toISOString().split("T")[0]
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-900 hover:bg-gray-200"
//               }`}
//             >
//               {formatDate(date)}
//             </button>
//           ))}
//         </div>
//         <button
//           type="button"
//           onClick={() =>
//             setCurrentDate(
//               new Date(currentDate.setDate(currentDate.getDate() + 1))
//             )
//           }
//           className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
//         >
//           <ChevronRight className="h-5 w-5 text-gray-600" />
//         </button>
//       </div>
//     </div>
//   );
// };

// const TimePicker = ({ selectedTimeSlot, setSelectedTimeSlot }) => {
//   const timeSlots = [
//     "9:00-9:45 AM",
//     "9:45-10:30 AM",
//     "10:30-11:15 AM",
//     "11:15 AM-12:00 PM",
//     "12:00-12:45 PM",
//     "12:45-1:30 PM",
//     "1:30-2:15 PM",
//     "2:15-3:00 PM",
//   ];

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">
//         Time Slot
//       </label>
//       <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
//         {timeSlots.map((slot) => (
//           <button
//             key={slot}
//             type="button"
//             onClick={() => setSelectedTimeSlot(slot)}
//             className={`p-2 text-sm rounded-md ${
//               selectedTimeSlot === slot
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-900 hover:bg-gray-200"
//             }`}
//           >
//             {slot}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ServiceBookingForm;
