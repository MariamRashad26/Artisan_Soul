import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Craftsmanship = () => {
  return (
    <section id="process" className="py-5 my-5">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="d-flex gap-4">
              <div 
                className="rounded-4 overflow-hidden shadow-sm" 
                style={{ width: '45%', marginTop: '4rem', height: '350px' }}
              >
                 {/* Placeholder for left image */}
                 <img 
                   src="/design_preview.png" 
                   alt="Hand Stitching" 
                   className="w-100 h-100 object-fit-cover"
                   style={{ objectPosition: '15% 35%' }}
                 />
              </div>
              <div 
                className="rounded-4 overflow-hidden shadow-sm" 
                style={{ width: '45%', height: '350px' }}
              >
                 {/* Placeholder for right image */}
                 <img 
                   src="/design_preview.png" 
                   alt="Leather Rolls" 
                   className="w-100 h-100 object-fit-cover"
                   style={{ objectPosition: '35% 35%' }}
                 />
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5">
            <h2 className="display-5 fw-bold font-serif mb-4 text-dark">The Art of Craft</h2>
            <p className="text-muted fs-5 mb-5 pe-lg-4" style={{ lineHeight: '1.7' }}>
              Every pair is a masterpiece of precision and passion, using only the finest full-grain leathers sourced from the oldest tanneries in Tuscany.
            </p>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-4 p-4 rounded-4 bg-background-light border border-primary-10 hover-elevate transition-all">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary-10 flex-shrink-0"
                  style={{ width: '56px', height: '56px', color: 'var(--bs-primary)' }}
                >
                  <span className="material-symbols-outlined fs-3">history_edu</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-2 h5">Hand-Stitching</h4>
                  <p className="text-muted mb-0">Traditional Goodyear welting ensures durability and easy resoling for decades of use.</p>
                </div>
              </div>

              <div className="d-flex gap-4 p-4 rounded-4 bg-background-light border border-primary-10 hover-elevate transition-all">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary-10 flex-shrink-0"
                  style={{ width: '56px', height: '56px', color: 'var(--bs-primary)' }}
                >
                  <span className="material-symbols-outlined fs-3">workspace_premium</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-2 h5">Premium Materials</h4>
                  <p className="text-muted mb-0">Only the top 5% of hides are selected for our footwear, ensuring a perfect patina over time.</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Craftsmanship;
