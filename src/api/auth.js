import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("ai-tk", user.uid);
        return { data: { token: user.uid } };
    } catch (error) {
        console.error("Error logging in:", error);
        return { error: error.message };
    }
}

export async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem("ai-tk");
        return { success: true };
    } catch (error) {
        console.error("Error logging out:", error);
        return { error: error.message };
    }
}

export async function register(user) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const newUser = userCredential.user;
        await setDoc(doc(db, "users", newUser.uid), {
            name: user.name,
            email: user.email
        });
        return { success: true };
    } catch (error) {
        console.error("Error registering user:", error);
        return { error: error.message };
    }
}

export async function currentUser() {
    const user = auth.currentUser;
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        return { data: userDoc.data() };
    }
    return { error: "No user logged in" };
}

export async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem("ai-tk", user.uid);
        return { data: { token: user.uid } };
    } catch (error) {
        console.error("Error signing in with Google:", error);
        return { error: error.message };
    }
}
