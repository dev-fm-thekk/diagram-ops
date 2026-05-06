import dotenv from 'dotenv';

dotenv.config();

const envs = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
}

export default envs;