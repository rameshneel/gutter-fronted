export const validateForm = (formData) => {
  const errors = {};

  if (!formData.customerName.trim()) {
    errors.customerName = "Name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  if (!formData.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required";
  }

  if (!formData.firstLineOfAddress.trim()) {
    errors.firstLineOfAddress = "Address is required";
  }

  if (!formData.town.trim()) {
    errors.town = "Town is required";
  }

  if (!formData.postcode.trim()) {
    errors.postcode = "Postcode is required";
  }

  if (!formData.selectedDate) {
    errors.selectedDate = "Date is required";
  }

  if (!formData.selectedTimeSlot) {
    errors.selectedTimeSlot = "Time slot is required";
  }

  if (!formData.selectService) {
    errors.selectService = "Service is required";
  }

  if (!formData.numberOfBedrooms) {
    errors.numberOfBedrooms = "Number of bedrooms is required";
  }

  if (!formData.numberOfStories) {
    errors.numberOfStories = "Number of stories is required";
  }

  if (!formData.paymentMethod) {
    errors.paymentMethod = "Payment method is required";
  }

  return errors;
};
