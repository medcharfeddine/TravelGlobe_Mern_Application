import React from "react";
import "./App.css";
import { Map } from "mapbox-gl";

const pinAddSuccess = () => {
  toast.success("Added pin!");
};

const userNotLoggedIn = () => {
  toast.warning("Login to account to set pins!");
};
const userLoggedOut = (userS) => {
  toast.warning("Logout from " + userS);
};

const pinAddFailure = () => {
  toast.error("Couldn't add pin. Please fill all data");
};

const App = () => {
  const myStorage = window.localStorage;

  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [descr, setDescr] = useState(null);
  const [rating, setRating] = useState(1);

  const [currentUser, setCurrentUser] = useState(null);

  const [viewPort, setViewPort] = useState({
    longitude: 12.4,
    latitude: 37.8,
    zoom: 14,
  });

  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const responce = await axios.get("/pins");
        setPins(responce.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPins();
  }, []);

  const handleMarkerClicked = (id, lat, lon) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    let lat = e.lngLat.lat;
    let long = e.lngLat.lng;
    setNewPlace({
      lat: lat,
      lng: long,
    });
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      userName: currentUser,
      title: title,
      descr: descr,
      rating: rating,
      lat: newPlace.lat,
      lon: newPlace.lng,
    };

    try {
      if (!currentUser) {
        userNotLoggedIn();
      } else {
        const responce = await axios.post("/pins", newPin);
        setPins([...pins, responce.data]);
        setNewPlace(null);
        pinAddSuccess();
        setRating(1);
        setDescr(null);
        setTitle(null);
      }
    } catch (err) {
      console.log(err);
      pinAddFailure();
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    userLoggedOut(currentUser);
    setCurrentUser(null);
  };

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="App">
      <Map
        container="map"
        mapStyle="mapbox://styles/medcharfeddine/cli3a81kl02g401r055oz488e"
        projection={"globe"}
        initialViewState={{ viewPort }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      ></Map>
    </div>
  );
};

export default App;
