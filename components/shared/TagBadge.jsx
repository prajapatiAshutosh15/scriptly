"use client";
import Link from "next/link";
import { Tag } from "antd";

export default function TagBadge({ name, slug, color = "#6366f1", clickable = true }) {
  const tag = <Tag style={{ borderRadius: 12, cursor: clickable ? "pointer" : "default", margin: 0 }} color={color}>{name}</Tag>;
  if (clickable && slug) return <Link href={`/tags/${slug}`} style={{ textDecoration: "none" }}>{tag}</Link>;
  return tag;
}
