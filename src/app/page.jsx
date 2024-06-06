import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Header from "./components/Header"
import Footer from "./components/Footer"
import MapShow from "./components/MapShow"


export default function Home() {
  return (
    <>
      <Header />
      <MapShow />
      <Footer />
    </>
  );
}

// const fetchNewText = async () => {
//   try {
//     const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//         "X-Goog-FieldMask": "places.displayName"
//       },
//       body: JSON.stringify({
//         textQuery: "居酒屋",
//         pageSize: 10,
//         locationBias: {
//           "circle": {
//             "center": {"latitude": 33.587831895792995, "longitude":130.4050440239325},
//             "radius": 500.0
//           }
//         },
//         languageCode: "ja"
//       })
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       console.error("Error data:", errorData);
//       throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//     }

//     const data = await res.json();
//     // console.log(data["places"]);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// fetchNewText();