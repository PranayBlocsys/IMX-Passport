import React, { useEffect, useState } from "react";
import { config, passport } from "@imtbl/sdk";
import "../../App.css";

const Wallet = () => {
  const [userDetails, SetUserDetails] = useState("");
  const [address, setAddress] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PUBLISHABLE_KEY = "pk_imapik-test-Lhdzafzsfz$cyEL5fwH-";

  const CLIENT_ID = "7tlQNue4X0DXO2L491bwyBgLs7jFeDXY";

  const passportInstance = new passport.Passport({
    baseConfig: {
      environment: config.Environment.SANDBOX,
      publishableKey: PUBLISHABLE_KEY,
    },
    clientId: CLIENT_ID,
    redirectUri: "https://d733-182-156-135-1.ngrok-free.app/redirect",
    logoutMode: "redirect",
    audience: "platform_api",
    scope: "openid offline_access email transact",
  });

  const handleConnectWallet = async () => {
    try {
    
      // If successful, perhaps redirect the user or update the state
      const login = await passportInstance.login();
      setIsLoggedIn(true);
      console.log("Login successful", login);
      const userProfile = await passportInstance.getUserInfo();

      SetUserDetails(userProfile);
    } catch (error) {
      // Handle errors that occur during login
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleLogout = async () => {
    await passportInstance.logout();
    setIsLoggedIn(false);
  };

  const handelEVMConnect = async () => {
    const provider = passportInstance.connectEvm();
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    setAddress(accounts);
  };

  useEffect(() => {
    const callBackValue = passportInstance.loginCallback();
    console.log(callBackValue);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h1 className="jersey-10-regular">IMX Passport</h1>

      {!isLoggedIn ? (
        <button className="button-common" onClick={handleConnectWallet}>
          Login
        </button>
      ) : (
        <button className="button-common" onClick={handleLogout}>
          {" "}
          Logout{" "}
        </button>
      )}

      <button className="button-common" onClick={handelEVMConnect}>
        {" "}
        Connect IMX Wallet
      </button>
      <div className="roboto-mono">{userDetails.email}</div>
      <div className="roboto-mono">{address}</div>
    </div>
  );
};

export default Wallet;
