import axios from "axios";
export const API_URL="http://localhost:8080"    
export const DEEPSEEK_API="sk-01b0f26e3f8a49b1a9be642ae97d69d2"
export const WEAVIATE="N0V4eW1hQXp3d21UdGR4U19DS2gwSkgyRndtVzV4SGFOZERSUnVXZGJZV2liVEpVZlR6Rkx1YWVCL2dBPV92MjAw"
export const OPENAI_API="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"
export const api= axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json",
    }
})