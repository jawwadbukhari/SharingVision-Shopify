#!/bin/bash

# This script adds blog posts to your Shopify store using curl
# You'll need to provide your Shopify API credentials

# Shopify store credentials - REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
SHOP="qxprq7-jc.myshopify.com"
API_KEY="YOUR_API_KEY"  # Replace with your API key
API_PASSWORD="YOUR_API_PASSWORD"  # Replace with your API password
BLOG_ID="news"  # Your blog handle is "news" based on your URL

# Function to add a blog post
add_blog_post() {
  title="$1"
  content_file="$2"
  author="Sharing Vision Team"
  
  # Read the HTML content from the file
  content=$(cat "$content_file")
  
  # Escape special characters in the content for JSON
  content=$(echo "$content" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
  
  # Create JSON payload
  json_data="{\"article\":{\"title\":\"$title\",\"author\":\"$author\",\"body_html\":\"$content\",\"published\":true}}"
  
  # Use curl to post to Shopify API
  curl -X POST \
    "https://$API_KEY:$API_PASSWORD@$SHOP/admin/api/2023-10/blogs/$BLOG_ID/articles.json" \
    -H "Content-Type: application/json" \
    -d "$json_data"
  
  echo "Added blog post: $title"
}

# Add the first 6 blog posts
add_blog_post "Understanding Digital Eye Strain: Causes, Symptoms, and Solutions" "blog_posts_html/01-digital-eye-strain.html"
add_blog_post "The Truth About Blue Light: Separating Fact from Fiction" "blog_posts_html/02-blue-light-truth.html"
add_blog_post "Choosing the Right Frames for Your Face Shape: A Comprehensive Guide" "blog_posts_html/03-frames-face-shape.html"
add_blog_post "Understanding Progressive Lenses: The Modern Solution for Presbyopia" "blog_posts_html/04-progressive-lenses.html"
add_blog_post "Protecting Your Eyes from UV Damage: What You Need to Know" "blog_posts_html/05-uv-protection.html"
add_blog_post "The Connection Between Diet and Eye Health: Eating for Better Vision" "blog_posts/06-diet-eye-health.md"
