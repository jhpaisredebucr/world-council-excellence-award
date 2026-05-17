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
      background: 'linear-gradient(135deg, #5C4138 0%, #8D5D28 50%, #a67c4a 100%)'
    }}>
      {/* White Badge with Logo */}
      <div style={{
        padding: '24px 40px',
        borderRadius: '60px',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <img 
          src="/images/logos/wcea.png" 
          alt="WCEA Logo" 
          width={100} 
          height={100}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.7)'
        }}>FROM</p>
        <p style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffffff'
        }}>World Council Excellence Award</p>
      </div>
    </div>
  );
}