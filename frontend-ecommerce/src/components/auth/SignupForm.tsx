import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Signup error response:", errorData);
        throw new Error(errorData.error || "Failed to sign up");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      console.log(`Signup successful, role: ${data.role}`);
      setSuccess("Account created successfully, redirecting...");

      setTimeout(() => {
        navigate("/user/dashboard", { replace: true });
      }, 1500);
    } catch (err: unknown) {
      let message = "An unknown error occurred";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(`Signup error: ${message}`);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Create Account</h2>
        {error && (
          <Alert variant="danger" className={styles.alert}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className={styles.alert}>
            {success}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className={styles.authForm}>
          <Form.Group
            className={styles.formGroup}
            controlId="formFirstName"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            <Form.Label>
              <FaUser className={styles.icon} /> First Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group
            className={styles.formGroup}
            controlId="formLastName"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            <Form.Label>
              <FaUser className={styles.icon} /> Last Name (Optional)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
            />
          </Form.Group>
          <Form.Group
            className={styles.formGroup}
            controlId="formEmail"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            <Form.Label>
              <FaEnvelope className={styles.icon} /> Email Address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group
            className={styles.formGroup}
            controlId="formPhoneNumber"
            style={{ "--index": 4 } as React.CSSProperties}
          >
            <Form.Label>
              <FaPhone className={styles.icon} /> Phone Number
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group
            className={styles.formGroup}
            controlId="formPassword"
            style={{ "--index": 5 } as React.CSSProperties}
          >
            <Form.Label>
              <FaLock className={styles.icon} /> Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Button type="submit" className={styles.submitButton}>
            <FaUserPlus className={styles.buttonIcon} /> Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
}
