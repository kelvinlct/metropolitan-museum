import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';

export default function MainNav() {
    const [searchInput, setSearchField] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();
    const token = readToken();
    const userName = token ? token.userName : '';

    const logout = () => {
        setIsExpanded(false);
        removeToken();
        router.push('/login');
      };

    const submitSearch = async (e) => { 
        e.preventDefault();
        const queryString = `title=true&q=${searchInput}`;
        setSearchHistory(await addToHistory(queryString));
        router.push(`/artwork?${queryString}`);
        setIsExpanded(false);
    }

    function toggleNavbar() {
        setIsExpanded(!isExpanded);
    }

    function closeNavbar() {
        setIsExpanded(false);
    }

    return (
        <div>
          <Navbar expanded={isExpanded} className="fixed-top navbar-dark bg-dark" expand="lg">
            <Container fluid>
                <Navbar.Brand>Chung Ting Lau</Navbar.Brand>
                <Navbar.Toggle onClick={toggleNavbar} aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto">
                    <Link href="/" passHref legacyBehavior>
                        <Nav.Link onClick={closeNavbar}>Home</Nav.Link>
                    </Link>
                    {token && (
                        <Link href="/search" passHref legacyBehavior>
                        <Nav.Link onClick={closeNavbar}>Advanced Search</Nav.Link>
                        </Link>
                    )}
                    </Nav>
                <Form className="d-flex" onSubmit={submitSearch}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchInput}
                        onChange={e => setSearchField(e.target.value)}
                    />
                  <Button variant="success" type='submit'>Search</Button>
                </Form>
                {token ? (
                  <Nav>
                    <NavDropdown title={userName} id="basic-nav-dropdown">
                      <Link href="/favourites" passHref legacyBehavior>
                        <NavDropdown.Item
                          onClick={(e) =>
                            isExpanded ? setIsExpanded((value) => !value) : null
                          }
                          active={router.pathname === "/favourites"}
                        >
                          Favourites
                        </NavDropdown.Item>
                      </Link>
                      <Link href="/history" passHref legacyBehavior>
                        <NavDropdown.Item
                          onClick={(e) =>
                            isExpanded ? setIsExpanded((value) => !value) : null
                          }
                          active={router.pathname === "/history"}
                        >
                          Search History
                        </NavDropdown.Item>
                        </Link>
                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                ) : (
                  <Nav>
                    <Link href="/register" passHref legacyBehavior>
                        <Nav.Link
                        onClick={(e) =>
                        isExpanded ? setIsExpanded((value) => !value) : null
                        }
                        active={router.pathname === "/register"}
                        >
                            Register
                        </Nav.Link>
                    </Link>
                    <Link href="/login" passHref legacyBehavior>
                        <Nav.Link
                        onClick={(e) =>
                        isExpanded ? setIsExpanded((value) => !value) : null
                        }
                        active={router.pathname === "/login"}
                        >
                        Login
                        </Nav.Link>
                    </Link>
                  </Nav>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <br />
          <br />
        </div>
    );
}