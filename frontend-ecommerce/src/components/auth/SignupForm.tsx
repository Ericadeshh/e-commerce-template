import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Invalid phone number format (10-15 digits, optional +)");
      return;
    }

    try {
      // Signup
      const signupRes = await fetch("http://localhost:5000/api/auth/signup", {
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
      if (!signupRes.ok) {
        const errorData = await signupRes.json();
        console.log("Signup error response:", errorData);
        throw new Error(errorData.error || "Signup failed");
      }
      setSuccess("Signup successful, logging in...");
      // Auto-login
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        console.log("Auto-login error response:", errorData);
        throw new Error(errorData.error || "Auto-login failed");
      }
      const data = await loginRes.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      console.log(`Signup and auto-login successful, role: ${data.role}`);
      setTimeout(() => navigate("/user/dashboard"), 1500); // Delay for success message
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
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Create Your Account</h2>
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
      <Form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formRow}>
          <Form.Group
            className={styles.formGroup}
            controlId="formFirstName"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            <Form.Label>First Name</Form.Label>
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
            <Form.Label>Last Name (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
            />
          </Form.Group>
        </div>
        <div className={styles.formRow}>
          <Form.Group
            className={styles.formGroup}
            controlId="formEmail"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            <Form.Label>Email Address</Form.Label>
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
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g., +1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
        </div>
        <div className={styles.formRow}>
          <Form.Group
            className={styles.formGroup}
            controlId="formPassword"
            style={{ "--index": 5 } as React.CSSProperties}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Form.Group
            className={styles.formGroup}
            controlId="formConfirmPassword"
            style={{ "--index": 6 } as React.CSSProperties}
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
        </div>
        <Button type="submit" className={styles.submitButton}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
}
