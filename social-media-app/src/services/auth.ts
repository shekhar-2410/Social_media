import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail, // Import for password reset
} from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import client from "../../apolloClient";
import { gql } from "@apollo/client";

const INSERT_USER_MUTATION = gql`
  mutation InsertUser($name: String!, $email: String!) {
    insertIntousersCollection(objects: { name: $name, email: $email }) {
      records {
        id
        name
        email
      }
    }
  }
`;

// Sign Up Function
export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    await client.mutate({
      mutation: INSERT_USER_MUTATION,
      variables: { name, email },
    });

    toast.success("Sign-up successful!");
    return user;
  } catch (error: unknown) {
    const errorMessage = (error as { message: string }).message;
    toast.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Login Function
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    localStorage.setItem("userDetails", JSON.stringify(userCredential.user));
    toast.success("Login successful!");
    return userCredential.user;
  } catch (error: unknown) {
    const errorMessage = (error as { message: string }).message;
    toast.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Forgot Password Function
export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset link sent to your email!");
  } catch (error: unknown) {
    const errorMessage = (error as { message: string }).message;
    toast.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};
