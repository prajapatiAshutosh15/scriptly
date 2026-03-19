"use client";
import Link from "next/link";
import { Avatar, Button, Typography, Space, Divider } from "antd";
import { EnvironmentOutlined, CalendarOutlined, UserAddOutlined } from "@ant-design/icons";
import ArticleCard from "@/components/articles/ArticleCard";
import { formatDate, formatNumber } from "@/lib/utils";

const { Title, Text, Paragraph } = Typography;

export default function ProfilePageContent({ author, userPosts }) {
  return (
    <div>
      {/* Profile Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "64px 24px",
        textAlign: "center",
      }}>
        <Avatar src={author.avatar} size={96} style={{ marginBottom: 16, border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {author.name[0]}
        </Avatar>
        <Title level={2} style={{ margin: 0 }}>{author.name}</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>@{author.username}</Text>
        <Paragraph type="secondary" style={{ maxWidth: 500, margin: "16px auto 0", fontSize: 15, lineHeight: 1.7 }}>
          {author.bio}
        </Paragraph>

        <Space size={32} style={{ marginTop: 24 }}>
          {[
            { value: userPosts.length, label: "Posts" },
            { value: formatNumber(author.followers), label: "Followers" },
            { value: formatNumber(author.following), label: "Following" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{stat.value}</div>
              <Text type="secondary" style={{ fontSize: 13 }}>{stat.label}</Text>
            </div>
          ))}
        </Space>

        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Button type="primary" shape="round" icon={<UserAddOutlined />} size="large">
            Follow
          </Button>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <EnvironmentOutlined /> {author.location}
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <CalendarOutlined /> Joined {formatDate(author.joinedDate)}
            </Text>
          </Space>
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Title level={4} style={{ marginBottom: 24 }}>Articles ({userPosts.length})</Title>
        {userPosts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {userPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <Text type="secondary" style={{ fontSize: 16 }}>No articles published yet.</Text>
          </div>
        )}
      </div>
    </div>
  );
}
