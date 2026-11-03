import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firebase Firestore connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Auth helpers
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error) {
    console.warn('Google sign-in popup closed or cancelled:', error);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Real-time Firestore sync helpers with strict handleFirestoreError wrapping
export function subscribeToGameState(
  onUpdate: (state: any) => void,
  onError?: (err: any) => void
): () => void {
  const docRef = doc(db, 'game_state', 'current');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'game_state/current');
      onError?.(error);
    }
  );
}

export function subscribeToDrawHistory(
  onUpdate: (history: any[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'draw_history');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => d.data());
      // sort by roundIndex desc
      docs.sort((a: any, b: any) => (b.roundIndex || 0) - (a.roundIndex || 0));
      onUpdate(docs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'draw_history');
      onError?.(error);
    }
  );
}

export async function updateFirestoreGameState(state: any) {
  const docRef = doc(db, 'game_state', 'current');
  try {
    await setDoc(docRef, {
      ...state,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'game_state/current');
  }
}

export async function addFirestoreDrawResult(result: any) {
  const safeId = String(result.roundId).replace('#', '_');
  const docRef = doc(db, 'draw_history', safeId);
  try {
    await setDoc(docRef, {
      ...result,
      savedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `draw_history/${safeId}`);
  }
}

