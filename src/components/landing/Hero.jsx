import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-background-light py-5 min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <Container className="position-relative z-1 pt-4">
        <Row className="align-items-center g-5">
          <Col lg={6} className="pe-lg-5">
            <div className="mb-4">
              <span className="text-primary fw-bold tracking-widest text-uppercase small d-block mb-3">
                MASTERFULLY CREATED
              </span>
              <h1 className="display-2 fw-black font-serif mb-4 text-dark" style={{ lineHeight: '1.05', fontWeight: 900 }}>
                Handcrafted Leather Shoes Made Just for You
              </h1>
              <p className="lead text-muted mb-5 pe-lg-4 fs-5" style={{ lineHeight: '1.6' }}>
                Experience the pinnacle of traditional cordwaining with our bespoke and ready-to-wear collections. Built to last a lifetime.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  as={Link}
                  to="/login"
                  className="bg-primary text-white px-5 py-4 rounded-xl fw-bold border-0 shadow-lg hover-elevate transition-all"
                  style={{ fontSize: '1rem' }}
                >
                  Log In to Continue
                </Button>
                <Button 
                  as={Link}
                  to="/signup"
                  className="bg-white text-dark px-5 py-4 rounded-xl fw-bold shadow-sm hover-elevate transition-all border-0"
                  style={{ fontSize: '1rem' }}
                >
                  Become a Member
                </Button>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="position-relative">
            <div className="position-relative animate-float">
              <div className="rounded-5 overflow-hidden shadow-2xl position-relative bg-dark" style={{ aspectRatio: '1/1' }}>
                 <img 
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpoPIbOuQ28VBrd7dAJ7HTxvaVOk3miGDbN6ZzF3EbBl2g0WJ7rRWjf2zJdWVAZkYvjcLKMF-PYPo6Q4pTkOKLCLqEFB44m2gKiGgl2HHD3H02C4X0cHApnHdiduhxygrGheruVXJG81cfacmsF9Rx6orb7YQEs3xlM-QHrjWkUlJ_WvdELumcgC8cZ2gsCa80Ct6JKRy9Ty-Nj4OyXeMGQaDf9QPXfcAKwU6hMHa3LIQFfsfqMqYfQofWpj9xgSzRfIDR2_m2kACz" 
                   alt="Handcrafted Leather Shoes" 
                   className="w-100 h-100 object-fit-cover"
                 />
                 <div className="position-absolute inset-0 bg-primary opacity-10 mix-blend-multiply"></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
