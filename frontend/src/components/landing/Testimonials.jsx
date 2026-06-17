import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const testimonials = [
  {
    id: 1,
    content: "The best investment I've made in years. The bespoke fitting is like wearing a second skin. Truly unmatched quality.",
    author: "James Wilson",
    role: "Architect"
  },
  {
    id: 2,
    content: "I appreciate the transparency of their process. Knowing exactly how these boots were made adds so much value to them.",
    author: "Sarah Lindholm",
    role: "Designer"
  },
  {
    id: 3,
    content: "Classical aesthetics meet modern comfort. I wear my Artisans to everything from board meetings to weddings.",
    author: "Michael Kraus",
    role: "Executive"
  }
];

const Testimonials = () => {
  return (
    <section id="reviews" className="py-5 bg-background-light">
      <Container className="py-5 text-center">
        <h2 className="display-4 fw-bold font-serif text-dark mb-5 pb-4 font-italic">
          Kind Words from the Connoisseurs
        </h2>

        <Row className="g-4">
          {testimonials.map((testimonial) => (
            <Col lg={4} key={testimonial.id}>
              <Card className="border-0 shadow-sm h-100 rounded-4 hover-elevate p-4 bg-white text-start">
                <Card.Body className="d-flex flex-column gap-4 p-0">
                  <div className="d-flex gap-1 text-primary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined fs-5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  
                  <blockquote className="blockquote mb-auto border-0 p-0 fs-5 text-muted font-italic" style={{ lineHeight: '1.8' }}>
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="d-flex align-items-center gap-3 mt-4 pt-4 border-top border-light">
                    <div className="rounded-circle bg-light" style={{ width: '48px', height: '48px' }}></div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{testimonial.author}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;
