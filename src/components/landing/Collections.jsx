import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const collectionsData = [
  {
    id: 1,
    name: 'The Classic Oxford',
    desc: 'Timeless elegance',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAor3v1l122gvXhjMHptOcRzb2ZwGC8I-a6fgaCucEvzXAp15dQrMHB7rObRw5jfASEexVOqSgQ7KTUrPO6mRJcRVWw0OEnL1RW2kq3AYfgi5wIqa-8d1WGCxi81Zl9BuiaVWCn1sZWKO70mT87e4VrQTzlGtmssAj-OgfhhZUSTZB5OgWQE_7nGXvH7nVbaX5gASa0yGpUZrA0tapYq6vhnPUvCdB4XybThvDjmo7Gl1xlu1DFMrZx58vxTS1NKHMkM7w8LoOpf9eL'
  },
  {
    id: 2,
    name: 'The Heritage Boot',
    desc: 'Rugged sophistication',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9uFSljacViCYL0GBjvNToSYhNZo9bWWWZkYFqEtZWnGPp6Uyq_ZJUlOdeJsOSExRUXlCtKn4N3VzZnC30uKu7l_Qcw6bebBUuQRM1raGVG_u7fwjNytc0IHwdWpugvtS1lHCzp3rrNF0ZZpKcZebFrFI8_IDmVOBmEP4nRmA0tYA9om_th7CM2FxYWEn8ueDVliiuffTSUq1StJ6J5E4_8CCH_GuDykMxcpYxIa6t5lBJVa2tHQJthfz24gwg0koLMGrSsWDepfy4'
  },
  {
    id: 3,
    name: 'The Urban Loafer',
    desc: 'Contemporary comfort',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWTiuweE10ZNe7rQhogaUBskaxv5EwMZ6DWw9jFF3o5jKY9rh-_K9me8XSfjSSrzDqcTFHWdj5EhNUs6QHLqlHAiKZI0QDqw8WwCLeruyOTqAuobt-IpiqtPiLH1jT-V1xOz6EnwpNPlov9PDlTU-ZQGx276Yoincm22M5uNzgC2cCPPHuADfjOe42dYPVlSB7lA9Q_mA_ED3ersYhVPcL1yw014dQAfT0LJkD4IUXHBjHLhCQHaTRQ_oE2OetruTOyAiTofWj8BTB'
  }
];

const Collections = () => {
  return (
    <section id="collections" className="py-5 bg-background-light">
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="display-4 fw-bold font-serif text-dark mb-2">Curated Collections</h2>
            <p className="text-muted fs-5 mb-0">The perfect fit for every occasion.</p>
          </div>
          <Link to="/login" className="text-primary fw-bold text-decoration-none d-flex align-items-center gap-2 hover-text-dark transition-all">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <Row className="g-5">
          {collectionsData.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <div className="group cursor-pointer">
                <Card className="border-0 bg-transparent h-100">
                  <div className="rounded-5 overflow-hidden mb-4 position-relative hover-elevate shadow-premium" style={{ height: '480px' }}>
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300 z-1" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                     <img 
                       src={item.img} 
                       alt={item.name} 
                       className="w-100 h-100 object-fit-cover transition-transform duration-700 group-hover-scale"
                       style={{ transform: 'scale(1)', transition: 'transform 0.7s ease-in-out' }}
                     />
                  </div>
                  <Card.Body className="p-0">
                    <h3 className="h3 fw-bold text-dark mb-2 group-hover-text-primary transition-colors">{item.name}</h3>
                    <p className="text-secondary fs-5 mb-0">{item.desc}</p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Collections;
