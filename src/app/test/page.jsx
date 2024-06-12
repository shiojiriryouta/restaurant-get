'use client';

import React, { useState } from "react";

// 写真取得API
const fetchNewPhoto = (name) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
  return url;
};

// テキスト検索API
const fetchNewText = async (lat, lng) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.photos,places.nationalPhoneNumber"
      },
      body: JSON.stringify({
        textQuery: "居酒屋",
        pageSize: 10,
        locationBias: {
          "circle": {
            "center": { "latitude": lat, "longitude": lng },
            "radius": 500.0
          }
        },
        languageCode: "ja"
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error data:", errorData);
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(data["places"]);
    return data["places"];
  } catch (error) {
    console.error("Error:", error);
    return []; // エラー発生時に空の配列を返す
  }
};

// ホットペッパーを呼び出すテスト
const fetchGourmetData = async (tel) => {
  try {
    const res = await fetch(`/api/fetchHotPepper?tel=${tel}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const Test = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [shopDatas, setShopDatas] = useState([]);
  const [gourmetData, setGourmetData] = useState([]);

  // 現在地を取得する関数
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shops = await fetchNewText(lat, lng);
    setShopDatas(shops);
    const gourmet = await fetchGourmetData('0924062652'); // 例として電話番号を指定
    console.log(gourmet)
    setGourmetData(gourmet);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lat">Latitude:</label>
          <input
            type="text"
            id="lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lng">Longitude:</label>
          <input
            type="text"
            id="lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleGetCurrentLocation}>Get Current Location</button>
        <button type="submit">Search</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shopDatas && shopDatas.length > 0 ? (
          shopDatas.map((shopData) => (
            <div key={shopData.displayName.text} className="card max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h2>{shopData.displayName.text}</h2>
              <p>☆{shopData.rating}</p>
              {shopData.photos && shopData.photos.length > 0 ? (
                <img className="w-[300px] h-[400px] object-cover rounded-t-lg" src={fetchNewPhoto(shopData.photos[0].name)} alt={shopData.displayName.text} />
              ) : (
                <p>No photos available</p>
              )}
            </div>
          ))
        ) : (
          <p>No shops found</p>
        )}
      </div>
      {gourmetData && gourmetData.length > 0 && (
        <div>
          <h2>{gourmetData[0].name}</h2>
          <p>電話番号: {gourmetData[0].tel}</p>
          <p>住所: {gourmetData[0].address}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
