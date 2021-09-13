import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import '../styles/modal.scss';
import { database } from '../services/firebase';
import Modal from 'react-modal';
import { useState } from 'react';

type RoomParams = {
    id: string;
}

Modal.setAppElement('#root');

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [questionSelected, setQuestionSelected] = useState('');

    function openModal(questionId: string) {
        setModalIsOpen(true);
        setQuestionSelected(questionId);
    }

    function closeModal() {
        setModalIsOpen(false);
        setQuestionSelected('');
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        });

        history.push('/');
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    async function handleDeleteQuestion() {
        await database.ref(`rooms/${roomId}/questions/${questionSelected}`).remove();
        closeModal();
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask"></img>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {/* && condição ternária sem o else */}
                    {questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}>

                                {!question.isAnswered && (
                                    // conceito de fragment <>, nos returns do react os elementos precisam 
                                    // estar 'conteinerzados', pode ser dentro de uma div ou de um <>, que não aplica css
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => openModal(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>

            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="modal-content"
                    contentLabel=""
                    shouldCloseOnOverlayClick={false}
                >
                    <h2>Excluir</h2>
                    <div>
                        Tem certeza que você deseja excluir esta pergunta?
                        <div className="modal-footer">
                            <Button onClick={handleDeleteQuestion}>Sim</Button>
                            <Button onClick={closeModal}>Não</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}