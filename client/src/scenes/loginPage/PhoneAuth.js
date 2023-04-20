import React, { useState } from "react";
import { auth } from "../firebase";

function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleSendCode = () => {
    auth
      .signInWithPhoneNumber(phoneNumber)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVerifyCode = () => {
    confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        // handle successful verification
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Phone Authentication</h2>
      <div>
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>
      <div>
        <button onClick={handleSendCode}>Send Code</button>
      </div>
      {confirmationResult && (
        <div>
          <label htmlFor="code">Verification Code:</label>
          <input
            type="text"
            id="code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
      )}
    </div>
  );
}

export default PhoneAuth;
