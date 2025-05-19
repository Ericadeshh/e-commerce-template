import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Login error response:", errorData);
        throw new Error(errorData.error || "Invalid credentials");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      console.log(`Login successful, role: ${data.role}`);
      setSuccess("Login successful, redirecting...");

      // Ensure navigation based on role
      const destination =
        data.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      console.log(`Navigating to: ${destination}`);
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 1500);
    } catch (err: unknown) {
      let message = "An unknown error occurred";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(`Login error: ${message}`);
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Welcome Back</h2>
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
      <Form onSubmit={handleSubmit} className={styles.loginForm}>
        <Form.Group
          className={styles.formGroup}
          controlId="formEmail"
          style={{ "--index": 1 } as React.CSSProperties}
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
          controlId="formPassword"
          style={{ "--index": 2 } as React.CSSProperties}
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
        <Button type="submit" className={styles.submitButton}>
          Login
        </Button>
      </Form>
    </div>
  );
}
