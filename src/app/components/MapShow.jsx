'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;
  
  return (
    <>
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-500" />
      ))}
      {halfStars === 1 && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStarEmpty} className="text-gray-300" />
      ))}
    </>
  );
};

const ShopCard = ({ shopData }) => (
  <div key={shopData.displayName.text} className="mx-3 mt-6 flex flex-col self-start rounded-lg bg-white text-surface shadow-lg dark:bg-surface-dark dark:text-white sm:shrink-0 sm:grow sm:basis-0 transform transition-transform hover:scale-105 hover:shadow-2xl border-gray border-4">
    <a href={shopData.websiteUri} target="_blank" rel="noopener noreferrer" className="block border-black">
      {shopData.photos && shopData.photos.length > 0 ? (
        <img className="w-full h-[400px] object-cover rounded-t-lg" src={fetchNewPhoto(shopData.photos[0].name)} alt={shopData.displayName.text} />
      ) : (
        <p>No photos available</p>
      )}
      <div className="p-4 text-xl">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{shopData.displayName.text}</h2>
        {shopData.currentOpeningHours && (
          <p className={`mt-2 font-bold ${shopData.currentOpeningHours.openNow ? 'text-green-600' : 'text-red-600'} dark:${shopData.currentOpeningHours.openNow ? 'text-green-400' : 'text-red-400'}`}>
            {shopData.currentOpeningHours.openNow ? '現在営業中' : '営業時間外'}
          </p>
        )}
        <p className="mt-2 flex items-center">
          {renderStars(shopData.rating)}
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">レビュー数：</span>
          <span className="text-gray-600 dark:text-gray-300">{shopData.userRatingCount}</span>
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">飲み放題：</span>
          <span className="text-gray-600 dark:text-gray-300">{shopData.free_drink}</span>
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">食べ放題：</span>
          <span className="text-gray-600 dark:text-gray-300">{shopData.free_food}</span>
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">クーポン：</span>
          <a href={shopData.coupon_url} target="_blank">
            <span className="text-gray-600 dark:text-gray-300">{shopData.ktai_coupon}</span>
          </a>
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">個室：</span>
          <span className="text-gray-600 dark:text-gray-300">{shopData.private_room}</span>
        </p>
        <p className="mt-2">
          <span className="font-bold text-gray-800 dark:text-gray-100">電話番号：</span>
          <span className="text-gray-600 dark:text-gray-300">{shopData.nationalPhoneNumber}</span>
        </p>
        
      </div>
    </a>
  </div>
);
// 地図の動作用関数群
const render = (status) => {
  return <h1>{status}</h1>;
};

// 地図コンポーネント
const Map = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef(null); // 地図を表示するための参照を作成
  const [map, setMap] = useState(); // 地図の状態を管理するためのフック

  // 地図の初期化
  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // 地図オプションの更新
  useEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  // イベントリスナーの設定
  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach(eventName => google.maps.event.clearListeners(map, eventName));
      if (onClick) {
        map.addListener("click", onClick);
      }
      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} /> {/* 地図を表示するためのdiv */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map }); // 子コンポーネントに地図を渡す
        }
      })}
    </>
  );
};

// マーカーコンポーネント
const Marker = (options) => {
  const [marker, setMarker] = useState();

  // マーカーの初期化
  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // コンポーネントのアンマウント時にマーカーを削除
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  // マーカーオプションの更新
  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null; // マーカーは地図上に表示されるため、ここでは何も表示しない
};

// ホットペッパーを呼び出す関数
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
    return null;
  }
};
// 写真取得API
const fetchNewPhoto = (name) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
  return url;
};

// テキスト検索API
const fetchNewText = async (lat, lng, radius,freeword) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.photos,places.nationalPhoneNumber,places.currentOpeningHours"
      },
      body: JSON.stringify({
        textQuery: freeword,
        pageSize: 30,
        locationBias: {
          "circle": {
            "center": { "latitude": lat, "longitude": lng },
            "radius": radius
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
    return data["places"];
  } catch (error) {
    console.error("Error:", error);
    return []; // エラー発生時に空の配列を返す
  }
};

// メインのアプリケーションコンポーネント
const MapShow = () => {
  const [clicks, setClicks] = useState([]); // クリックした位置を保存するためのフック
  const [zoom, setZoom] = useState(15); // 初期ズームレベル
  const [center, setCenter] = useState({ lat: 33.588584, lng: 130.400278 }); // 地図の中心位置

  // 地図がクリックされた時の処理
  const onClick = (e) => {
    setClicks([...clicks, e.latLng]); // クリックした位置を保存
  };

  // 地図のパンやズームが完了した時の処理
  const onIdle = (map) => {
    setZoom(map.getZoom()); // ズームレベルを保存
    setCenter(map.getCenter().toJSON()); // 中心位置を保存
  };


  // useEffectが実行されているかどうかを判定するために用意しています
  const [isAvailable, setAvailable] = useState(false);
  const isFirstRef = useRef(true);
  /*
   * ページ描画時にGeolocation APIが使えるかどうかをチェックしています
   * もし使えなければその旨のエラーメッセージを表示させます
   */
  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      if ('geolocation' in navigator) {
        setAvailable(true);
      }
    }
  }, []);


  // 半径を指定
  const [radius, setRadius] = useState(500);
  const handleRadius = (e) => {
    setRadius(e.target.value)
  }
  // 検索ワードを指定
  const [freeword,setFreeword] = useState("居酒屋")
  const handleFreeword = (e) => {
    setFreeword(e.target.value)
  }
  function filterValidShops(shopArray) {
    return shopArray.filter(shop => shop.nationalPhoneNumber && shop.photos && shop.photos.length > 0 && shop.rating > 3.9 && shop.userRatingCount > 99);
  }
  // 本物の送信ボタンを押したときの動作
  const [shopDatas, setShopDatas] = useState([]);
  const handleSubmitSearch = async (e) => {
    e.preventDefault();


    let shopResult = await fetchNewText(center.lat, center.lng, radius,freeword)
    shopResult = filterValidShops(shopResult)


    // クーポン情報を追加する
    for (let i = 0; i < shopResult.length; i++) {
      let phoneNum = shopResult[i].nationalPhoneNumber
      phoneNum = phoneNum.split("-").join("")
      let hot = await fetchGourmetData(phoneNum)
      // クーポンの有無
      shopResult[i].ktai_coupon = "なし"
      shopResult[i].free_drink = "不明"
      shopResult[i].free_food = "不明"
      shopResult[i].private_room = "不明"
      shopResult[i].coupon_url = ""
      if (hot == null || hot.length === 0) {
        shopResult[i].ktai_coupon = "なし";
      } else {
        if (hot[0].ktai_coupon == 1) {
        shopResult[i].ktai_coupon = "あり"
        shopResult[i].coupon_url = hot[0].coupon_urls.sp
        }
        shopResult[i].free_drink = hot[0].free_drink
        shopResult[i].free_food = hot[0].free_food
        shopResult[i].private_room = hot[0].private_room
        
      }
      
    }
    console.log(shopResult[0].currentOpeningHours.openNow)
    setShopDatas(shopResult)
    
  }


  if (isFirstRef.current) return <div className="App">Loading...</div>;

  return (
    <div className='flex flex-col'>
      <div style={{ display: 'flex', height: '80vh', width: '100vw' }} className='mx-6'>
        {/* Google Maps APIの読み込みと地図の表示 */}
        <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} render={render}>
          <Map
            center={center}
            zoom={zoom}
            onClick={onClick}
            onIdle={onIdle}
            style={{ flexGrow: '1', height: '100%', width: '70%' }}
          >
            {/* クリックした位置にマーカーを表示 */}
            {clicks.map((latLng, i) => (
              <Marker key={i} position={latLng} />
            ))}
          </Map>
        </Wrapper>
        <div style={{ padding: '1rem', width: '40%' }} className='flex flex-col mr-10'>
          <form onSubmit={handleSubmitSearch}>
            <label className='text-2xl py-4' htmlFor="lat">緯度</label>
            <input
              className='text-3xl block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              type="number"
              id="lat"
              name="lat"
              value={center.lat}
              onChange={(e) => setCenter({ ...center, lat: Number(e.target.value) })}
            />
            <br />
            <label className='text-2xl py-4' htmlFor="lng">経度</label>
            <input
              className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-3xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              type="number"
              id="lng"
              name="lng"
              value={center.lng}
              onChange={(e) => setCenter({ ...center, lng: Number(e.target.value) })}
            />
            <br />
            <label className='text-2xl py-4' htmlFor="radius">半径[m]</label>
            <input
              className='mb-4 block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-3xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              type="number"
              id="radius"
              name="radius"
              value={radius}
              onChange={handleRadius}
            />
            <label className='text-2xl py-4' htmlFor="freeword">検索ワード</label>
            <input
              className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-3xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              type="text"
              id="freeword"
              name="freeword"
              value={freeword}
              onChange={handleFreeword}
            />
            <button className='animate-bounce focus:animate-none hover:animate-none inline-flex text-md font-medium bg-indigo-900 mt-5 px-9 py-3 rounded-lg tracking-wide text-white' type="submit">検索</button>
          </form>

        </div>
      </div>

      <div>
      <div className="grid grid-cols-1 sm:grid md:grid-cols-3">
        {shopDatas && shopDatas.length > 0 ? (
          shopDatas.map((shopData) => (
            <ShopCard key={shopData.displayName.text} shopData={shopData} />
          ))
        ) : (
          <p>No shops found</p>
        )}
      </div>

      </div>
    </div>
  );
};

export default MapShow;
