// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { PERSONAL_INFO } from '../utils/constants';

const Portfolio = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }


  const experiences = [
    {
      company: 'Amazon Web Services',
      role: 'Software Dev Engineer II',
      dates: 'Jul 2024 - Present',
    },
    {
      company: 'Amazon Web Services',
      role: 'Software Dev Engineer',
      dates: 'Mar 2022 - Jul 2024',
    },
    {
      company: 'Active.ai',
      role: 'Data Scientist Intern',
      dates: 'Jan 2021 - Jul 2021',
    },
    {
      company: 'Northeastern University',
      role: 'Graduate Course Assistant',
      dates: 'Sep 2021 - Dec 2021',
    }
  ];

  const education = [
    {
      institution: 'Northeastern University',
      degree: 'Master of Science in Data Analytics Engineering',
      dates: 'Sep 2019 - Dec 2021'
    },
    {
      institution: 'University of Kerala',
      degree: 'Bachelor of Technology in Production Engineering',
      dates: 'Aug 2014 - May 2018'
    }
  ];

  return (
    <div className="portfolio-container">
      {/* Animated Background */}
      <div className="background">
        <div className="dots-layer main-dots"></div>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="theme-toggle-fixed"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Main Content Container */}
      <div className="content-box">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-name">{PERSONAL_INFO.name}</h1>
          </div>
        </section>

        <div className="hero-info">
          <p className="hero-role">{PERSONAL_INFO.role}</p>
          <p className="hero-company">{PERSONAL_INFO.company}</p>
          <div className="hero-social">
            <a href={PERSONAL_INFO.github} aria-label="GitHub" className="hero-social-link">
              <Github size={20} />
            </a>
            <a href={PERSONAL_INFO.linkedin} aria-label="LinkedIn" className="hero-social-link">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} aria-label="Email" className="hero-social-link">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Main Content */}
        <main className="main-content">
          {/* Experience Section */}
          <section className="section">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              {experiences.map((exp, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">{exp.role}</h3>
                      <span className="timeline-dates">{exp.dates}</span>
                    </div>
                    <h4 className="timeline-subtitle">{exp.company}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="section">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
              {education.map((edu, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">{edu.degree}</h3>
                      <span className="timeline-dates">{edu.dates}</span>
                    </div>
                    <h4 className="timeline-subtitle">{edu.institution}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Contact Section */}
          <section className="section contact-section">
              <h2 className="section-title">Let&apos;s Connect</h2>
              <p className="contact-description">
                I&apos;m always interested in new opportunities and interesting projects.
              </p>
              <div className="contact-buttons">
                <a href={`mailto:${PERSONAL_INFO.email}`} className="contact-button">
                  <Mail size={18} />
                  Get in Touch
                </a>
                <a href={PERSONAL_INFO.linkedin} className="contact-button secondary">
                  <Linkedin size={18} />
                  LinkedIn
                </a>
                <a href={PERSONAL_INFO.github} className="contact-button secondary">
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </section>
        </main>
      </div>



    </div>
  );
};

export default Portfolio;