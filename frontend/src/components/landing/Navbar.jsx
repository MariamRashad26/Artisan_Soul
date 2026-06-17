import React from 'react';
import { Navbar as BsNavbar, Nav, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <BsNavbar 
      sticky="top" 
      expand="lg" 
      className="border-bottom border-primary-10 bg-white/80 backdrop-blur-md py-3"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-primary fs-3">architecture</span>
          <span className="fw-bold fs-4 font-serif text-dark">Artisan Soul</span>
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-4 custom-nav-links">
            <Nav.Link href="#collections" className="text-secondary hover-text-primary px-0 fw-medium">Collections</Nav.Link>
            <Nav.Link href="#process" className="text-secondary hover-text-primary px-0 fw-medium">Process</Nav.Link>
            <Nav.Link as={Link} to="/custom-designer" className="text-secondary hover-text-primary px-0 fw-medium">Custom</Nav.Link>
            <Nav.Link href="#reviews" className="text-secondary hover-text-primary px-0 fw-medium">Reviews</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            <Form className="d-none d-lg-block">
              <InputGroup className="bg-primary-10 rounded-xl px-3 py-1 border-0">
                 <span className="material-symbols-outlined text-primary/60 fs-5 align-self-center">search</span>
                <Form.Control
                  type="search"
                  placeholder="Search models..."
                  className="bg-transparent border-0 shadow-none text-muted small"
                  aria-label="Search"
                />
              </InputGroup>
            </Form>
            
            <Link 
              to="/login"
              className="text-secondary hover-text-primary text-decoration-none fw-bold px-3 d-flex align-items-center"
            >
              Login
            </Link>
            <Button 
              as={Link} 
              to="/signup"
              className="bg-primary text-white px-4 py-2.5 rounded-xl fw-bold border-0 shadow-sm d-flex align-items-center gap-2 hover-elevate"
            >
               <span>Sign Up</span>
            </Button>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
