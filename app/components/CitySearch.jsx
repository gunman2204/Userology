"use client";
import {  useEffect } from "react";

export default function CitySearch({ setCityName }) {
    
    const searchParams = useSearchParams();
    const cityName = searchParams.get("name"); // Extract ?name=NewYork
  

return (
    <div>
      <h1>Weather in {cityName || "Unknown City"}</h1>
    </div>
  );
}
  

