import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const baseUrl = import.meta.env.BASE_URL || '/job-app/';

  // Inline Styles
  const styles = {
    container: {
      backgroundColor: '#111827',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center'
    },
    heading: {
      fontSize: '72px',
      color: '#39ac31',
      marginBottom: '20px'
    },
    gif: {
      width: '80%',
      maxWidth: '300px',
      marginBottom: '30px'
    },
    subHeading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    text: {
      fontSize: '16px',
      marginBottom: '20px'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#39ac31',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  return (
    <div className="container-fluid" style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <img
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm1xeG45dGhqMThjNmF5eW15bGF2ZmpvaTJ1bDg1dWdkbHh5OXlvOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YlSR3nYDE0zQC/giphy.gif"
        alt="Lost Caveman Animation"
        style={styles.gif}
      />
      <h2 style={styles.subHeading}>Looks like you're lost</h2>
      <p style={styles.text}>The page you are looking for doesn't exist.</p>

      <Link to={`${baseUrl}`} style={styles.button}>
        Go back to Login
      </Link>
    </div>
  );
}
