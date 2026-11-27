import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell,PasswordField,PrimaryButton,ErrorBanner } from "./AuthShell";

export default function Login(){
 const navigate=useNavigate();
 const [form,setForm]=useState({email:"",password:""});
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,[e.target.name]:e.target.value});
 const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault();setError("");setLoading(true);
  try{await signInWithEmailAndPassword(auth,form.email.trim(),form.password);navigate("/dashboard")}
  catch(err:any){setError(friendlyFirebaseError(err.code))}
  finally{setLoading(false)}
 };
 return <AuthShell step="login">
  <h1 className="auth-heading">Welcome back</h1>
  <p className="auth-subtitle">Sign in to access your secure account and workspace.</p>
  <ErrorBanner message={error}/>
  <form onSubmit={handleSubmit}>
   <label className="auth-field"><span className="auth-label">Email address</span><input className="auth-input" name="email" type="email" placeholder="name@company.com" autoComplete="email" value={form.email} onChange={handleChange} required/></label>
   <PasswordField label="Password" name="password" placeholder="Enter your password" autoComplete="current-password" value={form.password} onChange={handleChange} required/>
   <div style={{display:"flex",justifyContent:"flex-end",marginTop:-5,marginBottom:18}}><Link className="auth-link" to="/forgot-password">Forgot password?</Link></div>
   <PrimaryButton type="submit" disabled={loading}>{loading?"Signing in…":"Sign in securely  →"}</PrimaryButton>
  </form>
  <p className="auth-switch">New to Authentication System? <Link className="auth-link" to="/signup">Create an account</Link></p>
 </AuthShell>;
}
function friendlyFirebaseError(code:string):string{
 switch(code){
  case "auth/invalid-email":return "That email address looks invalid.";
  case "auth/user-disabled":return "This account has been disabled.";
  case "auth/user-not-found":case "auth/wrong-password":case "auth/invalid-credential":return "Incorrect email or password.";
  case "auth/too-many-requests":return "Too many attempts. Please wait a moment and try again.";
  default:return "Something went wrong. Please try again.";
 }
}
