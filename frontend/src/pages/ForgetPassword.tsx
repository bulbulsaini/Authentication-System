import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell,Field,PrimaryButton,ErrorBanner } from "./AuthShell";

export default function ForgotPassword(){
 const [email,setEmail]=useState("");
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const [sent,setSent]=useState(false);
 const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault();setError("");setLoading(true);
  try{await sendPasswordResetEmail(auth,email.trim());setSent(true)}
  catch(err:any){setError(friendlyFirebaseError(err.code))}
  finally{setLoading(false)}
 };
 return <AuthShell step="forgot">
  <h1 className="auth-heading">Reset your password</h1>
  <p className="auth-subtitle">Enter the email linked to your account. We'll send you a secure recovery link.</p>
  <ErrorBanner message={error}/>
  {sent?<div style={{padding:16,border:"1px solid #A6F4C5",borderRadius:12,background:"#ECFDF3",color:"#027A48",fontSize:13,lineHeight:1.65}}><strong>Check your inbox</strong><br/>If an account is registered with <strong>{email}</strong>, a password reset link will arrive shortly.</div>:
   <form onSubmit={handleSubmit}>
    <Field label="Email address" name="email" type="email" placeholder="name@company.com" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    <PrimaryButton type="submit" disabled={loading}>{loading?"Sending recovery link…":"Send recovery link  →"}</PrimaryButton>
   </form>}
  <p className="auth-switch">Remember your password? <Link className="auth-link" to="/login">Back to sign in</Link></p>
 </AuthShell>;
}
function friendlyFirebaseError(code:string):string{
 switch(code){
  case "auth/invalid-email":return "That email address looks invalid.";
  case "auth/too-many-requests":return "Too many attempts. Please wait and try again.";
  default:return "We couldn't process that request. Please try again.";
 }
}
