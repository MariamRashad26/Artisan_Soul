import React from 'react';
import { Container } from 'react-bootstrap';

const steps = [
  { num: '01', title: 'SELECTION' },
  { num: '02', title: 'CUTTING' },
  { num: '03', title: 'SKIVING' },
  { num: '04', title: 'STITCHING' },
  { num: '05', title: 'LASTING' },
  { num: '06', title: 'WELTING' },
  { num: '07', title: 'BOTTOMING' },
  { num: '08', title: 'FINISHING' },
  { num: '09', title: 'POLISH' },
];

const Process = () => {
  return (
    <section id="workshop-process" className="py-5" style={{ backgroundColor: '#fdfbf9' }}>
      <Container className="py-5 text-center">
        <h2 className="display-4 fw-black font-serif text-dark mb-4 lowercase">The.Workshop.Journey</h2>
        <p className="text-stone-400 fs-5 mb-5 mx-auto" style={{ maxWidth: '800px', lineHeight: '1.7' }}>
          From the initial selection of raw hides to the final artisanal polish.
        </p>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 mb-5 position-relative z-1 px-4">
          <div className="position-absolute top-50 start-0 w-100 bg-stone-100" style={{ height: '2px', zIndex: -1 }}></div>
          {steps.map((step, index) => (
            <div key={index} className="d-flex flex-column align-items-center gap-3 bg-white p-2 rounded-circle hover-elevate shadow-sm transition-all" style={{ width: '80px', height: '80px'}}>
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center fw-black fs-5 ${index === steps.length - 1 ? 'text-white' : 'text-primary'}`}
                style={{ 
                  width: '64px', 
                  height: '64px',
                  backgroundColor: index === steps.length - 1 ? '#bd580f' : 'white',
                  border: index === steps.length - 1 ? 'none' : '2px solid rgba(189, 88, 15, 0.1)'
                }}
              >
                {step.num}
              </div>
              <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-300 position-absolute" style={{ bottom: '-30px' }}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 position-relative rounded-[3rem] overflow-hidden shadow-premium mx-auto" style={{ maxWidth: '1000px', height: '540px' }}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8rEYt92CaTy6smIzLhUbvnqP433d-Ub4NUBabQbBhzLNEyXbhaEYf7OnPCZfG1xhBQcSfwbekbCsk0ge2kSJxSl44jz7Ss-2oR9jEx5V4w1pUATD4qeMIiSE6XfWV5UnroeJTJq2iN_PpsOD4y3aE_N15tAaJWjLe7hxzmj8END8R-6rUYSppn_ZQOkBvrhn3q5JSK_-nRQzvluzob1ltam3uKMkiLKhi6nzbujyTXfxxHaZ9oBT1gLkqu3DFM56xSpVwiwVEf08Q"
            alt="Workshop" 
            className="w-100 h-100 object-fit-cover"
            style={{ objectPosition: '50% 50%' }}
          />
          <div className="position-absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent d-flex flex-column justify-content-end p-12 text-start">
            <h3 className="display-6 text-white fw-black mb-3 font-serif lowercase italic">Heritage in every thread</h3>
            <p className="text-white/70 fs-5 mb-0" style={{ maxWidth: '500px' }}>
              Our master cordwainers spend over 40 hours on every single pair, ensuring perfection in every detail.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Process;
