export function getTokenExpiry(jwt){
    if(!jwt) return null;
    try{
const base64Url=jwt.split('.')[1];
const base64=base64Url.replace(/-/g,'+').replace(/_/g,'/');

const jsonPayload=decodeURIComponent(
    atob(base64)
    .split('')
    .map(c=>'%' +('00'+c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
);
const payload=JSON.parse(jsonPayload);
return payload.exp*1000
    }catch(error){
        console.error("Invalid JWT:",error);
        return null;
    }
}