import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export async function createProject(projectData) {
    try {
        const docRef = await addDoc(collection(db, "projects"), projectData);
        return { id: docRef.id, ...projectData };
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}

export async function getAllProjects(userId) {
    try {
        const q = query(collection(db, "projects"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export async function getProjectById(projectId) {
    try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Project not found");
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        throw error;
    }
}

export async function updateProject(projectId, updatedData) {
    try {
        const docRef = doc(db, "projects", projectId);
        await updateDoc(docRef, updatedData);
        return { id: projectId, ...updatedData };
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
}

export async function deleteProject(projectId) {
    try {
        await deleteDoc(doc(db, "projects", projectId));
        return { success: true };
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
}