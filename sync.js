import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
const $=id=>document.getElementById(id);
const showStatus=s=>{$('syncstatus').textContent=s};
const showError=s=>{$('autherror').textContent=s};
let auth,db,uid=null,unsubscribe=null,ready=false,dirty=false,writing=false,writeTimer=null,initializing=false;
const pathFor=u=>doc(db,'users',u,'trackers','main');
function loginUI(signedIn){document.body.classList.toggle('locked',!signedIn);$('loginScreen').style.display=signedIn?'none':'flex';$('logoutBtn').style.display=signedIn?'inline-block':'none';}
async function flush(){if(!ready||!uid||!dirty||writing)return;writing=true;const writeUid=uid;dirty=false;showStatus('⏳ กำลังบันทึกออนไลน์...');try{await setDoc(pathFor(writeUid),{accounts:window.ROBridge.get(),updatedAt:serverTimestamp()});if(uid===writeUid)showStatus('🟢 ซิงก์เรียบร้อย');}catch(e){dirty=true;showStatus('🔴 บันทึกไม่สำเร็จ — ตรวจสอบอินเทอร์เน็ตหรือสิทธิ์ Firebase');console.error(e)}finally{writing=false;if(dirty&&uid===writeUid)schedule()}}
function schedule(){clearTimeout(writeTimer);writeTimer=setTimeout(flush,850)}
window.addEventListener('ro-local-change',()=>{if(!ready)return;dirty=true;showStatus('🟡 มีการแก้ไข รอบันทึก...');schedule()});
try{
if(!firebaseConfig.apiKey||firebaseConfig.apiKey.startsWith('PASTE_')||firebaseConfig.projectId==='YOUR_PROJECT_ID')throw new Error('ยังไม่ได้ใส่ค่า Firebase ในไฟล์ firebase-config.js');
const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();showError('');$('loginBtn').disabled=true;try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value)}catch(err){showError('เข้าสู่ระบบไม่สำเร็จ: '+(err.code||err.message))}finally{$('loginBtn').disabled=false}});
$('logoutBtn').addEventListener('click',async()=>{if(dirty)await flush();await signOut(auth)});
onAuthStateChanged(auth,async user=>{
 clearTimeout(writeTimer);if(unsubscribe){unsubscribe();unsubscribe=null}uid=null;ready=false;dirty=false;writing=false;
 if(!user){loginUI(false);$('syncuser').textContent='';showStatus('🔒 ยังไม่เข้าสู่ระบบ');return}
 uid=user.uid;const sessionUid=uid;loginUI(true);$('syncuser').textContent=user.email||'';showStatus('⏳ กำลังโหลดข้อมูลจากคลาวด์...');
 try{
  const reference=pathFor(sessionUid);const snapshot=await getDoc(reference);if(uid!==sessionUid)return;
  if(snapshot.exists()&&snapshot.data().accounts){window.ROBridge.put(snapshot.data().accounts)}
  else { // บัญชีใหม่: ย้ายข้อมูล V10 ในเบราว์เซอร์ขึ้นคลาวด์ครั้งแรก
    await setDoc(reference,{accounts:window.ROBridge.get(),updatedAt:serverTimestamp()});
  }
  ready=true;showStatus('🟢 ซิงก์เรียบร้อย');
  unsubscribe=onSnapshot(reference,snap=>{
    if(uid!==sessionUid||!ready||!snap.exists())return;
    if(snap.metadata.hasPendingWrites||dirty||writing)return;
    const remote=snap.data().accounts;
    if(remote&&JSON.stringify(remote)!==JSON.stringify(window.ROBridge.get()))window.ROBridge.put(remote);
    showStatus('🟢 ซิงก์เรียบร้อย');
  },err=>{showStatus('🔴 เชื่อมต่อฐานข้อมูลไม่ได้');console.error(err)});
 }catch(err){ready=false;showStatus('🔴 โหลดข้อมูลไม่สำเร็จ');showError(err.code||err.message);loginUI(false);console.error(err)}
});
}catch(e){showError(e.message);showStatus('🔴 ยังไม่ได้ตั้งค่า Firebase');console.error(e)}
