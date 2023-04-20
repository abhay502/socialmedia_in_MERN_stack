const admin = require('firebase-admin');

const serviceAccount = require('./otplogin-83b1f-firebase-adminsdk-it6sb-d7de274227.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-name.firebaseio.com'
});
