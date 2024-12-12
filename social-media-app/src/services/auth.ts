import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { auth } from "../firebase"; 
  import { toast } from "react-toastify"; 
  

  export const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Sign up successful!"); 
      return userCredential.user; 
    } catch (error: unknown) {
      const errorMessage = (error as { message: string }).message;
      toast.error(`Error: ${errorMessage}`); 
      throw new Error(errorMessage); 
    }
  };
  
 
  export const logIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Login successful!"); 
      return userCredential.user; 
    } catch (error: unknown) {
      const errorMessage = (error as { message: string }).message;
      toast.error(`Error: ${errorMessage}`); 
      throw new Error(errorMessage); 
    }
  };
  