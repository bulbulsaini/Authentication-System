import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell,Field,PasswordField,PrimaryButton,ErrorBanner } from "./AuthShell";

export default function Signup(){
 const navigate=useNavigate();
 const [form,setForm]=useState({name:"",email:"",password:"",confirm:""});
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,[e.target.name]:e.target.value});
 const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault();setError("");
  if(form.password!==form.confirm){setError("Passwords do not match.");return}
  if(form.password.length<6){setError("Password must be at least 6 characters.");return}
  setLoading(true);
  try{
   const credential=await createUserWithEmailAndPassword(auth,form.email.trim(),form.password);
   await updateProfile(credential.user,{displayName:form.name.trim()});
   navigate("/dashboard");
  }catch(err:any){setError(friendlyFirebaseError(err.code))}
  finally{setLoading(false)}
 };
 const strength=form.password.length>=12?"Strong":form.password.length>=8?"Good":form.password.length>=6?"Fair":"Use 6+ characters";
 const strengthColor=form.password.length>=12?"#027A48":form.password.length>=8?"#168AAD":"#8A5CF6";
 return <AuthShell step="signup">
  <h1 className="auth-heading">Create your account</h1>
  <p className="auth-subtitle">A few details to set up your secure account.</p>
  <ErrorBanner message={error}/>
  <form onSubmit={handleSubmit}>
   <Field label="Full name" name="name" placeholder="Your name" autoComplete="name" value={form.name} onChange={handleChange} required/>
   <Field label="Email address" name="email" type="email" placeholder="name@company.com" autoComplete="email" value={form.email} onChange={handleChange} required/>
   <PasswordField label="Password" name="password" placeholder="Create a password" autoComplete="new-password" value={form.password} onChange={handleChange} required/>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"#667085",marginTop:-10,marginBottom:14}}><span>Password length</span><strong style={{color:strengthColor}}>{strength}</strong></div>
   <PasswordField label="Confirm password" name="confirm" placeholder="Re-enter your password" autoComplete="new-password" value={form.confirm} onChange={handleChange} required/>
   <PrimaryButton type="submit" disabled={loading}>{loading?"Creating your account…":"Create account  →"}</PrimaryButton>
  </form>
  <p className="auth-switch">Already registered? <Link className="auth-link" to="/login">Sign in</Link></p>
 </AuthShell>;
}
function friendlyFirebaseError(code:string):string{
 switch(code){
  case "auth/email-already-in-use":return "An account with this email already exists.";
  case "auth/invalid-email":return "That email address looks invalid.";
  case "auth/weak-password":return "Password must be at least 6 characters.";
  default:return "Something went wrong. Please try again.";
 }
}
