const servicePrices = {
  gutterCleaning: {
    Garage: 40,
    Conservatory: 40,
    Extension: 40,
  },
  gutterRepairs: {
    "Running Outlet": 65,
    "Union Joint": 65,
    Corner: 65,
    "Gutter Bracket": 65,
    Downpipe: 65,
  },
};

const housePrices = {
  Terrace: {
    "2 Bedroom": 69,
    "3 Bedroom": 79,
    "4 Bedroom": 99,
    "5 Bedroom": 129,
  },
  "Semi-Detached": {
    "2 Bedroom": 79,
    "3 Bedroom": 89,
    "4 Bedroom": 99,
    "5 Bedroom": 139,
  },
  Detached: {
    "2 Bedroom": 79,
    "3 Bedroom": 89,
    "4 Bedroom": 99,
    "5 Bedroom": 119,
  },
  Bungalow: {
    "2 Bedroom": 79,
    "3 Bedroom": 89,
    "4 Bedroom": 99,
    "5 Bedroom": 109,
    "Ground": 0,
  },
  "Town House/3 Stories": {
    "3 Bedroom": 129,
    "4 Bedroom": 139,
  },
};

export const calculateTotalPrice = (formData) => {

  let totalPrice = 0;

  // Special check for "Town House/3 Stories" to limit bedroom options
  if (
    formData.selectHomeStyle === "Town House/3 Stories" &&
    (formData.numberOfBedrooms !== "3 Bedroom" &&
      formData.numberOfBedrooms !== "4 Bedroom")
  ) {
    return 0;
  }

  // Calculate base price based on house type and number of bedrooms ONLY for gutter cleaning
  if (formData.selectService === "Gutter Cleaning") {
    const basePrice =
      housePrices[formData.selectHomeStyle]?.[formData.numberOfBedrooms];
    

    if (basePrice) {
      totalPrice += basePrice;
    } else {
      console.log("Base price not found for selected house style and bedroom count.");
    }

    // Add prices for gutter cleaning options
    if (Array.isArray(formData.gutterCleaningOptions)) {
      formData.gutterCleaningOptions.forEach((option) => {
        const price = servicePrices.gutterCleaning[option] || 0;
        // console.log(`Adding ${option} gutter cleaning: £${price}`);
        totalPrice += price;
      });
    }
  }

  // Add prices for gutter repair options
  if (formData.selectService === "Gutter Repair" && Array.isArray(formData.gutterRepairsOptions)) {
    // console.log("Processing gutter repair options:", formData.gutterRepairsOptions);
    
    let repairPrice;
    if (formData.selectHomeStyle === "Bungalow" && formData.numberOfBedrooms === "Ground") {
      repairPrice = 45;
    } else if (formData.selectHomeStyle === "Town House/3 Stories") {
      repairPrice = 85;
    } else {
      repairPrice = 65;
    }
    
    formData.gutterRepairsOptions.forEach((option) => {
      // console.log(`Adding ${option} gutter repair: £${repairPrice}`);
      totalPrice += repairPrice;
    });
  }

  // Calculate VAT (20%)
  const vatRate = 0.20;
  const vatAmount = totalPrice * vatRate;

  // Calculate total price including VAT
  const totalPriceWithVAT = totalPrice + vatAmount;

  // console.log("Total price before VAT:", totalPrice);
  // console.log("VAT amount:", vatAmount);
  // console.log("Total price with VAT:", totalPriceWithVAT);
  
  return totalPrice;
};


// const servicePrices = {
//   gutterCleaning: {
//     Garage: 40,
//     Conservatory: 40,
//     Extension: 40,
//   },
//   gutterRepairs: {
//     "Running Outlet": 65,
//     "Union Joint": 65,
//     Corner: 65,
//     "Gutter Bracket": 65,
//     Downpipe: 65,
//     "Gutter Length Replacement": 85,
//   },
// };

// const housePrices = {
//   Terrace: {
//     "2 Bedroom": 69,
//     "3 Bedroom": 79,
//     "4 Bedroom": 99,
//     "5 Bedroom": 129,
//   },
//   "Semi-Detached": {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 139,
//   },
//   Detached: {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 119,
//   },
//   Bungalow: {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 109,
//   },
//   "Town House/3 Stories": {
//     "3 Bedroom": 129,
//     "4 Bedroom": 139,
//   },
// };

// export const calculateTotalPrice = (formData) => {
//   console.log("Received formData:", formData);

//   let totalPrice = 0;

//   // Special check for "Town House/3 Stories" to limit bedroom options
//   if (
//     formData.selectHomeStyle === "Town House/3 Stories" &&
//     (formData.numberOfBedrooms !== "3 Bedroom" &&
//       formData.numberOfBedrooms !== "4 Bedroom")
//   ) {
//     console.log("Invalid bedroom selection for Town House/3 Stories.");
//     return 0; // Or return an error or notification as needed
//   }

//   // Calculate base price based on house type and number of bedrooms
//   const basePrice =
//     housePrices[formData.selectHomeStyle]?.[formData.numberOfBedrooms];
  
//   console.log("Base price:", basePrice);

//   if (basePrice) {
//     totalPrice += basePrice;
//   } else {
//     console.log("Base price not found for selected house style and bedroom count.");
//   }

//   // Add prices for gutter cleaning options
//   if (formData.selectService === "Gutter Cleaning" && Array.isArray(formData.gutterCleaningOptions)) {
//     console.log("Processing gutter cleaning options:", formData.gutterCleaningOptions);
//     formData.gutterCleaningOptions.forEach((option) => {
//       const price = servicePrices.gutterCleaning[option] || 0;
//       console.log(`Adding ${option} gutter cleaning: $${price}`);
//       totalPrice += price;
//     });
//   }

//   // Add prices for gutter repair options
//   if (formData.selectService === "Gutter Repair" && Array.isArray(formData.gutterRepairsOptions)) {
//     console.log("Processing gutter repair options:", formData.gutterRepairsOptions);
//     formData.gutterRepairsOptions.forEach((option) => {
//       const price = servicePrices.gutterRepairs[option] || 0;
//       console.log(`Adding ${option} gutter repair: $${price}`);
//       totalPrice += price;
//     });
//   }

//   // Calculate VAT (20%)
//   const vatRate = 0.20; // 20% VAT
//   const vatAmount = totalPrice * vatRate;

//   // Calculate total price including VAT
//   const totalPriceWithVAT = totalPrice + vatAmount;

//   console.log("Total price before VAT:", totalPrice);
//   console.log("VAT amount:", vatAmount);
//   console.log("Total price with VAT:", totalPriceWithVAT);
  
//   return totalPrice;
// };














// const servicePrices = {
//   gutterCleaning: {
//     Garage: 40,
//     Conservatory: 40,
//     Extension: 40,
//   },
//   gutterRepairs: {
//     "Running Outlet": 65,
//     "Union Joint": 65,
//     Corner: 65,
//     "Gutter Bracket": 65,
//     Downpipe: 65,
//     "Gutter Length Replacement": 85,
//   },
// };

// // Updated house prices
// const housePrices = {
//   Terrace: {
//     "2 Bedroom": 69,
//     "3 Bedroom": 79,
//     "4 Bedroom": 99,
//     "5 Bedroom": 129,
//   },
//   "Semi-Detached": {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 139,
//   },
//   Detached: {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 119,
//   },
//   Bungalow: {
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 109,
//   },
//   "Town House/3 Stories": {
//     "3 Bedroom": 129,
//     "4 Bedroom": 139,
//   },
// };

// export const calculateTotalPrice = (formData) => {
//   let totalPrice = 0;

//   // Special check for "Town House/3 Stories" to limit bedroom options
//   if (
//     formData.selectHomeStyle === "Town House/3 Stories" &&
//     (formData.numberOfBedrooms !== "3 Bedroom" &&
//       formData.numberOfBedrooms !== "4 Bedroom")
//   ) {
//     // If invalid bedroom selected, return 0 or handle as required
//     return 0; // Or return an error or notification as needed
//   }

//   // Calculate base price based on house type and number of bedrooms
//   const basePrice =
//     housePrices[formData.selectHomeStyle]?.[formData.numberOfBedrooms];

//   if (basePrice) {
//     totalPrice += basePrice;
//   }

//   // Add prices for gutter cleaning options
//   if (formData.selectService === "Gutter Cleaning") {
//     formData.gutterCleaningOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterCleaning[option] || 0;
//     });
//   }

//   // Add prices for gutter repair options
//   if (formData.selectService === "Gutter Repair") {
//     formData.gutterRepairsOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterRepairs[option] || 0;
//     });
//   }

//   // Calculate VAT (20%)
//   const vatRate = 0.20; // 20% VAT
//   const vatAmount = totalPrice * vatRate;

//   // Calculate total price including VAT
//   const totalPriceWithVAT = totalPrice + vatAmount;

//   return totalPriceWithVAT;
// };





// export const calculateTotalPrice = (formData) => {
//   let totalPrice = 0;

//   // Calculate base price based on house type and style
//   const basePrice =
//     housePrices[formData.selectHomeStyle]?.[formData.selectHomeType];
//   if (basePrice) {
//     totalPrice += basePrice;
//   }

//   // Add prices for gutter cleaning options
//   if (formData.selectService === "Gutter Cleaning") {
//     formData.gutterCleaningOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterCleaning[option] || 0;
//     });
//   }

//   // Add prices for gutter repair options
//   if (formData.selectService === "Gutter Repair") {
//     formData.gutterRepairsOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterRepairs[option] || 0;
//     });
//   }

//   // Calculate VAT
//   const vatRate = 0.20; // 20% VAT
//   const vatAmount = totalPrice * vatRate;

//   // Calculate total price including VAT
//   const totalPriceWithVAT = totalPrice + vatAmount;

//   // Return an object with both the base price and the total including VAT
//   return {
//     basePrice,
//     vatAmount,
//     totalPrice: totalPriceWithVAT
//   };
// };


// const servicePrices = {
//   gutterCleaning: {
//     Garage: 40,
//     Conservatory: 40,
//     Extension: 40,
//   },
//   gutterRepairs: {
//     "Running Outlet": 65,
//     "Union Joint": 65,
//     Corner: 65,
//     "Gutter Bracket": 65,
//     Downpipe: 65,
//     "Gutter Length Replacement": 85,
//   },
// };

// const housePrices = {
//   Terrace: {
//     Bungalow: 59,
//     "2 Bedroom": 69,
//     "3 Bedroom": 79,
//     "4 Bedroom": 99,
//     "5 Bedroom": 129,
//     "Town House/3 Stories": 129,
//   },
//   "Semi-Detached": {
//     Bungalow: 69,
//     "2 Bedroom": 79,
//     "3 Bedroom": 89,
//     "4 Bedroom": 99,
//     "5 Bedroom": 139,
//     "Town House/3 Stories": 139,
//   },
//   Detached: {
//     Bungalow: 79,
//     "2 Bedroom": 89,
//     "3 Bedroom": 99,
//     "4 Bedroom": 119,
//     "5 Bedroom": 149,
//     "Town House/3 Stories": 149,
//   },
// };

// export const calculateTotalPrice = (formData) => {
//   let totalPrice = 0;

//   // Calculate base price based on house type and style
//   const basePrice =
//     housePrices[formData.selectHomeStyle]?.[formData.selectHomeType];
//   if (basePrice) {
//     totalPrice += basePrice;
//   }

//   // Add prices for gutter cleaning options
//   if (formData.selectService === "Gutter Cleaning") {
//     formData.gutterCleaningOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterCleaning[option] || 0;
//     });
//   }

//   // Add prices for gutter repair options
//   if (formData.selectService === "Gutter Repair") {
//     formData.gutterRepairsOptions.forEach((option) => {
//       totalPrice += servicePrices.gutterRepairs[option] || 0;
//     });
//   }

//   // Calculate VAT (20%)
//   const vatRate = 0.20; // 20% VAT
//   const vatAmount = totalPrice * vatRate;

//   // Calculate total price including VAT
//   const totalPriceWithVAT = totalPrice + vatAmount;

//   return totalPriceWithVAT;
// };