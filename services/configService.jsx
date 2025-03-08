import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const fetchConfig = async () => {
  try {
    const configDoc = await getDoc(doc(db, "appConfig", "globalConfig"));
    if (configDoc.exists()) {
      return configDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
