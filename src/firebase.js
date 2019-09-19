import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBCaNIJIEQ1D75g0Hl_HalY9V3pLRyC5VU',
  authDomain: 'moneybook-8069f.firebaseapp.com',
  databaseURL: 'https://moneybook-8069f.firebaseio.com',
  projectId: 'moneybook-8069f',
  storageBucket: 'moneybook-8069f.appspot.com',
  messagingSenderId: '776960530787',
  appId: '1:776960530787:web:f07bbdf94aae4b90',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
