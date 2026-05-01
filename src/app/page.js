// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// export default function Home() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch('/api/auth/logged-in');
//         const data = await res.json();
//         const isLoggedIn = data.loggedIn;
//         if (isLoggedIn) {
//           router.push("/u/dashboard");
//         } else {
//           router.push("/home");
//         }
//       } catch (error) {
//         router.push("/home");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (loading) {
//     return (
//       <div>
//         <p>Loading WCEA Networking Website...</p>
//       </div>
//     );
//   }

//   return null;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = false;
    if (!isLoggedIn? router.push("/home") : router.push("/dashboard/admin"));  
     
    // router.push("/dashboard/admin")
  });

return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <img 
        src="/images/logos/wcea.png" 
        alt="WCEA Logo" 
        width={100} 
        height={100}
        style={{ objectFit: 'contain' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '18px',
          color: '#888'
        }}>FROM</p>
        <p style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333'
        }}>WCEA</p>
      </div>
    </div>
  );
}
