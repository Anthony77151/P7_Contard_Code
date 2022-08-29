import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/Routes";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";


function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  // contrôle le token de l'utilisateur
  useEffect(() => {
    const fetchToken = async() => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
      .then((res) => setUid(res.data))
      .catch((err) => console.log("No token"))
    }
    fetchToken();

    // si on à l'id de l'utilisateur, on récupère les infos de l'utilisateur
    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  return (
    // Nous permet de récuperer l'id de notre utilisateur
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
