#!/bin/bash

# Create an output directory for HTML files
mkdir -p blog_posts_html

# Loop through each markdown file
for md_file in blog_posts/*.md; do
  # Get the filename without extension
  filename=$(basename "$md_file" .md)
  
  # Extract the title (first line starting with #)
  title=$(head -n 1 "$md_file" | sed 's/^# //')
  
  # Create an HTML file with the same name
  html_file="blog_posts_html/${filename}.html"
  
  # Write the HTML header
  echo "<!DOCTYPE html>" > "$html_file"
  echo "<html>" >> "$html_file"
  echo "<head>" >> "$html_file"
  echo "  <title>${title}</title>" >> "$html_file"
  echo "</head>" >> "$html_file"
  echo "<body>" >> "$html_file"
  
  # Convert markdown to HTML (basic conversion)
  # Skip the first line (title)
  tail -n +2 "$md_file" | sed -E 's/^## (.*)/\<h2\>\1\<\/h2\>/g' \
                         | sed -E 's/^### (.*)/\<h3\>\1\<\/h3\>/g' \
                         | sed -E 's/^\* (.*)/\<li\>\1\<\/li\>/g' \
                         | sed -E 's/^[0-9]+\. (.*)/\<li\>\1\<\/li\>/g' \
                         | sed -E 's/^\<li\>/\<ul\>\<li\>/g' \
                         | sed -E 's/\<\/li\>$/\<\/li\>\<\/ul\>/g' \
                         | sed -E 's/\*\*(.*)\*\*/\<strong\>\1\<\/strong\>/g' \
                         | sed -E 's/\*(.*)\*/\<em\>\1\<\/em\>/g' \
                         | sed -E 's/^$/\<p\>/g' >> "$html_file"
  
  # Write the HTML footer
  echo "</body>" >> "$html_file"
  echo "</html>" >> "$html_file"
  
  echo "Converted ${md_file} to ${html_file}"
done

echo "All files have been converted to HTML."
