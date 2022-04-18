import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Quiz.module.scss';

const Quiz = () => {
    const currentQuiz = useSelector(state => state.currentQuiz.quiz);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentQuiz.questions.findIndex(
        question => question.options.every(option => !option.selected))
    )
    debugger;
    const [settings, setSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    });

    return (<div className={classes.Quiz}>
        <div className={classes.QuizBlock}>
            <header>
                <h2>{currentQuiz.name}</h2>
            </header>
            <main>
                <Slider {...settings}>
                    {currentQuiz.questions.map(question => {
                        return (
                            <div>
                                <h3>HOLA NINO BABE</h3>
                            </div>
                        );
                    })}
                </Slider>
            </main>
        </div>
    </div>);
}

export default Quiz;