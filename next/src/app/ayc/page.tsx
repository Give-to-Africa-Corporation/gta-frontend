import Link from 'next/link'
import styles from './page.module.css'

export default function AfricaYouthCouncil() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Africa Youth Council</h1>
        <p><strong>Powered by Give to Africa</strong></p>
      </header>

      <main className={styles.main}>
        <blockquote className={styles.blockquote}>
          "We are the generation we've been waiting for." - We are the Generation of Architects of Progress
        </blockquote>
        
        <section className={styles.section}>
          <h2>Overview</h2>
          <p>The Africa Youth Council is a bold initiative by Give to Africa to unite, equip, and elevate young African leaders from across all six African regions...</p>

          <h2>Program Goals</h2>
          <ul>
            <li>Identify and empower young changemakers (3 per region)</li>
            <li>Facilitate monthly regional dialogue and collaboration</li>
            <li>Support the creation of locally rooted, scalable solutions</li>
            <li>Present youth-led proposals to international donors</li>
            <li>Promote African-led innovation, civic participation, and leadership</li>
          </ul>

          <h2>Program Structure</h2>
          <p><strong>Duration:</strong> September 2025 – February 2026</p>
          <p><strong>Format:</strong> Monthly virtual meetings, cross-region collaborations</p>
          <p><strong>Delegates:</strong> 18 Youth Leaders (ages 20–30), representing all 53 countries in Africa</p>
          <p><strong>Final Event:</strong> February 2026 – Live Pitch Day to international donors</p>

          <h3>Monthly Focus Areas:</h3>
          <ul>
            <li>Month 1: National Briefings & Team Formation</li>
            <li>Month 2: Country Issue Mapping</li>
            <li>Month 3: Cross-Regional Dialogues</li>
            <li>Month 4: Solution Development & Peer Feedback</li>
            <li>Month 5: Final Presentation & Certification</li>
            <li>Month 6: Storytelling Showcase</li>
          </ul>

          <h2>Eligibility Criteria</h2>
          <ul>
            <li>Must be affiliated with an active nonprofit, NGO, civil society</li>
            <li>Between 20–30 years old</li>
            <li>Citizens or residents of across African region</li>
            <li>Actively involved in community work, nonprofits, youth organizing, or social innovation</li>
            <li>Available for six monthly virtual meetings (2–3 hours each)</li>
            <li>Able to collaborate with peers and communicate in English or French</li>
            <li>Committed to submitting a final group proposal</li>
          </ul>

          <h2>What You'll Gain</h2>
          <ul>
            <li>Certificate of Completion from Give to Africa</li>
            <li>Access to Give to Africa's Pan-African Leadership network</li>
            <li>Mentorship opportunities with nonprofit, tech, and advocacy leaders</li>
            <li>Digital skill-building in innovation, storytelling, and social change</li>
            <li>Priority access to future Give to Africa grants, fellowships, and scholarships</li>
          </ul>

          <h2>Key Dates</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Applications Open</td>
                <td>August 10, 2025</td>
                <td>Submit your application</td>
              </tr>
              <tr>
                <td>Applications Close</td>
                <td>September 30, 2025</td>
                <td>Final deadline for all regions</td>
              </tr>
              <tr>
                <td>Orientation</td>
                <td>October 10, 2025</td>
                <td>Meet your regional peers</td>
              </tr>
              <tr>
                <td>First Council Session</td>
                <td>October 24, 2025</td>
                <td>Kickoff via Zoom</td>
              </tr>
              <tr>
                <td>Final Pitch & Summit</td>
                <td>February 20, 2026</td>
                <td>Showcase Presentation</td>
              </tr>
            </tbody>
          </table>

          <h2>How to Apply</h2>
          <ol>
            <li>Complete the online application form</li>
            <li>Submit a 2-minute video introducing yourself and the solution you wish to address</li>
            <li>Optional: Submit 1 recommendation letter from a mentor, or your organization</li>
          </ol>

          <button className={styles.button}>Start Your Application</button>
          <p><strong>Deadline:</strong> September 30, 2025</p>

          <h2>For Donors, Partners & Sponsors</h2>
          <p>The Africa Youth Council is an opportunity to support youth-led development...</p>
          <p><strong>Contact us at:</strong> <a href="mailto:info@2africa.org">info@2africa.org</a></p>

          <h2>Join the Movement</h2>
          <p>If you're ready to co-create Africa's future...</p>
          <button className={styles.button}>Apply Now</button>

          <p><strong>Questions?</strong> Email: <a href="mailto:info@2africa.org">info@2africa.org</a></p>
          <p><strong>Learn more:</strong> <a href="https://www.2africa.org/youth-council">www.2africa.org/youth-council</a></p>

          <h3>Partners</h3>
          <ul className={styles.partners}>
            <li>Juxtopia</li>
            <li>LSE (London)</li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        &copy; 2025 Give to Africa | Africa Youth Council
      </footer>
    </div>
  )
}
