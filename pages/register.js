import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Form, Alert, Button } from "react-bootstrap";
import { registerUser } from "../lib/authenticate";

export default function Register(props) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [warning, setWarning] = useState('');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== password2) {
            setWarning("Passwords do not match!");
            return;
        }

        try {
            await registerUser(user, password, password2);
            router.push('/login');
        } catch (err) {
            setWarning(err.message);
        }
    }

    return (
        <>
            <Card bg="light">
                <Card.Body>
                    <h2>Register</h2>
                    Register for an account:
                </Card.Body>
            </Card>
            <br />
            {warning && (
                <>
                    <br />
                    <Alert variant="danger">{warning}</Alert>
                </>
            )}
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" id="userName" name="userName" value={user} onChange={e => setUser(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control type="password" id="password2" name="password2" value={password2} onChange={e => setPassword2(e.target.value)} />
                </Form.Group>
                <br />
                <Button variant="primary" className="pull-right" type="submit">Register</Button>
            </Form>
        </>
    );
}