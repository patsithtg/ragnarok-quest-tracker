# Ragnarok Quest Tracker — ออนไลน์ + ซิงก์ iPad / PC

เว็บไซต์นี้ต่อยอดจาก V10 และเก็บข้อมูลเควส 3 ID / 8 ตัวละครเดิมทั้งหมดไว้

## 1. สร้าง Firebase Project
1. เปิด https://console.firebase.google.com/ แล้วสร้าง Project ใหม่
2. Project settings → Your apps → เพิ่ม Web app (ไอคอน `</>`) และคัดลอก `firebaseConfig`
3. เปิดไฟล์ `firebase-config.js` แล้วแทนค่าตัวอย่างทั้ง 6 ช่องด้วยค่าจากโปรเจกต์
4. Build → Authentication → Sign-in method → เปิด **Email/Password**
5. Authentication → Users → Add user เพื่อสร้างอีเมล/รหัสผ่านส่วนตัวสำหรับเข้าเว็บ (อย่าใช้รหัสผ่านเกม)
6. Build → Firestore Database → Create database (เลือก region ที่เหมาะสม) → Rules → วางข้อความจาก `firestore.rules` → Publish
7. Authentication → Settings → Authorized domains: เพิ่มโดเมนที่เว็บจะใช้งาน หากจำเป็น (เช่น `ชื่อผู้ใช้.github.io`)

## 2. เผยแพร่ GitHub Pages (ฟรี)
1. สร้าง GitHub repository ใหม่ เช่น `ro-quest` (เลือก Public สำหรับ GitHub Pages แบบฟรี)
2. อัปโหลดไฟล์ `index.html`, `sync.js`, `firebase-config.js` ทั้งสามไฟล์ไว้ที่ root ของ repository
3. GitHub repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save
4. รอ GitHub Pages เผยแพร่ จะได้ลิงก์ลักษณะ `https://USERNAME.github.io/ro-quest/`
5. เปิดลิงก์บนคอมพิวเตอร์และ iPad ด้วยบัญชีอีเมล Firebase **เดียวกัน**
6. บน iPad: Safari → Share → Add to Home Screen เพื่อสร้างไอคอนเว็บ

## 3. การย้ายข้อมูลเดิม V10
- เปิด V10 เดิมบนคอมพิวเตอร์ → กด **สำรองข้อมูล JSON** ก่อน
- หากมีข้อมูลเก่าที่บันทึกในเครื่อง: เปิดเว็บไซต์ออนไลน์ครั้งแรกจากเบราว์เซอร์เดิม **อาจไม่เห็นข้อมูล localStorage เดิม** เพราะโดเมนเปลี่ยน
- เข้าสู่ระบบเว็บออนไลน์ → กด **นำเข้าข้อมูล JSON** จาก V10 ที่สำรองไว้ ระบบจะบันทึกขึ้น Firestore อัตโนมัติ
- จากนั้นเปิดบน iPad ด้วยอีเมล Firebase เดียวกัน ข้อมูลจะปรากฏเหมือนกัน
- ควรเก็บไฟล์ JSON สำรองเป็นระยะ

## 4. ข้อควรรู้
- เว็บไซต์ต้องใช้อินเทอร์เน็ตเพื่อเข้าสู่ระบบและซิงก์ข้อมูล
- หากแก้ข้อมูลจากสองอุปกรณ์พร้อมกันในช่วงใกล้กันมาก การบันทึกล่าสุดอาจทับการเปลี่ยนแปลงก่อนหน้า (last-write-wins)
- กฎ Firestore จำกัดข้อมูลของแต่ละบัญชีผู้ใช้ ไม่ใช่ข้อมูลสาธารณะ
- ค่า `firebaseConfig` เป็นข้อมูลการเชื่อมต่อฝั่งเว็บ ไม่ใช่รหัสผ่านส่วนตัว; ห้ามเผยแพร่รหัสผ่านผู้ใช้หรือ service-account key
- Firebase มีโควตาใช้งานฟรีตามเงื่อนไขแพ็กเกจ โปรดตรวจสอบใน Firebase Console
- อย่าเปิดไฟล์ `index.html` โดยตรงด้วย `file://` เพื่อทดสอบการซิงก์ ต้องเปิดผ่านเว็บโฮสต์หรือ local HTTP server
- รูปตัวละครเดิมถูกฝังไว้ใน HTML และข้อมูลภาพอยู่ในข้อมูลที่ซิงก์ หากอัปโหลดภาพใหญ่เกินไป Firestore มีขีดจำกัดขนาดเอกสาร 1 MiB; ใช้ภาพเล็ก
