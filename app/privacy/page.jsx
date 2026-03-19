"use client";
import { Typography, Divider, Anchor, Row, Col } from "antd";

const { Title, Text, Paragraph } = Typography;

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: `When you create an account, we collect your name, email address, and profile information. When you use our platform, we automatically collect usage data including pages visited, articles read, and interaction patterns. We use cookies and similar technologies to enhance your experience and analyze platform usage.`,
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: `We use your information to provide and improve our services, personalize your experience, send you relevant notifications, and communicate platform updates. We analyze aggregated usage data to understand trends and improve our platform. We never sell your personal data to third parties.`,
  },
  {
    id: "data-sharing",
    title: "3. Data Sharing",
    content: `We only share your information with third-party service providers who help us operate our platform (hosting, analytics, email). These providers are contractually bound to protect your data. We may disclose information if required by law or to protect our rights and safety.`,
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: `We implement industry-standard security measures including encryption in transit and at rest, regular security audits, and access controls. While no system is 100% secure, we take every reasonable step to protect your information from unauthorized access or disclosure.`,
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: `You have the right to access, correct, or delete your personal data at any time. You can export all your content and data from your account settings. You can opt out of marketing communications while still receiving essential service notifications.`,
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    content: `We use essential cookies for authentication and preferences, analytics cookies to understand usage patterns, and optional marketing cookies (only with your consent). You can manage your cookie preferences at any time through your browser settings or our cookie management tool.`,
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    content: `Scriptly is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information.`,
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: `We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.`,
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: `If you have questions about this privacy policy or our data practices, please contact us at privacy@scriptly.dev or write to: Scriptly Privacy Team, 123 Developer Ave, San Francisco, CA 94102.`,
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>Privacy Policy</Title>
        <Paragraph style={{ fontSize: 16, margin: "12px auto 0" }} type="secondary">
          Last updated: March 1, 2026
        </Paragraph>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          At Scriptly, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our platform.
        </Paragraph>

        <Row gutter={[48, 0]}>
          <Col xs={24} md={18}>
            {sections.map((section, i) => (
              <div key={section.id} id={section.id} style={{ marginBottom: 40 }}>
                <Title level={3}>{section.title}</Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>{section.content}</Paragraph>
                {i < sections.length - 1 && <Divider />}
              </div>
            ))}
          </Col>
          <Col xs={0} md={6}>
            <div style={{ position: "sticky", top: 80 }}>
              <Anchor
                items={sections.map((s) => ({ key: s.id, href: `#${s.id}`, title: s.title.replace(/^\d+\.\s/, "") }))}
                offsetTop={80}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
