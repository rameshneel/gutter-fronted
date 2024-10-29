import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  checkCustomer,
  getAvailableTimeSlotsforForm,
  getDisabledDates,
} from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { calculateTotalPrice } from "../../utils/priceCalculator";
import { addDays } from "date-fns";
import HomeStyleModal from "./HomeStyleModal";
import TermsAndConditions from "./TermsAndConditions";

// Function to check if a date is a weekday
const isWeekday = (date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  error,
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 px-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 ${
        error ? "border-red-500" : ""
      }`}
      placeholder={label}
      required={required}
    />
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}) => (
  <div className="relative">
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 px-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 appearance-none ${
        error ? "border-red-500" : ""
      }`}
      required={required}
    >
      <option value="" disabled hidden>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    <ChevronDownIcon className="absolute right-0 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
function formatDateForBackend(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format 'YYYY-MM-DD'
}
const INITIAL_FORM_STATE = {
  customerName: "",
  email: "",
  contactNumber: "",
  firstLineOfAddress: "",
  town: "",
  postcode: "",
  selectedDate: null,
  selectedTimeSlot: null,
  selectService: "",
  numberOfBedrooms: "",
  selectHomeStyle: "",
  gutterCleaningOptions: [],
  gutterRepairsOptions: [],
  message: "",
  paymentMethod: "",
  termsConditions: false,
  photos: [],
};
const GUTTER_CLEANING_OPTIONS = [
  { value: "Garage", label: "Garage" },
  { value: "Conservatory", label: "Conservatory" },
  { value: "Extension", label: "Extension" },
  { value: "None", label: "None" },
];

const GUTTER_REPAIRS_OPTIONS = [
  { value: "Running Outlet", label: "Running Outlet" },
  { value: "Union Joint", label: "Union Joint" },
  { value: "Corner", label: "Corner" },
  { value: "Gutter Bracket", label: "Gutter Bracket" },
  { value: "Downpipe", label: "Downpipe" },
  // {
  //   value: "Gutter Length Replacement",
  //   label: "Gutter Length Replacement",
  // },
];

const TIME_SLOT_OPTIONS = [
  { value: "9:00-9:45 AM", label: "9:00-9:45 AM" },
  { value: "9:45-10:30 AM", label: "9:45-10:30 AM" },
  { value: "10:30-11:15 AM", label: "10:30-11:15 AM" },
  { value: "11:15-12:00 PM", label: "11:15-12:00 PM" },
  { value: "12:00-12:45 PM", label: "12:00-12:45 PM" },
  { value: "12:45-1:30 PM", label: "12:45-1:30 PM" },
  { value: "1:30-2:15 PM", label: "1:30-2:15 PM" },
  { value: "2:15-3:00 PM", label: "2:15-3:00 PM" },
];

const SERVICE_OPTIONS = [
  { value: "Gutter Cleaning", label: "Gutter Cleaning" },
  { value: "Gutter Repair", label: "Gutter Repair" },
];

const NUMBER_OF_BEDROOMS_OPTIONS = [
  { value: "2 Bedroom", label: "2 Bedroom" },
  { value: "3 Bedroom", label: "3 Bedroom" },
  { value: "4 Bedroom", label: "4 Bedroom" },
  { value: "5 Bedroom", label: "5 Bedroom" },
  // { value: "Ground", label: "Ground" },
];

const PROPERTY_STYLE_OPTIONS = [
  { value: "Terrace", label: "Terrace" },
  { value: "Semi-Detached", label: "Semi-Detached" },
  { value: "Detached", label: "Detached" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Town House/3 Stories", label: "Town House/3 Stories" },
];
const fetchAvailableTimeSlots = async (date) => {
  try {
    const response = await getAvailableTimeSlotsforForm(date);
    return response.data.data
      .filter((slot) => slot.status === "Available")
      .map((slot) => slot.time);
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    return [];
  }
};

const ServiceBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showHomeStyleModal, setShowHomeStyleModal] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDisabledDates = useCallback(async (year, month) => {
    try {
      const response = await getDisabledDates(year, month);
      if (response && response.data && response.data.data) {
        const disabledDates = response.data.data.map(
          (item) => new Date(item.date)
        );
        setDisabledDates(disabledDates);
      }
    } catch (error) {
      console.error("Error fetching disabled dates:", error);
    }
  }, []);

  const handleDateChange = useCallback(
    async (date) => {
      if (!date) return;

      const dateChange = formatDateForBackend(date);
      setFormData((prevData) => ({ ...prevData, selectedDate: dateChange }));

      setLoading(true);

      try {
        const availableTimes = await fetchAvailableTimeSlots(dateChange);
        setAvailableSlots(availableTimes);
        if (availableTimes.length === 0) {
          setDisabledDates((prevDates) => [...prevDates, date]);
        }
        setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" }));
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setLoading(false);
      }
    },
    [setFormData, setErrors]
  );

  const handleMonthChange = useCallback(
    (date) => {
      if (date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchDisabledDates(year, month);
      }
    },
    [fetchDisabledDates]
  );

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    fetchDisabledDates(currentYear, currentMonth);
  }, [fetchDisabledDates]);
  // const fetchDisabledDates = async (year, month) => {
  //   try {
  //     const response = await getDisabledDates(year, month);

  //     // Check if response is valid
  //     if (response && response.data && response.data.data) {
  //       const disabledDates = response.data.data.map(
  //         (item) => new Date(item.date)
  //       );
  //       setDisabledDates(disabledDates); // Assuming you have a state setter function
  //     }
  //   } catch (error) {
  //     console.error("Error fetching disabled dates:", error);
  //   }
  // };
  // const handleDateChange = useCallback(async (date) => {
  //   if (!date) return;

  //   const dateYear = date.getFullYear();
  //   const dateMonth = date.getMonth() + 1;

  //   await fetchDisabledDates(dateYear, dateMonth);

  //   const dateChange = formatDateForBackend(date);
  //   setFormData((prevData) => ({ ...prevData, selectedDate: dateChange }));

  //   setLoading(true); // Start loading

  //   try {
  //     const availableTimes = await fetchAvailableTimeSlots(dateChange);
  //     setAvailableSlots(availableTimes);
  //     if (availableTimes.length === 0) {
  //       setDisabledDates((prevDates) => [...prevDates, date]);
  //     }
  //     setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" })); // Clear any errors
  //   } catch (error) {
  //     console.error("Error fetching available times:", error);
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // }, []);
  // const handleMonthChange = async (date) => {
  //   if (date) {
  //     const year = date.getFullYear();
  //     const month = date.getMonth() + 1;
  //     await fetchDisabledDates(year, month);
  //   }
  // };
  const handleTermsConditionsChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      termsConditions: e.target.checked,
    }));
    if (errors.termsConditions) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        termsConditions: "",
      }));
    }
  };
  const handleTermsConditionsClick = () => {
    setShowTermsConditions(true);
  };
  const handleCloseTermsConditions = () => {
    setShowTermsConditions(false);
  };
  const handleFileChange = (e) => {
    const files = e.target.files;
    const imageFiles = [];
    const fileErrors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        fileErrors.push(`File "${file.name}" is not an image.`);
        continue;
      }

      // Check if the file size is less than or equal to 5MB
      if (file.size > 5 * 1024 * 1024) {
        fileErrors.push(`File "${file.name}" exceeds the 5MB size limit.`);
        continue;
      }
      // If valid, add to imageFiles array
      imageFiles.push(file);
    }

    // Set errors if there are any
    setErrors((prevErrors) => ({
      ...prevErrors,
      photos: fileErrors,
    }));

    // Update form data with valid image files
    setFormData((prevState) => ({
      ...prevState,
      photos: imageFiles,
    }));
  };
  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const newTotalPrice = calculateTotalPrice(formData);
      setTotalPrice(newTotalPrice);
    }
  }, [formData]);
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === "" &&
        key !== "file" &&
        key !== "photos" && // Exclude photos field from general validation
        key !== "message" &&
        key !== "gutterCleaningOptions"
      ) {
        newErrors[key] = "This field is required";
      }
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!/^\d{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = "Please select the number of bedrooms";
    }
    if (!formData.selectedDate) {
      newErrors.selectedDate = "Please select a date";
    }
    if (!formData.selectedTimeSlot) {
      newErrors.selectedTimeSlot = "Please select Time Slot";
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = "Please select the number of bedrooms";
    }
    if (
      formData.selectService === "Gutter Repair" &&
      formData.gutterRepairsOptions.length === 0
    ) {
      newErrors.gutterRepairsOptions =
        "Please select at least one repair service";
    }
    if (!formData.termsConditions) {
      newErrors.termsConditions = "You must accept the Terms & Conditions";
    }
    // Add file errors if there are any
    if (errors.photos && errors.photos.length > 0) {
      newErrors.photos = errors.photos;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const uppercasedValue = name === "postcode" ? value.toUpperCase() : value;

      setFormData((prevState) => {
        const newFormData = { ...prevState, [name]: uppercasedValue };
        const newTotalPrice = calculateTotalPrice(newFormData);
        setTotalPrice(newTotalPrice);

        // if (name === "postcode") {
        //   const validPostcodes = ["RH10", "RH11", "RH12", "RH13", "RH6"];
        //   const prefix = uppercasedValue.substring(0, 4); // Ensure prefix is uppercase
        //   if (!validPostcodes.includes(prefix)) {
        //     setErrors((prevErrors) => ({
        //       ...prevErrors,
        //       postcode:
        //         "Currently we only serve postcodes RH10, RH11, RH12, RH13 and RH6",
        //     }));
        //   } else {
        //     setErrors((prevErrors) => ({
        //       ...prevErrors,
        //       postcode: "",
        //     }));
        //   }
        // } else if (errors[name]) {
        //   setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        // }
        if (name === "postcode") {
          const validPostcodes = ["RH10", "RH11", "RH12", "RH13", "RH6"];
          const prefix = uppercasedValue.substring(0, 3); // Check the first 3 characters for "RH6"
          const fourPrefix = uppercasedValue.substring(0, 4); // Check the first 4 characters for other prefixes
          if (prefix === "RH6" || validPostcodes.includes(fourPrefix)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              postcode: "",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              postcode: "Currently we only serve postcodes RH10, RH11, RH12, RH13 and RH6",
            }));
          }
        } else if (errors[name]) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
        

        return newFormData;
      });
    },
    [errors, calculateTotalPrice]
  );
  const handleServiceChange = (selectedOption) => {
    setFormData((prevState) => {
      const newFormData = {
        ...prevState,
        selectService: selectedOption.value,
        gutterCleaningOptions: [],
        gutterRepairsOptions: [],
      };
      const newTotalPrice = calculateTotalPrice(newFormData);
      setTotalPrice(newTotalPrice);
      return newFormData;
    });
  };
  const handleOptionChange = (selectedOptions, serviceType) => {
    setFormData((prevState) => ({
      ...prevState,
      [serviceType]: selectedOptions,
    }));
  };
  const filteredTimeSlotOptions = useMemo(() => {
    return TIME_SLOT_OPTIONS.filter((slot) =>
      availableSlots.includes(slot.value)
    );
  }, [availableSlots]);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formDataWithPrice = { ...formData, totalPrice };
      if (!formDataWithPrice) {
        toast.error("No booking data available.");
        return;
      }
      if (!validateForm()) {
        toast.error("Please correct the form errors before submitting.");
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      if (totalPrice === 0) {
        toast.error("Total price cannot be 0. Please review your selections.");
        return;
      }

      // Create FormData instance
      const formDataToSubmit = new FormData();

      // Append regular form fields
      for (const [key, value] of Object.entries(formData)) {
        if (key === "photos") {
          // Append files separately
          formData.photos.forEach((file) => {
            formDataToSubmit.append("photos", file);
          });
        } else if (Array.isArray(value)) {
          // Handle array values (e.g., multi-select options)
          value.forEach((item) => formDataToSubmit.append(key, item));
        } else {
          // Handle other values
          formDataToSubmit.append(key, value);
        }
      }

      // Append total price
      formDataToSubmit.append("totalPrice", totalPrice);
      // Perform the API request and handle the response
      console.log("formdatst", formDataToSubmit);

      try {
        const response = await checkCustomer(formDataToSubmit);
        // console.log("responce",response)
        if (response.success) {
          toast.success("Customer check successful!");
          navigate("/booking-overview", {
            state: { formData: { ...formData, totalPrice } },
          });
        } else {
          toast.error(
            response.message || "An error occurred while checking the customer."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again later."
        );
      }
    },
    [formData, totalPrice, errors, navigate, validateForm]
  );
  const filteredBedroomOptions =
    formData.selectHomeStyle === "Town House/3 Stories"
      ? NUMBER_OF_BEDROOMS_OPTIONS.filter(
          (option) =>
            option.value === "3 Bedroom" || option.value === "4 Bedroom"
        )
      : NUMBER_OF_BEDROOMS_OPTIONS;

  useEffect(() => {
    // Check if the selected home style is "Town House/3 Stories"
    if (formData.selectHomeStyle === "Town House/3 Stories") {
      // If the selected number of bedrooms is invalid, update it
      if (
        formData.numberOfBedrooms !== "3 Bedroom" &&
        formData.numberOfBedrooms !== "4 Bedroom"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          numberOfBedrooms: "3 Bedroom", // Default to a valid option
        }));
      }
    } else {
      // If the home style is not "Town House/3 Stories", ensure the number of bedrooms can be any option
      if (
        formData.numberOfBedrooms === "3 Bedroom" ||
        formData.numberOfBedrooms === "4 Bedroom"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          numberOfBedrooms: "", // Reset to empty or set to a default value if necessary
        }));
      }
    }

    // Clear error related to number of bedrooms
    setErrors((prevErrors) => ({
      ...prevErrors,
      numberOfBedrooms: "",
    }));
  }, [formData.selectHomeStyle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            {location.state && location.state.formData
              ? "Edit Your Booking"
              : "Book Your Service"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputField
                label="Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                error={errors.customerName}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={errors.email}
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                error={errors.contactNumber}
              />
              <InputField
                label="First Line of Address"
                name="firstLineOfAddress"
                value={formData.firstLineOfAddress}
                onChange={handleInputChange}
                required
                error={errors.firstLineOfAddress}
              />
              <InputField
                label="Town"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                required
                error={errors.town}
              />
              <InputField
                label="Postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
                error={errors.postcode}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
              {/* <div className="relative mt-5 ">
                <DatePicker
                  selected={
                    formData.selectedDate
                      ? new Date(formData.selectedDate)
                      : null
                  }
                  onChange={handleDateChange}
                  onMonthChange={handleMonthChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date("2024-11-05")}
                  filterDate={isWeekday}
                  excludeDates={disabledDates}
                  className={`peer h-10 w-full border-b-2  border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
                    errors.selectedDate ? "border-red-500" : ""
                  }`}
                  placeholderText="Select Date"
                  calendarClassName="ml-10 "
                  required
                //   dayClassName={(date) => {
                //     const isBooked = disabledDates.some(d => d.toDateString() === date.toDateString());
                //     return isBooked ? "bg-red-500 text-white cursor-not-allowed" : "";
                // }}
               
                />

                <label
                  className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
                    errors.selectedDate
                      ? "text-red-500"
                      : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
                  }`}
                >
                  Date
                </label>
                {errors.selectedDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.selectedDate}
                  </p>
                )}
              </div> */}
              <div className="relative mt-3">
                <DatePicker
                  selected={
                    formData.selectedDate
                      ? new Date(formData.selectedDate)
                      : null
                  }
                  onChange={handleDateChange}
                  onMonthChange={handleMonthChange}
                  onCalendarOpen={() =>
                    handleMonthChange(new Date("2024-11-05"))
                  }
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date("2024-11-05")}
                  filterDate={isWeekday}
                  excludeDates={disabledDates}
                  className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
                    errors.selectedDate ? "border-red-500" : ""
                  }`}
                  placeholderText="Select Date"
                  calendarClassName="ml-10"
                  required
                />
                <label
                  className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
                    errors.selectedDate
                      ? "text-red-500"
                      : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
                  }`}
                >
                  Date
                </label>
                {errors.selectedDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.selectedDate}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Select Time Slot
                </label>
                <Select
                  label="Time Slot"
                  name="selectedTimeSlot"
                  value={filteredTimeSlotOptions.find(
                    (option) => option.value === formData.selectedTimeSlot
                  )}
                  onChange={(option) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedTimeSlot: option.value,
                    }))
                  }
                  options={filteredTimeSlotOptions} // Only show available slots
                  className="mt-2"
                  placeholder="Select a Time Slot"
                  isLoading={loading}
                  isDisabled={loading || !formData.selectedDate}
                />
                {errors.selectedTimeSlot && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.selectedTimeSlot}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Select Service
                </label>
                <Select
                  options={SERVICE_OPTIONS}
                  onChange={handleServiceChange}
                  className="mt-1"
                  value={SERVICE_OPTIONS.find(
                    (option) => option.value === formData.selectService
                  )}
                  
                />
              </div>

              {formData.selectService === "Gutter Cleaning" && (
                <div className="form-group mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you also need Gutter Cleaning for the below.
                  </label>
                  <div className="space-y-2">
                    {GUTTER_CLEANING_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.value}
                          value={option.value}
                          checked={formData.gutterCleaningOptions.includes(
                            option.value
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            handleOptionChange(
                              isChecked
                                ? [
                                    ...formData.gutterCleaningOptions,
                                    option.value,
                                  ]
                                : formData.gutterCleaningOptions.filter(
                                    (val) => val !== option.value
                                  ),
                              "gutterCleaningOptions"
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={option.value}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.selectService === "Gutter Repair" && (
                <div className="form-group mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select the services
                  </label>
                  <div className="space-y-2">
                    {GUTTER_REPAIRS_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.value}
                          value={option.value}
                          checked={formData.gutterRepairsOptions.includes(
                            option.value
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            handleOptionChange(
                              isChecked
                                ? [
                                    ...formData.gutterRepairsOptions,
                                    option.value,
                                  ]
                                : formData.gutterRepairsOptions.filter(
                                    (val) => val !== option.value
                                  ),
                              "gutterRepairsOptions"
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={option.value}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.gutterRepairsOptions && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.gutterRepairsOptions}
                    </p>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Style
                </label>
                <Select
                  options={PROPERTY_STYLE_OPTIONS}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: {
                        name: "selectHomeStyle",
                        value: selectedOption.value,
                      },
                    })
                  }
                  value={PROPERTY_STYLE_OPTIONS.find(
                    (option) => option.value === formData.selectHomeStyle
                  )}
                  className="mt-1"
                  isClearable
                />
                {errors.selectHomeStyle && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.selectHomeStyle}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Of Bedrooms
                </label>
                <Select
                  options={
                    formData.selectService === "Gutter Repair"
                      ? [
                          { value: "Ground", label: "Ground" },
                          ...filteredBedroomOptions,
                          // { value: "Ground", label: "Ground" },
                        ]
                      : filteredBedroomOptions
                  }
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: {
                        name: "numberOfBedrooms",
                        value: selectedOption.value,
                      },
                    })
                  }
                  value={
                    formData.selectService === "Gutter Repair"
                      ? [
                          ...filteredBedroomOptions,
                          { value: "Ground", label: "Ground" },
                        ].find(
                          (option) => option.value === formData.numberOfBedrooms
                        )
                      : filteredBedroomOptions.find(
                          (option) => option.value === formData.numberOfBedrooms
                        )
                  }
                  className="mt-1"
                  isClearable
                />
                {errors.numberOfBedrooms && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.numberOfBedrooms}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-1">
              <label
                htmlFor="message"
                className=" text-sm font-medium text-gray-700 mb-1"
              >
                Additional Information (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                className=" px-2 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="form-group mt-4 ">
                <SelectField
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  options={[{ value: "PayPal", label: "PayPal" }]}
                  error={errors.paymentMethod}
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos (optional)
                </label>
                <input
                  type="file"
                  name="photos"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm"
                  multiple
                />
                {errors.photos && errors.photos.length > 0 && (
                  <div className="mt-2">
                    {errors.photos.map((error, index) => (
                      <p key={index} className="text-xs text-red-500">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mt-6 mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Price (Including VAT)
                  </h3>
                  <div className="text-2xl font-bold text-blue-700">
                    £{totalPrice}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="termsConditions"
                      checked={formData.termsConditions}
                      onChange={handleTermsConditionsChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="termsConditions"
                      className="ml-2 text-sm text-gray-900"
                    >
                      I accept the{" "}
                      <span
                        className="text-blue-500 underline cursor-pointer"
                        onClick={handleTermsConditionsClick}
                      >
                        Terms & Conditions
                      </span>
                    </label>
                  </div>
                  {errors.termsConditions && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.termsConditions}
                    </p>
                  )}
                </div>
                {showTermsConditions && (
                  <TermsAndConditions
                    isOpen={showTermsConditions}
                    onClose={handleCloseTermsConditions}
                  />
                )}
              </div>
              {/* <div className="mb-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="termsConditions"
                    checked={formData.termsConditions}
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        termsConditions: e.target.checked,
                      }));
                      if (errors.termsConditions) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          termsConditions: "",
                        }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="termsConditions"
                    className="ml-2 text-sm text-gray-900"
                  >
                    I accept the{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-blue-500 underline"
                    >
                      Terms & Conditions
                    </a>
                  </label>
                </div>
                {errors.termsConditions && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.termsConditions}
                  </p>
                )}
              </div> */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {location.state && location.state.formData
                  ? "Update Booking"
                  : "Review Booking"}
              </motion.button>
            </div>
          </form>

          <HomeStyleModal
            isOpen={showHomeStyleModal}
            onClose={() => setShowHomeStyleModal(false)}
          />
        </div>
      </motion.div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default ServiceBookingForm;
