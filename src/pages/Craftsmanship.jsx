import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Craftsmanship = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="d-flex vh-100 overflow-hidden bg-background-light font-display text-dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-end border-light-subtle border-primary/10 bg-white  d-none d-md-flex flex-column">
        <div className="p-4 d-flex flex-column h-100">
          <Link to="/" className="d-flex align-items-center gap-3 mb-5 hover:opacity-80 transition-opacity text-decoration-none">
            <div className="bg-primary h-10 w-10 rounded-3 d-flex align-items-center justify-content-center text-white">
              <span className="material-symbols-outlined">diamond</span>
            </div>
            <div>
              <h1 className="text-dark fw-bold fs-5 lh-sm mb-0">Artisan Soul</h1>
              <p className="text-primary fs-6 text-muted fw-medium text-uppercase tracking-wider mb-0">Maison Atelier</p>
            </div>
          </Link>
          
          <nav className="flex-grow-1 space-y-2">
            <Link to="/user/tracker" className="d-flex align-items-center gap-3 px-3 py-2 text-secondary hover:bg-light rounded-3 transition group text-decoration-none">
              <span className="material-symbols-outlined group-hover:text-primary transition">dashboard</span>
              <span className="fs-6 fw-medium">Dashboard</span>
            </Link>
            <Link to="/craftsmanship" className="d-flex align-items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-3 transition text-decoration-none">
              <span className="material-symbols-outlined">play_circle</span>
              <span className="fs-6 fw-medium">Live Craft</span>
            </Link>
            <Link to="/user/history" className="d-flex align-items-center gap-3 px-3 py-2 text-secondary hover:bg-light rounded-3 transition group text-decoration-none">
              <span className="material-symbols-outlined group-hover:text-primary transition">inventory_2</span>
              <span className="fs-6 fw-medium">My Orders</span>
            </Link>
          </nav>
          
          <div className="mt-auto p-3 bg-primary/5 rounded-4 border border-light-subtle border-primary/10">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-circle bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB60p50s7bvCHfRtDL8ZcaQz5iR0BFsXREMvrIxx8Zz6lgTwZy4rtFL1CkgvyIgjdHa3irDlIdfSKuxbpYaZwpK5-Kb015UTIUDZcy6tRhDIvU34dCsEXN_PlC7IZalMxed4aW3XwaGuNUd7GOgXVKTD7LL9Gim8qsZFPk9-c-qhu0_vNAoEtH3LnyEwMQX7NsgY8wjqL4av4WgY_VTs9hfrvv1AO-DzdD-d4MhmZkKT4ujrqcZi1zFy8jhzOgSCl9LNAPTM9bWJkdE')" }}></div>
              <div>
                <p className="fs-6 text-muted fw-bold text-dark ">Julian Voss</p>
                <p className="text-[10px] text-secondary text-uppercase">Platinum Tier</p>
              </div>
            </div>
            <Link to="/custom-designer" className="d-block text-center w-100 py-2 mt-3 bg-primary text-white fs-6 fw-bold rounded-3 hover:bg-primary/90 transition text-decoration-none">
              Request Bespoke
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-y-auto w-100">
        {/* Header */}
        <header className="sticky-top top-0 z-1 d-flex align-items-center justify-content-between px-4 py-3 bg-background-light/80  backdrop-blur-md border-bottom border-light-subtle border-primary/5">
          <div className="d-flex align-items-center gap-2 fs-6 text-secondary">
            <span>Orders</span>
            <span className="material-symbols-outlined fs-6 text-muted">chevron_right</span>
            <span className="text-primary fw-medium tracking-tight">#AS-8829 Development</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button onClick={() => alert("Notifications Opened")} className="p-1 text-secondary hover:text-primary transition border-0 bg-transparent">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button onClick={() => alert("Share Dial Opened")} className="p-1 text-secondary hover:text-primary transition border-0 bg-transparent">
              <span className="material-symbols-outlined">share</span>
            </button>
            <div className="h-6 w-px bg-primary/10 mx-2"></div>
            <div className="d-flex align-items-center gap-2 bg-white  px-2 py-1.5 rounded-circle border border-light-subtle border-primary/10 shadow-sm">
              <span className="h-2 w-2 bg-green-500 rounded-circle animate-pulse"></span>
              <span className="fs-6 text-muted fw-bold text-dark  text-uppercase tracking-widest">Atelier Live</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-3 p-md-4">
          {/* Cinematic Player Section */}
          <section className="space-y-6">
            <div className="position-relative group aspect-video rounded-4 overflow-hidden bg-black shadow-2xl ring-1 ring-primary/20">
              {!isPlaying ? (
                <>
                  <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAE6g5474XdeCIUe3nZ8zSAHWzp0aA1aKcNOfrEbC_aegk5UKXVZiNyVR2KvEmusKYSTtRyQ4g_4-8HI_sxYbBIiGqH97US868EIgcrSBNHCBrbkAZJWRdjEEO8sDfMTrAujF8f2mbNjwRq5RsxopuxdMOhHKoha_woHD6uaeX5lIHmV0IV1gO0kdjMzaBKd-MVuwgVZfvHPStk9Yt-F6VfAF2bq8IdNrJHFQxj3D61gl25nvo73O2ttRqWeexfVmVMnzRJh68DqiLZ')" }}></div>
                  <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                  
                  {/* Center Play Button */}
                  <button onClick={() => setIsPlaying(true)} className="position-absolute top-0 bottom-0 start-0 end-0 m-auto h-20 w-20 rounded-circle bg-primary/90 text-white d-flex align-items-center justify-content-center hover:scale-110 transition-transform backdrop-blur-sm group-hover:bg-primary shadow-xl border-0">
                    <span className="material-symbols-outlined fs-1">play_arrow</span>
                  </button>
                  
                  {/* Player Controls overlay */}
              <div className="position-absolute bottom-0 start-0 end-0 p-4 space-y-4">
                <div className="d-flex align-items-center justify-content-between text-white fs-6 text-muted fw-medium mb-1">
                  <span>12:46 / 45:10</span>
                  <span className="text-primary fw-bold">Chapter III: Saddle Stitching</span>
                </div>
                <div className="position-relative h-1.5 w-100 bg-white/20 rounded-circle overflow-hidden cursor-pointer group/progress">
                  <div className="position-absolute top-0 start-0 h-100 bg-primary w-[28%] rounded-circle position-relative">
                    <div className="position-absolute end-0 top-50 translate-middle-y h-3 w-3 bg-white rounded-circle shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-4">
                    <button className="text-white hover:text-primary transition"><span className="material-symbols-outlined">fast_rewind</span></button>
                    <button className="text-white hover:text-primary transition"><span className="material-symbols-outlined fs-2">play_circle</span></button>
                    <button className="text-white hover:text-primary transition"><span className="material-symbols-outlined">fast_forward</span></button>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button className="text-white hover:text-primary transition"><span className="material-symbols-outlined">fullscreen</span></button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <iframe 
              className="position-absolute top-0 bottom-0 start-0 end-0 w-100 h-100" 
              src="https://www.youtube.com/embed/Agh6K27qteM?autoplay=1" 
              title="Craftsman Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
            
            {/* Video Info & Actions */}
            <div className="d-flex flex-column flex-row justify-content-between align-items-start gap-4 bg-white  p-4 rounded-4 border border-light-subtle border-primary/5">
              <div className="space-y-2">
                <h2 className="fs-2 fw-bolder text-dark  tracking-tight">The Heritage Briefcase: Construction</h2>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2 text-secondary fs-6">
                    <span className="material-symbols-outlined text-primary fs-6">person</span>
                    <span>Master Artisan: Giovanni Rossi</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary fs-6 border-start border-light-subtle border-primary/10 pl-4">
                    <span className="material-symbols-outlined text-primary fs-6">location_on</span>
                    <span>Florence, Italy Atelier</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Grid */}
          <div className="row row-cols-1 row-cols-lg-3 gap-4 mt-4">
            {/* Timeline/Process */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="fs-6 fw-bold text-uppercase tracking-widest text-primary">Production Timeline</h3>
              <div className="space-y-0.5">
                <div className="group d-flex gap-3 p-3 rounded-4 bg-primary/5 border border-light-subtle border-primary/10">
                  <div className="d-flex flex-column align-items-center">
                    <div className="h-6 w-6 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined fs-6 text-muted">check</span>
                    </div>
                    <div className="w-px flex-grow-1 bg-primary/20 my-1"></div>
                  </div>
                  <div className="flex-grow-1 pb-4">
                    <p className="fs-6 fw-bold text-dark ">Leather Selection</p>
                    <p className="text-[11px] text-secondary">00:00 - 05:20 • Full Grain Cognac Calf</p>
                  </div>
                </div>
                <div className="group d-flex gap-3 p-3 rounded-4 bg-white  border-2 border-primary ring-4 ring-primary/5">
                  <div className="d-flex flex-column align-items-center">
                    <div className="h-6 w-6 rounded-circle bg-primary animate-pulse d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined fs-6 text-muted text-white">play_arrow</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 pb-4">
                    <p className="fs-6 fw-bold text-primary">Hand-Stitching</p>
                    <p className="text-[11px] text-secondary">Active Stage • 12:46 - 45:10</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisan Notes & Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white  p-4 rounded-4 border border-light-subtle border-primary/5 shadow-sm space-y-6">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 fw-bold text-dark ">Artisan's Daily Log</h3>
                  <span className="fs-6 text-muted fw-medium px-2 py-1 bg-primary/10 text-primary rounded-circle d-none d-sm-block">Updated Today, 10:45 AM</span>
                </div>
                <div className="prose prose-sm  max-w-none text-secondary  lh-lg italic">
                  "The grain on this specific hide is exceptionally dense, which provides a beautiful resistance during the stitching phase. I'm using a slightly thicker waxed thread today to ensure the stress points of the briefcase have that lifetime durability. The cognac color is developing a wonderful depth as we manipulate the leather."
                </div>
              </div>

              {/* Gallery / Micro-Moments */}
              <div className="space-y-4">
                <h3 className="fs-6 fw-bold text-uppercase tracking-widest text-primary">Process Captures</h3>
                <div className="row row-cols-3 gap-3">
                  <div onClick={() => alert("Viewing High-Res Image 1")} className="aspect-square rounded-3 overflow-hidden border border-light-subtle border-primary/10 shadow-sm hover:scale-105 transition-transform cursor-pointer position-relative group">
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoTI8gT5f2QjHJVMfIvpOX0P51zCXMeLS9Af31WT_rBIIE2h2oRKeX-VS2F8a9nnjDSRtxcGbEOSQP-IxNM1gQKhvAsr0qDdxeNPfincPSqYpLaeQhsLGreXgLASqaH6Jl1WXtuuhFjI3MAeOI04Vf2dV4eLnEp8p4RvdjDnWhlJYxgl2eEzvH4Dzu6rk_jIGvoAEgvLwZrwRStG39tkexEE1R0qX984AgUKP3FSA6iHpNZUOQ0qVA4ua8SjEZ_U5SM91y59Y8YNRN')" }}></div>
                  </div>
                  <div onClick={() => alert("Viewing High-Res Image 2")} className="aspect-square rounded-3 overflow-hidden border border-light-subtle border-primary/10 shadow-sm hover:scale-105 transition-transform cursor-pointer position-relative group">
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhnde9Se2K4a0ajwMdVFylv7cuw088Y6c9gCUJ-81S5-NpnIrfHTtagkivQDoKyOYLPbTDU-5daAWM1JZD-m3FggkCMq941JAQYwPbMm1fVn4OhE6_oB51GsK16kcpMDMBKswT-zwT7nxLbeLZmsdBjcQBciBA0814RwMZWBkAz9kzZbvfy6-t98sObaiA01wLIa2BaL5gIrWyefNOeDQhVZfR7-Pk7cO72tqeIZquvNeVWKVUR1J7bPai6zrJ0hXlc0gV4i97s8OP')" }}></div>
                  </div>
                  <div onClick={() => alert("Viewing High-Res Image 3")} className="aspect-square rounded-3 overflow-hidden border border-light-subtle border-primary/10 shadow-sm hover:scale-105 transition-transform cursor-pointer position-relative group">
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuADApWq48TNICOBpRAPtoNQOigIOAidOU1pmG1payF8WX9MnfZT7Cfmm_zryt2fxqxapu0OWPsQ19IG7zP6ouImtsTHsav38S_zf0uNELUg87XB6BKxRsu-Ruh-ANVmzTZnCT19SAm8hToe8oiKuHZ7ZKemfmYxE6YmVZ8Q4oYkUUvkpEbpcYWaYhxTvx6GMeWgqH86ZUuSQij_fl7uqEmQ16JP5DbEQVCAmYYQvTIzer1-0ihTpop-HGdLpBS_daWGbPrChzf2t7Ty')" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Craftsmanship;
