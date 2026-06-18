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
    title: '1. About Us',
    body: `${BRAND} is an operating brand of ${COMPANY}, a company registered in the Emirate of Abu Dhabi, UAE. We operate an online marketplace that connects sellers and buyers of businesses in the United Arab Emirates. References to "we", "us", or "our" in these Terms refer to ${COMPANY} trading as ${BRAND}.`,
  },
  {
    title: '2. Acceptance of Terms',
    body: `By accessing or using this website you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use this website. We reserve the right to update these Terms at any time. Continued use of the website after any change constitutes acceptance of the revised Terms.`,
  },
  {
    title: '3. Eligibility',
    body: `You must be at least 18 years of age and have the legal capacity to enter into binding contracts under UAE law to use this website. By using the website you represent and warrant that you meet these requirements.`,
  },
  {
    title: '4. Nature of the Service',
    body: `${BRAND} provides an introductory and marketing platform only. We are not a licensed financial advisor, investment advisor, legal advisor, or auditor. Nothing on this website constitutes financial, legal, tax, or investment advice. All listings are submitted by third-party sellers. We do not verify the accuracy, completeness, or legality of any listing content. Buyers are solely responsible for conducting their own due diligence before entering into any transaction.`,
  },
  {
    title: '5. Listings & Content',
    body: `Sellers are solely responsible for the accuracy and legality of the content they submit. By submitting a listing you represent that all information is truthful, non-misleading, and does not infringe any third-party rights. We reserve the right to reject, suspend, or remove any listing at our sole discretion without prior notice. We may edit listings for formatting or clarity without altering the material content.`,
  },
  {
    title: '6. Fees',
    body: `Standard listings on ${BRAND} are offered free of charge. Premium listing packages and managed sale services are subject to fees that will be communicated and agreed in writing before any charge is made. All fees are quoted in UAE Dirhams (AED) and are inclusive of applicable VAT unless otherwise stated.`,
  },
  {
    title: '7. Confidentiality',
    body: `We take commercially reasonable steps to protect the confidentiality of seller information. Sensitive information such as the business name, precise location, and seller identity is disclosed to prospective buyers only after they have agreed to a Non-Disclosure Agreement (NDA). We are not liable for unauthorised disclosure by buyers or third parties.`,
  },
  {
    title: '8. User Accounts',
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately at ${EMAIL} if you suspect any unauthorised use. We reserve the right to suspend or terminate accounts that breach these Terms.`,
  },
  {
    title: '9. Intellectual Property',
    body: `All content on this website — including logos, text, design, graphics, and software — is owned by or licensed to ${COMPANY} and is protected by applicable UAE and international intellectual property laws. You may not reproduce, distribute, or create derivative works from any part of this website without our prior written consent.`,
  },
  {
    title: '10. Third-Party Links',
    body: `This website may contain links to third-party websites. These links are provided for convenience only. We have no control over the content or privacy practices of third-party sites and accept no responsibility for them.`,
  },
  {
    title: '11. Limitation of Liability',
    body: `To the maximum extent permitted by UAE law, ${COMPANY} shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of or in connection with the use of this website or any transaction between a buyer and a seller. Our total aggregate liability in any circumstance shall not exceed the fees paid by you to us in the three (3) months preceding the claim.`,
  },
  {
    title: '12. Indemnity',
    body: `You agree to indemnify and hold harmless ${COMPANY}, its directors, employees, and agents from and against any claims, losses, damages, costs, and expenses (including reasonable legal fees) arising from your use of the website, your listing content, or your breach of these Terms.`,
  },
  {
    title: '13. Governing Law & Jurisdiction',
    body: `These Terms shall be governed by and construed in accordance with the laws of the Emirate of Abu Dhabi and, to the extent applicable, the federal laws of the United Arab Emirates. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Abu Dhabi.`,
  },
  {
    title: '14. Contact',
    body: `For any questions regarding these Terms, please contact us at:\n${COMPANY}\n${ADDRESS}\nEmail: ${EMAIL}`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-surface min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        <Section>
          <p className="text-label-sm text-on-surface-variant mb-3">Effective date: {EFFECTIVE_DATE}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Terms &amp; Conditions</h1>
          <p className="text-on-surface-variant text-body-md leading-relaxed mb-10">
            Please read these Terms and Conditions carefully before using {BRAND}. They set out the rules governing your access to and use of our website and services.
          </p>
        </Section>

        <div className="space-y-10">
          {sections.map((s) => (
            <Section key={s.title}>
              <h2 className="text-lg font-bold text-on-surface mb-2">{s.title}</h2>
              {s.body.split('\n').map((line, i) => (
                <p key={i} className="text-on-surface-variant text-body-md leading-relaxed">{line}</p>
              ))}
            </Section>
          ))}
        </div>

      </div>
    </div>
  );
}
