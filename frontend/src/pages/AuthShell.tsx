import { ReactNode, useEffect, useState } from "react";
type Step="login"|"signup"|"forgot"|"reset";
const COPY:Record<Step,{number:string;title:string;description:string}>={
 login:{number:"01",title:"Your workspace,\nall in one place.",description:"Sign in securely and continue exactly where you left off."},
 signup:{number:"02",title:"A better way\nto stay connected.",description:"Create your account and get started in just a few moments."},
 forgot:{number:"03",title:"Every account\nhas a way back.",description:"We'll help you regain access with a secure recovery link."},
 reset:{number:"04",title:"Make it strong.\nMake it yours.",description:"Choose a new password to secure your account."}
};
const CSS=`
*{box-sizing:border-box}html,body,#root{min-height:100%;margin:0}body{background:#F6F8FC}
.auth-page{min-height:100vh;display:grid;grid-template-columns:minmax(390px,.92fr) minmax(420px,1.08fr);color:#172033;font-family:Inter,system-ui,sans-serif;background:#F6F8FC}
.auth-form-panel{display:flex;justify-content:center;align-items:center;padding:56px clamp(28px,6vw,88px)}.auth-form-inner{width:100%;max-width:430px}
.auth-brand{display:flex;align-items:center;gap:12px;margin-bottom:54px;color:#172033;font-weight:750;letter-spacing:-.03em;font-size:16px}
.auth-brand-mark{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#6969E8,#2699C5);box-shadow:0 7px 20px rgba(91,92,226,.2)}
.auth-heading{font-size:clamp(30px,3.3vw,38px);letter-spacing:-.045em;line-height:1.12;margin:0;color:#172033;font-weight:760}
.auth-subtitle{color:#667085;font-size:14px;line-height:1.65;margin:12px 0 30px}
.auth-label{display:block;color:#344054;font-size:12px;font-weight:650;margin:0 0 8px;letter-spacing:.02em}
.auth-input{width:100%;height:48px;border:1px solid #D9E0EA;border-radius:11px;background:#fff;color:#172033;padding:0 14px;outline:none;font:inherit;font-size:14px;transition:border-color .18s,box-shadow .18s}
.auth-input::placeholder{color:#98A2B3}.auth-input:focus{border-color:#6969E8;box-shadow:0 0 0 4px rgba(91,92,226,.11)}.auth-field{display:block;margin-bottom:18px}
.auth-btn{width:100%;height:49px;margin-top:8px;border:0;border-radius:11px;color:white;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(100deg,#6263DF,#477DCB);box-shadow:0 9px 22px rgba(91,92,226,.18);transition:transform .18s,filter .18s}
.auth-btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.04)}.auth-btn:disabled{opacity:.58;cursor:not-allowed}
.auth-link{color:#5556CE;text-decoration:none;font-size:13px;font-weight:650}.auth-link:hover{color:#3738A8}
.auth-switch{text-align:center;margin:26px 0 0;color:#667085;font-size:13px}.auth-alert{padding:12px 14px;border:1px solid #FDA29B;border-radius:10px;color:#B42318;background:#FEF3F2;font-size:13px;margin:0 0 18px}
.auth-showpass{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:transparent;border:0;color:#667085;font-size:12px;cursor:pointer;padding:5px}
.auth-visual{position:relative;margin:14px;border:1px solid #E1E5F2;border-radius:26px;overflow:hidden;min-height:calc(100vh - 28px);display:flex;align-items:flex-end;padding:clamp(34px,5vw,72px);background:radial-gradient(ellipse at 75% 18%,rgba(56,189,248,.22),transparent 35%),radial-gradient(ellipse at 30% 35%,rgba(129,140,248,.28),transparent 42%),linear-gradient(145deg,#F0F1FF,#EAF4FB 58%,#F6F8FF)}
.auth-visual:before{content:"";position:absolute;inset:0;opacity:.65;background-image:linear-gradient(rgba(89,101,160,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(89,101,160,.06) 1px,transparent 1px);background-size:46px 46px;mask-image:linear-gradient(to bottom,black,transparent 85%)}
.auth-orbit{position:absolute;width:min(62vw,540px);aspect-ratio:1;border:1px solid rgba(99,102,241,.17);border-radius:50%;top:7%;left:12%;box-shadow:0 0 0 38px rgba(99,102,241,.035),0 0 0 78px rgba(99,102,241,.025)}
.auth-glow-card{position:absolute;right:12%;top:22%;width:170px;height:120px;border:1px solid rgba(255,255,255,.9);border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.88),rgba(255,255,255,.4));backdrop-filter:blur(12px);transform:rotate(9deg);box-shadow:0 24px 70px rgba(61,78,130,.12)}
.auth-glow-card:after{content:"";position:absolute;width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#6969E8,#38BDF8);left:18px;top:18px;box-shadow:0 0 26px rgba(91,92,226,.24)}
.auth-visual-copy{position:relative;z-index:1;max-width:520px}.auth-step{color:#5556CE;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:750}
.auth-visual-title{white-space:pre-line;font-size:clamp(34px,4.3vw,58px);line-height:1.03;letter-spacing:-.055em;font-weight:780;margin:18px 0;color:#1E2750}
.auth-visual-desc{color:#586681;max-width:390px;font-size:14px;line-height:1.7;margin:0}.auth-visual-footer{margin-top:54px;display:flex;align-items:center;gap:10px;color:#687694;font-size:11px;letter-spacing:.04em}
.auth-status-dot{width:7px;height:7px;border-radius:50%;background:#16A36A;box-shadow:0 0 12px rgba(22,163,106,.35)}
@media(max-width:900px){.auth-page{grid-template-columns:1fr}.auth-form-panel{min-height:100vh;padding:34px 24px}.auth-form-inner{max-width:460px}.auth-brand{margin-bottom:42px}.auth-visual{display:none}}
@media(max-width:480px){.auth-form-panel{padding:28px 22px;align-items:flex-start}.auth-brand{margin-bottom:52px}}
`;
export function AuthShell({step,children}:{step:Step;children:ReactNode}){
 useEffect(()=>{if(document.getElementById("auth-shell-light-styles"))return;const style=document.createElement("style");style.id="auth-shell-light-styles";style.textContent=CSS;document.head.appendChild(style)},[]);
 const copy=COPY[step];
 return <main className="auth-page"><section className="auth-form-panel"><div className="auth-form-inner">
  <div className="auth-brand"><span className="auth-brand-mark"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M7 4h10l4 8-4 8H7l-4-8 4-8Z" stroke="white" strokeWidth="1.8"/><path d="m9 12 2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Authentication System</div>
  {children}<div style={{marginTop:34,paddingTop:18,borderTop:"1px solid #E7EBF2",color:"#98A2B3",fontSize:11,display:"flex",justifyContent:"space-between"}}><span>© {new Date().getFullYear()} Authentication System</span><span>Secure access</span></div>
 </div></section><aside className="auth-visual"><div className="auth-orbit"/><div className="auth-glow-card"/><div className="auth-visual-copy"><span className="auth-step">AUTHENTICATION SYSTEM / {copy.number}</span><h2 className="auth-visual-title">{copy.title}</h2><p className="auth-visual-desc">{copy.description}</p><div className="auth-visual-footer"><span className="auth-status-dot"/> SECURE ACCOUNT ACCESS</div></div></aside></main>;
}
export function Field({label,...props}:{label:string}&React.InputHTMLAttributes<HTMLInputElement>){return <label className="auth-field"><span className="auth-label">{label}</span><input className="auth-input" {...props}/></label>}
export function PasswordField({label,...props}:{label:string}&React.InputHTMLAttributes<HTMLInputElement>){
 const [visible,setVisible]=useState(false);
 return <label className="auth-field" style={{display:"block",position:"relative"}}><span className="auth-label">{label}</span><input className="auth-input" style={{paddingRight:64}} type={visible?"text":"password"} {...props}/><button className="auth-showpass" type="button" onClick={()=>setVisible(v=>!v)}>{visible?"Hide":"Show"}</button></label>
}
export function PrimaryButton({children,...props}:{children:ReactNode}&React.ButtonHTMLAttributes<HTMLButtonElement>){return <button className="auth-btn" {...props}>{children}</button>}
export function ErrorBanner({message}:{message:string}){return message?<div className="auth-alert" role="alert">{message}</div>:null}
