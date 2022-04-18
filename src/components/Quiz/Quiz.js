import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { auth } from "../../firebase-config";
import { addAnswers, getProgress } from "../../service/firebaseDB";
import { setQuizQuestions } from "../../store/slices/quizSlice";
import classes from './Quiz.module.scss';

const Quiz = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isFinished, setIsFinished] = useState(false);
    const [user, setUser] = useState(undefined);
    const [answers, setAnswers] = useState([]);
    const [catSrc, setCatSrc] = useState('')

    const currentQuiz = useSelector(state => state.currentQuiz.quiz);

    const maxScore = currentQuiz.questions.reduce((a, b) => {
        return (!a.options ? a : Math.max(...a.options.map(option => option.value))) + Math.max(...b.options.map(option => option.value))
    }, 0);

    if (currentQuiz === undefined) {
        navigate('/')
    }

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })



    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentQuiz.questions.findIndex(
        question => question.options.every(option => !option.selected))===-1 ? 0 : 
        currentQuiz.questions.findIndex(
            question => question.options.every(option => !option.selected))
    );

    debugger;



    useEffect(() => {
        async function fetchAnswers() {
            const answers = await getProgress(user.email.replace("@lab1.com", ''));
            setAnswers(answers);
        }

        fetchAnswers();
    }, [user])

    useEffect(() => {
        axios.get('https://api.thecatapi.com/v1/images/search').then(response => {
            setCatSrc(response.data[0].url);
        })
    }, [])



    return (<div className={classes.Quiz}>
        <div className={classes.QuizBlock}>
            {!isFinished && <>
                <header>
                    <h1>{currentQuiz.name}</h1>
                    <h2>#{currentQuestionIndex + 1}/{currentQuiz.questions.length}</h2>
                </header>
                <main>
                    <Carousel
                        showStatus={false}
                        selectedItem={currentQuestionIndex}
                        className={classes.quizCarousel}
                        showThumbs={false}
                        showArrows={false}
                    >
                        {currentQuiz.questions.map((question, qindex) => {
                            return (
                                <div className={classes.quizItem}>
                                    <h3>{question.text}</h3>
                                    <div className={classes.options}>
                                        {question.options.map((option, oindex) =>
                                            <div
                                                onClick={() => {
                                                    debugger
                                                    let ltQuiz = JSON.parse(JSON.stringify(currentQuiz));
                                                    ltQuiz.questions[qindex].options =
                                                        ltQuiz.questions[qindex].options.map(option => {
                                                            return { ...option, selected: false }
                                                        });
                                                    ltQuiz.questions[qindex].options[oindex].selected = true;
                                                    ltQuiz.scoreArray[qindex] = option.value;
                                                    debugger;
                                                    dispatch(setQuizQuestions(ltQuiz));
                                                    setCurrentQuestionIndex(qindex + 1);

                                                    let tanswers = JSON.parse(JSON.stringify(answers));
                                                    tanswers[currentQuiz.key] = ltQuiz;
                                                    setAnswers(tanswers);
                                                    addAnswers(tanswers, user.email.replace("@lab1.com", ''));
                                                }}
                                                className={option.selected ? classes.selectedOption : classes.option}
                                            >
                                                {option.text}
                                            </div>
                                        )}
                                    </div>
                                    {qindex === currentQuiz.questions.length - 1 &&
                                        <div style={{ textAlign: 'right', zIndex: '5', marginTop: '0.5em' }}>
                                            <Button
                                                variant='contained'
                                                disabled={!currentQuiz.scoreArray.every(e => e > 0)}
                                                onClick={() => setIsFinished(true)}
                                            >
                                                Завершити опитування
                                            </Button>
                                        </div>}
                                </div>
                            )
                        })}
                    </Carousel>
                </main> </>}

            {isFinished && <>
                <header>
                    <h1>Опитування завершено!</h1>
                </header>
                <main>
                    <div className={classes.completedQuiz}>
                        <h1>Ваша оцінка: {currentQuiz.scoreArray.reduce((a, b) => a + b, 0)} з {maxScore}</h1>
                        <div>Тримайте кошака</div>
                        <img src={catSrc} className={classes.rewardCat}/>
                        <div>
                            <Button onClick={()=>{navigate('/')}}>Повернутись на головну сторінку</Button>
                        </div>
                    </div>

                </main>
            </>}
        </div>
    </div>);
}

export default Quiz;