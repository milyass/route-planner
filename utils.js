"use strict";
const constants = require("./constants");
const axios = require("axios");

/* 
"itinerary" refers to a planned route or sequence of movements to take to reach the destination
 - it consists of multiple legs. 
 - we calculate co2 emissions of each leg by multiplying the distance by co2 emission multiplier
that corresponds to the mode of transportation */

const calculateCO2EmissionsAndTotalDistance = (itinerary) => {
  let totalCO2 = 0; // init by 0
  let totalDistance = 0; // init by 0
  if (!(itinerary.legs && Array.isArray(itinerary.legs)))
    return {
      totalCO2: 0,
      itineraryLegs: [],
      totalDistance: 0,
    };
    itinerary.legs = itinerary.legs.map((leg) => {
    if (leg.mode in constants.co2Multipliers) {
      const distanceInKm = leg.distance / 1000; // km
      const co2Multiplier = constants.co2Multipliers[leg.mode]; // for example constants.co2Multipliers['CAR'] which is 160
      const currentLegCO2 = distanceInKm * co2Multiplier; // 90km * 160
      totalCO2 += currentLegCO2; // add to the total co2 emissions
      totalDistance += distanceInKm; // add to the total distance
      return {
        mode: leg.mode, 
        distance: distanceInKm, 
        co2: currentLegCO2
      }
    }
  })
  return { totalCO2, itineraryLegs: itinerary.legs, totalDistance };
};

const formatDateToPattern = (date) => {
  const patternRegex = constants.datePattern;
  // we replace the parts of the ISO string that match the pattern with the corresponding captured groups $1 $2 ...
  const formattedDate = date
    .toISOString()
    .replace(patternRegex, "$1-$2-$3T$4:$5:$6$7$8");
  return formattedDate;
};

const formatResultPlan = (plan) => {
  try {
    if (!(plan && plan.itineraries && Array.isArray(plan.itineraries)))
      throw new Error("Plan itineraries not available");
    plan.itineraries = plan.itineraries.map((itinerary) => {
      const { startTime, endTime, duration } = itinerary;
      const { totalCO2, itineraryLegs, totalDistance } =
        calculateCO2EmissionsAndTotalDistance(itinerary);
      return {
        co2: totalCO2, // we append co2 to the itinerary here
        distance: totalDistance,
        startTime: formatDateToPattern(new Date(startTime)), // we format date to the pattern in jsonSchema,
        endTime: formatDateToPattern(new Date(endTime)), // we format date to the pattern in jsonSchema,
        duration,
        legs: itineraryLegs,
      };
    });
    plan.from.coordinates = [plan.from?.lon || 0, plan.from?.lat || 0];
    plan.to.coordinates = [plan.to?.lon || 0, plan.to?.lat || 0];
    plan.from = {
      coordinates: [plan.from?.lon || 0, plan.from?.lat || 0],
    };
    plan.to = {
      coordinates: [plan.to?.lon || 0, plan.to?.lat || 0],
    };
    delete plan.date;
    return plan;
  } catch (error) {
    throw new Error(error)
  }
};

const requestPlanFromOpenTripPlanner = async (query) => {
  try {
    const {
      fromPlace,
      toPlace,
      time,
      date,
      mode,
      arriveBy = "false",
      wheelchair = "false",
      showIntermediateStops = "true",
      locale = "en",
    } = query;
    if (!fromPlace || !toPlace || !date || !time || !mode)
      throw new Error(
        "please provide parameteres: fromPlace, toPlace, time, date, mode"
      );
    const response = await axios.get(constants.OPEN_TRIP_PLANNER_URL, {
      headers: {
        "x-api-key": constants.API_KEY,
      },
      params: {
        fromPlace,
        toPlace,
        time,
        date,
        mode,
        arriveBy,
        wheelchair,
        showIntermediateStops,
        locale,
      },
    });
    if (response?.data?.error?.message)
      throw new Error(response?.data?.error?.msg);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  calculateCO2EmissionsAndTotalDistance,
  formatDateToPattern,
  formatResultPlan,
  requestPlanFromOpenTripPlanner,
};
