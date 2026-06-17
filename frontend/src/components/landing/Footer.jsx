import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-dark text-white pt-5 pb-4">
      <Container className="pt-4">
        <Row className="g-5 mb-5 pb-4 border-bottom border-secondary border-opacity-25">
          <Col lg={4} className="pe-lg-5">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-white mb-4">
              <span className="material-symbols-outlined text-primary fs-3">architecture</span>
              <span className="fw-bold fs-4 font-serif">Artisan Soul</span>
            </Link>
            <p className="text-white-50 fs-6" style={{ lineHeight: '1.8' }}>
              Preserving the heritage of traditional footwear through exceptional craftsmanship and ethical sourcing.
            </p>
          </Col>
          
          <Col lg={2} md={4}>
            <h5 className="fw-bold mb-4 text-white">Collections</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Oxfords</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Derbies</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Boots</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Loafers</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={4}>
            <h5 className="fw-bold mb-4 text-white">Company</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Our Story</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">The Atelier</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Sustainability</Link></li>
              <li><Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">Contact</Link></li>
            </ul>
          </Col>
          
          <Col lg={4} md={4}>
            <h5 className="fw-bold mb-4 text-white">Newsletter</h5>
            <p className="text-white-50 mb-4">Join our list for exclusive releases and care tips.</p>
            <Form className="d-flex">
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="Your email"
                  className="bg-dark bg-opacity-50 border-0 text-white shadow-none px-4 py-3"
                  style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
                />
                <Button 
                  variant="primary" 
                  className="border-0 px-4 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'var(--bs-primary)', borderRadius: '0 0.5rem 0.5rem 0' }}
                >
                  <span className="material-symbols-outlined fs-5">send</span>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-white-50 small mt-4">
          <p className="mb-2 mb-md-0">© 2024 ARTISAN SOUL. ALL RIGHTS RESERVED.</p>
          <div className="d-flex gap-4">
            <Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">PRIVACY POLICY</Link>
            <Link to="#" className="text-white-50 text-decoration-none hover-text-white transition-all">TERMS OF SERVICE</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
