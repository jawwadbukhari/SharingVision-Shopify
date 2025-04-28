#!/bin/bash

# This script uploads blog posts to your Shopify store
# It requires the Shopify CLI to be installed and authenticated

# Set variables
STORE_URL="qxprq7-jc.myshopify.com"
BLOG_HANDLE="news"

# Function to create a blog post
create_blog_post() {
  title="$1"
  content="$2"
  author="Sharing Vision Team"
  
  # Create a temporary file with the blog post content
  temp_file=$(mktemp)
  echo "$content" > "$temp_file"
  
  # Use Shopify CLI to create the blog post
  echo "Creating blog post: $title"
  shopify article create --blog="$BLOG_HANDLE" --title="$title" --author="$author" --body-html="$temp_file"
  
  # Remove the temporary file
  rm "$temp_file"
}

# Create blog posts from the markdown files
echo "Uploading blog posts to $STORE_URL..."

# Blog 1: Digital Eye Strain
title="Understanding Digital Eye Strain: Causes, Symptoms, and Solutions"
content=$(cat blog_posts/01-digital-eye-strain.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 2: Blue Light
title="The Truth About Blue Light: Separating Fact from Fiction"
content=$(cat blog_posts/02-blue-light-truth.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 3: Choosing Frames
title="Choosing the Right Frames for Your Face Shape: A Comprehensive Guide"
content=$(cat blog_posts/03-frames-face-shape.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 4: Progressive Lenses
title="Understanding Progressive Lenses: The Modern Solution for Presbyopia"
content=$(cat blog_posts/04-progressive-lenses.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 5: UV Protection
title="Protecting Your Eyes from UV Damage: What You Need to Know"
content=$(cat blog_posts/05-uv-protection.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 6: Diet and Eye Health
title="The Connection Between Diet and Eye Health: Eating for Better Vision"
content=$(cat blog_posts/06-diet-eye-health.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 7: Dry Eye Syndrome
title="Understanding and Managing Dry Eye Syndrome: More Than Just Discomfort"
content=$(cat blog_posts/07-dry-eye-syndrome.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 8: Children's Eye Health
title="Children's Eye Health and Vision Development: A Parent's Guide"
content=$(cat blog_posts/08-childrens-eye-health.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 9: Color Blindness
title="Understanding Color Blindness: Types, Challenges, and Adaptations"
content=$(cat blog_posts/09-color-blindness.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

# Blog 10: Future of Eyewear
title="The Future of Eyewear Technology: Beyond Vision Correction"
content=$(cat blog_posts/10-future-eyewear-tech.md | sed 's/^# .*//')
create_blog_post "$title" "$content"

echo "All blog posts have been uploaded successfully!"
