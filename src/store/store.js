import { configureStore } from '@reduxjs/toolkit'
import quizSlice from './slices/quizSlice'

export default configureStore({
    reducer: { 
        currentQuiz: quizSlice  
    },
})