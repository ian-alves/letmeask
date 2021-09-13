import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

// Record = objeto (usado aqui para referenciar um registro de um banco orientado a objeto)
type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
        authorId: string
    }>;
}>;

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        // once -> on (on fica ouvindo alterações dentro da sala [roomId])
        roomRef.on('value', room => {
            // ?? se for null retorna o valor
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {}; // ou as FirebaseQuestions

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    // retorna booleano se encontou o usuário (user.id) dentro do objeto likes
                    // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        })

        return () => {
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    return { questions, title }
}