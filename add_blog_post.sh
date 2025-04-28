#!/bin/bash

# This script adds a blog post to your Shopify store using curl
# You'll need to provide your Shopify API credentials

# Shopify store credentials
SHOP="qxprq7-jc.myshopify.com"
API_KEY="YOUR_API_KEY"  # Replace with your API key
API_PASSWORD="YOUR_API_PASSWORD"  # Replace with your API password
BLOG_ID="YOUR_BLOG_ID"  # Replace with your blog ID (e.g., "news")

# Function to add a blog post
add_blog_post() {
  title="$1"
  content="$2"
  author="Sharing Vision Team"
  
  # Create JSON payload
  json_data=$(cat <<EOF
{
  "article": {
    "title": "$title",
    "author": "$author",
    "body_html": "$content",
    "published": true
  }
}
EOF
)

  # Use curl to post to Shopify API
  curl -X POST \
    "https://$API_KEY:$API_PASSWORD@$SHOP/admin/api/2023-10/blogs/$BLOG_ID/articles.json" \
    -H "Content-Type: application/json" \
    -d "$json_data"
  
  echo "Added blog post: $title"
}

# Example usage:
# add_blog_post "Understanding Digital Eye Strain" "<p>Blog content here...</p>"
