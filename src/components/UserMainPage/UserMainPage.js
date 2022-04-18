import { Button } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { addAnswers, getProgress, getQuestions, writeQuestions } from '../../service/firebaseDB'
import { setQuizQuestions } from '../../store/slices/quizSlice';

import classes from './UserMainPage.module.scss'

const UserMainPage = () => {

    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [progress, setProgress] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })


    useEffect(() => {
        const fetchQuestions = async ()=>{
            const questions = await getQuestions();
            setQuestions(questions);
        }
        fetchQuestions();

    }, []);

    useEffect(() => {
        async function fetchData(){
            const answers = await getProgress(user.email.replace("@lab1.com", ''));
            setAnswers(answers);
            let lprogress = [];
            //no document in firebase
            if(!answers){
                questions.forEach(question => {
                    const maxPoints = question.questions.reduce((a, b) => {
                        return (!a.options ? a : Math.max(...a.options.map(option => option.value))) + Math.max(...b.options.map(option => option.value))
                    }, 0);
    
    
                    lprogress.push({
                        key: question.key,
                        name: question.name,
                        isCompleted: false,
                        score: 0,
                        max: maxPoints
                    })
                })
            }
            //there is a document with answers but there might be no level
            else{
                questions.forEach(question => {
                    const maxPoints = question.questions.reduce((a, b) => {
                        return (!a.options ? a : Math.max(...a.options.map(option => option.value))) + Math.max(...b.options.map(option => option.value))
                    }, 0);
    
    
                    lprogress.push({
                        key: question.key,
                        name: question.name,
                        isCompleted: !answers[question.key] ? false : answers[question.key].scoreArray.every(score=>score>0),
                        score: !answers[question.key] ? 0 : answers[question.key].scoreArray.reduce((a, b)=>a+b, 0),
                        max: maxPoints
                    })
                })
            }
            


            setProgress([...lprogress]);
        };

        fetchData();


    }, [questions])



    return (<div className={classes.UserMainPage}>
        <header>
            <h1>Ласкаво просимо, <span>{user?.email.replace("@lab1.com", "")}</span></h1>
        </header>
        <main>
            <h1>Пройдіть тест та визначте свій рівень навичок</h1>

            {
                progress.map(questionSet => {
                    return (
                        <section>
                            <h2>{questionSet?.name}</h2>

                            {questionSet?.score === 0 &&
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        if (!answers || !answers[questionSet.key]) {
                                            let currentQuiz = questions.find(quiz=>quiz.key===questionSet.key);
                                            currentQuiz.scoreArray = new Array(currentQuiz.questions.length).fill(0);
                                            currentQuiz.questions = currentQuiz.questions.map(question=>{
                                                let mquestion = question; 
                                                mquestion.options = mquestion.options.map(option=>{return {...option, selected: false}})
                                                return mquestion
                                            })

                                            //write to pass to quiz component
                                            dispatch(setQuizQuestions(currentQuiz));

                                            //send to firebase
                                            if(!answers){
                                                let remoteAnswers= {};
                                                remoteAnswers[questionSet.key] = currentQuiz;
                                                addAnswers(remoteAnswers, user.email.replace("@lab1.com", ''));
                                            }else{
                                                let remoteAnswers = answers;
                                                remoteAnswers[questionSet.key] = currentQuiz;
                                                addAnswers(remoteAnswers, user.email.replace("@lab1.com", ''));
                                            }
                                            
                                        }else{
                                            dispatch(setQuizQuestions(answers[questionSet.key]))
                                        }
                                        navigate('/quiz')
                                    }}
                                >
                                    Розпочати
                                </Button>
                            }

                            {
                                questionSet.score > 0 && !questionSet.isCompleted &&
                                <div className={classes.continueSection}>
                                    <div>Набрано балів: {questionSet.score}/{questionSet.max}</div>
                                    <Button className={classes.Button} variant="outlined" color="error">Очистити</Button>
                                    <Button variant="contained" color="success">Продовжити</Button>
                                </div>
                            }

                            {
                                questionSet.isCompleted &&
                                <div className={classes.continueSection}>
                                    <div>Cумарна оцінка: <b>{questionSet.score}/{questionSet.max}</b></div>
                                    <Button className={classes.Button} variant="outlined" color="error">Пройти ще раз</Button>
                                </div>
                            }

                        </section>
                    )
                })
            }
        </main>
    </div>);
}

export default UserMainPage;