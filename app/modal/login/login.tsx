import { useEffect, useState } from "react";
import "./login.css";
import "primeicons/primeicons.css";
import axios from "axios";

const Login = ({ headers, loading, accessToken, logged, tenant }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [iconVisibility, setIconVisibility] = useState("pi pi-eye-slash");
  const [username, setUsername] = useState("");
  const [userError, setUserError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  let apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const changeVisibility = () => {
    if (passwordVisibility == "password") {
      setPasswordVisibility("text");
      setIconVisibility("pi pi-eye");
    } else {
      setPasswordVisibility("password");
      setIconVisibility("pi pi-eye-slash");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // Altere para a tecla desejada
        login();
      }
    };

    // Adiciona o evento de teclado
    window.addEventListener("keydown", handleKeyPress);

    // Remove o evento ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  const login = () => {
    const splited: string[] = username.split("/");
    if (splited.length < 2) {
      setUserError(
        "Invalid Username format. Certify to use 'organization/username'."
      );
      return;
    }
    if (password == "" || password == null) {
      setPasswordError("Password can't be empty");
      return;
    }

    let loginData = { username: splited[1], password: password };
    tenant(splited[0]);

    loading(true);
    // Enviar a requisição de login com Axios
    axios({
      method: "post",
      url: apiUrl + "auth-service/login",
      headers: {
        "x-tenant": splited[0], // Headers precisam ser passados como um objeto
      },
      data: loginData, // Usar "data" para enviar o corpo da requisição
    })
      .then((response) => {
        accessToken(response.data.accessToken); // Armazenar o accessToken após o login
        sessionStorage.setItem("profile_data", JSON.stringify(response.data));
        logged(true);
        loading(false);
      })
      .catch((error) => {
        setUserError("");
        setPasswordError("Invalid Credentials");
        loading(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-login">
        <h2>Access your account</h2>
        <div className="loginContent">
          <p>To access the platform, access your data</p>
          <label className="loginLabel">Organization/username</label>
          <input
            type="text"
            className="inputLogin"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <p className="errorAlert">{userError}</p>
          <label className="loginLabel">Password</label>
          <div className="divPassword">
            <input
              type={passwordVisibility}
              className="inputLoginPassword"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button onClick={changeVisibility} className="changeVisible">
              <span className={iconVisibility}></span>
            </button>
          </div>
          <p className="errorAlert">{passwordError}</p>
          <button className="loginButton" onClick={login}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
