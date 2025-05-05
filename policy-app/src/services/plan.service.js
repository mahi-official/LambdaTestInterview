import axios from 'axios';

// const BASE_URL = 'https://13.200.160.35/plans';

const BASE_URL = 'http://127.0.0.1:8000/plans'

export const fetchFilteredPlans = async (filters) => {
  const params = {};

  // Only add filters that are selected
  if (filters.search) params.q = filters.search;
  if (filters.type) params.planType = filters.type;
  if (filters.gender) params.gender = filters.gender;
  if (filters.sumInsured) params.sumInsured = filters.sumInsured;
  if (filters.location) params.location = filters.location;
  if (filters.ageGroup) params.ageGroup = filters.ageGroup;

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered plans:', error);
    return [];
  }
};
