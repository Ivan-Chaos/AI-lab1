import { createSlice } from "@reduxjs/toolkit";

export const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quiz: undefined
    },

    reducers: {
        setQuizQuestions: (state, action)=>{
            debugger;
            return {...state, quiz: action.payload}
        }
    }
});

export const {setQuizQuestions} = quizSlice.actions;

export const selectQuiz = state=>state.currentQuiz.quiz;

export default quizSlice.reducer;