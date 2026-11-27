import { useState } from "react";
import { Link,useNavigate,useSearchParams } from "react-router-dom";
import { confirmPasswordReset,verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell,PasswordField,PrimaryButton,ErrorBanner } from "./AuthShell";

export default function ResetPassword(){
 const [searchParams]=useSearchParams();
 const oobCode=searchParams.get("oobCode")||"";
 const navigate=useNavigate();
 const [form,setForm]=useState({password:"",confirm:""});
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault();setError("");
  if(!oobCode){setError("This reset link is invalid or missing. Please request a new one.");return}
  if(form.password!==form.confirm){setError("Passwords do not match.");return}
  if(form.password.length<6){setError("Password must be at least 6 characters.");return}
  setLoading(true);
  try{await verifyPasswordResetCode(auth,oobCode);await confirmPasswordReset(auth,oobCode,form.password);navigate("/login")}
  catch(err:any){setError(friendlyFirebaseError(err.code))}
  finally{setLoading(false)}
 };
 return <AuthShell step="reset">
  <h1 className="auth-heading">Choose a new password</h1>
  <p className="auth-subtitle">Use at least 6 characters. A longer password is even better.</p>
  <ErrorBanner message={error}/>
  <form onSubmit={handleSubmit}>
   <PasswordField label="New password" name="password" placeholder="Enter a new password" autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
   <PasswordField label="Confirm new password" name="confirm" placeholder="Re-enter your new password" autoComplete="new-password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required/>
   <PrimaryButton type="submit" disabled={loading}>{loading?"Updating password…":"Update password  →"}</PrimaryButton>
  </form>
  <p className="auth-switch"><Link className="auth-link" to="/login">Back to sign in</Link></p>
 </AuthShell>;
}
function friendlyFirebaseError(code:string):string{
 switch(code){
  case "auth/expired-action-code":return "This reset link has expired. Please request a new one.";
  case "auth/invalid-action-code":return "This reset link is invalid or has already been used.";
  case "auth/weak-password":return "Password must be at least 6 characters.";
  default:return "Something went wrong. Please try again.";
 }
}
