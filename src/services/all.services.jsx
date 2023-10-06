import {
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    doc,
} from 'firebase/firestore';
import { db } from './firebase';

// export const getData = async () => {
//     const querySnapshot = await getDocs(collection(db, 'todo'));

//     const datas = [];

//     querySnapshot.forEach((doc) => {
//         datas.push({ ...doc.data(), id: doc.id });
//     });

//     return datas;
// };

export const addData = async (data) => {
    await addDoc(collection(db, 'todo'), data);
};
