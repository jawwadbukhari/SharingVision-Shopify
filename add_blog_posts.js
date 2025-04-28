const fs = require('fs');
const path = require('path');
const axios = require('axios');
const marked = require('marked');

// Shopify store credentials
const SHOP = 'qxprq7-jc.myshopify.com';
const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const PASSWORD = 'YOUR_API_PASSWORD'; // Replace with your API password
const API_VERSION = '2023-10'; // Use the current API version

// Blog ID (you can find this in your Shopify admin)
const BLOG_ID = 'YOUR_BLOG_ID'; // Replace with your blog ID

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
  return marked.parse(markdown);
}

// Function to create a blog post
async function createBlogPost(title, content, author = 'Sharing Vision Team') {
  try {
    const html = markdownToHtml(content);
    
    const response = await axios({
      method: 'post',
      url: `https://${API_KEY}:${PASSWORD}@${SHOP}/admin/api/${API_VERSION}/blogs/${BLOG_ID}/articles.json`,
      data: {
        article: {
          title: title,
          author: author,
          body_html: html,
          published: true
        }
      }
    });
    
    console.log(`Successfully created blog post: ${title}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating blog post "${title}":`, error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to read markdown files and create blog posts
async function processMarkdownFiles() {
  const blogPostsDir = path.join(__dirname, 'blog_posts');
  const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(blogPostsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract title from the first line (assuming it starts with # )
    const lines = fileContent.split('\n');
    const title = lines[0].replace(/^#\s+/, '');
    
    // Remove the title from the content
    const content = lines.slice(1).join('\n').trim();
    
    console.log(`Processing: ${title}`);
    
    try {
      await createBlogPost(title, content);
    } catch (error) {
      console.error(`Failed to create blog post from ${file}`);
    }
  }
}

// Run the script
processMarkdownFiles().then(() => {
  console.log('All blog posts have been processed.');
}).catch(error => {
  console.error('An error occurred:', error);
});
