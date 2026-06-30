export function HomePage() {
  return (
    <section className="page">
      <h1>Enterprise IT Consulting Powered by Gen AI</h1>

      <p>
        We help organizations modernize applications, design scalable cloud
        platforms, implement DevOps practices, and adopt Gen AI responsibly.
      </p>

      <div className="cards">
        <div className="card">
          <h3>Cloud Architecture</h3>
          <p>
            Azure, AWS, GCP, Kubernetes, OpenShift, and hybrid cloud design.
          </p>
        </div>

        <div className="card">
          <h3>Application Modernization</h3>
          <p>
            React, Angular, .NET, microservices, APIs, and clean architecture.
          </p>
        </div>

        <div className="card">
          <h3>Gen AI Solutions</h3>
          <p>LLM apps, RAG, AI agents, prompt engineering, and governance.</p>
        </div>
      </div>
    </section>
  );
}
