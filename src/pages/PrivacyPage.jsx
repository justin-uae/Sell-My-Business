import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

const EFFECTIVE_DATE = '1 June 2025';
const COMPANY = 'Lunar Marketing & Commercial Brokerage';
const BRAND = 'SellMyBusiness.ae';
const ADDRESS = 'M Floor, Khalidiya Towers A, Khalidiya, Abu Dhabi, UAE';
const EMAIL = import.meta.env.VITE_LEGAL_EMAIL;

const sections = [
  {
    title: '1. Who We Are',
    body: `${BRAND} is a brand of ${COMPANY}, registered in Abu Dhabi, UAE. We are the data controller responsible for your personal data collected through this website. You can reach our data contact at ${EMAIL} or by post at ${ADDRESS}.`,
  },
  {
    title: '2. What Data We Collect',
    body: [
      'We may collect the following categories of personal data:',
      '• Identity data — name, username, or similar identifier.',
      '• Contact data — email address, phone number, and postal address.',
      '• Business data — information about your business you provide when submitting a listing.',
      '• Technical data — IP address, browser type and version, time zone, operating system, and platform.',
      '• Usage data — information about how you use our website.',
      '• Marketing data — your preferences for receiving marketing from us.',
    ],
  },
  {
    title: '3. How We Collect Your Data',
    body: [
      'We collect data through:',
      '• Direct interactions — when you register an account, submit a listing, complete a contact form, or communicate with us.',
      '• Automated technologies — as you interact with our website, we may collect technical data via cookies, server logs, and similar technologies.',
      '• Third parties — we may receive data from analytics providers, advertising networks, and our technology partners.',
    ],
  },
  {
    title: '4. Why We Use Your Data',
    body: [
      'We use your personal data for the following purposes:',
      '• To register you as a user and manage your account.',
      '• To publish and manage your business listing.',
      '• To match your listing or buyer profile with relevant parties.',
      '• To communicate with you about your enquiries or submissions.',
      '• To send you service updates and, where you have opted in, marketing communications.',
      '• To improve our website and services through analytics.',
      '• To comply with legal obligations under UAE law.',
    ],
  },
  {
    title: '5. Legal Basis for Processing',
    body: `We process your personal data on the basis of: (a) performance of a contract — to fulfil the services you have requested; (b) legitimate interests — to operate and improve our business; (c) your consent — for marketing communications, which you may withdraw at any time; and (d) compliance with legal obligations.`,
  },
  {
    title: '6. Sharing Your Data',
    body: [
      'We may share your personal data with:',
      '• Prospective buyers or sellers — limited contact information shared only after an NDA has been signed.',
      '• Service providers — third parties who provide IT, marketing, analytics, and other services to us, bound by confidentiality obligations.',
      '• Professional advisors — lawyers, accountants, and auditors where necessary.',
      '• Regulatory authorities — where required by UAE law or a court order.',
      'We do not sell your personal data to third parties.',
    ],
  },
  {
    title: '7. Cookies',
    body: `Our website uses cookies and similar tracking technologies to enhance your experience and analyse traffic. You may control cookies through your browser settings; however, disabling cookies may affect certain features of the website. By continuing to use our website you consent to our use of cookies.`,
  },
  {
    title: '8. Data Retention',
    body: `We retain your personal data for as long as necessary to provide you with our services and to comply with our legal obligations. Account data is typically retained for the duration of your relationship with us and for up to five (5) years thereafter. Listing data may be retained for longer where required for business or legal purposes.`,
  },
  {
    title: '9. Data Security',
    body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or alteration. These measures include secure server infrastructure, encrypted data transmission (HTTPS), and access controls. No system is completely secure, and we cannot guarantee the absolute security of your data transmitted to our website.`,
  },
  {
    title: '10. Your Rights',
    body: [
      'Subject to applicable UAE law, you have the right to:',
      '• Access — request a copy of the personal data we hold about you.',
      '• Correction — request that inaccurate or incomplete data be corrected.',
      '• Erasure — request deletion of your personal data where there is no overriding legal reason for us to retain it.',
      '• Objection — object to processing where we rely on legitimate interests.',
      '• Withdrawal of consent — withdraw any previously given consent for marketing at any time.',
      'To exercise any of these rights, please contact us at ' + EMAIL + '.',
    ],
  },
  {
    title: '11. Children\'s Privacy',
    body: `Our website is not directed at children under the age of 18. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately.`,
  },
  {
    title: '12. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised effective date. We encourage you to review this page periodically. Where changes are material, we will notify registered users by email.`,
  },
  {
    title: '13. Contact & Complaints',
    body: `For questions about this Privacy Policy or our data practices, please contact:\n${COMPANY}\n${ADDRESS}\nEmail: ${EMAIL}\n\nIf you are not satisfied with our response, you have the right to lodge a complaint with the relevant data protection authority in the UAE.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-surface min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        <Section>
          <p className="text-label-sm text-on-surface-variant mb-3">Effective date: {EFFECTIVE_DATE}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Privacy Policy</h1>
          <p className="text-on-surface-variant text-body-md leading-relaxed mb-10">
            This Privacy Policy explains how {BRAND} collects, uses, and protects your personal data when you use our website or services. We are committed to handling your information responsibly and in compliance with applicable UAE data protection laws.
          </p>
        </Section>

        <div className="space-y-10">
          {sections.map((s) => (
            <Section key={s.title}>
              <h2 className="text-lg font-bold text-on-surface mb-2">{s.title}</h2>
              {Array.isArray(s.body)
                ? s.body.map((line, i) => (
                    <p key={i} className={`text-on-surface-variant text-body-md leading-relaxed ${i === 0 ? 'mb-1' : 'ml-2'}`}>{line}</p>
                  ))
                : s.body.split('\n').map((line, i) => (
                    <p key={i} className="text-on-surface-variant text-body-md leading-relaxed">{line}</p>
                  ))
              }
            </Section>
          ))}
        </div>

      </div>
    </div>
  );
}
