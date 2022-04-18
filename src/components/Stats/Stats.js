import classes from './Stats.module.scss'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import { getAnswers, getQuestions } from '../../service/firebaseDB';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const Stats = () => {

    const [chart1Data, setChart1Data] = useState([]);
    const [chart2Dataset, setChart2Dataset] = useState([]);
    const [chart2Labels, setChart2Labels] = useState([]);

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const questions = await getQuestions();
            setLabels(questions.map(question => question.name));
            setQuestions(questions);
        }

        const fetchAnswers = async () => {
            const answers = await getAnswers();
            setAnswers(answers);
        }

        fetchQuestions();
        fetchAnswers();
    }, []);

    useEffect(() => {
        if (answers.length > 0 && questions.length > 0) {
            const data = questions.map(question => {
                let sum = 0;
                let count = 0;

                answers.forEach(answer => {
                    if (!!answer[question.key] && answer[question.key].scoreArray.every(e => e > 0)) {
                        sum += answer[question.key].scoreArray.reduce((a, b) => a + b, 0)
                        count++;
                    }
                })
                if (count !== 0)
                    return sum / count;
                else
                    return 0;
            })

            setChart1Data(data);



            //chart 2 data processing
            let maxQuestionNumber = Math.max(...questions.map(question => question.questions.length));
            setChart2Labels(Array.from({ length: maxQuestionNumber }, (_, i) => i + 1))

            const datasets = questions.map((question, index) => {

                let data = Array(question.questions.length).fill(0);
                let counter = 0;

                answers.forEach(answer => {
                    if (!!answer[question.key] && answer[question.key].scoreArray.every(e => e > 0)) {
                        data = data.map((num, id) => {
                            return num + answer[question.key].scoreArray[id];
                        })
                        counter++;
                    }
                })

                data = data.map(e => e / counter);
                let color =getRandomColor()
                return {
                    id: index,
                    label: question.name,
                    data: data,
                    borderColor: color,
                    backgroundColor: color
                }
            })

            setChart2Dataset(datasets);
        }
    }, [answers, questions]);




    return (<div className={classes.Stats}>
        <h1>Середні оцінки за блоками</h1>
        <Line
            datasetIdKey='id'

            data={{
                labels: labels,
                datasets: [
                    {
                        id: 1,
                        label: 'Середня оцінка',
                        data: chart1Data,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)'
                    },
                ],
            }}
        />

        <h1>Середні оцінки за завданнями</h1>
        <Line
            datasetIdKey='id'
            data={{
                labels: chart2Labels,
                datasets: chart2Dataset
            }}
            options={{
                elements: {
                    line: {
                        tension: 0.3 // disables bezier curves
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }}
        />
    </div>);
}

export default Stats;