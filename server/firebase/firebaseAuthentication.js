
const firebase = require('firebase');
console.log("456")
// Get the authentication service
const auth = firebase.auth();


// Send a verification code to the user's phone
  
auth.sendSignInLinkToPhoneNumber(7907940178, actionCodeSettings)
  .then(function() {
    // The verification code has been sent to the user's phone
    console.log("send otp")
  })
  .catch(function(error) {
    // An error occurred while sending the verification code
  });




























// Sign the user in using the verification code they received on their phone
auth.signInWithPhoneNumber(phoneNumber, verificationCode)
  .then(function(result) {
    // The user has been signed in
  })
  .catch(function(error) {
    // An error occurred while signing the user in
  });