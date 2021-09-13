import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

// ReactNode quando o type é um componente do React
type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    // disparo sempre funções a partir do estado
    // 1° param - função que executa, 2° param - (array) qual objeto alterado que vai disparar,
    // se for vazio, dispara 1 vez ao chamar o componente 
    useEffect(() => {
        // event listener no effect onAuthStateChanged, sempre q usar, no retorno da função, descadastrar (unsubscribe)
        // para não ficar chamando em outras paginas que não usam o componente
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }

            return () => {
                unsubscribe();
            }
        });
    }, []);

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error('Missing information');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}